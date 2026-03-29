"use client"

import { usePOS } from "@/contexts/pos-context"
import { TableSelection } from "./table-selection"
import { POSMain } from "./pos-main"

export function POSApp() {
  const { currentTable, customerName, setTableAndCustomer } = usePOS()

  // Se nenhuma mesa/balcão foi selecionada, mostrar a tela de seleção
  if (currentTable === null) {
    return (
      <TableSelection
        onSelectTable={(tableNumber, name) => {
          setTableAndCustomer(tableNumber, name)
        }}
      />
    )
  }

  // Se uma mesa ou balcão foi selecionado, mostrar a tela principal do PDV
  return <POSMain />
}


