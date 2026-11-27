import math
def model():
 d=14.;f=1400.;h=24*(d-1)/f;p=2*(d-1)/f;k=182*(d*d-1)/(2*f)
 return {'distance':d,'focal':f,'eyeHeight':k+h,'horizon':10-f*k/(d+1),'cx':115.,'height':h,'press':p,'canvas':[230,220]}
def project(point,c):
 x,y,z=point;depth=c['distance']+y
 if depth<=0:raise ValueError('point must be in front of camera')
 return (c['cx']+c['focal']*x/depth,c['horizon']+c['focal']*(c['eyeHeight']-z)/depth)
def vertices(c,z):
 return {k:project((x,y,z),c) for k,(x,y) in {'far':(0,1),'left':(-1,0),'right':(1,0),'near':(0,-1)}.items()}
def vanishing_points(c):
 return ((c['cx']-c['focal'],c['horizon']),(c['cx']+c['focal'],c['horizon']))
def world_ring(inset=0):
 a=math.sqrt(.5)-inset;r=.10-inset;points=[]
 if r<=0:raise ValueError('invalid bevel inset')
 for cx,cy,start in [(a-r,a-r,0),(-a+r,a-r,90),(-a+r,-a+r,180),(a-r,-a+r,270)]:
  for i in range(33):
   ang=math.radians(start+i*90/32);x=cx+r*math.cos(ang);y=cy+r*math.sin(ang)
   points.append(((x-y)/math.sqrt(2),(x+y)/math.sqrt(2)))
 return points
def ring(c,z,inset=0):
 return [project((x,y,z),c) for x,y in world_ring(inset)]
