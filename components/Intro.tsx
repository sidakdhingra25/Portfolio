import { motion } from 'framer-motion'
import { Briefcase, Code, Mail, AtSign, Globe2 } from 'lucide-react'
import { reveal } from './animations'

export function Intro() {
  return (
    <motion.section className="intro" variants={reveal} aria-labelledby="intro-title">
      <h1 id="intro-title" className="sr-only">Sidak Dhingra portfolio</h1>
      <p className="location flex items-center gap-1.5">
        23 years old, based in <span className="inline-flag">🇮🇳</span> India.
      </p>
      <p>
        Software developer at <span className="pill inline-flex items-center gap-1"><Briefcase className="w-3 h-3" /> QuadLabs</span>, 
        I build my own <span className="pill inline-flex items-center gap-1"><Code className="w-3 h-3" /> projects</span> in my free time 
        and pursue my other passions: coding challenges and <span className="pill inline-flex items-center gap-1"><Globe2 className="w-3 h-3" /> open source</span>.
      </p>
      <p>
        I believe a good interface stands out through what goes unnoticed. That's why I put real care into the details, the UX, and accessibility, with a constant drive to improve.
      </p>
      <p>
        Always open to new opportunities and connections, so feel free to reach out at <span className="pill inline-flex items-center gap-1"><AtSign className="w-3 h-3" /> justsidak</span> or by <span className="pill inline-flex items-center gap-1"><Mail className="w-3 h-3" /> email</span>.
      </p>
    </motion.section>
  )
}
