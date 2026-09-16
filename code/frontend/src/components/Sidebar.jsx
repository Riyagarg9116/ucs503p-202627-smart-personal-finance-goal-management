import { NavLink } from "react-router-dom"

function Sidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Transactions", path: "/transactions" },
    { name: "Budget", path: "/budget" },
    { name: "Goals", path: "/goals" },
    { name: "Scenarios", path: "/scenarios" },
    { name: "Insights", path: "/insights" },
    { name: "Rules", path: "/rules" },
  ]

  return (
    <aside className="w-64 min-h-screen bg-[#644984] p-6 text-white">

      <h1 className="mb-10 text-2xl font-bold">
        SmartFinance
      </h1>

      <nav className="space-y-3">

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block w-full rounded-lg px-4 py-3 transition ${
                isActive
                  ? "bg-[#CF82A7] font-semibold"
                  : "hover:bg-[#B07EAA]"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}

      </nav>

    </aside>
  )
}

export default Sidebar