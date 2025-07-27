import Link from "next/link";
import { useRouter } from "next/router";
import { Home, List, Heart, User, Settings, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: <Home size={18} /> },
  { label: "My Listings", path: "/dashboard/listings", icon: <List size={18} /> },
  { label: "Favorites", path: "/dashboard/favorites", icon: <Heart size={18} /> },
  { label: "Profile", path: "/dashboard/profile", icon: <User size={18} /> },
  { label: "Settings", path: "/dashboard/settings", icon: <Settings size={18} /> },
];

export default function Sidebar({ onLinkClick }) {
  const [isOpen, setIsOpen] = useState(false); // State to control sidebar visibility on mobile
  const router = useRouter();

  const handleToggle = () => setIsOpen(!isOpen); // Toggle the sidebar visibility

  return (
    <>
      {/* Hamburger Icon - Visible only on mobile */}
      <div className="lg:hidden fixed top-2 right-4 z-50 p-4">
        <button onClick={handleToggle} className="text-blue-800">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out fixed inset-0 bg-white/60 backdrop-blur-lg shadow-xl border-r border-gray-200 p-6 z-40 lg:w-64 lg:static lg:h-full lg:sticky lg:top-0`}
      >
        <div className="text-2xl font-extrabold text-blue-800 mb-10 tracking-tight">Agent Panel</div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = router.pathname === item.path;
            return (
              <Link key={item.path} href={item.path} onClick={onLinkClick}>
                <span
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "hover:bg-blue-100 text-gray-700"
                  }`}
                >
                  {item.icon}
                  <span className="text-sm font-semibold">{item.label}</span>
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-65 text-xs text-gray-400 px-0 hidden md:block">
          © {new Date().getFullYear()} Aparte. All rights reserved.
        </div>
      </aside>

      {/* Overlay when the sidebar is open (on mobile) */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-30"
          onClick={handleToggle} // Close sidebar when clicking outside
        ></div>
      )}
    </>
  );
}
