from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
import json
root=Path(__file__).parent
src=ImageOps.grayscale(Image.open(root/'original-village.png')).convert('RGB')
bounds={
 'production':(.028,.29,.330,.558),'hq':(.339,.009,.664,.285),'academy':(.675,.052,.973,.302),
 'vocal':(.055,.060,.317,.309),'dance':(.322,.273,.677,.559),'rap':(.686,.296,.982,.55),
 'fanshop':(.051,.551,.353,.831),'broadcast':(.352,.535,.659,.863),'visual':(.674,.554,.972,.844)
}
def save(im,k):
 im.save(root/'art'/f'{k}.jpg',quality=88,optimize=True)
def shot(k,w,h,factor=1):
 a,b,c,d=bounds[k];cx=(a+c)*.5;cy=(b+d)*.5
 width=(c-a)*factor;height=width*src.width/src.height*h/w
 l=max(0,min(1-width,cx-width*.5))
 top=max(0,min(1-height,cy-height*.5))
 return src.resize((w,h),Image.Resampling.LANCZOS,box=(l*src.width,top*src.height,(l+width)*src.width,(top+height)*src.height))
save(src.resize((864,648),Image.Resampling.LANCZOS),'village')
for k in bounds:
 l,t,r,b=bounds[k]
 crop=src.crop((round(l*src.width),round(t*src.height),round(r*src.width),round(b*src.height)))
 save(ImageOps.fit(crop,(226,286),Image.Resampling.LANCZOS,centering=(.5,.49)),'card-'+k)
 save(shot(k,730,540,1.36),'focus-'+k)
# 0단계의 주인공은 도로 위 빈 부지 표시이며 9시설 원화 중 해당 좌표에서 시작한다.
preview=shot('visual',730,540,1.36)
shade=Image.new('RGB',preview.size,'#d9d9d9')
save(Image.blend(preview,shade,.51),'focus-empty')
(root/'assets-sizes.json').write_text(json.dumps({p.name:list(Image.open(p).size) for p in (root/'art').glob('*.jpg')}))
