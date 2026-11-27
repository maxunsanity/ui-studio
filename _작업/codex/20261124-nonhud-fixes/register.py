from pathlib import Path
from collections import Counter
import json,shutil,re
r=Path.cwd();s=Path(__file__).parent
base=r/'src/tools/uxStudio';ref=base/'guide/reference'
store=Path('/Users/max/projest_max/ui-guideline-israt/ui-studio/designs')
b=r/'docs/planning/_backup/20261124_단이/HUD제외_UI보완'
p=base/'planning-documents.json'
j=json.loads(p.read_text())
ws='workspace-cfa517bd-d9e1-40c4-aa1f-576e182500ba'
note=json.loads((s/'followup.json').read_text())
entries={e.get('planningTab'):e for e in j['projects'] if e['workspaceId']==ws and e.get('planningTab') in note}
docs={k:json.loads((store/(e['projectId']+'.json')).read_text()) for k,e in entries.items()}
def write(path,data):
    dest=b/path.relative_to(r);dest.parent.mkdir(parents=True,exist_ok=True)
    if path.exists() and not dest.exists():shutil.copy2(path,dest)
    path.write_text(data)
for k,e in entries.items():
    d=docs[k];valid={q['id'] for q in d['screens']}
    e['canvasReview']['boards']=[q['id'] for q in d['screens']]
    sections={q['id'] for q in e['sections']}
    for q in d['screens']:
        sid=q['id']
        node=e['screens'].get(sid,{'section':'screen-'+sid,'elements':{}})
        sec=node['section']
        if sec not in sections:
            e['sections'].append({'id':sec,'title':q['name'],'fields':[{'label':'화면 유형','value':q.get('presentation',{}).get('type',q['kind'])},{'label':'사용 목적','value':q.get('purpose') or q['name']}]})
            sections.add(sec)
        ids={el['id'] for el in q['elements']}
        fields={key:value for key,value in node.get('elements',{}).items() if key in ids}
        for target in q['elements']:
            if target.get('image') or target.get('control') or target['kind'] in ('button','card') or target.get('partRole')=='frame':
                fields.setdefault(target['id'],sec)
        node['elements']=fields
        e['screens'][sid]=node
    assert set(e['screens'])==valid or not set(e['screens'])-valid
    e['canvasReview']['contexts']=e['canvasReview'].get('contexts',{})
    for q in d['screens']:
        if q['kind']=='page':
            e['canvasReview']['contexts'].pop(q['id'],None)
    e['sections']=[q for q in e['sections'] if q['id']!='followup']
    e['sections'].append({'id':'followup','title':'전수 조사 후속 보완','fields':[{'label':'반영','value':line} for line in note[k]['changes']]+[{'label':'연동 또는 원본 대기','value':note[k]['pending']}]})

entries['defense']['previewTimedOverlay']['label']='defense-battle.next-skill'
exclude={'facility-confirm-one.back','facility-confirm.back','facility-confirm-new.back'}
entries['build']['previewOriginExits']['elements']=[x for x in entries['build']['previewOriginExits']['elements'] if x not in exclude]
def context(k,overlay,*behind):
    e=entries[k]; valid={x['id'] for x in docs[k]['screens']}
    assert all(x in valid for x in [overlay,*behind]),(k,overlay,behind)
    e['canvasReview']['contexts'][overlay]={'behind':list(behind)}
for overlay in ['relationship-item-selected','relationship-item-empty']:
    context('relation',overlay,'relationship-main','relationship-pair')
for overlay,page in [('reward-hint-card','daily'),('reward-hint-guide','guide'),('reward-hint-achievement','achievements'),('reward-hint-event','event')]:
    if page in entries['mission']['screens']:context('mission',overlay,page)
    elif page=='achievements':
        actual=next(x['id'] for x in docs['mission']['screens'] if 'achievement' in x['id'] and x['kind']=='page')
        context('mission',overlay,actual)
context('crew','crew-mission-reward','crew-mission-stage-claimed')
context('crew','crew-image-error','manage-info','crew-image-picker')
for overlay,behind in [
 ('mons-packs-state-picker',[]),('mons-pack-confirm',['mons-packs-ready']),('mons-pack-confirm-duplicate',['mons-packs-duplicate']),('mons-pack-new',['mons-packs-ready']),('mons-pack-duplicate',['mons-packs-duplicate']),('mons-pack-exchange-confirm',['mons-packs-exchange']),('mons-pack-exchanged',['mons-packs-exchange'])]:
    if overlay in entries['mons']['screens']:context('mons',overlay,'mons-storage',*behind)

def previewRoute(k, element, to, screen, **extra):
    valid={q['id'] for q in docs[to]['screens']}
    assert screen in valid
    assert any(el['id']==element for q in docs[k]['screens'] for el in q['elements'])
    entries[k].setdefault('previewModules',{})[element]={'projectId':entries[to]['projectId'],'screenId':screen,**extra}
previewRoute('mission','reward-hint-card.pack-detail','photocard','list',overlay='pack-detail-0-0',rememberOrigin=True)
entries['mission'].setdefault('previewOverlays',{})['reward-hint-card']='daily'
entries['photocard'].setdefault('previewOverlays',{})['pack-detail-0-0']='list'
entries['photocard']['previewOriginExits']={'entries':['list'],'elements':['pack-detail-0-0.close','pack-detail-0-0.back']}
context('shop','cosmetics-acquired','cosmetics-preview')
context('shop','cosmetics-target','cosmetics-preview','cosmetics-acquired')
entries['shop'].setdefault('previewOverlays',{}).update({'cosmetics-acquired':'cosmetics-preview','cosmetics-target':'cosmetics-preview'})
previewRoute('shop','cosmetics-target.choose-1','profile','closet-hanseoa-fit',variant='acquired',rememberOrigin=True)
entries['profile'].setdefault('previewVariants',{})['closet-hanseoa-fit']={'acquired':{'closet-hanseoa-fit.fitting-mode':'acquired'}}
entries['profile']['previewOriginExits']={'entries':['closet-hanseoa-fit'],'elements':['closet-hanseoa-fit.acquired-back']}
m=next(q for q in docs['mons']['screens'] if q['id']=='mons-storage')
elements={el['id']:el for el in m['elements']}
cards=[{'id':el['id'],'attribute':elements[el['id']+'-stage']['text'].split('·',1)[0].strip(),'x':el['x'],'y':el['y']} for el in m['elements'] if el.get('parentId')=='mons-storage.inventory-scroll' and el['id']+'-stage' in elements]
assert len(cards)==12
entries['mons']['previewAttributeFilter']={'page':m['id'],'label':'mons-storage.attribute.label','count':'mons-storage.inventory-total','cards':cards}
write(p,json.dumps(j,ensure_ascii=False,indent=2)+'\n')
write(s/'docs.json',json.dumps({k:{'id':d['projectId'],'rev':d['revision'],'screens':len(d['screens'])} for k,d in docs.items()},ensure_ascii=False,indent=2))
print('registry',sum(len(e['screens']) for e in entries.values()),'screens /',sum(len(x.get('elements',{})) for e in entries.values() for x in e['screens'].values()),'elements')
