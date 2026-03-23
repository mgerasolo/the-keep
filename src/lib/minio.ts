/**
 * MinIO Client
 * S3-compatible object storage connection
 */

import { Client } from 'minio';
import { env } from './utils';

// MinIO configuration
const minioEndpoint = env('MINIO_ENDPOINT', 'localhost');
const minioPort = parseInt(env('MINIO_PORT', '9000'), 10);
const minioAccessKey = env('MINIO_ACCESS_KEY', 'minioadmin');
const minioSecretKey = env('MINIO_SECRET_KEY', 'minioadmin');
const minioBucket = env('MINIO_BUCKET', 'the-keep');

// Create MinIO client
export const minioClient = new Client({
  endPoint: minioEndpoint,
  port: minioPort,
  useSSL: false,
  accessKey: minioAccessKey,
  secretKey: minioSecretKey,
});

// Bucket name constant
export const BUCKET_NAME = minioBucket;

/**
 * Check MinIO connectivity
 * @returns true if connected, false otherwise
 */
export async function checkMinioConnection(): Promise<boolean> {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    // If bucket doesn't exist, try to create it
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME);
    }
    return true;
  } catch (error) {
    console.error('MinIO connection failed:', error);
    return false;
  }
}

/**
 * Ensure bucket exists, create if not
 */
export async function ensureBucket(): Promise<void> {
  const exists = await minioClient.bucketExists(BUCKET_NAME);
  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME);
  }
}
