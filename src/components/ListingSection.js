'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

const filters = ['Newest', 'Popular', 'Price Range'];
const states = [
    'All States', 'Lagos', 'Abuja', 'Oyo', 'Kano', 'Kaduna', 'Enugu', 'Rivers', 'Osun', 'Ekiti'
];
const listingTypes = ['All Types', 'Agent', 'Owner'];

const amenityIcons = {
    Water: '💧',
    Electricity: '⚡',
    Security: '🔒',
    Parking: '🚗',
    'Prepaid Meter': '🧾',
    Gated: '🚪',
    Furnished: '🛋️',
};

const dummyListings = [
  {
    id: 1,
    title: 'Modern 1 Bedroom Flat in Lekki Phase 1',
    propertyType: '1 Bedroom Flat',
    location: 'Lekki Phase 1, Lagos',
    price: 1500000,
    paymentType: 'year',
    beds: 1,
    baths: 1,
    toilets: 2,
    image: 'https://www.zillowstatic.com/bedrock/app/uploads/sites/5/2024/10/shutterstock_529108441.jpg',
    amenities: ['Water', 'Electricity', 'Parking', 'Gated'],
    status: ['Newly Built', 'Available Now', 'Agent Listing'],
    saves: 56,
    date: '2025-07-01',
    type: 'Agent',
  },
  {
    id: 2,
    title: 'Mini Flat in Bodija with Prepaid Meter',
    propertyType: 'Mini Flat',
    location: 'Bodija-Ibadan, Oyo',
    price: 500000,
    paymentType: 'month',
    beds: 1,
    baths: 1,
    toilets: 1,
    image: 'https://www.zillowstatic.com/bedrock/app/uploads/sites/5/2024/10/2017_ZillowExteriors_218-1.jpg',
    amenities: ['Water', 'Electricity', 'Prepaid Meter', 'Gated'],
    status: ['Verified', 'Available Now'],
    saves: 132,
    date: '2025-07-12',
    type: 'Owner',
  },
  {
    id: 3,
    title: '2 Bedroom Bungalow in Wuse Zone 4',
    propertyType: '2 Bedroom Bungalow',
    location: 'Wuse Zone 4, Abuja',
    price: 1200000,
    paymentType: 'year',
    beds: 2,
    baths: 2,
    toilets: 3,
    image: 'https://www.zillowstatic.com/bedrock/app/uploads/sites/5/2024/10/GettyImages-472069091-Edit.jpg',
    amenities: ['Water', 'Security', 'Parking', 'Furnished'],
    status: ['Rent', 'Agent Listing'],
    saves: 88,
    date: '2025-06-28',
    type: 'Agent',
  },
  {
    id: 4,
    title: 'Spacious 3 Bedroom Duplex in Ikeja',
    propertyType: '3 Bedroom Duplex',
    location: 'Oluyole estate - Ibadan, Oyo',
    price: 2500000,
    paymentType: 'year',
    beds: 3,
    baths: 3,
    toilets: 4,
    image: '/image3.webp',
    amenities: ['Water', 'Electricity', 'Security', 'Parking'],
    status: ['Available Now', 'Verified'],
    saves: 75,
    date: '2025-07-15',
    type: 'Agent',
  },
  {
    id: 5,
    title: 'Cozy Studio Apartment near University',
    propertyType: 'Studio Apartment',
    location: 'University of Lagos, Akoka',
    price: 350000,
    paymentType: 'month',
    beds: 0,
    baths: 1,
    toilets: 1,
    image: 'https://images.nigeriapropertycentre.com/properties/images/2993943/068813fc41549a-brand-new-luxury-5-bedroom-duplex-with-bq-detached-duplexes-for-sale-jahi-abuja.jpg',
    amenities: ['Water', 'Electricity', 'Prepaid Meter'],
    status: ['Available Now'],
    saves: 40,
    date: '2025-07-10',
    type: 'Owner',
  },
  {
    id: 6,
    title: 'Luxury 4 Bedroom Mansion with Pool',
    propertyType: '4 Bedroom Mansion',
    location: 'Banana Island, Lagos',
    price: 10000000,
    paymentType: 'year',
    beds: 4,
    baths: 5,
    toilets: 6,
    image: 'https://images.nigeriapropertycentre.com/properties/images/2993905/0688134fe3ec51-4bedroom-terrace-with-bq-without-furnitures-terraced-duplexes-for-sale-wuye-abuja.jpg',
    amenities: ['Water', 'Electricity', 'Security', 'Parking', 'Gated', 'Furnished'],
    status: ['Newly Built', 'Verified', 'Agent Listing'],
    saves: 190,
    date: '2025-06-20',
    type: 'Agent',
  },
  {
    id: 7,
    title: 'Affordable 2 Bedroom Flat in Yaba',
    propertyType: '2 Bedroom Flat',
    location: 'Yaba, Lagos',
    price: 800000,
    paymentType: 'year',
    beds: 2,
    baths: 1,
    toilets: 2,
    image: 'https://images.nigeriapropertycentre.com/properties/images/2993901/0688134ac03e50-brand-new-3-bedroom-apartment-for-rent-lugbe-district-abuja.jpeg',
    amenities: ['Water', 'Electricity', 'Parking'],
    status: ['Available Now', 'Rent'],
    saves: 68,
    date: '2025-07-02',
    type: 'Owner',
  },
  {
    id: 8,
    title: 'Mini Flat with Gated Security in Ojo',
    propertyType: 'Mini Flat',
    location: 'Ojo, Lagos',
    price: 450000,
    paymentType: 'month',
    beds: 1,
    baths: 1,
    toilets: 1,
    image: 'https://images.nigeriapropertycentre.com/properties/images/2993901/0688134aa6947e-brand-new-3-bedroom-apartment-for-rent-lugbe-district-abuja.jpeg',
    amenities: ['Water', 'Security', 'Gated'],
    status: ['Available Now'],
    saves: 53,
    date: '2025-07-08',
    type: 'Owner',
  },
  {
    id: 9,
    title: '3 Bedroom Detached House in Gwarinpa',
    propertyType: '3 Bedroom Detached House',
    location: 'Gwarinpa, Abuja',
    price: 3000000,
    paymentType: 'year',
    beds: 3,
    baths: 3,
    toilets: 4,
    image: 'https://images.nigeriapropertycentre.com/properties/images/2993905/0688134f691884-4bedroom-terrace-with-bq-without-furnitures-terraced-duplexes-for-sale-wuye-abuja.jpg',
    amenities: ['Water', 'Electricity', 'Parking', 'Gated', 'Furnished'],
    status: ['Available Now', 'Agent Listing'],
    saves: 95,
    date: '2025-06-30',
    type: 'Agent',
  },
  {
    id: 10,
    title: 'Compact 1 Bedroom Flat in Surulere',
    propertyType: '1 Bedroom Flat',
    location: 'Surulere, Lagos',
    price: 600000,
    paymentType: 'year',
    beds: 1,
    baths: 1,
    toilets: 1,
    image: 'https://images.nigeriapropertycentre.com/properties/images/2993943/068813fbc56da7-brand-new-luxury-5-bedroom-duplex-with-bq-detached-duplexes-for-sale-jahi-abuja.jpg',
    amenities: ['Water', 'Electricity', 'Prepaid Meter'],
    status: ['Available Now', 'Verified'],
    saves: 43,
    date: '2025-07-11',
    type: 'Owner',
  },
  {
    id: 11,
    title: 'Elegant 2 Bedroom Flat in Victoria Island',
    propertyType: '2 Bedroom Flat',
    location: 'Victoria Island, Lagos',
    price: 1800000,
    paymentType: 'year',
    beds: 2,
    baths: 2,
    toilets: 2,
    image: 'https://images.nigeriapropertycentre.com/properties/images/2993901/0688134a86ef4a-brand-new-3-bedroom-apartment-for-rent-lugbe-district-abuja.jpeg',
    amenities: ['Water', 'Electricity', 'Parking', 'Gated', 'Furnished'],
    status: ['Verified', 'Agent Listing'],
    saves: 87,
    date: '2025-07-03',
    type: 'Agent',
  },
  {
    id: 12,
    title: 'Newly Built Studio in Jabi',
    propertyType: 'Studio Apartment',
    location: 'Jabi, Abuja',
    price: 400000,
    paymentType: 'month',
    beds: 0,
    baths: 1,
    toilets: 1,
    image: 'https://images.nigeriapropertycentre.com/properties/images/2993943/068813fbad8d5d-brand-new-luxury-5-bedroom-duplex-with-bq-detached-duplexes-for-sale-jahi-abuja.jpg',
    amenities: ['Water', 'Electricity', 'Prepaid Meter'],
    status: ['Newly Built', 'Available Now'],
    saves: 25,
    date: '2025-07-14',
    type: 'Owner',
  },
  {
    id: 13,
    title: 'Family 4 Bedroom Townhouse in Port Harcourt',
    propertyType: '4 Bedroom Townhouse',
    location: 'Port Harcourt, Rivers',
    price: 3500000,
    paymentType: 'year',
    beds: 4,
    baths: 3,
    toilets: 4,
    image: 'https://images.nigeriapropertycentre.com/properties/images/2993901/0688134ad6e98e-brand-new-3-bedroom-apartment-for-rent-lugbe-district-abuja.jpeg',
    amenities: ['Water', 'Electricity', 'Security', 'Parking', 'Gated'],
    status: ['Available Now', 'Rent', 'Agent Listing'],
    saves: 120,
    date: '2025-07-05',
    type: 'Agent',
  },
  {
    id: 14,
    title: 'Affordable 1 Bedroom Flat in Abeokuta',
    propertyType: '1 Bedroom Flat',
    location: 'Abeokuta, Ogun',
    price: 400000,
    paymentType: 'year',
    beds: 1,
    baths: 1,
    toilets: 1,
    image: 'https://images.nigeriapropertycentre.com/properties/images/2993901/0688134a86ef4a-brand-new-3-bedroom-apartment-for-rent-lugbe-district-abuja.jpeg',
    amenities: ['Water', 'Electricity', 'Parking'],
    status: ['Available Now'],
    saves: 32,
    date: '2025-07-09',
    type: 'Owner',
  },
  {
    id: 15,
    title: 'Luxury 3 Bedroom Penthouse in Ikoyi',
    propertyType: '3 Bedroom Penthouse',
    location: 'Ikoyi, Lagos',
    price: 6000000,
    paymentType: 'year',
    beds: 3,
    baths: 4,
    toilets: 4,
    image: 'https://images.nigeriapropertycentre.com/properties/images/2993905/0688134f9be855-4bedroom-terrace-with-bq-without-furnitures-terraced-duplexes-for-sale-wuye-abuja.jpg',
    amenities: ['Water', 'Electricity', 'Security', 'Parking', 'Gated', 'Furnished'],
    status: ['Newly Built', 'Verified', 'Agent Listing'],
    saves: 210,
    date: '2025-06-25',
    type: 'Agent',
  },
];


