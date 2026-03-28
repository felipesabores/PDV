import { NextResponse } from "next/server"
import { getSetting, setSetting } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const key = url.searchParams.get("key")

    if (!key) {
      return NextResponse.json({ error: "Parâmetro key é obrigatório" }, { status: 400 })
    }

    const value = await getSetting(key)
    if (value === null) {
      return NextResponse.json({ error: "Configuração não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ key, value })
  } catch (error) {
    console.error("Erro ao buscar configuração:", error)
    return NextResponse.json({ error: "Erro ao buscar configuração" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { key, value } = await request.json()

    if (!key || value === undefined) {
      return NextResponse.json({ error: "key e value são obrigatórios" }, { status: 400 })
    }

    const success = await setSetting(key, String(value))
    if (success) {
      return NextResponse.json({ key, value })
    } else {
      return NextResponse.json({ error: "Erro ao salvar configuração" }, { status: 500 })
    }
  } catch (error) {
    console.error("Erro ao salvar configuração:", error)
    return NextResponse.json({ error: "Erro ao salvar configuração" }, { status: 500 })
  }
}

