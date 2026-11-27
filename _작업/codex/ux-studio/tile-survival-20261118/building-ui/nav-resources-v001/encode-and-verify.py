from pathlib import Path
from PIL import Image,ImageDraw
import csv,hashlib,shutil,xml.etree.ElementTree as ET
root=Path.cwd()
author=root/"samples/tile-survival/ui-studio/assets/authoring/nav-icons-v001"
stage=root/"src/tools/uxStudio/assets/import-staging/tile-survival-nav-v001"
work=root/"_작업/codex/ux-studio/tile-survival-20261118/building-ui/nav-resources-v001"
names=["nav-hero-white","quest-scroll","nav-explore-map","nav-supplies"]
refs=["_작업/codex/ux-studio/tile-survival-20261118/video-b/references/TSV03-01.jpg","_작업/codex/ux-studio/tile-survival-20261118/video-a2/representatives/TSV02_0425.0s_sample.jpg"]
rows=[]
sheet=Image.new("RGB",(4*192,180),"#6e98ad")
d=ImageDraw.Draw(sheet)
for index,name in enumerate(names):
    tree=ET.parse(author/(name+".svg"))
    assert tree.getroot().attrib["viewBox"]=="0 0 128 128"
    assert all(n.tag.rsplit("}",1)[-1] not in {"text","image","filter","foreignObject"} for n in tree.iter())
    im=Image.open(author/(name+".png"))
    assert im.size==(128,128) and im.mode=="RGBA"
    a=im.getchannel("A");bbox=a.getbbox()
    assert a.getextrema()==(0,255)
    assert 16<=bbox[0] and 16<=bbox[1] and bbox[2]<=112 and bbox[3]<=112,(name,bbox)
    assert all(a.getpixel((x,y))==0 for x in range(128) for y in [0,127])
    assert all(a.getpixel((x,y))==0 for y in range(128) for x in [0,127])
    im.save(author/(name+".webp"),"WEBP",lossless=True,quality=100,method=6,exact=True)
    back=Image.open(author/(name+".webp"))
    assert back.mode=="RGBA" and back.tobytes()==im.tobytes()
    sheet.paste(im,(index*192+32,8),im);d.text((index*192+8,152),name,fill="#ffffff")
    for ext in ["svg","png","webp"]:
        p=author/(name+"."+ext);dst=stage/p.name
        shutil.copyfile(p,dst)
        data=p.read_bytes()
        assert data==dst.read_bytes() and len(data)<=300000
        rows.append(dict(name=name,format=ext,width=128,height=128,mode="RGBA" if ext!="svg" else "SVG",alpha_min=0,alpha_max=255,outer_border="transparent",tight_bbox_xyxy=",".join(map(str,bbox)),bytes=len(data),sha256=hashlib.sha256(data).hexdigest(),authoring=str(p.relative_to(root)),staging=str(dst.relative_to(root)),runtime_url="/ui-studio/source/assets/import-staging/tile-survival-nav-v001/"+p.name,authoring_staging_match="true",source_method="new hand-authored SVG geometry",reference=";".join(refs),screenshot_pixels_reused=0,native_assembly=0))
sheet.save(work/"qa-contact-sheet.png")
with (work/"manifest.csv").open("w",newline="") as f:
    w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
lines=["# nav·퀘스트 기하 아이콘 v001","","- 작성: codex(단이), 제안(검수 대기)","- 실제 열람 원본: "+", ".join(refs),"- SVG 직접 작성 → 기존 macOS AppKit PNG → 기존 Pillow lossless WebP. 새 설치 0.","- 원본 영상 픽셀 재사용 0, 문자·숫자·배지 내장 0, 외부 drop-shadow 0, native 조립 0.","- nav 3종 + 별도 좌하단 퀘스트 두루마리 1종입니다. 영웅/외출 외 하단 이름은 확정하지 않았습니다.","- 128×128 RGBA PNG/WebP, alpha0..255, 외곽 투명, bbox16..112 범위 안, lossless WebP decoded RGBA 픽셀 일치.","- 4종 × SVG/PNG/WebP = 12파일. authoring/staging 바이트·SHA256 일치. 각 파일 ≤300,000bytes.","","| 이름 | tight bbox | WebP bytes |","|---|---|---|"]
for name in names:
    r=next(r for r in rows if r["name"]==name and r["format"]=="webp")
    lines.append(f'|{name}|{r["tight_bbox_xyxy"]}|{r["bytes"]}|')
lines+=["","미수행: 브라우저·서버·실제 UI 조립·클릭 검수. 기존파일/공통JS/설계JSON/공용보고STATUS 수정0."]
(work/"manifest.md").write_text("\n".join(lines)+"\n")
print("PASS: nav4 / mirrored12files / RGBA+alpha+border+bbox+lossless+sha+size / native assembly0")
for r in rows:
    if r["format"]=="webp":print(r["name"],r["tight_bbox_xyxy"],r["bytes"],r["sha256"])
