from pathlib import Path
exec(compile(Path('work/capybara-guide/talent_assets.py').read_text(), 'talent_assets.py','exec'))
def opaque_backdrop(d,im):
 pix=im.load()
 for y in range(894):
  for x in range(504):
   glow=max(0,1-(((x-252)/300)**2+((y-250)/255)**2)**.5)
   if y<470:
    beam=10 if y<337 and abs(x-252)<(130+(y-40)*.4) else 0
    c=(int(84+51*glow+beam),int(48+26*glow+beam/2),int(143+56*glow+beam),255)
   else:c=(63,41,105,255) if y<598 or y>=734 else (43,28,75,255)
   pix[x,y]=c
 d.ellipse((75,340,434,402),fill=(65,36,112,255));d.ellipse((150,355,369,387),fill=(52,28,96,255))
geo('backdrop-opaque',(504,894),opaque_backdrop)
manifest.write_text(json.dumps({'assets':assets},ensure_ascii=False,indent=2)+'\n');print('opaque backdrop prepared; old master preserved')
