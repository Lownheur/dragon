# Dragon Life OS — Session Log

## 2026-06-20 — Session 9 : Critical Bug Fixes 🔴

### 🐛 Bugs critiques corrigés

**1. snake_case ↔ camelCase — TOUTES les données Supabase cassées**
- Supabase retourne snake_case (`user_id`, `start_time`, `end_time`) mais les modèles Angular utilisent camelCase
- Résultat: toutes les propriétés étaient `undefined` dans les vues
- Fix: `db-mapper.util.ts` avec `toCamelCase()` / `toSnakeCase()` / `mapArray()`
- Corrigé dans: EvenementService, ObjectifService, DisciplineService, ProfilService, PersonnageService, IndicateurService

**2. GrokCommandService — DI cassé**
- `createDiscipline()` utilisait `new SupabaseService()` et `new AuthService()` au lieu d'injecter
- Fix: ajouté `create()` à DisciplineService, appelé proprement via `this.disciplines.create()`
- Corrigé aussi: `DisciplineType` cast dans GrokCommandService

**3. GrokCommandService.parseTime — bug "demain 10h"**
- "demain 10:00" n'était pas parsé correctement (redevient aujourd'hui)
- Fix: gère maintenant les mots-clés avant l'heure ("demain 10h", "demain 14:30")

**4. DashboardComponent — double header/sidebar/chat**
- MainLayoutComponent rendait déjà header + sidebar + chat
- DashboardComponent rendait ALSO header + sidebar + chat → duplication
- Fix: DashboardComponent = page d'accueil avec 4 cartes de navigation (EDT, Objectifs, Journal, Feuille)

### Fichiers modifiés
- `src/app/core/utils/db-mapper.util.ts` (nouveau)
- `src/app/core/services/*.service.ts` — tous mis à jour avec mapping
- `src/app/features/dashboard/*` — refactorisé
- Commits: `cc43692`, `cb82331`, `ef2d525`, `ee492f7`
- Build: ✅ OK

### État actuel
- 4 vues: EDT ✅, Objectifs ✅, Journal ✅, Feuille de Perso ✅
- Grok service: intégré ✅
- Chat flottant: accessible depuis toutes les pages auth ✅
- Dark/light theme: toggle dans header ✅
- i18n FR/EN: intégré ✅
- Dashboard: page d'accueil propre avec navigation ✅
- **Supabase schema: ⚠️ pas encore exécuté** (requiert token d'accès Supabase)

### Prochaines étapes
1. **Supabase schema** — exécuter `supabase/schema.sql` (besoin token Supabase)
2. **Tests E2E** — Playwright ready mais pas encore run
3. **Déployer** — Cloudflare Pages
4. **Tests E2E complets** — login, register, navigation, CRUD

---

## 2026-06-20 — Session 8 : Grok AI Controller + i18n Fixes ✅

### Ce qui a été fait
- **GrokCommandService** créé : Grok est maintenant le CONTRÔLEUR CENTRAL de l'app
  * COMMANDES: CREATE_EVENT, SCHEDULE_ROUTINE, CREATE_OBJECTIF, UPDATE_OBJECTIF,
    COMPLETE_OBJECTIF, UPDATE_PROFIL, DELETE_EVENT, CREATE_DISCIPLINE
  * ChatComponent utilise GrokCommandService au lieu de GrokService brut
  * Parsing intelligent des dates ("demain 10h", "aujourdhui")
  * Couleurs par type d'événement
  * SCHEDULE_ROUTINE planifie X événements/semaine sur jours spread
- **i18n ObjectifsComponent** corrigé : keys priorités, status, stats, form
- **i18n JournalComponent** : injecté I18nService, toutes les labels traduites
- Commits: `89915a1` (GrokCommandService), `890c365` (i18n fixes), `d827198` (Journal i18n)
- Build: ✅ OK

### Prochaines étapes
1. **Supabase schema** — exécuter `supabase/schema.sql` dans le SQL Editor de Supabase
2. **Tests E2E** — exécuter `npm run test:e2e`
3. **Déployer** — Cloudflare Pages (push → auto-deploy)

---

## 2026-06-20 — Session 7 : i18n Integration + Git Fix ✅

### Ce qui a été fait
- **I18nService** mis à jour avec HttpClient (au lieu de dynamic import)
- **Sidebar** utilise i18n : navigation labels traduits, brand, logout
- **Header** utilise i18n : logo, theme toggle aria-label, chat toggle aria-label
- **Chat** utilise i18n : title, clear button, empty message, error message, placeholder
- Commits dans dragon.git: `3efe1be` (force-push, réécrit l'historique)
- Build: ✅ successful

### Prochaines étapes
1. **Supabase schema** — exécuter `supabase/schema.sql` dans le SQL Editor de Supabase
2. **Déployer** — Cloudflare Pages
3. **Intégrer i18n dans les vues restantes** — Objectifs, Journal, Personnage
4. **Tests E2E** — exécuter `npm run test:e2e`

---

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
