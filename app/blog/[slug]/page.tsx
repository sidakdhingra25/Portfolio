'use client'

import { motion, Variants } from 'framer-motion'
import Link from 'next/link'

const reveal: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'tween', duration: 0.5, ease: 'easeOut' } 
  }
}

export default function BlogDetail() {
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
              The Architecture of Minimalist Design Systems
            </h1>
            <div className="flex items-center gap-3 text-[13px] text-[var(--muted)]">
              <span>Sept 12, 2026</span>
              <span className="w-1 h-1 rounded-full bg-[var(--line)]"></span>
              <span>Design</span>
              <span className="w-1 h-1 rounded-full bg-[var(--line)]"></span>
              <span>5 min read</span>
            </div>
          </header>

          <div className="relative w-full aspect-[1.8/1] rounded-2xl overflow-hidden bg-[var(--panel)] border border-[var(--line)] mb-10">
            <img 
              src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2000&auto=format&fit=crop" 
              alt="Minimalist architecture" 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-6 text-[14px] leading-[1.8] text-[var(--copy)]">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            
            <h2 className="text-[18px] font-medium text-[var(--foreground)] mt-6 mb-2">The core principles</h2>
            
            <p>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
            
            <p>
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
            </p>

            <blockquote className="border-l-[3px] border-[var(--line)] pl-5 italic my-6 text-[var(--muted)] text-[15px]">
              &quot;Simplicity is the ultimate sophistication. When you remove the unnecessary, what remains is essential.&quot;
            </blockquote>

            <p>
              Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.
            </p>
          </div>
        </motion.article>
      </motion.div>
    </main>
  )
}
