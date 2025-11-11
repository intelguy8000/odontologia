import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface CreateSaleData {
  date: Date;
  patientId: string;
  treatment: string;
  amount: number;
  paymentMethod: string;
  status: string;
  itemsUsed?: Array<{
    inventoryId: string;
    quantityUsed: number;
  }>;
}

export async function createSale(data: CreateSaleData) {
  return await prisma.$transaction(async (tx) => {
    // 1. Crear la venta
    const sale = await tx.sale.create({
      data: {
        date: data.date,
        patientId: data.patientId,
        treatment: data.treatment,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        status: data.status,
      },
    });

    // 2. Si hay items usados, procesarlos
    if (data.itemsUsed && data.itemsUsed.length > 0) {
      for (const item of data.itemsUsed) {
        // Crear relación sale-inventory
        await tx.saleInventoryItem.create({
          data: {
            saleId: sale.id,
            inventoryId: item.inventoryId,
            quantityUsed: item.quantityUsed,
          },
        });

        // Descontar del inventario
        await tx.inventoryItem.update({
          where: { id: item.inventoryId },
          data: {
            currentStock: {
              decrement: item.quantityUsed,
            },
          },
        });

        // Crear movimiento de inventario
        await tx.inventoryMovement.create({
          data: {
            inventoryId: item.inventoryId,
            type: "salida",
            quantity: item.quantityUsed,
            reason: `Venta: ${data.treatment}`,
            referenceId: sale.id,
            date: data.date,
          },
        });
      }
    }

    // Retornar la venta con sus relaciones
    return await tx.sale.findUnique({
      where: { id: sale.id },
      include: {
        patient: true,
        itemsUsed: {
          include: {
            inventory: true,
          },
        },
      },
    });
  });
}

export interface SaleFilters {
  patientId?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export async function getSales(filters?: SaleFilters) {
  const where: any = {};

  if (filters?.patientId) {
    where.patientId = filters.patientId;
  }

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.dateFrom || filters?.dateTo) {
    where.date = {};
    if (filters.dateFrom) {
      where.date.gte = filters.dateFrom;
    }
    if (filters.dateTo) {
      where.date.lte = filters.dateTo;
    }
  }

  return await prisma.sale.findMany({
    where,
    include: {
      patient: true,
      itemsUsed: {
        include: {
          inventory: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });
}

export async function getSaleById(id: string) {
  return await prisma.sale.findUnique({
    where: { id },
    include: {
      patient: true,
      itemsUsed: {
        include: {
          inventory: true,
        },
      },
    },
  });
}
