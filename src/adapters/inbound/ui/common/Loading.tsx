import {Header} from "@/adapters/inbound/ui/layout/Header.tsx";
import {Loader2} from "lucide-react";

export const Loading = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Chargement des données...</span>
        </div>
      </div>
    </div>
  )
}
