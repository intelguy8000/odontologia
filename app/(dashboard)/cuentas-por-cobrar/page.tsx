import { getPaymentPlans, getAccountsReceivableKPIs } from "@/lib/services/payment-plans.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentPlansTable } from "@/components/cuentas-por-cobrar/payment-plans-table";
import { DollarSign, AlertCircle, Calendar, FileText } from "lucide-react";

export default async function CuentasPorCobrarPage() {
  const paymentPlans = await getPaymentPlans({ status: "active" });
  const kpis = await getAccountsReceivableKPIs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Planes de Pago</h1>
        <p className="text-gray-500 mt-1">
          Gestiona los planes de pago y cuotas pendientes
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total por Cobrar</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${kpis.totalReceivable.toLocaleString("es-CO")}
            </div>
            <p className="text-xs text-muted-foreground">
              {kpis.activePlansCount} {kpis.activePlansCount === 1 ? "plan activo" : "planes activos"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cuotas Vencidas</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${kpis.overdueAmount.toLocaleString("es-CO")}
            </div>
            <p className="text-xs text-muted-foreground">
              {kpis.overdueCount} {kpis.overdueCount === 1 ? "cuota vencida" : "cuotas vencidas"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vence Esta Semana</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ${kpis.dueThisWeekAmount.toLocaleString("es-CO")}
            </div>
            <p className="text-xs text-muted-foreground">
              {kpis.dueThisWeekCount} {kpis.dueThisWeekCount === 1 ? "cuota" : "cuotas"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planes Activos</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.activePlansCount}</div>
            <p className="text-xs text-muted-foreground">
              Con pagos pendientes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Planes de Pago */}
      <Card>
        <CardHeader>
          <CardTitle>Planes de Pago Activos</CardTitle>
          <CardDescription>
            Lista de todos los planes de pago con cuotas pendientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentPlansTable paymentPlans={paymentPlans} />
        </CardContent>
      </Card>
    </div>
  );
}
