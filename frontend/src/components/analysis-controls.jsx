"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function AnalysisControls({
  range,
  onRangeChange,
  includeNonDream,
  onIncludeNonDreamChange,
}) {
  // Track input field values separately - these can be any number
  const [minInputValue, setMinInputValue] = useState(range[0].toString())
  const [maxInputValue, setMaxInputValue] = useState(range[1].toString())
  
  // Track if user is actively editing inputs to prevent useEffect override
  const [isEditingMin, setIsEditingMin] = useState(false)
  const [isEditingMax, setIsEditingMax] = useState(false)

  // Update input values when range changes from slider drag (but not when user is typing)
  useEffect(() => {
    if (!isEditingMin) {
      setMinInputValue(range[0].toString())
    }
    if (!isEditingMax) {
      setMaxInputValue(range[1].toString())
    }
  }, [range, isEditingMin, isEditingMax])

  const handleMinInputChange = (e) => {
    const value = e.target.value
    setIsEditingMin(true) // Prevent useEffect from overriding
    setMinInputValue(value) // Allow any input value
    
    // Parse and clamp for slider, but don't change input
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(0, Math.min(numValue, 10))
      // Ensure min doesn't exceed max
      const finalMin = Math.min(clampedValue, range[1])
      onRangeChange([finalMin, range[1]])
    }
  }

  const handleMaxInputChange = (e) => {
    const value = e.target.value
    setIsEditingMax(true) // Prevent useEffect from overriding
    setMaxInputValue(value) // Allow any input value
    
    // Parse and clamp for slider, but don't change input
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(0, Math.min(numValue, 10))
      // Ensure max doesn't go below min
      const finalMax = Math.max(clampedValue, range[0])
      onRangeChange([range[0], finalMax])
    }
  }

  const handleMinInputFocus = () => {
    setIsEditingMin(true)
  }

  const handleMaxInputFocus = () => {
    setIsEditingMax(true)
  }

  const handleMinInputBlur = () => {
    setIsEditingMin(false) // Allow useEffect to work again
    // On blur, correct input to match actual slider value
    setMinInputValue(range[0].toString())
  }

  const handleMaxInputBlur = () => {
    setIsEditingMax(false) // Allow useEffect to work again
    // On blur, correct input to match actual slider value
    setMaxInputValue(range[1].toString())
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="score-range" className="font-medium">
          Score range
        </Label>
        <div className="rounded-md bg-muted/40 p-4">
          <Slider
            id="score-range"
            min={0}
            max={10}
            step={0.1}
            value={range}
            onValueChange={(val) => {
              if (Array.isArray(val) && val.length === 2) onRangeChange([val[0], val[1]])
            }}
            aria-label="Score range selector"
            className="cursor-pointer"
          />
          <div className="mt-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Min:</span>
              <input
                type="text"
                value={minInputValue}
                onChange={handleMinInputChange}
                onFocus={handleMinInputFocus}
                onBlur={handleMinInputBlur}
                className="w-16 text-xs text-center bg-background border border-border rounded px-1 py-0.5 text-foreground font-medium focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Max:</span>
              <input
                type="text"
                value={maxInputValue}
                onChange={handleMaxInputChange}
                onFocus={handleMaxInputFocus}
                onBlur={handleMaxInputBlur}
                className="w-16 text-xs text-center bg-background border border-border rounded px-1 py-0.5 text-foreground font-medium focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="non-dream" className="font-medium">
          Non-dream entries
        </Label>
        <Select
          value={includeNonDream ? "include" : "exclude"}
          onValueChange={(v) => onIncludeNonDreamChange(v === "include")}
        >
          <SelectTrigger id="non-dream" className="bg-muted/40">
            <SelectValue placeholder="Include non-dream" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="include">Include non-dream</SelectItem>
            <SelectItem value="exclude">Exclude non-dream</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}