# three.js + Playwright gear demo

A Vite + three.js app showing a rotating, lit 3D gear you can orbit (mouse/touch via OrbitControls). Playwright renders it headlessly and saves a screenshot.

## Structure
- `index.html` – page shell and canvas.
- `src/main.js` – scene, lights, procedural environment map, OrbitControls, animation loop (sets `window.__frames` for tests).
- `src/gear.js` – `createGearGeometry()` builds the gear (toothed `Shape` + hole, extruded).
- `tests/screenshot.spec.js` – opens the page, waits for frames to render, saves `screenshots/gear.png`.
- `playwright.config.js` – builds + serves `dist` on :4173 and uses software WebGL (SwiftShader) flags.
- `vite.config.js` – `base` comes from `BASE_PATH` (set in CI for GitHub Pages).
- `.github/workflows/deploy.yml` – builds and deploys to GitHub Pages on push to `main`.

## Run
- `npm install`
- `npm run dev` – dev server with hot reload.
- `npm run build` / `npm run preview` – production build in `dist/`.
- `npx playwright install chromium` (once), then `npm run screenshot` – writes `screenshots/gear.png` (gitignored). Inspect it after visual changes.
  - In sandboxes with a pre-installed Chromium: `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium npm run screenshot`.

## Deploy
Pushing to `main` deploys via GitHub Pages. One-time: repo Settings → Pages → Source: "GitHub Actions". Live URL: `https://<user>.github.io/<repo>/`.
