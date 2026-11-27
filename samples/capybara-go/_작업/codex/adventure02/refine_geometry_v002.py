from pathlib import Path
from PIL import Image,ImageDraw
import json,hashlib
s=Path('/Users/max/projest_max/ui-studio/samples/capybara-go');a=s/'ui-studio/assets/authoring/adventure/v002';p=s/'ui-studio/assets/production/adventure/v002';m=s/'_작업/codex/adventure02/assets-v002.json';data=json.loads(m.read_text());S=4
class Pen:
 def __init__(self,d):self.d=d
 def __getattr__(self,n):
  def call(x,*args,**kw):
   def sc(v):return tuple(sc(k) for k in v) if isinstance(v,(tuple,list)) else v*S
   for k in ['width','radius']:
    if k in kw:kw[k]*=S
   return getattr(self.d,n)(sc(x),*args,**kw)
  return call
def rr(d,b,f,r=8,o='#18131d',w=3):d.rounded_rectangle(b,radius=r,fill=f,outline=o,width=w)
def add(role,size,draw):
 im=Image.new('RGBA',(size[0]*S,size[1]*S));d=Pen(ImageDraw.Draw(im));draw(d,*size);master=a/(role+'_v002.png');im.save(master);im.thumbnail((1200,1200),Image.Resampling.LANCZOS);f=p/(role+'_v002.webp');im.save(f,'WEBP',quality=96,method=6);assert f.stat().st_size<=300000;data['assets']=[x for x in data['assets'] if x['role']!=role];data['assets'].append({'role':role,'path':str(f),'authoring':str(master),'size':list(im.size),'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'bytes':f.stat().st_size,'method':'fresh supersampled4x UI geometry with bevels and inset shade, no source pixels','newPixels':True})
def icon(d,w,h):
 rr(d,(1,6,w-2,h-2),'#373240',6,w=3);rr(d,(4,7,w-5,h-7),'#b3abc9',5,o='#e6e1f1',w=2);rr(d,(10,14,w-11,h-13),'#6d6b87',2,o='#33303d',w=2)
 for x,y in [(13,18),(45,18),(29,38),(61,38),(13,58),(45,58),(29,78),(61,78)]:d.rectangle((x,y,x+14,y+14),fill='#77758e')
 d.line((7,11,w-8,11),fill='#f9f4ff',width=2);d.line((7,h-10,w-8,h-10),fill='#686077',width=3);rr(d,(3,1,w-4,19),'#4b4d6e',9,o='#b0a8cc',w=2);d.line((12,4,w-13,4),fill='#8c8bab',width=1)
add('skill-icon',(92,104),icon)
def card(d,w,h):
 rr(d,(7,8,w-1,h-1),'#151018',4,w=3);rr(d,(1,5,w-7,h-8),'#faeac7',4,o='#2d211e',w=3);d.line((8,9,w-15,9),fill='#fff9dd',width=2);d.line((8,h-12,w-14,h-12),fill='#d9ba8f',width=2);rr(d,(99,1,w-17,29),'#b18a72',10,o='#4b342b',w=2);d.line((110,4,w-28,4),fill='#d5b69b',width=2)
add('skill-card',(472,114),card)
add('myth-card',(62,62),lambda d,w,h:(rr(d,(1,1,w-2,h-2),'#512039',4,w=3),rr(d,(4,3,w-5,h-6),'#ff3b9a',2,o='#ffd17c',w=2),d.line((7,7,w-8,7),fill='#ffa8d6',width=3),d.line((7,h-9,w-8,h-9),fill='#b81865',width=3)))
add('green-button',(200,64),lambda d,w,h:(rr(d,(1,4,w-2,h-1),'#26320c',7,w=3),rr(d,(2,1,w-3,h-7),'#a7d700',6,w=3),d.line((11,5,w-12,5),fill='#f0fa9f',width=3),d.line((11,h-11,w-12,h-11),fill='#80a500',width=3)))
def book(d,w,h):
 rr(d,(8,2,60,69),'#4b1936',5,w=3);d.polygon([(14,2),(60,2),(56,9),(12,9)],fill='#f7e4be',outline='#281421',width=2);rr(d,(12,7,57,66),'#d3442c',3,o='#ffbc34',w=3);d.rectangle((6,7,14,68),fill='#9a2839',outline='#301424',width=2)
 for y in [15,39,58]:d.rounded_rectangle((3,y,15,y+7),radius=1,fill='#ffd94a',outline='#633419',width=1)
 d.line((19,14,51,14),fill='#ff843f',width=2);d.line((23,47,35,22,48,47,23,47,48,30,23,30,35,54,48,30),fill='#9a4b21',width=2)
add('skill-book',(64,72),book)
for role,h in [('adventure-primary-front',100),('adventure-primary-rim',108)]:
 def pill(d,w,h,front=role.endswith('front')):
  rr(d,(1,1,w-2,h-2),'#252330',h//2,w=5);rr(d,(6,5,w-7,h-7),'#555264',h//2-4,o='#111018',w=3);d.arc((10,9,w-11,h-9),4,175,fill='#797182',width=2)
  if front:
   rr(d,(10,4,w-11,h-13),'#c9571e',42,o='#49261c',w=4);rr(d,(15,8,w-16,h-22),'#ff9432',36,o='#f4a442',w=2);d.arc((21,12,w-22,h-23),182,335,fill='#ffbe68',width=4);d.line((54,h-21,w-54,h-21),fill='#e47827',width=3)
 add(role,(264,h),pill)
add('close-circle',(56,56),lambda d,w,h:(d.ellipse((1,1,w-2,h-2),fill='#6e6a86',outline='#15151d',width=3),d.ellipse((5,5,w-6,h-6),fill='#333341',outline='#bab3cf',width=2),d.arc((7,7,w-8,h-8),190,320,fill='#8b859f',width=2)))
add('cyan-button',(52,48),lambda d,w,h:(rr(d,(1,2,w-2,h-1),'#215864',7,w=3),rr(d,(2,1,w-3,h-8),'#02bbcf',6,w=3),d.line((8,5,w-9,5),fill='#9ff5ed',width=3),d.line((8,h-11,w-9,h-11),fill='#018b9e',width=2)))
def log(d,w,h):
 rr(d,(1,1,w-2,h-2),'#120e18',5,w=3);rr(d,(3,3,w-4,h-7),'#9636d0',4,w=1);d.rectangle((7,10,w-8,h-15),fill='#f6edf9');d.line((9,4,40,4),fill='#d990fc',width=3);d.line((11,h-10,w-12,h-10),fill='#77229e',width=2);d.line((40,5,70,5),fill='#b360ec',width=2)
add('adventure-log',(488,100),log)
def stats(d,w,h):
 d.rectangle((0,0,w-1,h-1),fill='#94634e');d.line((0,0,w-1,0),fill='#3a2925',width=3);d.line((0,4,w-1,4),fill='#ba8b66',width=2)
 for x,ww in [(8,140),(156,140),(306,86),(402,94)]:rr(d,(x,15,x+ww-1,47),'#211613',14,o='#3e241c',w=2)
 rr(d,(160,18,278,45),'#e63e69',10,o='#6b2539',w=1);d.line((169,20,268,20),fill='#fa7298',width=2)
add('adventure-stats',(504,60),stats)
add('adventure-day',(288,38),lambda d,w,h:(rr(d,(1,1,w-2,h-2),'#4b3920',18,o='#977533',w=2),d.arc((4,4,w-5,h-4),190,340,fill='#ac8846',width=1)))
add('adventure-log-compact',(488,74),log)
m.write_text(json.dumps(data,ensure_ascii=False,indent=2));print('v002 assets',len(data['assets']),'all <=300000B')
