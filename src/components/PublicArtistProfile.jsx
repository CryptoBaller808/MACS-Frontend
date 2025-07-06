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
  UserPlus,
  Star,
  Eye,
  Clock,
  DollarSign,
  Calendar,
  CheckCircle,
  Tag,
  Award,
  Briefcase,
  Mail,
  Phone,
  ExternalLink
} from 'lucide-react';
import BookingForm from './BookingForm';
import MediaGallery from './MediaGallery';

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
        name: 'Jelite Somari',
        username: 'jelite_somari',
        avatar: '🎨',
        verified: true,
        bio: 'Digital artist passionate about creating meaningful connections through art. Specializing in traditional ceramic art with modern interpretations. My work explores the intersection of heritage and contemporary expression.',
        location: "Côte d'Ivoire",
        website: 'https://jelitesomari.art',
        instagram: '@jelite_somari',
        twitter: '@jelite_art',
        email: 'hello@jelitesomari.art',
        phone: '+225 07 12 34 56 78',
        specialties: ['Ceramics', 'Traditional Art', 'Heritage', 'Contemporary', 'Mixed Media'],
        genres: ['Abstract', 'Cultural', 'Modern', 'Experimental'],
        tags: ['ceramic', 'traditional', 'heritage', 'contemporary', 'african_art', 'handmade', 'cultural_fusion'],
        achievements: [
          'Featured Artist at Abidjan Art Fair 2023',
          'Winner of Traditional Arts Award 2022',
          'Solo Exhibition at Gallery Moderne 2023'
        ],
        education: 'Master of Fine Arts, École des Beaux-Arts d\'Abidjan',
        experience: '8+ years in ceramic arts and cultural preservation',
        languages: ['French', 'English', 'Baoulé'],
        joinedDate: 'March 2023',
        bookingEnabled: true,
        stats: {
          followers: 12847,
          following: 234,
          artworks: 89,
          likes: 45123,
          views: 234567,
          rating: 4.9,
          responseTime: '2 hours',
          completionRate: '98%',
          hourlyRate: '$75',
          totalProjects: 156,
          repeatClients: '85%'
        }
      });
      setLoading(false);
    }, 1000);
  }, [username]);

  const artworks = [
    {
      id: 1,
      title: "Hnak in qir's Cilier Sonwar",
      image: '/api/placeholder/300/300',
      likes: 253,
      views: 21020,
      price: null,
      status: 'sold'
    },
    {
      id: 2,
      title: 'Traditional Patterns',
      image: '/api/placeholder/300/300',
      likes: 189,
      views: 15430,
      price: 45,
      status: 'available'
    },
    {
      id: 3,
      title: 'Heritage Collection',
      image: '/api/placeholder/300/300',
      likes: 167,
      views: 12890,
      price: 67,
      status: 'available'
    },
    {
      id: 4,
      title: 'Modern Ceramics',
      image: '/api/placeholder/300/300',
      likes: 234,
      views: 18760,
      price: null,
      status: 'not_for_sale'
    },
    {
      id: 5,
      title: 'Cultural Fusion',
      image: '/api/placeholder/300/300',
      likes: 198,
      views: 14320,
      price: 89,
      status: 'available'
    },
    {
      id: 6,
      title: 'Ancient Techniques',
      image: '/api/placeholder/300/300',
      likes: 276,
      views: 22150,
      price: 120,
      status: 'available'
    }
  ];

  const reviews = [
    {
      id: 1,
      reviewer: 'Sarah Chen',
      avatar: '👩‍🎨',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Absolutely stunning work! The attention to detail in the ceramic pieces is incredible. Highly recommend!'
    },
    {
      id: 2,
      reviewer: 'Marcus Johnson',
      avatar: '👨‍💼',
      rating: 5,
      date: '1 month ago',
      comment: 'Professional, timely, and exceeded expectations. The artwork arrived perfectly packaged.'
    },
    {
      id: 3,
      reviewer: 'Elena Rodriguez',
      avatar: '🎭',
      rating: 4,
      date: '2 months ago',
      comment: 'Beautiful traditional techniques with a modern twist. Great communication throughout the process.'
    }
  ];

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-macs-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-macs-blue-600 mx-auto mb-4"></div>
          <p className="text-macs-gray-600">Loading artist profile...</p>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-macs-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-h2 text-macs-gray-900 mb-4">Artist Not Found</h1>
          <p className="text-macs-gray-600 mb-8">The artist profile you're looking for doesn't exist.</p>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-macs-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-macs-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-macs-blue-100 rounded-full flex items-center justify-center text-6xl">
                {artist.avatar}
              </div>
              {artist.verified && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              )}
            </div>

            {/* Artist Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-h2 text-macs-gray-900 mb-2">{artist.name}</h1>
                  <p className="text-macs-gray-600 mb-2">@{artist.username}</p>
                  <div className="flex items-center space-x-4 text-sm text-macs-gray-600 mb-4">
                    <span className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{artist.location}</span>
                    </span>
                    <span>Joined {artist.joinedDate}</span>
                  </div>
                  <p className="text-macs-gray-700 max-w-2xl">{artist.bio}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                  {artist.bookingEnabled && (
                    <button
                      onClick={() => setShowBookingForm(true)}
                      className="btn-primary"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Me
                    </button>
                  )}
                  <button
                    onClick={toggleFollow}
                    className={`btn-secondary ${isFollowing ? 'bg-macs-gray-600' : ''}`}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button className="btn-outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </button>
                  <button className="btn-ghost">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mt-8">
            <div className="card-macs p-4 text-center">
              <p className="text-lg font-bold text-macs-blue-600">{formatNumber(artist.stats.followers)}</p>
              <p className="text-xs text-macs-gray-600">Followers</p>
            </div>
            <div className="card-macs p-4 text-center">
              <p className="text-lg font-bold text-macs-blue-600">{formatNumber(artist.stats.likes)}</p>
              <p className="text-xs text-macs-gray-600">Likes</p>
            </div>
            <div className="card-macs p-4 text-center">
              <p className="text-lg font-bold text-macs-blue-600">{artist.stats.artworks}</p>
              <p className="text-xs text-macs-gray-600">Artworks</p>
            </div>
            <div className="card-macs p-4 text-center">
              <p className="text-lg font-bold text-macs-blue-600">{formatNumber(artist.stats.views)}</p>
              <p className="text-xs text-macs-gray-600">Views</p>
            </div>
            <div className="card-macs p-4 text-center">
              <p className="text-lg font-bold text-macs-amber-600">{artist.stats.rating}</p>
              <p className="text-xs text-macs-gray-600">Rating</p>
            </div>
            <div className="card-macs p-4 text-center">
              <p className="text-lg font-bold text-macs-amber-600">{artist.stats.hourlyRate}</p>
              <p className="text-xs text-macs-gray-600">Hourly Rate</p>
            </div>
            <div className="card-macs p-4 text-center">
              <p className="text-lg font-bold text-green-600">{artist.stats.responseTime}</p>
              <p className="text-xs text-macs-gray-600">Response</p>
            </div>
            <div className="card-macs p-4 text-center">
              <p className="text-lg font-bold text-green-600">{artist.stats.completionRate}</p>
              <p className="text-xs text-macs-gray-600">Completion</p>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              {artist.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-macs-blue-50 text-macs-blue-600 hover:bg-macs-blue-100 transition-colors cursor-pointer"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4 mt-6">
            {artist.website && (
              <a href={artist.website} target="_blank" rel="noopener noreferrer" className="text-macs-blue-600 hover:text-macs-blue-700">
                <Globe className="h-5 w-5" />
              </a>
            )}
            {artist.instagram && (
              <a href={`https://instagram.com/${artist.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-macs-blue-600 hover:text-macs-blue-700">
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {artist.twitter && (
              <a href={`https://twitter.com/${artist.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-macs-blue-600 hover:text-macs-blue-700">
                <Twitter className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-macs-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            {['gallery', 'reviews', 'about'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-macs-blue-600 text-macs-blue-600'
                    : 'border-transparent text-macs-gray-500 hover:text-macs-gray-700 hover:border-macs-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'gallery' && (
          <MediaGallery artistId={artist.id} isOwner={false} />
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="card-macs p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-h4 text-macs-gray-900">Client Reviews</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-macs-gray-900">{artist.stats.rating}</span>
                  <span className="text-sm text-macs-gray-600">({reviews.length} reviews)</span>
                </div>
              </div>
              
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-macs-gray-100 pb-6 last:border-b-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-macs-blue-100 rounded-full flex items-center justify-center text-xl">
                        {review.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-macs-gray-900">{review.reviewer}</h4>
                          <span className="text-sm text-macs-gray-500">{review.date}</span>
                        </div>
                        <div className="flex items-center mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-4 w-4 ${
                                star <= review.rating 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-macs-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                        <p className="text-macs-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Artist Information */}
            <div className="space-y-6">
              <div className="card-macs p-6">
                <h3 className="text-h4 text-macs-gray-900 mb-4">About the Artist</h3>
                <p className="text-macs-gray-700 mb-6">{artist.bio}</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-macs-gray-900 mb-2 flex items-center">
                      <Tag className="h-4 w-4 mr-2" />
                      Specialties
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {artist.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="px-3 py-1 bg-macs-blue-50 text-macs-blue-600 text-sm rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-macs-gray-900 mb-2 flex items-center">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Genres
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {artist.genres.map((genre) => (
                        <span
                          key={genre}
                          className="px-3 py-1 bg-macs-amber-50 text-macs-amber-600 text-sm rounded-full"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-macs-gray-900 mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Location
                    </h4>
                    <p className="text-macs-gray-700">{artist.location}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-macs-gray-900 mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Member Since
                    </h4>
                    <p className="text-macs-gray-700">{artist.joinedDate}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-macs-gray-900 mb-2">Education</h4>
                    <p className="text-macs-gray-700">{artist.education}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-macs-gray-900 mb-2">Experience</h4>
                    <p className="text-macs-gray-700">{artist.experience}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-macs-gray-900 mb-2">Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {artist.languages.map((language) => (
                        <span
                          key={language}
                          className="px-3 py-1 bg-green-50 text-green-600 text-sm rounded-full"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="card-macs p-6">
                <h3 className="text-h4 text-macs-gray-900 mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Achievements & Recognition
                </h3>
                <div className="space-y-3">
                  {artist.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-macs-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-macs-gray-700">{achievement}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-6">
              <div className="card-macs p-6">
                <h3 className="text-h4 text-macs-gray-900 mb-4">Work With Me</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-macs-gray-700">Hourly Rate</span>
                    <span className="font-semibold text-macs-amber-600">{artist.stats.hourlyRate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-macs-gray-700">Response Time</span>
                    <span className="font-semibold text-green-600">{artist.stats.responseTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-macs-gray-700">Completion Rate</span>
                    <span className="font-semibold text-green-600">{artist.stats.completionRate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-macs-gray-700">Client Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-semibold text-macs-gray-900">{artist.stats.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-macs-gray-700">Total Projects</span>
                    <span className="font-semibold text-macs-blue-600">{artist.stats.totalProjects}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-macs-gray-700">Repeat Clients</span>
                    <span className="font-semibold text-macs-blue-600">{artist.stats.repeatClients}</span>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <button className="w-full btn-primary">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Message
                  </button>
                  <button className="w-full btn-secondary">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Request Quote
                  </button>
                </div>
              </div>

              {/* Contact Information */}
              <div className="card-macs p-6">
                <h3 className="text-h4 text-macs-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  {artist.email && (
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-macs-gray-400" />
                      <a 
                        href={`mailto:${artist.email}`}
                        className="text-macs-blue-600 hover:text-macs-blue-700 transition-colors"
                      >
                        {artist.email}
                      </a>
                    </div>
                  )}
                  {artist.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-macs-gray-400" />
                      <a 
                        href={`tel:${artist.phone}`}
                        className="text-macs-blue-600 hover:text-macs-blue-700 transition-colors"
                      >
                        {artist.phone}
                      </a>
                    </div>
                  )}
                  {artist.website && (
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-macs-gray-400" />
                      <a 
                        href={artist.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-macs-blue-600 hover:text-macs-blue-700 transition-colors flex items-center"
                      >
                        {artist.website.replace('https://', '')}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  )}
                  {artist.instagram && (
                    <div className="flex items-center space-x-3">
                      <Instagram className="h-5 w-5 text-macs-gray-400" />
                      <a 
                        href={`https://instagram.com/${artist.instagram.replace('@', '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-macs-blue-600 hover:text-macs-blue-700 transition-colors flex items-center"
                      >
                        {artist.instagram}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  )}
                  {artist.twitter && (
                    <div className="flex items-center space-x-3">
                      <Twitter className="h-5 w-5 text-macs-gray-400" />
                      <a 
                        href={`https://twitter.com/${artist.twitter.replace('@', '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-macs-blue-600 hover:text-macs-blue-700 transition-colors flex items-center"
                      >
                        {artist.twitter}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && artist && (
        <BookingForm
          artist={artist}
          onClose={() => setShowBookingForm(false)}
        />
      )}
    </div>
  );
};

export default PublicArtistProfile;

