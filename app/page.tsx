import { Header } from '../components/Header'
import { Intro } from '../components/Intro'
import { Projects } from '../components/Projects'
import { Feed } from '../components/Feed'
import { Systems } from '@/components/Systems'
import { Footer } from '../components/Footer'
import { PortfolioFrame } from '../components/PortfolioFrame'

export default function Page() {
  return (
    <main className="portfolio-shell">
      <PortfolioFrame>
        <Header />
        <Intro />
        <Projects />
        <Systems />
        <Feed />
        <Footer />
      </PortfolioFrame>
    </main>
  )
}

