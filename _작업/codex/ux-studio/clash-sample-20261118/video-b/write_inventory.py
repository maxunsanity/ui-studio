# -*- coding: utf-8 -*-
from pathlib import Path
import json, hashlib, shutil, datetime
ROOT=Path('/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/clash-sample-20261118/video-b')
SRC=Path('/Users/max/Desktop/Screen_Recording_20261118_154455_Clash Royale.mp4')
meta=json.loads((ROOT/'metadata.json').read_text())
idx={k:json.loads((ROOT/k/'index.json').read_text()) for k in ['coarse','seconds','detail']}

def ref(folder,requested):
 f=next(f for f in idx[folder]['frames'] if abs(f['requested']-requested)<1e-6)
 return {'path':f"{folder}/{f['file']}",'requestedSeconds':f['requested'],'actualSeconds':f['actual'],'resolutionPx':[f['width'],f['height']],'timestampSource':f'{folder}/index.json: frames[{f["index"]}] / AVAssetImageGenerator actualTime'}

def node(name,kind,rect=None,children=None,**kw):
 d={'name':name,'kind':kind}
 if rect:d['approxRectSourcePx']=rect
 if children:d['children']=children
 d.update(kw);return d

common_hud=node('Group_ResourceHUD','fixedOverlay',[0,102,1080,86],[
 node('Group_ProgressXP','display',[0,102,407,86],[node('Img_XPCards','image'),node('Img_ProgressBar','image'),node('Txt_XP','text',observedText='18')]),
 node('Btn_GoldPlus','buttonCandidate',[427,110,340,74],[node('Img_Gold','image'),node('Txt_Gold','text',observedText='113'),node('Glyph_Plus','text')]),
 node('Btn_GemPlus','buttonCandidate',[785,110,274,74],[node('Img_Gem','image'),node('Txt_Gem','text',observedText='100'),node('Glyph_Plus','text')])], note='소셜에서는 이 HUD가 보이지 않음. shop/collection 스크롤 중에는 같은 화면 위치 유지. 원본 Unity 계층 아님.')
nav=node('Group_BottomNavigation','navigation',[0,2155,1080,185],[
 node('Btn_Shop','tabCandidate'),node('Btn_CardsCollection','tabCandidate',children=[node('Badge_Notifications','display',observedText='6')]),node('Btn_Battle','tabCandidate'),node('Btn_Social','tabCandidate'),node('Btn_SwordWreath','tabCandidate',note='라벨/목적지 미관찰')], note='선택 탭은 넓어지고 라벨·좌우 작은 화살표가 나타남. 각 탭 폭은 상태에 따라 달라짐.')
card=node('Card_Unit','repeatableComponent',children=[node('Img_Frame','image'),node('Img_Artwork','image'),node('Badge_Elixir','display'),node('Txt_Level','text'),node('Group_UpgradeProgress','display',children=[node('Img_Arrow','image'),node('Img_Fill','image'),node('Txt_OwnedRequired','text')]),node('Badge_New','display',note='선택 항목만')], note='이 계층은 픽셀 관찰을 재조립하기 위한 제안. 실제 엔진 부품/HitArea/폰트값 미확인.')
deckbody=node('Group_BattleDeckBody','sharedContent',[0,700,1080,1470],[
 node('Grid_DeckCards','grid',children=[dict(card,repeat=[4,2])]),node('Group_AverageElixir','display',children=[node('Img_Elixir','image'),node('Txt_Average','text',observedText='3.6')]),node('Img_Divider','image'),
 node('Group_Towers','display',children=[node('Img_KingPrincessTowers','image'),node('Group_KingProgress','display',observedText='1 / 8/9'),node('Btn_TowerAppearance','buttonCandidate'),node('Card_TowerTroop','card',observedText='레벨 1 / 1/2')])],note='시트에서는 grid y≈700, 정식 페이지에서는 y≈575. 본문 재사용 가능하나 전체 화면 shell 동일 아님.')

families=[]
def fam(id,name,kind,representative,intervals,hierarchy,texts,observed,inferred,unknown,**extra):
 f={'id':id,'nameKo':name,'category':kind,'representative':representative,'observedTimelineIntervalsRequestedSeconds':intervals,'hierarchyProposal':hierarchy,'observedTexts':texts,'observedBehavior':observed,'inferredInputs':inferred,'unobserved':unknown,**extra}
 families.append(f);return f
