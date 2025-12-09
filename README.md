# MiraclePlus Gallery

专注于奇绩创坛 (Miracle Plus) 历届路演项目的数据洞察与展示平台。非官方项目。

## 核心功能

*   **全景数据洞察**
    *   **赛道风向标**：基于 Apache ECharts 的动态折线图，展示 AI、具身智能、出海等核心赛道的历年演变趋势。
    *   **高校势力榜**：统计 Founder 毕业院校分布，展现创新源头。
    *   **年度热词**：基于标签云的年度技术热点可视化。
    *   **创始人画像**：博士比例、海外背景等关键指标统计。

*   **项目探索**
    *   **多维筛选**：支持按年份、赛道标签、关键词实时检索 2021-2025 所有公开路演项目。
    *   **响应式详情页**：针对移动端优化的项目展示卡片。

*   **人脉关联推荐**
    *   基于后台图谱数据，在项目详情页自动推荐潜在的“校友项目”和“前同事项目”，挖掘隐形连接。

*   **现代化架构**
    *   **极致性能**：全站静态化 (SSG) + 图片资源本地化。
    *   **现代 UI**：基于 Tailwind CSS v4 和 Radix UI 构建的深色模式优先界面。

## 本地运行

1.  **克隆仓库**
    ```bash
    git clone https://github.com/Nimbus318/miracle-plus-gallery.git
    cd miracle-plus-gallery
    ```

2.  **安装依赖**
    ```bash
    pnpm install
    ```

3.  **启动开发服务器**
    ```bash
    pnpm dev
    ```
    访问 http://localhost:3000

## License

MIT © Nimbus318
