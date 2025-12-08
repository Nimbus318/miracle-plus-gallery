import Link from "next/link"
import { Github } from "lucide-react"
import { MobileMenu } from "@/components/mobile-menu"
import { TouchLink } from "@/components/ui/touch-link"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 dark:border-white/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <TouchLink
            href="/"
            className="flex items-center space-x-2 font-bold text-xl p-2 -ml-2 rounded-md active:bg-secondary/50 active:scale-[0.98] transition-colors touch-manipulation block"
          >
            <span className="text-brand">MiraclePlus</span>
            <span>Gallery</span>
          </TouchLink>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/batches"
              className="transition-colors text-foreground/60 touch-manipulation active:opacity-80 [@media(hover:hover)]:hover:text-foreground/80 [@media(hover:hover)]:hover:text-brand"
            >
              历届项目
            </Link>
            <Link
              href="/insights"
              className="transition-colors text-foreground/60 touch-manipulation active:opacity-80 [@media(hover:hover)]:hover:text-foreground/80 [@media(hover:hover)]:hover:text-brand"
            >
              数据洞察
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="https://github.com/Nimbus318/miracle-plus-gallery"
            target="_blank"
            rel="noreferrer"
            className="p-2 text-foreground/60 [@media(hover:hover)]:hover:text-brand transition-colors active:scale-95 touch-manipulation"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
