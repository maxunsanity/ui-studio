"""Add reference-observed geometry without rewriting the original nineteen files."""
from pathlib import Path
import runpy,json,hashlib,shutil,sys
from PIL import Image
P=Path('/Users/max/projest_max/ui-studio');W=Path(__file__).parent
A=P/'samples/monopoly-go/ui-studio/assets/authoring/unique-frames32/geometry'
D=P/'samples/monopoly-go/ui-studio/assets/production/unique-frames32/geometry'
S=P/'src/tools/uxStudio/assets/import-staging/unique-frames32/geometry'
render=runpy.run_path(str(W/'pillow_svg.py'))['render_svg']

def put(n,w,h,body):
    rows=json.loads((A/'manifest.json').read_text())
    assert n not in {r['name'] for r in rows},n
    for base,ext in [(A,'svg'),(A,'png'),(D,'webp'),(S,'webp')]:assert not (base/(n+'.'+ext)).exists()
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{body}</svg>'
    (A/(n+'.svg')).write_text(svg);im=render(svg);im.save(A/(n+'.png'))
    im.save(D/(n+'.webp'),'WEBP',lossless=True,exact=True,method=6)
    shutil.copy2(D/(n+'.webp'),S/(n+'.webp'));b=(D/(n+'.webp')).read_bytes();assert len(b)<=300000
    row={'name':n,'path':'/ui-studio/source/assets/import-staging/unique-frames32/geometry/'+n+'.webp','sha':hashlib.sha256(b).hexdigest(),'sourceSize':[w,h],'bytes':len(b),'slices':None,'edges':None}
    rows.append(row);(A/'manifest.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2));print(json.dumps(row))

if sys.argv[1]=='rays':
    put('showroom-warm-rays-v001',386,531,'''
    <defs><radialGradient id="halo"><stop stop-color="#fff8d8" stop-opacity=".39"/><stop offset=".27" stop-color="#fff1bf" stop-opacity=".25"/><stop offset=".58" stop-color="#ffe5a2" stop-opacity=".11"/><stop offset=".84" stop-color="#ffdb8d" stop-opacity=".025"/><stop offset="1" stop-color="#ffdf9a" stop-opacity="0"/></radialGradient><linearGradient id="up" x2="0" y2="1"><stop stop-color="#fff1bd" stop-opacity="0"/><stop offset=".38" stop-color="#fff1bd" stop-opacity=".052"/><stop offset=".8" stop-color="#fff1bd" stop-opacity=".066"/><stop offset="1" stop-color="#fff1bd" stop-opacity="0"/></linearGradient><linearGradient id="down" x2="0" y2="1"><stop stop-color="#fff1bd" stop-opacity="0"/><stop offset=".22" stop-color="#fff1bd" stop-opacity=".055"/><stop offset=".62" stop-color="#fff1bd" stop-opacity=".045"/><stop offset="1" stop-color="#fff1bd" stop-opacity="0"/></linearGradient></defs>
    <ellipse cx="193" cy="266" rx="193" ry="266" fill="url(#halo)"/>
    <path d="M193 280L57 4L118 0Z" fill="url(#up)"/>
    <path d="M193 280L158 0L194 0Z" fill="url(#up)"/>
    <path d="M193 280L252 0L302 13Z" fill="url(#up)"/>
    <path d="M193 280L331 26L365 67Z" fill="url(#up)"/>
    <path d="M193 280L9 94L0 139Z" fill="url(#up)"/>
    <path d="M193 280L386 153L386 206Z" fill="url(#up)"/>
    <path d="M193 280L19 465L62 506Z" fill="url(#down)"/>
    <path d="M193 280L104 531L151 531Z" fill="url(#down)"/>
    <path d="M193 280L206 531L237 531Z" fill="url(#down)"/>
    <path d="M193 280L287 516L332 488Z" fill="url(#down)"/>
    <path d="M193 280L370 420L386 371Z" fill="url(#down)"/>
    <ellipse cx="193" cy="284" rx="132" ry="179" fill="url(#halo)" opacity=".42"/>
    ''')
elif sys.argv[1]=='class-icons':
    put('class-portrait-benefit-v001',85,100,'''
    <defs><linearGradient id="green" x2="0" y2="1"><stop stop-color="#50f21a"/><stop offset=".4" stop-color="#06d705"/><stop offset="1" stop-color="#05a900"/></linearGradient><linearGradient id="card" x2="0" y2="1"><stop stop-color="#baf0e1"/><stop offset=".65" stop-color="#78e3d9"/><stop offset="1" stop-color="#4abfb9"/></linearGradient><linearGradient id="skin" x2="0" y2="1"><stop stop-color="#e2ad79"/><stop offset="1" stop-color="#ca8b64"/></linearGradient></defs>
    <path d="M27 17L30 7Q32 2 39 4L76 7Q82 8 80 17L70 85L20 81Z" fill="url(#green)" stroke="#205c2b" stroke-width="2.1"/>
    <path d="M35 7L75 10" fill="none" stroke="#9cf775" stroke-width="1.5"/>
    <ellipse cx="55" cy="11" rx="1.7" ry="2.6" fill="#1c6239"/>
    <ellipse cx="55.4" cy="10.3" rx=".65" ry="1.1" fill="#d9f8d0"/>
    <path d="M25 17L76 20Q83 21 80 33L70 91Q69 99 61 97L10 90Q3 89 5 79L15 31Q18 17 25 17Z" fill="url(#card)" stroke="#176369" stroke-width="2.2"/>
    <path d="M25 20L76 23Q80 25 77 34L68 88" fill="none" stroke="#b5f5e9" stroke-width="1.7"/>
    <path d="M28 31L65 35Q73 36 71 44L65 78Q64 84 57 82L19 77Q14 76 16 69L22 39Q23 31 28 31Z" fill="#c8eced" stroke="#387b7d" stroke-width="1.8"/>
    <path d="M31 43Q31 33 39 31Q48 25 54 35Q58 38 56 46Q61 49 59 56Q55 64 44 62Q32 64 28 57Q26 51 31 43Z" fill="#4a4c59"/>
    <path d="M34 37Q35 31 40 31" fill="none" stroke="#b7b4c9" stroke-width="2.3" stroke-linecap="round"/>
    <path d="M36 59L53 61L57 75L33 74Z" fill="#8fcbe9"/>
    <path d="M38 59L42 61L41 75L31 73L29 67L21 70L19 65L32 60Z" fill="#8871ce"/>
    <path d="M49 60L55 61L60 54L64 49L67 52L60 64L58 70L50 67L51 76L44 75L45 63Z" fill="#8c73cf"/>
    <path d="M20 65L17 63L15 64L18 67L15 66L14 68L19 71L23 69Z" fill="#d69b74"/>
    <path d="M62 52L64 44Q66 41 67 44L67 48L69 46L70 48L67 54Z" fill="#d59b75"/>
    <path d="M66 46L67 36" fill="none" stroke="#827379" stroke-width="1.2"/>
    <path d="M67 31L68.6 35L72.7 36L69 38L68.5 42L66 39L62 39L64 35.7L63.7 32.4Z" fill="#d1e264"/>
    <path d="M41 56L46 56L47 62L43 65L40 61Z" fill="#c58e68"/>
    <path d="M35 40Q36 33 44 35Q50 34 53 41L54 49Q54 57 46 59Q37 58 34 51Z" fill="url(#skin)"/>
    <path d="M34 44Q33 36 39 34Q44 27 49 35Q49 40 55 40Q56 43 52 44Q45 41 44 36Q40 36 38 42Z" fill="#53535f"/>
    <path d="M38 48Q40 46 42 48" fill="none" stroke="#624e48" stroke-width="1.1" stroke-linecap="round"/>
    <ellipse cx="48" cy="46.5" rx="1" ry="1.4" fill="#5a4241"/>
    <path d="M44 48L43 51L45 51" fill="none" stroke="#b87861" stroke-width=".8" stroke-linecap="round"/>
    <path d="M42 54Q45 52.5 48 53.5" fill="none" stroke="#eac8b4" stroke-width="1.1" stroke-linecap="round"/>
    <ellipse cx="43.5" cy="62" rx="1.5" ry="1.8" fill="#e6a347" stroke="#b77b41" stroke-width=".6"/>
    ''')
    put('class-rail-coin-v001',64,64,'''
    <defs><radialGradient id="coin"><stop stop-color="#fbc34d"/><stop offset=".7" stop-color="#ee9b24"/><stop offset="1" stop-color="#df8216"/></radialGradient><linearGradient id="gold" x2="0" y2="1"><stop stop-color="#fff6a6"/><stop offset=".45" stop-color="#ffd54b"/><stop offset="1" stop-color="#f0b130"/></linearGradient></defs>
    <circle cx="32" cy="32" r="29" fill="#813012" stroke="#5b1c0b" stroke-width="2"/>
    <circle cx="32" cy="31" r="25" fill="url(#gold)"/>
    <circle cx="32" cy="31" r="21" fill="url(#coin)" stroke="#eabd4c" stroke-width="1.2"/>
    <path d="M17 17Q29 7 42 15" fill="none" stroke="#fff6b1" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M18 21L23 18L27 23L25 28H39L40 23L46 20L49 23L46 28H44V36L47 39L45 42H18L17 38L21 34V27L18 25Z" fill="#ffe477"/>
    <path d="M24 28H40V34H24Z" fill="#ffe988"/>
    <circle cx="23" cy="43" r="3" fill="#ffe477"/><circle cx="33" cy="43" r="3" fill="#ffe477"/><circle cx="43" cy="43" r="3" fill="#ffe477"/>
    <path d="M26 24H38" fill="none" stroke="#f9c753" stroke-width="1.1"/>
    ''')
    put('class-trophy-v001',64,64,'''
    <defs><linearGradient id="blue" x2="0" y2="1"><stop stop-color="#069ce3"/><stop offset=".6" stop-color="#0084d3"/><stop offset="1" stop-color="#0062ac"/></linearGradient><linearGradient id="cup" x2="0" y2="1"><stop stop-color="#fff39a"/><stop offset=".2" stop-color="#ffdb45"/><stop offset=".66" stop-color="#f6ad00"/><stop offset="1" stop-color="#e49000"/></linearGradient><linearGradient id="stem" x2="0" y2="1"><stop stop-color="#ffe767"/><stop offset="1" stop-color="#ffbf12"/></linearGradient></defs>
    <circle cx="32" cy="32" r="29" fill="url(#blue)"/>
    <path d="M9 44Q31 61 55 43Q51 58 32 60Q15 58 9 44Z" fill="#005cb0" opacity=".45"/>
    <path d="M19 22Q7 18 12 29Q14 35 24 35 M45 22Q57 18 52 29Q50 35 40 35" fill="none" stroke="#ad8108" stroke-width="5.8" stroke-linecap="round"/>
    <path d="M19 21Q8 18 13 28Q16 32 23 32 M45 21Q56 18 51 28Q48 32 41 32" fill="none" stroke="#ffe864" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M28 36H36L35 45H29Z" fill="url(#stem)" stroke="#a7831a" stroke-width=".9"/>
    <path d="M25 44H39L42 49Q32 53 22 49Z" fill="url(#stem)" stroke="#b38a14" stroke-width="1.1"/>
    <ellipse cx="32" cy="48" rx="8" ry="2" fill="#ffe56f"/>
    <path d="M18 19Q32 15 46 19L43 30Q40 39 32 40Q23 39 21 30Z" fill="url(#cup)" stroke="#b79524" stroke-width="1"/>
    <ellipse cx="32" cy="19" rx="14" ry="4" fill="#ffe987" stroke="#dfb83e" stroke-width="1"/>
    <ellipse cx="32" cy="19" rx="10.5" ry="1.9" fill="#f8bf30"/>
    <path d="M24 28L28 25L32 30L36 25L40 29L37 35L32 33L27 35Z" fill="#ef9b06"/>
    <path d="M19 11L20 16L25 18L20 20L18 26L17 20L12 18L17 16Z" fill="#ffffe5"/>
    ''')
elif sys.argv[1]=='details':
    put('class-token-v002',100,110,'''
    <defs><linearGradient id="rim" x2="0" y2="1"><stop stop-color="#e8f7fb"/><stop offset=".35" stop-color="#b7e4f5"/><stop offset=".7" stop-color="#31b6e8"/><stop offset="1" stop-color="#087daf"/></linearGradient><radialGradient id="face"><stop stop-color="#c6e5f1"/><stop offset="1" stop-color="#a8d1e5"/></radialGradient><linearGradient id="lip" x2="0" y2="1"><stop stop-color="#a3c4d8"/><stop offset="1" stop-color="#0375a6"/></linearGradient></defs>
    <ellipse cx="50" cy="56" rx="44" ry="47" fill="url(#rim)" stroke="#719eb9" stroke-width="1.5"/>
    <ellipse cx="50" cy="53" rx="40" ry="43" fill="none" stroke="#e6f7fd" stroke-width="2.2"/>
    <ellipse cx="50" cy="54" rx="35" ry="37.5" fill="url(#face)" stroke="#6496b6" stroke-width="2"/>
    <path d="M18 71C30 98 69 100 84 74Q81 94 62 100Q29 106 18 78Z" fill="url(#lip)" opacity=".68"/>
    <path d="M31 91Q49 83 66 91L72 95Q50 102 28 95Z" fill="#6aa4c2"/>
    <path d="M30 53Q28 61 28 71C20 73 23 86 32 86Q50 103 68 85Q76 72 71 55Z" fill="#538bad"/>
    <path d="M34 42L32 28Q47 16 63 27L65 42Q50 36 34 42Z" fill="#548caa"/>
    <path d="M34 40Q49 34 65 40L65 46Q50 41 34 47Z" fill="#b9dce9"/>
    <path d="M28 47Q47 49 70 45Q78 43 77 50Q74 58 66 61H35Q28 57 27 52Q25 49 28 47Z" fill="#568fac"/>
    <path d="M33 70Q39 66 44 69Q49 65 53 69Q61 65 67 69C68 77 61 84 54 80Q49 77 44 81C37 84 31 77 33 70Z" fill="#b9ddec"/>
    <path d="M36 72Q40 70 44 72Q49 68 53 72Q60 69 64 72" fill="none" stroke="#d1eaf3" stroke-width="1" opacity=".45"/>
    ''')
    put('bean-open-chest-v002',140,120,'''
    <defs><linearGradient id="silver" x2="0" y2="1"><stop stop-color="#edf8f8"/><stop offset=".38" stop-color="#a9bdc0"/><stop offset=".65" stop-color="#ffffff"/><stop offset="1" stop-color="#9bafb0"/></linearGradient><linearGradient id="front" x2="0" y2="1"><stop stop-color="#32c4df"/><stop offset="1" stop-color="#0695b7"/></linearGradient><linearGradient id="bag" x2="0" y2="1"><stop stop-color="#ffffff"/><stop offset=".75" stop-color="#f3f9f9"/><stop offset="1" stop-color="#bacacd"/></linearGradient></defs>
    <path d="M34 57L49 16Q50 10 57 10L119 4Q126 3 130 9L135 18L119 65Z" fill="#567075" stroke="#273f43" stroke-width="3.5"/>
    <path d="M40 54L54 18L120 10L128 18L113 59Z" fill="url(#silver)" stroke="#90a8ad" stroke-width="1"/>
    <path d="M47 47L59 24L117 17L121 22L108 51Z" fill="#1ab6d4" stroke="#528a9a" stroke-width="2"/>
    <path d="M59 24L117 17" fill="none" stroke="#e0f9fd" stroke-width="1.7"/>
    <path d="M123 20L129 23L125 36L118 32ZM116 40L123 43L119 55L112 52Z" fill="#e0eff1" stroke="#9cb8bf" stroke-width="1"/>
    <path d="M10 64L62 45L121 61L72 85Z" fill="#234d59" stroke="#3b5559" stroke-width="3"/>
    <path d="M17 65L62 50L111 62L71 78Z" fill="#193e4c"/>
    <path d="M63 69Q54 65 59 54L64 44L80 43L85 53Q92 61 85 74L73 79Z" fill="url(#bag)" stroke="#94a8ac" stroke-width="1.5"/>
    <path d="M62 42Q70 35 80 39L83 46Q72 51 62 47Z" fill="#bdcbcd" stroke="#66868e" stroke-width="1.5"/>
    <path d="M66 42Q72 39 79 42L78 45Q71 47 66 44Z" fill="#f7ffff"/>
    <path d="M72 51Q67 60 68 70M78 53Q81 63 78 74" fill="none" stroke="#c0d0d1" stroke-width="1.4"/>
    <path d="M81 55Q89 56 95 65L88 74L81 71Z" fill="#f2f8f7" stroke="#adbdbe" stroke-width="1"/>
    <path d="M28 69Q26 61 33 57L46 57Q52 62 49 75Z" fill="url(#bag)" stroke="#90a9ae" stroke-width="1.4"/>
    <ellipse cx="39" cy="57" rx="10" ry="4" fill="#c3d4d6" stroke="#758e93" stroke-width="1.4"/>
    <path d="M9 67L72 82L73 113L13 101Z" fill="url(#silver)" stroke="#29474e" stroke-width="3.5"/>
    <path d="M73 82L121 61L124 91L74 114Z" fill="url(#silver)" stroke="#29474e" stroke-width="3.5"/>
    <path d="M17 75L65 86L65 104L19 95Z" fill="url(#front)" stroke="#4d8995" stroke-width="1.6"/>
    <path d="M80 85L115 70L116 88L80 104Z" fill="#14acd0" stroke="#4a8a99" stroke-width="1.5"/>
    <path d="M10 67L72 82L121 61" fill="none" stroke="#edf9fa" stroke-width="4.5"/>
    <path d="M72 84L73 110M15 99L72 111L122 90" fill="none" stroke="#d8eeee" stroke-width="2"/>
    <path d="M39 76L51 79L50 91L42 94L37 88Z" fill="url(#silver)" stroke="#6c969f" stroke-width="1.3"/>
    <ellipse cx="44" cy="85" rx="2.5" ry="3" fill="#448392"/>
    <path d="M94 80L108 74L109 82L95 88Z" fill="url(#silver)" stroke="#6d9ba5" stroke-width="1"/>
    <path d="M99 80L103 78L104 83L100 84Z" fill="#73a1af"/>
    ''')
