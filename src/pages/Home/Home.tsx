import { DATA } from '../../data/mockData'
import { useEventos } from '../../hooks/useEventos'
import { useMinisterios } from '../../hooks/useMinisterios'
import { useFamilias } from '../../hooks/useFamilias'
import HeroClassic from '../../components/organisms/HeroClassic/HeroClassic'
import StatsRow from '../../components/organisms/StatsRow/StatsRow'
import VerseStrip from '../../components/organisms/VerseStrip/VerseStrip'
import AppFooter from '../../components/organisms/AppFooter/AppFooter'

export default function Home() {
  const { data: eventos = [] } = useEventos()
  const { data: ministerios = [] } = useMinisterios()
  const { data: familias = [] } = useFamilias()

  return (
    <main>
      <HeroClassic />
      <StatsRow
        totalEventos={eventos.length}
        totalMinisterios={ministerios.length}
        totalFamilias={familias.length}
      />
      <VerseStrip versiculo={DATA.versiculoDoDia} />
      <AppFooter igreja={DATA.igreja} />
    </main>
  )
}
