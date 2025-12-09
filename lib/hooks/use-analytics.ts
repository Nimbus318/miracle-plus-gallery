import { useMemo } from "react";
import { Project } from "@/lib/types";
import { Category, getCategoryForTag, normalizeUniversity } from "@/lib/taxonomy";
import { analyzeFounderProfile } from "@/lib/founder-analysis";

export interface AnalyticsFilters {
  years: number[];
  categories: string[];
}

export function useAnalytics(projects: Project[], filters: AnalyticsFilters) {
  const derivePrimaryCategory = (tags: string[]): Category => {
    const priority: Category[] = ["AI", "Hardware", "Software", "Bio", "Future", "Consumer", "Other"];
    const seen = new Set<Category>();
    tags.forEach(tag => {
      seen.add(getCategoryForTag(tag));
    });
    return priority.find(p => seen.has(p)) || "Other";
  };

  // 1. Filter Projects Base
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      // Year Filter
      const year = parseInt(p.batch_id.substring(0, 4));
      if (filters.years.length > 0 && !filters.years.includes(year)) {
        return false;
      }
      
      // Category Filter
      if (filters.categories.length > 0) {
        const pCats = p.tags.map(t => getCategoryForTag(t));
        if (!pCats.some(c => filters.categories.includes(c))) {
          return false;
        }
      }

      return true;
    });
  }, [projects, filters]);

  // 2. Compute Sector Trends (Over Time)
  // Format: { year: "2021", "AI": 10, "Bio": 5 ... }
  const sectorTrendData = useMemo(() => {
    const rawMap: Record<string, Record<string, number>> = {};
    const allYears = new Set<string>();
    
    // Use all projects to establish the timeline, but highlight filtered ones?
    // No, standard behavior is to show trends OF the filtered set (or the whole set if no filter).
    // If we filter by "2025", the trend chart becomes a single point, which is boring.
    // Usually, Trend Charts ignore the "Year" filter to show context, OR they zoom in.
    // Let's make the Trend Chart ALWAYS show global history, but maybe highlight the selection?
    // For simplicity V1: The Trend Chart shows Global Data (ignoring year filter), but respects Category filter.
    
    const relevantProjects = projects.filter(p => {
       if (filters.categories.length > 0) {
        const pCats = p.tags.map(t => getCategoryForTag(t));
        if (!pCats.some(c => filters.categories.includes(c))) return false;
       }
       return true;
    });

    relevantProjects.forEach(p => {
      // Use "Batch" as time unit for more granularity (2021S, 2021F)
      const batch = p.batch_id; 
      allYears.add(batch);
      
      if (!rawMap[batch]) rawMap[batch] = {};
      
      const category = derivePrimaryCategory(p.tags || []);
      rawMap[batch][category] = (rawMap[batch][category] || 0) + 1;
    });

    const sortedBatches = Array.from(allYears).sort((a, b) => {
       // Sort 2021S vs 2021F
       const yA = parseInt(a.substring(0, 4));
       const yB = parseInt(b.substring(0, 4));
       if (yA !== yB) return yA - yB;
       const sA = a.endsWith('F') ? 2 : 1;
       const sB = b.endsWith('F') ? 2 : 1;
       return sA - sB;
    });

    return sortedBatches.map(batch => {
      return {
        name: batch,
        ...rawMap[batch]
      };
    });
  }, [projects, filters.categories]);

  // 3. Compute Top Universities (Drill-down ready)
  const universityStats = useMemo(() => {
    const uniFounders: Record<string, Set<string>> = {};
    
    filteredProjects.forEach(p => {
      p.founders.forEach(f => {
        const founderId = f.name || "Unknown";
        f.education.forEach(edu => {
          if (!edu) return;
          const norm = normalizeUniversity(edu);
          
          if (!uniFounders[norm]) {
            uniFounders[norm] = new Set();
          }
          uniFounders[norm].add(founderId);
        });
      });
    });

    return Object.entries(uniFounders)
      .map(([name, founderSet]) => ({ name, value: founderSet.size }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 15); // Top 15
  }, [filteredProjects]);

  // 4. Compute Founder DNA (Advanced Degree vs Others, Overseas vs Local)
  const founderStats = useMemo(() => {
    // 使用 Map 进行去重 (Key: 姓名)
    const uniqueFounders = new Map<string, {
      isPhD: boolean;
      isAdvancedDegree: boolean;
      isOverseas: boolean;
    }>();

    filteredProjects.forEach(p => {
      p.founders.forEach(f => {
        const name = f.name ? f.name.trim() : "";
        if (!name) return;

        const profile = analyzeFounderProfile(f);
        const existing = uniqueFounders.get(name);

        if (existing) {
           // 合并信息
           uniqueFounders.set(name, {
             isPhD: existing.isPhD || profile.isPhD,
             isAdvancedDegree: existing.isAdvancedDegree || profile.isAdvancedDegree,
             isOverseas: existing.isOverseas || profile.isOverseas
           });
        } else {
           uniqueFounders.set(name, profile);
        }
      });
    });

    let advancedDegreeCount = 0;
    let phdCount = 0;
    let overseasCount = 0;
    const totalFounders = uniqueFounders.size;

    uniqueFounders.forEach(profile => {
        if (profile.isAdvancedDegree) advancedDegreeCount++;
        if (profile.isPhD) phdCount++;
        if (profile.isOverseas) overseasCount++;
    });

    return {
      advancedDegreeRatio: totalFounders ? (advancedDegreeCount / totalFounders) : 0,
      phdRatio: totalFounders ? (phdCount / totalFounders) : 0,
      overseasRatio: totalFounders ? (overseasCount / totalFounders) : 0,
      totalFounders,
      totalProjects: filteredProjects.length
    };
  }, [filteredProjects]);

  return {
    filteredProjects,
    sectorTrendData,
    universityStats,
    founderStats
  };
}
