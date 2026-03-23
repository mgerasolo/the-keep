/**
 * AI Edit API Route
 * Takes file content and instructions, returns edited content
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

const LITELLM_URL = process.env.LITELLM_URL || 'http://10.0.0.27:2764';
const LITELLM_API_KEY = process.env.LITELLM_API_KEY || '';

interface EditRequest {
  content: string;
  instruction: string;
  model?: string;
  fileName?: string;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: EditRequest = await request.json();
    const { content, instruction, model = 'claude-sonnet-4-20250514', fileName } = body;

    if (!content || !instruction) {
      return NextResponse.json(
        { error: 'Content and instruction are required' },
        { status: 400 }
      );
    }

    // Build the edit prompt
    const systemPrompt = `You are a document editor assistant. You will receive a document and an instruction for how to modify it.

Rules:
1. Return ONLY the modified document content, nothing else
2. Preserve the original formatting and structure unless instructed otherwise
3. Make targeted changes based on the instruction
4. Do not add explanations or comments outside the document
5. If the instruction is unclear, make your best interpretation`;

    const userPrompt = `Document${fileName ? ` (${fileName})` : ''}:
\`\`\`
${content}
\`\`\`

Instruction: ${instruction}

Return the modified document:`;

    // Call LiteLLM
    const response = await fetch(`${LITELLM_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LITELLM_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 8192,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('LiteLLM error:', error);
      return NextResponse.json({ error: 'AI service error' }, { status: 500 });
    }

    const data = await response.json();
    let editedContent = data.choices?.[0]?.message?.content || '';

    // Clean up the response - remove any markdown code blocks if present
    editedContent = editedContent
      .replace(/^```[\w]*\n?/, '')
      .replace(/\n?```$/, '')
      .trim();

    return NextResponse.json({
      original: content,
      edited: editedContent,
      instruction,
      model,
    });
  } catch (error) {
    console.error('Edit API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Edit failed' },
      { status: 500 }
    );
  }
}
