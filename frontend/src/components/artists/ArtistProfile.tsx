'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Artist } from '@/types'
import { Button } from '@/components/ui/Button'
import { MediaGallery } from '@/components/artists/MediaGallery'
import { BookingCard } from '@/components/artists/BookingCard'
import { CrowdfundingCard } from '@/components/artists/CrowdfundingCard'
import { ReviewsSection } from '@/components/artists/ReviewsSection'
import { CollaborationCard } from '@/components/artists/CollaborationCard'
import { ArtistPassport } from '@/components/artists/ArtistPassport'

interface ArtistProfileProps {
  artist: Artist
}

export function ArtistProfile({ artist }: ArtistProfileProps) {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'booking' | 'crowdfunding' | 'reviews' | 'collaboration'>('portfolio')

  const tabs = [
    { id: 'portfolio', label: 'Portfolio', icon: '🎨' },
    { id: 'booking', label: 'Book Now', icon: '📅' },
    { id: 'crowdfunding', label: 'Support', icon: '💝' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' },
    { id: 'collaboration', label: 'Collaborate', icon: '🤝' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Profile Image */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={artist.profilePicture || '/default-avatar.png'}
                    alt={artist.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                {artist.reputation.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </motion.div>

              {/* Artist Info */}
              <div className="flex-1 text-center md:text-left">
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                >
                  {artist.username}
                </motion.h1>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-wrap justify-center md:justify-start gap-2 mb-4"
                >
                  {artist.craftCategories.map((category) => (
                    <span
                      key={category.id}
                      className="px-3 py-1 bg-white/20 text-white rounded-full text-sm"
                    >
                      {category.icon} {category.name}
                    </span>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-center justify-center md:justify-start gap-4 text-white/90"
                >
                  <span>📍 {artist.location.city}, {artist.location.country}</span>
                  <span>⭐ {artist.reputation.rating} ({artist.reputation.reviewCount} reviews)</span>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-col gap-3"
              >
                <Button variant="primary" size="lg">
                  Book Now
                </Button>
                <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-purple-600">
                  Follow
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About {artist.username}</h2>
            <p className="text-gray-600 text-lg leading-relaxed">{artist.bio}</p>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 whitespace-nowrap border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'portfolio' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <MediaGallery artistId={artist.id} />
                </div>
                <div>
                  <ArtistPassport artist={artist} />
                </div>
              </div>
            )}
            
            {activeTab === 'booking' && (
              <BookingCard artist={artist} />
            )}
            
            {activeTab === 'crowdfunding' && (
              <CrowdfundingCard artistId={artist.id} />
            )}
            
            {activeTab === 'reviews' && (
              <ReviewsSection artistId={artist.id} />
            )}
            
            {activeTab === 'collaboration' && (
              <CollaborationCard artist={artist} />
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
} 