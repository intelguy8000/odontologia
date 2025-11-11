"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface TopTreatmentsChartProps {
  data: Array<{
    treatment: string;
    count: number;
    total: number;
  }>;
}

export function TopTreatmentsChart({ data }: TopTreatmentsChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis
          type="number"
          tick={{ fontSize: 12 }}
          stroke="#666"
        />
        <YAxis
          dataKey="treatment"
          type="category"
          width={150}
          tick={{ fontSize: 12 }}
          stroke="#666"
        />
        <Tooltip
          formatter={(value: number, name: string) => {
            if (name === "count") return [`${value} veces`, "Cantidad"];
            return [`$${value.toLocaleString("es-CO")}`, "Total"];
          }}
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
