# 🐉 Dragon — Architecture Manifest & Context Index

This document serves as the map of the application's components and file structure. It allows developers and AI assistants to quickly understand the project's layout and locate components.

## Directory Conventions

- `src/app/core/`: Application singletons, global services (e.g. Auth, Supabase), models, and route guards.
- `src/app/shared/`: Globally reusable UI elements (e.g., buttons, inputs) that do not contain business/domain logic.
- `src/app/pages/`: Self-contained page views. All components specific to a page are located in a local `components/` subfolder.

---

## 🗂️ Page Components Registry

### 1. Hero Page (`src/app/pages/hero/`)
*Entry landing page (public).*
* **Main Component**: [hero.component.ts](file:///c:/Users/touat/Desktop/dragon/code/src/app/pages/hero/hero.component.ts)
* **Subcomponents** (located in `components/`):
  * `hero-nav`: Navigation bar with authentication links.
  * `hero-title`: Header section.
  * `hero-actions`: CTA buttons.

### 2. Login Page (`src/app/pages/login/`)
*Login form (public).*
* **Main Component**: [login.component.ts](file:///c:/Users/touat/Desktop/dragon/code/src/app/pages/login/login.component.ts)
* *Note: Integrates its own login cards and custom auth layouts directly.*

### 3. Register Page (`src/app/pages/register/`)
*User sign up form (public).*
* **Main Component**: [register.component.ts](file:///c:/Users/touat/Desktop/dragon/code/src/app/pages/register/register.component.ts)
* *Note: Integrates its own registration cards and custom auth layouts directly.*

### 4. Dashboard Page (`src/app/pages/dashboard/`)
*Main application area (protected).*
* **Main Component**: [dashboard.component.ts](file:///c:/Users/touat/Desktop/dragon/code/src/app/pages/dashboard/dashboard.component.ts)
* **Subcomponents** (located in `components/`):
  * `dashboard-header`: Top navigation bar.
  * `dashboard-sidebar`: Sidebar menu drawer.

---

## 🔗 Shared Components Registry (`src/app/shared/components/`)
* `button`: Custom action button supporting loader, states, and sizes.
* `input`: Input fields with standard styling.