const ListingSection = () => {
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState('Newest');
    const [selectedState, setSelectedState] = useState('All States');
    const [selectedType, setSelectedType] = useState('All Types');
    const [priceRangeVisible, setPriceRangeVisible] = useState(false);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [visibleCount, setVisibleCount] = useState(6);
    const [savedListings, setSavedListings] = useState([]); // 🆕 Global save state

    const toggleSave = (id) => {
        setSavedListings((prev) =>
            prev.includes(id) ? prev.filter((savedId) => savedId !== id) : [...prev, id]
        );
    };

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        setPriceRangeVisible(filter === 'Price Range');
    };

    const sortListings = (listings) => {
        if (activeFilter === 'Newest') {
            return listings.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (activeFilter === 'Popular') {
            return listings.sort((a, b) => b.saves - a.saves);
        } else if (activeFilter === 'Price Range') {
            return listings.filter((item) => {
                const withinMin = minPrice ? item.price >= parseInt(minPrice) : true;
                const withinMax = maxPrice ? item.price <= parseInt(maxPrice) : true;
                return withinMin && withinMax;
            });
        }
        return listings;
    };

    const filteredListings = sortListings(
        dummyListings.filter((item) => {
            const matchState = selectedState === 'All States' || item.location.includes(selectedState);
            const matchType = selectedType === 'All Types' || item.type === selectedType;
            return matchState && matchType;
        })
    );

    return (
        <section className="bg-gray-50 py-12 px-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                {filters.map((filter) => (
                    <motion.button
                        key={filter}
                        onClick={() => handleFilterChange(filter)}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 text-sm rounded font-medium border transition-all ${activeFilter === filter
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                            }`}
                    >
                        {filter}
                    </motion.button>
                ))}

                <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="px-4 py-2 text-sm rounded border-gray-300 shadow-sm"
                >
                    {states.map((state) => (
                        <option key={state}>{state}</option>
                    ))}
                </select>

                <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-4 py-2 text-sm rounded border-gray-300 shadow-sm"
                >
                    {listingTypes.map((type) => (
                        <option key={type}>{type}</option>
                    ))}
                </select>
            </div>

            {/* Price Range Animation */}
            <AnimatePresence>
                {priceRangeVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex justify-center gap-4 mb-6"
                    >
                        <input
                            type="number"
                            placeholder="Min Price"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="border px-4 py-2 rounded w-36"
                        />
                        <input
                            type="number"
                            placeholder="Max Price"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="border px-4 py-2 rounded w-36"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {filteredListings.slice(0, visibleCount).map((item) => {
                    const isSaved = savedListings.includes(item.id);
                    const totalSaves = isSaved ? item.saves + 1 : item.saves;

                    return (
                        <motion.div
                            key={item.id}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white shadow-md rounded-lg overflow-hidden"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-48 object-cover"
                                onClick={() => router.push(`/listing/${item.id}`)}
                            />

                            <div className="p-4">
                                {/* Status Tags */}
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {item.status.map((label, i) => (
                                        <span
                                            key={i}
                                            className="text-xs bg-gradient-to-r from-orange-400 to-pink-500 text-white px-2 py-1 rounded-full"
                                        >
                                            {label}
                                        </span>
                                    ))}
                                </div>

                                {/* Title and Property Info */}
                                <h3 className="font-bold text-lg mb-1">{item.propertyType}</h3>
                                <p className="text-sm text-gray-500 mb-1">{item.location}</p>
                                <p className="text-green-700 font-bold mb-2">
                                    ₦{item.price.toLocaleString()} / {item.paymentType}
                                </p>
                                <p className="text-sm text-gray-600 mb-2">
                                    {item.beds} Beds · {item.baths} Baths · {item.toilets} Toilets
                                </p>

                                {/* Amenities */}
                                <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-4">
                                    {item.amenities.map((amenity, i) => (
                                        <span
                                            key={i}
                                            className="bg-gray-100 px-2 py-1 rounded"
                                        >
                                            {amenityIcons[amenity] || '•'} {amenity}
                                        </span>
                                    ))}
                                </div>

                                {/* Save & CTA */}
                                <div className="flex items-center justify-between">
                                    <motion.button
                                        onClick={() => toggleSave(item.id)}
                                        whileTap={{ scale: 1.4 }}
                                        animate={{ scale: isSaved ? 0.9 : 0.8, color: isSaved ? '#e11d48' : '#4b5563' }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                                        className="flex items-center gap-1 text-sm"
                                    >
                                        <span className="text-xl">{isSaved ? '❤️' : '🤍'}</span>
                                        <span>{totalSaves} saves</span>
                                    </motion.button>

                                    <button
                                        onClick={() => router.push(`/listing/${item.id}`)}
                                        className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Load More */}
            {visibleCount < filteredListings.length && (
                <div className="text-center mt-8">
                    <button
                        onClick={() => setVisibleCount((prev) => prev + 6)}
                        className="bg-gradient-to-r from-orange-400 to-pink-500 hover:bg-gray-800 text-white px-6 py-2 rounded font-medium"
                    >
                        Load More...
                    </button>
                </div>
            )}
        </section>
    );
};

export default ListingSection;
