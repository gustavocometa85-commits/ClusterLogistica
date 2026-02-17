interface KpiCardProps {
  title: string;
  value: string;
  icon: string;
  color: "green" | "red" | "blue" | "amber";
}

const colorMap = {
  green: "bg-emerald-50 border-emerald-200 text-emerald-700",
  red: "bg-red-50 border-red-200 text-red-700",
  blue: "bg-blue-50 border-blue-200 text-blue-700",
  amber: "bg-amber-50 border-amber-200 text-amber-700",
};

const iconBgMap = {
  green: "bg-emerald-100",
  red: "bg-red-100",
  blue: "bg-blue-100",
  amber: "bg-amber-100",
};

export function KpiCard({ title, value, icon, color }: KpiCardProps) {
  return (
    <div
      className={`rounded-xl border p-5 transition-transform hover:-translate-y-1 ${colorMap[color]}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${iconBgMap[color]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