fam('B-F01','전투 홈 / 아레나 로비','fullFrame',ref('coarse',0),[[0,2],[5.5,6.3],[8.2,9.2],[15.2,15.5]],[
 common_hud,node('Group_Profile','display',[0,185,620,390],[node('Img_ThreeCrowns','image'),node('Txt_PlayerName','text',observedText='나나나와'),node('Txt_Clan','text',observedText='클랜 없음'),node('Group_Trophies','display',observedText='0')]),
 node('Group_UtilityButtons','buttonRow',[638,235,405,122],[node('Btn_People','buttonCandidate'),node('Btn_News','buttonCandidate'),node('Btn_Menu','buttonCandidate')]),
 node('Btn_RoyalPass','buttonCandidate',[650,375,410,196],[node('Txt_RoyalPass','text',observedText='로얄 패스'),node('Img_Lock','image')]),node('Btn_MiniPass','buttonCandidate',[890,636,177,220],observedText='3일 1시간'),
 node('Group_ArenaDiorama','display',[260,975,560,530],[node('Img_Arena','image'),node('Group_TrophyProgress','display')]),node('Btn_EventsChests','buttonCandidate',[315,1585,460,210],observedText='이벤트 / 1'),
 node('Group_BattleActions','buttonRow',[122,1812,868,242],[node('Btn_DeckQuickview','buttonCandidate'),node('Btn_Battle','buttonCandidate',observedText='전투'),node('Btn_ModeTrophy','buttonCandidate')]),nav],
 ['18','113','100','나나나와','클랜 없음','0','로얄 패스','3일 1시간','이벤트','전투'],
 ['영상 시작에 이미 홈이 표시됨','덱시트와 게임모드시트가 열린 뒤 다시 이 화면으로 복귀함','소셜 후 홈을 거쳐 카드 페이지로 가로 이동함'],
 ['하단 전투 버튼 왼쪽 카드 버튼이 덱시트 입구로 보임','전투 버튼 오른쪽 트로피 영역이 게임모드 입구로 보임','소셜 진입은 하단 사람 방패 탭이 유력하나 터치 좌표/탭과 스와이프 차이는 미관찰'],
 ['전투 실행/매칭/전투 화면','상단 유틸리티·패스·이벤트 목적지','현금/보석 추가 버튼 동작'])
fam('B-F02','전투 덱 바텀시트','fullFrameContainerVariant',ref('detail',3.1),[[2.7,5]], [
 node('Img_BackdropDim','overlay',[0,0,1080,2340]),node('Panel_DeckBottomSheet','bottomSheet',[0,340,1080,2000],[node('Btn_CollapseChevron','buttonCandidate',[430,365,218,87]),node('Header_Deck','display',[0,475,1080,150],observedText='전투 덱'),deckbody])],
 ['전투 덱','레벨 2','레벨 1','레벨 3','0/4','6/2','1/2','2/2','NEW','3.6','8/9'],
 ['2.3~2.7초에 아래에서 올라옴','배후 홈은 어두워진 채 유지되고 하단 탭은 시트에 덮임','5.3초에는 시트가 사라지고 배후딤이 잠시 남음,5.5초 홈 표시'],
 ['닫기는 상단 아래방향 chevron이 유력, 실제 touchup 좌표·배경터치 여부는 미관찰'],
 ['카드 상세/교체/업그레이드','타워 꾸미기 버튼 목적지','시트 내부 수동 스크롤'],sharedContentWith='B-F05',notDuplicateReason='같은 덱 본문이지만 이 화면은 배후딤+닫기 손잡이·본문 overlay이며 B-F05는 탭·하단nav가 있는 정식 페이지')
fam('B-F03','게임 모드 선택 바텀시트','fullFrame',ref('detail',7),[[6.7,7.5]],[
 node('Img_BackdropDim','overlay',[0,0,1080,2340]),node('Panel_ModeBottomSheet','bottomSheet',[0,320,1080,2020],[node('Btn_CollapseChevron','buttonCandidate',[430,348,218,88]),node('Header_Mode','display',[0,460,1080,152],observedText='게임 모드'),node('List_ModeCards','list',[22,681,1034,1640],[node('Btn_TrophyRoad','splitCard',observedText='트로피 진척도 / 0'),node('Btn_MergeTactics','splitCard',observedText='합체 전술 / 0 / 남은 시간: 12일 2시간'),node('Txt_CompetitiveHeading','text',observedText='경쟁 모드'),node('Btn_CompetitiveLocked','splitCard',observedText='경쟁전 / 13000 트로피에서 잠금 해제'),node('Txt_ClassicHeading','text',observedText='클래식 모드'),node('Btn_Classic1v1','splitCard',observedText='클래식 1v1')])])],
 ['게임 모드','트로피 진척도','합체 전술','남은 시간: 12일 2시간','경쟁 모드','경쟁전','13000 트로피에서 잠금 해제','클래식 모드','클래식 1v1'],
 ['6.5초 진입 이동 중,6.7~7.5초 목록 관찰','7.7초 아래로 내려가고8초 딤만 남은 뒤8.2초 홈 복귀'],
 ['홈 오른쪽 트로피 버튼이 입구,상단 chevron이 닫기 후보'],['모드 선택 결과','잠김 버튼의 실제 입력반응','세로 스크롤/아래 추가 모드'],sharedShellWith='B-F02',notDuplicateReason='바텀시트 shell은 유사하지만 4×2 카드+타워 대신 가로 분할 모드카드 세로목록이라는 다른 본문 판틀')
