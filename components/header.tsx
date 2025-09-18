import { Search, User, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="ml-2 text-xl font-semibold text-gray-900">ModestMuse</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-700 hover:text-gray-900 font-medium">
              Home
            </a>
            <a href="/shop" className="text-gray-700 hover:text-gray-900 font-medium">
              Shop
            </a>
            <a href="/about" className="text-gray-700 hover:text-gray-900 font-medium">
              About Us
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
              Blog
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
              Contact
            </a>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
