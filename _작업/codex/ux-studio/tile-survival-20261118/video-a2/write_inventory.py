import json, shutil
from pathlib import Path
from datetime import datetime
repo=Path('/Users/max/projest_max/ui-studio')
base=repo/'_작업/codex/ux-studio/tile-survival-20261118'
out=base/'video-a2'
frames=base/'TSV02/frames'
detail=out/'detail-frames'
index=json.loads((frames/'index.json').read_text())
di=json.loads((detail/'index.json').read_text())
refs=out/'representatives';refs.mkdir(exist_ok=True)
def ref(second, precise=False):
    root=detail if precise else frames
    entries=di['frames'] if precise else index['frames']
    e=next(e for e in entries if e['requested']==second)
    name=f"TSV02_{second:06.1f}s_{'detail' if precise else 'sample'}.jpg"
    shutil.copy2(root/e['file'],refs/name)
    return {'requested_seconds':second,'timecode':f"{int(second)//60:02d}:{int(second)%60:02d}",'actual_seconds':e['actual'],'source_frame':str((root/e['file']).relative_to(repo)),'representative_frame':str((refs/name).relative_to(repo))}
families=[]
def add(id,label,kind,seconds,reps,layout,observed_texts,states,entry,close,pass_data,children,notes=None):
    families.append({'id':id,'label':label,'kind':kind,'seen_seconds':seconds,'representatives':[ref(*r) if isinstance(r,tuple) else ref(r) for r in reps],'layout_observation':layout,'observed_texts':observed_texts,'state_variants':states,'entry_observation':entry,'close_or_return_observation':close,'proposed_parent':'OverlayHost' if kind in ['modal','celebration','transient'] else ('ScreenHost' if kind=='screen' else ('WorldScreen' if kind in ['world_component','docked_panel'] else 'SequenceHost')),'proposed_children':children,'proposed_pass_data':pass_data,'notes':notes or []})
add('TSV02-F01','정착지/월드 공통 HUD','screen',[0,5,10,25,65,95,110,120,135,160,185,200,230,240,255,270,295,345,385,400,410,425,455,477],[110,425],
 ['상단 얇은 청색 자원바: 좌측 지휘관 초상, 전투력, 식사/시간, 인원/정원, 목재. 우측 황색 보석지갑+빨간 알림점.','좌측 상단 전투/이벤트 카드, 좌하단 신규 생존자 입구, 하단 왼쪽 퀘스트 두루마리와 한 줄 진행도.','아래 청색 내비게이션은 잠금 슬롯 다수와 해제된 영웅, 맨 오른쪽 외출. 우측 가장자리 세로 퀵버튼/알림.','지도는 안개·숲·울타리·건물·인물. 스크롤/카메라 이동으로 건물 위치만 달라짐.'],
 ['생존자 1명 목재 공방으로 파견 [1/1]','민가1 2레벨 달성 [2/2]','영웅','외출'],
 ['잠금 슬롯→영웅 해제','퀘스트 미완료/완료 초록 수치','일반지도/안개확장/레벨 선물상자','식사 시간대 표시 변화'],
 '영상의 기본 화면. 여러 패널에서 복귀함. 화면 이동은 관찰되나 제스처 이벤트 로그는 없음.',
 '최상위 월드이므로 자체 닫기 없음. 하위 화면 복귀 목적지.',
 ['commanderPortrait','combatPower','dayClockOrMealCountdown','population/currentCapacity','resourceWallets','quest{id,text,current,target,status}','navItems{id,label,locked,badge}','quickEntries'],
 ['WorldStage','TopResourceBar','CommanderPortraitButton','WalletButton','EventEntry','QuestStrip','BottomNav','QuickEntryRail','ModalHost'])
add('TSV02-F02','월드 포인트/확장·공사 상호작용','world_component',[0,5,30,35,40,55,95,180,200,235,260,265,410],[0,35,55,260],
 ['월드 위치에 붙은 원형 자원/망치/말풍선/해골/번개 아이콘, 레벨 표지, 비용 pill.','확장 가능 영역은 금빛 테두리 타일/울타리로 강조. 공사 중에는 건물 앞 타이머 pill과 작은 진행 게이지.','일정 공사 완료 후 같은 자리의 건물이 큰 리본 선물상자로 바뀜.'],
 ['발전소3레벨','200/200','100','00:00:03','HELP!'],
 ['닫힘/잠김 조건','비용충족 강조','공사 3초→1초','선물상자 미개봉','구조지점 HELP/해골 전투 포인트'],
 '지도 안의 포인트 근처로 커서와 카메라가 이동. 개별 지점 입력 식별자는 영상만으로 확인 불가.',
 '완료/수령 후 월드 상태 변화. 일반 닫기 버튼 없음.',
 ['worldPointId','kind','position','requiredBuildingLevel','requiredResource{id,amount}','progress{current,target}','remainingTime','constructionState','rewardReady'],
 ['WorldAnchor','ActionMarker','RequirementPill','TimerPill','LevelBadge','SelectionArea','GiftReadyVisual'],
 ['월드 건물/지형 렌더링 자체는 UI 패널 자산으로 분리하지 않음.','같은 포인트 장치의 비용·건물·타이머 내용 변형은 통합.'])
add('TSV02-F03','건물 상세/가구 선택 하단 패널','docked_panel',[17,50,51,90,100,150,155,245,390,419,420,460],[(17,True),90,390,420],
 ['화면 윗부분은 선택 건물로 확대. 상단 자원 두 종류만 남고 하단 약30%가 청백색 패널.','청색 제목줄에 건물명+Lv, 우측 녹색 업그레이드 또는 진행%. 아래 생산/수면/기분 등 지표 가로줄.','가구 카드는 가로 스크롤식: 위 작은 레벨점, 중앙 가구 이미지, 아래 가격/자물쇠/건설 상태.'],
 ['목재 공방 Lv.2','제련 공방 Lv.1','민가-1 Lv.1','주방 Lv.1','온실 Lv.1','업그레이드','시간당 생산량','수면','기분','생산량','소모','포만도'],
 ['목재공방/제련공방/민가1·2/주방/온실 데이터 변형','건설 가능/잠금/재료가격','건물 XP 24%·40%·0%','특정 가구 선택의 반짝임','가구레벨 상한 경고'],
 '기본지도에서 건물을 선택한 뒤 확대된 건물과 하단 가구 패널을 관찰함. 정확 입력 이벤트는 없음.',
 '다음 월드 프레임으로 복귀. 전용 X는 보이지 않음; 바깥 터치/뒤로 여부는 미확인.',
 ['buildingId','buildingName','level','xpPercent','stats[{id,label,value,icon}]','furniture[{id,icon,level,maxLevel,cost,locked,canBuild}]','activeFurnitureId','upgradeAvailable'],
 ['FocusedWorldPreview','BuildingHeader','StatsGrid','FurnitureCarousel','FurnitureCard','ContextQuestToast'],
 ['건물마다 별도 판틀을 만들 필요 없이 지표 열 개수와 카드 데이터로 변형 가능.'])
