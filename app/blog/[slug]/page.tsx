'use client'

import { motion, Variants } from 'framer-motion'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const reveal: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'tween', duration: 0.5, ease: 'easeOut' } 
  }
}

const blogPosts: Record<string, { title: string; date: string; category: string; readTime: string; content: string; image: string }> = {
  'inline-arrow-function': {
    title: "Why passing an inline arrow function as a prop breaks OnPush change detection, even when nothing changed",
    date: "Sept 14, 2026",
    category: "React/Angular",
    readTime: "3 min read",
    content: "The gotcha most people miss even after they've learned \"use OnPush for perf.\" (click)=\"() => doThing()\" creates a new function reference on every parent render, and OnPush compares by reference — so the exact optimization you added ends up defeated by the exact pattern most people reach for by habit. Strong because it contradicts what people think they just learned.",
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2000&auto=format&fit=crop"
  },
  'sharereplay': {
    title: "Why shareReplay() without { refCount: true } can keep a subscription alive forever",
    date: "Sept 14, 2026",
    category: "RxJS",
    readTime: "3 min read",
    content: "A real, underexplained default in one of the most commonly-used RxJS operators — most tutorials show shareReplay() as \"the fix\" for redundant API calls (yours included, per your own Decisions picker) without mentioning it can silently leak a live subscription/connection after every consumer has unsubscribed. High value because it corrects something people think is already a solved problem.",
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2000&auto=format&fit=crop"
  },
  'typescript-any': {
    title: "Why one any in a TypeScript codebase disables type-checking for everything downstream of it",
    date: "Sept 14, 2026",
    category: "TypeScript",
    readTime: "4 min read",
    content: "Broadest applicability on this list — every TypeScript developer, not just Angular ones, has typed any \"just for now\" without realizing it isn't a type so much as an opt-out that propagates through every function that touches that value. Strong conceptual payoff: it reframes any from \"a shortcut\" to \"a hole.\"",
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2000&auto=format&fit=crop"
  },
  'json-deep-clone': {
    title: "Why JSON.parse(JSON.stringify(obj)) is a common deep-clone trick that silently breaks on Date, undefined, and circular references",
    date: "Sept 14, 2026",
    category: "JavaScript",
    readTime: "4 min read",
    content: "Practical in a way the others aren't — almost everyone has used this trick, most have never hit its failure modes, and when they do hit one it's usually a confusing, hard-to-trace bug rather than an error message. Good post because the failure is silent, which is the most teachable kind of bug.",
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2000&auto=format&fit=crop"
  },
  'typescript-runtime-types': {
    title: "Why TypeScript types don't protect you from bad data at runtime",
    date: "Sept 14, 2026",
    category: "TypeScript",
    readTime: "5 min read",
    content: "The strongest closer of the five because it's not just a fact, it's a setup — the answer (\"types are erased at compile time; nothing stops a real API response from violating your interface\") is the actual reason runtime validators like Zod exist, which means this post can end by pointing at Schelo as the real thing you built in response to this exact problem. That's a stronger ending than a standalone concept post — it's the one place on this list where the \"why\" question and your own shipped work reinforce each other instead of sitting side by side.",
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2000&auto=format&fit=crop"
  }
}

export default function BlogDetail() {
  const params = useParams()
  const slug = params?.slug as string
  const post = blogPosts[slug]

  if (!post) {
    return (
      <main className="portfolio-shell flex items-center justify-center h-[50vh]">
        <div className="text-[var(--muted)]">Post not found</div>
      </main>
    )
  }

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
              {post.title}
            </h1>
            <div className="flex items-center gap-3 text-[13px] text-[var(--muted)]">
              <span>{post.date}</span>
              <span className="w-1 h-1 rounded-full bg-[var(--line)]"></span>
              <span>{post.category}</span>
              <span className="w-1 h-1 rounded-full bg-[var(--line)]"></span>
              <span>{post.readTime}</span>
            </div>
          </header>

          <div className="relative w-full aspect-[1.8/1] rounded-2xl overflow-hidden bg-[var(--panel)] border border-[var(--line)] mb-10">
            <img 
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-6 text-[14px] leading-[1.8] text-[var(--copy)]">
            <p>{post.content}</p>
          </div>
        </motion.article>
      </motion.div>
    </main>
  )
}
