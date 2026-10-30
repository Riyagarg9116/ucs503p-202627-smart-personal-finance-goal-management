

import { useEffect, useState } from "react"
import SpendingChart from "../components/SpendingChart"
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
} from "lucide-react"

function Dashboard() {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchSummary = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        setError("Please log in to view your financial summary.")
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          "http://localhost:8080/api/dashboard/summary",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            setError("Your session may have expired. Please log in again.")
          } else {
            setError("Unable to load your financial summary.")
          }
          return
        }

        const data = await response.json()

        setSummary({
          totalIncome: Number(data.totalIncome ?? 0),
          totalExpenses: Number(data.totalExpenses ?? 0),
          netBalance: Number(data.netBalance ?? 0),
        })
      } catch (err) {
        setError("Could not connect to the backend server.")
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [])

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount)

  const savings = summary.totalIncome - summary.totalExpenses

  return (
    <div className="min-h-screen bg-[#F8E8F0] p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#41366C]">
          Dashboard
        </h1>
        <p className="mt-2 text-[#644984]">
          Welcome back! Here's an overview of your finances.
        </p>
      </div>

      {loading && (
        <p className="mb-4 text-[#644984]">
          Loading your financial summary...
        </p>
      )}

      {error && (
        <div className="mb-6 rounded-xl bg-white p-4 text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Balance */}
        <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#644984]">
              Total Balance
            </p>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8E8F0] text-[#644984]">
              <Wallet size={20} />
            </div>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-[#41366C]">
            {formatCurrency(summary.netBalance)}
          </h2>
          <p className="mt-2 text-sm text-[#644984]">
            Income minus expenses
          </p>
        </div>

        {/* Income */}
        <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#644984]">
              Income
            </p>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E1EDE5] text-[#5F8D72]">
              <TrendingUp size={20} />
            </div>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-[#5F8D72]">
            {formatCurrency(summary.totalIncome)}
          </h2>
          <p className="mt-2 text-sm text-[#644984]">
            Total recorded income
          </p>
        </div>

        {/* Expenses */}
        <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#644984]">
              Expenses
            </p>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3E0E0] text-[#C76B6B]">
              <TrendingDown size={20} />
            </div>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-[#C76B6B]">
            {formatCurrency(summary.totalExpenses)}
          </h2>
          <p className="mt-2 text-sm text-[#644984]">
            Total recorded expenses
          </p>
        </div>

        {/* Savings */}
        <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#644984]">
              Savings
            </p>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8E8F0] text-[#B07EAA]">
              <PiggyBank size={20} />
            </div>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-[#B07EAA]">
            {formatCurrency(savings)}
          </h2>
          <p className="mt-2 text-sm text-[#644984]">
            Income minus expenses
          </p>
        </div>
      </div>

      <div className="mt-8">
        <SpendingChart />
      </div>
    </div>
  )
}

export default Dashboard
