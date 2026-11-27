import {mkdir,lstat,realpath,readdir,open,link,unlink} from 'node:fs/promises';
import {constants} from 'node:fs';
import {resolve,join,relative,isAbsolute,sep} from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {MAX_ASSET_BYTES,MAX_ASSET_DIMENSION,validateAssetRef,documentAssetImages} from './asset-reference.mjs';
function fail(message,status=400) { const error=Error(message);error.status=status;throw error; }
function dimensions(buffer,mime) {
    let width,height;
    const b=buffer;
    if(mime==='image/png') {
        if(b.length<45 || !b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) || b.readUInt32BE(8)!==13 || b.toString('ascii',12,16)!=='IHDR') fail('PNG 이미지 내용 오류');
        width=b.readUInt32BE(16);height=b.readUInt32BE(20);
        let offset=8,idat=false,end=false;
        while(offset+12<=b.length) {
            const length=b.readUInt32BE(offset),type=b.toString('ascii',offset+4,offset+8);
            if(offset+12+length>b.length) fail('PNG 이미지가 잘렸습니다.');
            if(type==='IDAT' && length>0) idat=true;
            offset+=12+length;
            if(type==='IEND') {if(length!==0 || offset!==b.length)fail('PNG 끝 형식 오류');end=true;break;}
        }
        if(!idat || !end)fail('PNG 이미지 데이터가 없습니다.');
    } else if(mime==='image/jpeg') {
        if(b.length<4 || b[0]!==255 || b[1]!==216 || b[b.length-2]!==255 || b[b.length-1]!==217)fail('JPEG 이미지 내용 오류');
        let offset=2,scan=false;
        while(offset+3<b.length) {
            if(b[offset++]!==255)fail('JPEG 마커 오류');
            while(b[offset]===255)offset++;
            const marker=b[offset++];
            if(marker===0xda) {scan=true;break;}
            if(marker===0xd9)break;
            if(marker===0x01 || marker>=0xd0 && marker<=0xd7)continue;
            if(offset+2>b.length)fail('JPEG 이미지가 잘렸습니다.');
            const length=b.readUInt16BE(offset);
            if(length<2 || offset+length>b.length)fail('JPEG 이미지가 잘렸습니다.');
            if([0xc0,0xc1,0xc2].includes(marker)) {if(length<8)fail('JPEG 크기 오류');height=b.readUInt16BE(offset+3);width=b.readUInt16BE(offset+5);}
            offset+=length;
        }
        if(!scan)fail('JPEG 이미지 데이터가 없습니다.');
    } else if(mime==='image/webp') {
        if(b.length<30 || b.toString('ascii',0,4)!=='RIFF' || b.toString('ascii',8,12)!=='WEBP' || b.readUInt32LE(4)+8!==b.length)fail('WebP 이미지 내용 오류');
        let offset=12,hasImage=false;
        const setSize=(w,h)=>{
            if(width!==undefined && (width!==w || height!==h))fail('WebP 캔버스와 프레임의 원본 크기가 다릅니다.');
            width=w;height=h;
        };
        while(offset+8<=b.length) {
            const type=b.toString('ascii',offset,offset+4),length=b.readUInt32LE(offset+4),start=offset+8;
            if(start+length>b.length)fail('WebP 이미지가 잘렸습니다.');
            if(type==='VP8X' && length>=10) setSize(b.readUIntLE(start+4,3)+1,b.readUIntLE(start+7,3)+1);
            if(type==='VP8 ' && length>=10) {
                if(!b.subarray(start+3,start+6).equals(Buffer.from([0x9d,1,0x2a])))fail('WebP 프레임 오류');
                setSize(b.readUInt16LE(start+6)&0x3fff,b.readUInt16LE(start+8)&0x3fff);hasImage=true;
            }
            if(type==='VP8L' && length>=5) {if(b[start]!==0x2f)fail('WebP 프레임 오류');const bits=b.readUInt32LE(start+1);setSize((bits&0x3fff)+1,((bits>>>14)&0x3fff)+1);hasImage=true;}
            offset=start+length+(length%2);
        }
        if(!hasImage || offset!==b.length)fail('지원하는 정적 WebP 이미지 데이터가 없습니다.');
    } else fail('PNG/JPEG/WebP 이미지만 저장할 수 있습니다.');
    if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width>MAX_ASSET_DIMENSION||height>MAX_ASSET_DIMENSION)fail('이미지 원본 크기는1~4096px입니다.');
    return {width,height};
}
export function inspectAsset(buffer,mime) {
    if(!Buffer.isBuffer(buffer)||!buffer.length||buffer.length>MAX_ASSET_BYTES)fail('이미지는300KB 이하입니다.',413);
    const size=dimensions(buffer,mime),extension={'image/png':'png','image/jpeg':'jpg','image/webp':'webp'}[mime];
    return {assetRef:'sha256-'+createHash('sha256').update(buffer).digest('hex')+'.'+extension,mime,bytes:buffer.length,...size};
}
export function createAssetStore(root,directory) {
    async function safeDirectory(create=false) {
        const base=await realpath(root),rel=relative(base,resolve(directory));
        if(!rel||rel.startsWith('..')||isAbsolute(rel))fail('이미지 자원 저장 경로를 벗어났습니다.');
        let path=base;
        for(const part of rel.split(sep)) {
            path=join(path,part);
            if(create)try{await mkdir(path);}catch(error){if(error.code!=='EEXIST')throw error;}
            const info=await lstat(path);
            if(info.isSymbolicLink()||!info.isDirectory())fail('심볼릭 링크 자원 폴더는 허용하지 않습니다.');
        }
        return path;
    }
    async function read(assetRef) {
        validateAssetRef(assetRef);
        let handle;
        try {
            const safe=await safeDirectory();
            handle=await open(join(safe,assetRef),constants.O_RDONLY|constants.O_NOFOLLOW);
            const stat=await handle.stat();
            if(!stat.isFile()||stat.size<1||stat.size>MAX_ASSET_BYTES)fail('이미지 자원 파일 형식·크기 오류');
            const bytes=Buffer.alloc(MAX_ASSET_BYTES+1);let size=0;
            while(size<bytes.length) {
                const chunk=await handle.read(bytes,size,bytes.length-size,size);
                if(!chunk.bytesRead)break;
                size+=chunk.bytesRead;
            }
            if(size>MAX_ASSET_BYTES)fail('이미지 자원 파일 크기 오류',413);
            const buffer=bytes.subarray(0,size);
            const mime={'png':'image/png','jpg':'image/jpeg','webp':'image/webp'}[assetRef.split('.').pop()];
            const asset=inspectAsset(buffer,mime);
            if(asset.assetRef!==assetRef)fail('이미지 자원 해시가 파일 내용과 다릅니다.');
            return {asset,buffer};
        } catch(error) {if(error.code==='ENOENT')fail('이미지 자원 파일이 없습니다: '+assetRef,404);throw error;}
        finally {await handle?.close();}
    }
    return {
        read,
        async list() {
            let safe;try{safe=await safeDirectory();}catch(error){if(error.code==='ENOENT')return [];throw error;}
            const assets=[];
            for(const name of (await readdir(safe)).sort()) {
                try{validateAssetRef(name);}catch{continue;}
                assets.push((await read(name)).asset);
            }
            return assets;
        },
        async put(buffer,mime) {
            const asset=inspectAsset(buffer,mime),safe=await safeDirectory(true),temp=join(safe,'.asset-'+randomUUID()+'.tmp');
            const handle=await open(temp,'wx',0o600);
            try {
                try{await handle.writeFile(buffer);await handle.sync();}finally{await handle.close();}
                try{await link(temp,join(safe,asset.assetRef));}catch(error){if(error.code!=='EEXIST')throw error;}
                return (await read(asset.assetRef)).asset;
            } finally {await unlink(temp).catch(()=>{});}
        },
        async validateDocument(document) {
            const cache=new Map();
            for(const image of documentAssetImages(document)) {
                let asset=cache.get(image.assetRef);
                if(!asset) {asset=(await read(image.assetRef)).asset;cache.set(image.assetRef,asset);}
                if ((image.w!==undefined || image.h!==undefined) && (image.w!==asset.width || image.h!==asset.height))fail('프레임 이미지 자원과 설계의 원본 크기가 다릅니다.');
                const size=image.sourceSize || [image.w,image.h];
                if(!Array.isArray(size)||size[0]!==asset.width||size[1]!==asset.height)fail('이미지 자원과 설계의 원본 크기가 다릅니다.');
            }
        }
    };
}
