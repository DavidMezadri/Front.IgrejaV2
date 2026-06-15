import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import styles from './Bible.module.css'

const LIVROS_NOMES = [
  'Gênesis', 'Êxodo', 'Levítico', 'Números', 'Deuteronômio',
  'Josué', 'Juízes', 'Rute', '1 Samuel', '2 Samuel',
  '1 Reis', '2 Reis', '1 Crônicas', '2 Crônicas', 'Esdras',
  'Neemias', 'Ester', 'Jó', 'Salmos', 'Provérbios',
  'Eclesiastes', 'Cântico dos Cânticos', 'Isaías', 'Jeremias', 'Lamentações',
  'Ezequiel', 'Daniel', 'Oséias', 'Joel', 'Amós',
  'Obadias', 'Jonas', 'Miqueias', 'Naum', 'Habacuque',
  'Sofonias', 'Ageu', 'Zacarias', 'Malaquias',
  'Mateus', 'Marcos', 'Lucas', 'João', 'Atos',
  'Romanos', '1 Coríntios', '2 Coríntios', 'Gálatas', 'Efésios',
  'Filipenses', 'Colossenses', '1 Tessalonicenses', '2 Tessalonicenses', '1 Timóteo',
  '2 Timóteo', 'Tito', 'Filemom', 'Hebreus', 'Tiago',
  '1 Pedro', '2 Pedro', '1 João', '2 João', '3 João',
  'Judas', 'Apocalipse',
]

export default function Bible() {
  const [livro, setLivro] = useState(19) // Salmos
  const [capitulo, setCapitulo] = useState(23)
  const [traducao, setTraducao] = useState(1) // AA
  const [inicio, setInicio] = useState(1)
  const [fim, setFim] = useState(10)

  // Traduções hardcoded (evita chamadas desnecessárias)
  const traducoes = [
    { id: 1, nome: 'Almeida Atualizada', abreviacao: 'AA' },
    { id: 2, nome: 'Almeida Corrigida Fiel', abreviacao: 'ACF' },
    { id: 3, nome: 'Nova Versão Internacional', abreviacao: 'NVI' },
  ]

  // Usar a mesma URL base dos demais endpoints
  const apiUrl = import.meta.env.VITE_API_URL;

  // Buscar versículos do backend
  const { data: versiculos = [], isLoading, error } = useQuery({
    queryKey: ['versiculos', livro, capitulo, traducao, inicio, fim],
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      try {
        const response = await fetch(
          `${apiUrl}/versiculos/livro/${livro}/capitulo/${capitulo}/traducao/${traducao}/intervalo?inicio=${inicio}&fim=${fim}`,
          { signal: controller.signal }
        );

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      } finally {
        clearTimeout(timeoutId);
      }
    },
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })

  const livroNome = LIVROS_NOMES[livro - 1]
  const traducaoAtual = traducoes.find((t: any) => t.id === traducao)

  // Renderizar versículos como HTML com números em superscript
  const renderVersiculos = () => {
    if (isLoading) return <p className="text-gray-500">Carregando...</p>
    if (error) return <p className="text-red-500">Erro ao carregar versículos</p>
    if (versiculos.length === 0) return <p className="text-gray-500">Nenhum versículo encontrado</p>

    return (
      <p>
        {versiculos.map((versiculo, idx) => (
          <span key={versiculo.id}>
            <sup>{versiculo.numero}</sup>
            {versiculo.texto}
            {idx < versiculos.length - 1 && ' '}
          </span>
        ))}
      </p>
    )
  }

  const maxCapitulos = useMemo(() => {
    // Número máximo de capítulos por livro (aproximado)
    const maxByBook: { [key: number]: number } = {
      1: 50, 2: 40, 3: 27, 4: 36, 5: 34, 6: 24, 7: 21, 8: 4, 9: 31, 10: 24,
      11: 22, 12: 25, 13: 29, 14: 36, 15: 10, 16: 13, 17: 10, 18: 42, 19: 150, 20: 31,
      21: 12, 22: 8, 23: 66, 24: 52, 25: 5, 26: 48, 27: 12, 28: 14, 29: 3, 30: 9,
      31: 1, 32: 4, 33: 7, 34: 3, 35: 3, 36: 3, 37: 2, 38: 14, 39: 4,
      40: 28, 41: 16, 42: 24, 43: 21, 44: 28, 45: 16, 46: 16, 47: 13, 48: 6, 49: 6,
      50: 4, 51: 4, 52: 3, 53: 3, 54: 3, 55: 5, 56: 5, 57: 4, 58: 13, 59: 5,
      60: 5, 61: 3, 62: 3, 63: 3, 64: 1, 65: 3, 66: 22,
    }
    return maxByBook[livro] || 30
  }, [livro])

  return (
    <section className="block" id="biblia">
      <div className="container">
        <div className="block-head">
          <div>
            <div className="eyebrow">06 — Bíblia</div>
            <h2>Leitura online</h2>
          </div>
        </div>
        <div className={styles.bible}>
          <aside className={styles.side}>
            <h3>Versão</h3>
            <select value={traducao} onChange={e => setTraducao(Number(e.target.value))}>
              {traducoes.map((t: any) => (
                <option key={t.id} value={t.id}>
                  {t.abreviacao} — {t.nome}
                </option>
              ))}
            </select>

            <h3>Livro</h3>
            <select value={livro} onChange={e => {
              setLivro(Number(e.target.value))
              setCapitulo(1)
            }}>
              {LIVROS_NOMES.map((nome, idx) => (
                <option key={idx} value={idx + 1}>
                  {idx + 1}. {nome}
                </option>
              ))}
            </select>

            <h3>Capítulo</h3>
            <select value={capitulo} onChange={e => setCapitulo(Number(e.target.value))}>
              {Array.from({ length: maxCapitulos }).map((_, i) => (
                <option key={i}>{i + 1}</option>
              ))}
            </select>

            <h3>Intervalo de versículos</h3>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                value={inicio}
                onChange={e => setInicio(Number(e.target.value))}
                placeholder="Início"
                className="flex-1 px-2 py-1 border rounded"
              />
              <input
                type="number"
                min="1"
                value={fim}
                onChange={e => setFim(Number(e.target.value))}
                placeholder="Fim"
                className="flex-1 px-2 py-1 border rounded"
              />
            </div>
          </aside>

          <div className={styles.text}>
            <div className={styles.ref}>
              {livroNome} · capítulo {capitulo}
              {traducaoAtual && ` (${traducaoAtual.abreviacao})`}
            </div>
            <h2>
              {livroNome} {capitulo}:{inicio}
              {inicio !== fim && `-${fim}`}
            </h2>
            {renderVersiculos()}
          </div>
        </div>
      </div>
    </section>
  )
}
