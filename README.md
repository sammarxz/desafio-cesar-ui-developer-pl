# Candidate Registration - CESAR

Single-page candidate registration form built with vanilla HTML5, CSS3, and JavaScript. No frameworks, no build tools.

## How to Run

Serve the static files with any HTTP server:

```bash
# Python
python3 -m http.server 8000

# Node.js
npx serve .
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

## Browser Support

Latest 2 versions of Firefox, Chrome, Edge, and Safari.

## Project Structure

```
.
├── index.html          # Semantic HTML5 with ARIA attributes
├── script.js           # Form validation, phone selector, file upload
├── css/
│   ├── main.css        # Entry point (imports all partials)
│   ├── base/
│   │   ├── _tokens.css # Design tokens (colors, spacing, typography)
│   │   └── _reset.css  # CSS reset
│   ├── layout/
│   │   ├── _page.css   # Page container
│   │   └── _form-grid.css # Responsive form grid
│   ├── modules/
│   │   ├── _nav.css
│   │   ├── _main.css
│   │   ├── _form-field.css
│   │   ├── _phone-select.css
│   │   ├── _file-upload.css
│   │   ├── _btn.css
│   │   └── _footer.css
│   └── utilities/
│       ├── _helpers.css # Reusable utility classes
│       └── _a11y.css    # Reduced motion support
└── img/                 # SVG icons and logo
```

## Design Decisions

- **System font stack** (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`) for native look across platforms
- **CSS custom properties** for design tokens, enabling consistent visual identity across internal services
- **BEM naming** for predictable, maintainable class names
- **Mobile-first** responsive approach with breakpoints at 768px (tablet) and 1024px (desktop)
- **Accessibility**: ARIA attributes (`aria-expanded`, `aria-selected`, `role="listbox"`), proper `<label>` associations, `prefers-reduced-motion` support
- **No dependencies**: zero external CSS or JS libraries
