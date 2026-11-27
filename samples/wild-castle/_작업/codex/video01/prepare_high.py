# coding:utf-8
from PIL import Image
from pathlib import Path
import hashlib,json,shutil
root=Path('/Users/max/projest_max/ui-studio/samples/wild-castle');work=root/'_작업/codex/video01';out=root/'ui-studio/assets/production/v003';master=root/'ui-studio/assets/authoring/v003';out.mkdir(parents=True,exist_ok=True);master.mkdir(parents=True,exist_ok=True)
a=json.loads((work/'assets.json').read_text());old={x['role']:x for x in a}
def save(role,im,original,method):
 im.save(out/(role+'.webp'),'WEBP',quality=88,method=6)
 p=out/(role+'.webp'); b=p.read_bytes();assert len(b)<=300000
 a.append(dict(role=role,path=str(p),master=str(original),sha256=hashlib.sha256(b).hexdigest(),size=list(im.size),bytes=len(b),method=method))
source=Path('/Users/max/.codex/generated_images/01a1e71f-f14c-7b22-aaee-d41c9a6520e2')
field=master/'field-highlevel-original.png';shutil.copy2(source/'exec-62b91881-36ad-4c26-8904-996d8182ab12.png',field)
im=Image.open(field);im.thumbnail((900,1400));save('field-highlevel',im,field,'Fresh generated still; aspect preserving resize')
atlas=master/'highlevel-icons-original.png';shutil.copy2(source/'exec-a185cd85-9145-4733-8b9e-a82922e014fa.png',atlas);im=Image.open(atlas).convert('RGBA');w,h=im.size
for i,role in enumerate(['icon-gift','icon-trophy','icon-sword-menu','icon-clipboard','icon-mail','icon-helmet','icon-scrollbag','icon-village','icon-potion-high']):
 box=(round(i%3*w/3),round(i//3*h/3),round((i%3+1)*w/3),round((i//3+1)*h/3));cell=im.crop(box);cell.save(master/(role+'.png'));cell.thumbnail((320,320));save(role,cell,master/(role+'.png'),'Mechanical cell separation of freshly generated atlas, alpha preserved')
house=Image.open(out/'icon-village.webp').convert('RGBA');house.thumbnail((40,40));base=Image.open(old['nav-mint']['path']).convert('RGBA')
for state in ['normal','pressed']:
 tile=Image.new('RGBA',(80,72));tile.alpha_composite(base,(0,12));tile.alpha_composite(house,((80-house.width)//2,2 if state=='pressed' else 0));mp=master/('button-village-'+state+'.png');tile.save(mp);save('button-village-'+state,tile,mp,'Own fresh house glyph and own generated geometry; fixed canvas, glyph moves 2px')
(work/'assets.json').write_text(json.dumps(a,ensure_ascii=False,indent=2));print('roles',len(a),'max',max(x['bytes'] for x in a));shutil.copy2('/var/folders/dn/m763zzn15514kpgp2jhdyft40000gn/T/codex-clipboard-6673ff0b-c72e-4ee3-927c-96a77bdfb6d5.png',root/'reference/WC07_UserHighLevel_20261119.png')
