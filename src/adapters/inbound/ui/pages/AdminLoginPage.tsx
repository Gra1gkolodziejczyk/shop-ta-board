import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { AdminLoginForm } from "@/adapters/inbound/ui/components/admin/AdminLoginForm.tsx";

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
            <p className="text-gray-600 mt-2">Accès réservé aux administrateurs</p>
          </div>

          <AdminLoginForm />

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Retour au site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
