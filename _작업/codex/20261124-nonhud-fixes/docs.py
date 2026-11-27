from pathlib import Path
from collections import defaultdict
from html import escape
from urllib.parse import quote
import json,re,shutil
root=Path.cwd();s=Path(__file__).parent
ref=root/'src/tools/uxStudio/guide/reference'
backup=root/'docs/planning/_backup/20261124_단이/HUD제외_UI보완'
stage_files=Path('/Users/max/projest_max/ui-guideline-israt/ui-studio/designs')
meta=json.loads((s/'docs.json').read_text())
notes=json.loads((s/'followup.json').read_text())
audit=json.loads((s/'ledger.json').read_text())
dest=ref/'kpop-planning/followup-nonhud';dest.mkdir(parents=True,exist_ok=True)
ws='workspace-cfa517bd-d9e1-40c4-aa1f-576e182500ba'
specs={'defense':'defense','build':'build','photocard':'photocard','schedule':'schedule','relation':'relationship','mission':'mission','shop':'shop','mons':'mons','crew':'crew','profile':'profile'}
def write(p,text):
    to=backup/p.relative_to(root)
    to.parent.mkdir(parents=True,exist_ok=True)
    if p.exists() and not to.exists():shutil.copy2(p,to)
    p.write_text(text)
def sample(k,screen):
    d=meta[k];return '/ui-studio/source/sample-preview.html?workspace='+ws+'&amp;project='+d['id']+'&amp;screen='+quote(screen)+'&amp;view=detailed-wireframe'
def shots(k,imagebase):
    d=meta[k]
    cards=[]
    labels={q['화면 ID']:q['화면명'] for q in audit['screens'] if q['기능']==k}
    for screen in notes[k]['examples']:
        f=k+'-'+screen+'.png'; p=dest/'assets'/f
        assert p.is_file(),str(p)
        cards.append(f'<figure><a href="{sample(k,screen)}"><img src="{imagebase}{f}" alt="{escape(labels[screen])} 최신 화면" width="235" loading="lazy"></a><figcaption>{escape(labels[screen])}</figcaption></figure>')
    return '<div class="fresh-views">'+''.join(cards)+'</div>'
def inventory(k):
    d=json.loads((stage_files/(meta[k]['id']+'.json')).read_text())
    parts={p['id'] for p in d['screens'] if p['kind']=='page' and re.search('부품|부속|부자재|리소스 보드',p['name'])}
    art=defaultdict(list)
    def ref_key(e):
        i=e.get('image',{});return i.get('assetRef') or i.get('src') or ''
    for p in d['screens']:
        if p['id'] in parts:continue
        for e in p['elements']:
            key=ref_key(e)
            if key:art[key].append(e['id'])
    rows=[]
    for p in d['screens']:
        if p['id'] not in parts:continue
        for e in p['elements']:
            i=e.get('image',{});key=ref_key(e)
            if not key:continue
            used=art[key]; where=', '.join(used[:3])+(' 외 '+str(len(used)-3)+'건' if len(used)>3 else '')
            kind='3D 대표 · 원본 색상 유지' if i.get('preserveColor') else '보드 이미지'
            rows.append(f'<tr><th scope="row">{escape(e["name"])}<br><code>{escape(e["id"])}</code></th><td>{kind}</td><td>{escape(where or "보드 표본")}</td></tr>')
    links=' · '.join(f'<a href="{sample(k,p["id"])}">{escape(p["name"])}</a>' for p in d['screens'] if p['id'] in parts)
    table=f'<table><thead><tr><th>부품 이미지와 ID</th><th>표시 용도</th><th>같은 원본을 쓰는 화면 ID</th></tr></thead><tbody>{"".join(rows)}</tbody></table>'
    return '<details><summary>부품 보드와 이미지 사용처</summary><p>'+links+'</p>'+table+'</details>'
def changes(k):
    return '<ul>'+''.join(f'<li>{escape(t)}</li>' for t in notes[k]['changes'])+'</ul><p><strong>연동 및 원본 확인</strong> '+escape(notes[k]['pending'])+'</p>'
def style():
    return '<style>.fresh-views{display:flex;flex-wrap:wrap;gap:12px}.fresh-views figure{margin:6px 0}.fresh-views img{display:block;max-width:100%;height:auto}.followup-inventory table{table-layout:fixed;width:100%}.followup-inventory th,.followup-inventory td{overflow-wrap:anywhere}</style>'
