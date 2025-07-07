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
  Video,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AvatarUpload from './AvatarUpload';
import AvailabilityCalendar from './AvailabilityCalendar';
import AvailabilityManager from './AvailabilityManager';
import BookingManagement from './BookingManagement';
import NotificationSystem from './NotificationSystem';
import MediaGallery from './MediaGallery';
import CampaignCreation from './CampaignCreation';

const ArtistDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profile, setProfile] = useState({
    name: user?.name || 'Keoni Nakamura',
    username: user?.username || 'keoni_nakamura',
    bio: 'Traditional ceramic artist passionate about preserving Hawaiian cultural heritage through contemporary art.',
    location: 'Honolulu, Hawaii',
    website: 'https://keoninakamura.art',
    instagram: '@keoni_nakamura_art',
    twitter: '@keoni_art',
    specialties: ['Ceramics', 'Traditional Art', 'Pottery', 'Cultural Heritage'],
    avatar: null,
    verified: true
  });
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState({
    totalViews: 12500,
    totalLikes: 890,
    totalFollowers: 456,
    monthlyGrowth: 15.2,
    totalBookings: 24,
    pendingBookings: 3,
    confirmedBookings: 8,
    revenue: 2400
  });

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'gallery', label: 'Media Gallery', icon: Image },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'availability', label: 'Availability', icon: Settings },
    { id: 'bookings', label: 'Bookings', icon: Clock },
    { id: 'campaigns', label: 'My Campaigns', icon: DollarSign },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleProfileUpdate = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = (avatarUrl) => {
    setProfile(prev => ({ ...prev, avatar: avatarUrl }));
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card-macs p-6 bg-gradient-to-r from-macs-teal-50 to-macs-amber-50">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-macs-teal-100 rounded-full flex items-center justify-center">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-macs-teal-600" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-h3 text-macs-gray-900">Aloha, {profile.name}! 🌺</h1>
              {profile.verified && (
                <CheckCircle className="w-5 h-5 text-macs-teal-600" />
              )}
            </div>
            <p className="text-macs-gray-600">Welcome back to your MACS artist dashboard</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-macs p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-macs-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-macs-gray-900">{stats.totalViews.toLocaleString()}</p>
            </div>
            <Eye className="w-8 h-8 text-macs-teal-600" />
          </div>
          <div className="mt-2 flex items-center gap-1 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600">+{stats.monthlyGrowth}%</span>
            <span className="text-macs-gray-500">this month</span>
          </div>
        </div>

        <div className="card-macs p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-macs-gray-600">Total Likes</p>
              <p className="text-2xl font-bold text-macs-gray-900">{stats.totalLikes.toLocaleString()}</p>
            </div>
            <Heart className="w-8 h-8 text-macs-amber-500" />
          </div>
          <div className="mt-2 flex items-center gap-1 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600">+12.3%</span>
            <span className="text-macs-gray-500">this month</span>
          </div>
        </div>

        <div className="card-macs p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-macs-gray-600">Followers</p>
              <p className="text-2xl font-bold text-macs-gray-900">{stats.totalFollowers.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-macs-teal-600" />
          </div>
          <div className="mt-2 flex items-center gap-1 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600">+8.7%</span>
            <span className="text-macs-gray-500">this month</span>
          </div>
        </div>

        <div className="card-macs p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-macs-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-macs-gray-900">${stats.revenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-macs-amber-500" />
          </div>
          <div className="mt-2 flex items-center gap-1 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600">+25.1%</span>
            <span className="text-macs-gray-500">this month</span>
          </div>
        </div>
      </div>

      {/* Booking Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-macs p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-macs-teal-600" />
            <h3 className="text-h5 text-macs-gray-900">Pending Bookings</h3>
          </div>
          <div className="text-3xl font-bold text-macs-amber-600 mb-2">{stats.pendingBookings}</div>
          <p className="text-sm text-macs-gray-600">Require your attention</p>
          <Link to="#" onClick={() => setActiveTab('bookings')} className="btn-primary mt-4 w-full">
            Review Bookings
          </Link>
        </div>

        <div className="card-macs p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="text-h5 text-macs-gray-900">Confirmed Bookings</h3>
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">{stats.confirmedBookings}</div>
          <p className="text-sm text-macs-gray-600">Upcoming sessions</p>
          <Link to="#" onClick={() => setActiveTab('calendar')} className="btn-outline mt-4 w-full">
            View Calendar
          </Link>
        </div>

        <div className="card-macs p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-5 h-5 text-macs-teal-600" />
            <h3 className="text-h5 text-macs-gray-900">Total Bookings</h3>
          </div>
          <div className="text-3xl font-bold text-macs-teal-600 mb-2">{stats.totalBookings}</div>
          <p className="text-sm text-macs-gray-600">All time</p>
          <Link to="#" onClick={() => setActiveTab('bookings')} className="btn-ghost mt-4 w-full">
            View All
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-macs p-6">
        <h3 className="text-h5 text-macs-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setActiveTab('gallery')}
            className="btn-outline flex items-center gap-2 justify-center"
          >
            <Upload className="w-4 h-4" />
            Upload New Media
          </button>
          <button 
            onClick={() => setActiveTab('calendar')}
            className="btn-outline flex items-center gap-2 justify-center"
          >
            <Calendar className="w-4 h-4" />
            Update Availability
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className="btn-outline flex items-center gap-2 justify-center"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-h3 text-macs-gray-900">Artist Profile</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn-primary flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="card-macs p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <AvatarUpload
              currentAvatar={profile.avatar}
              onUpload={handleAvatarUpload}
              disabled={!isEditing}
            />
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-macs-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleProfileUpdate('name', e.target.value)}
                  disabled={!isEditing}
                  className="input-macs"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-macs-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={profile.username}
                  onChange={(e) => handleProfileUpdate('username', e.target.value)}
                  disabled={!isEditing}
                  className="input-macs"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-macs-gray-700 mb-2">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                disabled={!isEditing}
                rows={3}
                className="input-macs resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-macs-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => handleProfileUpdate('location', e.target.value)}
                  disabled={!isEditing}
                  className="input-macs"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-macs-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={profile.website}
                  onChange={(e) => handleProfileUpdate('website', e.target.value)}
                  disabled={!isEditing}
                  className="input-macs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-macs-gray-700 mb-2">Instagram</label>
                <input
                  type="text"
                  value={profile.instagram}
                  onChange={(e) => handleProfileUpdate('instagram', e.target.value)}
                  disabled={!isEditing}
                  className="input-macs"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-macs-gray-700 mb-2">Twitter</label>
                <input
                  type="text"
                  value={profile.twitter}
                  onChange={(e) => handleProfileUpdate('twitter', e.target.value)}
                  disabled={!isEditing}
                  className="input-macs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-macs-gray-50 font-gliker">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-macs-gray-200 min-h-screen">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-macs-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-h5 text-macs-gray-900">MACS Artist</span>
            </div>
            
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                      activeTab === item.id
                        ? 'bg-macs-teal-100 text-macs-teal-700 font-medium'
                        : 'text-macs-gray-600 hover:bg-macs-gray-100 hover:text-macs-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'gallery' && <MediaGallery />}
          {activeTab === 'calendar' && <AvailabilityCalendar artistId="1" mode="edit" />}
          {activeTab === 'availability' && <AvailabilityManager artistId="1" />}
          {activeTab === 'bookings' && <BookingManagement artistId="1" />}
          {activeTab === 'campaigns' && <CampaignCreation />}
          {activeTab === 'notifications' && <NotificationSystem />}
          {activeTab === 'settings' && (
            <div className="card-macs p-6">
              <h2 className="text-h3 text-macs-gray-900 mb-4">Settings</h2>
              <p className="text-macs-gray-600">Settings panel coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistDashboard;

