interface KpiCardProps {
  title: string;
  value: string;
  icon: string;
  color: "green" | "red" | "blue" | "amber";
}

const colorMap = {
  green: "bg-emerald-50 border-emerald-100 text-emerald-700",
  red: "bg-red-50 border-red-100 text-red-700",
  blue: "bg-blue-50 border-blue-100 text-blue-700",
  amber: "bg-amber-50 border-amber-100 text-amber-700",
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
      className={`rounded-card border p-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 ${colorMap[color]}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-60">{title}</p>
          <p className="text-2xl font-semibold mt-2 tracking-tight">{value}</p>
        </div>
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center text-xl ${iconBgMap[color]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