fam('B-F04','소셜 / 클랜 없음','fullFrame',ref('seconds',12),[[9.5,9.5],[11.7,15]],[
 node('Img_BlurredArenaBackdrop','image',[0,0,1080,2155]),node('Panel_ClanPrompt','panel',[58,285,978,334],[node('Img_ClanSymbol','image'),node('Txt_ClanPrompt','text',observedText='클랜을 생성하거나 가입하세요!'),node('Txt_ClanHint','text',observedText='클랜을 검색하거나 생성하세요!'),node('Btn_ViewClan','buttonCandidate',observedText='보기')]),node('Panel_Social','panel',[58,666,978,1435],[node('Header_Social','display',observedText='소셜'),node('Btn_Sort','buttonCandidate'),node('Btn_Filter','buttonCandidate'),node('Viewport_SocialList','list',[70,785,955,1140],[node('Txt_Online','text',observedText='온라인'),node('Txt_Ranking','text',observedText='순위표'),node('Row_Self','row',[100,983,888,150],children=[node('Img_Avatar','image'),node('Img_OnlineDot','image'),node('Txt_PlayerName','text',observedText='나나나와'),node('Txt_Trophies','text',observedText='0')])]),node('Group_SocialActions','buttonRow',[80,1960,930,112],[node('Btn_QuickPlay','buttonCandidate',observedText='퀵플레이'),node('Btn_AddFriend','buttonCandidate',observedText='친구 추가!'),node('Btn_Camera','buttonCandidate')])]),nav],
 ['클랜을 생성하거나 가입하세요!','클랜을 검색하거나 생성하세요!','보기','소셜','온라인','순위표','나나나와','0','퀵플레이','친구 추가!'],
 ['9.5초 소셜 바탕으로 변경,곧 튜토리얼 캐릭터/딤 표시','11.7~12초 튜토리얼 제거 후 본문 표시','14.2초 안내문이 목록 위에 나타나고15초 가로전환 때도 잠시 유지됨'],
 ['하단 소셜탭 또는 가로스와이프로 진입','오른쪽 검/월계관 탭 입력 뒤 공사중 안내가 나왔을 가능성 있으나 실제 입력 위치 미관찰'],['보기/퀵플레이/친구추가/카메라/정렬/필터 결과','친구목록 실제 스크롤','클랜 가입/생성/초대'])
fam('B-F05','카드 화면 / 덱 탭','fullFrameContainerVariant',ref('seconds',17),[[16.2,19.6]],[common_hud,node('Tabs_DeckCollection','tabs',[100,235,880,118],[node('Tab_Deck','tab',observedText='덱'),node('Tab_Collection','tab',observedText='컬렉션 / 6')]),node('Header_Deck','display',[0,350,1080,175],observedText='전투 덱'),deckbody,nav],
 ['덱','컬렉션','6','전투 덱','3.6','레벨 2','레벨 1','레벨 3','0/4','6/2','1/2','2/2','NEW','8/9'],
 ['16초 홈과 카드 페이지의 가로 이동 중,16.2초 덱 페이지 표시','19.6초까지 덱 탭 유지','19.8초 컬렉션 탭으로 변경'],
 ['하단 카드/컬렉션탭 또는 좌우 스와이프 진입','상단 컬렉션 라벨이 다음 목록 입구'],['카드 선택 결과','편집 버튼 결과','상단 덱탭으로 역복귀','덱 본문 실제 스크롤'],sharedContentWith='B-F02')
fam('B-F06','컬렉션 / 카드 목록','fullFrame',ref('coarse',20),[[19.8,22.8]],[
 common_hud,node('Viewport_CollectionScroll','verticalScroll',[0,0,1080,2155],children=[node('Tabs_DeckCollection','tabs',[100,235,880,118],observedText='덱 / 컬렉션'),node('Group_CollectionCategories','iconTabRow',[0,350,1080,200],children=[node('Tab_Cards','tabCandidate',observedText='2'),node('Tab_Tokens','tabCandidate'),node('Tab_Emotes','tabCandidate',observedText='4'),node('Tab_Towers','tabCandidate'),node('Tab_Badge','tabCandidate')]),node('Group_CollectionControls','row',[26,632,1028,132],children=[node('Txt_CollectionTitle','text',observedText='카드 컬렉션'),node('Txt_Found','text',observedText='찾음: 8/123'),node('Btn_Filter','buttonCandidate'),node('Btn_Ascending','buttonCandidate'),node('Btn_SortCriterion','buttonCandidate',observedText='레벨 기준')]),node('Txt_Discovered','text',observedText='발견함'),node('Grid_Discovered','grid',children=[dict(card,repeat=[4,2])]),node('Txt_Undiscovered','text',observedText='미발견'),node('Grid_Undiscovered','grid',children=[node('Card_LockedUnit','repeatableComponent',children=[node('Img_GrayscaleArtwork','image'),node('Txt_ArenaUnlock','text')])])]),nav],
 ['덱','컬렉션','카드 컬렉션','찾음: 8/123','레벨 기준','발견함','미발견'],
 ['20초 8개 발견 카드와 미발견 시작 표시','20.8~22.8초 상단 덱/컬렉션·아이콘분류·정렬행도 위로 사라지고 4열 미발견 목록이 계속 이동,HUD와 하단 nav 위치는 유지','후반 행은 아레나/잠금 문구가 다르지만 같은 4열 그리드 반복'],
 ['목록의 상향 이동은 위로 스와이프한 세로 스크롤로 추정,손가락 경로/scrollTop 값은 없음'],['필터/정렬/다른 카테고리 본문','미발견 카드 상세','전체 카드 목록 수동 전수 확인','원본 scroll metric/Unity mask/anchor'],repeatStatesNotNewFrames=['발견 8개','미발견 초반','미발견 중반','미발견 후반 아레나13/14 행'])
