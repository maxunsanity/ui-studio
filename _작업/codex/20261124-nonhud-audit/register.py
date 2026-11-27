from pathlib import Path
import json,re,shutil
r=Path.cwd(); stage=Path(__file__).parent; b=r/'docs/planning/_backup/20261124_단이/HUD제외_UI전수검수'
src=r/'src/tools/uxStudio';ref=src/'guide/reference'
doc=json.loads((stage/'defense-saved.json').read_text())
ws='workspace-cfa517bd-d9e1-40c4-aa1f-576e182500ba'
ids=['defense-enemy-models','defense-enemy-boss-fx']
names=['악귀 12종 3D 모델 보드','용형 보스와 3D 효과 보드']
def edit(p,fn):
 backup=b/p.relative_to(r);backup.parent.mkdir(parents=True,exist_ok=True)
 if not backup.exists():shutil.copy2(p,backup)
 p.write_text(fn(p.read_text()))
def registry(t):
 j=json.loads(t);d=next(p for p in j['projects'] if p['projectId']==doc['projectId'] and p['workspaceId']==ws)
 d['canvasReview']['boards']=[s['id'] for s in doc['screens']]
 d['sections'].append({'id':'enemy-resources','title':'악귀 3D 리소스','fields':[{'label':'제작 기준','value':'컬러 GLB 대표 이미지를 사용합니다. 모델·효과의 동작과 원본 파일은 작업 명세에서 확인합니다.'}]})
 for s in (s for s in doc['screens'] if s['id'] in ids):
  d['screens'][s['id']]={'section':'enemy-resources','elements':{e['id']:'enemy-resources' for e in s['elements'] if e['kind']=='image'}}
 return json.dumps(j,ensure_ascii=False,indent=2)+'\n'
edit(src/'planning-documents.json',registry)
link='/ui-studio/source/sample-preview.html?workspace='+ws+'&amp;project='+doc['projectId']+'&amp;view=detailed-wireframe&amp;screen='
links='<p>세부 와이어프레임에서 여는 링크 '+ ' · '.join(f'<a href="{link+i}">{n}</a>' for i,n in zip(ids,names))+'</p>'
def spec(s):
 s=re.sub(r'(<h1>[^<]+</h1><p>)r\d+ · \d+보드',lambda m:m[1]+f'r{doc["revision"]} · {len(doc["screens"])}보드',s,count=1)
 return s.replace('<h2>악귀 3D 리소스 부품표</h2>','<h2>악귀 3D 리소스 부품표</h2>'+links,1)
edit(ref/'kpop-defense/index.html',spec)
def paper(s):
 a=s.index('<section class="tab" id="defense">'); b=s.index('</section>',a)
 t=re.sub(r'7018 r\d+',f'7018 r{doc["revision"]}',s[a:b],count=1)
 t=t.replace('<summary>6. 리소스 · 데이터</summary><div>','<summary>6. 리소스 · 데이터</summary><div>'+links,1)
 return re.sub(r'(<th scope="row">디펜스</th><td>)r\d+ · \d+개',lambda m:m[1]+f'r{doc["revision"]} · {len(doc["screens"])}개',s[:a]+t+s[b:],count=1)
edit(ref/'kpop-planning/snapshot/papers/P265.html.txt',paper)
def guide(s):
 mark='- **3D 장면을 대표 이미지로 구현하기.**'
 i=s.index('\n',s.index(mark))
 rule='\n- **3D 리소스는 컬러를 유지합니다.** 3D 전장·맵·건물·캐릭터·오브젝트·효과의 대표 이미지와 부품 보드 썸네일은 원본의 색을 유지합니다. 세부 와이어프레임의 2D UI가 흑백이어도 3D 이미지에 일괄 회색 필터를 적용하지 않습니다.'
 return s[:i]+rule+s[i:]
edit(src/'guide/KPOP_WORKFLOW_GUIDE.md',guide)
