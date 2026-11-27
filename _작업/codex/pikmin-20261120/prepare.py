from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import json, math, hashlib, shutil

root=Path('/Users/max/projest_max/ui-studio')
sample=root/'samples/pikmin'
assets=sample/'ui-studio/assets'
work=root/'_작업/codex/pikmin-20261120'
assets.mkdir(parents=True,exist_ok=True)
S=4
def save(name,im):
    im=im.resize((im.width//S,im.height//S),Image.Resampling.LANCZOS)
    im.save(assets/(name+'.webp'),lossless=True,method=6)
def canvas(w,h):
    im=Image.new('RGBA',(w*S,h*S));return im,ImageDraw.Draw(im)
def ellipse(draw,box,fill,outline=None,width=1):draw.ellipse(tuple(v*S for v in box),fill=fill,outline=outline,width=width*S)
def line(draw,pts,fill,width):draw.line([(x*S,y*S) for x,y in pts],fill=fill,width=width*S,joint='curve')
def poly(draw,pts,fill):draw.polygon([(x*S,y*S) for x,y in pts],fill=fill)
colors={'red':('#ed413c','#ad1e2e'),'yellow':('#ffd84d','#cda326'),'blue':('#409bdc','#2364a8'),'purple':('#ad63c9','#693598'),'white':('#faf7ef','#cfdbd5'),'rock':('#59616d','#343b46'),'pink':('#ef8ec6','#c756a6')}
for name,(hi,lo) in colors.items():
    im,dr=canvas(100,140)
    line(dr,[(51,52),(49,29),(61,10)],'#5d9c48',3)
    poly(dr,[(58,14),(62,3),(85,2),(74,17)],'#8bcf59')
    line(dr,[(60,14),(78,5)],'#59993f',1)
    line(dr,[(44,111),(36,132),(23,132)],lo,5);line(dr,[(57,110),(63,132),(75,132)],lo,5)
    line(dr,[(34,83),(18,102),(12,99)],lo,4);line(dr,[(65,83),(81,102),(87,98)],lo,4)
    ellipse(dr,(34,69,66,119),lo);ellipse(dr,(37,68,62,113),hi)
    if name=='rock':
        poly(dr,[(26,65),(43,48),(63,49),(77,70),(68,95),(39,99),(22,82)],lo)
        poly(dr,[(29,63),(44,51),(62,53),(67,72),(47,86),(28,80)],hi)
    else:
        if name=='yellow':
            poly(dr,[(31,65),(11,50),(21,80),(37,84)],hi);poly(dr,[(66,65),(88,50),(77,80),(61,84)],hi)
        if name=='purple':
            ellipse(dr,(29,49,40,69),hi);ellipse(dr,(59,49,71,69),hi)
        if name=='pink':
            ellipse(dr,(10,77,36,91),'#eef8fd');ellipse(dr,(64,77,90,91),'#eef8fd')
        ellipse(dr,(26,53,74,94),lo);ellipse(dr,(28,52,70,90),hi)
    eye='#e9677c' if name=='white' else '#ffffff'
    for x in [36,57]:
        ellipse(dr,(x-6,61,x+7,77),eye);ellipse(dr,(x,65,x+4,73),'#20313c')
    if name=='red':poly(dr,[(48,76),(70,83),(49,84)],hi)
    if name=='blue':ellipse(dr,(43,81,56,87),'#255e96')
    save('pikmin-'+name+'-v001',im)

for col in ['white','yellow','red','blue']:
    im,dr=canvas(120,160)
    poly(dr,[(43,30),(77,30),(69,47),(83,113),(75,135),(45,135),(36,113),(51,47)],'#e8f3ed')
    ellipse(dr,(35,99,85,140),'#79503a');ellipse(dr,(38,97,82,119),'#a87b58')
    for x,y in [(47,99),(64,99),(55,109),(72,109)]:
        fill={'white':'#fefdf2','yellow':'#f9dd47','red':'#ec6260','blue':'#5f9cda'}[col]
        ellipse(dr,(x-7,y-5,x+7,y+5),fill)
    poly(dr,[(43,30),(77,30),(60,45)],'#bd9064');line(dr,[(44,51),(39,100)],'#ffffff',3)
    save('petals-'+col+'-v001',im)

for state in ['normal','pressed','disabled']:
    im,dr=canvas(120,120)
    for rr in range(58,0,-1):
        t=rr/58
        if state=='disabled':color=(190+int(30*(1-t)),196+int(25*(1-t)),194+int(25*(1-t)),255)
        else:color=(255,127+int(85*(1-t)),113+int(80*(1-t)),255)
        ellipse(dr,(60-rr,60-rr,60+rr,60+rr),color)
    ellipse(dr,(10,10 if state!='pressed' else 13,110,110),'#ec967c',outline='#fff4cd',width=3)
    for rr in range(44,0,-1):
        t=rr/44
        color=(210,215,214,255) if state=='disabled' else (255,119+int(73*(1-t)),97+int(75*(1-t)),255)
        ellipse(dr,(60-rr,60-rr,60+rr,60+rr),color)
    save('go-'+state+'-v001',im)

im,dr=canvas(390,300)
for y in range(300):
    green=153+int(35*math.sin(y/100))
    line(dr,[(0,y),(390,y)],(107,green,100,255),1)
for pts in [[(50,-20),(100,60),(76,150),(130,240),(124,320)],[(210,-20),(180,100),(245,170),(220,320)],[(-20,80),(110,90),(200,140),(400,75)],[(-20,240),(100,190),(250,250),(410,210)]]:
    line(dr,pts,'#def0c9',7);line(dr,pts,'#f8fbdd',3)
ellipse(dr,(165,148,179,162),'#428fdb',outline='#ffffff',width=2)
save('map-v001',im)

entries=[
 ('M01','버섯 목록','mushroom',0,'main','지도·탐험 탭·버섯 카드·모종/과일'),
 ('M02','버섯 상세','mushroom',8,'mushroom-detail','장면·이름·참가·참가자·보상'),
 ('M03','버섯 피크민 선택','mushroom',12,'mushroom-select','검색·자동·작업력·종류 필터·5열 목록·GO'),
 ('M04','30마리 선택과 제한 안내','mushroom',34,'mushroom-selected','동일 선택 틀의30/30·GO활성·초과 안내'),
 ('M05','버섯 시작','mushroom',40,'mushroom-start','시작 연출 스틸·게임 계산 없음'),
 ('E01','꽃봉오리 상세','expedition',44,'flower-detail','장면·꽃봉오리·꽃잎 사용·엽서'),
 ('E02','꽃잎 선택','expedition',6,'petals','사용 꽃잎·150개 필요·3열 병 목록·다음'),
 ('E03','엽서 피크민 선택','expedition',10,'postcard-select','검색·자동·발견일·색 필터·5열 목록'),
 ('E04','5마리 선택','expedition',54,'postcard-selected','동일 선택 틀의5/5·GO활성'),
 ('E05','개화','expedition',20,'bloom','개화 연출 스틸·게임 계산 없음'),
 ('E06','정수 보상','expedition',26,'essence','흰 카드·노랑 정수·7개·돌아가기'),
 ('E07','개화 후 상세','expedition',36,'flower-bloomed','노랑 꽃·남은시간·이미 획득 안내')]
inventory=[]
captures=sample/'docs/reference/captures';captures.mkdir(parents=True,exist_ok=True)
for id,title,video,sec,key,desc in entries:
    f=work/video/('frame_%05d.jpg'%(sec//2));to=captures/(id+'.jpg');shutil.copy2(f,to)
    inventory.append(dict(id=id,title=title,video=video,seconds=sec,key=key,description=desc,capture='captures/'+to.name))
(sample/'docs/ui/ui-inventory.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2)+'\n')
tokens={'canvas':[390,844],'scene':[0,0,390,330],'selectionHeader':[0,330,390,44],'filters':[12,382,366,40],'grid':{'columns':5,'cell':[70,92],'gap':[6,8],'origin':[8,432]},'footer':[0,760,390,84],'back':[12,782,44,44],'go':[306,758,72,72],'pill':{'height':36,'stroke':'#91c5bd','radius':18},'font':{'body':13,'title':22,'caption':10},'source':'제작 공통 규격안, 스크린샷별 수치 복사 아님'}
(sample/'docs/ui/common-layout-tokens.json').write_text(json.dumps(tokens,ensure_ascii=False,indent=2)+'\n')
manifest=[]
for p in assets.glob('*.webp'):
    im=Image.open(p);assert p.stat().st_size<300000,(p,p.stat().st_size)
    manifest.append({'file':p.name,'bytes':p.stat().st_size,'size':im.size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
(sample/'docs/ui/asset-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
(work/'plan.md').write_text('''# 피크민 UI 샘플 제작 계획
목표: 두 영상에서 확인한 버섯 참가와 꽃·엽서·개화·정수 흐름을 별도 native 샘플로 제작.
방법: 기존 샘플의 목록/고정 footer 구조를 참고하되 기존 게임 원화는 복사하지 않는다. 그림은 신규 자원, 글자/수치/입력은 별도 부품. JSON 외부 주입 금지.
- [x] 2초 전체 구간 프레임·대표12관찰상태·원본 출처·공통 토큰 작성.
- [x] 신규 장면3개·선택 아이콘·꽃잎 병·GO상태·지도 자원 준비.
- [ ] 피크민 독립 workspace에 실제 편집기로 공통 틀과 하위 부품 조립·저장.
- [ ] 원본 관찰에 따른 버튼/복귀·선택 대표 상태 연결.
- [ ] 저장/재열기·실제 클릭·390/430·이미지/넘침 확인, 조사서와 가이드/증거 연결.
미관찰: 정렬/검색 상세창·실시간 버섯전투 결과·소비/보상 서버는 새로 만들지 않는다.
경계: 선택 수/진행은 샘플의 대표 상태이며 실제 재고/위치/통신/게임 판정이 아니다.
''')
print('assets',len(manifest),'observed records',len(inventory),'maximum bytes',max(x['bytes'] for x in manifest))