add('TSV02-F04','건물 업그레이드 조건/보상 하단 패널','docked_panel',[18,101,250],[(18,True),(101,True),250],
 ['건물 확대 화면 아래 청색 헤더에 현재 Lv→다음 Lv와 물음표.','업그레이드 보상은 잠금해제·전투력·생산속도 아이콘 3개 가로열. 조건은 건물 레벨·재료보유/필요 수치 행.','아래 원본시간과 시계 아이콘 있는 긴 업그레이드 버튼. 조건 부족이면 회색, 행은 붉은 글씨와 청색 이동 화살표. 충족이면 체크와 녹색 버튼.'],
 ['목재 공방 Lv.2 → Lv.3','제련 공방 Lv.2 → Lv.3','민가-2 Lv.1 → Lv.2','업그레이드 보상','업그레이드 조건','잠금 해제','전투력 +106','금속 +50/시간','원본 시간: 00:00:03','발전소 Lv.3','1,422/400','11,857/400'],
 ['선행건물 부족/재료충족','모든 조건충족','회색 비활성/녹색 활성','조건으로 바로 가기 화살표'],
 'F03의 녹색 업그레이드 위치 다음에 같은 건물 확대/조건패널로 전환(17→18초, 245→250초).',
 '전용 닫기 버튼은 보이지 않음. 상위 건물패널/월드 복귀 방식 미확인.',
 ['buildingId','currentLevel','targetLevel','benefits[{id,label,value}]','requirements[{type,targetId,current,required,satisfied,navigationTarget}]','durationSeconds','canUpgrade'],
 ['UpgradeHeader','BenefitRow','RequirementList','RequirementRow','NavigateRequirementButton','DurationLabel','UpgradeButton'])
add('TSV02-F05','건물 레벨업 성공 오버레이','celebration',[75,76,108,470,471],[75,(108,True),(471,True)],
 ['기존 월드 배경이 어두워짐. 위 건물명+업그레이드 성공, 중앙 붉은 리본 Lv.2와 광선/색종이.','아래 선택적으로 생산속도 전→후, 보상 아이콘 두 개, 맨 아래 아무 곳 터치 닫기.'],
 ['제련 공방 업그레이드 성공','민가-1 업그레이드 성공','민가-2 업그레이드 성공','Lv.2','금속 생산 속도: 50 » 100','아무 곳이나 터치해 닫으세요.'],
 ['제련공방: 생산 전후+보석10+가구','민가1/민가2: 보석10+침대 가구','연출 초기에 본문이 아직 나타나지 않는 타이밍'],
 '월드의 선물상자/건물 업그레이드 완료 다음에 표시.',
 '하단 문구로 아무곳 터치 닫기 확인. 실제 입력 코드/정확 클릭 시점은 미확인.',
 ['buildingId','buildingName','newLevel','statChanges[{label,before,after}]','rewards[{id,amount,icon}]'],
 ['Scrim','SuccessTitle','LevelRibbon','StatChangeRow','RewardRow','TapAnywhereHint','Confetti'])
add('TSV02-F06','발전소 레벨/전투력 증가 큰 축하판','celebration',[20,21],[20,(21,True)],
 ['어두운 월드 위 중앙 커다란 금색 발전소 아이콘과 빨간 Lv.3 리본. 아래 크림색 방패형 기록판.','기록판은 전투력 증가와 전기 공급 구역 전→후, 보상 EXP/보석칸. 하단 터치 계속 문구.'],
 ['Lv.3','전투력 증가: 10.07K → 16.37K','전기 공급 구역: 6 → 8','화면을 터치하여 계속하세요.'],
 ['본 영상에서 발전소 Lv.3 한 건만 확인. F05와 축하용 공통 부품은 공유하되 큰 기록판은 다른 판틀.'],
 '18초 목재공방 선행조건 부족 화면 뒤 19초 암전→20초 발전소 레벨 증가. 중간 입력/이동은 샘플에서 미확인.',
 '화면터치 계속 문구.',
 ['level','powerBefore','powerAfter','supplyZoneBefore','supplyZoneAfter','rewards'],
 ['Scrim','PowerStationEmblem','LevelRibbon','ParchmentStatsPanel','BeforeAfterRow','RewardRow','TapAnywhereHint'],
 ['상단이 Google Play 서비스 업데이트 OS 알림으로 가려져 있음. 알림 배너는 게임 UI 아님.'])
add('TSV02-F07','지휘관 정보 편집 모달','modal',[60],[60],
 ['블러된 월드 위 청색 테두리 직사각 모달. 헤더 지휘관 정보/우상단 X.','닉네임 라벨·3~16자 안내·한 줄 입력칸·문자숫자 제한 안내.','성별은 남/여/기타/없음 2×2 체크 선택. 하단 긴 회색 무료 버튼.'],
 ['지휘관 정보','지휘관 닉네임','이름은 3~16자 이내여야 합니다.','Survivor.43a3e','문자와 숫자만 사용하세요.','지휘관 성별','남','여','기타','없음','무료','빈 곳을 탭하여 닫기'],
 ['없음이 초록 체크','무료 버튼 회색. 닉네임 변경 입력/다른 성별 선택 결과는 관찰되지 않음.'],
 '직전 월드는 지휘관 초상 상단 위치. 초상 클릭이 입구인지는 영상 시퀀스 기반 추정.',
 '우상단 X와 하단 빈 곳 탭 닫기 문구가 보임.',
 ['commanderId','nickname','gender','nameLengthLimits','renameCost','canSubmit'],
 ['DialogFrame','Header','CloseButton','NicknameSection','TextInput','GenderRadioGrid','SubmitButton','OutsideDismissHint'])
