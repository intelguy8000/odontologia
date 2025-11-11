"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Download, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
import { format } from "date-fns";

interface PaymentPlan {
  id: string;
  totalAmount: number;
  downPayment: number;
  installments: number;
  installmentAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: string;
  nextDueDate: Date;
  treatment: string;
  patient: {
    fullName: string;
    document: string;
  };
  paymentInstallments: Array<{
    status: string;
  }>;
}

interface Props {
  paymentPlans: PaymentPlan[];
}

export function PaymentPlansTable({ paymentPlans }: Props) {
  const [filters, setFilters] = useState({
    paciente: "",
    tratamiento: "",
    total: "",
    saldo: "",
    proximoPago: "",
    estado: "",
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusText = (plan: PaymentPlan) => {
    const overdueCount = plan.paymentInstallments.filter(
      (i) => i.status === "overdue"
    ).length;
    const paidCount = plan.paymentInstallments.filter(
      (i) => i.status === "paid"
    ).length;

    if (overdueCount > 0) return "vencida";
    if (paidCount === plan.installments) return "completada";
    return "al día";
  };

  const filteredPlans = useMemo(() => {
    return paymentPlans.filter((plan) => {
      const paciente = plan.patient.fullName.toLowerCase();
      const tratamiento = plan.treatment.toLowerCase();
      const total = plan.totalAmount.toString();
      const saldo = plan.remainingAmount.toString();
      const proximoPago = formatDate(plan.nextDueDate).toLowerCase();
      const estado = getStatusText(plan).toLowerCase();

      return (
        paciente.includes(filters.paciente.toLowerCase()) &&
        tratamiento.includes(filters.tratamiento.toLowerCase()) &&
        total.includes(filters.total) &&
        saldo.includes(filters.saldo) &&
        proximoPago.includes(filters.proximoPago.toLowerCase()) &&
        estado.includes(filters.estado.toLowerCase())
      );
    });
  }, [paymentPlans, filters]);

  const exportToExcel = () => {
    const dataToExport = filteredPlans.map((plan) => {
      const paidInstallments = plan.paymentInstallments.filter(
        (i) => i.status === "paid"
      ).length;

      return {
        Paciente: plan.patient.fullName,
        Documento: plan.patient.document,
        Tratamiento: plan.treatment,
        "Total": plan.totalAmount,
        "Pagado": plan.paidAmount,
        "Saldo": plan.remainingAmount,
        "Cuotas Pagadas": `${paidInstallments}/${plan.installments}`,
        "Próximo Pago": formatDate(plan.nextDueDate),
        "Monto Cuota": plan.installmentAmount,
        "Estado": getStatusText(plan).charAt(0).toUpperCase() + getStatusText(plan).slice(1),
      };
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Planes de Pago");
    XLSX.writeFile(wb, `planes_pago_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
  };

  const exportToCSV = () => {
    const headers = ["Paciente", "Documento", "Tratamiento", "Total", "Pagado", "Saldo", "Cuotas Pagadas", "Próximo Pago", "Monto Cuota", "Estado"];
    const dataToExport = filteredPlans.map((plan) => {
      const paidInstallments = plan.paymentInstallments.filter(
        (i) => i.status === "paid"
      ).length;

      return [
        plan.patient.fullName,
        plan.patient.document,
        plan.treatment,
        plan.totalAmount,
        plan.paidAmount,
        plan.remainingAmount,
        `${paidInstallments}/${plan.installments}`,
        formatDate(plan.nextDueDate),
        plan.installmentAmount,
        getStatusText(plan).charAt(0).toUpperCase() + getStatusText(plan).slice(1),
      ];
    });

    const csvContent = [
      headers.join(","),
      ...dataToExport.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `planes_pago_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (plan: PaymentPlan) => {
    const overdueCount = plan.paymentInstallments.filter(
      (i) => i.status === "overdue"
    ).length;
    const paidCount = plan.paymentInstallments.filter(
      (i) => i.status === "paid"
    ).length;

    if (overdueCount > 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Vencida
        </span>
      );
    }

    if (paidCount === plan.installments) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Completada
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Al día
      </span>
    );
  };

  if (paymentPlans.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No hay planes de pago activos</p>
      </div>
    );
  }

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
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paciente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tratamiento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total / Pagado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Saldo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Próximo Pago
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
            {/* Filter Row */}
            <tr className="bg-gray-50">
              <th className="px-6 py-2">
                <Input
                  placeholder="Filtrar..."
                  value={filters.paciente}
                  onChange={(e) => setFilters({ ...filters, paciente: e.target.value })}
                  className="h-8 text-xs"
                />
              </th>
              <th className="px-6 py-2">
                <Input
                  placeholder="Filtrar..."
                  value={filters.tratamiento}
                  onChange={(e) => setFilters({ ...filters, tratamiento: e.target.value })}
                  className="h-8 text-xs"
                />
              </th>
              <th className="px-6 py-2">
                <Input
                  placeholder="Filtrar..."
                  value={filters.total}
                  onChange={(e) => setFilters({ ...filters, total: e.target.value })}
                  className="h-8 text-xs"
                />
              </th>
              <th className="px-6 py-2">
                <Input
                  placeholder="Filtrar..."
                  value={filters.saldo}
                  onChange={(e) => setFilters({ ...filters, saldo: e.target.value })}
                  className="h-8 text-xs"
                />
              </th>
              <th className="px-6 py-2">
                <Input
                  placeholder="Filtrar..."
                  value={filters.proximoPago}
                  onChange={(e) => setFilters({ ...filters, proximoPago: e.target.value })}
                  className="h-8 text-xs"
                />
              </th>
              <th className="px-6 py-2">
                <Input
                  placeholder="Filtrar..."
                  value={filters.estado}
                  onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
                  className="h-8 text-xs"
                />
              </th>
              <th className="px-6 py-2"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPlans.map((plan) => {
              const paidInstallments = plan.paymentInstallments.filter(
                (i) => i.status === "paid"
              ).length;

              return (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {plan.patient.fullName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {plan.patient.document}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {plan.treatment}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${plan.totalAmount.toLocaleString("es-CO")}
                    </div>
                    <div className="text-sm text-gray-500">
                      Pagado: ${plan.paidAmount.toLocaleString("es-CO")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-blue-600">
                      ${plan.remainingAmount.toLocaleString("es-CO")}
                    </div>
                    <div className="text-xs text-gray-500">
                      {paidInstallments}/{plan.installments} cuotas pagadas
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(plan.nextDueDate)}
                    </div>
                    <div className="text-sm text-gray-500">
                      ${plan.installmentAmount.toLocaleString("es-CO")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(plan)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/cuentas-por-cobrar/${plan.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalle
                      </Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredPlans.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No se encontraron resultados con los filtros aplicados
          </div>
        )}
      </div>
    </div>
  );
}
