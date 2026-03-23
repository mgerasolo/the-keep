/**
 * File Content API Route
 * GET/PUT file content from MinIO
 * Handles both text and binary files
 */

import { NextRequest, NextResponse } from 'next/server';
import { minioClient, BUCKET_NAME } from '@/lib/minio';
import { db } from '@/lib/db';
import { files } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

// Check if file is text-based
function isTextFile(mimeType: string | null): boolean {
  if (!mimeType) return true;
  return (
    mimeType.startsWith('text/') ||
    mimeType === 'application/json' ||
    mimeType === 'application/javascript' ||
    mimeType === 'application/xml' ||
    mimeType === 'application/x-yaml'
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileId } = await params;

    // Get file metadata
    const [file] = await db.select().from(files).where(eq(files.id, fileId)).limit(1);

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Get content from MinIO
    const stream = await minioClient.getObject(BUCKET_NAME, file.minioKey);

    // Collect stream data as buffer
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);

    // Return with appropriate content type
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': file.mimeType || 'application/octet-stream',
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching file content:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch file' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileId } = await params;

    // Get file metadata
    const [file] = await db.select().from(files).where(eq(files.id, fileId)).limit(1);

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Get content based on file type
    let buffer: Buffer;
    if (isTextFile(file.mimeType)) {
      const content = await request.text();
      buffer = Buffer.from(content, 'utf-8');
    } else {
      const arrayBuffer = await request.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }

    // Update content in MinIO
    await minioClient.putObject(BUCKET_NAME, file.minioKey, buffer, buffer.length, {
      'Content-Type': file.mimeType || 'application/octet-stream',
    });

    // Update file size in database
    await db
      .update(files)
      .set({ size: buffer.length })
      .where(eq(files.id, fileId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving file content:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save file' },
      { status: 500 }
    );
  }
}
