import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// This endpoint checks if a given wallet address has access to a moment
// It returns true if:
// 1. The moment is public (isPrivate = false)
// 2. The moment is private but the wallet is in the allowedWallets list
// 3. The wallet is the creator of the moment
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get the moment ID from params
    const momentId = params.id

    // Get the wallet address from the request body
    const { walletAddress } = await request.json()

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    // Get the moment with its publish info and creator
    const moment = await prisma.moment.findUnique({
      where: { id: momentId },
      include: {
        creator: true,
        publishInfo: true
      }
    })

    if (!moment) {
      return NextResponse.json(
        { error: 'Moment not found' },
        { status: 404 }
      )
    }

    // If the moment isn't published yet, only the creator can see it
    if (!moment.publishInfo?.isPublished) {
      const hasAccess = moment.creator.walletAddress.toLowerCase() === walletAddress.toLowerCase()
      return NextResponse.json({ hasAccess })
    }

    // If the moment is public, everyone has access
    if (!moment.publishInfo.isPrivate) {
      return NextResponse.json({ hasAccess: true })
    }

    // If the user is the creator, they have access
    if (moment.creator.walletAddress.toLowerCase() === walletAddress.toLowerCase()) {
      return NextResponse.json({ hasAccess: true })
    }

    // Check if the wallet is in the allowed list
    const normalizedWalletAddress = walletAddress.toLowerCase()
    const normalizedAllowedWallets = moment.publishInfo.allowedWallets.map(
      address => address.toLowerCase()
    )

    const hasAccess = normalizedAllowedWallets.includes(normalizedWalletAddress)

    return NextResponse.json({ hasAccess })
  } catch (error) {
    console.error('Error checking moment access:', error)
    return NextResponse.json(
      { error: 'Failed to check access' },
      { status: 500 }
    )
  }
} 