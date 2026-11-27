from pathlib import Path
import json, re, shutil
stage=Path(__file__).parent
root=Path.cwd()
src=root/'src/tools/uxStudio'
backup=root/'docs/planning/_backup/20261124_단이/디펜스보관함과스킬오버레이'
backup.mkdir(parents=True,exist_ok=True)
def write(path, content):
    before=backup/path.relative_to(root)
    if not before.exists():
        before.parent.mkdir(parents=True,exist_ok=True)
        shutil.copy2(path,before)
    path.write_text(content)
def update(path, op):
    write(path,op(path.read_text()))
doc=json.loads((stage/'defense-saved.json').read_text())
r=doc['revision']; ref=src/'guide/reference'
p=src/'planning-documents.json'
j=json.loads(p.read_text()); entry=next(e for e in j['projects'] if e['projectId']==doc['projectId'] and e['workspaceId']=='workspace-cfa517bd-d9e1-40c4-aa1f-576e182500ba')
entry.pop('previewControlImages',None)
entry['previewOverlays']={'defense-skills':'defense-battle','defense-success':'defense-battle','defense-failed':'defense-battle','defense-ignore':'defense-warning'}
entry['previewTimedOverlay']={'page':'defense-battle','id':'defense-skills','delayMs':8000}
entry['previewFormation']=json.loads((stage/'selection.json').read_text())
entry['canvasReview']['boards']=[s['id'] for s in doc['screens']]
entry['screens']['defense-skills']={'section':'battle','elements':{}}
entry['screens']['defense-warning']['elements']={'defense-warning.capacity':'overview'}
for s in entry['sections']:
    if s['id']=='overview':s['fields'][0]['value']='건물 한 채와 5분 카운트 아래 몬스 보관함 3열을 보여 줍니다. 개별 기분 게이지를 확인하고 체크하면 하단 한 줄에 최대 5마리까지 반영됩니다.'
    if s['id']=='battle':s['fields'][0]['value']='전투가 화면 전체를 채웁니다. 상단은 시설 내구도·웨이브·남은 시간, 하단은 출격 인원과 피니시. 스킬 3지선다는 같은 전장 위 하단 모달 오버레이입니다. 전투 하단의 공통 스킬은 학습·재사용 상태에 따라 표시합니다. 성공·실패 결과도 전장 위에 겹쳐 표시하고, 보상은 스케줄 결과와 같은 아이콘 타일을 사용합니다.'
write(p,json.dumps(j,ensure_ascii=False,indent=2)+'\n')
ws=entry['workspaceId']
base='/ui-studio/preview.html?workspace='+ws+'&amp;project=kpop-defense-ui&amp;screen='
inv='습격 시설 한 곳과 남은 시간을 확인합니다. 기존 몬스 보관함과 같은 단계순 3열 카드에서 체크하면 하단 출격 칸에 반영됩니다. 최대 5마리까지 선택할 수 있습니다. 카드 하단에 몬스별 기분 게이지를 표시합니다. 보관함 시안의 수치를 연결하고 미연동 값은 대시로 표시합니다.'
battle='전장이 화면 전체를 채웁니다. 상단은 시설 내구도·웨이브·시간, 하단은 출격 몬스·처치·보상 정보와 공통 스킬 버튼입니다. 미습득이나 재사용 대기 중에는 시뮬레이터 상태를 따릅니다. 스킬 후보 3장은 전장 하단에 자동으로 겹쳐 뜹니다. 성공·실패 결과도 전장이 보이는 상태에서 모달 오버레이로 표시합니다. 7018 미리보기는 전투 진입 8초 뒤 스킬 오버레이를 확인할 수 있습니다.'
shotdir='../kpop-planning/snapshot/assets/'
shots={
    'overview': [('defense-r9-inventory','몬스 보관함 체크와 한 줄 출격 편성')],
    'battle': [('defense-r9-battle','전체 전투 화면'),('defense-r9-overlay','전투 위 스킬 선택 모달 오버레이')],
}
def shows(section, directory):
    return '<div class="shots">'+''.join(f'<figure><img src="{directory}{name}.png" width="250" loading="lazy" alt="{alt}"><figcaption>{alt}</figcaption></figure>' for name,alt in shots[section])+'</div>'
def links(s):
    pattern=r'/ui-studio/source/sample-preview\.html\?workspace=[^"&]+&amp;project=kpop-defense-ui&amp;screen=(defense-success|defense-failed|defense-ignore)&amp;view=detailed-wireframe'
    return re.sub(pattern,lambda m:base+entry['previewOverlays'][m[1]]+'&amp;overlay='+m[1],s)
