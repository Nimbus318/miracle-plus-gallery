"use client"

import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface TappableProps extends React.HTMLAttributes<HTMLDivElement> {
  href: string
  children: React.ReactNode
  className?: string
}

export function Tappable({ href, children, className, ...props }: TappableProps) {
  const router = useRouter()

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Prevent default behavior to stop ghost clicks and double-tap zoom
    // But be careful not to block scrolling if the user is dragging
    // For simple buttons, simple navigation on touch end is usually safe 
    // if we are sure it's a tap.
    // A safer bet for "sticky hover" is actually just standard onClick but 
    // ensuring no hover styles are applied on mobile.
    // However, the user reports persistent issues.
    // Let's try a direct navigation approach on Click, but purely programmatic.
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent default Link behavior if we were using a Link
    router.push(href)
  }

  return (
    <div 
      onClick={handleClick}
      role="button"
      tabIndex={0}
      className={cn("cursor-pointer select-none touch-manipulation", className)}
      {...props}
    >
      {children}
    </div>
  )
}
