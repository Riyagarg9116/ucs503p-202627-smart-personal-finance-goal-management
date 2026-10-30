import { useEffect, useState } from "react"
import {
  Target,
  Plus,
  Pencil,
  Trash2,
  Wallet,
  Calendar,
  X,
} from "lucide-react"

function Goals() {
const [goals, setGoals] = useState([])
useEffect(() => {
  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        console.error("No JWT token found")
        return
      }

      const response = await fetch(
        "http://localhost:8080/api/goals",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      if (!response.ok) {
        throw new Error(
          `Failed to fetch goals: ${response.status}`
        )
      }

      const data = await response.json()

      console.log("Backend goals:", data)

      const formattedGoals = data.map((goal) => ({
        id: goal.goalId,
        name: goal.goalName,
        target: Number(goal.targetAmount),
        saved: Number(goal.currentAmount || 0),
        deadline: goal.targetDate,
        priority: goal.priority,
        status: goal.status,
      }))

      setGoals(formattedGoals)
    } catch (error) {
      console.error("Error fetching goals:", error)
    }
  }

  fetchGoals()
}, [])

  const [showForm, setShowForm] = useState(false)
  const [showAddMoney, setShowAddMoney] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [selectedGoal, setSelectedGoal] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    target: "",
    saved: "",
    deadline: "",
  })

  const [moneyAmount, setMoneyAmount] = useState("")

  const formatCurrency = (amount) => {
    return `₹${Number(amount).toLocaleString("en-IN")}`
  }

  const formatDate = (date) => {
    if (!date) return "No deadline"

    const formattedDate = new Date(`${date}T00:00:00`)

    return formattedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const resetForm = () => {
    setFormData({
      name: "",
      target: "",
      saved: "",
      deadline: "",
    })

    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async (e) => {
  e.preventDefault()

  if (
    !formData.name ||
    !formData.target ||
    !formData.saved ||
    !formData.deadline
  ) {
    alert("Please fill all fields")
    return
  }

  try {
    const token = localStorage.getItem("token")

    if (!token) {
      alert("Please login first")
      return
    }

    // Get logged-in user ID from JWT
   const user = JSON.parse(localStorage.getItem("user") || "null")

if (!user?.userId) {
  alert("User information not found. Please log in again.")
  return
}

const userId = user.userId

    const targetAmount = Number(formData.target)
    const currentAmount = Math.min(
      Number(formData.saved),
      targetAmount
    )

    const goalData = {
      goalName: formData.name,
      targetAmount: targetAmount,
      currentAmount: currentAmount,
      targetDate: formData.deadline,
      priority: "medium",
      status: "active",
    }

    let response

    if (editingId) {
      // UPDATE existing goal
      response = await fetch(
        `http://localhost:8080/api/goals/${editingId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(goalData),
        }
      )
    } else {
      // CREATE new goal
      response = await fetch(
        `http://localhost:8080/api/goals/user/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(goalData),
        }
      )
    }

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Request failed: ${response.status} ${errorText}`
      )
    }

    const savedGoal = await response.json()

    console.log("Goal saved:", savedGoal)

    const formattedGoal = {
      id: savedGoal.goalId,
      name: savedGoal.goalName,
      target: Number(savedGoal.targetAmount),
      saved: Number(savedGoal.currentAmount || 0),
      deadline: savedGoal.targetDate,
      priority: savedGoal.priority,
      status: savedGoal.status,
    }

    if (editingId) {
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === editingId ? formattedGoal : goal
        )
      )
    } else {
      setGoals((prevGoals) => [...prevGoals, formattedGoal])
    }

    resetForm()

  } catch (error) {
    console.error("Error saving goal:", error)
    alert(`Could not save goal: ${error.message}`)
  }
}

  const handleEdit = (goal) => {
    setEditingId(goal.id)

    setFormData({
      name: goal.name,
      target: goal.target,
      saved: goal.saved,
      deadline: goal.deadline,
    })

    setShowForm(true)
  }

 const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this goal?"
  )

  if (!confirmDelete) {
    return
  }

  try {
    const token = localStorage.getItem("token")

    if (!token) {
      alert("Please login first")
      return
    }

    const response = await fetch(
      `http://localhost:8080/api/goals/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()

      throw new Error(
        `Delete failed: ${response.status} ${errorText}`
      )
    }

    // Remove from the frontend after backend deletion succeeds
    setGoals((prevGoals) =>
      prevGoals.filter((goal) => goal.id !== id)
    )

    console.log("Goal deleted successfully")
  } catch (error) {
    console.error("Error deleting goal:", error)
    alert(`Could not delete goal: ${error.message}`)
  }
}

 const handleAddMoney = async (e) => {
  e.preventDefault()

  const amount = Number(moneyAmount)

  if (!amount || amount <= 0) {
    alert("Please enter a valid amount")
    return
  }

  if (!selectedGoal) {
    return
  }

  try {
    const token = localStorage.getItem("token")

    if (!token) {
      alert("Please login first")
      return
    }

    const newSavedAmount = Math.min(
      selectedGoal.saved + amount,
      selectedGoal.target
    )

    const goalData = {
      goalName: selectedGoal.name,
      targetAmount: selectedGoal.target,
      currentAmount: newSavedAmount,
      targetDate: selectedGoal.deadline,
      priority: selectedGoal.priority || "medium",
      status: selectedGoal.status || "active",
    }

    const response = await fetch(
      `http://localhost:8080/api/goals/${selectedGoal.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(goalData),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()

      throw new Error(
        `Request failed: ${response.status} ${errorText}`
      )
    }

    const updatedGoal = await response.json()

    console.log("Goal after adding money:", updatedGoal)

    const formattedGoal = {
      id: updatedGoal.goalId,
      name: updatedGoal.goalName,
      target: Number(updatedGoal.targetAmount),
      saved: Number(updatedGoal.currentAmount || 0),
      deadline: updatedGoal.targetDate,
      priority: updatedGoal.priority,
      status: updatedGoal.status,
    }

    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === selectedGoal.id ? formattedGoal : goal
      )
    )

    setSelectedGoal(null)
    setMoneyAmount("")
    setShowAddMoney(false)

  } catch (error) {
    console.error("Error adding money:", error)
    alert(`Could not add money: ${error.message}`)
  }
}

  const totalTarget = goals.reduce(
    (total, goal) => total + Number(goal.target),
    0
  )

  const totalSaved = goals.reduce(
    (total, goal) => total + Number(goal.saved),
    0
  )

  const totalRemaining = Math.max(totalTarget - totalSaved, 0)

  const overallProgress =
    totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0

  return (
    <div className="min-h-screen bg-[#F8E8F0] p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#41366C]">
            Financial Goals
          </h1>

          <p className="mt-2 text-[#644984]">
            Set goals, track your savings, and stay financially motivated.
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
          Add Goal
        </button>
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#E8CEE5] p-3">
              <Target className="text-[#644984]" size={24} />
            </div>

            <div>
              <p className="text-sm text-[#644984]">Total Target</p>
              <h2 className="text-2xl font-bold text-[#41366C]">
                {formatCurrency(totalTarget)}
              </h2>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#E1EDE5] p-3">
              <Wallet className="text-[#5F8D72]" size={24} />
            </div>

            <div>
              <p className="text-sm text-[#644984]">Total Saved</p>
              <h2 className="text-2xl font-bold text-[#5F8D72]">
                {formatCurrency(totalSaved)}
              </h2>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#F3E0E0] p-3">
              <Wallet className="text-[#C76B6B]" size={24} />
            </div>

            <div>
              <p className="text-sm text-[#644984]">Remaining</p>
              <h2 className="text-2xl font-bold text-[#C76B6B]">
                {formatCurrency(totalRemaining)}
              </h2>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-[#644984]">Overall Progress</p>

          <div className="mt-3 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#41366C]">
              {overallProgress}%
            </h2>

            <span className="text-sm font-semibold text-[#644984]">
              {goals.length} goals
            </span>
          </div>

          <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#E8CEE5]">
            <div
              className="h-full rounded-full bg-[#644984] transition-all"
              style={{
                width: `${Math.min(overallProgress, 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Add / Edit Goal Form */}
      {showForm && (
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#41366C]">
                {editingId ? "Edit Goal" : "Create New Goal"}
              </h2>

              <p className="mt-1 text-sm text-[#644984]">
                Add details about your financial goal.
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
                Goal Name
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
                placeholder="e.g. Emergency Fund"
                className="w-full rounded-xl border border-[#E8CEE5] px-4 py-3 outline-none transition focus:border-[#644984]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#41366C]">
                Target Amount
              </label>

              <input
                type="number"
                min="1"
                value={formData.target}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    target: e.target.value,
                  })
                }
                placeholder="50000"
                className="w-full rounded-xl border border-[#E8CEE5] px-4 py-3 outline-none transition focus:border-[#644984]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#41366C]">
                Already Saved
              </label>

              <input
                type="number"
                min="0"
                value={formData.saved}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    saved: e.target.value,
                  })
                }
                placeholder="10000"
                className="w-full rounded-xl border border-[#E8CEE5] px-4 py-3 outline-none transition focus:border-[#644984]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#41366C]">
                Deadline
              </label>

              <input
                type="date"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deadline: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-[#E8CEE5] px-4 py-3 outline-none transition focus:border-[#644984]"
              />
            </div>

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                className="rounded-xl bg-[#644984] px-6 py-3 font-semibold text-white transition hover:bg-[#41366C]"
              >
                {editingId ? "Update Goal" : "Create Goal"}
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

      {/* Goals */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-[#41366C]">
          Your Goals
        </h2>

        {goals.length === 0 ? (
          <div className="mt-5 rounded-2xl bg-white p-10 text-center shadow-sm">
            <Target
              size={48}
              className="mx-auto text-[#B07EAA]"
            />

            <h3 className="mt-4 text-xl font-bold text-[#41366C]">
              No goals yet
            </h3>

            <p className="mt-2 text-[#644984]">
              Create your first financial goal to start tracking your progress.
            </p>

            <button
              onClick={() => setShowForm(true)}
              className="mt-5 rounded-xl bg-[#644984] px-5 py-3 font-semibold text-white"
            >
              Create Goal
            </button>
          </div>
        ) : (
          <div className="mt-5 grid gap-6 lg:grid-cols-2">
            {goals.map((goal) => {
              const progress =
                goal.target > 0
                  ? Math.round((goal.saved / goal.target) * 100)
                  : 0

              const remaining = Math.max(
                goal.target - goal.saved,
                0
              )

              const completed = goal.saved >= goal.target

              return (
                <div
                  key={goal.id}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  {/* Goal Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-xl bg-[#E8CEE5] p-3">
                        <Target
                          size={24}
                          className="text-[#644984]"
                        />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-[#41366C]">
                          {goal.name}
                        </h3>

                        <div className="mt-1 flex items-center gap-2 text-sm text-[#644984]">
                          <Calendar size={16} />

                          <span>
                            Deadline: {formatDate(goal.deadline)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(goal)}
                        className="rounded-lg p-2 text-[#644984] transition hover:bg-[#F8E8F0]"
                        title="Edit goal"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="rounded-lg p-2 text-[#C76B6B] transition hover:bg-[#F3E0E0]"
                        title="Delete goal"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="mt-6 flex items-end justify-between">
                    <div>
                      <p className="text-sm text-[#644984]">
                        Saved
                      </p>

                      <p className="mt-1 text-2xl font-bold text-[#5F8D72]">
                        {formatCurrency(goal.saved)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-[#644984]">
                        Target
                      </p>

                      <p className="mt-1 text-xl font-bold text-[#41366C]">
                        {formatCurrency(goal.target)}
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#644984]">
                        Progress
                      </span>

                      <span className="text-sm font-bold text-[#41366C]">
                        {progress}%
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-[#E8CEE5]">
                      <div
                        className="h-full rounded-full bg-[#644984] transition-all"
                        style={{
                          width: `${Math.min(progress, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Bottom */}
                  <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      {completed ? (
                        <p className="font-semibold text-[#5F8D72]">
                          Goal completed 🎉
                        </p>
                      ) : (
                        <p className="text-sm text-[#644984]">
                          Remaining:{" "}
                          <span className="font-bold text-[#41366C]">
                            {formatCurrency(remaining)}
                          </span>
                        </p>
                      )}
                    </div>

                    {!completed && (
                      <button
                        onClick={() => {
                          setSelectedGoal(goal)
                          setMoneyAmount("")
                          setShowAddMoney(true)
                        }}
                        className="flex items-center justify-center gap-2 rounded-xl bg-[#CF82A7] px-4 py-2.5 font-semibold text-[#41366C] transition hover:bg-[#E09DC3]"
                      >
                        <Plus size={18} />
                        Add Money
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add Money Modal */}
      {showAddMoney && selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#41366C]">
                  Add Money
                </h2>

                <p className="mt-1 text-sm text-[#644984]">
                  Add savings to "{selectedGoal.name}".
                </p>
              </div>

              <button
                onClick={() => {
                  setShowAddMoney(false)
                  setSelectedGoal(null)
                  setMoneyAmount("")
                }}
                className="rounded-lg p-2 text-[#644984] hover:bg-[#F8E8F0]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddMoney} className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-[#41366C]">
                Amount
              </label>

              <input
                type="number"
                min="1"
                value={moneyAmount}
                onChange={(e) => setMoneyAmount(e.target.value)}
                placeholder="Enter amount"
                autoFocus
                className="w-full rounded-xl border border-[#E8CEE5] px-4 py-3 outline-none transition focus:border-[#644984]"
              />

              <div className="mt-5 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#644984] px-5 py-3 font-semibold text-white transition hover:bg-[#41366C]"
                >
                  Add Money
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowAddMoney(false)
                    setSelectedGoal(null)
                    setMoneyAmount("")
                  }}
                  className="rounded-xl bg-[#E8CEE5] px-5 py-3 font-semibold text-[#41366C] transition hover:bg-[#E09DC3]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Goals