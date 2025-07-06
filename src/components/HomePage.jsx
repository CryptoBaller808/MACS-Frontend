import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Eye, Share, MoreHorizontal } from 'lucide-react';

const HomePage = () => {
  const [likedPosts, setLikedPosts] = useState(new Set());

  const feedPosts = [
    {
      id: 1,
      artist: {
        name: 'Jelite Somari',
        username: 'jelite_somari',
        avatar: '🎨',
        verified: true,
        location: "Côte d'Ivoire",
        timeAgo: '2 hours ago'
      },
      artwork: {
        title: "Hnak in qir's Cilier Sonwar",
        description: "Traditional ceramic vase with intricate blue and orange patterns, representing the rich cultural heritage of West African pottery traditions.",
        image: '/api/placeholder/600/400',
        tags: ['Ceramics', 'Traditional', 'Heritage'],
        price: null
      },
      engagement: {
        likes: 253,
        comments: 89,
        views: 21020
      }
    },
    {
      id: 2,
      artist: {
        name: 'Alex Rivera',
        username: 'alex_rivera',
        avatar: '🎭',
        verified: true,
        location: 'Romania',
        timeAgo: '5 hours ago'
      },
      artwork: {
        title: 'Collaboration With Colo samatel',
        description: "Mixed media artwork exploring the intersection of digital and traditional art forms, featuring vibrant colors and geometric patterns.",
        image: '/api/placeholder/600/400',
        tags: ['Digital Art', 'Collaboration', 'Mixed Media'],
        price: null
      },
      engagement: {
        likes: 147,
        comments: 32,
        views: 9720
      }
    },
    {
      id: 3,
      artist: {
        name: 'Marina Santos',
        username: 'marina_santos',
        avatar: '🖼️',
        verified: false,
        location: 'Singapore',
        timeAgo: '1 day ago'
      },
      artwork: {
        title: 'Buverness are fre including prodeseoiv both ang lekl',
        description: "Contemporary sculpture installation that challenges perceptions of space and form through innovative use of materials and lighting.",
        image: '/api/placeholder/600/400',
        tags: ['Sculpture', 'Installation', 'Contemporary'],
        price: 320
      },
      engagement: {
        likes: 89,
        comments: 15,
        views: 4520
      }
    },
    {
      id: 4,
      artist: {
        name: 'David Chen',
        username: 'david_chen',
        avatar: '📸',
        verified: true,
        location: 'Netherlands',
        timeAgo: '3 days ago'
      },
      artwork: {
        title: 'Heritage Zone: Traditional Weaving',
        description: "Documenting the ancient art of traditional weaving techniques passed down through generations in rural communities.",
        image: '/api/placeholder/600/400',
        tags: ['Heritage', 'Weaving', 'Documentary'],
        price: null
      },
      engagement: {
        likes: 312,
        comments: 67,
        views: 15840
      }
    }
  ];

  const toggleLike = (postId) => {
    setLikedPosts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
      } else {
        newLiked.add(postId);
      }
      return newLiked;
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Feed Posts */}
      <div className="space-y-8">
        {feedPosts.map((post) => (
          <div key={post.id} className="card-macs overflow-hidden">
            {/* Post Header */}
            <div className="p-6 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Link to={`/artists/${post.artist.username}`} className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-macs-blue-100 rounded-full flex items-center justify-center text-xl">
                        {post.artist.avatar}
                      </div>
                      {post.artist.verified && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-macs-gray-900">{post.artist.name}</h3>
                      </div>
                      <p className="text-sm text-macs-gray-600">
                        {post.artist.location} • {post.artist.timeAgo}
                      </p>
                    </div>
                  </Link>
                </div>
                <button className="p-2 text-macs-gray-400 hover:text-macs-gray-600 rounded-lg">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Artwork Image */}
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-macs-blue-100 to-macs-amber-100 flex items-center justify-center">
                <span className="text-6xl opacity-50">🎨</span>
              </div>
              {post.artwork.price && (
                <div className="absolute top-4 right-4 bg-macs-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {post.artwork.price} MACS
                </div>
              )}
            </div>

            {/* Post Content */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-macs-blue-600 mb-2">
                {post.artwork.title}
              </h2>
              <p className="text-macs-gray-700 mb-4 leading-relaxed">
                {post.artwork.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.artwork.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-macs-blue-50 text-macs-blue-600 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Engagement Stats */}
              <div className="flex items-center justify-between text-sm text-macs-gray-600 mb-4">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{formatNumber(post.engagement.likes)}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.engagement.comments}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{formatNumber(post.engagement.views)}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-macs-gray-100">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      likedPosts.has(post.id)
                        ? 'bg-red-50 text-red-600'
                        : 'text-macs-gray-600 hover:bg-macs-gray-50'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                    <span className="text-sm font-medium">Like</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-macs-gray-600 hover:bg-macs-gray-50 transition-colors">
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Comment</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-macs-gray-600 hover:bg-macs-gray-50 transition-colors">
                    <Share className="h-5 w-5" />
                    <span className="text-sm font-medium">Share</span>
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="btn-ghost text-sm">Save</button>
                  {post.artwork.price ? (
                    <button className="btn-accent text-sm">Make Offer</button>
                  ) : (
                    <button className="btn-primary text-sm">View Details</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-8">
        <button className="btn-outline">
          Load More Posts
        </button>
      </div>
    </div>
  );
};

export default HomePage;

