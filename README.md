This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview

- Stack: React (JS) + Vite
- Package manager: npm (package-lock.json present)
- Linting: ESLint (flat config via eslint.config.js)
- Containerization: Docker (multi-stage build) + docker-compose for local dev
- Unit testing: Jest + Testing Library
- E2E testing: Cypress

Common commands (PowerShell on Windows)

- Install dependencies
  - npm ci
- Start dev server (local)
  - npm run dev
  - Opens Vite dev server on http://localhost:5173 with HMR
- Start dev server (Docker)
  - docker compose up
  - Uses node:20-alpine, mounts the repo, sets CHOKIDAR_USEPOLLING=true, and runs npm install && npm run dev -- --host
  - Stop and remove: docker compose down -v
- Build production assets
  - npm run build
  - Outputs to dist/
- Preview built app locally
  - npm run preview
  - Serves dist/ (default at http://localhost:4173)
- Lint
  - npm run lint
  - Optional auto-fix: npx eslint . --fix
- Unit tests (Jest)
  - Install dev deps (first time): npm i -D jest @swc/jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event identity-obj-proxy
  - Run all tests: npm test
  - Watch mode: npm run test:watch
  - Coverage: npm run test:coverage
  - Run a single test file: npm test -- src/App.test.jsx
  - Run tests by name: npm test -- -t "counter"
- E2E tests (Cypress)
  - Install dev dep (first time): npm i -D cypress
  - Make sure the dev server is running on http://localhost:5173 (npm run dev)
  - Open interactive runner: npm run cypress:open
  - Headless run: npm run cypress:run
- Build and run production container (Nginx serving static files)
  - docker build -t react-docker-sample:latest .
  - docker run -p 8080:80 react-docker-sample:latest

Architecture and structure (high level)

- Single-page application (SPA)
  - index.html bootstraps the app and loads /src/main.jsx
  - src/main.jsx mounts <App /> into #root using React 18+ createRoot
  - src/App.jsx contains the sample UI and demonstrates HMR via Vite
- Build toolchain
  - Vite configuration in vite.config.js enables @vitejs/plugin-react; there are no custom aliases or server proxies defined
  - npm scripts:
    - dev → vite (local dev server)
    - build → vite build (generates optimized static assets to dist/)
    - preview → vite preview (serves dist/ for local verification)
    - lint → eslint . (runs ESLint using the flat config)
    - test/test:watch/test:coverage → Jest CLI
    - cypress:open/cypress:run → Cypress E2E runner
- Linting setup
  - eslint.config.js (flat config):
    - Extends @eslint/js recommended, eslint-plugin-react-hooks (recommended-latest), and eslint-plugin-react-refresh (vite)
    - Targets JS/JSX, browser globals, and ignores dist/
    - Custom rule example: no-unused-vars with varsIgnorePattern for constants
- Testing setup
  - Unit: Jest configured with jsdom environment and @swc/jest transform for JSX; Testing Library preloaded via tests/setupTests.js
  - Asset/CSS handling in tests via moduleNameMapper (files mocked, CSS proxied)
  - E2E: Cypress configured with baseUrl http://localhost:5173; example spec under cypress/e2e/
- Containerization
  - Dockerfile (multi-stage):
    - Builder: node:20-alpine runs npm ci and npm run build
    - Runner: nginx:alpine serves /usr/share/nginx/html from the built dist/
  - docker-compose.yml (dev):
    - Uses node:20-alpine, mounts the repo into /app and keeps /app/node_modules as a container volume
    - Exposes port 5173 and runs npm install then npm run dev -- --host (for LAN access during dev)

Notes from README

- This project uses the React + Vite template with HMR and ESLint rules
- The React Compiler is not enabled
- This is a JavaScript template (TypeScript is not set up)

Additional notes

- E2E tests expect the dev server to be running at the configured baseUrl (http://localhost:5173).
