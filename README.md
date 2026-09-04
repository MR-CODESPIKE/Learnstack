# Learnstack

Learnstack is a Vite, React, and TypeScript learning workspace with a Node/Express development server. Its dependency set indicates an interactive code-learning experience: CodeMirror provides JavaScript and Python editing, React Router provides navigation, Recharts supports visualizations, and Three.js/React Three Fiber support 3D presentation. The project also includes Google GenAI and Supabase clients for AI-assisted and hosted-data features.

## Architecture

The browser application is built with Vite and React. `server.ts` is bundled separately by esbuild and started with Node in production. The package scripts intentionally keep the two concerns together: `npm run dev` starts the TypeScript server, `npm run build` creates the Vite assets and bundles the server, and `npm start` runs the generated server bundle.

| Area | Relevant files or packages |
|---|---|
| Frontend | `src/`, React, React Router, Tailwind, Motion, Lucide. |
| Code editing | `@uiw/react-codemirror`, `@codemirror/lang-javascript`, `@codemirror/lang-python`. |
| AI and data | `@google/genai`, `@supabase/supabase-js`, `dotenv`. |
| Visualization | Recharts, Three.js, React Three Fiber, Drei. |
| Server | `server.ts`, Express, Multer, tsx, esbuild. |

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

Use `npm run build` to create a production bundle, `npm start` to serve it, and `npm run lint` to run TypeScript validation. The repository currently has no separate automated test command, so changes should at minimum pass the type check and a manual browser smoke test.

## Configuration and security

Keep secrets in the local environment file and do not commit them. Configure the variables required by the current server and AI/data integrations by inspecting `.env.example` and the calls in `server.ts` and `src/`. Any Gemini or Supabase operation that relies on privileged credentials should remain server-side.

## Development guide

New screens should be added under `src/` and wired through the existing router. Reusable editor and visualization components should remain presentational where possible, with network and file-upload logic isolated from UI components. Because the package name is still the generic `react-example`, update package metadata when the product identity is finalized.
