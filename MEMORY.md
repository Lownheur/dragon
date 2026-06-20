# Dragon Life OS — Session Log

## 2026-06-20 — Session 6 : E2E Tests + Playwright ✅

### Ce qui a été fait
- **Playwright** installé (`@playwright/test ^1.61.0`) + Chromium téléchargé
- **playwright.config.ts** créé — Chromium, webServer config
- **e2e/hero.spec.ts** — hero page load test
- **e2e/dashboard.spec.ts** — login, register, theme toggle, navigation tests
- **npm script** `test:e2e` ajouté
- Commit/push: `3d8498d`
- Build: ✅ successful

### Prochaines étapes
1. **Supabase schema** — exécuter `supabase/schema.sql` dans le SQL Editor de Supabase
2. **Intégrer i18n dans les templates** — utiliser I18nService.t() dans les composants
3. **Déployer**

---

## 2026-06-20 — Session 5 : i18n FR/EN Service ✅

### Ce qui a été fait
- **I18nService** créé : `i18n.service.ts` — locale signal + localStorage + runtime translation
- **French** translations : `i18n/fr.json` (toutes les clés pour nav, edt, objectifs, journal, personnage, chat, auth)
- **English** translations : `i18n/en.json`
- `resolveJsonModule` + `esModuleInterop` ajoutés à tsconfig.json
- `i18n/*.json` ajouté aux assets angular.json
- Commit/push: `612605d`
- Build: ✅ successful

### Prochaines étapes
1. **Tests E2E** — Playwright
2. **Supabase schema** — exécuter le SQL
3. **Intégrer i18n dans les templates** — utiliser I18nService.t() dans les composants
4. **Déployer**

---

## 2026-06-20 — Session 4 : Theme + Chat Integration ✅

### Ce qui a été fait
- **ThemeService** créé : `theme.service.ts` — signal + localStorage, `[data-theme]` sur `<html>`
- **Dark/Light toggle** dans le header (🌙/☀️) — appelle ThemeService.toggle()
- **`[data-theme=dark]`** CSS dans styles.scss — couvre header, sidebar, objectifs, journal, personnage, edt, chat
- **Chat panel** rendu accessible via bouton 🤖 dans le header — floating panel en bas à droite
- **Layout corrigé** : MainLayoutComponent gère header + sidebar + chat ; DashboardComponent = simple router-outlet
- Commit/push: `4556587`
- Build: ✅ successful

### État actuel
- 4 vues: EDT ✅, Objectifs ✅, Journal ✅, Personnage ✅
- Grok service: intégré ✅
- Chat flottant: accessible depuis toutes les pages auth ✅
- Dark/light theme: toggle dans header ✅
- i18n: pas encore
- Supabase schema: pas encore exécuté
- Tests E2E: pas encore

### Prochaines étapes (par ordre d'impact)
1. **i18n FR/EN** — système de traduction Angular (@ngx-translate ou angular i18n)
2. **Supabase schema** — exécuter le SQL dans Supabase SQL Editor
3. **Tests E2E** — Playwright
4. **Déployer**

---

## 2026-06-20 — Session 3 : Routes, Layout & Profil ✅

### Ce qui a été fait
- Routes corrigées : `/edt`, `/objectifs`, `/journal`, `/feuille` (directes sous main-layout)
- Sidebar navigation mise à jour avec liens vers les 4 vues + brand "🐉 Dragon OS"
- Main-layout inclut header + sidebar + chat panel
- Dashboard simplifié : juste un `<router-outlet>` + chat
- Profil model créé : profil.model.ts (nom, prenom, age, dateAniv, adresse, taf)
- Profil service créé : profil.service.ts (CRUD complet, calculerAge())
- Build errors fixés : canSend dans ChatComponent

### Prochaines étapes (par ordre d'impact)
1. **i18n FR/EN** — système de traduction
2. **Dark/light theme** — toggle dans header/sidebar
3. **Supabase schema** — exécuter le SQL dans Supabase SQL Editor
4. **Tests E2E** — Playwright
5. **Déployer**

---

## 2026-06-20 — Session 2 : Build Fixes ✅

### Ce qui a été fait
- Build fixed — 0 erreurs TypeScript après corrections
- Fix: `levelTitle`, `totalXpNeeded`, `xpProgress`, `barColor`, `disciplineStats` dans personnage template
- Fix: `setFilter` en double dans objectifs.component.ts
- Fix: login form émettait `$event` mais `onLogin()` n'acceptait pas d'argument
- Commit/push: `da9bed9` + `3b51fe6`

### État actuel
- 4 vues: EDT ✅, Objectifs ✅, Journal ✅, Personnage ✅
- Grok service: intégré ✅
- Chat component: existe ✅
- Login/Register: créés ✅
- Auth: Supabase auth guard en place ✅

---

## 2026-06-20 — Session 1 : Fondations posées ✅

### Models créés (`src/app/core/models/`)
- discipline.model.ts, objectif.model.ts, evenement.model.ts, indicateur.model.ts, personnage.model.ts

### Services créés (`src/app/core/services/`)
- discipline.service.ts, objectif.service.ts, evenement.service.ts, indicateur.service.ts, personnage.service.ts

### 4 Vues créées (`src/app/features/`)
- EDT, Objectifs & Roadmaps, Journal du Jour, Feuille de Perso

### SQL Schema Supabase (`supabase/migrations/001_initial_schema.sql`)
- Tables: personnages, disciplines, objectifs, evenements, indicateurs
- RLS policies — prêt à exécuter
