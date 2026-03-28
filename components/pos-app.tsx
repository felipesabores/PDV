"use client"

import { usePOS } from "@/contexts/pos-context"
import { TableSelection } from "./table-selection"
import { POSMain } from "./pos-main"
import { LoadingScreen } from "./loading-screen"

export function POSApp() {
  const { currentTable, customerName, setTableAndCustomer, isLoading } = usePOS()

  // Mostrar tela de carregamento enquanto os dados estão sendo carregados
  if (isLoading) {
    return <LoadingScreen />
  }

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

