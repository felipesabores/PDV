"use client"

import { usePOS, type ViewType } from "@/contexts/pos-context"
import { Menu, ShoppingBag, CalendarRange, Truck, Calculator, Settings, LogOut, ChefHat, BarChart } from 'lucide-react'
import { Button } from "@/components/ui/button"

const LOGO_URL = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dbUSLLtMvcKp5ixftZw6oxHYF3GfJv.png"

const navItems = [
  { icon: Menu, label: "Cardápio", color: "text-green-600", view: "menu" as ViewType },
  { icon: ChefHat, label: "Cozinha", color: "text-orange-600", view: "kitchen" as ViewType },
  { icon: ShoppingBag, label: "Pedidos", color: "text-blue-600", view: "orders" as ViewType },
  { icon: BarChart, label: "Dashboard", color: "text-purple-600", view: "dashboard" as ViewType },
  { icon: CalendarRange, label: "Encomendas", color: "text-gray-600" },
  { icon: Truck, label: "Delivery", color: "text-gray-600" },
  { icon: Calculator, label: "Financeiro", color: "text-gray-600" },
  { icon: Settings, label: "Configurações", color: "text-gray-600" },
]

export function SidebarNav() {
  const { currentView, setView } = usePOS()

  return (
    <div className="w-64 p-4 border-r h-screen flex flex-col bg-white">
      <div className="flex items-center justify-center mb-8 bg-white rounded-lg p-2">
        <img src={LOGO_URL || "/placeholder.svg"} alt="Oba Oba Salgados Logo" className="h-10 w-auto object-contain" />
      </div>
      <nav className="space-y-2 flex-1">
        {navItems.map((item, index) => (
          <Button
            key={index}
            variant={currentView === item.view ? "secondary" : "ghost"}
            className={`w-full justify-start ${item.color}`}
            onClick={() => item.view && setView(item.view)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
      <div className="mt-4">
        <Button variant="ghost" className="w-full justify-start text-gray-600">
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  )
}
