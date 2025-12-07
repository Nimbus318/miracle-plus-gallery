# MiraclePlus Gallery

一个专注于奇绩创坛（Miracle Plus）历届路演项目的数据洞察与展示平台。非官方项目。

## 核心功能

*   **数据洞察 Dashboard**：
    *   **高校势力榜**：统计 Founder 毕业院校分布。
    *   **赛道风向标**：历年热门赛道（AI、具身智能、出海）的演变趋势。
    *   **创投生态网络**：基于 Force Graph 的 [项目-学校-公司] 关系图谱。
*   **历届项目库**：收录 2024-2025 的所有公开路演项目，支持标签筛选。
*   **人脉关联推荐**：在项目详情页，自动挖掘并推荐潜在的“校友项目”和“前同事项目”。
*   **性能优化**：
    *   全静态化数据（Static Site Generation）。
    *   图片资源本地化 + Next.js Image 优化。
    *   基于 Tailwind CSS 的现代化响应式设计。

## 技术栈

*   **框架**: Next.js 15 (App Router)
*   **样式**: Tailwind CSS v4
*   **图表**: Recharts + React Force Graph
*   **图标**: Lucide React
*   **部署**: Vercel

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

## 数据更新机制

本项目采用 **LLM-ETL** 流程来保证数据的高质量：

1.  **Raw Data**: 将官方公众号推文保存为 Markdown (`data/raw_data_*.md`)。
2.  **Extraction**: 使用大模型遵循 `data/LLM_EXTRACTION_PROMPT.md` 提取结构化 JSON。
3.  **Normalization**: 自动归一化实体（如 "清华" -> "清华大学"）。
4.  **Asset Sync**: 运行 `python3 data/download_images.py` 自动下载并本地化图片资源。

## License

MIT © Nimbus318
