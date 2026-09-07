# Agent Rules & Frontend Architectural Guidelines

This document defines the strict development, architectural, and coding standards for this project. All AI agents and developers working on this frontend codebase must follow these rules.

---

## 1. Core Technology Stack

Build and maintain this project exclusively as a **React + Vite frontend application**.
Do not include backend, mobile-app, or React Native conventions.

* **Framework & Core**: React using functional components and hooks.
* **Build Tool**: Vite.
* **Routing**: React Router (`react-router-dom`).
* **Styling**: Tailwind CSS as the primary styling system.
* **HTTP Client**: Axios with a centralized shared instance (`src/api/axiosInstance.js`).
* **Icons**: Lucide React (`lucide-react`) and other icon libraries as needed.
* **Forms**: React Hook Form for complex forms.
* **Notifications**: React Hot Toast for success and error toast notifications.
* **Language**: JavaScript with JSX (`.jsx`) unless TypeScript is explicitly requested.
* **Restrictions**: Do not introduce another CSS framework or component library (e.g. Bootstrap, MUI, Chakra, AntD) unless explicitly requested.

---

## 2. Directory & File Structure

All frontend source code resides under `src/` organized by responsibility:

```
src/
├── api/
│   └── axiosInstance.js       # Centralized Axios client & interceptors
├── assets/                    # Static assets (images, icons, media)
├── components/                # Reusable presentation UI components
│   └── SharedComponent.jsx
├── config/                    # Environment variables and app configuration
│   └── env.js
├── contexts/                  # Global React Context providers (state management)
│   └── AuthContext.jsx
├── pages/                     # Route-level screens / view containers
│   └── FeaturePage.jsx
├── services/                  # Domain-specific API calls & server operations
│   └── feature.service.js
├── utils/                     # Pure utility helpers and transformations
│   └── feature.utils.js
├── App.jsx                    # Root routing and application composition
├── index.css                  # Global Tailwind styles & directives
└── main.jsx                   # Vite application entry point
```

### Folder Responsibilities:
* `pages/`: Route-level screens; coordinates UI behavior and connects services to presentation.
* `components/`: Reusable, modular UI components focused on presentation.
* `services/`: API communication, feature-specific server calls, data fetching.
* `api/`: Shared Axios configuration, base URL, headers, and request/response interceptors.
* `contexts/`: Global application state (e.g., authentication, session management).
* `utils/`: Pure helper functions, formatters, and data transformation logic.
* `config/`: Environment configuration (`VITE_*`) and runtime constants.
* `assets/`: Local static assets, logos, and images.

---

## 3. File Naming Conventions

Maintain strict naming consistency across all files:

| Type | Format | Example |
| :--- | :--- | :--- |
| **React Components** | `PascalCase.jsx` | `LocationSection.jsx`, `AppShell.jsx` |
| **Pages** | `PascalCase.jsx` | `ShopSetup.jsx`, `PatientDashboard.jsx` |
| **Contexts** | `PascalCaseContext.jsx` or `PascalCase.jsx` | `AuthContext.jsx` |
| **API Services** | `feature.service.js` *(singular)* | `payment.service.js`, `patient.service.js` |
| **Utilities** | `feature.utils.js` | `geo.utils.js`, `format.utils.js` |
| **Axios Instance** | `api/axiosInstance.js` | `src/api/axiosInstance.js` |

* **Rule**: Always use the singular `.service.js` suffix (e.g. `patient.service.js`). Do not use `.services.js` unless already established for that specific module.

---

## 4. Component Rules

* **Functional Components Only**: Use functional React components with standard hooks (`useState`, `useEffect`, `useContext`, `useNavigate`, `useLocation`, etc.).
* **Single Responsibility**: Keep components focused on one responsibility. Extract repeated UI blocks into reusable components.
* **No Direct Heavy API Logic in Presentational Components**: Do not place large API calls or network orchestration directly inside reusable presentational components. Pass data and callbacks via props or custom hooks.
* **Readability & Naming**:
  * Use clear, descriptive variable and function names.
  * Avoid single-letter variables (e.g., use `patient` or `profile` instead of `p`).
  * Keep JSX clean and avoid deeply nested ternary expressions.
* **List Keys**: Always use stable, unique keys (such as `item.id`) when rendering lists; never use array indices as keys for dynamic lists.
* **Comprehensive States**: Explicitly handle **loading**, **empty**, **success**, and **error** states on all data-driven components.

---

## 5. Routing Rules

* **React Router**: Define application routes in `App.jsx` using declarative `<Routes>` and `<Route>` components.
* **Separation of Access**:
  * Clearly separate public routes (e.g. `/`, `/login`, `/register`) from protected routes.
  * Use reusable route guards:
    * `ProtectedRoute`: Authenticated gatekeeper checking login status.
    * `RoleProtectedRoute`: Authorization gatekeeper checking user roles.
  * Redirect unauthenticated users to `/login`, preserving their target URL (`state: { from: location }`).
  * Automatically redirect authenticated users away from guest pages (like `/login` or `/register`) when appropriate.
