'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  AnimatePresence,
  animate,
  type MotionValue,
  motion,
  motionValue,
  type Transition,
  useReducedMotion,
} from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

/* ─── Types ─── */

interface Pose {
  cx: number; cy: number
  width: number; height: number
  rotate: number; opacity: number
}

interface Size {
  cardW: number; cardH: number
  bigW: number; bigH: number
  centerX: number; centerY: number
  gap: number
}

interface Values {
  x: MotionValue<number>; y: MotionValue<number>
  rotate: MotionValue<number>
  width: MotionValue<number>; height: MotionValue<number>
  opacity: MotionValue<number>
}

interface Gesture {
  id: number; mode: 'stack' | 'carousel'
  startX: number; startY: number; dx: number; live: boolean
  lastX: number; lastT: number; velocity: number
}

/* ─── Constants ─── */

const SETTLE: Transition = { type: 'spring', stiffness: 480, damping: 40 }
const TRAVEL: Transition = { type: 'spring', stiffness: 340, damping: 34 }
const THROW_MS = 200
const THROW: Transition = { duration: THROW_MS / 1000, ease: [0.23, 1, 0.32, 1] }
const SWAP_MS = 120
const CLEAR = 0.85
const SLOP = 6
const TWIST = 0.05

const SHADOW = '0 1px 1px rgba(0,0,0,.06), 0 4px 10px -2px rgba(0,0,0,.10), 0 18px 32px -14px rgba(0,0,0,.22)'

/* ─── Pose math ─── */

function sizes(w: number, h: number): Size {
  const cardH = Math.round(Math.min(h * 0.6, 300))
  const cardW = Math.round(cardH * 0.72)
  const bigH = Math.round(Math.min(h * 0.82, 480))
  const bigW = Math.round(bigH * 0.72)
  return { cardW, cardH, bigW, bigH, centerX: w / 2, centerY: h / 2, gap: 110 }
}

function stackPose(position: number, s: Size, fanned: boolean): Pose {
  if (position < 0 || position >= 8) {
    return { cx: s.centerX, cy: s.centerY, width: s.cardW, height: s.cardH, rotate: 0, opacity: 0 }
  }
  const fan = fanned ? 1.6 : 1
  const offsets = [
    { x: 0, y: 0, r: 0 },
    { x: -14, y: -6, r: -5 },
    { x: 16, y: -10, r: 6 },
    { x: -6, y: -14, r: -3 },
    { x: 10, y: -12, r: 4 },
    { x: -2, y: -18, r: -1 },
  ]
  const o = offsets[Math.min(position, offsets.length - 1)]
  return {
    cx: s.centerX + o.x * fan,
    cy: s.centerY + o.y * fan,
    width: s.cardW,
    height: s.cardH,
    rotate: o.r * fan,
    opacity: position === 0 ? 1 : Math.max(0.25, 1 - position * 0.15),
  }
}

function carouselPose(offset: number, s: Size, drag: number): Pose {
  const absOff = Math.abs(offset)
  const scale = absOff === 0 ? 1 : 0.88
  return {
    cx: s.centerX + offset * (s.bigW * 0.88 + s.gap) + drag,
    cy: s.centerY,
    width: s.bigW * scale,
    height: s.bigH * scale,
    rotate: 0,
    opacity: absOff <= 2 ? 1 : 0,
  }
}

function resist(dx: number, index: number, count: number): number {
  if ((index === 0 && dx > 0) || (index === count - 1 && dx < 0)) return dx * 0.25
  return dx
}

/* ─── Helpers ─── */

const toBack = (order: readonly number[], id: number) => [...order.filter(e => e !== id), id]
const toFront = (order: readonly number[], id: number) => {
  const at = order.indexOf(id)
  return [...order.slice(at), ...order.slice(0, at)]
}
const focusNext = (node: HTMLButtonElement | null | undefined) =>
  requestAnimationFrame(() => node?.focus({ preventScroll: true }))
const byKeyboard = () => document.activeElement?.matches(':focus-visible') ?? false

/* ─── Component ─── */

interface FeedCarouselProps {
  images: { src: string; alt: string }[]
  initialIndex: number
  onClose: () => void
}

