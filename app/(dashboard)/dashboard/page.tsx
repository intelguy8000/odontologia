import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, ShoppingCart, Users, AlertTriangle, Receipt, AlertCircle, Calendar, Plug } from "lucide-react";
import { getDashboardKPIs, getSalesLast7Days, getTopTreatments } from "@/lib/services/dashboard.service";
import { getInventoryAlerts } from "@/lib/services/inventario.service";
import { getAccountsReceivableKPIs } from "@/lib/services/payment-plans.service";
import { getIntegrations } from "@/lib/services/integraciones.service";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { TopTreatmentsChart } from "@/components/dashboard/top-treatments-chart";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const kpisData = await getDashboardKPIs();
  const salesData = await getSalesLast7Days();
  const topTreatments = await getTopTreatments(5);
  const inventoryAlerts = await getInventoryAlerts();
  const accountsReceivableKPIs = await getAccountsReceivableKPIs();
  const integrations = await getIntegrations();
  const errorIntegrations = integrations.filter((i) => i.status === "error");

  const kpis = [
    {
      title: "Ventas del Mes",
      value: `$${kpisData.salesMonth.toLocaleString("es-CO")}`,
      description: `${kpisData.salesCount} ventas realizadas`,
      icon: DollarSign,
      trend: "+12%",
    },
    {
      title: "Utilidad del Mes",
      value: `$${kpisData.profit.toLocaleString("es-CO")}`,
      description: "Sin gastos registrados",
      icon: TrendingUp,
      trend: "+12%",
    },
    {
      title: "Gastos del Mes",
      value: `$${kpisData.expenses.toLocaleString("es-CO")}`,
      description: "Próximamente",
      icon: ShoppingCart,
      trend: "+0%",
    },
    {
      title: "Clientes Activos",
      value: kpisData.activeClients.toString(),
      description: "Últimos 90 días",
      icon: Users,
      trend: `+${kpisData.activeClients}`,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Vista general del consultorio CR Dental Studio
        </p>
      </div>

      {/* KPIs Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <Icon className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-gray-500 mt-1">{kpi.description}</p>
                <p className="text-xs text-green-600 mt-2">{kpi.trend} vs mes anterior</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ventas Últimos 7 Días</CardTitle>
            <CardDescription>Tendencia de ingresos diarios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <SalesChart data={salesData} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tratamientos Más Realizados</CardTitle>
            <CardDescription>Top 5 del último mes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <TopTreatmentsChart data={topTreatments} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Alerts */}
      {inventoryAlerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-900">Alertas de Inventario</CardTitle>
            </div>
            <CardDescription className="text-orange-700">
              {inventoryAlerts.length} items con stock bajo o crítico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {inventoryAlerts.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Stock actual: {item.currentStock} {item.unit} | Mínimo: {item.minStock} {item.unit}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === "critical"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status === "critical" ? "Crítico" : "Bajo"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Accounts Receivable Section */}
      {accountsReceivableKPIs.activePlansCount > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-blue-900">Planes de Pago</CardTitle>
              </div>
              <Link href="/cuentas-por-cobrar">
                <Button variant="outline" size="sm">
                  Ver Todos
                </Button>
              </Link>
            </div>
            <CardDescription className="text-blue-700">
              {accountsReceivableKPIs.activePlansCount} planes de pago activos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {/* Total por Cobrar */}
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <p className="text-sm font-medium text-gray-600">Total por Cobrar</p>
                </div>
                <p className="text-2xl font-bold text-blue-900">
                  ${accountsReceivableKPIs.totalReceivable.toLocaleString("es-CO")}
                </p>
              </div>

              {/* Cuotas Vencidas */}
              {accountsReceivableKPIs.overdueCount > 0 && (
                <div className="p-4 bg-white rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <p className="text-sm font-medium text-gray-600">Cuotas Vencidas</p>
                  </div>
                  <p className="text-2xl font-bold text-red-600">
                    ${accountsReceivableKPIs.overdueAmount.toLocaleString("es-CO")}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {accountsReceivableKPIs.overdueCount} cuotas vencidas
                  </p>
                </div>
              )}

              {/* Vence Esta Semana */}
              {accountsReceivableKPIs.dueThisWeekCount > 0 && (
                <div className="p-4 bg-white rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-orange-600" />
                    <p className="text-sm font-medium text-gray-600">Vence Esta Semana</p>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">
                    ${accountsReceivableKPIs.dueThisWeekAmount.toLocaleString("es-CO")}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {accountsReceivableKPIs.dueThisWeekCount} cuotas próximas
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integration Errors */}
      {errorIntegrations.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plug className="h-5 w-5 text-red-600" />
                <CardTitle className="text-red-900">Alertas de Integraciones</CardTitle>
              </div>
              <Link href="/integraciones">
                <Button variant="outline" size="sm">
                  Ver Integraciones
                </Button>
              </Link>
            </div>
            <CardDescription className="text-red-700">
              {errorIntegrations.length} integraciones con errores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {errorIntegrations.map((integration) => (
                <div
                  key={integration.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200"
                >
                  <div>
                    <p className="font-medium text-gray-900">{integration.name}</p>
                    <p className="text-sm text-red-600">
                      {integration.lastError || "Error de conexión"}
                    </p>
                  </div>
                  <Link href="/integraciones">
                    <Button variant="outline" size="sm">
                      Revisar
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
