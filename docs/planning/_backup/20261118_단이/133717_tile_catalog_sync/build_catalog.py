# coding: utf-8
from pathlib import Path
import json, shutil, hashlib, html, re
from datetime import datetime
from zoneinfo import ZoneInfo

ROOT=Path('/Users/max/projest_max/ui-studio')
BASE=ROOT/'_작업/codex/ux-studio/tile-survival-20261118'
OUT=BASE/'catalog'
REF=OUT/'references'
REF.mkdir(parents=True,exist_ok=True)
load=lambda p:json.loads(p.read_text())
a=load(BASE/'video-a2/inventory.json'); b=load(BASE/'video-b/inventory.json')
samples=load(BASE/'sample-match/inventory.json'); parts=load(BASE/'sample-match/candidate-parts.json')
a_by={x['id']:x for x in a['families']}; b_by={x['id']:x for x in b['items']}
created=datetime.now(ZoneInfo('Asia/Seoul')).isoformat(timespec='seconds')
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def relative(p):
 p=Path(p)
 return str(p.relative_to(ROOT)) if p.is_absolute() else str(p)
def path(p):return Path(p) if Path(p).is_absolute() else ROOT/p

def frame01(sec):
 p=BASE/'TSV01/frames/index.json'; x=next(x for x in load(p)['frames'] if x['requested']==sec)
 return dict(videoId='TSV01',requestedSeconds=sec,actualSeconds=x['actual'],sourceFrame=str(p.parent/x['file']),sourceIndex=str(p),sourceFrameIndex=x['index'],sourceTimecode=f"{int(sec)//60:02}:{sec%60:05.2f}")
def frameA(f,idx=0):
 x=a_by[f]['representatives'][idx]
 return dict(videoId='TSV02',requestedSeconds=x['requested_seconds'],actualSeconds=x['actual_seconds'],sourceFrame=str(path(x['source_frame'])),referenceCopySource=str(path(x['representative_frame'])),sourceIndex=str(BASE/('video-a2/detail-frames/index.json' if '_detail' in x['representative_frame'] else 'TSV02/frames/index.json')),sourceTimecode=x['timecode'])
def frameB(f):
 x=b_by[f]['reference']; p=Path(x['extractedPath']); ip=p.parent/'index.json'; fr=next(q for q in load(ip)['frames'] if q['file']==p.name)
 return dict(videoId=b_by[f]['videoId'],requestedSeconds=x['timeSeconds'],actualSeconds=fr['actual'],sourceFrame=str(p),referenceCopySource=x['path'],sourceIndex=str(ip),sourceFrameIndex=fr['index'],sourceTimecode=x['timecode'])

