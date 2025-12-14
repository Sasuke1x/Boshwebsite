'use client'

import { useEffect } from 'react'

export function VisualEditing() {
  useEffect(() => {
    // Dynamically import and enable visual editing only on client side
    import('@sanity/visual-editing').then(({ enableVisualEditing }) => {
      enableVisualEditing()
    })
  }, [])

  return null
}

