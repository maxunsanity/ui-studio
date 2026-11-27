# coding:utf-8
from pathlib import Path
from PIL import Image,ImageDraw
import json,hashlib,shutil
r=Path(__file__).resolve().parents[3];w=r/'_작업/codex/video01';a=r/'ui-studio/assets/authoring/v002';p=r/'ui-studio/assets/production/v002';a.mkdir(parents=True,exist_ok=True);p.mkdir(parents=True,exist_ok=True);assets=json.loads((w/'assets.json').read_text());masters={}
def put(role,im,master=None,method='derived only from freshly generated atlas, no captured game pixels'):
 if not master:master=a/(role+'.png');im.save(master)
 prod=im.copy();prod.thumbnail((900,1400) if role.startswith('field-') else (320,320),Image.Resampling.LANCZOS);f=p/(role+'.webp');prod.save(f,quality=88,method=6);b=f.read_bytes();assert len(b)<300000,(role,len(b));assets.append(dict(role=role,path=str(f),master=str(master),sha256=hashlib.sha256(b).hexdigest(),size=list(prod.size),bytes=len(b),method=method));return im
for batch in ['generated-batch1.json','generated-batch2.json']:
 for j in json.loads((w/batch).read_text()):
  im=Image.open(j['path']).convert('RGBA');dst=a/(j['role']+'.png');shutil.copy2(j['path'],dst);masters[j['role']]=im
  if j['role'].startswith('field-'):put(j['role'],im,dst,'fresh built-in imagegen still/edit; original and prompt preserved, aspect-preserving resize')

def grid(role,cols,rows,names):
 im=masters[role];W,H=im.size
 for i,n in enumerate(names):
  x=i%cols;y=i//cols;cell=im.crop((round(x*W/cols),round(y*H/rows),round((x+1)*W/cols),round((y+1)*H/rows)))
  # Keep atlas cell and generated alpha intact. No background removal.
  put(n,cell)
grid('avatars-atlas',3,3,['avatar-fox','avatar-redelf','avatar-blonde','avatar-purplecat','avatar-winter','avatar-silverelf','avatar-warrior','avatar-knight','avatar-bluegirl'])
grid('utility-atlas',4,4,['icon-coin','icon-token','icon-ruby','icon-energy','icon-castle','icon-bow','icon-chest','icon-fight','icon-replay','icon-potion','icon-gear','icon-upgrade','icon-auto','icon-speed','icon-noads','icon-crownbook'])
grid('resources-atlas',3,3,['resource-goldpile','resource-goldsack','resource-goldbarrel','resource-tokenchest','resource-tokenpile','resource-tokensack','resource-rubychest','resource-rubypile','resource-rubysack'])
grid('talents-atlas',4,3,['talent-gold','talent-experience','talent-orb','talent-cooldown','talent-bowdamage','talent-bowtime','talent-sword','talent-wall','talent-warrior','talent-defense','talent-heart','talent-tower'])
lookup={x['role']:x for x in assets}
def glyph(role,size):
 im=Image.open(lookup[role]['path']).convert('RGBA');im.thumbnail(size,Image.Resampling.LANCZOS);return im
# Native input remains fixed. Own front image contains fresh glyph and raised base;
# labels/numbers are separate native elements. Pressed image moves only front/glyph2px.
for name,icon,size,baseRole,iconSize in [('castle','icon-castle',(106,74),'button-cyan',(38,38)),('bow','icon-bow',(106,74),'button-cyan',(38,38)),('shop','icon-chest',(80,72),'nav-mint',(38,38)),('replay','icon-replay',(80,72),'nav-mint',(38,38)),('fight','icon-fight',(98,72),'nav-gold',(38,38))]:
 for state in ['normal','pressed']:
  im=Image.new('RGBA',size);bodyRole=baseRole+'-'+state if baseRole.startswith('button-') else baseRole;bg=Image.open(lookup[bodyRole]['path']).convert('RGBA');targetH=56 if name in ['castle','bow'] else 60;bg=bg.resize((size[0],targetH),Image.Resampling.LANCZOS);im.alpha_composite(bg,(0,size[1]-targetH));g=glyph(icon,iconSize);im.alpha_composite(g,((size[0]-g.width)//2,2+(2 if state=='pressed' else 0)));put('button-'+name+'-'+state,im,method='fresh geometry plus own generated icon; paired fixed canvas and glyph/front2px')
# Boost badge: artwork only; x2 will be native text.
im=Image.new('RGBA',(64,64));d=ImageDraw.Draw(im);d.regular_polygon((32,32,29),6,rotation=30,fill='#0577b6',outline='#46dfff',width=3);put('icon-boost',im,method='fresh geometry')
# Profile cloth ribbon remains separate from native title.
im=Image.new('RGBA',(280,64));d=ImageDraw.Draw(im);d.polygon([(4,12),(276,12),(276,62),(140,47),(4,62)],fill='#9c1932',outline='#4e3557');d.polygon([(9,9),(271,9),(271,56),(140,42),(9,56)],fill='#cb263d',outline='#e6ad22',width=4);put('profile-ribbon',im,method='fresh geometry')
# Sale sticker artwork has no baked percentage.
im=Image.new('RGBA',(28,34));d=ImageDraw.Draw(im);d.polygon([(3,2),(26,2),(26,33),(14,27),(3,33)],fill='#ec1a43',outline='#ff6b73');put('sale-tag',im,method='fresh geometry')
by={x['role']:x for x in assets};(w/'assets.json').write_text(json.dumps(list(by.values()),ensure_ascii=False,indent=2));print('roles',len(by),'max',max(x['bytes'] for x in by.values()))
