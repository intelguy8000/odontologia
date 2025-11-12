# Chat AI - Documentación y Roadmap

## Estado Actual

### ✅ Implementado

**Integración y Setup**
- SDK de OpenAI instalado y configurado
- API key configurada en `.env` y Vercel
- Chat visible en todas las páginas del dashboard
- Botón flotante teal en esquina inferior derecha
- Interfaz de chat con preguntas sugeridas

**Funcionalidades Disponibles**
El chat puede responder preguntas sobre:

1. **Ventas del Mes** (`get_sales_summary`)
   - Total de ventas
   - Número de transacciones
   - Filtra solo ventas completadas
   - Usa mismo query que dashboard

2. **Utilidad del Mes** (`get_profit`)
   - Fórmula: Ventas - Gastos
   - Coincide exactamente con dashboard
   - NO incluye compras (esa es P&G completo)

3. **Gastos del Mes** (`get_expenses_summary`)
   - Total de gastos
   - Número de gastos registrados

4. **Inventario** (`get_inventory_status`)
   - Items críticos y bajos
   - Top 10 items por stock
   - Solo campos necesarios (optimizado)

5. **Cuentas por Cobrar** (`get_accounts_receivable`)
   - Total por cobrar
   - Planes activos
   - Cuotas vencidas

6. **P&G Completo** (`get_pyg_summary`)
   - Ingresos, costos directos, gastos
   - Utilidad neta (ventas - compras - gastos)
   - Margen bruto
   - Diferente a "utilidad del mes" del dashboard

7. **Tratamientos Top** (`get_top_treatments`)
   - Top 3 tratamientos más rentables
   - Cuenta y revenue por tratamiento

**Optimizaciones de Performance**
- Queries con `aggregate()` en vez de `findMany()`
- Queries paralelas con `Promise.all`
- Solo selecciona campos necesarios
- Límites en resultados (top 3, top 10)

**Personalización**
- Respuestas ultra-concisas (máximo 10 palabras)
- Solo responde lo que se pregunta
- Formato colombiano (COP, puntos como separadores)
- Español colombiano profesional
- Colores teal matching brand

---

## 🔴 Problemas Conocidos

### 1. Velocidad de Respuesta
**Estado:** Lento (2-3 segundos)
**Causa:**
- Llamada a OpenAI API
- Function calling requiere 2 llamadas (detect function + respuesta)
- Queries a base de datos

**Solución Pendiente:**
- Implementar streaming de respuestas
- Cache para queries frecuentes
- Considerar modelo más rápido (gpt-3.5-turbo)

### 2. Respuestas Prolijas
**Estado:** Mejorado pero aún puede dar info extra
**Causa:** GPT-4o-mini tiende a explicar
**Prompt Actual:**
```
Máximo 10 palabras. Usa formato: $7.480.000 COP.
Profesional, directo, sin explicaciones adicionales.
```

**Solución Pendiente:**
- Ajustar prompt con ejemplos específicos
- Usar `temperature: 0` para respuestas más deterministas
- Post-procesar respuesta para extraer solo número/dato

### 3. Contexto Limitado
**Estado:** Sin memoria de conversación
**Causa:** Cada pregunta es independiente
**Ejemplo:**
```
User: ¿Cuánto vendimos?
Bot: $7.480.000 COP
User: ¿Y el mes pasado?
Bot: No puedo comparar (no tiene contexto)
```

**Solución Pendiente:**
- Implementar memoria de conversación
- Guardar últimos 5 mensajes en estado
- Permitir preguntas de seguimiento

### 4. No Maneja Fechas Personalizadas
**Estado:** Solo puede consultar mes actual
**Causa:** Funciones hardcodeadas a mes actual
**Ejemplo:**
```
User: ¿Ventas de octubre?
Bot: Solo puedo ver mes actual
```

**Solución Pendiente:**
- Agregar parámetro `month` a funciones
- Parsear fechas en lenguaje natural
- Permitir rangos (semana pasada, último trimestre)

---

## 📋 Plan de Mejoras

### Prioridad ALTA

#### 1. Optimizar Velocidad
**Tiempo:** 2-3 horas
**Tareas:**
- [ ] Implementar streaming de OpenAI
- [ ] Usar `gpt-4o-mini` o `gpt-3.5-turbo`
- [ ] Cache Redis para queries frecuentes (5 min TTL)
- [ ] Loader animado mientras consulta

**Código:**
```typescript
// Streaming example
const stream = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages,
  stream: true,
});

for await (const chunk of stream) {
  // Send chunk to client
}
```

#### 2. Respuestas Más Concisas
**Tiempo:** 1 hora
**Tareas:**
- [ ] Agregar ejemplos al system prompt
- [ ] Set `temperature: 0`
- [ ] Post-procesar para extraer solo datos
- [ ] Regex para detectar y limpiar texto extra

