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
        className="p-2 -mr-2 text-foreground/60 hover:text-brand transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-14 left-0 right-0 border-b border-gray-100 dark:border-white/10 bg-background p-4 shadow-lg animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-base font-medium text-foreground/60 hover:text-brand transition-colors"
            >
              首页
            </Link>
            <Link
              href="/batches"
              onClick={() => setIsOpen(false)}
              className="text-base font-medium text-foreground/60 hover:text-brand transition-colors"
            >
              历届项目
            </Link>
            <Link
              href="/insights"
              onClick={() => setIsOpen(false)}
              className="text-base font-medium text-foreground/60 hover:text-brand transition-colors"
            >
              数据洞察
            </Link>
          </nav>
        </div>
      )}
    </div>
  )
}
