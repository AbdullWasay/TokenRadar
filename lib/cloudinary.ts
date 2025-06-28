// Server-side only Cloudinary configuration
let cloudinary: any = null

if (typeof window === 'undefined') {
  // Only import on server-side
  const { v2 } = require('cloudinary')
  cloudinary = v2

  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

export default cloudinary

// Server-side helper function to upload image to TokenRadar folder
export const uploadToCloudinary = async (file: File): Promise<string> => {
  if (typeof window !== 'undefined') {
    throw new Error('This function can only be called on the server-side')
  }

  try {
    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64}`

    // Upload to Cloudinary in TokenRadar folder
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'TokenRadar',
      resource_type: 'auto',
      transformation: [
        { width: 500, height: 500, crop: 'limit' },
        { quality: 'auto' },
        { format: 'auto' }
      ]
    })

    return result.secure_url
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw new Error('Failed to upload image')
  }
}

// Helper function for client-side upload
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/upload-image', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to upload image')
  }

  const data = await response.json()
  return data.url
}
