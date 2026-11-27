# ACECRAFT lists v006 원본 대조와 승인된 v007 정리

작성: codex(단이)  
범위: 원본 프레임 육안 열람 + 레시피 구조·좌표·자산 영역 정적 대조. 실제 샘플 UI/브라우저/모델 검수는 하지 않았습니다.  
결과: 아래 권고를 먼저 본체에 보고했고, 본체의 명시 정정 후 v007에만 반영했습니다. v006 원본은 보존했습니다.

## 읽은 자료

- recipes-lists-shops.reviewed-v006.json
- 영상A frame_00005/00038/00041/00086/00092/00096.jpg
- 영상B frame_00013.jpg 및 공개 원화
- button-state.mjs, commands.mjs, responsive-layout.mjs, responsive-inspector.mjs

## P2와 권고·반영 범위

|발견|v006 근거|최종 승인된 v007|
|---|---|---|
|상점 footer가 현재 family 규격과 다름|5가족 ShopFooter(0,852,420,72), Back/탭 폭62/77/87 혼재|Footer(0,842,420,82), Back40×82 x0,4탭95×82 x40/135/230/325. 원본 Back을 footer에 유지하며 새5번째 목적지는 없음|
|버튼 문구가 root 부모|ModeLabel/LocalTabLabel, Pilot FilterLabel·AdvanceLabel의 parent=root|각 caption을 해당 button parent로 이동. ABS 위치는 유지|
|Normal/Elite caption이 입력 영역 밖|button y223..261, caption y258..279|동일64×58 button으로 확장하고 각 caption을 그 자식으로 둠|
|Period Claim의 마지막 품목이 번개 기호|ClaimRewardIcons는 goldcoin/gem/lightning 단일 atlas strip|원본의 정확3개 ticket/gem/redbottle 구조로 분리. gem×100/병24H/×2 별도 native. 첫금빛 ticket은 새붉은 ticket 근사임을 notes에 명시|
|Pilot 세 번째 행이 고정 탭·하단과 교차|카드 y682..858, tab label y806..831, footer y842|투명 ListViewport ABS(0,280,420,520), scroll-y. 카드9개 parent만 이동하고 ABS 및113×176 유지|

전역5×84 규격을 상점4탭에 그대로 대입하지 않습니다. 최종 상점 규격은 원본 기능 수를 보존한 Back40+4×95입니다. 상점 caption은91×38·14px이며 해당 버튼 안에 있습니다. 전역80×20 caption과 다른 역할입니다.

## v007 정적 확인

- 7가족·242행동.
- 모든 parent는 앞서 선언됩니다.
- 버튼 caption rect가 해당 버튼 안에 있습니다.
- 상점 다섯 입력 영역은 x0..420에 빈칸·겹침 없이 맞닿고 y842/h82가 같습니다.
- source scroll-y enum과 UI ‘세로 스크롤’을 확인했습니다.
- Pilot9카드 ABS·113×176 및 기존 portrait/level 자식 관계를 보존했습니다.
- Period Claim image 노드는 정확3개입니다. 첫 ticket의 미확인 수량은 추가하지 않았습니다.
- 모든 지정 image region은 실제 준비 자산 bounds 안입니다.
- v006 내용과 실제 UI·저장 모델은 변경하지 않았습니다.

단, bounds 통과만으로 비동기 이미지 선택의 source 정체성이 보장되지는 않습니다. 본체는 기대한 src와 원본 크기가 확정된 뒤 crop을 입력하고 저장·재열기·실제 화면에서 확인해야 합니다.

## 남은 실화면 확인

원화 근사·반복행 축약·일부 그림 생략은 기존 notes에 적힌 제안 범위로 분리했습니다. 새 P2라고 중복 집계하지 않았습니다.

Pilot의 밝은 레벨 글자가 새 크림 카드 위에서 충분히 구분되는지, 긴 상품·미션 문구가 설정한 높이에 들어가는지, 같은 역할의 실제 버튼 상태가 일관적인지는 본체의 실제 표시 검수가 필요합니다. 소스 예측을 실제 렌더 오류로 단정하지 않습니다.

이 보고는 recipe-only 변경의 검토 기록이며 실제20보드 완성·결제·게임 기능·사용자 승인을 뜻하지 않습니다.
