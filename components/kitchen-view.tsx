"use client"

import type React from "react"

import { usePOS } from "@/contexts/pos-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function KitchenView() {
  const { activeOrders, updateOrderStatus } = usePOS()
  const { toast } = useToast()

  // Filtrar apenas pedidos ativos ou em preparo
  const pendingOrders = activeOrders.filter((order) => order.status === "active" || order.status === "preparing")

  const handleMarkAsPreparing = (orderId: string) => {
    updateOrderStatus(orderId, "preparing")
    toast({
      title: "Pedido em preparo",
      description: "O pedido foi marcado como em preparo",
    })
  }

  const handleMarkAsCompleted = (orderId: string) => {
    updateOrderStatus(orderId, "completed")
    toast({
      title: "Pedido concluído",
      description: "O pedido foi marcado como concluído",
    })
  }

  if (pendingOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <ChefHat className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-500">Nenhum pedido pendente</h2>
        <p className="text-gray-400">Os pedidos aparecerão aqui quando forem feitos</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Pedidos para Preparação</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingOrders.map((order) => (
          <Card key={order.id} className={order.status === "preparing" ? "border-orange-400" : ""}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Pedido #{order.orderNumber}</CardTitle>
                <Badge variant={order.status === "active" ? "default" : "secondary"}>
                  {order.status === "active" ? "Novo" : "Em Preparo"}
                </Badge>
              </div>
              <div className="text-sm text-gray-500">Cliente: {order.customerName}</div>
              <div className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleTimeString()}</div>
            </CardHeader>

            <CardContent>
              <h3 className="font-medium mb-2">Itens:</h3>
              <ul className="space-y-2">
                {order.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {item.quantity}x
                    </div>
                    <div>
                      <div className="font-medium">{item.title}</div>
                      {item.observation && <div className="text-xs text-gray-500 italic">"{item.observation}"</div>}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="flex justify-between pt-2">
              {order.status === "active" ? (
                <Button variant="outline" className="w-full" onClick={() => handleMarkAsPreparing(order.id)}>
                  <Clock className="mr-2 h-4 w-4" />
                  Iniciar Preparo
                </Button>
              ) : (
                <Button
                  variant="default"
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => handleMarkAsCompleted(order.id)}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Concluir Preparo
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ChefHat(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
      <line x1="6" x2="18" y1="17" y2="17" />
    </svg>
  )
}


