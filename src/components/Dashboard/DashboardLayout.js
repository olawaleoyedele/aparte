import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 text-gray-800">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1 backdrop-blur-sm">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 md:p-10 transition-all">
          <div className="bg-white/90 rounded-2xl shadow-xl p-6 sm:p-8 md:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
