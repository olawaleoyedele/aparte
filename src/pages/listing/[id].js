'use client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OnboardingWrapper from '@/components/Onboarding/OnboardingWrapper';
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
import { getUserFromContext } from '@/lib/getUserFromContext';

const dummyListings = [
  {
    id: 1,
    title: 'Modern 1 Bedroom Flat in Lekki Phase 1',
    propertyType: '1 Bedroom Flat',
    location: 'Lekki Phase 1, Lagos',
    coordinates: [6.4327, 3.4591],
    price: 1500000,
    paymentType: 'year',
    beds: 1,
    baths: 1,
    toilets: 2,
    images: [
      'https://www.zillowstatic.com/bedrock/app/uploads/sites/5/2024/10/shutterstock_529108441.jpg',
      'https://source.unsplash.com/featured/?interior',
    ],
    amenities: ['Water', 'Electricity', 'Parking', 'Gated'],
    status: ['Newly Built', 'Available Now', 'Agent Listing'],
    saves: 56,
    date: '2025-07-01',
    type: 'Agent',
    description: 'A modern 1-bedroom apartment located in the heart of Lekki Phase 1, perfect for singles or young couples.',
  },
  {
    id: 2,
    title: 'Mini Flat in Bodija with Prepaid Meter',
    propertyType: 'Mini Flat',
    location: 'Bodija, Ibadan',
    coordinates: [7.4264, 3.9108],
    price: 500000,
    paymentType: 'month',
    beds: 1,
    baths: 1,
    toilets: 1,
    images: [
      'https://www.zillowstatic.com/bedrock/app/uploads/sites/5/2024/10/2017_ZillowExteriors_218-1.jpg',
      'https://source.unsplash.com/800x600/?flat',
      'https://source.unsplash.com/800x600/?bedroom',
    ],
    amenities: ['Water', 'Electricity', 'Prepaid Meter', 'Gated'],
    status: ['Verified', 'Available Now'],
    saves: 132,
    date: '2025-07-12',
    type: 'Owner',
    phone: '+2348012345678',
    description: 'Affordable mini flat in a secure neighborhood. Comes with a prepaid meter and gated compound.',
  },
  {
    id: 3,
    title: '2 Bedroom Bungalow in Wuse Zone 4',
    propertyType: '2 Bedroom Bungalow',
    location: 'Wuse Zone 4, Abuja',
    coordinates: [9.0571, 7.4775],
    price: 1200000,
    paymentType: 'year',
    beds: 2,
    baths: 2,
    toilets: 3,
    images: [
      'https://www.zillowstatic.com/bedrock/app/uploads/sites/5/2024/10/GettyImages-472069091-Edit.jpg',
      'https://source.unsplash.com/800x600/?bungalow',
      'https://source.unsplash.com/800x600/?kitchen',
    ],
    amenities: ['Water', 'Security', 'Parking', 'Furnished'],
    status: ['Rent', 'Agent Listing'],
    saves: 88,
    date: '2025-06-28',
    type: 'Agent',
    phone: '+2348112345678',
    description: 'Spacious and fully fenced 2-bedroom bungalow ideal for families or professionals.',
  },
  {
    id: 4,
    title: '3 Bedroom Duplex in Ajah',
    propertyType: '3 Bedroom Duplex',
    location: 'Oluyole estate - Ibadan, Oyo',
    coordinates: [6.4689, 3.5852],
    price: 2500000,
    paymentType: 'year',
    beds: 3,
    baths: 3,
    toilets: 4,
    images: [
        '/image3.webp',
      '/image1.jpg',
      '/image2.jpg',
    ],
    amenities: ['Water', 'Electricity', 'Parking', 'Security'],
    status: ['Available Now', 'Verified'],
    saves: 76,
    date: '2025-07-10',
    type: 'Agent',
    description: 'Luxury 3bed Rooms Flat House Shot Let in Oluyole estate, Ibadan, Oyo state. Good road secured environment tiles light water wordrobe parking fence kitchen cabinets pop etc',
  },
  {
    id: 5,
    title: 'Shared Room near University of Ibadan',
    propertyType: 'Shared Room',
    location: 'Agbowo, Ibadan',
    coordinates: [7.4444, 3.9000],
    price: 120000,
    paymentType: 'year',
    beds: 1,
    baths: 1,
    toilets: 1,
    images: [
      'https://source.unsplash.com/800x600/?student-hostel',
      'https://source.unsplash.com/800x600/?hostel-room',
    ],
    amenities: ['Water', 'Electricity'],
    status: ['Available Now'],
    saves: 23,
    date: '2025-07-05',
    type: 'Owner',
    description: 'Affordable student room close to UI with steady power and water supply.',
  },
  {
    id: 6,
    title: 'Luxury 4 Bedroom Duplex in Banana Island',
    propertyType: '4 Bedroom Duplex',
    location: 'Banana Island, Lagos',
    coordinates: [6.4413, 3.4532],
    price: 12000000,
    paymentType: 'year',
    beds: 4,
    baths: 4,
    toilets: 5,
    images: [
      'https://source.unsplash.com/800x600/?luxury-home',
      'https://source.unsplash.com/800x600/?mansion',
    ],
    amenities: ['Water', 'Electricity', 'Security', 'Parking', 'Furnished', 'Gated'],
    status: ['Verified', 'Newly Built'],
    saves: 340,
    date: '2025-06-20',
    type: 'Agent',
    description: 'Top-tier luxury duplex in exclusive Banana Island enclave.',
  },
  {
    id: 7,
    title: 'Studio Apartment in Surulere',
    propertyType: 'Studio Apartment',
    location: 'Surulere, Lagos',
    coordinates: [6.5053, 3.3481],
    price: 350000,
    paymentType: 'month',
    beds: 1,
    baths: 1,
    toilets: 1,
    images: [
      'https://source.unsplash.com/800x600/?studio-apartment',
      'https://source.unsplash.com/800x600/?small-apartment',
    ],
    amenities: ['Water', 'Electricity', 'Parking'],
    status: ['Available Now'],
    saves: 61,
    date: '2025-07-11',
    type: 'Owner',
    description: 'Well-ventilated studio flat in a bustling neighborhood.',
  },
  {
    id: 8,
    title: 'Room Self Contain in Magodo',
    propertyType: 'Self Contain',
    location: 'Magodo, Lagos',
    coordinates: [6.6145, 3.3834],
    price: 800000,
    paymentType: 'year',
    beds: 1,
    baths: 1,
    toilets: 1,
    images: [
      'https://source.unsplash.com/800x600/?room',
      'https://source.unsplash.com/800x600/?interior-design',
    ],
    amenities: ['Water', 'Electricity', 'Security'],
    status: ['Verified'],
    saves: 102,
    date: '2025-07-13',
    type: 'Agent',
    description: 'Self-contained room with modern finish in gated estate.',
  },
  {
    id: 9,
    title: '5 Bedroom Duplex with BQ in Gwarinpa',
    propertyType: '5 Bedroom Duplex',
    location: 'Gwarinpa, Abuja',
    coordinates: [9.0774, 7.3986],
    price: 4500000,
    paymentType: 'year',
    beds: 5,
    baths: 5,
    toilets: 6,
    images: [
      'https://source.unsplash.com/800x600/?duplex-house',
      'https://source.unsplash.com/800x600/?gated-community',
    ],
    amenities: ['Water', 'Electricity', 'Security', 'Parking', 'Furnished'],
    status: ['Rent', 'Verified'],
    saves: 211,
    date: '2025-07-09',
    type: 'Agent',
    description: 'Elegant duplex with boys’ quarters and solar backup system.',
  },
  {
    id: 10,
    title: 'Mini Flat with Balcony in Yaba',
    propertyType: 'Mini Flat',
    location: 'Yaba, Lagos',
    coordinates: [6.5156, 3.3869],
    price: 950000,
    paymentType: 'year',
    beds: 1,
    baths: 1,
    toilets: 1,
    images: [
      'https://source.unsplash.com/800x600/?balcony',
      'https://source.unsplash.com/800x600/?flat-interior',
    ],
    amenities: ['Water', 'Electricity', 'Parking'],
    status: ['Available Now'],
    saves: 89,
    date: '2025-07-14',
    type: 'Owner',
    description: 'Mini flat with balcony and easy access to UNILAG and tech hubs.',
  },
  {
    id: 11,
    title: 'Affordable Room in Ogbomosho',
    propertyType: 'Room',
    location: 'Ogbomosho, Oyo',
    coordinates: [8.1339, 4.2462],
    price: 75000,
    paymentType: 'year',
    beds: 1,
    baths: 1,
    toilets: 1,
    images: [
      'https://source.unsplash.com/800x600/?single-room',
      'https://source.unsplash.com/800x600/?hostel',
    ],
    amenities: ['Water', 'Electricity'],
    status: ['Available'],
    saves: 12,
    date: '2025-07-08',
    type: 'Owner',
    description: 'Budget-friendly room close to LAUTECH campus.',
  },
  {
    id: 12,
    title: '2 Bedroom Flat in Iyana Ipaja',
    propertyType: '2 Bedroom Flat',
    location: 'Iyana Ipaja, Lagos',
    coordinates: [6.6203, 3.2961],
    price: 1100000,
    paymentType: 'year',
    beds: 2,
    baths: 2,
    toilets: 2,
    images: [
      'https://source.unsplash.com/800x600/?apartment',
      'https://source.unsplash.com/800x600/?urban-flat',
    ],
    amenities: ['Water', 'Electricity', 'Gated', 'Parking'],
    status: ['Verified'],
    saves: 66,
    date: '2025-07-03',
    type: 'Agent',
    description: 'Affordable family-sized flat in a serene compound.',
  },
  {
    id: 13,
    title: 'Studio Apartment near Allen Avenue',
    propertyType: 'Studio Apartment',
    location: 'Ikeja, Lagos',
    coordinates: [6.6018, 3.3515],
    price: 600000,
    paymentType: 'year',
    beds: 1,
    baths: 1,
    toilets: 1,
    images: [
      'https://source.unsplash.com/800x600/?compact-apartment',
      'https://source.unsplash.com/800x600/?studio',
    ],
    amenities: ['Water', 'Electricity', 'Security'],
    status: ['Available Now'],
    saves: 48,
    date: '2025-07-07',
    type: 'Owner',
    description: 'Studio apartment with tiled floor and dedicated meter.',
  },
  {
    id: 14,
    title: 'Room and Parlour Self Contain in Alagbado',
    propertyType: 'Room and Parlour Self Contain',
    location: 'Alagbado, Lagos',
    coordinates: [6.6555, 3.2534],
    price: 700000,
    paymentType: 'year',
    beds: 1,
    baths: 1,
    toilets: 1,
    images: [
      'https://source.unsplash.com/800x600/?living-room',
      'https://source.unsplash.com/800x600/?nigeria-apartment',
    ],
    amenities: ['Water', 'Electricity', 'Security', 'Parking'],
    status: ['Verified'],
    saves: 29,
    date: '2025-07-02',
    type: 'Owner',
    description: 'Spacious room and parlour with proximity to local transport.',
  },
  {
    id: 15,
    title: 'Luxury Penthouse in Victoria Island',
    propertyType: 'Penthouse',
    location: 'Victoria Island, Lagos',
    coordinates: [6.4281, 3.4216],
    price: 18000000,
    paymentType: 'year',
    beds: 5,
    baths: 5,
    toilets: 6,
    images: [
      'https://source.unsplash.com/800x600/?penthouse',
      'https://source.unsplash.com/800x600/?skyline',
    ],
    amenities: ['Water', 'Electricity', 'Security', 'Furnished', 'Elevator'],
    status: ['Luxury', 'Newly Built'],
    saves: 409,
    date: '2025-07-15',
    type: 'Agent',
    description: 'High-end penthouse with ocean views and private elevator.',
  }
];

