import { getAllProjects } from "@/lib/data"
import ExploreClientPage from "./client-page"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "探索项目库 | 奇绩创坛 2021-2025 全景数据库",
  description: "检索 500+ 中国前沿创业项目。支持按赛道、年份、创始人背景多维筛选。",
}

export default function Page() {
  const projects = getAllProjects()
  
  return (
    <ExploreClientPage initialProjects={projects} />
  )
}
