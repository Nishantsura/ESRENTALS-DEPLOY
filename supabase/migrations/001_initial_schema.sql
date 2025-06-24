-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brands table
CREATE TABLE public.brands (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  logo TEXT,
  featured BOOLEAN DEFAULT FALSE,
  description TEXT,
  car_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('carType', 'fuelType', 'tag')),
  slug TEXT NOT NULL,
  image TEXT,
  featured BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, type)
);

-- Cars table
CREATE TABLE public.cars (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL, -- Denormalized for performance
  year INTEGER NOT NULL,
  type TEXT NOT NULL,
  fuel_type TEXT NOT NULL,
  transmission TEXT NOT NULL,
  seats INTEGER DEFAULT 4,
  engine_capacity TEXT,
  power TEXT,
  daily_price DECIMAL(10,2) NOT NULL,
  rating DECIMAL(3,2) DEFAULT 5.0,
  advance_payment BOOLEAN DEFAULT FALSE,
  rare_car BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  available BOOLEAN DEFAULT TRUE,
  description TEXT,
  images TEXT[], -- Array of image URLs
  tags TEXT[], -- Array of tags
  location JSONB, -- {name: string, coordinates: {lat: number, lng: number}}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_cars_brand_id ON public.cars(brand_id);
CREATE INDEX idx_cars_featured ON public.cars(featured);
CREATE INDEX idx_cars_available ON public.cars(available);
CREATE INDEX idx_cars_type ON public.cars(type);
CREATE INDEX idx_cars_fuel_type ON public.cars(fuel_type);
CREATE INDEX idx_cars_daily_price ON public.cars(daily_price);
CREATE INDEX idx_cars_brand_name ON public.cars(brand_name);
CREATE INDEX idx_cars_tags ON public.cars USING GIN(tags);
CREATE INDEX idx_cars_images ON public.cars USING GIN(images);
CREATE INDEX idx_cars_year ON public.cars(year);

-- Full-text search index
CREATE INDEX idx_cars_search ON public.cars USING GIN(
  to_tsvector('english', name || ' ' || brand_name || ' ' || COALESCE(description, ''))
);

-- Brand indexes
CREATE INDEX idx_brands_featured ON public.brands(featured);
CREATE INDEX idx_brands_slug ON public.brands(slug);

-- Category indexes
CREATE INDEX idx_categories_type ON public.categories(type);
CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_featured ON public.categories(featured);

-- Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Cars
CREATE POLICY "Public read access for cars" ON public.cars FOR SELECT USING (true);
CREATE POLICY "Admin write access for cars" ON public.cars FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
);

-- RLS Policies for Brands
CREATE POLICY "Public read access for brands" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Admin write access for brands" ON public.brands FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
);

-- RLS Policies for Categories
CREATE POLICY "Public read access for categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin write access for categories" ON public.categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
);

-- RLS Policies for Users
CREATE POLICY "Users can read own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin can read all users" ON public.users FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
);

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON public.brands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON public.cars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update brand car count
CREATE OR REPLACE FUNCTION update_brand_car_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.brands 
    SET car_count = car_count + 1 
    WHERE id = NEW.brand_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.brands 
    SET car_count = car_count - 1 
    WHERE id = OLD.brand_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.brand_id != OLD.brand_id THEN
      UPDATE public.brands 
      SET car_count = car_count - 1 
      WHERE id = OLD.brand_id;
      UPDATE public.brands 
      SET car_count = car_count + 1 
      WHERE id = NEW.brand_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger for brand car count
CREATE TRIGGER update_brand_car_count_trigger
  AFTER INSERT OR DELETE OR UPDATE ON public.cars
  FOR EACH ROW EXECUTE FUNCTION update_brand_car_count(); 