"use client"

import { useEffect, useState } from "react"
import { usePOS } from "@/contexts/pos-context"
import { Button } from "@/components/ui/button"
import { CreditCard, QrCode, Banknote, User, Check, X } from 'lucide-react'
import { CartItem } from "./cart-item"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface CartProps {
  onClose?: () => void;
}

export function Cart({ onClose }: CartProps) {
  const { customerName, cartItems, updateCartItemQuantity, removeFromCart, finalizeOrder } = usePOS()

  const { toast } = useToast()
  const [subtotal, setSubtotal] = useState(0)
  const [tax, setTax] = useState(0)
  const [total, setTotal] = useState(0)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("dinheiro")

  // Recalcula os totais quando os itens do carrinho mudam
  useEffect(() => {
    const newSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const newTax = newSubtotal * 0.05 // 5% de imposto
    const newTotal = newSubtotal + newTax

    setSubtotal(newSubtotal)
    setTax(newTax)
    setTotal(newTotal)
  }, [cartItems])

  // Garantir que o body tenha pointer-events quando o componente for desmontado
  useEffect(() => {
    return () => {
      document.body.style.pointerEvents = ""
    }
  }, [])

  const handleOpenConfirmDialog = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione itens ao carrinho antes de finalizar o pedido",
        variant: "destructive",
      })
      return
    }

    setIsConfirmDialogOpen(true)
  }

  const handleFinalizeOrder = () => {
    try {
      finalizeOrder()
      setIsConfirmDialogOpen(false)
      
      // Fechar o Sheet do carrinho se estiver em mobile
      if (onClose) {
        onClose()
      }
      
      // Restaurar pointer-events
      document.body.style.pointerEvents = ""
      
      toast({
        title: "Pedido finalizado",
        description: "Os tickets foram gerados com sucesso!",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao finalizar o pedido",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <div className="w-[380px] bg-white border-l flex flex-col h-full">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-5 w-5 text-gray-500" />
            <span className="font-medium">Cliente: {customerName}</span>
          </div>
          <div className="flex gap-2 mb-2">
            <Button variant="secondary" className="flex-1 rounded-full">
              No Local
            </Button>
            <Button variant="outline" className="flex-1 rounded-full">
              Para Viagem
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <CartItem key={item.id} {...item} onRemove={removeFromCart} onUpdateQuantity={updateCartItemQuantity} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">Nenhum item adicionado ao pedido</div>
          )}
        </div>
        <div className="border-t p-4">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Imposto 5%</span>
              <span>R$ {tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Valor Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <Button
              variant={paymentMethod === "dinheiro" ? "secondary" : "outline"}
              className="flex flex-col items-center py-2"
              onClick={() => setPaymentMethod("dinheiro")}
            >
              <Banknote className="h-5 w-5 mb-1" />
              <span className="text-xs">Dinheiro</span>
            </Button>
            <Button
              variant={paymentMethod === "cartao" ? "secondary" : "outline"}
              className="flex flex-col items-center py-2"
              onClick={() => setPaymentMethod("cartao")}
            >
              <CreditCard className="h-5 w-5 mb-1" />
              <span className="text-xs">Cartão</span>
            </Button>
            <Button
              variant={paymentMethod === "pix" ? "secondary" : "outline"}
              className="flex flex-col items-center py-2"
              onClick={() => setPaymentMethod("pix")}
            >
              <QrCode className="h-5 w-5 mb-1" />
              <span className="text-xs">PIX</span>
            </Button>
          </div>
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
            onClick={handleOpenConfirmDialog}
            disabled={cartItems.length === 0}
          >
            Revisar Pedido
          </Button>
        </div>
      </div>

      {/* Diálogo de confirmação do pedido */}
      <Dialog 
        open={isConfirmDialogOpen} 
        onOpenChange={(open) => {
          setIsConfirmDialogOpen(open)
          if (!open) document.body.style.pointerEvents = ""
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Pedido</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <h3 className="font-medium mb-2">Resumo do Pedido</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <span className="font-medium">{item.quantity}x</span> {item.title}
                      {item.observation && <p className="text-xs text-gray-500 italic">Obs: {item.observation}</p>}
                    </div>
                    <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Imposto (5%)</span>
                <span>R$ {tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Informações do Cliente</h3>
              <div className="text-sm">
                <p>
                  <span className="font-medium">Nome:</span> {customerName}
                </p>
                <p>
                  <span className="font-medium">Tipo:</span> Balcão
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Forma de Pagamento</h3>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dinheiro" id="dinheiro" />
                  <Label htmlFor="dinheiro">Dinheiro</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cartao" id="cartao" />
                  <Label htmlFor="cartao">Cartão</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pix" id="pix" />
                  <Label htmlFor="pix">PIX</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <DialogClose asChild>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsConfirmDialogOpen(false)
                  document.body.style.pointerEvents = ""
                }}
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            </DialogClose>
            <Button onClick={handleFinalizeOrder} className="bg-green-600 hover:bg-green-700">
              <Check className="mr-2 h-4 w-4" />
              Confirmar e Enviar para Cozinha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
