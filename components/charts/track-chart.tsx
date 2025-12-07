"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TrackChartProps {
  data: { name: string; count: number }[]
}

const COLORS = ['#017BFF', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export function TrackChart({ data }: TrackChartProps) {
  // 只展示前 7 个，其他的合并为 "Other"
  const chartData = data.slice(0, 7);
  const otherCount = data.slice(7).reduce((acc, curr) => acc + curr.count, 0);
  if (otherCount > 0) {
    chartData.push({ name: '其他', count: otherCount });
  }

  return (
    <Card className="col-span-1 border-0 shadow-sm bg-white/50 dark:bg-white/5">
      <CardHeader>
        <CardTitle>热门赛道分布</CardTitle>
        <CardDescription>
          2025 全年最受关注的创业方向
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="count"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Legend layout="vertical" verticalAlign="middle" align="right" />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
