import { Suspense } from "react";
import { PatientsTable } from "./patients-table";

export default function ClientesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-500 mt-1">
            Gestiona la base de datos de pacientes del consultorio
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }
      >
        <PatientsTable />
      </Suspense>
    </div>
  );
}