fam('B-F07','상점 / 긴 세로 섹션','fullFrame',ref('detail',23.8),[[23,32.6]],[
 common_hud,node('Viewport_Shop','verticalScroll',[0,0,1080,2155],children=[node('Section_SpecialOffers','section',children=[node('Header_SpecialOffers','ribbon',observedText='특별 상품'),node('Offer_StarterPack','wideOffer',observedText='클래시 로얄 초보자 팩 / 2일 23시간 / 10000 / 500 / x20 / ₩1,500'),node('Offer_UpgradeSpecial','wideOffer',observedText='업그레이드 스페셜 / 19일 2시간 / 250000 / 20/20 이용 가능 / ₩7,500'),node('Offer_MiniPass','wideOffer',observedText='미니 패스 / 3일 1시간 / ₩4,400'),node('Offer_EmoteMarket','wideOffer',note='제목/상부만 보여 본문 완전판 미확인')]),node('Section_Market','section',children=[node('Header_Market','woodSign',observedText='마켓'),node('Group_DailyOffers','threeColumnGrid',observedText='일일 상품 / 8시간 15분'),node('Product_FreeChest','productCard',observedText='골드 상자 / 아레나1 / 무료!'),node('Product_Knight','productCard',observedText='기사 / 일반 / x2 / 0/4 / 20'),node('Product_Musketeer','productCard',observedText='머스킷병 / 희귀 / x1 / 1/2 / 50')]),node('Section_Cosmetics','section',children=[node('Header_Cosmetics','scrollSign',observedText='꾸미기 아이템'),node('Group_EmoteProducts','threeColumnGrid',observedText='이모티콘 / 특별한 이모티콘으로 자신을 표현하세요! / 각250보석')]),node('Section_Resources','section',children=[node('Header_Resources','ribbon',observedText='자원'),node('Grid_Gems','threeColumnGrid',observedText='보석'),node('Grid_Gold','threeColumnGrid',observedText='골드'),node('Panel_CreatorBoost','panel',observedText='크리에이터 부스트 / 크리에이터 코드를 입력해 슈퍼셀 크리에이터를 후원하세요!')])]),nav],
 ['특별 상품','클래시 로얄 초보자 팩','업그레이드 스페셜','미니 패스','이모티콘 마켓','마켓','일일 상품','새 카드 등장까지 남은 시간: 8시간 15분','골드 상자','아레나1','무료!','기사','일반','머스킷병','희귀','꾸미기 아이템','이모티콘','특별한 이모티콘으로 자신을 표현하세요!','자원','보석','골드','크리에이터 부스트'],
 ['23초 상점 진입 직후 StarterPack 카드가 흰 flash/로딩 연출로 보이고23.4초 정상 그림','23.8~24초 특별상품 정상 표시','25초 일일상품,26~27초 자원과 하단 크리에이터 구간,28초 위쪽 이모티콘,29초 일일상품,30초 미니패스,31~32.6초 초보자 팩으로 역스크롤','스크롤 중 HUD/하단 nav는 고정이며 본문·섹션 배경이 함께 이동'],
 ['하단 상점탭 또는 좌우 스와이프로 전환','본문 이동 방향으로 세로 스크롤 추정'],['상품/무료상자/정보 버튼 클릭','결제/보상/차감','미니패스 상세/이모티콘마켓 전체/크리에이터 입력·확인','정확한 scrollTop/총본문높이/scrollbar 계약'],repeatStatesNotNewFrames=['상품로딩 flash','일일상품','꾸미기/이모티콘','보석 3열×2행','골드3열','크리에이터부스트','특별상품으로 역스크롤'],componentVariants=['3열 상품카드:무료/골드가격/보석가격/현금가격','넓은 오퍼카드:3보상/1보상/삽화+6보상','제목:금판/파란리본/나무판/두루마리/금리본'])

overlays=[{'id':'B-O01','nameKo':'왕 캐릭터 튜토리얼','category':'overlayFamily','baseFamily':'B-F04','representative':ref('coarse',10),'hierarchyProposal':[node('Img_FullScreenDim','overlay',[0,0,1080,2340]),node('Img_KingCharacter','image',[0,1550,932,790]),node('Group_SpeechBubble','panel',[470,1372,488,414],[node('Img_Bubble','image'),node('Txt_Tutorial','text')])],'states':[{'id':'B-O01-S01','representative':ref('coarse',10),'observedText':'이제 친구와 클랜을 소셜 탭에서 확인할 수 있습니다!'}, {'id':'B-O01-S02','representative':ref('detail',11.2),'observedText':'퀵플레이는 새롭게 승리를 거둘 수 있는 방법입니다! 친구들과 한번 플레이해 보세요!'}],'observedBehavior':['9.7초 왕이 하단에서 진입','10초 첫 문구','11.2초 둘째 문구','11.7초 아래로 퇴장,12초 본문만 남음'],'inferredInputs':['화면 탭으로 다음 문구/닫기 진행 가능성, 실제 탭/자동 타이머 구분 미확인'],'unobserved':['닫기 버튼/선택형 입력','다음/이전/재열기','입력차단 범위/접근성/타이머'],'notNewFullFrameReason':'소셜 바탕 위 동일한 왕+말풍선 구조이며 문구 변화는 상태2개'}]

