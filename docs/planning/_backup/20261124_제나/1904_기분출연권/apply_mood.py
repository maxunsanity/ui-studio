# -*- coding: utf-8 -*-
import copy, json, urllib.request, urllib.error
from datetime import datetime, timezone
from pathlib import Path

WIRE = Path("/Users/max/projest_max/kpopmonsters/docs/planning/삼중AI_공용_20260929/산출/기획서/산출_기획서_20261124_출연권대전_와이어프레임.html")
JSON_PATH = Path("/Users/max/projest_max/ui-guideline-israt/ui-studio/designs/kpop-flow-battle.json")
POST_BODY = Path("/Users/max/projest_max/ui-studio/docs/planning/_backup/20261124_제나/1904_기분출연권/post_body.json")
WS = "workspace-cfa517bd-d9e1-40c4-aa1f-576e182500ba"
API = f"http://127.0.0.1:7018/api/ux-studio/project?workspace={WS}&id=kpop-flow-battle"

HEART = {
    "src": "",
    "alt": "mood",
    "fit": "contain",
    "compact": True,
    "assetRef": "sha256-02e0fb4cd6e69ea448208a006e2271ed3b63b42eccfc0becce5c49dbc9e4a2a6.png",
    "sourceSize": [61, 82],
}
TICKET = {
    "src": "",
    "assetRef": "sha256-6222a40a017034dbad09ec8cef52116d3be87e78750d3ae3af51a3c42d258410.png",
    "alt": "period-badge-icon",
    "fit": "contain",
    "sourceSize": [82, 77],
}

