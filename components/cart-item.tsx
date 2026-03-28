"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const FALLBACK_IMAGE =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/istockphoto-1409473768-612x612.jpg-COEb7eWLFXRJ2R2E2hHTauaPJ02OXV.jpeg"

interface CartItemProps {
  id: number
  title: string
  price: number
  quantity: number
  image: string
  observation?: string
  onRemove: (id: number) => void
  onUpdateQuantity: (id: number, newQuantity: number) => void
}

export function CartItem({
  id,
  title,
  price,
  quantity,
  image,
  observation,
  onRemove,
  onUpdateQuantity,
}: CartItemProps) {
  return (
    <div className="flex items-start gap-3 mb-4 relative group">
      <img src={image || FALLBACK_IMAGE} alt={title} className="w-16 h-16 rounded-lg object-cover" />
      <div className="flex-1">
        <h4 className="text-sm font-medium mb-1">{title}</h4>
        {observation && <p className="text-xs text-gray-500 mb-1 italic">"{observation}"</p>}
        <div className="flex justify-between items-center">
          <span className="text-green-600 font-bold">R$ {price.toFixed(2)}</span>
          <div className="flex items-center gap-1">
            <button
              className="text-xs px-2 py-1 rounded hover:bg-gray-100"
              onClick={() => onUpdateQuantity(id, quantity - 1)}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="text-sm">{quantity}x</span>
            <button
              className="text-xs px-2 py-1 rounded hover:bg-gray-100"
              onClick={() => onUpdateQuantity(id, quantity + 1)}
            >
              +
            </button>
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onRemove(id)}
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  )
}