**Nuevo Prompt:**
```typescript
const systemPrompt = `Asistente de CR Dental Studio en Colombia.
RESPONDE SOLO CON EL DATO. Sin explicaciones.

Ejemplos:
User: ¿Ventas?
Bot: $7.480.000 COP

User: ¿Utilidad?
Bot: -$4.470.000 COP

User: ¿Inventario bajo?
Bot: Guantes L (0), Resina A3 (2), Lidocaína (5)

Formato: $X.XXX.XXX COP. Máximo 10 palabras.`;
```

#### 3. Agregar Memoria de Conversación
**Tiempo:** 2 horas
**Tareas:**
- [ ] Guardar últimos 5 mensajes en estado React
- [ ] Enviar historial a OpenAI en cada llamada
- [ ] Botón "Nueva conversación" para limpiar
- [ ] Límite de 10 mensajes (liberar memoria)

**Código:**
```typescript
const [messages, setMessages] = useState<Message[]>([]);

// En handleSend
const allMessages = [
  { role: "system", content: systemPrompt },
  ...messages.map(m => ({ role: m.role, content: m.content })),
  { role: "user", content: input },
];
```

### Prioridad MEDIA

#### 4. Soporte para Fechas Personalizadas
**Tiempo:** 3-4 horas
**Tareas:**
- [ ] Agregar parámetro `month` a todas las funciones
- [ ] Parsear fechas naturales ("mes pasado", "octubre", "Q3")
- [ ] Librería `chrono-node` para parsing
- [ ] Validar rangos (no futuro, no > 2 años atrás)

**Ejemplo:**
```typescript
// Function definition
{
  name: "get_sales_summary",
  parameters: {
    type: "object",
    properties: {
      month: {
        type: "string",
        description: "Mes en formato 'YYYY-MM' o lenguaje natural ('mes pasado', 'octubre 2024')",
      },
    },
  },
}

// Implementation
async function get_sales_summary(args: { month?: string }) {
  const date = args.month ? parseDate(args.month) : new Date();
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  // ... rest
}
```

#### 5. Comparaciones Temporales
**Tiempo:** 2 horas
**Tareas:**
- [ ] Función `compare_periods` para comparar meses
- [ ] Calcular % de cambio automáticamente
- [ ] Responder "vs mes anterior" sin pregunta explícita

**Ejemplo:**
```
User: ¿Cómo van las ventas?
Bot: $7.480.000 COP (+12% vs mes anterior)
```

#### 6. Alertas Proactivas
**Tiempo:** 3 horas
**Tareas:**
- [ ] Detectar situaciones críticas automáticamente
- [ ] Badge con número de alertas en botón flotante
- [ ] Notificación al abrir chat si hay alertas
- [ ] Categorías: inventario, cuentas vencidas, gastos altos

**UI:**
```typescript
<Button className="relative">
  <MessageCircle />
  {alerts > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs">
      {alerts}
    </span>
  )}
</Button>
```

### Prioridad BAJA

#### 7. Gráficos y Visualizaciones
**Tiempo:** 4-5 horas
**Tareas:**
- [ ] Generar gráficos inline en respuestas
- [ ] Librería `recharts` mini charts
- [ ] Sparklines para tendencias
- [ ] Solo si pregunta requiere visualización

#### 8. Exportar Conversaciones
**Tiempo:** 2 horas
**Tareas:**
- [ ] Botón "Exportar chat" a PDF/TXT
- [ ] Historial de conversaciones guardado
- [ ] Búsqueda en conversaciones antiguas

#### 9. Sugerencias Inteligentes
**Tiempo:** 3 horas
**Tareas:**
- [ ] Detectar contexto y sugerir siguiente pregunta
- [ ] Ej: después de "ventas", sugerir "¿utilidad?" o "¿vs mes anterior?"
- [ ] Análisis de patrones de uso

#### 10. Multi-idioma
**Tiempo:** 2 horas
**Tareas:**
- [ ] Detectar idioma automáticamente
- [ ] Soporte inglés/español
- [ ] Mantener formato COP siempre

---

## 🔧 Configuración Actual

### Variables de Entorno
```bash
# .env
OPENAI_API_KEY="sk-proj-..."

# Vercel (ya configurado)
vercel env add OPENAI_API_KEY
```

### Archivos Principales
```
app/api/chat/route.ts          # API endpoint con function calling
components/chat/ai-chat.tsx    # UI del chat
app/(dashboard)/layout.tsx     # Chat agregado al layout
```

### Funciones Disponibles
```typescript
get_sales_summary()           // Ventas del mes
get_profit()                  // Utilidad (ventas - gastos)
get_expenses_summary()        // Gastos del mes
get_inventory_status()        // Inventario crítico/bajo
get_accounts_receivable()     // Cuentas por cobrar
get_pyg_summary()            // P&G completo con márgenes
get_top_treatments()         // Top 3 tratamientos
```

