from pathlib import Path
from PIL import Image,ImageDraw
import json,shutil,hashlib,datetime
p=Path('/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/clash-sample-20261118/video-a')
indexes={d:json.loads((p/d/'index.json').read_text()) for d in ['coarse','fine','boundaries','upgrade-confirm']}
def ev(d,i):
 f=indexes[d]['frames'][i]
 return {'set':d,'index':i,'requestedSeconds':f['requested'],'actualSeconds':f['actual'],'frame':f"{d}/{f['file']}",'timestampSource':'AVAssetImageGenerator actualTime; zero requested tolerance; asset timeline seconds'}
def nodes(*rows):
 return [{'id':r[0],'parent':r[1],'role':r[2],'description':r[3],**({'approxSourceRectXYWH':r[4]} if len(r)>4 else {})} for r in rows]
families=[]
def fam(fid,name,scope,kind,d,i,structure,text,hierarchy,states,entry,exit,unknown,scroll=None,tabs=None,related=None):
 e=ev(d,i);fn=f"representatives/{fid}_{int(e['actualSeconds']*1000):06d}ms.jpg"; (p/'representatives').mkdir(exist_ok=True)
 shutil.copy2(p/e['frame'],p/fn)
 x={'id':fid,'name':name,'scope':scope,'kind':kind,'classification':'whole-frame family candidate; proposal awaiting review','representative':fn,'evidence':e,'structure':structure,'displayTextObserved':text,'components':hierarchy,'states':states,'entry':entry,'exit':exit,'scroll':scroll or {'observed':False,'detail':'이번 영상에서 스크롤 미관찰'},'tabs':tabs or [],'unknown':unknown}
 if related:x['relatedFamily']=related
 families.append(x)
 return x
obs=lambda s:{'status':'observed-sequence','detail':s,'clickProof':'touch-down/up 좌표는 영상으로 직접 확인하지 못함'}
inf=lambda s:{'status':'inferred-control','detail':s,'clickProof':'전후 화면과 안내 손가락/버튼 강조로 추정; 실제 클릭 로그 없음'}
unk=lambda s:{'status':'unobserved','detail':s}
fam('A-F01','캐릭터 로고 로딩','game','loading','fine',15,
 '전체 캐릭터 원화/상단 로고/최하단 진행바. 동일 원화의 77·99·100%는 상태 차이.',
 ['CLASH ROYALE','클래시 로얄','99%','100%'],
 nodes(('ROOT',None,'screen','원본 전체 1080×2340',[0,0,1080,2340]),('Img_Splash','ROOT','image','캐릭터 전면 원화'),('Img_Logo','ROOT','image+text','게임 로고',[257,149,668,367]),('Progress_Loading','ROOT','progress','하단 진행바와 별도 백분율',[0,2224,1080,116])),
 [{'name':'초기 로딩+동의창 배후','evidence':ev('fine',0)},{'name':'99% 단독','evidence':ev('fine',15)},{'name':'전투결과 뒤 77% 재로딩','evidence':ev('fine',34)},{'name':'100%','evidence':ev('fine',35)}],
 obs('영상이 로딩+OS 알림창에서 시작한다.'),obs('15.995초 전투; 72.994초 재로딩 뒤 75.996초 보상 화면.'),['로딩완료 조건/진행바 easing/실제 자원은 미확인'])
fam('A-X01','Android 알림 허용창','external-os','permission-sheet','fine',0,
 '게임 로딩 위 하단 흰색 둥근 시스템 권한판. 게임 production 제작 대상과 분리.',
 ['클래시 로얄에서 알림을 보내도록 허용하시겠습니까?','허용','허용 안함'],
 nodes(('ROOT',None,'overlay','로딩 배후'),('Sheet_OSPermission','ROOT','system-sheet','벨/질문/세로 두 선택',[29,1680,1022,638]),('Img_Bell','Sheet_OSPermission','image','알림 벨'),('Txt_Prompt','Sheet_OSPermission','text','알림 허용 질문'),('Btn_Allow','Sheet_OSPermission','button','허용'),('Btn_Deny','Sheet_OSPermission','button','허용 안함')),
 [{'name':'영상 첫 프레임','evidence':ev('fine',0)}],obs('영상 첫 프레임에 이미 열림.'),obs('0.995초에는 사라지고 연령 선택창이 보임. 어느 선택을 눌렀는지는 미확인.'),['실제 운영체제 버전/선택 결과/재진입 동작 미확인'])