const amenityIcons = {
    Water: '💧',
    Electricity: '⚡',
    Security: '🔒',
    Parking: '🚗',
    'Prepaid Meter': '🧾',
    Gated: '🚪',
    Furnished: '🛋️',
};

const ListingDetailPage = ({ user: initialUser}) => {
    const [showEmailStep, setShowEmailStep] = useState(false);
    const [user, setUser] = useState(initialUser); // ✅ track logged-in user

    const router = useRouter();
    const { id } = router.query;

    const [listing, setListing] = useState(null);
    const [saved, setSaved] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [activeImage, setActiveImage] = useState('');

    useEffect(() => {
        if (router.isReady && id) {
            const data = dummyListings.find((item) => item.id === parseInt(id));
            setListing(data);
        }
    }, [router.isReady, id]);

    const handleSaveToggle = () => setSaved((prev) => !prev);

    if (!listing) {
        return (
            <div className="min-h-screen flex justify-center items-center text-gray-500">
                Loading listing...
            </div>
        );
    }

    if (listing === undefined) {
        return (
            <div className="min-h-screen flex justify-center items-center text-gray-500">
                Listing not found.
            </div>
        );
    }

    return (
        <>
        <Header onLoginClick={() => setShowEmailStep(true)} user={user} />
        <section className="max-w-4xl mx-auto px-4 py-12">
            {/* Image Gallery */}
            <Swiper
                pagination={{ clickable: true }}
                modules={[Pagination]}
                className="rounded-lg overflow-hidden mb-6"
            >
                {listing.images.map((img, i) => (
                    <SwiperSlide key={i}>
                        <img
                            src={img}
                            alt={`Image ${i + 1}`}
                            className="w-full h-72 object-cover cursor-pointer"
                            onClick={() => {
                                setActiveImage(img);
                                setLightboxOpen(true);
                            }}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex justify-center items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setLightboxOpen(false)}
                    >
                        <img src={activeImage} alt="Full View" className="max-h-[90vh] rounded-lg shadow-lg" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Status Tags */}
            <div className="mb-4 flex flex-wrap gap-2">
                {listing.status?.map((label, i) => (
                    <span key={i} className="text-xs bg-black text-white px-2 py-1 rounded-full">
                        {label}
                    </span>
                ))}
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold mb-2">{listing.propertyType}</h1>
            <p className="text-gray-600 mb-1">{listing.location}</p>
            <p className="text-green-700 font-bold text-lg mb-4">
                ₦{listing.price.toLocaleString()} / {listing.paymentType}
            </p>

            {/* Room Info */}
            <p className="text-sm text-gray-600 mb-4">
                🛏 {listing.beds} Beds · 🛁 {listing.baths} Baths · 🚽 {listing.toilets} Toilets
            </p>

            {/* Amenities */}
            <div className="flex flex-wrap gap-2 text-sm text-gray-700 mb-6">
                {listing.amenities?.map((amenity, i) => (
                    <span
                        key={i}
                        className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1"
                    >
                        {amenityIcons[amenity] || '•'} {amenity}
                    </span>
                ))}
            </div>

            {/* Description */}
            <p className="text-base leading-relaxed text-gray-700 mb-8">
                {listing.description}
            </p>

            {/* Buttons */}
            <div className="flex items-center justify-between gap-4 mb-8">
                <button
                    onClick={handleSaveToggle}
                    className="flex items-center gap-2 text-gray-700 text-sm"
                >
                    {saved ? '🤍 Saved' : '❤️ Save'} ({saved ? listing.saves + 1 : listing.saves})
                </button>
                <button
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium"
                    onClick={() => {
                        const msg = `Hello, I'm interested in the listing: ${listing.propertyType} at ${listing.location}. Is it still available?`;
                        window.open(`https://wa.me/234XXXXXXXXXX?text=${encodeURIComponent(msg)}`);
                    }}
                >
                    Contact via WhatsApp
                </button>
            </div>

            {/* Map Section */}
            {/* <div className="h-64 rounded-lg overflow-hidden mb-6">
                <MapContainer center={listing.coordinates} zoom={13} scrollWheelZoom={false} className="h-full w-full">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={listing.coordinates}>
                        <Popup>{listing.propertyType}<br />{listing.location}</Popup>
                    </Marker>
                </MapContainer>
            </div> */}

            {/* Placeholder for Nearby Features */}
            {/* <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-600">
                <strong>Nearby Amenities & School Ratings:</strong> Coming soon!
            </div> */}
            
        </section>
        <AnimatePresence>
                {showEmailStep && (
                  <OnboardingWrapper
                    resetKey={showEmailStep} // triggers useEffect on toggle
                    onClose={() => setShowEmailStep(false)}
                    setUser={setUser} // ✅ pass setUser to update user state
                  />
                )}
              </AnimatePresence>
        <Footer />
        </>
    );
};

export async function getServerSideProps(context) {
  const user = getUserFromContext(context);
  return { props: { user } };
}

export default ListingDetailPage;
