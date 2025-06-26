'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/supabase-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Tag, Users, TrendingUp } from 'lucide-react';
import AdminService from '@/services/adminService';

type AdminStats = {
  totalCars: number;
  totalBrands: number;
  totalCategories: number;
  featuredCars: number;
  featuredBrands: number;
  featuredCategories: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalCars: 0,
    totalBrands: 0,
    totalCategories: 0,
    featuredCars: 0,
    featuredBrands: 0,
    featuredCategories: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const statsData = await AdminService.getAdminStats();
      setStats(statsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#101014] min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome to the AutoLuxe admin panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#18181b] border-none shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Total Cars</CardTitle>
            <Car className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalCars}</div>
            <p className="text-xs text-gray-500">
              Available vehicles
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#18181b] border-none shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Categories</CardTitle>
            <Tag className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalCategories}</div>
            <p className="text-xs text-gray-500">
              Car types, fuel types, and tags
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#18181b] border-none shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Brands</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalBrands}</div>
            <p className="text-xs text-gray-500">
              Car manufacturers
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#18181b] border-none shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Featured Items</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.featuredCars + stats.featuredBrands + stats.featuredCategories}
            </div>
            <p className="text-xs text-gray-500">
              Featured content
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#18181b] border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-lg text-gray-200">Featured Cars</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">{stats.featuredCars}</div>
            <p className="text-sm text-gray-500">Cars marked as featured</p>
          </CardContent>
        </Card>

        <Card className="bg-[#18181b] border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-lg text-gray-200">Featured Brands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">{stats.featuredBrands}</div>
            <p className="text-sm text-gray-500">Brands marked as featured</p>
          </CardContent>
        </Card>

        <Card className="bg-[#18181b] border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-lg text-gray-200">Featured Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">{stats.featuredCategories}</div>
            <p className="text-sm text-gray-500">Categories marked as featured</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="bg-[#18181b] border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-lg text-gray-200">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a 
                href="/admin/cars" 
                className="p-4 rounded-lg bg-[#23232b] hover:bg-[#23232b]/80 transition-colors border border-[#23232b]"
              >
                <h3 className="font-semibold text-white">Manage Cars</h3>
                <p className="text-sm text-gray-400">Add, edit, or remove vehicles</p>
              </a>
              <a 
                href="/admin/brands" 
                className="p-4 rounded-lg bg-[#23232b] hover:bg-[#23232b]/80 transition-colors border border-[#23232b]"
              >
                <h3 className="font-semibold text-white">Manage Brands</h3>
                <p className="text-sm text-gray-400">Add, edit, or remove car brands</p>
              </a>
              <a 
                href="/admin/categories" 
                className="p-4 rounded-lg bg-[#23232b] hover:bg-[#23232b]/80 transition-colors border border-[#23232b]"
              >
                <h3 className="font-semibold text-white">Manage Categories</h3>
                <p className="text-sm text-gray-400">Add, edit, or remove categories</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
