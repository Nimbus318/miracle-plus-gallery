"use client"

import { useMemo } from "react";
import { Project } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { TrendingUp } from "lucide-react";
import { getCategoryForTag } from "@/lib/taxonomy";

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
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });

      const topTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([tag, count]) => ({ tag, count }));

      const maxCount = topTags.length > 0 ? topTags[0].count : 1;

      return { year, topTags, maxCount };
    });
  }, [projects]);

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-lg font-semibold tracking-tight">年度热词</h3>
      </div>

      <div className="space-y-8">
        {buzzwords.map(({ year, topTags, maxCount }) => (
          <div key={year} className="relative pl-4 border-l border-border/40 transition-colors">
            <div className="absolute -left-[3px] top-1.5 w-1.5 h-1.5 rounded-full bg-border" />
            <div className="mb-3 flex items-baseline justify-between">
              <span className="text-sm font-medium font-mono text-muted-foreground">{year}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {topTags.map(({ tag, count }, idx) => {
                // Calculate visual weight (0.6 to 1.0 range)
                const intensity = 0.6 + (count / maxCount) * 0.4;
                const isTop = idx === 0;
                
                return (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className={`
                      cursor-pointer transition-all
                      ${isTop ? 'font-bold border-primary text-primary bg-primary/5' : 'font-normal border-border text-muted-foreground hover:bg-muted'}
                    `}
                    style={{
                      opacity: intensity,
                      transform: isTop ? 'scale(1.05)' : 'scale(1)',
                    }}
                    onClick={() => {
                      const category = getCategoryForTag(tag);
                      const catParam = category && category !== 'Other' ? `&cat=${category}` : '';
                      router.push(`/explore?exact_tag=${tag}&year=${year}${catParam}`);
                    }}
                  >
                    #{tag} <span className="ml-1 text-[10px] opacity-70 font-normal">({count})</span>
                  </Badge>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