def patch_wire():
    t = WIRE.read_text(encoding="utf-8")
    reps = [
        (
            "→ ④ 결과 · 보상(적중 / 방패 막음 / 수비 막음 · 메가) → ⑤ 카드팩(지급 조건 작업전) → ⑥ 보드 복귀 · 자리 비운 동안 공격받음 → ⑦ 소식(제안)",
            "→ ④ 결과(적중 / 방패 막음 / 수비 막음 · 메가) → ⑥ 보드 복귀 · 자리 비운 동안 공격받음 → ⑦ 소식(제안)",
        ),
        (
            "· 돈 = 기본 × 주사위 배수 × (적중 15 / 막힘 7.5) × (메가 3 · 적중 때 2%) · 팬 = 상대 팬 2%(적중) · 상대는 돈 10% 잃음.<br>· <b>정리(시뮬과 다름)</b>: 팬 보상을 결과 화면에 보여 줌 · 방패로 막은 판도 결과 정산(시뮬은 검증에서 걸릴 수 있음) · 막힘 말은 「방패」(봇 방패) / 「수비 몬스」로 나눔 · 자동 굴리기 중에는 멈추지 않고 자동 진행(HUD 남은 결정 8).<br>· <b>제안</b>: 상대 정보 칸에 방패 n / 3 · 기분 % · ⑦ 자리 비운 동안 소식 · 주사위 · 카드팩은 「지급 조건 작업전」(P98).",
            "· 출연권 대전은 보상이 없다. 상대는 돈 10% 잃음(공격자 지급이 아님).<br>· <b>기분</b>: 몬스마다 하나(한 마리 최대 100) · 총 기분 게이지는 그 합(최대 1,000) · 화면에는 몬스별 기분과 총합 게이지를 따로 둠 · 한 판 비용은 출전 몬스마다 10 · 막은 판 차감 합 30 · 35 미만은 제외 · 쉬는 칸 10% 회복.<br>· <b>정리(시뮬과 다름)</b>: 방패로 막은 판도 결과 확인(시뮬은 검증에서 걸릴 수 있음) · 막힘 말은 「방패」(봇 방패) / 「수비 몬스」로 나눔 · 자동 굴리기 중에는 멈추지 않고 자동 진행(HUD 남은 결정 8).<br>· <b>제안</b>: 상대 정보 칸에 방패 n / 3 · 몬스별 기분 · 총 기분 게이지 · ⑦ 자리 비운 동안 소식.",
        ),
        (
            "const rival = (y, shield = 2, mood = 64) => `\n  <div class=\"b\" style=\"left:8px;top:${y}px;width:374px;height:72px;justify-content:flex-start;gap:10px;padding:0 10px 0 28px\">\n    <span class=\"b off\" style=\"position:static;width:52px;height:52px;border-radius:50%;flex:none\">SNS</span>\n    <span style=\"text-align:left;flex:1\"><span class=\"sub\">상대 SNS 프로필</span><br><span class=\"val\" style=\"font-size:15px\">달빛러버</span> <span class=\"sub\">· 문라이트 기획사</span><br><span class=\"pill\">봇 소속사</span></span>\n    <span style=\"text-align:right\"><span class=\"val\">방패 ${shield} / 3</span><br><span class=\"sub\">기분 ${mood}%</span></span></div>`;",
            "const rival = (y, shield = 2) => `\n  <div class=\"b\" style=\"left:8px;top:${y}px;width:374px;height:92px;justify-content:flex-start;gap:10px;padding:0 10px 0 28px\">\n    <span class=\"b off\" style=\"position:static;width:52px;height:52px;border-radius:50%;flex:none\">SNS</span>\n    <span style=\"text-align:left;flex:1\"><span class=\"sub\">상대 SNS 프로필</span><br><span class=\"val\" style=\"font-size:15px\">달빛러버</span> <span class=\"sub\">· 문라이트 기획사</span><br><span class=\"pill\">봇 소속사</span></span>\n    <span style=\"text-align:right\"><span class=\"val\">방패 ${shield} / 3</span><br><span class=\"sub\">총 게이지 260 / 1,000</span><br><span class=\"sub\">몬스별 80 · 70 · 60 · 50 / 100</span></span></div>`;",
        ),
        (
            "  <div class=\"b\" style=\"left:8px;top:58px;width:374px;height:70px;flex-direction:column;align-items:stretch;padding:6px 12px 6px 28px;gap:4px\">\n    <span style=\"display:flex;justify-content:space-between;font-size:12px\"><b>상대 유저 기분 64%</b><b>수비 3 / 4마리</b></span>\n    <span style=\"display:grid;grid-template-columns:repeat(4,1fr);gap:3px\">${[1, 1, 1, 0].map(k => `<span style=\"height:10px;border:1.5px solid var(--ln);border-radius:3px;background:${k ? \"var(--fill)\" : \"var(--dim)\"}\"></span>`).join(\"\")}</span>\n    <span class=\"sub\">구간 하나가 몬스 한 마리예요 · ${step}</span></div>`;",
            "  <div class=\"b\" style=\"left:8px;top:58px;width:374px;height:86px;flex-direction:column;align-items:stretch;padding:6px 12px 6px 28px;gap:4px\">\n    <span style=\"display:flex;justify-content:space-between;font-size:12px\"><b>총 기분 게이지 260 / 1,000</b><b>수비 3 / 4마리</b></span>\n    <span style=\"display:grid;grid-template-columns:repeat(4,1fr);gap:3px\">${[80, 70, 60, 50].map(k => `<span style=\"height:10px;border:1.5px solid var(--ln);border-radius:3px;background:linear-gradient(90deg,var(--fill) ${k}%,var(--dim) ${k}%)\"></span>`).join(\"\")}</span>\n    <span class=\"sub\">몬스별 80 · 70 · 60 · 50 / 100 · 한 마리 최대 100 · ${step}</span></div>`;",
        ),
        (
            "offbox(8, 136, 374, 470, \"전투 장면 3D · 내 몬스 출격 · 상대 수비 몬스\")",
            "offbox(8, 152, 374, 454, \"전투 장면 3D · 내 몬스 출격 · 상대 수비 몬스\")",
        ),
        (
            "상대: SNS 사진 · 닉네임 · 기획사 이름 · 「봇 소속사」 · 방패 n / 3 · 기분 %(제안 · 고르기 전에 막힐지 가늠) · 다시 뽑기 없음",
            "상대: SNS 사진 · 닉네임 · 기획사 이름 · 「봇 소속사」 · 방패 n / 3 · 몬스별 기분(한 마리 최대 100) · 총 기분 게이지(합, 최대 1,000) · 다시 뽑기 없음",
        ),
        (
            "\"상대 유저 기분 % 미터 · 수비 남은 / 전체 · 몬스 칸(✓ / ×) · 「수비 없음 · 다음 공격은 건물에 적중」\"",
            "\"총 기분 게이지(합, 최대 1,000) · 몬스별 기분(한 마리 최대 100) · 수비 남은 / 전체 · 「수비 없음 · 다음 공격은 건물에 적중」\"",
        ),
        (
            '{ cap: "④ 결과 · 건물 적중"',
            '{ cap: "④ 결과 · 건물 적중"',
        ),
    ]
    for a, b in reps:
        if a not in t:
            raise SystemExit("WIRE missing snippet:\n" + a[:180])
        t = t.replace(a, b, 1)

    old_hit = '''      txt(40, 112, 310, `<span class="val" style="font-size:22px">건물에 적중했어요!</span><br><span class="sub" style="font-size:12px">공격 결과와 함께 보상을 받았어요 · 콘서트장 7 → 6단계</span>`) +
      `<div class="b" style="left:36px;top:180px;width:318px;height:150px;flex-direction:column;align-items:stretch;padding:10px 14px;gap:6px">
        <span style="display:flex;justify-content:space-between;font-size:12px"><span>시설 적중 보상</span><b>1,500</b></span>
        <span style="display:flex;justify-content:space-between;font-size:12px"><span>× 주사위 배수</span><b>× 5</b></span>
        <span style="display:flex;justify-content:space-between;font-size:12px"><span>메가 보상</span><b>—</b></span>
        <span style="border-top:1.5px solid var(--ln);padding-top:6px;display:flex;justify-content:space-between"><b>최종 획득</b><b style="font-size:16px">7,500</b></span>
        <span class="sub">소수점 버림 적용</span></div>` +
      coin(36, 346, "돈", "+7,500") + coin(128, 346, "팬", "+160") + `<div class="b off" style="left:220px;top:346px;width:134px;height:84px;flex-direction:column;gap:2px"><span>주사위 · 카드팩</span><span class="sub">지급 조건 작업전</span></div>` +
      line(40, 450, 310, "상대가 잃은 돈", "−12,400") + line(40, 474, 310, "상대 방패", "2 / 3 그대로") + line(40, 498, 310, "상대 기분", "64% → 54%") +
      btn(36, 650, 150, 56, "보상 다시 보기") + btn(204, 650, 150, 56, "보드로", true) +'''
    new_hit = '''      txt(40, 112, 310, `<span class="val" style="font-size:22px">건물에 적중했어요!</span><br><span class="sub" style="font-size:12px">콘서트장 7 → 6단계</span>`) +
      `<div class="b" style="left:36px;top:180px;width:318px;height:150px;flex-direction:column;align-items:stretch;padding:10px 14px;gap:6px">
        <span style="display:flex;justify-content:space-between;font-size:12px"><span>총 기분 게이지</span><b>260 / 1,000</b></span>
        <span class="sub">한 마리 최대 100 · 총합 최대 1,000 · 쉬는 칸 10% 회복</span>
        <span style="display:flex;justify-content:space-between;font-size:12px"><span>수비 1</span><b>80 / 100</b></span>
        <span style="display:flex;justify-content:space-between;font-size:12px"><span>수비 2</span><b>70 / 100</b></span>
        <span style="display:flex;justify-content:space-between;font-size:12px"><span>수비 3</span><b>60 / 100</b></span>
        <span style="display:flex;justify-content:space-between;font-size:12px"><span>수비 4</span><b>50 / 100</b></span></div>` +
      line(40, 346, 310, "상대가 잃은 돈", "−12,400") + line(40, 370, 310, "상대 방패", "2 / 3 그대로") +
      btn(36, 650, 150, 56, "결과 다시 보기") + btn(204, 650, 150, 56, "보드로", true) +'''
    if old_hit not in t:
        raise SystemExit("WIRE missing hit block")
    t = t.replace(old_hit, new_hit, 1)

    old_hit_notes = '''    notes: ["결과 한 줄 · 「건물에 적중했어요!」 · 시설 단계 n → n−1(손상 1단계)", "배수 식 연출: 시설 적중 보상 × 주사위 배수 = 최종 획득(메가면 「메가 보상 적용 × 3」) · 소수점 버림", "받은 것: 돈 · <b>팬(시뮬은 결과 화면에 없음)</b> · 주사위 · 카드팩은 P98 지급 조건 작업전이라 회색 칸 · 동전이 HUD 돈으로 날아감 「돈 획득!」", "상대 쪽 변화: 잃은 돈(10%) · 방패 · 기분", "보드로는 연출이 끝나야 켜짐 · 카드팩이 있으면 「카드팩 열기」 → ⑤"] },'''
    new_hit_notes = '''    notes: ["결과 한 줄 · 「건물에 적중했어요!」 · 시설 단계 n → n−1(손상 1단계)", "출연권 대전은 보상이 없다. 결과 화면에 공격자 돈 · 팬 · 주사위 · 카드팩을 넣지 않음", "몬스별 기분(한 마리 최대 100)과 총 기분 게이지(합, 최대 1,000)를 따로 표시 · 쉬는 칸 10% 회복", "상대 쪽 변화: 잃은 돈(10%) · 방패", "보드로는 연출이 끝나야 켜짐 · 결과 확인 뒤 보드 복귀"] },'''
    if old_hit_notes not in t:
        raise SystemExit("WIRE missing hit notes")
    t = t.replace(old_hit_notes, new_hit_notes, 1)

    old_block = '''      `<div class="b" style="left:36px;top:240px;width:318px;height:120px;flex-direction:column;align-items:stretch;padding:10px 14px;gap:6px">
        <span style="display:flex;justify-content:space-between;font-size:12px"><span>방어 보상</span><b>750</b></span>
        <span style="display:flex;justify-content:space-between;font-size:12px"><span>× 주사위 배수</span><b>× 5</b></span>
        <span style="border-top:1.5px solid var(--ln);padding-top:6px;display:flex;justify-content:space-between"><b>최종 획득</b><b style="font-size:16px">3,750</b></span></div>` +
      coin(36, 376, "돈", "+3,750") + `<div class="b off" style="left:128px;top:376px;width:226px;height:84px">팬 · 상대 손실 없음</div>` +
      `<div class="b" style="left:36px;top:476px;width:318px;height:70px;flex-direction:column;gap:2px;border-style:dashed"><span class="val">수비 몬스가 막았을 때</span><span class="sub">「수비 몬스가 공격을 막았어요」 · 상대 기분 64% → 54%</span></div>` +
      btn(36, 600, 150, 52, "보상 다시 보기") + btn(204, 600, 150, 52, "보드로", true) +'''
    new_block = '''      `<div class="b" style="left:36px;top:240px;width:318px;height:150px;flex-direction:column;align-items:stretch;padding:10px 14px;gap:6px">
        <span style="display:flex;justify-content:space-between;font-size:12px"><span>총 기분 게이지</span><b>260 → 230 / 1,000</b></span>
        <span class="sub">출전 몬스마다 10 깎임 · 막은 판 차감 합 30 · 한 마리 최대 100</span>
        <span style="display:flex;justify-content:space-between;font-size:12px"><span>수비 1</span><b>80 / 100</b></span>
        <span style="display:flex;justify-content:space-between;font-size:12px"><span>수비 2</span><b>60 / 100</b></span>
        <span style="display:flex;justify-content:space-between;font-size:12px"><span>수비 3</span><b>50 / 100</b></span>
        <span style="display:flex;justify-content:space-between;font-size:12px"><span>수비 4</span><b>40 / 100</b></span></div>` +
      `<div class="b off" style="left:36px;top:406px;width:318px;height:54px">상대 손실 없음 · 건물은 그대로</div>` +
      `<div class="b" style="left:36px;top:476px;width:318px;height:70px;flex-direction:column;gap:2px;border-style:dashed"><span class="val">수비 몬스가 막았을 때</span><span class="sub">「수비 몬스가 공격을 막았어요」 · 총 게이지 260 → 230 / 1,000</span></div>` +
      btn(36, 600, 150, 52, "결과 다시 보기") + btn(204, 600, 150, 52, "보드로", true) +'''
    if old_block not in t:
        raise SystemExit("WIRE missing blocked block")
    t = t.replace(old_block, new_block, 1)

    new_bnotes_line = "    notes: [\"판정 순서 1: 상대 방패가 1개 이상이면 1개를 쓰고 막음 · 방패 깨짐 연출 1.6초\", \"출연권 대전은 보상이 없다. 막힌 판에도 공격자 돈 · 팬을 넣지 않음 · 막히면 상대 손실 없음\", \"판정 순서 2: 방패 0이면 지킴이가 몬스마다 기분으로 막는지 판정 · 수비가 남으면 막힘 · 출전 몬스마다 10 깎임 · 막은 판 차감 합 30 · 35 미만은 제외 · 말은 「수비 몬스」로 통일(시뮬 「수호령」 · 「지킴이」 섞임)\"] },"
    _ls=t.splitlines(keepends=True)
    _out=[]
    nb_found=False
    for _line in _ls:
        if _line.lstrip().startswith("notes:") and "막힌 판 보상" in _line:
            _out.append(new_bnotes_line + ("\n" if _line.endswith("\n") else ""))
            nb_found=True
        else:
            _out.append(_line)
    if not nb_found:
        raise SystemExit("WIRE missing blocked notes")
    t="".join(_out)

    old_mega = '''      `<div class="b" style="left:36px;top:266px;width:318px;height:150px;flex-direction:column;align-items:stretch;padding:10px 14px;gap:6px">
        <span style="display:flex;justify-content:space-between;font-size:12px"><span>시설 적중 보상</span><b>1,500</b></span>
        <span style="display:flex;justify-content:space-between;font-size:12px"><span>× 주사위 배수</span><b>× 5</b></span>
        <span style="display:flex;justify-content:space-between;font-size:12px"><span>메가 보상 적용</span><b>× 3</b></span>
        <span style="border-top:1.5px solid var(--ln);padding-top:6px;display:flex;justify-content:space-between"><b>최종 획득</b><b style="font-size:16px">22,500</b></span></div>` +
      coin(36, 432, "돈", "+22,500") + coin(128, 432, "팬", "+160") +
      btn(36, 540, 318, 52, "계속", true) + `${n(1, 40, 182)}${n(2, 16, 270)}`,'''
    new_mega = '''      `<div class="b" style="left:36px;top:266px;width:318px;height:90px;flex-direction:column;align-items:stretch;padding:10px 14px;gap:6px">
        <span class="val">특수 적중 연출</span>
        <span class="sub">적중일 때만 · 발생 기준 2% · 출연권 대전은 보상이 없어 배수 지급을 넣지 않음</span></div>` +
      btn(36, 540, 318, 52, "계속", true) + `${n(1, 40, 182)}${n(2, 16, 270)}`,'''
    if old_mega not in t:
        raise SystemExit("WIRE missing mega block")
    t = t.replace(old_mega, new_mega, 1)

    old_mnotes = '''    notes: ["메가 도장 연출(적중일 때만 · 2%)", "식에 「메가 보상 적용 × 3」 줄이 더해짐 · 계속 → ④와 같은 받은 것 · 보드로"] },'''
    new_mnotes = '''    notes: ["메가 도장 연출(적중일 때만 · 2%)", "출연권 대전은 보상이 없다. 메가 배수 지급 줄을 넣지 않음 · 계속 → ④ 결과 · 보드로"] },'''
    if old_mnotes not in t:
        raise SystemExit("WIRE missing mega notes")
    t = t.replace(old_mnotes, new_mnotes, 1)

    # drop ⑤ and ⑤-1 screen objects
    i5 = t.find('  { cap: "⑤ 카드팩 열기 (지급 조건 작업전)"')
    i6 = t.find('  { cap: "⑥ 보드 복귀 · 알림 / 못 여는 상태"')
    if i5 < 0 or i6 < 0 or i5 >= i6:
        raise SystemExit(f"WIRE pack slice fail {i5} {i6}")
    t = t[:i5] + t[i6:]

    old_ret = '''      `<div class="b" style="left:20px;top:80px;width:350px;height:50px;justify-content:flex-start;padding:0 14px 0 28px"><span class="val" style="font-size:13px">출연권 대전 보상 · 돈 +7,500 · 팬 +160</span></div>` +'''
    new_ret = '''      `<div class="b" style="left:20px;top:80px;width:350px;height:50px;justify-content:flex-start;padding:0 14px 0 28px"><span class="val" style="font-size:13px">출연권 대전 결과를 확인했어요</span></div>` +'''
    if old_ret not in t:
        raise SystemExit("WIRE missing return banner")
    t = t.replace(old_ret, new_ret, 1)

    old_rnotes = '''    notes: ["① ~ ④가 끝나면 보드로(0.6초 닦아내기) · 위에 한 줄 알림(돈 · 팬) · 그 칸에서 다음 굴림", "못 여는 경우는 알림 한 줄만 · 자동 굴리기 중이면 멈추지 않음"] },'''
    new_rnotes = '''    notes: ["① ~ ④가 끝나면 보드로(0.6초 닦아내기) · 위에 한 줄 알림(결과 확인) · 그 칸에서 다음 굴림", "못 여는 경우는 알림 한 줄만 · 자동 굴리기 중이면 멈추지 않음"] },'''
    if old_rnotes not in t:
        raise SystemExit("WIRE missing return notes")
    t = t.replace(old_rnotes, new_rnotes, 1)

    WIRE.write_text(t, encoding="utf-8")
    print("wire written", WIRE.stat().st_size)

