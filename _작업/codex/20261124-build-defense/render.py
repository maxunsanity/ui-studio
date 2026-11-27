import bpy, json, sys
from mathutils import Vector
from pathlib import Path
root=Path('/Users/max/projest_max/kpopmonsters/data/res/facility_growth_blender_v01')
out=Path(sys.argv[-1])
ids=['production','hq','vocal','dance','rap','fanshop','broadcast','visual']
for fid in ids+['dance-up','dance-arena']:
 bpy.ops.wm.read_factory_settings(use_empty=True)
 fid0=fid.split('-')[0]
 for slot,level,offset in [('main',5 if fid=='dance-up' else 4,(0,0,0)),('annex_a',3,(-2.9,0.55,0)),('annex_b',2,(2.5,1.05,0))]:
  old=set(bpy.data.objects)
  bpy.ops.import_scene.gltf(filepath=str(root/'models'/f'{fid0}_{slot}_L{level:02d}.glb'))
  new=set(bpy.data.objects)-old
  for o in new:
   if o.parent not in new: o.location+=Vector(offset)
 for mat in bpy.data.materials:
  for n in mat.node_tree.nodes if mat.use_nodes else []:
   if n.type=='BSDF_PRINCIPLED':
    base=n.inputs['Base Color']
    if not base.is_linked:
     r,g,b,a=base.default_value
     l=.28*r+.55*g+.17*b
     mat.diffuse_color=(l,l,l,a)
 scene=bpy.context.scene
 scene.render.engine='BLENDER_WORKBENCH'
 sh=scene.display.shading
 sh.light='STUDIO';sh.color_type='MATERIAL';sh.show_shadows=True;sh.show_cavity=True;sh.cavity_type='BOTH'
 sh.show_specular_highlight=True
 scene.world=bpy.data.worlds.new('World')
 if fid.endswith('arena'):
  bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.05))
  floor=bpy.data.materials.new('Ground');floor.diffuse_color=(.30,.30,.30,1);bpy.context.object.data.materials.append(floor)
 bpy.ops.object.camera_add(location=(9,-14,11))
 cam=bpy.context.object
 target=Vector((0,0.5,1.2))
 cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler()
 cam.data.type='ORTHO';cam.data.ortho_scale=15 if fid.endswith('arena') else 10
 scene.camera=cam
 scene.render.resolution_x=620 if fid.endswith('arena') else 400
 scene.render.resolution_y=550 if fid.endswith('arena') else 245
 scene.render.resolution_percentage=100
 scene.render.film_transparent=not fid.endswith('arena')
 scene.render.image_settings.file_format='PNG'
 scene.render.filepath=str(out/f'{fid}.png')
 bpy.ops.render.render(write_still=True)
