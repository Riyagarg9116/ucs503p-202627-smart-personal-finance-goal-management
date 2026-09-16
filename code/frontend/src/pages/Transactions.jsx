import { useState } from "react"
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react"

function Transactions() {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      name: "Salary",
      category: "Salary",
      date: "2026-09-15",
      amount: 45000,
      type: "income",
    },
    {
      id: 2,
      name: "Grocery Shopping",
      category: "Food",
      date: "2026-09-14",
      amount: 2500,
      type: "expense",
    },
    {
      id: 3,
      name: "Electricity Bill",
      category: "Bills",
      date: "2026-09-12",
      amount: 1800,
      type: "expense",
    },
    {
      id: 4,
      name: "Uber",
      category: "Transport",
      date: "2026-09-10",
      amount: 650,
      type: "expense",
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    category: "Food",
    date: "",
    type: "expense",
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [typeFilter, setTypeFilter] = useState("All")

  const categories = [
    "Food",
    "Shopping",
    "Transport",
    "Bills",
    "Entertainment",
    "Salary",
    "Other",
  ]

  const formatCurrency = (amount) => {
    return `₹${Number(amount).toLocaleString("en-IN")}`
  }

  const formatDate = (date) => {
    if (!date) return "-"

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const resetForm = () => {
    setFormData({
      name: "",
      amount: "",
      category: "Food",
      date: "",
      type: "expense",
    })

    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (
      !formData.name ||
      !formData.amount ||
      !formData.date ||
      Number(formData.amount) <= 0
    ) {
      return
    }

    const transactionData = {
      name: formData.name,
      amount: Number(formData.amount),
      category: formData.category,
      date: formData.date,
      type: formData.type,
    }

    if (editingId) {
      setTransactions(
        transactions.map((transaction) =>
          transaction.id === editingId
            ? {
                ...transaction,
                ...transactionData,
              }
            : transaction
        )
      )
    } else {
      setTransactions([
        {
          id: Date.now(),
          ...transactionData,
        },
        ...transactions,
      ])
    }

    resetForm()
  }

  const handleEdit = (transaction) => {
    setEditingId(transaction.id)

    setFormData({
      name: transaction.name,
      amount: transaction.amount,
      category: transaction.category,
      date: transaction.date,
      type: transaction.type,
    })

    setShowForm(true)
  }

  const handleDelete = (id) => {
    setTransactions(
      transactions.filter((transaction) => transaction.id !== id)
    )
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const matchesCategory =
      categoryFilter === "All" ||
      transaction.category === categoryFilter

    const matchesType =
      typeFilter === "All" ||
      transaction.type === typeFilter

    return matchesSearch && matchesCategory && matchesType
  })

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0)

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0)

  const balance = totalIncome - totalExpenses

  return (
    <div className="min-h-screen bg-[#F8E8F0] p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#41366C]">
            Transactions
          </h1>

          <p className="mt-2 text-[#644984]">
            Track and manage all your income and expenses.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#644984] px-5 py-3 font-semibold text-white transition hover:bg-[#41366C]"
        >
          <Plus size={20} />
          Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-[#644984]">Total Income</p>

          <div className="mt-2 flex items-center gap-3">
            <div className="rounded-xl bg-[#E1EDE5] p-3">
              <ArrowDownLeft
                size={22}
                className="text-[#5F8D72]"
              />
            </div>

            <h2 className="text-2xl font-bold text-[#5F8D72]">
              {formatCurrency(totalIncome)}
            </h2>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-[#644984]">Total Expenses</p>

          <div className="mt-2 flex items-center gap-3">
            <div className="rounded-xl bg-[#F3E0E0] p-3">
              <ArrowUpRight
                size={22}
                className="text-[#C76B6B]"
              />
            </div>

            <h2 className="text-2xl font-bold text-[#C76B6B]">
              {formatCurrency(totalExpenses)}
            </h2>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-[#644984]">Balance</p>

          <h2
            className={`mt-2 text-2xl font-bold ${
              balance >= 0
                ? "text-[#41366C]"
                : "text-[#C76B6B]"
            }`}
          >
            {formatCurrency(balance)}
          </h2>

          <p className="mt-1 text-sm text-[#644984]">
            Income minus expenses
          </p>
        </div>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#41366C]">
                {editingId
                  ? "Edit Transaction"
                  : "Add New Transaction"}
              </h2>

              <p className="mt-1 text-sm text-[#644984]">
                Enter the details of your transaction.
              </p>
            </div>

            <button
              onClick={resetForm}
              className="rounded-lg p-2 text-[#644984] transition hover:bg-[#F8E8F0]"
            >
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5 md:grid-cols-2"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#41366C]">
                Transaction Name
              </label>

              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                placeholder="e.g. Grocery Shopping"
                className="w-full rounded-xl border border-[#E8CEE5] px-4 py-3 outline-none transition focus:border-[#644984]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#41366C]">
                Amount
              </label>

              <input
                type="number"
                min="1"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: e.target.value,
                  })
                }
                placeholder="2500"
                className="w-full rounded-xl border border-[#E8CEE5] px-4 py-3 outline-none transition focus:border-[#644984]"
              />
            </div>

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
                className="w-full rounded-xl border border-[#E8CEE5] bg-white px-4 py-3 outline-none transition focus:border-[#644984]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#41366C]">
                Date
              </label>

              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    date: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-[#E8CEE5] px-4 py-3 outline-none transition focus:border-[#644984]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#41366C]">
                Transaction Type
              </label>

              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-[#E8CEE5] bg-white px-4 py-3 outline-none transition focus:border-[#644984]"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div className="flex items-end gap-3">
              <button
                type="submit"
                className="rounded-xl bg-[#644984] px-6 py-3 font-semibold text-white transition hover:bg-[#41366C]"
              >
                {editingId ? "Update" : "Add Transaction"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl bg-[#E8CEE5] px-6 py-3 font-semibold text-[#41366C] transition hover:bg-[#E09DC3]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B07EAA]"
            />

            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-[#E8CEE5] py-3 pl-11 pr-4 outline-none transition focus:border-[#644984]"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-[#E8CEE5] bg-white px-4 py-3 outline-none transition focus:border-[#644984]"
          >
            <option value="All">All Categories</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-[#E8CEE5] bg-white px-4 py-3 outline-none transition focus:border-[#644984]"
          >
            <option value="All">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <div className="mt-8 rounded-2xl bg-white shadow-sm">
        <div className="border-b border-[#E8CEE5] p-6">
          <h2 className="text-xl font-bold text-[#41366C]">
            Transaction History
          </h2>

          <p className="mt-1 text-sm text-[#644984]">
            {filteredTransactions.length} transaction
            {filteredTransactions.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <Search
              size={42}
              className="mx-auto text-[#B07EAA]"
            />

            <h3 className="mt-4 text-lg font-bold text-[#41366C]">
              No transactions found
            </h3>

            <p className="mt-2 text-sm text-[#644984]">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E8CEE5] text-left">
                    <th className="px-6 py-4 text-sm font-semibold text-[#644984]">
                      Transaction
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-[#644984]">
                      Category
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-[#644984]">
                      Date
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-[#644984]">
                      Type
                    </th>

                    <th className="px-6 py-4 text-right text-sm font-semibold text-[#644984]">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-right text-sm font-semibold text-[#644984]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-[#F3E8F0] last:border-b-0"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`rounded-xl p-2 ${
                              transaction.type === "income"
                                ? "bg-[#E1EDE5]"
                                : "bg-[#F3E0E0]"
                            }`}
                          >
                            {transaction.type === "income" ? (
                              <ArrowDownLeft
                                size={18}
                                className="text-[#5F8D72]"
                              />
                            ) : (
                              <ArrowUpRight
                                size={18}
                                className="text-[#C76B6B]"
                              />
                            )}
                          </div>

                          <span className="font-semibold text-[#41366C]">
                            {transaction.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-[#E8CEE5] px-3 py-1 text-sm font-medium text-[#644984]">
                          {transaction.category}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm text-[#644984]">
                        {formatDate(transaction.date)}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`text-sm font-semibold ${
                            transaction.type === "income"
                              ? "text-[#5F8D72]"
                              : "text-[#C76B6B]"
                          }`}
                        >
                          {transaction.type === "income"
                            ? "Income"
                            : "Expense"}
                        </span>
                      </td>

                      <td
                        className={`px-6 py-5 text-right font-bold ${
                          transaction.type === "income"
                            ? "text-[#5F8D72]"
                            : "text-[#C76B6B]"
                        }`}
                      >
                        {transaction.type === "income"
                          ? "+"
                          : "-"}
                        {formatCurrency(transaction.amount)}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              handleEdit(transaction)
                            }
                            className="rounded-lg p-2 text-[#644984] transition hover:bg-[#F8E8F0]"
                            title="Edit"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(transaction.id)
                            }
                            className="rounded-lg p-2 text-[#C76B6B] transition hover:bg-[#F3E0E0]"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-4 p-4 md:hidden">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="rounded-xl border border-[#E8CEE5] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`rounded-xl p-2 ${
                          transaction.type === "income"
                            ? "bg-[#E1EDE5]"
                            : "bg-[#F3E0E0]"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <ArrowDownLeft
                            size={18}
                            className="text-[#5F8D72]"
                          />
                        ) : (
                          <ArrowUpRight
                            size={18}
                            className="text-[#C76B6B]"
                          />
                        )}
                      </div>

                      <div>
                        <h3 className="font-semibold text-[#41366C]">
                          {transaction.name}
                        </h3>

                        <p className="mt-1 text-sm text-[#644984]">
                          {transaction.category}
                        </p>
                      </div>
                    </div>

                    <p
                      className={`font-bold ${
                        transaction.type === "income"
                          ? "text-[#5F8D72]"
                          : "text-[#C76B6B]"
                      }`}
                    >
                      {transaction.type === "income"
                        ? "+"
                        : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-[#644984]">
                      {formatDate(transaction.date)}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleEdit(transaction)
                        }
                        className="rounded-lg bg-[#F8E8F0] p-2 text-[#644984]"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(transaction.id)
                        }
                        className="rounded-lg bg-[#F3E0E0] p-2 text-[#C76B6B]"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Transactions
