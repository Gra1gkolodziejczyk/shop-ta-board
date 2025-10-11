import React from 'react';
import { SignUpForm } from '../components/signup/SignUpForm.tsx';

export const SignUpPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <SignUpForm />
    </div>
  );
};
