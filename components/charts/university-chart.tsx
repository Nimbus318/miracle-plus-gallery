"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface UniversityChartProps {
  data: { name: string; count: number }[]
}

export function UniversityChart({ data }: UniversityChartProps) {
  return (
    <Card className="col-span-1 border-0 shadow-sm bg-white/50 dark:bg-white/5">
      <CardHeader>
        <CardTitle>Founder 高校背景 Top 10</CardTitle>
        <CardDescription>
          统计 2025 春/秋两届创始人毕业院校
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20, top: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={100} 
              tick={{ fontSize: 12 }}
              interval={0}
            />
            <Tooltip 
              cursor={{ fill: 'var(--muted)' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index < 3 ? "var(--brand)" : "#94a3b8"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
