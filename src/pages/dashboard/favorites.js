import DashboardLayout from "@/components/Dashboard/DashboardLayout";

export default function FavoritesPage() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">My Favorites</h1>
      <p className="text-gray-600">Saved properties will appear here for quick access.</p>
    </DashboardLayout>
  );
}
