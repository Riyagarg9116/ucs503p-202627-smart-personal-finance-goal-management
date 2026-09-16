import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Wallet,
  AlertTriangle,
  Target,
  Utensils,
  ShoppingBag,
  Car,
  Receipt,
} from "lucide-react"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

function Insights() {
  const categoryData = [
    { name: "Food", amount: 4500 },
    { name: "Bills", amount: 4100 },
    { name: "Shopping", amount: 3200 },
    { name: "Transport", amount: 2800 },
    { name: "Entertainment", amount: 1800 },
    { name: "Other", amount: 2250 },
  ]

  const monthlyData = [
    { month: "Apr", amount: 14500 },
    { month: "May", amount: 16200 },
    { month: "Jun", amount: 13800 },
    { month: "Jul", amount: 17100 },
    { month: "Aug", amount: 15400 },
    { month: "Sep", amount: 18650 },
  ]

  const pieData = [
    { name: "Food", value: 4500 },
    { name: "Bills", value: 4100 },
    { name: "Shopping", value: 3200 },
    { name: "Transport", value: 2800 },
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

  const totalExpenses = categoryData.reduce(
    (total, item) => total + item.amount,
    0
  )

  const totalIncome = 45000

  const savings = totalIncome - totalExpenses

  const savingsRate = Math.round(
    (savings / totalIncome) * 100
  )

  const highestCategory = categoryData.reduce(
    (highest, item) =>
      item.amount > highest.amount ? item : highest,
    categoryData[0]
  )

  const formatCurrency = (amount) => {
    return `₹${Number(amount).toLocaleString("en-IN")}`
  }

  const getCategoryIcon = (category) => {
    if (category === "Food") {
      return <Utensils size={20} />
    }

    if (category === "Shopping") {
      return <ShoppingBag size={20} />
    }

    if (category === "Transport") {
      return <Car size={20} />
    }

    if (category === "Bills") {
      return <Receipt size={20} />
    }

    return <Wallet size={20} />
  }

  return (
    <div className="min-h-screen bg-[#F8E8F0] p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#41366C]">
          Financial Insights
        </h1>

        <p className="mt-2 text-[#644984]">
          Understand your spending patterns and make smarter
          financial decisions.
        </p>
      </div>

      {/* Key Insight Cards */}
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {/* Total Spending */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#F3E0E0] p-3">
              <TrendingDown
                size={24}
                className="text-[#C76B6B]"
              />
            </div>

            <div>
              <p className="text-sm text-[#644984]">
                Total Spending
              </p>

              <h2 className="text-2xl font-bold text-[#C76B6B]">
                {formatCurrency(totalExpenses)}
              </h2>
            </div>
          </div>

          <p className="mt-4 text-sm text-[#644984]">
            Your expenses this month
          </p>
        </div>

        {/* Savings */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#E1EDE5] p-3">
              <Wallet
                size={24}
                className="text-[#5F8D72]"
              />
            </div>

            <div>
              <p className="text-sm text-[#644984]">
                Monthly Savings
              </p>

              <h2 className="text-2xl font-bold text-[#5F8D72]">
                {formatCurrency(savings)}
              </h2>
            </div>
          </div>

          <p className="mt-4 text-sm text-[#644984]">
            Money remaining after expenses
          </p>
        </div>

        {/* Savings Rate */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#E8CEE5] p-3">
              <TrendingUp
                size={24}
                className="text-[#644984]"
              />
            </div>

            <div>
              <p className="text-sm text-[#644984]">
                Savings Rate
              </p>

              <h2 className="text-2xl font-bold text-[#41366C]">
                {savingsRate}%
              </h2>
            </div>
          </div>

          <p className="mt-4 text-sm text-[#644984]">
            Percentage of income saved
          </p>
        </div>

        {/* Highest Spending */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#F8E8F0] p-3">
              <AlertTriangle
                size={24}
                className="text-[#B07EAA]"
              />
            </div>

            <div>
              <p className="text-sm text-[#644984]">
                Highest Spending
              </p>

              <h2 className="text-xl font-bold text-[#41366C]">
                {highestCategory.name}
              </h2>
            </div>
          </div>

          <p className="mt-4 text-sm text-[#644984]">
            {formatCurrency(highestCategory.amount)} spent
          </p>
        </div>
      </div>

      {/* Smart Insight */}
      <div className="mt-8 rounded-2xl bg-[#644984] p-6 text-white shadow-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-[#CF82A7] p-3">
            <Lightbulb size={25} />
          </div>

          <div>
            <h2 className="text-xl font-bold">
              Smart Insight
            </h2>

            <p className="mt-2 leading-7 text-[#F8E8F0]">
              Food is currently your highest spending category.
              You have spent {formatCurrency(highestCategory.amount)}{" "}
              this month. Reducing food expenses by even 10% could
              save around{" "}
              {formatCurrency(highestCategory.amount * 0.1)}{" "}
              this month.
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        {/* Monthly Trend */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-[#41366C]">
              Spending Trend
            </h2>

            <p className="mt-1 text-sm text-[#644984]">
              Your monthly expenses over the last six months.
            </p>
          </div>

          <div className="mt-6 h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis
                  tickFormatter={(value) =>
                    `₹${value / 1000}k`
                  }
                />

                <Tooltip
                  formatter={(value) => [
                    formatCurrency(value),
                    "Expenses",
                  ]}
                />

                <Bar
                  dataKey="amount"
                  fill="#644984"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Distribution */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-[#41366C]">
              Expense Distribution
            </h2>

            <p className="mt-1 text-sm text-[#644984]">
              See where your money is going this month.
            </p>
          </div>

          <div className="mt-4 h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={105}
                  label={({ name }) => name}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => [
                    formatCurrency(value),
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category Analysis */}
      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#41366C]">
            Category Analysis
          </h2>

          <p className="mt-1 text-sm text-[#644984]">
            Detailed breakdown of your spending categories.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categoryData.map((category) => {
            const percentage = Math.round(
              (category.amount / totalExpenses) * 100
            )

            return (
              <div
                key={category.name}
                className="rounded-xl border border-[#E8CEE5] p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-[#E8CEE5] p-2 text-[#644984]">
                      {getCategoryIcon(category.name)}
                    </div>

                    <div>
                      <h3 className="font-semibold text-[#41366C]">
                        {category.name}
                      </h3>

                      <p className="text-sm text-[#644984]">
                        {percentage}% of expenses
                      </p>
                    </div>
                  </div>

                  <p className="font-bold text-[#41366C]">
                    {formatCurrency(category.amount)}
                  </p>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E8CEE5]">
                  <div
                    className="h-full rounded-full bg-[#CF82A7]"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#E8CEE5] p-3">
              <Target
                size={23}
                className="text-[#644984]"
              />
            </div>

            <h2 className="text-xl font-bold text-[#41366C]">
              Savings Recommendation
            </h2>
          </div>

          <p className="mt-4 leading-7 text-[#644984]">
            You are currently saving {savingsRate}% of your
            income. Try increasing your savings gradually by
            reducing non-essential expenses.
          </p>

          <div className="mt-5 rounded-xl bg-[#F8E8F0] p-4">
            <p className="text-sm text-[#644984]">
              Suggested additional savings
            </p>

            <p className="mt-1 text-xl font-bold text-[#41366C]">
              {formatCurrency(4500)}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#F3E0E0] p-3">
              <AlertTriangle
                size={23}
                className="text-[#C76B6B]"
              />
            </div>

            <h2 className="text-xl font-bold text-[#41366C]">
              Spending Alert
            </h2>
          </div>

          <p className="mt-4 leading-7 text-[#644984]">
            Your spending has increased compared with some
            previous months. Keep an eye on{" "}
            <span className="font-semibold text-[#41366C]">
              {highestCategory.name}
            </span>{" "}
            expenses to stay within your budget.
          </p>

          <div className="mt-5 rounded-xl bg-[#F3E0E0] p-4">
            <p className="text-sm text-[#644984]">
              Highest expense category
            </p>

            <p className="mt-1 text-xl font-bold text-[#C76B6B]">
              {highestCategory.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Insights