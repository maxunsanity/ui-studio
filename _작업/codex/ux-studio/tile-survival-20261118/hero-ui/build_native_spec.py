from pathlib import Path
import csv,json
D=Path(__file__).parent
rows=[]
def add(screen,parent,name,kind,box,text='',font='',asset='',state='',action='',note='',basis='화면 관찰 기반 제작 제안'):
 x,y,w,h=box
 rows.append(dict(screen=screen,parent=parent,name=name,native_kind=kind,x=x,y=y,w=w,h=h,text=text,font_size=font,font_family='도구 기본 한글 sans; 원본 폰트 미확인' if text else '',asset=asset,state=state,action=action,note=note,basis=basis))
def header(s,title,color):
 add(s,'',f'Img_{s}_Background','panel',(0,0,504,894),note=color+'; 기본 패널 tint 제안; 원본 배경 복제 아님')
 add(s,'',f'Img_{s}_Header','panel',(0,0,504,41),note='제목바 공통 높이41; 각 화면 tint')
 add(s,'',f'Txt_{s}_Title','text',(26,2,430,36),title,28,note='좌정렬·굵게·흰색+짙은 외곽선은 제안')
def button(s,parent,name,box,label,color='cyan',action='',font=24,state='normal/hover/pressed/disabled native tint',note=''):
 add(s,parent,'Btn_'+name,'button',box,state=state,action=action,note='입력 wrapper; '+note)
 add(s,'Btn_'+name,'Img_'+name+'_Frame','panel',box,state='targetGraphic',note=color+'; native 기본 프레임; 9slice 전용 원화 미제작')
 add(s,'Btn_'+name,'Txt_'+name+'_Label','text',box,label,font,note='가운데정렬; 부모입력전달')
def back(s,target):
 button(s,'',s+'_Back',(0,818,73,66),'◀','cyan',target,32,note='좌하단 공통 입력; 원본 화살표 원화 미제작')
def money(s,values):
 for i,(label,x,w) in enumerate(values):
  add(s,'',f'Img_{s}_Currency{i+1}_Plate','panel',(x,51,w,27),note='짙은 투명 받침')
  add(s,'',f'Txt_{s}_Currency{i+1}','text',(x+3,51,w-25,27),label,18,note='영상 관측 표시값; 경제 데이터 아님')
  button(s,'',s+f'_Currency{i+1}_Add',(x+w-25,48,26,30),'+','orange','미관측·연결 금지',22,state='disabled 제안')
s='Heroes';header(s,'영웅','청록 헤더/깊은 청색 본문')
for i,(label,x) in enumerate([('전체',18),('산악',137),('모래',256),('구름',375)]):
 button(s,'',f'Heroes_Filter{i+1}',(x,54 if i==0 else 61,113,57 if i==0 else 50),label,'pale selected' if i==0 else 'cyan','필터 결과 미관측; 전체만 선택표현',22,state='전체 selected; 나머지 disabled 제안',note='계열 아이콘 원화 미제작; 텍스트는 제작 식별용이며 최종은 아이콘')
