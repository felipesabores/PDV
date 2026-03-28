"use client"

import { useState } from "react"
import { usePOS } from "@/contexts/pos-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, CheckCircle, Clock, XCircle, Filter } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type OrderStatusFilter = "all" | "active" | "completed" | "cancelled"

export function OrdersView() {
  const { activeOrders } = usePOS()
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("all")

  // Filtrar pedidos com base no status selecionado
  const filteredOrders = activeOrders.filter((order) => {
    if (statusFilter === "all") return true
    if (statusFilter === "active") return order.status === "active" || order.status === "preparing"
    return order.status === statusFilter
  })

  // Ordenar pedidos do mais recente para o mais antigo
  const sortedOrders = [...filteredOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  // Mapear status para ícones e cores
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "preparing":
        return <Clock className="h-4 w-4 text-orange-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  // Mapear status para texto
  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Novo"
      case "preparing":
        return "Em Preparo"
      case "completed":
        return "Concluído"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  // Mapear status para variante do Badge
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "preparing":
        return "secondary"
      case "completed":
        return "success"
      case "cancelled":
        return "destructive"
      default:
        return "default"
    }
  }

  // Contar pedidos por status
  const countByStatus = {
    all: activeOrders.length,
    active: activeOrders.filter((o) => o.status === "active" || o.status === "preparing").length,
    completed: activeOrders.filter((o) => o.status === "completed").length,
    cancelled: activeOrders.filter((o) => o.status === "cancelled").length,
  }

  if (activeOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-500">Nenhum pedido realizado</h2>
        <p className="text-gray-400">Os pedidos aparecerão aqui quando forem feitos</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Histórico de Pedidos</h2>
      </div>

      <Tabs
        defaultValue="all"
        value={statusFilter}
        onValueChange={(value) => setStatusFilter(value as OrderStatusFilter)}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Todos</span>
            <Badge variant="outline" className="ml-1">
              {countByStatus.all}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Ativos</span>
            <Badge variant="outline" className="ml-1">
              {countByStatus.active}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Concluídos</span>
            <Badge variant="outline" className="ml-1">
              {countByStatus.completed}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            <span>Cancelados</span>
            <Badge variant="outline" className="ml-1">
              {countByStatus.cancelled}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter}>
          {sortedOrders.length > 0 ? (
            <div className="space-y-4">
              {sortedOrders.map((order) => (
                <Card
                  key={order.id}
                  className={
                    order.status === "completed"
                      ? "border-green-200 bg-green-50"
                      : order.status === "preparing"
                        ? "border-orange-200"
                        : order.status === "cancelled"
                          ? "border-red-200 bg-red-50"
                          : ""
                  }
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CardTitle>Pedido #{order.orderNumber}</CardTitle>
                        {getStatusIcon(order.status)}
                      </div>
                      <Badge variant={getStatusVariant(order.status) as any}>{getStatusText(order.status)}</Badge>
                    </div>
                    <div className="text-sm text-gray-500">Cliente: {order.customerName}</div>
                    <div className="text-xs text-gray-400 flex justify-between">
                      <span>Criado: {new Date(order.createdAt).toLocaleString()}</span>
                      {order.status === "completed" && (
                        <span>Concluído: {new Date(order.updatedAt).toLocaleString()}</span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Itens: {order.items.length}</h3>
                        <ul className="text-sm text-gray-500 mt-1">
                          {order.items.slice(0, 3).map((item, index) => (
                            <li key={index}>
                              {item.quantity}x {item.title}
                            </li>
                          ))}
                          {order.items.length > 3 && <li className="italic">+ {order.items.length - 3} mais itens</li>}
                        </ul>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Total:</div>
                        <div className="font-bold text-green-600">R$ {order.total.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">
                          Pagamento:{" "}
                          {order.paymentMethod === "dinheiro"
                            ? "Dinheiro"
                            : order.paymentMethod === "cartao"
                              ? "Cartão"
                              : "PIX"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border">
              <div className="flex flex-col items-center">
                {statusFilter === "completed" ? (
                  <>
                    <CheckCircle className="h-12 w-12 text-gray-300 mb-2" />
                    <h3 className="text-lg font-medium text-gray-500">Nenhum pedido concluído</h3>
                  </>
                ) : statusFilter === "cancelled" ? (
                  <>
                    <XCircle className="h-12 w-12 text-gray-300 mb-2" />
                    <h3 className="text-lg font-medium text-gray-500">Nenhum pedido cancelado</h3>
                  </>
                ) : statusFilter === "active" ? (
                  <>
                    <Clock className="h-12 w-12 text-gray-300 mb-2" />
                    <h3 className="text-lg font-medium text-gray-500">Nenhum pedido ativo</h3>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-12 w-12 text-gray-300 mb-2" />
                    <h3 className="text-lg font-medium text-gray-500">Nenhum pedido encontrado</h3>
                  </>
                )}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

