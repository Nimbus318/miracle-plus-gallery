"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Project } from "@/lib/data"
import { GraduationCap, Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isLoading, setIsLoading] = useState(true)

  // 提取该项目所有 Founder 的去重学校和公司标签
  const schools = Array.from(new Set(project.founders.flatMap(f => f.education))).slice(0, 2);
  const companies = Array.from(new Set(project.founders.flatMap(f => f.work_history))).slice(0, 2);

  return (
    <Link href={`/project/${project.id}`} className="group h-full block">
      <Card className="h-full overflow-hidden border-0 bg-white/50 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-white dark:bg-white/5">
        {/* 图片区域：如果有图展示图，没图展示 Placeholder 渐变 */}
        <div className="aspect-video w-full relative bg-secondary/50 overflow-hidden">
          {project.image_url ? (
            <div className="w-full h-full relative">
              {isLoading && (
                <Skeleton className="absolute inset-0 z-10 rounded-none bg-muted" />
              )}
              <Image 
                src={project.image_url} 
                alt={project.name}
                fill
                className={cn(
                  "object-cover transition-transform duration-500 group-hover:scale-105",
                  isLoading ? "opacity-0" : "opacity-100"
                )}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onLoad={() => setIsLoading(false)}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-muted-foreground text-lg font-bold">
              {project.name.substring(0, 2)}
            </div>
          )}
          
          {/* 浮动标签：赛道 */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
            {project.tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="secondary" className="bg-background/90 backdrop-blur-sm shadow-sm text-[10px]">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <CardHeader className="p-4 pb-2">
          <h3 className="text-lg font-bold line-clamp-1 group-hover:text-brand transition-colors">
            {project.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 h-10">
            {project.one_liner}
          </p>
        </CardHeader>

        <CardContent className="p-4 pt-2">
          {/* Founder 背景标签 */}
          <div className="flex flex-wrap gap-2 mt-2">
            {schools.map(school => (
              <span key={school} className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded">
                <GraduationCap className="w-3 h-3" />
                {school}
              </span>
            ))}
            {companies.map(company => (
              <span key={company} className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded">
                <Briefcase className="w-3 h-3" />
                {company}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
