"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Sale {
  id: string;
  date: Date;
  patient: {
    fullName: string;
  };
  treatment: string;
  amount: number;
  paymentMethod: string;
  status: string;
}

interface SalesTableProps {
  sales: Sale[];
}

export function SalesTable({ sales }: SalesTableProps) {
  const getStatusBadge = (status: string) => {
    const statusStyles = {
      completada: "bg-green-100 text-green-800",
      pendiente: "bg-yellow-100 text-yellow-800",
      cancelada: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusStyles[status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      efectivo: "Efectivo",
      tarjeta: "Tarjeta",
      transferencia: "Transferencia",
      nequi: "Nequi",
    };
    return labels[method] || method;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Fecha
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Paciente
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Tratamiento
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
              Monto
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Método de Pago
            </th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
              Estado
            </th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 text-sm text-gray-900">
                {format(new Date(sale.date), "dd MMM yyyy", { locale: es })}
              </td>
              <td className="py-3 px-4 text-sm text-gray-900">
                {sale.patient.fullName}
              </td>
              <td className="py-3 px-4 text-sm text-gray-900">
                {sale.treatment}
              </td>
              <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium">
                ${sale.amount.toLocaleString("es-CO")}
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {getPaymentMethodLabel(sale.paymentMethod)}
              </td>
              <td className="py-3 px-4 text-center">
                {getStatusBadge(sale.status)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {sales.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No hay ventas registradas
        </div>
      )}
    </div>
  );
}
