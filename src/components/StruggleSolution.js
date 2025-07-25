'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import sadWoman from '/public/sad-woman.png';
import pointingMan from '/public/pointing-man.png';

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: 'easeOut' },
    },
};

const StruggleSolution = () => {
    const [problemRef, problemInView] = useInView({ triggerOnce: true, threshold: 0.2 });
    const [solutionRef, solutionInView] = useInView({ triggerOnce: true, threshold: 0.2 });

    return (
        <section className="bg-white py-15 px-4 max-w-6xl mx-auto">
            <motion.h2
                variants={fadeUp}
                initial="hidden"
                animate={problemInView ? 'visible' : 'hidden'}
                className="text-3xl sm:text-5xl font-bold text-center mb-16 text-gray-900 font-[Oswald]"
            >
                The{' '}
                <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                    Struggle{' '}
                </span>
                Is Real. But Not Anymore
            </motion.h2>

            {/* Problem Section */}
            <div ref={problemRef} className="grid md:grid-cols-2 items-center mb-5">

                {/* Text on the Left */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate={problemInView ? 'visible' : 'hidden'}
                    className="space-y-4 text-gray-700"
                >
                    {/* <h3 className="text-3xl font-semibold text-black">
            The{' '}
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                Problem{' '}
            </span>
        </h3> */}
                    <div className="grid gap-4 md:grid-cols-2">
                        {[
                            "Scam agents list fake or non-existent homes just to collect fees.",
                            "Multiple agents inflate prices with layered commissions.",
                            "Same property posted many times with conflicting info.",
                            "Upfront fees for places that don’t even exist.",
                            'Hidden agent layers: "2nd agent", "3rd agent" – more cost.',
                            'Too expensive extortion fee called inspection fee.'
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-4 p-4 rounded-xl border border-red-100 bg-red-50 shadow-sm"
                            >
                                <div className="flex-shrink-0 w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xl">
                                    ❌
                                </div>
                                <p className="text-gray-700">{item}</p>
                            </div>
                        ))}
                    </div>

                    <p className="text-sm italic text-gray-500 mt-2">
                        It's chaotic, expensive, and unfair — especially for those urgently seeking shelter.
                    </p>
                </motion.div>

                {/* Image on the Right */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate={problemInView ? 'visible' : 'hidden'}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center"
                >
                    <Image
                        src={sadWoman}
                        alt="Frustrated renter"
                        width={150}
                        height={150}
                        className="rounded-xl"
                    />
                </motion.div>
            </div>


            {/* Solution Section */}
            <div ref={solutionRef} className="grid md:grid-cols-2 gap-16 items-center">
                {/* Image */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate={solutionInView ? 'visible' : 'hidden'}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center"
                >
                    <Image
                        src={pointingMan}
                        alt="Confident solution expert"
                        width={200}
                        height={200}
                        className="rounded-xl"
                    />
                </motion.div>

                {/* Text */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate={solutionInView ? 'visible' : 'hidden'}
                    className="space-y-4 text-gray-700"
                >
                    <h3 className="text-3xl font-semibold text-black">
                        Our{' '}
                        <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                            Solution{' '}
                        </span>
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        {[
                            "Only verified landlords or licensed agents can post listings.",
                            "Listings are backed by ownership docs or CAC certificates.",
                            "AI flags duplicate listings or repeated agents instantly.",
                            "Users can report suspicious agents to keep the platform clean.",
                            "One-click WhatsApp to speak with the real poster in seconds.",
                            "Individual agent has trust score based on successful deals and user feedback."
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-4 p-4 rounded-xl border border-green-100 bg-green-50 shadow-sm"
                            >
                                <div className="flex-shrink-0 w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl">
                                    ✅
                                </div>
                                <p className="text-gray-700">{item}</p>
                            </div>
                        ))}
                    </div>

                    <p className="text-sm italic text-gray-500 mt-2">
                        With trust and tech, we’re building peace of mind — one verified listing at a time.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default StruggleSolution;
