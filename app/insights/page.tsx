import { getAllProjects } from "@/lib/data";
import { Navbar } from "@/components/navbar";
import { InsightsDashboard } from "./insights-dashboard";

export default function InsightsPage() {
  const projects = getAllProjects();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="flex flex-col space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">数据洞察</h1>
          <p className="text-muted-foreground">
            基于 {projects.length} 个入选项目的多维数据分析，揭示赛道演变与人才流动趋势。
          </p>
        </div>
        
        <InsightsDashboard projects={projects} />
      </main>
    </div>
  );
}
