"use client";

import { InventoryItemWithStatus } from "@/lib/services/inventario.service";

interface InventoryTableProps {
  items: InventoryItemWithStatus[];
}

export function InventoryTable({ items }: InventoryTableProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ok: { label: "OK", className: "bg-green-100 text-green-800" },
      low: { label: "Bajo", className: "bg-yellow-100 text-yellow-800" },
      critical: { label: "Crítico", className: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Código
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Nombre
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Categoría
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
              Stock Actual
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
              Stock Mínimo
            </th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
              Estado
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
              Valor Total
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 text-sm font-mono text-gray-600">
                {item.code.slice(0, 8)}
              </td>
              <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                {item.name}
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {item.category}
              </td>
              <td className="py-3 px-4 text-sm text-gray-900 text-right">
                {item.currentStock} {item.unit}
              </td>
              <td className="py-3 px-4 text-sm text-gray-600 text-right">
                {item.minStock} {item.unit}
              </td>
              <td className="py-3 px-4 text-center">
                {getStatusBadge(item.status)}
              </td>
              <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium">
                ${item.totalValue.toLocaleString("es-CO")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No hay items en el inventario
        </div>
      )}
    </div>
  );
}
