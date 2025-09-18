import { Search, Grid3X3, List, Star, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"



const products = [
  {
    id: 1,
    name: "Premium Silk Blend Hijab",
    price: 49.99,
    originalPrice: null,
    rating: 4,
    reviews: 67,
    colors: ["#9CA3AF", "#6B7280", "#4B5563", "#374151"],
    image: "https://tse2.mm.bing.net/th/id/OIP.QK1aR8OkOj7tzMkfRs1XSAHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    id: 2,
    name: "Eternal Grey Bamboo Jersey Hijab",
    price: 29.99,
    originalPrice: 39.99,
    rating: 4,
    reviews: 124,
    colors: ["#9CA3AF", "#1F2937", "#3B82F6"],
    image: "https://tse2.mm.bing.net/th/id/OIP.QK1aR8OkOj7tzMkfRs1XSAHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    id: 3,
    name: "Minimalist Crepe Abaya",
    price: 89.99,
    originalPrice: 109.99,
    rating: 4,
    reviews: 156,
    colors: ["#1F2937", "#3B82F6", "#6B7280", "#9CA3AF"],
    image: "https://tse2.mm.bing.net/th/id/OIP.QK1aR8OkOj7tzMkfRs1XSAHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    id: 4,
    name: "Modest Jewelry Set",
    price: 34.99,
    originalPrice: 44.99,
    rating: 4,
    reviews: 92,
    colors: ["#9CA3AF", "#6B7280", "#4B5563"],
    image: "https://tse2.mm.bing.net/th/id/OIP.QK1aR8OkOj7tzMkfRs1XSAHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    id: 5,
    name: "Pearl Hijab Pin Set",
    price: 19.99,
    originalPrice: null,
    rating: 4,
    reviews: 203,
    colors: ["#9CA3AF", "#6B7280", "#4B5563"],
    image: "https://tse2.mm.bing.net/th/id/OIP.QK1aR8OkOj7tzMkfRs1XSAHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    id: 6,
    name: "Flowing Satin Occasion Abaya",
    price: 129.99,
    originalPrice: null,
    rating: 4,
    reviews: 78,
    colors: ["#9CA3AF", "#6B7280", "#4B5563", "#1F2937"],
    image: "https://tse2.mm.bing.net/th/id/OIP.QK1aR8OkOj7tzMkfRs1XSAHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    id: 7,
    name: "Classic Cotton Voile Hijab",
    price: 24.99,
    originalPrice: null,
    rating: 4,
    reviews: 89,
    colors: ["#F3F4F6", "#E5E7EB", "#9CA3AF", "#10B981"],
    image: "https://tse2.mm.bing.net/th/id/OIP.QK1aR8OkOj7tzMkfRs1XSAHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    id: 8,
    name: "Breathable Under Cap",
    price: 14.99,
    originalPrice: null,
    rating: 4,
    reviews: 145,
    colors: ["#9CA3AF", "#1F2937"],
    image: "https://tse2.mm.bing.net/th/id/OIP.QK1aR8OkOj7tzMkfRs1XSAHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  },
]

const categories = [
  { name: "All Products", count: 8, active: true },
  { name: "Hijabs", count: 3, active: false },
  { name: "Abayas & Dresses", count: 2, active: false },
  { name: "Accessories", count: 3, active: false },
]

const priceRanges = [
  { label: "Under $25", checked: false },
  { label: "$25 - $50", checked: false },
  { label: "$50 - $100", checked: false },
  { label: "Over $100", checked: false },
]

const ratings = [
  { label: "4+ Stars", checked: false },
  { label: "3+ Stars", checked: false },
  { label: "2+ Stars", checked: false },
  { label: "1+ Stars", checked: false },
]

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ))}
      <span className="text-sm text-gray-500 ml-1">({reviews})</span>
    </div>
  )
}

function ProductCard({ product }: { product: (typeof products)[0] }) {
  return (
    <div className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button variant="secondary" size="sm">
            Quick View
          </Button>
        </div>
      </div>

      <div className="p-4">
        <StarRating rating={product.rating} reviews={product.reviews} />
        <h3 className="font-medium text-gray-900 mt-2 mb-2">{product.name}</h3>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-semibold text-gray-900">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
          )}
        </div>

        <div className="flex items-center gap-1 mb-3">
          <span className="text-sm text-gray-600 mr-2">Colors:</span>
          {product.colors.map((color, index) => (
            <div
              key={index}
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">Add to Cart</Button>
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-gray-50">
       <Header />
      {/* Hero Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop ModestMuse</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our complete collection of premium modest fashion designed for the modern Muslim woman.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              {/* Categories */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div
                      key={category.name}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                        category.active ? "bg-teal-50 text-teal-700" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="text-sm">({category.count})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-3">
                  {priceRanges.map((range) => (
                    <div key={range.label} className="flex items-center space-x-2">
                      <Checkbox id={range.label} />
                      <label htmlFor={range.label} className="text-sm text-gray-700">
                        {range.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating</h3>
                <div className="space-y-3">
                  {ratings.map((rating) => (
                    <div key={rating.label} className="flex items-center space-x-2">
                      <Checkbox id={rating.label} />
                      <label htmlFor={rating.label} className="text-sm text-gray-700">
                        {rating.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Search and Filters */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input placeholder="Search products..." className="pl-10" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Select defaultValue="featured">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border border-gray-300 rounded">
                  <Button variant="ghost" size="sm" className="p-2">
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <p className="text-gray-600 mb-6">Showing 8 of 8 products</p>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
