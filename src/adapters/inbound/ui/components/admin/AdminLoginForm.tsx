import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Loader2, Shield } from "lucide-react";
import {Alert, AlertDescription} from "@/components/ui/alert.tsx";
import React, {useState} from "react";
import {toast} from "sonner";
import {useAdmin} from "@/infrastructure/providers/AdminProvider.tsx";
import {useNavigate} from "react-router-dom";

export const AdminLoginForm = () => {
  const navigate = useNavigate();
  const { login, error, clearError } = useAdmin();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      await login(formData);

      toast.success('Connexion admin réussie', {
        description: 'Bienvenue dans l\'administration',
      });

      navigate('/admin/dashboard');
    } catch  {
      console.log("Error is handled by context")
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    {error && (
      <Alert variant="destructive" className="mb-6">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )}

    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email administrateur</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="admin@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </div>

      <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connexion en cours...
          </>
        ) : (
          <>
            <Shield className="mr-2 h-4 w-4" />
            Se connecter
          </>
        )}
      </Button>
    </form>
    </>
  )
}
