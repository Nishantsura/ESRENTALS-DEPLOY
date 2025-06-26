import { Car } from '@/types/car';
import { Category } from '@/types/category';
import { Brand } from '@/types/brand';
import { getIdToken } from '@/lib/supabase-auth';

// Use the current origin for API calls in the browser, or an empty string for server-side rendering
const API_BASE_URL = typeof window !== 'undefined' ? window.location.origin : '';
// console.log('API_BASE_URL:', API_BASE_URL);
// console.log('NEXT_PUBLIC_BACKEND_URL:', process.env.NEXT_PUBLIC_BACKEND_URL);

// Car API endpoints
export const carAPI = {
  getAllCars: async (): Promise<Car[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cars`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to fetch cars');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching cars:', error);
      return []; // Return empty array instead of throwing
    }
  },

  getCarsByType: async (type: string): Promise<Car[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cars/type/${encodeURIComponent(type)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to fetch cars by type');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching cars by type:', error);
      return []; // Return empty array instead of throwing
    }
  },

  getCarsByTag: async (tag: string): Promise<Car[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cars/tag/${encodeURIComponent(tag)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to fetch cars by tag');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching cars by tag:', error);
      return []; // Return empty array instead of throwing
    }
  },

  getCarsByFuelType: async (fuelType: string): Promise<Car[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cars/fuel-type/${encodeURIComponent(fuelType)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to fetch cars by fuel type');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching cars by fuel type:', error);
      return []; // Return empty array instead of throwing
    }
  },

  getCarsByBrand: async (brand: string): Promise<Car[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cars/by-brand/${encodeURIComponent(brand)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to fetch cars by brand');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching cars by brand:', error);
      return []; // Return empty array instead of throwing
    }
  },

  getFeaturedCars: async (): Promise<Car[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cars/featured`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to fetch featured cars');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching featured cars:', error);
      return []; // Return empty array instead of throwing
    }
  },

  getCarById: async (id: string): Promise<Car> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cars/${encodeURIComponent(id)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to fetch car');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching car:', error);
      throw error; // Re-throw the error
    }
  },

  createCar: async (car: Partial<Car>): Promise<Car> => {
    try {
      const token = await getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/cars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(car),
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to create car');
      }
      return response.json();
    } catch (error) {
      console.error('Error creating car:', error);
      throw error;
    }
  },

  updateCar: async (id: string, car: Partial<Car>): Promise<Car> => {
    try {
      const token = await getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/cars/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(car),
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to update car');
      }
      const updatedCar = await response.json();
      return updatedCar;
    } catch (error) {
      console.error('Error updating car:', error);
      throw error;
    }
  },

  deleteCar: async (id: string): Promise<void> => {
    try {
      const token = await getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/cars/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to delete car');
      }
    } catch (error) {
      console.error('Error deleting car:', error);
      throw error;
    }
  },
};

// Category API endpoints
export const categoryAPI = {
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
      const token = await getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
      const token = await getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/categories/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
      const token = await getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/categories/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
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
  },
};

// Brand API endpoints
export const brandAPI = {
  getAllBrands: async (): Promise<Brand[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/brands`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to fetch brands');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching brands:', error);
      return []; // Return empty array instead of throwing
    }
  },

  getFeaturedBrands: async (): Promise<Brand[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/brands/featured`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to fetch featured brands');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching featured brands:', error);
      return []; // Return empty array instead of throwing
    }
  },

  createBrand: async (brand: Partial<Brand>): Promise<Brand> => {
    try {
      const token = await getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/brands`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(brand),
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to create brand');
      }
      return response.json();
    } catch (error) {
      console.error('Error creating brand:', error);
      throw error;
    }
  },

  updateBrand: async (id: string, brand: Partial<Brand>): Promise<Brand> => {
    try {
      const token = await getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/brands/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(brand),
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to update brand');
      }
      return response.json();
    } catch (error) {
      console.error('Error updating brand:', error);
      throw error;
    }
  },

  deleteBrand: async (id: string): Promise<void> => {
    try {
      const token = await getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/brands/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to delete brand');
      }
    } catch (error) {
      console.error('Error deleting brand:', error);
      throw error;
    }
  },

  getBrandBySlug: async (slug: string): Promise<Brand | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/brands/${encodeURIComponent(slug)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      if (!response.ok) {
        return null;
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching brand by slug:', error);
      return null;
    }
  },
};

// Search API endpoint
export const searchAPI = {
  search: async (query: string): Promise<Car[]> => {
    try {
      const { searchClient } = await import('@/lib/algolia');
      const index = searchClient.initIndex('autoluxe-dxb');
      const { hits } = await index.search<Car>(query, {
        restrictSearchableAttributes: ['brand', 'name', 'model'],
        hitsPerPage: 8,
        distinct: true,
        attributesToRetrieve: [
          'objectID',
          'brand',
          'name',
          'model',
          'year',
          'dailyPrice',
          'images'
        ],
        attributesToHighlight: ['brand', 'name', 'model']
      });
      return hits.map(hit => ({
        ...hit,
        _id: hit.objectID,
        dailyPrice: Number(hit.dailyPrice),
        images: hit.images || []
      }));
    } catch (error) {
      console.error('Error searching cars:', error);
      return [];
    }
  }
};
