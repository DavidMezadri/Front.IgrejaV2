# Guia de Estilização do Projeto

## Princípios

1. **ZERO inline styles** - Nunca use `style={{ ... }}`
2. **CSS Modules por padrão** - Cada componente tem seu próprio `.module.css`
3. **Global apenas para reutilizáveis** - Clientes, botões, inputs, utilitários
4. **Classes compostas** - Use múltiplas classes quando necessário

## Estrutura de Pastas

```
src/
├── styles/
│   ├── global.css          # Base: buttons, form inputs, typography, utilities
│   ├── tokens.css          # Design tokens (cores, spacing, etc)
│   ├── utilities.css       # Utility classes (.p-16, .text-muted, etc)
│   └── STYLING_GUIDE.md    # Este arquivo
│
├── components/
│   ├── atoms/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── Button.module.css    # Se precisar de variações específicas
│   │   ├── Input/
│   │   │   ├── Input.tsx
│   │   │   └── Input.module.css
│   │   └── ...
│   │
│   ├── molecules/
│   │   ├── GenericForm/
│   │   │   ├── GenericForm.tsx
│   │   │   └── GenericForm.module.css
│   │   └── ...
│   │
│   └── organisms/
│       └── DashboardCharts/
│           ├── DashboardCharts.module.css
│           └── *.tsx
│
└── pages/
    └── Admin/
        ├── Admin.module.css         # Classes compartilhadas entre páginas admin
        ├── AdminHome.tsx
        └── ...
```

## Padrão Global (global.css)

Use para estilos reutilizáveis em todo o app:

```css
/* Buttons - variações comuns */
.btn { ... }
.btn-primary { ... }
.btn-ghost { ... }

/* Form controls - aplicados diretamente */
.form-input { ... }
.form-select { ... }
.form-textarea { ... }
.form-checkbox { ... }

/* Typography */
h1, h2, h3 { ... }
.lead { ... }
.eyebrow { ... }

/* Utilities */
.p-16 { padding: 28px; }
.text-muted { font-size: 13px; color: var(--fg-muted); }
```

## Padrão CSS Modules

Cada componente/página tem seu próprio `.module.css`:

```tsx
// Input.tsx
import styles from './Input.module.css'

export default function Input(props) {
  return (
    <input 
      {...props}
      className="form-input"  // Global class
    />
  )
}

// GenericForm.tsx
import styles from './GenericForm.module.css'

export default function GenericForm() {
  return (
    <div className={styles.formCard}>
      <form className={styles.form}>
        <div className={styles.formGroup}>
          ...
        </div>
      </form>
    </div>
  )
}
```

## Padrão de Composição

Combine múltiplas classes:

```tsx
<div className={`${styles.info} ${styles.infoSection}`}>
  ...
</div>

<button className={styles.toggleBtn}>
  Clique
</button>
```

## Casos de Uso

### ✅ CORRETO - Use CSS Modules

```tsx
// Componente com estilos próprios
export default function Card() {
  return <div className={styles.card}>...</div>
}

// card.module.css
.card {
  padding: 24px;
  border-radius: var(--radius-lg);
  background: var(--surface);
}
```

### ✅ CORRETO - Use Global Classes

```tsx
// Para estilos reutilizáveis
<input className="form-input" />
<button className="btn btn-primary">Enviar</button>
<div className="p-16">Conteúdo</div>
```

### ❌ ERRADO - Não use inline styles

```tsx
// ❌ NUNCA FAÇA ISSO
<div style={{ padding: '28px', fontSize: '14px' }}>
  Conteúdo
</div>

// ✅ CORRETO
<div className="p-16">Conteúdo</div>
```

### ❌ ERRADO - Não misture estilos

```tsx
// ❌ Não combine inline + classe
<div className={styles.card} style={{ marginTop: '20px' }}>

// ✅ CORRETO - Use classe adicional
<div className={`${styles.card} ${styles.cardWithMargin}`}>
```

## Para Componentes Admin

Coloque estilos compartilhados em `Admin.module.css`:

```tsx
// AdminUsuarios.tsx
import styles from './Admin.module.css'

return (
  <div className={styles.tableContainer}>
    <table className={styles.table}>
      ...
    </table>
  </div>
)
```

Estilos específicos do componente em `GenericForm.module.css`:

```tsx
// GenericForm.tsx
import formStyles from './GenericForm.module.css'

return <div className={formStyles.formCard}>...</div>
```

## Resumo das Regras

| Situação | Solução |
|----------|---------|
| Estilo global, reutilizável | `global.css` |
| Classe auxiliar (.p-16, .text-muted) | `utilities.css` |
| Estilo do componente | `Component.module.css` |
| Estilo compartilhado entre páginas | `[Page].module.css` |
| Nunca, absolutamente nunca | `style={{ ... }}` |