add('TSV02-F08','생존자 파견/인력 관리 패널','docked_panel',[80,130],[80,130],
 ['상단 일부는 월드, 하단 약75%에 청백색 생존자 패널. 우상단 근거지편지함 원형 입구.','상단 인원/정원, 작업중/휴식중/아픔/파업중 4개 요약. 건물 아이콘/배정 인원 실루엣/현재·최대/−·+ 행 목록.','하단 긴 녹색 자동 파견, 맨 아래 뒤로/파견/속성 상세정보 탭.'],
 ['생존자','4/4','작업 중 3','휴식 중 1','아픔 0','파업 중 0','목재 공방','제련 공방','주방','온실','자동 파견','파견','속성 상세정보','근거지 편지함'],
 ['건물별 1/2·0/1·1/1','비활성 −/+','알림점','빈/로드 중처럼 희미한 목록 130초(연출 중 프레임)'],
 '월드 왼쪽 생존자 관련 입구 이후 표시(75→80초). 정확 입구클릭은 이벤트로그 없음.',
 '좌하단 뒤로 화살표. 속성 상세정보 탭 내용은 영상에 없음.',
 ['population','capacity','statusCounts','workplaces[{buildingId,name,icon,assigned,max,canAdd,canRemove}]','activeTab'],
 ['SurvivorHeader','MailboxShortcut','StatusSummary','WorkplaceScrollList','WorkplaceAssignmentRow','AutoDispatchButton','BottomTabBar','BackButton'])
add('TSV02-F09','생존자 수용/정원 모달','modal',[105,125],[105,125],
 ['블러 월드 위 청색 클립보드 모달. 상단 총인구/침대자리 2열, 아래 수용대기 인원과 초상카드.','정원부족은 빨간 안내와 우하단 침대확장 이동버튼. 수용가능은 체크된 초상과 녹색 생존자 수용 버튼.'],
 ['생존자 수용','총 인구 4','침대 자리 4','수용 대기 생존자: 2','수잔','지미','침대를 확장해 더 많은 생존자를 수용하세요.','4+2','침대 자리 6'],
 ['정원 부족 4/4','수용가능 4+2/6','초상 미선택/초록 체크 선택'],
 '생존자 도착 알림/입구 후의 수용 화면. 105초→민가2 업그레이드→125초 수용가능 변화.',
 '우상단 X, 빈곳 닫기 안내. 수용 후 월드에 생존자+2 피드백(126초).',
 ['currentPopulation','bedCapacity','waitingSurvivors[{id,name,portrait,selected}]','selectedCount','canAccept','capacityNavigationTarget'],
 ['ClipboardFrame','CloseButton','HelpButton','CapacityComparison','WaitingSurvivorGrid','SurvivorChoiceCard','CapacityWarning','CapacityNavigateButton','AcceptButton','OutsideDismissHint'])
add('TSV02-F10','근거지 편지함','screen',[115,445,446,475],[115,445,475],
 ['청록 우편함 상단과 투입구, 제목+물음표. 상단 요약판에 불만안내·선물입구와 식사/수면/기분 세 가로게이지.','아래 생존자 사건 카드 한 개와 생존자 평가 세로 목록. 초상/이름/메시지/행동 아이콘(망치·교환·좋아요).','하단 뒤로/근거지 편지함/생존자 도감 두 탭.'],
 ['근거지 편지함','생존자들에게 약간의 불만이 있지만, 그래도 여전히 당신을 믿고 있습니다!','생존자 사건','생존자 평가','미아','제이슨','도저히 민가-1의 변기을(를) 참을 수가 없어!','건설하기 »','당신과 물건을 교환하고 싶어요!','교환하기 »','생존자 도감'],
 ['민가-1 화장실 건설 요청 사건','제이슨 물물교환 사건','식사51.00·수면50.00·기분51.00→52.00','관계진행 1/3 녹색 막대가 일시 겹침'],
 '파견패널 우상단 근거지편지함 입구 또는 월드 사건/편지 관련 입구. 115초 수용전, 445/475초 교환사건 상태.',
 '좌하단 뒤로. 생존자도감 탭 버튼은 보이나 탭 내용은 미확인.',
 ['satisfactionStats[{id,value,icon}]','summaryText','eventCards[{eventId,survivorId,portrait,name,text,actionType,targetId,status}]','reviews[{survivorId,text,liked}]','activeTab'],
 ['MailboxHeader','HelpButton','NeedsSummary','NeedGauge','SurvivorEventList','EventCard','ReviewList','ReviewCard','BottomTabBar','BackButton'])
add('TSV02-F11','생존자 물물교환 의뢰 모달','modal',[450],[450],
 ['블러 월드 위 주황 상단 캐릭터·이름, 종이 본문, 획득 노란 영역, 아래 주황 다음에/녹색 교환 2버튼.','우상단 원형 X. 교환 버튼에 목재 아이콘1000이 먼저 붙음.'],
 ['제이슨','저기, 사장님! 공구를 수리할 나무가 부족한데 모아둔 토마토와 바꿀 수 있을까?','획득','5분 x1','x10','다음에','1000 교환','빈 곳을 탭하여 닫기'],
 ['교환가능해 보이는 녹색 버튼. 실제 교환 수행 결과는 영상에 없음(커서 다음에).'],
 'F10 제이슨 사건의 교환하기 뒤 월드 및 모달 표시(446→450초).',
 'X/다음에/빈곳닫기 표시. 451초 월드 복귀, 다음에 버튼 근처 커서.',
 ['eventId','survivorId','name','portrait','requestText','cost{id,amount}','rewards[{id,amount}]','canExchange'],
 ['ExchangeDialogFrame','SpeakerPortrait','NameLabel','CloseButton','RequestText','RewardSection','RewardCard','LaterButton','ExchangeButton','OutsideDismissHint'])
add('TSV02-F12','챕터 미션 노트 모달','modal',[169,170,171],[(169,True),170,(171,True)],
 ['블러 월드 위 흰 노트/책 판틀, 우상단 X. 상단 챕터 일러스트와 제목.','미션행은 번호·제목·현재/목표, 보상아이콘, 우측 수령 또는 초록체크.','아래 고정 챕터 미션 보상 아이콘열+모두수령.'],
 ['챕터 2','위기 예보','2-10 민가1 2레벨 달성 (2/2)','2-12 생존자 수용 (1/1)','2-2 목재 공방 건설 (1/1)','2-8 제련 공방 건설 (1/1)','수령','이번 챕터 미션 보상','모두 수령'],
 ['수령가능/수령완료 체크','개별 수령 시 보석이 월드지갑 쪽으로 이동하는 연출','보석x10·식량x600·목재x1,240 등 미션별 데이터 차이'],
 '월드 하단 두루마리 퀘스트 입구 다음 표시(165→169초).',
 '우상단 X와 빈곳닫기 안내. 모두수령 뒤 F13 챕터완료 연출.',
 ['chapterId','title','illustration','missions[{id,label,current,target,rewards,claimable,claimed}]','chapterRewards','canClaimAll'],
 ['NotebookFrame','CloseButton','ChapterBanner','MissionScrollList','MissionRow','RewardRow','ClaimButton','ClaimedMark','ChapterRewardDock','ClaimAllButton'])
