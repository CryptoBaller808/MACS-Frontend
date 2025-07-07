import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Globe, 
  Instagram, 
  Twitter, 
  Heart, 
  MessageCircle, 
  Share, 
  Bookmark,
  Calendar,
  Clock,
  Star,
  Award,
  Users,
  Eye,
  DollarSign,
  CheckCircle,
  UserPlus,
  Briefcase,
  Mail,
  Phone,
  ExternalLink
} from 'lucide-react';
import MediaGallery from './MediaGallery';
import BookingFlow from './BookingFlow';

const PublicArtistProfile = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState('gallery');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock artist data - in real app, this would come from API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
        setArtist({
        id: 1,
        name: 'Keoni Nakamura',
        username: 'keoni-nakamura',
        avatar: '🎨',
        verified: true,
        bookingEnabled: true,
        bio: 'Traditional ceramic artist passionate about creating meaningful connections through art. Specializing in traditional ceramic art with modern interpretations. My work explores the intersection of heritage and contemporary expression.',
        location: "Honolulu, Hawaii",
        website: 'https://keoninakamura.art',
        social: {
          instagram: '@keoninakamura',
          twitter: '@keoninakamura'
        },
        stats: {
          followers: 12500,
          following: 890,
          artworks: 156,
          views: 45600,
          sales: 89,
          rating: 4.9,
          reviews: 127
        },
        pricing: {
          hourlyRate: 150,
          currency: 'MACS'
        },
        specialties: ['Ceramics', 'Traditional Art', 'Pottery', 'Sculpture'],
        experience: '8+ years',
        responseTime: 'Usually responds within 2 hours',
        languages: ['English', 'Hawaiian', 'Japanese'],
        education: [
          'MFA in Ceramics - University of Hawaii',
          'Traditional Pottery Apprenticeship - Kyoto, Japan'
        ],
        achievements: [
          'Featured Artist - Honolulu Museum of Art 2023',
          'Best Traditional Art - Pacific Arts Festival 2022',
          'Rising Artist Award - Hawaii Arts Council 2021'
        ]
      });
      setLoading(false);
    }, 1000);
  }, [username]);

  const handleBookingSuccess = () => {
    setShowBookingForm(false);
    // Could show a success toast here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-macs-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-macs-blue-600 mx-auto mb-4"></div>
          <p className="text-macs-gray-600 font-gliker">Loading artist profile...</p>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-gradient-macs-subtle flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-macs-gray-900 mb-2 font-gliker">Artist Not Found</h2>
          <p className="text-macs-gray-600 mb-4 font-gliker">The artist profile you're looking for doesn't exist.</p>
          <Link to="/" className="btn-primary font-gliker">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-macs-subtle">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-macs-blue-600 via-macs-amber-500 to-macs-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-6xl shadow-macs-lg">
                {artist.avatar}
              </div>
              {artist.verified && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            {/* Artist Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2 font-gliker">{artist.name}</h1>
                  <p className="text-xl opacity-90 mb-4 font-gliker">{artist.bio}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm opacity-90">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="font-gliker">{artist.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      <span className="font-gliker">{artist.stats.rating} ({artist.stats.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="font-gliker">{artist.responseTime}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-0">
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 font-gliker ${
                      isFollowing
                        ? 'bg-white text-macs-blue-600 hover:bg-macs-gray-100'
                        : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                    }`}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  
                  {artist.bookingEnabled && (
                    <button
                      onClick={() => setShowBookingForm(true)}
                      className="bg-macs-amber-500 hover:bg-macs-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center font-gliker"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Session
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-8 pt-8 border-t border-white border-opacity-20">
            <div className="text-center">
              <div className="text-2xl font-bold font-gliker">{artist.stats.followers.toLocaleString()}</div>
              <div className="text-sm opacity-80 font-gliker">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-gliker">{artist.stats.artworks}</div>
              <div className="text-sm opacity-80 font-gliker">Artworks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-gliker">{artist.stats.views.toLocaleString()}</div>
              <div className="text-sm opacity-80 font-gliker">Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-gliker">{artist.stats.sales}</div>
              <div className="text-sm opacity-80 font-gliker">Sales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-gliker">{artist.pricing.hourlyRate} {artist.pricing.currency}</div>
              <div className="text-sm opacity-80 font-gliker">Starting Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-gliker">{artist.experience}</div>
              <div className="text-sm opacity-80 font-gliker">Experience</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-macs-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'gallery', label: 'Gallery', icon: Eye },
              { id: 'about', label: 'About', icon: Users },
              { id: 'reviews', label: 'Reviews', icon: Star },
              { id: 'contact', label: 'Contact', icon: Mail }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm transition-colors duration-200 font-gliker ${
                    activeTab === tab.id
                      ? 'border-macs-blue-600 text-macs-blue-600'
                      : 'border-transparent text-macs-gray-500 hover:text-macs-gray-700 hover:border-macs-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'gallery' && (
          <div className="animate-fade-in">
            <MediaGallery artistId={artist.id} />
          </div>
        )}

        {activeTab === 'about' && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Bio */}
                <div className="card-macs p-6">
                  <h3 className="text-xl font-semibold text-macs-gray-900 mb-4 font-gliker">About {artist.name}</h3>
                  <p className="text-macs-gray-600 leading-relaxed font-gliker">
                    {artist.bio}
                  </p>
                </div>

                {/* Specialties */}
                <div className="card-macs p-6">
                  <h3 className="text-xl font-semibold text-macs-gray-900 mb-4 font-gliker">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {artist.specialties.map(specialty => (
                      <span
                        key={specialty}
                        className="px-3 py-1 bg-macs-blue-100 text-macs-blue-800 rounded-full text-sm font-medium font-gliker"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="card-macs p-6">
                  <h3 className="text-xl font-semibold text-macs-gray-900 mb-4 font-gliker">Education</h3>
                  <ul className="space-y-2">
                    {artist.education.map((edu, index) => (
                      <li key={index} className="flex items-start">
                        <Award className="w-5 h-5 text-macs-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-macs-gray-600 font-gliker">{edu}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Achievements */}
                <div className="card-macs p-6">
                  <h3 className="text-xl font-semibold text-macs-gray-900 mb-4 font-gliker">Achievements</h3>
                  <ul className="space-y-2">
                    {artist.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start">
                        <Star className="w-5 h-5 text-macs-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-macs-gray-600 font-gliker">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Info */}
                <div className="card-macs p-6">
                  <h3 className="text-lg font-semibold text-macs-gray-900 mb-4 font-gliker">Quick Info</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-macs-gray-400 mr-3" />
                      <span className="text-macs-gray-600 font-gliker">{artist.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-macs-gray-400 mr-3" />
                      <span className="text-macs-gray-600 font-gliker">{artist.responseTime}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-macs-gray-400 mr-3" />
                      <span className="text-macs-gray-600 font-gliker">
                        From {artist.pricing.hourlyRate} {artist.pricing.currency}/hour
                      </span>
                    </div>
                  </div>
                </div>

                {/* Languages */}
                <div className="card-macs p-6">
                  <h3 className="text-lg font-semibold text-macs-gray-900 mb-4 font-gliker">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {artist.languages.map(language => (
                      <span
                        key={language}
                        className="px-2 py-1 bg-macs-gray-100 text-macs-gray-700 rounded text-sm font-gliker"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="card-macs p-6">
                  <h3 className="text-lg font-semibold text-macs-gray-900 mb-4 font-gliker">Connect</h3>
                  <div className="space-y-3">
                    <a
                      href={artist.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-macs-blue-600 hover:text-macs-blue-700 transition-colors font-gliker"
                    >
                      <Globe className="w-4 h-4 mr-3" />
                      Website
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                    <a
                      href={`https://instagram.com/${artist.social.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-macs-blue-600 hover:text-macs-blue-700 transition-colors font-gliker"
                    >
                      <Instagram className="w-4 h-4 mr-3" />
                      {artist.social.instagram}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                    <a
                      href={`https://twitter.com/${artist.social.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-macs-blue-600 hover:text-macs-blue-700 transition-colors font-gliker"
                    >
                      <Twitter className="w-4 h-4 mr-3" />
                      {artist.social.twitter}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>

                {/* Book Session CTA */}
                {artist.bookingEnabled && (
                  <div className="card-macs p-6 bg-gradient-to-r from-macs-blue-50 to-macs-amber-50 border-macs-blue-200">
                    <h3 className="text-lg font-semibold text-macs-gray-900 mb-2 font-gliker">Ready to collaborate?</h3>
                    <p className="text-macs-gray-600 mb-4 text-sm font-gliker">
                      Book a session with {artist.name} to bring your creative vision to life.
                    </p>
                    <button
                      onClick={() => setShowBookingForm(true)}
                      className="w-full btn-primary font-gliker"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Session
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="animate-fade-in">
            <div className="card-macs p-8 text-center">
              <Star className="w-12 h-12 text-macs-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-macs-gray-900 mb-2 font-gliker">Reviews Coming Soon</h3>
              <p className="text-macs-gray-600 font-gliker">
                Artist reviews and ratings will be available in the next update.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <div className="card-macs p-8">
                <h3 className="text-2xl font-semibold text-macs-gray-900 mb-6 font-gliker">Get in Touch</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center p-4 bg-macs-blue-50 rounded-lg">
                    <Mail className="w-6 h-6 text-macs-blue-600 mr-4" />
                    <div>
                      <h4 className="font-medium text-macs-gray-900 font-gliker">Email</h4>
                      <p className="text-macs-gray-600 font-gliker">keoni.nakamura@email.com</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-macs-amber-50 rounded-lg">
                    <Phone className="w-6 h-6 text-macs-amber-600 mr-4" />
                    <div>
                      <h4 className="font-medium text-macs-gray-900 font-gliker">Phone</h4>
                      <p className="text-macs-gray-600 font-gliker">+1 (808) 555-0123</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-macs-orange-50 rounded-lg">
                    <Calendar className="w-6 h-6 text-macs-orange-600 mr-4" />
                    <div>
                      <h4 className="font-medium text-macs-gray-900 font-gliker">Booking</h4>
                      <p className="text-macs-gray-600 mb-2 font-gliker">Schedule a session directly through our platform</p>
                      <button
                        onClick={() => setShowBookingForm(true)}
                        className="btn-primary text-sm font-gliker"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Booking Flow Modal */}
      {showBookingForm && (
        <BookingFlow
          artistId={artist.id}
          artistName={artist.name}
          onClose={() => setShowBookingForm(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default PublicArtistProfile;

