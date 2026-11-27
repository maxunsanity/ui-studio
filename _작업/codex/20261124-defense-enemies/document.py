from pathlib import Path
from html import escape
from hashlib import sha256
from urllib.parse import quote
import csv
import json
import shutil
import struct

studio=Path.cwd()
project=Path('/Users/max/projest_max/kpopmonsters')
stage=Path(__file__).parent
source=studio/'src/tools/uxStudio'
ref=source/'guide/reference'
backup=studio/'docs/planning/_backup/20261124_단이/디펜스악귀리소스표'
asset_root='http://127.0.0.1:7007/'
lab=asset_root+'docs/planning/defense-resource-lab.html'
manifest_path='data/res/defense_motion_v01/manifest.json'
enemy_path='data/bad_energy/bad_energy_enemy.csv'
manifest=json.loads((project/manifest_path).read_text())
with (project/enemy_path).open(newline='') as f:
    enemies=list(csv.DictReader(f))
assets={e['asset_id']:e for key in ('characters','projectiles','effects') for e in manifest[key]}
tier={'small':'소형','large':'대형','boss':'보스'}
layer={'ground':'지상','air':'공중'}
motion_labels={
 'spawn':'등장','idle':'대기','move_ground':'지상 이동','move_fly':'비행',
 'attack_windup':'공격 준비','attack':'공격','hit':'피격','stagger':'경직',
 'slow':'둔화','freeze':'빙결','death':'소멸','idle_hover':'공중 대기',
 'move_hover':'공중 이동','charge_missile':'포격 준비','fire_missile':'포격',
 'charge_salvo':'연발 준비','fire_salvo':'연발 발사','phase_transition':'페이즈 전환',
 'summon':'소환','weakpoint_open':'약점 노출'
}
def original(url, label):
    return f'<a href="{asset_root+quote(url)}">{escape(label)}</a>'
def clip_list(names):
    return '<ul class="enemy-clips">'+''.join(f'<li>{motion_labels[name]} <code>{name}</code></li>' for name in names)+'</ul>'
def validate(row):
    blob=(project/row['path']).read_bytes()
    assert blob[:4]==b'glTF' and sha256(blob).hexdigest()==row['sha256'],row['asset_id']
    length,kind=struct.unpack_from('<I4s',blob,12)
    assert kind==b'JSON'
    gltf=json.loads(blob[20:20+length])
    actual={item['name'] for item in gltf.get('animations',[])}
    listed={item['name'] for item in row['clips']}
    assert actual==listed,(row['asset_id'],actual,listed)
    assert (project/row['blend_path']).is_file()
    return listed
parts=ref/'kpop-defense/enemy-assets'
parts.mkdir(parents=True,exist_ok=True)
records=[]
for enemy in enemies:
    row=assets[enemy['asset_id']]
    clips=validate(row)
    active=[enemy[key] for key in ('spawn_clip','move_clip','attack_clip','hit_clip','death_clip')]
    assert set(active)<=clips
    filename=enemy['asset_id']+'.png'
    shutil.copy2(stage/'images'/filename,parts/filename)
    category=f'{layer[enemy["layer"]]} · {tier[enemy["legacy_tier"]]}'
    label=row['label_ko']
    records.append(
        f'<tr><td><a href="enemy-assets/{filename}"><img src="enemy-assets/{filename}" loading="lazy" width="132" alt="{escape(label)} 3D 모델"></a></td>'
        f'<th scope="row"><strong>{escape(label)}</strong><br><code>{enemy["asset_id"]}</code></th><td>{category}</td>'
        f'<td>{motion_labels[active[1]]} <code>{active[1]}</code><br>{motion_labels[active[2]]} <code>{active[2]}</code></td>'
        f'<td>{original(row["path"],"GLB")}<br>{original(row["blend_path"],"Blender")}</td></tr>'
    )
assert len(records)==13
gltf_rows=[
 ('spawn_fog','악귀가 나타나는 위치의 안개'),
 ('area_warning','공격 범위 예고'),
 ('death_dissolve','처치된 악귀가 사라지는 효과'),
 ('boss_charge','보스 포격 준비 연출'),
 ('boss_missile','보스의 공중 포격 투사체'),
 ('phase_wave','보스 페이즈 전환 효과'),
]
fx=[]
for id,usage in gltf_rows:
    row=assets[id];validate(row)
    fx.append(f'<tr><th scope="row">{escape(row["label_ko"])}<br><code>{id}</code></th><td>{usage}</td><td>{original(row["path"],"GLB")} · {original(row["blend_path"],"Blender")}</td></tr>')
