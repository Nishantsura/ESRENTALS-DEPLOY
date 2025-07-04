'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCarHire } from '@/contexts/CarHireContext'
import { FaWhatsapp } from "react-icons/fa"

interface CarPricingProps {
  car: {
    name: string
    year: number
    transmission: string
    engineCapacity: string
    fuelType: string
    seats: number
    dailyPrice?: number
  }
  selectedDate: string
  endDate: string
}

export function CarPricing({ car, selectedDate, endDate }: CarPricingProps) {
  // We'll keep the props for backward compatibility, but also use context
  const { pickupDate, dropoffDate, pickupLocation } = useCarHire()
  
  // Use context values if props are empty
  const effectivePickupDate = selectedDate || pickupDate
  const effectiveEndDate = endDate || dropoffDate
  
  const calculateTotalPrice = () => {
    if (effectivePickupDate && effectiveEndDate && car.dailyPrice) {
      const pickupDate = new Date(effectivePickupDate);
      const returnDate = new Date(effectiveEndDate);
      const days = Math.max(1, Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)));
      return { total: car.dailyPrice * days, days };
    }
    return null;
  };

  const totalPrice = calculateTotalPrice();

  const whatsappMessage = `Hi, I'm interested in the ${car.name} (${car.year}) listed on ES Rentals.%0A%0ADetails:%0A- Transmission: ${car.transmission}%0A- Engine: ${car.engineCapacity}%0A- Fuel Type: ${car.fuelType}%0A- Seats: ${car.seats}${effectivePickupDate ? `%0A- Pickup: ${new Date(effectivePickupDate).toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}` : ''}${effectiveEndDate ? `%0A- Return: ${new Date(effectiveEndDate).toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}` : ''}${totalPrice ? `%0A- Total Price: AED ${totalPrice.total.toLocaleString()} for ${totalPrice.days} day${totalPrice.days > 1 ? 's' : ''}` : ''}%0A%0ACould you please provide more information about this vehicle?`;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-700/50 z-20 shadow-xl">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex flex-col">
          {car.dailyPrice ? (
            totalPrice ? (
              <>
                <span className="text-lg font-bold text-white">
                  <span className="text-teal-400">AED {totalPrice.total.toLocaleString()}</span> for {totalPrice.days} day{totalPrice.days > 1 ? 's' : ''}
                </span>
                <span className="text-xs font-medium text-zinc-400">
                  (AED {car.dailyPrice.toLocaleString()}/day × {totalPrice.days} day{totalPrice.days > 1 ? 's' : ''})
                </span>
              </>
            ) : (
              <>
                <span className="text-lg font-bold text-white">
                  <span className="text-teal-400">AED {car.dailyPrice.toLocaleString()}</span> <span className="text-zinc-300">/ day</span>
                </span>
                <span className="text-xs font-medium text-zinc-400">
                  Select dates to see total price
                </span>
              </>
            )
          ) : (
            <span className="text-lg font-bold text-white">Price on request</span>
          )}
        </div>
        
        <Link 
          href={`https://wa.me/971553553626?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-transform hover:scale-105"
        >
          <Button 
            className={cn(
              "bg-teal-500 hover:bg-teal-600 text-white rounded-xl px-6 py-5 font-semibold shadow-lg shadow-teal-500/20 border border-teal-400/30",
              (!effectivePickupDate || !effectiveEndDate) && "opacity-50 cursor-not-allowed bg-zinc-700 hover:bg-zinc-700 shadow-none border-zinc-600/30"
            )}
            disabled={!effectivePickupDate || !effectiveEndDate}
          >
            <FaWhatsapp className="mr-2 text-lg" /> Book Now
          </Button>
        </Link>
      </div>
    </div>
  )
}
