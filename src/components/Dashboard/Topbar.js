import { Bell } from "lucide-react";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-20 bg-white/30 backdrop-blur-md shadow-sm px-6 py-4 flex justify-between items-center border-b border-white/40">
      <h2 className="text-xl font-semibold text-blue-900">Dashboard</h2>

      <div className="flex items-center gap-4 text-sm text-gray-700">
        <span className="hidden sm:inline">Welcome, Agent</span>

        <button className="relative p-2 rounded-full hover:bg-blue-100 transition duration-200">
          <Bell className="w-5 h-5 text-blue-700" />
          {/* Badge (optional for notifications) */}
          {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span> */}
        </button>

        {/* Optional: User Avatar Placeholder */}
        <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center text-white font-bold text-xs">
          AG
        </div>
      </div>
    </header>
  );
}
