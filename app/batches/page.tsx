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
          {batches.map((batch) => (
            <Link key={batch.id} href={`/batch/${batch.id}`} className="group block">
              <div className="relative overflow-hidden rounded-xl border-0 shadow-sm bg-card text-card-foreground transition-all hover:shadow-xl hover:-translate-y-1 h-full">
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
          ))}
        </div>
      </main>
    </div>
  );
}
