# CSS Architecture Guide

## Overview

This project uses a hybrid CSS architecture combining:

- **Global CSS** for base styles, components, and utilities
- **CSS Modules** for component-scoped styling
- **Utility-First** approach for spacing, typography, and layout

---

## File Structure

```
src/styles/
├── global.css      — Base styles, typography, components, utilities
├── utilities.css   — Additional utility classes (gap, margin, radius, visibility)
└── tokens.css*     — CSS custom properties (colors, spacing, typography)
                       *Note: Check if file exists in project root or style directory
```

---

## Global CSS

### Base Styles

- **Typography**: h1-h4, p, a, button styling
- **App Shell**: `.app-shell`, `.app-scroll` for SPA layout
- **Spacing**: Block padding, container gutters
- **Form Controls**: Input, select, textarea, checkbox base styles

### Typography Utilities

```css
.eyebrow      /* Uppercase label with decorative line */
.lead         /* Larger, muted paragraph text */
.text-muted   /* Smaller, muted text */
.text-small   /* 12px text */
.text-label   /* 13px bold label */
```

### Form Controls

```css
.form-input    /* Text/email/number inputs */
.form-select   /* Select dropdowns */
.form-textarea /* Textarea fields */
.form-checkbox /* Checkbox inputs */
```

**Features**:

- Consistent padding: 10px 12px
- Border: 1px solid var(--line)
- Border radius: 6px
- Focus state: box-shadow with accent color
- Width: 100% (fills parent container)

### Spacing Utilities

```css
/* Margin Top */
.mt-4 { margin-top: 4px; }
.mt-6 / .mt-8 / .mt-12 / .mt-16 / .mt-24 / .mt-28

/* Margin Bottom */
.mb-4 / .mb-6 / .mb-8 / .mb-16

/* Padding */
.p-4 / .p-8 / .p-12 / .p-16
```

### Layout Utilities

```css
.grid-2cols       /* 2-column grid, responsive to 1 col on mobile (max-width: 768px) */
.row-flex         /* Flex row with 16px gap */
.flex-center      /* Centered flex container */
.flex-col         /* Flex column */
```

### Button Styles

```css
.btn              /* Base button (12px 20px padding, rounded) */
.btn-primary      /* Dark background, hover to accent */
.btn-ghost        /* Transparent with border, hover to surface background */
```

---

## Utilities CSS

Additional utility classes for common patterns:

### Margin Utilities

```css
.mx-auto          /* Center content horizontally */
```

### Gap Utilities (for flex/grid)

```css
.gap-4 / .gap-8 / .gap-12 / .gap-16
```

### Border Radius

```css
.rounded-md       /* 6px border-radius */
.rounded-lg       /* var(--radius-lg) border-radius */
```

### Visibility

```css
.hidden           /* display: none */
.sr-only          /* Screen reader only (visually hidden) */
```

---

## CSS Modules (Component-Scoped)

### Naming Convention

- **camelCase** for class names
- **Component-specific** styling only
- **Flat structure** (avoid deep nesting)

### When to Use Module CSS vs Global

| Use Global CSS              | Use Module CSS                                  |
| --------------------------- | ----------------------------------------------- |
| Form controls (.form-input) | Component layout (.card, .grid)                 |
| Spacing utilities (.mt-16)  | Component-specific variants (.cardHighlight)    |
| Button base styles (.btn)   | Sub-component elements (.cardHeader, .cardBody) |
| Typography (h1-h4)          | Component-specific typography overrides         |

### Common Module Patterns

#### .card Pattern

```css
.card {
  padding: 22px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--surface);
}

.card h3 {
  /* Component-specific heading */
}
.card p {
  /* Component-specific paragraph */
}
```

#### .grid Pattern

