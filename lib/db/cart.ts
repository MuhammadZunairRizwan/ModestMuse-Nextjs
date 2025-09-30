import { pool } from "./init"

export interface CartItem {
  id: number
  user_id: number
  product_id: number
  quantity: number
  created_at: string
  updated_at: string
  product_name: string
  product_price: number
  product_images: string[]
  seller_id: number
  shop_name: string
}

export interface AddToCartData {
  user_id: number
  product_id: number
  quantity: number
}

// Add item to cart or update quantity if already exists
export const addToCart = async (cartData: AddToCartData): Promise<CartItem | null> => {
  try {
    const result = await pool.query(
      `INSERT INTO cart (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id) 
       DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity,
                     updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [cartData.user_id, cartData.product_id, cartData.quantity]
    )
    
    return result.rows[0] || null
  } catch (error) {
    console.error("Error adding to cart:", error)
    return null
  }
}

// Get user's cart items with product details
export const getCartItems = async (userId: number): Promise<CartItem[]> => {
  try {
    const result = await pool.query(
      `SELECT 
        c.*,
        p.name as product_name,
        p.price as product_price,
        p.images as product_images,
        p.seller_id as seller_id,
        u.shop_name as shop_name
       FROM cart c
       JOIN products p ON c.product_id = p.id
       JOIN users u ON p.seller_id = u.id
       WHERE c.user_id = $1
       ORDER BY c.created_at DESC`,
      [userId]
    )
    return result.rows
  } catch (error) {
    console.error("Error fetching cart items:", error)
    return []
  }
}

// Update cart item quantity
export const updateCartItemQuantity = async (
  cartItemId: number, 
  userId: number, 
  quantity: number
): Promise<CartItem | null> => {
  try {
    const result = await pool.query(
      `UPDATE cart 
       SET quantity = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [quantity, cartItemId, userId]
    )
    return result.rows[0] || null
  } catch (error) {
    console.error("Error updating cart item:", error)
    return null
  }
}

// Remove item from cart
export const removeFromCart = async (cartItemId: number, userId: number): Promise<boolean> => {
  try {
    const result = await pool.query(
      "DELETE FROM cart WHERE id = $1 AND user_id = $2",
      [cartItemId, userId]
    )
    return (result.rowCount ?? 0) > 0
  } catch (error) {
    console.error("Error removing from cart:", error)
    return false
  }
}

// Clear user's entire cart
export const clearCart = async (userId: number): Promise<boolean> => {
  try {
    const result = await pool.query(
      "DELETE FROM cart WHERE user_id = $1",
      [userId]
    )
    return (result.rowCount ?? 0) > 0
  } catch (error) {
    console.error("Error clearing cart:", error)
    return false
  }
}

// Get cart item count for user
export const getCartItemCount = async (userId: number): Promise<number> => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) FROM cart WHERE user_id = $1",
      [userId]
    )
    return Number.parseInt(result.rows[0].count)
  } catch (error) {
    console.error("Error getting cart item count:", error)
    return 0
  }
}

// Get cart total price for user
export const getCartTotal = async (userId: number): Promise<number> => {
  try {
    const result = await pool.query(
      `SELECT SUM(c.quantity * p.price) as total
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [userId]
    )
    return Number.parseFloat(result.rows[0].total || 0)
  } catch (error) {
    console.error("Error getting cart total:", error)
    return 0
  }
}
