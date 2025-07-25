import DashboardLayout from "@/components/Dashboard/DashboardLayout";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <p className="text-gray-600">Adjust your preferences, notifications, and account details here.</p>
    </DashboardLayout>
  );
}
