import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Wallet,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
} from "lucide-react"

function Register() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    setError("")

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.")
      return
    }

    if (formData.password.length < 6) {
      setError(
        "Password must be at least 6 characters long."
      )
      return
    }

    if (
      formData.password !== formData.confirmPassword
    ) {
      setError("Passwords do not match.")
      return
    }

    navigate("/login")
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
              Start your financial journey.
            </h2>

            <p className="mt-6 text-lg leading-8 text-[#F8E8F0]">
              Create your account and start tracking,
              planning, and improving your personal finances.
            </p>

            <div className="mt-10 space-y-4">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="font-semibold">
                  Organize your money
                </p>

                <p className="mt-1 text-sm text-[#F8E8F0]">
                  Keep your income and expenses in one place.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="font-semibold">
                  Build better habits
                </p>

                <p className="mt-1 text-sm text-[#F8E8F0]">
                  Understand where your money is going.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="font-semibold">
                  Reach your goals
                </p>

                <p className="mt-1 text-sm text-[#F8E8F0]">
                  Plan savings and work towards your financial
                  goals.
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
                  Create account
                </h2>

                <p className="mt-2 text-[#644984]">
                  Join SmartFinance and start managing your
                  money smarter.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#41366C]">
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B07EAA]"
                    />

                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-[#E8CEE5] py-3 pl-11 pr-4 text-[#41366C] outline-none transition placeholder:text-[#B07EAA] focus:border-[#644984] focus:ring-2 focus:ring-[#E8CEE5]"
                    />
                  </div>
                </div>

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
                      placeholder="Create a password"
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

                {/* Confirm Password */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#41366C]">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B07EAA]"
                    />

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Confirm your password"
                      className="w-full rounded-xl border border-[#E8CEE5] py-3 pl-11 pr-12 text-[#41366C] outline-none transition placeholder:text-[#B07EAA] focus:border-[#644984] focus:ring-2 focus:ring-[#E8CEE5]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#644984] transition hover:text-[#41366C]"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-xl bg-[#F3E0E0] px-4 py-3 text-sm font-medium text-[#C76B6B]">
                    {error}
                  </div>
                )}

                {/* Register Button */}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#644984] py-3.5 font-semibold text-white transition hover:bg-[#41366C]"
                >
                  Create Account
                </button>
              </form>

              {/* Login Link */}
              <div className="mt-8 text-center">
                <p className="text-sm text-[#644984]">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-[#644984] hover:text-[#41366C]"
                  >
                    Sign in
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

export default Register