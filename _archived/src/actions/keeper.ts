'use server'

import { getFileContent } from './vault'

const LITELLM_URL = process.env.LITELLM_URL || 'http://10.0.0.27:2764'
const LITELLM_MODEL = process.env.LITELLM_MODEL || 'claude-sonnet-4-20250514'

const KEEPER_SYSTEM_PROMPT = `You are the Keeper, a knowledgeable librarian assistant for a personal knowledge management system called "The Keep."

Personality traits:
- Direct and concise - no unnecessary words
- Formal but approachable - like a helpful but no-nonsense librarian
- Slightly quirky - occasional dry wit, references to books and libraries
- Token-efficient - give brief, useful answers

When helping users:
1. If they ask about their notes/vault, help them search and understand their content
2. If they share document context, reference it specifically
3. Keep responses brief unless depth is requested
4. Use markdown formatting when helpful
5. If you don't have information, say so directly

Remember: brevity is the soul of wit, and the sign of a well-organized library.`

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface KeeperRequest {
  messages: Message[]
  currentFilePath?: string
  currentFileContent?: string
}

export async function sendKeeperMessage(request: KeeperRequest): Promise<string> {
  try {
    const messages: Message[] = [
      { role: 'system', content: KEEPER_SYSTEM_PROMPT },
    ]

    // Add file context if available
    if (request.currentFilePath && request.currentFileContent) {
      messages.push({
        role: 'system',
        content: `Current file context (${request.currentFilePath}):\n\n${request.currentFileContent.slice(0, 2000)}${request.currentFileContent.length > 2000 ? '...' : ''}`,
      })
    }

    // Add conversation history
    messages.push(...request.messages)

    const response = await fetch(`${LITELLM_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: LITELLM_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('LiteLLM error:', response.status, errorText)
      throw new Error(`LiteLLM request failed: ${response.status}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || 'I apologize, but I was unable to generate a response.'
  } catch (error) {
    console.error('Keeper error:', error)
    // Fallback response when AI is unavailable
    return "The arcane connection seems disrupted at the moment. The Keeper's wisdom is temporarily unavailable. Please try again shortly."
  }
}

export async function getKeeperContextForFile(filePath: string): Promise<string | null> {
  const content = await getFileContent(filePath)
  return content?.content || null
}
