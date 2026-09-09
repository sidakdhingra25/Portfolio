'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { reveal } from './animations'

const questions = [
  { id: 'q1', keyword: ' LLM ', prefix: ' split the ', suffix: ' from the rule engine?' },
  { id: 'q2', keyword: ' shareReplay ', prefix: '', suffix: ' over refetching?' },
  { id: 'q3', keyword: 'Next.js', prefix: 'choose ', suffix: ' over raw React?' },
  { id: 'q4', keyword: 'Zustand', prefix: 'prefer ', suffix: ' instead of Redux?' },
  { id: 'q5', keyword: 'PostgreSQL', prefix: 'stick with ', suffix: ' for the core database?' },
  { id: 'q6', keyword: 'Redis', prefix: 'introduce ', suffix: ' for caching?' },
  { id: 'q7', keyword: 'Tailwind', prefix: 'use ', suffix: ' instead of CSS modules?' },
  { id: 'q8', keyword: 'monorepo', prefix: 'build a ', suffix: ' for all packages?' },
  { id: 'q9', keyword: 'Framer Motion', prefix: 'animate with ', suffix: '?' },
  { id: 'q10', keyword: 'WebSockets', prefix: 'use ', suffix: ' for live updates?' },
]

export function Systems() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeScale, setActiveScale] = useState(1)

  const targetIndexRef = useRef(0)
  const isWheelScrollingRef = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let accumulatedDelta = 0
    let wheelTimeout: NodeJS.Timeout

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      isWheelScrollingRef.current = true
      
      accumulatedDelta += e.deltaY
      
      if (Math.abs(accumulatedDelta) >= 80) {
        const ticks = Math.trunc(accumulatedDelta / 80)
        
        targetIndexRef.current = Math.max(0, Math.min(questions.length - 1, targetIndexRef.current + ticks))
        
        container.scrollTo({
          top: targetIndexRef.current * 48,
          behavior: 'smooth'
        })
        
        accumulatedDelta = accumulatedDelta % 80
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
    const container = containerRef.current
    if (!container) return

    const calculateScale = () => {
      const activeItem = container.children[activeIndex] as HTMLElement
      if (!activeItem) return
      
      const availableWidth = container.clientWidth
      const naturalWidth = activeItem.scrollWidth
      
      if (naturalWidth > 0 && availableWidth > 0) {
        setActiveScale(Math.min(1, availableWidth / naturalWidth))
      }
    }

    calculateScale()

    const observer = new ResizeObserver(() => {
      calculateScale()
    })
    observer.observe(container)

    return () => observer.disconnect()
  }, [activeIndex])

  return (
    <motion.section className="systems-section" variants={reveal} aria-labelledby="systems-title">
      <div className="systems-intro">
        <div>
          <h2 id="systems-title">Systems.</h2>
        </div>
        <p className="systems-lede">Small technical decisions.</p>
      </div>
      
      <div className="picker-wrapper">
        <div className="picker-fixed-label">Why</div>
        
        <div className="picker-container" ref={containerRef}>
          {questions.map((q, index) => (
            <div 
              key={index} 
              className={`picker-item ${index === activeIndex ? 'active' : ''}`}
              style={{ '--fit-scale': index === activeIndex ? activeScale : 1 } as React.CSSProperties}
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
