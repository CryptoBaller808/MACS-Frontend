/**
 * MACS Spatial Search Component - Phase 7
 * 3D spatial search and discovery interface
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Map, 
  Navigation, 
  Filter, 
  Zap, 
  Eye, 
  MapPin, 
  Compass, 
  Globe,
  Layers,
  Target,
  Route,
  Bookmark,
  Share2,
  Settings,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Maximize,
  Minimize
} from 'lucide-react';

const SpatialSearch = ({ onNavigate, onTeleport, onShare }) => {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [spatialMap, setSpatialMap] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [viewMode, setViewMode] = useState('map'); // 'map', 'list', '3d'
  const [filters, setFilters] = useState({
    type: 'all', // 'galleries', 'artworks', 'tours', 'all'
    distance: 'any',
    theme: 'any',
    style: 'any',
    period: 'any'
  });
  const [voiceSearch, setVoiceSearch] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Refs
  const mapRef = useRef(null);
  const searchInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Search suggestions
  const searchSuggestions = [
    'Minimalist sculptures near Tokyo',
    'Vibrant Afro-futurism NFT art',
    'Virtual tour of surrealist creators trending this week',
    'Peaceful nature paintings for meditation',
    'Contemporary digital art galleries',
    'Classical Renaissance masterpieces',
    'Abstract expressionist works',
    'Photography exhibitions worldwide',
    'Interactive art installations',
    'Emerging artists from Asia'
  ];

  // Initialize component
  useEffect(() => {
    initializeVoiceSearch();
    loadSearchHistory();
    loadBookmarks();
    
    return () => {
      cleanup();
    };
  }, []);

  // Handle search query changes
  useEffect(() => {
    if (searchQuery.length > 2) {
      generateSuggestions(searchQuery);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const initializeVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        performSearch(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setVoiceSearch(false);
      };

      recognitionRef.current.onend = () => {
        setVoiceSearch(false);
      };
    }
  };

  const performSearch = async (query = searchQuery) => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setSearchResults(null);

      // Add to search history
      const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('macs_search_history', JSON.stringify(newHistory));

      // Perform spatial search
      const response = await fetch('/api/spatial/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          query,
          filters,
          options: {
            includeMap: true,
            maxResults: 50,
            spatialRadius: filters.distance !== 'any' ? parseInt(filters.distance) : null
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setSearchResults(data.results);
        setSpatialMap(data.spatialMap);

        // Play audio confirmation if enabled
        if (audioEnabled) {
          playSearchConfirmation(data.totalResults);
        }
      } else {
        throw new Error(data.error);
      }

    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({
        galleries: [],
        artworks: [],
        tours: [],
        error: 'Search failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestions = (query) => {
    const filtered = searchSuggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 5));
  };

  const startVoiceSearch = () => {
    if (recognitionRef.current) {
      setVoiceSearch(true);
      recognitionRef.current.start();
    }
  };

  const stopVoiceSearch = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setVoiceSearch(false);
  };

  const handleResultSelect = (result) => {
    setSelectedResult(result);
    
    // Track result selection
    trackInteraction({
      type: 'search_result_select',
      target: result.id,
      resultType: result.type,
      query: searchQuery,
      score: result.score
    });
  };

  const handleTeleport = async (result) => {
    try {
      // Generate teleportation route
      const response = await fetch('/api/spatial/teleport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          target: result.id,
          targetType: result.type,
          preferences: {
            transitionStyle: 'smooth',
            duration: 'medium'
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        // Execute teleportation
        if (onTeleport) {
          onTeleport(result, data.route);
        }

        // Track teleportation
        trackInteraction({
          type: 'teleport',
          target: result.id,
          targetType: result.type,
          query: searchQuery
        });

        // Play teleportation sound if enabled
        if (audioEnabled) {
          playTeleportSound();
        }
      }

    } catch (error) {
      console.error('Teleport error:', error);
    }
  };

  const handleBookmark = (result) => {
    const bookmark = {
      id: result.id,
      type: result.type,
      title: result.data.title || result.data.name,
      query: searchQuery,
      timestamp: new Date().toISOString()
    };

    const newBookmarks = [bookmark, ...bookmarks.filter(b => b.id !== result.id)];
    setBookmarks(newBookmarks);
    localStorage.setItem('macs_spatial_bookmarks', JSON.stringify(newBookmarks));

    // Track bookmark
    trackInteraction({
      type: 'bookmark_add',
      target: result.id,
      targetType: result.type
    });
  };

  const handleShare = async (result) => {
    try {
      const shareData = {
        title: `MACS Spatial Discovery: ${result.data.title || result.data.name}`,
        text: `Check out this ${result.type} I found in the MACS metaverse!`,
        url: `${window.location.origin}/spatial/${result.type}/${result.id}`
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }

      // Track share
      trackInteraction({
        type: 'share',
        target: result.id,
        targetType: result.type,
        method: navigator.share ? 'native' : 'clipboard'
      });

      if (onShare) {
        onShare(shareData);
      }

    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const playSearchConfirmation = (resultCount) => {
    if ('speechSynthesis' in window) {
      const message = `Found ${resultCount} results for your search.`;
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.8;
      utterance.volume = 0.5;
      speechSynthesis.speak(utterance);
    }
  };

  const playTeleportSound = () => {
    // Play teleportation sound effect
    const audio = new Audio('/sounds/teleport.mp3');
    audio.volume = 0.3;
    audio.play().catch(console.error);
  };

  const trackInteraction = async (interactionData) => {
    try {
      await fetch('/api/spatial/interactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...interactionData,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Track interaction error:', error);
    }
  };

  const loadSearchHistory = () => {
    const history = localStorage.getItem('macs_search_history');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  };

  const loadBookmarks = () => {
    const bookmarks = localStorage.getItem('macs_spatial_bookmarks');
    if (bookmarks) {
      setBookmarks(JSON.parse(bookmarks));
    }
  };

  const cleanup = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const renderSearchResults = () => {
    if (!searchResults) return null;

    if (searchResults.error) {
      return (
        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              <Search className="h-12 w-12 mx-auto mb-4" />
              <p>{searchResults.error}</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    const allResults = [
      ...searchResults.galleries.map(r => ({ ...r, category: 'Gallery' })),
      ...searchResults.artworks.map(r => ({ ...r, category: 'Artwork' })),
      ...searchResults.tours.map(r => ({ ...r, category: 'Tour' }))
    ].sort((a, b) => b.score - a.score);

    if (allResults.length === 0) {
      return (
        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4" />
              <p>No results found for "{searchQuery}"</p>
              <p className="text-sm mt-2">Try different keywords or adjust your filters</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="mt-4 space-y-4">
        {/* Results summary */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Search Results</h3>
                <p className="text-sm text-gray-600">
                  Found {allResults.length} results for "{searchQuery}"
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setViewMode('list')}
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                >
                  <Layers className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => setViewMode('map')}
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  size="sm"
                >
                  <Map className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => setViewMode('3d')}
                  variant={viewMode === '3d' ? 'default' : 'outline'}
                  size="sm"
                >
                  <Globe className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results list */}
        {viewMode === 'list' && (
          <div className="space-y-3">
            {allResults.map((result, index) => (
              <Card 
                key={`${result.type}-${result.id}`}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedResult?.id === result.id ? 'ring-2 ring-[#D2691E]' : ''
                }`}
                onClick={() => handleResultSelect(result)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{result.category}</Badge>
                        <Badge variant="outline">
                          {Math.round(result.score * 100)}% match
                        </Badge>
                      </div>
                      <h4 className="font-semibold mb-1">
                        {result.data.title || result.data.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {result.data.description || result.data.artist}
                      </p>
                      {result.relevance && (
                        <p className="text-xs text-gray-500">
                          Relevant: {result.relevance.join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTeleport(result);
                        }}
                        size="sm"
                        className="bg-[#D2691E] hover:bg-[#B8860B]"
                      >
                        <Zap className="h-4 w-4 mr-1" />
                        Teleport
                      </Button>
                      <div className="flex gap-1">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookmark(result);
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <Bookmark className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(result);
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Spatial map view */}
        {viewMode === 'map' && spatialMap && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Spatial Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Globe className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">3D Spatial Map</p>
                  <p className="text-sm text-gray-500">
                    {spatialMap.clusters?.length || 0} clusters found
                  </p>
                </div>
              </div>
              
              {/* Navigation suggestions */}
              {spatialMap.navigation?.suggested_routes?.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Suggested Routes</h4>
                  <div className="space-y-2">
                    {spatialMap.navigation.suggested_routes.slice(0, 3).map((route, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">{route.name}</span>
                          <span className="text-sm text-gray-600 ml-2">
                            {route.duration} min • {route.stops} stops
                          </span>
                        </div>
                        <Button
                          onClick={() => onNavigate && onNavigate(route)}
                          size="sm"
                          variant="outline"
                        >
                          <Route className="h-4 w-4 mr-1" />
                          Navigate
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* 3D view placeholder */}
        {viewMode === '3d' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                3D Spatial View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-black rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <Eye className="h-12 w-12 mx-auto mb-4" />
                  <p>3D Spatial Visualization</p>
                  <p className="text-sm opacity-75">
                    Immersive view of search results
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className={`w-full ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      {/* Search Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Compass className="h-5 w-5" />
              Spatial Search & Discovery
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setAudioEnabled(!audioEnabled)}
                variant="outline"
                size="sm"
              >
                {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button
                onClick={toggleFullscreen}
                variant="outline"
                size="sm"
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Input */}
          <div className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search galleries, artworks, tours... (e.g., 'Minimalist sculptures near Tokyo')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && performSearch()}
                  className="pl-10 pr-12"
                />
                <Button
                  onClick={voiceSearch ? stopVoiceSearch : startVoiceSearch}
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  {voiceSearch ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>
              <Button 
                onClick={() => performSearch()}
                disabled={loading || !searchQuery.trim()}
                className="bg-[#D2691E] hover:bg-[#B8860B]"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(suggestion);
                      setSuggestions([]);
                      performSearch(suggestion);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-gray-400" />
                      <span>{suggestion}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Voice Search Indicator */}
          {voiceSearch && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <div className="animate-pulse">
                  <Mic className="h-4 w-4" />
                </div>
                <span className="text-sm">Listening... Speak your search query</span>
              </div>
            </div>
          )}

          {/* Quick Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              onClick={() => setFilters({ ...filters, type: 'galleries' })}
              variant={filters.type === 'galleries' ? 'default' : 'outline'}
              size="sm"
            >
              Galleries
            </Button>
            <Button
              onClick={() => setFilters({ ...filters, type: 'artworks' })}
              variant={filters.type === 'artworks' ? 'default' : 'outline'}
              size="sm"
            >
              Artworks
            </Button>
            <Button
              onClick={() => setFilters({ ...filters, type: 'tours' })}
              variant={filters.type === 'tours' ? 'default' : 'outline'}
              size="sm"
            >
              Tours
            </Button>
            <Button
              onClick={() => setFilters({ ...filters, type: 'all' })}
              variant={filters.type === 'all' ? 'default' : 'outline'}
              size="sm"
            >
              All
            </Button>
          </div>

          {/* Search History */}
          {searchHistory.length > 0 && !searchQuery && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Recent Searches</h4>
              <div className="flex flex-wrap gap-2">
                {searchHistory.slice(0, 5).map((query, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      setSearchQuery(query);
                      performSearch(query);
                    }}
                  >
                    {query}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loading Indicator */}
      {loading && (
        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D2691E] mx-auto mb-4"></div>
              <p className="text-gray-600">Searching the metaverse...</p>
              <Progress value={33} className="w-48 mx-auto mt-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {renderSearchResults()}

      {/* Bookmarks */}
      {bookmarks.length > 0 && !searchResults && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bookmark className="h-5 w-5" />
              Bookmarked Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {bookmarks.slice(0, 5).map((bookmark, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{bookmark.title}</span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {bookmark.type}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => handleTeleport(bookmark)}
                    size="sm"
                    variant="outline"
                  >
                    <Zap className="h-4 w-4 mr-1" />
                    Visit
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SpatialSearch;

