import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { getUserOrders, getOrderById, getReturnOrdersByUser } from "@/lib/db/orders"

// GET - Get user's order history with detailed information
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    const userId = decoded.id

    // Get user's orders
    const orders = await getUserOrders(userId)
    
    // Get return orders for the user
    const returnOrders = await getReturnOrdersByUser(userId)
    
    // Create a map of order_id to return order status
    const returnStatusMap = new Map()
    returnOrders.forEach(returnOrder => {
      returnStatusMap.set(returnOrder.order_id, returnOrder.status)
    })

    // Enhance orders with return status and detailed items
    const enhancedOrders = await Promise.all(
      orders.map(async (order) => {
        const { items } = await getOrderById(order.id, userId)
        
        return {
          ...order,
          items,
          return_status: returnStatusMap.get(order.id) || null,
          item_count: items.reduce((sum, item) => sum + item.quantity, 0)
        }
      })
    )

    return NextResponse.json({ 
      orders: enhancedOrders,
      total_orders: enhancedOrders.length,
      total_amount: enhancedOrders.reduce((sum, order) => sum + order.total_amount, 0)
    })
  } catch (error) {
    console.error("Error fetching order history:", error)
    return NextResponse.json({ error: "Failed to fetch order history" }, { status: 500 })
  }
}
