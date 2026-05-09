import { useState } from 'react'
import styles from './Bible.module.css'

const LIVROS = ["Gênesis","Êxodo","Salmos","Provérbios","Isaías","Mateus","Marcos","Lucas","João","Romanos","Efésios","Filipenses","Hebreus","Apocalipse"]

export default function Bible() {
  const [livro, setLivro] = useState("Salmos")

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
            <select defaultValue="ARA">
              <option>ARA — Almeida Revista e Atualizada</option>
              <option>NVI — Nova Versão Internacional</option>
              <option>NAA — Nova Almeida Atualizada</option>
            </select>
            <h3>Livro</h3>
            <select value={livro} onChange={e => setLivro(e.target.value)}>
              {LIVROS.map(l => <option key={l}>{l}</option>)}
            </select>
            <h3>Capítulo</h3>
            <select defaultValue="23">
              {Array.from({ length: 30 }).map((_, i) => <option key={i}>{i + 1}</option>)}
            </select>
            <h3>Buscar</h3>
            <input placeholder="Ex: graça, pastor, paz…" />
          </aside>
          <div className={styles.text}>
            <div className={styles.ref}>{livro} · capítulo 23</div>
            <h2>O Senhor é o meu pastor</h2>
            <p>
              <sup>1</sup>O Senhor é o meu pastor; nada me faltará.{' '}
              <sup>2</sup>Ele me faz repousar em pastos verdejantes; leva-me para junto das águas de descanso.{' '}
              <sup>3</sup>Refrigera-me a alma; guia-me pelas veredas da justiça por amor do seu nome.{' '}
              <sup>4</sup>Ainda que eu ande pelo vale da sombra da morte, não temerei mal nenhum, porque tu estás comigo;
              a tua vara e o teu cajado me consolam.{' '}
              <sup>5</sup>Preparas-me uma mesa na presença dos meus adversários; unges-me a cabeça com óleo;
              o meu cálice transborda.{' '}
              <sup>6</sup>Bondade e misericórdia certamente me seguirão todos os dias da minha vida;
              e habitarei na Casa do Senhor para todo o sempre.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
