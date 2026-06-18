"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { MonthlySummary } from "../types"
import { CATEGORIES } from "@/lib/categories"
import { Transaction } from "@prisma/client"
import { format } from "date-fns"
import { useSession } from "next-auth/react"
import { formatCurrency } from "@/lib/format"

export function ExportButton({
  year,
  month,
  summary,
  transactions
}: {
  year: number
  month: number
  summary: MonthlySummary | null
  transactions: Transaction[]
}) {
  const { data: session } = useSession()
  const userCurrency = session?.user?.currency || "USD"

  const exportToPDF = () => {
    const doc = new jsPDF()
    const monthName = format(new Date(year, month - 1, 1), "MMMM")

    // Company / Header
    doc.setFontSize(22)
    doc.setTextColor(40, 40, 40)
    doc.text("FlowSync", 14, 22)
    
    doc.setFontSize(14)
    doc.setTextColor(100, 100, 100)
    doc.text(`Monthly Financial Report`, 14, 30)
    
    doc.setFontSize(11)
    doc.text(`Period: ${monthName} ${year}`, 14, 36)

    // Summary Section
    if (summary) {
      doc.setFontSize(12)
      doc.setTextColor(40, 40, 40)
      doc.text("Account Summary", 14, 48)
      
      doc.setFontSize(10)
      doc.setTextColor(80, 80, 80)
      
      const formatCurr = (val: number) => formatCurrency(val, userCurrency)
      
      doc.text(`Total Income: ${formatCurr(summary.totalIncome)}`, 14, 56)
      doc.text(`Total Expense: ${formatCurr(summary.totalExpense)}`, 14, 62)
      doc.text(`Net Balance: ${formatCurr(summary.netBalance)}`, 14, 68)
    }

    // Transactions Table
    if (transactions.length > 0) {
      const tableData = transactions.map(tx => [
        format(new Date(tx.date), "MMM d, yyyy"),
        tx.description || "-",
        CATEGORIES.find(c => c.id === tx.category)?.name || tx.category,
        tx.type === "INCOME" ? "Income" : "Expense",
        (tx.type === "INCOME" ? "+" : "-") + formatCurrency(tx.amount, userCurrency)
      ])

      autoTable(doc, {
        startY: 78,
        head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [194, 167, 125] }, // Matches primary gold color
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: {
          4: { halign: 'right' }
        }
      })
    } else {
      doc.setFontSize(10)
      doc.text("No transactions recorded for this period.", 14, 78)
    }

    // Save
    doc.save(`FlowSync_Report_${year}_${month.toString().padStart(2, '0')}.pdf`)
  }

  return (
    <Button variant="outline" onClick={exportToPDF} className="print:hidden">
      <Download className="mr-2 h-4 w-4" />
      Download PDF
    </Button>
  )
}
