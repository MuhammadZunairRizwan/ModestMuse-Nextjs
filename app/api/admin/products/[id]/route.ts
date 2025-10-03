import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db/init';
import { verifyToken } from '@/lib/auth';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token) as { user_type: string };
    if (decoded.user_type !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const productId = parseInt(params.id);
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const client = await pool.connect();
    
    try {
      // Check if product exists
      const productCheck = await client.query(
        'SELECT * FROM products WHERE id = $1',
        [productId]
      );

      if (productCheck.rows.length === 0) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      // Delete the product
      const result = await client.query(
        'DELETE FROM products WHERE id = $1 RETURNING *',
        [productId]
      );

      if (result.rowCount === 0) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
      }

      return NextResponse.json({ 
        message: 'Product deleted successfully',
        product: result.rows[0]
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Product deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
