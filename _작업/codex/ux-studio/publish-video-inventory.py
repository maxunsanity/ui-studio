from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,hashlib,shutil,datetime
root=Path('/Users/max/projest_max/ui-studio');b=root/'docs/reference/monopoly-go/video-analysis-20261117';pub=root/'src/tools/uxStudio/guide/reference/monopoly-go-video-20261117';pub.mkdir(parents=True,exist_ok=True)
j=json.loads((b/'ui-inventory.json').read_text());html=(b/'index.html').read_text();mapping={}
for s in j['existingDesign']['screens']:
 for field in ['capture','reference']:
  old=s[field];new='existing/'+s['id'].lower()+'-'+field+Path(old).suffix;mapping[old]=new;s[field]=new
reportOld='../../../collaboration/reports/20261117_1210_monopoly_video_inventory.md';mapping[reportOld]='REPORT.md'
class P(HTMLParser):
 def __init__(self):super().__init__();self.urls=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='a' and a.get('href'):self.urls.append(a['href'])
  if tag=='img' and a.get('src'):self.urls.append(a['src'])
p=P();p.feed(html);copied={}
for u in set(p.urls):
 x=urlsplit(u)
 if x.scheme or u.startswith(('#','/')):continue
 src=(b/unquote(x.path)).resolve();dst=pub/mapping.get(u,unquote(x.path));assert dst.resolve().is_relative_to(pub.resolve()),u
 assert src.is_file(),src;dst.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(src,dst);copied[str(dst.relative_to(pub))]={'canonical':str(src),'sha256':hashlib.sha256(src.read_bytes()).hexdigest()}
for old,new in mapping.items():html=html.replace('"'+old+'"','"'+new+'"')
html=html.replace('UI STUDIO / MONOPOLY GO / VIDEO REFERENCE','UI STUDIO / MONOPOLY GO / VIDEO REFERENCE · 내장 가이드 공개본')
(pub/'index.html').write_text(html);(pub/'ui-inventory.json').write_text(json.dumps(j,ensure_ascii=False,indent=2))
manifest={'generatedAt':datetime.datetime.now().astimezone().isoformat(),'canonical':str(b),'publicURL':'/ui-studio/source/guide/reference/monopoly-go-video-20261117/index.html','purpose':'serve authored document and reference images from existing tool public guide directory; no Vite allow-list or server changes','sourceVideoCopied':False,'files':copied}

for key,item in copied.items():
 item['canonicalSHA256']=item.pop('sha256')
 item['publicSHA256']=hashlib.sha256((pub/key).read_bytes()).hexdigest()
copied['index.html']={'canonical':str(b/'index.html'),'canonicalSHA256':hashlib.sha256((b/'index.html').read_bytes()).hexdigest(),'publicSHA256':hashlib.sha256((pub/'index.html').read_bytes()).hexdigest(),'rewrite':'local public image/report paths'}
(pub/'public-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2));print('public guide bundle',len(copied),'files',sum((pub/k).stat().st_size for k in copied),'bytes')
