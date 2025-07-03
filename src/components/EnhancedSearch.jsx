import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Camera, 
  Mic, 
  Upload, 
  X, 
  Loader2, 
  Sparkles, 
  Image as ImageIcon,
  Volume2,
  Filter,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';

const EnhancedSearch = ({ onResults, onClose }) => {
  const [searchMode, setSearchMode] = useState('text');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    chain: '',
    sortBy: 'relevance'
  });

  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    if (query.length > 2) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (data.success) {
        setSuggestions(data.data.suggestions);
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  };

  const performSearch = async (searchQuery = query, mode = searchMode) => {
    if (!searchQuery && mode === 'text') return;
    
    setLoading(true);
    try {
      let response;
      
      switch (mode) {
        case 'text':
        case 'semantic':
          response = await performSemanticSearch(searchQuery);
          break;
        case 'visual':
          response = await performVisualSearch();
          break;
        case 'voice':
          response = await performVoiceSearch();
          break;
        default:
          throw new Error('Invalid search mode');
      }

      if (response.success) {
        setResults(response.data.results);
        onResults?.(response.data);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const performSemanticSearch = async (searchQuery) => {
    const response = await fetch('/api/search/semantic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        query: searchQuery,
        options: {
          filters,
          includeMetadata: true,
          maxResults: 20
        }
      })
    });
    return await response.json();
  };

  const performVisualSearch = async () => {
    if (!uploadedImage) throw new Error('No image uploaded');

    const formData = new FormData();
    formData.append('image', uploadedImage);
    formData.append('options', JSON.stringify({ filters }));

    const response = await fetch('/api/search/visual', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    return await response.json();
  };

  const performVoiceSearch = async () => {
    if (audioChunksRef.current.length === 0) throw new Error('No audio recorded');

    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
    const formData = new FormData();
    formData.append('audio', audioBlob, 'voice-search.wav');
    formData.append('options', JSON.stringify({ filters }));

    const response = await fetch('/api/search/voice', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    return await response.json();
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        performSearch('', 'voice');
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Microphone access denied or not available');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedImage(file);
      setSearchMode('visual');
    }
  };

  const clearImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const searchModes = [
    { id: 'text', label: 'Text', icon: Search, description: 'Search with keywords' },
    { id: 'semantic', label: 'Smart', icon: Sparkles, description: 'Natural language search' },
    { id: 'visual', label: 'Visual', icon: Camera, description: 'Search by image' },
    { id: 'voice', label: 'Voice', icon: Mic, description: 'Search by speaking' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Enhanced Search</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search Mode Tabs */}
          <div className="flex space-x-2">
            {searchModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  onClick={() => setSearchMode(mode.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    searchMode === mode.id
                      ? 'bg-white text-orange-500 shadow-sm'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{mode.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Interface */}
        <div className="p-6">
          {/* Text/Semantic Search */}
          {(searchMode === 'text' || searchMode === 'semantic') && (
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {searchMode === 'semantic' ? (
                    <Sparkles className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Search className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && performSearch()}
                  placeholder={
                    searchMode === 'semantic'
                      ? 'Describe what you\'re looking for in natural language...'
                      : 'Search for artwork, creators, or collections...'
                  }
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                />
                <button
                  onClick={() => performSearch()}
                  disabled={loading || !query}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                  ) : (
                    <Search className="h-5 w-5 text-orange-500 hover:text-orange-600" />
                  )}
                </button>
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Suggestions</h4>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(suggestion);
                          performSearch(suggestion);
                        }}
                        className="px-3 py-1 bg-white text-gray-700 rounded-full text-sm hover:bg-orange-100 hover:text-orange-700 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Visual Search */}
          {searchMode === 'visual' && (
            <div className="space-y-4">
              {!uploadedImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Upload an image to search</h3>
                  <p className="text-gray-500 mb-4">Find similar artwork by uploading an image</p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Image</span>
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(uploadedImage)}
                      alt="Uploaded"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={clearImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => performSearch()}
                    disabled={loading}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Camera className="w-5 h-5" />
                    )}
                    <span>{loading ? 'Searching...' : 'Search by Image'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Voice Search */}
          {searchMode === 'voice' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 transition-all ${
                  isRecording 
                    ? 'bg-red-500 animate-pulse' 
                    : 'bg-orange-500 hover:bg-orange-600'
                }`}>
                  {loading ? (
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  ) : (
                    <Mic className="w-8 h-8 text-white" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {isRecording ? 'Listening...' : loading ? 'Processing...' : 'Voice Search'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {isRecording 
                    ? 'Speak now to describe what you\'re looking for'
                    : loading
                    ? 'Converting speech to search...'
                    : 'Click the microphone and describe what you want to find'
                  }
                </p>
                <button
                  onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                  disabled={loading}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    isRecording
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  } disabled:opacity-50`}
                >
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filters</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">All Categories</option>
                <option value="digital_art">Digital Art</option>
                <option value="photography">Photography</option>
                <option value="painting">Painting</option>
                <option value="sculpture">Sculpture</option>
              </select>
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">Any Price</option>
                <option value="0-100">0-100 MACS</option>
                <option value="100-500">100-500 MACS</option>
                <option value="500+">500+ MACS</option>
              </select>
              <select
                value={filters.chain}
                onChange={(e) => setFilters({...filters, chain: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">All Chains</option>
                <option value="polygon">Polygon</option>
                <option value="solana">Solana</option>
                <option value="xrp">XRP</option>
                <option value="xdc">XDC</option>
              </select>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="relevance">Relevance</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Search Results ({results.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {results.map((item) => (
                  <SearchResultCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SearchResultCard = ({ item }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square">
        <img
          src={item.image || '/api/placeholder/200/200'}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <h4 className="font-medium text-gray-900 line-clamp-1">{item.title}</h4>
        <p className="text-sm text-gray-600 line-clamp-1">{item.creator}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-semibold text-orange-500">{item.price} MACS</span>
          {item.confidence && (
            <span className="text-xs text-gray-500">
              {Math.round(item.confidence * 100)}% match
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedSearch;

