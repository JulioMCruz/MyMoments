import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Define the interface for publish settings
interface PublishSettings {
  isPublished: boolean
  isPrivate: boolean
  allowedWallets: string[]
  pricingType: string
  price: string
}

// POST endpoint to publish a moment by ID
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const momentId = params.id
    const { isPrivate, allowedWallets, pricingType, price } = await request.json()

    // Check if the moment exists and is completed
    const moment = await prisma.moment.findUnique({
      where: { id: momentId },
      include: {
        participants: true,
        publishInfo: true
      }
    })

    if (!moment) {
      return NextResponse.json({ error: "Moment not found" }, { status: 404 })
    }

    // Verify moment is completed by checking if all participants have signed
    const allSigned = moment.participants.length > 0 && 
                     moment.participants.every(p => p.hasSigned)
    
    if (!allSigned) {
      return NextResponse.json({ 
        error: "Cannot publish a moment that is not completed. All participants must sign first." 
      }, { status: 400 })
    }

    // Create or update publish info
    const publishInfo = await prisma.momentPublish.upsert({
      where: {
        momentId: momentId
      },
      update: {
        isPublished: true,
        isPrivate: isPrivate || false,
        allowedWallets: isPrivate ? allowedWallets.filter((w: string) => w.trim() !== "") : [],
        pricingType: pricingType || "free",
        price: pricingType === "paid" ? parseFloat(price) || 0.05 : 0,
        updatedAt: new Date()
      },
      create: {
        momentId: momentId,
        isPublished: true,
        isPrivate: isPrivate || false,
        allowedWallets: isPrivate ? allowedWallets.filter((w: string) => w.trim() !== "") : [],
        pricingType: pricingType || "free",
        price: pricingType === "paid" ? parseFloat(price) || 0.05 : 0
      }
    })

    // Update moment status to include "published" info
    await prisma.moment.update({
      where: { id: momentId },
      data: {
        status: "published"
      }
    })

    return NextResponse.json({
      success: true,
      message: "Moment published successfully",
      publishInfo
    })
  } catch (error) {
    console.error("Error publishing moment:", error)
    return NextResponse.json(
      { error: "Failed to publish moment" },
      { status: 500 }
    )
  }
} 