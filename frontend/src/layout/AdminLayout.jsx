
import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import Header from "../components/user/Header";
import Footer from "../components/user/Footer";
import { MdDashboardCustomize } from "react-icons/md";
import { MdAddBox } from "react-icons/md";
import { GrDocumentUpdate } from "react-icons/gr";
import { MdDeleteForever } from "react-icons/md";


export default function AdminLayout() {
  return (
    <>
      <Header />

      <div className="min-h-screen flex bg-gray-100">
        {/* Sidebar - hidden only on mobile (<768px) */}
        <aside className="hidden sm:block w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6">
          <h2 className="text-2xl font-bold mb-8 text-center">Admin Panel</h2>

          <nav className="flex flex-col gap-3">
            <NavLink
              to="/admindashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white  transition-all duration-200"
            >
              <MdDashboardCustomize className="text-xl text-orange-500 size-8" />
              <span>Dashboard</span>
            </NavLink>


            <NavLink
              to="add"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200 
               ${isActive ? "bg-blue-600 text-white" : "text-shadow-white hover:bg-blue-500"}`
              }
            >
              <MdAddBox className="text-2xl" />
              <span>Create Recipe</span>
            </NavLink>


            <NavLink
              to="update"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200 
     ${isActive ? "bg-blue-600 text-white" : "text-shadow-white hover:bg-blue-500"}`
              }
            >
              <GrDocumentUpdate className="text-xl" />
              <span>Update Recipe</span>
            </NavLink>


           <NavLink
  to="delete"
  className={({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200 
     ${isActive ? "bg-blue-600 text-white" : "text-shadow-white hover:bg-blue-500"}`
  }
>
  <MdDeleteForever className="text-xl text-red-500" />
  <span>Delete Recipe</span>
</NavLink>

<NavLink
  to="reviews"
  className={({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200 
     ${isActive ? "bg-blue-600 text-white" : "text-shadow-white hover:bg-blue-500"}`
  }
>
  <MdDeleteForever className="text-xl text-red-500" />
  <span>Delete Review</span>
</NavLink>

<NavLink
  to="users"
  className={({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200 
     ${isActive ? "bg-blue-600 text-white" : "text-shadow-white hover:bg-blue-500"}`
  }
>
  <MdDeleteForever className="text-xl text-red-500" />
  <span>Delete User</span>
</NavLink>

          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>

      <Footer />
    </>
  );
}
