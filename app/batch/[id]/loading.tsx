import { Navbar } from "@/components/navbar";
import { Skeleton } from "@/components/ui/skeleton";

export default function BatchLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Header Skeleton */}
        <div className="bg-secondary/20 border-b border-gray-100 dark:border-white/10">
          <div className="container mx-auto px-4 py-12">
            <Skeleton className="h-4 w-20 mb-6 bg-muted-foreground/20" /> {/* Back link */}
            
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-4 w-full max-w-2xl">
                <Skeleton className="h-10 w-64 bg-muted-foreground/20" /> {/* Title */}
                <div className="space-y-2">
                   <Skeleton className="h-4 w-full bg-muted-foreground/20" />
                   <Skeleton className="h-4 w-2/3 bg-muted-foreground/20" />
                </div>
                
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-24 bg-muted-foreground/20" />
                  <Skeleton className="h-4 w-32 bg-muted-foreground/20" />
                  <Skeleton className="h-4 w-24 bg-muted-foreground/20" />
                </div>
              </div>
              
              {/* Stats Card Skeleton */}
              <div className="bg-card rounded-lg border-0 shadow-sm p-6 min-w-[280px]">
                <Skeleton className="h-6 w-20 mb-4 bg-muted-foreground/20" />
                <div className="space-y-3">
                  <div className="flex justify-between"><Skeleton className="h-4 w-12 bg-muted-foreground/20" /><Skeleton className="h-4 w-12 bg-muted-foreground/20" /></div>
                  <div className="flex justify-between"><Skeleton className="h-4 w-16 bg-muted-foreground/20" /><Skeleton className="h-4 w-12 bg-muted-foreground/20" /></div>
                  <div className="flex justify-between"><Skeleton className="h-4 w-16 bg-muted-foreground/20" /><Skeleton className="h-4 w-12 bg-muted-foreground/20" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col gap-8">
            {/* Tags */}
            <div className="flex gap-2">
               <Skeleton className="h-6 w-20 bg-muted-foreground/20" />
               <Skeleton className="h-6 w-16 bg-muted-foreground/20" />
               <Skeleton className="h-6 w-16 bg-muted-foreground/20" />
               <Skeleton className="h-6 w-16 bg-muted-foreground/20" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-full block">
                  <div className="h-full overflow-hidden rounded-xl border-0 bg-white/50 shadow-sm">
                    <Skeleton className="aspect-video w-full bg-muted-foreground/20" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-6 w-3/4 bg-muted-foreground/20" />
                      <Skeleton className="h-4 w-full bg-muted-foreground/20" />
                      <Skeleton className="h-4 w-2/3 bg-muted-foreground/20" />
                      <div className="flex gap-2 mt-4">
                        <Skeleton className="h-5 w-16 bg-muted-foreground/20" />
                        <Skeleton className="h-5 w-12 bg-muted-foreground/20" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

