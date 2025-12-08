import Link from "next/link"
import { Github } from "lucide-react"
import { MobileMenu } from "@/components/mobile-menu"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 dark:border-white/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl">
            <span className="text-brand">MiraclePlus</span>
            <span>Gallery</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60 hover:text-brand">
              首页
            </Link>
            <Link href="/batches" className="transition-colors hover:text-foreground/80 text-foreground/60 hover:text-brand">
              历届项目
            </Link>
            <Link href="/insights" className="transition-colors hover:text-foreground/80 text-foreground/60 hover:text-brand">
              数据洞察
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/Nimbus318/miracle-plus-gallery"
            target="_blank"
            rel="noreferrer"
            className="text-foreground/60 hover:text-brand transition-colors"
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
