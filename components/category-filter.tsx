"use client"

import { usePOS, type CategoryType } from "@/contexts/pos-context"
import { useMobile } from "@/contexts/mobile-context"
import { Grid, Coffee, Pizza, Sandwich, Cake, UtensilsCrossed } from 'lucide-react'

const categories = [
  { icon: Grid, label: "Todos" as CategoryType, items: "24 Itens" },
  { icon: Coffee, label: "Fritos" as CategoryType, items: "8 Itens" },
  { icon: Pizza, label: "Assados" as CategoryType, items: "6 Itens" },
  { icon: Sandwich, label: "Folhados" as CategoryType, items: "4 Itens" },
  { icon: Cake, label: "Doces" as CategoryType, items: "3 Itens" },
  { icon: UtensilsCrossed, label: "Combos" as CategoryType, items: "3 Itens" },
]

export function CategoryFilter() {
  const { currentCategory, setCategory } = usePOS()
  const { isMobile } = useMobile()

  return (
    <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
      {categories.map((category, index) => (
        <div
          key={index}
          className={`flex flex-col items-center p-3 rounded-xl min-w-[100px] ${
            currentCategory === category.label ? "bg-green-50 text-green-600" : "bg-white"
          } border cursor-pointer hover:bg-green-50`}
          onClick={() => setCategory(category.label)}
        >
          <category.icon className={`${isMobile ? "h-5 w-5" : "h-6 w-6"} mb-1`} />
          <span className="text-sm font-medium">{category.label}</span>
          {!isMobile && <span className="text-xs text-gray-500">{category.items}</span>}
        </div>
      ))}
    </div>
  )
}
