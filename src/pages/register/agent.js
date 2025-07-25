import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";

export default function AgentRegister() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    agencyName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, phone, agencyName, email, password } = formData;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          agencyName,
          email,
          password,
          role: "agent",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      toast.success("Agent registered successfully!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <Head>
        <title>Agent Registration | Aparte</title>
      </Head>
      <Toaster position="top-right" />

      <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100">
        {/* Left panel */}
        <div className="max-w-[600px] bg-gray-200 p-10">
          <h1 className="text-3xl font-semibold mb-8">
            Your Aparte agent account allows you to:
          </h1>
          {[
            {
              icon: "https://static.rdc.moveaws.com/rdc-ui/spots/spot-agent.svg",
              title: "Claim your FREE agent profile",
              desc:
                "Create an account to show up when local buyers and sellers are looking for an agent",
            },
            {
              icon: "https://static.rdc.moveaws.com/rdc-ui/spots/spot-message.svg",
              title: "Generate and manage leads",
              desc:
                "Connect with motivated buyers and sellers who visit Realtor.com®",
            },
            {
              icon: "https://static.rdc.moveaws.com/rdc-ui/spots/spot-listings.svg",
              title: "Build your brand",
              desc:
                "Increase your visibility on Realtor.com and across social media with promotions",
            },
            {
              icon:
                "https://static.rdc.moveaws.com/rdc-ui/spots/spot-monitor-data.svg",
              title: "Win and sell listings",
              desc:
                "Access free listing data, connect with sellers, and run listing promotions",
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex items-start mb-6">
              <img src={icon} className="h-10 mr-4" alt="" />
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right panel / Form */}
        <div className="lg:w-full bg-white p-10 flex flex-col justify-center">
          <div className="mb-8 mx-60">
            <img
              src="/aparte-logo-removebg.png"
              alt="Aparte Logo"
              className="h-10 mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">
              Create your Aparte agent account
            </h2>
            <p className="text-sm text-gray-600">
              Sign up to Aparte for Professionals to continue to PRO.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mx-60">
            {/* Name */}
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="peer w-full border border-gray-300 rounded px-3 pt-5 pb-2 focus:outline-none focus:border-black"
                placeholder=" "
              />
              <label
                htmlFor="name"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:text-sm peer-focus:text-gray-600 peer-focus:font-medium peer-focus:translate-y-[-20px] peer-valid:top-0 peer-valid:translate-y-[-20px]"
                style={{
                  fontSize: '0.875rem', // Adjust if needed
                }}
              >
                Full Name
              </label>
            </div>

            {/* Phone */}
            <div className="relative">
              <input
                type="text"
                id="phone"
                name="phone"
                pattern="\d{10}"
                required
                value={formData.phone}
                onChange={handleChange}
                className="peer w-full border border-gray-300 rounded px-3 pt-5 pb-2 focus:outline-none focus:border-black"
                placeholder=" "
              />
              <label
                htmlFor="phone"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:text-sm peer-focus:text-gray-600 peer-focus:font-medium peer-focus:translate-y-[-20px] peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:translate-y-[-20px]"
                style={{
                  fontSize: '0.875rem', // Adjust if needed
                }}
              >
                Phone number
              </label>
            </div>



            {/* Agency Name */}
            <div className="relative">
              <input
                type="text"
                id="agencyName"
                name="agencyName"
                required
                value={formData.agencyName}
                onChange={handleChange}
                className="peer w-full border border-gray-300 rounded px-3 pt-5 pb-2 focus:outline-none focus:border-black"
                placeholder=" "
              />
              <label htmlFor="agencyName"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:text-sm peer-focus:text-gray-600 peer-focus:font-medium peer-focus:translate-y-[-20px] peer-valid:top-0 peer-valid:translate-y-[-20px]"
                style={{
                  fontSize: '0.875rem', // Adjust if needed
                }}
              >
                Agency Name
              </label>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="peer w-full border border-gray-300 rounded px-3 pt-5 pb-2 focus:outline-none focus:border-black"
                placeholder=" "
              />
              <label
                htmlFor="email"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:text-sm peer-focus:text-gray-600 peer-focus:font-medium peer-focus:translate-y-[-20px] peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:translate-y-[-20px]"
                style={{
                  fontSize: '0.875rem', // Adjust if needed
                }}
              >
                Email address
              </label>
            </div>


            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                required
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                className="peer w-full border border-gray-300 rounded px-3 pt-5 pb-2 focus:outline-none focus:border-black"
                placeholder=" "
              />
              <label
                htmlFor="password"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:text-sm peer-focus:text-gray-600 peer-focus:font-medium peer-focus:translate-y-[-20px] peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:translate-y-[-20px]"
                style={{
                  fontSize: '0.875rem', // Adjust if needed
                }}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-blue-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>


            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white py-3 px-4 rounded hover:bg-orange-500 transition"
            >
              Create Account
            </button>
          </form>

          {/* Alternate action */}
                    <div className="text-center mt-6 text-sm text-gray-600">
                        You already have an agent account?{' '}
                        <a href="/register/agent" className="text-orange-500 hover:underline">
                            Log in
                        </a>
                    </div>

                    {/* Footer links */}
                    <div className="mt-4 text-xs text-gray-500 text-center space-x-2">
                        <a
                            href="https://pro.realtor.com/idp/forgot-email"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                        >
                            Forgot your email?
                        </a>
                        <span>|</span>
                        <a
                            href="https://support.realtor.com/s/login-help"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                        >
                            Visit support center
                        </a>
                    </div>
        </div>
      </div>
    </>
  );
}