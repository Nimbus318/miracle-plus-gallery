import { getBatches, getProjectsByBatch } from "@/lib/data";
import { Navbar } from "@/components/navbar";
import { BatchProjectList } from "@/components/pages/batch-project-list"; // Careful with this import, better move it to components/pages or shared
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Users, Info } from "lucide-react";
import { notFound } from "next/navigation";
import { Dictionary, Locale } from "@/lib/dictionary";
import { TranslationNotice } from "@/components/translation-notice";
import { getTranslatedStat } from "@/lib/tag-translations";

// Note: BatchProjectList is inside app/batch/[id]/... which is not ideal for sharing.
// I should probably move it to components/batch-project-list.tsx
// For now, I'll update the import if I move it.

interface BatchPageProps {
  id: string
  lang: Locale
  dict: Dictionary
}

const LOW_SIGNAL_TOP_TAGS = new Set(["AI", "人工智能"]);

export default function BatchPage({ id, lang, dict }: BatchPageProps) {
  const batches = getBatches();
  const batch = batches.find((b) => b.id === id);
  const t = dict.batches.detail;
  const prefix = lang === 'zh' ? '' : `/${lang}`;
  
  if (!batch) {
    notFound();
  }

  const batchInfo = (dict.batches.batch_info as any)?.[batch.id] || {};
  const displayName = batchInfo.name || batch.name;
  const displayDesc = batchInfo.desc || batch.description;

  const projects = getProjectsByBatch(id);

  const sanitizedProjects = projects.map(project => ({
    id: project.id,
    name: project.name,
    one_liner: project.one_liner,
    image_url: project.image_url,
    tags: project.tags,
    founders: project.founders.map(f => ({
      name: f.name,
      education: f.education,
      work_history: f.work_history,
      role: "", 
      bio: ""
    })),
    description: "",
    batch_id: project.batch_id
  }));

  const tagCounts: Record<string, number> = {};
  projects.forEach((p) => {
    p.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  const allTags = Object.entries(tagCounts)
    .filter(([tag]) => !LOW_SIGNAL_TOP_TAGS.has(tag))
    .sort((a, b) => {
      if (b[1] === a[1]) return a[0].localeCompare(b[0]); 
      return b[1] - a[1];
    })
    .slice(0, 10)
    .map(([tag]) => tag);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar lang={lang} dict={dict} />
      <TranslationNotice lang={lang} />
      
      <main className="flex-1">
        {/* Header */}
        <div className="bg-secondary/20 border-b border-gray-100 dark:border-white/10">
          <div className="container mx-auto px-4 py-12">
            <Link href={`${prefix}/`} className="inline-flex items-center text-sm text-muted-foreground hover:text-brand mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.back_home}
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-4 max-w-2xl">
                <h1 className="text-4xl font-bold tracking-tight">{displayName}</h1>
                <p className="text-lg text-muted-foreground">{displayDesc}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {batch.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {batch.location}
                  </div>
                  <div className="flex items-center gap-2 relative group cursor-help">
                    <Users className="h-4 w-4" />
                    <span>{t.projects_count.replace('{count}', batch.stats.project_count.toString())}</span>
                    <Info className="h-3 w-3 text-muted-foreground/70" />
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-popover text-popover-foreground text-xs rounded-md border-0 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      <p>{t.official_count.replace('{count}', batch.stats.project_count.toString())}</p>
                      <p className="text-muted-foreground mt-1">
                        {t.actual_count.replace('{count}', projects.length.toString())}
                      </p>
                      {/* Triangle */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-popover" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Stats Card */}
              <div className="bg-card rounded-lg border-0 shadow-sm p-6 min-w-[280px]">
                <h3 className="font-semibold mb-4">{t.highlights}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.acceptance}</span>
                    <span className="font-medium">{batch.stats.acceptance_rate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.phd}</span>
                    <span className="font-medium">{getTranslatedStat(batch.stats.phd_ratio || "", lang)}</span>
                  </div>
                  {batch.stats.overseas_experience && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.overseas}</span>
                      <span className="font-medium">{batch.stats.overseas_experience}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Grid */}
        <div className="container mx-auto px-4 py-12">
           {/* We need to pass lang/dict to BatchProjectList if it needs translation. It has a search input. */}
           <BatchProjectList projects={sanitizedProjects} topTags={allTags} dict={dict} />
        </div>
      </main>
    </div>
  );
}
