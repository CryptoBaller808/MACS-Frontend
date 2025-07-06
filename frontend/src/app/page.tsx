'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Hero } from '@/components/home/Hero'
import { FeaturedArtists } from '@/components/home/FeaturedArtists'
import { PlatformFeatures } from '@/components/home/PlatformFeatures'
import { CulturalZones } from '@/components/home/CulturalZones'
import { CallToAction } from '@/components/home/CallToAction'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />
      
      {/* Featured Artists */}
      <FeaturedArtists />
      
      {/* Platform Features */}
      <PlatformFeatures />
      
      {/* Cultural Heritage Zones */}
      <CulturalZones />
      
      {/* Call to Action */}
      <CallToAction />
    </div>
  )
} 