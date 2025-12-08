"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SearchHero() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/explore?q=${encodeURIComponent(query)}`)
    } else {
      router.push('/explore')
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto mt-8 group">
      <div className="relative flex items-center">
        {/* Left Icon: Blurred Search Icon */}
        <div className="absolute left-4 z-10 pointer-events-none transition-all duration-300 group-focus-within:scale-110">
           <Search className="h-5 w-5 text-muted-foreground/40 blur-[1px] transition-all duration-500 group-focus-within:text-brand group-focus-within:blur-0" />
        </div>

        <div className="relative flex-1">
          <Input 
            type="text" 
            className="h-14 pl-12 pr-16 w-full rounded-full border-2 border-muted/50 bg-background/50 backdrop-blur-sm 
              focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-brand
              focus:border-brand focus:ring-0 
              text-lg shadow-sm transition-all hover:border-brand/30 hover:shadow-md"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {/* Custom Placeholder with CSS-based responsiveness */}
          {!query && (
            <div className="absolute left-12 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none truncate right-16 select-none">
              <span className="md:hidden">搜索项目、赛道或高校...</span>
              <span className="hidden md:inline">搜索全库：试试 &apos;具身智能&apos;、&apos;大模型&apos; 或 &apos;清华大学&apos;...</span>
            </div>
          )}
        </div>
        <div className="absolute right-1.5 z-10">
          <Button 
            type="submit" 
            size="icon" 
            className="h-11 w-11 rounded-full bg-gradient-to-br from-brand to-blue-600 hover:from-blue-400 hover:to-brand shadow-lg shadow-brand/20 border-0 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <ArrowRight className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>
      
      {/* 热门搜索提示 */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-sm text-muted-foreground">
        <span>热门搜索:</span>
        <button type="button" onClick={() => router.push('/explore?tag=AI')} className="hover:text-brand hover:underline transition-colors">AI</button>
        <button type="button" onClick={() => router.push('/explore?q=机器人')} className="hover:text-brand hover:underline transition-colors">机器人</button>
        <button type="button" onClick={() => router.push('/explore?q=清华大学')} className="hover:text-brand hover:underline transition-colors">清华</button>
        <button type="button" onClick={() => router.push('/explore?q=出海')} className="hover:text-brand hover:underline transition-colors">出海</button>
      </div>
    </form>
  )
}
