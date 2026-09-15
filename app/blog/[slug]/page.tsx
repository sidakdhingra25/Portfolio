import { getPostBySlug } from '@/lib/mdx'
import { ClientPage } from './ClientPage'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

export default async function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const post = getPostBySlug(resolvedParams.slug)

  if (!post) {
    notFound()
  }

  return (
    <ClientPage frontmatter={post.frontmatter}>
      <div className="markdown-body">
        <ReactMarkdown>
          {post.content}
        </ReactMarkdown>
      </div>
    </ClientPage>
  )
}