add('TSV02-F13','챕터 완료 보상 축하','celebration',[174],[(174,True)],
 ['미션 노트 배경을 더 블러 처리하고 색종이/무지개 축하합니다!를 위에 표시.','아래 챕터미션완료 안내와 보상아이콘행이 보이나 추출 순간 페이드 중이라 본문 대비 낮음.'],
 ['축하합니다!','챕터 미션 완료를 축하드립니다! 획득 보상:','미션 완료'],
 ['단일 전환연출 프레임. 모든 문구와 닫기 힌트가 안정적으로 보이는 시점은 미확인.'],
 'F12 모두수령 이후 174초.',
 '연출 뒤 176초 새 챕터 배너로 전환. 정확 닫기 동작 미확인.',
 ['chapterId','completionRewards'],
 ['BlurScrim','RainbowCongratulations','CompletionText','RewardRow','Confetti'])
add('TSV02-F14','신규 챕터 소개 카드','transition',[175,176],[(176,True)],
 ['어두운 월드 중앙 흰 테두리의 가로 일러스트 카드. 왼쪽 하단 챕터 숫자/챕터, 오른쪽 하단 제목.'],
 ['3 챕터','용사 집결'],
 ['같은 카드가 175초에는 그림 위주, 176초에는 제목/숫자까지 표시. 내용변형이 아니라 연출 진행.'],
 '챕터완료 축하 뒤 등장.',
 '자동으로 월드 구조지점 카메라로 전환되는 순서. 입력 필요 여부 미확인.',
 ['chapterId','chapterTitle','bannerArt'],
 ['Scrim','ChapterIntroCard','BannerImage','ChapterNumber','ChapterTitle'])
add('TSV02-F15','스토리/주민 대화 하단판','docked_panel',[195,350,352,415,416,440,441],[195,(352,True),440],
 ['인게임 월드 위 하단 흰 대화판. 우측 또는 좌측 인물 반신이 대화판 위로 크게 겹침.','이름을 청색 탭에 표시, 본문2~3줄, 하단 중앙 작은 아래삼각, 우하단 스킵> 버튼.','NPC 월드 인물 위 작은 말풍선은 별도 월드 앵커로 표시.'],
 ['럭키','세이지','미아','이 근처에도 감염자가 나타났어. 어서 모두에게 알려야겠어.','하지만 이 큰 녀석을 먼저 처리해야 해.','하하, 엄청 많아, 정말 대수확이네!','너무 고마워! 변기를 고치니 공기가 훨씬 상쾌해졌어!','스킵'],
 ['럭키/세이지/미아 초상·이름·본문만 변형','월드 줌인된 시네마틱 상태','일부프레임의 대화판 페이드'],
 '새 챕터 구조/사건 진행/월드 인물 접근 이후 대화 순서.',
 '다음 삼각/스킵 입구 표시. 실제 스킵 사용 여부는 미확인.',
 ['dialogueId','speakerId','speakerName','portrait','body','nextNodeId','canSkip','worldFocusTarget'],
 ['SpeakerPortrait','DialogueFrame','SpeakerNameTab','BodyText','NextIndicator','SkipButton'])
add('TSV02-F16','튜토리얼 안내 말풍선/손가락','world_component',[10,17,18,100,105,126,145,150,202,270,272,294,296,300,302,419],[300,(202,True),(302,True)],
 ['밝은 안내말풍선은 초상 작은 카드+이름+설명. 특정 버튼/가구 위에 큰 흰 손가락과 노란 맥동.','배경을 어둡게 하고 목표만 밝히는 단계가 있으며, 일부는 월드 상태 그대로 위에 겹침.'],
 ['세이지','터치하여 일반 모집을 시작하세요.','터치하여 현재 영웅을 업그레이드하세요.','생존자를 파견하여 더 강력한 근거지를 건설하세요!'],
 ['목표가구·수용버튼·자동파견·영웅목록·레벨업버튼·일괄출전 등 타깃 교체','말풍선만/손가락만/둘다'],
 '각 시스템 최초 사용 시점에 자동 표시되는 안내 순서로 관찰.',
 '대상 조작 후 다음 단계. 전용 닫기/건너뛰기 버튼은 이 안내에서 보이지 않음.',
 ['tutorialStepId','targetElementId','speaker','text','pointerAnchor','highlightTarget','blockOtherInput'],
 ['TutorialScrimOptional','GuideBubble','SpeakerThumb','GuideNameTab','GuideText','HandPointer','PulseRing'],
 ['실제 입력차단 여부/좌표추적 구현은 영상만으로 판단 불가.'])
add('TSV02-F17','스토리 사건 소대 설정/출전','screen',[202,204,205,210,363],[205,(202,True),(363,True)],
 ['전투예정 들판 위 상단 좌우 초상/양측 전투력, 중앙 스토리사건 표패, 좌상단 소대설정.','아군3D와 흰 사각 배치칸, 적 레벨. 하단 약34% 청색 영웅후보 패널.','하단 좌뒤로, 긴 녹색 일괄출전/출격 두 버튼. 선택된 후보카드 초록 체크.'],
 ['소대 설정','스토리 사건','7.42K','3.63K','Lv.1','일괄 출전','출격','12.79K','5.86K'],
 ['2인 소대/3인 소대','빈 배치칸/배치완료','후보카드 미선택/선택 체크','전투력3.12K→7.42K 변화'],
 '월드 해골 전투 지점 뒤 진입(198→202초, 362→363초).',
 '좌하단 뒤로. 출격 후 F18 전투 화면.',
 ['encounterId','friendlyPower','enemyPower','enemyRoster','formationSlots','candidateHeroes','selectedHeroIds'],
 ['EncounterHeader','PowerComparison','FormationPreview','FormationSlot','CandidateTray','CandidateHeroCard','BackButton','DeployAllButton','StartBattleButton'])
