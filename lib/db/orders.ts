import { pool } from "./init"

export interface Order {
  id: number
  order_number: string
  user_id: number
  total_amount: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "return_requested" | "return_delivered" | "return_resolved" | "return_in_conflict"
  delivery_address: string
  created_at: string
  updated_at: string
}

export interface ReturnOrder {
  id: number
  order_id: number
  user_id: number
  seller_id: number
  return_reason?: string
  status: "requested" | "delivered" | "resolved" | "in_conflict"
  return_address: string
  refund_amount: number
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

// Wallet system functions
export const getUserWalletBalance = async (userId: number): Promise<number> => {
  try {
    const result = await pool.query(
      "SELECT wallet_balance FROM users WHERE id = $1",
      [userId]
    )
    return result.rows[0]?.wallet_balance || 0
  } catch (error) {
    console.error("Error fetching wallet balance:", error)
    return 0
  }
}

export const updateUserWalletBalance = async (
  userId: number, 
  amount: number
): Promise<boolean> => {
  try {
    await pool.query(
      "UPDATE users SET wallet_balance = wallet_balance + $1 WHERE id = $2",
      [amount, userId]
    )
    return true
  } catch (error) {
    console.error("Error updating wallet balance:", error)
    return false
  }
}

// Return order functions
export const createReturnOrder = async (
  orderId: number,
  userId: number,
  sellerId: number,
  returnReason?: string
): Promise<ReturnOrder | null> => {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')

    // Get order details
    const orderResult = await client.query(
      "SELECT total_amount FROM orders WHERE id = $1 AND user_id = $2",
      [orderId, userId]
    )

    if (!orderResult.rows[0]) {
      throw new Error("Order not found")
    }

    // Get seller's return address
    const sellerResult = await client.query(
      "SELECT return_address FROM users WHERE id = $1",
      [sellerId]
    )

    if (!sellerResult.rows[0]?.return_address) {
      throw new Error("Seller return address not found")
    }

    const returnAddress = sellerResult.rows[0].return_address
    const refundAmount = orderResult.rows[0].total_amount

    // Create return order
    const returnResult = await client.query(
      `INSERT INTO return_orders (order_id, user_id, seller_id, return_reason, return_address, refund_amount)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [orderId, userId, sellerId, returnReason, returnAddress, refundAmount]
    )

    // Update order status
    await client.query(
      "UPDATE orders SET status = 'return_requested' WHERE id = $1",
      [orderId]
    )

    await client.query('COMMIT')
    return returnResult.rows[0]

  } catch (error) {
    await client.query('ROLLBACK')
    console.error("Error creating return order:", error)
    return null
  } finally {
    client.release()
  }
}

export const markReturnAsDelivered = async (
  returnOrderId: number,
  userId: number
): Promise<ReturnOrder | null> => {
  try {
    const result = await pool.query(
      `UPDATE return_orders 
       SET status = 'delivered', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [returnOrderId, userId]
    )

    if (result.rows[0]) {
      // Update main order status
      await pool.query(
        "UPDATE orders SET status = 'return_delivered' WHERE id = $1",
        [result.rows[0].order_id]
      )
    }

    return result.rows[0] || null
  } catch (error) {
    console.error("Error marking return as delivered:", error)
    return null
  }
}

