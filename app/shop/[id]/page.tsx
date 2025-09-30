"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, ArrowLeft, ZoomIn } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Link from "next/link"

interface Product {
  id: number
  product_id: string
  name: string
  description: string
  category: string
  price: number
  stock_quantity: number
  images: string[]
  status: string
  shop_name: string
  first_name: string
  last_name: string
  email: string
}

export default function ProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isMagnifying, setIsMagnifying] = useState(false)
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 })
  const { toast } = useToast()

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const productId = params.id
      const response = await fetch(`/api/shop/products/${productId}`)
      
      if (response.ok) {
        const data = await response.json()
        setProduct(data.product)
      } else {
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch product",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImageHover = (e: React.MouseEvent<HTMLImageElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setMagnifierPosition({ x, y })
    setIsMagnifying(true)
  }

  const handleImageLeave = () => {
    setIsMagnifying(false)
  }

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart",
      description: "Product has been added to your cart",
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link href="/shop">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Header />
      
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/shop">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image with Magnifier */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.images[selectedImageIndex] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover cursor-zoom-in"
              onMouseMove={handleImageHover}
              onMouseLeave={handleImageLeave}
            />
            
            {/* Magnifier Effect */}
            {isMagnifying && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div
                  className="absolute w-32 h-32 bg-white rounded-full shadow-lg border-2 border-gray-300"
                  style={{
                    left: `${magnifierPosition.x}%`,
                    top: `${magnifierPosition.y}%`,
                    transform: 'translate(-50%, -50%)',
                    backgroundImage: `url(${product.images[selectedImageIndex] || "/placeholder.svg"})`,
                    backgroundSize: `${200}%`,
                    backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
                  }}
                />
              </div>
            )}

            {/* Magnifier Icon */}
            <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
              <ZoomIn className="w-4 h-4 text-gray-600" />
            </div>
          </div>

          {/* Image Carousel */}
          {product.images.length > 1 && (
            <div className="relative">
              <Carousel className="w-full">
                <CarouselContent>
                  {product.images.map((image, index) => (
                    <CarouselItem key={index} className="basis-1/3">
                      <div
                        className={`aspect-square bg-gray-100 rounded-md overflow-hidden cursor-pointer border-2 ${
                          selectedImageIndex === index ? "border-blue-500" : "border-transparent"
                        }`}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
              </Carousel>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-600 text-lg">by <span className="font-medium">{product.shop_name}</span></p>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="outline">{product.category}</Badge>
            <span className="text-sm text-gray-500">Stock: {product.stock_quantity}</span>
          </div>

          <div className="text-3xl font-bold text-green-600">${product.price}</div>

          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-4 pt-6">
            <Button
              size="lg"
              onClick={handleAddToCart}
              className="bg-blue-600 hover:bg-blue-700 flex-1"
              disabled={product.stock_quantity === 0}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>

          {/* Seller Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Seller Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Shop:</strong> {product.shop_name}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Contact:</strong> {product.email}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
