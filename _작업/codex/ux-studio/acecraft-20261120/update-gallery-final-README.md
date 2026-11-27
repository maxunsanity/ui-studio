# ACECRAFT 최종 갤러리 갱신 도우미

상태: 도우미 소스만 준비했습니다. 최종 data.json 갱신은 아직 실행하지 않았습니다. 부모 본체가 정상 UI에서 20보드를 모두 저장한 뒤 직접 실행합니다.

update-gallery-final.mjs는 정확한 samples/acecraft/ui-studio/designs/ux-96eff1ad.json과 CWD의 ACE alias 조립 지침만 읽습니다. 20개 이름·종류·420×924·빈 화면 여부를 확인하고 canonical validateDocument를 복제본에 적용합니다. 20개가 아니면 문서를 쓰지 않고 종료합니다. 설계·메타·자산·모델·제품 소스는 수정하지 않습니다.

실행 위치: /Users/max/projest_max/ui-studio

```sh
node _작업/codex/ux-studio/acecraft-20261120/update-gallery-final.mjs
node _작업/codex/ux-studio/acecraft-20261120/update-gallery-final.mjs --apply
```

첫 명령은 stdout JSON 미리보기만, 두 번째는 두 전용 갤러리 data.json을 백업 후 갱신합니다. root가 최종 실행을 요청하기 전에는 둘 다 실행하지 않습니다. 정상 UI 저장 완료 상태에서 실행하며, 입력 파일이 바뀌면 쓰기 전에 중단합니다.

- 정본: /Users/max/projest_max/ui-studio/docs/reference/acecraft/data.json
- served: /Users/max/projest_max/ui-studio/src/tools/uxStudio/guide/reference/acecraft-video-20261120/data.json
- 백업: /Users/max/projest_max/ui-studio/docs/planning/_backup/YYYYMMDD_단이/HHMMSS_acecraft_gallery_data/

각 항목에 실제 nativeBoardId, 저장 revision, 종류별/전체 부품 수, 입력 대상 수, 3·9분할 수, 출발 연결 수와 실제 사용 자산을 씁니다. 기존14개 자산에 새 로비16종 atlas 1개를 더해15개로 만들고, 파일크기·헤더크기·sha256 및 저장본 사용 여부를 읽습니다. 원본 캡처를 제품 자산으로 복사하지 않습니다. served의 자산 URL만 /ui-studio/source/assets/...로 바꿉니다.

저장 사실은 저장 JSON으로 확인하지만, 재열기·입력·실제 시각 검수는 자동으로 통과 처리하지 않습니다. 기존 unknown source, 구매·보상·미관찰 경로, 원화 차이와 문자처럼 보이는 물리 시계 눈금 제약을 유지합니다. 최종 결론은 본체가 실제 검수 증거와 함께 남깁니다.

두 전용 index.html은 실제 data의 nativeBoardId·status·componentCounts를 표시하고 workspace/project/screen 주소로 정상 편집 화면을 엽니다. summary의 저장 보드/부품/연결 수도 데이터에서 읽습니다. HTML 변경 자체는 브라우저에서 확인하지 않았으며 root가 최종 gallery를 열어 확인합니다.

추가 연결 후보는 transition-candidates-final-v007.json입니다. 화면 보기 이동 후보이며 미확인 구매·Claim·Pilot 세부 목적지는 연결하지 않습니다.
