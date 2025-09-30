import { type NextRequest, NextResponse } from "next/server"
import { createProduct, getProductsBySeller, generateProductId } from "@/lib/db/products"
import { verifyToken } from "@/lib/auth"

// GET - Fetch seller's products
export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify token and get seller ID
    const decoded = await verifyToken(token)
    const seller_id = decoded.id

    const products = await getProductsBySeller(seller_id)

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error fetching seller products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify token and get seller ID
    const decoded = await verifyToken(token)
    const seller_id = decoded.id

    const body = await request.json()
    const { name, description, category, price, stock_quantity, images, status } = body

    // Validation
    if (!name || !description || !category || price === undefined || stock_quantity === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate unique product ID
    const product_id = await generateProductId()

    const productData = {
      product_id,
      name,
      description,
      category,
      price: Number.parseFloat(price),
      stock_quantity: Number.parseInt(stock_quantity),
      seller_id,
      images: images || [],
      status: status || "active",
    }

    const product = await createProduct(productData)

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
