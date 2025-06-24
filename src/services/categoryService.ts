import { Category } from '@/types/category';
import { getCurrentUser } from '@/lib/supabase-auth';

// Use the current origin for API calls in the browser, or an empty string for server-side rendering
const API_BASE_URL = typeof window !== 'undefined' ? window.location.origin : '';

export const categoryService = {
  getAllCategories: async (): Promise<Category[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to fetch categories');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return []; // Return empty array instead of throwing
    }
  },

  getCategoriesByType: async (type: string): Promise<Category[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/type/${encodeURIComponent(type)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to fetch categories by type');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching categories by type:', error);
      return []; // Return empty array instead of throwing
    }
  },

  getFeaturedCategories: async (): Promise<Category[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/featured`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to fetch featured categories');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching featured categories:', error);
      return []; // Return empty array instead of throwing
    }
  },

  createCategory: async (category: Partial<Category>): Promise<Category> => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(category),
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to create category');
      }
      return response.json();
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  updateCategory: async (id: string, category: Partial<Category>): Promise<Category> => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/api/categories/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(category),
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to update category');
      }
      return response.json();
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  deleteCategory: async (id: string): Promise<void> => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/api/categories/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
};