* **Layout Wrappers**: Wrap authenticated pages with a shared shell/layout component.
* **URL Formatting**: Keep all route paths lowercase and kebab-case (e.g. `/patient/dashboard`, `/triage-nurse`).

---

## 6. API & Network Communication Rules

* **Centralized Axios Client**:
  * Always use the shared Axios instance from `src/api/axiosInstance.js`.
  * Never instantiate separate `axios.create()` instances inside pages or components.
* **Environment Variables**:
  * Store the API base URL in `VITE_API_URL` (configured via `src/config/env.js`).
  * Never hardcode backend URLs, secrets, or private API keys in client source code.
* **Service Encapsulation**:
  * Keep all API calls inside `src/services/`.
  * Export small, named functions from service files.
  * Avoid constructing raw request bodies inside page JSX.
* **Error Handling & Interceptors**:
  * Use Axios interceptors for shared behavior: attaching authorization tokens, handling expired sessions (401), and global error handling.
  * Return or re-throw sanitized errors consistently so caller components can handle or display toast notifications.

```javascript
// Example service: src/services/item.service.js
import api from '../api/axiosInstance';

export const getItems = () => {
  return api.get('/items');
};

export const createItem = (payload) => {
  return api.post('/items', payload);
};
```

---

## 7. State Management Rules

* **Local vs Global**:
  * Use local state (`useState`, `useReducer`) for page-specific or UI-only states (modals, active tabs, form inputs).
  * Use React Context (`src/contexts/`) for global cross-cutting state (e.g. authenticated user, session data, permissions).
  * Do not add Redux, MobX, or other third-party state managers unless explicitly requested.
* **Context Design**:
  * Expose clear, predictable actions from context (e.g. `login`, `logout`, `checkAuth`, `selectProfile`).
  * Clean up authentication tokens, cookie sessions, and Axios authorization headers during `logout`.
  * Handle initial verification loading states cleanly before rendering protected screens.

---

## 8. Styling & Visual Design Rules

* **Tailwind CSS First**:
  * Use Tailwind utility classes directly in JSX.
  * Keep `index.css` limited to Tailwind directives (`@theme`, `@import "tailwindcss"`, base body styles, and keyframe animations).
  * Do not create separate `.css` or `.module.css` files per component.
* **Responsive Layouts**:
  * Build mobile-friendly layouts first.
  * Use standard responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`.
  * Tables must be horizontally scrollable on mobile screens (`overflow-x-auto`).
* **Design Aesthetic**:
  * Restrained, professional dashboard aesthetic.
  * White content surfaces (`bg-white`), subtle neutral backgrounds (`bg-gray-50` or `#f4f9f7`), crisp borders (`border-gray-200` or `#d1e2dc`), and high-contrast typography (`text-gray-900` / `#143337`).
  * Consistent border-radius (`rounded-xl`, `rounded-2xl`) and shadow levels.
* **Icons & Buttons**:
  * Use Lucide React icons (`lucide-react`) or configured icon packs (e.g. `@remixicon/react`). Never hand-craft inline SVG paths when library icons exist.
  * Icon-only buttons must include an accessible `aria-label` or `title`.
  * Provide visible hover, focus-visible, active, and disabled states on interactive elements.

---

## 9. UX, Feedback & Accessibility

* **Toast Notifications**:
  * Use `react-hot-toast` for short-lived feedback (e.g., *"Profile updated successfully"*, *"Session expired"*).
  * Do not use toast for persistent, essential information that users must continuously see.
* **Accessibility**:
  * Use semantic HTML elements (`<main>`, `<header>`, `<nav>`, `<section>`, `<article>`, `<button>`).
  * Do not rely solely on color to convey status (e.g., include icons and textual indicators).
  * Provide confirmation modals/prompts before destructive actions (e.g. delete, logout).

---

## 10. Code Quality & Maintenance

* **Preserve Project Structure**: Adhere strictly to the established file locations and conventions.
* **Focused Changes**: Make the smallest change required to solve the task. Do not reformat or rewrite unrelated files.
* **Reuse Over Duplication**: Check existing components, services, and utils before creating new ones.
* **Clean Code**:
  * Write self-explanatory code with clean function signatures.
  * Add comments only for non-obvious business logic, workarounds, or regulatory constraints.
  * Do not commit changes unless explicitly requested.

---

## 11. Checklist Before Completing Any Change

Before finishing any change, verify:
- [ ] New and modified files follow `PascalCase.jsx` (components/pages) and `feature.service.js` (services) conventions.
- [ ] API requests go through the services layer and utilize the shared Axios instance.
- [ ] Styling strictly adheres to Tailwind CSS without ad-hoc inline styles.
- [ ] Loading, error, empty, and success states are handled.
- [ ] Authentication guards and role protection logic are preserved.
- [ ] Application builds without errors (`npm run build`).
- [ ] Files changed and verification steps are accurately reported.
