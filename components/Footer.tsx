'use client'

import { motion } from 'framer-motion'
import { reveal } from './animations'

export function Footer() {
  return (
    <motion.footer 
      className="w-full flex justify-between items-center text-[9.5px] sm:text-[12.5px] whitespace-nowrap text-[var(--muted)] border-t border-[var(--line)] mt-[60px] pt-[20px]" 
      variants={reveal}
    >
      <div>
        made with ❤️ by Sidak Dhingra
      </div>
      <div className="flex gap-2 sm:gap-4">
        <a 
          href="https://www.linkedin.com/in/sidak-dhingra/" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: 'inherit', textDecoration: 'none' }}
          className="hover:text-foreground transition-colors"
        >
          LinkedIn
        </a>
        <a 
          href="https://github.com/sidakdhingra25" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: 'inherit', textDecoration: 'none' }}
          className="hover:text-foreground transition-colors"
        >
          GitHub
        </a>
        <a 
          href="https://drive.google.com/file/d/1IJrEkk3xGH4vj6GgFeI6wiRORg02z-fG/view?usp=sharing" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: 'inherit', textDecoration: 'none' }}
          className="hover:text-foreground transition-colors"
        >
          Resume
        </a>
      </div>
    </motion.footer>
  )
}
