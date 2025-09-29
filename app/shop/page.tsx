"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ShoppingCart, Store } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface Product {
  id: number
  productId: string
  name: string
  description: string
  category: string
  price: number
  stockQuantity: number
  images: string[]
  status: string
  shopName: string
  firstName: string
  lastName: string
}

const categories = [
  "All Categories",
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports & Outdoors",
  "Books",
  "Toys & Games",
  "Health & Beauty",
  "Automotive",
  "Food & Beverages",
  "Other",
]

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const { toast } = useToast()

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, selectedCategory])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/shop/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch products",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = products

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.shopName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    setFilteredProducts(filtered)
  }

  const handleAddToCart = (productId: number) => {
    // In a real app, this would add to cart
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
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-8">
              <Header />
        <p className="text-gray-600 text-lg">Discover amazing products from our sellers</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search products, sellers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== "All Categories"
                  ? "Try adjusting your search or filters"
                  : "No products are currently available"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative bg-gray-100">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Store className="w-12 h-12" />
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                <CardDescription className="text-sm">
                  by <span className="font-medium">{product.shopName}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>

                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    <span className="text-sm text-gray-500">Stock: {product.stockQuantity}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xl font-bold text-green-600">${product.price}</span>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Load More Button (for pagination in future) */}
      {filteredProducts.length > 0 && (
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" disabled>
            Load More Products
          </Button>
        </div>
      )}
       <Footer />
    </div>
  )
}
