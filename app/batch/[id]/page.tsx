import { getBatches, getProjectsByBatch, getProjectById } from "@/lib/data";
import { Navbar } from "@/components/navbar";
import { BatchProjectList } from "./batch-project-list";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Users, Info } from "lucide-react";
import { notFound } from "next/navigation";

// 生成静态参数（因为我们的数据是静态的）
export async function generateStaticParams() {
  const batches = getBatches();
  return batches.map((batch) => ({
    id: batch.id,
  }));
}

export default async function BatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const batches = getBatches();
  const batch = batches.find((b) => b.id === id);
  
  if (!batch) {
    notFound();
  }

  const projects = getProjectsByBatch(id);

  // 1. 数据瘦身 (Sanitization)
  // 因为 ProjectCard 是 Client Component，所有传递给它的 props 都会被序列化到 HTML 中。
  // 为了显著减少 HTML 体积，我们只传递卡片展示所需的最小数据集。
  const sanitizedProjects = projects.map(project => ({
    id: project.id,
    name: project.name,
    one_liner: project.one_liner,
    image_url: project.image_url,
    tags: project.tags,
    founders: project.founders.map(f => ({
      name: f.name, // 保留名字用于 key 或展示
      education: f.education,
      work_history: f.work_history,
      // 移除 'role' 和 'bio'，ProjectCard 暂时不需要 bio，role 也不是核心展示
      role: "", 
      bio: ""
    })),
    // 移除大段文本
    description: "",
    batch_id: project.batch_id
  }));

  // 提取该届次的所有 Tags，按出现次数降序取前 10 作为“热门赛道”
  const tagCounts: Record<string, number> = {};
  projects.forEach((p) => {
    p.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  const allTags = Object.entries(tagCounts)
    .sort((a, b) => {
      if (b[1] === a[1]) return a[0].localeCompare(b[0]); // 频次相同时按字母序
      return b[1] - a[1];
    })
    .slice(0, 10)
    .map(([tag]) => tag);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <div className="bg-secondary/20 border-b border-gray-100 dark:border-white/10">
          <div className="container mx-auto px-4 py-12">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-brand mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回首页
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-4 max-w-2xl">
                <h1 className="text-4xl font-bold tracking-tight">{batch.name}</h1>
                <p className="text-lg text-muted-foreground">{batch.description}</p>
                
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
                    <span>{batch.stats.project_count} 个入围项目</span>
                    <Info className="h-3 w-3 text-muted-foreground/70" />
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-popover text-popover-foreground text-xs rounded-md border-0 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      <p>官方入围 {batch.stats.project_count} 个。</p>
                      <p className="text-muted-foreground mt-1">
                        本站基于公开路演信息实际收录 {projects.length} 个，部分项目未包含在内。
                      </p>
                      {/* Triangle */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-popover" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Stats Card */}
              <div className="bg-card rounded-lg border-0 shadow-sm p-6 min-w-[280px]">
                <h3 className="font-semibold mb-4">本届亮点</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">录取率</span>
                    <span className="font-medium">{batch.stats.acceptance_rate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">硕博比例</span>
                    <span className="font-medium">{batch.stats.phd_ratio}</span>
                  </div>
                  {batch.stats.overseas_experience && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">海外背景</span>
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
           <BatchProjectList projects={sanitizedProjects} topTags={allTags} />
        </div>
      </main>
    </div>
  );
}
