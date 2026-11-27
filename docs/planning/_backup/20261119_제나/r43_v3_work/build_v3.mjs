import { readFile, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { validateDocument } from '../../../../../src/tools/uxStudio/model.mjs';
import { createSkin } from '../../../../../src/tools/uxStudio/skins.mjs';
import { createControl } from '../../../../../src/tools/uxStudio/controls.mjs';

const SRC = '/Users/max/projest_max/ui-guideline-israt/ui-studio/designs/ux-31671dd8.json';
const OUT = '/Users/max/projest_max/ui-studio/docs/planning/_backup/20261119_제나/r43_v3_work/r43_v3_to_save.json';
const INFO = '와이어프레임 유닛 · 기능은 연결·조건에서 지정';
const GREY = { fill: '#e8edf2', stroke: '#71839a', textColor: '#243549', strokeWidth: 1.5, radius: 12, opacity: 1, shape: 'rectangle' };
const TEXT_APP = { fill: '#ffffff', stroke: '#71839a', textColor: '#243549', strokeWidth: 0, radius: 12, opacity: 1, shape: 'rectangle' };

const eid = () => 'element-' + randomUUID();
const sid = prefix => prefix + '-' + randomUUID();
const tid = () => 'edge-' + randomUUID();
const pct = (px, base) => px / base * 100;
const typo = (fontSize, lineHeight, align = 'center') => ({ fontSize, typography: { lineHeight, align, vertical: 'middle', wrap: 'nowrap', overflow: 'clip' } });

function el(partial) {
  return { info: INFO, appearance: { ...GREY }, ...partial, appearance: { ...GREY, ...(partial.appearance || {}) } };
}

const raw = JSON.parse(await readFile(SRC, 'utf8'));
if (raw.revision !== 43) throw new Error('expected r43, got ' + raw.revision);
const doc = structuredClone(raw);
const screen = doc.screens.find(s => s.id === 'main' && s.name === 'G1_Ingame');
if (!screen) throw new Error('G1_Ingame not found');
if (doc.screens.length !== 4) throw new Error('unexpected screen count');

let elements = screen.elements;
const byName = name => {
  const e = elements.find(x => x.name === name);
  if (!e) throw new Error('missing ' + name);
  return e;
};
const add = e => { elements.push(e); return e; };
const removeNames = names => {
  const set = new Set(names);
  elements = elements.filter(e => !set.has(e.name));
  screen.elements = elements;
};

function menuItem(parentId, name, text, purpose, xPx, yPx, wPx, hPx, parentW, parentH) {
  return el({
    id: eid(), parentId, name, kind: 'button',
    x: pct(xPx, parentW), y: pct(yPx, parentH), w: pct(wPx, parentW), h: pct(hPx, parentH),
    text, purpose,
    ...typo(12, 18, 'left'),
    appearance: { ...GREY, fill: '#dce3e9', radius: 8, strokeWidth: 1, shape: 'rounded' }
  });
}

// ===== 4-6 레일: 안 A 이름 + 모노폴리 GO 모양(아이콘+시간 띠+배지). R2에 페이지 점(캐러셀 가장 가까운 모양) =====
const rail = [
  ['Slot_Left_1', '사다리 특가', '2d', false],
  ['Slot_Left_2', '황금 바자', '1d', false],
  ['Slot_Left_3', '세일 상자', '11h', false],
  ['Slot_Left_4', '골라담기', '6h', false],
  ['Slot_Left_5', '오늘의 3종', '18h', false],
  ['Slot_Right_1', '시즌 순위', '4d', false],
  ['Slot_Right_2', '퍼즐', '20h', true],
  ['Slot_Right_3', '양궁', '20h', false],
  ['Slot_Right_4', '히든', '20h', false],
  ['Slot_Right_5', '3일 마일스톤', '2d', false]
];

for (const [slotName, label, time, dots] of rail) {
  const slot = byName(slotName);
  slot.text = '';
  slot.kind = 'button';
  slot.appearance = { ...GREY, shape: 'rectangle', fill: '#e8edf2', radius: 12 };
  slot.purpose = label + (dots ? ' · 회차 미니게임 자리(페이지 점)' : '');
  const SW = 71, SH = 71;
  const icon = 44, iconX = (SW - icon) / 2, iconY = 2;
  const timerH = 14, timerW = 67, timerX = (SW - timerW) / 2, timerY = dots ? 50 : 55;
  const badge = 12, badgeX = SW - badge - 2, badgeY = 0;
  add(el({
    id: eid(), parentId: slot.id, name: slotName + '_Icon', kind: 'image',
    x: pct(iconX, SW), y: pct(iconY, SH), w: pct(icon, SW), h: pct(icon, SH),
    text: '', purpose: label + ' 아이콘 자리',
    appearance: { ...GREY, shape: 'circle', fill: '#d5dbe1', strokeWidth: 1.5, radius: 0 },
    partRole: 'image'
  }));
  add(el({
    id: eid(), parentId: slot.id, name: slotName + '_Name', kind: 'text',
    x: pct(2, SW), y: pct(14, SH), w: pct(67, SW), h: pct(16, SH),
    text: label, purpose: label,
    ...typo(8, 12, 'center'),
    appearance: { ...TEXT_APP },
    partRole: 'label'
  }));
  add(el({
    id: eid(), parentId: slot.id, name: slotName + '_TimeBg', kind: 'panel',
    x: pct(timerX, SW), y: pct(timerY, SH), w: pct(timerW, SW), h: pct(timerH, SH),
    text: '', purpose: '남은 시간 띠',
    appearance: { ...GREY, shape: 'capsule', fill: '#d0d5da', strokeWidth: 1, radius: 12 }
  }));
  add(el({
    id: eid(), parentId: slot.id, name: slotName + '_Time', kind: 'text',
    x: pct(timerX, SW), y: pct(timerY, SH), w: pct(timerW, SW), h: pct(timerH, SH),
    text: time, purpose: '남은 시간',
    ...typo(8, 14, 'center'),
    appearance: { ...TEXT_APP },
    partRole: 'label'
  }));
  add(el({
    id: eid(), parentId: slot.id, name: slotName + '_Badge', kind: 'panel',
    x: pct(badgeX, SW), y: pct(badgeY, SH), w: pct(badge, SW), h: pct(badge, SH),
    text: '', purpose: '받을 것이 있을 때만 보이는 점',
    appearance: { ...GREY, shape: 'circle', fill: '#b7bec5', stroke: '#71839a', strokeWidth: 1, radius: 0 },
    partRole: 'badge'
  }));
  if (dots) {
    // 3 page dots — closest carousel shape with existing panels (no insertable carousel)
    const dw = 6, gap = 4, n = 3, total = n * dw + (n - 1) * gap, x0 = (SW - total) / 2, y = 64;
    for (let i = 0; i < n; i++) {
      add(el({
        id: eid(), parentId: slot.id, name: slotName + '_Dot' + (i + 1), kind: 'panel',
        x: pct(x0 + i * (dw + gap), SW), y: pct(y, SH), w: pct(dw, SW), h: pct(dw, SH),
        text: '', purpose: '페이지 점 ' + (i + 1),
        appearance: { ...GREY, shape: 'circle', fill: i === 0 ? '#71839a' : '#c5cbd1', strokeWidth: 0, radius: 0 }
      }));
    }
  }
}

// ===== 이벤트 박스: 페스티벌 기간 얼굴(앨범+게이지) + 접이식 메뉴 아래로 =====
const box = byName('Overlay_EventBox');
box.text = '';
box.purpose = '내 앨범 · 페스티벌 자리 · 페스티벌 기간이 아니면 앨범 정보만 표시';
box.appearance = { ...GREY, fill: '#e8edf2', radius: 12, opacity: 1, strokeWidth: 1.5 };
const BW = 210, BH = 71;
add(el({
  id: eid(), parentId: box.id, name: 'Face_AlbumInfo', kind: 'text',
  x: pct(8, BW), y: pct(24, BH), w: pct(194, BW), h: pct(18, BH),
  text: '발매 앨범 · 차트 1일', purpose: '앨범 정보(페스티벌 기간이 아니면 이것만 보임)',
  ...typo(11, 18, 'left'), appearance: { ...TEXT_APP }, partRole: 'label'
}));
add(el({
  id: eid(), parentId: box.id, name: 'Face_FestivalTrack', kind: 'panel',
  x: pct(8, BW), y: pct(46, BH), w: pct(194, BW), h: pct(16, BH),
  text: '', purpose: '페스티벌 게이지 바탕',
  appearance: { ...GREY, shape: 'capsule', fill: '#d0d5da', strokeWidth: 1, radius: 12 }
}));
add(el({
  id: eid(), parentId: box.id, name: 'Face_FestivalFill', kind: 'panel',
  x: pct(10, BW), y: pct(48, BH), w: pct(96, BW), h: pct(12, BH),
  text: '', purpose: '페스티벌 게이지 채움',
  appearance: { ...GREY, shape: 'capsule', fill: '#9aa3ab', strokeWidth: 0, radius: 12 }
}));
add(el({
  id: eid(), parentId: box.id, name: 'Face_FestivalLabel', kind: 'text',
  x: pct(8, BW), y: pct(46, BH), w: pct(194, BW), h: pct(16, BH),
  text: '페스티벌', purpose: '페스티벌 게이지 이름',
  ...typo(9, 16, 'center'), appearance: { ...TEXT_APP }, partRole: 'label'
}));

const menuAlbumId = eid();
add(el({
  id: menuAlbumId, name: 'Menu_AlbumFestival', kind: 'panel',
  x: pct(90, 390), y: pct(61, 844), w: pct(210, 390), h: pct(71, 844),
  text: '내 앨범 · 페스티벌', purpose: '접이식 메뉴 · 아래로 펼침 · 내 앨범 / 페스티벌',
  appearance: { ...GREY, fill: '#e8edf2', opacity: 0.15, radius: 12, strokeWidth: 0 },
  menu: { defaultOpen: false, headerHeight: 22 }
}));
const albumY0 = 71 + 6, albumItemW = 198, albumItemH = 36, albumGap = 6;
add(menuItem(menuAlbumId, 'Item_MyAlbum', '내 앨범', '내 앨범 전체 화면 · 음반 제작·발매·1일 앨범 차트', 6, albumY0, albumItemW, albumItemH, 210, 71));
add(menuItem(menuAlbumId, 'Item_Festival', '페스티벌', '페스티벌 전체 화면 · 출전 신청 · 1~8주 주간 / 9주 월드', 6, albumY0 + albumItemH + albumGap, albumItemW, albumItemH, 210, 71));

// ===== 방패 3개 + 몬스, 접이식 메뉴 위로 =====
const gShield = byName('Group_Shield');
gShield.purpose = '방패·몬스 자리 · 보드 방패 최대 3개';
gShield.text = '';
removeNames(['Img_Shield_4', 'Img_Shield_5']);
const SHW = 96, SHH = 38, sIconW = 22, sIconH = 26, sGap = 6, sY = (SHH - sIconH) / 2;
for (let i = 1; i <= 3; i++) {
  const sh = byName('Img_Shield_' + i);
  sh.purpose = '보드 방패 · 최대 3개 · 남은 수만 채움';
  sh.x = pct((i - 1) * (sIconW + sGap), SHW);
  sh.y = pct(sY, SHH);
  sh.w = pct(sIconW, SHW);
  sh.h = pct(sIconH, SHH);
  sh.appearance = { ...sh.appearance, shape: 'rounded', radius: 6 };
}
add(el({
  id: eid(), parentId: gShield.id, name: 'Txt_MonsMark', kind: 'text',
  x: pct(3 * sIconW + 3 * sGap, SHW), y: pct(sY, SHH),
  w: pct(SHW - (3 * sIconW + 3 * sGap), SHW), h: pct(sIconH, SHH),
  text: '몬스', purpose: '몬스 표시',
  ...typo(9, 14, 'center'), appearance: { ...TEXT_APP }, partRole: 'label'
}));
const menuShieldId = eid();
add(el({
  id: menuShieldId, name: 'Menu_ShieldMons', kind: 'panel',
  x: pct(288, 390), y: pct(484, 844), w: pct(96, 390), h: pct(38, 844),
  text: '방패·몬스', purpose: '접이식 메뉴 · 위로 펼침 · 방패 / 몬스',
  appearance: { ...GREY, fill: '#e8edf2', opacity: 0.12, radius: 12, strokeWidth: 0 },
  menu: { defaultOpen: false, headerHeight: 38 }
}));
const shItemW = 160, shItemH = 36, shStack = 2 * shItemH + 6, shY0 = -shStack - 6;
add(menuItem(menuShieldId, 'Item_Shield', '방패', '방패 설명 팝업 · 남은 수 / 최대 3', (96 - shItemW) / 2, shY0, shItemW, shItemH, 96, 38));
add(menuItem(menuShieldId, 'Item_Mons', '몬스', '몬스 로비 전체 화면', (96 - shItemW) / 2, shY0 + shItemH + 6, shItemW, shItemH, 96, 38));

// ===== 프로필: 드롭다운 없음. 바로 공통 캐릭터 정보창(팀 탭) =====
const btnProfile = add(el({
  id: eid(), name: 'Btn_Profile', kind: 'button',
  x: pct(6, 390), y: pct(6, 844), w: pct(37, 390), h: pct(37, 844),
  text: '', purpose: '헤더 프로필 · 누르면 모바일 공통 캐릭터 정보창 팀 탭',
  appearance: { ...GREY, fill: '#ffffff', opacity: 0.01, strokeWidth: 0, radius: 12 }
}));

// ===== ☰ 접이식 메뉴 아래로 =====
const menuSettingsId = eid();
add(el({
  id: menuSettingsId, name: 'Menu_Settings', kind: 'panel',
  x: pct(345, 390), y: pct(6, 844), w: pct(37, 390), h: pct(37, 844),
  text: '☰', purpose: '계정 메뉴 · 접이식 메뉴 아래로 펼침',
  appearance: { ...GREY, fill: '#e8edf2', opacity: 0.12, radius: 12, strokeWidth: 0 },
  menu: { defaultOpen: false, headerHeight: 37 }
}));
const setW = 140, setH = 32, setY0 = 37 + 6;
add(menuItem(menuSettingsId, 'Item_AccountSwitch', '계정 바꾸기', '계정 바꾸기', (37 - setW) / 2, setY0, setW, setH, 37, 37));
add(menuItem(menuSettingsId, 'Item_SaveNow', '지금 저장', '지금 저장', (37 - setW) / 2, setY0 + setH + 6, setW, setH, 37, 37));
add(menuItem(menuSettingsId, 'Item_DevMenu', '개발 메뉴', '개발 빌드만 보이는 개발 메뉴', (37 - setW) / 2, setY0 + 2 * (setH + 6), setW, setH, 37, 37));

// ===== 하단 내비게이션 6칸. 정보만 접이식 메뉴 위로 =====
const bottom = byName('HUD_Bottom');
const tabs = [
  ['Photocard', '포토카드'],
  ['Schedule', '스케줄'],
  ['Build', '건설'],
  ['Mission', '미션'],
  ['Shop', '상점'],
  ['Info', '정보']
];
const tabW = 58, tabH = 56, tabY = 6, tabGap = 6, tabX0 = 6;
let menuInfoId = null;
for (let i = 0; i < tabs.length; i++) {
  const [key, label] = tabs[i];
  const x = tabX0 + i * (tabW + tabGap);
  const gid = eid();
  add(el({
    id: gid, parentId: bottom.id, name: 'Group_Bottom_' + key, kind: 'panel', isGroup: true,
    x: pct(x, 390), y: pct(tabY, 68), w: pct(tabW, 390), h: pct(tabH, 68),
    text: '', purpose: '하단 내비게이션 · ' + label,
    appearance: { ...GREY, fill: '#e8edf2', strokeWidth: 1, radius: 8, shape: 'rounded' }
  }));
  add(el({
    id: eid(), parentId: gid, name: 'Icon_Bottom_' + key, kind: 'image',
    x: pct(15, tabW), y: pct(4, tabH), w: pct(28, tabW), h: pct(28, tabH),
    text: '', purpose: label + ' 아이콘 자리',
    appearance: { ...GREY, shape: 'rounded', fill: '#d5dbe1', radius: 8, strokeWidth: 1 },
    partRole: 'image'
  }));
  add(el({
    id: eid(), parentId: gid, name: 'Txt_Bottom_' + key, kind: 'text',
    x: 0, y: pct(34, tabH), w: 100, h: pct(18, tabH),
    text: label, purpose: label + ' 이름',
    ...typo(9, 14, 'center'), appearance: { ...TEXT_APP }, partRole: 'label'
  }));
  if (key === 'Info') {
    menuInfoId = eid();
    add(el({
      id: menuInfoId, name: 'Menu_Info', kind: 'panel',
      x: pct(x, 390), y: pct(782, 844), w: pct(tabW, 390), h: pct(tabH, 844),
      text: '정보', purpose: '접이식 메뉴 · 위로 펼침 · 아이돌(멤버) / 관계 / 크루',
      appearance: { ...GREY, fill: '#e8edf2', opacity: 0.12, radius: 8, strokeWidth: 0 },
      menu: { defaultOpen: false, headerHeight: 56 }
    }));
    const infoW = 150, infoH = 36, infoGap = 6, stack = 3 * infoH + 2 * infoGap, y0 = -stack - 6, ix = (tabW - infoW) / 2;
    add(menuItem(menuInfoId, 'Item_Idol', '아이돌(멤버)', '모바일 공통 캐릭터 정보창 개별 탭', ix, y0, infoW, infoH, tabW, tabH));
    add(menuItem(menuInfoId, 'Item_Relation', '관계', '관계 전체 화면', ix, y0 + infoH + infoGap, infoW, infoH, tabW, tabH));
    add(menuItem(menuInfoId, 'Item_Crew', '크루', '응원 크루 전체 화면', ix, y0 + 2 * (infoH + infoGap), infoW, infoH, tabW, tabH));
  }
}

screen.elements = elements;

// ===== 새 화면(기존 G1_Lobby · Ref_* 는 그대로) =====
function simplePage(id, name, title, purpose) {
  const back = eid();
  return {
    screen: {
      id, name, kind: 'page', purpose,
      logicalSize: { w: 390, h: 844 },
      elements: [
        el({ id: eid(), name: name + '_Title', kind: 'text', x: 6, y: 8, w: 70, h: 6, text: title, purpose: title, ...typo(18, 28, 'left'), appearance: { ...TEXT_APP } }),
        el({ id: back, name: name + '_Back', kind: 'button', x: 4, y: 2, w: 18, h: 5, text: '←', purpose: '로비로', ...typo(16, 24, 'center') })
      ]
    },
    back
  };
}

function simpleModal(id, name, title, purpose, bodyLines) {
  const close = eid();
  const kids = [
    el({ id: eid(), name: name + '_Title', kind: 'text', x: 8, y: 6, w: 70, h: 8, text: title, purpose: title, ...typo(16, 24, 'left'), appearance: { ...TEXT_APP } }),
    el({ id: close, name: name + '_Close', kind: 'button', x: 78, y: 5, w: 16, h: 8, text: '닫기', purpose: '닫기 · Escape', ...typo(12, 18, 'center') })
  ];
  bodyLines.forEach((line, i) => {
    kids.push(el({
      id: eid(), name: name + '_Line' + (i + 1), kind: 'text',
      x: 8, y: 18 + i * 10, w: 84, h: 8, text: line, purpose: line,
      ...typo(13, 20, 'left'), appearance: { ...TEXT_APP }
    }));
  });
  return {
    screen: {
      id, name, kind: 'modal', purpose, logicalSize: { w: 390, h: 844 },
      skin: createSkin('modal'),
      presentation: { type: 'modal', effect: 'fade', durationMs: 240, autoCloseMs: 0, dim: true, blocking: true, dismissOnEscape: true, closePolicy: 'allow' },
      elements: kids
    },
    close
  };
}

// 모바일 공통 캐릭터 정보창 — 팀 / 개별 탭
const modalInfoId = sid('common');
const tabCtrlId = eid();
const panelTeamId = eid();
const panelMemberId = eid();
const closeInfoId = eid();
const teamTab = createControl('tabs');
teamTab.options = [
  { value: 'team', label: '팀', panelId: panelTeamId },
  { value: 'member', label: '개별', panelId: panelMemberId }
];
teamTab.value = 'team';
const modalInfo = {
  id: modalInfoId,
  name: 'Modal_CharacterInfo',
  kind: 'modal',
  purpose: '모바일 공통 캐릭터 정보창 · 모달 다이얼로그 · 프로필은 팀 탭, 아이돌(멤버)는 개별 탭',
  logicalSize: { w: 390, h: 844 },
  skin: createSkin('modal'),
  presentation: { type: 'modal', effect: 'fade', durationMs: 240, autoCloseMs: 0, dim: true, blocking: true, dismissOnEscape: true, closePolicy: 'allow' },
  elements: [
    el({ id: eid(), name: 'Txt_CharacterInfo_Title', kind: 'text', x: 8, y: 5, w: 64, h: 6, text: '캐릭터 정보', purpose: '모바일 공통 캐릭터 정보창', ...typo(16, 24, 'left'), appearance: { ...TEXT_APP } }),
    el({ id: closeInfoId, name: 'Btn_CharacterInfo_Close', kind: 'button', x: 78, y: 4, w: 16, h: 7, text: '닫기', purpose: '닫기 · Escape → 로비', ...typo(12, 18, 'center') }),
    el({
      id: tabCtrlId, name: 'Tabs_CharacterInfo', kind: 'panel', x: 8, y: 13, w: 84, h: 7, text: '', purpose: '팀 / 개별 탭',
      appearance: { ...GREY, fill: '#ffffff', radius: 8, strokeWidth: 1 },
      control: teamTab
    }),
    el({
      id: panelTeamId, name: 'Panel_TeamTab', kind: 'panel', x: 8, y: 22, w: 84, h: 55, text: '', purpose: '팀 탭 · 팀 카드',
      appearance: { ...GREY, fill: '#f4f6f8', radius: 8, strokeWidth: 1 }
    }),
    el({
      id: eid(), parentId: panelTeamId, name: 'Card_Team', kind: 'card', x: 4, y: 4, w: 92, h: 70, text: '', purpose: '팀 카드',
      appearance: { ...GREY, fill: '#ffffff', radius: 8, strokeWidth: 1 }
    }),
    el({ id: eid(), parentId: panelTeamId, name: 'Txt_TeamCard_Name', kind: 'text', x: 8, y: 8, w: 84, h: 10, text: '팀 이름', purpose: '팀 이름', ...typo(16, 22, 'left'), appearance: { ...TEXT_APP } }),
    el({ id: eid(), parentId: panelTeamId, name: 'Txt_TeamCard_Grade', kind: 'text', x: 8, y: 20, w: 84, h: 8, text: '등급 ○', purpose: '팀 등급', ...typo(13, 18, 'left'), appearance: { ...TEXT_APP } }),
    el({ id: eid(), parentId: panelTeamId, name: 'Txt_TeamCard_Ability', kind: 'text', x: 8, y: 30, w: 84, h: 8, text: '그룹 능력', purpose: '그룹 능력', ...typo(13, 18, 'left'), appearance: { ...TEXT_APP } }),
    el({ id: eid(), parentId: panelTeamId, name: 'Txt_TeamCard_Next', kind: 'text', x: 8, y: 40, w: 84, h: 8, text: '다음 등급', purpose: '다음 등급', ...typo(13, 18, 'left'), appearance: { ...TEXT_APP } }),
    el({ id: eid(), parentId: panelTeamId, name: 'Txt_TeamCard_Cond', kind: 'text', x: 8, y: 50, w: 84, h: 8, text: '컨디션 (팀 평균)', purpose: '컨디션', ...typo(13, 18, 'left'), appearance: { ...TEXT_APP } }),
    el({
      id: panelMemberId, name: 'Panel_MemberTab', kind: 'panel', x: 8, y: 22, w: 84, h: 55, text: '', purpose: '개별 탭 · 멤버 카드',
      appearance: { ...GREY, fill: '#f4f6f8', radius: 8, strokeWidth: 1 }
    }),
    el({
      id: eid(), parentId: panelMemberId, name: 'Card_Member', kind: 'card', x: 4, y: 4, w: 92, h: 50, text: '', purpose: '멤버 카드',
      appearance: { ...GREY, fill: '#ffffff', radius: 8, strokeWidth: 1 }
    }),
    el({ id: eid(), parentId: panelMemberId, name: 'Txt_MemberCard_Name', kind: 'text', x: 8, y: 10, w: 84, h: 10, text: '멤버', purpose: '멤버 이름', ...typo(16, 22, 'left'), appearance: { ...TEXT_APP } }),
    el({ id: eid(), parentId: panelMemberId, name: 'Txt_MemberCard_Ability', kind: 'text', x: 8, y: 24, w: 84, h: 8, text: '멤버 능력', purpose: '멤버 능력', ...typo(13, 18, 'left'), appearance: { ...TEXT_APP } }),
    el({ id: eid(), parentId: panelMemberId, name: 'Txt_MemberCard_Cond', kind: 'text', x: 8, y: 36, w: 84, h: 8, text: '컨디션', purpose: '멤버 컨디션', ...typo(13, 18, 'left'), appearance: { ...TEXT_APP } })
  ]
};

const pageRelation = simplePage(sid('screen'), 'Page_Relation', '관계', '관계 전체 화면 · ← 로비');
const pageCrew = simplePage(sid('screen'), 'Page_Crew', '응원 크루', '응원 크루 전체 화면 · ← 로비');
const pageMons = simplePage(sid('screen'), 'Page_MonsLobby', '몬스 로비', '몬스 로비 전체 화면 · 지킴이 · ← 로비');
const pageAlbum = simplePage(sid('screen'), 'Page_MyAlbum', '내 앨범', '내 앨범 전체 화면 · 음반 제작·발매·1일 앨범 차트 · ← 로비');
const pageFestival = simplePage(sid('screen'), 'Page_Festival', '페스티벌', '페스티벌 전체 화면 · 출전 신청 · ← 로비');
const modalShield = simpleModal(sid('common'), 'Modal_ShieldInfo', '방패', '방패 설명 팝업 · 남은 수 / 최대 3', ['보드 방패 최대 3개', '공격이 맞으면 방패 1개를 씀', '0이면 지킴이가 수비']);

doc.screens.push(modalInfo, pageRelation.screen, pageCrew.screen, pageMons.screen, pageAlbum.screen, pageFestival.screen, modalShield.screen);

function tr(fromScreen, fromElement, action, extra = {}) {
  return { id: tid(), fromScreen, fromElement, event: 'click', action, condition: 'always', ...extra };
}
const findEl = (scr, name) => scr.elements.find(e => e.name === name).id;

doc.transitions = [
  tr('main', btnProfile.id, 'open', { targetScreen: modalInfoId, label: '프로필 → 캐릭터 정보창 팀 탭', returnPolicy: '원래 위치 · 초점 그대로' }),
  tr('main', findEl(screen, 'Item_Idol'), 'open', { targetScreen: modalInfoId, label: '아이돌(멤버) → 캐릭터 정보창 개별 탭', returnPolicy: '원래 위치 · 초점 그대로' }),
  tr('main', findEl(screen, 'Item_Relation'), 'navigate', { targetScreen: pageRelation.screen.id, label: '관계 전체 화면', returnPolicy: '← 로비' }),
  tr('main', findEl(screen, 'Item_Crew'), 'navigate', { targetScreen: pageCrew.screen.id, label: '응원 크루 전체 화면', returnPolicy: '← 로비' }),
  tr('main', findEl(screen, 'Item_Shield'), 'open', { targetScreen: modalShield.screen.id, label: '방패 설명 팝업', returnPolicy: '닫기' }),
  tr('main', findEl(screen, 'Item_Mons'), 'navigate', { targetScreen: pageMons.screen.id, label: '몬스 로비 전체 화면', returnPolicy: '← 로비' }),
  tr('main', findEl(screen, 'Item_MyAlbum'), 'navigate', { targetScreen: pageAlbum.screen.id, label: '내 앨범 전체 화면', returnPolicy: '← 로비' }),
  tr('main', findEl(screen, 'Item_Festival'), 'navigate', { targetScreen: pageFestival.screen.id, label: '페스티벌 전체 화면', returnPolicy: '← 로비' }),
  tr(modalInfoId, closeInfoId, 'close', { label: '캐릭터 정보창 닫기', returnPolicy: '원래 위치 · 초점 그대로' }),
  tr(modalShield.screen.id, modalShield.close, 'close', { label: '방패 팝업 닫기', returnPolicy: '닫기' }),
  tr(pageRelation.screen.id, pageRelation.back, 'back', { label: '관계에서 로비로', returnPolicy: '← 로비' }),
  tr(pageCrew.screen.id, pageCrew.back, 'back', { label: '크루에서 로비로', returnPolicy: '← 로비' }),
  tr(pageMons.screen.id, pageMons.back, 'back', { label: '몬스 로비에서 로비로', returnPolicy: '← 로비' }),
  tr(pageAlbum.screen.id, pageAlbum.back, 'back', { label: '내 앨범에서 로비로', returnPolicy: '← 로비' }),
  tr(pageFestival.screen.id, pageFestival.back, 'back', { label: '페스티벌에서 로비로', returnPolicy: '← 로비' })
];

// keep revision 43 for official save (API bumps it)
validateDocument(doc);
await writeFile(OUT, JSON.stringify(doc, null, 2));
const g1 = doc.screens.find(s => s.id === 'main');
console.log(JSON.stringify({
  ok: true,
  out: OUT,
  revision: doc.revision,
  screens: doc.screens.map(s => s.name + '/' + s.kind),
  g1Elements: g1.elements.length,
  transitions: doc.transitions.length,
  bytes: Buffer.byteLength(JSON.stringify(doc))
}, null, 2));
