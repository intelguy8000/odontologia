"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Patient {
  id: string;
  fullName: string;
  document: string;
}

interface InventoryItem {
  id: string;
  name: string;
  currentStock: number;
  unit: string;
}

export default function NuevaVentaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    patientId: "",
    treatment: "",
    amount: "",
    paymentMethod: "efectivo",
    status: "completada",
  });

  useEffect(() => {
    // Cargar pacientes
    fetch("/api/pacientes")
      .then((res) => res.json())
      .then((data) => setPatients(data))
      .catch((err) => console.error("Error loading patients:", err));

    // Cargar inventario
    fetch("/api/inventario")
      .then((res) => res.json())
      .then((data) => setInventory(data))
      .catch((err) => console.error("Error loading inventory:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/ventas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      if (!response.ok) {
        throw new Error("Error creating sale");
      }

      toast.success("Venta creada exitosamente");
      router.push("/ventas");
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al crear la venta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/ventas">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nueva Venta</h1>
          <p className="text-gray-500 mt-1">
            Registra un nuevo tratamiento o servicio
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información de la Venta</CardTitle>
          <CardDescription>
            Completa los datos del tratamiento realizado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patient">Paciente</Label>
                <select
                  id="patient"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  value={formData.patientId}
                  onChange={(e) =>
                    setFormData({ ...formData, patientId: e.target.value })
                  }
                  required
                >
                  <option value="">Seleccionar paciente</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.fullName} - {patient.document}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="treatment">Tratamiento</Label>
                <Input
                  id="treatment"
                  type="text"
                  placeholder="Ej: Limpieza Dental"
                  value={formData.treatment}
                  onChange={(e) =>
                    setFormData({ ...formData, treatment: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Monto</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Método de Pago</Label>
                <select
                  id="paymentMethod"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentMethod: e.target.value })
                  }
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="nequi">Nequi</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <select
                  id="status"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="completada">Completada</option>
                  <option value="pendiente">Pendiente</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <Link href="/ventas">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar Venta"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
