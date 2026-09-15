import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { reveal } from './animations'

export function Feed() {
  return (
    <motion.section layout variants={reveal} aria-labelledby="feed-title">
      <h2 id="feed-title" className="section-title">My feed.</h2>
      <div className="feed-grid">
        <div>
          <div className="feed-tile feed-paper relative overflow-hidden">
            <Image src="/taj.jpeg" alt="Feed image 1" fill className="object-cover" />
          </div>
          <div className="feed-tile feed-brown relative overflow-hidden">
            <Image src="/movie.jpeg" alt="Feed image 2" fill className="object-cover" />
          </div>
        </div>
        <div>
          <div className="feed-tile feed-dark relative overflow-hidden">
            <Image src="/ranthambore.jpeg" alt="Feed image 3" fill className="object-cover" />
          </div>
          <div className="feed-tile feed-tan relative overflow-hidden">
            <Image src="/4d72cdfe3e07ee7007fa2c04511fecb2.jpg" alt="Feed image 4" fill className="object-cover" />
          </div>
        </div>
        <div>
          <div className="feed-tile feed-green relative overflow-hidden">
            <Image src="/Snapchat-655750787.jpg.jpeg" alt="Feed image 5" fill className="object-cover" />
          </div>
          <div className="feed-tile feed-blue relative overflow-hidden">
            <Image src="/e21ac3ccada2d69b14786e9926052e2d.jpg" alt="Feed image 6" fill className="object-cover" />
          </div>
        </div>
      </div>
      {/* <motion.a className="view-all" href="#feed" whileHover={{ gap: '10px' }} transition={{ duration: 0.2 }}>View all <ArrowUpRight /></motion.a> */}
    </motion.section>
  )
}