normal_clips=[v['name'] for v in assets['ghost_rat']['clips']]
boss_clips=[v['name'] for v in assets['boss_air_dragon']['clips']]
section=f'''
<section id="enemy-resources">
<h2>악귀 3D 리소스 부품표</h2>
<p>악귀 12종은 지상 10종과 공중 2종입니다. 용형 공중 보스는 별도 모델입니다. 각 이미지는 원본 GLB를 리소스 뷰어에서 열어 캡처했습니다.</p>
<p>실제 크기와 움직임은 <a href="{lab}">3D 리소스 뷰어</a>의 악귀·보스 탭에서 확인합니다. GLB는 게임에 불러오는 파일이며 Blender는 수정용 원본입니다.</p>
<h3>전투에 나오는 모델</h3>
<div class="enemy-resource-scroll"><table class="enemy-resource-table">
<thead><tr><th scope="col">3D 모습</th><th scope="col">악귀 · 리소스 ID</th><th scope="col">전장 구분</th><th scope="col">기본 이동과 공격 클립</th><th scope="col">원본</th></tr></thead>
<tbody>{''.join(records)}</tbody></table></div>
<details><summary>악귀 12종에 포함된 동작 클립 11개</summary>
<p>모든 모델에 지상·비행 클립이 들어 있습니다. 전투에서는 위 표에 지정된 이동 클립을 사용합니다. 등장·피격·소멸은 각각 <code>spawn</code>·<code>hit</code>·<code>death</code>입니다.</p>{clip_list(normal_clips)}</details>
<details><summary>용형 공중 보스 동작 클립 13개</summary>
<p>기본 공중 이동과 포격 외에 연발 준비·발사, 페이즈 전환, 소환, 약점 노출용 클립이 들어 있습니다.</p>{clip_list(boss_clips)}</details>
<h3>함께 쓰는 3D 효과</h3>
<div class="enemy-resource-scroll"><table><thead><tr><th scope="col">효과 · 리소스 ID</th><th scope="col">쓰이는 장면</th><th scope="col">원본</th></tr></thead><tbody>{''.join(fx)}</tbody></table></div>
<p><small>원본 목록은 {original(manifest_path,'리소스 매니페스트')}와 {original(enemy_path,'시뮬레이터 악귀 정의표')}를 확인합니다. 크기 등급과 동작 지정은 시뮬레이터 기준입니다.</small></p>
</section>
'''
def edit(path, fn):
    before=backup/path.relative_to(studio)
    before.parent.mkdir(parents=True,exist_ok=True)
    if not before.exists():shutil.copy2(path,before)
    path.write_text(fn(path.read_text()))
def spec(text):
    assert 'id="enemy-resources"' not in text and '</main>' in text
    style='<style>.enemy-resource-scroll{overflow-x:auto} .enemy-resource-table{min-width:540px} .enemy-resource-table img{display:block;height:auto;max-width:100%;border:1px solid #d4dce2;border-radius:5px} #enemy-resources td code,#enemy-resources th code{white-space:nowrap;font-weight:400} .enemy-clips{display:grid;grid-template-columns:repeat(auto-fit,minmax(185px,1fr));gap:3px 14px} #enemy-resources details{margin:12px 0}</style>'
    text=text.replace('</style>', '</style>'+style,1)
    text=text.replace('<section id="parts"><h2>공통 부품과 아이콘</h2>','<section id="parts"><h2>공통 부품과 아이콘</h2><p><a href="#enemy-resources">악귀 3D 리소스 부품표</a></p>',1)
    return text.replace('</main>',section+'</main>',1)
edit(ref/'kpop-defense/index.html',spec)
anchor='6. 리소스 · 데이터'
link='/ui-studio/source/guide/reference/kpop-defense/index.html#enemy-resources'
def paper(text):
    a=text.index('<section class="tab" id="defense">')
    b=text.index('</section>',a)
    tab=text[a:b]
    marker=f'<summary>{anchor}</summary><div>'
    assert marker in tab
    extra=f'<p>악귀 12종과 용형 공중 보스의 <a href="{link}">3D 리소스 부품표</a>에서 모델 모습, 전장 구분, 동작, GLB·Blender 원본을 확인합니다. 출현·소멸·보스 공격용 3D 효과도 함께 기재했습니다.</p>'
    return text[:a]+tab.replace(marker,marker+extra,1)+text[b:]
edit(ref/'kpop-planning/snapshot/papers/P265.html.txt',paper)
print(f'악귀와 보스 {len(records)}종, 관련 효과 {len(fx)}종의 GLB 해시·클립·Blender 원본 확인')
