"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

async function getSessionUserId() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")
  return session.user.id
}

export async function createFamily(name: string) {
  const userId = await getSessionUserId()
  
  // Create family and assign creator as ORGANIZER with VIEW_EDIT
  const family = await prisma.family.create({
    data: {
      name,
      members: {
        create: {
          userId,
          role: "ORGANIZER",
          access: "VIEW_EDIT",
        }
      }
    }
  })
  
  revalidatePath("/family")
  return family
}

export async function getFamilyDetails() {
  const userId = await getSessionUserId()
  
  // Find family where the user is a member
  const member = await prisma.familyMember.findFirst({
    where: { userId },
    include: {
      family: {
        include: {
          members: {
            include: { user: { select: { id: true, name: true, email: true, image: true } } }
          },
          invitations: {
            where: { status: "PENDING" }
          }
        }
      }
    }
  })
  
  return member?.family || null
}

export async function inviteMember(familyId: string, email: string, access: "VIEW_ONLY" | "VIEW_EDIT") {
  const userId = await getSessionUserId()
  
  // Verify user is an organizer
  const organizer = await prisma.familyMember.findUnique({
    where: { familyId_userId: { familyId, userId } }
  })
  if (organizer?.role !== "ORGANIZER") throw new Error("Only organizers can invite members")
  
  // Check if user is already a member
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    const existingMember = await prisma.familyMember.findUnique({
      where: { familyId_userId: { familyId, userId: existingUser.id } }
    })
    if (existingMember) throw new Error("User is already a member of this family")
  }

  // Create pending invitation
  const invite = await prisma.familyInvitation.create({
    data: { familyId, email, access, role: "MEMBER" }
  })
  
  revalidatePath("/family/settings")
  return invite
}

export async function getPendingInvitations() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return []
  
  return await prisma.familyInvitation.findMany({
    where: { email: session.user.email, status: "PENDING" },
    include: { family: { select: { name: true } } }
  })
}

export async function acceptInvitation(invitationId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email || !session?.user?.id) throw new Error("Unauthorized")
  
  const invite = await prisma.familyInvitation.findUnique({ where: { id: invitationId } })
  if (!invite || invite.email !== session.user.email) throw new Error("Invalid invitation")
  
  // Check if user is already in a family
  const existingMember = await prisma.familyMember.findFirst({
    where: { userId: session.user.id }
  })
  if (existingMember) throw new Error("You are already in a family. Leave it first to join a new one.")
  
  // Transaction: Mark invite accepted, create member
  await prisma.$transaction([
    prisma.familyInvitation.update({
      where: { id: invitationId },
      data: { status: "ACCEPTED" }
    }),
    prisma.familyMember.create({
      data: {
        familyId: invite.familyId,
        userId: session.user.id,
        role: invite.role,
        access: invite.access
      }
    })
  ])
  
  revalidatePath("/")
}

export async function declineInvitation(invitationId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) throw new Error("Unauthorized")
  
  const invite = await prisma.familyInvitation.findUnique({ where: { id: invitationId } })
  if (!invite || invite.email !== session.user.email) throw new Error("Invalid invitation")
  
  await prisma.familyInvitation.update({
    where: { id: invitationId },
    data: { status: "DECLINED" }
  })
  
  revalidatePath("/")
}

export async function removeMember(familyId: string, memberUserId: string) {
  const userId = await getSessionUserId()
  
  // Verify caller is an organizer, or caller is leaving themselves
  if (userId !== memberUserId) {
    const caller = await prisma.familyMember.findUnique({
      where: { familyId_userId: { familyId, userId } }
    })
    if (caller?.role !== "ORGANIZER") throw new Error("Only organizers can remove members")
  }
  
  await prisma.familyMember.delete({
    where: { familyId_userId: { familyId, userId: memberUserId } }
  })
  
  revalidatePath("/family")
}

export async function updateMemberAccess(familyId: string, memberUserId: string, access: "VIEW_ONLY" | "VIEW_EDIT") {
  const userId = await getSessionUserId()
  
  // Verify caller is an organizer
  const caller = await prisma.familyMember.findUnique({
    where: { familyId_userId: { familyId, userId } }
  })
  if (caller?.role !== "ORGANIZER") throw new Error("Only organizers can change access levels")
  
  await prisma.familyMember.update({
    where: { familyId_userId: { familyId, userId: memberUserId } },
    data: { access }
  })
  
  revalidatePath("/family/settings")
}
