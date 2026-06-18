import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { GoogleGenAI } from "@google/genai"
import { decrypt } from "@/lib/encryption"

import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { geminiApiKey: true, currency: true }
  })

  const userCurrency = user?.currency || "USD"

  const encryptedKey = user?.geminiApiKey
  if (!encryptedKey) {
    return NextResponse.json(
      { error: "Gemini API key is not configured in settings." },
      { status: 503 }
    )
  }

  const apiKey = decrypt(encryptedKey)


  const ai = new GoogleGenAI({ apiKey })

  try {
    const formData = await req.formData()
    const file = formData.get("image") as File | null
    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Convert to base64
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString("base64")
    const mimeType = file.type || "image/jpeg"

    const prompt = `You are a receipt/document parser. Extract transaction details from this image.
The user's base currency is ${userCurrency}. 
Return ONLY a JSON object with these fields (omit any field you cannot determine):
{
  "amount": "decimal number as string, e.g. 45.50 or 50000. Auto-detect the currency (IDR, USD, etc.) to correctly parse thousand separators and decimals. Return ONLY the final mathematical number.",
  "date": "YYYY-MM-DD",
  "description": "merchant name followed by a summary of purchased items (e.g., 'Walmart: Apples, Oranges, Milk'), max 120 chars",
  "type": "EXPENSE or INCOME",
  "category": "Choose exactly one of the following based on type. For EXPENSE: Transport, Food, Shopping, Health, Household, Entertainment, Travel, Other. For INCOME: Salary, Investment, Gift, Other_Income",
}
Rules:
- date: MUST be strictly converted to YYYY-MM-DD format (e.g., 2024-10-25) regardless of how it is written on the receipt.
- amount: the final total paid, without currency symbol. The user's base currency is ${userCurrency}. If it's IDR (e.g. Rp 50.000), return 50000. If it's USD (e.g. $45.50), return 45.50. Be very careful with thousand separators vs decimals based on the detected currency.
- type: almost always EXPENSE for receipts; use INCOME only for salary slips/payment received
- If a field cannot be determined, omit it entirely
- Return raw JSON only, no markdown, no explanation`

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        prompt,
        {
          inlineData: {
            mimeType: mimeType,
            data: base64,
          },
        },
      ],
      config: {
        temperature: 0,
        responseMimeType: "application/json",
      },
    })

    if (!response.text) {
      throw new Error("No text response from Gemini")
    }

    const extracted = JSON.parse(response.text)
    return NextResponse.json(extracted)
  } catch (err) {
    console.error("OCR route error:", err)
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    )
  }
}
