import { getTopUniversities, getTopTags } from "@/lib/data";
import { getEcosystemGraphData, getTrackTrends } from "@/lib/analytics";
import { Navbar } from "@/components/navbar";
import { UniversityChart } from "@/components/charts/university-chart";
import { TrackChart } from "@/components/charts/track-chart";
import { NetworkGraph } from "@/components/charts/network-graph";
import { TrendChart } from "@/components/charts/trend-chart";

export default function InsightsPage() {
  const topUniversities = getTopUniversities(20);
  const topTags = getTopTags(20);
  const graphData = getEcosystemGraphData();
  const { chartData: trendData, topTags: trendTags } = getTrackTrends();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="flex flex-col space-y-2 mb-12">
          <h1 className="text-3xl font-bold tracking-tight">数据洞察</h1>
          <p className="text-muted-foreground">
            深度挖掘 100+ 项目背后的趋势与人脉网络。
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <UniversityChart data={topUniversities} />
          <TrackChart data={topTags} />
        </div>

        <div className="grid grid-cols-1 gap-8">
          <TrendChart data={trendData} tags={trendTags} />
          <NetworkGraph data={graphData} />
        </div>
      </main>
    </div>
  );
}