import { pool } from "./init"

export interface Order {
  id: number
  order_number: string
  user_id: number
  total_amount: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  delivery_address: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
  seller_id: number
  created_at: string
  product_name: string
  product_images: string[]
}

export interface CreateOrderData {
  user_id: number
  delivery_address: string
  items: Array<{
    product_id: number
    quantity: number
    price: number
    seller_id: number
  }>
}

// Create a new order from cart items
export const createOrder = async (orderData: CreateOrderData): Promise<Order | null> => {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')

    // Generate order number
    const orderNumberResult = await client.query(
      "SELECT generate_order_number() as order_number"
    )
    const orderNumber = orderNumberResult.rows[0].order_number

    // Calculate total amount
    const totalAmount = orderData.items.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    )

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (order_number, user_id, total_amount, delivery_address)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [orderNumber, orderData.user_id, totalAmount, orderData.delivery_address]
    )

    const order = orderResult.rows[0]

    // Create order items
    for (const item of orderData.items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price, seller_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, item.product_id, item.quantity, item.price, item.seller_id]
      )
    }

    // Clear user's cart
    await client.query(
      "DELETE FROM cart WHERE user_id = $1",
      [orderData.user_id]
    )

    await client.query('COMMIT')
    return order

  } catch (error) {
    await client.query('ROLLBACK')
    console.error("Error creating order:", error)
    return null
  } finally {
    client.release()
  }
}

// Get user's orders
export const getUserOrders = async (userId: number): Promise<Order[]> => {
  try {
    const result = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    )
    return result.rows
  } catch (error) {
    console.error("Error fetching user orders:", error)
    return []
  }
}

// Get order by ID with items
export const getOrderById = async (orderId: number, userId: number): Promise<{
  order: Order | null,
  items: OrderItem[]
}> => {
  try {
    const orderResult = await pool.query(
      "SELECT * FROM orders WHERE id = $1 AND user_id = $2",
      [orderId, userId]
    )

    if (!orderResult.rows[0]) {
      return { order: null, items: [] }
    }

    const itemsResult = await pool.query(
      `SELECT 
        oi.*,
        p.name as product_name,
        p.images as product_images
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [orderId]
    )

    return {
      order: orderResult.rows[0],
      items: itemsResult.rows
    }
  } catch (error) {
    console.error("Error fetching order:", error)
    return { order: null, items: [] }
  }
}

// Update order status
export const updateOrderStatus = async (
  orderId: number, 
  userId: number, 
  status: Order["status"]
): Promise<Order | null> => {
  try {
    const result = await pool.query(
      `UPDATE orders 
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [status, orderId, userId]
    )
    return result.rows[0] || null
  } catch (error) {
    console.error("Error updating order status:", error)
    return null
  }
}

// Get all orders (for admin/seller view)
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const result = await pool.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    )
    return result.rows
  } catch (error) {
    console.error("Error fetching all orders:", error)
    return []
  }
}

// Get seller's orders
export const getSellerOrders = async (sellerId: number): Promise<OrderItem[]> => {
  try {
    const result = await pool.query(
      `SELECT 
        oi.*,
        o.order_number,
        o.status as order_status,
        o.created_at as order_created_at,
        p.name as product_name,
        p.images as product_images,
        u.first_name as buyer_first_name,
        u.last_name as buyer_last_name
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       JOIN products p ON oi.product_id = p.id
       JOIN users u ON o.user_id = u.id
       WHERE oi.seller_id = $1
       ORDER BY o.created_at DESC`,
      [sellerId]
    )
    return result.rows
  } catch (error) {
    console.error("Error fetching seller orders:", error)
    return []
  }
}
