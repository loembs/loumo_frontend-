import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useToast } from '../hooks/use-toast';
import { API_BASE_URL, ENDPOINTS } from '@/config/constants';

interface CreateAdminFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  role: 'ADMIN' | 'CLIENT';
}

export default function CreateAdminForm() {
  const [formData, setFormData] = useState<CreateAdminFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    role: 'ADMIN',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN.CREATE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          role: 'ADMIN'
        }),
      });

      if (response.ok) {
        toast({
          title: "✅ Succès",
          description: "Utilisateur admin créé avec succès !",
        });
        setFormData({
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          phone: '',
          address: '',
          role: 'ADMIN',
        });
        setIsVisible(false);
      } else {
        const errorData = await response.json();
        toast({
          title: "❌ Erreur",
          description: errorData.message || "Erreur lors de la création",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Erreur",
        description: "Erreur de connexion au serveur",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="text-xs opacity-50 hover:opacity-100 transition-opacity"
      >
        🔧 Create Admin
      </Button>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Créer un Admin</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 h-6 w-6 p-0"
        >
          ✕
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="firstName" className="text-xs">Prénom</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-xs">Nom</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="h-8 text-xs"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email" className="text-xs">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="h-8 text-xs"
            />
          </div>
          
          <div>
            <Label htmlFor="password" className="text-xs">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="h-8 text-xs"
            />
          </div>
          
          <div>
            <Label htmlFor="phone" className="text-xs">Téléphone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="h-8 text-xs"
            />
          </div>
          
          <div>
            <Label htmlFor="address" className="text-xs">Adresse</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="h-8 text-xs"
            />
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-8 text-xs"
            >
              {isLoading ? "Création..." : "Créer Admin"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsVisible(false)}
              className="h-8 text-xs"
            >
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
