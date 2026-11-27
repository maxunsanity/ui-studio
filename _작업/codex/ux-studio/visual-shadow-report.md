# 별도 DOM 그림자 효과

codex(단이) 하위 작업 · 2026-11-16 14:24 KST 확인 · 제안(검수 대기)

## 지시·범위
사용자 “그림자 효과는 엔진 효과로 넣을 거지?”에 따라 그림자 없는 그림과 별도 ON/OFF·색·불투명도·거리 설정을 분리한다. 여기의 엔진은 현재 DOM/CSS 소비 실행기다. Unity나 별도 게임 엔진 구현 완료를 뜻하지 않는다. 기존 설계 r11의 효과를 활성화하거나 PNG에 그림자를 굽지 않았다.

## 원본·변경
- 읽은 원본: model.mjs 검증, layout-view.mjs 공통 렌더, styles.css의 disabled/grayscale·pressed/brightness, skins.mjs와 관련 렌더 시험.
- 새 visual-effects.mjs: validateEffects(effects), shadowFilter(shadow), applyShadow(node,effects,{assetView,shell})를 제공한다.
- model.mjs:54: e.effects 검증을 연결했다. effects와 shadow는 생략할 수 있으며 생략을 기본값으로 쓰거나 schemaVersion을 바꾸지 않는다. shadow가 존재하면 enabled boolean, color #RRGGBB, opacity0~1, x/y -96~96px, blur0~96px를 모두 검사한다. NaN/Infinity·알 수 없는 필드·CSS 문자열 삽입은 거부한다.
- layout-view.mjs:169: 게임 art에서만 applyShadow를 적용한다. wire/structure 및 ancestor shell에서는 끈다. undefined이고 이전 효과도 없으면 style API를 전혀 건드리지 않는 no-op이다. 이전 효과를 끄거나 삭제하면 class·변수를 정리한다.
- styles.css:2415: has-ui-shadow와 --ui-shadow로 alpha 기반 CSS drop-shadow를 적용한다. 각 .ui-element는 변수 기본값을 opacity(1)로 재설정해 부모 shadow 변수가 자식의 상태 필터에 상속·중복 적용되지 않게 했다. 기존 grayscale(1)/brightness(.88)/grayscale(.3) 뒤에 shadow를 합성하며 기존 상태 수치·opacity는 유지했다.
- 좌표·크기·부모·입력 역할·자원·region을 변경하지 않는다. box-shadow를 추가하지 않았다. 그림자는 투명 원본의 실제 그려진 alpha에 적용한다.
- 추가 명시 배정에 따라 catalog.test.mjs:93의 실제 consumer 의존성 예상 목록에 visual-effects.mjs 한 줄만 추가했다. 이 모듈은 외부 import가 없으며 editor/3D/무거운 엔진을 추가하지 않는다.

## 검증
- 신규 visual-effects3건은 기존 코드에서 검증 누락/기능 미존재로 실패→구현 후 통과했다. 모델 값·경계·안전한 CSS 필터 생성·art/shell/해제·기존 style/좌표 보존·legacy undefined no-op을 검사한다.
- control-visual.test.mjs에 실제 renderLayout의 art 적용→wire 제거→ancestor shell 제거→효과 필드 삭제 cleanup 회귀를 추가했다. 기존 단순 style fake는 효과가 없는 경우 그대로 통과한다.
- node --test tests/ux-studio/visual-effects.test.mjs tests/ux-studio/control-visual.test.mjs tests/ux-studio/skins.test.mjs tests/ux-studio/responsive-layout.test.mjs → 27/27 통과. 로그: _작업/codex/ux-studio/visual-shadow-tests.log.
- catalog 실제 의존 그래프에서 새 경량 모듈 때문에 예상 목록 비교가1건 실패하는 것을 확인했다. 한 줄 보정 후 node --test tests/ux-studio/catalog.test.mjs → 8/8 통과. 로그 visual-shadow-catalog-tests.log. 두 명령의 시험 수를 전체 시험 수로 합산하지 않는다.
- visual-effects.mjs·model.mjs·layout-view.mjs node --check 통과.

## 백업·미확인
백업: docs/planning/_backup/20261116_단이/1421_visual_shadow_effect/ 아래 변경 전 model/layout/styles/control-visual/catalog 원본.

이 하위 작업은 main.mjs를 수정하지 않았다. 효과 설정 UI는 대표 본체가 다른 담당에게 맡겼다. 실제 브라우저 computed filter의 normal/pressed/disabled 조합, 부모 그림자 아래 off 자식의 상태 효과, 실제 hit 영역·저장/Undo/재열기는 대표 본체 검수다. 소스의 geometry 불변과 DOM 시험을 실제 화면 검수로 표현하지 않는다. 새 import 연결의 코드지도 갱신 필요는 본체 보고에서 구분한다. 공용 STATUS·가이드·설계·자원·서버·빌드·예약은 변경하지 않았다.