add('TSV02-F18','자동전투/스킬 HUD','screen',[215,220,365,370,375,378],[215,375],
 ['상단 양측 초상/전투력과 스토리사건. 월드 전투구역에 캐릭터 HP바와 발밑 원형링.','좌하단 일시정지 파란 버튼. 우측 아래 자동/배속 x1 세로버튼, 초기는 자물쇠, 후반 자동은 체크.','최하단 영웅 초상 스킬카드 2~3개+숫자 쿨다운/게이지. 스킬시 광택/화염/보라 이펙트.'],
 ['스토리 사건','자동','x1','3','4','5','6','7'],
 ['2인/3인 스킬바','자동 잠금/활성 체크','전투시작 VS 연출','재사용대기 수치/스킬준비 불꽃','적HP 감소/피격 이펙트'],
 'F17 출격 다음 전투 215초/365초.',
 '명시적 복귀 버튼 없음. 일시정지 버튼은 보이나 정지 모달 내용은 미확인. 전투종료 후 F19.',
 ['encounterId','friendlyHeroes','enemyHeroes','healthByUnit','skillCooldowns','skillReady','autoUnlocked','autoEnabled','battleSpeed','paused'],
 ['EncounterHeader','BattleStage','WorldHealthBars','PauseButton','AutoToggle','SpeedButton','HeroSkillDock','SkillPortrait','CooldownLabel','SkillEnergyBar'])
add('TSV02-F19','전투 승리/통계 결과','screen',[225,226,380],[(226,True),380],
 ['위 주황 해질녘 배경+승리 캐릭터 반신, 큰 승리. 아래 반투명 검정 통계판.','공격&치료/받은데미지 두 탭, 영웅초상·이름·빨간 가로막대·오른쪽 수치. 아래 녹색 근거지복귀.'],
 ['승리','공격&치료','받은 데미지','세이지','고스트','럭키','2.86K','1.72K','7.25K','4.98K','2.24K','근거지 복귀'],
 ['2인 통계/3인 통계','처음 등장 때 어두운 전장 배경→안정 후 주황 승리상단','받은데미지 탭의 실제 내용 미확인'],
 'F18 전투종료/승리스킬 연출 뒤 표시.',
 '하단 근거지복귀 버튼→월드 보상 부유텍스트(230/385초).',
 ['encounterId','result','mvpHero','selectedMetric','heroStats[{heroId,name,portrait,damage,healing,damageTaken}]','returnTarget'],
 ['VictoryHeroStage','VictoryTitle','MetricTabs','StatList','HeroStatRow','BarGraph','ReturnToBaseButton'])
add('TSV02-F20','영웅 모집 로비','screen',[272,307,328,338,360,361],[(272,True),(307,True),360],
 ['상단 영웅모집 제목, 보석/모집권 지갑+더하기. 우측 보상품보기/모집기록 원형입구.','대형 일러스트 배경이 일반(보라·여럿)/고급(주황·매디)로 변함.','아래 무료횟수 또는 무료까지 시간·1회/10연속 황색 버튼·할인. 맨 아래 뒤로, 고급/일반 초상탭.'],
 ['영웅 모집','일반모집','고급모집','보상품 보기','모집 기록','무료 횟수: 5','무료 횟수: 1','무료 모집','60회 모집 시 전설 영웅 반드시 획득','60회 남음','23h 31m 후 무료','1회 뽑기','10연속 뽑기','10% OFF','고급','일반'],
 ['일반/고급 같은 틀의 배경·문구·권종 변형','무료소진 전 녹색 단일 무료버튼/후 황색1회·10회','모집권10→9 할인','고급탭 남은 이벤트19d23h'],
 '월드 영웅 기능/모집 안내에서 진입(270→272초). 이후 영웅목록 모집버튼→로비(306→307초).',
 '좌하단 뒤로. 모집을 누르면 F21 연출, 끝나면 F22/F23.',
 ['bannerId','poolType','art','wallets','ticketType','freeDrawCount','freeCooldown','pity{current,target}','singleCost','multiCost','multiDiscount','eventEndTime'],
 ['RecruitHeader','WalletBar','RewardPreviewButton','HistoryButton','BannerArt','PoolTitle','PityLabel','FreeDrawInfo','DrawButtons','PoolTabs','BackButton'],
 ['보상품보기/모집기록 버튼의 목적 화면은 영상에서 열리지 않음.'])
add('TSV02-F21','모집 열차 연출/스킵','transition',[275,276,279,280,281,308,309,310,312,315,316],[(309,True),(312,True),(316,True)],
 ['전면 세로영상: 협곡 철로 전진→열차문→밝게 열리는 연출. 우하단 작은 스킵> 고정.','일반 때 푸른문/고급 때 노란문이나 판틀·단계는 같음.'],
 ['스킵'],
 ['일반/고급 조명색','철로/열차문/개방 광원은 한 시퀀스 단계'],
 'F20 무료모집/뽑기 버튼 이후.',
 '스킵 버튼 표시. 실제 스킵 사용은 미확인. 다음 신규영웅 또는 모집결과.',
 ['poolType','drawRequestId','animationVariant','canSkip','resultPayload'],
 ['RecruitCinematicStage','SkipButton'])
add('TSV02-F22','신규 영웅 해제 전면 소개','screen',[283,285,286,288],[(283,True),285,(288,True)],
 ['파랑 사선 배경+중앙 영웅 전신 포즈애니메이션. 상단 신규영웅해제 문구, 우측 큰 희귀도 R.','하단 이름 고스트, 역할 총아이콘, 원형스킬3개 카드, 터치계속.'],
 ['신규 영웅이 해제되었습니다.','R','고스트','화면을 터치하여 계속하세요.'],
 ['포즈·스프레이/TIM 장식 애니메이션 변화는 같은 해제판틀'],
 '첫 일반모집 열차연출 뒤 등장.',
 '화면터치 계속 문구→F23 모집결과.',
 ['heroId','name','rarity','role','heroVisual','skillIcons','isNew'],
 ['HeroUnlockBackground','UnlockTitle','HeroPresentationStage','RarityMark','HeroName','RoleMark','SkillPreviewRow','TapContinueHint'])
