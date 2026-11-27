import { defineConfig } from "vite";
import { resolve } from "path";
import planningReloadBoundary from "./src/tools/dev/planning-reload-boundary.mjs";

import uxSavePlugin from "../UI스튜디오/src/tools/uxStudio/save-plugin.mjs";
import { uiStudioMount, uiStudioFiles } from "../UI스튜디오/tools/ux-studio/mount.mjs";
const studioRoot = resolve(__dirname, "../UI스튜디오");

export default defineConfig({
  plugins: [planningReloadBoundary(), uiStudioMount(studioRoot), uxSavePlugin(studioRoot, resolve(studioRoot, "_작업/codex/ux-studio/projects"))],
  publicDir: "data",
  server: {
    port: 7007,
    host: "127.0.0.1",
    strictPort: true,
    // 빨간 에러 알림 창만 끈다. 기획 HTML을 열 때 스크립트를 못 찾는 알림이 가끔 뜨던 것. 기록은 그대로 남는다.
    hmr: { overlay: false },
    // 10/19 현중 정리 원칙 3: 이전 리소스 백업 폴더는 게임 · 툴 · 빌드 어디에서도 읽지 않음(개발 서버가 내주지 않고, 바뀌어도 다시 불러오지 않음).
    fs: { allow: [".", ...uiStudioFiles(studioRoot)], deny: [".env", ".env.*", "*.{crt,pem}", "**/_이전리소스_백업/**"] },
    watch: { ignored: ["**/_이전리소스_백업/**"] },
  },
  build: {
    rollupOptions: {
      input: {
        planning: resolve(__dirname, "docs/planning/planning-docs-tool.html"),
      },
    },
  },
});
