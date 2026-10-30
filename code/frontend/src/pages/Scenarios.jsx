import { useEffect, useState } from "react"
import {
  Plus,
  Pencil,
  Trash2,
  X,
  TrendingUp,
  Wallet,
  PiggyBank,
  Star,
} from "lucide-react"

function Scenarios() {
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  useEffect(() => {
    const fetchScenarios = async () => {
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
          "http://localhost:8080/api/scenarios",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error("Could not load your scenarios.")
        }

        const data = await response.json()

        const loadedScenarios = data.map((item) => {
          let input = {}
          let result = {}

          try {
            input = item.inputData ? JSON.parse(item.inputData) : {}
          } catch {
            input = {}
          }

          try {
            result = item.resultData ? JSON.parse(item.resultData) : {}
          } catch {
            result = {}
          }

          return {
            id: item.scenarioId,
            name: item.scenarioName,
            income: Number(input.income) || 0,
            expenses: Number(input.expenses) || 0,
            months: Number(input.months) || 6,
          }
        })

        setScenarios(loadedScenarios)
      } catch (err) {
        setError(err.message || "Something went wrong.")
      } finally {
        setLoading(false)
      }
    }

    fetchScenarios()
  }, [])


 
  const [scenarios, setScenarios] = useState([])


  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    income: "",
    expenses: "",
    months: "6",
  })

  const formatCurrency = (amount) => {
    return `₹${Number(amount).toLocaleString("en-IN")}`
  }

  const resetForm = () => {
    setFormData({
      name: "",
      income: "",
      expenses: "",
      months: "6",
    })

    setEditingId(null)
    setShowForm(false)
  }

  
const handleSubmit = async (e) => {
  e.preventDefault()

  if (
    !formData.name.trim() ||
    formData.income === "" ||
    formData.expenses === "" ||
    formData.months === ""
  ) {
    alert("Please fill in all fields.")
    return
  }

  const income = Number(formData.income)
  const expenses = Number(formData.expenses)
  const months = Number(formData.months)

  if (
    !Number.isFinite(income) ||
    !Number.isFinite(expenses) ||
    !Number.isFinite(months) ||
    income <= 0 ||
    expenses < 0 ||
    months <= 0
  ) {
    alert("Enter valid income, expenses, and projection period.")
    return
  }

  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user") || "null")

  if (!token || !user?.userId) {
    alert("Please log in again.")
    return
  }

  const monthlySavings = income - expenses
  const scenarioData = {
    name: formData.name.trim(),
    income,
    expenses,
    months,
  }

  const payload = {
    scenarioName: scenarioData.name,
    description: `Financial projection for ${months} months`,
    inputData: JSON.stringify({ income, expenses, months }),
    resultData: JSON.stringify({
      monthlySavings,
      futureSavings: monthlySavings * months,
      savingsRate: Math.round((monthlySavings / income) * 100),
    }),
  }

  try {
    const response = await fetch(
      editingId
        ? `http://localhost:8080/api/scenarios/${editingId}`
        : `http://localhost:8080/api/scenarios/user/${user.userId}`,
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
      throw new Error(message || "Could not save the scenario.")
    }

    const saved = await response.json()

    const savedScenario = {
      id: saved.scenarioId,
      name: saved.scenarioName,
      income,
      expenses,
      months,
    }

    setScenarios((previous) =>
      editingId
        ? previous.map((item) =>
            item.id === editingId ? savedScenario : item
          )
        : [...previous, savedScenario]
    )

    resetForm()
  } catch (err) {
    alert(err.message || "Could not save the scenario.")
  }
}


  const handleEdit = (scenario) => {
    setEditingId(scenario.id)

    setFormData({
      name: scenario.name,
      income: scenario.income,
      expenses: scenario.expenses,
      months: scenario.months,
    })

    setShowForm(true)
  }

 
