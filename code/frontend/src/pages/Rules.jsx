import { useEffect, useState } from "react"
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
 const [rules, setRules] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState("")

useEffect(() => {
  const fetchRules = async () => {
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
        "http://localhost:8080/api/rules",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error("Could not load your rules.")
      }

      const data = await response.json()

     
const loadedRules = data.map((item) => {
  let condition = {}
  let action = {}

  try {
    condition = item.conditionData
      ? JSON.parse(item.conditionData)
      : {}
  } catch {
    condition = {}
  }

  try {
    action = item.actionData
      ? JSON.parse(item.actionData)
      : {}
  } catch {
    action = {}
  }

  return {
    id: item.ruleId,
    name: item.ruleName,
    type: item.ruleType || "Spending Limit",
    category: condition.category || "All Categories",
    condition:
      condition.condition ||
      condition.description ||
      "",
    action:
      action.action ||
      action.description ||
      "",
    priority: condition.priority || "Medium",
    enabled: item.isActive ?? true,
  }
})


      setRules(loadedRules)
    } catch (err) {
      setError(err.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  fetchRules()
}, [])


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


const handleSubmit = async (e) => {
  e.preventDefault()

  if (
    !formData.name.trim() ||
    !formData.condition.trim() ||
    !formData.action.trim()
  ) {
    alert("Please fill in all fields.")
    return
  }

  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user") || "null")

  if (!token || !user?.userId) {
    alert("Please log in again.")
    return
  }

  const payload = {
    ruleName: formData.name.trim(),
    ruleType: formData.type,
    conditionData: JSON.stringify({
      category: formData.category,
      condition: formData.condition.trim(),
      priority: formData.priority,
    }),
    actionData: JSON.stringify({
      action: formData.action.trim(),
    }),
    isActive: editingId
      ? rules.find((rule) => rule.id === editingId)?.enabled ?? true
      : true,
  }

  try {
    const response = await fetch(
      editingId
        ? `http://localhost:8080/api/rules/${editingId}`
        : `http://localhost:8080/api/rules/user/${user.userId}`,
      {
        method: editingId ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )

    if (!response.ok) {
      const message = await response.text()
      throw new Error(message || "Could not save the rule.")
    }

    const saved = await response.json()

    const savedRule = {
      id: saved.ruleId,
      name: saved.ruleName,
      type: saved.ruleType,
      category: formData.category,
      condition: formData.condition.trim(),
      action: formData.action.trim(),
      priority: formData.priority,
      enabled: saved.isActive ?? true,
    }

    setRules((previous) =>
      editingId
        ? previous.map((rule) =>
            rule.id === editingId ? savedRule : rule
          )
        : [...previous, savedRule]
    )

    resetForm()
  } catch (err) {
    alert(err.message || "Could not save the rule.")
  }
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

 
const handleDelete = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this rule?"
  )

  if (!confirmed) return

  const token = localStorage.getItem("token")

  if (!token) {
    alert("Please log in again.")
    return
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/rules/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      const message = await response.text()
      throw new Error(message || "Could not delete the rule.")
    }

    setRules((previous) =>
      previous.filter((rule) => rule.id !== id)
    )
  } catch (err) {
    alert(err.message || "Could not delete the rule.")
  }
}



const toggleRule = async (id) => {
  const rule = rules.find((item) => item.id === id)
  if (!rule) return

  const token = localStorage.getItem("token")

  if (!token) {
    alert("Please log in again.")
    return
  }

  const newStatus = !rule.enabled

  const payload = {
    ruleName: rule.name,
    ruleType: rule.type,
    conditionData: JSON.stringify({
      category: rule.category,
      condition: rule.condition,
      priority: rule.priority,
    }),
    actionData: JSON.stringify({
      action: rule.action,
    }),
    isActive: newStatus,
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/rules/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )

    if (!response.ok) {
      const message = await response.text()
      throw new Error(message || "Could not update rule status.")
    }

    const saved = await response.json()

    setRules((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...item, enabled: saved.isActive ?? newStatus }
          : item
      )
    )
  } catch (err) {
    alert(err.message || "Could not update rule status.")
  }
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