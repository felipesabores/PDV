"use client"

import { useState, useEffect } from "react"
import { usePOS, type OrderType } from "@/contexts/pos-context"
import { useMobile } from "@/contexts/mobile-context"
import { SidebarNav } from "./sidebar-nav"
import { Header } from "./header"
import { CategoryFilter } from "./category-filter"
import { FoodGrid } from "./food-grid"
import { Cart } from "./cart"
import { Footer } from "./footer"
import { OrderTickets } from "./order-tickets"
import { KitchenView } from "./kitchen-view"
import { OrdersView } from "./orders-view"
import { DashboardView } from "./dashboard-view"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShoppingCart } from 'lucide-react'
import { Sheet, SheetContent } from "@/components/ui/sheet"

export function POSMain() {
  const { customerName, setCustomerName, activeOrders, currentOrderId, resetCurrentOrder, currentView, cartItems } =
    usePOS()
  const { isMobile, isTablet } = useMobile()

  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(!customerName)
  const [tempCustomerName, setTempCustomerName] = useState("")
  const [currentOrder, setCurrentOrder] = useState<OrderType | null>(null)
  const [isTicketsOpen, setIsTicketsOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Garantir que o body tenha pointer-events quando o componente for montado
  useEffect(() => {
    document.body.style.pointerEvents = ""

    return () => {
      document.body.style.pointerEvents = ""
    }
  }, [])

  // Verificar se há um pedido atual para mostrar os tickets
  useEffect(() => {
    if (currentOrderId) {
      const order = activeOrders.find((o) => o.id === currentOrderId)
      if (order) {
        setCurrentOrder(order)
        setIsTicketsOpen(true)
      }
    } else {
      setIsTicketsOpen(false)
    }
  }, [currentOrderId, activeOrders])

  // Fechar os tickets e resetar o pedido atual
  const handleCloseTickets = () => {
    setIsTicketsOpen(false)
    resetCurrentOrder()
    // Restaurar pointer-events
    document.body.style.pointerEvents = ""
  }

  // Confirmar o nome do cliente
  const handleConfirmCustomer = () => {
    setCustomerName(tempCustomerName || "Cliente Balcão")
    setIsCustomerDialogOpen(false)
    // Restaurar pointer-events
    document.body.style.pointerEvents = ""
  }

  // Renderizar o conteúdo principal com base na visualização atual
  const renderMainContent = () => {
    switch (currentView) {
      case "menu":
        return (
          <>
            <main className="flex-1 overflow-auto p-4">
              <CategoryFilter />
              <FoodGrid />
            </main>
            {!isMobile && !isTablet && <Cart />}
          </>
        )
      case "kitchen":
        return (
          <main className="flex-1 overflow-auto">
            <KitchenView />
          </main>
        )
      case "orders":
        return (
          <main className="flex-1 overflow-auto">
            <OrdersView />
          </main>
        )
      case "dashboard":
        return (
          <main className="flex-1 overflow-auto">
            <DashboardView />
          </main>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Menu lateral apenas para desktop */}
      {!isMobile && !isTablet && <SidebarNav />}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 flex overflow-hidden">{renderMainContent()}</div>
        <Footer orders={activeOrders} />
      </div>

      {/* Botão flutuante do carrinho para mobile/tablet */}
      {(isMobile || isTablet) && currentView === "menu" && (
        <Button
          size="icon"
          className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg bg-green-600 hover:bg-green-700 z-10"
          onClick={() => setIsCartOpen(true)}
        >
          <ShoppingCart className="h-6 w-6" />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold border-2 border-green-600">
              {cartItems.reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}
        </Button>
      )}

      {/* Carrinho como drawer para mobile/tablet */}
      {(isMobile || isTablet) && (
        <Sheet
          open={isCartOpen}
          onOpenChange={(open) => {
            setIsCartOpen(open)
            if (!open) document.body.style.pointerEvents = ""
          }}
        >
          <SheetContent side="right" className="p-0 w-full sm:w-96">
            <Cart
              onClose={() => {
                setIsCartOpen(false)
                document.body.style.pointerEvents = ""
              }}
            />
          </SheetContent>
        </Sheet>
      )}

      {/* Diálogo para informar o nome do cliente */}
      <Dialog
        open={isCustomerDialogOpen}
        onOpenChange={(open) => {
          setIsCustomerDialogOpen(open)
          if (!open) document.body.style.pointerEvents = ""
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Atendimento de Balcão</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Nome do Cliente (opcional)</Label>
              <Input
                id="customerName"
                placeholder="Digite o nome do cliente (opcional)"
                value={tempCustomerName}
                onChange={(e) => setTempCustomerName(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleConfirmCustomer}>Iniciar Atendimento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tickets do pedido */}
      {currentOrder && <OrderTickets order={currentOrder} isOpen={isTicketsOpen} onClose={handleCloseTickets} />}
    </div>
  )
}