fam('A-F02','나이 선택 모달','game','modal','fine',5,
 '로딩 위 넓은 회색 외틀/상단 제목/파랑 캐릭터 영역/밝은 슬라이더 영역/확인 버튼/빈 하단 패널.',
 ['나이가 어떻게 되세요?','슬라이더를 움직여 나이를 설정하세요.','35','50','59','53','게임 플레이에는 영향을 주지 않습니다.','확인'],
 nodes(('ROOT',None,'overlay','로딩 배후'),('Panel_Age','ROOT','panel','중앙 회색 외틀',[51,519,977,1389]),('Txt_Title','Panel_Age','text','나이가 어떻게 되세요?'),('Img_King','Panel_Age','image','상단 파랑 킹 초상'),('Group_Slider','Panel_Age','input-group','설명/숫자 말풍선/초록 트랙/파랑 손잡이/좌우 삼각'),('Txt_Age','Group_Slider','text','슬라이더 표시값'),('Slider_Age','Group_Slider','slider','연령 입력'),('Btn_ConfirmAge','Panel_Age','button','확인',[406,1552,269,120])),
 [{'name':'미선택·확인 비활성','evidence':ev('fine',1)},{'name':'35·확인 활성','evidence':ev('fine',5)},{'name':'50','evidence':ev('fine',6)},{'name':'59','evidence':ev('fine',7)},{'name':'53','evidence':ev('fine',9)}],
 obs('0.995초 OS 권한판 대신 연령판 등장.'),obs('9.488초 연령판이 사라진 로딩, 9.741초 중요공지 등장. 확인 버튼 입력은 추정.'),['나이 입력범위/Unity slider 값/저장 값/정책 효과 미확인'])
fam('A-F03','중요 공지 하단판','game','notice-sheet','fine',10,
 '어둡게 처리한 로딩 위 하단 둥근 작은 패널; 제목/약관안내/가로 세 선택.',
 ['중요 공지',"‘확인’을 탭해 이용 약관에 동의하고, 개인정보 처리방침에서 저희가 회원 개인정보를 어떻게 처리하는지 확인하세요.",'확인','개인정보 처리방침','이용 약관'],
 nodes(('ROOT',None,'overlay','로딩 배후+딤'),('Panel_Notice','ROOT','panel','하단 안내판',[29,1761,1022,558]),('Txt_NoticeTitle','Panel_Notice','text','중요 공지'),('Txt_NoticeBody','Panel_Notice','text','이용약관·개인정보 안내'),('Group_Actions','Panel_Notice','row','확인/개인정보 처리방침/이용 약관'),('Btn_Confirm','Group_Actions','button','확인'),('Btn_Privacy','Group_Actions','button','개인정보 처리방침'),('Btn_Terms','Group_Actions','button','이용 약관')),
 [{'name':'공지 표시','evidence':ev('fine',10)}],obs('9.741초부터 중요공지 관찰.'),obs('11.996초 로딩 단독 뒤 12.242초 별도 개인정보 동의판.'),['세 선택의 실제 클릭과 링크 목적지 미관찰'])
fam('A-X02','Usercentrics 개인정보 동의판','external-service','consent-sheet','fine',13,
 '로딩 위 파란 세로 긴 동의판. 로고/제목/긴 설명/링크행/두 가로 버튼/공급자 표기; 상단 OS 상태바 동반.',
 ['개인 정보','개인정보 보호정책','서비스 약관','자세한 정보','모두 수락','전체 거부','Powered by Usercentrics Consent Management'],
 nodes(('ROOT',None,'overlay','로딩 배후+딤'),('OS_Status','ROOT','system','시간/기록/배터리 상태바; 샘플 콘텐츠에서 제외'),('Panel_Consent','ROOT','panel','파란 개인정보 동의판',[35,887,1010,1377]),('Img_Logo','Panel_Consent','image','작은 CLASH ROYALE 로고'),('Txt_Title','Panel_Consent','text','개인 정보'),('Txt_ConsentBody','Panel_Consent','text','cookies·tracking·광고·분석 파트너 안내'),('Group_Links','Panel_Consent','row','보호정책/약관/자세한 정보'),('Btn_Accept','Panel_Consent','button','모두 수락'),('Btn_Reject','Panel_Consent','button','전체 거부'),('Txt_Vendor','Panel_Consent','text','Usercentrics 공급자 표기')),
 [{'name':'동의판','evidence':ev('fine',13)}],obs('12.242~13.243초 샘플에서 관찰.'),obs('13.994초 로딩 단독. 수락/거부 중 선택 미확인.'),['실제 선택/외부 페이지/스크롤/OS 환경 미확인'])