reward='획득한 보상은 스케줄 결과와 같은 아이콘·이름·수량 타일로 표시합니다. 성공은 처치 보상과 지킴 덤이 포함된 돈을, 패배는 처치로 얻은 돈을 보여 줍니다. 보상이 없는 상태는 빈 보상 타일을 표시합니다. 수량은 검수용 예시입니다.'
def spec(s):
    s=re.sub(r'(<h1>[^<]*</h1><p>)r\d+',lambda m:m[1]+f'r{r}',s,count=1)
    s=s.replace(' · 6보드',' · 7보드')
    s=s.replace('defense-r3-setup.png','defense-r9-inventory.png')
    s=re.sub(r'<section id="overview">.*?</section>',f'<section id="overview"><h2>습격 시설과 몬스 체크 편성</h2><p>HUD 만충 → 05:00 → 시설과 출격 편성.</p><p>{inv}</p><p><a href="{base}defense-warning">편성 미리보기</a></p>{shows("overview",shotdir)}</section>',s,count=1,flags=re.S)
    s=re.sub(r'<section id="battle">.*?</section>',f'<section id="battle"><h2>전체 전투 화면 · 스킬 오버레이</h2><p>{battle}</p><p><a href="{base}defense-battle">전투 미리보기</a>에 들어가면 8초 뒤 스킬 후보가 떠요. <a href="{base}defense-battle&amp;overlay=defense-skills">스킬 오버레이 바로 보기</a></p>{shows("battle",shotdir)}</section>',s,count=1,flags=re.S)
    s=s.replace('defense-r6-success.png','defense-r9-success.png').replace('defense-r6-failed.png','defense-r9-failed.png')
    s=re.sub(r'defense-r[35678]-(success|failed)\.png',r'defense-r9-\1.png',s)
    if reward not in s:s=s.replace('<h2>몬스와 시설 결과 연출</h2>','<h2>몬스와 시설 결과 연출</h2><p>'+reward+'</p>',1)
    return links(s).replace('대표 화면 · 시설 내구도 하나','전체 전장 · 스킬은 하단 오버레이')
update(ref/'kpop-defense/index.html',spec)
snap=ref/'kpop-planning/snapshot'; imgdir='산출_기획서_20261120_UI기획_그림/'
def paper(s):
    a=s.index('<section class="tab" id="defense">'); b=s.index('</section>',a)+len('</section>')
    section=re.sub(r'7018 r\d+',f'7018 r{r}',s[a:b]).replace('defense-r3-setup.png','defense-r9-inventory.png').replace('defense-r4-inventory.png','defense-r9-inventory.png').replace('defense-r4-battle.png','defense-r9-battle.png').replace('defense-r4-overlay.png','defense-r9-overlay.png').replace('중앙 모달','하단 모달')
    if inv not in section: section=section.replace('</div></details><details><summary>3. 화면 깊이',f'<p>{inv}</p></div></details><details><summary>3. 화면 깊이',1)
    section=section.replace('시설 확인과 편성은 같은 전체 화면입니다. 닫으면 HUD 카운트로 돌아갑니다.', '편성과 전투는 각각 전체 화면입니다. 편성을 닫으면 HUD 카운트로 돌아갑니다. 스킬 선택과 성공·실패 결과는 전장 위 모달 오버레이입니다.')
    if 'defense-r9-overlay.png' not in section: section=section.replace('</tbody></table>',f'</tbody></table><p>{battle}</p>{shows("battle",imgdir)}',1)
    if '몬스 보관함 카드 체크 편성과 전체 전장 위 스킬 오버레이 반영.' not in section: section=section.replace('최신 지시 반영.</p>','최신 지시 반영.</p><p>몬스 보관함 카드 체크 편성과 전체 전장 위 스킬 오버레이 반영.</p>',1)
    section=re.sub(r'<p>전장이 화면 전체를 채웁니다\..*?</p><div class="shots">.*?</div>',lambda m:'<p>'+battle+'</p>'+shows('battle',imgdir),section,count=1,flags=re.S)
    section=re.sub(r'defense-r[345678]-(inventory|battle|overlay)\.png',r'defense-r9-\1.png',section)
    section=re.sub(r'defense-r[678]-(success|failed)\.png',r'defense-r9-\1.png',section)
    if reward not in section: section=section.replace('<details><summary>5. 규칙 · 예외</summary><div>','<details><summary>5. 규칙 · 예외</summary><div><p>'+reward+'</p>',1)
    section=links(section)
    s=s[:a]+section+s[b:]
    return re.sub(r'(<th scope="row">디펜스</th><td>)r\d+ · \d+개',lambda m:m[1]+f'r{r} · {len(doc["screens"])}개',s,count=1)
update(snap/'papers/P265.html.txt',paper)
catalog=snap/'catalog.json'
j=json.loads(catalog.read_text()); item=next(e for e in j['documents'] if e['id']=='P265')
for entries in [*shots.values(),[('defense-r9-success',''),('defense-r9-failed','')]]:
    for name,_ in entries:j['assets'][item['path'].rsplit('/',1)[0]+'/'+imgdir+name+'.png']='assets/'+name+'.png'
write(catalog,json.dumps(j,ensure_ascii=False,indent=2)+'\n')
