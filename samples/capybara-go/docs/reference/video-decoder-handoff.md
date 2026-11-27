# 검증한 로컬 영상 디코더·캡처 방법
작성 codex(단이·2차) · 2026-11-17 KST · 지식 공유용

이 문서는 1차가 요청한 디코더 작업 방법입니다. 다른 프로젝트의 영상·설계·자원·브라우저를 열거나 수정하라는 배정이 아닙니다. 실행하는 담당이 자신의 허용 영상과 자기 작업 폴더를 지정합니다.

## 사용 가능한 실행 파일

- `/Applications/BlueStacks.app/Contents/MacOS/ffmpeg`
- 이번 실제 `-version` 확인: ffmpeg 7.1.1, Apple arm64 static 빌드. 새 패키지 설치·앱 실행·서버 변경 없이 이 실행 파일을 절대경로로 호출했습니다.
- PATH에 ffmpeg/ffprobe가 없고 Python cv2/av가 없어도 이 실행 파일은 카피바라고 H.264 MOV를 software h264→JPEG/PNG로 디코딩했습니다. 다른 파일/코덱 성공은 별도 실행 결과로 확인합니다.

## 메타데이터만 읽기

```sh
/Applications/BlueStacks.app/Contents/MacOS/ffmpeg -hide_banner -i '/absolute/path/to/video.mov'
```

출력 파일을 지정하지 않았으므로 메타데이터 뒤 종료코드1 또는 “출력 파일을 지정하라”는 메시지가 나올 수 있습니다. 이것만으로 영상 디코딩 실패라고 판단하지 않습니다. stderr의 Duration·Video·해상도·FPS·회전 메타를 읽습니다. 소스 원본은 변경되지 않습니다.

## 전체 구간 0.5초 간격 검토

자기 프로젝트의 지정 작업 폴더에 `frames/`를 미리 만듭니다. 아래 출력 경로는 그 폴더의 실제 절대경로로 바꿉니다. `-y`로 기존 산출을 덮어쓰지 않습니다.

```sh
/Applications/BlueStacks.app/Contents/MacOS/ffmpeg -hide_banner \
  -i '/absolute/path/to/video.mov' \
  -vf fps=2 -q:v 3 \
  '/project/_작업/codex/task/frames/frame_%05d.jpg'
```

이것은 전체 구간 UI 탐색용입니다. 출력 번호에 대응하는 0.5초 눈금은 검토 시각이고 원 영상의 정확한 클릭 순간을 증명하지 않습니다. 짧은 화면은 간격 검토만으로 놓칠 수 있으므로 장면 전환 검토를 추가합니다.

## 장면 전환 후보와 원본 시각

```sh
/Applications/BlueStacks.app/Contents/MacOS/ffmpeg -hide_banner \
  -i '/absolute/path/to/video.mov' \
  -vf "select='gt(scene,0.10)',showinfo" -vsync vfr -q:v 4 \
  '/project/_작업/codex/task/scene_%03d.jpg' \
  > '/project/_작업/codex/task/scene-detection.log' 2>&1
```

`showinfo`의 `pts_time:`이 선택된 전환 프레임의 원본 타임스탬프입니다. 0.10은 이번 사례의 후보 탐지 설정이며 모든 영상의 고정 정답이 아닙니다. 후보 수는 UI 수가 아니며 로딩·페이드·스크롤·이미지 움직임을 직접 구분합니다. `-vsync vfr`는 이 검증 실행의 명령으로 보존합니다. 환경에 따라 deprecation 경고가 있어도 실제 출력/로그/종료 결과로 성공 여부를 확인합니다.

## 선택한 원본 프레임을 PNG로 재추출

```sh
/Applications/BlueStacks.app/Contents/MacOS/ffmpeg -hide_banner -loglevel error \
  -ss 47.8 -i '/absolute/path/to/video.mov' \
  -frames:v 1 -c:v png \
  '/project/reference/captures/C13_047.80s.png'
```

원본을 참고해 안정된 UI 시각을 고릅니다. `47.8`은 카피바라고 사례의 요청 시각 예시이며 다른 영상에 복사할 값이 아닙니다. 요청 시각·원본 해상도·PNG 크기·SHA-256을 함께 기록합니다. 추출된 PNG는 분석 참고용이며 실제 UI 그림은 새로 그립니다.

## 카피바라고에서 실제 확인한 결과

- 원본 121.235초·504×894, 61,498,295bytes, H.264 Main.
- fps=2 검토 이미지 242장. scene score>0.10 후보 145장. 전체 접촉 시트를 읽어 UI/상태/로딩/전환을 구분했습니다.
- 대표 PNG44장을 원본에서 재추출했고 전부504×894·해시를 대조했습니다.
- 화면·팝업27종+펼침1상태, 관찰 전환58건·상태 그룹9개. 선언 그래프 검사와 실제 미리보기 검수는 별도입니다.
- 실제 자료: `reference/video-analysis-20261117/`의 source.json, ui-inventory.json, ui-connections.json, captures/, verification.json, index.html, 분석보고.md.
- 디코딩 로그는 이 샘플 `_작업/codex/video-analysis/`에 보존합니다. 원본 검토 프레임·접촉 시트의 실제 보존 위치는 같은 폴더 README.md에 적습니다.

## 실패 경로와 경계

- Swift AVFoundation으로 duration/영상 트랙 크기/FPS 메타는 읽혔습니다. 그러나 AVAssetImageGenerator copyCGImage는 이번 실행에서 243요청 전부 Cannot Decode(-11821, underlying -12911)였습니다. 검증된 이미지 추출 경로로 추천하지 않습니다. 원본 손상으로 확정하지 않았으며 위 ffmpeg software decode가 실제 성공했습니다.
- 원본 ffmpeg/프레임 추출을 새로운 앱 제어·브라우저 접근·패키지 설치·외부 업로드·서버 재시작 권한으로 확대하지 않습니다.
- Swift/ffmpeg는 영상 파일 분석 도구입니다. UI Studio의 설계 JSON을 외부에서 만들어 실제 native 조립을 우회하는 도구로 쓰지 않습니다.