def el(screen, eid):
    return next(x for x in screen["elements"] if x["id"] == eid)

def set_text(e, text):
    e["text"] = text
    e["name"] = text

def patch_json(doc):
    def screen(sid):
        return next(x for x in doc["screens"] if x["id"] == sid)

    # ---- facility ----
    fac = screen("facility")
    set_text(el(fac, "facility.b3-label"), "상대 방패")
    set_text(el(fac, "facility.b3-value"), "2 / 3")
    set_text(el(fac, "facility.b3-description"), "방패 개수")

    # insert mood card, shift b4 down
    b3 = el(fac, "facility.b3")
    mood = copy.deepcopy(b3)
    mood["id"] = "facility.b-mood"
    mood["name"] = "b-mood"
    mood["y"] = 49.855491
    mood["h"] = 12.138728
    # children
    icon = copy.deepcopy(el(fac, "facility.b3-icon"))
    icon["id"] = "facility.b-mood-icon"
    icon["name"] = "heart"
    icon["image"] = copy.deepcopy(HEART)
    icon["parentId"] = "facility.b-mood"
    lab = copy.deepcopy(el(fac, "facility.b3-label"))
    lab["id"] = "facility.b-mood-label"
    set_text(lab, "총 기분 게이지")
    lab["parentId"] = "facility.b-mood"
    val = copy.deepcopy(el(fac, "facility.b3-value"))
    val["id"] = "facility.b-mood-value"
    set_text(val, "260 / 1,000")
    val["parentId"] = "facility.b-mood"
    desc = copy.deepcopy(el(fac, "facility.b3-description"))
    desc["id"] = "facility.b-mood-description"
    set_text(desc, "몬스별 80 · 70 · 60 · 50 / 100 · 한 마리 최대 100")
    desc["parentId"] = "facility.b-mood"
    # insert after b3-description
    ids = [e["id"] for e in fac["elements"]]
    at = ids.index("facility.b3-description") + 1
    fac["elements"][at:at] = [mood, icon, lab, val, desc]
    el(fac, "facility.b4")["y"] = 63.150289

    # ---- combat ----
    com = screen("combat")
    set_text(el(com, "combat.b2-value"), "3 / 4")
    el(com, "combat.b3")["h"] = 11.271676
    lab = el(com, "combat.b3-label")
    set_text(lab, "총 기분 게이지")
    lab["y"] = 9.52381
    lab["h"] = 34.920635
    val = el(com, "combat.b3-value")
    set_text(val, "260 / 1,000")
    val["y"] = 42.857143
    val["h"] = 25.396825
    desc = copy.deepcopy(el(com, "combat.b4-description"))
    desc["id"] = "combat.b3-description"
    set_text(desc, "몬스별 80 · 70 · 60 · 50 / 100 · 한 마리 최대 100")
    desc["parentId"] = "combat.b3"
    desc["y"] = 68.253968
    desc["h"] = 23.809524
    ids = [e["id"] for e in com["elements"]]
    com["elements"].insert(ids.index("combat.b3-value") + 1, desc)
    el(com, "combat.b4")["y"] = 46.676301

    # ---- hit ----
    hit = screen("hit")
    set_text(el(hit, "hit.b2-label"), "총 기분 게이지")
    set_text(el(hit, "hit.b2-value"), "260 / 1,000")
    ic = el(hit, "hit.b2-icon")
    ic["name"] = "heart"
    ic["image"] = copy.deepcopy(HEART)
    set_text(el(hit, "hit.b3-section"), "몬스별 기분")
    cells = [
        ("hit.b3-cell-1", "수비 1", "80 / 100"),
        ("hit.b3-cell-2", "수비 2", "70 / 100"),
        ("hit.b3-cell-3", "수비 3", "60 / 100"),
        ("hit.b3-cell-4", "수비 4", "50 / 100"),
    ]
    for cid, name, meta in cells:
        set_text(el(hit, cid + "-name"), name)
        set_text(el(hit, cid + "-meta"), meta)
        art = el(hit, cid + "-art")
        art["name"] = "heart"
        art["image"] = copy.deepcopy(HEART)
    set_text(el(hit, "hit.b4-value"), "잃은 돈 · 방패")

    # remove pack button, widen 보드로
    hit["elements"] = [e for e in hit["elements"] if not e["id"].startswith("hit.action2")]
    el(hit, "hit.action1")["w"] = 89.74359
    aicon = el(hit, "hit.action1-icon")
    aicon["x"] = 1.714286
    aicon["w"] = 5.142857
    alab = el(hit, "hit.action1-label")
    alab["x"] = 8
    alab["w"] = 90.571429

    # ---- blocked ----
    blk = screen("blocked")
    set_text(el(blk, "blocked.b2-value"), "몬스마다 기분으로 수비 판정")
    set_text(el(blk, "blocked.b3-label"), "총 기분 게이지")
    set_text(el(blk, "blocked.b3-value"), "260 → 230 / 1,000")
    set_text(el(blk, "blocked.b3-description"), "출전 몬스마다 10 깎임 · 합 30 · 몬스별 80 · 60 · 50 · 40 / 100")
    bic = el(blk, "blocked.b3-icon")
    bic["name"] = "heart"
    bic["image"] = copy.deepcopy(HEART)
    set_text(el(blk, "blocked.b4-label"), "상대 손실")
    set_text(el(blk, "blocked.b4-value"), "없음 · 건물은 그대로")

    # ---- mega ----
    mega = screen("mega")
    set_text(el(mega, "mega.b1-caption"), "메가 적중")
    set_text(el(mega, "mega.b2-label"), "특수 적중 연출")
    set_text(el(mega, "mega.b2-value"), "적중일 때만")
    set_text(el(mega, "mega.action1-label"), "결과 보기")
    el(mega, "mega.action1")["name"] = "결과 보기"

    # ---- return ----
    ret = screen("return")
    set_text(el(ret, "return.b2-label"), "대전 결과")
    set_text(el(ret, "return.b2-value"), "확인함")
    ric = el(ret, "return.b2-icon")
    ric["name"] = "ticket"
    ric["image"] = copy.deepcopy(TICKET)

    # ---- parts ----
    parts = screen("parts")
    set_text(el(parts, "parts.feature-3-heading"), "몬스별 기분 · 총 게이지")
    set_text(el(parts, "parts.feature-3-status"), "한 마리 최대 100 · 총합 1,000")

    # ---- drop pack screens + transitions ----
    pack_ids = {"pack-open", "pack-summary", "pack-detail"}
    doc["screens"] = [s for s in doc["screens"] if s["id"] not in pack_ids]
    doc["transitions"] = [
        tr for tr in (doc.get("transitions") or [])
        if tr.get("fromScreen") not in pack_ids
        and tr.get("targetScreen") not in pack_ids
        and "pack" not in (tr.get("id") or "")
        and (tr.get("targetScreen") != "pack-open")
    ]
    return doc

