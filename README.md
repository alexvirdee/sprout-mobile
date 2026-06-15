# Sprout — Mobile

The Sprout gardening companion, built with Expo + React Native + TypeScript and
the Sprout design system.

## Run

```bash
npm install
npm start        # then press i (iOS), a (Android), or scan with Expo Go
```

Configure the API URL in `.env` (`EXPO_PUBLIC_API_BASE_URL`). To browse the UI
without a backend, tap **"Explore the demo"** on the Sign in screen.

## Stack

- **Expo SDK 54** / React Native 0.81 / React 19 / TypeScript (strict)
- **React Navigation v7** — native-stack (auth) + bottom-tabs (app)
- **React Query** — server state (`useDashboard`)
- **Zustand** — lightweight client state (`authStore`, `onboardingStore`)
- **React Hook Form + Zod** — forms & validation
- **lucide-react-native** — icons · **react-native-svg** — logo + progress rings
- **expo-secure-store** — JWT storage · **expo-linear-gradient** — brand washes
- **@expo-google-fonts** — Outfit (display) + Hanken Grotesk (body) + JetBrains Mono

## Folder structure

```
sprout-mobile/
├── App.tsx                      # providers: gesture/safe-area/query/theme/navigation
├── index.ts                     # registerRootComponent
├── app.json                     # Expo config (name, icons, splash, plugins, extra)
├── assets/                      # icon, splash, favicon, brand SVGs
└── src/
    ├── components/              # reusable UI library (barrel: components/index.ts)
    │   ├── ui/                  # Text, Button, IconButton, Input, Card, Badge,
    │   │                        #   Avatar, Checkbox, Switch, SegmentedControl, ProgressRing
    │   ├── garden/              # StatTile, PlantCard, AchievementBadge
    │   ├── feedback/            # EmptyState, Spinner, Skeleton(s)
    │   ├── layout/              # ScreenContainer, SectionHeader, GradientBackground
    │   └── brand/               # Logo, LogoMark (SVG sprout)
    ├── screens/
    │   ├── SplashScreen.tsx
    │   ├── onboarding/          # 3-slide paged onboarding
    │   ├── auth/                # SignIn, SignUp, ForgotPassword (+ shared parts)
    │   ├── home/                # DashboardScreen (the premium home)
    │   └── ComingSoonScreen.tsx # placeholder for Phase 2 tabs
    ├── navigation/              # Root / Auth / App navigators + types
    ├── hooks/                   # useAuth, useDashboard
    ├── services/                # apiClient, authService, secureStorage, queryClient
    ├── store/                   # authStore, onboardingStore (zustand)
    ├── theme/                   # colors, typography, spacing, radii, shadows,
    │                            #   gradients, motion, ThemeProvider, useTheme
    ├── types/                   # models, api, navigation
    ├── utils/                   # validation (zod), format helpers
    ├── features/                # feature modules (garden: mock data + service + types)
    └── config/                  # env (reads EXPO_PUBLIC_* / app.json extra)
```

## Path aliases

Configured in `tsconfig.json` + `babel.config.js`:
`@/* @components @screens @navigation @theme @store @services @hooks @app-types @utils @features`.

## Theming

`src/theme` is a faithful port of the Sprout design tokens. Import what you need:

```tsx
import { colors, spacing, radii, shadows, typography } from '@theme/index';
```

Components never hard-code colors or font sizes — they read from the theme. The
`<Text>` primitive exposes brand variants (`display`, `h1`, `body`, `eyebrow`, …).

## Notes / substitutions

- **Fonts** load from Google Fonts via `@expo-google-fonts/*` (the design system
  flagged these as CDN substitutions for the brief's "Outfit / Cabinet Grotesk"
  direction). Swap in licensed faces later if desired.
- **Photography** is represented by warm gradient panels + plant emoji glyphs,
  matching the design kit. Drop in real golden-hour photos for production.
- **Dashboard data** is mock (`src/features/garden/mockData.ts`) served through
  React Query; point `gardenService.getDashboard` at the API when endpoints land.
