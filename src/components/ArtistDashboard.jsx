import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';
import { Camera, Edit3, Save, X, MapPin, Palette, Star, Eye, Calendar, Upload } from 'lucide-react';

const ArtistDashboard = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: '',
    bio: '',
    location: '',
    craft: '',
    website: '',
    instagram: '',
    twitter: '',
    isArtist: true,
    verificationLevel: 'pending'
  });

  // Load user profile on component mount
  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await apiService.auth.getProfile();
      if (response.success) {
        setProfile(response.data);
        setEditForm({
          displayName: response.data.displayName || '',
          bio: response.data.bio || '',
          location: response.data.location || '',
          craft: response.data.craft || '',
          website: response.data.website || '',
          instagram: response.data.instagram || '',
          twitter: response.data.twitter || '',
          isArtist: response.data.isArtist || true,
          verificationLevel: response.data.verificationLevel || 'pending'
        });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const response = await apiService.auth.updateProfile(editForm);
      
      if (response.success) {
        setProfile(response.data);
        setIsEditing(false);
        
        // Show success notification
        if (window.showNotification) {
          window.showNotification('Profile updated successfully!', 'success');
        }
        
        // Update user context
        updateUser(response.data);
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      if (window.showNotification) {
        window.showNotification('Failed to update profile. Please try again.', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      
      // Mock avatar upload - in real implementation, upload to S3 or similar
      const reader = new FileReader();
      reader.onload = (e) => {
        const avatarUrl = e.target.result;
        setProfile(prev => ({ ...prev, avatar: avatarUrl }));
        setEditForm(prev => ({ ...prev, avatar: avatarUrl }));
        
        if (window.showNotification) {
          window.showNotification('Avatar uploaded successfully!', 'success');
        }
      };
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      if (window.showNotification) {
        window.showNotification('Failed to upload avatar. Please try again.', 'error');
      }
    } finally {
      setUploadingAvatar(false);
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
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Artist Dashboard</h1>
            <div className="flex items-center space-x-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Section */}
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  (profile?.displayName || user?.username || 'A').charAt(0).toUpperCase()
                )}
              </div>
              {isEditing && (
                <label className="absolute -bottom-2 -right-2 bg-purple-600 text-white p-2 rounded-full cursor-pointer hover:bg-purple-700 transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={uploadingAvatar}
                  />
                </label>
              )}
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.displayName}
                    onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                    placeholder="Display Name"
                    className="text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-purple-300 focus:border-purple-600 outline-none"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile?.displayName || user?.username || 'Artist'}
                  </h2>
                )}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVerificationBadge(profile?.verificationLevel).color}`}>
                  {getVerificationBadge(profile?.verificationLevel).text}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Location */}
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Location"
                      className="flex-1 bg-transparent border-b border-gray-300 focus:border-purple-600 outline-none"
                    />
                  ) : (
                    <span className="text-gray-600">{profile?.location || 'Location not set'}</span>
                  )}
                </div>

                {/* Craft */}
                <div className="flex items-center space-x-2">
                  <Palette className="w-4 h-4 text-gray-500" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.craft}
                      onChange={(e) => setEditForm(prev => ({ ...prev, craft: e.target.value }))}
                      placeholder="Craft/Specialty"
                      className="flex-1 bg-transparent border-b border-gray-300 focus:border-purple-600 outline-none"
                    />
                  ) : (
                    <span className="text-gray-600">{profile?.craft || 'Craft not set'}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">About</h3>
          {isEditing ? (
            <textarea
              value={editForm.bio}
              onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell the world about your artistic journey..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-600 outline-none resize-none"
            />
          ) : (
            <p className="text-gray-600 leading-relaxed">
              {profile?.bio || 'No bio available. Click "Edit Profile" to add your story.'}
            </p>
          )}
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              {isEditing ? (
                <input
                  type="url"
                  value={editForm.website}
                  onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://yourwebsite.com"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-purple-600 outline-none"
                />
              ) : (
                <p className="text-gray-600">{profile?.website || 'Not set'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.instagram}
                  onChange={(e) => setEditForm(prev => ({ ...prev, instagram: e.target.value }))}
                  placeholder="@username"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-purple-600 outline-none"
                />
              ) : (
                <p className="text-gray-600">{profile?.instagram || 'Not set'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.twitter}
                  onChange={(e) => setEditForm(prev => ({ ...prev, twitter: e.target.value }))}
                  placeholder="@username"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-purple-600 outline-none"
                />
              ) : (
                <p className="text-gray-600">{profile?.twitter || 'Not set'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 transition-colors">
              <Upload className="w-6 h-6 text-gray-400 mr-2" />
              <span className="text-gray-600">Upload Artwork</span>
            </button>
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 transition-colors">
              <Calendar className="w-6 h-6 text-gray-400 mr-2" />
              <span className="text-gray-600">Manage Bookings</span>
            </button>
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 transition-colors">
              <Eye className="w-6 h-6 text-gray-400 mr-2" />
              <span className="text-gray-600">View Public Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistDashboard;

