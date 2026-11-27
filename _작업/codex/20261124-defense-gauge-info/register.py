from pathlib import Path
import json,re,shutil
root=Path.cwd()
stage=Path(__file__).parent
src=root/'src/tools/uxStudio'
ref=src/'guide/reference'
backup=root/'docs/planning/_backup/20261124_단이/디펜스게이지두상태'
def write(p,s):
    before=backup/p.relative_to(root)
    if not before.exists():
        before.parent.mkdir(parents=True,exist_ok=True)
        shutil.copy2(p,before)
    p.write_text(s)
def read(path,change):
    write(path,change(path.read_text()))
doc=json.loads((stage/'defense-saved.json').read_text())
ws='workspace-cfa517bd-d9e1-40c4-aa1f-576e182500ba'
normal,full='defense-gauge-help','defense-gauge-full'
entry='defense-warning'
p=src/'planning-documents.json'
j=json.loads(p.read_text())
h,d=(next(q for q in j['projects'] if q['workspaceId']==ws and q['projectId']==i) for i in ('import-6604270d','kpop-defense-ui'))
h['previewModules']['defense-full.rail0.1']={**h['previewModules']['simulator_module_bad_energy'],'projectId':'kpop-defense-ui','screenId':entry,'overlay':full,'carryClock':True,'rememberOrigin':True}
for screen in ('main','main-solo','lobby-rapport','lobby-gift'):
 h['previewModules'][screen+'.event6']={'projectId':'kpop-defense-ui','screenId':entry,'overlay':normal,'rememberOrigin':True}
d['previewOriginExits']={'entries':[entry],'elements':[normal+'.close',normal+'.done']}
d['previewModules'][full+'.close']={'projectId':'import-6604270d','screenId':'defense-full','carryClock':True}
d['previewOverlays'].update({normal:entry,full:entry})
d['previewCountdown'][full]=full+'.countdown'
d['canvasReview']['boards']=[s['id'] for s in doc['screens']]
for screen in (normal,full):d['screens'][screen]={'section':'gauge','elements':{}}
d['sections']=[s for s in d['sections'] if s['id']!='gauge']
d['sections'].insert(0,{'id':'gauge','title':'나쁜 기운 정보창','fields':[{'label':'미충전','value':'현재 게이지와 주사위·루머의 충전 규칙을 보여 줍니다.'},{'label':'만충','value':'100%, 자동 굴리기 멈춤, 5분 카운트, 방어 준비를 표시합니다.'}]})
for section in h['sections']:
 if section['id']=='bad-energy-defense':
    for field in section['fields']:
      if '05:00' in field['value']:field['value']='나쁜 기운 만충이면 05:00부터 카운트가 시작됩니다. 게이지를 누르면 디펜스의 만충 정보창이 열립니다. 방어 준비에서 습격 시설과 출격 편성을 확인합니다.'
write(p,json.dumps(j,ensure_ascii=False,indent=2)+'\n')
p=src/'preview.mjs'
s=p.read_text()
s=s.replace("if(target.screenId)url.searchParams.set('screen',target.screenId);\n                            if(target.overlay)url.searchParams.set('overlay',target.overlay);","if(target.screenId)url.searchParams.set('screen',target.screenId);")
s=s.replace("if(target.screenId)url.searchParams.set('screen',target.screenId);","if(target.screenId)url.searchParams.set('screen',target.screenId);\n                            if(target.overlay)url.searchParams.set('overlay',target.overlay);")
s=s.replace("                const screen = previewPage?.id || d.entryScreen;\n                updatePreviewClock(previewEntry.previewCountdown,screen);","                for (const screen of Object.keys(previewEntry.previewCountdown)) updatePreviewClock(previewEntry.previewCountdown,screen);")
write(p,s)
url='/ui-studio/preview.html?workspace='+ws+'&amp;project=kpop-defense-ui&amp;screen='+entry+'&amp;overlay='
body=f'<h2>나쁜 기운 정보창</h2><ul><li><a href="{url+normal}">미충전 정보창</a> · 게이지와 주사위·루머의 충전 규칙을 보여 줍니다.</li><li><a href="{url+full}">만충 정보창</a> · 100%, 자동 굴리기 멈춤, 남은 시간과 방어 준비 버튼을 표시합니다.</li></ul><p>HUD의 나쁜 기운을 누르면 현재 상태의 정보창이 열립니다. 만충 정보창 → 방어 준비 → 습격 시설과 출격 편성. 남은 시간은 열린 정보창과 편성 화면에서 이어집니다.</p>'
def spec(s):
    s=re.sub(r'(<h1>[^<]+</h1><p>)r\d+ · \d+보드',lambda m:m[1]+f'r{doc["revision"]} · {len(doc["screens"])}보드',s,count=1)
    s=s.replace('HUD 만충 → 05:00 → 시설과 출격 편성.','HUD 만충 → 05:00 → 만충 정보창 → 방어 준비 → 시설과 출격 편성.')
    s=re.sub(r'<section id="gauge">.*?</section>\s*','',s,count=1,flags=re.S)
    return s.replace('<section id="overview">','<section id="gauge">'+body+'</section>\n<section id="overview">',1)
read(ref/'kpop-defense/index.html',spec)
def paper(s):
    a=s.index('<section class="tab" id="defense">');b=s.index('</section>',a)
    part=re.sub(r'7018 r\d+',f'7018 r{doc["revision"]}',s[a:b],count=1)
    part=re.sub(r'<h2>나쁜 기운 정보창</h2>.*?</ul><p>.*?</p>','',part,count=1,flags=re.S)
    part=part.replace('<details><summary>1. 목적 · 범위</summary>',body+'<details><summary>1. 목적 · 범위</summary>',1)
    part=part.replace('게이지를 누르면 건설에 사용한 시설 이미지를 보여 주고','게이지를 누르면 만충 정보창이 열리고, 방어 준비를 누르면 건설에 사용한 시설 이미지를 보여 주고')
    return re.sub(r'(<th scope="row">디펜스</th><td>)r\d+ · \d+개',lambda m:m[1]+f'r{doc["revision"]} · {len(doc["screens"])}개',s[:a]+part+s[b:],count=1)
read(ref/'kpop-planning/snapshot/papers/P265.html.txt',paper)