fam('A-F04','훈련 전투 아레나','game','battle-screen','coarse',25,
 '전면 세로 아레나: 적 3타워/강·두 다리/아군 3타워/좌상 상대 식별. 하단 카드바는 보이는 상태와 숨김 상태가 모두 관찰됨. 안내 킹/말풍선/손가락/배치금지 오버레이는 이 판틀의 상태.',
 ['로얄 훈련관','얼 교관','피코바 교관','클래시 로얄에 오신 것을 환영합니다!','먼저 훈련 매치부터 해보죠!','적군이 쳐들어오고 있습니다!','카드를 전장에 배치해 타워를 방어하세요!','선택한 카드가 없습니다.','다음:','레벨 1','레벨 3'],
 nodes(('ROOT',None,'screen','아레나 전면',[0,0,1080,2340]),('Scene_Arena','ROOT','scene-reference','타워/잔디/울타리/강/다리; 원본 Unity 계층 미확인'),('HUD_Opponent','ROOT','hud','좌상 방패·교관 이름·로얄 훈련관'),('HUD_Towers','ROOT','hud','양측 타워 HP/왕관 레벨'),('Group_Tutorial','ROOT','overlay','킹/대사/손가락/선택안내'),('Img_KingGuide','Group_Tutorial','image','하단 킹 인물'),('Txt_Bubble','Group_Tutorial','text','흰 말풍선 대사'),('Img_HandGuide','Group_Tutorial','image','드래그·클릭 유도 손'),('Group_Deploy','ROOT','overlay','금지영역/카드 이름/유닛 미리보기'),('HUD_Hand','ROOT','hud','하단 파란 카드·엘릭서 판(표시 상태에만)',[0,2108,1080,232]),('NextCard','HUD_Hand','card','다음 카드/라벨'),('HandCards','HUD_Hand','row','4카드 슬롯/엘릭서 비용/회색 비활성'),('ElixirBar','HUD_Hand','progress','수치와 분홍 게이지')),
 [{'name':'카드바 없는 초기 전장','evidence':ev('fine',17)},{'name':'킹 대사','evidence':ev('fine',20)},{'name':'카드 선택·적영역 배치금지','evidence':ev('fine',26)},{'name':'전투1 카드바 표시','evidence':ev('coarse',9)},{'name':'전투2 카드바 없는 순간','evidence':ev('coarse',24)},{'name':'전투2 카드바 표시','evidence':ev('coarse',25)},{'name':'영상 종료도 전투중','evidence':ev('fine',70)}],
 obs('15.995초 첫 훈련 전장; 102.994초 두 번째 훈련 전장.'),obs('첫 전투 69.498초 결과판으로 진행. 두 번째 전투는216.198초까지 진행중이며 종료결과 미관찰.'),['입력 좌표/드래그 궤적/카드바 표시정책/게임엔진 계층/전투2 종료 미확인'],scroll={'observed':False,'detail':'아레나는 전면장면. 화면 수직 스크롤은 미관찰.'})
fam('A-F05','훈련 승리 결과 오버레이','game','result-overlay','fine',33,
 '전장 딤 위 적 붉은 리본/VS/아군 파란 리본+왕관3/하단 보상상자/확인. 왕관이 순차 등장한 중간상태와 완성상태는 같은판틀.',
 ['얼 교관','로얄 훈련관','VS','나','클랜 없음','승리!','보상','확인'],
 nodes(('ROOT',None,'overlay','전장 배후+딤'),('OpponentResult','ROOT','ribbon','적 이름/문장/빈 왕관쿠션',[60,605,950,319]),('Txt_VS','ROOT','text','VS'),('PlayerResult','ROOT','ribbon','아군 이름/클랜없음/왕관3',[61,1094,949,374]),('Reward_Chest','ROOT','card','보상/상자',[398,1497,286,351]),('Btn_ConfirmResult','ROOT','button','확인',[430,1950,220,107])),
 [{'name':'결과 리본 등장·왕관 애니메이션','evidence':ev('fine',30)},{'name':'3왕관+보상+확인','evidence':ev('fine',33)}],obs('68.998초 전장 뒤69.498초 리본 등장.'),obs('72.485초 승리 문구·확인 남아있음;72.994초 로딩. 확인 입력은 추정.'),['보상상자 별도 탭효과/패배판/다른 왕관수 결과 미관찰'])
fam('A-F06','상자 보상 발표','game','reward-screen','fine',40,
 '파란 다이아 배경 위 좌상 보상카드/오른쪽 제목·종류·보유수/중하단 열린상자·남은수. 상자단독·카드별발표·4개요약은 같은 흐름의 상태.',
 ['골드','자원 카드','+18','내 골드:','118','기사','일반 카드','x1','2/2','미니 P.E.K.K.A','희귀 카드','머스킷병','잠금 해제!','획득:'],
 nodes(('ROOT',None,'screen','파란 다이아 무늬'),('Group_RewardReveal','ROOT','panel','카드/제목/보유량',[180,426,762,460]),('Img_RewardCard','Group_RewardReveal','image','좌측 카드'),('Txt_RewardTitle','Group_RewardReveal','text','이름/등급'),('Txt_Quantity','Group_RewardReveal','text','+18 또는x1'),('Progress_Ownership','Group_RewardReveal','progress','보유수/업그레이드가능'),('Chest','ROOT','image','열린상자/발광',[362,1134,379,347]),('Badge_Remaining','Chest','badge','4→3→2→1→0'),('RewardSummary','ROOT','row','요약상태에서 하단4카드')),
 [{'name':'상자단독','evidence':ev('fine',37)},{'name':'골드+18','evidence':ev('fine',40)},{'name':'기사x1','evidence':ev('fine',41)},{'name':'미니P.E.K.K.A x1','evidence':ev('boundaries',30)},{'name':'머스킷병x1','evidence':ev('boundaries',34)},{'name':'4개 획득요약','evidence':ev('boundaries',35)}],
 obs('75.996초 파란 보상장면; 앞은 전투결과·로딩.'),obs('81.795초 4개요약 뒤81.995초 홈전환. 상자/다음보상 터치입구는 추정.'),['실제 탭 좌표/총 배출확률/미관찰보상/실제 자원분리 미확인'])
