import { motion } from 'framer-motion'
import { Briefcase, Code, Mail, AtSign, Globe2 } from 'lucide-react'
import { reveal } from './animations'

export function Intro() {
  return (
    <motion.section className="intro" variants={reveal} aria-labelledby="intro-title">
      <h1 id="intro-title" className="sr-only">Sidak Dhingra portfolio</h1>

      <div className="mb-4">
        <div className="name text-xl mb-1">Sidak Dhingra</div>
        <div className="eyebrow text-sm">Full-stack Developer</div>
      </div>

      <p className="location flex items-center gap-1.5">
        I'm 23, based in <span className="inline-flag">🇮🇳</span> India.
      </p>
      <p>
        Currently working as a <strong>Software Developer at <a href="https://www.quadlabs.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-baseline gap-1 group"><img src="https://www.google.com/s2/favicons?domain=quadlabs.com&sz=32" alt="QuadLabs" className="w-4 h-4 self-center rounded-xs" /><span className="underline underline-offset-2">QuadLabs</span></a></strong>, building web applications while also spending my time outside work building my own projects, exploring new ideas, and experimenting with different technologies.
      </p>
      <p>
        Design-curious and drawn to creating simple, thoughtful interfaces. Interested in how design and code come together to make digital experiences feel intuitive and work well.
      </p>
      <p>
        Always learning, building, and figuring things out along the way.
      </p>
      <p>
        Always open to new opportunities and connections, so feel free to reach out at <a href="https://x.com/justsidak" target="_blank" rel="noopener noreferrer" className="pill inline-flex items-baseline gap-1"><img src="https://www.google.com/s2/favicons?domain=x.com&sz=32" alt="X" className="w-3 h-3 self-center rounded-xs" /> justsidak</a> or by <span className="pill inline-flex items-baseline gap-1"><Mail className="w-3 h-3 self-center" /> email</span>.
      </p>
    </motion.section>
  )
}
