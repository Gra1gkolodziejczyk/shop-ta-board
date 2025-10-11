import React from 'react';
import { LoginForm } from '../components/signin/LoginForm.tsx';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <LoginForm />
    </div>
  );
};
