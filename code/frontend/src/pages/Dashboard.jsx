
import SpendingChart from "../components/SpendingChart"
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
} from "lucide-react"

function Dashboard() {
  return (
    <div className="min-h-screen bg-[#F8E8F0] p-8">

        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#41366C]">
            Dashboard
          </h1>

          <p className="mt-2 text-[#644984]">
            Welcome back! Here's an overview of your finances.
          </p>
        </div>

        {/* Summary Cards */}
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
              ₹85,420
            </h2>

            <p className="mt-2 text-sm text-[#644984]">
              Current available balance
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
              ₹45,000
            </h2>

            <p className="mt-2 text-sm text-[#644984]">
              Total income this month
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
              ₹18,650
            </h2>

            <p className="mt-2 text-sm text-[#644984]">
              Total expenses this month
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
              ₹26,350
            </h2>

            <p className="mt-2 text-sm text-[#644984]">
              Saved this month
            </p>
          </div>

        </div>

        {/* Spending Overview */}
        <div className="mt-8">
          <SpendingChart />
        </div>

    </div>
  )
}

export default Dashboard