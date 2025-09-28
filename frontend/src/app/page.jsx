"use client"

import { useCallback, useMemo, useState } from "react"
import useSWR from "swr"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { UploadPanel } from "@/components/upload-panel"
import { AnalysisControls } from "@/components/analysis-controls"
import { StudentsTable } from "@/components/students-table"
import { cn } from "@/lib/utils"

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:6000"
const fetcher = (url) => fetch(url).then((res) => res.json())

export default function Page() {
  const [range, setRange] = useState([2, 8])
  const [includeNonDream, setIncludeNonDream] = useState(true)

  const params = useMemo(() => {
    const usp = new URLSearchParams()
    usp.set("min", String(range[0]))
    usp.set("max", String(range[1]))
    usp.set("includeNonDream", String(includeNonDream))
    return usp.toString()
  }, [range, includeNonDream])

  const { data, isLoading } = useSWR(`${backendUrl}/student/unplaced?${params}`, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  })

  const onUploaded = useCallback(() => {
    // Optionally revalidate after upload
    // mutate(`/api/students?${params}`)
  }, [])

  return (
    <main className="min-h-[100svh] bg-background text-foreground">
      <section
        className={cn(
          "relative w-full min-h-[30svh] md:min-h-[32svh] lg:min-h-[34svh]",
          "bg-primary/5 border-b border-border",
          "animate-in fade-in-50 duration-500",
        )}
        aria-labelledby="upload-title"
      >
        <div className="mx-auto max-w-6xl px-4 py-6 md:py-8 lg:py-10">
          <div className="mb-4 md:mb-6">
            <h1
              id="upload-title"
              className="text-balance text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground"
            >
              Dream Analysis Workspace
            </h1>
            <p className="text-pretty mt-2 text-muted-foreground">
              Upload your .txt file to begin. Then tweak analysis parameters and see real-time results.
            </p>
          </div>

          <UploadPanel onUploaded={onUploaded} />
        </div>

        {/* Decorative but subtle top-right accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-6 -right-6 h-28 w-28 rounded-xl bg-accent/30 blur-md"
        />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 md:py-8 lg:py-10 animate-in slide-in-from-bottom-4 fade-in-50 duration-500">
        <Card
          className={cn(
            "border border-border/80 bg-card/80 backdrop-blur-sm",
            "transition-all duration-300 hover:shadow-lg",
          )}
        >
          <div className="flex flex-col gap-4 p-4 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-foreground">Analysis</h2>
                <p className="text-sm text-muted-foreground">Tune parameters to refine the student list below.</p>
              </div>
            </div>

            <AnalysisControls
              range={range}
              onRangeChange={(v) => setRange([v[0], v[1]])}
              includeNonDream={includeNonDream}
              onIncludeNonDreamChange={setIncludeNonDream}
            />

            <Separator />

            <StudentsTable students={data?.students ?? []} isLoading={isLoading} />
          </div>
        </Card>
      </section>
    </main>
  )
}