"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export function StudentsTable({
    students,
    isLoading,
}) {
    return (
        <div className="rounded-md border border-border overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="w-[40%]">Student Name</TableHead>
                        <TableHead className="w-[20%]">CGPA</TableHead>
                        <TableHead className="w-[40%]">Branch</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <Skeleton className="h-4 w-48" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-12" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-28" />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : students.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                                No students found for the current filters.
                            </TableCell>
                        </TableRow>
                    ) : (
                        students.map((s) => (
                            <TableRow key={s.id} className="transition-colors hover:bg-accent/30">
                                <TableCell className="font-medium">{s.name}</TableCell>
                                <TableCell>{s.cgpa.toFixed(1)}</TableCell>
                                <TableCell>{s.branch}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}