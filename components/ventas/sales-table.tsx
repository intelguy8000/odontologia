"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState, useMemo } from "react";
import { Download, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as XLSX from "xlsx";

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
  const [filters, setFilters] = useState({
    fecha: "",
    paciente: "",
    tratamiento: "",
    monto: "",
    metodo: "",
    estado: "",
  });

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      efectivo: "Efectivo",
      tarjeta: "Tarjeta",
      transferencia: "Transferencia",
      nequi: "Nequi",
      plan_pagos: "Plan de Pagos",
    };
    return labels[method] || method;
  };

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const fecha = format(new Date(sale.date), "dd MMM yyyy", { locale: es }).toLowerCase();
      const paciente = sale.patient.fullName.toLowerCase();
      const tratamiento = sale.treatment.toLowerCase();
      const monto = sale.amount.toString();
      const metodo = getPaymentMethodLabel(sale.paymentMethod).toLowerCase();
      const estado = sale.status.toLowerCase();

      return (
        fecha.includes(filters.fecha.toLowerCase()) &&
        paciente.includes(filters.paciente.toLowerCase()) &&
        tratamiento.includes(filters.tratamiento.toLowerCase()) &&
        monto.includes(filters.monto) &&
        metodo.includes(filters.metodo.toLowerCase()) &&
        estado.includes(filters.estado.toLowerCase())
      );
    });
  }, [sales, filters]);

  const exportToExcel = () => {
    const dataToExport = filteredSales.map((sale) => ({
      Fecha: format(new Date(sale.date), "dd/MM/yyyy"),
      Paciente: sale.patient.fullName,
      Tratamiento: sale.treatment,
      Monto: sale.amount,
      "Método de Pago": getPaymentMethodLabel(sale.paymentMethod),
      Estado: sale.status.charAt(0).toUpperCase() + sale.status.slice(1),
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ventas");
    XLSX.writeFile(wb, `ventas_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
  };

  const exportToCSV = () => {
    const headers = ["Fecha", "Paciente", "Tratamiento", "Monto", "Método de Pago", "Estado"];
    const dataToExport = filteredSales.map((sale) => [
      format(new Date(sale.date), "dd/MM/yyyy"),
      sale.patient.fullName,
      sale.treatment,
      sale.amount,
      getPaymentMethodLabel(sale.paymentMethod),
      sale.status.charAt(0).toUpperCase() + sale.status.slice(1),
    ]);

    const csvContent = [
      headers.join(","),
      ...dataToExport.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `ventas_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  return (
    <div className="space-y-4">
      {/* Export Buttons */}
      <div className="flex gap-2 justify-end">
        <Button onClick={exportToCSV} variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
        <Button onClick={exportToExcel} variant="outline" size="sm">
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Exportar Excel
        </Button>
      </div>

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
            {/* Filter Row */}
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="py-2 px-4">
                <Input
                  placeholder="Filtrar..."
                  value={filters.fecha}
                  onChange={(e) => setFilters({ ...filters, fecha: e.target.value })}
                  className="h-8 text-xs"
                />
              </th>
              <th className="py-2 px-4">
                <Input
                  placeholder="Filtrar..."
                  value={filters.paciente}
                  onChange={(e) => setFilters({ ...filters, paciente: e.target.value })}
                  className="h-8 text-xs"
                />
              </th>
              <th className="py-2 px-4">
                <Input
                  placeholder="Filtrar..."
                  value={filters.tratamiento}
                  onChange={(e) => setFilters({ ...filters, tratamiento: e.target.value })}
                  className="h-8 text-xs"
                />
              </th>
              <th className="py-2 px-4">
                <Input
                  placeholder="Filtrar..."
                  value={filters.monto}
                  onChange={(e) => setFilters({ ...filters, monto: e.target.value })}
                  className="h-8 text-xs"
                />
              </th>
              <th className="py-2 px-4">
                <Input
                  placeholder="Filtrar..."
                  value={filters.metodo}
                  onChange={(e) => setFilters({ ...filters, metodo: e.target.value })}
                  className="h-8 text-xs"
                />
              </th>
              <th className="py-2 px-4">
                <Input
                  placeholder="Filtrar..."
                  value={filters.estado}
                  onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
                  className="h-8 text-xs"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map((sale) => (
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
        {filteredSales.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {sales.length === 0 ? "No hay ventas registradas" : "No se encontraron resultados con los filtros aplicados"}
          </div>
        )}
      </div>
    </div>
  );
}
