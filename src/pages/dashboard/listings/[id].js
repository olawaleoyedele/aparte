import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { useState } from 'react';

export async function getServerSideProps(context) {
  const { req, params } = context;
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.token || null;

  if (!token) {
    return {
      redirect: {
        destination: '/login/agent',
        permanent: false,
      },
    };
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return {
      redirect: {
        destination: '/login/agent',
        permanent: false,
      },
    };
  }

  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
  });

  if (!listing || listing.agentEmail !== decoded.email) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      listing: JSON.parse(JSON.stringify(listing)),
    },
  };
}

export default function ListingDetails({ listing }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/listings/${listing.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/dashboard/listings');
      } else {
        alert('Failed to delete listing');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">{listing.title}</h1>

          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/dashboard/listings/${listing.id}/edit`)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>

        <p className="text-gray-600 mb-2">{listing.location}</p>
        <p className="text-blue-700 font-semibold text-xl mb-2">
          ₦{listing.price.toLocaleString()} / {listing.paymentType}
        </p>

        {listing.images && listing.images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {listing.images.map((img, i) => (
              <div key={i} className="relative h-64 w-full rounded overflow-hidden">
                <Image
                  src={img}
                  alt={`Listing Image ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="text-sm text-gray-700 mb-2">
          🛏 {listing.beds} | 🛁 {listing.baths} | 🚽 {listing.toilets}
        </div>

        <p className="mt-4 leading-relaxed">{listing.description}</p>

        <div className="mt-6">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            ← Back to Listings
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
