import { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { NavLink } from 'react-router-dom';
import avatar from "../assets/images/avatar.jpg";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();

  const [openMenu, setOpenMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <nav className="space-y-3">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => 
              `block px-3 py-2 rounded hover:bg-gray-100 ${
                isActive ? "bg-gray-200 font-semibold" : ""
              }`
            }
          >
            <i className="fa-solid fa-house mr-1.5"></i>
            Overview
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Top Navbar */}
        <header className="bg-white shadow px-6 py-3 flex justify-end items-center relative">
          
          {/* Avatar */}
          <div ref={dropdownRef} className="relative">
            <img
              src={avatar}
              className="w-9 h-9 rounded-full cursor-pointer"
              onClick={() => setOpenMenu((prev) => !prev)}
            />

            {openMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white border-2 border-gray-400 shadow-lg">
                <ul>
                  <li>
                    <button
                      className="w-full text-left px-4 py-2 border-b border-gray-300 cursor-pointer relative hover:bg-gray-200"
                      onClick={logout}
                    >
                      Log out
                      <i className="fa-solid fa-arrow-right-from-bracket absolute top-1/2 -translate-y-1/2 right-1"></i>
                    </button>
                  </li>
                </ul>
                <div className="absolute -top-2.75 right-1.75">
                  <div className="w-0 h-0 
                              border-l-[10px] border-l-transparent
                              border-r-[10px] border-r-transparent
                              border-b-[10px] border-b-gray-400">
                  </div>

                  <div className="absolute top-[2px] left-1/2 -translate-x-1/2
                              w-0 h-0
                              border-l-[10px] border-l-transparent
                              border-r-[10px] border-r-transparent
                              border-b-[10px] border-b-white">
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
