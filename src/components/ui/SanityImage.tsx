import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

interface SanityImageProps {
  value: any
  width?: number
  height?: number
  className?: string
  priority?: boolean
  alt?: string
}

export const SanityImage = ({
  value,
  width = 800,
  height,
  className,
  priority,
  alt,
}: SanityImageProps) => {
  if (!value?.asset) return null

  const imageUrl = urlFor(value)
    .width(width)
    .height(height || Math.round(width / 1.5))
    .url()

  return (
    <Image
      className={className}
      src={imageUrl}
      alt={alt || value.alt || ''}
      width={width}
      height={height || Math.round(width / 1.5)}
      priority={priority}
      placeholder={value.asset.metadata?.lqip ? 'blur' : 'empty'}
      blurDataURL={value.asset.metadata?.lqip}
    />
  )
}

