import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Heart, Eye, Star, ChevronRight, Loader2 } from 'lucide-react';

const AIRecommendations = ({ userId, userPreferences, currentContext }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('for-you');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRecommendations();
  }, [userId, activeTab]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      let endpoint = '/api/ai/recommendations/personalized';
      let requestBody = {
        limit: 12,
        category: userPreferences?.category,
        style: userPreferences?.style,
        priceRange: userPreferences?.priceRange
      };

      // Use different endpoints based on active tab
      switch (activeTab) {
        case 'trending':
          endpoint = '/api/ai/recommendations/trending';
          requestBody = {
            category: userPreferences?.category || 'all',
            timeframe: '7d'
          };
          break;
        case 'similar':
          endpoint = '/api/ai/recommendations/personalized';
          requestBody.similarTo = currentContext?.artworkId;
          break;
        case 'new':
          endpoint = '/api/ai/recommendations/personalized';
          requestBody.sortBy = 'newest';
          break;
        default:
          // for-you tab uses personalized recommendations
          break;
      }

      const response = await fetch(endpoint, {
        method: activeTab === 'trending' ? 'GET' : 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        ...(activeTab !== 'trending' && {
          body: JSON.stringify(requestBody)
        })
      });

      const data = await response.json();
      if (data.success) {
        // Transform backend data to frontend format
        const transformedRecommendations = (data.data?.recommendations || data.data?.trending || []).map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          image: item.image,
          price: item.price,
          creator: {
            name: item.artist || item.creator,
            avatar: item.artistAvatar || '/api/placeholder/24/24'
          },
          confidence: item.aiScore || item.trendScore || 0.8,
          reason: item.matchReasons?.join(', ') || item.reasoning || 'Based on your preferences',
          tags: item.tags || [],
          category: item.category,
          chain: item.chain
        }));
        setRecommendations(transformedRecommendations);
      }
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshRecommendations = async () => {
    setRefreshing(true);
    await loadRecommendations();
    setRefreshing(false);
  };

  const handleInteraction = async (recommendationId, interactionType) => {
    try {
      await fetch('/api/ai/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          itemId: recommendationId,
          interactionType,
          context: {
            source: 'ai_recommendations',
            tab: activeTab,
            timestamp: new Date().toISOString()
          }
        })
      });
    } catch (error) {
      console.error('Failed to track interaction:', error);
    }
  };

  const tabs = [
    { id: 'for-you', label: 'For You', icon: Sparkles },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'similar', label: 'Similar', icon: Heart },
    { id: 'new', label: 'New', icon: Star }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Recommendations</h2>
              <p className="text-white/80 text-sm">Personalized just for you</p>
            </div>
          </div>
          <button
            onClick={refreshRecommendations}
            disabled={refreshing}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            <Loader2 className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mt-4 bg-white/10 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-orange-500 shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-3" />
              <p className="text-gray-500">Loading personalized recommendations...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((item) => (
              <RecommendationCard
                key={item.id}
                item={item}
                onInteraction={handleInteraction}
              />
            ))}
          </div>
        )}

        {!loading && recommendations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No recommendations yet</h3>
            <p className="text-gray-500 mb-4">
              Interact with more content to get personalized recommendations
            </p>
            <button
              onClick={refreshRecommendations}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const RecommendationCard = ({ item, onInteraction }) => {
  const [liked, setLiked] = useState(false);
  const [viewed, setViewed] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    onInteraction(item.id, liked ? 'unlike' : 'like');
  };

  const handleView = () => {
    if (!viewed) {
      setViewed(true);
      onInteraction(item.id, 'view');
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div 
      className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={handleView}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={item.image || '/api/placeholder/300/300'}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike();
                  }}
                  className={`p-2 rounded-full transition-colors ${
                    liked ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(item.confidence)}`}>
                {Math.round(item.confidence * 100)}% match
              </div>
            </div>
          </div>
        </div>

        {/* AI Badge */}
        <div className="absolute top-3 left-3">
          <div className="flex items-center space-x-1 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            <Sparkles className="w-3 h-3" />
            <span>AI Pick</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-orange-500 transition-colors">
            {item.title}
          </h3>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors flex-shrink-0 ml-2" />
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={item.creator?.avatar || '/api/placeholder/24/24'}
              alt={item.creator?.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-gray-600">{item.creator?.name}</span>
          </div>
          <div className="text-sm font-semibold text-orange-500">
            {item.price} MACS
          </div>
        </div>

        {/* Recommendation Reason */}
        {item.reason && (
          <div className="mt-3 p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              <span className="font-medium">Why this?</span> {item.reason}
            </p>
          </div>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendations;

