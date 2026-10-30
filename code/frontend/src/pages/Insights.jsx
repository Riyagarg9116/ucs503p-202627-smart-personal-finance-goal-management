
import { useEffect, useState } from "react"
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
  const [transactions, setTransactions] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState("")
const [mlInsights, setMlInsights] = useState(null);
const [mlError, setMlError] = useState("");
useEffect(() => {
  const fetchTransactions = async () => {
    const token = localStorage.getItem("token")

    if (!token) {
      setError("Please log in again.")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError("")

      const response = await fetch(
        "http://localhost:8080/api/transactions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error("Could not load transactions.")
      }

      const data = await response.json()
      setTransactions(data)
    } catch (err) {
      setError(err.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  fetchTransactions()
}, [])
useEffect(() => {
  const fetchMLInsights = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMlError("Please log in again.");
      return;
    }

    try {
      setMlError("");

      const response = await fetch(
        "http://localhost:8080/api/ml/insights",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `ML insights request failed: ${response.status}`
        );
      }

      const data = await response.json();

      setMlInsights(data);
      console.log("ML insights received:", data);
    } catch (error) {
      console.error("ML insights error:", error);
      setMlError(error.message);
    }
  };

  fetchMLInsights();
}, []);

 
const currentMonth = new Date().getMonth()
const currentYear = new Date().getFullYear()

const currentMonthTransactions = transactions.filter((transaction) => {
  const date = new Date(transaction.transactionDate + "T00:00:00")

  return (
    date.getMonth() === currentMonth &&
    date.getFullYear() === currentYear
  )
})

const expenseTransactions = currentMonthTransactions.filter(
  (transaction) =>
    transaction.transactionType?.toLowerCase() === "expense"
)

const categoryTotals = {}


expenseTransactions.forEach((transaction) => {
  const category = transaction.category

  if (category?.categoryType?.toLowerCase() === "income") {
    return
  }

  const categoryName = category?.categoryName || "Other"

  categoryTotals[categoryName] =
    (categoryTotals[categoryName] || 0) +
    Number(transaction.amount || 0)
})


const categoryData = Object.entries(categoryTotals).map(
  ([name, amount]) => ({ name, amount })
)


  
const monthlyData = Array.from({ length: 6 }, (_, index) => {
  const date = new Date()
  date.setDate(1)
  date.setMonth(date.getMonth() - (5 - index))

  const year = date.getFullYear()
  const monthIndex = date.getMonth()

  const amount = transactions.reduce((total, transaction) => {
    const transactionDate = new Date(
      transaction.transactionDate + "T00:00:00"
    )

    const isExpense =
      transaction.transactionType?.toLowerCase() === "expense"

    if (
      isExpense &&
      transactionDate.getFullYear() === year &&
      transactionDate.getMonth() === monthIndex
    ) {
      return total + Number(transaction.amount || 0)
    }

    return total
  }, 0)

  return {
    month: date.toLocaleString("en-IN", { month: "short" }),
    amount,
  }
})


 
const pieData = categoryData.map((category) => ({
  name: category.name,
  value: category.amount,
}))


  const COLORS = [
    "#E09DC3",
    "#CF82A7",
    "#B07EAA",
    "#644984",
    "#41366C",
    "#E8CEE5",
  ]

  
const totalExpenses = currentMonthTransactions
  .filter(
    (transaction) =>
      transaction.transactionType?.toLowerCase() === "expense"
  )
  .reduce(
    (total, transaction) =>
      total + Number(transaction.amount || 0),
    0
  );

const totalIncome = currentMonthTransactions
  .filter(
    (transaction) =>
      transaction.transactionType?.toLowerCase() === "income"
  )
  .reduce(
    (total, transaction) =>
      total + Number(transaction.amount || 0),
    0
  )

const savings = totalIncome - totalExpenses

const savingsRate =
  totalIncome > 0
    ? Math.round((savings / totalIncome) * 100)
    : 0

const highestCategory = categoryData.reduce(
  (highest, item) =>
    item.amount > highest.amount ? item : highest,
  { name: "No expenses yet", amount: 0 }
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
      {loading && (
  <p className="mb-4 text-center text-[#644984]">
    Loading your financial insights...
  </p>
)}

{error && (
  <p className="mb-4 rounded-xl bg-white p-4 text-center text-red-600">
    {error}
  </p>
)}
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
  {highestCategory.amount > 0
    ? `${highestCategory.name} is currently your highest spending category. You have spent ${formatCurrency(highestCategory.amount)} this month. Reducing ${highestCategory.name.toLowerCase()} expenses by even 10% could save around ${formatCurrency(highestCategory.amount * 0.1)} this month.`
    : "No expenses recorded this month yet. Add transactions to see personalized spending insights."}
</p>

          </div>
        </div>
      </div>
      
{/* ML Recommendations */}
{mlInsights?.recommendations?.length > 0 && (
  <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
    <h2 className="text-xl font-bold text-[#41366C]">
      AI-Powered Recommendations
    </h2>
    <p className="mt-1 text-sm text-[#644984]">
      Suggestions generated from your financial data.
    </p>

    <ul className="mt-4 space-y-3">
      {mlInsights.recommendations.map((recommendation, index) => (
        <li
          key={index}
          className="rounded-xl bg-[#F8E8EF] p-4 text-[#41366C]"
        >
          {recommendation}
        </li>
      ))}
    </ul>
  </div>
)}


{/* ML Anomaly Detection */}
{mlInsights?.anomaly_detection && (
  <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
    <h2 className="text-xl font-bold text-[#41366C]">
      Anomaly Detection
    </h2>

    <p className="mt-1 text-sm text-[#644984]">
      Unusual transactions identified by the ML model.
    </p>

    <div className="mt-4 rounded-xl bg-[#F8E8EF] p-4">
      <p className="text-sm text-[#644984]">
        Unusual transactions detected
      </p>
      <p className="mt-1 text-2xl font-bold text-[#41366C]">
        {mlInsights.anomaly_detection.total_anomalies ?? 0}
      </p>
    </div>

    {mlInsights.anomaly_detection.unusual_transactions?.length > 0 ? (
      <ul className="mt-4 space-y-3">
        {mlInsights.anomaly_detection.unusual_transactions.map(
          (transaction, index) => (
            <li
              key={index}
              className="rounded-xl border border-[#E8CEE5] p-4 text-[#41366C]"
            >
              <p className="font-semibold">
                {transaction.category || "Uncategorized"}
              </p>
              <p className="mt-1 text-sm">
                Amount: ₹{Number(transaction.amount).toLocaleString("en-IN")}
              </p>
              <p className="text-sm">
                Date: {transaction.date || "Not available"}
              </p>
            </li>
          )
        )}
      </ul>
    ) : (
      <p className="mt-3 text-sm text-[#644984]">
        No unusual transactions were detected in the current data.
      </p>
    )}
  </div>
)}

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
            {formatCurrency(Math.max(0, Math.round(totalIncome * 0.1)))}
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