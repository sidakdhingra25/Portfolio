'use client'

import { motion } from 'framer-motion'
import { Header } from '../components/Header'
import { Intro } from '../components/Intro'
import { Projects } from '../components/Projects'

import { Feed } from '../components/Feed'
import { Systems } from '@/components/Systems'

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
        <Projects />
        <Systems />
        <Feed />
      </motion.div>
    </main>
  )
}