add(s,'','Group_Heroes_Grid','group',(20,116,468,560),note='4열·공통111×180·가로8·세로10; 관찰비율 정규화한 제작규격')
hero=[('Sage','sage-portrait-v001.webp','purple','Lv.5'),('Ghost','ghost-portrait-v001.webp','blue','Lv.5'),('Slot03_Punk','punk-portrait-v001.webp','orange','0/10'),('Slot04_Showman','showman-portrait-v001.webp','orange','0/10'),('Slot05_Scout','pink-scout-portrait-v001.webp','orange','1/10'),('Slot06_Lumberjack','lumberjack-portrait-v001.webp','purple','0/10'),('Slot07_Martial','martial-portrait-v001.webp','purple','0/10'),('Slot08_Chef','chef-portrait-v001.webp','purple','0/10'),('Slot09_Redhair','redhair-portrait-v001.webp','purple','0/10'),('Slot10_Twintails','twintails-portrait-v001.webp','purple','0/10'),('Slot11_Ruster','ruster-portrait-v001.webp','blue','0/10')]
for i,(name,asset,rarity,progress) in enumerate(hero):
 x=20+(i%4)*119;y=116+(i//4)*190;n='Hero_'+name
 add(s,'Group_Heroes_Grid','Btn_'+n,'button',(x,y,111,180),state='normal/hover/pressed; selected false',action='Heroes→HeroDetail; 영상관측' if i<2 else '결과 미관측·연결 금지',note='Slot기호는 제작용 설명; 영상에서 공식 이름 미확인')
 add(s,'Btn_'+n,'Img_'+n+'_Frame','panel',(x,y,111,180),state='rarity '+rarity,note='공통 외곽규격/반경6 제안; 프레임 9slice 원화 미제작')
 add(s,'Btn_'+n,'Img_'+n+'_Portrait','image',(x+3,y+4,105,154),asset=asset,note='신규 개별 원화; cover; 상단기준 crop, 동일인물 재사용은 동일영웅에만')
 add(s,'Btn_'+n,'Img_'+n+'_Class','panel',(x+4,y+4,18,20),note='계열 아이콘 원화 미제작; 최종 아이콘 필요')
 add(s,'Btn_'+n,'Img_'+n+'_ProgressPlate','panel',(x+7,y+157,97,19),note='어두운 capsule; 카드와 별도')
 add(s,'Btn_'+n,'Txt_'+n+'_Progress','text',(x+8,y+154,96,25),progress,18,note='영상 관측 상태 값; 진행/경험치 계산 없음')
 if i<2:
  add(s,'Btn_'+n,'Img_'+n+'_Notice','panel',(x+98,y+3,11,14),note='빨간 알림점; native circle 제안')
  add(s,'Btn_'+n,'Txt_'+n+'_UpgradeMark','text',(x+85,y+132,22,30),'↑',25,note='표시만; 클릭/레벨업 연동 없음')
back(s,'영지(TSV03-01), 본체 통합 시 연결')
button(s,'','Heroes_Recruit',(84,819,333,61),'모집','green','모집 버튼 표시관측; 클릭후 전환 미관측·연결은 제작제안',26)
s='HeroDetail';header(s,'세이지','하늘색 상단→깊은 청색 하단; gradient는제작제안')
add(s,'','Txt_HeroDetail_Rarity','text',(9,72,85,53),'SR',48,note='분홍색 bold; 원본폰트미확인')
add(s,'','Txt_HeroDetail_Class','text',(208,37,88,31),'☁  ▰',22,note='계열/총 아이콘 미제작; 임시 native기호 제안')
add(s,'','Img_HeroDetail_Sage','image',(110,139,284,382),asset='sage-fullbody-v001.webp',note='contain; 2D정지원화. 원본3D런타임 구현아님')
button(s,'','HeroDetail_Prev',(14,407,37,51),'❮','transparent','미관측·연결금지',34,state='disabled 제안')
button(s,'','HeroDetail_Next',(454,407,37,51),'❯','transparent','미관측·연결금지',34,state='disabled 제안')
for label,y in [('프로필',82),('정보',136)]:
 button(s,'','HeroDetail_'+('Profile' if y==82 else 'Info'),(453,y,43,43),label,'cyan','미관측·연결금지',14,state='disabled 제안')
add(s,'','Img_HeroDetail_PowerGlow','panel',(165,526,172,35),note='주황 glow제안; 별도 투영효과')
add(s,'','Txt_HeroDetail_Power','text',(193,527,121,33),'5,744',26,note='영상18초 관측값; 계산기능없음')
add(s,'','Group_HeroDetail_Stars','group',(77,583,292,45))
for i in range(6):
 add(s,'Group_HeroDetail_Stars',f'Txt_HeroDetail_Star{i+1}','text',(78+i*48,583,40,43),'✦' if i==0 else '★',34,note='첫째금색/나머지짙은청색; 별원화미제작')
button(s,'','HeroDetail_Ascend',(410,580,42,45),'↑','cyan','미관측·연결금지',32,state='disabled 제안')
add(s,'','Group_HeroDetail_Stats','group',(62,648,387,78))
for i,(label,value) in enumerate([('가디언 수량','+2'),('레벨','5'),('부대 용량','+50')]):
 x=62+i*129
 add(s,'Group_HeroDetail_Stats',f'Img_HeroDetail_Stat{i+1}','panel',(x,648,129,78),note='짙은청색/낮은불투명')
 add(s,'Group_HeroDetail_Stats',f'Txt_HeroDetail_Stat{i+1}_Label','text',(x+3,656,123,24),label,18)
 add(s,'Group_HeroDetail_Stats',f'Txt_HeroDetail_Stat{i+1}_Value','text',(x+3,680,123,39),value,28,note='영상18초 관측값; 밸런스/게임데이터 아님')
button(s,'','HeroDetail_Upgrade',(86,735,334,63),'업그레이드','green','영상 클릭은관측; 실제수치증가/게임API연결금지',24,state='normal/hover/pressed; 상한은별도disabled상태제안')
add(s,'Btn_HeroDetail_Upgrade','Txt_HeroDetail_Experience','text',(141,737,228,29),'91,700/500',22,note='관측값; 업그레이드라벨은 y765/H28로 native에서분리조정')
back(s,'HeroDetail→Heroes, 영상관측')
button(s,'','HeroDetail_Attributes',(91,818,198,64),'속성','pale selected','selected 표현; 추가동작미관측',24,state='selected')
button(s,'','HeroDetail_Skills',(295,818,197,64),'스킬','cyan','미관측·연결금지',24,state='disabled 제안')
s='Recruit';header(s,'영웅 모집','주황 모집무대; 하단짙은주홍; 곡선원화 미제작')
money(s,[('◆  790',245,121),('▱  x0',377,118)])
add(s,'','Img_Recruit_Scout','image',(24,76,422,568),asset='pink-scout-fullbody-v001.webp',note='contain; 신규2D스틸; 이미지내문구없음')
add(s,'','Txt_Recruit_BannerTitle','text',(45,477,393,83),'고급모집',58,note='주황금색·bold·dark outline제안; native분리')
button(s,'','Recruit_RewardList',(429,85,66,54),'보상품 보기','cyan','미관측·연결금지',13,state='disabled 제안')
button(s,'','Recruit_History',(429,146,66,54),'모집 기록','cyan','미관측·연결금지',13,state='disabled 제안')
add(s,'','Img_Recruit_CTAField','panel',(0,652,504,242),note='짙은주홍; 아트하단분리면')
add(s,'','Txt_Recruit_FreeTimer','text',(59,708,217,27),'23h 28m 후 무료',18,note='영상관측 정적텍스트; 실제타이머없음')
button(s,'','Recruit_Once',(34,734,200,61),'1회 뽑기','yellow','유료모집미관측·게임연결금지',22,state='disabled 제안')
button(s,'','Recruit_Ten',(271,734,200,61),'10연속 뽑기','yellow','유료모집미관측·게임연결금지',22,state='disabled 제안')
add(s,'Btn_Recruit_Once','Txt_Recruit_Once_Cost','text',(89,735,102,23),'▱ 1',18,note='영상 표시값; 금액/소비구현없음; 라벨은 아래26px영역')
add(s,'Btn_Recruit_Ten','Txt_Recruit_Ten_Cost','text',(315,735,129,23),'▱ 10  9',18,note='원본10%할인 표시; native취소선별도제안')
back(s,'영지(TSV03-01), 본체통합 시연결')
for label,x,name,asset in [('고급',67,'Advanced','pink-scout-portrait-v001.webp'),('일반',215,'Normal','sage-portrait-v001.webp')]:
 button(s,'','Recruit_Tab'+name,(x,809,144,75),label,'gold selected' if name=='Advanced' else 'purple','동일판틀의selected상태; 일반무료상태는영상68초관측',22,state='advanced selected / normal not selected')
 add(s,'Btn_Recruit_Tab'+name,'Img_Recruit_Tab'+name+'_Portrait','image',(x+3,812,71,68),asset=asset,note='동일인물의개별초상')
add(s,'','Txt_Recruit_FreeStateSpec','note',(0,0,0,0),'무료상태는같은page의별도native그룹',note='본UI표시용아님. 보라배경+일반모집+무료횟수4+단일무료CTA. 무료CTA→연출→결과는관측; 직접결과연결은제작제안')
s='RecruitResult';header(s,'모집 결과','짙은청색; 단독page')
money(s,[('◆  830',19,132),('▱  0',169,128)])
add(s,'','Group_RecruitResult_Skip','group',(322,64,167,29))
add(s,'Group_RecruitResult_Skip','Img_RecruitResult_SkipBox','panel',(323,67,25,25),note='빈체크박스; 원본토글결과미관측')
add(s,'Group_RecruitResult_Skip','Txt_RecruitResult_SkipLabel','text',(373,65,114,28),'영상 스킵',20)
add(s,'','Group_RecruitResult_Card','group',(183,226,140,449),note='원본경계181,225,143,453 근접정규화제안')
add(s,'Group_RecruitResult_Card','Img_RecruitResult_CardFrame','panel',(183,226,140,449),note='하늘색·round16·native프레임; 전용9slice원화미제작')
add(s,'Group_RecruitResult_Card','Img_RecruitResult_Ruster','image',(201,372,112,113),asset='ruster-portrait-v001.webp',note='신규원화. 퍼즐조각외곽원화미제작; 초상만새그림')
add(s,'Group_RecruitResult_Card','Txt_RecruitResult_Amount','text',(277,458,35,31),'x3',23,note='영상관측값')
add(s,'Group_RecruitResult_Card','Img_RecruitResult_NamePlate','panel',(184,589,138,85),note='밝은청색')
add(s,'Group_RecruitResult_Card','Txt_RecruitResult_Name','text',(189,590,130,79),'러스터\n(조각)',27,note='가운데정렬; 영상에읽힌이름')
back(s,'RecruitResult→Recruit 일반무료소진상태; 영상관측')
button(s,'','RecruitResult_Once',(84,819,198,60),'재모집','yellow','재모집미관측·게임연결금지',23,state='disabled 제안')
button(s,'','RecruitResult_Ten',(291,819,198,60),'재모집','yellow','재모집미관측·게임연결금지',23,state='disabled 제안')
add(s,'Btn_RecruitResult_Once','Txt_RecruitResult_Once_Cost','text',(141,821,90,24),'▱ 1',18,note='라벨 y845/H30로분리')
add(s,'Btn_RecruitResult_Ten','Txt_RecruitResult_Ten_Cost','text',(345,821,100,24),'▱ 10',18,note='라벨 y845/H30로분리')
# Text with price/experience lines is physically separated before deriving parent percentages.
fixes={
 'Txt_HeroDetail_Upgrade_Label':(86,765,334,30),
 'Txt_Recruit_Once_Label':(34,760,200,32),
 'Txt_Recruit_Ten_Label':(271,760,200,32),
 'Txt_Recruit_TabAdvanced_Label':(140,822,68,36),
 'Txt_Recruit_TabNormal_Label':(288,822,68,36),
 'Txt_RecruitResult_Once_Label':(84,846,198,31),
 'Txt_RecruitResult_Ten_Label':(291,846,198,31),
}
for r in rows:
 if r['name'] in fixes:r['x'],r['y'],r['w'],r['h']=fixes[r['name']]
byname={r['name']:r for r in rows}
for r in rows:
 p=byname.get(r['parent']);px,py,pw,ph=(p['x'],p['y'],p['w'],p['h']) if p else (0,0,504,894)
 r['relative_x_pct']=round((r['x']-px)/pw*100,5) if pw else ''
 r['relative_y_pct']=round((r['y']-py)/ph*100,5) if ph else ''
 r['relative_w_pct']=round(r['w']/pw*100,5) if pw else ''
 r['relative_h_pct']=round(r['h']/ph*100,5) if ph else ''
with (D/'native-assembly-spec-v002.csv').open('w',newline='') as f:
 w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
print('spec rows',len(rows))
print(json.dumps({s:sum(r['screen']==s for r in rows) for s in dict.fromkeys(r['screen'] for r in rows)},ensure_ascii=False))
