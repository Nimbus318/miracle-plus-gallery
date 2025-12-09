"use client"

import React, { useEffect, useRef } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import {
  BarChart,
  LineChart,
  PieChart,
  GraphChart
} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { useTheme } from 'next-themes';
import { cn } from "@/lib/utils";

// Register the required components
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LineChart,
  PieChart,
  GraphChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);

interface ChartBaseProps {
  options: any;
  height?: string | number;
  loading?: boolean;
  onEvents?: Record<string, Function>;
  minimal?: boolean; // New prop to control border/background
}

export function ChartBase({ options, height = 400, loading = false, onEvents, minimal = false }: ChartBaseProps) {
  const { theme } = useTheme();
  const chartRef = useRef<ReactEChartsCore>(null); // Use Core type if available, or any
  
  // Inject Theme Colors
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e5e7eb' : '#374151';
  const tooltipBg = isDark ? '#1f2937' : '#ffffff';
  const tooltipBorder = isDark ? '#374151' : '#e5e7eb';

  const defaultOption = {
    backgroundColor: 'transparent',
    textStyle: {
      fontFamily: 'var(--font-sans)',
    },
    title: {
      textStyle: { color: textColor },
      left: 'center'
    },
    legend: {
      textStyle: { color: textColor },
      bottom: 0
    },
    tooltip: {
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      textStyle: { color: textColor },
      borderWidth: 1,
      padding: 10
    },
    ...options
  };

  return (
    <div className={cn(
      "w-full",
      !minimal && "rounded-lg border border-border/50 bg-card p-4 shadow-sm"
    )}>
      <ReactEChartsCore
        echarts={echarts}
        ref={chartRef}
        option={defaultOption}
        style={{ height, width: '100%' }}
        showLoading={loading}
        theme={isDark ? 'dark' : undefined}
        onEvents={onEvents}
      />
    </div>
  );
}
