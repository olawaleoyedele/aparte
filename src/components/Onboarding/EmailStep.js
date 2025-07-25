import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function EmailStep({ onNext, onEmailVerified, onClose }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        onEmailVerified(email, data.exists);
        onNext();
      } else {
        setError(data.error || 'Something went wrong. Try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-1000 bg-black flex justify-center items-start overflow-y-hidden pt-10 px-4"
    style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} > {/*I used "bg-opacity-10 and bg-opacity-50" in tailwind but did not work*/}
      <motion.div
        initial={{ y: -150, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[400px] bg-white rounded-2xl shadow-xl relative p-6 mb-20"
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
          aria-label="Close"
          onClick={onClose} // call the callback passed from parent
        >
          ✕
        </button>

        {/* Rest of your modal content */}
        {/* ... (no changes) */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
          Log in or create an account
        </h2>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:bg-indigo-700 text-white font-medium py-3 rounded-3xl transition disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Continue'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-sm text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>

        {/* Social login */}
        <div className="space-y-3">
          <SocialButton
            provider="Google"
            icon="/google-icon.svg"
            onClick={() => alert('Google login not implemented yet')}
          />
          <SocialButton
            provider="Facebook"
            icon="/facebook-icon.svg"
            onClick={() => alert('Facebook login not implemented yet')}
          />
          {/* <SocialButton
            provider="Apple"
            icon="/apple-icon.svg"
            onClick={() => alert('Apple login not implemented yet')}
          /> */}
        </div>

        {/* Agent CTA */}
        <div className="text-center mt-8">
  <p className="text-sm font-bold text-gray-800">Are you a real estate agent?</p>
  <div className="text-sm space-x-2 mt-1">
    <Link href="/login/agent" className="text-indigo-600 hover:underline font-medium">
      Log in
    </Link>
    <span>or</span>
    <Link href="/register/agent" className="text-indigo-600 hover:underline font-medium">
      create an account
    </Link>
    <span>here</span>
  </div>
</div>


        {/* Terms */}
        <div className="text-center text-xs text-gray-500 mt-8">
          <p>By creating an account you agree to Aparte's</p>
          <div className="space-x-1">
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              Terms of Use
            </a>
            <span>and</span>
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function SocialButton({ provider, icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-3xl hover:bg-gray-50 transition"
    >
      <img src={icon} alt={provider} className="w-5 h-5" />
      <span className="text-sm font-medium text-gray-700">
        Continue with {provider}
      </span>
    </button>
  );
}
