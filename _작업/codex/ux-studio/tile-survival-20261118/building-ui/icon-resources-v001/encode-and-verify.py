from pathlib import Path
from PIL import Image, ImageDraw
import csv, hashlib, shutil, xml.etree.ElementTree as ET

ROOT = Path.cwd()
AUTHOR = ROOT / "samples/tile-survival/ui-studio/assets/authoring/building-icons-v001"
STAGE = ROOT / "src/tools/uxStudio/assets/import-staging/tile-survival-building-icons-v001"
WORK = ROOT / "_작업/codex/ux-studio/tile-survival-20261118/building-ui/icon-resources-v001"
reference = "_작업/codex/ux-studio/tile-survival-20261118/video-b/references/TSV03-08.jpg"
names = ["check-green","arrow-right-green","medal-arrow-up","medal-survivor-up","medal-sofa","lock-navy-silver","metal-ingot","tomato","powerplant-requirement","medal-power-fist"]
rows=[]
for name in names:
    svg = AUTHOR / f"{name}.svg"
    tree = ET.parse(svg)
    assert tree.getroot().attrib["viewBox"] == "0 0 128 128"
    assert all(node.tag.rsplit("}",1)[-1] not in {"text","image","filter","foreignObject"} for node in tree.iter())
    im = Image.open(AUTHOR / f"{name}.png")
    assert im.mode == "RGBA" and im.size == (128,128)
    a = im.getchannel("A")
    bbox = a.getbbox()
    assert a.getextrema() == (0,255)
    assert all(a.getpixel((x,y))==0 for x in range(128) for y in [0,127])
    assert all(a.getpixel((x,y))==0 for y in range(128) for x in [0,127])
    assert 16 <= bbox[0] and 16 <= bbox[1] and bbox[2] <= 112 and bbox[3] <= 112, (name,bbox)
    webp = AUTHOR / f"{name}.webp"
    im.save(webp, "WEBP", lossless=True, quality=100, method=6, exact=True)
    decoded = Image.open(webp)
    assert decoded.mode == "RGBA" and decoded.size == (128,128)
    assert decoded.tobytes() == im.tobytes()
    for ext in ["svg","png","webp"]:
        f=AUTHOR / f"{name}.{ext}"
        dst=STAGE/f.name
        shutil.copyfile(f,dst)
        data=f.read_bytes()
        assert data==dst.read_bytes()
        assert len(data)<=300000
        sha=hashlib.sha256(data).hexdigest()
        rows.append(dict(name=name,format=ext,width=128,height=128,mode="RGBA" if ext!="svg" else "SVG",alpha_min=0,alpha_max=255,tight_bbox_xyxy=",".join(map(str,bbox)),outer_border="transparent",bytes=len(data),sha256=sha,authoring=str(f.relative_to(ROOT)),staging=str(dst.relative_to(ROOT)),runtime_url="/ui-studio/source/assets/import-staging/tile-survival-building-icons-v001/"+f.name,authoring_staging_match="true",reference=reference,source_method="existing power-fist SVG path + new medal geometry" if name=="medal-power-fist" else "new hand-authored SVG geometry",screenshot_pixels_reused=0,native_assembly=0))
with (WORK/"manifest.csv").open("w",newline="") as f:
    out=csv.DictWriter(f,fieldnames=list(rows[0]))
    out.writeheader();out.writerows(rows)
canvas=Image.new("RGB",(3*220,4*180),"#d6e6ec")
d=ImageDraw.Draw(canvas)
for index,name in enumerate(names):
    x=(index%3)*220; y=(index//3)*180
    for yy in range(y,y+150,12):
        for xx in range(x,x+220,12):
            color="#a8bec8" if ((xx-x)//12+(yy-y)//12)%2 else "#d6e6ec"
            d.rectangle((xx,yy,xx+11,yy+11),fill=color)
    icon=Image.open(AUTHOR/f"{name}.png")
    canvas.paste(icon,(x+46,y+11),icon)
    d.text((x+8,y+154),name,fill="#1a2e41")
canvas.save(WORK/"qa-contact-sheet.png")
reuse=["wood-log","power-fist","population-hat","lock-white","diamond-purple"]
with (WORK/"reuse.csv").open("w",newline="") as f:
    out=csv.DictWriter(f,fieldnames=["name","path","runtime_url","bytes","sha256","action"])
    out.writeheader()
    for name in reuse:
        p=ROOT/"src/tools/uxStudio/assets/import-staging/tile-survival-geometry"/f"{name}.webp"
        assert p.is_file()
        out.writerow(dict(name=name,path=str(p.relative_to(ROOT)),runtime_url="/ui-studio/source/assets/import-staging/tile-survival-geometry/"+p.name,bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest(),action="reuse existing; no copy; no edit"))
summary=[
"# 건물 UI 신규 기하 아이콘 v001",
"",
"- 작성: codex(단이), 제안(검수 대기)",
"- 실제 열람 원본: "+reference+" (온실 업그레이드 보상·조건 화면)",
"- SVG 직접 작성 → 기존 macOS AppKit으로 PNG 렌더 → 기존 Pillow로 lossless WebP 인코딩·검증. 새 설치 0.",
"- 원본 영상 픽셀 재사용 0, 문자·숫자·NEW 내장 0, 외부 drop-shadow 0, native 조립 0.",
"- 각 아이콘: 128×128. RGBA PNG/WebP 모두 alpha 0..255, 가장자리 완전 투명, 알파 tight bbox 16..112 범위 안.",
"- 10종 × SVG/PNG/WebP = 30파일. authoring/staging 각 형식의 바이트 및 SHA-256 일치. 각 파일 ≤300,000 bytes.",
"- manifest.csv: 30파일 경로·RGBA·tight bbox·용량·SHA-256. reuse.csv: 기존 5종 읽기 전용 재사용 경로.",
"- powerplant-requirement: 저해상도 발전소 조건을 위한 단순 아이소메트릭 기하 모티프 새 시안입니다. 건물 외형 확정값이 아닙니다.",
"- 별도 NEW 텍스트와 수치·조건명은 UI 텍스트로 조립해야 합니다.",
"",
"| 이름 | PNG alpha tight bbox (x0,y0,x1,y1; right/bottom exclusive) | WebP bytes |",
"|---|---|---|"
]
for name in names:
    r=next(r for r in rows if r["name"]==name and r["format"]=="webp")
    summary.append(f'| {name} | {r["tight_bbox_xyxy"]} | {r["bytes"]} |')
summary+=["","검증: python3 "+str((WORK/"encode-and-verify.py").relative_to(ROOT)),"", "미수행: 브라우저·서버·실제 UI 조립·UI 클릭 검수. 기존 파일/공통 JS/설계 JSON/공용 STATUS·보고 수정 0."]
(WORK/"manifest.md").write_text("\n".join(summary)+"\n")
print(f"PASS: {len(names)} icons; {len(rows)} mirrored SVG/PNG/WebP files; RGBA+alpha+border+bbox+WebP pixel equality+sha+size; native assembly 0")
for row in rows:
    if row["format"]=="webp": print(row["name"],row["tight_bbox_xyxy"],row["bytes"],row["sha256"])
