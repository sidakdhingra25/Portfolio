import { motion } from 'framer-motion'
import { reveal } from './animations'

const chips = [
  ['Pending', 'chip-pending'],
  ['In progress', 'chip-progress'],
  ['Submitted', 'chip-submitted'],
  ['Success', 'chip-success'],
  ['Failed', 'chip-failed'],
]

export function Toolkit() {
  return (
    <motion.section variants={reveal} aria-labelledby="toolkit-title">
      <h2 id="toolkit-title" className="section-title">Toolkit.</h2>
      <div className="toolkit-card">
        <div className="chip-list">{chips.map(([label, className]) => <span className={`status-chip ${className}`} key={label}>{label}</span>)}</div>
        <div className="tool-bars" aria-hidden="true"><span /><span /><span /></div>
      </div>
    </motion.section>
  )
}
