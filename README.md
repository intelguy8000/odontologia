# CR Dental Studio - Sistema de Gestión

Sistema de gestión integral para el consultorio odontológico CR Dental Studio de Medellín, Colombia.

**Estado**: Desplegado en Vercel con PostgreSQL
**Última actualización**: Noviembre 2024

## 🚀 Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Base de Datos**: PostgreSQL (Vercel Postgres) con Prisma ORM
- **Autenticación**: NextAuth.js v5
- **Formularios**: React Hook Form + Zod

## 📋 Características

### ✅ Módulos Completos

- **Dashboard** - KPIs, gráficos de ventas, alertas de inventario y planes de pago
- **Ventas** - Gestión de tratamientos, facturación y planes de pago con distinción Alegra/Manual
- **Inventario** - Control de stock con alertas automáticas
- **Compras & Gastos** - Registro de compras y gastos con formularios completos y categorías personalizables
- **Proveedores** - CRUD completo de proveedores con integración en formulario de compras
- **P&G** - Estado de resultados con márgenes y gráficos
- **Clientes** - Base de datos de pacientes con CRUD completo y campo de género
- **Planes de Pago** - Planes de pago con cuotas y seguimiento
- **Integraciones** - Gestión de conexiones externas con sincronización Alegra automática
- **Usuarios** - CRUD de usuarios con sistema de permisos
- **Chat AI** - Asistente flotante con respuestas contextuales

### 🎯 Funcionalidades

- **Autenticación simplificada** - Auto-login como Dra. Catalina (admin) sin necesidad de credenciales
- **Distinción de ventas** - Sistema de filtrado entre ventas de Alegra y ventas manuales (efectivo/informal)
- **Indicador de sincronización** - Muestra última sincronización con Alegra ("hace 20 minutos")
- **Gestión de proveedores** - Sección dedicada con CRUD completo
- **Formularios de entrada** - Compras y gastos con formularios completos de captura
- **Categorías personalizables** - Campo "Otros" con input personalizado en compras y gastos
- **Botones de creación rápida** - "+ Nuevo Proveedor" y "+ Nuevo Paciente" en formularios
- **Planes de pago flexibles** - Mensual, quincenal, semanal con cuotas variables
- **Cálculo automático** - Costos directos e indirectos, márgenes y totales
- **Alertas de inventario** - Notificaciones de stock bajo y crítico
- **Dashboard en tiempo real** - KPIs actualizados con métricas del mes
- **Registro de pacientes completo** - Incluye género, edad, EPS, contacto y notas
- **Sistema de transacciones** - Integridad de datos en operaciones críticas
- **Logs de auditoría** - Seguimiento de cambios en integraciones

## 🛠️ Setup del Proyecto

### Prerrequisitos

- Node.js 18+ y npm

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/intelguy8000/odontologia.git
   cd cr-dental-studio
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   El archivo `.env` ya está creado con:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="cambiar-en-produccion"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Generar base de datos y ejecutar seed**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run seed
   ```

5. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

6. **Abrir en navegador**

   Navega a [http://localhost:3000](http://localhost:3000)

## 🔑 Acceso al Sistema

El sistema cuenta con **auto-login simplificado**. Al acceder a la aplicación, automáticamente inicias sesión como:

- **Usuario**: Dra. Catalina Rodríguez
- **Rol**: Administrador
- **Email**: dra.catalina@crdentalstudio.com

No se requieren credenciales. El sistema redirige automáticamente al dashboard.

## 📁 Estructura del Proyecto

```
cr-dental-studio/
├── app/                        # App Router de Next.js
│   ├── (dashboard)/           # Rutas protegidas del dashboard
│   │   ├── layout.tsx         # Layout con Sidebar y Header
│   │   └── dashboard/         # Página principal del dashboard
│   ├── api/                   # API routes
│   │   └── auth/              # NextAuth routes
│   └── login/                 # Página de login
├── components/                # Componentes reutilizables
│   ├── layouts/              # Layouts (Sidebar, Header)
│   └── ui/                   # Componentes de shadcn/ui
├── lib/                       # Utilidades y configuraciones
│   └── auth.ts               # Configuración de NextAuth
├── prisma/                    # Schema y seed de Prisma
│   ├── schema.prisma         # Modelos de base de datos
│   └── seed.ts               # Datos iniciales
├── types/                     # Definiciones de tipos TypeScript
│   └── next-auth.d.ts        # Tipos extendidos de NextAuth
└── middleware.ts             # Middleware de protección de rutas
```

## 🗄️ Modelos de Base de Datos

### User
- id, email, password, name, role, status, createdAt, updatedAt

### Patient (Clientes)
- id, document, fullName, **gender (M/F)**, birthDate, phone, email, address, eps, notes

### Supplier (Proveedores)
- id, name, phone, email, createdAt, updatedAt

### Sale (Ventas)
- id, date, patientId, treatment, amount, paymentMethod, status, **source (alegra/manual)**, **alegraInvoiceId**

### Purchase (Compras)
- id, date, supplierId, invoiceNumber, category (personalizable con "Otros"), totalAmount, items[]

### Expense (Gastos)
- id, date, category (personalizable con "Otros"), description, amount, frequency, status

### Config
- Información del consultorio (singleton)

### Integration
- Integraciones con servicios externos (Alegra, OpenAI)
- Incluye lastSync para tracking de sincronizaciones

## 🔐 Roles y Permisos

- **admin**: Acceso completo a todos los módulos
- **asistente**: Acceso a operaciones del día a día
- **readonly**: Solo lectura, sin permisos de edición

## 🧪 Scripts Disponibles

```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Construir para producción
npm run start    # Iniciar servidor de producción
npm run lint     # Ejecutar linter
npm run seed     # Ejecutar seed de base de datos
```

## 🚀 Despliegue en Vercel

Para desplegar este proyecto en Vercel con PostgreSQL, sigue la guía detallada en **[DEPLOY.md](./DEPLOY.md)**

**Pasos rápidos:**
1. Instalar Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Crear DB: `vercel postgres create`
4. Deploy: `vercel --prod`

## 📝 Estado de Desarrollo

### ✅ Completado (Noviembre 2024)
- [x] Módulo de Clientes completo con CRUD y campo de género
- [x] Módulo de Proveedores con CRUD completo
- [x] Formularios de Compras y Gastos con entrada manual
- [x] Distinción entre ventas de Alegra y ventas manuales
- [x] Indicador de última sincronización con Alegra
- [x] Categorías personalizables con campo "Otros"
- [x] Botones de creación rápida en formularios
- [x] Auto-login simplificado

### 🔜 Próximos Pasos (Opcionales)
- [ ] Módulo de Agenda y Citas
- [ ] Integración real con Alegra API (actualmente mock)
- [ ] Integración real con OpenAI API para chat
- [ ] Historia clínica por paciente
- [ ] Reportes PDF exportables
- [ ] Envío de recordatorios por email/SMS
- [ ] App móvil (React Native)

## 📄 Licencia

Proyecto privado para CR Dental Studio.

---

**Desarrollado para**: Dra. Catalina Rodríguez - CR Dental Studio, Medellín
