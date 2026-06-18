"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
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
} from "@/components/ui/chart"
import { CategoryBreakdown } from "../types"
import { useSession } from "next-auth/react"
import { formatCurrency } from "@/lib/format"

export function CategoryPieChart({ data, type }: { data: CategoryBreakdown[], type: "INCOME" | "EXPENSE" }) {
  const { data: session } = useSession()
  const userCurrency = session?.user?.currency || "USD"

  const chartData = React.useMemo(() => {
    return data.map((item, index) => ({
      category: item.category.name,
      amount: item.totalAmount,
      fill: item.category.color || `hsl(var(--chart-${(index % 5) + 1}))`,
    }))
  }, [data])

  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      amount: {
        label: "Amount",
      },
    }
    data.forEach((item, index) => {
      config[item.category.name] = {
        label: item.category.name,
        color: item.category.color || `hsl(var(--chart-${(index % 5) + 1}))`,
      }
    })
    return config
  }, [data])

  const totalAmount = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.totalAmount, 0)
  }, [data])

  if (data.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>{type === "INCOME" ? "Income Breakdown" : "Expense Breakdown"}</CardTitle>
          <CardDescription>No data for this period</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0 flex items-center justify-center min-h-[250px] text-muted-foreground">
          No transactions found.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{type === "INCOME" ? "Income Breakdown" : "Expense Breakdown"}</CardTitle>
        <CardDescription>By Category</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {formatCurrency(totalAmount, userCurrency)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
