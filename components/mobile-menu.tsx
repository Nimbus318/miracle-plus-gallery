"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 -mr-3 text-foreground/60 [@media(hover:hover)]:hover:text-brand transition-colors active:scale-95 touch-manipulation"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-14 left-0 right-0 border-b border-gray-100 dark:border-white/10 bg-background/95 backdrop-blur-md p-4 shadow-lg animate-in slide-in-from-top-2 z-50">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block py-3 text-lg font-medium text-foreground/60 [@media(hover:hover)]:hover:text-brand transition-colors active:text-brand active:bg-secondary/50 rounded-md px-2"
            >
              首页
            </Link>
            <Link
              href="/batches"
              onClick={() => setIsOpen(false)}
              className="block py-3 text-lg font-medium text-foreground/60 [@media(hover:hover)]:hover:text-brand transition-colors active:text-brand active:bg-secondary/50 rounded-md px-2"
            >
              历届项目
            </Link>
            <Link
              href="/insights"
              onClick={() => setIsOpen(false)}
              className="block py-3 text-lg font-medium text-foreground/60 [@media(hover:hover)]:hover:text-brand transition-colors active:text-brand active:bg-secondary/50 rounded-md px-2"
            >
              数据洞察
            </Link>
          </nav>
        </div>
      )}
    </div>
  )
}