add('TSV02-F23','모집 결과 카드/재모집','screen',[290,291,319,320,322,325,326],[290,320],
 ['진청색 전체배경. 상단 모집결과+보석/권 지갑과 더하기/영상스킵 체크.','중앙 긴 세로 결과카드 1개. 신규고스트 초상 또는 매디(조각)x1 금빛카드.','하단 뒤로와 황색1회/10회 재모집 버튼, 고급은 할인표시.'],
 ['모집 결과','영상 스킵','700','0','고스트','매디 (조각)','x1','1 재모집','10 재모집','10% OFF','9 재모집'],
 ['영웅획득/영웅조각','일반모집권/고급모집권','10연속가격 할인','결과카드 개수1만 영상 확인'],
 '신규영웅 소개 뒤(290초) 또는 고급열차연출 직후(319초).',
 '좌하단 뒤로→모집로비/월드. 재모집 입구는 보이나 실제 재모집 실행 흐름은 제한적.',
 ['drawRequestId','poolType','wallets','skipAnimation','results[{type,heroId,itemId,name,rarity,amount,isNew}]','singleCost','multiCost','discount'],
 ['ResultHeader','WalletBar','SkipAnimationCheckbox','ResultCardArea','RecruitResultCard','BackButton','RedrawButtons'])
add('TSV02-F24','영웅 도감/보유 목록','screen',[296,298,300,306,330,336,340,435,437],[330,435,(437,True)],
 ['청색화면 상단 영웅. 그 아래 전체/속성아이콘3개 탭. 카드4열 그리드.','보유영웅은 Lv표시·별·승급 화살표·알림점, 미보유는 조각0/10 등. 하단 뒤로와 긴 녹색모집.','필터 선택은 밝은 흰 탭, 비선택청색.'],
 ['영웅','전체','Lv.1','Lv.5','0/10','1/10','모집'],
 ['전체/녹색산·주황속성·구름속성 필터','영웅획득/미획득·조각보유','레벨업 가능화살표','2명보유/11카드목록(전체화면)'],
 '월드 하단 영웅 아이콘 후(294→296초), 모집/상세에서 돌아온 화면.',
 '좌하단 뒤로→월드, 하단모집→F20. 영웅카드→F25.',
 ['heroes[{id,name,portrait,rarity,element,role,owned,level,stars,shards,requiredShards,upgradeAvailable}]','filter'],
 ['RosterHeader','ElementFilterTabs','HeroGrid','HeroRosterCard','BackButton','RecruitButton'])
add('TSV02-F25','영웅 상세/레벨업','screen',[302,304,305,331,334,335],[(302,True),305,(331,True)],
 ['하늘파랑 배경, 상단 이름·속성·무기와 좌측 큰희귀도 SR/R. 중앙 전신 영웅 애니메이션/좌우 넘기기. 우상단2개 정보입구.','하단 전투력, 별/진급관련아이콘, 가디언수량·레벨·부대용량 3열. 경험치현재/필요, 녹색업그레이드 또는 붉은선행건물 안내.','맨 아래 뒤로/속성/스킬 탭. 레벨업시 중간 전투력+수치/능력상승 부유피드백.'],
 ['세이지','고스트','SR','R','전투력','가디언 수량 +2','레벨 5','부대 용량 +50','52,500/500','업그레이드','Lv.4발전소 필요!','속성','스킬'],
 ['세이지/고스트 같은 판틀','Lv1→Lv5','경험치 충족 업그레이드 녹색/발전소Lv4부족 붉은 잠금','세이지 전투력4,300→5,744','고스트2,925→3,926','레벨업 중 포즈·부유수치 변화'],
 'F24 영웅카드 선택 뒤 302초/331초.',
 '좌하단 뒤로→F24. 좌우화살표·속성/스킬·우상단 정보는 입구만 보이며 내부 화면 미확인.',
 ['heroId','name','rarity','element','weapon','visual','power','stars','guardianCount','level','troopCapacity','xpCurrent','xpRequired','canUpgrade','levelRequirement','activeTab'],
 ['HeroDetailHeader','HeroPresentationStage','RarityMark','PreviousNextButtons','InfoButtons','PowerDisplay','StarProgress','HeroStatsRow','XpProgress','UpgradeButton','RequirementNavigate','BottomTabs','BackButton'])
add('TSV02-F26','신규 기능 해제 배너','celebration',[356,357],[(356,True)],
 ['어두운 월드 위 중앙 밝은청록 가로리본. 위 새로운기능해제, 중앙 주황카드아이콘, 아래 모집.','하단 아무곳터치닫기. 이벤트 초기에 색종이.'],
 ['새로운 기능 해제','모집','아무 곳이나 터치해 닫으세요.'],
 ['모집 기능 1건 확인. 영웅버튼이 이미해제된 상태에서 모집입구 추가되는 시점.'],
 '스토리대화→월드→356초 자동축하.',
 '아무곳터치닫기 문구→358초 월드.',
 ['featureId','label','icon','navigationTarget'],
 ['Scrim','UnlockTitle','FeatureRibbon','FeatureIcon','FeatureName','TapDismissHint','Confetti'])
add('TSV02-F27','주민 사건/친밀도 보상 축하','celebration',[444],[(444,True)],
 ['블러 월드 위 무지개 축하합니다!, 친밀도증가1/3 진행막대, 주민초상/이름.','관계이전 지인→동료 pill, 사건보상 아이콘2개, 녹색 편지함으로, 하단 터치계속.'],
 ['축하합니다!','친밀도 증가','1/3','미아','지인','동료','사건 보상','x10','5분 x1','편지함으로','화면을 터치하여 계속하세요.'],
 ['미아 화장실사건 이후의 단일 보상. 일반 챕터축하(F13)와 제목/색종이는 공유하나 본문관계판은 별도.'],
 '미아 대화(440~441초) 다음 표시.',
 '편지함으로→F10 445~446초. 화면터치계속 안내도 표시.',
 ['survivorId','name','portrait','friendshipCurrent','friendshipTarget','relationBefore','relationAfter','eventRewards','mailboxTarget'],
 ['BlurScrim','RainbowCongratulations','FriendshipProgress','SurvivorPortraitCard','RelationChangeRow','EventRewardRow','MailboxButton','TapContinueHint'])
