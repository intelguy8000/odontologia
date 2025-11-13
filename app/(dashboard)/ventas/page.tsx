import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Clock } from "lucide-react";
import { getSales } from "@/lib/services/ventas.service";
import { SalesTable } from "@/components/ventas/sales-table";
import { PrismaClient } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale/es";

const prisma = new PrismaClient();

async function getAlegraLastSync() {
  const alegraIntegration = await prisma.integration.findFirst({
    where: { type: "alegra" },
  });
  return alegraIntegration;
}

export default async function VentasPage() {
  const sales = await getSales();
  const alegraIntegration = await getAlegraLastSync();

  const totalAmount = sales.reduce((sum, sale) => {
    if (sale.status === "completada") {
      return sum + sale.amount;
    }
    return sum;
  }, 0);

  const completedSales = sales.filter((sale) => sale.status === "completada").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ventas</h1>
          <p className="text-gray-500 mt-1">
            Gestiona todas las ventas y tratamientos realizados
          </p>
        </div>
        <div className="flex items-center gap-4">
          {alegraIntegration?.lastSync && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>
                Última sincronización con Alegra:{" "}
                {formatDistanceToNow(new Date(alegraIntegration.lastSync), {
                  addSuffix: true,
                  locale: es,
                })}
              </span>
            </div>
          )}
          <Link href="/ventas/nueva">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Venta
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700">
              Total de Ventas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalAmount.toLocaleString("es-CO")}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {completedSales} ventas completadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700">
              Ventas Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sales.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {sales.filter((s) => s.status === "pendiente").length} pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700">
              Ticket Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${completedSales > 0
                ? Math.round(totalAmount / completedSales).toLocaleString("es-CO")
                : 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Por venta completada</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Ventas</CardTitle>
          <CardDescription>
            Registro completo de todas las ventas realizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SalesTable sales={sales} />
        </CardContent>
      </Card>
    </div>
  );
}
