import unittest, math
from projection import project, model, vertices, vanishing_points, ring
class ProjectionChecks(unittest.TestCase):
 def test_far_edges_shorter_and_positive_depth(self):
  c=model()
  for z in [c['height'],c['height']-c['press']]:
   p=vertices(c,z); dist=lambda a,b:math.dist(p[a],p[b])
   self.assertLess(dist('far','left'),dist('near','left'))
   self.assertLess(dist('far','right'),dist('near','right'))
   self.assertLess(p['left'][1]-p['far'][1],p['near'][1]-p['left'][1])
 def test_all_parallel_edges_meet_the_same_two_horizon_points(self):
  c=model();vl,vr=vanishing_points(c)
  def residual(a,b,v):
   return abs((b[0]-a[0])*(v[1]-a[1])-(b[1]-a[1])*(v[0]-a[0]))/math.dist(a,b)
  for z in [0,c['height'],c['height']-c['press']]:
   p=vertices(c,z)
   for a,b,v in [('far','left',vr),('right','near',vr),('far','right',vl),('left','near',vl)]:
    self.assertLess(residual(p[a],p[b],v),1e-8)
 def test_small_press_has_same_x_and_fixed_base(self):
  c=model();base=vertices(c,0); normal=ring(c,c['height']);pressed=ring(c,c['height']-c['press'])
  dy=[q[1]-p[1] for p,q in zip(normal,pressed)]
  self.assertGreater(min(dy),0);self.assertLessEqual(max(dy),2.000001)
  for p,q in zip(normal,pressed):self.assertAlmostEqual(p[0],q[0],places=10)
  self.assertEqual(vertices(c,0),base)
  self.assertLess(c['press']/c['height'],.1)
 def test_vertical_correspondences_and_symmetric_projection(self):
  c=model();v=vertices(c,c['height']);b=vertices(c,0)
  for k in v:self.assertAlmostEqual(v[k][0],b[k][0],places=10)
  self.assertAlmostEqual(v['left'][0]+v['right'][0],2*c['cx'])
  self.assertAlmostEqual(v['left'][1],v['right'][1])
 def test_projection_rejects_points_on_or_behind_camera(self):
  c=model()
  for y in [-c['distance'],-c['distance']-1]:
   with self.assertRaises(ValueError):project((0,y,0),c)
if __name__=='__main__':unittest.main(verbosity=2)
