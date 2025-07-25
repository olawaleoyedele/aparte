import React from "react";
import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import {
  ArrowRight,
  PlusCircle,
  Star,
  Home,
  Users,
  Wallet,
  ShieldCheck,
  Banknote,
  Building2,
  MessageSquare,
  TrendingUp
} from "lucide-react";

export default function DashboardHome({ email, name, role }) {
  return (
    <DashboardLayout>
      <div className="space-y-12">
        {/* Welcome Banner */}
<div className="relative bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 text-white rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row justify-between items-center overflow-hidden animate-fadeIn">
  {/* Decorative gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-50 pointer-events-none"></div>

  {/* Content */}
  <div className="relative z-10 text-center md:text-left">
    <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">
      Welcome back, <span className="capitalize">{role} {name}</span> 👋
    </h1>
    <p className="text-sm md:text-base text-white/90">
      You&apos;re logged in as <span className="font-semibold">{email}</span>
    </p>
  </div>

  {/* Image */}
  <div className="relative z-10 mt-6 md:mt-0">
    <img
      src="/dashboard.svg"
      alt="Agent Dashboard"
      className="w-14 md:w-16 drop-shadow-lg animate-float-slow"
    />
  </div>

  {/* Glow effect */}
  <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
</div>


        {/* Stats Overview */}
        <section>
          <h2 className="text-2xl font-semibold mb-5 text-gray-800">Quick Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={<Home />} title="Total Listings" value="0" />
            <StatCard icon={<Users />} title="Pending Inquiries" value="0" />
            <StatCard icon={<Star />} title="Favourites" value="0" />
            <StatCard icon={<ArrowRight />} title="Inspections Booked" value="0" />
            <StatCard icon={<Banknote />} title="Escrow Transactions" value="₦0.00" />
            <StatCard icon={<Wallet />} title="Wallet Balance" value="₦0.00" />
            <StatCard icon={<ShieldCheck />} title="Trust Score" value="90%" />
            <StatCard icon={<TrendingUp />} title="Profile Views" value="0" />
          </div>
        </section>

        {/* Recent Listings + Quick Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2 bg-white rounded-3xl shadow-lg p-8 transition-all duration-300">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Recent Listings</h2>
    <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200">
      View All
    </button>
  </div>

  <ul className="space-y-5">
    {["Lekki Duplex", "Ikeja Bungalow", "Ajah Mini Flat"].map((title, i) => (
      <li
        key={i}
        className="bg-gray-50 hover:bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">
              Lagos • <span className="text-gray-800 font-medium">₦{(i + 1) * 50000 + 50000}/mo</span>
            </p>
          </div>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full border ${
              i % 2 === 0
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-yellow-50 text-yellow-700 border-yellow-200"
            }`}
          >
            {i % 2 === 0 ? "Active" : "Pending"}
          </span>
        </div>
      </li>
    ))}
  </ul>
</div>


          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-3xl shadow p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-1">Quick Action</h2>
              <p className="text-sm text-white/80 mb-6">
                Post a new property listing in just a few clicks.
              </p>
            </div>
            <button className="bg-white text-indigo-700 hover:bg-indigo-100 w-full py-2.5 rounded-md flex items-center justify-center gap-2 text-sm font-medium">
              <PlusCircle className="w-4 h-4" /> Add New Listing
            </button>
          </div>
        </section>

        {/* Escrow & Insights */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl shadow-md p-6 md:col-span-2">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Recent Escrow Payments</h2>
            <ul className="space-y-3 text-sm">
              {["Lekki Duplex", "Ikeja Bungalow", "Ajah Mini Flat"].map((item, i) => (
                <li key={i} className="flex justify-between">
                  <span>{item}</span>
                  <span className="text-green-600 font-semibold">₦{(i+1)*50000 + 80000}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-3xl shadow p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">Escrow Balance</h2>
              <p className="text-sm text-green-100 mb-4">Current available balance:</p>
              <p className="text-3xl font-bold">₦320,000</p>
            </div>
            <button className="bg-white text-indigo-700 hover:bg-indigo-100 py-2 mt-4 rounded-md text-sm font-semibold">Withdraw to Bank</button>
          </div>

          <div className="md:col-span-3">
            <div className="bg-yellow-50 border border-yellow-300 p-6 rounded-3xl shadow mt-4 space-y-2">
              <h3 className="text-base font-semibold text-yellow-800">Agent Insights 💡</h3>
              <ul className="text-sm text-yellow-900 list-disc pl-5 space-y-1">
                <li>Update listings weekly to increase visibility.</li>
                <li>Add clear inspection terms to build trust.</li>
                <li>Maintain your Trust Score for premium leads.</li>
                <li>Avoid duplicate listings — our AI flags them!</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-transform hover:scale-[1.02] duration-300">
      <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const { token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: '/login/agent',
        permanent: false,
      },
    };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return {
      props: {
        name: decoded.name || 'User',
        role: decoded.role || 'User',
        email: decoded.email,
      },
    };
  } catch (err) {
    console.error('JWT verification failed:', err);
    return {
      redirect: {
        destination: '/login/agent',
        permanent: false,
      },
    };
  }
}