/**
 * File Upload API Route
 * Handles file uploads to MinIO with database metadata
 */

import { NextRequest, NextResponse } from 'next/server';
import { minioClient, BUCKET_NAME, ensureBucket } from '@/lib/minio';
import { db } from '@/lib/db';
import { files } from '@/lib/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const projectId = formData.get('projectId') as string | null;
    const path = (formData.get('path') as string) || '/';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!projectId) {
      return NextResponse.json({ error: 'No project ID provided' }, { status: 400 });
    }

    // Ensure bucket exists
    await ensureBucket();

    // Generate unique MinIO key
    const fileId = uuidv4();
    const ext = file.name.split('.').pop() || '';
    const minioKey = `${projectId}/${fileId}${ext ? `.${ext}` : ''}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to MinIO
    await minioClient.putObject(BUCKET_NAME, minioKey, buffer, buffer.length, {
      'Content-Type': file.type || 'application/octet-stream',
    });

    // Build file path
    const filePath = path === '/' ? `/${file.name}` : `${path}/${file.name}`;

    // Save metadata to database
    const [savedFile] = await db
      .insert(files)
      .values({
        projectId,
        path: filePath,
        name: file.name,
        mimeType: file.type || null,
        size: file.size,
        minioKey,
      })
      .returning();

    return NextResponse.json({
      success: true,
      file: savedFile,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}

// Increase body size limit for file uploads (50MB)
export const config = {
  api: {
    bodyParser: false,
  },
};