fam('A-F07','훈련 전투 홈','game','home-screen','fine',63,
 '상단3자원/프로필행/훈련진행도/중앙 디오라마/이벤트보상판/노랑 전투버튼/최하단5메뉴. 최초파랑배경과후속경기장조명배경은 같은 배치.',
 ['나','클랜 없음','훈련 진행도','멀티플레이 해제까지','1/3','이벤트','전투','전투에서 승리하여 더 많은 보상을 획득하세요!','113','100'],
 nodes(('ROOT',None,'screen','홈 전면'),('HUD_Currency','ROOT','row','경험(왕관카드)/골드/보석',[0,108,1080,80]),('ProfileRow','ROOT','row','이름/클랜없음/친구/소식/메뉴',[12,239,1035,117]),('TrainingProgress','ROOT','progress','훈련진행도/멀티플레이해제/1/3',[187,385,725,146]),('Img_ArenaDiorama','ROOT','scene-reference','중앙 훈련장 모형',[271,904,542,589]),('EventRewards','ROOT','panel','이벤트 제목/체크와 상자들',[367,1588,353,216]),('Btn_Battle','ROOT','button','노란 전투',[365,1817,361,211]),('Tutorial','ROOT','overlay','손가락/전투안내'),('BottomNav','ROOT','tabbar','5개메뉴; 선택 전투',[0,2157,1080,183])),
 [{'name':'보상 수령 직후 파랑 배경 홈','evidence':ev('boundaries',38)},{'name':'전투버튼 유도·조명배경 홈','evidence':ev('fine',63)}],
 obs('81.995초부터 상자발표 후 홈;100.241초 컬렉션 다음 홈.'),obs('82.996~83.997초 덱;102.994초 전투. 메뉴/전투 버튼 안내와 전후 흐름만 관찰.'),['친구/소식/메뉴/이벤트상자/다른 바텀메뉴 목적지 미관찰'],tabs=[{'label':'보물상자 아이콘','state':'미선택·목적지미관찰'},{'label':'카드 아이콘','state':'컬렉션 입구로 추정·이후실제카드페이지관찰'},{'label':'전투','state':'선택 관찰'},{'label':'사람방패 아이콘','state':'목적지미관찰'},{'label':'월계쌍검 아이콘','state':'목적지미관찰'}])
fam('A-F08','덱 편집 본문','game','tab-page','fine',46,
 '공통3자원/덱·컬렉션탭/전투덱배너/2×4 전투카드/평균엘릭서/타워유닛3D+별도타워카드/하단5메뉴. 컬렉션과셸공유하지만 본문분할구조다름.',
 ['덱','컬렉션','전투 덱','레벨 1','레벨 3','NEW','3.6','1/2','2/2','8/9'],
 nodes(('ROOT',None,'screen','카드관리 공통셸'),('HUD_Currency','ROOT','row','경험/골드/보석'),('Tabs_Mode','ROOT','tabbar','덱·컬렉션',[105,236,868,119]),('DeckBanner','ROOT','ribbon','전투 덱'),('DeckGrid','ROOT','grid','2행×4카드',[18,583,1040,761]),('DeckCard','DeckGrid','repeat-card','비용/초상/레벨/NEW/수량게이지는별도역할'),('AverageElixir','ROOT','stat','보라 엘릭서3.6'),('TowerUnits','ROOT','panel','킹/타워캐릭터/레벨/진행/연필/타워유닛카드'),('BottomNav','ROOT','tabbar','공통5메뉴')),
 [{'name':'보상정산 중 수치15/109','evidence':ev('fine',45)},{'name':'정산후17/118/100','evidence':ev('fine',46)}],obs('82.996~83.997초 홈다음 덱 등장; 하단 카드입구로 추정.'),obs('86.400초 덱;86.600초 컬렉션목록 하단으로 전환. 실제 탭입력은 미확인.'),['덱 교체/카드드래그/연필/타워상세/선택외탭 동작 미관찰'],tabs=[{'label':'덱','state':'선택관찰'},{'label':'컬렉션','state':'이후선택관찰'}],related='A-F09와 HUD/탭/카드부품/하단메뉴 공통; 별도본문 구조')
