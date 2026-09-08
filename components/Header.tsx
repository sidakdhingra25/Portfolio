import { motion } from 'framer-motion'
import { Globe2, Sun, Search } from 'lucide-react'
import { reveal } from './animations'

export function Header() {
  return (
    <motion.header className="site-header" variants={reveal}>
      <div className="identity flex items-center">
        <div className="relative">
          <motion.div className="avatar" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }} aria-hidden="true" />
          <div className="absolute -top-2 -right-3 bg-[var(--surface)] text-[var(--muted)] border border-[var(--line)] rounded-full px-1.5 py-0.5 text-[10px] leading-none flex items-center justify-center shadow-sm">
            ...
          </div>
        </div>
        <div>
          <div className="name">Sidak Dhingra</div>
          <div className="eyebrow">Fullstack Developer and more...</div>
        </div>
      </div>
      <nav className="header-actions" aria-label="Quick actions">
        <button type="button" aria-label="Search"><Search /></button>
        <button type="button" aria-label="Language"><Globe2 /></button>
        <button type="button" aria-label="Display settings"><Sun /></button>
      </nav>
    </motion.header>
  )
}
