"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { MonthlyTrend } from "../types"

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-2))",
  },
  expense: {
    label: "Expense",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function TrendBarChart({ data, year }: { data: MonthlyTrend[], year: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Trend</CardTitle>
        <CardDescription>Income vs Expenses for {year}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
              width={60}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
