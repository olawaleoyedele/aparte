import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import prisma from '@/lib/prisma';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';

export async function getServerSideProps(context) {
  const { req } = context;
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.token || null;

  if (!token) {
    return {
      redirect: { destination: '/login/agent', permanent: false },
    };
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'agent') {
      return { redirect: { destination: '/', permanent: false } };
    }
  } catch (err) {
    return { redirect: { destination: '/login/agent', permanent: false } };
  }

  const listings = await prisma.listing.findMany({
    where: { agentEmail: decoded.email },
    orderBy: { createdAt: 'desc' },
  });

  return {
    props: {
      listings: JSON.parse(JSON.stringify(listings)),
      agent: {
        name: decoded.name || '',
        email: decoded.email || '',
      },
    },
  };
}

export default function ListingsPage({ listings, agent }) {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight">Welcome back, {agent?.name || 'Agent'}</h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">Manage your listed properties below.</p>
          </div>
          <Link href="/post-listing">
            <button className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-medium px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300">
              + Post New Listing
            </button>
          </Link>
        </div>

        {listings.length === 0 ? (
          <p className="text-gray-600 text-lg bg-gray-50 p-4 rounded-lg border mt-4 text-center shadow-inner">You have not posted any listings yet.</p>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
              <div
  key={listing.id}
  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-100"
>
  <div className="relative h-48 w-full">
    <Image
      src={listing.images?.[0] || '/no-image.jpg'}
      alt={listing.title}
      fill
      className="object-cover w-full h-full"
    />
    <div className="absolute top-3 left-3 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow">
      Verified
    </div>
  </div>

  <div className="p-5">
    <h2 className="text-xl font-semibold text-gray-800 mb-1">{listing.title}</h2>
    <p className="text-sm text-gray-500 mb-2">{listing.location}</p>

    <p className="text-blue-600 text-lg font-bold mb-3">
      ₦{listing.price.toLocaleString()} / {listing.paymentType}
    </p>

    {/* <div className="flex items-center text-sm text-gray-600 gap-4 mb-3">
      <span>🛏 {listing.beds} Beds</span>
      <span>🛁 {listing.baths} Baths</span>
      <span>🚽 {listing.toilets} Toilets</span>
    </div> */}

    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
      {listing.amenities?.includes('water') && (
        <span className="bg-gray-100 px-3 py-1 rounded-full">💧 Water</span>
      )}
      {listing.amenities?.includes('electricity') && (
        <span className="bg-gray-100 px-3 py-1 rounded-full">⚡ Electricity</span>
      )}
      {listing.amenities?.includes('prepaid') && (
        <span className="bg-gray-100 px-3 py-1 rounded-full">🧾 Prepaid</span>
      )}
      {listing.amenities?.includes('gated') && (
        <span className="bg-gray-100 px-3 py-1 rounded-full">🚪 Gated</span>
      )}
    </div>

    <div className="flex justify-between items-center text-sm text-gray-400">
      <p>Posted on {format(new Date(listing.createdAt), 'PPP')}</p>
    </div>
    <div className="mt-3 flex justify-end">
      <Link href={`/dashboard/listings/${listing.id}`}>
        <span className="text-blue-600 hover:underline cursor-pointer">View Details</span>
      </Link>
    </div>
  </div>
</div>
))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
