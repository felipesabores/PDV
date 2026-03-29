"use client"

import { Card } from "@/components/ui/card"
import { useMobile } from "@/contexts/mobile-context"

interface FoodCardProps {
  id: number
  image: string
  title: string
  price: number
  discount?: number
  type: string
  description: string
  onClick?: () => void
}

export function FoodCard({ image, title, price, discount, type, onClick }: FoodCardProps) {
  const { isMobile } = useMobile()

  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <div className={`relative ${isMobile ? "h-32" : "h-40"} bg-gray-50 flex items-center justify-center`}>
        <img src={image || "/placeholder.svg"} alt={title} className="max-h-full max-w-full object-contain p-2" />
        {discount && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded-md text-xs font-medium">
            {discount}% Off
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className={`${isMobile ? "text-xs" : "text-sm"} font-medium mb-1`}>{title}</h3>
        <div className="flex justify-between items-center">
          <span className="text-green-600 font-bold">{isMobile ? "R$" : "R$ "}{price.toFixed(2)}</span>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">{type}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