def reg(name,box,content):return dict(name=name,boundsPx=box,observedContent=content)
custom={
'TS01':dict(label='타이틀 / 로딩',kind='screen',category='시작',children=['TitleBackground','GameLogo','ServiceButtons','VersionLabel','LoadingTip','LoadingProgress','LoadingStatus'],regions=[reg('타이틀과 장면',[0,0,504,766],'타이틀·정착지 삽화·좌상단 서비스 아이콘·우상단 버전'),reg('로딩 정보',[10,766,484,115],'팁·진행 막대·상태 문구')],texts=['버전 정보 획득','게임 리소스 업데이트','근거지 진입 중'],states=['영문/한글 타이틀','정보 획득/자원 업데이트/근거지 진입 진행'],notes=['좌상단 고객센터·설정·계정 아이콘은 보이나 목적지 미관찰. Google Play 로고는 로딩 화면의 표시만 관찰.'],times=[0,15,20],refs=[frame01(0)]),
'TS02':dict(label='게임 이용약관',kind='modal',category='시작',children=['Scrim','TermsFrame','Header','CloseButton','TermsBody','PolicyLinks','StartButton','AgreeStartButton'],regions=[reg('타이틀 배경',[0,0,504,894],'타이틀 화면 유지'),reg('약관 창',[37,280,433,356],'청색 헤더·본문·정책링크·회색 시작/녹색 동의시작'),reg('로딩 상태',[14,770,480,110],'모달 아래 진행막대')],texts=['게임 이용약관','서비스 이용약관','개인정보 처리방침','시작하기','모두 동의하고 시작하기'],states=['동일 약관 창 5/10초. 내용 변형은 별도 가족 아님.'],notes=['정책 링크 본문과 X/시작/동의시작의 개별 결과 미확인.'],times=[5,10],refs=[frame01(5)]),
'TS04':dict(label='스토리 / 주민 대화',kind='sheet',category='서사·주민',children=['SpeakerPortrait','DialogueFrame','SpeakerNameTab','BodyText','NextIndicator','SkipButton'],regions=[reg('월드/연출 배경',[0,0,504,690],'배경 월드와 월드 인물 말풍선'),reg('반신 초상',[0,440,504,280],'말하는 인물 반신, 좌/우 배치 변형'),reg('대화판',[8,690,484,199],'이름탭·본문·다음삼각·스킵')],texts=['데이몬','정말 고마워. 드디어 살 곳이 생겼어!','스킵'],states=['세이지/데이몬/럭키/미아 등 초상·이름·본문 변형','좌측/우측 초상','대화판 페이드'],notes=['인물별 대사로 가족을 늘리지 않음. 월드 말풍선은 공통 WorldAnchor 부품.'],times=[55,170,180],refs=[frame01(170)]),
'TS06':dict(label='튜토리얼 대응 방식 2택',kind='modal',category='시작',children=['BlurScrim','ChoiceTitle','ChoiceCardRow','ChoiceCard','SelectionBracket','DescriptionPanel','ConfirmButton'],regions=[reg('배경 블러',[0,0,504,894],'월드 흐림'),reg('제목',[177,157,151,50],'대응 방식 선택'),reg('두 선택카드',[52,244,388,260],'문을 열어 수용하기/바로 방전하기'),reg('설명',[66,521,375,84],'선택 설명 2줄'),reg('확인',[170,660,165,68],'녹색 선택 버튼')],texts=['대응 방식 선택','문을 열어 수용하기','바로 방전하기','선택'],states=['왼쪽 카드 선택 브래킷','오른쪽 카드 커서 표시. 선택 상태 변경 결과 미확인.'],notes=['105초의 두카드+설명+선택은 대화판과 다른 판틀. 선택 분기 결과는 미확인.'],times=[105],refs=[frame01(105)]),
'TS08':dict(label='습격 예고 / 이동 안내',kind='modal',category='영지·건설',children=['BlurScrim','RaidFrame','EnemyKeyArt','WarningRibbon','Countdown','RequirementText','RewardRow','InstructionText','GoButton','CloseButton','OutsideDismissHint'],regions=[reg('블러 배경',[0,0,504,894],'영지 유지'),reg('경고판',[37,150,431,632],'거대 적 아트·경고리본·타이머·조건·보상·이동안내'),reg('이동 CTA',[85,686,335,65],'주황 이동하기'),reg('닫기 안내',[175,861,166,29],'빈 곳을 탭하여 닫기')],texts=['곧 습격이 시작됩니다.','00:58:41','발전소 5레벨 달성(2/5)','이동하기','빈 곳을 탭하여 닫기'],states=['타이머/달성 수치는 표시 상태. 실제 시간 정책은 미확인.'],notes=['이동하기·X·배경닫기 표시. 다음 샘플에서 영지 복귀만 확인되며 어떤 입력으로 닫았는지 미확인.'],times=[225],refs=[frame01(225)])
}
# Stable family IDs describe geometry, not source order or changing game contents.
defn=[
('TS01',None,None),('TS02',None,None),('TS03','TSV02-F01','TSV03-01'),('TS04','TSV02-F15',None),('TS05','TSV02-F03','TSV03-07'),('TS06',None,None),('TS07','TSV02-F04','TSV03-08'),('TS08',None,None),('TS09','TSV02-F12','TSV04-01'),('TS10','TSV02-F05',None),('TS11','TSV02-F06','TSV03-02'),('TS12','TSV02-F07',None),('TS13','TSV02-F08',None),('TS14','TSV02-F09',None),('TS15','TSV02-F10','TSV03-13'),('TS16','TSV02-F11','TSV03-11'),('TS17','TSV02-F13','TSV04-02'),('TS18','TSV02-F14',None),('TS19','TSV02-F17',None),('TS20','TSV02-F18',None),('TS21','TSV02-F19',None),('TS22','TSV02-F20','TSV03-06'),('TS23','TSV02-F22',None),('TS24','TSV02-F23','TSV03-10'),('TS25','TSV02-F24','TSV03-04'),('TS26','TSV02-F25','TSV03-05'),('TS27','TSV02-F26',None),('TS28','TSV02-F27','TSV03-12'),('TS29',None,'TSV03-03'),('TS30',None,'TSV03-14'),('TS31',None,'TSV03-15')]
mapid={x:sid for sid,aa,bb in defn for x in [aa,bb] if x}
mapid.update({'TSV02-F02':'TS03','TSV02-F16':'TS03','TSV02-F28':'TS03','TSV02-F21':'CIN03','TSV03-09':'CIN03'})
labels={'TS03':'영지 / 월드 공통 HUD','TS05':'건물 내부 / 가구 선택','TS07':'건물 업그레이드 조건','TS09':'챕터 미션 노트','TS10':'일반 건물 업그레이드 성공','TS11':'발전소 레벨 증가 기록판','TS12':'지휘관 정보 편집','TS13':'생존자 파견','TS14':'생존자 수용','TS15':'근거지 편지함','TS16':'주민 자원 교환','TS17':'챕터 완료 보상','TS18':'신규 챕터 소개 카드','TS19':'소대 설정 / 출전','TS20':'전투 HUD','TS21':'전투 승리 / 통계','TS22':'영웅 모집','TS23':'신규 영웅 해제 소개','TS24':'모집 결과 / 재모집','TS25':'영웅 보유 목록','TS26':'영웅 상세 / 성장','TS27':'신규 기능 해제 배너','TS28':'친밀도 상승 보상','TS29':'채팅','TS30':'생존자 도감','TS31':'생존자 프로필 / 이야기'}
kind={'TS03':'screen','TS04':'sheet','TS05':'sheet','TS07':'sheet','TS09':'modal','TS10':'overlay','TS11':'overlay','TS12':'modal','TS13':'sheet','TS14':'modal','TS15':'screen','TS16':'modal','TS17':'overlay','TS18':'overlay','TS19':'screen','TS20':'screen','TS21':'screen','TS22':'screen','TS23':'screen','TS24':'screen','TS25':'screen','TS26':'screen','TS27':'overlay','TS28':'overlay','TS29':'screen','TS30':'screen','TS31':'modal'}
category={**{x:'영지·건설' for x in ['TS03','TS05','TS07','TS10','TS11']},**{x:'서사·주민' for x in ['TS12','TS13','TS14','TS15','TS16','TS28','TS29','TS30','TS31']},**{x:'챕터' for x in ['TS09','TS17','TS18','TS27']},**{x:'전투' for x in ['TS19','TS20','TS21']},**{x:'영웅' for x in ['TS22','TS23','TS24','TS25','TS26']}}
# Regions for families without a TSV03/04 measured observation. These are broad visual approximations.
regions={
'TS10':[reg('제목',[100,80,310,52],'건물명·업그레이드 성공'),reg('레벨리본',[24,245,456,110],'붉은 Lv 리본'),reg('증가/보상',[24,390,456,241],'전후 수치·보상카드'),reg('닫기 안내',[150,806,230,53],'아무 곳 터치')],
'TS12':[reg('모달 헤더',[26,56,456,61],'지휘관 정보·X'),reg('닉네임',[51,129,410,193],'길이안내·입력·문자제한'),reg('성별',[51,330,410,192],'남/여/기타/없음'),reg('제출',[83,687,338,67],'회색 무료 버튼')],
'TS13':[reg('배경 영지',[0,0,504,212],'영지/토스트'),reg('패널 헤더',[0,213,504,61],'생존자·도움말·편지함'),reg('상태 요약',[12,280,480,134],'인원·작업/휴식/아픔/파업'),reg('파견 목록',[14,416,478,310],'건물별 인원·−/+'),reg('자동 파견',[80,729,342,69],'녹색 CTA'),reg('탭/뒤로',[0,810,504,84],'뒤로·파견·속성상세')],
'TS14':[reg('클립보드',[6,52,492,784],'클립·X·생존자수용'),reg('정원비교',[16,200,474,101],'인구/침대'),reg('대기주민',[38,311,443,224],'초상·이름·선택체크'),reg('하단상태/CTA',[24,725,458,88],'정원부족 안내와 이동/수용 CTA')],
'TS18':[reg('월드 딤',[0,0,504,894],'영지 차광'),reg('챕터 소개',[15,267,476,217],'가로 삽화·챕터번호·제목')],
'TS19':[reg('소대 헤더',[0,0,504,116],'소대설정·양측 초상/전투력·사건'),reg('배치 장면',[0,116,504,467],'적레벨·아군 배치칸'),reg('후보 트레이',[0,584,504,231],'초상·레벨·선택체크'),reg('행동',[0,816,504,78],'뒤로·일괄출전·출격')],
'TS20':[reg('사건 헤더',[0,0,504,67],'양측 전투력·초상·사건'),reg('전장',[0,67,504,704],'캐릭터·HP·스킬 효과'),reg('전투 보조',[17,600,472,131],'일시정지·자동·배속'),reg('스킬 도크',[154,770,249,124],'2~3인 초상·쿨다운·게이지')],
'TS21':[reg('승리 연출',[0,0,504,352],'캐릭터·승리 제목'),reg('통계 탭',[40,353,427,51],'공격&치료/받은데미지'),reg('영웅 통계',[40,410,427,175],'초상·이름·막대·수치'),reg('복귀',[83,772,339,65],'근거지 복귀')],
'TS23':[reg('영웅소개',[0,0,504,657],'신규영웅·희귀도·인물·배경'),reg('이름/스킬',[28,655,448,170],'역할·이름·3스킬'),reg('계속',[140,840,230,40],'터치 계속')],
'TS27':[reg('월드딤',[0,0,504,894],'영지 유지'),reg('해제리본',[0,242,504,204],'새로운 기능 해제·아이콘·이름'),reg('닫기안내',[101,748,315,38],'아무 곳 터치 닫기')]
}
manual_controls={
'TS01':['고객센터','설정','계정'], 'TS02':['X','서비스 이용약관 링크','개인정보 처리방침 링크','시작하기','모두 동의하고 시작하기'], 'TS04':['다음 삼각','스킵'], 'TS06':['왼쪽 선택카드','오른쪽 선택카드','선택'], 'TS08':['이동하기','X','빈 곳 닫기'],
'TS10':['화면 터치 닫기'], 'TS12':['닉네임 입력','남/여/기타/없음 선택','무료','X','빈 곳 닫기'],'TS13':['건물별 −/+','자동 파견','근거지 편지함','속성 상세정보','뒤로'],'TS14':['주민 초상 선택','침대 확장 이동','생존자 수용','X','도움말','빈 곳 닫기'],'TS18':[], 'TS19':['일괄 출전','출격','후보 영웅','배치 슬롯','뒤로'],'TS20':['일시정지','자동','x1 배속','영웅 스킬'],'TS21':['공격&치료 탭','받은데미지 탭','근거지 복귀'],'TS23':['화면 터치 계속','스킬 미리보기'], 'TS27':['화면 터치 닫기']}
manual_links={
'TS03':[('TS05','건물 선택','TSV01',[90,95],'건물 내부 패널로 전환, 실제 입력 이벤트 로그 없음'),('TS09','퀘스트 입구','TSV02',[165,169],'두루마리 입구 다음 챕터 노트 표시'),('TS25','하단 영웅','TSV02',[294,296],'영웅 입구 다음 목록 표시')],
'TS04':[], 'TS05':[('TS07','업그레이드','TSV02',[17,18],'건물 헤더 다음 업그레이드 조건 표시')],
'TS09':[('TS17','모두 수령','TSV02',[171,174],'수령 뒤 챕터 보상 연출')],
'TS13':[],
'TS14':[('TS03','생존자 수용','TSV02',[125,126],'수용가능 모달 다음 월드의 생존자+2 피드백')],
'TS17':[('TS18','다음 챕터 연출','TSV02',[174,176],'보상 뒤 소개 카드. 입력 여부 미확인')],
'TS19':[('TS20','출격','TSV02',[210,215],'출격 다음 전투 HUD')],
'TS20':[('TS21','전투 종료','TSV02',[220,226],'전투 종료 뒤 승리 통계')],
'TS21':[('TS03','근거지 복귀','TSV02',[226,230],'복귀 뒤 영지 피드백')],
'TS22':[('CIN03','모집','TSV02',[272,275],'모집 뒤 열차 연출'),('CIN03','모집','TSV02',[307,308],'고급 모집 뒤 열차 연출')],
'TS23':[('TS24','화면 터치 계속 표시','TSV02',[288,290],'신규영웅 소개 뒤 모집 결과. 터치 안내와 순서 관찰, 정확 입력 미확인')],
'TS24':[('TS22','뒤로','TSV02',[326,328],'모집 결과 뒤 모집 로비')],
'TS25':[('TS26','영웅 카드','TSV02',[300,302],'카드 선택 뒤 상세'),('TS22','모집','TSV02',[306,307],'목록 모집 입구 뒤 모집 화면')],
'TS26':[('TS25','뒤로','TSV02',[305,306],'상세 뒤 목록')],
'TS27':[('TS03','아무 곳 터치 닫기 표시','TSV02',[357,358],'기능 배너 뒤 영지. 정확 입력 미확인')],
'TS28':[('TS15','편지함으로','TSV02',[444,445],'관계보상 뒤 근거지 편지함')]
}
# Additional video1 evidence is integrated into existing structural families.
video1={
'TS03':dict(times=[50,75,80,85,115,120,125,130,150,155,160,165,185,190,195,205,230,235,250,255,260,265,270],refs=[frame01(50)]),
'TS05':dict(times=[95,175,200,275],refs=[frame01(95),frame01(200)]),
'TS07':dict(times=[210,215,220],refs=[frame01(210),frame01(215)]),
'TS09':dict(times=[240],refs=[frame01(240)])}
# Evidence-backed sample matching. No reuse was applied to the target design.
match={
'TS03':[('Page_Capybara_Lobby','HUD·정적장면·좌우입구·하단내비','타일/건물 조작·건설 상태는 신규')],
'TS04':[('Page_Capybara_Adventure','장면과 로그 텍스트 분리','화자 반신·이름·다음/스킵 판틀 신규')],
'TS05':[('Page_Build_City','상단 장면과 하단 가격카드 분리','가구레일·건물 통계/진행·선택지 구조 신규')],
'TS07':[('Page_Build_City','건설 관련 상하부 분리·독립 가격글자','조건행·혜택행·충족/미충족 CTA 신규')],
'TS09':[('Popup_Capybara_SevenDay','헤더·세로과제 목록·고정보상','챕터 노트 원화와 각 미션 상태 신규'),('Modal_Wins_QuickWins','클립보드·과제행·하단 보상','상호작용/본문/논리크기 다름'),('Page_Capybara_Continent','미션행의 진행·보상·이동 분리','페이지를 모달로 재구성 필요')],
'TS17':[('Popup_Capybara_ChestReward','보상·딤·터치닫기 구조','챕터 축하헤더/다중보상 배치 신규')],
'TS19':[('Page_Capybara_Equipment','초상/카드/스탯/스크롤 분리','장비 UI이며 배치칸·소대 설정은 없음')],
'TS20':[('Page_Capybara_Adventure','장면·전투수치·행동버튼 분리','실제 전투·HP앵커·스킬도크 없음')],
'TS22':[('Page_Capybara_Chests','중앙표현·재화·종류탭·뽑기 CTA','모집 아트·무료/쿨다운·기록 UI 신규')],
'TS23':[('Popup_Capybara_ChestReward','획득 결과와 터치닫기 분리','전면 영웅/희귀도/스킬 구조 신규')],
'TS24':[('Popup_Capybara_ChestReward','결과카드·독립글자','희귀도·재모집·상단 재화·체크박스 신규')],
'TS25':[('Page_Capybara_Equipment','카드/그리드/스크롤/알림부품','5열 장비목록이며 4열 영웅필터·조각상태 신규')],
'TS26':[('Page_Capybara_Equipment','캐릭터/스탯/하단목록 분리','성장/EXP/성급/탭·상한조건 신규')],
'TS28':[('Page_Capybara_Talents_Upgrade','현재값→증가값 피드백 부품','친밀도/주민/관계/편지함 CTA 신규')],
'TS30':[('Page_Capybara_Equipment','초상 그리드 분리','주민 3열/관계/상자/공통하단 신규')],
'TS31':[('Page_Capybara_Adventure','텍스트 서사 영역 분리','주민 프로필·장문·스토리탭 구조 신규')]
}
sampleby={x['screenName']:x for x in samples['screens']}
selected_names=sorted({x[0] for v in match.values() for x in v})
selected_parts=[x for x in parts['screens'] if x['name'] in selected_names]
(OUT/'sample-evidence.json').write_text(json.dumps(dict(provenance=samples['provenance'],screens=selected_parts),ensure_ascii=False,indent=2))
manifest=[]
def copyref(r,family,ordinal,label='대표'):
 p=Path(r.get('referenceCopySource',r['sourceFrame'])); sec=r['requestedSeconds']; fn=f"{family}_{ordinal:02}_{r['videoId']}_{sec:07.2f}s.jpg"
 dst=REF/fn; shutil.copy2(p,dst)
 item={**r,'id':f'{family}-R{ordinal:02}','familyId':family,'role':label,'file':f'references/{fn}','width':504,'height':894,'usage':'analysis-reference-only','sha256':digest(dst),'copiedFrom':str(p)}
 manifest.append(item);return item
