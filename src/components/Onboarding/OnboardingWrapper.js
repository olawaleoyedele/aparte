// src/components/Onboarding/OnboardingWrapper.js

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import EmailStep from './EmailStep';
import PasswordStep from './PasswordStep';
import { toast } from 'react-hot-toast';

export default function OnboardingWrapper({ onClose, setUser }) {
  const [step, setStep] = useState('email'); // ✅ Start with email step
  const [userExists, setUserExists] = useState(false);
  const [email, setEmail] = useState('');

  // Reset to email step when modal opens
  useEffect(() => {
    setStep('email');
  }, []);

  const handleEmailVerified = (submittedEmail, exists) => {
    setEmail(submittedEmail);
    setUserExists(exists);
    setStep('password');
  };

  const handleBack = () => {
    setStep('email');
  };

  const handleSuccess = (data) => {
    console.log("Login/Register success:", data);
    toast.success(userExists ? 'Login successful!' : 'Registration successful!');
    setUser(data);        // Update user state
    setStep('email');            // Reset step for next time
    onClose();                   // Close modal
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        {step === 'email' && (
          <motion.div
            key="email"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <EmailStep
              onEmailVerified={handleEmailVerified}
              onNext={() => setStep('password')}
              onClose={onClose}
            />
          </motion.div>
        )}

        {step === 'password' && (
          <motion.div
            key="password"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <PasswordStep
              email={email}
              isExistingUser={userExists}
              onBack={handleBack}
              onClose={onClose}
              onSuccess={handleSuccess}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
