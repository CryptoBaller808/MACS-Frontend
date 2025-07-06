import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Image, 
  Video, 
  X, 
  Edit3, 
  Trash2, 
  Eye, 
  Heart, 
  Share, 
  Plus,
  Calendar,
  Tag,
  Play,
  Download,
  ExternalLink
} from 'lucide-react';
import apiService from '../services/apiService';

const MediaGallery = ({ artistId, isOwner = false, onMediaSelect = null }) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMedia, setEditingMedia] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    caption: '',
    tags: '',
    file: null,
    preview: null
  });

  const mediaTypes = {
    image: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    video: ['mp4', 'mov', 'avi', 'webm']
  };

  useEffect(() => {
    loadMedia();
  }, [artistId]);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const response = await apiService.media.getArtistMedia(artistId);
      setMedia(response.data || []);
    } catch (error) {
      console.error('Failed to load media:', error);
      // Use mock data for development
      setMedia([
        {
          id: 1,
          title: "Digital Dreams",
          caption: "A surreal exploration of digital consciousness",
          type: 'image',
          url: '/api/placeholder/400/400',
          thumbnail: '/api/placeholder/200/200',
          tags: ['digital', 'surreal', 'consciousness'],
          uploadDate: '2024-07-01',
          likes: 234,
          views: 1200,
          downloads: 45
        },
        {
          id: 2,
          title: "Abstract Motion",
          caption: "Movement captured in abstract form",
          type: 'video',
          url: '/api/placeholder/400/300',
          thumbnail: '/api/placeholder/200/150',
          tags: ['abstract', 'motion', 'experimental'],
          uploadDate: '2024-06-28',
          likes: 189,
          views: 890,
          downloads: 23
        },
        {
          id: 3,
          title: "Color Symphony",
          caption: "Harmonious blend of colors and emotions",
          type: 'image',
          url: '/api/placeholder/400/500',
          thumbnail: '/api/placeholder/200/250',
          tags: ['color', 'harmony', 'emotion'],
          uploadDate: '2024-06-25',
          likes: 156,
          views: 670,
          downloads: 31
        },
        {
          id: 4,
          title: "Urban Landscapes",
          caption: "Modern cityscapes through an artistic lens",
          type: 'image',
          url: '/api/placeholder/400/300',
          thumbnail: '/api/placeholder/200/150',
          tags: ['urban', 'landscape', 'modern'],
          uploadDate: '2024-06-20',
          likes: 298,
          views: 1450,
          downloads: 67
        },
        {
          id: 5,
          title: "Time Lapse Creation",
          caption: "Watch the artistic process unfold",
          type: 'video',
          url: '/api/placeholder/400/400',
          thumbnail: '/api/placeholder/200/200',
          tags: ['timelapse', 'process', 'creation'],
          uploadDate: '2024-06-15',
          likes: 345,
          views: 2100,
          downloads: 89
        },
        {
          id: 6,
          title: "Minimalist Study",
          caption: "Less is more in this minimalist exploration",
          type: 'image',
          url: '/api/placeholder/400/600',
          thumbnail: '/api/placeholder/200/300',
          tags: ['minimalist', 'study', 'simple'],
          uploadDate: '2024-06-10',
          likes: 178,
          views: 820,
          downloads: 42
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const extension = file.name.split('.').pop().toLowerCase();
    const isValidImage = mediaTypes.image.includes(extension);
    const isValidVideo = mediaTypes.video.includes(extension);

    if (!isValidImage && !isValidVideo) {
      alert('Please select a valid image (JPG, PNG, GIF, WebP) or video (MP4, MOV, AVI, WebM) file.');
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB.');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadForm(prev => ({
        ...prev,
        file,
        preview: e.target.result,
        title: file.name.split('.')[0]
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!uploadForm.file) return;

    try {
      const formData = new FormData();
      formData.append('file', uploadForm.file);
      formData.append('title', uploadForm.title);
      formData.append('caption', uploadForm.caption);
      formData.append('tags', uploadForm.tags);

      await apiService.media.uploadMedia(formData);
      setShowUploadModal(false);
      setUploadForm({ title: '', caption: '', tags: '', file: null, preview: null });
      loadMedia();
    } catch (error) {
      console.error('Failed to upload media:', error);
      // For development, just close modal and add mock data
      const newMedia = {
        id: Date.now(),
        title: uploadForm.title,
        caption: uploadForm.caption,
        type: uploadForm.file.type.startsWith('video') ? 'video' : 'image',
        url: uploadForm.preview,
        thumbnail: uploadForm.preview,
        tags: uploadForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        uploadDate: new Date().toISOString().split('T')[0],
        likes: 0,
        views: 0,
        downloads: 0
      };
      setMedia(prev => [newMedia, ...prev]);
      setShowUploadModal(false);
      setUploadForm({ title: '', caption: '', tags: '', file: null, preview: null });
    }
  };

  const handleEdit = (mediaItem) => {
    setEditingMedia(mediaItem);
    setUploadForm({
      title: mediaItem.title,
      caption: mediaItem.caption,
      tags: mediaItem.tags.join(', '),
      file: null,
      preview: null
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!editingMedia) return;

    try {
      const updateData = {
        title: uploadForm.title,
        caption: uploadForm.caption,
        tags: uploadForm.tags
      };

      await apiService.media.updateMedia(editingMedia.id, updateData);
      setShowEditModal(false);
      setEditingMedia(null);
      setUploadForm({ title: '', caption: '', tags: '', file: null, preview: null });
      loadMedia();
    } catch (error) {
      console.error('Failed to update media:', error);
      // For development, update local state
      setMedia(prev => prev.map(item => 
        item.id === editingMedia.id 
          ? {
              ...item,
              title: uploadForm.title,
              caption: uploadForm.caption,
              tags: uploadForm.tags.split(',').map(tag => tag.trim()).filter(Boolean)
            }
          : item
      ));
      setShowEditModal(false);
      setEditingMedia(null);
      setUploadForm({ title: '', caption: '', tags: '', file: null, preview: null });
    }
  };

  const handleDelete = async (mediaId) => {
    if (!confirm('Are you sure you want to delete this media?')) return;

    try {
      await apiService.media.deleteMedia(mediaId);
      loadMedia();
    } catch (error) {
      console.error('Failed to delete media:', error);
      // For development, remove from local state
      setMedia(prev => prev.filter(item => item.id !== mediaId));
    }
  };

  const handleMediaClick = (mediaItem) => {
    if (onMediaSelect) {
      onMediaSelect(mediaItem);
    } else {
      setSelectedMedia(mediaItem);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-macs-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-macs-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-48 bg-macs-gray-200 rounded-lg"></div>
                <div className="h-4 bg-macs-gray-200 rounded"></div>
                <div className="h-3 bg-macs-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-macs-lg overflow-hidden">
      {/* Header */}
      <div className="bg-macs-blue-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-h3 font-gliker">Media Gallery</h2>
            <p className="text-macs-blue-100 mt-1">
              {media.length} {media.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          {isOwner && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-secondary bg-white text-macs-blue-600 hover:bg-macs-gray-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Media
            </button>
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="p-6">
        {media.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-macs-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Image className="h-12 w-12 text-macs-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-macs-gray-900 mb-2">No media uploaded yet</h3>
            <p className="text-macs-gray-600 mb-6">
              {isOwner 
                ? 'Start building your portfolio by uploading your first artwork.'
                : 'This artist hasn\'t uploaded any media yet.'
              }
            </p>
            {isOwner && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn-primary"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Your First Media
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {media.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg bg-macs-gray-100">
                  {/* Media Preview */}
                  <div 
                    className="aspect-square bg-gradient-to-br from-macs-blue-100 to-macs-amber-100 flex items-center justify-center relative"
                    onClick={() => handleMediaClick(item)}
                  >
                    {item.type === 'video' ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <Video className="h-16 w-16 text-macs-gray-400" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                            <Play className="h-6 w-6 text-white ml-1" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Image className="h-16 w-16 text-macs-gray-400" />
                    )}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMediaClick(item);
                        }}
                        className="p-2 bg-white rounded-full text-macs-gray-700 hover:text-macs-blue-600"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {!isOwner && (
                        <>
                          <button className="p-2 bg-white rounded-full text-macs-gray-700 hover:text-red-500">
                            <Heart className="h-4 w-4" />
                          </button>
                          <button className="p-2 bg-white rounded-full text-macs-gray-700 hover:text-macs-blue-600">
                            <Share className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {isOwner && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(item);
                            }}
                            className="p-2 bg-white rounded-full text-macs-gray-700 hover:text-macs-blue-600"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                            className="p-2 bg-white rounded-full text-macs-gray-700 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Media Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.type === 'video' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {item.type === 'video' ? (
                        <Video className="h-3 w-3 mr-1" />
                      ) : (
                        <Image className="h-3 w-3 mr-1" />
                      )}
                      {item.type}
                    </span>
                  </div>
                </div>

                {/* Media Info */}
                <div className="mt-4 space-y-2">
                  <h3 className="font-semibold text-macs-gray-900 line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-macs-gray-600 line-clamp-2">{item.caption}</p>
                  
                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-macs-blue-50 text-macs-blue-600"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="text-xs text-macs-gray-500">
                          +{item.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-macs-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{formatNumber(item.likes)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{formatNumber(item.views)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Download className="h-4 w-4" />
                        <span>{formatNumber(item.downloads)}</span>
                      </span>
                    </div>
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(item.uploadDate)}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-macs-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-macs-gray-200">
              <h3 className="text-h3 text-macs-blue-600 font-gliker">Upload Media</h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadForm({ title: '', caption: '', tags: '', file: null, preview: null });
                }}
                className="p-2 text-macs-gray-400 hover:text-macs-gray-600 hover:bg-macs-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                  Select Media File
                </label>
                <div className="border-2 border-dashed border-macs-gray-300 rounded-lg p-6 text-center hover:border-macs-blue-400 transition-colors">
                  {uploadForm.preview ? (
                    <div className="space-y-4">
                      <div className="w-32 h-32 mx-auto bg-macs-gray-100 rounded-lg flex items-center justify-center">
                        {uploadForm.file?.type.startsWith('video') ? (
                          <Video className="h-16 w-16 text-macs-gray-400" />
                        ) : (
                          <Image className="h-16 w-16 text-macs-gray-400" />
                        )}
                      </div>
                      <p className="text-sm text-macs-gray-600">{uploadForm.file?.name}</p>
                      <button
                        onClick={() => setUploadForm(prev => ({ ...prev, file: null, preview: null }))}
                        className="btn-ghost text-sm"
                      >
                        Choose Different File
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-12 w-12 text-macs-gray-400 mx-auto mb-4" />
                      <p className="text-macs-gray-600 mb-2">
                        Drag and drop your media file here, or click to browse
                      </p>
                      <p className="text-sm text-macs-gray-500 mb-4">
                        Supports: JPG, PNG, GIF, WebP, MP4, MOV, AVI, WebM (max 50MB)
                      </p>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="media-upload"
                      />
                      <label htmlFor="media-upload" className="btn-primary cursor-pointer">
                        Choose File
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Media Details */}
              {uploadForm.file && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter a title for your media"
                      className="w-full px-3 py-2 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                      Caption
                    </label>
                    <textarea
                      value={uploadForm.caption}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, caption: e.target.value }))}
                      placeholder="Describe your artwork..."
                      rows={3}
                      className="w-full px-3 py-2 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={uploadForm.tags}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="Enter tags separated by commas (e.g., digital, abstract, colorful)"
                      className="w-full px-3 py-2 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500"
                    />
                    <p className="text-sm text-macs-gray-500 mt-1">
                      Tags help people discover your work
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-macs-gray-200">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadForm({ title: '', caption: '', tags: '', file: null, preview: null });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!uploadForm.file || !uploadForm.title}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload Media
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-macs-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-macs-gray-200">
              <h3 className="text-h3 text-macs-blue-600 font-gliker">Edit Media</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingMedia(null);
                  setUploadForm({ title: '', caption: '', tags: '', file: null, preview: null });
                }}
                className="p-2 text-macs-gray-400 hover:text-macs-gray-600 hover:bg-macs-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Media Preview */}
              <div className="text-center">
                <div className="w-32 h-32 mx-auto bg-macs-gray-100 rounded-lg flex items-center justify-center mb-4">
                  {editingMedia.type === 'video' ? (
                    <Video className="h-16 w-16 text-macs-gray-400" />
                  ) : (
                    <Image className="h-16 w-16 text-macs-gray-400" />
                  )}
                </div>
                <p className="text-sm text-macs-gray-600">
                  {editingMedia.type === 'video' ? 'Video' : 'Image'} • Uploaded {formatDate(editingMedia.uploadDate)}
                </p>
              </div>

              {/* Edit Form */}
              <div>
                <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter a title for your media"
                  className="w-full px-3 py-2 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                  Caption
                </label>
                <textarea
                  value={uploadForm.caption}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, caption: e.target.value }))}
                  placeholder="Describe your artwork..."
                  rows={3}
                  className="w-full px-3 py-2 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-macs-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="Enter tags separated by commas"
                  className="w-full px-3 py-2 border border-macs-gray-300 rounded-lg focus:ring-2 focus:ring-macs-blue-500 focus:border-macs-blue-500"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-macs-gray-200">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingMedia(null);
                  setUploadForm({ title: '', caption: '', tags: '', file: null, preview: null });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={!uploadForm.title}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Media
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Preview Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-white rounded-xl shadow-macs-xl">
              <div className="flex items-center justify-between p-6 border-b border-macs-gray-200">
                <div>
                  <h3 className="text-h3 text-macs-gray-900 font-gliker">{selectedMedia.title}</h3>
                  <p className="text-macs-gray-600 mt-1">{selectedMedia.caption}</p>
                </div>
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="p-2 text-macs-gray-400 hover:text-macs-gray-600 hover:bg-macs-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                {/* Media Display */}
                <div className="bg-macs-gray-100 rounded-lg mb-6 flex items-center justify-center" style={{ minHeight: '400px' }}>
                  {selectedMedia.type === 'video' ? (
                    <div className="text-center">
                      <Video className="h-24 w-24 text-macs-gray-400 mx-auto mb-4" />
                      <p className="text-macs-gray-600">Video preview not available in demo</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Image className="h-24 w-24 text-macs-gray-400 mx-auto mb-4" />
                      <p className="text-macs-gray-600">Image preview not available in demo</p>
                    </div>
                  )}
                </div>

                {/* Media Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-macs-gray-900 mb-3">Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-macs-gray-600">Type:</span>
                        <span className="text-macs-gray-900 capitalize">{selectedMedia.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-macs-gray-600">Uploaded:</span>
                        <span className="text-macs-gray-900">{formatDate(selectedMedia.uploadDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-macs-gray-600">Views:</span>
                        <span className="text-macs-gray-900">{formatNumber(selectedMedia.views)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-macs-gray-600">Likes:</span>
                        <span className="text-macs-gray-900">{formatNumber(selectedMedia.likes)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-macs-gray-600">Downloads:</span>
                        <span className="text-macs-gray-900">{formatNumber(selectedMedia.downloads)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-macs-gray-900 mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMedia.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-macs-blue-50 text-macs-blue-600"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-macs-gray-200">
                  <div className="flex items-center space-x-4">
                    <button className="btn-ghost">
                      <Heart className="h-4 w-4 mr-2" />
                      Like
                    </button>
                    <button className="btn-ghost">
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </button>
                    <button className="btn-ghost">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </button>
                  </div>
                  <button className="btn-ghost">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Full Size
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGallery;