families=[]
for sid,aa,bb in defn:
 A=a_by.get(aa);B=b_by.get(bb); C=custom.get(sid)
 f=dict(id=sid,label=labels.get(sid,C['label'] if C else sid),kind=kind.get(sid,C['kind'] if C else 'screen'),category=category.get(sid,C['category'] if C else '기타'),status='planned',reviewStatus='제안(검수 대기)',coordinateSpace=dict(width=504,height=894,unit='reference pixels',evidence='영상 육안 근사 영역; 터치영역·Unity RectTransform·브라우저 실측 아님'),sourceObservations=[],references=[],regions=[],controls=[],states=[],observedLinks=[],plannedLinks=[],unverified=[],existingSampleMatches=[])
 refs=[]
 if C:
  refs+=C['refs'];f['regions']=C['regions'];f['visibleTexts']=C['texts'];f['states']+=C['states'];f['unverified']+=C['notes'];f['sourceObservations'].append(dict(sourceId='TSV01',sourceLocalId=f'TSV01-{sid}',seenSeconds=C['times'],evidenceType='direct frame inspection',entry='영상 순서 관측, 입력 코드 없음'))
 if A:
  f['sourceObservations'].append(dict(sourceId='TSV02',sourceLocalId=aa,seenSeconds=A['seen_seconds'],evidenceType='sibling inventory + selected direct frame checks',entry=A['entry_observation'],returnObservation=A['close_or_return_observation'],observation=A['layout_observation']))
  f.setdefault('visibleTexts',[]).extend(A['observed_texts']);f['states']+=A['state_variants'];f['unverified']+=A['notes']+[A['close_or_return_observation']]
  if sid not in ['TS04','TS11','TS17']:refs.append(frameA(aa))
 if B:
  f['sourceObservations'].append(dict(sourceId=B['videoId'],sourceLocalId=bb,seenSeconds=[B['reference']['timeSeconds']]+[x['timeSeconds'] for x in B['states'] if 'timeSeconds' in x],evidenceType='sibling observed inventory',entry=B['entryObserved'],returnObservation=B['returnObserved']))
  f['regions']=B['regions'];f.setdefault('visibleTexts',[]).extend(B['visibleTexts']);f['states']+=B['states'];f['unverified']+=B['notes']
  if sid in ['TS11','TS17','TS29','TS30','TS31']:refs.append(frameB(bb))
  for ctl in B['controls']:
   confidence='unverified' if '미확인' in ctl['evidence'] else 'sequence_observed'
   target=mapid.get(ctl.get('targetId'))
   f['controls'].append(dict(label=ctl['label'],targetFamilyId=target,confidence=confidence,evidence=ctl['evidence'],sourceId=B['videoId']))
   if confidence=='sequence_observed' and target:
    f['observedLinks'].append(dict(action=ctl['label'],targetId=target,sourceId=B['videoId'],evidence=ctl['evidence'],confidence='sequence_observed',eventLogVerified=False))
 if sid in video1:
  v=video1[sid];f['sourceObservations'].append(dict(sourceId='TSV01',sourceLocalId=f'TSV01-{sid}',seenSeconds=v['times'],evidenceType='direct frame inspection'));refs+=v['refs']
 if not f['regions']:f['regions']=regions.get(sid,[reg('원본 화면',[0,0,504,894],'세부는 대표 참조와 관측 원문 확인')])
 for ctl in manual_controls.get(sid,[]):f['controls'].append(dict(label=ctl,targetFamilyId=None,confidence='visible_only',evidence='해당 대표 프레임에 표시. 입력결과는 관측 연결에 적힌 범위만.',sourceId=f['sourceObservations'][0]['sourceId']))
 for target,action,vid,ts,e in manual_links.get(sid,[]):
  f['observedLinks'].append(dict(action=action,targetId=target,sourceId=vid,timeRangeSeconds=ts,evidence=e,confidence='sequence_observed',eventLogVerified=False))
 # Retain a small number of state examples that materially explain this family.
 if sid=='TS07':refs.append(frameA(aa,1));f['states'].append('TSV01 210/215/220초 모두 조건 미충족·회색 CTA; 215초는 손 표시 변형. TSV02 101초 녹색 CTA는 조건 충족.')
 if sid=='TS14':refs.append(frameA(aa,1))
 if sid in ['TS22','TS24','TS25','TS26']:refs.append(frameA(aa,1))
 if sid=='TS16':refs.append(frameB(bb))
 if sid=='TS09':refs.append(frameB(bb))
 if sid=='TS28':refs.append(frameB(bb))
 for i,r in enumerate(refs,1):f['references'].append(copyref(r,sid,i,'대표' if i==1 else '상태/중복 통합 근거'))
 extra_children={'TS29':['ChatHeader','ChannelTabs','MessageFeedScroll','SystemBanner','MessageRow','Portrait','MessageBubble','TranslationButton','ComposeBar','TextInput','EmojiButton','SendButton','BackButton'],'TS30':['SurvivorCatalogHeader','ProgressBanner','RosterHeader','SurvivorGrid','SurvivorCard','RelationLabel','ClaimAllButton','BottomTabs','BackButton'],'TS31':['BlurScrim','CloseButton','SurvivorProfileCard','Portrait','SurvivorName','AgeLabel','OccupationLabel','JoinedAtLabel','RelationLabel','StoryBodyText','StoryTabs','StoryRewardButton','OutsideDismissHint']}
 children=(extra_children.get(sid) or (C['children'] if C else (A['proposed_children'] if A else [re.sub('[^A-Za-z0-9]','',B['id'])+'Body','Header','BackButton','Content','BottomTabs'])))
 rootname=('Page_TSV_Territory' if sid=='TS03' else {'screen':'Page','modal':'Modal','sheet':'Sheet','overlay':'Overlay'}[f['kind']]+'_TSV_'+sid)
 def node(name):
  typ='text' if any(x in name for x in ['Text','Title','Label','Name','Hint','Number','Countdown','Duration']) else ('button' if any(x in name for x in ['Button','Toggle','Checkbox','Tab']) else ('image' if any(x in name for x in ['Portrait','Art','Icon','Stage','Background','Emblem']) else 'group'))
  n=dict(name=name,kind=typ,status='planned')
  if typ=='button':n['children']=[dict(name='Img_'+name+'_Skin',kind='image',status='planned'),dict(name='Txt_'+name+'_Label',kind='text',status='planned')]
  return n
 f['plannedComponentHierarchy']=dict(evidence='제작 제안. 실제 원본 Unity 계층 아님. 대상 도구에는 이 계층을 아직 조립하지 않음.',root=dict(name=rootname,kind=f['kind'],children=[node(n) for n in children]),dataBindings=(A['proposed_pass_data'] if A else ['contentId','visibleTexts','selectionState','enabledState','displayValues']),nativeTextSeparate=True,nineSliceCandidates=[n for n in children if any(x in n for x in ['Frame','Panel','Ribbon','Button','Tab'])],nineSliceRule='장식 모서리/끝단 보존. 슬라이스 경계는 새 원화 제작 후 정하며 원본 JPG를 자르지 않음.',buttonStateRule='normal/pressed 공통 캔버스·기준점, native 글자는 별도. disabled/selected는 관측된 상태만 예시로 연결; 미관측 눌림 원화는 신규 제작 제안.',engineBoundary='게임 계산/실계정/결제/전투/타이머는 연결 예시용 fixture. 전체 게임 구동 범위 아님.')
 for name,reuse,diff in match.get(sid,[]):
  s=sampleby[name];src=next(q for q in samples['provenance']['sources'] if q['sample']==s['sample'])
  f['existingSampleMatches'].append(dict(status='candidate-not-applied',matchType='component/layout pattern; visual equality unverified',screenName=name,reuseScope=reuse,requiredChanges=diff,actualData=dict(sample=s['sample'],workspaceId=src['workspaceId'],projectId=s['projectId'],revision=s['revision'],screenId=s['screenId'],logicalSize=[s['logicalW'],s['logicalH']],elementCount=s['elements'],rootRegions=s['rootRegions'],buttonCount=s['buttonCount'],fontSizes=s['fontSizes'],explicitButtonStateCount=s['explicitButtonStateCount'],outgoingTransitionCount=s['outgoingTransitions'],sourcePath=src['source'],sourceSha256=src['sha256'],sourceJsonPointer=s['sourceJsonPointer'],sourceLine=s['sourceLine'],evidenceFile='sample-evidence.json')))
 for link in f['observedLinks']:
  payload_keys=({'TS03':['selectedBuildingId'],'TS05':['buildingId'],'TS07':['buildingId','requirementsFixture'],'TS09':['chapterId'],'TS14':['selectedSurvivorIds'],'TS16':['survivorId','tradeFixture'],'TS19':['encounterId','formationFixture'],'TS20':['encounterId','resultFixture'],'TS22':['recruitPoolId','resultFixture'],'TS24':['recruitPoolId'],'TS25':['heroId'],'TS26':['heroId'],'TS28':['survivorId']}.get(sid, ['contentId']))
  f['plannedLinks'].append(dict(action=link['action'],targetId=link['targetId'],status='planned-example-not-applied',payloadKeys=payload_keys,condition='observed state fixture only; game logic unimplemented'))
 if sid=='TS13':f['plannedLinks'].append(dict(action='편지함 입구',targetId='TS15',status='planned-example-unverified-source-entry',payloadKeys=['baseId'],condition='표시된 입구를 이용하는 제작 예시. 영상에서 정확 클릭 시점 미확인'))
 for obs in f['sourceObservations']:
  mapid.setdefault(obs['sourceLocalId'],sid)
 f['unverified']+=['원본 서체명·정확한 폰트 크기·9slice 경계·입력 hitbox·원본 엔진 계층 미확인.','UI 원화 신규제작/대상 도구 실제 부품 조립/상태·연결 적용/반응형·키보드 실검수는 미완료.']
 f['visibleTexts']=list(dict.fromkeys(f.get('visibleTexts',[])))
 families.append(f)

