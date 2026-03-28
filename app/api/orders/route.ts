import { NextResponse } from "next/server"
import { getOrders, createOrder, updateOrderStatus } from "@/lib/db"

export async function GET() {
  try {
    const orders = await getOrders()
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error)
    return NextResponse.json({ error: "Erro ao buscar pedidos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const orderData = await request.json()
    const newOrder = await createOrder(orderData)
    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar pedido:", error)
    return NextResponse.json({ error: "Erro ao criar pedido" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json()
    if (!id || !status) {
      return NextResponse.json({ error: "ID e status são obrigatórios" }, { status: 400 })
    }

    const success = await updateOrderStatus(id, status)
    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 })
    }
  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error)
    return NextResponse.json({ error: "Erro ao atualizar status do pedido" }, { status: 500 })
  }
}

