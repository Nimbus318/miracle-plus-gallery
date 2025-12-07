"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const COLORS = ['#017BFF', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6'];

interface TrendChartProps {
  data: any[];
  tags: string[];
}

export function TrendChart({ data, tags }: TrendChartProps) {
  return (
    <Card className="col-span-1 lg:col-span-2 border-0 shadow-sm bg-white/50 dark:bg-white/5">
      <CardHeader>
        <CardTitle>赛道演变趋势</CardTitle>
        <CardDescription>
          历届热门赛道项目数量变化（Top 8）
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              {tags.map((tag, index) => (
                <linearGradient key={tag} id={`color${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0}/>
                </linearGradient>
              ))}
            </defs>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--popover)', 
                borderColor: 'var(--border)', 
                borderRadius: '8px',
                color: 'var(--popover-foreground)'
              }} 
            />
            <Legend />
            {tags.map((tag, index) => (
              <Area 
                key={tag}
                type="monotone" 
                dataKey={tag} 
                stackId="1" 
                stroke={COLORS[index % COLORS.length]} 
                fill={`url(#color${index})`} 
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
