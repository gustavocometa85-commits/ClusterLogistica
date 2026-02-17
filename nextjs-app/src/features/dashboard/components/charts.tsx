"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";
import type { ChartData } from "../actions/get-chart-data";

const BRAND_600 = "#4a6785";
const ACCENT_500 = "#f1c40f";

const STATUS_COLORS = ["#eab308", "#3b82f6", "#10b981", "#ef4444"]; // yellow, blue, emerald, red
const EXPENSE_COLORS = [BRAND_600, "#5d7d9a", "#2c3e50", ACCENT_500];

function formatMXN(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
  return `$${value}`;
}

function TooltipMXN({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-card p-3 shadow-card text-sm">
      <p className="font-medium text-text-primary mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(entry.value)}
        </p>
      ))}
    </div>
  );
}

function PieLabel(props: PieLabelRenderProps) {
  const cx = Number(props.cx ?? 0);
  const cy = Number(props.cy ?? 0);
  const midAngle = Number(props.midAngle ?? 0);
  const innerRadius = Number(props.innerRadius ?? 0);
  const outerRadius = Number(props.outerRadius ?? 0);
  const percent = Number(props.percent ?? 0);
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export function DashboardCharts({ data }: { data: ChartData }) {
  const hasMonthly = data.monthly.some((m) => m.ingresos > 0 || m.gastos > 0);
  const hasTripStatus = data.tripStatus.some((s) => s.value > 0);
  const hasExpenseType = data.expenseType.some((e) => e.value > 0);

  if (!hasMonthly && !hasTripStatus && !hasExpenseType) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold tracking-tight">Análisis</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart: Ingresos vs Gastos */}
        {hasMonthly && (
          <div className="bg-surface border border-border rounded-card p-card shadow-card lg:col-span-2">
            <h3 className="text-base font-medium text-text-secondary mb-4">Ingresos vs Gastos (últimos 6 meses)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.monthly} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mes" tick={{ fontSize: 13 }} />
                <YAxis tickFormatter={formatMXN} tick={{ fontSize: 13 }} />
                <Tooltip content={<TooltipMXN />} />
                <Legend />
                <Bar dataKey="ingresos" name="Ingresos" fill={BRAND_600} radius={[4, 4, 0, 0]} />
                <Bar dataKey="gastos" name="Gastos" fill={ACCENT_500} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Pie Chart: Trip Status */}
        {hasTripStatus && (
          <div className="bg-surface border border-border rounded-card p-card shadow-card">
            <h3 className="text-base font-medium text-text-secondary mb-4">Viajes por Estado</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data.tripStatus.filter((s) => s.value > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={PieLabel}
                  outerRadius={110}
                  dataKey="value"
                >
                  {data.tripStatus.map((_, i) => (
                    <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <Tooltip formatter={(value: any) => [value, "Viajes"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Pie Chart: Expense Breakdown */}
        {hasExpenseType && (
          <div className="bg-surface border border-border rounded-card p-card shadow-card">
            <h3 className="text-base font-medium text-text-secondary mb-4">Gastos por Tipo</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data.expenseType.filter((e) => e.value > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={PieLabel}
                  outerRadius={110}
                  dataKey="value"
                >
                  {data.expenseType.map((_, i) => (
                    <Cell key={i} fill={EXPENSE_COLORS[i % EXPENSE_COLORS.length]} />
                  ))}
                </Pie>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <Tooltip formatter={(value: any) => [
                  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(Number(value)),
                  "Monto",
                ]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
