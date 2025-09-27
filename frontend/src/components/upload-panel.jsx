"use client"

import { useCallback, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

export function UploadPanel({ onUploaded }) {
    const [dragActive, setDragActive] = useState(false)
    const [uploading, setUploading] = useState(false)
    const inputRef = useRef(null)
    const { toast } = useToast()

    const handleFiles = useCallback(
        async (files) => {
            if (!files || files.length === 0) return
            const file = files[0]
            if (!file.name.toLowerCase().endsWith(".txt")) {
                toast({ title: "Invalid file", description: "Please upload a .txt file.", variant: "destructive" })
                return
            }
            setUploading(true)
            try {
                const fd = new FormData()
                fd.append("file", file)
                const res = await fetch("/api/upload", { method: "POST", body: fd })
                if (!res.ok) throw new Error("Upload failed")
                toast({ title: "Uploaded", description: "Your file was uploaded successfully." })
                onUploaded?.()
            } catch (e) {
                toast({ title: "Upload error", description: e?.message ?? "Something went wrong.", variant: "destructive" })
            } finally {
                setUploading(false)
            }
        },
        [onUploaded, toast],
    )

    return (
        <Card
            className={cn(
                "group relative",
                "transition-all duration-300 hover:shadow-lg",
                dragActive ? "border-primary ring-2 ring-primary/40" : "border-border",
            )}
            role="region"
            aria-label="Upload area"
        >
            <div
                className={cn(
                    "flex min-h-[18svh] md:min-h-[20svh] lg:min-h-[22svh] w-full",
                    "items-center justify-between gap-4 p-4 md:p-6",
                )}
            >
                <div className="flex flex-1 items-center gap-4">
                    <div
                        className={cn(
                            "flex flex-1 items-center justify-center rounded-lg border-2 border-dashed",
                            dragActive ? "border-blue-600 bg-blue-600/5" : "border-border bg-muted/30",
                            "transition-colors duration-300",
                        )}
                        onDragOver={(e) => {
                            e.preventDefault()
                            setDragActive(true)
                        }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={(e) => {
                            e.preventDefault()
                            setDragActive(false)
                            handleFiles(e.dataTransfer.files)
                        }}
                    >
                        <div className="flex flex-col items-center gap-2 py-8 text-center">
                            <div className="rounded-md bg-blue-600/10 px-2 py-1 text-xs font-medium text-blue-600">TXT only</div>
                            <p className="text-sm md:text-base text-muted-foreground">Drag and drop your .txt file here</p>
                            <p className="text-xs text-muted-foreground">or</p>
                            <Button
                                type="button"
                                variant="default"
                                onClick={() => inputRef.current?.click()}
                                className={cn(
                                    "bg-blue-600 hover:bg-blue-700 text-white transition-transform duration-200",
                                    "hover:scale-[1.02] active:scale-[0.98]"
                                )}
                                disabled={uploading}
                                aria-label="Choose file"
                            >
                                {uploading ? "Uploading…" : "Choose file"}
                            </Button>
                            <input
                                ref={inputRef}
                                type="file"
                                className="sr-only"
                                accept=".txt"
                                onChange={(e) => handleFiles(e.target.files)}
                                aria-hidden="true"
                                tabIndex={-1}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle animated accent ring */}
            <div
                aria-hidden="true"
                className={cn(
                    "pointer-events-none absolute inset-0 rounded-[inherit]",
                    "opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                )}
                style={{
                    boxShadow: "0 0 0 2px color-mix(in oklab, var(--color-primary) 30%, transparent)",
                }}
            />
        </Card>
    )
}