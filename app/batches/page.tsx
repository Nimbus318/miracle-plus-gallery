import { getBatches } from "@/lib/data";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, GraduationCap, Globe } from "lucide-react";

export default function BatchesPage() {
  const batches = getBatches();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-12 flex-1">
        <h1 className="text-3xl font-bold mb-8">历届创业营</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {batches.map((batch) => {
            if (batch.disabled) {
              return (
                <div key={batch.id} className="relative overflow-hidden rounded-xl border border-dashed border-muted-foreground/20 bg-muted/30 p-8 h-full flex flex-col justify-center items-center text-center">
                  <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
                  <div className="relative z-10 flex flex-col items-center gap-4 opacity-60">
                     <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="text-lg px-3 py-1 bg-transparent border-dashed text-muted-foreground">
                          {batch.year} {batch.season === 'Spring' ? '春季' : '秋季'}
                        </Badge>
                     </div>
                    <h3 className="text-2xl font-bold text-muted-foreground">
                      {batch.name}
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-[200px]">
                      {batch.description}
                    </p>
                  </div>
                </div>
              );
            }

            return (
            <Link key={batch.id} href={`/batch/${batch.id}`} className="group block touch-manipulation active:scale-[0.99] transition-transform">
              <div className="relative overflow-hidden rounded-xl border-0 shadow-sm bg-card text-card-foreground transition-all [@media(hover:hover)]:hover:shadow-xl [@media(hover:hover)]:hover:-translate-y-1 h-full">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      {batch.year} {batch.season === 'Spring' ? '春季' : '秋季'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{batch.date}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-brand transition-colors">
                    {batch.name}
                  </h3>
                  <p className="text-muted-foreground mb-6 line-clamp-2">
                    {batch.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-brand" />
                      <span>{batch.stats.project_count} 个入围项目</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-brand" />
                      <span>录取率 {batch.stats.acceptance_rate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-brand" />
                      <span>{batch.stats.phd_ratio}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-brand" />
                      <span>{batch.stats.overseas_experience || "全球化背景"}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {batch.highlights.map(tag => (
                      <span key={tag} className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-gray-500/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
