// app/api/seller/products/[id]/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { deleteProduct, updateProduct } from "@/lib/db/products";
import { verifyToken } from "@/lib/auth";
import { findUserById } from "@/lib/db/db";

// DELETE
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token) as { id: number };
    const user = await findUserById(decoded.id);

    if (!user || user.userType !== "seller") {
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

    const decoded = verifyToken(token) as { id: number };
    const user = await findUserById(decoded.id);

    if (!user || user.userType !== "seller") {
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
      stockQuantity: body.stockQuantity ? Number.parseInt(body.stockQuantity) : undefined,
    };

    const product = await updateProduct(productId, updates);

    return product && product.sellerId === user.id
      ? NextResponse.json({ product })
      : NextResponse.json({ error: "Product not found or unauthorized" }, { status: 404 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
