"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SalesChartProps {
  data: Array<{
    date: string;
    amount: number;
  }>;
}

export function SalesChart({ data }: SalesChartProps) {
  // Formatear datos para el gráfico
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("es-CO", {
      month: "short",
      day: "numeric",
    }),
    amount: item.amount,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          stroke="#666"
        />
        <YAxis
          tick={{ fontSize: 12 }}
          stroke="#666"
          tickFormatter={(value) =>
            `$${(value / 1000).toFixed(0)}K`
          }
        />
        <Tooltip
          formatter={(value: number) =>
            `$${value.toLocaleString("es-CO")}`
          }
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="#2563eb"
          strokeWidth={2}
          dot={{ fill: "#2563eb", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
