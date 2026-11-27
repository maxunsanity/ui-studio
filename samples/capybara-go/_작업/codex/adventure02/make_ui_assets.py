from pathlib import Path
from PIL import Image,ImageDraw
import json,hashlib,math
s=Path('/Users/max/projest_max/ui-studio/samples/capybara-go'); w=s/'_작업/codex/adventure02';p=s/'ui-studio/assets/production/adventure';a=s/'ui-studio/assets/authoring/adventure/v001'; assets=[]
def add(role,size,draw):
 im=Image.new('RGBA',size);d=ImageDraw.Draw(im);draw(d,im);im.save(a/(role+'.png'));f=p/(role+'.webp');im.save(f,'WEBP',lossless=True,method=6);assert f.stat().st_size<300000;assets.append({'role':role,'path':str(f),'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'size':list(size),'method':'fresh code-native geometric UI drawing; no reference pixels'})
def rr(d,b,fill,r=8,outline='#14111b',width=3):d.rounded_rectangle(b,radius=r,fill=fill,outline=outline,width=width)
add('adventure-bottom',(504,484),lambda d,i:(d.rectangle((0,0,503,483),fill='#1c1b25'),d.line((0,1,503,1),fill='#0a080e',width=5)))
def stats(d,i):
 d.rectangle((0,0,503,59),fill='#97634d');d.line((0,1,503,1),fill='#412e26',width=4)
 for x,w in [(8,140),(156,140),(306,86),(402,94)]:rr(d,(x,15,x+w-1,47),'#1d1514',14,width=2)
 rr(d,(161,18,278,45),'#ed456a',8,width=0)
add('adventure-stats',(504,60),stats)
def log(d,i):
 rr(d,(1,1,i.width-2,i.height-2),'#16101b',5,width=3);rr(d,(3,3,i.width-4,i.height-7),'#9b37de',4,width=1);d.rectangle((6,10,i.width-7,i.height-15),fill='#f7eefb');d.line((9,4,38,4),fill='#dd93ff',width=3)
add('adventure-log',(488,100),log)
add('adventure-day',(288,38),lambda d,i:rr(d,(1,1,286,36),'#453520',18,outline='#a67d38',width=2))
add('ribbon',(444,72),lambda d,i:(d.polygon([(1,29),(25,9),(419,9),(443,29),(431,59),(11,59)],fill='#df6b00',outline='#4d260b',width=4),rr(d,(19,1,425,51),'#ffb51c',5,outline='#63350b',width=3),d.line((27,4,414,4),fill='#ffe977',width=3)))
def card(d,i):
 rr(d,(2,9,466,110),'#080b0d',5,outline='#17110f',width=4);rr(d,(5,4,462,98),'#fae9c5',5,outline='#332621',width=3);rr(d,(7,2,453,28),'#b58e76',8,outline='#463029',width=2)
add('skill-card',(472,114),card)
add('skill-icon',(92,104),lambda d,i:(rr(d,(1,6,90,101),'#aaa5c4',7,outline='#20202c',width=4),rr(d,(7,13,84,95),'#686684',3,outline='#e4e2f0',width=3),rr(d,(3,1,89,19),'#50516f',8,outline='#a6a2c9',width=2)))
def sword(d,i):
 d.polygon([(18,65),(48,25),(69,8),(67,32),(35,77)],fill='#d8eff0',outline='#141821',width=4);d.line((27,66,62,20),fill='#92b4c4',width=3);d.polygon([(19,56),(40,74),(33,83),(12,65)],fill='#aaaec1',outline='#1a1724',width=3);d.line((23,76,12,91),fill='#774a47',width=8);d.polygon([(48,50),(61,48),(61,61),(73,64),(60,67),(58,80),(53,69),(40,70),(49,61)],fill='#64f1fc',outline='#0a304b',width=2)
add('skill-ice-sword',(84,100),sword)
def heart(d,i):
 d.polygon([(41,78),(10,48),(5,29),(14,14),(29,12),(41,22),(53,12),(68,14),(78,29),(75,48)],fill='#fd196b',outline='#211522',width=4);d.line((15,24,22,20),fill='#ff8eb7',width=4);d.rectangle((55,65,68,95),fill='#78ee24',outline='#193a13',width=2);d.rectangle((47,73,77,86),fill='#78ee24',outline='#193a13',width=2)
add('skill-heart',(84,100),heart)
def strike(d,i):
 d.polygon([(31,3),(43,17),(59,7),(62,24),(77,27),(66,40),(79,53),(60,57),(59,76),(43,65),(28,79),(25,60),(9,58),(19,42),(4,31),(23,24)],fill='#e44052',outline='#151622',width=4);d.polygon([(15,66),(48,28),(64,18),(59,36),(29,79)],fill='#d9eef1',outline='#141a23',width=4);d.line((23,78,13,94),fill='#a17c56',width=8)
add('skill-strike',(84,100),strike)
add('green-button',(200,64),lambda d,i:(rr(d,(2,3,197,62),'#4f600a',8,width=3),rr(d,(3,1,196,55),'#a4d500',7,width=3),d.line((11,5,187,5),fill='#e9fa82',width=3)))
add('cyan-button',(52,48),lambda d,i:(rr(d,(1,1,50,46),'#126273',7,width=3),rr(d,(2,1,49,40),'#03c7da',5,width=2),d.line((8,5,43,5),fill='#8df4f0',width=3)))
add('close-circle',(56,56),lambda d,i:(d.ellipse((1,1,54,54),fill='#77748e',outline='#10131e',width=3),d.ellipse((7,7,48,48),fill='#282a39',outline='#b0a9c8',width=2)))
def myth(d,i):
 d.polygon([(4,1),(436,1),(444,46),(420,132),(439,321),(422,432),(411,462),(10,462),(3,430),(22,320),(0,128)],fill='#522b23',outline='#1d1517',width=5)
 rr(d,(18,40,426,126),'#a96e4b',8,outline='#f6a627',width=5)
 rr(d,(13,138,431,415),'#1c1724',33,outline='#0c0c10',width=9)
 rr(d,(25,145,419,409),'#ffbd28',30,outline='#693e1e',width=7)
 rr(d,(48,170,396,383),'#09080d',13,outline='#5b351c',width=6)
 for y,c in [(175,'#3a344c'),(230,'#ecb3f2'),(340,'#72501a')]:rr(d,(60,y,384,y+40 if y!=230 else 328),c,7,outline='#19111d',width=3)
 d.polygon([(16,246),(51,269),(16,292)],fill='#df2e68',outline='#ffd53e',width=5);d.polygon([(428,246),(393,269),(428,292)],fill='#df2e68',outline='#ffd53e',width=5)
 rr(d,(5,425,439,480),'#4b2d24',8,outline='#1a1215',width=5)
add('myth-machine',(444,486),myth)
def angel(d,i):
 d.ellipse((15,17,69,72),fill='#f4f3de',outline='#17131b',width=4);d.ellipse((14,5,69,26),fill='#ffcd21',outline='#15131b',width=4);d.ellipse((23,10,61,20),fill='#fffbe7');d.ellipse((23,30,61,72),fill='#ffe3ab',outline='#433126',width=3);d.ellipse((29,44,34,52),fill='#e98a49');d.ellipse((50,44,55,52),fill='#e98a49');d.arc((29,48,55,63),0,180,fill='#9c6b43',width=2);d.polygon([(8,42),(1,58),(16,70),(23,63)],fill='#dcf3f4',outline='#1e2734',width=3);d.polygon([(76,42),(83,58),(68,70),(61,63)],fill='#dcf3f4',outline='#1e2734',width=3)
add('myth-angel',(84,84),angel)
def demon(d,i):
 d.polygon([(19,28),(16,3),(34,19),(51,19),(68,3),(63,30)],fill='#f65589',outline='#251328',width=4);d.ellipse((13,20,72,76),fill='#f95378',outline='#221126',width=4);d.ellipse((24,37,34,49),fill='#4c174f');d.ellipse((51,37,61,49),fill='#4c174f');d.polygon([(28,56),(36,64),(44,57),(51,64),(58,55)],fill='#fff2d3');d.line((67,61,80,70,77,47),fill='#48234d',width=5)
add('myth-demon',(84,84),demon)
add('myth-dot',(36,36),lambda d,i:(d.ellipse((1,1,34,34),fill='#676c73',outline='#1d242a',width=3),d.ellipse((7,7,28,28),outline='#a2abb0',width=2),d.line((11,20,25,20),fill='#333f43',width=3)))
def wheel(d,i):
 d.ellipse((1,1,299,299),fill='#b9a8c0',outline='#10111a',width=5)
 for k,c in enumerate(['#ffb12a','#e84445','#7dcb2f','#ffcd3a','#e64b49','#8abe27','#fbc53a','#e74a43']):d.pieslice((12,12,288,288),k*45-90,(k+1)*45-90,fill=c,outline='#352522',width=3)
 d.ellipse((117,117,183,183),fill='#ffc330',outline='#754821',width=5);d.polygon([(132,2),(150,36),(168,2)],fill='#f7edb9',outline='#362222',width=4)
add('instant-wheel',(300,300),wheel)
(w/'assets.json').write_text(json.dumps({'assets':assets},ensure_ascii=False,indent=2));print(len(assets),'fresh geometry assets')
