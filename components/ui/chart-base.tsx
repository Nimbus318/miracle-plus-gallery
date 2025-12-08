"use client"

import React, { useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { useTheme } from 'next-themes';

interface ChartBaseProps {
  options: any;
  height?: string | number;
  loading?: boolean;
  onEvents?: Record<string, Function>;
}

export function ChartBase({ options, height = 400, loading = false, onEvents }: ChartBaseProps) {
  const { theme } = useTheme();
  const chartRef = useRef<ReactECharts>(null);

  // Auto-resize is handled by echarts-for-react internally, 
  // but we can force it if needed.
  
  // Inject Theme Colors
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e5e7eb' : '#374151';
  const gridColor = isDark ? '#374151' : '#e5e7eb';
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
    <div className="w-full rounded-lg border border-border/50 bg-card p-4 shadow-sm">
      <ReactECharts
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
