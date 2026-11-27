from pathlib import Path
from PIL import Image,ImageDraw
import json,hashlib,shutil
s=Path('/Users/max/projest_max/ui-studio/samples/capybara-go');w=s/'_작업/codex/adventure02';a=s/'ui-studio/assets/authoring/adventure/v002';p=s/'ui-studio/assets/production/adventure/v002';a.mkdir(parents=True,exist_ok=True);p.mkdir(parents=True,exist_ok=True)
g=Path('/Users/max/.codex/generated_images/01a1e71f-f14c-7b22-aaee-d41c9a6520e2');sources={'myth-machine':'exec-807d51f7-dcc7-4b09-9866-5acc799ba45f.png','skill-hero':'exec-38f6e713-f912-4990-82c9-fc25c480b29a.png','skill-ice-sword':'exec-7ee692c0-bad7-4899-96ab-b9345be4c916.png','adventure-big-icon':'exec-df78aa40-b889-49f4-9702-2091944c00c2.png','adventure-medium-icon':'exec-424917b7-63d3-4ea9-a6aa-e5dbca7cc4d3.png','skill-heart':'exec-f5cf714d-28dc-4f41-976c-f07afa16278a.png','skill-strike':'exec-2035ca93-1043-4992-af15-a29ab8597858.png'};assets=[]
sources.update({'myth-angel':'exec-1ad616af-442d-4743-a243-bcd4d694f7c6.png','myth-demon':'exec-91f57704-1cb7-43df-873c-e20cec55fdd7.png','myth-dot':'exec-f5d29175-641b-4ac6-97cd-a57c6a7c1241.png','ribbon':'exec-f5956821-c342-4b70-ad5c-d08d3564c229.png'})
sources.update({'instant-wheel-panel':'exec-435f2996-0731-451d-8538-613db13ec812.png','adventure-scene':'exec-b0c89aeb-b35d-4cef-88cf-437d24f9ff23.png','skill-strike':'exec-0240471a-5af0-4a60-bd62-57fe3e989d24.png'})
def export(role,im,source,method):
 im=im.convert('RGBA');bb=im.getchannel('A').point(lambda x:255 if x>=32 else 0).getbbox();assert bb,role;bb=(max(0,bb[0]-2),max(0,bb[1]-2),min(im.width,bb[2]+2),min(im.height,bb[3]+2));im=im.crop(bb);im.putalpha(im.getchannel('A').point(lambda x:0 if x<3 else x));im.thumbnail((1008,1200) if role in ['myth-machine','instant-wheel-panel','adventure-scene'] else ((1024,300) if role=='ribbon' else (512,512)),Image.Resampling.LANCZOS);f=p/(role+'_v002.webp');quality=94
 while True:
  im.save(f,'WEBP',quality=quality,method=6)
  if f.stat().st_size<=300000:break
  quality-=4;assert quality>=78
 assets.append({'role':role,'path':str(f),'authoring':str(a/(role+'_v002.png')),'source':str(source),'size':list(im.size),'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'bytes':f.stat().st_size,'method':method,'newPixels':True})
for role,file in sources.items():
 src=g/file;shutil.copy2(src,a/(role+'_v002.png'));export(role,Image.open(src),src,'built-in imagegen full redraw from visual reference; alpha trim and downsample only')
# Fresh high-resolution code-native base plate, no pictogram or source screenshot pixels.
im=Image.new('RGBA',(352,256));d=ImageDraw.Draw(im);d.rounded_rectangle((3,3,348,252),radius=105,fill='#171620',outline='#0b0a10',width=12);d.rounded_rectangle((12,12,339,235),radius=93,fill='#4f4d65',outline='#92899f',width=7);d.arc((21,20,329,224),180,345,fill='#bbb4ca',width=6);d.arc((21,20,329,237),3,173,fill='#292738',width=9);im.save(a/'bonus-button-base_v002.png');export('bonus-button-base',im,a/'bonus-button-base_v002.png','new supersampled geometric base plate, no pictogram/label baked')
(w/'assets-v002.json').write_text(json.dumps({'version':'v002','status':'art rework; native application pending','assets':assets},ensure_ascii=False,indent=2));print([(x['role'],x['bytes']) for x in assets])
