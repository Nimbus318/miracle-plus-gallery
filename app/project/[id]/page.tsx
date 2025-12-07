import { getAllProjects, getProjectById, getRelatedProjects, getProjectsByBatch, getNetworkProjects } from "@/lib/data";
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { ProjectCard } from "@/components/project-card";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, GraduationCap, Briefcase, User, Link as LinkIcon } from "lucide-react";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project) => ({
    id: project.id,
  }));
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  const relatedProjects = getRelatedProjects(project);
  
  // 人脉网络推荐：优先基于 Founder 的学校和工作经历
  const networkProjects = getNetworkProjects(project);
  
  // 构造侧边栏推荐列表：人脉推荐 > 3 ? 取前3 : 用同届随机补位
  // 这里我们需要给 project 对象增加一个临时的 reason 字段用于展示
  let sidebarProjects = networkProjects.map(n => ({ ...n.project, reason: n.reason }));
  
  if (sidebarProjects.length < 3) {
    const existingIds = new Set([project.id, ...relatedProjects.map(p => p.id), ...sidebarProjects.map(p => p.id)]);
    
    // 获取同届其他项目进行补位
    const batchFillers = getProjectsByBatch(project.batch_id)
      .filter(p => !existingIds.has(p.id))
      // 简单的洗牌算法
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
      .slice(0, 3 - sidebarProjects.length);
      
    sidebarProjects = [...sidebarProjects, ...batchFillers.map(p => ({ ...p, reason: "同届校友" }))];
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <Link href={`/batch/${project.batch_id}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-brand mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回 {project.batch_id} 届次列表
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Hero Info */}
            <div className="space-y-6">
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-secondary/30 relative">
                {project.image_url ? (
                  <Image 
                    src={project.image_url} 
                    alt={project.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 800px"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-2xl font-bold">
                    {project.name}
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h1 className="text-4xl font-bold">{project.name}</h1>
                  {/* 预留 Website Link */}
                  {/* <a href="#" className="p-2 rounded-full bg-secondary hover:bg-secondary/80 text-foreground">
                    <LinkIcon className="h-5 w-5" />
                  </a> */}
                </div>
                
                <p className="text-xl font-medium text-brand">
                  {project.one_liner}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-sm px-3 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Description */}
            <section>
              <h2 className="text-2xl font-bold mb-4">项目介绍</h2>
              <div className="prose max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                {project.description}
              </div>
            </section>

            {/* Founders */}
            <section>
              <h2 className="text-2xl font-bold mb-6">创始团队</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.founders.map((founder, idx) => (
                  <div key={idx} className="bg-secondary/20 rounded-lg p-6 border border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold">{founder.name}</div>
                        <div className="text-xs text-muted-foreground">{founder.role}</div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-4">
                      {founder.bio}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {founder.education.map(school => (
                        <Badge key={school} variant="outline" className="bg-background text-[10px] font-normal">
                          <GraduationCap className="mr-1 h-3 w-3" />
                          {school}
                        </Badge>
                      ))}
                      {founder.work_history.map(company => (
                        <Badge key={company} variant="outline" className="bg-background text-[10px] font-normal">
                          <Briefcase className="mr-1 h-3 w-3" />
                          {company}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-10">
            {relatedProjects.length > 0 && (
              <section>
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <span className="w-1 h-5 bg-brand rounded-full mr-2"></span>
                  相似赛道推荐
                </h3>
                <div className="flex flex-col gap-4">
                  {relatedProjects.map(p => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              </section>
            )}

            <section>
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <span className="w-1 h-5 bg-secondary rounded-full mr-2"></span>
                人脉与校友
              </h3>
              <div className="flex flex-col gap-4">
                {sidebarProjects.map(p => (
                  <div key={p.id} className="relative">
                    <ProjectCard project={p} />
                    {p.reason && (
                      <Badge variant="secondary" className="absolute top-2 left-2 text-[10px] px-1.5 py-0.5 h-5 bg-white/90 backdrop-blur shadow-sm border border-brand/10 text-brand z-10">
                        {p.reason}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
