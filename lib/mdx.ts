import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDir = path.join(process.cwd(), 'content', 'blog')

export interface PostFrontmatter {
  title: string
  date: string
  category: string
  readTime: string
  image?: string
}

export function getPostBySlug(slug: string) {
  try {
    const filePath = path.join(contentDir, `${slug}.mdx`)
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContent)
    
    return {
      frontmatter: data as PostFrontmatter,
      content,
      slug
    }
  } catch (error) {
    return null
  }
}