cinematics=[dict(id='CIN01',label='초기 3D 도입 / 울타리 방어 연출',classification='reference-cinematic',status='reference-only',sourceId='TSV01',seenSeconds=[25,30,35,40,45,100,110,135,140,145],references=[copyref(frame01(30),'CIN01',1)],observedControls=['스킵'],notes=['3D 장면의 인물·카메라·방어 연출은 새 제작 UI 가족으로 세지 않음. 말풍선·스킵은 공통 부품으로만 제안.']),dict(id='CIN02',label='설계 노트 열림 연출',classification='reference-cinematic',status='reference-only',sourceId='TSV01',seenSeconds=[65,70],references=[copyref(frame01(65),'CIN02',1),copyref(frame01(70),'CIN02',2)],observedControls=[],notes=['닫힌 표지→도면 한 시퀀스. 선택/탭/입력 UI는 보이지 않아 제작 가족에서 제외. 선택적 정지 참조 연출.']),dict(id='CIN03',label='모집 열차 연출',classification='reference-cinematic',status='reference-only',sourceId='TSV02',alsoSeenIn=['TSV03'],seenSeconds=a_by['TSV02-F21']['seen_seconds'],references=[copyref(frameA('TSV02-F21'),'CIN03',1),copyref(frameB('TSV03-09'),'CIN03',2)],observedControls=['스킵'],notes=['일반/고급 문·광원·철로는 같은 연출 단계. 프레임 증가 금지. 영상 재생 제작은 미완료.'],observedLinks=[dict(targetId='TS24',sourceId='TSV03',timeRangeSeconds=[70,72],action='스킵 부근 커서/결과 등장',confidence='sequence_observed',eventLogVerified=False),dict(targetId='TS23',sourceId='TSV02',timeRangeSeconds=[281,283],action='일반 첫 모집 연출 종료',confidence='sequence_observed',eventLogVerified=False)])]
components=[]
for cid,sourceid,label,hosts in [('COMP01','TSV02-F02','월드 포인트 / 비용 / 건물 타이머',['TS03','TS05']),('COMP02','TSV02-F16','튜토리얼 손 / 말풍선 / 강조',['TS03','TS05','TS07','TS14','TS19','TS25','TS26']),('COMP03','TSV02-F28','토스트 / 부유 보상 / 완료 피드백',['TS03','TS05','TS20','TS25','TS26'])]:
 s=a_by[sourceid];components.append(dict(id=cid,label=label,status='planned-component',sourceLocalId=sourceid,hosts=hosts,observations=s['layout_observation'],states=s['state_variants'],seenSeconds=s['seen_seconds'],plannedChildren=s['proposed_children'],notes=s['notes'],familyCountContribution=0))
