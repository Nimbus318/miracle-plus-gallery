"use client"

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// 动态导入 ForceGraph，禁用 SSR
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => <div className="h-[500px] flex items-center justify-center bg-muted/20">加载关系图谱中...</div>
});

export function NetworkGraph({ data }: { data: any }) {
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 自适应容器宽度
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: 500
      });
    }
  }, []);

  return (
    <Card className="col-span-1 lg:col-span-2 border-0 shadow-sm bg-white/50 dark:bg-white/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          创投生态网络
          <Badge variant="outline" className="text-xs font-normal">Beta</Badge>
        </CardTitle>
        <CardDescription>
          探索项目、创始人毕业院校与前雇主之间的隐形连接。
          <span className="block mt-1 text-xs text-muted-foreground">
            🔵 蓝色: 创业项目 | 🟢 绿色: 学校节点 | 🟠 橙色: 公司节点
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 overflow-hidden" ref={containerRef}>
        <ForceGraph2D
          width={dimensions.width}
          height={dimensions.height}
          graphData={data}
          nodeLabel="name"
          nodeColor={node => (node as any).color}
          nodeRelSize={6}
          linkColor={() => 'rgba(150, 150, 150, 0.2)'}
          backgroundColor="rgba(0,0,0,0)" // 透明背景
          onNodeClick={(node: any) => {
            // 可以在这里做跳转，比如点击项目跳转到详情页
            if (node.type === 'project') {
              window.location.href = `/project/${node.id}`;
            }
          }}
          cooldownTicks={100}
          onEngineStop={() => {
            // 布局稳定后自动缩放
          }}
        />
      </CardContent>
    </Card>
  );
}
