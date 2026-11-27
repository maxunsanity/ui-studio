# coding: utf-8
from pathlib import Path
import json,shutil,datetime
s=Path('/Users/max/projest_max/ui-studio/samples/kingshot');r=s/'reference/video-analysis-20261118';p=s/'docs/ui';items=[
('KS01','Town','진행 후 마을','page',None,'0.png','PNG: 상단 자원·전투력·이벤트·6하단메뉴. 영상과 다른 진행 시점.'),
('KS02','TutorialTown','튜토리얼 마을','page',349,None,'상단4표시·챕터/우편·건설 타이머. 마을 family의 초반 변형, 새 family로 중복 계산하지 않음.'),
('KS03','Dialogue','튜토리얼 대화','modal',3,None,'윌리엄·말/캐릭터 반신·하단 대사·다음 표시·건너뛰기. 대사/인물 변형은 한 family.'),
('KS04','Choice','2개 선택 카드','modal',13,None,'주민 참전 유형: 전사/궁수. 음식/방어탑 선택도 같은 판틀 변형으로 조사만 보존.'),
('KS05','Battle','전투 UI','page',35,None,'새 게임 스틸·적 수·일시정지·조이스틱·스킬. 실제 전투는 구현하지 않음.'),
('KS06','Victory','승리 보상','modal',57,None,'승리 리본·보상2개·도시 복귀. 전투 종료 자동진입은 미연결.'),
('KS07','Construction','건설 조건 패널','page',75,None,'건물 정보·필요 조건·체크·건설 시간. 건물명/수치만 다른 패널은 재사용.'),
('KS08','Interior','건물 가구·주민','page',81,None,'상단 컷어웨이 정지 장면·가구 정보/슬롯·하단2탭. 주민 탭 상태는 frame83.'),
('KS09','Upgrade','도시 센터 속성','page',343,None,'도시 센터 Lv.2·업그레이드·공격25/방어60/HP1200·특권3.'),
('KS10','Staffing','주민 배치','modal',127,None,'전사/궁수 2행·슬라이더 모양·+/-·회수/추천/저장. 실제 배치 정책은 미정.'),
('KS11','ChapterTasks','챕터 임무','modal',203,None,'배너·3목표행·보상·수령/이동. 다른 챕터 문구/완료 상태는 같은 family.'),
('KS12','ChapterRewards','챕터 보상','modal',261,None,'금색 리본·자원3개·아무 곳이나 클릭하여 닫기. 보상 수치 변형은 중복 제외.'),
('KS13','Arrival','주민 도착','modal',305,None,'피난민 숲 배너·도착문구·타이머·2초상·필요 조건·이동.'),
('KS14','Speedup','즉시 완료 확인','modal',351,None,'확인·다이아 사용 안내·하루 보지 않기·남은 시간·즉시완료12. 실제 결제/차감 없음.'),
('KS15','RookieFestival','루키 축제','page',None,'213.png','PNG: 이벤트3탭·축제 배너·진행바·보상목표 목록. 영상에는 해당 이벤트 진입이 없음.')]
rows=[]
for id,name,title,kind,frame,png,obs in items:
 target=r/f'{id}_{name}.png'
 if png:shutil.copy2(Path('/Users/max/Desktop')/png,target)
 else:
  from PIL import Image
  Image.open(r/'frames'/f'frame_{frame:04d}.jpg').save(target)
 rows.append(dict(id=id,name=name,title=title,kind=kind,representativeFrame=frame,representativeSecondsApprox=frame-1 if frame else None,source='provided PNG '+png if png else 'video 1fps sample; slot time approximate',reference='../../reference/video-analysis-20261118/'+target.name,observation=obs,status='분석/제작 전'))
for frame,label in [(83,'Interior_Residents'),(87,'Choice_Food'),(107,'Choice_Defense'),(277,'Building_UpgradeVariant'),(199,'Chapter_IntroAnimation')]:
 from PIL import Image
 Image.open(r/'frames'/f'frame_{frame:04d}.jpg').save(r/f'variant_{label}.png')
