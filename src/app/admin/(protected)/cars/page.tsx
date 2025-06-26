'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/supabase-auth';
import { Car } from '@/types/car';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { CarDialog } from '@/components/admin/car-dialog';
import { Brand } from '@/types/brand';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusModal } from '@/components/admin/status-modal';
import AdminService from '@/services/adminService';

export default function AdminCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    fetchCars();
    fetchBrands();
  }, []);

  const fetchCars = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const carsData = await AdminService.getAllCars();
      setCars(carsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError(err instanceof Error ? err.message : 'Failed to load cars');
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const brandsData = await AdminService.getAllBrands();
      setBrands(brandsData);
    } catch (err) {
      console.error('Error fetching brands:', err);
    }
  };

  const handleCreateCar = () => {
    setEditingCar(null);
    setIsDialogOpen(true);
  };

  const handleEditCar = (car: Car) => {
    setEditingCar(car);
    setIsDialogOpen(true);
  };

  const handleDeleteCar = async (id: string) => {
    if (!confirm('Are you sure you want to delete this car?')) {
      return;
    }

    try {
      await AdminService.deleteCar(id);
      await fetchCars(); // Refresh the list
    } catch (err) {
      console.error('Error deleting car:', err);
      alert('Failed to delete car');
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingCar(null);
  };

  const handleCarSaved = () => {
    handleDialogClose();
    fetchCars(); // Refresh the list
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cars...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={fetchCars} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cars Management</h1>
          <p className="text-gray-600 mt-2">Manage your car inventory</p>
        </div>
        <Button onClick={handleCreateCar} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Car
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <Card key={car.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{car.name}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCar(car)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCar(car.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Brand:</span>
                  <span className="text-sm font-medium">{car.brand || brands.find(b => b.id === car.brand_id)?.name || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Year:</span>
                  <span className="text-sm font-medium">{car.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Price:</span>
                  <span className="text-sm font-medium">${car.dailyPrice}/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Featured:</span>
                  <span className={`text-sm font-medium ${
                    car.featured ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {car.featured ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Available:</span>
                  <span className={`text-sm font-medium ${
                    car.available ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {car.available ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {cars.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600 mb-4">No cars found</p>
            <Button onClick={handleCreateCar} className="flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" />
              Add Your First Car
            </Button>
          </CardContent>
        </Card>
      )}

      <CarDialog
        car={editingCar || undefined}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={async (car: Partial<Car>) => {
          try {
            if (editingCar) {
              await AdminService.updateCar(editingCar.id, car);
            } else {
              await AdminService.createCar(car);
            }
            handleCarSaved();
          } catch (err) {
            console.error('Error saving car:', err);
            alert('Failed to save car');
          }
        }}
      />
    </div>
  );
}
