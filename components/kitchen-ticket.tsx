"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import type { OrderType } from "@/contexts/pos-context"
import { Printer } from "lucide-react"

const LOGO_URL = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dbUSLLtMvcKp5ixftZw6oxHYF3GfJv.png"

interface KitchenTicketProps {
  order: OrderType
  onClose: () => void
}

export function KitchenTicket({ order, onClose }: KitchenTicketProps) {
  const ticketRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    const content = ticketRef.current
    if (!content) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const printDocument = printWindow.document
    printDocument.write(`
      <html>
        <head>
          <title>Comanda Cozinha - Pedido #${order.orderNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; width: 300px; background-color: white; }
            .header { text-align: center; margin-bottom: 20px; }
            .logo-container { background-color: white; padding: 5px; display: inline-block; border-radius: 5px; }
            .logo { width: 120px; height: auto; }
            .divider { border-top: 1px dashed #ccc; margin: 10px 0; }
            .item { margin-bottom: 8px; }
            .total { font-weight: bold; margin-top: 10px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `)
    printDocument.close()
    printWindow.print()
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Comanda para Cozinha</h2>
        <Button variant="outline" size="icon" onClick={handlePrint}>
          <Printer className="h-4 w-4" />
        </Button>
      </div>

      <div ref={ticketRef} className="ticket-content">
        <div className="header text-center mb-4">
          <div className="bg-white inline-block rounded-md p-1 mb-2">
            <img src={LOGO_URL || "/placeholder.svg"} alt="Oba Oba Salgados Logo" className="w-28" />
          </div>
          <h3 className="text-xl font-bold">COMANDA COZINHA</h3>
          <p className="text-lg font-bold">PEDIDO #{order.orderNumber}</p>
          <p>Data: {order.createdAt.toLocaleString()}</p>
        </div>

        <div className="divider border-t border-dashed border-gray-300 my-4"></div>

        <div className="items mb-4">
          <p className="font-bold mb-2 text-lg">PREPARAR:</p>
          {order.items.map((item, index) => (
            <div key={index} className="item mb-4 pb-2 border-b">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2 font-bold">
                  {item.quantity}x
                </div>
                <span className="text-lg font-medium">{item.title}</span>
              </div>
              {item.observation && <p className="text-sm text-gray-700 mt-1 ml-10 italic">Obs: {item.observation}</p>}
            </div>
          ))}
        </div>

        <div className="divider border-t border-dashed border-gray-300 my-4"></div>

        <div className="footer text-center">
          <p className="font-bold">Cliente: {order.customerName}</p>
          <p className="text-sm text-gray-500 mt-2">Balcão</p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={onClose}>Fechar</Button>
      </div>
    </div>
  )
}

