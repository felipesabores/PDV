"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { foodItems } from "@/components/food-grid"

// Tipos
export interface CartItemType {
  id: number
  title: string
  price: number
  quantity: number
  image: string
  observation?: string
  type: string
}

export type TableType = number | "balcao"

export type PaymentMethodType = "dinheiro" | "cartao" | "pix"

export interface OrderType {
  id: string
  orderNumber: number
  customerName: string
  items: CartItemType[]
  status: "active" | "preparing" | "completed" | "cancelled"
  createdAt: Date
  updatedAt: Date
  total: number
  paymentMethod: PaymentMethodType
}

export type CategoryType = "Todos" | "Fritos" | "Assados" | "Folhados" | "Doces" | "Combos"

// Atualizar o tipo ViewType para incluir dashboard
export type ViewType = "menu" | "orders" | "kitchen" | "dashboard"

interface POSContextType {
  // Estado atual
  customerName: string
  cartItems: CartItemType[]
  activeOrders: OrderType[]
  lastOrderNumber: number
  currentOrderId: string | null
  currentTable: TableType | null
  currentCategory: CategoryType
  currentView: ViewType

  // Ações
  setCustomerName: (name: string) => void
  addToCart: (product: (typeof foodItems)[0], quantity: number, observation?: string) => void
  updateCartItemQuantity: (id: number, quantity: number) => void
  removeFromCart: (id: number) => void
  clearCart: () => void
  finalizeOrder: (paymentMethod?: PaymentMethodType) => OrderType
  resetCurrentOrder: () => void
  setTableAndCustomer: (tableNumber: TableType, customerName: string) => void
  setCategory: (category: CategoryType) => void
  setView: (view: ViewType) => void
  updateOrderStatus: (orderId: string, status: OrderType["status"]) => void
}

const POSContext = createContext<POSContextType | undefined>(undefined)

export function POSProvider({ children }: { children: ReactNode }) {
  // Estado
  const [customerName, setCustomerName] = useState("")
  const [cartItems, setCartItems] = useState<CartItemType[]>([])
  const [activeOrders, setActiveOrders] = useState<OrderType[]>([])
  const [lastOrderNumber, setLastOrderNumber] = useState(0)
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null)
  const [currentTable, setCurrentTable] = useState<TableType | null>("balcao")
  const [currentCategory, setCurrentCategory] = useState<CategoryType>("Todos")
  const [currentView, setCurrentView] = useState<ViewType>("menu")

  // Ações
  const setCategory = (category: CategoryType) => {
    setCurrentCategory(category)
  }

  const setView = (view: ViewType) => {
    setCurrentView(view)
  }

  const addToCart = (product: (typeof foodItems)[0], quantity: number, observation?: string) => {
    // Calcular preço final considerando desconto
    const finalPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price

    // Verificar se o produto já está no carrinho
    const existingItemIndex = cartItems.findIndex((item) => item.id === product.id)

    if (existingItemIndex >= 0) {
      // Atualizar quantidade se já existir
      const updatedItems = [...cartItems]
      updatedItems[existingItemIndex].quantity += quantity

      // Atualizar observação se fornecida
      if (observation) {
        updatedItems[existingItemIndex].observation = observation
      }

      setCartItems(updatedItems)
    } else {
      // Adicionar novo item
      setCartItems([
        ...cartItems,
        {
          id: product.id,
          title: product.title,
          price: finalPrice,
          quantity,
          image: product.image,
          type: product.type,
          observation,
        },
      ])
    }
  }

  const updateCartItemQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return

    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const finalizeOrder = (paymentMethod: PaymentMethodType = "dinheiro") => {
    if (cartItems.length === 0) {
      throw new Error("Carrinho vazio")
    }

    // Incrementar número do pedido
    const orderNumber = lastOrderNumber + 1
    setLastOrderNumber(orderNumber)

    // Calcular total
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.05 // Incluindo 5% de imposto

    // Criar novo pedido
    const newOrder: OrderType = {
      id: `order-${Date.now()}`,
      orderNumber,
      customerName: customerName || `Cliente #${orderNumber}`,
      items: [...cartItems],
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      total,
      paymentMethod,
    }

    // Adicionar aos pedidos ativos
    setActiveOrders((prev) => [...prev, newOrder])

    // Definir o pedido atual para mostrar o ticket
    setCurrentOrderId(newOrder.id)

    // Limpar carrinho
    clearCart()

    return newOrder
  }

  const resetCurrentOrder = () => {
    setCurrentOrderId(null)
  }

  const setTableAndCustomer = (tableNumber: TableType, customerName: string) => {
    setCurrentTable(tableNumber)
    setCustomerName(customerName)
  }

  const updateOrderStatus = (orderId: string, status: OrderType["status"]) => {
    setActiveOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
              updatedAt: new Date(),
            }
          : order,
      ),
    )
  }

  const value = {
    customerName,
    cartItems,
    activeOrders,
    lastOrderNumber,
    currentOrderId,
    currentTable,
    currentCategory,
    currentView,
    setCustomerName,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    finalizeOrder,
    resetCurrentOrder,
    setTableAndCustomer,
    setCategory,
    setView,
    updateOrderStatus,
  }

  return <POSContext.Provider value={value}>{children}</POSContext.Provider>
}

export function usePOS() {
  const context = useContext(POSContext)
  if (context === undefined) {
    throw new Error("usePOS must be used within a POSProvider")
  }
  return context
}