fam('A-F09','컬렉션 목록 본문','game','scroll-tab-page','fine',50,
 '공통3자원/덱·컬렉션탭/5아이콘 하위탭/찾음·필터·정렬/발견함2×4카드/미발견 회색4열 목록/하단5메뉴. 세로스크롤로 하위 아레나·타워유닛 목록이 나타남.',
 ['덱','컬렉션','카드 컬렉션','찾음: 8/123','레벨 기준','발견함','미발견','잠금 해제:','아레나 1','타워 유닛','찾음: 1/4','업그레이드','정보','사용'],
 nodes(('ROOT',None,'screen','카드관리공통셸'),('HUD_Currency','ROOT','row','경험/골드/보석(스크롤중에도 화면상단유지)'),('Tabs_Mode','ROOT','tabbar','덱·컬렉션'),('Tabs_Category','ROOT','tabbar','5개아이콘; 카드/다른4종'),('Scroll_Collection','ROOT','scroll','세로 카드본문'),('Toolbar','Scroll_Collection','row','찾음·필터슬라이더아이콘·정렬삼각·레벨기준'),('DiscoveredGrid','Scroll_Collection','grid','발견함 4열 카드'),('UndiscoveredGrid','Scroll_Collection','grid','미발견 회색 4열 아레나해제카드'),('TowerUnitSection','Scroll_Collection','grid','하단 타워유닛4카드'),('SelectedCardPopover','Scroll_Collection','popover','선택 카드 확장과 업그레이드/정보+사용'),('BottomNav','ROOT','tabbar','5메뉴;컬렉션선택')),
 [{'name':'세로목록하단·타워유닛','evidence':ev('boundaries',48)},{'name':'스크롤중','evidence':ev('boundaries',52)},{'name':'목록상단','evidence':ev('fine',50)},{'name':'기사선택·업그레이드/사용','evidence':ev('boundaries',56)},{'name':'업그레이드후 정보/사용','evidence':ev('boundaries',68)}],
 obs('86.600초 덱 다음 컬렉션 아래쪽;88.987초 목록상단;90.496초 기사선택확장.'),obs('91.489초 기사상세로 진행;업그레이드완료후98.989초 동일목록복귀;100.241초 홈.'),['스크롤 입력방식/총픽셀거리/상위탭 고정정책/5하위탭 목적지/정렬·필터효과 미확인'],scroll={'observed':True,'evidence':[ev('boundaries',48),ev('boundaries',52),ev('fine',50)],'detail':'86.600~88.987초 하단목록에서상단으로보이는영역이변한다. 상단3자원/하단메뉴는같은위치. 스크롤오프셋과gesture는미확인.'},tabs=[{'label':'덱/컬렉션','state':'컬렉션선택관찰'},{'label':'5개하위아이콘','state':'첫카드아이콘선택관찰;나머지목적지미관찰'}],related='A-F08와 공통셸; 선택카드메뉴·업그레이드전후는 반복 상태')
fam('A-F10','기사 카드 상세 모달','game','detail-modal','fine',53,
 '컬렉션 딤 위 상단 돌출 기사모형/파란 큰판. 카드초상·레벨·희귀도/유형 표/큰 시연화면·점표시/아래 업그레이드·사용/우상닫기.',
 ['기사','레벨 1','2/2','희귀도','일반','유형','유닛','업그레이드','5','사용'],
 nodes(('ROOT',None,'overlay','컬렉션 배후+딤'),('Img_KnightFigure','ROOT','image','판 위 돌출 기사모형',[301,163,556,593]),('Panel_Detail','ROOT','panel','파란 상세판',[46,758,994,1258]),('Btn_Close','Panel_Detail','button','우상 빨강X',[935,779,72,75]),('Card_Preview','Panel_Detail','card','좌측비용3/기사/레벨/2/2'),('Txt_NameLevel','Panel_Detail','text','기사/레벨1'),('Stat_Rarity','Panel_Detail','stat','희귀도/일반'),('Stat_Type','Panel_Detail','stat','유형/유닛'),('Scene_Demo','Panel_Detail','scene-reference','아레나 시연장면'),('Pager_Demo','Panel_Detail','indicator','시연아래 점들'),('Btn_Upgrade','Panel_Detail','button','업그레이드5골드'),('Btn_Use','Panel_Detail','button','사용'),('TutorialHand','ROOT','image','업그레이드유도손')),
 [{'name':'카드상세·시연','evidence':ev('fine',53)}],obs('90.997초 선택메뉴 다음91.489초 상세. 선택카드의업그레이드또는초상탭중정확입력은미확인.'),obs('92.490초 업그레이드보상 확인판이 중첩;X닫기/사용 동작은미관찰.'),['시연화면 실제플레이입력/점선택/닫기복귀/다른카드상세/패널스크롤 미확인'])
