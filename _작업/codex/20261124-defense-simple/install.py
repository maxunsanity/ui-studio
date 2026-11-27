from pathlib import Path
import json,shutil
r=Path('/Users/max/projest_max/ui-studio'); stage=Path(__file__).parent
backup=r/'docs/planning/_backup/20261124_단이/디펜스5분과5칸'
src=r/'src/tools/uxStudio'
ws='workspace-cfa517bd-d9e1-40c4-aa1f-576e182500ba'
def load(name):return json.loads((stage/(name+'-saved.json')).read_text())
def write(p,text):
 save=backup/p.relative_to(r)
 if p.exists() and not save.exists():
  save.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,save)
 p.write_text(text)
def dump(p,value):write(p,json.dumps(value,ensure_ascii=False,indent=2)+'\n')
d=load('defense-simple');h=load('hud-countdown');b=load('build-damage')
p=src/'planning-documents.json';registry=json.loads(p.read_text())
def entry(data):return next(q for q in registry['projects'] if q['workspaceId']==ws and q['projectId']==data['projectId'])
de,he,be=map(entry,(d,h,b))
M='simulator_module_bad_energy';H='simulator_module_hud';B='simulator_module_building'
he['previewModules'][M]=dict(projectId=d['projectId'],screenId='defense-warning',rememberOrigin=True)
he['previewCountdown']={'defense-full':'defense-full.rail0.1.value'}
de.pop('previewEntryActions',None)
de['overviewScreen']=d['entryScreen']
de['previewCountdown']={'defense-warning':'defense-warning.countdown'}
de['previewControlImages']=json.loads((stage/'portrait-binding.json').read_text())
de['previewModules']={
 H:dict(projectId=h['projectId'],screenId='main'),
 'defense-warning.back':dict(projectId=h['projectId'],screenId='defense-full',carryClock=True),
 B:dict(projectId=b['projectId'],screenId='facility-repair-defense',backModule=M,rememberOrigin=True)
}
he['previewModules'][M]['carryClock']=True
be['previewModules'][M]['screenId']='defense-warning'
de['canvasReview']['boards']=[s['id'] for s in d['screens']]
de['screens']={s['id']:dict(section='overview' if s['id']==d['entryScreen'] else 'battle' if 'battle' in s['id'] else 'parts' if 'parts' in s['id'] else 'result',elements={}) for s in d['screens']}
def fields(id,title,*text):return dict(id=id,title=title,fields=[dict(label='제작 기준',value=t) for t in text])
de['sections']=[
 fields('overview','습격 시설과 5마리 편성','가득 차면 05:00. 대상 시설의 이미지와 최대 5마리 한 줄 편성을 같은 전체 화면에 둡니다.'),
 fields('battle','대표 전투 HUD','시설 1채 내구도 한 줄. 적·웨이브, 스킬 카드, 피니시, 멈춤은 대표 상태에 설명합니다.'),
 fields('result','같은 건물 결과 연출','성공은 지킨 시설과 몬스, 실패는 한 단계 전 외형에 파손 표시와 방어 참가 몬스. 수리 진입은 건설의 해당 시설.'),
 fields('parts','스킬 아이콘 15종','일반 스킬 10종과 팀 피니시 5종의 아이콘·이름·역할을 부품 보드 하나에 정리합니다.')]
for se in he['sections']:
 if se['id']=='bad-energy-defense':se.update(fields('bad-energy-defense','디펜스 진입 · 5분 카운트','나쁜 기운이 가득 차면 05:00부터 표시합니다. 게이지를 누르면 습격 시설과 출격 5칸이 있는 한 화면을 엽니다.','0초 후 게임 판정은 기획 결정 대기. 가득 찬 상태의 수동 굴림은 기존 그냥 두기.'))
dump(p,registry)
preview=src/'preview.mjs';s=preview.read_text()
if 'import { assetSource }' not in s:s=s.replace("import { mountDesignConsumer } from './consumer.mjs';","import { mountDesignConsumer } from './consumer.mjs';\nimport { assetSource } from './asset-reference.mjs';",1)
if 'function updatePreviewClock' not in s:
 mark='async function load() {'
 clock='''const incomingClock = Number(params.get('clock'));
let clockStarted = Number.isSafeInteger(incomingClock) && incomingClock > 0 && incomingClock <= Date.now() ? incomingClock : 0;
let clockTimer;
function updatePreviewClock(elements, screen) {
    const elementId = elements?.[screen];
    if (!elementId) return;
    const label = Array.from(host.querySelectorAll('[data-element]'))
        .find(node => node.dataset.element===elementId)?.querySelector(':scope > .element-text');
    if (!label) return;
    clockStarted ||= Date.now();
    const seconds = Math.max(0, Math.ceil((300000 - (Date.now() - clockStarted)) / 1000));
    const toTwo = value => String(value).padStart(2,'0');
    label.textContent = toTwo(Math.floor(seconds/60))+':'+toTwo(seconds%60);
}
'''
 assert mark in s;s=s.replace(mark,clock+mark,1)
 s=s.replace('        const originExits = index?.projects?.find(entry => entry.workspaceId === workspaceId && entry.projectId === id)?.previewOriginExits;',
             '        const previewEntry = index?.projects?.find(entry => entry.workspaceId === workspaceId && entry.projectId === id);\n        const originExits = previewEntry?.previewOriginExits;',1)
 mark='                onAction: async e => {'
 act='''                    if (e.type==='control-change') {
                        const pair = previewEntry?.previewControlImages?.[e.element];
                        const target = pair && Array.from(host.querySelectorAll('[data-element]'))
                            .find(node => node.dataset.element===pair.element)?.querySelector('img');
                        if (target) {
                            const image = Object.hasOwn(pair.options,e.value) ? pair.options[e.value] : null;
                            target.hidden = !image;
                            if (image) {
                                target.src = assetSource(image,workspaceId);
                                target.alt = image.alt;
                            }
                        }
                    }
'''
 assert mark in s;s=s.replace(mark,mark+'\n'+act,1)
 mark="                            if(target.screenId)url.searchParams.set('screen',target.screenId);"
 assert mark in s;s=s.replace(mark,mark+"\n                            if(target.carryClock && clockStarted)url.searchParams.set('clock',String(clockStarted));",1)
 mark='        fit();syncPreviewPage();'
 assert mark in s;s=s.replace(mark,mark+'''
        clearInterval(clockTimer);
        if (previewEntry?.previewCountdown) {
            const tick = () => {
                const screen = previewPage?.id || d.entryScreen;
                updatePreviewClock(previewEntry.previewCountdown,screen);
            };
            tick();
            clockTimer = setInterval(tick,250);
        }''',1)
 write(preview,s)
