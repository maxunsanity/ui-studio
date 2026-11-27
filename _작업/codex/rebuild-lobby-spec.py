from pathlib import Path
from html.parser import HTMLParser
import json,re
root=Path('/Users/max/projest_max/ui-studio');base=root/'src/tools/uxStudio';doc=Path('/Users/max/projest_max/kpopmonsters/docs/planning/삼중AI_공용_20260929/산출/기획서/산출_기획서_20261119_로비메뉴_프로필정보_상세기획서.html')
class N:
 def __init__(self,t,a=()):self.t=t;self.a=dict(a);self.c=[]
 def txt(self):return ''.join(x if isinstance(x,str) else x.txt() for x in self.c).strip()
 def find(self,t):return [x for x in self.c if isinstance(x,N) and x.t==t]+[v for x in self.c if isinstance(x,N) for v in x.find(t)]
class P(HTMLParser):
 def __init__(self):super().__init__();self.root=N('root');self.stack=[self.root]
 def handle_starttag(self,t,a):
  n=N(t,a);self.stack[-1].c.append(n)
  if t not in ('img','meta','link','br','hr','input'):self.stack.append(n)
 def handle_endtag(self,t):
  for i in range(len(self.stack)-1,0,-1):
   if self.stack[i].t==t:self.stack=self.stack[:i];break
 def handle_data(self,s):self.stack[-1].c.append(s)
p=P();p.feed(doc.read_text());tables=[]
for tab in p.root.find('table'):
 rows=[[x.txt() for x in tr.c if isinstance(x,N) and x.t in ('td','th')] for tr in tab.find('tr')]
 if rows:tables.append(rows)
rows=next(t for t in tables if t[0][0]=='요소 이름');format_rows=next(t for t in tables if len(t[0])==5 and t[0][0]=='#' and '자리' in t[0][1]);formats={r[0]:r[-1] for r in format_rows[1:] if r}
registry=json.loads((base/'planning-documents.json').read_text());entry=registry['projects'][0];sections={s['id']:s for s in entry['sections']}
clean=lambda s:re.sub(r'\(현중[^)]*\)','',s).strip()
def area(name):
 if name.startswith(('Group_Bottom','Menu_Info','Item_Team','Item_Idol','Item_Relation','Item_Crew')):return 'bottom'
 if name.startswith(('Slot_','Area_Side')):return 'rails'
 if name in ['Btn_Profile','Group_Settings','Menu_Settings']:return 'header'
 if name in ['Overlay_EventBox','Menu_AlbumFestival','Item_MyAlbum','Item_Festival']:return 'events'
 if name=='Group_Action':return 'action'
 return 'resources'
names={'Btn_Profile':'プロフィル','Group_Money':'돈 표시','Group_Dice':'주사위 표시','Group_Shield':'몬스 기분 게이지','Menu_ShieldMons':'방패·몬스 메뉴','Item_MyAlbum':'내 앨범','Item_Festival':'페스티벌','Group_Action':'배수·굴리기 버튼 줄'};names['Btn_Profile']='프로필'
entry['parts']=[];byname={}
for row in rows[1:]:
 if len(row)!=9:continue
 name=row[0];partid='part-'+re.sub('[^a-z0-9]+','-',name.lower()).strip('-');fmt=row[6]
 match=re.search(r'4-9절 ([0-9·~～\-]+)번',fmt)
 if match:fmt=' / '.join(formats[n] for n in re.findall(r'\d+',match[1]) if n in formats) or fmt
 part={'id':partid,'area':area(name),'title':names.get(name,name),'elementName':name,'fields':[{'label':'표시', 'value':clean(row[2])},{'label':'동작','value':clean(row[4])},{'label':'표시 규칙','value':clean(fmt)}], 'sourceFields':[{'label':h,'value':v} for h,v in zip(rows[0],row)]}
 entry['parts'].append(part);byname[name]=part
