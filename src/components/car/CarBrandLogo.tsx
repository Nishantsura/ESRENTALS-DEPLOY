'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { brandAPI } from '@/services/api'
import { Brand } from '@/types/brand'

interface CarBrandLogoProps {
  brand: string
  size?: number
}

export function CarBrandLogo({ brand, size = 48 }: CarBrandLogoProps) {
  const [brandData, setBrandData] = useState<Brand | null>(null)

  useEffect(() => {
    const fetchBrandData = async () => {
      if (!brand || typeof brand !== 'string') {
        setBrandData(null);
        return;
      }
      const slug = brand.toLowerCase().replace(/\s+/g, '-')
      const data = await brandAPI.getBrandBySlug(slug)
      if (data) {
        setBrandData(data)
      } else {
        setBrandData(null)
      }
    }
    fetchBrandData()
  }, [brand])

  if (!brandData) {
    return null
  }

  return (
    <div className="flex items-center justify-center rounded-full bg-card" style={{ width: size, height: size }}>
      <Image
        src={brandData.logo}
        alt={`${brandData.name} logo`}
        width={size}
        height={size}
        className="object-cover"
      />
    </div>
  )
}
