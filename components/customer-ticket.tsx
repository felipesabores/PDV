"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import type { OrderType } from "@/contexts/pos-context"
import { Printer } from "lucide-react"

const LOGO_URL = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dbUSLLtMvcKp5ixftZw6oxHYF3GfJv.png"

interface CustomerTicketProps {
  order: OrderType
  onClose: () => void
}

export function CustomerTicket({ order, onClose }: CustomerTicketProps) {
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
          <title>Comprovante Cliente - Pedido #${order.orderNumber}</title>
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

  // Calcular subtotal e imposto
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.05 // 5% de imposto

  // Formatar método de pagamento
  const paymentMethodMap = {
    dinheiro: "Dinheiro",
    cartao: "Cartão",
    pix: "PIX",
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Comprovante do Cliente</h2>
        <Button variant="outline" size="icon" onClick={handlePrint}>
          <Printer className="h-4 w-4" />
        </Button>
      </div>

      <div ref={ticketRef} className="ticket-content">
        <div className="header text-center mb-4">
          <div className="bg-white inline-block rounded-md p-1 mb-2">
            <img src={LOGO_URL || "/placeholder.svg"} alt="Oba Oba Salgados Logo" className="w-28" />
          </div>
          <p className="text-sm text-gray-500">CNPJ: 00.000.000/0001-00</p>
          <p className="text-sm text-gray-500">Av. Brasil, 123 - Centro</p>
          <p className="text-sm text-gray-500">Tel: (11) 1234-5678</p>
        </div>

        <div className="order-info mb-4">
          <p className="font-bold">PEDIDO #{order.orderNumber}</p>
          <p>Data: {order.createdAt.toLocaleString()}</p>
          <p>Cliente: {order.customerName}</p>
          <p>Forma de Pagamento: {paymentMethodMap[order.paymentMethod]}</p>
        </div>

        <div className="divider border-t border-dashed border-gray-300 my-4"></div>

        <div className="items mb-4">
          <p className="font-bold mb-2">ITENS:</p>
          {order.items.map((item, index) => (
            <div key={index} className="item mb-2">
              <div className="flex justify-between">
                <span>
                  {item.quantity}x {item.title}
                </span>
                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
              </div>
              {item.observation && <p className="text-xs text-gray-500 italic">Obs: {item.observation}</p>}
            </div>
          ))}
        </div>

        <div className="divider border-t border-dashed border-gray-300 my-4"></div>

        <div className="totals">
          <div className="flex justify-between mb-1">
            <span>Subtotal:</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Imposto (5%):</span>
            <span>R$ {tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>TOTAL:</span>
            <span>R$ {order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="divider border-t border-dashed border-gray-300 my-4"></div>

        <div className="footer text-center text-sm text-gray-500">
          <p>Obrigado pela preferência!</p>
          <p>www.obaobasalgados.com.br</p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={onClose}>Fechar</Button>
      </div>
    </div>
  )
}

