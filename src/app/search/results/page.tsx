'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Star, Users, Fuel } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { TiltedCarCard } from '@/components/car/TiltedCarCard';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SearchResultsSkeleton } from '@/components/ui/card-skeleton';
import { Car } from '@/types/car'
import { carsIndex } from '@/lib/algolia'
import { carAPI } from '@/services/api'
import { SearchBar } from '@/app/home/components/SearchBar'

// Define the Algolia hit type that extends the base hit type with our Car properties
interface AlgoliaHit extends Omit<Car, 'id'> {
  objectID: string;
  _highlightResult?: Record<string, any>;
  _snippetResult?: Record<string, any>;
  _rankingInfo?: Record<string, any>;
  _distinctSeqID?: number;
}

export default function SearchResultsPage() {
  return (
    <div className="min-h-screen bg-transparent ">
      {/* Header now rendered globally in RootLayout */}
      <SearchBar />
      <Suspense fallback={<SearchResultsSkeleton />}>
        <SearchResults />
      </Suspense>
    </div>
  )
}

function SearchResults() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams?.get('q') || ''
  const [results, setResults] = useState<Car[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const searchCars = async () => {
      if (!query.trim()) {
        setResults([])
        setIsLoading(false)
        return
      }

      try {
        const { hits } = await carsIndex.search<AlgoliaHit>(query, {
          // Remove restriction to search across all attributes
        })
        console.log('Search hits:', hits); // Debug log

        // Fetch additional data from Supabase API for each hit
        const enrichedResults = await Promise.all(
          hits.map(async (hit) => {
            try {
              // Get the full document from Supabase API
              const carData = await carAPI.getCarById(hit.objectID);
              
              if (carData) {
                // Merge Algolia and Supabase data, preferring Supabase data
                return {
                  ...hit,
                  ...carData,
                  id: hit.objectID, // Ensure we keep the correct ID
                  // Ensure critical fields are properly typed
                  seats: Number(carData.seats || hit.seats) || 0,
                  year: Number(carData.year || hit.year) || 0,
                  rating: Number(carData.rating || hit.rating) || 0,
                  dailyPrice: Number(carData.dailyPrice || hit.dailyPrice) || 0,
                  advancePayment: Boolean(carData.advancePayment ?? hit.advancePayment),
                  rareCar: Boolean(carData.rareCar ?? hit.rareCar),
                  featured: Boolean(carData.featured ?? hit.featured),
                  available: Boolean(carData.available ?? hit.available),
                  images: Array.isArray(carData.images) ? carData.images : (Array.isArray(hit.images) ? hit.images : []),
                  tags: Array.isArray(carData.tags) ? carData.tags : (Array.isArray(hit.tags) ? hit.tags : []),
                } as Car;
              }
            } catch (error) {
              console.error(`Error fetching Supabase data for car ${hit.objectID}:`, error);
            }
            
            // Fallback to Algolia data if Supabase fetch fails
            return {
              id: hit.objectID,
              name: hit.name || '',
              brand: hit.brand || '',
              transmission: hit.transmission || 'automatic',
              seats: Number(hit.seats) || 0,
              year: Number(hit.year) || 0,
              rating: Number(hit.rating) || 0,
              advancePayment: Boolean(hit.advancePayment),
              rareCar: Boolean(hit.rareCar),
              featured: Boolean(hit.featured),
              fuelType: hit.fuelType || 'petrol',
              engineCapacity: hit.engineCapacity || '',
              power: hit.power || '',
              dailyPrice: typeof hit.dailyPrice === 'number' ? hit.dailyPrice : 0,
              type: hit.type || 'sedan',
              tags: Array.isArray(hit.tags) ? hit.tags : [],
              description: hit.description || '',
              images: Array.isArray(hit.images) ? hit.images : [],
              available: Boolean(hit.available),
              location: hit.location || { name: 'Dubai', coordinates: { lat: 25.2048, lng: 55.2708 } }
            } as Car;
          })
        );

        setResults(enrichedResults);
      } catch (error) {
        console.error('Error searching cars:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    searchCars()
  }, [query])

  if (isLoading) {
    return <SearchResultsSkeleton />
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center space-x-4 mb-6">
        <h1 className="text-lg font-medium">
          {results.length > 0 ? (
            <>Search Results for "{query}"</>
          ) : (
            <>No Results Found for "{query}"</>
          )}
        </h1>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((car) => {
            return (
              <TiltedCarCard
                key={car.id}
                car={car}
                linkHref={`/car/${car.id}`}
                className="h-full"
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            No cars found matching your search criteria.
          </p>
          <Button
            onClick={() => router.push('/')}
            className="mt-4"
          >
            Return to Home
          </Button>
        </div>
      )}
    </div>
  )
}
