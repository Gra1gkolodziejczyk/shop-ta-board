import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Header } from '../layout/Header';
import { Avatar } from '../common/Avatar';
import { useAuth } from '@/infrastructure/providers/AuthProvider';
import { UserUseCases } from '@/domain/usecases/UserUseCases';
import { UserApiAdapter } from '@/adapters/outbound/api/UserApiAdapter';
import { TokenStorageAdapter } from '@/adapters/outbound/api/TokenStorageAdapter';
import {
  User as UserIcon,
  Mail,
  ArrowLeft,
  Loader2,
  Trash2,
  Save,
  AlertTriangle
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loading } from "@/adapters/inbound/ui/common/Loading.tsx";

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [formData, setFormData] = useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    email: user?.email || '',
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      });
    }
  }, [user]);

  const hasChanges = user && (
    formData.firstname !== user.firstname ||
    formData.lastname !== user.lastname ||
    formData.email !== user.email
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasChanges) return;

    try {
      setError(null);
      setIsUpdating(true);

      const tokenStorage = new TokenStorageAdapter();
      const userApiAdapter = new UserApiAdapter(() => tokenStorage.getAccessToken());
      const userUseCases = new UserUseCases(userApiAdapter);

      await userUseCases.updateUser(formData);

      toast.success('Profil mis à jour', {
        description: 'Vos informations ont été modifiées avec succès',
      });

      window.location.reload();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      setError(errorMessage);
      toast.error('Erreur', {
        description: errorMessage,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);

      const tokenStorage = new TokenStorageAdapter();
      const userApiAdapter = new UserApiAdapter(() => tokenStorage.getAccessToken());
      const userUseCases = new UserUseCases(userApiAdapter);

      await userUseCases.deleteAccount();

      toast.success('Compte supprimé', {
        description: 'Votre compte a été supprimé définitivement',
      });

      await signOut();
      navigate('/login');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      toast.error('Erreur', {
        description: errorMessage,
      });
      setIsDeleting(false);
    }
  };

  if (!user) {
    return (
      <Loading />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/')}
          className="text-gray-600 hover:text-gray-900 flex items-center mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </button>

        <div className="flex items-center mb-8">
          <UserIcon className="w-8 h-8 text-gray-900 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Mon profil</h1>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header with Avatar */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8">
            <div className="flex items-center">
              <Avatar
                firstname={user.firstname}
                lastname={user.lastname}
                size="lg"
                className="ring-4 ring-white ring-opacity-50"
              />
              <div className="ml-6 text-white">
                <h2 className="text-2xl font-bold">
                  {user.firstname} {user.lastname}
                </h2>
                <p className="text-blue-100 flex items-center mt-1">
                  <Mail className="w-4 h-4 mr-2" />
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstname">Prénom</Label>
                <Input
                  id="firstname"
                  name="firstname"
                  type="text"
                  value={formData.firstname}
                  onChange={handleChange}
                  disabled={isUpdating}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastname">Nom</Label>
                <Input
                  id="lastname"
                  name="lastname"
                  type="text"
                  value={formData.lastname}
                  onChange={handleChange}
                  disabled={isUpdating}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isUpdating}
                className="w-full"
              />
            </div>

            {hasChanges && (
              <div className="pt-4 border-t">
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full md:w-auto"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Modification en cours...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Modifier les informations
                    </>
                  )}
                </Button>
              </div>
            )}
          </form>

          <div className="border-t border-gray-200 bg-red-50 p-8">
            <h3 className="text-lg font-semibold text-red-900 mb-2 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Zone dangereuse
            </h3>
            <p className="text-sm text-red-700 mb-4">
              La suppression de votre compte est définitive et irréversible. Toutes vos données seront perdues.
            </p>
            <Button
              type="button"
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer mon compte
            </Button>
          </div>
        </div>

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center text-red-600">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Supprimer votre compte ?
              </DialogTitle>
              <DialogDescription className="text-base pt-4">
                Êtes-vous sûr de vouloir supprimer votre compte ?
                <br />
                <br />
                <span className="font-semibold text-red-600">
                  Cette action est définitive et irréversible.
                </span>
                <br />
                <br />
                Toutes vos données seront supprimées, incluant :
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                  <li>Vos informations personnelles</li>
                  <li>Votre historique de commandes</li>
                  <li>Votre panier</li>
                  <li>Toutes vos données associées</li>
                </ul>
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="gap-3 sm:gap-3 flex-col sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                disabled={isDeleting}
                className="w-full sm:w-auto"
              >
                Annuler
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="w-full sm:w-auto"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer définitivement
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};
