"use client"

import { useState } from "react"
import { usePOS } from "@/contexts/pos-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Minus, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProductModalProps {
  product: {
    id: number
    title: string
    price: number
    image: string
    description: string
    type: string
    discount?: number
  }
  isOpen: boolean
  onClose: () => void
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [observation, setObservation] = useState("")
  const { toast } = useToast()
  const { addToCart } = usePOS()

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1)
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handleAddToCart = () => {
    // Adicionar ao carrinho usando o contexto
    addToCart(product, quantity, observation)

    // Exibir toast de confirmação
    toast({
      title: "Produto adicionado",
      description: `${quantity}x ${product.title} adicionado ao pedido`,
    })

    // Fechar o modal
    onClose()

    // Resetar estado
    setQuantity(1)
    setObservation("")
  }

  const finalPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{product.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="h-48 bg-gray-50 flex items-center justify-center rounded-md">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              className="max-h-full max-w-full object-contain p-2"
            />
          </div>

          <p className="text-sm text-gray-700">{product.description}</p>

          <div className="flex justify-between items-center">
            <div className="font-medium">
              Tipo: <span className="text-gray-600">{product.type}</span>
            </div>
            <div className="text-lg font-bold text-green-600">
              R$ {finalPrice.toFixed(2)}
              {product.discount && (
                <span className="text-xs text-gray-500 line-through ml-2">R$ {product.price.toFixed(2)}</span>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="observation" className="block text-sm font-medium mb-1">
              Observações
            </label>
            <Textarea
              id="observation"
              placeholder="Ex: Sem cebola, mais crocante, etc."
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              className="resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">Quantidade:</span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-8 w-8"
                onClick={handleDecrement}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-medium w-8 text-center">{quantity}</span>
              <Button variant="outline" size="icon" className="rounded-full h-8 w-8" onClick={handleIncrement}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center font-bold">
            <span>Total:</span>
            <span className="text-green-600">R$ {(finalPrice * quantity).toFixed(2)}</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleAddToCart}>Adicionar ao Pedido</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

