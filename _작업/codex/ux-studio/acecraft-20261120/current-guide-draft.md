기록시각: 2026-11-20T18:18:17+09:00

# 현재 정상 UI 조립 입력 노하우 — 초안

상태: 부분 실험 결과 기록 / 제품 재현성·최종 저장·재열기 본체확인대기

이 문서는 본체가 현재 조립 중 확인한 입력 실험을 기록합니다. 화면/모델 직접 주입이나 제품 수정 지침이 아니며, 조립 전체 완료·제품 버그 확정을 뜻하지 않습니다.

## 실제 확인된 범위

- 본체의 샘플 이름 변경 실험에서 locator.fill 및 clipboard Meta+V는 DOM의 value만 바뀌었고 defaultValue/실제 모델·layer 이름은 바뀌지 않았습니다. 실험 후 원래 상태로 복원했습니다. 이 한 결과만으로 제품 전체의 버그나 모든 입력창 동작을 단정하지 않습니다.
- 정상 UI 키 입력으로 `await l.press('Meta+A')` 후 ASCII 문자를 하나씩 `await l.press(ch)`로 보내고 마지막에 `Tab`을 누르면 실제 모델의 layer 이름이 `NativeProbe`로 반영되는 것을 확인했습니다.
- 같은 정상 키 입력 경로로 원래 `Img_RadiantPact_SilvannaBoard` 이름으로 되돌아간 것도 본체가 확인했습니다. 테스트 이름을 제품 상태에 남기지 않았습니다.
- 이 실험에서는 pressSequentially의 기본 지연을 사용하는 방식보다 빠르게 입력했습니다. 정량 벤치마크 수치는 측정하지 않았습니다.

## 조립할 때 적용할 방법

1. 정상 UI에서 대상 입력창을 선택·포커스합니다.
2. `Meta+A`로 현재 글자를 선택합니다.
3. 검증된 ASCII 문자열은 각 문자를 순서대로 `await l.press(ch)`로 입력합니다. 동시에 여러 press를 보내지 않습니다.
4. Space/Enter/plus는 글자 반복과 분리하여 도구가 지원하는 실제 키 입력으로 처리합니다. plus의 정확한 키 표기는 사용 중인 도구 문서/실제 동작으로 확인하며 추정 문자열을 공통 규칙으로 만들지 않습니다.
5. Unicode가 필요한 문자열만 pressSequentially를 사용합니다. ASCII와 Unicode가 섞이면 해당 구간을 분리하고 실제 결과를 확인합니다.
6. `Tab`으로 편집을 마친 뒤, 화면 표시뿐 아니라 실제 layer 이름/속성 반영을 정상 UI에서 확인합니다.
7. 확인을 위해 임시 값을 넣었다면 즉시 원래 값으로 복원하고 복원 결과를 확인합니다.

```javascript
// 대상 l은 정상 UI 입력창 locator입니다. 문서화한 검증 범위의 예시입니다.
await l.press('Meta+A');
for (const ch of 'NativeProbe') {
  await l.press(ch);
}
await l.press('Tab');
```

이 예시는 정상 키 이벤트를 보내는 조립 절차입니다. DOM.value 강제 대입, defaultValue 변경, JavaScript 모델 변경, iframe 메시지/저장 JSON 주입은 하지 않습니다.

## 아직 확인하지 않은 것

- 모든 텍스트/숫자/색 입력창에서 같은 방식이 재현되는지.
- Space/Enter/plus 조합과 Unicode가 섞인 입력의 모든 예외.
- 최종 저장 후 재열기에서 이름·값이 유지되는지.
- 샘플 전체의 실제 입력·레이어·시각·링크 검수와 사용자 승인.

본체가 위 항목을 실제 검수한 결과만 공식 가이드에 반영합니다. 이 문서의 입력 실험 성공을 샘플 전체 완료로 확대하지 않습니다.


## 정상 UI copy/paste 재사용 — r7 이후 실험 기록

기록 범위: 본체가 실제 화면 저장 r7 이후에 수행한 정상 UI 복사→다른 screen 선택→붙여넣기 성공을 보고했습니다. 아래는 해당 재사용 방법과 읽기 전용 소스 대조입니다. 최종 재열기·연결 검수는 본체확인대기이며 샘플 전체 완료를 뜻하지 않습니다.

