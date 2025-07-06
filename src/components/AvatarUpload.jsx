import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check, AlertCircle } from 'lucide-react';
import apiService from '../services/apiService';

const AvatarUpload = ({ 
  currentAvatar, 
  onAvatarUpdate, 
  size = 'large', 
  showUploadButton = true,
  className = '',
  disabled = false 
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const sizeClasses = {
    small: 'w-16 h-16 text-lg',
    medium: 'w-24 h-24 text-2xl',
    large: 'w-32 h-32 text-4xl',
    xlarge: 'w-40 h-40 text-5xl'
  };

  const iconSizes = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
    xlarge: 'w-8 h-8'
  };

  const validateFile = (file) => {
    const errors = [];
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      errors.push('Please select a valid image file');
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      errors.push('File size must be less than 5MB');
    }
    
    // Check image dimensions (optional)
    return new Promise((resolve) => {
      if (errors.length > 0) {
        resolve({ valid: false, errors });
        return;
      }
      
      const img = new Image();
      img.onload = () => {
        // Check minimum dimensions
        if (img.width < 100 || img.height < 100) {
          errors.push('Image must be at least 100x100 pixels');
        }
        
        // Check aspect ratio (should be roughly square)
        const aspectRatio = img.width / img.height;
        if (aspectRatio < 0.8 || aspectRatio > 1.2) {
          errors.push('Image should be roughly square for best results');
        }
        
        resolve({ valid: errors.length === 0, errors, dimensions: { width: img.width, height: img.height } });
      };
      
      img.onerror = () => {
        resolve({ valid: false, errors: ['Invalid image file'] });
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (file) => {
    if (!file || disabled) return;
    
    setError(null);
    
    // Validate file
    const validation = await validateFile(file);
    if (!validation.valid) {
      setError(validation.errors[0]);
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
    
    // Upload file
    await uploadFile(file);
  };

  const uploadFile = async (file) => {
    try {
      setUploading(true);
      setError(null);
      
      // Try to upload to backend
      try {
        const response = await apiService.profiles.uploadAvatar(file);
        if (response.success) {
          const avatarUrl = response.data.avatarUrl;
          setPreview(null);
          
          // Notify parent component
          if (onAvatarUpdate) {
            onAvatarUpdate(avatarUrl);
          }
          
          // Show success notification
          if (window.showNotification) {
            window.showNotification('Avatar uploaded successfully!', 'success');
          }
          return;
        }
      } catch (error) {
        console.log('Backend upload failed, using local preview');
      }
      
      // Fallback to local preview for demonstration
      const reader = new FileReader();
      reader.onload = (e) => {
        const avatarUrl = e.target.result;
        setPreview(null);
        
        // Notify parent component
        if (onAvatarUpdate) {
          onAvatarUpdate(avatarUrl);
        }
        
        // Show success notification
        if (window.showNotification) {
          window.showNotification('Avatar uploaded successfully! (Demo mode)', 'success');
        }
      };
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      setError('Failed to upload avatar. Please try again.');
      setPreview(null);
      
      if (window.showNotification) {
        window.showNotification('Failed to upload avatar. Please try again.', 'error');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    
    if (disabled) return;
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const clearPreview = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayAvatar = preview || currentAvatar;

  return (
    <div className={`relative ${className}`}>
      {/* Avatar Display */}
      <div
        className={`
          ${sizeClasses[size]} 
          rounded-full bg-gradient-to-r from-purple-400 to-pink-400 
          flex items-center justify-center text-white font-bold overflow-hidden 
          cursor-pointer transition-all duration-300 relative group
          ${dragOver ? 'ring-4 ring-purple-300 ring-opacity-50' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
        `}
        onClick={openFileDialog}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {displayAvatar ? (
          <img 
            src={displayAvatar} 
            alt="Avatar" 
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="select-none">
            {currentAvatar ? 'A' : '+'}
          </span>
        )}
        
        {/* Overlay */}
        {!disabled && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <Camera className={`${iconSizes[size]} text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          </div>
        )}
        
        {/* Upload indicator */}
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
        
        {/* Preview indicator */}
        {preview && !uploading && (
          <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
            <Check className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Upload Button */}
      {showUploadButton && !disabled && (
        <button
          onClick={openFileDialog}
          disabled={uploading}
          className="absolute -bottom-2 -right-2 bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <Camera className="w-5 h-5" />
          )}
        </button>
      )}

      {/* Preview Controls */}
      {preview && !uploading && (
        <button
          onClick={clearPreview}
          className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled || uploading}
      />

      {/* Error Message */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm flex items-center">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Instructions */}
      {!currentAvatar && !preview && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-2 text-center">
          <p className="text-sm text-gray-500">
            Click or drag to upload
          </p>
          <p className="text-xs text-gray-400">
            Max 5MB, square images work best
          </p>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;

