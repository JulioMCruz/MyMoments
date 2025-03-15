import axios from 'axios'

/**
 * Uploads a file to IPFS using Pinata API
 * @param file - The file to upload
 * @returns The IPFS hash (CID) and gateway URL
 */
export async function uploadToPinata(file: File) {
  if (!process.env.NEXT_PUBLIC_PINATA_API_KEY || !process.env.NEXT_PUBLIC_PINATA_SECRET_KEY) {
    throw new Error('Pinata API credentials are missing')
  }

  try {
    // Create form data for the file
    const formData = new FormData()
    formData.append('file', file)
    
    // Set options for Pinata
    const metadata = JSON.stringify({
      name: `Moment-${Date.now()}`,
    })
    formData.append('pinataMetadata', metadata)
    
    const options = JSON.stringify({
      cidVersion: 1,
    })
    formData.append('pinataOptions', options)

    // Upload to Pinata
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Content-Type': `multipart/form-data;`,
          'pinata_api_key': process.env.NEXT_PUBLIC_PINATA_API_KEY,
          'pinata_secret_api_key': process.env.NEXT_PUBLIC_PINATA_SECRET_KEY
        }
      }
    )

    // Return the IPFS hash and gateway URL
    const ipfsHash = response.data.IpfsHash
    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
    
    return {
      ipfsHash,
      imageUrl: gatewayUrl
    }
  } catch (error) {
    console.error('Error uploading to Pinata:', error)
    throw new Error('Failed to upload to IPFS')
  }
} 