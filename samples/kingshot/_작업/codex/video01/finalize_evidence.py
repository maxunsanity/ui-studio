from pathlib import Path
from PIL import Image,ImageDraw
import json,shutil
r=Path(__file__).resolve().parents[3];stage=Path('/Users/max/Documents/Codex/2026-11-17/2');ev=r/'docs/evidence/20261118-kingshot';ev.mkdir(parents=True,exist_ok=True)
a=json.loads((stage/'ks-screen-audit.json').read_text())
for q in a:
 p=Path(q['file']);im=Image.open(p);b=q['rect'];x,y,w,h=[b[k] for k in ['x','y','width','height']];im.crop((round(x),round(y),round(x+w),round(y+h))).save(ev/(q['screen']+'.jpg'),quality=95);shutil.copy2(p,ev/('context-'+q['screen']+'.jpg'))
for b in range(3):
 im=Image.new('RGB',(1500,700),'#263043');d=ImageDraw.Draw(im)
 for i,q in enumerate(a[b*5:b*5+5]):
  n=q['screen'];s=Image.open(ev/(n+'.jpg'));s.thumbnail((290,650));im.paste(s,(i*300,30));d.text((i*300+3,8),n,fill='white')
 im.save(ev/f'contact-{b+1}.jpg')
for src,dst in [('ks-screen-audit.json','screen-audit.json'),('ks-control-audit.json','control-audit.json'),('ks-responsive-audit.json','responsive-audit.json'),('ks-browser-edges.json','browser-edges.json')]:shutil.copy2(stage/src,ev/dst)
for p in stage.glob('ks-*-Page_KS_*.jpg'):
 if p.name.startswith(('ks-1440-','ks-430-')):shutil.copy2(p,ev/p.name)
exports=r/'ui-studio/exports/20261118-r129';exports.mkdir(exist_ok=True)
for n in ['ux-8d104ce4.json','ux-8d104ce4-UI기획.md','ux-8d104ce4-UI연결명세.json']:shutil.copy2(Path('/Users/max/Downloads')/n,exports/n)
d=json.loads((r/'ui-studio/designs/ux-8d104ce4.json').read_text());assert d==json.loads((exports/'ux-8d104ce4.json').read_text())
p=r/'docs/ui/ui-inventory.json';inv=json.loads(p.read_text());
for s in inv['screens']:
 n=next(n for n in d['screens'] if n['name'].endswith('_'+s['name']));s.update(status='native v1 조립/단독 화면 검수 · 제안(검수 대기)',nativeId=n['id'],nativeParts=len(n['elements']),evidence='../../docs/evidence/20261118-kingshot/'+n['name']+'.jpg')
inv.update(nativeRevision=d['revision'],actualBrowserEdges=13,localRuntimeEdges=20,unverifiedBrowserEdges=7);p.write_text(json.dumps(inv,ensure_ascii=False,indent=2))
print('evidence/export/inventory r'+str(d['revision']))
