import { NextResponse } from "next/server"
import { getActiveProducts } from "@/lib/db/products"

// GET - Fetch all active products for shop page
export async function GET() {
  try {
    const products = await getActiveProducts()
    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error fetching shop products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
