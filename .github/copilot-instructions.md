# Copilot Instructions for TrivianEdge React Site

## Project Overview

TrivianEdge is a React/TypeScript single-page application (SPA) for TrivianEdge Solutions — an AI & global talent solutions company. The site features an AI-powered chat assistant (backed by Google Gemini), dynamic geo-aware greetings, a talent hub explorer, blog posts, and a theme/language switcher.

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS (utility-first, applied via class names)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **AI Integration**: Google Gemini API (`@google/genai`) — proxied through a Cloudflare Worker (`src/worker.ts`) via `/api/chat` (SSE) and `/api/generate` endpoints. The frontend uses `fetch()` directly, not the SDK.
- **Deployment**: Cloudflare Workers (see `wrangler.toml`)

## Project Structure

```
/
├── App.tsx                  # Root component; contains all page sections and routing logic
├── index.tsx                # App entry point
├── index.html               # HTML shell
├── types.ts                 # Shared TypeScript interfaces and types
├── constants.tsx            # Static data: nav links, services, roles, blog posts, talent hubs, etc.
├── vite.config.ts           # Vite config (exposes GEMINI_API_KEY as process.env)
├── tsconfig.json            # TypeScript config (target: ES2022, bundler module resolution)
├── components/
│   ├── ChatSidebar.tsx      # AI chat sidebar (calls Cloudflare Worker /api/chat)
│   ├── GreetingBanner.tsx   # Geo-aware greeting banner
│   ├── GreetingBanner.css   # Styles for the greeting banner
│   ├── LanguageSelector.tsx # Language picker UI
│   ├── Preloader.tsx        # App preloader/splash screen
│   ├── TalentHubModal.tsx   # Modal for talent hub detail view
│   └── ThemeToggle.tsx      # Dark/light theme toggle button
├── contexts/
│   ├── LanguageContext.tsx  # Language state and i18n context
│   └── ThemeContext.tsx     # Dark/light theme context
└── utils/
    ├── countryLanguageMap.ts # Maps country codes to supported languages
    ├── geoService.ts        # Fetches geolocation data (country, timezone, city)
    ├── getTimeOfDay.ts      # Returns time-of-day bucket (morning/afternoon/evening/night)
    ├── greetings.ts         # Localized greeting strings by language and time of day
    └── weatherService.ts    # Fetches weather data for greeting context
```

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (runs on port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

- `GEMINI_API_KEY` — Required. Set in `.env.local` for local development. For Cloudflare Worker deployment, store as a Worker secret named `GEMINI_API_KEY`.

## Coding Conventions

- **TypeScript**: All components and utilities are written in TypeScript. Define all shared types in `types.ts`. Use explicit interface/type exports.
- **React**: Functional components only; use React hooks (`useState`, `useEffect`, `useRef`, `useCallback`). No class components.
- **Imports**: Use the `@/` path alias (maps to the project root). Group imports: React first, then third-party, then local.
- **Styling**: Use Tailwind CSS utility classes directly on JSX elements. Custom CSS files (e.g., `GreetingBanner.css`) are only used when Tailwind alone is insufficient.
- **Naming**: PascalCase for components and their files. camelCase for utilities, hooks, and variables.
- **Constants**: Add static data and copy to `constants.tsx`, not inline in components.
- **No test framework**: The project does not currently have a test runner configured. Do not add tests unless the user explicitly requests setting up a test framework.
- **No linter config**: There is no ESLint or Prettier config in the repo. Match the style of the surrounding code when making edits.

## Key Architectural Notes

- The Gemini AI calls are **not made directly from the browser**. They go through a Cloudflare Worker (`src/worker.ts`) at `/api/chat` (streaming SSE) and `/api/generate`. The API key lives only in the Worker secret, never in the frontend bundle.
- `App.tsx` is a large monolithic file containing all page sections. When adding new sections or features, follow the existing pattern of inline React components inside `App.tsx`, or extract to `components/` if the component is sufficiently complex.
- The `LanguageContext` and `ThemeContext` wrap the entire app in `index.tsx`. Always access language/theme state via the provided context hooks, not local state.
- Geo-location and weather data are fetched client-side in `utils/geoService.ts` and `utils/weatherService.ts`. These are used by `GreetingBanner` to personalise the greeting.
- Supported languages: French (`fr`), Spanish (`es`), Arabic (`ar`), Sinhala (`si`), English (`en`). Supported country codes are defined in `types.ts` as `SupportedCountry`.