toast={'id':'B-O02','nameKo':'공사중 안내 토스트','category':'transientOverlay','representative':ref('detail',14.2),'observedText':'이 아레나는 현재 공사 중입니다! 이벤트 모드는 전투 화면으로 이동하였습니다.','observedTimelineIntervalsRequestedSeconds':[[14.2,16.2]],'note':'14.2초 소셜 목록 위에 표시되고 홈/덱 가로전환에도 잠시 남음. 화면/별도 고유판틀로 세지 않음. 발생 버튼/자동이벤트는 미확인.'}

# Every transition records observable destination separately from a guessed input.
transition_specs=[
 ('B-T01',[2,2.7],'B-F01','B-F02','홈에서 덱 시트가 아래에서 올라옴','Btn_DeckQuickview',ref('detail',2.3),ref('detail',2.7)),
 ('B-T02',[5,5.5],'B-F02','B-F01','덱시트가 내려가고 홈 복귀','Btn_CollapseChevron',ref('coarse',5),ref('detail',5.5)),
 ('B-T03',[6.3,6.7],'B-F01','B-F03','게임모드 시트 진입','Btn_ModeTrophy',ref('detail',6.5),ref('detail',6.7)),
 ('B-T04',[7.5,8.2],'B-F03','B-F01','게임모드 시트 퇴장,홈 복귀','Btn_CollapseChevron',ref('detail',7.7),ref('detail',8.2)),
 ('B-T05',[9.2,9.7],'B-F01','B-F04','소셜 바탕으로 변경 후 왕 오버레이 진입','Btn_Social 또는 가로스와이프',ref('detail',9.5),ref('detail',9.7)),
 ('B-T06',[10,11.2],'B-O01-S01','B-O01-S02','같은 말풍선의 문구 변경','화면탭 또는 자동 타이머',ref('coarse',10),ref('detail',11.2)),
 ('B-T07',[11.5,12],'B-O01','B-F04','왕과 딤 퇴장,소셜만 표시','화면탭 또는 자동 타이머',ref('detail',11.7),ref('seconds',12)),
 ('B-T08',[14,14.2],'B-F04','B-F04+B-O02','공사중 안내문 표시','오른쪽 검/월계관탭 가능성',ref('detail',14),ref('detail',14.2)),
 ('B-T09',[14.8,15.2],'B-F04','B-F01','소셜이 오른쪽으로 밀리고 홈 복귀','Btn_Battle 또는 가로스와이프',ref('detail',15),ref('detail',15.2)),
 ('B-T10',[15.5,16.2],'B-F01','B-F05','홈이 오른쪽으로 밀리고 덱 페이지 진입','Btn_CardsCollection 또는 가로스와이프',ref('detail',16),ref('detail',16.2)),
 ('B-T11',[19.6,19.8],'B-F05','B-F06','상단 선택이 덱에서 컬렉션으로 변경','Tab_Collection',ref('detail',19.6),ref('detail',19.8)),
 ('B-T12',[20.4,22.8],'B-F06','B-F06','카드 목록이 위로 이동,미발견 후반 행 표시','위로 스와이프 추정',ref('detail',20.8),ref('detail',22.8)),
 ('B-T13',[22.8,23.4],'B-F06','B-F07','상점으로 변경,오퍼 흰flash 뒤 실제그림','Btn_Shop 또는 가로스와이프',ref('detail',23),ref('detail',23.4)),
 ('B-T14',[24,27],'B-F07','B-F07','특별상품→일일상품→자원/크리에이터 구간으로 스크롤','위로 스와이프 추정',ref('detail',24),ref('seconds',27)),
 ('B-T15',[27,29],'B-F07','B-F07','자원→이모티콘→일일상품으로 역스크롤','아래로 스와이프 추정',ref('seconds',28),ref('seconds',29)),
 ('B-T16',[29,32.6],'B-F07','B-F07','일일상품→미니패스→초보자 팩 상단으로 역스크롤','아래로 스와이프 추정',ref('coarse',30),ref('detail',32.6)),
]
transitions=[{'id':i,'requestedTimeBracketSeconds':t,'from':s,'to':d,'observed':o,'inputCandidate':a,'inputEvidence':'추정: 영상 프레임 전후 변화만 관찰. 명시적 터치 좌표/포인터 클릭 로그 없음.','beforeOrDuring':b,'after':e,'runtimeEdgeCreated':False} for i,t,s,d,o,a,b,e in transition_specs]

shop_products={
 'gems': [{'name':'보석 한 줌','quantity':80,'observedPrice':'₩1,500'},{'name':'보석 주머니','quantity':500,'observedPrice':'₩7,500'},{'name':'보석 바구니','quantity':1200,'observedPrice':'₩15,000'},{'name':'보석 통','quantity':2500,'observedPrice':'₩30,000'},{'name':'보석 수레','quantity':6500,'observedPrice':'₩75,000'},{'name':'보석 더미','quantity':14000,'observedPrice':'₩149,000'}],
 'gold':[{'name':'골드 주머니','quantity':1000,'observedGemPrice':60},{'name':'골드 바구니','quantity':10000,'observedGemPrice':500},{'name':'골드 수레','quantity':100000,'observedGemPrice':4500}],
 'daily':[{'name':'골드 상자','subtext':'아레나1','observedPrice':'무료!'},{'name':'기사','rarity':'일반','quantity':2,'ownedRequired':'0/4','observedGoldPrice':20},{'name':'머스킷병','rarity':'희귀','quantity':1,'ownedRequired':'1/2','observedGoldPrice':50}],
 'emotes':{'visibleCount':3,'observedGemPriceEach':250,'assetMeaning':'통나무/마녀/다크프린스 형태로 보이나 이름 문구는 미관찰'},
 'special':[{'title':'클래시 로얄 초보자 팩','quantities':['10000','500','x20'],'observedPrice':'₩1,500','observedRemaining':'2일 23시간'},{'title':'업그레이드 스페셜','quantities':['250000'],'observedPrice':'₩7,500','observedRemaining':'19일 2시간','availability':'20/20 이용 가능'},{'title':'미니 패스','quantities':['75 000','5','30','300','1800','300'],'observedPrice':'₩4,400','observedRemaining':'3일 1시간'}],
 'note':'모두 영상에 보이는 당시 표시값. 현재 상품/정책/게임 발란스 확정값 또는 구현용 데이터로 승인한 값 아님. 미관찰 필드는 만들지 않음.'}

