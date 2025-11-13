# Changelog - CR Dental Studio

Registro de todos los cambios importantes del proyecto.

---

## [Noviembre 2024] - Actualización Mayor

### 🎯 Resumen
Esta actualización se enfocó en mejorar la experiencia de usuario eliminando barreras de entrada (login) y agregando funcionalidades completas de gestión de datos para proveedores, clientes, compras y gastos.

---

### ✨ Nuevas Funcionalidades

#### 1. Auto-Login Simplificado
- **Eliminado** el sistema de login tradicional
- Sistema ahora inicia automáticamente como Dra. Catalina Rodríguez (admin)
- Redireccionamiento automático de `/login` a `/dashboard`
- Ideal para uso personal sin necesidad de gestión de contraseñas

**Archivos modificados:**
- `lib/auth.ts` - Retorna sesión permanente por defecto
- `app/(dashboard)/layout.tsx` - Removido redirect a login
- `app/page.tsx` - Redirige directamente a dashboard
- `proxy.ts` - Middleware simplificado sin NextAuth

---

#### 2. Indicador de Sincronización con Alegra
- **Reemplazado** botón "Importar desde Alegra" por indicador de estado
- Muestra última sincronización con formato relativo (ej: "hace 20 minutos")
- Actualización automática de timestamp en seed

**Archivos modificados:**
- `app/(dashboard)/ventas/page.tsx` - Función `getAlegraLastSync()`, UI con Clock icon
- `prisma/seed.ts` - lastSync configurado a hace 20 minutos

---

#### 3. Distinción de Ventas: Alegra vs Manual

**Problema resuelto:** La doctora necesitaba diferenciar entre:
- Ventas formales facturadas por Alegra (tarjeta, transferencia, Nequi)
- Ventas informales/manuales (efectivo, amigos, intercambios) que NO deben reportarse a Alegra

**Solución implementada:**
- Nuevo campo `source` en modelo Sale ("alegra" | "manual")
- Nuevo campo `alegraInvoiceId` para tracking de facturas
- Lógica automática: efectivo = manual, otros = alegra
- KPIs separados en dashboard de ventas
- Sistema de filtros en tabla (Todas / Solo Alegra / Solo Manuales)
- Badges visuales en columna Source

**Archivos modificados:**
- `prisma/schema.prisma` - Campos source y alegraInvoiceId
- `prisma/seed.ts` - Lógica de asignación automática
- `app/(dashboard)/ventas/page.tsx` - Cálculo de KPIs separados
- `components/ventas/sales-table.tsx` - Filtros y badges

---

#### 4. Cambio de Terminología: Cuentas por Cobrar → Planes de Pago
- Renombrado para ser más amigable y descriptivo
- Refleja mejor la funcionalidad del módulo

**Archivos modificados:**
- `components/layouts/sidebar.tsx`
- `app/(dashboard)/cuentas-por-cobrar/page.tsx`
- `app/(dashboard)/dashboard/page.tsx`
- `README.md`
- `docs/CHAT_AI.md`

---

#### 5. Formularios de Compras y Gastos

**Problema resuelto:** El sistema mostraba datos pero no permitía ingresarlos manualmente. La doctora usaba Excel porque no había formularios de entrada.

**Solución implementada:**

**Nueva Compra (`/compras/nueva`):**
- Formulario completo con información general y productos
- Campos: Fecha, Proveedor, N° Factura, Categoría
- Tabla dinámica de productos con:
  - Nombre, Cantidad, Unidad (unidad/caja/paquete/etc), Precio unitario
  - Cálculo automático de subtotales y total general
  - Botones +/- para agregar/eliminar productos (mínimo 1)
- Categorías predefinidas: Material Restaurador, Anestesia, Bioseguridad, etc.

**Nuevo Gasto (`/compras/nuevo-gasto`):**
- Formulario para gastos operacionales
- Campos: Fecha, Categoría, Descripción, Monto, Frecuencia, Estado
- Categorías: Nómina, Arriendo, Servicios Públicos, Marketing, etc.
- Frecuencias: Único, Mensual, Anual
- Estados: Pagado, Pendiente, Vencido

**Archivos creados:**
- `app/(dashboard)/compras/nueva/page.tsx`
- `app/(dashboard)/compras/nuevo-gasto/page.tsx`

**Archivos modificados:**
- `app/(dashboard)/compras/page.tsx` - Botones dinámicos según tab activo

---

#### 6. Sección Dedicada de Proveedores

**Decisión de diseño:** Crear sección independiente (no modal) porque "esto luego crecerá y debemos prepararnos"

**Características:**
- CRUD completo: Crear, Leer, Actualizar, Eliminar
- Tabla con todos los proveedores registrados
- Formulario inline para crear/editar
- Campos: Nombre (requerido), Teléfono, Email
- Confirmación antes de eliminar
- Notificaciones toast para feedback

**Archivos creados:**
- `app/(dashboard)/proveedores/page.tsx` - UI completa
- `app/api/proveedores/route.ts` - GET y POST
- `app/api/proveedores/[id]/route.ts` - PUT y DELETE

**Archivos modificados:**
- `components/layouts/sidebar.tsx` - Nuevo item "Proveedores" con ícono Truck

---

#### 7. Categorías Personalizables con "Otros"

**Funcionalidad:** Cuando se selecciona "Otros" en categoría, aparece un campo de texto para especificar una categoría personalizada.

