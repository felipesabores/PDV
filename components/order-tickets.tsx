"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomerTicket } from "./customer-ticket"
import { KitchenTicket } from "./kitchen-ticket"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { OrderType } from "@/contexts/pos-context"

interface OrderTicketsProps {
  order: OrderType
  isOpen: boolean
  onClose: () => void
}

export function OrderTickets({ order, isOpen, onClose }: OrderTicketsProps) {
  const [activeTab, setActiveTab] = useState("customer")

  // Garantir que o modal seja fechado corretamente
  useEffect(() => {
    if (!isOpen) {
      // Pequeno atraso para garantir que o modal seja fechado corretamente
      const timer = setTimeout(() => {
        document.body.style.pointerEvents = ""
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
        // Restaurar pointer-events quando o modal for fechado
        if (!open) document.body.style.pointerEvents = ""
      }}
    >
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <div className="absolute right-4 top-4">
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                onClose()
                // Restaurar pointer-events quando o botão de fechar for clicado
                document.body.style.pointerEvents = ""
              }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </Button>
          </DialogClose>
        </div>

        <Tabs defaultValue="customer" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customer">Comprovante Cliente</TabsTrigger>
            <TabsTrigger value="kitchen">Comanda Cozinha</TabsTrigger>
          </TabsList>
          <TabsContent value="customer">
            <CustomerTicket order={order} onClose={onClose} />
          </TabsContent>
          <TabsContent value="kitchen">
            <KitchenTicket order={order} onClose={onClose} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