add('TSV02-F28','일시 안내/퀘스트·자원 피드백','transient',[35,45,65,70,80,126,150,230,255,385,395,400],[45,(126,True),400],
 ['상단 검정반투명 한줄토스트(챕터보상가능/조건부족/지역해제), 중하단 파랑퀘스트pill 또는 금빛 체크완료pill.','전투력+20/생존자+2 배너, 보석·토마토·EXP 아이콘이 흩어져 지갑방향으로 올라가는 자원수령.','영웅/주민 짧은 얼굴말풍선도 월드 위 작은카드로 나타남.'],
 ['챕터 미션 완료, 보상 수령 가능!','영웅 지구 1레벨 잠금 해제','레벨 상한에 도달했습니다. 건물을 업그레이드하세요.','현재 가구 레벨이 상한에 도달했습니다. 다른 가구를 먼저 업그레이드하세요.','전투력 +20','생존자 +2','+500','EXP'],
 ['성공/조건부족/튜토리얼/수령 피드백','시간종료로 사라짐. 같은 틀의 텍스트·수치 변형 통합.'],
 '게임행동 결과로 자동 표시.',
 '별도 닫기버튼 없음. 자동 소멸 추정; 구체 지속시간/입력통과 미확인.',
 ['feedbackId','kind','text','icon','amount','anchor','duration','destinationWallet'],
 ['ToastLayer','QuestStatusPill','StatDeltaBanner','FloatingReward','PortraitBubble'],
 ['콘텐츠를 새 화면으로 중복분류하지 않도록 별도 공통 피드백군으로 묶음.'])
# Each base/detail contact sheet was inspected visually, with 43 selected full-size inspections.
for f in families:
    if f['id']=='TSV02-F08': f['proposed_parent']='WorldScreen/SurvivorSheetHost'
    if f['id']=='TSV02-F14': f['proposed_parent']='OverlayHost'
    if f['id']=='TSV02-F16': f['proposed_parent']='TutorialHost'
    if f['id']=='TSV02-F21': f['proposed_parent']='RecruitScreen/SequenceHost'
    if f['id']=='TSV02-F28': f['proposed_parent']='TransientFeedbackHost'
