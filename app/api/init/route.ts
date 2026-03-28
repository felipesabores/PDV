import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/db"

export async function GET() {
  try {
    const success = await initializeDatabase()
    if (success) {
      return NextResponse.json({ message: "Banco de dados inicializado com sucesso" })
    } else {
      return NextResponse.json({ error: "Erro ao inicializar banco de dados" }, { status: 500 })
    }
  } catch (error) {
    console.error("Erro ao inicializar banco de dados:", error)
    return NextResponse.json({ error: "Erro ao inicializar banco de dados" }, { status: 500 })
  }
}

