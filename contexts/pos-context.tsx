"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
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
  isLoading: boolean

  // Ações
  setCustomerName: (name: string) => void
  addToCart: (product: (typeof foodItems)[0], quantity: number, observation?: string) => void
  updateCartItemQuantity: (id: number, quantity: number) => void
  removeFromCart: (id: number) => void
  clearCart: () => void
  finalizeOrder: (paymentMethod?: PaymentMethodType) => Promise<OrderType>
  resetCurrentOrder: () => void
  setTableAndCustomer: (tableNumber: TableType, customerName: string) => void
  setCategory: (category: CategoryType) => void
  setView: (view: ViewType) => void
  updateOrderStatus: (orderId: string, status: OrderType["status"]) => Promise<void>
  refreshOrders: () => Promise<void>
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
  const [isLoading, setIsLoading] = useState(true)

  // Inicializar o banco de dados e carregar dados
  useEffect(() => {
    async function initializeApp() {
      try {
        setIsLoading(true)

        // Inicializar o banco de dados
        await fetch("/api/init")

        // Carregar pedidos
        await refreshOrders()

        // Carregar último número de pedido
        const response = await fetch("/api/settings?key=lastOrderNumber")
        if (response.ok) {
          const data = await response.json()
          setLastOrderNumber(Number.parseInt(data.value, 10))
        }

        // Carregar dados do localStorage para manter a sessão atual
        if (typeof window !== "undefined") {
          // Carregar dados da sessão atual do localStorage
          const savedCustomerName = localStorage.getItem("pos_customerName")
          if (savedCustomerName) setCustomerName(savedCustomerName)

          const savedCartItems = localStorage.getItem("pos_cartItems")
          if (savedCartItems) setCartItems(JSON.parse(savedCartItems))

          const savedCurrentTable = localStorage.getItem("pos_currentTable")
          if (savedCurrentTable) {
            setCurrentTable(savedCurrentTable === "balcao" ? "balcao" : Number.parseInt(savedCurrentTable, 10))
          }

          const savedCurrentCategory = localStorage.getItem("pos_currentCategory")
          if (savedCurrentCategory) setCurrentCategory(savedCurrentCategory as CategoryType)

          const savedCurrentView = localStorage.getItem("pos_currentView")
          if (savedCurrentView) setCurrentView(savedCurrentView as ViewType)
        }
      } catch (error) {
        console.error("Erro ao inicializar aplicação:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [])

  // Manter alguns dados na sessão atual usando localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pos_customerName", customerName)
    }
  }, [customerName])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pos_cartItems", JSON.stringify(cartItems))
    }
  }, [cartItems])

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (currentTable) {
        localStorage.setItem("pos_currentTable", currentTable.toString())
      }
    }
  }, [currentTable])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pos_currentCategory", currentCategory)
    }
  }, [currentCategory])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pos_currentView", currentView)
    }
  }, [currentView])

  // Função para atualizar a lista de pedidos do banco de dados
  const refreshOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      if (response.ok) {
        const orders = await response.json()
        // Converter strings de data para objetos Date
        const formattedOrders = orders.map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt),
          updatedAt: new Date(order.updatedAt),
        }))
        setActiveOrders(formattedOrders)
      }
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error)
    }
  }

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

  const finalizeOrder = async (paymentMethod: PaymentMethodType = "dinheiro") => {
    if (cartItems.length === 0) {
      throw new Error("Carrinho vazio")
    }

    try {
      // Incrementar número do pedido
      const newOrderNumber = lastOrderNumber + 1

      // Calcular total
      const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.05 // Incluindo 5% de imposto

      // Criar novo pedido
      const newOrder: OrderType = {
        id: `order-${Date.now()}`,
        orderNumber: newOrderNumber,
        customerName: customerName || `Cliente #${newOrderNumber}`,
        items: [...cartItems],
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        total,
        paymentMethod,
      }

      // Salvar o pedido no banco de dados
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrder),
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar pedido")
      }

      // Atualizar o último número de pedido no banco de dados
      await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: "lastOrderNumber", value: newOrderNumber.toString() }),
      })

      // Atualizar estado local
      setLastOrderNumber(newOrderNumber)
      setActiveOrders((prev) => [...prev, newOrder])
      setCurrentOrderId(newOrder.id)
      clearCart()

      return newOrder
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error)
      throw error
    }
  }

  const resetCurrentOrder = () => {
    setCurrentOrderId(null)
  }

  const setTableAndCustomer = (tableNumber: TableType, customerName: string) => {
    setCurrentTable(tableNumber)
    setCustomerName(customerName)
  }

  const updateOrderStatus = async (orderId: string, status: OrderType["status"]) => {
    try {
      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: orderId, status }),
      })

      if (!response.ok) {
        throw new Error("Erro ao atualizar status do pedido")
      }

      // Atualizar estado local
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
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error)
      throw error
    }
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
    isLoading,
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
    refreshOrders,
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

