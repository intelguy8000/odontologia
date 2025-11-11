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

// Diccionario de tratamientos comunes con precios sugeridos
const TRATAMIENTOS_DENTALES = [
  { nombre: "Consulta General", precio: 50000 },
  { nombre: "Limpieza Dental (Profilaxis)", precio: 80000 },
  { nombre: "Resina Dental (1 superficie)", precio: 150000 },
  { nombre: "Resina Dental (2 superficies)", precio: 200000 },
  { nombre: "Resina Dental (3 superficies)", precio: 250000 },
  { nombre: "Extracción Simple", precio: 120000 },
  { nombre: "Extracción Compleja", precio: 180000 },
  { nombre: "Extracción Quirúrgica", precio: 250000 },
  { nombre: "Blanqueamiento Dental", precio: 450000 },
  { nombre: "Endodoncia (Conducto)", precio: 380000 },
  { nombre: "Corona Porcelana", precio: 650000 },
  { nombre: "Corona Metal-Porcelana", precio: 550000 },
  { nombre: "Ortodoncia Mensual", precio: 200000 },
  { nombre: "Ortodoncia Instalación", precio: 800000 },
  { nombre: "Implante Dental", precio: 1500000 },
  { nombre: "Urgencia Odontológica", precio: 80000 },
  { nombre: "Radiografía Periapical", precio: 25000 },
  { nombre: "Radiografía Panorámica", precio: 60000 },
  { nombre: "Detartraje (Limpieza Profunda)", precio: 120000 },
  { nombre: "Sellante de Fosas", precio: 40000 },
  { nombre: "Aplicación de Flúor", precio: 30000 },
  { nombre: "Puente Fijo (3 piezas)", precio: 1200000 },
  { nombre: "Prótesis Removible Parcial", precio: 800000 },
  { nombre: "Prótesis Removible Total", precio: 1000000 },
  { nombre: "Otros", precio: 0 },
];

export default function NuevaVentaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [displayAmount, setDisplayAmount] = useState("");

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

  // Formatear monto con separador de miles
  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    if (!numericValue) return "";
    return new Intl.NumberFormat("es-CO").format(parseInt(numericValue));
  };

  // Handler para cambio de monto
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormData({ ...formData, amount: value });
    setDisplayAmount(formatCurrency(value));
  };

  // Handler para cambio de tratamiento
  const handleTreatmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const treatmentName = e.target.value;
    const treatment = TRATAMIENTOS_DENTALES.find((t) => t.nombre === treatmentName);

    setFormData({
      ...formData,
      treatment: treatmentName,
      amount: treatment?.precio.toString() || "",
    });

    if (treatment) {
      setDisplayAmount(formatCurrency(treatment.precio.toString()));
    }
  };

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
                <select
                  id="treatment"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  value={formData.treatment}
                  onChange={handleTreatmentChange}
                  required
                >
                  <option value="">Seleccionar tratamiento</option>
                  {TRATAMIENTOS_DENTALES.map((tratamiento) => (
                    <option key={tratamiento.nombre} value={tratamiento.nombre}>
                      {tratamiento.nombre}
                      {tratamiento.precio > 0 &&
                        ` - $${tratamiento.precio.toLocaleString("es-CO")}`}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500">
                  El precio se autocompleta según el tratamiento seleccionado
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Monto</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    $
                  </span>
                  <Input
                    id="amount"
                    type="text"
                    placeholder="0"
                    value={displayAmount}
                    onChange={handleAmountChange}
                    className="pl-7"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Formato: $500.000 (pesos colombianos)
                </p>
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
                  <option value="completada">Completada (Pagada y Realizada)</option>
                  <option value="pendiente">Pendiente (Pago o Tratamiento Pendiente)</option>
                </select>
                <p className="text-xs text-gray-500">
                  <strong>Completada:</strong> Tratamiento realizado y pagado.{" "}
                  <strong>Pendiente:</strong> Pago a crédito o cita programada
                </p>
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
