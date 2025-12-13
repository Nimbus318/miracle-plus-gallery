import { Navbar } from "@/components/navbar";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        {/* Back Link Skeleton */}
        <Skeleton className="h-4 w-32 mb-8 bg-muted-foreground/20" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Hero Info */}
            <div className="space-y-6">
              {/* Image Skeleton */}
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-secondary/30 relative">
                <Skeleton className="w-full h-full bg-muted-foreground/20" />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                   {/* Title Skeleton */}
                  <Skeleton className="h-10 w-1/2 bg-muted-foreground/20" />
                </div>
                
                {/* One Liner Skeleton */}
                <Skeleton className="h-6 w-3/4 bg-muted-foreground/20" />
                
                {/* Tags Skeleton */}
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-16 bg-muted-foreground/20" />
                  <Skeleton className="h-6 w-20 bg-muted-foreground/20" />
                  <Skeleton className="h-6 w-14 bg-muted-foreground/20" />
                </div>
              </div>
            </div>

            {/* Description Skeleton */}
            <section className="space-y-4">
              <Skeleton className="h-8 w-32 mb-4 bg-muted-foreground/20" />
              <div className="space-y-2">
                 <Skeleton className="h-4 w-full bg-muted-foreground/20" />
                 <Skeleton className="h-4 w-full bg-muted-foreground/20" />
                 <Skeleton className="h-4 w-full bg-muted-foreground/20" />
                 <Skeleton className="h-4 w-2/3 bg-muted-foreground/20" />
              </div>
            </section>

            {/* Founders Skeleton */}
            <section>
              <Skeleton className="h-8 w-32 mb-6 bg-muted-foreground/20" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-secondary/20 rounded-lg p-6 border border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-3 mb-3">
                      <Skeleton className="h-10 w-10 rounded-full bg-muted-foreground/20" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20 bg-muted-foreground/20" />
                        <Skeleton className="h-3 w-16 bg-muted-foreground/20" />
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                       <Skeleton className="h-3 w-full bg-muted-foreground/20" />
                       <Skeleton className="h-3 w-full bg-muted-foreground/20" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16 bg-muted-foreground/20" />
                      <Skeleton className="h-5 w-16 bg-muted-foreground/20" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-10">
            {/* Similar Projects Skeleton */}
             <section className="space-y-4">
               <Skeleton className="h-6 w-40 bg-muted-foreground/20" />
               <div className="flex flex-col gap-4">
                 {[1, 2, 3].map((i) => (
                    <div key={i} className="h-[200px] w-full rounded-xl border-0 bg-white/50 shadow-sm overflow-hidden">
                       <Skeleton className="h-1/2 w-full bg-muted-foreground/20" />
                       <div className="p-4 space-y-2">
                         <Skeleton className="h-5 w-3/4 bg-muted-foreground/20" />
                         <Skeleton className="h-4 w-full bg-muted-foreground/20" />
                       </div>
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


