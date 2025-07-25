import { useState } from 'react';
import { useRouter } from 'next/router';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';

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

export default function EditListing({ listing }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: listing.title,
    description: listing.propertyDescription,
    location: listing.location,
    price: listing.price,
    beds: listing.beds,
    baths: listing.baths,
    toilets: listing.toilets,
    paymentType: listing.paymentType,
    images: listing.images.join(','),
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/listings/${listing.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          images: formData.images.split(',').map((url) => url.trim()),
        }),
      });

      if (res.ok) {
        router.push(`/dashboard/listings/${listing.id}`);
      } else {
        const data = await res.json();
        alert(data.error || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Listing</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            name="description"
            value={formData.propertyDescription}
            onChange={handleChange}
            placeholder="Description"
            rows={4}
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="price"
            value={formData.price}
            onChange={handleChange}
            type="number"
            placeholder="Price"
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="beds"
            value={formData.beds}
            onChange={handleChange}
            type="number"
            placeholder="Beds"
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="baths"
            value={formData.baths}
            onChange={handleChange}
            type="number"
            placeholder="Baths"
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="toilets"
            value={formData.toilets}
            onChange={handleChange}
            type="number"
            placeholder="Toilets"
            className="w-full border p-2 rounded"
            required
          />
          <select
            name="paymentType"
            value={formData.paymentType}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Payment Type</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="one-time">One-Time</option>
          </select>
          <input
            name="images"
            value={formData.images}
            onChange={handleChange}
            placeholder="Image URLs (comma separated)"
            className="w-full border p-2 rounded"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {loading ? 'Updating...' : 'Update Listing'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