```css
.grid {
  display: grid;
  grid-template-columns: /* component-specific */;
  gap: /* component-specific */;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

#### .row Pattern

```css
.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 600px) {
  .row {
    grid-template-columns: 1fr;
  }
}
```

---

## CSS Variables (Tokens)

### Color Tokens

```css
--bg              /* Background */
--surface         /* Elevated surface */
--surface-muted   /* Muted surface */
--fg              /* Foreground/text */
--fg-muted        /* Muted text */
--line            /* Border color */
--line-strong     /* Stronger border */
--accent          /* Accent/danger color */
--ok              /* Success color */
```

### Spacing Tokens

```css
--radius          /* Default border-radius (6px) */
--radius-lg       /* Large border-radius */
```

### Font Tokens

```css
--font-sans       /* Body font */
--font-display    /* Heading font */
```

---

## Best Practices

### 1. Remove Inline Styles

❌ Don't:

```jsx
<button style={{ marginTop: '16px' }}>
```

✅ Do:

```jsx
<button className="mt-16">
```

### 2. Use Full-Width Inputs

Global form controls already have `width: 100%`, so inputs fill their containers:

```jsx
<input className="form-input" /> /* Already 100% width */
```

### 3. Scope Component Styles

❌ Don't pollute global namespace:

```css
/* In global.css */
.card {
  /* generic */
}
.title {
  /* too generic */
}
```

✅ Keep component-specific styles in modules:

```css
/* In MyComponent.module.css */
.card {
  /* specific to MyComponent */
}
.title {
  /* specific to MyComponent */
}
```

### 4. Use Utility Classes for Common Patterns

```jsx
/* Good: Reusable spacing */
<div className="mt-16 mb-8 p-12">

/* Avoid: Inline styles for common patterns */
<div style={{ marginTop: '16px', marginBottom: '8px', padding: '12px' }}>
```

### 5. Responsive Design

Use global media queries breakpoints:

```css
@media (max-width: 880px) {
  /* Sidebar threshold */
}
@media (max-width: 768px) {
  /* Grid threshold */
}
@media (max-width: 720px) {
  /* Small device threshold */
}
@media (max-width: 600px) {
  /* Mobile threshold */
}
```

---

## Common Issues & Solutions

### Issue: Form inputs not full-width

**Solution**: Use `.form-input` class (has `width: 100%`)

### Issue: Buttons not centered

**Solution**: Use `.form-actions` wrapper (has `justify-content: center`)

### Issue: Inline styles overriding classes

**Solution**: Move inline styles to module CSS or use utility classes

### Issue: Spacing inconsistency

**Solution**: Use utility classes (`.mt-16`, `.p-12`, etc.) instead of custom values

---

## Migration Checklist

When refactoring a component:

- [ ] Remove inline `style={{ }}` props
- [ ] Replace with utility classes (`.mt-*`, `.p-*`, etc.)
- [ ] Use `.form-input`, `.form-select`, `.form-textarea` for form controls
- [ ] Keep component-specific styling in `.module.css`
- [ ] Verify build passes: `npm run build`
- [ ] Test in browser for visual regression
- [ ] Remove redundant CSS from module file

---

## CSS Consolidation Progress

| Phase | Status      | Description                                                          |
| ----- | ----------- | -------------------------------------------------------------------- |
| 1     | ✅ Complete | Global utilities added (form controls, spacing, text, layout)        |
| 2     | ✅ Complete | Removed inline styles from GenericForm, AdminConfiguracoes           |
| 3     | ✅ Complete | Consolidated form styling from Bible, Prayer, AdminEndpoints modules |
| 4     | ✅ Complete | Created utilities.css with gap, margin, radius, visibility           |
| 5     | ✅ Complete | Audited naming patterns across 26 module files                       |
| 6     | 🟡 Planned  | Remove remaining duplicate patterns incrementally                    |
| 7     | ✅ Complete | CSS documentation (this file)                                        |

---

## Resources

- [CSS Variables Documentation](../tokens.css)
- [Global CSS](./global.css)
- [Utilities CSS](./utilities.css)
- [Atomic Design Pattern](https://atomicdesign.bradfrost.com/) — Project structure follows this
