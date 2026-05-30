# AsyncSearchSelect

Componente reutilizável para busca assíncrona com dropdown de seleção.

## Características

- 🔍 Busca assíncrona com debounce configurável
- 📝 Suporta qualquer tipo de dado através da função `onSearch`
- ✨ Dropdown inteligente com feedback de carregamento
- 🎯 Controlado (value + onChange)
- ♿ Acessível

## Uso Básico

```tsx
import { AsyncSearchSelect } from '@/components/molecules/AsyncSearchSelect'
import pessoasService from '@/services/pessoasService'

function MyComponent() {
  const [responsavelId, setResponsavelId] = useState<number | null>(null)

  async function buscarPessoas(query: string) {
    const todas = await pessoasService.list()
    return todas
      .filter(p => p.nome.toLowerCase().includes(query.toLowerCase()))
      .map(p => ({ id: p.id, label: p.nome }))
  }

  return (
    <AsyncSearchSelect
      label="Responsável"
      placeholder="Buscar pessoa..."
      value={responsavelId}
      onChange={(id) => setResponsavelId(id as number)}
      onSearch={buscarPessoas}
    />
  )
}
```

## Props

| Prop | Type | Default | Descrição |
|------|------|---------|-----------|
| `label` | `string` | — | Label do campo |
| `placeholder` | `string` | `'Digite para buscar...'` | Placeholder do input |
| `value` | `string \| number \| null` | — | Valor selecionado |
| `onChange` | `(value, item?) => void` | — | Callback quando seleção muda |
| `onSearch` | `(query) => Promise<AsyncSelectOption[]>` | — | Função async que busca as opções |
| `required` | `boolean` | `false` | Campo obrigatório? |
| `disabled` | `boolean` | `false` | Desabilitar input? |
| `minChars` | `number` | `1` | Mínimo de caracteres para buscar |
| `debounceMs` | `number` | `300` | Delay em ms para debounce |
| `noResultsText` | `string` | `'Nenhum resultado encontrado'` | Mensagem sem resultados |
| `loadingText` | `string` | `'Carregando...'` | Mensagem de carregamento |

## Exemplos de Uso

### Com Famílias
```tsx
async function buscarFamilias(query: string) {
  const todas = await familiasService.list()
  return todas
    .filter(f => f.nomeFamilia.toLowerCase().includes(query.toLowerCase()))
    .map(f => ({ id: f.id, label: f.nomeFamilia }))
}

<AsyncSearchSelect
  label="Família"
  value={familiaId}
  onChange={(id) => setFamiliaId(id)}
  onSearch={buscarFamilias}
/>
```

### Com Usuários
```tsx
async function buscarUsuarios(query: string) {
  const todos = await usuariosService.list()
  return todos
    .filter(u => u.nome.toLowerCase().includes(query.toLowerCase()))
    .map(u => ({ id: u.id, label: u.nome }))
}

<AsyncSearchSelect
  label="Usuário"
  placeholder="Buscar usuário..."
  value={usuarioId}
  onChange={(id, usuario) => {
    setUsuarioId(id)
    console.log('Usuário selecionado:', usuario)
  }}
  onSearch={buscarUsuarios}
  minChars={2}
  debounceMs={400}
/>
```

## TypeScript

```tsx
import { AsyncSelectOption } from '@/components/molecules/AsyncSearchSelect'

interface Pessoa {
  id: number
  nome: string
  email: string
}

// Type-safe ao retornar dados
function convertPessoasToOptions(pessoas: Pessoa[]): AsyncSelectOption[] {
  return pessoas.map(p => ({
    id: p.id,
    label: p.nome,
    email: p.email, // Dados extras disponíveis
  }))
}
```