export const confirmReturnOrder = async (
  returnOrderId: number,
  sellerId: number
): Promise<ReturnOrder | null> => {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')

    // Get return order details
    const returnResult = await client.query(
      `SELECT ro.*, o.user_id as buyer_id 
       FROM return_orders ro 
       JOIN orders o ON ro.order_id = o.id 
       WHERE ro.id = $1 AND ro.seller_id = $2`,
      [returnOrderId, sellerId]
    )

    if (!returnResult.rows[0]) {
      throw new Error("Return order not found")
    }

    const returnOrder = returnResult.rows[0]

    // Update return order status
    const updateResult = await client.query(
      `UPDATE return_orders 
       SET status = 'resolved', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [returnOrderId]
    )

    // Update main order status
    await client.query(
      "UPDATE orders SET status = 'return_resolved' WHERE id = $1",
      [returnOrder.order_id]
    )

    // Refund amount to buyer's wallet
    await client.query(
      "UPDATE users SET wallet_balance = wallet_balance + $1 WHERE id = $2",
      [returnOrder.refund_amount, returnOrder.buyer_id]
    )

    await client.query('COMMIT')
    return updateResult.rows[0]

  } catch (error) {
    await client.query('ROLLBACK')
    console.error("Error confirming return order:", error)
    return null
  } finally {
    client.release()
  }
}

export const markReturnInConflict = async (
  returnOrderId: number,
  sellerId: number
): Promise<ReturnOrder | null> => {
  try {
    const result = await pool.query(
      `UPDATE return_orders 
       SET status = 'in_conflict', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND seller_id = $2
       RETURNING *`,
      [returnOrderId, sellerId]
    )

    if (result.rows[0]) {
      // Update main order status
      await pool.query(
        "UPDATE orders SET status = 'return_in_conflict' WHERE id = $1",
        [result.rows[0].order_id]
      )
    }

    return result.rows[0] || null
  } catch (error) {
    console.error("Error marking return in conflict:", error)
    return null
  }
}

export const getReturnOrdersByUser = async (userId: number): Promise<ReturnOrder[]> => {
  try {
    const result = await pool.query(
      `SELECT ro.*, o.order_number
       FROM return_orders ro
       JOIN orders o ON ro.order_id = o.id
       WHERE ro.user_id = $1
       ORDER BY ro.created_at DESC`,
      [userId]
    )
    return result.rows
  } catch (error) {
    console.error("Error fetching return orders:", error)
    return []
  }
}

// Get seller return address for an order
export const getSellerReturnAddress = async (orderId: number, userId: number): Promise<string | null> => {
  try {
    const result = await pool.query(
      `SELECT u.return_address
       FROM order_items oi
       JOIN users u ON oi.seller_id = u.id
       JOIN orders o ON oi.order_id = o.id
       WHERE o.id = $1 AND o.user_id = $2
       LIMIT 1`,
      [orderId, userId]
    )
    
    return result.rows[0]?.return_address || null
  } catch (error) {
    console.error("Error fetching seller return address:", error)
    return null
  }
}

export const getReturnOrdersBySeller = async (sellerId: number): Promise<ReturnOrder[]> => {
  try {
    const result = await pool.query(
      `SELECT ro.*, o.order_number, u.first_name, u.last_name
       FROM return_orders ro
       JOIN orders o ON ro.order_id = o.id
       JOIN users u ON ro.user_id = u.id
       WHERE ro.seller_id = $1
       ORDER BY ro.created_at DESC`,
      [sellerId]
    )
    return result.rows
  } catch (error) {
    console.error("Error fetching seller return orders:", error)
    return []
  }
}

// Cancel order and refund to wallet
export const cancelOrderAndRefund = async (
  orderId: number,
  sellerId: number
): Promise<boolean> => {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')

    // Get order details
    const orderResult = await client.query(
      `SELECT o.*, oi.seller_id 
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       WHERE o.id = $1 AND oi.seller_id = $2`,
      [orderId, sellerId]
    )

    if (!orderResult.rows[0]) {
      throw new Error("Order not found")
    }

    const order = orderResult.rows[0]

    // Update order status
    await client.query(
      "UPDATE orders SET status = 'cancelled' WHERE id = $1",
      [orderId]
    )

    // Refund amount to buyer's wallet
    await client.query(
      "UPDATE users SET wallet_balance = wallet_balance + $1 WHERE id = $2",
      [order.total_amount, order.user_id]
    )

    await client.query('COMMIT')
    return true

  } catch (error) {
    await client.query('ROLLBACK')
    console.error("Error cancelling order:", error)
    return false
  } finally {
    client.release()
  }
}
