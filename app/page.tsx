'use client'

import { motion, LayoutGroup } from 'framer-motion'
import { Header } from '../components/Header'
import { Intro } from '../components/Intro'
import { Projects } from '../components/Projects'

import { Feed } from '../components/Feed'
import { Systems } from '@/components/Systems'
import { Footer } from '../components/Footer'

export default function Page() {
  return (
    <main className="portfolio-shell">
      <motion.div
        className="portfolio-frame"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      >
        <Header />
        <Intro />
        <LayoutGroup>
          <Projects />
          <Systems />
          <Feed />
          <Footer />
        </LayoutGroup>
      </motion.div>
    </main>
  )
}

