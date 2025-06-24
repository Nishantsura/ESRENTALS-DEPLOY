'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/supabase-auth';
import { Category } from '@/types/category';
import { categoryService } from '@/services/categoryService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { CategoryDialog } from '@/components/admin/category-dialog';

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const categoriesData = await categoryService.getAllCategories();
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      if (!id) {
        throw new Error('Category ID is required');
      }
      await categoryService.deleteCategory(id);
      await fetchCategories(); // Refresh the list
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('Failed to delete category');
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
  };

  const handleCategorySaved = () => {
    handleDialogClose();
    fetchCategories(); // Refresh the list
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
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
            onClick={fetchCategories} 
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
          <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
          <p className="text-gray-600 mt-2">Manage car types, fuel types, and tags</p>
        </div>
        <Button onClick={handleCreateCategory} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCategory(category)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => category.id && handleDeleteCategory(category.id)}
                    className="text-red-600 hover:text-red-700"
                    disabled={!category.id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Type:</span>
                  <span className="text-sm font-medium capitalize">{category.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Slug:</span>
                  <span className="text-sm font-medium">{category.slug}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Featured:</span>
                  <span className={`text-sm font-medium ${
                    category.featured ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {category.featured ? 'Yes' : 'No'}
                  </span>
                </div>
                {category.description && (
                  <div className="mt-3">
                    <span className="text-sm text-gray-600">Description:</span>
                    <p className="text-sm mt-1">{category.description}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600 mb-4">No categories found</p>
            <Button onClick={handleCreateCategory} className="flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" />
              Add Your First Category
            </Button>
          </CardContent>
        </Card>
      )}

      <CategoryDialog
        category={editingCategory || undefined}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={async (category: Partial<Category>) => {
          try {
            if (editingCategory && editingCategory.id) {
              await categoryService.updateCategory(editingCategory.id, category);
            } else {
              await categoryService.createCategory(category);
            }
            handleCategorySaved();
          } catch (err) {
            console.error('Error saving category:', err);
            alert('Failed to save category');
          }
        }}
      />
    </div>
  );
}
