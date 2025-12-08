"use client"

import { Project, Founder } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area" // You might need to add this component or just use div overflow
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { ArrowUpRight, GraduationCap, Briefcase, User, Calendar, Tag, ExternalLink } from "lucide-react"
import Link from "next/link"
import { ProjectImage } from "@/components/project-image"
import { useMemo } from "react"

// Simple client-side recommendation logic (mirrors lib/data.ts)
function getRelated(current: Project, all: Project[], limit = 3) {
  return all
    .filter(p => p.id !== current.id)
    .map(p => ({
      project: p,
      score: p.tags.filter(t => current.tags.includes(t)).length,
      commonTags: p.tags.filter(t => current.tags.includes(t))
    }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

interface ProjectSheetProps {
  project: Project | null
  allProjects: Project[]
  isOpen: boolean
  onClose: () => void
  onSelectProject: (p: Project) => void // Allow clicking related projects to switch view
}

export function ProjectSheet({ project, allProjects, isOpen, onClose, onSelectProject }: ProjectSheetProps) {
  
  const related = useMemo(() => {
    if (!project) return []
    return getRelated(project, allProjects)
  }, [project, allProjects])

  if (!project) return null

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto p-0 gap-0 border-l border-border/50 shadow-2xl">
        
        {/* Header Section */}
        <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/50 p-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs text-muted-foreground">
                  {project.batch_id}
                </Badge>
                {project.tags.slice(0, 2).map(t => (
                   <span key={t} className="text-xs text-brand font-medium">#{t}</span>
                ))}
              </div>
              <SheetTitle className="text-2xl font-bold leading-tight">
                {project.name}
              </SheetTitle>
              <SheetDescription className="text-base font-medium text-foreground/90 line-clamp-2">
                {project.one_liner}
              </SheetDescription>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-8">
          
          {/* Cover Image (if any) */}
          {project.image_url && (
            <div className="rounded-xl overflow-hidden border border-border/50 shadow-sm">
               <ProjectImage src={project.image_url} alt={project.name} />
            </div>
          )}

          {/* Description */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">项目介绍</h3>
            <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-line">
              {project.description}
            </p>
          </section>

          {/* Founders */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">创始团队</h3>
            <div className="grid grid-cols-1 gap-3">
              {project.founders.map((f, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50">
                  <div className="mt-1 h-8 w-8 rounded-full bg-background flex items-center justify-center text-muted-foreground shadow-sm">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{f.name}</span>
                      <span className="text-xs text-muted-foreground bg-background px-1.5 py-0.5 rounded border border-border/50">{f.role}</span>
                    </div>
                    {f.bio && <p className="text-xs text-muted-foreground leading-snug">{f.bio}</p>}
                    
                    <div className="flex flex-wrap gap-1.5 pt-1">
                       {f.education.map(edu => (
                         <Badge key={edu} variant="secondary" className="text-[10px] h-5 px-1.5 font-normal bg-background/50 text-muted-foreground">
                           <GraduationCap className="w-3 h-3 mr-1 opacity-70" />
                           {edu}
                         </Badge>
                       ))}
                       {f.work_history.map(work => (
                         <Badge key={work} variant="secondary" className="text-[10px] h-5 px-1.5 font-normal bg-background/50 text-muted-foreground">
                           <Briefcase className="w-3 h-3 mr-1 opacity-70" />
                           {work}
                         </Badge>
                       ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Related Projects Recommendation */}
          {related.length > 0 && (
            <section className="space-y-3 pt-4 border-t border-dashed border-border/50">
               <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                 <Tag className="h-4 w-4" />
                 相似项目推荐
               </h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 {related.map(item => (
                   <div 
                     key={item.project.id} 
                     onClick={() => onSelectProject(item.project)}
                     className="cursor-pointer group flex flex-col p-3 rounded-lg border border-border/50 hover:border-brand/50 hover:bg-brand/5 transition-all"
                   >
                     <div className="flex items-center justify-between mb-1">
                       <span className="font-bold text-sm group-hover:text-brand transition-colors line-clamp-1">{item.project.name}</span>
                       <Badge variant="outline" className="text-[10px] px-1 h-4">{item.project.batch_id}</Badge>
                     </div>
                     <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.project.one_liner}</p>
                     <div className="mt-auto">
                        <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-brand/10 text-brand border-brand/10">
                          匹配: {item.commonTags[0]}
                        </Badge>
                     </div>
                   </div>
                 ))}
               </div>
            </section>
          )}

          {/* Footer Actions */}
          <div className="pt-8 flex justify-center pb-4">
            <Link href={`/project/${project.id}`} target="_blank">
               <Button variant="outline" className="gap-2">
                 打开完整详情页
                 <ExternalLink className="h-3 w-3" />
               </Button>
            </Link>
          </div>

        </div>
      </SheetContent>
    </Sheet>
  )
}