fam('A-F11','업그레이드 보상 확인 말풍선','game','confirmation-popover','upgrade-confirm',3,
 '카드 상세 위 추가딤/작은 밝은테두리 말풍선. 보상두행/녹색 확인5골드/아래꼬리. 손가락이 제목일부를가림.',
 ['업그레이드 보상','1','4','확인','5'],
 nodes(('ROOT',None,'overlay','상세 배후+추가딤'),('Panel_UpgradeConfirm','ROOT','popover','말풍선테두리/아래꼬리',[297,1373,489,453]),('Txt_Title','Panel_UpgradeConfirm','text','업그레이드 보상(일부가림)'),('Reward_CrownCards','Panel_UpgradeConfirm','row','왕관카드아이콘1'),('Reward_Star','Panel_UpgradeConfirm','row','금색별아이콘4'),('Btn_Confirm','Panel_UpgradeConfirm','button','확인5골드'),('TutorialHand','ROOT','image','확인유도손')),
 [{'name':'확인판','evidence':ev('upgrade-confirm',3)}],obs('92.490초부터상세위확인판.'),obs('92.9초무렵다이아배경업그레이드발표. 확인입력은안내/전후흐름으로추정.'),['취소/외부클릭/보상아이콘공식명칭/확인전체문구 일부가림'])
fam('A-F12','카드 업그레이드 발표','game','upgrade-result-screen','fine',59,
 '파란다이아배경 위 중앙 이름/진행바/카드/증가스탯3행. 상자보상과배경공유하나중앙수직스탯구조가다름.',
 ['기사','0/4','레벨 2','피해량','86','+7','초당 피해량','71','+6','HP','759','+69'],
 nodes(('ROOT',None,'screen','파란 다이아 배경'),('Txt_CardName','ROOT','text','기사',[443,351,190,105]),('Progress_Card','ROOT','progress','화살표/0/4',[328,463,452,111]),('Img_Card','ROOT','card','발광카드/레벨2',[366,671,341,420]),('Stat_UpgradeRows','ROOT','column','피해량86+7/초당피해량71+6/HP759+69',[392,1134,405,414]),('Stat_Icon','Stat_UpgradeRows','image','각행아이콘'),('Stat_Name','Stat_UpgradeRows','text','항목명'),('Stat_Base','Stat_UpgradeRows','text','현재표시수치'),('Stat_Delta','Stat_UpgradeRows','text','녹색증가량')),
 [{'name':'카드레벨변경·발광','evidence':ev('fine',55)},{'name':'0/4·레벨2','evidence':ev('fine',56)},{'name':'스탯3행','evidence':ev('fine',59)}],obs('확인판후92.991초부터발표장면.'),obs('98.989초컬렉션복귀;닫기버튼은보이지않고실제복귀입력은미확인.'),['표시수치의밸런스정본/재생시간정책/다른카드/터치복귀조건 미확인'],related='A-F06와 다이아 배경 공유; 중앙형 업그레이드스탯은별도판틀')
# Additional raw representative copies for observed variants.
extra=[]
for name,d,i in [('A-F04_guide','fine',20),('A-F04_hand_visible','coarse',25),('A-F04_hand_hidden','coarse',24),('A-F06_summary','boundaries',35),('A-F09_scroll_bottom','boundaries',48),('A-F09_selected_before','boundaries',56),('A-F09_selected_after','boundaries',68)]:
 e=ev(d,i);fn=f"representatives/{name}_{int(e['actualSeconds']*1000):06d}ms.jpg";shutil.copy2(p/e['frame'],p/fn);extra.append({'name':name,'representative':fn,'evidence':e})
transitions=[
 ('A-X01','A-F02',0,0.995,'OS허용판→나이선택','선택 버튼 미확인'),
 ('A-F02','A-F03',9.488,9.741,'연령판 닫힘 뒤 중요공지','확인 버튼 추정'),
 ('A-F03','A-X02',11.996,12.242,'중요공지 닫힘·개인정보동의판','확인/정책링크 중 실제입력 미확인'),
 ('A-X02','A-F04',13.243,15.995,'동의판닫힘→로딩→첫전장','수락/거부 선택 미확인'),
 ('A-F04','A-F05',68.998,69.498,'첫전투타워파괴 뒤 승리결과','전투종료 연출 관찰'),
 ('A-F05','A-F06',72.485,75.996,'확인→로딩→상자','확인 클릭 추정'),
 ('A-F06','A-F07',81.795,81.995,'4개요약→홈','탭/자동전환 구분 미확인'),
 ('A-F07','A-F08',82.996,83.997,'홈→덱','하단카드메뉴 안내손과 전후화면; 입력 추정'),
 ('A-F08','A-F09',86.400,86.600,'덱→컬렉션하단','컬렉션탭 전환 추정'),
 ('A-F09','A-F10',90.997,91.489,'기사선택확장→상세','초상/업그레이드 중 정확입력 미확인'),
 ('A-F10','A-F11',92.240,92.490,'상세→업그레이드보상확인','녹색업그레이드 버튼 추정'),
 ('A-F11','A-F12',92.7,92.991,'확인→업그레이드발표','확인5골드 버튼 추정'),
 ('A-F12','A-F09',98.739,98.989,'업그레이드발표→컬렉션복귀','복귀입력 미확인'),
 ('A-F09','A-F07',99.991,100.241,'컬렉션→전투홈','하단전투탭 안내손; 입력추정'),
 ('A-F07','A-F04',101.993,102.994,'전투홈→두번째훈련전투','노란전투버튼 안내손; 입력추정')]
