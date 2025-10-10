import { Header } from "@/adapters/inbound/ui/layout/Header.tsx";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";


const ProductNotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert variant="destructive">
          <AlertDescription>Produit introuvable</AlertDescription>
        </Alert>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-blue-600 hover:text-blue-700 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour aux produits
        </button>
      </div>
    </div>
  )
}

export default ProductNotFound;
