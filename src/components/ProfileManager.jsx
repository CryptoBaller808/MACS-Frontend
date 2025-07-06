import React, { useState, useEffect } from 'react';
import { 
  User, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  MapPin, 
  Globe, 
  Palette,
  Award,
  Users,
  Heart,
  Eye,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import apiService from '../services/apiService.js';

const ProfileManager = ({ onClose }) => {
  const { user, updateProfile, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    specialties: user?.specialties?.join(', ') || '',
    profile_picture: user?.profile_picture || ''
  });

  // Load artist profiles from backend
  useEffect(() => {
    loadProfiles();
  }, []);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        specialties: user.specialties?.join(', ') || '',
        profile_picture: user.profile_picture || ''
      });
    }
  }, [user]);

  const loadProfiles = async () => {
    try {
      setLoadingProfiles(true);
      const response = await apiService.profiles.getProfiles();
      if (response.success) {
        setProfiles(response.data.profiles || []);
      }
    } catch (error) {
      console.error('Failed to load profiles:', error);
    } finally {
      setLoadingProfiles(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError('');
      
      const profileData = {
        ...formData,
        specialties: formData.specialties.split(',').map(s => s.trim()).filter(s => s)
      };

      const result = await updateProfile(profileData);
      
      if (result.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (error) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      bio: user?.bio || '',
      location: user?.location || '',
      website: user?.website || '',
      specialties: user?.specialties?.join(', ') || '',
      profile_picture: user?.profile_picture || ''
    });
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Profile Management</h2>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="text-sm text-green-700 dark:text-green-300">{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
        </div>
      )}

      {/* Current User Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Your Profile
            </CardTitle>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Profile Picture */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.profile_picture} />
              <AvatarFallback>
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{user?.username}</h3>
                {user?.is_verified && (
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                )}
                {user?.is_artist && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Palette className="h-3 w-3" />
                    Artist
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              {isEditing ? (
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter username"
                />
              ) : (
                <p className="p-2 bg-gray-50 dark:bg-gray-800 rounded">{user?.username || 'Not set'}</p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              {isEditing ? (
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter location"
                />
              ) : (
                <p className="p-2 bg-gray-50 dark:bg-gray-800 rounded flex items-center gap-2">
                  {user?.location ? (
                    <>
                      <MapPin className="h-4 w-4" />
                      {user.location}
                    </>
                  ) : (
                    'Not set'
                  )}
                </p>
              )}
            </div>

            {/* Website */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="website">Website</Label>
              {isEditing ? (
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://your-website.com"
                />
              ) : (
                <p className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  {user?.website ? (
                    <a 
                      href={user.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      <Globe className="h-4 w-4" />
                      {user.website}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    'Not set'
                  )}
                </p>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              {isEditing ? (
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                  className="w-full p-2 border rounded-md resize-none h-20"
                />
              ) : (
                <p className="p-2 bg-gray-50 dark:bg-gray-800 rounded min-h-[60px]">
                  {user?.bio || 'No bio provided'}
                </p>
              )}
            </div>

            {/* Specialties */}
            {user?.is_artist && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="specialties">Specialties</Label>
                {isEditing ? (
                  <Input
                    id="specialties"
                    name="specialties"
                    value={formData.specialties}
                    onChange={handleInputChange}
                    placeholder="Digital Art, Photography, NFTs (comma separated)"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    {user?.specialties?.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {user.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      'No specialties listed'
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-2 pt-4 border-t">
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Artist Profiles from Backend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Artist Community
          </CardTitle>
        </CardHeader>

        <CardContent>
          {loadingProfiles ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading profiles...</span>
            </div>
          ) : profiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profiles.map((profile) => (
                <Card key={profile.id} className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar>
                      <AvatarImage src={profile.profile_picture} />
                      <AvatarFallback>
                        {profile.username?.charAt(0)?.toUpperCase() || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <h4 className="font-semibold">{profile.username}</h4>
                        {profile.is_verified && (
                          <CheckCircle className="h-3 w-3 text-blue-500" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600">{profile.location}</p>
                    </div>
                  </div>
                  
                  {profile.bio && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
                      {profile.bio}
                    </p>
                  )}
                  
                  {profile.specialties?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {profile.specialties.slice(0, 2).map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {profile.specialties.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{profile.specialties.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No artist profiles found</p>
              <p className="text-sm">Be the first to create your artist profile!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileManager;

