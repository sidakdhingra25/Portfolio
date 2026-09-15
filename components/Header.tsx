'use client'

import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { reveal } from './animations'
import { useState, useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

interface NowPlaying {
  isPlaying: boolean
  title?: string
  artist?: string
  albumArt?: string
  songUrl?: string
}

type Phase = 'idle' | 'inserting' | 'inserted' | 'ejecting'

export function Header() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchNowPlaying = () => {
      fetch('/api/now-playing')
        .then(res => res.json())
        .then(data => setNowPlaying(data))
        .catch(console.error)
    }

    fetchNowPlaying()
    const interval = setInterval(fetchNowPlaying, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (phase === 'inserting') {
      timeoutRef.current = setTimeout(() => setPhase('inserted'), 1600)
    } else if (phase === 'inserted') {
      timeoutRef.current = setTimeout(() => setPhase('ejecting'), 1800)
    } else if (phase === 'ejecting') {
      timeoutRef.current = setTimeout(() => setPhase('idle'), 1600)
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [phase])

  const handleClick = () => {
    if (phase === 'idle') setPhase('inserting')
  }

  const isDiskInserted = phase === 'inserting' || phase === 'inserted'
  const isLineActive = phase === 'inserting' || phase === 'ejecting'

  return (
    <motion.header className="site-header" variants={reveal}>
      <div className="identity flex items-center">
        <button 
          type="button"
          className="avatar-trigger"
          onClick={nowPlaying?.isPlaying && nowPlaying?.albumArt ? handleClick : undefined}
          style={{ cursor: nowPlaying?.isPlaying && nowPlaying?.albumArt ? 'pointer' : 'default' }}
        >
          <motion.div className="avatar" transition={{ duration: 0.2 }} aria-hidden="true" />
          
          {nowPlaying?.isPlaying && nowPlaying?.albumArt && (
            <div className="slot-container">
              <div className="avatar-disk-hover">
                <div className={`avatar-disk-wrapper ${isDiskInserted ? 'rolling' : ''}`} aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={nowPlaying.albumArt} alt="" className="avatar-disk" />
                </div>
              </div>
            </div>
          )}
          
          <div className={`slot-line ${isLineActive ? 'active' : ''}`} aria-hidden="true"></div>

          {nowPlaying?.isPlaying && nowPlaying?.albumArt && (
            <div className={`spotify-tooltip ${phase === 'idle' ? 'can-show' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1DB954" width="16" height="16" className="shrink-0">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.56.3z"/>
              </svg>
              <span className="truncate">{nowPlaying.title} by {nowPlaying.artist}</span>
            </div>
          )}
        </button>

      </div>
      <nav className="header-actions" aria-label="Quick actions">
        <button 
          type="button" 
          aria-label="Display settings" 
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        >
          {mounted && resolvedTheme === 'dark' ? <Sun /> : <Moon />}
        </button>
      </nav>
    </motion.header>
  )
}
