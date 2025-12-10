"use client"

import { useState, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Project } from "@/lib/types"
import { TAXONOMY, getCategoryForTag } from "@/lib/taxonomy"
import { Navbar } from "@/components/navbar"
import { Search, Filter, GraduationCap, Globe } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ProjectSheet } from "@/components/project-sheet"

interface ExploreClientPageProps {
  initialProjects: Project[]
}

export default function ExploreClientPage({ initialProjects }: ExploreClientPageProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categorySet = useMemo(() => new Set(TAXONOMY.map(node => node.category)), [])
  const isCategory = (val: string | null): val is (typeof TAXONOMY)[number]["category"] =>
    !!val && categorySet.has(val as (typeof TAXONOMY)[number]["category"])

  const initialTag = searchParams.get("tag")
  const initialExactTag = searchParams.get("exact_tag")
  const initialCat = searchParams.get("cat")
  const initialQuery = searchParams.get("q") || searchParams.get("uni") || (initialTag && !isCategory(initialTag) ? initialTag : "")
  const initialYear = searchParams.get("year") ? parseInt(searchParams.get("year")!) : null

  // --- State ---
  // Initialize state from URL params
  const [query, setQuery] = useState(initialQuery)
  const [selectedYears, setSelectedYears] = useState<number[]>(initialYear ? [initialYear] : [])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const cats = new Set<string>()
    if (initialTag && isCategory(initialTag)) cats.add(initialTag)
    if (initialCat && isCategory(initialCat)) cats.add(initialCat)
    return Array.from(cats)
  })
  const [exactTags, setExactTags] = useState<string[]>(initialExactTag ? [initialExactTag] : [])
  const searchKey = searchParams.toString()
  const [showPhDOnly, setShowPhDOnly] = useState(false)
  const [showOverseasOnly, setShowOverseasOnly] = useState(false)
  
  // Derive selected project from URL
  const projectId = searchParams.get("projectId")
  const selectedProject = useMemo(() => 
    projectId ? initialProjects.find(p => p.id === projectId) || null : null
  , [projectId, initialProjects])
  
  // Helper to update URL without full reload
  const updateUrl = (newParams: URLSearchParams) => {
    router.push(`?${newParams.toString()}`, { scroll: false })
  }

  const openProject = (project: Project) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("projectId", project.id)
    updateUrl(params)
  }

  const closeProject = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("projectId")
    updateUrl(params)
  }
  
  
  // --- Constants ---
  const years = [2025, 2024, 2023, 2022, 2021]

  // --- Filtering Logic ---
  const filteredProjects = useMemo(() => {
    const results = initialProjects.filter(p => {
      // 0. Exact Tag Filter (New)
      if (exactTags.length > 0) {
        // Must contain ALL exact tags
        const hasAllTags = exactTags.every(t => p.tags.includes(t))
        if (!hasAllTags) return false
      }

      // 1. Keyword Search
      if (query) {
        const q = query.toLowerCase()
        const matchName = p.name.toLowerCase().includes(q)
        const matchDesc = p.description.toLowerCase().includes(q)
        const matchTag = p.tags.some(t => t.toLowerCase().includes(q))
        const matchFounder = p.founders.some(f => 
          f.name.toLowerCase().includes(q) || 
          f.education.some(e => e.toLowerCase().includes(q)) ||
          f.work_history.some(w => w.toLowerCase().includes(q))
        )
        if (!matchName && !matchDesc && !matchTag && !matchFounder) return false
      }

      // 2. Year Filter
      if (selectedYears.length > 0) {
        // extract year from batch_id (e.g., "2025S" -> 2025)
        const year = parseInt(p.batch_id.substring(0, 4))
        if (!selectedYears.includes(year)) return false
      }

      // 3. Category Filter
      if (selectedCategories.length > 0) {
        const projectCategories = p.tags.map(t => getCategoryForTag(t))
        // Check if project has ANY of the selected categories
        const hasCategory = projectCategories.some(c => selectedCategories.includes(c))
        if (!hasCategory) return false
      }

      // 4. Background Filters
      if (showPhDOnly) {
        const hasPhD = p.founders.some(f => 
          f.bio.toLowerCase().includes("phd") || 
          f.bio.toLowerCase().includes("博士") ||
          f.education.some(e => e.toLowerCase().includes("phd") || e.toLowerCase().includes("博士"))
        )
        if (!hasPhD) return false
      }

      if (showOverseasOnly) {
        // Simple heuristic: check for known overseas unis or manually tagged
        // For MVP, we'll rely on bio/education text detection or specific tags if available
        // Let's look for "University" (usually overseas) vs "大学" (usually domestic, but not always)
        // Better: check against a list of overseas unis, but for now let's use a simple heuristic
        // Or check if batch stats say it.
        // Let's check common overseas keywords in education
        const overseasKeywords = ["University", "College", "Institute", "MIT", "CMU", "Stanford", "Harvard", "Oxford", "Cambridge"]
        const hasOverseas = p.founders.some(f => 
          f.education.some(e => overseasKeywords.some(k => e.includes(k) && !e.includes("Chinese") && !e.includes("Beijing")))
        )
        if (!hasOverseas) return false
      }

      return true
    })

    // Sort by Batch ID Descending (Newest First)
    // Create a copy first to avoid mutating the filtered results
    return [...results].sort((a, b) => {
      const getScore = (batchId: string) => {
        if (!batchId) return 0;
        const cleanId = batchId.trim().toUpperCase();
        const year = parseInt(cleanId.substring(0, 4)) || 0;
        const season = cleanId.endsWith('F') ? 2 : 1;
        return year * 10 + season;
      };

      const scoreA = getScore(a.batch_id);
      const scoreB = getScore(b.batch_id);
      
      return scoreB - scoreA;
    });
  }, [initialProjects, query, selectedYears, selectedCategories, showPhDOnly, showOverseasOnly, exactTags])

  // --- Handlers ---
  const toggleYear = (year: number) => {
    setSelectedYears(prev => 
      prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
    )
  }

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }
  
  const removeExactTag = (tag: string) => {
    setExactTags(prev => prev.filter(t => t !== tag))
  }

  const toggleExactTag = (tag: string) => {
    setExactTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setQuery("")
    setSelectedYears([])
    setSelectedCategories([])
    setExactTags([])
    setShowPhDOnly(false)
    setShowOverseasOnly(false)
  }

  return (
    <div key={searchKey} className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col md:flex-row gap-8">
        
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0 space-y-8 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto pr-2">
          
          <div>
            <h3 className="text-lg font-semibold mb-4">筛选条件</h3>
            {/* Year Filter */}
            <div className="space-y-3 mb-6">
              <h4 className="text-sm font-medium text-muted-foreground">年份</h4>
              <div className="grid grid-cols-2 gap-2">
                {years.map(year => (
                  <div key={year} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`year-${year}`} 
                      checked={selectedYears.includes(year)}
                      onCheckedChange={() => toggleYear(year)}
                    />
                    <label htmlFor={`year-${year}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {year}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-3 mb-6">
              <h4 className="text-sm font-medium text-muted-foreground">赛道</h4>
              <div className="space-y-2">
                {TAXONOMY.map(node => (
                  <div key={node.category} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`cat-${node.category}`} 
                      checked={selectedCategories.includes(node.category)}
                      onCheckedChange={() => toggleCategory(node.category)}
                    />
                    <label htmlFor={`cat-${node.category}`} className="text-sm font-medium leading-none">
                      {node.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Sub-Category Tags (Level 2) */}
            {selectedCategories.length > 0 && (
              <div className="space-y-3 mb-6 animate-in slide-in-from-left-2 duration-300">
                <h4 className="text-sm font-medium text-muted-foreground">细分领域</h4>
                <div className="flex flex-wrap gap-2">
                  {TAXONOMY
                    .filter(node => selectedCategories.includes(node.category))
                    .flatMap(node => node.tags)
                    .map(tag => (
                      <Badge
                        key={tag}
                        variant={exactTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer hover:bg-secondary/80"
                        onClick={() => toggleExactTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                </div>
              </div>
            )}

            {/* Other Filters */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">团队背景</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="phd-filter" 
                    checked={showPhDOnly}
                  onCheckedChange={(c: boolean | "indeterminate") => setShowPhDOnly(!!c)}
                  />
                  <label htmlFor="phd-filter" className="text-sm font-medium leading-none flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" />
                    含博士成员
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="overseas-filter" 
                    checked={showOverseasOnly}
                  onCheckedChange={(c: boolean | "indeterminate") => setShowOverseasOnly(!!c)}
                  />
                  <label htmlFor="overseas-filter" className="text-sm font-medium leading-none flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    海外背景
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
            重置所有
          </Button>

        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          
          {/* Mobile Filter & Search Header */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="搜索项目、标签、创始人或学校..." 
                  className="pl-9"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              
              {/* Mobile Filter Sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    筛选
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>筛选项目</SheetTitle>
                    <SheetDescription>
                      找到最匹配的创业项目
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-6 space-y-6">
                     {/* Mobile Filters UI (Simplified duplication of desktop) */}
                     <div className="space-y-3">
                        <h4 className="text-sm font-medium">年份</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {years.map(year => (
                            <Button 
                              key={year} 
                              variant={selectedYears.includes(year) ? "default" : "outline"} 
                              size="sm"
                              onClick={() => toggleYear(year)}
                            >
                              {year}
                            </Button>
                          ))}
                        </div>
                     </div>
                     <div className="space-y-3">
                        <h4 className="text-sm font-medium">赛道</h4>
                        <div className="flex flex-wrap gap-2">
                          {TAXONOMY.map(node => (
                             <Badge 
                               key={node.category}
                               variant={selectedCategories.includes(node.category) ? "default" : "outline"}
                               className="cursor-pointer"
                               onClick={() => toggleCategory(node.category)}
                             >
                               {node.label}
                             </Badge>
                          ))}
                        </div>
                     </div>
                     <Button onClick={clearFilters} variant="secondary" className="w-full">重置</Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Results Count & Active Tags */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  找到 <span className="font-bold text-foreground">{filteredProjects.length}</span> 个项目
                </p>
              </div>
              
              {/* Active Exact Tag Filters */}
              {exactTags.length > 0 && (
                 <div className="flex flex-wrap gap-2">
                   {exactTags.map(tag => (
                     <Badge 
                       key={tag} 
                       variant="default" 
                       className="px-2 py-1 flex items-center gap-1 cursor-pointer hover:bg-primary/90"
                       onClick={() => removeExactTag(tag)}
                     >
                       #{tag}
                       <span className="ml-1 text-xs opacity-70">✕</span>
                     </Badge>
                   ))}
                 </div>
              )}
            </div>
          </div>

          {/* Project Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredProjects.map(project => (
                <div key={project.id} onClick={() => openProject(project)} className="group block cursor-pointer">
                  <Card className="p-4 md:p-5 transition-all hover:shadow-md border-border/50 hover:border-brand/30">
                    <div className="flex flex-col md:flex-row gap-4 md:items-start">
                      
                      {/* Left: Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-bold group-hover:text-brand transition-colors">
                            {project.name}
                          </h3>
                          <Badge variant="secondary" className="text-xs font-normal text-muted-foreground">
                            {project.batch_id}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground/80 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {project.tags.slice(0, 4).map(tag => (
                            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right: Founder Mini-profile */}
                      <div className="md:w-64 flex-shrink-0 flex flex-col gap-2 border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 md:pl-4">
                         {project.founders.slice(0, 2).map((f, idx) => (
                           <div key={idx} className="text-xs">
                              <div className="font-medium truncate">{f.name}</div>
                              <div className="text-muted-foreground truncate" title={f.education.join(", ")}>
                                {f.education[0] || f.work_history[0] || "背景未公开"}
                              </div>
                           </div>
                         ))}
                         {project.founders.length > 2 && (
                           <span className="text-xs text-muted-foreground">+ {project.founders.length - 2} 更多</span>
                         )}
                      </div>

                    </div>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
             // ... existing empty state
             <div className="py-20 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">未找到相关项目</h3>
              <p className="text-muted-foreground mt-2">
                尝试调整筛选条件或搜索关键词
              </p>
              <Button variant="link" onClick={clearFilters} className="mt-4">
                清除所有筛选
              </Button>
            </div>
          )}
          
        </main>
      </div>

      <ProjectSheet 
        project={selectedProject} 
        isOpen={!!selectedProject} 
        onClose={closeProject} 
        allProjects={initialProjects}
        onSelectProject={openProject}
      />

    </div>
  )
}