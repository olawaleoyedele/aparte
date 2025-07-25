import { useState } from 'react';
import Hero from '@/components/Hero';
import Header from '@/components/Header';
import ListingSection from '@/components/ListingSection';
import StruggleSolution from '@/components/StruggleSolution';
import HowItWorks from '@/components/HowItWorks';
import Footer from '@/components/Footer';
import OnboardingWrapper from '@/components/Onboarding/OnboardingWrapper';
import { AnimatePresence } from 'framer-motion';
import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';


export default function Home({ user: initialUser }) {
  console.log("Initial user from SSR:", initialUser);
  const [showEmailStep, setShowEmailStep] = useState(false);
  const [user, setUser] = useState(initialUser); // ✅ track logged-in user

  return (
    <main>
      <Header onLoginClick={() => setShowEmailStep(true)} user={user} />
      <Hero />
      <ListingSection />
      <StruggleSolution />
      <HowItWorks />
      <Footer />

      <AnimatePresence>
        {showEmailStep && (
          <OnboardingWrapper
            resetKey={showEmailStep} // triggers useEffect on toggle
            onClose={() => setShowEmailStep(false)}
            setUser={setUser} // ✅ pass setUser to update user state
          />
        )}
      </AnimatePresence>
    </main>
  );
}

export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  const token = cookies.token || null;

  if (!token) {
    // No token, return no user
    return { props: { user: null } };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Return user info (you can add more fields as needed)
    return {
      props: {
        user: {
          name: decoded.name || null,
          email: decoded.email || null,
          role: decoded.role || null,
        },
      },
    };
  } catch (error) {
    // Invalid token
    return { props: { user: null } };
  }
}