data={
 'schema_version':'1.0','source_id':'TSV02','source_name':'타일 서바이벌2.mov',
 'source_path':json.loads((base/'sources.json').read_text())[1]['path'],
 'analysis_scope':'UI 구조/화면군 관찰과 제작용 부모자식 제안. 실제 엔진 계층·실제 게임연동·제품수치 승인 아님.',
 'status':'제안(검수 대기)','created_at_kst':datetime.now().astimezone().isoformat(),
 'source_duration_seconds':index['duration'],'reference_viewport':{'width':504,'height':894,'orientation':'portrait'},
 'coverage':{'base_sample_step_seconds':5,'base_sample_count':len(index['frames']),'base_requested_range':[0,475],'base_contact_sheets_viewed':[str((base/f'TSV02/contact-{n}.jpg').relative_to(repo)) for n in range(1,6)],'detail_selected_count':len(di['frames']),'detail_requested_seconds':[x['requested'] for x in di['frames']],'detail_contact_sheets_viewed':[str((out/f'detail-contact-{n}.jpg').relative_to(repo)) for n in range(1,5)],'selected_full_size_frames_inspected':True,'full_size_inspection_count':43,'all_representatives_separately_full_size_inspected':False,'continuous_video_playback_performed':False,'audio_transcription_performed':False,'exhaustive_every_frame_review':False},
 'method':['sources.json TSV02 원본경로 확인','기존 5초간격 96프레임을 contact-1..5로 전부 view_image 확인','주요 패널을 원해상도 view_image로 확대확인','기존 AVFoundation extract_video로 지정 77초를 추가추출; detail-contact-1..4 전부 view_image 확인','같은 틀의 건물/인물/보상/문구·애니메이션 내용변형은 하나로 통합'],
 'typography_observation':{'font_file_or_family':'미확인; 영상 외형만으로 특정 폰트명 단정하지 않음','display':'제목/버튼/수치는 두꺼운 둥근 고딕 계열. 흰 글자+짙은 외곽선/그림자 또는 밝은 하늘색 테두리. 승리/축하 문구는 노랑 광택, 레벨은 흰 굵은 글자+진한 외곽선.','body':'밝은 청백판은 진회색/청록 본문, 어두운 카드판은 흰 본문. 닉네임/스탯/제목은 본문보다 무겁고 큼.','numeric':'지갑은 K 단축표시, 재료는 정수/쉼표, 조건은 보유/필요, 타이머 HH:MM:SS, 관계·미션은 현재/목표.','measurement_limits':'폰트파일·정확한 px·자간·줄높이·안전영역 수치는 측정하지 않음. 이미지비율에 근거한 상대 배치만 기록.'},
 'global_visual_language':['선명한 청록/파랑 프레임, 밝은 청백색 본문판, 녹색 주행동, 황색 모집·통화행동, 주황 보조/교환행동','둥근 모서리 버튼, 두꺼운 명암 테두리와 약한 입체감','중요값은 초록·잠금조건은 빨강·알림은 빨간 점·수령완료는 초록체크','모달은 블러/어두운 월드 배경; 도감·영웅·모집은 전체화면','월드 3D 건물/인물/이펙트와 오버레이 UI가 화면상 겹치지만 실제 엔진 캔버스 구분은 확인 불가'],
 'excluded_non_game_or_artifacts':['20~25초 및 일부275~281초 Google Play 서비스 업데이트 OS 배너는 게임 UI 판틀에서 제외','분홍색 데스크톱 커서/흰 튜토리얼손가락을 구분: 분홍 커서는 영상 조작 표시, 흰 손가락은 게임 안내로 관찰','360초 오른쪽 작은 설정(Ctrl+S...)처럼 잘린 외부툴 팁은 게임 구조로 채택하지 않음','모션블러/페이드 중 프레임을 별도 UI로 세지 않음'],
 'families':families,
 'proposed_authoring_tree':{
 'ReferencePreviewRoot':['ScreenHost','OverlayHost','TutorialHost','TransientFeedbackHost'],
 'ScreenHost':['WorldScreen(F01/F02)','SurvivorScreen(F08/F10)','EncounterScreen(F17/F18/F19)','HeroScreen(F24/F25)','RecruitScreen(F20/F21/F22/F23)'],
 'WorldScreen':['WorldStage','SharedHud(F01)','WorldAnchors(F02)','DockedInspector(F03/F04)','DialogueDock(F15)'],
 'OverlayHost':['CommanderDialog(F07)','SurvivorIntake(F09)','ExchangeDialog(F11)','ChapterNotebook(F12)','CelebrationHost(F05/F06/F13/F26/F27)','ChapterIntro(F14)'],
 'TutorialHost':['GuideBubble','HandPointer','TargetHighlight'],
 'TransientFeedbackHost':['Toast','QuestPill','StatDelta','FloatingReward'],
 'disclaimer':'관찰 화면을 편집·재사용하기 위한 제작 제안이며 영상 원작의 Unity/엔진 계층을 복원했다는 뜻이 아님.'},
 'suggested_reuse':['공통 Button(녹색/황색/청색/주황/회색), Header, BackButton, CloseButton, HelpButton, BadgeDot, ResourceValue, RewardCard, PortraitCard, TabBar, Gauge','F03/F04는 buildingId로 같은 패널에 건물·가구·조건 데이터를 전달','F09 수용부족/수용가능은 capacity와 selection 상태로 변형','F20 일반/고급 및 무료/유료는 poolType/freeDrawCount/cost 데이터로 변형','F23 영웅/조각 결과는 result.type으로 변형','F24 목록·필터와 F25 상세는 동일 heroId를 전달','F17→F18→F19는 encounterId/formation/result를 연결하는 참조 흐름'],
 'not_verified':['영상 원작의 실제 엔진/Canvas/GameObject/Prefab 계층','폰트파일·이미지자산 원본·9-slice 경계·정확한 픽셀치수','클릭 이벤트 로그·제스처·후면입력차단·실제 네비게이션 코드','생존자 속성상세정보/도감/지휘관 제출결과','모집 보상품보기/모집기록·10연속결과','영웅 스킬탭/상단정보입구/진급 상세','일시정지 메뉴/배속해제 조건/자동전투 잠금조건','NPC 교환완료결과 및 다른 의뢰 유형','샘플 사이 아주 짧은 UI·영상 마지막478.453초의 정지화면','실제 게임과 기능연동/출시가능 UI 자원제작'],
 'asset_usage_rule':'모든 JPG는 원본영상에서 분석용으로 추출·복사한 reference다. 프로덕션 UI 이미지로 잘라붙이거나 납품자산으로 간주하지 않는다.'
}
(out/'inventory.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
lines=['# TSV02 UI 구조 관찰 목록','',f"작성: codex 하위 분석 · {data['created_at_kst']} · 제안(검수 대기)",'',
 '원본: `타일 서바이벌2.mov` / 478.453초 / 세로 504×894. 기존 5초 프레임 96장(contact-1~5 전부)과 지정초 정밀 프레임 77장(detail-contact-1~4 전부)을 실제 이미지로 확인했습니다. 연속 영상 재생·오디오전사는 하지 않았으며 전체 프레임을 검토했다고 주장하지 않습니다.','',
 '같은 판틀의 인물·건물·보상·숫자·문구·애니메이션 차이는 통합했습니다. 아래 계층·전달값은 편집용 제작 제안이며 원작 엔진 계층과 실제 게임 연동을 확인한 결과가 아닙니다. 모든 추출 이미지는 분석 참조용입니다.','',
 '## 화면군 요약','', '| ID | 화면군 | 종류 | 대표 시각 | 주요 상태 |','|---|---|---|---|---|']
for f in families:
    lines.append('| '+ ' | '.join([f['id'],f['label'],f['kind'],', '.join(x['timecode'] for x in f['representatives']),'; '.join(f['state_variants'])])+' |')
lines+=['','## 타이포·공통 스타일','',*['- '+k+': '+v for k,v in data['typography_observation'].items()],*['- '+x for x in data['global_visual_language']],'','## 화면군 상세','']
for f in families:
    lines += [f"### {f['id']} · {f['label']}",'', '**대표 증거**: '+', '.join(f"[{r['timecode']}]({Path(r['representative_frame']).relative_to(out.relative_to(repo))}) (요청 {r['requested_seconds']}초 / 실제 {r['actual_seconds']:.3f}초)" for r in f['representatives']), '', '**실제 관찰**', *['- '+s for s in f['layout_observation']], '', '**텍스트·수치 예시**: '+' / '.join(f['observed_texts']), '', '**상태 통합**: '+'; '.join(f['state_variants']), '', '**입구**: '+f['entry_observation'],'','**닫기·복귀**: '+f['close_or_return_observation'],'','**제작 시 부모·자식 제안**: '+f['proposed_parent']+' → '+', '.join(f['proposed_children']),'','**전달 데이터 제안**: '+', '.join(f['proposed_pass_data']), '']
    if f['notes']:lines += ['**한계·메모**: '+'; '.join(f['notes']),'']
lines+=['## 부모·자식 조립 제안','', '```text','ReferencePreviewRoot','├─ ScreenHost','│  ├─ WorldScreen','│  │  ├─ WorldStage + 월드 앵커/포인트(F02)','│  │  ├─ 공통 HUD(F01)','│  │  ├─ DockedInspector → 건물상세(F03) / 업그레이드조건(F04)','│  │  └─ DialogueDock(F15)','│  ├─ SurvivorScreen → 파견(F08) / 편지함(F10)','│  ├─ EncounterScreen → 소대(F17) / 전투(F18) / 승리(F19)','│  ├─ HeroScreen → 목록(F24) / 상세(F25)','│  └─ RecruitScreen → 로비(F20) / 연출(F21) / 해제(F22) / 결과(F23)','├─ OverlayHost','│  ├─ 지휘관(F07) / 수용(F09) / 교환(F11) / 미션노트(F12)','│  ├─ CelebrationHost(F05/F06/F13/F26/F27)','│  └─ 챕터소개(F14)','├─ TutorialHost(F16)','└─ TransientFeedbackHost(F28)','```','',
 '공통부품: Button(색상·활성상태), Header/Back/Close/Help, BadgeDot, ResourceValue, RewardCard, PortraitCard, TabBar, Gauge. 화면별로 복제하기보다 `buildingId`, `heroId`, `survivorId`, `chapterId`, `encounterId`, `poolType`와 표시데이터를 전달하는 구성을 제안합니다.','',
 '## 확인하지 못한 것','',*['- '+x for x in data['not_verified']],'','## 제외·참조 사용 한계','',*['- '+x for x in data['excluded_non_game_or_artifacts']],'- '+data['asset_usage_rule'],'',
 '## 파일','', '- `inventory.json`: 같은 내용의 구조화된 화면군·상태·전달값·증거.', '- `representatives/`: 각 화면군 대표 JPG 원본 복사본.', '- `detail-frames/index.json`: 추가 77프레임의 요청초·실제초 기록.', '- `detail-contact-1.jpg`~`detail-contact-4.jpg`: 추가 정밀검토 접촉시트.','']
(out/'inventory.md').write_text('\n'.join(lines))
print(json.dumps({'family_count':len(families),'representative_count':len(list(refs.glob('*.jpg'))),'json':str(out/'inventory.json'),'md':str(out/'inventory.md')},ensure_ascii=False))
