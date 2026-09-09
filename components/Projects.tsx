import { motion } from 'framer-motion'
import Image from 'next/image'
import { reveal } from './animations'

const projects = [
  { id: 'project-tippo', image: '/Screenshot 2026-09-09 034724.png', name: 'Lorem', desc: 'Lorem ipsum dolor sit amet.' },
  { id: 'project-memory', image: '/Screenshot 2026-09-09 034750.png', name: 'Schelo', desc: 'Schelo ipsum dolor sit amet.' },
  { id: 'project-finally', image: '/Screenshot 2026-09-09 034736.png', name: 'Ipsum', desc: 'Ipsum dolor sit amet.' },
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
              <Image src={project.image} alt={project.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority />
            </div>
            <div className="project-meta">
              <strong>{project.name}</strong>
            </div>
            <div className="project-desc">
              {project.desc}
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  )
}
