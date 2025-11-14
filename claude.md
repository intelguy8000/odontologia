# Claude Code - CR Dental Studio

> Sistema odontológico Dra. Catalina Rodríguez (Medellín)
>
> 🔗 https://github.com/intelguy8000/odontologia
> 🌐 https://odontologia-loop.vercel.app

---

## ⚡ Pre-Commit

1. `npm run build` sin errores
2. No `any` types
3. SOLID principles
4. Commits: `tipo: descripción`

---

## 🔄 Al Retomar

1. Leer `claude.md` (este archivo)
2. Ver `CHANGELOG.md` para cambios recientes
3. Ver `README.md` para arquitectura general
4. Verificar Vercel deployment

---

## 🏗️ Stack

Next.js 16 + TypeScript + PostgreSQL (Vercel) + Prisma 6.19 + Tailwind + shadcn/ui
**Auto-login** como admin (no NextAuth)

---

## 📁 Estructura
```
app/
├── (dashboard)/     # Ventas, Clientes, Compras, Inventario, P&G
├── api/            # CRUD endpoints
└── components/chat/ai-chat.tsx  # Chat AI
```

---

## 🗄️ Modelos Key

**Patient:** `document (unique), fullName, phone, sales[]`
**Sale:** `date, amount, paymentMethod, source, alegraInvoiceId`
**Supplier:** `name, phone, purchases[]`

**Lógica source:**
- `efectivo` → `manual`
- `tarjeta/transferencia/nequi` → `alegra`

---

## 🤖 Chat AI

**Ubicación:** `components/chat/ai-chat.tsx`, `app/api/chat/route.ts`

**Reglas CRÍTICAS:**
1. **18-20 palabras máximo**
2. **Verificar DB siempre** antes responder
3. **NO modo profesor** (solo si piden "explica")
4. **Experto odontológico** que conoce todo
5. **Formato COP:** $15.000.000

**Ejemplos:**
```
❌ "Las ventas están muy bien este mes..."
✅ "Ventas: $15M en 45 transacciones."
```

**Implementación:**
```typescript
// 1. Analizar intención
// 2. Query DB real (prisma)
// 3. Respuesta 18-20 palabras

const sales = await prisma.sale.aggregate({
  where: { date: { gte: startMonth } },
  _sum: { amount: true },
});
return `Ventas: ${sales._sum.amount.toLocaleString('es-CO')}.`;
```

---

## 🎨 Patrones

**Next.js 16 Params:**
```typescript
async function PUT(req, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
}
```

**Formularios:** Inline (no modales)
**Categorías:** Opción "Otros" + campo custom
**Toast:** `toast.success("Guardado")`
**Moneda:** `amount.toLocaleString("es-CO")`

---

## 🚨 Reglas

- NO ejecutar `prisma migrate` local (Vercel migra)
- Campos opcionales = `null` (no string vacío)
- Respuestas Chat: 18-20 palabras máximo

---

## 📚 Quick Ref

**Categorías Compras:** Material Restaurador, Anestesia, Bioseguridad, Instrumental, Otros
**Métodos Pago:** efectivo, tarjeta, transferencia, nequi

---

## 📖 Más Info

Ver `README.md` para arquitectura completa y decisiones de diseño.

---

**Estado:** ✅ Producción en Vercel
**Actualizado:** Nov 2024
