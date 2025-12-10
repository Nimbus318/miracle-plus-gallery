"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/project-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Project } from "@/lib/types";

interface BatchProjectListProps {
  projects: Project[];
  topTags: string[];
}

export function BatchProjectList({ projects, topTags }: BatchProjectListProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredProjects = selectedTag
    ? projects.filter((p) => p.tags.includes(selectedTag))
    : projects;

  return (
    <div className="flex flex-col gap-8">
      {/* 简单的标签云展示 */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium py-1">热门赛道：</span>
        <Badge 
            variant={selectedTag === null ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/90 transition-colors"
            onClick={() => setSelectedTag(null)}
        >
            全部
        </Badge>
        {topTags.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTag === tag ? "default" : "outline"}
            className={cn(
                "cursor-pointer transition-colors",
                selectedTag === tag 
                  ? "hover:bg-primary/90" 
                  : "hover:bg-secondary/80 hover:text-foreground"
            )}
            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        {filteredProjects.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                该分类下暂无项目
            </div>
        )}
      </div>
    </div>
  );
}
