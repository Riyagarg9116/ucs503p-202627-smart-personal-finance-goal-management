import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const spendingData = [
  { name: "Food", value: 4500 },
  { name: "Shopping", value: 3200 },
  { name: "Transport", value: 2800 },
  { name: "Bills", value: 4100 },
  { name: "Entertainment", value: 1800 },
  { name: "Other", value: 2250 },
]

const COLORS = [
  "#E09DC3",
  "#CF82A7",
  "#B07EAA",
  "#644984",
  "#41366C",
  "#E8CEE5",
]

function SpendingChart() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">

      {/* Chart Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-[#41366C]">
          Spending Overview
        </h2>

        <p className="mt-1 text-sm text-[#644984]">
          Your expenses by category this month
        </p>
      </div>

      {/* Pie Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>

            <Pie
              data={spendingData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              label={({ name }) => name}
              labelLine={false}
            >
              {spendingData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            {/* Hover Tooltip */}
            <Tooltip
              formatter={(value, name) => [
                `₹${value.toLocaleString("en-IN")}`,
                name,
              ]}
            />

          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}

export default SpendingChart