def main():
    # mtime check printed by caller
    patch_wire()
    raw = JSON_PATH.read_text(encoding="utf-8")
    doc = json.loads(raw)
    if doc.get("revision") != 3:
        raise SystemExit(f"unexpected revision {doc.get('revision')}")
    doc = patch_json(doc)
    # POST with same revision
    payload = {"document": copy.deepcopy(doc), "expectedRevision": 3}
    payload["document"]["revision"] = 3
    POST_BODY.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    req = urllib.request.Request(API, data=POST_BODY.read_bytes(), method="POST")
    req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=30) as res:
            body = res.read().decode("utf-8", "replace")
            print("POST status", res.status, body[:500])
            return
    except urllib.error.HTTPError as e:
        err = e.read().decode("utf-8", "replace")
        print("POST rejected", e.code, err[:800])
    except Exception as e:
        print("POST error", type(e).__name__, e)

    # fallback: tool-format one-line JSON, bump revision
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.") + f"{datetime.now(timezone.utc).microsecond//1000:03d}Z"
    doc["revision"] = 4
    doc["savedAt"] = now
    JSON_PATH.write_text(json.dumps(doc, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print("fallback wrote", JSON_PATH, "revision 4 savedAt", now, "bytes", JSON_PATH.stat().st_size)

if __name__ == "__main__":
    main()
