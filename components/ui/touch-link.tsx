"use client"

import * as React from "react"
import Link, { LinkProps } from "next/link"
import { cn } from "@/lib/utils"

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>

interface TouchLinkProps extends LinkProps, AnchorProps {
  className?: string
  children: React.ReactNode
}

/**
 * Touch 优化的 Link：
 * - 记录 touch 起止坐标，过滤掉滚动手势
 * - 在轻触时主动 preventDefault 并使用 window.location 触发导航，避免移动端 click 延迟或丢失
 * - 保留普通点击/键盘可访问性
 */
export function TouchLink({
  href,
  className,
  children,
  prefetch = false,
  ...rest
}: TouchLinkProps) {
  const touchStart = React.useRef<{ x: number; y: number } | null>(null)

  const handleTouchStart = (e: React.TouchEvent<HTMLAnchorElement>) => {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLAnchorElement>) => {
    const start = touchStart.current
    touchStart.current = null
    const t = e.changedTouches[0]
    if (!start) return
    const dx = Math.abs(t.clientX - start.x)
    const dy = Math.abs(t.clientY - start.y)
    const moved = dx > 8 || dy > 8
    if (moved) return // 认为是滚动，不触发点击

    if (e.cancelable) e.preventDefault()
    // 确保首触即导航，绕过可能的 click 丢失
    const hrefStr = typeof href === "string" ? href : href.toString()
    window.location.href = hrefStr
  }

  return (
    <Link
      href={href}
      prefetch={prefetch}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={cn("touch-manipulation", className)}
      {...rest}
    >
      {children}
    </Link>
  )
}

