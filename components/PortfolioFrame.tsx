'use client'

import { LayoutGroup } from 'framer-motion'

export function PortfolioFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="portfolio-frame">
      <LayoutGroup>{children}</LayoutGroup>
    </div>
  )
}
