import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '../services/apiService';
import { 
  MapPin, 
  Palette, 
  Globe, 
  Instagram, 
  Twitter, 
  Star, 
  Calendar,
  MessageCircle,
  Share2,
  Heart,
  Eye,
  ArrowLeft
} from 'lucide-react';

const PublicArtistProfile = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('gallery');
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock gallery data - in real implementation, fetch from backend
  const mockGallery = [
    {
      id: 1,
      title: "Sunset Dreams",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400",
      price: "2.5 ETH",
      likes: 124,
      views: 1250
    },
    {
      id: 2,
      title: "Urban Rhythm",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
      price: "1.8 ETH",
      likes: 89,
      views: 890
    },
    {
      id: 3,
      title: "Digital Harmony",
      image: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=400",
      price: "3.2 ETH",
      likes: 156,
      views: 1680
    },
    {
      id: 4,
      title: "Abstract Emotions",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
      price: "2.1 ETH",
      likes: 203,
      views: 2100
    }
  ];

  useEffect(() => {
    loadArtistProfile();
  }, [id]);

  const loadArtistProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from backend first
      try {
        const response = await apiService.profiles.getProfile(id);
        if (response.success) {
          setArtist(response.data);
          return;
        }
      } catch (err) {
        console.log('Backend fetch failed, using mock data');
      }
      
      // Fallback to mock data for demonstration
      const mockArtist = {
        id: id,
        displayName: "Maya Chen",
        username: "maya_digital_art",
        bio: "Digital artist exploring the intersection of technology and human emotion. My work focuses on creating immersive experiences that challenge perceptions of reality and digital consciousness. Based in San Francisco, I've been creating digital art for over 8 years.",
        location: "San Francisco, CA",
        craft: "Digital Art & NFTs",
        website: "https://mayachen.art",
        instagram: "@maya_digital_art",
        twitter: "@mayachenart",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200",
        verificationLevel: "verified",
        followers: 12847,
        following: 234,
        artworks: 89,
        totalSales: "45.7 ETH",
        joinedDate: "March 2022",
        isArtist: true
      };
      
      setArtist(mockArtist);
      
    } catch (err) {
      setError('Failed to load artist profile');
      console.error('Error loading artist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookArtist = () => {
    if (window.showNotification) {
      window.showNotification('Booking request sent! The artist will contact you soon.', 'success');
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    if (window.showNotification) {
      window.showNotification(
        isFollowing ? 'Unfollowed artist' : 'Following artist!', 
        'success'
      );
    }
  };

  const getVerificationBadge = (level) => {
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      verified: { color: 'bg-green-100 text-green-800', text: 'Verified' },
      featured: { color: 'bg-purple-100 text-purple-800', text: 'Featured' }
    };
    return badges[level] || badges.pending;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading artist profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadArtistProfile}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Artist Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-4xl font-bold overflow-hidden flex-shrink-0">
              {artist?.avatar ? (
                <img src={artist.avatar} alt={artist.displayName} className="w-full h-full object-cover" />
              ) : (
                (artist?.displayName || 'A').charAt(0).toUpperCase()
              )}
            </div>

            {/* Artist Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{artist?.displayName}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getVerificationBadge(artist?.verificationLevel).color}`}>
                  {getVerificationBadge(artist?.verificationLevel).text}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">@{artist?.username}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{artist?.followers?.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{artist?.artworks}</div>
                  <div className="text-sm text-gray-600">Artworks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{artist?.totalSales}</div>
                  <div className="text-sm text-gray-600">Total Sales</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">4.9</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{artist?.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Palette className="w-4 h-4" />
                  <span>{artist?.craft}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {artist?.joinedDate}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleBookArtist}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Book Me
                </button>
                <button
                  onClick={handleFollow}
                  className={`px-6 py-3 rounded-lg transition-colors font-medium ${
                    isFollowing 
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                      : 'bg-pink-600 text-white hover:bg-pink-700'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
                <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <MessageCircle className="w-4 h-4 inline mr-2" />
                  Message
                </button>
                <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Share2 className="w-4 h-4 inline mr-2" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
          <p className="text-gray-600 leading-relaxed">{artist?.bio}</p>
          
          {/* Social Links */}
          <div className="flex items-center space-x-6 mt-6">
            {artist?.website && (
              <a href={artist.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-purple-600">
                <Globe className="w-5 h-5 mr-2" />
                Website
              </a>
            )}
            {artist?.instagram && (
              <a href={`https://instagram.com/${artist.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-pink-600">
                <Instagram className="w-5 h-5 mr-2" />
                Instagram
              </a>
            )}
            {artist?.twitter && (
              <a href={`https://twitter.com/${artist.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-blue-600">
                <Twitter className="w-5 h-5 mr-2" />
                Twitter
              </a>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {['gallery', 'reviews', 'about'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-medium capitalize ${
                    activeTab === tab
                      ? 'border-b-2 border-purple-600 text-purple-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'gallery' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockGallery.map((artwork) => (
                  <div key={artwork.id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <img 
                      src={artwork.image} 
                      alt={artwork.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{artwork.title}</h3>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="font-medium text-purple-600">{artwork.price}</span>
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {artwork.likes}
                          </span>
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {artwork.views}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Excellent Reviews</h3>
                  <p className="text-gray-600">This artist has received outstanding feedback from clients.</p>
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Digital Art', 'NFTs', 'Abstract', 'Portraits', 'Landscapes'].map((specialty) => (
                      <span key={specialty} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Experience</h3>
                  <p className="text-gray-600">8+ years of professional digital art creation</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicArtistProfile;