**Implementado en:**
- **Nueva Compra**: Campo "Especificar Categoría" cuando category = "Otros"
  - Placeholder: "Ej: Material de Ortodoncia"
- **Nuevo Gasto**: Campo "Especificar Categoría" cuando category = "Otros"
  - Placeholder: "Ej: Equipamiento de Oficina"

**Lógica:** El valor personalizado reemplaza "Otros" antes de guardar en BD.

**Archivos modificados:**
- `app/(dashboard)/compras/nueva/page.tsx`
- `app/(dashboard)/compras/nuevo-gasto/page.tsx`

---

#### 8. Botones de Creación Rápida

**Funcionalidad:** Crear entidades relacionadas sin salir del flujo actual.

**Implementado:**
- **"+ Nuevo Proveedor"** en formulario Nueva Compra
  - Ubicado junto al label "Proveedor"
  - Abre `/proveedores` en nueva pestaña
  - Permite crear proveedor y regresar al formulario

- **"+ Nuevo Paciente"** en formulario Nueva Venta
  - Ubicado junto al label "Paciente"
  - Abre `/clientes` en nueva pestaña
  - Permite crear paciente y regresar al formulario

**Archivos modificados:**
- `app/(dashboard)/compras/nueva/page.tsx`
- `app/(dashboard)/ventas/nueva/page.tsx`

---

#### 9. CRUD Completo de Pacientes

**Problema resuelto:** El botón "Agregar Cliente" no hacía nada.

**Solución implementada:**
- Formulario inline para crear/editar pacientes
- Botones de editar y eliminar conectados a funciones
- Validación de campos requeridos
- Confirmación antes de eliminar

**Campos del formulario:**
- Documento (requerido)
- Nombre Completo (requerido)
- Género (M/F) - **NUEVO**
- Fecha de Nacimiento
- Teléfono (requerido)
- Email
- EPS
- Dirección
- Notas (textarea)

**Archivos creados:**
- `app/api/patients/[id]/route.ts` - PUT y DELETE endpoints

**Archivos modificados:**
- `app/(dashboard)/clientes/patients-table.tsx` - Formulario completo
- `app/api/patients/route.ts` - POST endpoint
- `prisma/schema.prisma` - Campo gender

---

### 🐛 Correcciones de Bugs

#### Bug: TypeScript Error en Endpoints Dinámicos de Next.js 16
**Error:** `Type 'typeof import("/vercel/path0/app/api/proveedores/[id]/route")' does not satisfy the constraint 'RouteHandler'`

**Causa:** Next.js 16 cambió params de objeto sincrónico a Promise.

**Solución:**
```typescript
// Antes (Next.js 15)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supplier = await prisma.supplier.update({
    where: { id: params.id }
  });
}

// Después (Next.js 16)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supplier = await prisma.supplier.update({
    where: { id }
  });
}
```

**Archivos corregidos:**
- `app/api/proveedores/[id]/route.ts`
- `app/api/patients/[id]/route.ts`

---

### 🗄️ Cambios en Base de Datos

#### Nuevos campos en Sale:
```prisma
model Sale {
  // ... campos existentes
  source           String   @default("manual")  // "alegra" o "manual"
  alegraInvoiceId  String?                      // ID de factura en Alegra
}
```

#### Nuevos campos en Patient:
```prisma
model Patient {
  // ... campos existentes
  gender       String?  // "M" o "F"
}
```

#### Nuevo modelo Supplier:
```prisma
model Supplier {
  id        String     @id @default(cuid())
  name      String
  phone     String?
  email     String?
  purchases Purchase[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}
```

---

### 📦 Commits Realizados

1. **Agregar gestión de proveedores y mejorar formularios**
   - Sección Proveedores con CRUD
   - Botones de creación rápida
   - Campo "Otros" personalizable

2. **Corregir error de TypeScript en endpoints para Next.js 16**
   - Actualizar params a Promise en rutas dinámicas

3. **Implementar formulario de pacientes en Clientes**
   - CRUD completo de pacientes
   - Conectar botones de editar/eliminar

4. **Agregar campo de género (M/F) a pacientes**
   - Selector de género en formulario
   - Actualizar endpoints API

---

### 🎨 Mejoras de UX/UI

- **Formularios más intuitivos** con placeholders descriptivos
- **Feedback visual** con notificaciones toast en todas las acciones
- **Confirmaciones** antes de eliminar registros
- **Campos requeridos** claramente marcados con asterisco rojo
- **Botones de acción rápida** para mejorar el flujo de trabajo
- **Filtros visuales** con badges de colores en tablas
- **KPIs separados** para mejor análisis de datos

---

### 🔧 Compatibilidad

- **Next.js**: 16.0.1 con Turbopack
- **Prisma**: 6.19.0
- **TypeScript**: Strict mode
- **Node.js**: 18+

---

### 📝 Notas para el Futuro

**Decisiones de Diseño:**
1. Secciones dedicadas (vs modales) para entidades que crecerán
2. Auto-login para simplificar uso personal
3. Categorías flexibles con campo "Otros" personalizable
4. Botones de creación rápida para mejorar flujo de trabajo

**Patrones Establecidos:**
- Formularios inline en misma página
- Confirmaciones antes de eliminar
- Toast notifications para feedback
- Campos opcionales claramente diferenciados
- Grid responsivo (md:grid-cols-2, md:grid-cols-3)

**Integraciones Pendientes:**
- Alegra API real (actualmente mock)
- Sincronización automática programada
- OpenAI para chat contextual
- Sistema de notificaciones por email/SMS
