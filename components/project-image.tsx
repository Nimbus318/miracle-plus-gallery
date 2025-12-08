"use client"

import { useState } from "react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface ProjectImageProps {
  src: string
  alt: string
  priority?: boolean
}

export function ProjectImage({ src, alt, priority = false }: ProjectImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="aspect-video w-full rounded-xl overflow-hidden bg-secondary/30 relative">
      {isLoading && (
        <Skeleton className="absolute inset-0 z-10 w-full h-full bg-muted-foreground/20 pointer-events-none" />
      )}
      <Image 
        src={src} 
        alt={alt}
        fill
        className={cn(
          "object-cover transition-opacity duration-500",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        sizes="(max-width: 1024px) 100vw, 800px"
        priority={priority}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
    </div>
  )
}

