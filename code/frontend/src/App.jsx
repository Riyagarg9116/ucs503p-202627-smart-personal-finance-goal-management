import { BrowserRouter, Routes, Route } from "react-router-dom"

import Sidebar from "./components/Sidebar"
import Dashboard from "./pages/Dashboard"
import Transactions from "./pages/Transactions"
import Budget from "./pages/Budget"
import Goals from "./pages/Goals"
import Scenarios from "./pages/Scenarios"
import Insights from "./pages/Insights"
import Rules from "./pages/Rules"
import Login from "./pages/Login"
import Register from "./pages/Register"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main Application */}
        <Route
          path="/*"
          element={
            <div className="flex min-h-screen bg-[#F8E8F0]">
              <Sidebar />

              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Dashboard />} />

                  <Route
                    path="/transactions"
                    element={<Transactions />}
                  />

                  <Route
                    path="/budget"
                    element={<Budget />}
                  />

                  <Route
                    path="/goals"
                    element={<Goals />}
                  />

                  <Route
                    path="/scenarios"
                    element={<Scenarios />}
                  />

                  <Route
                    path="/insights"
                    element={<Insights />}
                  />

                  <Route
                    path="/rules"
                    element={<Rules />}
                  />
                </Routes>
              </main>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App