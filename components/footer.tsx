"use client"

import type { OrderType } from "@/contexts/pos-context"

interface FooterProps {
  orders: OrderType[]
}

export function Footer({ orders }: FooterProps) {
  // Filtrar apenas pedidos ativos
  const activeOrders = orders.filter((order) => order.status === "active" || order.status === "preparing")

  // Limitar a 3 pedidos para exibição
  const displayOrders = activeOrders.slice(0, 3)

  return (
    <div className="bg-white border-t p-4 flex gap-4">
      {displayOrders.length > 0 ? (
        displayOrders.map((order) => (
          <div key={order.id} className="flex items-center gap-3 bg-orange-50 rounded-lg p-3 flex-1">
            <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center text-white font-medium">
              {order.orderNumber}
            </div>
            <div>
              <div className="text-sm font-medium">{order.items.length} Itens → Cozinha</div>
              {order.status === "preparing" && <div className="text-xs text-orange-600">Em preparo</div>}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500 w-full">Nenhum pedido em andamento</div>
      )}
    </div>
  )
}

