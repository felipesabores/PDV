"use client"

import { usePOS, type ViewType } from "@/contexts/pos-context"
import { useMobile } from "@/contexts/mobile-context"
import { Search, ShoppingBag, Menu, ChefHat, CalendarRange, Truck, Calculator, Settings, LogOut, BarChart } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"

const LOGO_URL = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dbUSLLtMvcKp5ixftZw6oxHYF3GfJv.png"

// Definir os itens de navegação
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

export function Header() {
  const { customerName, setCustomerName, currentView, setView } = usePOS()
  const { isMobile, isTablet } = useMobile()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [tempCustomerName, setTempCustomerName] = useState(customerName)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleUpdateCustomer = () => {
    setCustomerName(tempCustomerName || "Cliente Balcão")
    setIsDialogOpen(false)
  }

  return (
    <div className="bg-white p-4 flex items-center gap-4 border-b">
      {/* Menu off-canvas apenas para mobile/tablet */}
      {(isMobile || isTablet) && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="mr-2 flex items-center gap-2"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-4 w-4" />
            <span>Menu</span>
          </Button>

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetContent side="left" className="w-[280px] p-0">
              <div className="p-4 border-b flex items-center gap-2">
                <img
                  src={LOGO_URL || "/placeholder.svg"}
                  alt="Oba Oba Salgados Logo"
                  className="h-8 w-auto object-contain"
                />
                <span className="font-bold">Oba Oba Salgados</span>
              </div>
              <div className="py-2">
                {navItems.map((item, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className={`w-full justify-start px-4 py-3 ${item.color}`}
                    onClick={() => {
                      if (item.view) {
                        setView(item.view)
                        setIsMenuOpen(false)
                      }
                    }}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
                <Button variant="ghost" className="w-full justify-start px-4 py-3 text-gray-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </>
      )}

      {/* Logo para mobile/tablet */}
      {(isMobile || isTablet) && (
        <div className="flex items-center gap-2">
          <img
            src={LOGO_URL || "/placeholder.svg"}
            alt="Oba Oba Salgados Logo"
            className="h-8 w-auto object-contain bg-white p-1 rounded"
          />
        </div>
      )}

      {/* Barra de pesquisa para desktop no modo menu */}
      {currentView === "menu" && !isMobile && !isTablet && (
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input type="text" placeholder="Buscar salgados..." className="pl-10 w-full" />
        </div>
      )}

      {/* Título para desktop em outros modos */}
      {currentView !== "menu" && !isMobile && !isTablet && (
        <div className="flex-1 flex items-center gap-2">
          <img
            src={LOGO_URL || "/placeholder.svg"}
            alt="Oba Oba Salgados Logo"
            className="h-8 w-auto object-contain bg-white p-1 rounded"
          />
          <h1 className="text-lg font-semibold">
            {currentView === "kitchen" ? "Cozinha" : currentView === "orders" ? "Histórico de Pedidos" : ""}
          </h1>
        </div>
      )}

      {/* Informações do cliente */}
      <div
        className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md ml-auto"
        onClick={() => setIsDialogOpen(true)}
      >
        <ShoppingBag className="h-5 w-5 text-green-600" />
        {!isMobile && (
          <div>
            <span className="font-semibold">Balcão</span>
            <span className="text-gray-500 text-sm ml-2">{customerName}</span>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atualizar Cliente</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="updateCustomerName">Nome do Cliente</Label>
              <Input
                id="updateCustomerName"
                placeholder="Digite o nome do cliente"
                value={tempCustomerName}
                onChange={(e) => setTempCustomerName(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateCustomer}>Atualizar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
