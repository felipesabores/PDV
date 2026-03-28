import { sql } from "@vercel/postgres"
import { drizzle } from "drizzle-orm/vercel-postgres"
import { pgTable, serial, text, timestamp, integer, decimal, json } from "drizzle-orm/pg-core"

// Definir o esquema das tabelas
export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  orderNumber: integer("order_number").notNull(),
  customerName: text("customer_name").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(),
  items: json("items").notNull(),
})

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
})

// Inicializar o cliente Drizzle
export const db = drizzle(sql)

// Funções de acesso ao banco de dados
export async function getOrders() {
  try {
    const result = await db.select().from(orders)
    return result.map((order) => ({
      ...order,
      items: order.items as any,
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt),
      total: Number(order.total),
    }))
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error)
    return []
  }
}

export async function createOrder(orderData: any) {
  try {
    const result = await db.insert(orders).values(orderData).returning()
    return result[0]
  } catch (error) {
    console.error("Erro ao criar pedido:", error)
    throw error
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await db
      .update(orders)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(sql`${orders.id} = ${orderId}`)
    return true
  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error)
    return false
  }
}

export async function getSetting(key: string) {
  try {
    const result = await db.select().from(settings).where(sql`${settings.key} = ${key}`)
    return result[0]?.value
  } catch (error) {
    console.error(`Erro ao buscar configuração ${key}:`, error)
    return null
  }
}

export async function setSetting(key: string, value: string) {
  try {
    // Verificar se a configuração já existe
    const existing = await db.select().from(settings).where(sql`${settings.key} = ${key}`)

    if (existing.length > 0) {
      // Atualizar configuração existente
      await db.update(settings).set({ value }).where(sql`${settings.key} = ${key}`)
    } else {
      // Criar nova configuração
      await db.insert(settings).values({ key, value })
    }
    return true
  } catch (error) {
    console.error(`Erro ao salvar configuração ${key}:`, error)
    return false
  }
}

// Função para inicializar o banco de dados (criar tabelas)
export async function initializeDatabase() {
  try {
    // Verificar se as tabelas existem e criá-las se necessário
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        order_number INTEGER NOT NULL,
        customer_name TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        total DECIMAL(10,2) NOT NULL,
        payment_method TEXT NOT NULL,
        items JSONB NOT NULL
      );
    `

    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL
      );
    `

    // Inicializar configurações padrão se não existirem
    const lastOrderNumber = await getSetting("lastOrderNumber")
    if (lastOrderNumber === null) {
      await setSetting("lastOrderNumber", "0")
    }

    console.log("Banco de dados inicializado com sucesso")
    return true
  } catch (error) {
    console.error("Erro ao inicializar banco de dados:", error)
    return false
  }
}

