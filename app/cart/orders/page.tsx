"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Calendar, MapPin, DollarSign, RefreshCw, CheckCircle, Truck, RotateCcw, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
  seller_id: number
  created_at: string
  product_name: string
  product_images: string[]
}

interface Order {
  id: number
  order_number: string
  user_id: number
  total_amount: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "return_requested" | "return_delivered" | "return_resolved" | "return_in_conflict"
  delivery_address: string
  created_at: string
  updated_at: string
  items: OrderItem[]
  return_status: string | null
  item_count: number
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchOrderHistory()
  }, [])

  const fetchOrderHistory = async () => {
    try {
      const response = await fetch("/api/orders/history")
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch order history",
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
      setRefreshing(false)
    }
  }

  const refreshOrders = () => {
    setRefreshing(true)
    fetchOrderHistory()
  }

  const getStatusBadgeVariant = (status: Order["status"]) => {
    switch (status) {
      case "pending": return "secondary"
      case "confirmed": return "default"
      case "shipped": return "default"
      case "delivered": return "default"
      case "cancelled": return "destructive"
      case "return_requested": return "secondary"
      case "return_delivered": return "default"
      case "return_resolved": return "default"
      case "return_in_conflict": return "destructive"
      default: return "secondary"
    }
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending": return <AlertCircle className="w-4 h-4" />
      case "confirmed": return <CheckCircle className="w-4 h-4" />
      case "shipped": return <Truck className="w-4 h-4" />
      case "delivered": return <Package className="w-4 h-4" />
      case "cancelled": return <AlertCircle className="w-4 h-4" />
      case "return_requested": return <RotateCcw className="w-4 h-4" />
      case "return_delivered": return <Truck className="w-4 h-4" />
      case "return_resolved": return <CheckCircle className="w-4 h-4" />
      case "return_in_conflict": return <AlertCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading order history...</p>
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
        <div className="flex items-center justify-between mb-4">
          <div className="text-left">
            <h1 className="text-3xl font-bold">Order History</h1>
            <p className="text-gray-600">Your complete order timeline</p>
          </div>
          <Button 
            variant="outline" 
            onClick={refreshOrders}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
              <Button asChild>
                <Link href="/shop">Start Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Order #{order.order_number}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(order.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ${order.total_amount.toFixed(2)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {order.item_count} item{order.item_count !== 1 ? 's' : ''}
                      </span>
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusBadgeVariant(order.status)} className="flex items-center gap-1">
                    {getStatusIcon(order.status)}
                    {order.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Delivery Address */}
                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-md">
                  <MapPin className="w-4 h-4 mt-1 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium">Delivery Address</p>
                    <p className="text-sm text-gray-600">{order.delivery_address}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  <p className="text-sm font-medium">Items:</p>
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 border rounded-md">
                      <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                        {item.product_images && item.product_images.length > 0 ? (
                          <img
                            src={item.product_images[0]}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm text-green-600">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Return Status */}
                {order.return_status && (
                  <div className="p-3 bg-blue-50 rounded-md">
                    <p className="text-sm font-medium text-blue-800">
                      Return Status: {order.return_status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/cart/orders/${order.id}`}>
                      View Details
                    </Link>
                  </Button>
                  {order.status === 'delivered' && !order.return_status && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/cart/orders/${order.id}/return`}>
                        Request Return
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Footer />
    </div>
  )
}
