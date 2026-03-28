"use client"

import type * as React from "react"
import { usePOS, type OrderType, type PaymentMethodType } from "@/contexts/pos-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  DollarSign,
  ShoppingBag,
  CreditCard,
  Banknote,
  QrCode,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { useMemo, useState } from "react"

// Componente para mostrar estatísticas em cards
interface StatCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend?: "up" | "down" | "neutral"
  trendValue?: string
}

function StatCard({ title, value, description, icon, trend, trendValue }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && trendValue && (
          <div
            className={`flex items-center mt-1 text-xs ${
              trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500"
            }`}
          >
            {trend === "up" ? (
              <ArrowUpRight className="h-3 w-3 mr-1" />
            ) : trend === "down" ? (
              <ArrowDownRight className="h-3 w-3 mr-1" />
            ) : null}
            {trendValue}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Componente para mostrar gráfico de barras simples
interface BarChartProps {
  data: { label: string; value: number; color: string }[]
  maxValue: number
}

function SimpleBarChart({ data, maxValue }: BarChartProps) {
  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span>{item.label}</span>
            <span className="font-medium">R$ {item.value.toFixed(2)}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${(item.value / maxValue) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

// Componente para mostrar a distribuição de métodos de pagamento
interface PaymentMethodDistributionProps {
  orders: OrderType[]
}

function PaymentMethodDistribution({ orders }: PaymentMethodDistributionProps) {
  // Calcular a distribuição de métodos de pagamento
  const paymentMethods = useMemo(() => {
    const methods: Record<PaymentMethodType, number> = {
      dinheiro: 0,
      cartao: 0,
      pix: 0,
    }

    orders.forEach((order) => {
      methods[order.paymentMethod]++
    })

    return [
      {
        method: "dinheiro",
        count: methods.dinheiro,
        percentage: orders.length ? (methods.dinheiro / orders.length) * 100 : 0,
        icon: <Banknote className="h-4 w-4" />,
        color: "bg-green-500",
      },
      {
        method: "cartao",
        count: methods.cartao,
        percentage: orders.length ? (methods.cartao / orders.length) * 100 : 0,
        icon: <CreditCard className="h-4 w-4" />,
        color: "bg-blue-500",
      },
      {
        method: "pix",
        count: methods.pix,
        percentage: orders.length ? (methods.pix / orders.length) * 100 : 0,
        icon: <QrCode className="h-4 w-4" />,
        color: "bg-purple-500",
      },
    ]
  }, [orders])

  return (
    <div className="space-y-4">
      {paymentMethods.map((method, index) => (
        <div key={index} className="flex items-center">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center mr-3 text-white"
            style={{
              backgroundColor:
                method.color === "bg-green-500"
                  ? "#22c55e"
                  : method.color === "bg-blue-500"
                    ? "#3b82f6"
                    : method.color === "bg-purple-500"
                      ? "#a855f7"
                      : "#6b7280",
            }}
          >
            {method.icon}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium capitalize">{method.method}</span>
              <span>{method.count} pedidos</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div className={`h-2 rounded-full ${method.color}`} style={{ width: `${method.percentage}%` }} />
            </div>
          </div>
          <span className="ml-3 font-medium">{method.percentage.toFixed(0)}%</span>
        </div>
      ))}
    </div>
  )
}

// Componente para mostrar os produtos mais vendidos
interface TopProductsProps {
  orders: OrderType[]
}

function TopProducts({ orders }: TopProductsProps) {
  // Calcular os produtos mais vendidos
  const topProducts = useMemo(() => {
    const products: Record<string, { title: string; count: number; revenue: number }> = {}

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!products[item.title]) {
          products[item.title] = { title: item.title, count: 0, revenue: 0 }
        }
        products[item.title].count += item.quantity
        products[item.title].revenue += item.price * item.quantity
      })
    })

    return Object.values(products)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [orders])

  return (
    <div className="space-y-4">
      {topProducts.map((product, index) => (
        <div key={index} className="flex items-center">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mr-3">{index + 1}</div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <span className="font-medium">{product.title}</span>
              <span>{product.count} unid.</span>
            </div>
            <div className="text-sm text-muted-foreground">R$ {product.revenue.toFixed(2)}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Componente principal do Dashboard
export default function DashboardView() {
  const { activeOrders } = usePOS()
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">("today")

  // Filtrar pedidos com base no período selecionado
  // Modificar a função filteredOrders para garantir que as datas sejam objetos Date
  const filteredOrders = useMemo(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)
    const monthAgo = new Date(today)
    monthAgo.setMonth(monthAgo.getMonth() - 1)

    return activeOrders.filter((order) => {
      // Garantir que a data do pedido seja um objeto Date
      const orderDate = order.createdAt instanceof Date ? order.createdAt : new Date(order.createdAt)

      if (timeRange === "today") {
        return orderDate >= today
      } else if (timeRange === "week") {
        return orderDate >= weekAgo
      } else {
        return orderDate >= monthAgo
      }
    })
  }, [activeOrders, timeRange])

  // Calcular estatísticas
  const stats = useMemo(() => {
    const completedOrders = filteredOrders.filter((order) => order.status === "completed")
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0)
    const totalOrders = completedOrders.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    const totalItems = completedOrders.reduce(
      (sum, order) => sum + order.items.reduce((s, item) => s + item.quantity, 0),
      0,
    )

    // Calcular vendas por categoria
    const salesByCategory: Record<string, number> = {}
    completedOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (!salesByCategory[item.type]) {
          salesByCategory[item.type] = 0
        }
        salesByCategory[item.type] += item.price * item.quantity
      })
    })

    const categorySales = Object.entries(salesByCategory)
      .map(([category, value]) => ({
        label: category,
        value,
        color:
          category === "Fritos"
            ? "bg-yellow-500"
            : category === "Assados"
              ? "bg-orange-500"
              : category === "Folhados"
                ? "bg-blue-500"
                : category === "Doces"
                  ? "bg-pink-500"
                  : category === "Combos"
                    ? "bg-purple-500"
                    : "bg-gray-500",
      }))
      .sort((a, b) => b.value - a.value)

    const maxCategoryValue = categorySales.length > 0 ? Math.max(...categorySales.map((c) => c.value)) : 0

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      totalItems,
      categorySales,
      maxCategoryValue,
    }
  }, [filteredOrders])

  // Verificar se há dados para exibir
  const hasData = filteredOrders.length > 0

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold">Dashboard de Vendas</h2>
          <p className="text-muted-foreground">Acompanhe o desempenho do seu negócio</p>
        </div>

        <Tabs defaultValue="today" value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
          <TabsList>
            <TabsTrigger value="today" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Hoje</span>
            </TabsTrigger>
            <TabsTrigger value="week" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>7 dias</span>
            </TabsTrigger>
            <TabsTrigger value="month" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>30 dias</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {hasData ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Faturamento Total"
              value={`R$ ${stats.totalRevenue.toFixed(2)}`}
              description={`${timeRange === "today" ? "Hoje" : timeRange === "week" ? "Últimos 7 dias" : "Últimos 30 dias"}`}
              icon={<DollarSign className="h-4 w-4" />}
              trend="up"
              trendValue="+5.2% em relação ao período anterior"
            />
            <StatCard
              title="Pedidos Concluídos"
              value={stats.totalOrders.toString()}
              description={`${timeRange === "today" ? "Hoje" : timeRange === "week" ? "Últimos 7 dias" : "Últimos 30 dias"}`}
              icon={<ShoppingBag className="h-4 w-4" />}
            />
            <StatCard
              title="Ticket Médio"
              value={`R$ ${stats.averageOrderValue.toFixed(2)}`}
              description="Valor médio por pedido"
              icon={<CreditCard className="h-4 w-4" />}
              trend="up"
              trendValue="+2.3% em relação ao período anterior"
            />
            <StatCard
              title="Itens Vendidos"
              value={stats.totalItems.toString()}
              description="Total de unidades"
              icon={<BarChart3 className="h-4 w-4" />}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Vendas por Categoria</CardTitle>
                <CardDescription>Distribuição de vendas por tipo de produto</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleBarChart data={stats.categorySales} maxValue={stats.maxCategoryValue} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pagamento</CardTitle>
                <CardDescription>Distribuição por forma de pagamento</CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentMethodDistribution orders={filteredOrders.filter((o) => o.status === "completed")} />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Produtos Mais Vendidos</CardTitle>
                <CardDescription>Top 5 produtos por quantidade</CardDescription>
              </CardHeader>
              <CardContent>
                <TopProducts orders={filteredOrders.filter((o) => o.status === "completed")} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Últimos Pedidos</CardTitle>
                <CardDescription>Pedidos mais recentes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredOrders
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5)
                    .map((order, index) => (
                      <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                        <div>
                          <div className="font-medium">Pedido #{order.orderNumber}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleTimeString()} - {order.customerName}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">R$ {order.total.toFixed(2)}</div>
                          <Badge
                            variant={
                              order.status === "completed"
                                ? "success"
                                : order.status === "preparing"
                                  ? "secondary"
                                  : order.status === "cancelled"
                                    ? "destructive"
                                    : "default"
                            }
                          >
                            {order.status === "completed"
                              ? "Concluído"
                              : order.status === "preparing"
                                ? "Em preparo"
                                : order.status === "cancelled"
                                  ? "Cancelado"
                                  : "Novo"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] bg-muted/20 rounded-lg border border-dashed">
          <ShoppingBag className="h-16 w-16 text-muted mb-4" />
          <h3 className="text-xl font-medium text-muted-foreground">Nenhum dado disponível</h3>
          <p className="text-sm text-muted-foreground mt-1">Não há pedidos concluídos no período selecionado</p>
        </div>
      )}
    </div>
  )
}

// Também exportamos como named export para compatibilidade
export { DashboardView }

