"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShoppingBag } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { TableType } from "@/contexts/pos-context"

interface TableSelectionProps {
  onSelectTable: (tableNumber: TableType, customerName: string) => void
}

export function TableSelection({ onSelectTable }: TableSelectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTable, setSelectedTable] = useState<TableType | null>(null)
  const [customerName, setCustomerName] = useState("")
  const [isBalcao, setIsBalcao] = useState(false)

  // Array com 10 mesas
  const tables = Array.from({ length: 10 }, (_, i) => i + 1)

  const handleTableClick = (tableNumber: number) => {
    // Abrimos o diálogo para informar o nome do cliente
    setSelectedTable(tableNumber)
    setCustomerName("")
    setIsBalcao(false)
    setIsDialogOpen(true)
  }

  const handleBalcaoClick = () => {
    setSelectedTable("balcao")
    setCustomerName("")
    setIsBalcao(true)
    setIsDialogOpen(true)
  }

  const handleConfirm = () => {
    if (selectedTable) {
      // Se for balcão sem nome do cliente, usamos "Cliente Balcão"
      const name = isBalcao && !customerName.trim() ? "Cliente Balcão" : customerName
      onSelectTable(selectedTable, name)
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img
              src="https://images.unsplash.com/photo-1628863353691-0071c8c1874c?q=80&w=48&auto=format&fit=crop"
              alt="Oba Oba Salgados Logo"
              className="w-12 h-12 rounded-full"
            />
            <h1 className="text-3xl font-bold">OBA OBA SALGADOS</h1>
          </div>
          <p className="text-xl text-gray-600">Selecione uma mesa, abra uma nova comanda ou atenda no balcão</p>
        </header>

        {/* Opção de Balcão */}
        <div className="mb-8">
          <Card
            className="p-6 text-center cursor-pointer hover:shadow-md transition-shadow bg-green-50 border-green-200 max-w-md mx-auto"
            onClick={handleBalcaoClick}
          >
            <div className="flex flex-col items-center">
              <ShoppingBag className="h-16 w-16 text-green-600 mb-2" />
              <div className="text-3xl font-bold mb-2 text-green-600">Atendimento de Balcão</div>
              <div className="text-sm text-gray-500">Para pedidos rápidos sem alocação de mesa</div>
            </div>
          </Card>
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-center">Mesas Disponíveis</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {tables.map((tableNumber) => (
            <Card
              key={tableNumber}
              className="p-6 text-center cursor-pointer hover:shadow-md transition-shadow bg-white"
              onClick={() => handleTableClick(tableNumber)}
            >
              <div className="text-3xl font-bold mb-2 text-green-600">Mesa {tableNumber}</div>
              <div className="text-sm text-gray-500">Disponível</div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isBalcao ? "Novo Atendimento de Balcão" : `Nova Comanda - Mesa ${selectedTable}`}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">{isBalcao ? "Nome do Cliente (opcional)" : "Nome do Cliente"}</Label>
              <Input
                id="customerName"
                placeholder={isBalcao ? "Digite o nome do cliente (opcional)" : "Digite o nome do cliente"}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm} disabled={!isBalcao && !customerName.trim()}>
              {isBalcao ? "Iniciar Atendimento" : "Abrir Comanda"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

