import NextAuth, { DefaultSession } from "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      currency: string
      language: string
    } & DefaultSession["user"]
  }

  interface User {
    currency: string
    language: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    currency: string
    language: string
  }
}
