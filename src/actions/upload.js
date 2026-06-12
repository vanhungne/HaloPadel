'use server'

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImageToCloudinary(formData) {
  try {
    const file = formData.get('file')
    const folder = formData.get('folder') || 'halopadel'

    if (!file) {
      return { success: false, error: 'Không tìm thấy file' }
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error)
            resolve({ success: false, error: 'Lỗi tải ảnh lên Cloudinary' })
          } else {
            resolve({ success: true, url: result.secure_url, publicId: result.public_id })
          }
        }
      )
      uploadStream.end(buffer)
    })
  } catch (error) {
    console.error('Server action upload error:', error)
    return { success: false, error: 'Lỗi xử lý file upload' }
  }
}