export function FeedCarousel({ images, initialIndex, onClose }: FeedCarouselProps) {
  const COUNT = images.length
  const reduce = useReducedMotion() ?? false
  const stageRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])
  const closeRef = useRef<HTMLButtonElement>(null)

  const [values] = useState<Values[]>(() =>
    images.map(() => ({
      x: motionValue(0), y: motionValue(0),
      rotate: motionValue(0),
      width: motionValue(0), height: motionValue(0),
      opacity: motionValue(0),
    }))
  )

  // start with clicked image in front
  const [order, setOrder] = useState<number[]>(() => {
    const arr = images.map((_, i) => i)
    const at = arr.indexOf(initialIndex)
    return [...arr.slice(at), ...arr.slice(0, at)]
  })
  const [open, setOpen] = useState<number | null>(null)
  const [leaving, setLeaving] = useState<number | null>(null)
  const [spread, setSpread] = useState(false)
  const [stage, setStage] = useState<{ w: number; h: number } | null>(null)

  const orderRef = useRef(order)
  const openRef = useRef(open)
  const leavingRef = useRef(leaving)
  const spreadRef = useRef(spread)
  const sizeRef = useRef<Size | null>(null)
  const gestureRef = useRef<Gesture | null>(null)
  const draggedRef = useRef(false)
  const placedRef = useRef<{ size: Size; open: number | null } | null>(null)
  const leaveFrame = useRef(0)

  const size = stage ? sizes(stage.w, stage.h) : null

  useEffect(() => {
    orderRef.current = order
    openRef.current = open
    leavingRef.current = leaving
    spreadRef.current = spread
    sizeRef.current = size
  })

  // lock body scroll + blur page
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.classList.add('feed-carousel-open')
    return () => {
      document.body.style.overflow = prev
      document.body.classList.remove('feed-carousel-open')
    }
  }, [])

  const poseOf = useCallback(
    (i: number, s: Size, o: readonly number[], opened: number | null, fan: boolean, drag = 0): Pose =>
      opened === null
        ? stackPose(o.indexOf(i), s, fan)
        : carouselPose(i - opened, s, drag),
    []
  )

  const send = useCallback(
    (i: number, pose: Pose, transition: Transition | null) => {
      const v = values[i]
      const targets: [MotionValue<number>, number][] = [
        [v.x, pose.cx - pose.width / 2],
        [v.y, pose.cy - pose.height / 2],
        [v.rotate, pose.rotate],
        [v.width, pose.width],
        [v.height, pose.height],
        [v.opacity, pose.opacity],
      ]
      for (const [value, target] of targets) {
        if (transition === null) value.jump(target)
        else animate(value, target, transition)
      }
    },
    [values]
  )

  // place / animate cards on state change
  useEffect(() => {
    if (!size) return
    const last = placedRef.current
    const resized = !last || last.size.bigW !== size.bigW || last.size.bigH !== size.bigH
    const transition = resized ? null : reduce ? { duration: 0 } : last.open !== open ? TRAVEL : SETTLE
    placedRef.current = { size, open }
    for (let i = 0; i < COUNT; i++) {
      if (i === leaving) continue
      send(i, poseOf(i, size, order, open, spread), transition)
    }
  }, [size, order, open, spread, leaving, reduce, poseOf, send, COUNT])

  // observe stage size
  useEffect(() => {
    const node = stageRef.current
    if (!node) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setStage(prev => prev && prev.w === width && prev.h === height ? prev : { w: width, h: height })
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  // throw card to back
  const throwBack = useCallback(
    (dir: 1 | -1) => {
      const s = sizeRef.current
      if (!s) return
      const id = orderRef.current[0]
      const next = orderRef.current[1]
      const keyboard = byKeyboard()
      setOrder(toBack(orderRef.current, id))

      const v = values[id]
      const at = v.x.get() + v.width.get() / 2
      const clear = s.cardW * CLEAR
      if (reduce || at * dir >= clear) {
        if (keyboard) focusNext(cardRefs.current[next])
        return
      }

      setLeaving(id)
      const base = stackPose(0, s, false)
      send(id, {
        ...base,
        cx: s.centerX + dir * clear,
        cy: v.y.get() + v.height.get() / 2,
        rotate: dir * Math.max(12, Math.abs(v.rotate.get())),
      }, THROW)
      window.setTimeout(() => {
        if (leavingRef.current === id) setLeaving(null)
      }, SWAP_MS)
      if (keyboard) focusNext(cardRefs.current[next])
    },
    [reduce, send, values]
  )

  const openPhoto = useCallback((i: number) => {
    setSpread(false)
    setOpen(i)
  }, [])

  const close = useCallback(() => {
    const opened = openRef.current
    if (opened === null) return
    const keyboard = byKeyboard()
    setOrder(toFront(orderRef.current, opened))
    setOpen(null)
    if (keyboard) {
      requestAnimationFrame(() => cardRefs.current[opened]?.focus({ preventScroll: true }))
    }
  }, [])

  const step = useCallback((dir: 1 | -1) => {
    const opened = openRef.current
    if (opened === null) return
    const next = Math.min(COUNT - 1, Math.max(0, opened + dir))
    setOpen(next)
  }, [COUNT])

  // focus close button when opened by keyboard
  const openedByKey = useRef(false)
  useEffect(() => {
    if (open !== null && openedByKey.current) {
      openedByKey.current = false
      closeRef.current?.focus({ preventScroll: true })
    }
  }, [open])

  // keyboard: Escape, arrows
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (openRef.current !== null) close()
        else onClose()
      } else if (open !== null && e.key === 'ArrowLeft') step(-1)
      else if (open !== null && e.key === 'ArrowRight') step(1)
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close, step, onClose])

  // drag handling
  useEffect(() => {
    const stageNode = stageRef.current

    const end = (commit: boolean) => {
      const g = gestureRef.current
      gestureRef.current = null
      stageNode?.removeAttribute('data-carry')
      const s = sizeRef.current
      if (!g?.live || !s) return

      const dir: 1 | -1 = (g.dx || g.velocity) > 0 ? 1 : -1
      const flung = Math.abs(g.velocity) > 500 && Math.sign(g.velocity) === dir

      if (g.mode === 'stack') {
        if (commit && (Math.abs(g.dx) > s.cardW * 0.3 || flung)) {
          throwBack(dir)
          return
        }
        send(g.id, stackPose(0, s, spreadRef.current), reduce ? { duration: 0 } : SETTLE)
        return
      }

      const opened = openRef.current
      if (opened === null) return
      const next = commit && (Math.abs(g.dx) > s.bigW * 0.2 || flung)
        ? Math.min(COUNT - 1, Math.max(0, opened - dir))
        : opened
      setOpen(next)
      for (let i = 0; i < COUNT; i++) {
        send(i, carouselPose(i - next, s, 0), reduce ? { duration: 0 } : SETTLE)
      }
    }

    const onMove = (event: PointerEvent) => {
      const g = gestureRef.current
      const s = sizeRef.current
      if (!g || !s) return
      if (event.buttons === 0) { end(false); return }
      const dx = event.clientX - g.startX
      const dy = event.clientY - g.startY
      if (!g.live) {
        if (Math.abs(dx) < SLOP) {
          if (Math.abs(dy) > SLOP) gestureRef.current = null
          return
        }
        g.live = true
        draggedRef.current = true
        stageNode?.setAttribute('data-carry', '')
      }

      const now = performance.now()
      const dt = now - g.lastT
      if (dt > 0) g.velocity = ((event.clientX - g.lastX) / dt) * 1000 * 0.6 + g.velocity * 0.4
      g.lastX = event.clientX
      g.lastT = now
      g.dx = dx

      if (g.mode === 'stack') {
        const base = stackPose(0, s, spreadRef.current)
        send(g.id, {
          ...base,
          cx: base.cx + dx,
          cy: base.cy + Math.abs(dx) * 0.04,
          rotate: base.rotate + dx * TWIST,
        }, null)
        return
      }

      const opened = openRef.current
      if (opened === null) return
      const drag = resist(dx, opened, COUNT)
      for (let i = 0; i < COUNT; i++) send(i, carouselPose(i - opened, s, drag), null)
    }

    const onUp = () => end(true)
    const onCancel = () => end(false)

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onCancel)
    window.addEventListener('blur', onCancel)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onCancel)
      window.removeEventListener('blur', onCancel)
    }
  }, [reduce, send, throwBack, COUNT])

  const press = (i: number, event: React.PointerEvent) => {
    if (event.button !== 0) return
    draggedRef.current = false
    const opened = openRef.current
    const front = orderRef.current[0]
    if (opened === null ? i !== front || leavingRef.current !== null : i !== opened) return
    gestureRef.current = {
      id: i, mode: opened === null ? 'stack' : 'carousel',
      startX: event.clientX, startY: event.clientY, dx: 0, live: false,
      lastX: event.clientX, lastT: performance.now(), velocity: 0,
    }
  }

  const click = (i: number, event: React.MouseEvent) => {
    if (draggedRef.current) { draggedRef.current = false; return }
    if (open === null) {
      openedByKey.current = event.detail === 0
      openPhoto(i)
    } else if (i !== open) {
      setOpen(i)
    }
  }

  const keydown = (i: number, event: React.KeyboardEvent) => {
    if (open !== null || i !== order[0]) return
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      throwBack(event.key === 'ArrowLeft' ? -1 : 1)
    }
  }

  const enter = (event: React.PointerEvent) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
    cancelAnimationFrame(leaveFrame.current)
    if (openRef.current === null) setSpread(true)
  }
  const leave = () => {
    cancelAnimationFrame(leaveFrame.current)
    leaveFrame.current = requestAnimationFrame(() => setSpread(false))
  }

  const zIndex = (i: number) => {
    if (open !== null) {
      const far = Math.abs(i - open)
      return far === 0 ? 50 : far === 1 ? 40 : 30
    }
    if (i === leaving) return 55
    return 45 - order.indexOf(i)
  }

  return createPortal(
    <motion.div
      className="feed-stack-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        ref={stageRef}
        className="feed-stack-stage"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        {/* backdrop for carousel mode */}
        <motion.button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={close}
          initial={false}
          animate={{ opacity: open === null ? 0 : 1 }}
          transition={{ duration: reduce ? 0 : 0.2 }}
          className={`feed-stack-backdrop ${open === null ? 'pointer-events-none' : ''}`}
        />

        {/* Drag me indicator */}
        <AnimatePresence>
          {open === null && stage && size ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.4 } }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              className="absolute pointer-events-none z-50 flex items-center justify-center"
              style={{
                top: stage.h / 2 + size.cardH / 2 + 30,
                left: stage.w / 2 - size.cardW / 2 - 90,
                rotate: -10
              }}
            >
              <motion.span
                className="text-white/80 text-[20px]"
                style={{ fontFamily: "'Caveat', cursive", whiteSpace: "nowrap" }}
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: 0.4, ease: "linear", delay: 0.4 }}
              >
                Drag me
              </motion.span>
              <motion.svg
                width="140"
                height="80"
                viewBox="0 0 140 80"
                className="absolute"
                style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%) scale(0.75)" }}
              >
                <motion.path
                  d="M 70,15 C 30,12 10,25 15,45 C 20,65 60,75 100,60 C 130,45 130,20 95,15 C 65,10 30,25 25,35"
                  fill="none"
                  stroke="rgba(255,255,255,0.7)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: "easeInOut", delay: 0.6 }}
                />
              </motion.svg>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* photo cards */}
        {stage && images.map((photo, i) => {
          const v = values[i]
          const front = open === null ? i === order[0] : i === open
          return (
            <motion.button
              key={i}
              ref={(node) => { cardRefs.current[i] = node }}
              type="button"
              tabIndex={front ? 0 : -1}
              aria-label={photo.alt}
              onPointerDown={(e) => press(i, e)}
              onPointerEnter={enter}
              onPointerLeave={leave}
              onClick={(e) => click(i, e)}
              onKeyDown={(e) => keydown(i, e)}
              style={{
                x: v.x, y: v.y, rotate: v.rotate,
                width: v.width, height: v.height, opacity: v.opacity,
                zIndex: zIndex(i), boxShadow: SHADOW,
              }}
              className={`feed-stack-card ${front ? 'cursor-grab' : 'cursor-pointer'}`}
            >
              <img
                src={photo.src}
                alt=""
                draggable={false}
                className="feed-stack-card-img"
              />
              <span aria-hidden="true" className="feed-stack-card-ring" />
            </motion.button>
          )
        })}

        {/* carousel chrome: close, prev/next, counter */}
        <AnimatePresence>
          {open !== null && size && stage ? (
            <motion.div
              key="chrome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: reduce ? 0 : 0.08 } }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{ duration: reduce ? 0 : 0.2 }}
              className="feed-stack-chrome"
            >
              <button
                ref={closeRef}
                type="button"
                aria-label="Close carousel"
                onClick={close}
                className="feed-stack-control feed-stack-close-btn"
              >
                <X size={16} />
              </button>

              <button
                type="button"
                aria-label="Previous photo"
                disabled={open === 0}
                onClick={() => step(-1)}
                className="feed-stack-control feed-stack-prev-btn"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                aria-label="Next photo"
                disabled={open === COUNT - 1}
                onClick={() => step(1)}
                className="feed-stack-control feed-stack-next-btn"
              >
                <ChevronRight size={16} />
              </button>

              <div className="feed-stack-caption" style={{ top: (stage.h + size.bigH) / 2 + 16 }}>
                <span className="feed-stack-caption-title">{images[open].alt}</span>
                <span className="feed-stack-caption-count">{open + 1} of {COUNT}</span>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>,
    document.body
  )
}
