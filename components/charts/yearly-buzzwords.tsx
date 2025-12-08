"use client"

import { useMemo } from "react";
import { Project } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { TrendingUp } from "lucide-react";

interface YearlyBuzzwordsProps {
  projects: Project[];
}

export function YearlyBuzzwords({ projects }: YearlyBuzzwordsProps) {
  const router = useRouter();

  const buzzwords = useMemo(() => {
    const yearGroups: Record<string, Project[]> = {};
    
    // Group by Year
    projects.forEach(p => {
      const year = p.batch_id.substring(0, 4);
      if (!yearGroups[year]) yearGroups[year] = [];
      yearGroups[year].push(p);
    });

    const years = Object.keys(yearGroups).sort((a, b) => parseInt(b) - parseInt(a));

    return years.map(year => {
      const yearProjects = yearGroups[year];
      const tagCounts: Record<string, number> = {};
      
      yearProjects.forEach(p => {
        p.tags.forEach(tag => {
          // Exclude generic tags if needed
          if (["AI", "Software", "Hardware"].includes(tag)) return;
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });

      const topTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([tag, count]) => ({ tag, count }));

      return { year, topTags };
    });
  }, [projects]);

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-lg font-semibold tracking-tight">年度热词</h3>
      </div>

      <div className="space-y-8">
        {buzzwords.map(({ year, topTags }) => (
          <div key={year} className="relative pl-4 border-l border-border/40 transition-colors">
            <div className="absolute -left-[3px] top-1.5 w-1.5 h-1.5 rounded-full bg-border" />
            <div className="mb-3 flex items-baseline justify-between">
              <span className="text-sm font-medium font-mono text-muted-foreground">{year}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {topTags.map(({ tag, count }, idx) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className={`
                    cursor-pointer hover:bg-primary/5 transition-all font-normal
                    ${idx === 0 ? 'text-primary border-primary/20' : 'text-muted-foreground border-border'}
                  `}
                  onClick={() => router.push(`/explore?tag=${tag}`)}
                >
                  #{tag} 
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
