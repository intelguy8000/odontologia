# CR Dental Studio - Sistema de Gestión

Sistema de gestión integral para el consultorio odontológico CR Dental Studio de Medellín, Colombia.

**Estado**: Desplegado en Vercel con PostgreSQL

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

- **Dashboard** - KPIs, gráficos de ventas, alertas de inventario y cuentas por cobrar
- **Ventas** - Gestión de tratamientos, facturación y planes de pago
- **Inventario** - Control de stock con alertas automáticas
- **Compras & Gastos** - Registro de compras con actualización automática de inventario
- **P&G** - Estado de resultados con márgenes y gráficos
- **Clientes** - Base de datos de pacientes (en progreso)
- **Cuentas por Cobrar** - Planes de pago con cuotas y seguimiento
- **Integraciones** - Gestión de conexiones externas (Alegra, OpenAI)
- **Usuarios** - CRUD de usuarios con sistema de permisos
- **Chat AI** - Asistente flotante con respuestas contextuales

### 🎯 Funcionalidades

- Sistema de autenticación con 3 roles (admin, asistente, readonly)
- Planes de pago flexibles (mensual, quincenal, semanal)
- Importación de facturas desde Alegra (mock)
- Cálculo automático de costos directos e indirectos
- Alertas de inventario bajo y crítico
- Dashboard con métricas en tiempo real
- Sistema de transacciones para integridad de datos
- Logs de auditoría para integraciones

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

## 🔑 Credenciales de Acceso

### Administrador
- **Email**: dra.catalina@crdentalstudio.com
- **Password**: Admin123!

### Asistente
- **Email**: maria@crdentalstudio.com
- **Password**: Asistente123!

### Solo Lectura
- **Email**: juan@crdentalstudio.com
- **Password**: Lectura123!

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

### Config
- Información del consultorio (singleton)

### Integration
- Integraciones con servicios externos (Alegra, OpenAI)

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

## 📝 Próximos Pasos (Opcionales)

- [ ] Completar módulo de Clientes con detalle
- [ ] Módulo de Agenda y Citas
- [ ] Integración real con Alegra API
- [ ] Integración real con OpenAI API para chat
- [ ] Reportes PDF exportables
- [ ] Envío de recordatorios por email/SMS
- [ ] App móvil (React Native)

## 📄 Licencia

Proyecto privado para CR Dental Studio.

---

**Desarrollado para**: Dra. Catalina Rodríguez - CR Dental Studio, Medellín
