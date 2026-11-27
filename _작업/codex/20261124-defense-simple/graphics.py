from pathlib import Path
from PIL import Image, ImageDraw
from math import cos,sin,pi
root=Path(__file__).parent/'art'
DARK='#263345'; WHITE='#fbfdff'; MID='#b9cad6'
def card(key,paint,finish=False):
 im=Image.new('RGBA',(128,128));d=ImageDraw.Draw(im)
 d.rounded_rectangle((4,4,123,123),23,fill=DARK if finish else '#eaf0f4',outline='#657b8c',width=3)
 a=WHITE if finish else DARK
 stroke=lambda p,w=6:d.line(p,fill=a,width=w,joint='curve')
 ring=lambda p,w=5:d.ellipse(p,outline=a,width=w)
 solid=lambda p:d.polygon(p,fill=a)
 arc=lambda p,start,end,w=5:d.arc(p,start,end,fill=a,width=w)
 dot=lambda x,y,w=5:d.ellipse((x-w,y-w,x+w,y+w),fill=a)
 def arrow(x,y,dx,dy):
  dx,dy=dx/((dx*dx+dy*dy)**.5),dy/((dx*dx+dy*dy)**.5)
  tx,ty=x+25*dx,y+25*dy
  stroke([(x,y),(tx,ty)],5)
  solid([(tx+5*dx,ty+5*dy),(tx-9*dx+7*dy,ty-9*dy-7*dx),(tx-9*dx-7*dy,ty-9*dy+7*dx)])
 paint(stroke,ring,solid,arc,dot,arrow)
 im.save(root/(key+'.png'))
bolt=[(71,19),(41,62),(60,62),(49,107),(86,51),(67,51)]
flake=lambda s,r,p,a,d,v:[s([(64-32*cos(k*pi/3),64-32*sin(k*pi/3)),(64+32*cos(k*pi/3),64+32*sin(k*pi/3))],6) for k in range(3)] or None
def ice(s,r,p,a,d,v):
 flake(s,r,p,a,d,v)
 for k in range(6):
  t=k*pi/3; x=64+23*cos(t);y=64+23*sin(t)
  for j in (-.7,.7):
   s([(x,y),(x+12*cos(t+pi+j),y+12*sin(t+pi+j))],4)
card('homing_burst',lambda s,r,p,a,d,v:(r((45,30,98,83)),d(72,57),v(24,86,39,-35),s([(25,94),(36,87)],4)))
card('ice_homing',ice)
card('frost_split',lambda s,r,p,a,d,v:(v(32,66,1,0),d(53,66),v(57,63,1,-1),v(57,67,1,0),v(57,71,1,1)))
card('fire_explosive',lambda s,r,p,a,d,v:(a((27,69,102,103),0,360,5),p([(48,83),(39,66),(50,48),(53,58),(72,25),(82,48),(73,62),(88,57),(84,83)])))
card('fire_arc',lambda s,r,p,a,d,v:(a((25,31,96,99),180,319,6),v(79,49,11,15),d(31,88),s([(86,96),(106,96)],6)))
card('chain_lightning',lambda s,r,p,a,d,v:(p(bolt),d(27,65),d(101,54),s([(28,65),(39,65)],4),s([(88,54),(100,54)],4)))
card('pierce_burst',lambda s,r,p,a,d,v:(r((48,49,79,80)),r((76,49,106,80)),v(21,65,1,0),s([(42,65),(111,65)],4)))
card('bounce_pulse',lambda s,r,p,a,d,v:(s([(29,81),(64,43),(99,75)],5),d(29,81,10),d(64,43,10),d(99,75,10)))
card('laser_beam',lambda s,r,p,a,d,v:(s([(26,77),(100,51)],14),s([(25,56),(99,30)],4),s([(33,97),(104,72)],4)))
card('spawn_slow',lambda s,r,p,a,d,v:(r((25,38,102,91),5),r((37,46,90,84),4),s([(64,54),(64,65),(74,70)],4)))
card('sweep_arc',lambda s,r,p,a,d,v:(a((35,35,93,93),25,333,6),v(34,58,-2,-2),v(80,44,2,-1),v(78,83,2,2)))
card('ground_slam',lambda s,r,p,a,d,v:(v(64,25,0,1),s([(22,93),(43,93),(55,77),(64,95),(76,76),(86,93),(106,93)],6)))
card('building_barrier',lambda s,r,p,a,d,v:(s([(64,22),(95,35),(91,68),(77,91),(64,103),(51,91),(37,68),(33,35),(64,22)],6),s([(49,72),(49,61),(64,49),(79,61),(79,72),(49,72)],5)))
card('ice_wave',lambda s,r,p,a,d,v:(s([(24,84),(39,74),(51,82),(65,74),(81,83),(104,74)],5),s([(24,97),(39,87),(51,95),(65,87),(81,96),(104,87)],5),s([(64,25),(64,65)],5),s([(48,35),(80,55)],5),s([(49,55),(80,35)],5)))
card('electric_discharge',lambda s,r,p,a,d,v:(p(bolt),v(37,40,-1,-1),v(89,40,1,-1),v(33,83,-1,1),v(91,79,1,1)))
im=Image.new('RGBA',(680,395));d=ImageDraw.Draw(im)
for p in [[(320,38),(309,105),(345,145),(285,196),(324,231),(282,309)],[(321,231),(372,245),(386,301)],[(309,105),(265,113),(234,152)],[(500,107),(461,156),(485,206),(437,258)],[(170,147),(186,181),(166,239),(195,275)]]:
 d.line(p,fill=(36,34,35,205),width=10,joint='curve')
 d.line([(x+4,y+2) for x,y in p],fill=(255,255,255,125),width=2,joint='curve')
im.save(root/'damage.png')
im=Image.new('RGBA',(680,395));d=ImageDraw.Draw(im)
for x,y,r in [(100,90,18),(213,55,11),(557,109,18),(452,55,10),(604,186,12),(134,177,9)]:
 d.polygon([(x,y-r),(x+r*.20,y-r*.20),(x+r,y),(x+r*.20,y+r*.2),(x,y+r),(x-r*.2,y+r*.2),(x-r,y),(x-r*.2,y-r*.2)],fill=(255,255,255,230))
im.save(root/'guard-glow.png')