representatives={
 'B-F01-home.jpg':ref('coarse',0),'B-F02-deck-sheet.jpg':ref('detail',3.1),'B-F03-game-mode-sheet.jpg':ref('detail',7),'B-F04-social.jpg':ref('seconds',12),'B-F05-deck-page.jpg':ref('seconds',17),'B-F06-collection.jpg':ref('coarse',20),'B-F07-shop-special.jpg':ref('detail',23.8),'B-O01-tutorial-1.jpg':ref('coarse',10),'B-O01-tutorial-2.jpg':ref('detail',11.2),'B-O02-construction-toast.jpg':ref('detail',14.2),'B-F07-shop-daily.jpg':ref('seconds',29),'B-F07-shop-emotes.jpg':ref('seconds',28),'B-F07-shop-gems.jpg':ref('seconds',27),'B-F07-shop-gold.jpg':ref('seconds',26),'B-F07-shop-mini-pass.jpg':ref('coarse',30)}
(ROOT/'representatives').mkdir(exist_ok=True)
for name,r in representatives.items():
 shutil.copyfile(ROOT/r['path'],ROOT/'representatives'/name)
 r['copiedTo']='representatives/'+name

full_reviewed=[ref('coarse',i) for i in [0,5,10,15,20,25,30]]+[ref('detail',i) for i in [3.1,7,11.2,23.8]]+[ref('seconds',i) for i in [12,17,23,26,27,28,29,31]]
data={
 'schemaVersion':'reference-video-inventory-v1','status':'제안(검수 대기)','analysisId':'clash-video-b-20261118','author':'codex(단이) 하위 분석 B','createdAtKST':datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).isoformat(timespec='seconds'),
 'source':{'path':str(SRC),'basename':SRC.name,'bytes':SRC.stat().st_size,'sha256':hashlib.sha256(SRC.read_bytes()).hexdigest(),**meta,'recordedWallClock':'미확인. 파일명의 20261118_154455는 파일명 출처일 뿐 영상 내부 시계 검증 아님.','readOnly':True},
 'gameIdentification':{'userRequestedName':'클래시오브 클랜','observedGameName':'클래시 로얄','confidence':'high','evidence':[{'type':'visibleText','text':'클래시 로얄 초보자 팩','frame':ref('detail',23.8)},{'type':'visibleLayout','description':'왕관/카드 XP,골드·보석 HUD,전투/카드/소셜 하단탭,4×2 카드덱+왕/프린세스타워,로얄패스','frame':ref('coarse',0)}],'namingDecision':'파일명과 실화면은 클래시 로얄. 다른 게임으로 표기하지 말고 본체에 불일치 보고함.'},
 'scope':{'assignedOnly':'video-b','entireGameInventory':False,'observedVideoOnly':True,'productionAssetUse':'모든 추출 JPG와 대표 복사본은 원본 관찰/비교 전용. production 자원/완성 UI가 아님.','nativeEditorActions':0,'designJsonMutations':0,'productSourceMutations':0,'serversStarted':0,'browserInspections':0,'packagesInstalled':0,'commonStatusOrReportMutations':0},
 'method':{'decoder':'기존 extract_video (AVFoundation AVAssetImageGenerator), preferredTrackTransform=true, requestedTimeToleranceBefore/After=zero','metadata':'기존 video_metadata.swift AVFoundation','sampling':[{'directory':k,'index':k+'/index.json','count':len(v['frames']),'intervalSeconds':v['step'],'note':'detail은 selectedTimes 직접지정,step=1이 실제 고정간격이라는 뜻 아님' if k=='detail' else ''} for k,v in idx.items()],'contactSheets':['seconds-contact.jpg','detail-contact-1.jpg','detail-contact-2.jpg'],'contactSheetReview':'1초33개와정밀62개를타임스탬프연락판으로직접시각확인.대표/텍스트19개프레임은원본1080×2340단독view_image확인.','fullResolutionViewed':full_reviewed,'timeReference':'영상 시작 상대초. requestedSeconds는 요청값,actualSeconds는 AVFoundation 디코더 반환시각. 모든 전환 경계는 샘플링 구간이며 정확한 첫 프레임 확정 아님.','geometryReference':'1080×2340 원본 픽셀을 눈으로 근사한 영역. 논리390×844/Unity rectTransform/실제폰트 크기 등 구조화 제작값 아님.','inputReference':'터치 로그/접촉점이 보이지 않아 source→destination은 관찰,입력버튼·탭vs스와이프·닫기방법은 추정으로 분리.'},
 'classification':{'fullFrameObservations':7,'tutorialOverlayFamilies':1,'transientToastFamilies':1,'dedupAcrossOtherVideos':'본체가 영상A와통합예정.이분석은타영상독립열람없음.','sharedContent':[{'component':'4×2 덱+평균엘릭서+타워','families':['B-F02','B-F05'],'note':'같은본문재사용.시트/페이지shell은다름.'}],'sharedShell':[{'component':'배후딤+상단collapse+파란제목의bottomSheet','families':['B-F02','B-F03'],'note':'본문그리드vs분할카드목록은다름.'}],'excludedFromNewFullFrames':['튜토리얼2문구는같은왕+말풍선overlay상태','공사중토스트','시트열기/닫기중간위치','소셜→홈→덱의가로이동중2화면분할','카드발견/미발견과아레나별반복행','상점섹션별스크롤위치·상품종류·가격','상품흰flash/반짝임/로드연출']},
 'families':families,'overlayFamilies':overlays,'transientOverlays':[toast],'transitions':transitions,'visibleShopValues':shop_products,'representativeCopies':representatives,
 'unverified':['영상 외 전체 게임 UI/전체 경로','게임 빌드/버전/날짜 내부검증','터치위치/클릭 좌표·실제 입력로그','Unity native 계층/실제 anchors/font/material/9slice','실게임 규칙·결제·보상·저장·카드변경','툴 제작/등록/실제 브라우저검수','모든 탭/카테고리/상품/Info 목적지','외부자료/인터넷조회 없음. 식별은 제공영상 내부근거로만 판단'],
 'readSources':[str(SRC),'/Users/max/projest_max/ui-studio/AGENTS.md','/Users/max/projest_max/ui-studio/src/tools/uxStudio/guide/START_PROJECT_GUIDE.md','/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/video-analysis/mgv04_05_09/extract_video.swift','/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/video-analysis/mgv04_05_09/video_metadata.swift'],
 'toolNotes':['기존 extract_video를 인수 없이 호출한 1회는 인덱스 범위 오류(exit133). 이후 원본소스를읽고정식인수로호출해추출102entry모두성공.','metadata Swift는기존동기AVFoundation API의macOS13 deprecated경고가있지만exit0/메타JSON정상.새패키지설치없음.']
}
(ROOT/'inventory.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
md=['# 영상 B 원본 조사 — 클래시 로얄','',f"작성: codex(단이) · {data['createdAtKST']} · 제안(검수 대기)",'', '사용자 요청명은 ‘클래시오브 클랜’이나, 제공 영상의 실제 UI와 ‘클래시 로얄 초보자 팩’ 문구는 **클래시 로얄**입니다. 이 문서는 제공된 32.7119초 영상의 관찰 목록입니다. 전체 게임 UI 전수조사나 툴 제작 완료를 뜻하지 않습니다.','',f"- 원본: `{SRC}`",f"- 원본: {meta['width']}×{meta['height']}px · 약{meta['fps']:.6f}fps · {meta['duration']}초 · {data['source']['bytes']}bytes",f"- SHA256: `{data['source']['sha256']}`",'- 추출: coarse 5초 간격 7개 → 1초 간격 33개 → 전환 주변 지정시각 62개(중복 시각 포함 추출 entry 102개).','- 타임스탬프: 영상 시작 상대초이며 각 index.json에 요청/실제 디코더 시각을 모두 보존했습니다. 경계는 샘플링 구간입니다.','- 화면 전후 변화는 관찰, 버튼/탭/스와이프/닫기 입력은 터치 로그가 없어 추정입니다.','- 좌표는 원본 1080×2340 픽셀 근사치이며 논리 크기·실제 엔진 저장값이 아닙니다.','- 모든 JPG는 원본 비교용입니다. production 그림/자원 또는 편집 가능한 UI 제작을 대신하지 않습니다.','', '## 판틀 선별','', '| ID | 전체 판틀 / 컨테이너 | 대표 요청초 → 실제초 | 구분 |','|---|---|---|---|']
for f in families:
 r=f['representative']; md.append(f"| {f['id']} | {f['nameKo']} | {r['requestedSeconds']} → {r['actualSeconds']:.6f} | {f['category']} |")
md += ['', '총 7개 전체 판틀 관찰과 왕 튜토리얼 오버레이 1계열·공사중 토스트 1개입니다. 다른 영상과의 중복 통합은 본체가 수행합니다. 덱시트와 정식 덱 페이지는 같은 4×2카드+타워 본문을 공유하지만 배후딤·닫기손잡이 대 탭·하단 내비게이션의 전체 컨테이너는 다릅니다. 게임모드와 덱시트는 바텀시트 shell을 공유하지만 본문 판틀은 다릅니다.','', '튜토리얼 문구 2개,발견/미발견 카드의 반복행,상점의 섹션 스크롤·동일 상품틀,로딩/반짝임,가로이동 중간 화면은 새로운 전체 판틀로 세지 않습니다.','', '## 전체판틀별 원본·계층·동작','']
for f in families:
 r=f['representative'];md += [f"### {f['id']} · {f['nameKo']}",'',f"![{f['nameKo']}]({r['path']})",'',f"- 원본 프레임: `{r['path']}`, 요청 {r['requestedSeconds']}초 / 실제 {r['actualSeconds']:.6f}초.",'- 계층(관찰 기반 재조립 제안):']
 def walk(ns,depth=0):
  for n in ns:
   rect=' / source px≈'+str(n['approxRectSourcePx']) if 'approxRectSourcePx' in n else ''
   text=' / '+n['observedText'] if 'observedText' in n else ''
   md.append('  '*depth+'  - '+n['name']+' ['+n['kind']+']'+rect+text)
   walk(n.get('children',[]),depth+1)
 walk(f['hierarchyProposal'])
 md += ['','- 실제 관찰: '+' / '.join(f['observedBehavior']),'- 입력 추정: '+' / '.join(f['inferredInputs']),'- 미확인: '+' / '.join(f['unobserved']),'- 보이는 문구: '+' · '.join(f['observedTexts']),'']
md += ['## 튜토리얼·토스트','', '왕 튜토리얼은 소셜 배후딤·하단 왕 캐릭터·오른쪽 흰 말풍선·native 텍스트로 분리하는 제안입니다. 문구 변경은 같은 오버레이의 상태입니다.','', '- 10초: “이제 친구와 클랜을 소셜 탭에서 확인할 수 있습니다!”','- 11.2초: “퀵플레이는 새롭게 승리를 거둘 수 있는 방법입니다! 친구들과 한번 플레이해 보세요!”','- 11.7초 퇴장 중,12초 소셜 본문만 표시. 화면탭/자동 타이머/입력차단은 미확인.','', '공사중 토스트(14.2초): “이 아레나는 현재 공사 중입니다! 이벤트 모드는 전투 화면으로 이동하였습니다.” 소셜→홈→덱 전환 동안 잠시 이어 보입니다. 발생 입력은 미확인입니다.','', '## 전환 관찰 목록','', '| ID | 요청초 구간 | 실제 관찰 | 입력 후보(추정) |','|---|---|---|---|']
for t in transitions:md.append(f"| {t['id']} | {t['requestedTimeBracketSeconds']} | {t['from']} → {t['to']}: {t['observed']} | {t['inputCandidate']} |")
md += ['', '게임 실행 연결을 만들지 않았습니다. 위 16건은 영상 전환/문구/스크롤 관찰이며 실제 runtime edge 16개가 아닙니다.','', '## 스크롤·탭·목록과 값의 경계','', '- 하단5탭: 상점,카드/컬렉션,전투,소셜,검·월계관(라벨/목적지 미관찰). 선택 시 탭 폭·라벨·작은 화살표 표시 변화.','- 카드 상단2탭: 덱/컬렉션. 컬렉션에5종 icon bar,필터·상하방향·‘레벨 기준’이 보이지만 각각 입력 결과는 미관찰. 컬렉션 스크롤 때 상단2탭·분류·정렬행도 함께 위로 사라지고 HUD/하단nav만 고정.','- 덱 본문4열×2행+평균엘릭서3.6+타워; 컬렉션은발견8/123과미발견4열 반복.','- 소셜: 클랜 안내+온라인/순위표·자기행1개; 실제 스크롤은 미관찰.','- 상점: 고정 HUD/하단내비게이션 사이 긴 세로 본문이 이동. 특별상품→일일상품→꾸미기→자원→하단 크리에이터 구간이 보이고 역스크롤로 특별상품 복귀.','- 상점 보석 80/500/1200/2500/6500/14000 및 ₩1,500/7,500/15,000/30,000/75,000/149,000,골드1000/10000/100000의보석가격60/500/4500,이모티콘3개각250보석은영상표시값입니다.현재상점이나발란스정본으로쓰지않습니다.','- 미니패스·초보자팩·업그레이드·일일상품 수량/가격은 inventory.json.visibleShopValues에 원본 표시 그대로 보존했습니다. 미관찰 값은 만들지 않았습니다.','', '## 검증·보존·미확인','', '- 실제 view_image: coarse7개+정밀4개+seconds8개=단독19프레임. 1초33개와정밀62개는연락판에서도직접확인.','- 메타정보/각추출index.json/대표JPG15개/연락판3개/구조화inventory.json을video-b배정폴더에보존.','- 원본영상수정0,제품소스수정0,설계JSON조작0,native툴제작0,브라우저검수0,서버시작0,패키지설치0,공용STATUS·보고수정0.','- 기존extract_video인수없음호출1회exit133은진단이력입니다.정식인수추출102entry는모두성공했습니다.메타Swiftdeprecated경고는출력했으나exit0입니다.','- 전체게임UI,실제Unity계층/앵커/폰트/9slice,게임규칙·결제·보상,정확한클릭·스크롤수치,모든미관찰목적지,툴제작·실화면동등은미확인.','- 원본/다른담당/타영상/공용지시함/보호파일은작업범위에넣지않았습니다.','', '읽은 원본과 도구 경로는 inventory.json.readSources에 보존했습니다.','']
(ROOT/'inventory.md').write_text('\n'.join(md))
print(json.dumps({'families':len(families),'overlayFamilies':len(overlays),'transitions':len(transitions),'representatives':len(representatives),'frames':sum(len(v['frames']) for v in idx.values()),'out':str(ROOT)},ensure_ascii=False))
