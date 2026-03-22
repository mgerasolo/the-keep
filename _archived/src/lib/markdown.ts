import matter from 'gray-matter'
import type { Frontmatter, MarkdownFile } from '@/types'

/**
 * Parse markdown content with frontmatter
 */
export function parseMarkdown(content: string, path: string): MarkdownFile {
  const { data, content: body } = matter(content)

  return {
    slug: path.replace(/\.md$/, ''),
    path,
    content: body,
    frontmatter: data as Frontmatter,
  }
}

/**
 * Extract wiki-style links from markdown content
 * Matches: [[page-name]] or [[page-name|Display Text]]
 */
export function extractWikiLinks(content: string): string[] {
  const wikiLinkPattern = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g
  const links: string[] = []
  let match

  while ((match = wikiLinkPattern.exec(content)) !== null) {
    links.push(match[1])
  }

  return links
}

/**
 * Extract tags from frontmatter or inline hashtags
 */
export function extractTags(content: string, frontmatter: Frontmatter): string[] {
  const tags = new Set<string>(frontmatter.tags || [])

  // Match inline hashtags like #tag-name
  const hashtagPattern = /#([a-z0-9-]+)/gi
  let match

  while ((match = hashtagPattern.exec(content)) !== null) {
    tags.add(match[1].toLowerCase())
  }

  return Array.from(tags)
}