### Modelo Usado
- **Modelo:** `gpt-4o-mini`
- **Temperatura:** Default (0.7) - CAMBIAR A 0 para concisión
- **Max tokens:** Default
- **Functions:** Enabled con auto function_call

---

## 🐛 Debug y Testing

### Cómo Testear Localmente
```bash
# 1. Asegurarse que API key esté en .env
cat .env | grep OPENAI

# 2. Levantar dev server
npm run dev

# 3. Ir a dashboard y abrir chat
# 4. Probar cada función:

Preguntas de test:
- "¿Cuánto vendimos este mes?"          → get_sales_summary
- "¿Cuál es la utilidad?"               → get_profit
- "¿Cuánto gastamos?"                   → get_expenses_summary
- "¿Qué inventario está bajo?"          → get_inventory_status
- "¿Cuánto nos deben?"                  → get_accounts_receivable
- "Dame el P&G"                         → get_pyg_summary
- "¿Tratamientos más rentables?"        → get_top_treatments
```

### Ver Logs de OpenAI
```typescript
// En route.ts, agregar console.logs
console.log("Function called:", responseMessage.function_call?.name);
console.log("Function result:", functionResult);
console.log("Final response:", responseMessage.content);
```

### Errores Comunes
1. **"No pude procesar tu pregunta"**
   - API key inválida o expirada
   - OpenAI service down
   - Rate limit excedido

2. **Respuesta vacía**
   - Function no encontrada en switch
   - Error en query de Prisma
   - Revisar logs del servidor

3. **Datos incorrectos**
   - Verificar que función use `status: "completada"`
   - Verificar fechas (startOfMonth)
   - Comparar query con dashboard.service.ts

---

## 📊 Métricas a Monitorear

### Performance
- [ ] Tiempo de respuesta promedio (<2s meta)
- [ ] Tasa de error de queries
- [ ] Cache hit rate (cuando se implemente)

### Uso
- [ ] Preguntas más frecuentes
- [ ] Funciones más llamadas
- [ ] Horario de uso peak
- [ ] Usuarios más activos

### Calidad
- [ ] Satisfacción de respuestas (thumbs up/down)
- [ ] Preguntas sin respuesta válida
- [ ] Comparación con datos reales del dashboard

---

## 🚀 Deploy Checklist

Antes de cada deploy del chat:
- [ ] Build local exitoso (`npm run build`)
- [ ] Testear todas las funciones manualmente
- [ ] Verificar que datos coincidan con dashboard
- [ ] Confirmar API key en Vercel
- [ ] Probar en producción después de deploy
- [ ] Monitorear logs por 5 minutos post-deploy

---

## 📞 Contacto y Soporte

**Problemas con OpenAI:**
- Docs: https://platform.openai.com/docs
- Status: https://status.openai.com
- Dashboard: https://platform.openai.com/usage

**Prisma Optimization:**
- Docs: https://www.prisma.io/docs/concepts/components/prisma-client/aggregation-grouping-summarizing

**Preguntas Frecuentes:**

**Q: ¿Por qué el chat es lento?**
A: Function calling requiere 2 llamadas a OpenAI. Ver "Prioridad ALTA #1" para optimizar.

**Q: ¿Por qué da info extra que no pedí?**
A: GPT-4o-mini tiende a explicar. Ver "Prioridad ALTA #2" para arreglar.

**Q: ¿Cómo agregar una nueva función?**
A:
1. Agregar definición en `functions` array
2. Implementar función async
3. Agregar case en `executeFunction`
4. Probar localmente
5. Deploy

**Q: ¿Puedo cambiar el modelo?**
A: Sí, en `route.ts` línea con `model: "gpt-4o-mini"`. Opciones:
- `gpt-3.5-turbo` (más rápido, menos preciso)
- `gpt-4o` (más preciso, más caro)
- `gpt-4o-mini` (balance actual)

---

## ✅ Próximos Pasos Inmediatos

**Para la próxima sesión:**

1. **Optimizar Velocidad** (Prioridad ALTA #1)
   - Tiempo estimado: 2-3 horas
   - Impacto: Alto (mejora UX significativamente)
   - Implementar streaming + cache

2. **Mejorar Concisión** (Prioridad ALTA #2)
   - Tiempo estimado: 1 hora
   - Impacto: Alto (reduce frustración del usuario)
   - Ajustar prompt + temperature: 0

3. **Agregar Memoria** (Prioridad ALTA #3)
   - Tiempo estimado: 2 horas
   - Impacto: Medio (permite conversaciones naturales)
   - Guardar últimos 5 mensajes

**Total:** 5-6 horas de trabajo

---

*Última actualización: 2025-11-12*
*Estado: En producción con mejoras pendientes*
