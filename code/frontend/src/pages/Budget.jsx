import { useEffect, useState } from "react"
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
  
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        setError("Please log in again.")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError("")

        const headers = {
          Authorization: `Bearer ${token}`,
        }

        const [budgetResponse, categoryResponse] = await Promise.all([
          fetch("http://localhost:8080/api/budgets", { headers }),
          fetch("http://localhost:8080/api/categories", { headers }),
        ])

        if (!budgetResponse.ok || !categoryResponse.ok) {
          throw new Error("Could not load budgets or categories.")
        }

        const budgetData = await budgetResponse.json()
        const categoryData = await categoryResponse.json()

        setCategories(categoryData)

        const budgetItems = await Promise.all(
          budgetData.map(async (budget) => {
            let spent = 0

            try {
              const spentResponse = await fetch(
                `http://localhost:8080/api/budgets/${budget.budgetId}/spent`,
                { headers }
              )

              if (spentResponse.ok) {
                spent = Number(await spentResponse.json()) || 0
              }
            } catch {
              console.error("Could not load spending for budget", budget.budgetId)
            }

            return {
              id: budget.budgetId,
              categoryId: budget.category?.categoryId,
              category: budget.category?.categoryName || budget.budgetName,
              budgetName: budget.budgetName,
              budget: Number(budget.amount) || 0,
              spent,
              startDate: budget.startDate,
              endDate: budget.endDate,
            }
          })
        )

        setBudgets(budgetItems)
      } catch (err) {
        setError(err.message || "Something went wrong while loading budgets.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])


  
  const [budgets, setBudgets] = useState([])


  const [showForm, setShowForm] = useState(false)

  const [editingId, setEditingId] = useState(null)

  
const [formData, setFormData] = useState({
  categoryId: "",
  budgetName: "",
  amount: "",
  startDate: "",
  endDate: "",
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
    categoryId: "",
    budgetName: "",
    amount: "",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: `${new Date().getFullYear()}-${String(
      new Date().getMonth() + 1
    ).padStart(2, "0")}-${String(
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
    ).padStart(2, "0")}`,
  })

  setShowForm(true)
}

const openEditForm = (budget) => {
  setEditingId(budget.id)

  setFormData({
    categoryId: String(budget.categoryId || ""),
    budgetName: budget.budgetName || budget.category,
    amount: String(budget.budget),
    startDate: budget.startDate || "",
    endDate: budget.endDate || "",
  })

  setShowForm(true)
}


  
const handleSubmit = async (e) => {
  e.preventDefault()

  if (
    !formData.categoryId ||
    !formData.budgetName.trim() ||
    !formData.amount ||
    !formData.startDate ||
    !formData.endDate
  ) {
    alert("Please fill in all budget fields.")
    return
  }

  const amount = Number(formData.amount)

  if (!Number.isFinite(amount) || amount <= 0) {
    alert("Budget amount must be greater than zero.")
    return
  }

  if (formData.endDate < formData.startDate) {
    alert("End date cannot be before start date.")
    return
  }

  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user") || "null")

  if (!token || !user?.userId) {
    alert("Please log in again.")
    return
  }

  const payload = {
    budgetName: formData.budgetName.trim(),
    amount,
    startDate: formData.startDate,
    endDate: formData.endDate,
    category: {
      categoryId: Number(formData.categoryId),
    },
  }

  try {
    const url = editingId
      ? `http://localhost:8080/api/budgets/${editingId}`
      : `http://localhost:8080/api/budgets/user/${user.userId}/category/${formData.categoryId}`

    const response = await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const message = await response.text()
      throw new Error(message || "Failed to save budget.")
    }

    const savedBudget = await response.json()
    let spent = 0

    if (editingId) {
      const spentResponse = await fetch(
        `http://localhost:8080/api/budgets/${savedBudget.budgetId}/spent`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (spentResponse.ok) {
        spent = Number(await spentResponse.json()) || 0
      }
    }

    const updatedItem = {
      id: savedBudget.budgetId,
      categoryId: savedBudget.category?.categoryId,
      category: savedBudget.category?.categoryName || savedBudget.budgetName,
      budgetName: savedBudget.budgetName,
      budget: Number(savedBudget.amount) || 0,
      spent,
      startDate: savedBudget.startDate,
      endDate: savedBudget.endDate,
    }

    if (editingId) {
      setBudgets((previous) =>
        previous.map((item) =>
          item.id === editingId ? updatedItem : item
        )
      )
    } else {
      setBudgets((previous) => [...previous, updatedItem])
    }

    setFormData({
      categoryId: "",
      budgetName: "",
      amount: "",
      startDate: "",
      endDate: "",
    })

    setEditingId(null)
    setShowForm(false)
  } catch (err) {
    alert(err.message || "Could not save budget.")
  }
}


 
const handleDelete = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this budget?"
  )

  if (!confirmed) return

  const token = localStorage.getItem("token")

  if (!token) {
    alert("Please log in again.")
    return
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/budgets/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      const message = await response.text()
      throw new Error(message || "Failed to delete budget.")
    }

    setBudgets((previous) =>
      previous.filter((item) => item.id !== id)
    )
  } catch (err) {
    alert(err.message || "Could not delete budget.")
  }
}


  
const handleCancel = () => {
  setFormData({
    categoryId: "",
    budgetName: "",
    amount: "",
    startDate: "",
    endDate: "",
  })

  setEditingId(null)
  setShowForm(false)
}


  return (
    <div className="min-h-screen bg-[#F8E8F0] p-8">
      
{loading && (
  <p className="mb-4 text-center text-[#644984]">
    Loading your budgets...
  </p>
)}

{error && (
  <p className="mb-4 rounded-xl bg-white p-4 text-center text-red-600">
    {error}
  </p>
)}


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
  value={formData.categoryId}
  onChange={(e) => {
    const selectedCategory = categories.find(
      (category) =>
        String(category.categoryId) === e.target.value
    )

    setFormData((previous) => ({
      ...previous,
      categoryId: e.target.value,
      budgetName:
        previous.budgetName ||
        selectedCategory?.categoryName ||
        "",
    }))
  }}
  required
  className="w-full rounded-xl border border-[#E8CEE5] bg-white px-4 py-3 outline-none focus:border-[#B07EAA]"
>
  <option value="">Select category</option>

  {categories
    .filter((category) =>
      !category.categoryType ||
      category.categoryType.toLowerCase() === "expense"
    )
    .map((category) => (
      <option
        key={category.categoryId}
        value={category.categoryId}
      >
        {category.categoryName}
      </option>
    ))}
</select>

            </div>

            {/* Amount */}
            
{/* Budget Name */}
<div>
  <label className="mb-2 block text-sm font-semibold text-[#41366C]">
    Budget Name
  </label>

  <input
    type="text"
    placeholder="e.g. Monthly Food Budget"
    value={formData.budgetName}
    onChange={(e) =>
      setFormData((previous) => ({
        ...previous,
        budgetName: e.target.value,
      }))
    }
    required
    className="w-full rounded-xl border border-[#E8CEE5] px-4 py-3 outline-none focus:border-[#B07EAA]"
  />
</div>

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
            
{/* Budget Date Range */}
<div>
  <label className="mb-2 block text-sm font-semibold text-[#41366C]">
    Start Date
  </label>

  <input
    type="date"
    value={formData.startDate}
    onChange={(e) =>
      setFormData((previous) => ({
        ...previous,
        startDate: e.target.value,
      }))
    }
    required
    className="w-full rounded-xl border border-[#E8CEE5] px-4 py-3 outline-none focus:border-[#B07EAA]"
  />
</div>

<div>
  <label className="mb-2 block text-sm font-semibold text-[#41366C]">
    End Date
  </label>

  <input
    type="date"
    min={formData.startDate}
    value={formData.endDate}
    onChange={(e) =>
      setFormData((previous) => ({
        ...previous,
        endDate: e.target.value,
      }))
    }
    required
    className="w-full rounded-xl border border-[#E8CEE5] px-4 py-3 outline-none focus:border-[#B07EAA]"
  />
</div>

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