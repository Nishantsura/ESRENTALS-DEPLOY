export interface Car {
  id: string;
  objectID?: string; // Algolia search result ID
  name: string;
  brand_id: string;
  /**
   * @deprecated Use brand_id for all logic and display. This is only for backward compatibility.
   */
  brand?: string;
  transmission: 'Manual' | 'Automatic';
  seats: number;
  year: number;
  rating: number;
  advancePayment?: boolean; // Add advancePayment property
  rareCar: boolean;
  featured: boolean;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  engineCapacity: string;
  power: string;
  dailyPrice: number;
  type: 'Supercar' | 'SUV' | 'Sedan' | 'Hatchback' | 'Coupe' | 'Convertible' | 'Wagon';
  tags: string[];
  description: string;
  images: string[];
  available: boolean;
  location: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  mileage?: number;
  category?: string;
  specs?: Record<string, any> | string; // Allow both JSON object and string
}
