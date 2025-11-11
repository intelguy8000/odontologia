import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Limpiar datos existentes (en orden correcto por relaciones)
  await prisma.inventoryMovement.deleteMany();
  await prisma.saleInventoryItem.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.integration.deleteMany();
  await prisma.user.deleteMany();
  await prisma.config.deleteMany();

  // Hash de passwords
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const asistentePassword = await bcrypt.hash("Asistente123!", 10);
  const readonlyPassword = await bcrypt.hash("Lectura123!", 10);

  // Crear usuarios
  const admin = await prisma.user.create({
    data: {
      email: "dra.catalina@crdentalstudio.com",
      password: adminPassword,
      name: "Dra. Catalina Rodríguez",
      role: "admin",
      status: "active",
    },
  });

  const asistente = await prisma.user.create({
    data: {
      email: "maria@crdentalstudio.com",
      password: asistentePassword,
      name: "María González",
      role: "asistente",
      status: "active",
    },
  });

  const readonly = await prisma.user.create({
    data: {
      email: "juan@crdentalstudio.com",
      password: readonlyPassword,
      name: "Juan Pérez",
      role: "readonly",
      status: "active",
    },
  });

  console.log("✅ Usuarios creados:");
  console.log(`   - ${admin.name} (${admin.role})`);
  console.log(`   - ${asistente.name} (${asistente.role})`);
  console.log(`   - ${readonly.name} (${readonly.role})`);

  // Crear configuración del consultorio
  const config = await prisma.config.create({
    data: {
      id: "singleton",
      name: "CR Dental Studio",
      address: "Carrera 43A #1-50, Medellín, Antioquia",
      phone: "+57 (4) 123-4567",
      email: "contacto@crdentalstudio.com",
      website: "https://crdentalstudio.com",
    },
  });

  console.log("✅ Configuración creada:");
  console.log(`   - ${config.name}`);

  // Crear integraciones
  const alegraIntegration = await prisma.integration.create({
    data: {
      name: "Alegra",
      type: "alegra",
      status: "active",
      lastSync: new Date(),
    },
  });

  const openaiIntegration = await prisma.integration.create({
    data: {
      name: "OpenAI",
      type: "openai",
      status: "inactive",
      lastSync: null,
    },
  });

  console.log("✅ Integraciones creadas:");
  console.log(`   - ${alegraIntegration.name} (${alegraIntegration.status})`);
  console.log(`   - ${openaiIntegration.name} (${openaiIntegration.status})`);

  // Crear pacientes
  const patientsData = [
    { document: "1020304050", fullName: "Carlos Andrés López", phone: "3001234567", email: "carlos.lopez@email.com" },
    { document: "1020304051", fullName: "María Fernanda Gómez", phone: "3002345678", email: "maria.gomez@email.com" },
    { document: "1020304052", fullName: "Jorge Luis Martínez", phone: "3003456789", email: "jorge.martinez@email.com" },
    { document: "1020304053", fullName: "Ana María Rodríguez", phone: "3004567890", email: "ana.rodriguez@email.com" },
    { document: "1020304054", fullName: "Pedro José Sánchez", phone: "3005678901", email: "pedro.sanchez@email.com" },
    { document: "1020304055", fullName: "Laura Patricia Díaz", phone: "3006789012", email: "laura.diaz@email.com" },
    { document: "1020304056", fullName: "Andrés Felipe Torres", phone: "3007890123", email: "andres.torres@email.com" },
    { document: "1020304057", fullName: "Carolina Ramírez", phone: "3008901234", email: "carolina.ramirez@email.com" },
    { document: "1020304058", fullName: "Ricardo Alberto Vargas", phone: "3009012345", email: "ricardo.vargas@email.com" },
    { document: "1020304059", fullName: "Claudia Patricia Moreno", phone: "3010123456", email: "claudia.moreno@email.com" },
  ];

  const patients = [];
  for (const patientData of patientsData) {
    const patient = await prisma.patient.create({ data: patientData });
    patients.push(patient);
  }

  console.log(`✅ ${patients.length} pacientes creados`);

  // Crear items de inventario
  const inventoryData = [
    // Material dental - stock OK
    { name: "Resina Composite A2", category: "Material Restaurador", currentStock: 45, minStock: 10, unit: "unidad", avgCost: 85000 },
    { name: "Resina Composite A3", category: "Material Restaurador", currentStock: 38, minStock: 10, unit: "unidad", avgCost: 85000 },
    { name: "Ionómero de Vidrio", category: "Material Restaurador", currentStock: 25, minStock: 8, unit: "unidad", avgCost: 65000 },
    { name: "Cemento Temporal", category: "Material Restaurador", currentStock: 30, minStock: 10, unit: "unidad", avgCost: 45000 },

    // Anestesia - stock OK
    { name: "Lidocaína 2% con Epinefrina", category: "Anestesia", currentStock: 120, minStock: 50, unit: "carpule", avgCost: 2500 },
    { name: "Articaína 4%", category: "Anestesia", currentStock: 80, minStock: 40, unit: "carpule", avgCost: 3500 },

    // Instrumental - stock OK
    { name: "Guantes de Nitrilo Talla M", category: "Bioseguridad", currentStock: 500, minStock: 200, unit: "par", avgCost: 800 },
    { name: "Guantes de Nitrilo Talla L", category: "Bioseguridad", currentStock: 400, minStock: 200, unit: "par", avgCost: 800 },
    { name: "Mascarillas Quirúrgicas", category: "Bioseguridad", currentStock: 800, minStock: 300, unit: "unidad", avgCost: 500 },
    { name: "Baberos Desechables", category: "Bioseguridad", currentStock: 600, minStock: 200, unit: "unidad", avgCost: 300 },

    // Material rotatorio - stock OK
    { name: "Fresas Carburo #330", category: "Instrumental Rotatorio", currentStock: 50, minStock: 15, unit: "unidad", avgCost: 8000 },
    { name: "Fresas Diamante Redonda", category: "Instrumental Rotatorio", currentStock: 45, minStock: 15, unit: "unidad", avgCost: 12000 },
    { name: "Fresas Diamante Llama", category: "Instrumental Rotatorio", currentStock: 40, minStock: 15, unit: "unidad", avgCost: 12000 },

    // Medicamentos - algunos en stock bajo
    { name: "Amoxicilina 500mg", category: "Medicamentos", currentStock: 35, minStock: 30, unit: "cápsula", avgCost: 800 },
    { name: "Ibuprofeno 400mg", category: "Medicamentos", currentStock: 18, minStock: 30, unit: "tableta", avgCost: 400 },
    { name: "Acetaminofén 500mg", category: "Medicamentos", currentStock: 15, minStock: 30, unit: "tableta", avgCost: 300 },

    // Endodoncia - algunos críticos
    { name: "Limas K-File #15", category: "Endodoncia", currentStock: 8, minStock: 20, unit: "unidad", avgCost: 15000 },
    { name: "Limas K-File #20", category: "Endodoncia", currentStock: 5, minStock: 20, unit: "unidad", avgCost: 15000 },
    { name: "Limas K-File #25", category: "Endodoncia", currentStock: 12, minStock: 20, unit: "unidad", avgCost: 15000 },
    { name: "Gutapercha #25", category: "Endodoncia", currentStock: 22, minStock: 15, unit: "unidad", avgCost: 18000 },

    // Periodoncia
    { name: "Curetas Gracey 5-6", category: "Periodoncia", currentStock: 8, minStock: 5, unit: "unidad", avgCost: 95000 },
    { name: "Curetas Gracey 7-8", category: "Periodoncia", currentStock: 6, minStock: 5, unit: "unidad", avgCost: 95000 },

    // Materiales de impresión
    { name: "Silicona de Condensación", category: "Material de Impresión", currentStock: 12, minStock: 8, unit: "kit", avgCost: 125000 },
    { name: "Alginato", category: "Material de Impresión", currentStock: 20, minStock: 10, unit: "bolsa", avgCost: 35000 },

    // Blanqueamiento - stock crítico
    { name: "Gel Blanqueador 35%", category: "Estética", currentStock: 3, minStock: 10, unit: "jeringa", avgCost: 75000 },
    { name: "Gel Blanqueador 16%", category: "Estética", currentStock: 6, minStock: 10, unit: "jeringa", avgCost: 55000 },

    // Radiografía
    { name: "Película Radiográfica Periapical", category: "Radiología", currentStock: 180, minStock: 100, unit: "unidad", avgCost: 2800 },
    { name: "Película Radiográfica Oclusal", category: "Radiología", currentStock: 45, minStock: 30, unit: "unidad", avgCost: 3500 },

    // Sutura
    { name: "Seda 3-0", category: "Sutura", currentStock: 25, minStock: 15, unit: "unidad", avgCost: 8500 },
    { name: "Vicryl 4-0", category: "Sutura", currentStock: 4, minStock: 15, unit: "unidad", avgCost: 22000 },

    // Algodón y gasas
    { name: "Rollos de Algodón", category: "Material Consumible", currentStock: 15, minStock: 30, unit: "paquete", avgCost: 12000 },
    { name: "Gasas Estériles", category: "Material Consumible", currentStock: 35, minStock: 25, unit: "paquete", avgCost: 8500 },

    // Adhesivos
    { name: "Adhesivo Dental Single Bond", category: "Material Restaurador", currentStock: 18, minStock: 10, unit: "frasco", avgCost: 145000 },
    { name: "Ácido Grabador 37%", category: "Material Restaurador", currentStock: 22, minStock: 10, unit: "jeringa", avgCost: 35000 },

    // Profilaxis
    { name: "Pasta Profiláctica Fresa", category: "Profilaxis", currentStock: 8, minStock: 8, unit: "tarro", avgCost: 28000 },
    { name: "Pasta Profiláctica Menta", category: "Profilaxis", currentStock: 10, minStock: 8, unit: "tarro", avgCost: 28000 },

    // Desinfección
    { name: "Alcohol Antiséptico 70%", category: "Desinfección", currentStock: 25, minStock: 15, unit: "litro", avgCost: 12000 },
    { name: "Glutaraldehído 2%", category: "Desinfección", currentStock: 12, minStock: 8, unit: "litro", avgCost: 45000 },

    // Cepillos y copa de profilaxis
    { name: "Copas de Profilaxis", category: "Profilaxis", currentStock: 100, minStock: 50, unit: "unidad", avgCost: 1200 },
    { name: "Cepillos de Profilaxis", category: "Profilaxis", currentStock: 85, minStock: 50, unit: "unidad", avgCost: 1500 },
  ];

  const inventoryItems = [];
  for (const itemData of inventoryData) {
    const item = await prisma.inventoryItem.create({ data: itemData });
    inventoryItems.push(item);

    // Crear movimiento inicial de entrada
    await prisma.inventoryMovement.create({
      data: {
        inventoryId: item.id,
        type: "entrada",
        quantity: item.currentStock,
        reason: "Stock inicial",
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 días atrás
      },
    });
  }

  console.log(`✅ ${inventoryItems.length} items de inventario creados`);

  // Crear ventas del último mes
  const treatments = [
    { name: "Limpieza Dental", amount: 80000 },
    { name: "Resina Dental", amount: 150000 },
    { name: "Extracción Simple", amount: 120000 },
    { name: "Blanqueamiento Dental", amount: 450000 },
    { name: "Endodoncia", amount: 380000 },
    { name: "Corona Porcelana", amount: 650000 },
    { name: "Consulta General", amount: 50000 },
    { name: "Ortodoncia Mensual", amount: 200000 },
  ];

  const paymentMethods = ["efectivo", "tarjeta", "transferencia", "nequi"];
  const statuses = ["completada", "completada", "completada", "completada", "pendiente"];

  const sales = [];
  for (let i = 0; i < 30; i++) {
    const randomPatient = patients[Math.floor(Math.random() * patients.length)];
    const randomTreatment = treatments[Math.floor(Math.random() * treatments.length)];
    const randomPayment = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    // Fecha aleatoria en los últimos 30 días
    const daysAgo = Math.floor(Math.random() * 30);
    const saleDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    const sale = await prisma.sale.create({
      data: {
        date: saleDate,
        patientId: randomPatient.id,
        treatment: randomTreatment.name,
        amount: randomTreatment.amount,
        paymentMethod: randomPayment,
        status: randomStatus,
      },
    });

    // Algunas ventas usan inventario
    if (Math.random() > 0.4) { // 60% de las ventas usan inventario
      const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items
      const usedItems: string[] = [];

      for (let j = 0; j < numItems; j++) {
        const randomItem = inventoryItems[Math.floor(Math.random() * inventoryItems.length)];
        if (!usedItems.includes(randomItem.id)) {
          usedItems.push(randomItem.id);
          const quantityUsed = Math.floor(Math.random() * 3) + 1;

          await prisma.saleInventoryItem.create({
            data: {
              saleId: sale.id,
              inventoryId: randomItem.id,
              quantityUsed,
            },
          });

          // Actualizar stock
          await prisma.inventoryItem.update({
            where: { id: randomItem.id },
            data: { currentStock: { decrement: quantityUsed } },
          });

          // Crear movimiento
          await prisma.inventoryMovement.create({
            data: {
              inventoryId: randomItem.id,
              type: "salida",
              quantity: quantityUsed,
              reason: `Venta: ${randomTreatment.name}`,
              referenceId: sale.id,
              date: saleDate,
            },
          });
        }
      }
    }

    sales.push(sale);
  }

  console.log(`✅ ${sales.length} ventas creadas`);

  console.log("\n🎉 Seed completado exitosamente!");
  console.log("\n📝 Credenciales de acceso:");
  console.log("   Admin: dra.catalina@crdentalstudio.com / Admin123!");
  console.log("   Asistente: maria@crdentalstudio.com / Asistente123!");
  console.log("   Readonly: juan@crdentalstudio.com / Lectura123!");
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