result={'schemaVersion':1,'artifactType':'observational-video-sample-inventory','status':'제안(검수 대기)','videoId':'CLASH-A','source':{'path':'/Users/max/Desktop/Screen_Recording_20261118_154132_Clash Royale.mp4','readOnly':True,'originalDeletedOrModified':False,'fileNameNotUsedForGameIdentification':True,'metadata':json.loads((p/'metadata.json').read_text()),'nominalFPSNote':'AVFoundation nominalFrameRate 60.5471763611이며 일정 fps/프레임총수로 해석하지 않음','recordingWallClock':'파일명 시각과 화면OS시각 차이가 있을 수 있어 타임라인 출처로 사용하지 않음'},'gameIdentification':{'name':'Clash Royale','korean':'클래시 로얄','status':'visually-confirmed','evidence':[ev('fine',0),ev('fine',5)],'reason':'실제 영상의 CLASH ROYALE/클래시 로얄 로고 및 OS 알림질문에 게임명 명시','userLabel':'사용자 표현 클래시오브 클랜과 다름; 동일프랜차이즈여도 다른게임으로 분리'},'method':{'extractor':'기존 AVFoundation extract_video; 새 패키지/ffmpeg 없음','coarse':'0..215초 5초간격44개','fine':'전환 주변1초간격71개 + 0.2~0.5초주변78개 + 짧은확인판0.1초6개','extractedEntries':199,'reviewedEntries':{'coarse':44,'fine':71,'boundaries':78,'upgrade-confirm':[3]},'reviewedEntryCount':194,'uniqueReviewedFrameCount':'중복시간 포함이므로 별도집계하지않음','review':'원본프레임축소콘택트시트와대표개별프레임을view_image로확인','coordinatePolicy':'모든사각형은1080×2340원본캡처의수동대략값. 툴논리좌표/Unity 계층/폰트값이아님','provenance':'각evidence의 requestedSeconds와 actualSeconds를 모두보존; 실제시간은각index.json에서취함'},'classification':{'gameFamilyCandidates':12,'externalFamilyCandidates':2,'totalFamilyCandidates':14,'scope':'이 영상에 나타난 초기설정·훈련흐름의 고유판틀후보. 게임전체UI전수조사아님','dedupRules':['전투유닛/HP/손패/가이드/타워파괴는 A-F04 상태차이','보상4종/4개요약은 A-F06 상태차이','카드선택메뉴/업그레이드전후는 A-F09 상태차이','덱과컬렉션은상하셸을공유하나본문 분할구조가달라각대표를유지','다이아배경공유만으로 상자발표와업그레이드발표를합치지않음','OS권한판과Usercentrics동의판은게임production제작대상과분리']},'families':families,'additionalRepresentatives':extra,'transitions':[{'from':a,'to':b,'lastBeforeSampleSeconds':c,'firstAfterSampleSeconds':d,'observedSequence':s,'controlEvidence':t,'runtimeLinkImplemented':False,'onsetPrecision':'샘플사이구간; 정확한첫프레임/실제클릭시각으로쓰지않음'} for a,b,c,d,s,t in transitions],'sharedParts':['HUD3자원(경험/골드/보석)','하단5메뉴바','입체버튼프레임+native별도문구+비용/아이콘','카드(프레임/캐릭터/비용/레벨/수량/게이지/NEW)','기본/활성/회색카드 상태','튜토리얼손/킹/말풍선/딤','파란다이아배경','상자+광원+남은수배지'],'productionBoundary':{'rawCaptures':'원본참조용 JPG만; production 자원 아님','productionArtCreated':0,'toolDesignEdited':False,'designJSONInjected':False,'gameIntegrated':False,'browserOrServerUsed':False,'allGameUICovered':False,'notInspected':['미관찰 바텀메뉴 목적지','컬렉션 하위4탭','필터·정렬','실제 카드 사용/덱교체','OS권한 선택결과','전투2결과','원본자원/폰트/Unity구성','도구 실제조립·반응형·키보드·게임연결']},'filesRead':['/Users/max/projest_max/ui-studio/AGENTS.md','/Users/max/projest_max/ui-studio/README.md','/Users/max/projest_max/ui-studio/src/tools/uxStudio/guide/START_PROJECT_GUIDE.md','/Users/max/projest_max/ui-studio/docs/collaboration/README.md','기존extract_video.swift/video_metadata.swift','배정원본영상 및 위지정 추출프레임'],'limits':['자동OCR/외부인터넷미사용','직접클릭로그가없어 화면전환관찰과조작입구추정을분리','표시된숫자는영상내샘플값이며게임밸런스정본아님','대표중일부는튜토리얼손/연출/딤에가려짐','지도·공용지시함·다른영상·다른AI소스미열람','제품소스·설계·공용STATUS·보고변경없음']}
(p/'analysis.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
lines=['# 영상 A — 클래시 로얄 관찰 샘플','', '**제안(검수 대기)**. 실제 CLASH ROYALE/클래시 로얄 로고를 확인했습니다. 사용자 표현 클래시오브 클랜과 다른 게임입니다.','',f"원본: `{result['source']['path']}` (읽기전용). AVFoundation 길이216.3932초·1080×2340·nominalFrameRate60.5471763611. 파일명시각은영상타임라인출처로사용하지않습니다.",'','5초coarse44 + 전환fine71 + 주변정밀78 + 확인판6 = 추출199개. 콘택트시트193개항목과확인판대표1개=194항목을직접확인했으며중복시간을포함합니다. exactactualTime은각index.json에보존했습니다.','', '게임 고유판틀후보12 / 외부판틀2. 게임전체전수조사/조립완료가아닙니다. 모든JPG는원본참조이며production용이아닙니다.','', '| ID | 판틀 | 실제 대표초 | 대표 JPG |','| --- | --- | ---: | --- |']
for f in families: lines.append(f"| {f['id']} | {f['name']} | {f['evidence']['actualSeconds']:.6f} | [{f['representative']}]({f['representative']}) |")
lines+=['','## 분류 원칙','','전투1/2·유닛·체력·안내·카드바표시/숨김은전투같은판틀의상태입니다. 보상4종과요약은같은보상흐름입니다. 덱과컬렉션은공통셸을공유하지만본문분할구조가달라두대표를유지했습니다. 카드선택·업그레이드전후는컬렉션의상태입니다.','', '## 판틀별 구조와 관찰']
for f in families:
 lines+=['',f"### {f['id']} {f['name']}",'',f['structure'],'',f"관찰문구: {' / '.join(f['displayTextObserved'])}",'',f"진입: {f['entry']['detail']}",f"복귀·이탈: {f['exit']['detail']}",f"스크롤: {f['scroll']['detail']}",'','부품계층:']
 for n in f['components']:lines.append(f"- `{n['parent'] or '-'} → {n['id']}` ({n['role']}): {n['description']}"+(f"; 원본px대략{n['approxSourceRectXYWH']}" if 'approxSourceRectXYWH' in n else ''))
 lines+=['', '미확인: '+'; '.join(f['unknown'])]
lines+=['','## 화면 전환 근거','','전환은실제화면전후관찰입니다. 안내손/버튼강조만으로실제클릭입력을확정하지않습니다. 아래숫자는마지막이전샘플~첫이후샘플의범위이며정확한클릭시각이아닙니다.','','| from → to | 샘플구간(초) | 관찰 | 조작근거 |','| --- | --- | --- | --- |']
for x in result['transitions']:lines.append(f"| {x['from']} → {x['to']} | {x['lastBeforeSampleSeconds']:.3f}~{x['firstAfterSampleSeconds']:.3f} | {x['observedSequence']} | {x['controlEvidence']} |")
lines+=['','## 보존·미완료','','- 원본영상수정0·삭제0. 제품소스/설계/공용STATUS·report수정0. 브라우저/서버/새패키지/외부발송0.','- 새로만든것은지정폴더안의추출참고JPG·콘택트시트·메타정보·이분석JSON/MD입니다.','- 부품사각형은1080×2340캡처수동대략값입니다. 논리좌표/폰트/Unity계층으로쓰지않습니다.','- 게임엔진연결·UI스튜디오조립·반응형·키보드검수·원본폰트/자원은미실시입니다.','- 전투2는216.198초에도진행중이며그뒤결과는없습니다.','- JSON이상세정본이며각evidence의실제시간/프레임경로·부모계층·탭·스크롤·추정/미확인을보존합니다.']
(p/'analysis.md').write_text('\n'.join(lines)+'\n')
# Representative contact sheet is a reference index, not production artwork.
thumbs=[(f['id'],f['name'],f['representative'],f['evidence']['actualSeconds']) for f in families]
sheet=Image.new('RGB',(1400,((len(thumbs)+6)//7)*462),'#20242c');d=ImageDraw.Draw(sheet)
for k,(fid,name,path,t) in enumerate(thumbs):
 im=Image.open(p/path);im.thumbnail((200,434));x=(k%7)*200;y=(k//7)*462;sheet.paste(im,(x,y+28));d.text((x+5,y+5),f'{fid} | {t:.3f}s',fill='white')
sheet.save(p/'representative-families.jpg',quality=91)
print(json.dumps({'families':len(families),'game':sum(f['scope']=='game' for f in families),'external':sum(f['scope']!='game' for f in families),'representatives':len(list((p/'representatives').glob('*.jpg'))),'transitions':len(transitions),'jsonBytes':(p/'analysis.json').stat().st_size},ensure_ascii=False))
