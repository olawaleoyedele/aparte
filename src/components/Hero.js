'use client';
import { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Oswald } from 'next/font/google';

const oswald = Oswald({
    subsets: ['latin'],
    weight: ['700'],
});

const Hero = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);  // Track screen size
    const swiperRef = useRef(null);

    // Check screen size
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);  // If the window width is less than 768px, it's mobile
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Run it initially to set the correct state

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const cards = [
        {
            title: 'Cozy Room in Central Ibadan with Quick Access to UI',
            location: 'Garki',
            price: '₦450,000 /yr',
            image: 'https://dbjpekgzfghzs.cloudfront.net/443e79bf1f346d4630fffebbada9dcded4928ee5-sm.jpg',
            promo: 'Up to half a month free!',
            beds: 4,
            baths: 2,
            rooms: 2,
        },
        {
            title: 'Cozy Room in Central Ibadan with Quick Access to UI',
            location: 'Ibadan',
            price: '₦200,000 /yr',
            image: 'https://images.nigeriapropertycentre.com/properties/images/2993905/0688134fe3ec51-4bedroom-terrace-with-bq-without-furnitures-terraced-duplexes-for-sale-wuye-abuja.jpg',
            promo: 'Up to half a month free!',
            beds: 4,
            baths: 2,
            rooms: 2,
        },
        {
            title: 'Modern Shared Apartment in Ikeja GRA',
            location: 'Ikeja',
            price: '₦400,000 /yr',
            image: 'https://images.nigeriapropertycentre.com/properties/images/2993905/0688134ffc1b3b-4bedroom-terrace-with-bq-without-furnitures-terraced-duplexes-for-sale-wuye-abuja.jpg',
            promo: 'Up to half a month free!',
            beds: 2,
            baths: 1,
            rooms: 2,
        },
        {
            title: 'Spacious 3 Bedroom Flat in Lekki Phase 1',
            location: 'Lekki Phase 1',
            price: '₦1,200,000 /yr',
            image: 'https://images.nigeriapropertycentre.com/properties/images/2993905/0688135017b8ab-4bedroom-terrace-with-bq-without-furnitures-terraced-duplexes-for-sale-wuye-abuja.jpg',
            promo: 'Free first month rent!',
            beds: 3,
            baths: 2,
            rooms: 3,
        },
        {
            title: 'Affordable Mini Flat in Yaba',
            location: 'Yaba',
            price: '₦300,000 /yr',
            image: 'https://www.zillowstatic.com/bedrock/app/uploads/sites/5/2024/10/shutterstock_529108441.jpg',
            promo: '10% discount on yearly payment',
            beds: 1,
            baths: 1,
            rooms: 1,
        },
        {
            title: 'Luxury 2 Bedroom Apartment in Victoria Island',
            location: 'Victoria Island',
            price: '₦2,500,000 /yr',
            image: 'https://www.zillowstatic.com/bedrock/app/uploads/sites/5/2024/10/2017_ZillowExteriors_218-1.jpg',
            promo: 'Up to 1 month free rent',
            beds: 2,
            baths: 3,
            rooms: 2,
        },
    ];


    return (
        <div className="relative px-4 py-4 overflow-hidden">
            {!isMobile ? (
                <>
                    {/* Background Video */}
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute object-cover rounded-xl ml-6"
                    >
                        <source src="/hero-bg.mp4" type="video/mp4" />
                        <source src="/hero-bg.webm" type="video/webm" />
                        {/* Fallback */}
                        Your browser does not support the video tag.
                    </video>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 z-[-5]" />

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center px-6 md:px-10 lg:px-10 py-10 relative z-10">
                        {/* Left Side */}
                        <div>
                            <h1 className={`${oswald.className} text-7xl font-bold leading-tight mb-4 text-white`}>
                                No More Rental{' '}
                                <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                                    Scams
                                </span>
                            </h1>
                            <p className="text-lg text-white/90 mb-6">
                                Nigeria’s first AI-powered housing app that protects tenants and rewards honest agents.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="text"
                                    placeholder="Where are you moving to?"
                                    className="border border-white placeholder-white text-white bg-transparent px-2 py-2 rounded max-h-[50px] w-auto min-w-[210px]"
                                />

                                <select className="border border-white text-white bg-transparent px-2 py-2 rounded max-h-[50px] w-auto max-w-[165px] appearance-none">
                                    <option className="bg-black text-white">What type of home?</option>
                                    <option className="bg-black text-white">3 Bedroom Flat</option>
                                    <option className="bg-black text-white">2 Bedroom Flat</option>
                                    <option className="bg-black text-white">Room & Parlour Self Con</option>
                                    <option className="bg-black text-white">A Room Self Con</option>
                                </select>

                                <button className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-2 rounded font-semibold">
                                    Find a Home →
                                </button>
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="w-[550px] relative overflow-hidden min-h-[500px] rounded-xl mx-15">
                            {/* Background Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center -z-10"
                                style={{
                                    backgroundImage:
                                        'url(https://images.unsplash.com/photo-1572120360610-d971b9d7767c)',
                                }}
                            />
                            {/* Arrows */}
                            <button className="swiper-button-prev hidden md:flex absolute left-2 top-1/2 z-20 transform -translate-y-1/2 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full shadow-md w-10 h-10 items-center justify-center hover:bg-gray-100">
                                <ChevronLeft className="w-5 h-5 text-gray-800" />
                            </button>

                            {/* Swiper */}
                            <Swiper
                                modules={[Autoplay, Navigation]}
                                navigation={{
                                    nextEl: '.swiper-button-next',
                                    prevEl: '.swiper-button-prev',
                                }}
                                spaceBetween={16}
                                slidesPerView="auto"
                                centeredSlides
                                loopAdditionalSlides={cards.length * 2}
                                speed={3000}
                                autoplay={{
                                    delay: 0,
                                    disableOnInteraction: false,
                                    pauseOnMouseEnter: true,
                                }}
                                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                                className="py-6"
                            >
                                {cards.map((card, index) => {
                                    const isActive = index === activeIndex;
                                    return (
                                        <SwiperSlide key={index} className="!w-auto flex justify-center">
                                            <div
                                                className={`w-[230px] bg-white rounded-2xl shadow-md mt-10 overflow-hidden p-3 transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-50 scale-85'
                                                    }`}
                                            >
                                                <div className="relative rounded-xl overflow-hidden">
                                                    <img
                                                        src={card.image}
                                                        alt={card.title}
                                                        className="w-full h-44 object-cover"
                                                    />
                                                    <div className="absolute top-2 left-2 bg-white text-green-600 text-sm font-bold px-2 py-1 rounded">
                                                        {card.price}
                                                    </div>
                                                </div>
                                                <div className="mt-3">
                                                    <p className="uppercase text-xs text-gray-500 font-medium">
                                                        {card.location}
                                                    </p>
                                                    <h3 className="font-semibold text-base leading-snug mt-1">{card.title}</h3>
                                                    <div className="mt-2 text-sm text-white bg-gradient-to-r from-orange-400 to-pink-500 font-medium px-2 py-1 rounded inline-flex items-center">
                                                        💸 {card.promo}
                                                    </div>
                                                    <div className="mt-3 text-sm text-gray-600">
                                                        {card.beds} Beds · {card.baths} Baths
                                                        <span className="text-green-600 ml-2 font-semibold">
                                                            {card.rooms} room{card.rooms > 1 ? 's' : ''} available
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>

                            {/* Right Arrow */}
                            <button className="swiper-button-next hidden md:flex absolute right-2 top-1/2 z-20 transform -translate-y-1/2 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full shadow-md w-10 h-10 items-center justify-center hover:bg-gray-100">
                                <ChevronRight className="w-5 h-5 text-gray-800" />
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* First Section: Form and Video */}
                    <section className="relative">
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="absolute object-cover w-full h-full top-0 left-0"
                        >
                            <source src="/hero-bg.mp4" type="video/mp4" />
                            <source src="/hero-bg.webm" type="video/webm" />
                            {/* Fallback */}
                            Your browser does not support the video tag.
                        </video>

                        {/* Overlay for Video */}
                        <div className="absolute inset-0 bg-black/40 z-[-5]" />

                        {/* Form Content */}
                        <div className="grid grid-cols-1 gap-10 items-center px-6 py-10 relative z-10">
                            <div>
                                <h1 className={`${oswald.className} text-4xl font-bold leading-tight mb-4 text-white`}>
                                    No More Rental{' '}
                                    <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                                        Scams
                                    </span>
                                </h1>
                                <p className="text-lg text-white/90 mb-6">
                                    Nigeria’s first AI-powered housing app that protects tenants and rewards honest agents.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        type="text"
                                        placeholder="Where are you moving to?"
                                        className="border border-white placeholder-white text-white bg-transparent px-2 py-2 rounded max-h-[50px] w-auto min-w-[210px]"
                                    />

                                    <select className="border border-white text-white bg-transparent px-2 py-2 rounded max-h-[50px] w-auto max-w-[165px] appearance-none">
                                        <option className="bg-black text-white">What type of home?</option>
                                        <option className="bg-black text-white">3 Bedroom Flat</option>
                                        <option className="bg-black text-white">2 Bedroom Flat</option>
                                        <option className="bg-black text-white">Room & Parlour Self Con</option>
                                        <option className="bg-black text-white">A Room Self Con</option>
                                    </select>

                                    <button className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-2 rounded font-semibold">
                                        Find a Home →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Second Section: Swiper and Background Image */}
                    <section className="relative mt-10 w-full">
                        <div
                            className="absolute inset-0 bg-cover bg-center w-full h-[400px] sm:h-[500px] -z-10"
                            style={{
                                backgroundImage: 'url(https://images.unsplash.com/photo-1572120360610-d971b9d7767c)',
                            }}
                        />


                        <div className="relative w-full bg-cover bg-center h-[400px] sm:h-[500px] rounded-xl mx-auto">
                            {/* Swiper */}
                            <Swiper
                                modules={[Autoplay, Navigation]}
                                navigation={{
                                    nextEl: '.swiper-button-next',
                                    prevEl: '.swiper-button-prev',
                                }}
                                spaceBetween={16}
                                slidesPerView="auto"
                                centeredSlides
                                loopAdditionalSlides={cards.length * 2}
                                speed={3000}
                                autoplay={{
                                    delay: 0,
                                    disableOnInteraction: false,
                                    pauseOnMouseEnter: true,
                                }}
                                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                                className="py-6 mr-10"
                            >
                                {cards.map((card, index) => {
                                    const isActive = index === activeIndex;
                                    return (
                                        <SwiperSlide key={index} className="!w-auto flex justify-center">
                                            <div
                                                className={`w-[230px] bg-white rounded-2xl shadow-md mt-10 overflow-hidden p-3 transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-50 scale-85'
                                                    }`}
                                            >
                                                <div className="relative rounded-xl overflow-hidden">
                                                    <img
                                                        src={card.image}
                                                        alt={card.title}
                                                        className="w-full h-44 object-cover"
                                                    />
                                                    <div className="absolute top-2 left-2 bg-white text-green-600 text-sm font-bold px-2 py-1 rounded">
                                                        {card.price}
                                                    </div>
                                                </div>
                                                <div className="mt-3">
                                                    <p className="uppercase text-xs text-gray-500 font-medium">
                                                        {card.location}
                                                    </p>
                                                    <h3 className="font-semibold text-base leading-snug mt-1">{card.title}</h3>
                                                    <div className="mt-2 text-sm text-white bg-gradient-to-r from-orange-400 to-pink-500 font-medium px-2 py-1 rounded inline-flex items-center">
                                                        💸 {card.promo}
                                                    </div>
                                                    <div className="mt-3 text-sm text-gray-600">
                                                        {card.beds} Beds · {card.baths} Baths
                                                        <span className="text-green-600 ml-2 font-semibold">
                                                            {card.rooms} room{card.rooms > 1 ? 's' : ''} available
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

export default Hero;
