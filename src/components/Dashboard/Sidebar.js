import Link from "next/link";
import { useRouter } from "next/router";
import { Home, List, Heart, User, Settings } from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: <Home size={18} /> },
  { label: "My Listings", path: "/dashboard/listings", icon: <List size={18} /> },
  { label: "Favorites", path: "/dashboard/favorites", icon: <Heart size={18} /> },
  { label: "Profile", path: "/dashboard/profile", icon: <User size={18} /> },
  { label: "Settings", path: "/dashboard/settings", icon: <Settings size={18} /> },
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className="w-64 hidden md:block sticky top-0 h-screen overflow-y-hidden bg-white/60 backdrop-blur-lg shadow-xl border-r border-gray-200 p-6 z-20">
      <div className="text-2xl font-extrabold text-blue-800 mb-10 tracking-tight">Agent Panel</div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = router.pathname === item.path;
          return (
            <Link key={item.path} href={item.path}>
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

      <div className="mt-69 text-xs text-gray-400 px-0">
        © {new Date().getFullYear()} Aparte. All rights reserved.
      </div>
    </aside>
  );
}
