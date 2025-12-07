import { Navbar } from "@/components/navbar";
import { UniversityChart } from "@/components/charts/university-chart";
import { TrackChart } from "@/components/charts/track-chart";
import { getTopUniversities, getTopTags, getBatches } from "@/lib/data";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, GraduationCap, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const topUniversities = getTopUniversities();
  const topTags = getTopTags(20);
  const batches = getBatches();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="flex flex-col items-center space-y-4 text-center">
            <Badge variant="brand" className="px-3 py-1 text-sm">
              ✨ 收录 2025 全年 {topUniversities.length > 0 ? "100+" : ""} 精选项目
            </Badge>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              奇绩创坛<br className="hidden sm:inline" /> 创业项目数据洞察
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              探索中国最前沿的 Researcher Founders。
              <br/>
              从 Agent 到具身智能，从清华北大到全球顶尖高校，发现下一个独角兽。
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Link
                href="/batches"
                className="inline-flex h-10 items-center justify-center rounded-md bg-brand px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                浏览历届项目
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/insights"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                查看深度分析
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background gradient decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-brand/5 blur-[120px] rounded-full -z-10" />
      </section>

      {/* Global Insights Dashboard */}
      <section className="py-12 bg-secondary/30">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col space-y-2 mb-8">
            <h2 className="text-2xl font-bold tracking-tight">全貌概览</h2>
            <p className="text-muted-foreground">通过数据看透 2025 年创业趋势</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UniversityChart data={topUniversities} />
            <TrackChart data={topTags} />
          </div>
        </div>
      </section>

      {/* Batches List */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">历届创业营</h2>
            <p className="text-muted-foreground max-w-[600px]">
              每一届都是技术与理想的碰撞。点击查看详细项目列表与当届特有的赛道分布。
            </p>
          </div>

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
                      {batch.highlights.slice(0, 3).map(tag => (
                        <span key={tag} className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-gray-500/10">
                          {tag}
                        </span>
                      ))}
                      {batch.highlights.length > 3 && (
                        <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                          +{batch.highlights.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-6 border-t border-gray-100 dark:border-white/10 bg-secondary/30">
        <div className="container px-4 mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 MiraclePlus Gallery. Unofficial Fan Project.</p>
          <p className="mt-2">
            Built with Next.js, Tailwind CSS & Recharts. Data parsed from public articles.
          </p>
        </div>
      </footer>
    </div>
  );
}