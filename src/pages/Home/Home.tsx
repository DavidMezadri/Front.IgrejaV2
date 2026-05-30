import { DATA } from '../../data/mockData'
import { usePageConfig } from '../../hooks/usePageConfig'
import HeroClassic from '../../components/organisms/HeroClassic/HeroClassic'
import StatsRow from '../../components/organisms/StatsRow/StatsRow'
import VerseStrip from '../../components/organisms/VerseStrip/VerseStrip'
import AppFooter from '../../components/organisms/AppFooter/AppFooter'

export default function Home() {
  const { data: config = {} } = usePageConfig()

  return (
    <main>
      <HeroClassic
        titulo={config['home.titulo']}
        subtitulo={config['home.subtitulo']}
        textoApoio={config['home.textoApoio']}
      />
      <StatsRow
        totalEventos={8}
        totalMinisterios={5}
        totalFamilias={120}
      />
      <VerseStrip versiculo={DATA.versiculoDoDia} />
      <AppFooter igreja={{
        nome: config['igreja.nome'] || DATA.igreja.nome,
        lema: config['igreja.lema'] || DATA.igreja.lema,
        endereco: config['igreja.endereco'] || DATA.igreja.endereco,
        telefone: config['igreja.telefone'] || DATA.igreja.telefone,
        email: config['igreja.email'] || DATA.igreja.email,
      }} />
    </main>
  )
}
