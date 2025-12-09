"use client"

import * as React from "react"
import { Moon, Sun, Laptop, Check } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ModeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [isOpen, setIsOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Handle click outside to close
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9 text-foreground/60">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 text-foreground/60 hover:text-foreground"
      >
        {resolvedTheme === 'dark' ? (
          <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
        ) : (
          <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-lg border border-border/40 bg-popover p-1 shadow-lg animate-in fade-in zoom-in-95 duration-200 z-50 ring-1 ring-black/5 dark:ring-white/5">
          <div className="flex flex-col space-y-0.5">
            {[
              { name: "light", label: "浅色", icon: Sun },
              { name: "dark", label: "深色", icon: Moon },
              { name: "system", label: "跟随系统", icon: Laptop },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => { setTheme(item.name); setIsOpen(false); }}
                className={cn(
                  "flex items-center justify-between w-full px-2.5 py-2 text-sm rounded-md transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  theme === item.name ? "bg-accent/60 text-accent-foreground font-medium" : "text-muted-foreground"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
                {theme === item.name && <Check className="h-3.5 w-3.5 opacity-70" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
