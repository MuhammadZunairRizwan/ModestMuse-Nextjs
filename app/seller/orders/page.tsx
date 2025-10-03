"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Calendar, MapPin, DollarSign, RefreshCw, CheckCircle, Truck, XCircle, User } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface SellerOrder {
  order_id: number
  order_number: string
  order_status: string
  total_amount: number
  delivery_address: string
  order_created_at: string
  order_updated_at: string
  buyer_first_name: string
  buyer_last_name: string
  buyer_id: number
  items: Array<{
    id: number
    product_id: number
    product_name: string
    product_images: string[]
    quantity: number
    price: number
    seller_id: number
    created_at: string
  }>
}

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<SellerOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchSellerOrders()
  }, [filterStatus])

  const fetchSellerOrders = async () => {
    try {
      const url = filterStatus === "all" 
        ? "/api/seller/orders" 
        : `/api/seller/orders?status=${filterStatus}`
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch orders",
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
    fetchSellerOrders()
  }

  const updateOrderStatus = async (orderId: number, action: string) => {
    try {
      const response = await fetch("/api/seller/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order_id: orderId, action }),
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Success",
          description: data.message,
        })
        refreshOrders()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to update order status",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    }
  }

  const getStatusBadgeVariant = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Package className="w-4 h-4" />
      case "confirmed": return <CheckCircle className="w-4 h-4" />
      case "shipped": return <Truck className="w-4 h-4" />
      case "delivered": return <CheckCircle className="w-4 h-4" />
      case "cancelled": return <XCircle className="w-4 h-4" />
      case "return_requested": return <Package className="w-4 h-4" />
      case "return_delivered": return <Truck className="w-4 h-4" />
      case "return_resolved": return <CheckCircle className="w-4 h-4" />
      case "return_in_conflict": return <XCircle className="w-4 h-4" />
      default: return <Package className="w-4 h-4" />
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

  const getActionButtons = (order: SellerOrder) => {
    switch (order.order_status) {
      case "pending":
        return (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => updateOrderStatus(order.order_id, "accept")}
              className="bg-green-600 hover:bg-green-700"
            >
              Accept Order
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => updateOrderStatus(order.order_id, "reject")}
            >
              Reject Order
            </Button>
          </div>
        )
      case "confirmed":
        return (
          <Button 
            size="sm" 
            onClick={() => updateOrderStatus(order.order_id, "deliver")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Mark as Delivered
          </Button>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading orders...</p>
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
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="text-gray-600">Manage and track your orders</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Warehouse</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
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
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
              <p className="text-gray-600">Orders from buyers will appear here</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.order_id} className="hover:shadow-lg transition-shadow">
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
                    {formatDate(order.order_created_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    ${order.total_amount.toFixed(2)}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {order.buyer_first_name} {order.buyer_last_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {order.delivery_address}
                  </span>
                </CardDescription>
                  </div>
                  <Badge variant={getStatusBadgeVariant(order.order_status)} className="flex items-center gap-1">
                    {getStatusIcon(order.order_status)}
                    {order.order_status === 'confirmed' ? 'Warehouse' : order.order_status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-gray-600">Order Items:</h4>
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                      <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                        {item.product_images && item.product_images.length > 0 ? (
                          <img
                            src={item.product_images[0]}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package className="w-8 h-8" />
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

                {/* Order Summary */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''} • Total Amount
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      ${order.total_amount.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  {getActionButtons(order)}
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
