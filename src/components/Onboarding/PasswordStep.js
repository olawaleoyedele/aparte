import { useState } from 'react';
import { motion } from 'framer-motion';

export default function PasswordStep({
    email,
    isExistingUser,
    onBack,
    onSuccess,
    onClose,
}) {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  const endpoint = isExistingUser ? '/api/auth/login' : '/api/auth/register';
  const payload = {
    email,
    password,
  };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    let data;

    try {
      data = await res.json(); // safely parse JSON
    } catch (jsonError) {
      const text = await res.text();
      console.error('Failed to parse JSON:', text);
      throw new Error('Invalid response format from server');
    }

    if (res.ok) {
      onSuccess(data); // ✅ success
    } else {
      setError(data?.message || 'Authentication failed.');
    }
  } catch (err) {
    console.error('Network error:', err);
    setError('Network error. Try again.');
  } finally {
    setLoading(false);
  }
};

    return (
        <div
            className="fixed inset-0 z-55 bg-black pt-10 px-4 flex justify-center items-start"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        >
            <motion.div
                initial={{ y: -150, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-[400px] bg-white rounded-2xl shadow-xl relative p-6 mb-20"
            >
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-black"
                    aria-label="Close"
                    onClick={onClose}
                >
                    ✕
                </button>

                {/* Header */}
                <h2 className="text-2xl font-semibold text-gray-900 mb-1 text-center">
                    {isExistingUser ? 'Welcome back!' : 'Add a password'}
                </h2>

                {/* Subheading */}
                <p className="text-sm text-gray-600 text-center mb-6">
                    {isExistingUser
                        ? `Please enter a password associated with ${email} to continue.`
                        : 'Set a password to access your account on all your devices.'}
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            {isExistingUser ? 'Password' : 'Set a password'}
                            <span className="text-red-500">*</span>
                        </label>

                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                placeholder={isExistingUser ? 'Enter your password' : 'Create a strong password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Show error if exists */}
                        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

                        {/* Show helper text for new users */}
                        {!isExistingUser && (
                            <p className="mt-2 text-xs text-gray-500">
                                Use 8 or more characters with a combination of uppercase, lowercase, a number, and a symbol.
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:bg-indigo-700 text-white font-medium py-3 rounded-3xl transition disabled:opacity-50"
                    >
                        {loading
                            ? isExistingUser
                                ? 'Logging in...'
                                : 'Creating account...'
                            : isExistingUser
                                ? 'Login'
                                : 'Create account'}
                    </button>
                </form>

                {/* Go Back */}
                <div className="text-center mt-4">
                    <button
                        onClick={onBack}
                        className="text-sm text-indigo-600 hover:underline"
                    >
                        ← Go back
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
