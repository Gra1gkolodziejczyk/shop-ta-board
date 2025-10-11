import {LogOut, Shield} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import { toast } from "sonner";
import {useNavigate} from "react-router-dom";

const AdminHeader = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    toast.info('Déconnexion admin', {
      description: 'Vous avez été déconnecté',
    });

    navigate('/admin');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Shield className="w-6 h-6 text-blue-600 mr-3" />
            <h1 className="text-xl font-bold text-gray-900">Administration</h1>
          </div>

          <Button
            variant="ghost"
            onClick={handleLogout}
            className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader;
