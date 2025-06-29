import { Car } from '@/types/car';
import { Brand } from '@/types/brand';
import { Category } from '@/types/category';

const API_BASE = '/api/admin';

export class AdminService {
  // Cars
  static async getAllCars(): Promise<Car[]> {
    const res = await fetch(`${API_BASE}/cars`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
  static async getCarById(id: string): Promise<Car> {
    const res = await fetch(`${API_BASE}/cars/${id}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
  static async createCar(car: Partial<Car>): Promise<Car> {
    // Map camelCase to snake_case for DB
    const carPayload = {
      ...car,
      daily_price: car.dailyPrice,
      engine_capacity: car.engineCapacity,
      fuel_type: car.fuelType,
      power: car.power,
      transmission: car.transmission,
      seats: car.seats,
      year: car.year,
      brand_id: car.brand_id,
      category: car.category,
      tags: car.tags,
      available: car.available,
      featured: car.featured,
      rare_car: car.rareCar,
      description: car.description,
      images: car.images,
      type: car.type,
      location: car.location,
    };
    delete carPayload.dailyPrice;
    delete carPayload.engineCapacity;
    delete carPayload.fuelType;
    delete carPayload.rareCar;
    const res = await fetch(`${API_BASE}/cars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carPayload),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
  static async updateCar(id: string, car: Partial<Car>): Promise<Car> {
    // Map camelCase to snake_case for DB
    const carPayload = {
      ...car,
      daily_price: car.dailyPrice,
      engine_capacity: car.engineCapacity,
      fuel_type: car.fuelType,
      power: car.power,
      transmission: car.transmission,
      seats: car.seats,
      year: car.year,
      brand_id: car.brand_id,
      category: car.category,
      tags: car.tags,
      available: car.available,
      featured: car.featured,
      rare_car: car.rareCar,
      description: car.description,
      images: car.images,
      type: car.type,
      location: car.location,
    };
    delete carPayload.dailyPrice;
    delete carPayload.engineCapacity;
    delete carPayload.fuelType;
    delete carPayload.rareCar;
    const res = await fetch(`${API_BASE}/cars/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carPayload),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
  static async deleteCar(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/cars/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
  }

  // Brands
  static async getAllBrands(): Promise<Brand[]> {
    const res = await fetch(`${API_BASE}/brands`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
  static async createBrand(brand: Partial<Brand>): Promise<Brand> {
    const res = await fetch(`${API_BASE}/brands`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(brand),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
  static async updateBrand(id: string, brand: Partial<Brand>): Promise<Brand> {
    const res = await fetch(`${API_BASE}/brands/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(brand),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
  static async deleteBrand(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/brands/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
  }

  // Categories
  static async getAllCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
  static async createCategory(category: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
  static async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
  static async deleteCategory(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
  }

  static async getAdminStats() {
    const res = await fetch('/api/admin/stats');
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
}

export default AdminService; 