const handleDelete = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this scenario?"
  )

  if (!confirmed) return

  const token = localStorage.getItem("token")

  if (!token) {
    alert("Please log in again.")
    return
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/scenarios/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      const message = await response.text()
      throw new Error(message || "Could not delete scenario.")
    }

    setScenarios((previous) =>
      previous.filter((scenario) => scenario.id !== id)
    )
  } catch (err) {
    alert(err.message || "Could not delete scenario.")
  }
}


  const scenarioCalculations = scenarios.map((scenario) => {
    const monthlySavings =
      scenario.income - scenario.expenses

    const futureSavings =
      monthlySavings * scenario.months

    const savingsRate =
      scenario.income > 0
        ? Math.round(
            (monthlySavings / scenario.income) * 100
          )
        : 0

    return {
      ...scenario,
      monthlySavings,
      futureSavings,
      savingsRate,
    }
  })

  const bestScenario =
    scenarioCalculations.length > 0
      ? scenarioCalculations.reduce((best, scenario) =>
          scenario.futureSavings > best.futureSavings
            ? scenario
            : best
        )
      : null

  const currentScenario =
    scenarioCalculations.find(
      (scenario) => scenario.name === "Current Plan"
    ) || scenarioCalculations[0]

  return (
    <div className="min-h-screen bg-[#F8E8F0] p-8">
      {loading && (
  <p className="mb-4 text-center text-[#644984]">
    Loading your scenarios...
  </p>
)}

{error && (
  <p className="mb-4 rounded-xl bg-white p-4 text-center text-red-600">
    {error}
  </p>
)}
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#41366C]">
            Scenario Planning
          </h1>

          <p className="mt-2 text-[#644984]">
            Compare different financial plans and see how
            your decisions could affect future savings.
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
          Add Scenario
        </button>
      </div>

      {/* Overview Cards */}
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#E8CEE5] p-3">
              <Wallet
                size={24}
                className="text-[#644984]"
              />
            </div>

            <div>
              <p className="text-sm text-[#644984]">
                Monthly Income
              </p>

              <h2 className="text-2xl font-bold text-[#41366C]">
                {formatCurrency(
                  currentScenario?.income || 0
                )}
              </h2>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#F3E0E0] p-3">
              <TrendingUp
                size={24}
                className="text-[#C76B6B]"
              />
            </div>

            <div>
              <p className="text-sm text-[#644984]">
                Monthly Expenses
              </p>

              <h2 className="text-2xl font-bold text-[#C76B6B]">
                {formatCurrency(
                  currentScenario?.expenses || 0
                )}
              </h2>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#E1EDE5] p-3">
              <PiggyBank
                size={24}
                className="text-[#5F8D72]"
              />
            </div>

            <div>
              <p className="text-sm text-[#644984]">
                Monthly Savings
              </p>

              <h2 className="text-2xl font-bold text-[#5F8D72]">
                {formatCurrency(
                  currentScenario?.monthlySavings || 0
                )}
              </h2>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#E8CEE5] p-3">
              <Star
                size={24}
                className="text-[#644984]"
              />
            </div>

            <div>
              <p className="text-sm text-[#644984]">
                Best Scenario
              </p>

              <h2 className="text-lg font-bold text-[#41366C]">
                {bestScenario?.name || "No scenarios"}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#41366C]">
                {editingId
                  ? "Edit Scenario"
                  : "Create New Scenario"}
              </h2>

              <p className="mt-1 text-sm text-[#644984]">
                Change your income and expenses to explore a
                possible financial future.
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
                Scenario Name
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
                placeholder="e.g. Save More"
                className="w-full rounded-xl border border-[#E8CEE5] px-4 py-3 outline-none transition focus:border-[#644984]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#41366C]">
                Monthly Income
              </label>

              <input
                type="number"
                min="1"
                value={formData.income}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    income: e.target.value,
                  })
                }
                placeholder="45000"
                className="w-full rounded-xl border border-[#E8CEE5] px-4 py-3 outline-none transition focus:border-[#644984]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#41366C]">
                Monthly Expenses
              </label>

              <input
                type="number"
                min="0"
                value={formData.expenses}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expenses: e.target.value,
                  })
                }
                placeholder="18000"
                className="w-full rounded-xl border border-[#E8CEE5] px-4 py-3 outline-none transition focus:border-[#644984]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#41366C]">
                Projection Period
              </label>

              <select
                value={formData.months}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    months: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-[#E8CEE5] bg-white px-4 py-3 outline-none transition focus:border-[#644984]"
              >
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
                <option value="24">24 Months</option>
                <option value="36">36 Months</option>
              </select>
            </div>

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                className="rounded-xl bg-[#644984] px-6 py-3 font-semibold text-white transition hover:bg-[#41366C]"
              >
                {editingId
                  ? "Update Scenario"
                  : "Create Scenario"}
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

      {/* Best Scenario */}
      {bestScenario && (
        <div className="mt-8 rounded-2xl bg-[#644984] p-6 text-white shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-[#CF82A7] p-3">
                <Star size={25} />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Recommended Scenario: {bestScenario.name}
                </h2>

                <p className="mt-2 text-[#F8E8F0]">
                  This scenario gives you the highest projected
                  savings over {bestScenario.months} months.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-white/10 px-5 py-4">
              <p className="text-sm text-[#F8E8F0]">
                Projected Savings
              </p>

              <p className="mt-1 text-2xl font-bold">
                {formatCurrency(
                  bestScenario.futureSavings
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Scenario Comparison */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-[#41366C]">
          Compare Scenarios
        </h2>

        <p className="mt-2 text-[#644984]">
          See how different spending decisions affect your
          future savings.
        </p>

        {scenarioCalculations.length === 0 ? (
          <div className="mt-5 rounded-2xl bg-white p-10 text-center shadow-sm">
            <TrendingUp
              size={45}
              className="mx-auto text-[#B07EAA]"
            />

            <h3 className="mt-4 text-xl font-bold text-[#41366C]">
              No scenarios yet
            </h3>

            <p className="mt-2 text-[#644984]">
              Create a scenario to start planning your
              financial future.
            </p>
          </div>
        ) : (
          <div className="mt-5 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {scenarioCalculations.map((scenario) => {
              const isBest =
                bestScenario?.id === scenario.id

              return (
                <div
                  key={scenario.id}
                  className={`rounded-2xl bg-white p-6 shadow-sm ${
                    isBest
                      ? "ring-2 ring-[#CF82A7]"
                      : ""
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-[#41366C]">
                          {scenario.name}
                        </h3>

                        {isBest && (
                          <span className="rounded-full bg-[#E8CEE5] px-2 py-1 text-xs font-bold text-[#644984]">
                            Best
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-[#644984]">
                        {scenario.months}-month projection
                      </p>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          handleEdit(scenario)
                        }
                        className="rounded-lg p-2 text-[#644984] transition hover:bg-[#F8E8F0]"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(scenario.id)
                        }
                        className="rounded-lg p-2 text-[#C76B6B] transition hover:bg-[#F3E0E0]"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Income */}
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm text-[#644984]">
                      Monthly Income
                    </span>

                    <span className="font-semibold text-[#5F8D72]">
                      {formatCurrency(scenario.income)}
                    </span>
                  </div>

                  {/* Expenses */}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-[#644984]">
                      Monthly Expenses
                    </span>

                    <span className="font-semibold text-[#C76B6B]">
                      {formatCurrency(scenario.expenses)}
                    </span>
                  </div>

                  {/* Monthly Savings */}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-[#644984]">
                      Monthly Savings
                    </span>

                    <span
                      className={`font-semibold ${
                        scenario.monthlySavings >= 0
                          ? "text-[#5F8D72]"
                          : "text-[#C76B6B]"
                      }`}
                    >
                      {formatCurrency(
                        scenario.monthlySavings
                      )}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="my-5 border-t border-[#E8CEE5]" />

                  {/* Savings Rate */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#644984]">
                        Savings Rate
                      </span>

                      <span className="font-bold text-[#41366C]">
                        {scenario.savingsRate}%
                      </span>
                    </div>

                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#E8CEE5]">
                      <div
                        className={`h-full rounded-full ${
                          scenario.savingsRate >= 20
                            ? "bg-[#5F8D72]"
                            : scenario.savingsRate >= 10
                            ? "bg-[#CF82A7]"
                            : "bg-[#C76B6B]"
                        }`}
                        style={{
                          width: `${Math.min(
                            Math.max(
                              scenario.savingsRate,
                              0
                            ),
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Future Savings */}
                  <div className="mt-5 rounded-xl bg-[#F8E8F0] p-4">
                    <p className="text-sm text-[#644984]">
                      Projected Savings
                    </p>

                    <p
                      className={`mt-1 text-2xl font-bold ${
                        scenario.futureSavings >= 0
                          ? "text-[#41366C]"
                          : "text-[#C76B6B]"
                      }`}
                    >
                      {formatCurrency(
                        scenario.futureSavings
                      )}
                    </p>

                    <p className="mt-1 text-xs text-[#644984]">
                      After {scenario.months} months
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#41366C]">
          How Scenario Planning Works
        </h2>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <div className="rounded-xl bg-[#F8E8F0] p-5">
            <div className="rounded-lg bg-[#E8CEE5] p-2 w-fit">
              <Wallet
                size={20}
                className="text-[#644984]"
              />
            </div>

            <h3 className="mt-3 font-bold text-[#41366C]">
              1. Set Income
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#644984]">
              Enter the monthly income you expect to receive
              in your scenario.
            </p>
          </div>

          <div className="rounded-xl bg-[#F8E8F0] p-5">
            <div className="rounded-lg bg-[#F3E0E0] p-2 w-fit">
              <TrendingUp
                size={20}
                className="text-[#C76B6B]"
              />
            </div>

            <h3 className="mt-3 font-bold text-[#41366C]">
              2. Adjust Expenses
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#644984]">
              Change your expected monthly expenses to see
              different financial outcomes.
            </p>
          </div>

          <div className="rounded-xl bg-[#F8E8F0] p-5">
            <div className="rounded-lg bg-[#E1EDE5] p-2 w-fit">
              <PiggyBank
                size={20}
                className="text-[#5F8D72]"
              />
            </div>

            <h3 className="mt-3 font-bold text-[#41366C]">
              3. Compare Savings
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#644984]">
              Compare projected savings and choose the plan
              that works best for you.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Scenarios