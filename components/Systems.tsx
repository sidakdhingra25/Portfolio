'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { reveal } from './animations'

const questions = [
  { id: 'q1', keyword: ' LLM ', prefix: ' split the ', suffix: ' from the rule engine?' },
  { id: 'q2', keyword: ' shareReplay ', prefix: '', suffix: ' over refetching?' },
  { id: 'q3', keyword: 'Next.js', prefix: 'choose ', suffix: ' over raw React?' },
  { id: 'q4', keyword: 'Zustand', prefix: 'prefer ', suffix: ' instead of Redux?' },
  { id: 'q5', keyword: 'PostgreSQL', prefix: 'stick with ', suffix: ' for the database?' },
  { id: 'q6', keyword: 'Redis', prefix: 'introduce ', suffix: ' for caching?' },
  { id: 'q7', keyword: 'Tailwind', prefix: 'use ', suffix: ' instead of CSS modules?' },
  { id: 'q8', keyword: 'monorepo', prefix: 'build a ', suffix: ' for all packages?' },
  { id: 'q9', keyword: 'Framer Motion', prefix: 'animate with ', suffix: '?' },
  { id: 'q10', keyword: 'WebSockets', prefix: 'use ', suffix: ' for live updates?' },
]

export function Systems() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const targetIndexRef = useRef(0)
  const isWheelScrollingRef = useRef(false)
  const directionRef = useRef(1)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let accumulatedDelta = 0
    let wheelTimeout: NodeJS.Timeout

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      isWheelScrollingRef.current = true
      
      accumulatedDelta += e.deltaY
      
      if (Math.abs(accumulatedDelta) >= 60) {
        const direction = Math.sign(accumulatedDelta)
        
        targetIndexRef.current = Math.max(0, Math.min(questions.length - 1, targetIndexRef.current + direction))
        
        container.scrollTo({
          top: targetIndexRef.current * 48,
          behavior: 'smooth'
        })
        
        // Reset completely to prevent remainder accumulation causing double-jumps on mouse wheels
        accumulatedDelta = 0
      }

      clearTimeout(wheelTimeout)
      wheelTimeout = setTimeout(() => {
        accumulatedDelta = 0
        isWheelScrollingRef.current = false
      }, 150)
    }
    
    container.addEventListener('wheel', handleWheel, { passive: false })

    const handleScroll = () => {
      const itemHeight = 48
      const index = Math.max(0, Math.min(questions.length - 1, Math.round(container.scrollTop / itemHeight)))
      setActiveIndex(index)
      
      // Only sync the target index if the user is scrolling manually (dragging/touch)
      // If they are using the wheel, let the wheel logic own the target index to prevent stuttering
      if (!isWheelScrollingRef.current) {
        targetIndexRef.current = index
      }
    }
    
    container.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => {
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('scroll', handleScroll)
      clearTimeout(wheelTimeout)
    }
  }, [])

  useEffect(() => {
    if (isHovered) return

    const container = containerRef.current
    if (!container || questions.length <= 1) return

    const intervalId = setInterval(() => {
      if (isWheelScrollingRef.current) return

      let nextIndex = targetIndexRef.current + directionRef.current

      if (nextIndex >= questions.length) {
        directionRef.current = -1
        nextIndex = questions.length - 2
      } else if (nextIndex < 0) {
        directionRef.current = 1
        nextIndex = 1
      }

      targetIndexRef.current = nextIndex

      container.scrollTo({
        top: nextIndex * 48,
        behavior: 'smooth'
      })
    }, 2000) // 1.5 seconds per tick

    return () => clearInterval(intervalId)
  }, [isHovered])

  return (
    <motion.section 
      layout
      className="systems-section" 
      variants={reveal} 
      aria-labelledby="systems-title"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="systems-intro">
        <div>
          <h2 id="systems-title">Decisions.</h2>
        </div>
        <p className="systems-lede">A few choices, and why I made them.</p>
      </div>
      
      <div className="picker-wrapper">
        <div className="picker-fixed-label">Why</div>
        
        <div className="picker-container" ref={containerRef}>
          {questions.map((q, index) => (
            <div 
              key={index} 
              className={`picker-item ${index === activeIndex ? 'active' : ''}`}
            >
              {q.prefix ? q.prefix.trim() + ' ' : ''}
              <span className="text-highlight">{q.keyword}</span>
              {q.suffix ? ' ' + q.suffix.trim() : ''}
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