def work(k):
    p=ref/('kpop-'+specs[k])/'index.html';text=p.read_text(); d=meta[k]
    block=f'<section id="followup-nonhud" class="followup-inventory"><h2>전수 조사 후속 보완 · r{d["rev"]}</h2><p>현재 저장 세부 와이어프레임 {d["screens"]}개 화면</p>{changes(k)}{shots(k,"../kpop-planning/followup-nonhud/assets/")}{inventory(k)}</section>'
    end=next(tag for tag in ('</main>', '</body>', '</html>') if tag in text)
    text=re.sub(r'<section id="followup-nonhud"[^>]*>.*?</section>','',text,count=1,flags=re.S)
    text=text.replace(end,block+end,1)
    if 'class="followup-inventory"' in text and '.followup-inventory table' not in text:text=text.replace('</style>','</style>'+style(),1)
    write(p,text)
for k in notes:work(k)
doc=ref/'kpop-planning/snapshot/papers/P265.html.txt'
text=doc.read_text()
titles={k:notes[k]['name'] for k in notes}
titles.update({'relation':'관계','profile':'프로필·의상'})
for k,d in meta.items():
    a=text.index(f'<section class="tab" id="{k}">')
    b=text.index('</section>',a)
    chunk=text[a:b]
    chunk=re.sub(r'<p class="followup-current">.*?</ul>','',chunk,count=1,flags=re.S)
    fragment=f'<p class="followup-current"><strong>7018 후속 보완 · r{d["rev"]} · {d["screens"]}화면</strong> <a href="/ui-studio/source/guide/reference/kpop-{specs[k]}/index.html#followup-nonhud">최신 작업 명세와 캡처</a></p><ul>'+''.join(f'<li>{escape(t)}</li>' for t in notes[k]['changes'])+'</ul>'
    end_heading=chunk.index('</h2>')+len('</h2>')
    chunk=chunk[:end_heading]+fragment+chunk[end_heading:]
    text=text[:a]+chunk+text[b:]
    label=escape(titles[k])
    text=re.sub(r'(<th scope="row">'+re.escape(label)+r'</th><td>)r\d+ · \d+개',lambda m:m[1]+f'r{d["rev"]} · {d["screens"]}개',text,count=1)
write(doc,text)
for f in ['screen-audit.csv','resource-audit.csv','ledger.json']:
 shutil.copy2(s/f,dest/f)
assert len(audit['projects'])==10
assert audit['browserChecks']==len(audit['screens'])*2
assert all(p['prev']==p['rev'] for p in audit['projects'])
details=[]
for k in notes:
 d=meta[k]
 cards=shots(k,'assets/')
 item=f'<section id="{k}"><h2>{escape(notes[k]["name"])} <small>r{d["rev"]} · {d["screens"]}화면</small></h2>{changes(k)}<p><a href="../index.html?doc=P265#{k}">UI 기획서</a> · <a href="../../kpop-{specs[k]}/index.html#followup-nonhud">작업 명세</a></p>{cards}</section>'
 details.append(item)
css='body{margin:0;background:#edf2f5;color:#243243;font:15px/1.6 system-ui,sans-serif}main{max-width:1000px;margin:auto;padding:20px 15px 60px}section{background:white;border:1px solid #ccd7df;border-radius:8px;padding:15px;margin:16px 0}h1{line-height:1.2}h2{margin:0 0 6px}h2 small{font-size:13px;font-weight:600;color:#536674}a{color:#10496b}nav{display:flex;flex-wrap:wrap;gap:7px 14px}'
body=f'<h1>HUD 제외 UI 후속 보완</h1><p>2026-11-24 KST · 7018 세부 와이어프레임 · 검수 대기</p><p>비HUD {len(audit["projects"])}개 기능과 {len(audit["screens"])}개 저장 보드를 430px·1440px에서 {audit["browserChecks"]}회 열었습니다. 이전 전수 조사에서 확인한 문제와 이번 보완을 기능별로 연결했습니다.</p><nav><a href="../nonhud-audit/index.html">이전 전수 조사</a><a href="screen-audit.csv">최신 화면 전수표</a><a href="resource-audit.csv">최신 리소스 사용표</a></nav>'
write(dest/'index.html','<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>HUD 제외 7018 UI 후속 보완</title><style>'+css+'</style>'+style()+'<main>'+body+''.join(details)+'</main></html>\n')
print('updated',len(notes),'work specs and P265;',len(audit['screens']),audit['browserChecks'],'checks')
