from pathlib import Path
import json, math, subprocess, re
from PIL import Image
b=Path('/Users/max/projest_max/ui-studio/docs/reference/monopoly-go/video-analysis-20261117')
ff='/Applications/BlueStacks.app/Contents/MacOS/ffmpeg'
for vid in ['MGV06','MGV07','MGV08']:
 d=b/vid;m=json.loads((d/'meta.json').read_text());out=d/'captures/validated';out.mkdir(exist_ok=True)
 rows=[]
 for f in sorted((d/'captures').glob('*-full.png')):
  match=re.search(r'-(\d+\.\d+)s-full\.png$',f.name)
  if match:rows.append({'label':f.name[:match.start()], 'requested':float(match.group(1)), 'legacyFull':str(f.relative_to(d))})
 rows.sort(key=lambda x:x['requested'])
 ns=[math.ceil(x['requested']*m['fps']-0.00001) for x in rows]
 expr='+'.join('eq(n,%d)'%n for n in ns)
 cmd=[ff,'-hide_banner','-i',m['source'],'-vf',f'select={expr.replace(chr(44),chr(92)+chr(44))},showinfo','-fps_mode','passthrough','-frames:v',str(len(rows)),'-c:v','png',str(out/'frame_%03d.png')]
 p=subprocess.run(cmd,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)
 (out/'decoder.log').write_text(p.stderr)
 actual=[float(x) for x in re.findall(r'Parsed_showinfo_.*?n:\s*\d+.*?pts_time:([\d.]+)',p.stderr)]
 files=sorted(out.glob('frame_*.png'))
 assert p.returncode==0 and len(actual)>=len(rows) and len(files)==len(rows),(vid,p.returncode,len(actual),len(rows),len(files),p.stderr[-500:])
 roi={'MGV06':(650,28,592,1052),'MGV07':(738,0,444,1080),'MGV08':(655,0,610,1080)}[vid]
 for i,(r,f) in enumerate(zip(rows,files)):
  r.update(actual=actual[i],file=str(f.relative_to(d)),width=1920,height=1080,format='PNG direct source decode; selected input PTS recorded by ffmpeg showinfo')
  im=Image.open(f);assert im.size==(1920,1080)
  g=out/(f.stem+'-game.png');x,y,w,h=roi;im.crop((x,y,x+w,y+h)).save(g)
  r['gameCrop']={'file':str(g.relative_to(d)),'sourcePNG':r['file'],'rect':roi,'width':w,'height':h,'method':'unscaled original PNG reference crop; not production art'}
 (out/'manifest.json').write_text(json.dumps({'videoId':vid,'command':cmd,'decoder':ff,'timeBasis':'requested sampling time vs actual decoded source PTS; old fps=2 review labels are schedule only','frames':rows},ensure_ascii=False,indent=2))
 print(vid,len(rows),'actual PTS',actual[:len(rows)])
