# UI styles and integration notes

Files added:

- `ui.css` — Core UI styles: themes (light/dark), responsive layout, pagination, toast styles and AOS helpers.
- `theme.js` — Small helper module that exports `initUI`, `initThemeToggle`, `initMobileMenu`, `initToasts`, and `showToast`.

Quick integration steps (frontend):

1. Install AOS (Animate On Scroll) in your frontend root:

   npm install aos --save

2. Import styles and JS in `main.jsx` (or top-level entry):

   import './styles/ui.css'
   import AOS from 'aos'
   import 'aos/dist/aos.css'
   import { initUI } from './styles/theme'

   // then initialize:
   AOS.init({ duration: 700, once: true })
   initUI()

3. Add markup hooks where appropriate (e.g., in `Header.jsx`):

   - Theme toggle button: <button data-theme-toggle aria-pressed="false">🌓</button>
   - Mobile toggle: <button data-mobile-toggle aria-expanded="false">☰</button>
   - Mobile menu element: <nav data-mobile-menu className="mobile-menu closed">...</nav>
   - Toast container (if you prefer manual placement): <div className="toast-container" />

4. Using toasts from anywhere in the app (after `initUI()`):

   window.showToast('Saved successfully', 'success', 3500)

Notes:

- The CSS uses CSS variables and `.theme-dark` to switch dark mode. You can toggle by adding/removing `.theme-dark` to `document.documentElement`.
- Pagination styles assume you render a `ul.pagination > li` structure. Interactivity (click handlers) is left to React components.
- AOS classes can be applied directly to elements (e.g., `data-aos="fade-up"`) and will animate when scrolled.

If you want, I can also:

- Add the theme toggle button into `frontend/src/components/Header.jsx` and wire the mobile toggle there.
- Auto-import `ui.css` and `theme.js` in `main.jsx` for you and initialize AOS.
