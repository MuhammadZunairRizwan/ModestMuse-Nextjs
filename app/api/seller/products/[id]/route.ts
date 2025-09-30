// app/api/seller/products/[id]/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { deleteProduct, updateProduct, getProductById } from "@/lib/db/products";
import { verifyToken } from "@/lib/auth";
import { findUserById } from "@/lib/db/db";

// GET - Fetch single product
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = await verifyToken(token) as { id: number };
    const user = await findUserById(decoded.id);

    if (!user || user.user_type !== "seller") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const productId = Number.parseInt(params.id);
    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const product = await getProductById(productId);

    if (!product || product.seller_id !== user.id) {
      return NextResponse.json({ error: "Product not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = await verifyToken(token) as { id: number };
    const user = await findUserById(decoded.id);

    if (!user || user.user_type !== "seller") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const productId = Number.parseInt(params.id);
    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const success = await deleteProduct(productId, user.id);

    return success
      ? NextResponse.json({ message: "Product deleted successfully" })
      : NextResponse.json({ error: "Product not found or unauthorized" }, { status: 404 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

// PUT
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = await verifyToken(token) as { id: number };
    const user = await findUserById(decoded.id);

    if (!user || user.user_type !== "seller") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const productId = Number.parseInt(params.id);
    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const body = await request.json();
    const updates = {
      ...body,
      price: body.price ? Number.parseFloat(body.price) : undefined,
      stock_quantity: body.stock_quantity ? Number.parseInt(body.stock_quantity) : undefined,
    };

    const product = await updateProduct(productId, updates);

    return product && product.seller_id === user.id
      ? NextResponse.json({ product })
      : NextResponse.json({ error: "Product not found or unauthorized" }, { status: 404 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
