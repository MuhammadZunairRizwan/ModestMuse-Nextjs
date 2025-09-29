import { pool } from "./init"

export interface Product {
  id: number
  product_id: string
  name: string
  description: string
  category: string
  price: number
  stock_quantity: number
  seller_id: number
  images: string[]
  status: "active" | "inactive" | "out_of_stock"
  created_at: string
  updated_at: string
}

export interface CreateProductData {
  product_id: string
  name: string
  description: string
  category: string
  price: number
  stock_quantity: number
  seller_id: number
  images: string[]
  status?: "active" | "inactive" | "out_of_stock"
}

// Create a new product
export const createProduct = async (productData: CreateProductData): Promise<Product> => {
  try {
    const result = await pool.query(
      `INSERT INTO products (
        product_id, name, description, category, price, 
        stock_quantity, seller_id, images, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        productData.product_id,
        productData.name,
        productData.description,
        productData.category,
        productData.price,
        productData.stock_quantity,
        productData.seller_id,
        productData.images,
        productData.status || "active",
      ],
    )
    return result.rows[0]
  } catch (error) {
    console.error("Error creating product:", error)
    throw error
  }
}

// Get all products for a specific seller
export const getProductsBySeller = async (sellerId: number): Promise<Product[]> => {
  try {
    const result = await pool.query("SELECT * FROM products WHERE seller_id = $1 ORDER BY created_at DESC", [sellerId])
    return result.rows
  } catch (error) {
    console.error("Error fetching products by seller:", error)
    return []
  }
}

// Get all active products for shop page
export const getActiveProducts = async (): Promise<Product[]> => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.shop_name, u.first_name, u.last_name 
       FROM products p 
       JOIN users u ON p.seller_id = u.id 
       WHERE p.status = 'active' AND p.stock_quantity > 0 
       ORDER BY p.created_at DESC`,
    )
    return result.rows
  } catch (error) {
    console.error("Error fetching active products:", error)
    return []
  }
}

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.shop_name, u.first_name, u.last_name 
       FROM products p 
       JOIN users u ON p.seller_id = u.id 
       WHERE p.category = $1 AND p.status = 'active' AND p.stock_quantity > 0 
       ORDER BY p.created_at DESC`,
      [category],
    )
    return result.rows
  } catch (error) {
    console.error("Error fetching products by category:", error)
    return []
  }
}

// Get a single product by ID
export const getProductById = async (id: number): Promise<Product | null> => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.shop_name, u.first_name, u.last_name, u.email 
       FROM products p 
       JOIN users u ON p.seller_id = u.id 
       WHERE p.id = $1`,
      [id],
    )
    return result.rows[0] || null
  } catch (error) {
    console.error("Error fetching product by ID:", error)
    return null
  }
}

// Update a product
export const updateProduct = async (id: number, updates: Partial<CreateProductData>): Promise<Product | null> => {
  try {
    const setClauses: string[] = []
    const values: any[] = []
    let paramCount = 1

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        setClauses.push(`${key} = $${paramCount}`)
        values.push(value)
        paramCount++
      }
    })

    if (setClauses.length === 0) {
      return null
    }

    setClauses.push("updated_at = CURRENT_TIMESTAMP")
    values.push(id)

    const result = await pool.query(
      `UPDATE products SET ${setClauses.join(", ")} WHERE id = $${paramCount} RETURNING *`,
      values,
    )

    return result.rows[0] || null
  } catch (error) {
    console.error("Error updating product:", error);
    return null
  }
}

// Delete a product
export const deleteProduct = async (id: number, sellerId: number): Promise<boolean> => {
  try {
    const result = await pool.query("DELETE FROM products WHERE id = $1 AND seller_id = $2", [id, sellerId])
    return (result.rowCount ?? 0) > 0
  } catch (error) {
    console.error("Error deleting product:", error)
    return false
  }
}

// Generate unique product ID
export const generateProductId = async (): Promise<string> => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM products")
    const count = Number.parseInt(result.rows[0].count) + 1
    return `PROD-${count.toString().padStart(4, "0")}`
  } catch (error) {
    console.error("Error generating product ID:", error)
    return `PROD-${Date.now()}`
  }
}
