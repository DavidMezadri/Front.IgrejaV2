import HeroClassic from '../../components/organisms/HeroClassic/HeroClassic'
import StatsRow from '../../components/organisms/StatsRow/StatsRow'
import VerseStrip from '../../components/organisms/VerseStrip/VerseStrip'
import AppFooter from '../../components/organisms/AppFooter/AppFooter'

export default function Home() {
  return (
    <main>
      <HeroClassic />
      <StatsRow />
      <VerseStrip />
      <AppFooter />
    </main>
  )
}
