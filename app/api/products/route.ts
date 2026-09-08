import { NextRequest, NextResponse } from 'next/server';
import { getProductsData, saveProductsData } from '@/lib/blob';
import { Product, ProductsData } from '@/types';
import { generateId } from '@/lib/utils';

export async function GET() {
  try {
    const data = await getProductsData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await getProductsData();

    const newProduct: Product = {
      ...body,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedData: ProductsData = {
      products: [newProduct, ...data.products],
      updatedAt: new Date().toISOString(),
    };

    await saveProductsData(updatedData);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const data = await getProductsData();
    const idx = data.products.findIndex((p) => p.id === id);

    if (idx === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    data.products[idx] = {
      ...data.products[idx],
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    };

    data.updatedAt = new Date().toISOString();
    await saveProductsData(data);

    return NextResponse.json(data.products[idx]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const data = await getProductsData();
    data.products = data.products.filter((p) => p.id !== id);
    data.updatedAt = new Date().toISOString();

    await saveProductsData(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
