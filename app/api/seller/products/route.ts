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
    const decoded = verifyToken(token)
    const sellerId = decoded.id

    const products = await getProductsBySeller(sellerId)

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
    const decoded = verifyToken(token)
    const sellerId = decoded.id

    const body = await request.json()
    const { name, description, category, price, stockQuantity, images, status } = body

    // Validation
    if (!name || !description || !category || price === undefined || stockQuantity === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate unique product ID
    const productId = await generateProductId()

    const productData = {
      productId,
      name,
      description,
      category,
      price: Number.parseFloat(price),
      stockQuantity: Number.parseInt(stockQuantity),
      sellerId,
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