inv=dict(title='킹샷 UI 샘플 조사',sourceDurationSeconds=418.26,videoDimensions=[504,894],providedPNGDimensions=[1206,2622],sampling=dict(oneFpsFrames=418,sceneCuts=98,sceneCutThreshold=.15,sampleContactEveryOtherFrame=209),nativeViewTargets=15,uniqueFamilies=14,duplicateVariant='Town/TutorialTown은 진행단계 HUD 차이가 있는 동일 마을 family 두 예시. 2카드 선택/대화/건물명/챕터 문구·보상 상태는 한 family로 묶음.',screens=rows,excluded=['카메라 이동/전투 과정/숫자 변화/구름 로딩','챕터 소개 카드·보상 광채의 순수 전환 연출은 참고로 보존','PNG 상단 검은 영역의 트로피/기어 및 영상의 APK/계정 도구팁은 게임 UI 출처 미확인: 원본 보존, 게임 native UI로 합성하지 않음'],boundary='원본 캡처 분석 전용, 생산은 새 그림. 게임은 새 스틸. 실제 게임·차감·계정·구매·통신 없음. 관찰 전이와 PNG 기반 샘플 연결 제안을 구분.')
(p/'ui-inventory.json').write_text(json.dumps(inv,ensure_ascii=False,indent=2))
fixture=dict(kind='display-only observed snapshots; no gameplay rules',town=dict(source='0.png',clock='12:27',residents='32/32',bread='4.4M',gems='8,737',power='887,087',vip='VIP1',quest='토벌 스테이지 150단계 클리어(0/1)',nav=['토벌','영웅','가방','상점','연맹','야외']),tutorialTown=dict(sourceFrame=349,clock='17:48',residents='4/6',bread='1.2K',gems='530',timer='00:00:53'),dialogue=dict(name='윌리엄',line='모두 조심해! 반군이 우릴 발견했다!'),choice=dict(title='주민 참전 유형 선택',names=['전사','궁수'],selected='전사',description='전사가 되면 방어력이 비교적 높아지고, 더 많은 피해를 막을 수 있습니다.',button='소집'),victory=dict(bread=300,wood=100),construction=dict(title='주방',description='맛있는 음식으로 주민들의 입맛을 만족시킬 수 있습니다.',requirement='도시 센터 레벨 1',wood='1K/35',duration='00:00:02'),interior=dict(building='주방 Lv.1',comfort='50%',furniture='부뚜막',description='음식을 요리하고 요리하는 곳입니다.',production='1',consumption='200/50',attribute='40',duration='8초 -0.2초',upgradeWood='921/10',resident='엘리스',residentCount='1/1'),upgrade=dict(building='도시 센터 Lv.2',attack=25,defense=60,hp='1,200'),staffing=dict(title='주민 배치',subtitle='주민 전투 병사 배치',total='0/4',rows=[dict(name='전사',available=2,displayAllocation=0),dict(name='궁수',available=2,displayAllocation=0)],policy='원본 min/max/증감 정책 미확인. 표시용 부품, 실제 군대 배치 없음.'),chapter=dict(title='챕터 임무',chapter='제1장',name='도시 재건',rows=[dict(title='도시 센터 복구(1/1)',gem=20,wood=100,button='수령'),dict(title='주방 건설(1/1)',gem=20,wood=100,button='수령'),dict(title='벌목장 건설(0/1)',gem=20,wood=100,button='이동')],aggregate=dict(gem=200,bread=200,wood=200)),chapterReward=dict(gem=240,wood=400,bread=200),arrival=dict(title='주민이 도착했습니다.',description='주민 2명이 도시 밖에 나타났습니다. 이 사람들을 받아주시길 바랍니다!',time='00:09:40',names=['에이글','클라우디스'],requirement='민가2 Lv.2까지 업그레이드(1/2)'),speedup=dict(title='확인',message='[다이아] 사용하여 즉시 완료하세요!',checkbox='오늘 하루 보지 않기',remaining='00:00:53',cost=12),festival=dict(source='213.png',title='루키 축제',time='2d 19:56:11',subtitle='초보 한정',message='전투력을 향상시키면 한정 스킨 보상을 획득할 수 있어요!',progress='917,906/4,000,000',rows=[dict(power='1,000,000',value='3.1K 다이아 상당',rewards=[['gem',100,8],['speedup','1시간',2],['stone','10 K',10],['iron','10 K',5]]),dict(power='1,500,000',value='4.4K 다이아 상당',rewards=[['gem-crate','1K',1],['speedup','1시간',3],['bread-crate','100 K',10],['wood-crate','100 K',10]]),dict(power='2,000,000',value='6.7K 다이아 상당',rewards=[['hero',None,1],['gem-crate','1K',1],['speedup','1시간',4],['stone-crate','10 K',2]]),dict(power='2,500,000',value='7.5K 다이아 상당',rewards=[['gem-crate','1K',2],['speedup','1시간',5],['bread-crate','100 K',15],['wood-crate','100 K',15]])],partialFifth=dict(power='3,000,000',value='12.5K 다이아 상당',quantities=None,note='PNG 아래 일부만 보임. 미확인 수량을 창작하지 않음.')))
(p/'sample-data.json').write_text(json.dumps(fixture,ensure_ascii=False,indent=2))
tokens=dict(stage='제작 규격 제안, 원본 Unity 수치 확정 아님',logicalSize=[390,844],rationale='제공 PNG가 iPhone 세로 비율이고 현재 공통 기기 검수390×844를 제작 기준으로 선택. 영상504×894의 원본 좌표와 구분.',nav=dict(slots=6,pitch=65,height=68,icon=36,font=13,anchor='bottom'),hud=dict(profile=48,icon=24,font=14,height=64,anchor='top'),button=dict(standard=[168,48],compact=[92,44],closeHit=44,glyph=24,font=18,pressDelta=2),building=dict(sheet=[390,428],header=40,tabs=48,anchor='bottom'),modal=dict(width=366,sideMargin=12,header=36,titleFont=20,bodyFont=16),reward=dict(card=[56,56],glyph=40,qtyFont=12),event=dict(header=52,tabs=76,hero=172,progress=54,rowHeight=92),input='compound wrapper + image + native text; display-only decorative siblings; observed vs proposed link evidence separate',limits=dict(designBytes=2000000,assetBytes=300000))
(p/'ui-tokens.json').write_text(json.dumps(tokens,ensure_ascii=False,indent=2));print('15 views / 14 families; fixtures and tokens ready')
