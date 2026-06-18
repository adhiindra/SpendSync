"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { encrypt } from "@/lib/encryption"

export async function updateCurrency(currency: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.user.update({
    where: { id: session.user.id },
    data: { currency },
  })

  return { success: true }
}

export async function updateLanguage(language: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.user.update({
    where: { id: session.user.id },
    data: { language },
  })

  return { success: true }
}

export async function updateOcrMode(ocrMode: "local" | "ai") {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.user.update({
    where: { id: session.user.id },
    data: { ocrMode },
  })

  return { success: true }
}

export async function updateGeminiKey(key: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  const encryptedKey = encrypt(key)

  await prisma.user.update({
    where: { id: session.user.id },
    data: { geminiApiKey: encryptedKey },
  })

  return { success: true }
}
