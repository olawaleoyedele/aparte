import Link from 'next/link';
import Head from 'next/head';

export default function Unauthorized() {
  return (
    <>
      <Head>
        <title>Access Denied - MyApp</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You do not have permission to view this page.</p>

          <Link
            href="/"
            className="inline-block px-5 py-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded hover:bg-gray-800 transition"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </>
  );
}
