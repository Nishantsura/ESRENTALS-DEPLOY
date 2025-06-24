'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/supabase-auth';
import { Brand } from '@/types/brand';
import { brandAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { BrandDialog } from '@/components/admin/brand-dialog';

export default function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const brandsData = await brandAPI.getAllBrands();
      setBrands(brandsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching brands:', err);
      setError(err instanceof Error ? err.message : 'Failed to load brands');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBrand = () => {
    setEditingBrand(null);
    setIsDialogOpen(true);
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setIsDialogOpen(true);
  };

  const handleDeleteBrand = async (id: string) => {
    if (!confirm('Are you sure you want to delete this brand?')) {
      return;
    }

    try {
      await brandAPI.deleteBrand(id);
      await fetchBrands(); // Refresh the list
    } catch (err) {
      console.error('Error deleting brand:', err);
      alert('Failed to delete brand');
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingBrand(null);
  };

  const handleBrandSaved = () => {
    handleDialogClose();
    fetchBrands(); // Refresh the list
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading brands...</p>
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
            onClick={fetchBrands} 
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
          <h1 className="text-3xl font-bold text-gray-900">Brands Management</h1>
          <p className="text-gray-600 mt-2">Manage car manufacturers</p>
        </div>
        <Button onClick={handleCreateBrand} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Brand
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <Card key={brand.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{brand.name}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditBrand(brand)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => brand.id && handleDeleteBrand(brand.id)}
                    className="text-red-600 hover:text-red-700"
                    disabled={!brand.id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Slug:</span>
                  <span className="text-sm font-medium">{brand.slug}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Featured:</span>
                  <span className={`text-sm font-medium ${
                    brand.featured ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {brand.featured ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cars:</span>
                  <span className="text-sm font-medium">{brand.carCount || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {brands.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600 mb-4">No brands found</p>
            <Button onClick={handleCreateBrand} className="flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" />
              Add Your First Brand
            </Button>
          </CardContent>
        </Card>
      )}

      <BrandDialog
        brand={editingBrand || undefined}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={async (brand: Partial<Brand>) => {
          try {
            if (editingBrand && editingBrand.id) {
              await brandAPI.updateBrand(editingBrand.id, brand);
            } else {
              await brandAPI.createBrand(brand);
            }
            handleBrandSaved();
          } catch (err) {
            console.error('Error saving brand:', err);
            alert('Failed to save brand');
          }
        }}
      />
    </div>
  );
}
