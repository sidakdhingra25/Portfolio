'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { reveal } from './animations'

type Project = {
  id: string;
  name: string;
  desc: string;
  image?: string;
  video?: string;
}

const projects: Project[] = [
  { id: 'project-tippo', video: '/PinGrab_1788980631473.mp4', name: 'Lorem', desc: 'Lorem ipsum dolor sit amet.' },
  { id: 'project-memory', video: '/PinGrab_1788980653499.mp4', name: 'Schelo', desc: 'Schelo ipsum dolor sit amet.' },
  { id: 'project-finally', image: '/Screenshot 2026-09-09 034724.png', name: 'Ipsum', desc: 'Ipsum dolor sit amet.' },
]

export function Projects() {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({})

  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([id, video]) => {
      if (!video) return
      if (selectedId === id) {
        video.pause()
      } else {
        video.play().catch(() => {})
      }
    })
  }, [selectedId])

  return (
    <motion.section variants={reveal} aria-labelledby="projects-title">
      <div className="section-heading">
        <h2 id="projects-title">Projects.</h2>
        <div className="view-toggle">
          <button 
            onClick={() => setView('grid')} 
            className={view === 'grid' ? 'active' : ''}
            aria-label="Grid view"
          >
            {view === 'grid' && (
              <motion.div layoutId="view-toggle-active" className="view-toggle-active-bg" transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }} />
            )}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
          </button>
          <button 
            onClick={() => setView('list')} 
            className={view === 'list' ? 'active' : ''}
            aria-label="List view"
          >
            {view === 'list' && (
              <motion.div layoutId="view-toggle-active" className="view-toggle-active-bg" transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }} />
            )}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
          </button>
        </div>
      </div>
      <motion.div layout className={view === 'grid' ? 'project-grid' : 'project-list'}>
        {projects.map((project, index) => (
          <motion.article 
            layout
            layoutId={`card-${project.id}`}
            key={project.id} 
            className={view === 'grid' ? `project-card ${project.id}` : `project-card-list ${project.id}`} 
            onClick={() => setSelectedId(project.id)}
            transition={{ layout: { type: 'tween', duration: 0.4, ease: 'easeOut' } }}
          >
            <motion.div 
              layout 
              layoutId={`art-${project.id}`}
              className={view === 'grid' ? 'project-art' : 'project-art-list'} 
              aria-hidden="true"
              style={{ borderRadius: view === 'grid' ? '18px' : '8px' }}
              transition={{ layout: { type: 'tween', duration: 0.4, ease: 'easeOut' } }}
            >
              {project.video ? (
                <video 
                  ref={(el) => { videoRefs.current[project.id] = el }}
                  src={project.video} 
                  autoPlay loop muted playsInline disablePictureInPicture 
                  onContextMenu={(e) => e.preventDefault()} 
                  style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, objectFit: 'cover', pointerEvents: 'none' }} 
                />
              ) : (
                project.image && <Image src={project.image} alt={project.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority />
              )}
            </motion.div>
            
            {view === 'list' && (
              <motion.div layout className="project-meta-list">
                <motion.strong layout layoutId={`title-${project.id}`} className="project-title-list" transition={{ layout: { type: 'tween', duration: 0.4, ease: 'easeOut' } }}>{project.name}</motion.strong>
                <motion.span layout layoutId={`desc-${project.id}`} className="project-desc-list" transition={{ layout: { type: 'tween', duration: 0.4, ease: 'easeOut' } }}>{project.desc}</motion.span>
              </motion.div>
            )}

            {view === 'list' && (
              <motion.div layout className="project-action-list">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </motion.div>
            )}
          </motion.article>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedId && (
          <>
            <motion.div 
              className="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
            />
            
            <div className="modal-container-fixed" style={{ pointerEvents: 'none' }}>
              {(() => {
                const project = projects.find(p => p.id === selectedId)
                if (!project) return null
                return (
                  <motion.div 
                    layoutId={`card-${project.id}`}
                    className="project-modal"
                    style={{ pointerEvents: 'auto' }}
                    transition={{ layout: { type: 'tween', duration: 0.4, ease: 'easeOut' } }}
                  >
                    <motion.button 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0 } }}
                      transition={{ delay: 0.4, duration: 0.2 }}
                      className="modal-close" 
                      onClick={() => setSelectedId(null)} 
                      aria-label="Close modal"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </motion.button>
                    
                    <motion.div 
                      layoutId={`art-${project.id}`} 
                      className="modal-media" 
                      style={{ borderRadius: '24px' }}
                      transition={{ layout: { type: 'tween', duration: 0.4, ease: 'easeOut' } }}
                    >
                      {project.video ? (
                        <video src={project.video} autoPlay loop muted playsInline disablePictureInPicture onContextMenu={(e) => e.preventDefault()} style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, objectFit: 'cover', pointerEvents: 'none' }} />
                      ) : (
                        project.image && <Image src={project.image} alt={project.name} fill className="object-cover" priority />
                      )}
                    </motion.div>
                    
                    <div className="modal-content">
                      <motion.strong 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0 } }}
                        transition={{ delay: 0.35, duration: 0.2 }}
                        className="modal-title"
                      >
                        {project.name}
                      </motion.strong>
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0 } }}
                        transition={{ delay: 0.35, duration: 0.2 }}
                        className="modal-desc"
                      >
                        {project.desc}
                      </motion.span>
                    </div>
                  </motion.div>
                )
              })()}
            </div>
          </>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
