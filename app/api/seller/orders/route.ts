import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { getSellerOrdersGrouped, updateOrderStatusForSeller, cancelOrderAndRefund, Order } from "@/lib/db/orders"

// GET - Get seller's orders with filtering capabilities
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    const sellerId = decoded.id

    // Check if user is a seller
    if (decoded.user_type !== 'seller') {
      return NextResponse.json({ error: "Access denied. Seller account required." }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    // Get seller's orders grouped by order_id
    const orders = await getSellerOrdersGrouped(sellerId)

    // Filter by status if provided
    let filteredOrders = orders
    if (status && status !== 'all') {
      filteredOrders = orders.filter(order => order.order_status === status)
    }

    return NextResponse.json({ 
      orders: filteredOrders,
      total_orders: filteredOrders.length,
      total_amount: filteredOrders.reduce((sum, order) => sum + order.total_amount, 0)
    })
  } catch (error) {
    console.error("Error fetching seller orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

// PATCH - Update order status (accept/reject/deliver)
export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    const sellerId = decoded.id

    // Check if user is a seller
    if (decoded.user_type !== 'seller') {
      return NextResponse.json({ error: "Access denied. Seller account required." }, { status: 403 })
    }

    const { order_id, action } = await request.json()

    if (!order_id || !action) {
      return NextResponse.json({ error: "Order ID and action are required" }, { status: 400 })
    }

    let success: boolean | Order | null = false

    switch (action) {
      case 'accept':
        // Accept order - change status to warehouse
        // For now, we'll use 'confirmed' as warehouse status since it's in the schema
        success = await updateOrderStatusForSeller(Number(order_id), 'confirmed' as any)
        break
        
      case 'reject':
        // Reject order - cancel and refund
        success = await cancelOrderAndRefund(Number(order_id), sellerId)
        break
        
      case 'deliver':
        // Mark as delivered
        success = await updateOrderStatusForSeller(Number(order_id), 'delivered')
        break
        
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    if (!success) {
      return NextResponse.json({ error: "Failed to update order status" }, { status: 500 })
    }

    return NextResponse.json({ 
      message: `Order ${action}ed successfully`,
      success: true
    })
  } catch (error) {
    console.error("Error updating order status:", error)
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 })
  }
}
