import runpy
from pathlib import Path
p=Path(__file__).with_name('pillow_svg.py')
render=runpy.run_path(str(p))['render_svg']
im=render('<svg width="30" height="20"><defs><linearGradient id="g"><stop stop-color="#f00"/><stop offset="1" stop-color="#00f"/></linearGradient></defs><rect x="3" y="3" width="24" height="14" rx="4" fill="url(#g)"/></svg>')
assert im.mode=='RGBA' and im.size==(30,20)
assert im.getpixel((0,0))[3]==0
assert im.getpixel((5,10))[0]>im.getpixel((25,10))[0]
assert im.getpixel((5,10))[2]<im.getpixel((25,10))[2]
print('RGBA, transparent corners, curved box, gradient endpoints: PASS')
im=render('<svg width="50" height="50"><ellipse cx="25" cy="25" rx="18" ry="5" transform="rotate(90 25 25)" fill="#fff"/></svg>')
assert im.getpixel((25,10))[3]>250 and im.getpixel((10,25))[3]<10
print('Ellipse rotation: PASS')
a=render('<svg width="50" height="30"><path d="M2 15q10 -15 20 0t20 0h-40Z" fill="#fff"/></svg>')
b=render('<svg width="50" height="30"><path d="M2 15Q12 0 22 15Q32 30 42 15H2Z" fill="#fff"/></svg>')
assert a.tobytes()==b.tobytes()
print('Relative q/t/h matches explicit equivalent geometry: PASS')
