import { motion } from 'framer-motion'
import Image from 'next/image'
import { reveal } from './animations'

const projects = [
  { id: 'project-tippo', image: '/Screenshot 2026-09-09 034724.png' },
  { id: 'project-memory', image: '/Screenshot 2026-09-09 034750.png' },
  { id: 'project-finally', image: '/Screenshot 2026-09-09 034736.png' },
]

export function Projects() {
  return (
    <motion.section variants={reveal} aria-labelledby="projects-title">
      <div className="section-heading">
        <h2 id="projects-title">Projects.</h2>
      </div>
      <div className="project-grid">
        {projects.map((project, index) => (
          <motion.article key={project.id} className={`project-card ${project.id}`} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <div className="project-art" aria-hidden="true">
              <Image src={project.image} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" priority />
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  )
}
