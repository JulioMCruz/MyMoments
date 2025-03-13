export interface User {
  id: string
  name: string
  walletAddress: string
  ensName?: string
  joinedDate: Date
  avatarUrl?: string
  isVerified: boolean
}

export interface Moment {
  id: string
  title: string
  description: string
  date: Date
  imageUrl?: string
  status: "proposed" | "signed" | "completed"
  creator: User
  participants: User[]
  nftTokenId?: string
}

export interface NFT {
  tokenId: string
  imageUrl: string
  metadata: {
    title: string
    description: string
    date: Date
    participants: string[]
    location?: string
  }
}

