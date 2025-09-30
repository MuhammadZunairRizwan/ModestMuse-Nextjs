import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { 
  addToCart, 
  getCartItems, 
  updateCartItemQuantity, 
  removeFromCart, 
  getCartItemCount,
  getCartTotal 
} from "@/lib/db/cart"

// GET - Get user's cart items
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    const userId = decoded.id

    const cartItems = await getCartItems(userId)
    const itemCount = await getCartItemCount(userId)
    const total = await getCartTotal(userId)

    return NextResponse.json({ 
      items: cartItems, 
      itemCount, 
      total 
    })
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    const userId = decoded.id

    const { product_id, quantity } = await request.json()

    if (!product_id || !quantity) {
      return NextResponse.json({ error: "Product ID and quantity are required" }, { status: 400 })
    }

    const cartItem = await addToCart({
      user_id: userId,
      product_id,
      quantity
    })

    if (!cartItem) {
      return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
    }

    const itemCount = await getCartItemCount(userId)
    const total = await getCartTotal(userId)

    return NextResponse.json({ 
      message: "Item added to cart", 
      cartItem, 
      itemCount, 
      total 
    })
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}

// PUT - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    const userId = decoded.id

    const { cart_item_id, quantity } = await request.json()

    if (!cart_item_id || quantity === undefined) {
      return NextResponse.json({ error: "Cart item ID and quantity are required" }, { status: 400 })
    }

    const updatedItem = await updateCartItemQuantity(cart_item_id, userId, quantity)

    if (!updatedItem) {
      return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 })
    }

    const itemCount = await getCartItemCount(userId)
    const total = await getCartTotal(userId)

    return NextResponse.json({ 
      message: "Cart item updated", 
      cartItem: updatedItem, 
      itemCount, 
      total 
    })
  } catch (error) {
    console.error("Error updating cart item:", error)
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 })
  }
}

// DELETE - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    const userId = decoded.id

    const { searchParams } = new URL(request.url)
    const cartItemId = searchParams.get('id')

    if (!cartItemId) {
      return NextResponse.json({ error: "Cart item ID is required" }, { status: 400 })
    }

    const success = await removeFromCart(Number(cartItemId), userId)

    if (!success) {
      return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 })
    }

    const itemCount = await getCartItemCount(userId)
    const total = await getCartTotal(userId)

    return NextResponse.json({ 
      message: "Item removed from cart", 
      itemCount, 
      total 
    })
  } catch (error) {
    console.error("Error removing from cart:", error)
    return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 })
  }
}
