import { put, list, del } from '@vercel/blob';
import { ProductsData } from '@/types';
import { DEFAULT_PRODUCTS_DATA } from '@/lib/seed-data';

const BLOB_FILENAME = 'products.json';

export async function getProductsData(): Promise<ProductsData> {
  try {
    const { blobs } = await list({ prefix: BLOB_FILENAME });

    if (blobs.length === 0) {
      // First time: seed with default data
      await saveProductsData(DEFAULT_PRODUCTS_DATA);
      return DEFAULT_PRODUCTS_DATA;
    }

    // Get the most recent blob
    const blob = blobs.sort((a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0];

    const res = await fetch(blob.url, { cache: 'no-store' });
    if (!res.ok) {
      return DEFAULT_PRODUCTS_DATA;
    }
    return await res.json();
  } catch (error) {
    console.error('Error reading products from Blob:', error);
    return DEFAULT_PRODUCTS_DATA;
  }
}

export async function saveProductsData(data: ProductsData): Promise<void> {
  try {
    // Delete existing blobs first
    const { blobs } = await list({ prefix: BLOB_FILENAME });
    for (const blob of blobs) {
      await del(blob.url);
    }

    // Save new blob
    await put(BLOB_FILENAME, JSON.stringify(data, null, 2), {
      access: 'public',
      contentType: 'application/json',
      allowOverwrite: true,
    });
  } catch (error) {
    console.error('Error saving products to Blob:', error);
    throw error;
  }
}

export async function uploadProductImage(
  file: File | Blob,
  filename: string
): Promise<string> {
  const blob = await put(`products/images/${filename}`, file, {
    access: 'public',
    allowOverwrite: true,
  });
  return blob.url;
}
