'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

export default function StudioPage() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <NextStudio config={config} />
    </div>
  )
}