components.append(dict(id='COMP04',label='축하 공통 장식',status='planned-component',hosts=['TS10','TS11','TS17','TS27','TS28'],plannedChildren=['DimOrBlurScrim','Title','LevelOrCongratulationsRibbon','Confetti','RewardCard','TapHint'],notes=['폭죽/보상 비행/제목만 변화하는 장면은 새 가족이 아님. 중앙 몸체가 다른 경우에만 TS10/11/17/27/28로 나눔.'],familyCountContribution=0))
input_files=['video-a2/inventory.json','video-b/inventory.json','sample-match/inventory.json','sample-match/match-candidates.md','sample-match/selected-layout-evidence.md','sample-match/candidate-parts.json','TSV01/frames/index.json']
sources=[dict(id='TSV01',name='타일 서바이벌 영상1',durationSeconds=275.245,dimensions=[504,894],evidence='TSV01 contact-1..3 전체 및 선택 개별 프레임 직접 관찰',frameIndex=str(BASE/'TSV01/frames/index.json')),dict(id='TSV02',name=a['source_name'],path=a['source_path'],durationSeconds=a['source_duration_seconds'],dimensions=[504,894],evidence='video-a2 28군 관측 원문과 선택 대표 직접 관찰',frameIndex=str(BASE/'TSV02/frames/index.json'))]+[dict(id=s['id'],name=s['displayName'],path=s['path'],durationSeconds=s['durationSeconds'],dimensions=s['dimensions'],evidence='video-b 관측 원문. 별도 코드/입력 로그 아님.',frameIndex=str(BASE/f"video-b/{s['id']}/fine/index.json")) for s in b['sources']]
catalog=dict(schemaVersion='1.0',title='타일 서바이벌 · 4영상 UI 관측/제작 카탈로그',createdAtKST=created,author='codex(단이)',status='planned',reviewStatus='제안(검수 대기)',purpose='GUI 부품 계층·텍스트 분리·9slice·상태·연결을 배우고 재사용하는 UI스튜디오 샘플의 제작 계획',familyCount=len(families),referenceCinematicCount=len(cinematics),componentGroupCount=len(components),targetActual=dict(workspaceId='nativeworkspace-76e57701-a74e-4e37-a4f6-9e83c12cd6fc',projectId='ux-25ecc98a',revision=1,registeredScreenName='Page_TSV_Territory',logicalSize=[504,894],componentCount=0,status='empty screen saved by parent; this catalogue does not assemble UI'),sources=sources,inputProvenance=[dict(path=str(BASE/p),sha256=digest(BASE/p)) for p in input_files],sampleProvenance=samples['provenance'],coordinateRule='모든 boundsPx는 504×894 참조 프레임의 육안 근사 구역. 실제 터치영역/엔진 좌표가 아님.',evidenceRule='sequence_observed는 영상 장면 순서/커서와 결과를 관찰한 것. 실제 입력 코드·이벤트 로그 검증 아님. visible_only/unverified와 구분.',assetRule='모든 references JPG는 원본 프레임 픽셀을 보존한 analysis-reference-only. 이를 자르거나 UI 원화/제품 자원으로 제공하지 않음. UI 원화는 별도 신규 제작.',deduplicationRules=['동일 틀의 이름·건물·주민·수치·색·아이템·목록 길이 변화는 상태/데이터로 통합','영웅 모집 일반/고급·무료/소진은 TS22, 결과 영웅/조각은 TS24','영웅 목록/상세는 TS25/26으로 영상2·3 통합','제이슨 교환은 TS16, 친밀도 상승은 TS28으로 영상2·3 통합','스토리 대화는 TS04, 생존자 프로필/스토리탭은 TS31로 서로 다른 구조','HUD·타이머·튜토리얼손·작은 말풍선·부유피드백은 공통부품/상태','순수 3D/열차/노트 펼침은 reference cinematic으로 분리, UI 가족 수에 제외','OS Google Play 알림·Steam/Shift+Tab·커서·뷰어 툴팁은 게임 UI 제외'],families=families,sharedComponents=components,referenceCinematics=cinematics,sourceLocalIdMap=mapid,notVerified=['실제 원본 Unity hierarchy/폰트/9slice 경계/정확 hitbox','원본 전체 UI를 빠짐없이 본다는 보장: TSV01 5초 샘플 사이 짧은 UI 누락 가능','기존 샘플은 저장 JSON 계층/크기/폰트/연결 데이터 관측이며 이번 영상과 시각동등 검수 아님','목적지/행동 결과가 보이지 않은 컨트롤과 실제 게임 로직','타일서바이벌 도구 부품 조립·저장·화면간 연결·이미지 신규제작·반응형·입력 실검수','영상 관측 수치/문구는 fixture이며 제품 발란스 승인값 아님'])
(OUT/'catalog.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2))
(OUT/'timestamp-manifest.json').write_text(json.dumps(dict(createdAtKST=created,usage='analysis-reference-only',images=manifest),ensure_ascii=False,indent=2))

# Static, locally portable gallery. Filtering is the only script; no app/server/network state writes.
esc=lambda v:html.escape(str(v),quote=True)
def lis(xs):return '<ul>'+''.join('<li>'+esc(x if isinstance(x,str) else json.dumps(x,ensure_ascii=False))+'</li>' for x in xs)+'</ul>'
def shots(refs):return '<div class="shots">'+''.join(f'<figure><a href="{esc(r["file"])}"><img loading="lazy" width="504" height="894" src="{esc(r["file"])}" alt="{esc(r["familyId"]+" "+r["role"])}"></a><figcaption>{esc(r["videoId"])} · 요청 {r["requestedSeconds"]:g}s / 실제 {r["actualSeconds"]:.5f}s<br>{esc(r["role"])} · 분석참조</figcaption></figure>' for r in refs)+'</div>'
def linklist(links):
 if not links:return '<p class="muted">확인된 연결 없음. 컨트롤 표시와 결과를 구분합니다.</p>'
 return '<ul>'+''.join(f'<li>{esc(l["sourceId"])} · {esc(l["action"])} → <a href="#{esc(l["targetId"])}">{esc(l["targetId"])}</a> · {esc(l.get("timeRangeSeconds","시간은 근거 문장 참조"))}<br><span class="muted">{esc(l["evidence"] if "evidence" in l else "영상 시퀀스 관찰")} · 실제 이벤트 로그 미확인</span></li>' for l in links)+'</ul>'
def familyhtml(f):
 source=' / '.join(o['sourceId'] for o in f['sourceObservations'])
 h=f'<article id="{f["id"]}" data-kind="{f["kind"]}" data-category="{esc(f["category"])}" data-sources="{esc(source)}"><h2>{f["id"]} · {esc(f["label"])}</h2><p class="tag">{f["kind"]} · {esc(f["category"])} · {esc(source)} · planned</p>'+shots(f['references'])
 h+='<details><summary>관측 구역 / 컨트롤 / 상태</summary><h3>참조 구역 · 504×894 육안 근사</h3><div class="table-wrap"><table><thead><tr><th>구역</th><th>x,y,w,h</th><th>관찰</th></tr></thead><tbody>'+''.join(f'<tr><td>{esc(r["name"])}</td><td>{esc(r["boundsPx"])}</td><td>{esc(r["observedContent"])}</td></tr>' for r in f['regions'])+'</tbody></table></div><h3>보이는 문구</h3>'+lis(f['visibleTexts'])+'<h3>컨트롤 · 관측확도</h3>'+lis([f"{c['label']} · {c['confidence']} · {c['evidence']}" for c in f['controls']])+'<h3>상태 / 데이터 변형</h3>'+lis(f['states'])+'</details>'
 h+='<h3>영상 관찰 연결</h3>'+linklist(f['observedLinks'])+'<details><summary>제작할 연결 예시 / 전달값</summary><p>planned · 대상 도구에 적용하지 않은 예시입니다.</p><pre>'+esc(json.dumps(f['plannedLinks'],ensure_ascii=False,indent=2))+'</pre></details>'
 h+='<details><summary>제작할 부품 계층 / 텍스트 / 9slice</summary><p class="warning">제작 제안이며 원본 Unity 계층·대상 실제 조립 결과가 아닙니다.</p><pre>'+esc(json.dumps(f['plannedComponentHierarchy'],ensure_ascii=False,indent=2))+'</pre></details>'
 h+='<details><summary>기존 샘플 실제 데이터 / 재사용 후보</summary>'
 if not f['existingSampleMatches']:h+='<p>지정 기존 샘플에서 직접 대응하는 판틀을 확인하지 못했습니다. 공통 버튼/글자/프레임 부품만 재사용 검토합니다.</p>'
 for m in f['existingSampleMatches']:
  d=m['actualData'];h+=f'<h3>{esc(m["screenName"])} · {esc(d["projectId"])} r{d["revision"]}</h3><p>재사용 후보: {esc(m["reuseScope"])}<br>새로 바꿀 부분: {esc(m["requiredChanges"])}</p><p>{d["logicalSize"]} · {d["elementCount"]}부품 · {d["outgoingTransitionCount"]}연결 · 폰트 {esc(d["fontSizes"])} · 명시 버튼상태 {d["explicitButtonStateCount"]}</p><pre>{esc(json.dumps(d,ensure_ascii=False,indent=2))}</pre>'
 h+='<p><a href="sample-evidence.json">원본 저장 데이터에서 추출한 계층·크기·폰트·상태·연결 JSON</a></p></details>'
 h+='<details><summary>원본 타임코드 / 출처</summary><pre>'+esc(json.dumps(f['sourceObservations'],ensure_ascii=False,indent=2))+'</pre>'+lis([f"{r['id']} · {r['sourceFrame']} · index={r['sourceIndex']}" for r in f['references']])+'</details>'
 h+='<details><summary>미확인 / 제작 미완료</summary>'+lis(f['unverified'])+'</details><p><a href="#top">목록 위로</a></p></article>'
 return h
css='''*{box-sizing:border-box}body{font:16px/1.65 system-ui,sans-serif;max-width:1400px;margin:30px auto;padding:0 20px;color:#1d3040;background:#f4f2ec}h1{font-size:30px;line-height:1.3}h2{font-size:24px}h3{font-size:17px;margin:20px 0 8px}a{color:#075e91}nav{display:flex;flex-wrap:wrap;gap:8px;margin:20px 0}nav a,.tag{background:white;border:1px solid #d4dad9;border-radius:7px;padding:5px 9px}article,.panel{background:white;border:1px solid #d8dcda;border-radius:14px;padding:22px;margin:20px 0;scroll-margin-top:20px}.warning{background:#fff2cc;border-left:4px solid #bd8400;padding:13px}.muted{color:#596b77}.tag{font-size:14px;display:inline-block}.shots{display:flex;gap:14px;overflow-x:auto;align-items:start;padding-bottom:12px}figure{margin:0;flex:0 0 252px}img{display:block;width:252px;height:auto;border:1px solid #d5d7d7;border-radius:6px}figcaption{font-size:13px;line-height:1.5;padding-top:7px}details{border-top:1px solid #dfe3e0;padding:12px 0}summary{cursor:pointer;font-weight:600}pre{background:#f2f5f4;padding:14px;border-radius:6px;font-size:12px;white-space:pre-wrap;overflow-wrap:anywhere}li{margin:6px 0;overflow-wrap:anywhere}.table-wrap{overflow:auto}table{border-collapse:collapse;width:100%;font-size:14px}td,th{text-align:left;padding:8px;border-bottom:1px solid #ddd;vertical-align:top}td:nth-child(2){white-space:nowrap}label{display:flex;gap:7px;align-items:center;flex-wrap:wrap}input,select{font:inherit;padding:8px;border:1px solid #aab9c0;border-radius:6px;min-width:0}input{flex:1;min-width:160px}.filters{display:flex;gap:12px;flex-wrap:wrap}.filters label:first-child{flex:1;min-width:240px}[hidden]{display:none!important}footer{font-size:14px;color:#5a6c77;margin:30px 0}@media(max-width:600px){body{padding:0 12px;margin:18px auto}h1{font-size:25px}article,.panel{padding:14px}h2{font-size:20px}figure{flex-basis:220px}img{width:220px}.filters label{width:100%}.filters select{flex:1}.filters label:first-child{min-width:0}}'''
nav=''.join(f'<a href="#{f["id"]}">{f["id"]} {esc(f["label"])}</a>' for f in families)
page='<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>타일 서바이벌 · 4영상 UI 관측 카탈로그</title><style>'+css+'</style></head><body><header id="top"><h1>타일 서바이벌 · UI 관측 카탈로그</h1><p>4영상 · 31개 구조 가족 · 공통부품 4군 · 별도 reference cinematic 3군 · 504×894</p><p class="warning"><strong>planned · 제안(검수 대기)</strong><br>이 갤러리는 원본 영상 분석과 UI스튜디오 샘플 제작 계획입니다. 대상은 빈 Page_TSV_Territory 1개가 저장된 상태이며 부품은 0개입니다. 영상 JPG는 분석 참조이고 UI 원화가 아닙니다. 실제 계층 조립·원화 신규제작·상태/연결 적용·전체 게임 구동 완료를 뜻하지 않습니다.</p><p><a href="inventory.md">분류·미확인 목록</a> · <a href="catalog.json">통합 카탈로그 JSON</a> · <a href="timestamp-manifest.json">프레임 타임스탬프/해시</a> · <a href="sample-evidence.json">기존 샘플 실제 데이터</a> · <a href="verification.json">정적 수락 검사</a></p></header><section class="panel"><h2>찾기</h2><div class="filters"><label>검색 <input id="query" type="search" placeholder="영웅, 조건, 제이슨, TS07 등"></label><label>유형 <select id="kind"><option value="">전체</option>'+''.join(f'<option>{x}</option>' for x in ['screen','modal','sheet','overlay'])+'</select></label><label>분류 <select id="category"><option value="">전체</option>'+''.join(f'<option>{x}</option>' for x in sorted({f['category'] for f in families}))+'</select></label><label>영상 <select id="source"><option value="">전체</option>'+''.join(f'<option>{x}</option>' for x in ['TSV01','TSV02','TSV03','TSV04'])+'</select></label></div><p id="count" role="status" aria-live="polite">31 / 31 가족</p><nav aria-label="구조 가족 목록">'+nav+'</nav></section><main>'+''.join(familyhtml(f) for f in families)+'</main><section id="components" class="panel"><h2>공통 부품 · 새 화면으로 세지 않음</h2>'+''.join('<h3>'+esc(c['id']+' '+c['label'])+'</h3><pre>'+esc(json.dumps(c,ensure_ascii=False,indent=2))+'</pre>' for c in components)+'</section><section class="panel"><h2>Reference cinematic · 제작 UI 가족 수 제외</h2><p>3D/카메라·노트 펼침·열차 시퀀스의 정지 참조입니다. 선택적 스킵 부품과 연결 순서만 기록합니다.</p>'+''.join('<section id="'+c['id']+'"><h3>'+esc(c['id']+' '+c['label'])+'</h3>'+shots(c['references'])+lis(c['notes'])+linklist(c.get('observedLinks',[]))+'</section>' for c in cinematics)+'</section><section class="panel"><h2>분류/근거 경계</h2>'+lis(catalog['deduplicationRules'])+'<h3>미확인</h3>'+lis(catalog['notVerified'])+'<h3>입력 원본</h3><pre>'+esc(json.dumps(catalog['inputProvenance'],ensure_ascii=False,indent=2))+'</pre></section><footer>codex(단이) · '+esc(created)+' · static/read-only gallery · 서버·네트워크 요청·저장 JSON 변경 없음. 기존 카피바라고 갤러리의 기사/참조이미지/관측연결 구조를 재사용했습니다.</footer><script>const cards=[...document.querySelectorAll("article[data-kind]")];const q=document.querySelector("#query"),k=document.querySelector("#kind"),c=document.querySelector("#category"),s=document.querySelector("#source");function filter(){const term=q.value.trim().toLocaleLowerCase();let count=0;for(const card of cards){const visible=(!term||card.textContent.toLocaleLowerCase().includes(term))&&(!k.value||card.dataset.kind===k.value)&&(!c.value||card.dataset.category===c.value)&&(!s.value||card.dataset.sources.includes(s.value));card.hidden=!visible;if(visible)count++;}document.querySelector("#count").textContent=`${count} / ${cards.length} 가족`;}for(const x of [q,k,c,s])x.addEventListener("input",filter);document.querySelectorAll("a[href]").forEach(a=>a.addEventListener("click",()=>{q.value=k.value=c.value=s.value="";filter();}));</script></body></html>'
(OUT/'index.html').write_text(page)

lines=['# 타일 서바이벌 · 4영상 UI 관측/재사용 기획','',f'작성자: codex(단이) · {created} · planned / 제안(검수 대기)','', 'GUI 부품 계층·텍스트 분리·9slice·상태·연결 예시를 만드는 UI스튜디오 샘플의 계획입니다. 게임 전체 구동 기획이 아닙니다.','', '**대상 실제 상태:** 부모가 nativeworkspace-76e57701-a74e-4e37-a4f6-9e83c12cd6fc / ux-25ecc98a r1에 Page_TSV_Territory 504×894 빈 화면을 등록·저장. 부품 0개이며 이 카탈로그가 조립 완료를 뜻하지 않습니다.','', '[갤러리](index.html) · [카탈로그](catalog.json) · [타임스탬프](timestamp-manifest.json) · [기존 샘플 실제 계층 데이터](sample-evidence.json) · [검사](verification.json)','', '## 보이는 구조 가족','', f'원본을 통합한 제작 가족 **{len(families)}종**, 공통 부품 4군, reference cinematic 3군입니다. 31이라는 수를 목표로 맞춘 것이 아니라 동일 구조의 내용 변형을 합친 결과입니다.','', '|ID|구조|유형|영상 원본|상태|','|---|---|---|---|---|']
for f in families:lines.append('|'+ '|'.join([f['id'],f['label'],f['kind'],', '.join(o['sourceLocalId'] for o in f['sourceObservations']),'planned'])+'|')
lines+=['','## 중복 통합 / 제외','']+['- '+x for x in catalog['deduplicationRules']]+['','- TSV01 210/215/220초는 모두 목재공방 조건 빨강·회색 업그레이드 CTA입니다. 215초를 충족 상태로 적지 않았습니다. 충족 상태는 TSV02 101초의 녹색 CTA로 확인합니다.','- TS10 일반건물 성공과 TS11 발전소 기록판은 중앙 몸체가 다릅니다. 폭죽/보상비행 자체를 별도 가족으로 늘리지 않았습니다.','- TS17 챕터완료 보상과 TS28 친밀도 보상은 축하 헤더를 공유하지만 관계변경/편지함 CTA 유무로 몸체를 분리합니다.','','## 제작할 공통 규칙','','- 프레임/원화/글자/입력 wrapper/배지/엔진 그림자를 분리합니다. 버튼 글자와 수치·이름을 그림에 굽지 않습니다.','- 9slice는 새 원화의 모서리/끝단과 가운데를 분리할 제작 제안입니다. 원본 프레임 JPG를 잘라 제품 자산으로 사용하지 않습니다.','- 버튼 normal/pressed는 같은 캔버스·기준점·바닥을 사용합니다. 미관찰 pressed 원화는 제작 제안이며 관측 사실로 쓰지 않습니다.','- selected/disabled/locked/claimed/requirements-satisfied 상태는 관찰 근거를 붙입니다. 이름/수치/초상은 데이터 변형으로 전달합니다.','- 소스 관찰 연결과 planned UI샘플 연결을 구분합니다. sequence_observed는 영상 순서/커서와 결과 관찰이며 실제 이벤트 로그 검증이 아닙니다.','- Unity 계층은 원본 복원이 아니라 제작 제안입니다. 각 가족의 plannedComponentHierarchy가 독립글자·버튼스킨·데이터 전달 경계를 설명합니다.','','## 기존 샘플을 먼저 대조한 근거','','sample-match/inventory.json, match-candidates.md, selected-layout-evidence.md를 읽고 저장 데이터의 계층/크기/폰트/상태/연결을 sample-evidence.json에 보존했습니다. 원본 디자인 JSON은 수정하지 않았습니다.','', '|샘플|저장 ID/revision|이번 관찰|','|---|---|---|']
for p in samples['provenance']['sources']:lines.append(f"|{p['sample']}|{p['projectId']} r{p['revision']}|저장 JSON 관측·시각동등 미검수·복사/적용 안 함|")
lines+=['','모집은 Chests의 뽑기/종류탭, 영웅은 Equipment의 카드/스탯, 챕터는 SevenDay/QuickWins/Continent의 미션행을 부분 재사용 후보로 삼았습니다. Hero/Recruit/Story 완제품이 기존 샘플에 있다는 뜻이 아닙니다. 차이는 각 가족에 명시했습니다.','','## 직접 확인 / 인용 관측 / 미확인','','- 직접: TSV01 contact-1..3 전체와 0/5/30/65/70/95/105/170/200/210/215/225/240초 선택 개별 프레임. TSV02 일부 성공/건설조건/인력/전투 대표, TSV03 발전소 성공 대표를 추가 육안 확인했습니다.','- TSV02 전체28 로컬분류와 TSV03/04 전체17 로컬분류의 상세 행동은 배정된 다른 분석자의 inventory 원문을 사용했습니다. 현재 작업자가 전 영상을 재생하거나 모든 개별 대표를 재검수한 것으로 쓰지 않습니다.','- 모든 좌표는 504×894 참조 프레임의 넓은 구역을 육안 근사한 값입니다. 브라우저 실측/정확 hitbox/원본 엔진 RectTransform이 아닙니다.','']+['- '+x for x in catalog['notVerified']]+['','## 검증 / 변경 범위','','catalog 폴더만 신규 작성했습니다. 제품 소스·다른 샘플·저장 디자인 JSON·공용 STATUS·공용 보고·서버·브라우저 변경은 0입니다. 검사 스크립트는 가족 ID/연결/참조/파일/좌표/HTML 앵커/이미지 크기·해시/검색 분류 코드 존재를 검증하며 결과는 verification.json입니다. 실제 브라우저 실행/모바일 시각 검수는 하지 않았습니다.','','원본이 없는 신규 후보만 작성했으므로 기존 파일 백업 대상은 없습니다. 입력 영상/추출 원본은 변경하지 않았습니다.','']
(OUT/'inventory.md').write_text('\n'.join(lines))
print(json.dumps(dict(families=len(families),referenceImages=len(manifest),cinematics=len(cinematics),components=len(components),output=str(OUT)),ensure_ascii=False))