# Plain work instructions; exact source wording/data/claims remain available in sourceFields.
overrides={
 'Group_Money':[('표시','현재 보유한 돈'),('동작','누르지 않는 표시 영역'),('숫자','쉼표를 포함한 전체 숫자 표시. K·M·B로 줄이지 않음.'),('넘침','이 숫자의 글자 크기만 줄임. 옆 칸의 글자 크기는 유지.'),('크기·간격','이 문서에 부품 크기·최소 글자 크기 수치가 없음. 공통 규격안이 필요함.')],
 'Group_Dice':[('표시','가진 주사위 수 / 상한'),('동작','누르지 않는 표시 영역'),('숫자','1,000부터 K·M으로 축약. 예: 1.2K. 그래도 넘치면 주사위 숫자만 축소.'),('확인 필요','표시할 상한은 자동 충전 상한이라는 원문 제안. 최대 보유 수와 구분해야 함.')],
 'Btn_Profile':[('구성','대표 이미지와 둘레의 컨디션 게이지'),('동작','캐릭터 정보창의 팀 탭 열기. 다른 전체 화면이 열려 있을 때 먼저 닫는 순서는 확인 필요.'),('표시','컨디션은 팀 평균. 이름은 원문에 계정명·팀명이 함께 있어 구분 필요.'),('문구 규격','팀 이름 최대 12자, 이름 칸 폭62px·글자13은 원문의 제안값. 이미지·입력 크기는 별도 규격 필요.')],
 'Group_Shield':[('구성','몬스 아이콘과 하나로 이어진 게이지'),('표시','방패 수0~3을 몬스 기분 게이지의 빈 상태~가득 찬 상태에 대응'),('동작','위로 목록 펼치기: 방패 설명 / 몬스 로비'),('확인 필요','저장본 방패3개 표시는 새 게이지안과 다름. 아직 2차 제작 규격으로 확정하지 않음.')]
}
for name,fields in overrides.items():byname[name]['fields']=[{'label':k,'value':v} for k,v in fields]
# Current design IDs remain untouched. Links prefer exact parts, then linked parents.
d=json.loads(Path('/Users/max/projest_max/ui-guideline-israt/ui-studio/designs/ux-31671dd8.json').read_text());mapping=entry['screens']['main']['elements']
for e in d['screens'][0]['elements']:
 name=e['name']
 if name in byname:mapping[e['id']]=byname[name]['id']
 if name=='Group_Profile':mapping[e['id']]=byname['Btn_Profile']['id']
# Actual working content for area selection rather than workflow/status announcements.
sections['overview']['title']='로비 HUD 구성';sections['overview']['fields']=[{'label':'상단','프로필':'','value':'대표 이미지 · 팀 이름/등급 · 나쁜 기운 · 엔터파워 · 팬 · 설정'},{'label':'게임 화면 위','value':'중앙 앨범/페스티벌 박스 · 좌우 이벤트 입구'},{'label':'게임 화면 아래','value':'돈/주사위/몬스 줄 → 필러 → 배수/행동 버튼 → 하단6메뉴'},{'label':'하단 메뉴','value':'포토카드 · 스케줄 · 건설 · 미션 · 상점 · 정보'}]
sections['header']['fields']=[{'label':'구성','value':'대표 이미지 · 팀 이름/등급 · 나쁜 기운 · 엔터파워 · 팬 · 설정'},{'label':'부품 분리','value':'이미지, 글자, 게이지, 입력 영역을 각각 구분'},{'label':'연결','value':'프로필→캐릭터 정보창 / 설정→계정 메뉴'},{'label':'상세','value':'아래 부품별 설명에서 표시 규칙·데이터·원문 근거 확인'}]
sections['resources']['fields']=[{'label':'순서','value':'돈 → 주사위 → 몬스 기분 게이지'},{'label':'동작','value':'돈과 주사위는 표시만. 몬스는 방패/몬스 목록을 위로 펼침.'},{'label':'표시','value':'돈은 전체 숫자, 주사위는 보유/상한, 몬스는 방패 수에 대응하는 게이지'},{'label':'확인 필요','value':'각 칸 크기·간격·글자 최소 크기는 공통 규격안 필요'}]
for key in ['events','rails','filler','action','bottom','states','review']:
 s=sections[key];s['fields']=[{'label':'구성','value':s['summary']}]+[{'label':'동작' if i==0 else '규칙','value':v} for i,v in enumerate(s.get('lines',[]))]
# Preserve original state/action/filler tables in the area, using vertical cards in the reader.
current='';body=p.root.find('body')[0]
for node in body.c:
 if not isinstance(node,N):continue
 if node.t in ['h2','h3']:current=node.txt()
 if node.t=='table' and current.startswith(('2.','4-4.','4-8-2.','4-8-3.','4-6.','4-8-4.')):
  rows2=[[x.txt() for x in tr.c if isinstance(x,N) and x.t in ('td','th')] for tr in node.find('tr')]
  if len(rows2)<2:continue
  key='overview' if current.startswith('2.') else 'events' if current.startswith('4-4.') else 'filler' if current.startswith('4-8-2.') else 'rails' if current.startswith('4-6.') else 'action'
  sections[key].setdefault('tables',[]).append({'title':current,'headers':rows2[0],'rows':rows2[1:]})
entry['sections']=list(sections.values());(base/'planning-documents.json').write_text(json.dumps(registry,ensure_ascii=False,indent=2)+'\n')
print(len(entry['parts']),'part specs; linked',len(mapping),'elements;',sum(len(s.get('tables',[])) for s in entry['sections']),'source tables retained')
