import crypto from "crypto"

const ALGORITHM = "aes-256-cbc"

// Derive a 32-byte key from the NEXTAUTH_SECRET using SHA-256
function getEncryptionKey() {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is not defined. Cannot encrypt/decrypt data.")
  }
  return crypto.createHash("sha256").update(secret).digest()
}

export function encrypt(text: string): string {
  if (!text) return text
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv)
  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")
  return `${iv.toString("hex")}:${encrypted}`
}

export function decrypt(text: string): string {
  if (!text) return text
  try {
    const parts = text.split(":")
    if (parts.length !== 2) return text // Return as-is if it doesn't match the format
    
    const [ivHex, encryptedHex] = parts
    const iv = Buffer.from(ivHex, "hex")
    const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv)
    let decrypted = decipher.update(encryptedHex, "hex", "utf8")
    decrypted += decipher.final("utf8")
    return decrypted
  } catch (error) {
    console.error("Failed to decrypt data. Ensure NEXTAUTH_SECRET hasn't changed.", error)
    return text // Fallback to original text if decryption fails
  }
}
