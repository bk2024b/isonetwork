import { put, list, del } from '@vercel/blob';
import { ProductsData } from '@/types';
import { DEFAULT_PRODUCTS_DATA } from '@/lib/seed-data';

const BLOB_FILENAME = 'products.json';

// Global cache for local development or when Blob token is not configured
let cachedProductsData: ProductsData = DEFAULT_PRODUCTS_DATA;

export async function getProductsData(): Promise<ProductsData> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return cachedProductsData;
  }

  try {
    const { blobs } = await list({ prefix: BLOB_FILENAME });

    if (blobs.length === 0) {
      await saveProductsData(DEFAULT_PRODUCTS_DATA);
      return DEFAULT_PRODUCTS_DATA;
    }

    const blob = blobs.sort((a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0];

    const res = await fetch(blob.url, { cache: 'no-store' });
    if (!res.ok) {
      return cachedProductsData;
    }
    const data = await res.json();
    cachedProductsData = data;
    return data;
  } catch (error) {
    console.warn('Error reading from Vercel Blob, using cache:', error);
    return cachedProductsData;
  }
}

export async function saveProductsData(data: ProductsData): Promise<void> {
  cachedProductsData = data;

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.warn('BLOB_READ_WRITE_TOKEN is missing. Data saved in memory.');
    return;
  }

  try {
    const { blobs } = await list({ prefix: BLOB_FILENAME });
    for (const blob of blobs) {
      await del(blob.url);
    }

    await put(BLOB_FILENAME, JSON.stringify(data, null, 2), {
      access: 'public',
      contentType: 'application/json',
      allowOverwrite: true,
    });
  } catch (error) {
    console.error('Error saving to Vercel Blob:', error);
  }
}

export async function uploadProductImage(
  file: File | Blob,
  filename: string
): Promise<string> {
  // 1. Try Vercel Blob if token is available
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(`products/images/${filename}`, file, {
        access: 'public',
        allowOverwrite: true,
      });
      return blob.url;
    } catch (blobErr) {
      console.warn('Vercel Blob put failed, falling back to Base64:', blobErr);
    }
  }

  // 2. Fallback: Convert to Base64 Data URL (always works without external service)
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const mimeType = (file as File).type || 'image/jpeg';
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
}
