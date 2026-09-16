import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Wallet, Eye, EyeOff, Mail, Lock } from "lucide-react"

function Login() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      return
    }

    navigate("/")
  }

  return (
    <div className="min-h-screen bg-[#F8E8F0]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Left Section */}
        <div className="flex flex-1 items-center justify-center bg-[#644984] px-8 py-12 text-white lg:min-h-screen">
          <div className="max-w-lg">
            <div className="mb-8 flex items-center gap-3">
              <div className="rounded-2xl bg-[#CF82A7] p-3">
                <Wallet size={30} />
              </div>

              <h1 className="text-3xl font-bold">
                SmartFinance
              </h1>
            </div>

            <h2 className="text-4xl font-bold leading-tight md:text-5xl">
              Take control of your money.
            </h2>

            <p className="mt-6 text-lg leading-8 text-[#F8E8F0]">
              Track your spending, manage budgets, set goals,
              and make smarter financial decisions — all in
              one place.
            </p>

            <div className="mt-10 space-y-4">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="font-semibold">
                  Track your finances
                </p>
                <p className="mt-1 text-sm text-[#F8E8F0]">
                  Keep your income and expenses organized.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="font-semibold">
                  Plan your future
                </p>
                <p className="mt-1 text-sm text-[#F8E8F0]">
                  Create goals and compare financial scenarios.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="font-semibold">
                  Get smarter insights
                </p>
                <p className="mt-1 text-sm text-[#F8E8F0]">
                  Understand your spending habits and savings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-1 items-center justify-center px-6 py-12 md:px-10 lg:px-16">
          <div className="w-full max-w-md">
            <div className="rounded-3xl bg-white p-8 shadow-sm md:p-10">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#41366C]">
                  Welcome back
                </h2>

                <p className="mt-2 text-[#644984]">
                  Sign in to continue to your dashboard.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#41366C]">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B07EAA]"
                    />

                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-[#E8CEE5] py-3 pl-11 pr-4 text-[#41366C] outline-none transition placeholder:text-[#B07EAA] focus:border-[#644984] focus:ring-2 focus:ring-[#E8CEE5]"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#41366C]">
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B07EAA]"
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          password: e.target.value,
                        })
                      }
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-[#E8CEE5] py-3 pl-11 pr-12 text-[#41366C] outline-none transition placeholder:text-[#B07EAA] focus:border-[#644984] focus:ring-2 focus:ring-[#E8CEE5]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#644984] transition hover:text-[#41366C]"
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm font-semibold text-[#644984] transition hover:text-[#41366C]"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#644984] py-3.5 font-semibold text-white transition hover:bg-[#41366C]"
                >
                  Sign In
                </button>
              </form>

              {/* Register */}
              <div className="mt-8 text-center">
                <p className="text-sm text-[#644984]">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-bold text-[#644984] hover:text-[#41366C]"
                  >
                    Create one
                  </Link>
                </p>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-[#644984]">
              Smart Personal Finance & Goal Management System
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login