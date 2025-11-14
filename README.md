# CR Dental Studio - Sistema de Gestión Odontológica

Sistema integral de gestión para consultorio odontológico especializado en Diseños de Sonrisa.

![Estado](https://img.shields.io/badge/Estado-Producción-success)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

🌐 **Producción:** https://odontologia-loop.vercel.app
📦 **Repo:** https://github.com/intelguy8000/odontologia

---

## 📋 Descripción

Sistema web para **CR Dental Studio** (Medellín, Colombia) que permite a la Dra. Catalina Rodríguez gestionar:

- 💰 **Ventas** por tratamiento (con distinción Alegra/Manual)
- 👥 **Clientes/Pacientes** con historial completo
- 📦 **Inventario** con alertas automáticas
- 🛒 **Compras** a proveedores con items dinámicos
- 💸 **Gastos** operacionales categorizados
- 📊 **P&G** (Estado de resultados) automático
- 💳 **Planes de Pago** con cuotas y seguimiento
- 🤖 **Chat AI** experto en el negocio

---

## 🚀 Tech Stack

### Frontend
- **Next.js 16** (App Router + Turbopack)
- **TypeScript** (strict mode)
- **Tailwind CSS** para estilos
- **shadcn/ui** componentes base
- **Recharts** para gráficos
- **Sonner** para notificaciones

### Backend
- **Next.js API Routes**
- **Prisma ORM 6.19**
- **PostgreSQL** (Vercel Postgres)

### Deployment
- **Vercel** (CI/CD automático desde GitHub)
- **Auto-deploy** en push a main

---

## 📁 Arquitectura
```
cr-dental-studio/
├── app/
│   ├── (dashboard)/        # Rutas protegidas
│   │   ├── dashboard/     # KPIs y resumen
│   │   ├── ventas/        # Gestión de ventas
│   │   ├── clientes/      # CRUD de pacientes
│   │   ├── compras/       # Compras a proveedores
│   │   ├── proveedores/   # CRUD de proveedores
│   │   ├── inventario/    # Control de stock
│   │   ├── cuentas-por-cobrar/  # Planes de pago
│   │   ├── pyg/           # Estado de resultados
│   │   └── configuracion/ # Settings
│   ├── api/               # REST endpoints
│   └── login/             # Auto-login (redirige)
├── components/
│   ├── ui/                # shadcn components
│   ├── chat/              # Chat AI
│   └── layouts/           # Sidebar, Header
├── lib/
│   ├── prisma.ts          # DB client
│   ├── auth.ts            # Auto-login config
│   └── services/          # Business logic
├── prisma/
│   ├── schema.prisma      # DB models
│   └── seed.ts            # Data inicial
├── claude.md              # Guía para Claude Code
└── CHANGELOG.md           # Historia de cambios
```

---

## 🔑 Decisiones de Diseño

### 1. Auto-Login
**Decisión:** Sistema sin autenticación tradicional
**Razón:** Uso personal de una sola usuaria (Dra. Catalina)
**Implementación:** Usuario siempre logueado como admin

### 2. Source en Ventas
**Decisión:** Campo `source` diferencia ventas Alegra vs Manual
**Razón:** Ventas con efectivo son informales (amigos/familia), resto son formales (facturadas)
**Impacto:** Reportes tributarios más precisos

### 3. Secciones Dedicadas
**Decisión:** Proveedores y Clientes tienen rutas propias (no modales)
**Razón:** Preparación para escalabilidad futura
**Filosofía:** "Esto luego crecerá"

### 4. PostgreSQL en Producción
**Decisión:** NO usar DB local en desarrollo
**Razón:** Vercel maneja migraciones automáticamente
**Workflow:** Push a GitHub → Vercel migra y despliega

### 5. Chat AI con Respuestas Cortas
**Decisión:** Máximo 18-20 palabras por defecto
**Razón:** Respuestas directas y accionables
**Filosofía:** "No modo profesor, solo datos"

---

## 🗄️ Modelos de Datos Principales

### Patient (Pacientes)
```prisma
{
  id, document (unique), fullName, gender, birthDate,
  phone, email, address, eps, notes,
  sales[], paymentPlans[]
}
```

### Sale (Ventas)
```prisma
{
  date, patientId, treatment, amount,
  paymentMethod, status,
  source,          // "manual" o "alegra"
  alegraInvoiceId  // ID factura Alegra (si aplica)
}
```

**Lógica de source:**
- Método efectivo → `source: "manual"`
- Método tarjeta/transferencia/nequi → `source: "alegra"`

### Purchase (Compras)
```prisma
{
  date, supplierId, invoiceNumber,
  category, totalAmount,
  items[]  // Tabla dinámica de productos
}
```

### PaymentPlan (Planes de Pago)
```prisma
{
  patientId, treatment, totalAmount,
  downPayment, numberOfFees, feeAmount,
  frequency, startDate, status,
  fees[]  // Cuotas generadas automáticamente
}
```

---

## ⚙️ Setup Local (Opcional)

> **Nota:** Este proyecto está configurado para producción en Vercel.
> No es necesario setup local para contribuir (push directo a GitHub).

Si deseas correr localmente:
```bash
# Clonar repo
git clone https://github.com/intelguy8000/odontologia.git
cd odontologia

# Instalar dependencias
npm install

# Variables de entorno (.env)
DATABASE_URL="postgresql://..." # Usar tu propia DB o Vercel Postgres

# Sincronizar schema
npx prisma generate
npx prisma db push

# Seed data (opcional)
npx prisma db seed

# Desarrollo
npm run dev
```

Abre http://localhost:3000

---

## 🚀 Deploy

### Automático (Recomendado)
1. Push a `main` branch
2. Vercel detecta cambios
3. Ejecuta build y migraciones
4. Deploy automático

### Manual (Vercel CLI)
```bash
vercel --prod
```

---

## 🤖 Chat AI - Agente Experto

El sistema incluye un asistente AI con conocimiento completo del negocio.

**Capacidades:**
- Consultar ventas, inventario, cuentas por cobrar en lenguaje natural
- Calcular métricas y tendencias
- Detectar alertas (inventario bajo, cuotas vencidas)
- Respuestas ultra-cortas (18-20 palabras) verificadas en DB

**Ejemplos:**
```
Usuario: "¿ventas del mes?"
Bot: "Ventas: $15M en 45 transacciones."

Usuario: "¿inventario crítico?"
Bot: "3 productos críticos: Guantes L, Resina A3, Lidocaína."
```

---

## 📊 Funcionalidades Principales

### Dashboard
- KPIs en tiempo real (ventas, gastos, utilidad, cobros)
- Gráficos de tendencias
- Alertas de inventario bajo

### Ventas
- Registro manual de ventas
- Importación desde Alegra (próximamente)
- Filtros por fecha, paciente, método de pago
- Distinción ventas formales vs informales

### Clientes
- CRUD completo inline (sin modales)
- Historial de tratamientos
- Gestión de planes de pago

### Inventario
- Control de stock en tiempo real
- Alertas automáticas (crítico/bajo)
- Export a Excel

### Compras
- Registro con items dinámicos
- Vinculación a proveedores
- Categorías personalizables

### P&G
- Estado de resultados automático
- Cálculo de márgenes
- Comparativas por período

---

## 🛠️ Comandos Útiles
```bash
# Desarrollo
npm run dev              # Servidor desarrollo
npm run build            # Build producción
npm run lint             # Linter

# Base de datos
npx prisma studio        # UI para ver datos
npx prisma generate      # Regenerar cliente
npx prisma db push       # Sincronizar schema (no local)

# Deploy
git push origin main     # Auto-deploy Vercel
```

---

## 📝 Contribuir

1. Revisar `claude.md` para guía técnica
2. Revisar `CHANGELOG.md` para cambios recientes
3. Hacer cambios en branch
4. Commit con formato: `tipo: descripción`
5. Push a GitHub (Vercel despliega automáticamente)

---

## 👥 Créditos

**Desarrollador:** Juan Andrés
**Cliente:** Dra. Catalina Rodríguez - CR Dental Studio
**Ubicación:** Medellín, Colombia
**Asistente AI:** Claude (Anthropic) + Claude Code

---

## 📄 Licencia

Proyecto privado para CR Dental Studio.

---

**Última actualización:** Noviembre 2024
**Versión:** 1.0 (Producción estable)
