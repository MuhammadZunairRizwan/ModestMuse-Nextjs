"use client"

import Link from "next/link";
import { Search, User, ShoppingBag, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function Header() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

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
            <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">
              Home
            </Link>
            <Link href="/shop" className="text-gray-700 hover:text-gray-900 font-medium">
              Shop
            </Link>
            {user?.user_type === 'seller' && (
              <Link href="/seller/products" className="text-gray-700 hover:text-gray-900 font-medium">
                My Products
              </Link>
            )}
            <Link href="/about" className="text-gray-700 hover:text-gray-900 font-medium">
              About Us
            </Link>
            <Link href="#" className="text-gray-700 hover:text-gray-900 font-medium">
              Blog
            </Link>
            <Link href="#" className="text-gray-700 hover:text-gray-900 font-medium">
              Contact
            </Link>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  {user.first_name} ({user.user_type})
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
