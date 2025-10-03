import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db/init';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
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

    const client = await pool.connect();
    
    try {
      // Get all users
      const usersResult = await client.query(`
        SELECT id, email, first_name, last_name, user_type, shop_name 
        FROM users 
        ORDER BY created_at DESC
      `);

      // Get all products with seller names
      const productsResult = await client.query(`
        SELECT p.*, u.first_name || ' ' || u.last_name as seller_name
        FROM products p
        JOIN users u ON p.seller_id = u.id
        ORDER BY p.created_at DESC
      `);

      // Get all orders with buyer names
      const ordersResult = await client.query(`
        SELECT o.*, u.first_name || ' ' || u.last_name as buyer_name
        FROM orders o
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
      `);

      // Calculate seller earnings (only delivered orders)
      const earningsResult = await client.query(`
        SELECT 
          oi.seller_id,
          u.first_name || ' ' || u.last_name as seller_name,
          SUM(oi.price * oi.quantity) as total_sales,
          SUM(oi.price * oi.quantity) * 0.2 as admin_commission,
          SUM(oi.price * oi.quantity) * 0.8 as seller_earnings
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        JOIN users u ON oi.seller_id = u.id
        WHERE o.status = 'delivered'
        GROUP BY oi.seller_id, u.first_name, u.last_name
        ORDER BY total_sales DESC
      `);

      return NextResponse.json({
        users: usersResult.rows,
        products: productsResult.rows.map(p => ({
          ...p,
          price: Number(p.price)
        })),
        orders: ordersResult.rows.map(o => ({
          ...o,
          total_amount: Number(o.total_amount)
        })),
        sellerEarnings: earningsResult.rows.map(e => ({
          ...e,
          total_sales: Number(e.total_sales),
          admin_commission: Number(e.admin_commission),
          seller_earnings: Number(e.seller_earnings)
        }))
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Admin data fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
