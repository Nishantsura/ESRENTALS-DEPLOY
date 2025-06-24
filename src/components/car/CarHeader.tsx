'use client'

import { ArrowLeft, Calendar, MapPin } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CarBrandLogo } from './CarBrandLogo'
import { useCarHire } from '@/contexts/CarHireContext'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useRef } from 'react';
import { setHours, setMinutes } from 'date-fns';

interface CarHeaderProps {
  previousPage: string
  selectedDate: string
  endDate: string
  title: string
  brand: string
  setSelectedDate: (date: string) => void
  setEndDate: (date: string) => void
}

export function CarHeader({
  previousPage,
  selectedDate,
  endDate,
  title,
  brand,
  setSelectedDate,
  setEndDate
}: CarHeaderProps) {
  // Get pickup location from context
  const { pickupLocation } = useCarHire()
  
  // Use the location from context or default to Dubai
  const location = pickupLocation || 'Dubai'
  
  // Convert string dates to Date objects for react-datepicker
  const selectedDateObj = selectedDate ? new Date(selectedDate) : null;
  const endDateObj = endDate ? new Date(endDate) : null;
  const minPickupDate = new Date();
  minPickupDate.setHours(0,0,0,0);
  const minReturnDate = selectedDateObj || minPickupDate;
  // Refs for focusing
  const pickupRef = useRef(null);
  const returnRef = useRef(null);
  
  return (
    <div className="sticky top-0 z-20 bg-zinc-900/95 dark:bg-black/90 backdrop-blur-2xl px-4 sm:px-6 lg:px-8 border-b border-zinc-800/30 dark:border-white/10">
      <div className="flex items-center justify-between h-12 px-4 pt-2 max-w-7xl mx-auto">
        <div className="flex items-center">
          <Link href={previousPage === 'search' ? '/search' : '/'} className="mr-4">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-zinc-800/50">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <CarBrandLogo brand={brand} />
        </div>
        <div className="flex">
          <div className="flex items-center gap-1 bg-zinc-800/50 px-3 py-1 rounded-full">
            <MapPin className="h-4 w-4 text-teal-400" />
            <span className="text-sm font-medium text-white">{location}</span>
          </div>
        </div>
      </div>
      <div className="px-4 py-2 flex flex-row gap-4">
        <div className="relative flex-1">
          <DatePicker
            selected={selectedDateObj}
            onChange={(date: Date | null) => {
              if (date) {
                setSelectedDate(date.toISOString().split('T')[0]);
                if (!endDateObj || endDateObj <= date) {
                  setEndDate(date.toISOString().split('T')[0]);
                }
              } else {
                setSelectedDate('');
              }
            }}
            minDate={minPickupDate}
            customInput={
              <div
                className="px-4 py-3 flex items-center justify-between border rounded-xl bg-zinc-800/60 border-zinc-700/50 hover:bg-zinc-700/40 transition-colors duration-200 h-12 md:h-16 cursor-pointer"
                tabIndex={0}
                ref={pickupRef}
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-teal-400" />
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-400">Pickup Date</span>
                    <span className="text-sm font-medium text-white">
                      {selectedDateObj ? selectedDateObj.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      }) : 'Select date'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="p-1 rounded-full bg-zinc-700/50 hover:bg-zinc-700 transition-colors"
                  aria-label="Open date picker"
                  tabIndex={-1}
                >
                  <Calendar className="h-4 w-4 text-white" />
                </button>
              </div>
            }
            calendarClassName="react-datepicker-dark"
            popperPlacement="bottom-start"
            wrapperClassName="w-full"
          />
        </div>
        <div className="relative flex-1">
          <DatePicker
            selected={endDateObj}
            onChange={(date: Date | null) => setEndDate(date ? date.toISOString().split('T')[0] : '')}
            minDate={minReturnDate}
            customInput={
              <div
                className="px-4 py-3 flex items-center justify-between border rounded-xl bg-zinc-800/60 border-zinc-700/50 hover:bg-zinc-700/40 transition-colors duration-200 h-12 md:h-16 cursor-pointer"
                tabIndex={0}
                ref={returnRef}
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-teal-400" />
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-400">Return Date</span>
                    <span className="text-sm font-medium text-white">
                      {endDateObj ? endDateObj.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      }) : 'Select date'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="p-1 rounded-full bg-zinc-700/50 hover:bg-zinc-700 transition-colors"
                  aria-label="Open date picker"
                  tabIndex={-1}
                >
                  <Calendar className="h-4 w-4 text-white" />
                </button>
              </div>
            }
            calendarClassName="react-datepicker-dark"
            popperPlacement="bottom-start"
            wrapperClassName="w-full"
          />
        </div>
      </div>
    </div>
  )
}
