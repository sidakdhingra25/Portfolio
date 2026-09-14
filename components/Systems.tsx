'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { reveal } from './animations'
import Link from 'next/link'

const questions = [
  { id: 'inline-arrow-function', keyword: 'inline arrow functions', prefix: '', suffix: ' break OnPush?' },
  { id: 'sharereplay', keyword: 'shareReplay()', prefix: '', suffix: ' leaks subscriptions?' },
  { id: 'typescript-any', keyword: 'any', prefix: 'one ', suffix: ' disables type checking?' },
  { id: 'json-deep-clone', keyword: 'JSON.stringify', prefix: '', suffix: ' fails as a deep clone?' },
  { id: 'typescript-runtime-types', keyword: 'TypeScript types', prefix: '', suffix: ' fail at runtime?' },
]

export function Systems() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const targetIndexRef = useRef(0)
  const isWheelScrollingRef = useRef(false)
  const directionRef = useRef(1)
  
  const isProgrammaticScrollRef = useRef(false)
  const programmaticTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const executeProgrammaticScroll = (index: number) => {
    const container = containerRef.current
    if (!container) return
    
    targetIndexRef.current = index
    isProgrammaticScrollRef.current = true
    
    container.style.scrollSnapType = 'none'
    container.scrollTo({
      top: index * 48,
      behavior: 'smooth'
    })
    
    clearTimeout(programmaticTimeoutRef.current)
    programmaticTimeoutRef.current = setTimeout(() => {
      isProgrammaticScrollRef.current = false
      if (container) container.style.scrollSnapType = ''
    }, 600)
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let wheelTimeout: NodeJS.Timeout
    let wheelAccumulator = 0
    let lastWheelTime = Date.now()

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      isWheelScrollingRef.current = true
      
      clearTimeout(wheelTimeout)
      wheelTimeout = setTimeout(() => {
        isWheelScrollingRef.current = false
        wheelAccumulator = 0
      }, 150)

      const now = Date.now()
      if (now - lastWheelTime > 150) {
        wheelAccumulator = 0
      }
      lastWheelTime = now
      wheelAccumulator += e.deltaY
      
      if (Math.abs(wheelAccumulator) >= 50) {
        const direction = wheelAccumulator > 0 ? 1 : -1
        const nextIndex = Math.max(0, Math.min(questions.length - 1, targetIndexRef.current + direction))
        
        if (nextIndex !== targetIndexRef.current) {
          executeProgrammaticScroll(nextIndex)
        }
        wheelAccumulator = 0
      }
    }
    
    container.addEventListener('wheel', handleWheel, { passive: false })

    const handleScroll = () => {
      const itemHeight = 48
      const index = Math.max(0, Math.min(questions.length - 1, Math.round(container.scrollTop / itemHeight)))
      setActiveIndex(index)
      
      // Only sync the target index if the user is scrolling manually (dragging/touch)
      // Ignore during programmatic scrolls so we don't clobber the target before we reach it
      if (!isProgrammaticScrollRef.current) {
        targetIndexRef.current = index
      }
    }
    
    container.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => {
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('scroll', handleScroll)
      clearTimeout(wheelTimeout)
      clearTimeout(programmaticTimeoutRef.current)
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

      executeProgrammaticScroll(nextIndex)
    }, 2000) // 1.5 seconds per tick

    return () => clearInterval(intervalId)
  }, [isHovered])

  const handleItemClick = (index: number) => {
    if (index !== activeIndex) {
      executeProgrammaticScroll(index)
    }
  }

  return (
    <motion.section 
      layout
      className="systems-section" 
      variants={reveal} 
      aria-labelledby="systems-title"
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
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
            <Link
              href={`/blog/${q.id}`}
              key={index} 
              onClick={(e) => {
                if (index !== activeIndex) {
                  e.preventDefault()
                  handleItemClick(index)
                }
              }}
              className={`picker-item ${index === activeIndex ? 'active' : ''}`}
            >
              {q.prefix ? q.prefix.trim() + ' ' : ''}
              <span className="text-highlight">{q.keyword}</span>
              {q.suffix ? ' ' + q.suffix.trim() : ''}
            </Link>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
