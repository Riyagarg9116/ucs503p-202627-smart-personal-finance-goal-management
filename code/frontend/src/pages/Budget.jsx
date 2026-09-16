import { useState } from "react"
import {
  Wallet,
  TrendingDown,
  PiggyBank,
  Plus,
  X,
  Pencil,
  Trash2,
} from "lucide-react"

function Budget() {
  const [budgets, setBudgets] = useState([
    {
      id: 1,
      category: "Food",
      budget: 5000,
      spent: 4500,
    },
    {
      id: 2,
      category: "Shopping",
      budget: 4000,
      spent: 3200,
    },
    {
      id: 3,
      category: "Transport",
      budget: 3500,
      spent: 2800,
    },
    {
      id: 4,
      category: "Bills",
      budget: 5000,
      spent: 4100,
    },
    {
      id: 5,
      category: "Entertainment",
      budget: 3000,
      spent: 1800,
    },
  ])

  const [showForm, setShowForm] = useState(false)

  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
  })

  const totalBudget = budgets.reduce(
    (total, item) => total + item.budget,
    0
  )

  const totalSpent = budgets.reduce(
    (total, item) => total + item.spent,
    0
  )

  const remaining = totalBudget - totalSpent

  const overallPercentage =
    totalBudget > 0
      ? (totalSpent / totalBudget) * 100
      : 0

  const openAddForm = () => {
    setEditingId(null)

    setFormData({
      category: "",
      amount: "",
    })

    setShowForm(true)
  }

  const openEditForm = (budget) => {
    setEditingId(budget.id)

    setFormData({
      category: budget.category,
      amount: budget.budget,
    })

    setShowForm(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.category || !formData.amount) {
      return
    }

    const amount = Number(formData.amount)

    if (editingId) {
      setBudgets(
        budgets.map((item) =>
          item.id === editingId
            ? {
                ...item,
                category: formData.category,
                budget: amount,
              }
            : item
        )
      )
    } else {
      const newBudget = {
        id: Date.now(),
        category: formData.category,
        budget: amount,
        spent: 0,
      }

      setBudgets([...budgets, newBudget])
    }

    setFormData({
      category: "",
      amount: "",
    })

    setEditingId(null)
    setShowForm(false)
  }

  const handleDelete = (id) => {
    setBudgets(
      budgets.filter((item) => item.id !== id)
    )
  }

  const handleCancel = () => {
    setFormData({
      category: "",
      amount: "",
    })

    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-[#F8E8F0] p-8">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-[#41366C]">
            Budget
          </h1>

          <p className="mt-2 text-[#644984]">
            Manage your monthly spending and stay on track.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#644984] px-5 py-3 font-semibold text-white transition hover:bg-[#41366C]"
        >
          <Plus size={20} />
          Add Budget
        </button>

      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <h2 className="text-xl font-bold text-[#41366C]">
                {editingId ? "Edit Budget" : "Add New Budget"}
              </h2>

              <p className="mt-1 text-sm text-[#644984]">
                {editingId
                  ? "Update your category budget."
                  : "Set a spending limit for a category."}
              </p>
            </div>

            <button
              onClick={handleCancel}
              className="rounded-lg p-2 text-[#644984] transition hover:bg-[#F8E8F0]"
            >
              <X size={22} />
            </button>

          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 md:grid-cols-2"
          >

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#41366C]">
                Category
              </label>

              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-[#E8CEE5] bg-white px-4 py-3 outline-none focus:border-[#B07EAA]"
              >
                <option value="">
                  Select category
                </option>

                <option value="Food">
                  Food
                </option>

                <option value="Shopping">
                  Shopping
                </option>

                <option value="Transport">
                  Transport
                </option>

                <option value="Bills">
                  Bills
                </option>

                <option value="Entertainment">
                  Entertainment
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#41366C]">
                Budget Amount
              </label>

              <input
                type="number"
                min="1"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-[#E8CEE5] px-4 py-3 outline-none focus:border-[#B07EAA]"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 md:col-span-2">

              <button
                type="submit"
                className="rounded-xl bg-[#644984] px-6 py-3 font-semibold text-white transition hover:bg-[#41366C]"
              >
                {editingId
                  ? "Update Budget"
                  : "Save Budget"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="rounded-xl bg-[#E8CEE5] px-6 py-3 font-semibold text-[#41366C] transition hover:bg-[#E09DC3]"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">

        {/* Total Budget */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-[#644984]">
                Monthly Budget
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#41366C]">
                ₹{totalBudget.toLocaleString("en-IN")}
              </h2>
            </div>

            <div className="rounded-xl bg-[#E8CEE5] p-3">
              <Wallet
                className="text-[#644984]"
                size={24}
              />
            </div>

          </div>

        </div>

        {/* Total Spent */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-[#644984]">
                Total Spent
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#C76B6B]">
                ₹{totalSpent.toLocaleString("en-IN")}
              </h2>
            </div>

            <div className="rounded-xl bg-[#F3E0E0] p-3">
              <TrendingDown
                className="text-[#C76B6B]"
                size={24}
              />
            </div>

          </div>

        </div>

        {/* Remaining */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-[#644984]">
                Remaining
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#5F8D72]">
                ₹{remaining.toLocaleString("en-IN")}
              </h2>
            </div>

            <div className="rounded-xl bg-[#E1EDE5] p-3">
              <PiggyBank
                className="text-[#5F8D72]"
                size={24}
              />
            </div>

          </div>

        </div>

      </div>

      {/* Overall Progress */}
      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-xl font-bold text-[#41366C]">
              Monthly Budget Progress
            </h2>

            <p className="mt-1 text-sm text-[#644984]">
              You have used{" "}
              {overallPercentage.toFixed(0)}%
              {" "}of your monthly budget.
            </p>
          </div>

          <span className="font-semibold text-[#644984]">
            {overallPercentage.toFixed(0)}%
          </span>

        </div>

        <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-[#E8CEE5]">

          <div
            className={`h-full rounded-full ${
              overallPercentage >= 100
                ? "bg-[#C76B6B]"
                : "bg-[#B07EAA]"
            }`}
            style={{
              width: `${Math.min(
                overallPercentage,
                100
              )}%`,
            }}
          ></div>

        </div>

        <div className="mt-3 flex justify-between text-sm">

          <span className="text-[#644984]">
            ₹{totalSpent.toLocaleString("en-IN")} spent
          </span>

          <span className="text-[#644984]">
            ₹{totalBudget.toLocaleString("en-IN")} budget
          </span>

        </div>

      </div>

      {/* Category Budgets */}
      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

        <div className="mb-6">

          <h2 className="text-xl font-bold text-[#41366C]">
            Category Budgets
          </h2>

          <p className="mt-1 text-sm text-[#644984]">
            Track your spending for each category.
          </p>

        </div>

        {budgets.length === 0 ? (

          /* Empty State */
          <div className="rounded-xl bg-[#F8E8F0] px-6 py-12 text-center">

            <Wallet
              size={40}
              className="mx-auto text-[#B07EAA]"
            />

            <h3 className="mt-4 text-lg font-bold text-[#41366C]">
              No budgets yet
            </h3>

            <p className="mt-2 text-sm text-[#644984]">
              Start by adding your first category budget.
            </p>

            <button
              onClick={openAddForm}
              className="mt-5 rounded-xl bg-[#644984] px-5 py-3 font-semibold text-white hover:bg-[#41366C]"
            >
              Add Your First Budget
            </button>

          </div>

        ) : (

          <div className="space-y-6">

            {budgets.map((item) => {

              const progress =
                item.budget > 0
                  ? (item.spent / item.budget) * 100
                  : 0

              const isOverBudget =
                item.spent > item.budget

              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-[#E8CEE5] p-5"
                >

                  {/* Category Header */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <p className="font-semibold text-[#41366C]">
                        {item.category}
                      </p>

                      <p className="mt-1 text-sm text-[#644984]">
                        ₹{item.spent.toLocaleString("en-IN")}
                        {" "}of{" "}
                        ₹{item.budget.toLocaleString("en-IN")}
                      </p>

                    </div>

                    <div className="flex items-center gap-3">

                      <span
                        className={`text-sm font-semibold ${
                          isOverBudget
                            ? "text-[#C76B6B]"
                            : "text-[#644984]"
                        }`}
                      >
                        {progress.toFixed(0)}%
                      </span>

                      <button
                        onClick={() => openEditForm(item)}
                        className="rounded-lg p-2 text-[#644984] transition hover:bg-[#E8CEE5]"
                        title="Edit budget"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="rounded-lg p-2 text-[#C76B6B] transition hover:bg-[#F3E0E0]"
                        title="Delete budget"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-[#E8CEE5]">

                    <div
                      className={`h-full rounded-full ${
                        isOverBudget
                          ? "bg-[#C76B6B]"
                          : "bg-[#CF82A7]"
                      }`}
                      style={{
                        width: `${Math.min(
                          progress,
                          100
                        )}%`,
                      }}
                    ></div>

                  </div>

                  {/* Status */}
                  <p
                    className={`mt-2 text-xs ${
                      isOverBudget
                        ? "font-semibold text-[#C76B6B]"
                        : "text-[#644984]"
                    }`}
                  >
                    {isOverBudget
                      ? `₹${(
                          item.spent - item.budget
                        ).toLocaleString("en-IN")} over budget`
                      : `₹${(
                          item.budget - item.spent
                        ).toLocaleString("en-IN")} remaining`}
                  </p>

                </div>
              )
            })}

          </div>

        )}

      </div>

    </div>
  )
}

export default Budget