import { getAllProjects } from "@/lib/data"
import ExploreClientPage from "@/components/pages/explore-client-page"
import { Metadata } from "next"
import { Suspense } from "react"
import { getDictionary, Locale } from "@/lib/dictionary"

export const metadata: Metadata = {
  title: "探索项目库 | 奇绩创坛 2021-2026 全景数据库",
  description: "检索 500+ 中国前沿创业项目。支持按赛道、年份、创始人背景多维筛选。",
}

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'zh' }]
}

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const projects = getAllProjects()
  const dict = await getDictionary(lang)
  
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ExploreClientPage initialProjects={projects} lang={lang} dict={dict} />
    </Suspense>
  )
}
