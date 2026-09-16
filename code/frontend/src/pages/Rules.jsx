import { useState } from "react"
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Power,
  Zap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"

function Rules() {
  const [rules, setRules] = useState([
    {
      id: 1,
      name: "Food Spending Alert",
      type: "Spending Limit",
      category: "Food",
      condition: "Amount greater than ₹1,000",
      action: "Show spending alert",
      priority: "High",
      enabled: true,
    },
    {
      id: 2,
      name: "Shopping Categorization",
      type: "Auto Categorization",
      category: "Shopping",
      condition: "Transaction contains shopping",
      action: "Categorize as Shopping",
      priority: "Medium",
      enabled: true,
    },
    {
      id: 3,
      name: "Large Expense Alert",
      type: "Spending Limit",
      category: "All Categories",
      condition: "Amount greater than ₹5,000",
      action: "Show large expense alert",
      priority: "High",
      enabled: false,
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    type: "Spending Limit",
    category: "Food",
    condition: "",
    action: "",
    priority: "Medium",
  })

  const activeRules = rules.filter((rule) => rule.enabled).length
  const inactiveRules = rules.length - activeRules

  const resetForm = () => {
    setFormData({
      name: "",
      type: "Spending Limit",
      category: "Food",
      condition: "",
      action: "",
      priority: "Medium",
    })

    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (
      !formData.name ||
      !formData.condition ||
      !formData.action
    ) {
      return
    }

    if (editingId) {
      setRules(
        rules.map((rule) =>
          rule.id === editingId
            ? {
                ...rule,
                ...formData,
              }
            : rule
        )
      )
    } else {
      setRules([
        ...rules,
        {
          id: Date.now(),
          ...formData,
          enabled: true,
        },
      ])
    }

    resetForm()
  }

  const handleEdit = (rule) => {
    setEditingId(rule.id)

    setFormData({
      name: rule.name,
      type: rule.type,
      category: rule.category,
      condition: rule.condition,
      action: rule.action,
      priority: rule.priority,
    })

    setShowForm(true)
  }

  const handleDelete = (id) => {
    setRules(rules.filter((rule) => rule.id !== id))
  }

  const toggleRule = (id) => {
    setRules(
      rules.map((rule) =>
        rule.id === id
          ? {
              ...rule,
              enabled: !rule.enabled,
            }
          : rule
      )
    )
  }

  return (
    <div className="min-h-screen bg-[#F8E8F0] p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#41366C]">
            Rules
          </h1>

          <p className="mt-2 text-[#644984]">
            Create simple automation rules to make your
            financial management smarter.
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
          Add Rule
        </button>
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-[#E8CEE5] p-3">
              <Zap
                size={24}
                className="text-[#644984]"
              />
            </div>

            <div>
              <p className="text-sm text-[#644984]">
                Total Rules
              </p>

              <p className="mt-1 text-3xl font-bold text-[#41366C]">
                {rules.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-[#E1EDE5] p-3">
              <CheckCircle2
                size={24}
                className="text-[#5F8D72]"
              />
            </div>

            <div>
              <p className="text-sm text-[#644984]">
                Active Rules
              </p>

              <p className="mt-1 text-3xl font-bold text-[#5F8D72]">
                {activeRules}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-[#F3E0E0] p-3">
              <Power
                size={24}
                className="text-[#C76B6B]"
              />
            </div>

            <div>
              <p className="text-sm text-[#644984]">
                Inactive Rules
              </p>

              <p className="mt-1 text-3xl font-bold text-[#C76B6B]">
                {inactiveRules}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#41366C]">
                {editingId
                  ? "Edit Rule"
                  : "Create New Rule"}
              </h2>

              <p className="mt-1 text-sm text-[#644984]">
                Define when the rule should run and what
                action it should perform.
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
                Rule Name
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
                placeholder="e.g. Food Spending Alert"
                className="w-full rounded-xl border border-[#E8CEE5] px-4 py-3 outline-none transition focus:border-[#644984]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#41366C]">
                Rule Type
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
                <option>Spending Limit</option>
                <option>Auto Categorization</option>
                <option>Savings Reminder</option>
                <option>Transaction Alert</option>
                <option>Budget Alert</option>
              </select>
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
                <option>Food</option>
                <option>Shopping</option>
                <option>Transport</option>
                <option>Bills</option>
                <option>Entertainment</option>
                <option>Salary</option>
                <option>All Categories</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#41366C]">
                Priority
              </label>

              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-[#E8CEE5] bg-white px-4 py-3 outline-none transition focus:border-[#644984]"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#41366C]">
                Condition
              </label>

              <input
                type="text"
                value={formData.condition}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    condition: e.target.value,
                  })
                }
                placeholder="e.g. Amount greater than ₹1,000"
                className="w-full rounded-xl border border-[#E8CEE5] px-4 py-3 outline-none transition focus:border-[#644984]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#41366C]">
                Action
              </label>

              <input
                type="text"
                value={formData.action}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    action: e.target.value,
                  })
                }
                placeholder="e.g. Show spending alert"
                className="w-full rounded-xl border border-[#E8CEE5] px-4 py-3 outline-none transition focus:border-[#644984]"
              />
            </div>

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                className="rounded-xl bg-[#644984] px-6 py-3 font-semibold text-white transition hover:bg-[#41366C]"
              >
                {editingId ? "Update Rule" : "Create Rule"}
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

      {/* Rules List */}
      <div className="mt-8">
        <div>
          <h2 className="text-2xl font-bold text-[#41366C]">
            Your Rules
          </h2>

          <p className="mt-2 text-[#644984]">
            Manage the automation rules used by your finance
            system.
          </p>
        </div>

        {rules.length === 0 ? (
          <div className="mt-5 rounded-2xl bg-white p-10 text-center shadow-sm">
            <Zap
              size={45}
              className="mx-auto text-[#B07EAA]"
            />

            <h3 className="mt-4 text-xl font-bold text-[#41366C]">
              No rules yet
            </h3>

            <p className="mt-2 text-[#644984]">
              Create your first rule to automate your
              financial decisions.
            </p>

            <button
              onClick={() => setShowForm(true)}
              className="mt-5 rounded-xl bg-[#644984] px-5 py-3 font-semibold text-white transition hover:bg-[#41366C]"
            >
              Create First Rule
            </button>
          </div>
        ) : (
          <div className="mt-5 space-y-5">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className={`rounded-2xl bg-white p-6 shadow-sm transition ${
                  rule.enabled
                    ? ""
                    : "opacity-70"
                }`}
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  {/* Rule Info */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`rounded-xl p-3 ${
                        rule.enabled
                          ? "bg-[#E8CEE5]"
                          : "bg-[#F3E0E0]"
                      }`}
                    >
                      <Zap
                        size={24}
                        className={
                          rule.enabled
                            ? "text-[#644984]"
                            : "text-[#C76B6B]"
                        }
                      />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-bold text-[#41366C]">
                          {rule.name}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            rule.enabled
                              ? "bg-[#E1EDE5] text-[#5F8D72]"
                              : "bg-[#F3E0E0] text-[#C76B6B]"
                          }`}
                        >
                          {rule.enabled
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded-lg bg-[#F8E8F0] px-3 py-1 text-xs font-semibold text-[#644984]">
                          {rule.type}
                        </span>

                        <span className="rounded-lg bg-[#F8E8F0] px-3 py-1 text-xs font-semibold text-[#644984]">
                          {rule.category}
                        </span>

                        <span
                          className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                            rule.priority === "High"
                              ? "bg-[#F3E0E0] text-[#C76B6B]"
                              : rule.priority ===
                                "Medium"
                              ? "bg-[#E8CEE5] text-[#644984]"
                              : "bg-[#E1EDE5] text-[#5F8D72]"
                          }`}
                        >
                          {rule.priority} Priority
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        toggleRule(rule.id)
                      }
                      className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                        rule.enabled
                          ? "bg-[#E1EDE5] text-[#5F8D72] hover:bg-[#D6E6DC]"
                          : "bg-[#F3E0E0] text-[#C76B6B] hover:bg-[#EDD2D2]"
                      }`}
                    >
                      <Power size={17} />

                      {rule.enabled
                        ? "Enabled"
                        : "Disabled"}
                    </button>

                    <button
                      onClick={() => handleEdit(rule)}
                      className="rounded-xl p-3 text-[#644984] transition hover:bg-[#F8E8F0]"
                      title="Edit rule"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(rule.id)
                      }
                      className="rounded-xl p-3 text-[#C76B6B] transition hover:bg-[#F3E0E0]"
                      title="Delete rule"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Rule Flow */}
                <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
                  <div className="rounded-xl bg-[#F8E8F0] p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#B07EAA]">
                      When
                    </p>

                    <p className="mt-2 font-semibold text-[#41366C]">
                      {rule.condition}
                    </p>
                  </div>

                  <div className="hidden md:block">
                    <ArrowRight
                      size={24}
                      className="text-[#B07EAA]"
                    />
                  </div>

                  <div className="rounded-xl bg-[#F8E8F0] p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#B07EAA]">
                      Then
                    </p>

                    <p className="mt-2 font-semibold text-[#41366C]">
                      {rule.action}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rule Engine Info */}
      <div className="mt-8 rounded-2xl bg-[#644984] p-6 text-white shadow-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-[#CF82A7] p-3">
            <Zap size={24} />
          </div>

          <div>
            <h2 className="text-xl font-bold">
              Smart Rule Engine
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#F8E8F0]">
              Rules will eventually connect with your
              transaction and budgeting data. This allows the
              system to automatically detect spending
              patterns, categorize transactions, trigger
              alerts, and provide personalized financial
              recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Rules