"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { useSession } from "next-auth/react"
import { formatCurrency } from "@/lib/format"

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-2))", // Greenish
  },
  expense: {
    label: "Expenses",
    color: "hsl(var(--chart-1))", // Reddish
  },
} satisfies ChartConfig

export function CashFlowChart({ data }: { data: { month: string; income: number; expense: number }[] }) {
  const { data: session } = useSession()
  const userCurrency = session?.user?.currency || "USD"

  return (
    <Card className="lg:col-span-4 border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle>Cash Flow</CardTitle>
        <CardDescription>Income vs Expenses over the last 6 months.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.5} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCurrency(value, userCurrency, { maximumFractionDigits: 0, minimumFractionDigits: 0 })}
              width={60}
            />
            <Tooltip content={<ChartTooltipContent />} cursor={{ fill: 'var(--muted)', opacity: 0.2 }} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill="var(--color-expense)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
