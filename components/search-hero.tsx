"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
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
        <Search className="absolute left-4 h-5 w-5 text-muted-foreground group-focus-within:text-brand transition-colors" />
        <Input 
          type="text" 
          placeholder="搜索全库：试试 '具身智能'、'大模型' 或 '清华大学'..." 
          className="h-14 pl-12 pr-32 rounded-full border-2 border-muted/50 bg-background/50 backdrop-blur-sm focus:border-brand/50 focus:ring-0 text-lg shadow-sm transition-all hover:border-brand/30 hover:shadow-md"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="absolute right-2">
          <Button type="submit" size="sm" className="h-10 rounded-full px-6 font-medium">
            搜索
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
