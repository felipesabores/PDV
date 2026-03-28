"use client"

import { useState } from "react"
import { usePOS } from "@/contexts/pos-context"
import { useMobile } from "@/contexts/mobile-context"
import { FoodCard } from "./food-card"
import { ProductModal } from "./product-modal"

const FALLBACK_IMAGE =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/istockphoto-1409473768-612x612.jpg-COEb7eWLFXRJ2R2E2hHTauaPJ02OXV.jpeg"

export const foodItems = [
  {
    id: 1,
    image: FALLBACK_IMAGE,
    title: "Coxinha de Frango",
    price: 5.99,
    discount: 10,
    type: "Fritos",
    description: "Deliciosa coxinha de frango com massa crocante e recheio cremoso.",
  },
  {
    id: 2,
    image: FALLBACK_IMAGE,
    title: "Pastel de Carne",
    price: 6.5,
    type: "Fritos",
    description: "Pastel crocante recheado com carne moída temperada.",
  },
  {
    id: 3,
    image: FALLBACK_IMAGE,
    title: "Kibe",
    price: 4.99,
    type: "Fritos",
    description: "Kibe tradicional com recheio de carne moída e trigo.",
  },
  {
    id: 4,
    image: FALLBACK_IMAGE,
    title: "Empada de Frango",
    price: 7.99,
    type: "Assados",
    description: "Empada de massa amanteigada com recheio de frango desfiado.",
  },
  {
    id: 5,
    image: FALLBACK_IMAGE,
    title: "Esfiha de Carne",
    price: 5.49,
    discount: 15,
    type: "Assados",
    description: "Esfiha aberta com recheio de carne moída temperada com especiarias.",
  },
  {
    id: 6,
    image: FALLBACK_IMAGE,
    title: "Bolinha de Queijo",
    price: 4.59,
    type: "Fritos",
    description: "Salgadinho frito com massa crocante e recheio de queijo derretido.",
  },
  {
    id: 7,
    image: FALLBACK_IMAGE,
    title: "Croissant de Presunto e Queijo",
    price: 8.99,
    type: "Folhados",
    description: "Croissant folhado recheado com presunto e queijo.",
  },
  {
    id: 8,
    image: FALLBACK_IMAGE,
    title: "Brigadeiro Gourmet",
    price: 3.99,
    type: "Doces",
    description: "Brigadeiro gourmet com chocolate belga e granulado.",
  },
  {
    id: 9,
    image: FALLBACK_IMAGE,
    title: "Combo Festa",
    price: 29.99,
    type: "Combos",
    description: "10 salgados variados + 5 doces + 1 refrigerante.",
  },
]

export function FoodGrid() {
  const { currentCategory } = usePOS()
  const { isMobile } = useMobile()
  const [selectedProduct, setSelectedProduct] = useState<(typeof foodItems)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleProductClick = (product: (typeof foodItems)[0]) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  // Filtrar os produtos pela categoria selecionada
  const filteredItems =
    currentCategory === "Todos" ? foodItems : foodItems.filter((item) => item.type === currentCategory)

  return (
    <>
      <div className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"} gap-4`}>
        {filteredItems.map((item) => (
          <FoodCard key={item.id} {...item} onClick={() => handleProductClick(item)} />
        ))}
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  )
}

