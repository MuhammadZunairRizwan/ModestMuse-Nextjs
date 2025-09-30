import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { createOrder, getUserOrders, getOrderById } from "@/lib/db/orders"
import { getCartItems } from "@/lib/db/cart"

// GET - Get user's orders
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    const userId = decoded.id

    const orders = await getUserOrders(userId)

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

// POST - Create a new order from cart
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    const userId = decoded.id

    const { delivery_address } = await request.json()

    if (!delivery_address) {
      return NextResponse.json({ error: "Delivery address is required" }, { status: 400 })
    }

    // Get user's cart items
    const cartItems = await getCartItems(userId)

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    // Prepare order items
    const orderItems = cartItems.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product_price,
      seller_id: item.seller_id
    }))

    // Create order
    const order = await createOrder({
      user_id: userId,
      delivery_address,
      items: orderItems
    })

    if (!order) {
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    return NextResponse.json({ 
      message: "Order created successfully", 
      order 
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

// GET - Get specific order by ID
export async function GET_ORDER(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get('token')?.value
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    const userId = decoded.id

    const orderId = Number(params.id)
    const { order, items } = await getOrderById(orderId, userId)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ order, items })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}
