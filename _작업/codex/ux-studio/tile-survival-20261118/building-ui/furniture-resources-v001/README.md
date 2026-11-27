# 새 온실 가구 3종 — 자원만 준비

상태 제안(검수 대기). built-in image_gen 사용, 실제 native브라우저 조립/등록/저장/재열기 0. 영상/스크린샷 픽셀 생산 재사용0. 기존 geometry/scene/heroes·공통JS·설계JSON·공용보고/STATUS 수정0.

원본 관측: TSV03-07.jpg의 첫째/셋째카드는초록모종화분, 둘째는목제작업대+청록물뿌리개, 넷째는회색틀+붉은옷걸이. 정확한게임원화/모델/카메라/재질은미확인. 새3D스타일시안이며원본동등승인아님.

생성 원본 PNG와 선택 UI사본을 authoring/furniture-v001에 보존. furniture-gear-rack-halo-rejected-v001.png는 외부회색번짐이있던실패판, 등록금지. image_gen 편집으로배경번짐을제거한v002를선택. 최종UI3개는256×288공통슬롯,바닥기준y280,가로중심128,최대objectbox240×264,투명alpha. source alpha>=8의bbox+4px를기준으로기계적trim/축소/slot정규화,원래alpha를마스킹/재도색하지않음. sourcealpha0..7의매우옅은외부생성노이즈는crop외부에남으므로원본에보존,선택사본은바깥캔버스투명. PNG원본·UI PNG·WebP 모두원본보존. WebP각각300000B미만. 상세bbox/SHA/nativepath는manifest.csv.

카드규격은부모표의78×87논리px에fit=contain. 01/03=planter,02=workbench,04=gear-rack. 부품표CSV의pending을자동변경하거나설계에주입하지않음. native추가시root가각그림을프로젝트경로에등록하고assetRef/이미지오류/실화면/저장재열기를확인할것.

## 최종 생성 prompt 공통
Use case: stylized-concept. Asset type: one isolated furniture cutout for a small mobile game card, NOT a UI screenshot. Polished cute casual mobile game 3D render, rounded low-poly toy-like shapes, bright clear warm lighting, isometric orthographic camera from above at about 30 degrees, front and right faces visible, softly beveled edges, simple readable silhouette at 78x87 logical pixels. Center one object, complete object fully visible. True transparent RGBA background, no floor, no pedestal, no cast shadow outside the object, no UI, no card, no frame, no labels, no symbols, no numbers, no letters, no watermark. Keep only a narrow clear alpha margin around the object.

planter subject: a short square honey-gold wicker planter basket with dark soil and one lush green seedling with thick rounded leaves. Golden basket has a plump woven rim and four short wooden block feet. The plant is low and full rather than a tall sapling. Match a cozy tomato greenhouse prop. One planter only.

workbench subject: a small rustic honey-brown wooden gardening workbench with two upright side posts and a thin crossbeam above, an open low shelf, one large and one small bright turquoise watering can, and a little turquoise garden bottle arranged on the worktop. Compact furniture silhouette, tools simplified. One workbench only.

gear-rack subject: a small freestanding grey metal A-frame clothes-and-gear rack with a horizontal top bar, a red garden work jacket and a muted dusty-red apron hanging from it, and small base feet. Readable red cloth shape framed by a simple grey metal rack. One rack only.

gear-rack v002 edit: Preserve the grey A-frame, red jacket, dusty red apron, wooden hangers, object shape and isometric camera. Remove ALL background, ALL grey smoky glow, ALL haze, ALL external cast shadows and ALL vignette. Behind and inside the open frame must be truly transparent empty alpha. Only the physical rack and clothing are opaque, with clean tight antialiased silhouette edges. No new objects, text, floor or backdrop. The original grey haze must not remain in the open gaps or around the object. Transparent PNG asset.
