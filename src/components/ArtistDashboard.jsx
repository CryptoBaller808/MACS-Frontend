import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Settings, 
  BarChart3, 
  MessageCircle, 
  Bell, 
  Upload,
  Eye,
  Heart,
  Users,
  TrendingUp,
  Edit,
  Camera,
  Calendar,
  Clock,
  DollarSign,
  Image,
  Video
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AvatarUpload from './AvatarUpload';
import CalendarComponent from './Calendar';
import BookingManager from './BookingManager';
import NotificationSystem from './NotificationSystem';
import MediaGallery from './MediaGallery';

const ArtistDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profile, setProfile] = useState({
    name: user?.name || 'Artist Name',
    username: user?.username || 'artist_username',
    bio: 'Digital artist passionate about creating meaningful connections through art.',
    location: 'New York, USA',
    website: 'https://artistportfolio.com',
    instagram: '@artist_username',
    twitter: '@artist_username',
    specialties: ['Digital Art', 'Illustration', 'Concept Art'],
    avatar: null,
    verified: false
  });
  const [isEditing, setIsEditing] = useState(false);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'gallery', label: 'Media Gallery', icon: Image },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'bookings', label: 'Bookings', icon: Clock },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const stats = [
    { label: 'Profile Views', value: '12,847', change: '+12%', icon: Eye, color: 'text-macs-blue-600' },
    { label: 'Total Bookings', value: '47', change: '+23%', icon: Calendar, color: 'text-macs-amber-600' },
    { label: 'Monthly Revenue', value: '$2,450', change: '+18%', icon: DollarSign, color: 'text-green-600' },
    { label: 'Followers', value: '1,256', change: '+15%', icon: Users, color: 'text-macs-blue-600' },
  ];

  const recentBookings = [
    { id: 1, client: 'Sarah Johnson', service: 'Portrait Session', date: '2024-07-15', status: 'confirmed', amount: 150 },
    { id: 2, client: 'Michael Chen', service: 'Music Collaboration', date: '2024-07-18', status: 'pending', amount: 200 },
    { id: 3, client: 'Emma Davis', service: 'Art Tutoring', date: '2024-07-12', status: 'completed', amount: 75 },
  ];

  const recentArtworks = [
    { id: 1, title: 'Digital Dreams', likes: 234, views: 1200, status: 'Published' },
    { id: 2, title: 'Abstract Thoughts', likes: 189, views: 890, status: 'Published' },
    { id: 3, title: 'Color Symphony', likes: 156, views: 670, status: 'Draft' },
    { id: 4, title: 'Urban Landscapes', likes: 298, views: 1450, status: 'Published' },
  ];

  const handleProfileUpdate = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    // Here you would typically save to backend
    console.log('Saving profile:', profile);
    setIsEditing(false);
  };

  const handleAvatarUpdate = (avatarUrl) => {
    setProfile(prev => ({ ...prev, avatar: avatarUrl }));
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-amber-100 text-amber-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-macs-blue-100 text-macs-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-macs-gray-100 text-macs-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card-macs p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h2 text-macs-blue-600 mb-2">
              Welcome back, {profile.name}! 👋
            </h1>
            <p className="text-body text-macs-gray-600">
              Here's what's happening with your art and bookings today.
            </p>
          </div>
          <Link to={`/artists/${profile.username}`} className="btn-outline">
            View Public Profile
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card-macs p-6">
              <div className="flex items-center justify-between mb-4">
                <Icon className={`h-8 w-8 ${stat.color}`} />
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-macs-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-macs-gray-600">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="card-macs p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-h4 text-macs-gray-900">Recent Bookings</h3>
            <button 
              onClick={() => setActiveTab('bookings')}
              className="btn-primary text-sm"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Manage Bookings
            </button>
          </div>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-macs-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-macs-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-macs-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-macs-gray-900">{booking.client}</h4>
                    <p className="text-sm text-macs-gray-600">{booking.service}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-macs-gray-500">{booking.date}</span>
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-macs-amber-600">${booking.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Artworks */}
        <div className="card-macs p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-h4 text-macs-gray-900">Recent Artworks</h3>
            <button className="btn-primary text-sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload New
            </button>
          </div>
          <div className="space-y-4">
            {recentArtworks.map((artwork) => (
              <div key={artwork.id} className="flex items-center justify-between p-4 bg-macs-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-macs-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🎨</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-macs-gray-900">{artwork.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-macs-gray-600">
                      <span>{artwork.likes} likes</span>
                      <span>{artwork.views} views</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        artwork.status === 'Published' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {artwork.status}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="btn-ghost text-sm">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-macs p-6">
        <h3 className="text-h4 text-macs-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => setActiveTab('gallery')}
            className="btn-primary justify-start"
          >
            <Upload className="h-5 w-5 mr-3" />
            Upload Artwork
          </button>
          <button 
            onClick={() => setActiveTab('calendar')}
            className="btn-secondary justify-start"
          >
            <Calendar className="h-5 w-5 mr-3" />
            Set Availability
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            className="btn-outline justify-start"
          >
            <Clock className="h-5 w-5 mr-3" />
            Manage Bookings
          </button>
          <button className="btn-ghost justify-start">
            <MessageCircle className="h-5 w-5 mr-3" />
            Check Messages
          </button>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-8">
      <div className="card-macs p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-h3 text-macs-blue-600">Artist Profile</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={isEditing ? 'btn-secondary' : 'btn-primary'}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar Section */}
          <div className="space-y-6">
            <div className="text-center">
              <AvatarUpload
                currentAvatar={profile.avatar}
                onAvatarUpdate={handleAvatarUpdate}
                disabled={!isEditing}
              />
              <div className="mt-4">
                <h3 className="font-semibold text-macs-gray-900">{profile.name}</h3>
                <p className="text-macs-gray-600">@{profile.username}</p>
                {profile.verified && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 mt-2">
                    ✓ Verified Artist
                  </span>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-macs-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-macs-blue-600">1,256</p>
                  <p className="text-xs text-macs-gray-600">Followers</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-macs-blue-600">89</p>
                  <p className="text-xs text-macs-gray-600">Artworks</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-macs-blue-600">4.9</p>
                  <p className="text-xs text-macs-gray-600">Rating</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-macs-blue-600">24h</p>
                  <p className="text-xs text-macs-gray-600">Response</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleProfileUpdate('name', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500 disabled:bg-macs-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={profile.username}
                  onChange={(e) => handleProfileUpdate('username', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500 disabled:bg-macs-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                disabled={!isEditing}
                rows={4}
                className="w-full px-3 py-2 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500 disabled:bg-macs-gray-50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => handleProfileUpdate('location', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500 disabled:bg-macs-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={profile.website}
                  onChange={(e) => handleProfileUpdate('website', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500 disabled:bg-macs-gray-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                  Instagram
                </label>
                <input
                  type="text"
                  value={profile.instagram}
                  onChange={(e) => handleProfileUpdate('instagram', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500 disabled:bg-macs-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                  Twitter
                </label>
                <input
                  type="text"
                  value={profile.twitter}
                  onChange={(e) => handleProfileUpdate('twitter', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500 disabled:bg-macs-gray-50"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="btn-primary"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'profile':
        return renderProfile();
      case 'gallery':
        return (
          <div className="space-y-6">
            <div className="card-macs p-6">
              <h2 className="text-h3 text-macs-blue-600 mb-4">Media Gallery</h2>
              <p className="text-macs-gray-600 mb-6">
                Upload and manage your artwork portfolio. Share your creative journey with the world.
              </p>
              <MediaGallery artistId={user?.id} isOwner={true} />
            </div>
          </div>
        );
      case 'calendar':
        return (
          <div className="space-y-6">
            <div className="card-macs p-6">
              <h2 className="text-h3 text-macs-blue-600 mb-4">Calendar & Availability</h2>
              <p className="text-macs-gray-600 mb-6">
                Manage your availability and view upcoming bookings.
              </p>
              <CalendarComponent artistId={user?.id} />
            </div>
          </div>
        );
      case 'bookings':
        return (
          <div className="space-y-6">
            <div className="card-macs p-6">
              <h2 className="text-h3 text-macs-blue-600 mb-4">Booking Management</h2>
              <p className="text-macs-gray-600 mb-6">
                Manage your booking requests, services, and pricing.
              </p>
              <BookingManager artistId={user?.id} />
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="card-macs p-6">
            <h2 className="text-h3 text-macs-blue-600 mb-4">Analytics</h2>
            <p className="text-macs-gray-600">Detailed analytics coming soon...</p>
          </div>
        );
      case 'messages':
        return (
          <div className="card-macs p-6">
            <h2 className="text-h3 text-macs-blue-600 mb-4">Messages</h2>
            <p className="text-macs-gray-600">Message system coming soon...</p>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="card-macs p-6">
              <h2 className="text-h3 text-macs-blue-600 mb-4">Notifications</h2>
              <p className="text-macs-gray-600 mb-6">
                Stay updated with booking requests, messages, and important updates.
              </p>
              <NotificationSystem />
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="card-macs p-6">
            <h2 className="text-h3 text-macs-blue-600 mb-4">Settings</h2>
            <p className="text-macs-gray-600">Account settings coming soon...</p>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex min-h-screen bg-macs-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-macs-gray-200">
        <div className="p-6">
          <h2 className="text-h4 text-macs-blue-600 mb-6">Artist Dashboard</h2>
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-macs-blue-600 text-white'
                      : 'text-macs-gray-600 hover:bg-macs-blue-50 hover:text-macs-blue-600'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default ArtistDashboard;

