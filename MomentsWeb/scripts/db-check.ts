import { prisma } from '@/lib/prisma'

async function main() {
  try {
    console.log('Checking database connection...')
    
    // Count users (should be 0 initially)
    const userCount = await prisma.user.count()
    console.log(`Connected to database. Current user count: ${userCount}`)
    
    // Create a test user
    const testUser = await prisma.user.create({
      data: {
        walletAddress: '0xTestWalletAddressForConnectionCheck',
        isVerified: false,
      },
    })
    console.log('Test user created:', testUser)
    
    // Delete the test user
    await prisma.user.delete({
      where: { id: testUser.id },
    })
    console.log('Test user deleted')
    
    console.log('Database connection and operations successful!')
  } catch (error) {
    console.error('Database connection check failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 