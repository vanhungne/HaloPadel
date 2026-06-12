'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/slugify'

const VENUE_ID = 1

export async function getBlogPosts({ page = 1, limit = 10 } = {}) {
  try {
    const skip = (page - 1) * limit
    
    const [data, total] = await Promise.all([
      prisma.blogPost.findMany({
        where: { venueId: VENUE_ID, isDeleted: false },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.blogPost.count({
        where: { venueId: VENUE_ID, isDeleted: false },
      })
    ])

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    }
  } catch (error) {
    console.error('Failed to fetch blog posts:', error)
    return { data: [], total: 0, page: 1, totalPages: 0 }
  }
}

export async function createBlogPost(data) {
  try {
    const slug = slugify(data.title)
    const post = await prisma.blogPost.create({
      data: {
        venueId: VENUE_ID,
        title: data.title,
        slug: slug,
        excerpt: data.excerpt || '',
        content: data.content || '',
        coverImage: data.coverImage || '',
        status: data.status || 'DRAFT', // PUBLISHED, DRAFT
        seoTitle: data.seoTitle || data.title,
        seoDescription: data.seoDescription || data.excerpt || '',
        showOnHomepage: data.showOnHomepage !== undefined ? data.showOnHomepage : false,
        titleEn: data.titleEn || null,
        excerptEn: data.excerptEn || null,
        contentEn: data.contentEn || null,
      }
    })
    revalidatePath('/admin/blog')
    revalidatePath('/')
    return { success: true, post }
  } catch (error) {
    console.error('Failed to create blog post:', error)
    return { success: false, error: 'Lỗi khi tạo bài viết (Có thể tiêu đề bị trùng)' }
  }
}

export async function updateBlogPost(id, data) {
  try {
    const slug = slugify(data.title)
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title: data.title,
        slug: slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        status: data.status,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        showOnHomepage: data.showOnHomepage,
        titleEn: data.titleEn || null,
        excerptEn: data.excerptEn || null,
        contentEn: data.contentEn || null,
      }
    })
    revalidatePath('/admin/blog')
    revalidatePath('/')
    return { success: true, post }
  } catch (error) {
    console.error('Failed to update blog post:', error)
    return { success: false, error: 'Lỗi khi cập nhật bài viết' }
  }
}

export async function deleteBlogPost(id) {
  try {
    await prisma.blogPost.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() }
    })
    revalidatePath('/admin/blog')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete blog post:', error)
    return { success: false, error: 'Lỗi khi xóa bài viết' }
  }
}
