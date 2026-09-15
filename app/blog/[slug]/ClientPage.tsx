'use client'

import { motion, Variants } from 'framer-motion'
import Link from 'next/link'
import React from 'react'
import { PostFrontmatter } from '@/lib/mdx'

const reveal: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'tween', duration: 0.5, ease: 'easeOut' } 
  }
}

export function ClientPage({ frontmatter, children }: { frontmatter: PostFrontmatter, children: React.ReactNode }) {
  return (
    <main className="portfolio-shell">
      <motion.div
        className="portfolio-frame"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.div variants={reveal} className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-[13px] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
            <svg suppressHydrationWarning width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to home
          </Link>
        </motion.div>

        <motion.article variants={reveal} className="flex flex-col">
          <header className="flex flex-col gap-4 mb-8">
            <h1 className="text-2xl sm:text-[28px] font-medium tracking-tight text-[var(--foreground)] leading-[1.2]">
              {frontmatter.title}
            </h1>
            <div className="flex items-center gap-3 text-[13px] text-[var(--muted)]">
              <span>{frontmatter.date}</span>
              <span className="w-1 h-1 rounded-full bg-[var(--line)]"></span>
              <span>{frontmatter.category}</span>
              <span className="w-1 h-1 rounded-full bg-[var(--line)]"></span>
              <span>{frontmatter.readTime}</span>
            </div>
          </header>

          {frontmatter.image && (
            <div className="relative w-full aspect-[1.8/1] rounded-2xl overflow-hidden bg-[var(--panel)] border border-[var(--line)] mb-10">
              <img 
                src={frontmatter.image}
                alt={frontmatter.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-col gap-6 text-[14px] leading-[1.8] text-[var(--copy)]">
            {children}
          </div>
        </motion.article>
      </motion.div>
    </main>
  )
}