### 재사용 기준 부품

- **1part 표시 프레임**: HonkTitle / SwitchBase / RadiantStandardPool 등 표시용 프레임 하나만 기준으로 삼습니다.
- **2part 입력 버튼**: 프레임 root와 native caption의 두 부품으로 된 기준 버튼을 사용합니다. 다른 장식·미확인 자식·화면 전체를 함께 복사하지 않습니다.
- 같은 역할과 규격의 기준만 복사합니다. 복사에는 버튼 상태, skin, 입력/나가는 행동도 함께 보존될 수 있으므로 **연결 없는 기준 부품**을 골라 사용합니다.

### 붙여넣기 후 다시 지정할 것

1. UI의 copy 명령을 실행하고 대상 screen으로 이동한 다음 UI의 paste 명령을 실행합니다. 이 절차는 편집기 내부 clipboard를 사용합니다.
2. 붙여넣기는 새 UUID를 만들고 이름에 ` 복사`를 붙입니다. 복사한 root는 퍼센트 좌표로 정리되고 기본 위치 offset이 x/y 각각 **+2%포인트** 적용되므로 원래 ABS 위치라고 믿지 않습니다.
3. 외부 parent는 복사 기준에서 해제됩니다. 원본 프레임이 놓였던 외부 부모의 기준을 그대로 기대하지 말고, 대상 screen에서 필요한 부모를 정상 UI로 확인합니다.
4. 새 root의 ABS rect를 다시 입력합니다. 2part 버튼이면 **caption의 local rect도 별도로 다시 입력**합니다. root 위치만 맞췄다고 자식이 맞았다고 판단하지 않습니다.
5. root와 caption 둘 다 대상 가족의 고유 이름으로 변경합니다. ` 복사` suffix와 원본 가족 이름을 남기지 않습니다.
6. 자식 새 ID는 생성 시의 `root-ui-label` 형태가 보장되지 않습니다. 붙여넣기 전후 새 ID 차이와 현재 layer 목록으로 실제 새 자식을 선택합니다. 예전 ID 조합을 만들어 선택하지 않습니다.
7. 같은 역할의 크기·padding·slice source/edges·native 글자·입력 대상을 다시 확인합니다. 엔진 shadow도 별도 속성으로 재확인하며, 원화에 그림자를 구워 대체하지 않습니다.
8. button state / skin / outgoing 행동이 기준에 남아 있지 않은지 확인합니다. 미확인 목적지나 원본의 연결을 새 화면으로 뜻하지 않게 가져오지 않습니다.
9. 정상 UI에서 저장한 뒤 최종 재열기·입력·연결 검수 결과를 본체가 확인해 기록합니다. 현재 문서는 해당 최종 결과를 보유하지 않습니다.

이 방법은 **정상 UI clipboard만** 사용합니다. 외부 JSON 주입, iframe 메시지 주입, JavaScript 모델 변경은 하지 않았다는 본체 실행 범위를 기록합니다. 이 문서를 저장 디자인이나 복사 payload로 사용하지 않습니다.

### 읽기 전용 코드 근거

- [commands.mjs:26](/Users/max/projest_max/ui-studio/src/tools/uxStudio/commands.mjs:26): `copySelection`은 선택 부분을 복제하고, 선택 밖 parent를 만난 root의 rect를 퍼센트로 계산한 뒤 외부 parent/inset/rectTransform/safe-area 의존을 제거합니다.
- [commands.mjs:43](/Users/max/projest_max/ui-studio/src/tools/uxStudio/commands.mjs:43): `pasteSelection`의 기본 offset은2이며, 새 ID mapping·부모/버튼 대상 remap·이름의 ` 복사` suffix와 outgoing transition 복제를 확인했습니다. 이는 연결 없는 기준을 사용해야 하는 근거입니다.
- [main.mjs:2685](/Users/max/projest_max/ui-studio/src/tools/uxStudio/main.mjs:2685): UI copy는 `internalClipboard`에 저장하며, paste는 `element-`+새 UUID를 사용해 현재 screen에 붙여넣고 validation 후 정상 편집 경로로 반영합니다.

위 코드는 이 문서 작성 중 **열람만** 했습니다. 소스·UI·저장 design·공용 보고는 변경하지 않았습니다.

추가 기록시각: 2026-11-20T18:27:22+09:00
