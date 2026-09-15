'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, Code, Mail, AtSign, Globe2, Copy, Check, FileText } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { reveal } from './animations'
import { useLenis } from 'lenis/react'

export function Intro() {
  const [showEmail, setShowEmail] = useState(false)
  const [copied, setCopied] = useState(false)
  const popupRef = useRef<HTMLSpanElement>(null)
  const lenis = useLenis()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowEmail(false)
      }
    }

    if (showEmail) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showEmail])

  const handleCopy = () => {
    navigator.clipboard.writeText('sidakdhingra73@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
        Currently working as a <strong>Software Developer at <a href="https://www.quadlabs.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-baseline gap-1 group"><img src="https://www.google.com/s2/favicons?domain=quadlabs.com&sz=32" alt="QuadLabs" className="w-4 h-4 self-center rounded-xs" /><span className="underline underline-offset-2">QuadLabs</span></a></strong>, building web applications while also spending my time outside work building my own <strong><a href="#projects" onClick={(e) => { e.preventDefault(); lenis?.scrollTo('#projects'); }} className="inline-flex items-baseline gap-1 group"><Code className="w-4 h-4 self-center" /><span className="underline underline-offset-2">Projects</span></a></strong>, exploring new ideas, and experimenting with different technologies.
      </p>
      <p>
        Less interested in whether an agent gets the right answer than in why it got there.</p>
      <p>
        Design-curious and drawn to creating simple, thoughtful interfaces.
      </p>
      <p>
        Always open to new opportunities and connections, so feel free to reach out at <a href="https://x.com/justsidak" target="_blank" rel="noopener noreferrer" className="pill inline-flex items-baseline gap-1"><img src="https://www.google.com/s2/favicons?domain=x.com&sz=32" alt="X" className="w-3 h-3 self-center rounded-xs" /> justsidak</a>, <a href="https://drive.google.com/file/d/1IJrEkk3xGH4vj6GgFeI6wiRORg02z-fG/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="pill inline-flex items-baseline gap-1"><FileText className="w-3 h-3 self-center" /> resume</a> or by <span ref={popupRef} className="relative inline-block">
          <button onClick={() => setShowEmail(!showEmail)} className="pill inline-flex items-baseline gap-1 cursor-pointer">
            <Mail className="w-3 h-3 self-center" /> email
          </button>
          <AnimatePresence>
            {showEmail && (
              <motion.span
                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[var(--panel)] border border-[var(--line)] shadow-sm rounded-lg px-3 py-2 flex items-center gap-3 z-10"
              >
                <span className="text-[13px] text-[var(--foreground)] font-medium whitespace-nowrap font-mono">sidakdhingra73@gmail.com</span>
                <button
                  onClick={handleCopy}
                  className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                  aria-label="Copy email"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </motion.span>
            )}
          </AnimatePresence>
        </span>.
      </p>
    </motion.section>
  )
}
