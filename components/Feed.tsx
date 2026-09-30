'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { reveal } from './animations'
import { FeedCarousel } from './FeedCarousel'


const FEED_IMAGES = [
  { src: '/taj.jpeg', alt: 'Taj Mahal' },
  { src: '/movie.jpeg', alt: 'Movie night' },
  { src: '/ranthambore.jpeg', alt: 'Ranthambore' },
  { src: '/4d72cdfe3e07ee7007fa2c04511fecb2.jpg', alt: 'Wanderlust' },
  { src: '/Snapchat-655750787.jpg.jpeg', alt: 'Golden hour' },
  { src: '/e21ac3ccada2d69b14786e9926052e2d.jpg', alt: 'Serenity' },
]

export function Feed() {
  const [carouselIndex, setCarouselIndex] = useState<number | null>(null)

  return (
    <>
      <motion.section layout variants={reveal} aria-labelledby="feed-title" transition={{ layout: { type: 'tween', duration: 0.4, ease: 'easeOut' } }}>
        <h2 id="feed-title" className="section-title">My feed.</h2>
        <div className="feed-grid">
          <div>
            <div className="feed-tile feed-paper relative overflow-hidden cursor-pointer" onClick={() => setCarouselIndex(0)}>
              <Image src="/taj.jpeg" alt="Feed image 1" fill className="object-cover" />
            </div>
            <div className="feed-tile feed-brown relative overflow-hidden cursor-pointer" onClick={() => setCarouselIndex(1)}>
              <Image src="/movie.jpeg" alt="Feed image 2" fill className="object-cover" />
            </div>
          </div>
          <div>
            <div className="feed-tile feed-dark relative overflow-hidden cursor-pointer" onClick={() => setCarouselIndex(2)}>
              <Image src="/ranthambore.jpeg" alt="Feed image 3" fill className="object-cover" />
            </div>
            <div className="feed-tile feed-tan relative overflow-hidden cursor-pointer" onClick={() => setCarouselIndex(3)}>
              <Image src="/4d72cdfe3e07ee7007fa2c04511fecb2.jpg" alt="Feed image 4" fill className="object-cover" />
            </div>
          </div>
          <div>
            <div className="feed-tile feed-green relative overflow-hidden cursor-pointer" onClick={() => setCarouselIndex(4)}>
              <Image src="/Snapchat-655750787.jpg.jpeg" alt="Feed image 5" fill className="object-cover" />
            </div>
            <div className="feed-tile feed-blue relative overflow-hidden cursor-pointer" onClick={() => setCarouselIndex(5)}>
              <Image src="/e21ac3ccada2d69b14786e9926052e2d.jpg" alt="Feed image 6" fill className="object-cover" />
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button 
            className="group flex items-center gap-2 text-sm text-[var(--muted)] px-4 py-2 rounded-full border border-[var(--line)] bg-[var(--surface)]"
            onClick={() => setCarouselIndex(Math.floor(Math.random() * FEED_IMAGES.length))}
          >
            <span>View all</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </motion.section>

      <AnimatePresence>
        {carouselIndex !== null && (
          <FeedCarousel
            images={FEED_IMAGES}
            initialIndex={carouselIndex}
            onClose={() => setCarouselIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
