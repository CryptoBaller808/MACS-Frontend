/**
 * MACS Immersive Marketplace Component - Phase 7
 * AR/VR marketplace for NFT purchases with gesture-based interactions
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ShoppingCart, 
  Wallet, 
  CreditCard, 
  Eye, 
  Hand, 
  Zap,
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Star,
  Heart,
  Share2,
  Download,
  Fingerprint,
  Lock,
  Unlock,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Move3D,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

const ImmersiveMarketplace = ({ 
  artworkId, 
  galleryId, 
  mode = 'ar', // 'ar', 'vr', 'web'
  onPurchaseComplete,
  onClose 
}) => {
  // State management
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchaseStep, setPurchaseStep] = useState('preview'); // 'preview', 'wallet', 'confirm', 'processing', 'complete'
  const [selectedChain, setSelectedChain] = useState('polygon');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletBalance, setWalletBalance] = useState({});
  const [gestureMode, setGestureMode] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const [error, setError] = useState(null);
  const [immersiveView, setImmersiveView] = useState(true);
  const [priceHistory, setPriceHistory] = useState([]);
  const [similarArtworks, setSimilarArtworks] = useState([]);
  const [userInteractions, setUserInteractions] = useState({
    viewTime: 0,
    gestureCount: 0,
    rotations: 0,
    zooms: 0
  });

  // Refs for gesture tracking
  const gestureRef = useRef(null);
  const interactionTimerRef = useRef(null);
  const biometricRef = useRef(null);

  // Supported chains and their configurations
  const supportedChains = {
    polygon: {
      name: 'Polygon',
      symbol: 'MATIC',
      icon: '🔷',
      color: '#8247E5',
      gasEstimate: 0.001,
      confirmationTime: '2-5 seconds'
    },
    solana: {
      name: 'Solana',
      symbol: 'SOL',
      icon: '🌟',
      color: '#00D4AA',
      gasEstimate: 0.00025,
      confirmationTime: '1-2 seconds'
    },
    xrp: {
      name: 'XRP Ledger',
      symbol: 'XRP',
      icon: '💧',
      color: '#23292F',
      gasEstimate: 0.00001,
      confirmationTime: '3-5 seconds'
    },
    xdc: {
      name: 'XDC Network',
      symbol: 'XDC',
      icon: '⚡',
      color: '#F7931A',
      gasEstimate: 0.0001,
      confirmationTime: '2-3 seconds'
    }
  };

  // Gesture commands for immersive interaction
  const gestureCommands = {
    'point_select': 'Point to select artwork',
    'pinch_zoom': 'Pinch to zoom in/out',
    'rotate_hand': 'Rotate hand to rotate artwork',
    'swipe_left': 'Swipe left for previous',
    'swipe_right': 'Swipe right for next',
    'palm_open': 'Open palm to show details',
    'fist_close': 'Close fist to hide UI',
    'thumbs_up': 'Thumbs up to like',
    'peace_sign': 'Peace sign to share'
  };

  // Initialize component
  useEffect(() => {
    loadArtwork();
    initializeGestureTracking();
    checkWalletConnection();
    startInteractionTimer();

    return () => {
      cleanup();
    };
  }, [artworkId]);

  // Track user interactions
  useEffect(() => {
    const interval = setInterval(() => {
      setUserInteractions(prev => ({
        ...prev,
        viewTime: prev.viewTime + 1
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadArtwork = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/artworks/${artworkId}`);
      const data = await response.json();

      if (data.success) {
        setArtwork(data.artwork);
        
        // Load additional marketplace data
        await Promise.all([
          loadPriceHistory(artworkId),
          loadSimilarArtworks(artworkId),
          trackArtworkView(artworkId)
        ]);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to load artwork');
      console.error('Load artwork error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadPriceHistory = async (artworkId) => {
    try {
      const response = await fetch(`/api/marketplace/price-history/${artworkId}`);
      const data = await response.json();
      if (data.success) {
        setPriceHistory(data.history);
      }
    } catch (error) {
      console.error('Load price history error:', error);
    }
  };

  const loadSimilarArtworks = async (artworkId) => {
    try {
      const response = await fetch(`/api/marketplace/similar/${artworkId}`);
      const data = await response.json();
      if (data.success) {
        setSimilarArtworks(data.artworks);
      }
    } catch (error) {
      console.error('Load similar artworks error:', error);
    }
  };

  const initializeGestureTracking = () => {
    if (mode === 'ar' || mode === 'vr') {
      // Initialize gesture recognition
      if ('MediaDevices' in window && 'getUserMedia' in navigator.mediaDevices) {
        // Hand tracking would be implemented here
        console.log('Gesture tracking initialized for', mode);
      }
    }
  };

  const checkWalletConnection = async () => {
    try {
      // Check if wallet is connected
      const response = await fetch('/api/wallet/status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (data.success && data.connected) {
        setWalletConnected(true);
        setWalletBalance(data.balances);
      }
    } catch (error) {
      console.error('Check wallet connection error:', error);
    }
  };

  const connectWallet = async (chain) => {
    try {
      setLoading(true);
      
      // Connect to specified chain
      const response = await fetch('/api/wallet/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ chain })
      });

      const data = await response.json();

      if (data.success) {
        setWalletConnected(true);
        setWalletBalance(data.balances);
        setSelectedChain(chain);
        
        // Track wallet connection
        await trackInteraction({
          type: 'wallet_connect',
          chain,
          mode
        });
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error('Connect wallet error:', error);
      setError('Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleGesture = useCallback((gestureType, gestureData) => {
    if (!gestureMode) return;

    setUserInteractions(prev => ({
      ...prev,
      gestureCount: prev.gestureCount + 1
    }));

    switch (gestureType) {
      case 'point_select':
        if (purchaseStep === 'preview') {
          setPurchaseStep('wallet');
        }
        break;
      
      case 'pinch_zoom':
        setUserInteractions(prev => ({
          ...prev,
          zooms: prev.zooms + 1
        }));
        // Handle zoom gesture
        break;
      
      case 'rotate_hand':
        setUserInteractions(prev => ({
          ...prev,
          rotations: prev.rotations + 1
        }));
        // Handle rotation gesture
        break;
      
      case 'swipe_left':
        // Navigate to previous artwork
        if (similarArtworks.length > 0) {
          // Implementation for navigation
        }
        break;
      
      case 'swipe_right':
        // Navigate to next artwork
        if (similarArtworks.length > 0) {
          // Implementation for navigation
        }
        break;
      
      case 'palm_open':
        setImmersiveView(false);
        break;
      
      case 'fist_close':
        setImmersiveView(true);
        break;
      
      case 'thumbs_up':
        handleLike();
        break;
      
      case 'peace_sign':
        handleShare();
        break;
      
      default:
        console.log('Unknown gesture:', gestureType);
    }

    // Track gesture
    trackInteraction({
      type: 'gesture',
      gestureType,
      mode,
      artworkId
    });
  }, [gestureMode, purchaseStep, similarArtworks, mode, artworkId]);

  const initiatePurchase = async () => {
    try {
      if (!walletConnected) {
        setPurchaseStep('wallet');
        return;
      }

      // Check if biometric authentication is required
      if (artwork.price > 1000 && 'credentials' in navigator) {
        const authRequired = await requestBiometricAuth();
        if (!authRequired) {
          setError('Biometric authentication required for high-value purchases');
          return;
        }
      }

      setPurchaseStep('confirm');

    } catch (error) {
      console.error('Initiate purchase error:', error);
      setError('Failed to initiate purchase');
    }
  };

  const requestBiometricAuth = async () => {
    try {
      if (!('credentials' in navigator)) {
        return false;
      }

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32),
          rp: { name: 'MACS Platform' },
          user: {
            id: new Uint8Array(16),
            name: 'user@macs.com',
            displayName: 'MACS User'
          },
          pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required'
          }
        }
      });

      setBiometricAuth(true);
      return true;

    } catch (error) {
      console.error('Biometric auth error:', error);
      return false;
    }
  };

  const confirmPurchase = async () => {
    try {
      setPurchaseStep('processing');
      setError(null);

      // Prepare purchase transaction
      const purchaseData = {
        artworkId,
        chain: selectedChain,
        price: artwork.price,
        currency: artwork.currency,
        biometricAuth,
        immersiveMode: mode,
        userInteractions
      };

      const response = await fetch('/api/marketplace/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(purchaseData)
      });

      const data = await response.json();

      if (data.success) {
        setTransactionHash(data.transactionHash);
        setPurchaseStep('complete');

        // Track successful purchase
        await trackInteraction({
          type: 'purchase_complete',
          artworkId,
          chain: selectedChain,
          price: artwork.price,
          transactionHash: data.transactionHash,
          mode
        });

        if (onPurchaseComplete) {
          onPurchaseComplete({
            artwork,
            transactionHash: data.transactionHash,
            chain: selectedChain
          });
        }
      } else {
        setError(data.error);
        setPurchaseStep('confirm');
      }

    } catch (error) {
      console.error('Confirm purchase error:', error);
      setError('Purchase failed. Please try again.');
      setPurchaseStep('confirm');
    }
  };

  const handleLike = async () => {
    try {
      await fetch('/api/artworks/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ artworkId })
      });

      // Track like
      await trackInteraction({
        type: 'like',
        artworkId,
        mode
      });

    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: `${artwork.title} by ${artwork.artist}`,
        text: `Check out this amazing NFT in the MACS immersive marketplace!`,
        url: `${window.location.origin}/marketplace/${artworkId}`
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }

      // Track share
      await trackInteraction({
        type: 'share',
        artworkId,
        mode,
        method: navigator.share ? 'native' : 'clipboard'
      });

    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const trackArtworkView = async (artworkId) => {
    try {
      await fetch('/api/marketplace/track-view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          artworkId,
          mode,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Track artwork view error:', error);
    }
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
          galleryId,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Track interaction error:', error);
    }
  };

  const startInteractionTimer = () => {
    interactionTimerRef.current = setInterval(() => {
      // Track interaction metrics
      trackInteraction({
        type: 'interaction_metrics',
        artworkId,
        metrics: userInteractions,
        mode
      });
    }, 30000); // Every 30 seconds
  };

  const cleanup = () => {
    if (interactionTimerRef.current) {
      clearInterval(interactionTimerRef.current);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D2691E] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading immersive marketplace...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <AlertCircle className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Marketplace Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`w-full h-full ${immersiveView ? 'bg-black text-white' : 'bg-white'}`}>
      {/* Immersive Header */}
      {!immersiveView && (
        <Card className="mb-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Immersive Marketplace
                <Badge variant="secondary">{mode.toUpperCase()}</Badge>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={gestureMode ? 'default' : 'outline'}>
                  <Hand className="h-3 w-3 mr-1" />
                  Gestures {gestureMode ? 'On' : 'Off'}
                </Badge>
                <Button
                  onClick={onClose}
                  variant="outline"
                  size="sm"
                >
                  Close
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Artwork Display */}
        <div className="space-y-4">
          <Card className={immersiveView ? 'bg-gray-900 border-gray-700' : ''}>
            <CardContent className="pt-6">
              {/* Artwork Image */}
              <div className="relative mb-4">
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
                
                {/* Immersive Controls Overlay */}
                {mode !== 'web' && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="bg-black/50 rounded-lg p-4 text-white text-center">
                      <Move3D className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Use gestures to interact</p>
                    </div>
                  </div>
                )}

                {/* Interaction Indicators */}
                {userInteractions.gestureCount > 0 && (
                  <div className="absolute top-2 right-2 bg-[#D2691E] text-white px-2 py-1 rounded text-xs">
                    {userInteractions.gestureCount} gestures
                  </div>
                )}
              </div>

              {/* Artwork Info */}
              <div className="space-y-3">
                <div>
                  <h2 className={`text-2xl font-bold ${immersiveView ? 'text-white' : ''}`}>
                    {artwork.title}
                  </h2>
                  <p className={`text-lg ${immersiveView ? 'text-gray-300' : 'text-gray-600'}`}>
                    by {artwork.artist}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-[#D2691E]">
                    {artwork.price} {artwork.currency}
                  </div>
                  <Badge variant="outline">
                    {supportedChains[selectedChain]?.icon} {supportedChains[selectedChain]?.name}
                  </Badge>
                </div>

                <p className={`${immersiveView ? 'text-gray-300' : 'text-gray-600'}`}>
                  {artwork.description}
                </p>

                {/* Artwork Stats */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{artwork.views || 0} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{artwork.likes || 0} likes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{userInteractions.viewTime}s viewing</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gesture Commands */}
          {mode !== 'web' && gestureMode && !immersiveView && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Hand className="h-4 w-4" />
                  Gesture Commands
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(gestureCommands).slice(0, 6).map(([gesture, description]) => (
                    <div key={gesture} className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {gesture.replace('_', ' ')}
                      </Badge>
                      <span className="text-gray-600">{description}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Purchase Flow */}
        <div className="space-y-4">
          {/* Purchase Steps */}
          {purchaseStep === 'preview' && (
            <Card className={immersiveView ? 'bg-gray-900 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${immersiveView ? 'text-white' : ''}`}>
                  <Eye className="h-5 w-5" />
                  Artwork Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className={`mb-4 ${immersiveView ? 'text-gray-300' : 'text-gray-600'}`}>
                      {mode === 'web' ? 'Click to purchase this NFT' : 'Point to purchase this NFT'}
                    </p>
                    <Button
                      onClick={initiatePurchase}
                      className="bg-[#D2691E] hover:bg-[#B8860B] text-white px-8 py-3 text-lg"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Purchase NFT
                    </Button>
                  </div>

                  {/* Price History */}
                  {priceHistory.length > 0 && (
                    <div className="mt-6">
                      <h4 className={`font-semibold mb-2 ${immersiveView ? 'text-white' : ''}`}>
                        Price History
                      </h4>
                      <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-8 w-8 text-gray-400" />
                        <span className="ml-2 text-gray-500">Price chart</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Wallet Connection */}
          {purchaseStep === 'wallet' && (
            <Card className={immersiveView ? 'bg-gray-900 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${immersiveView ? 'text-white' : ''}`}>
                  <Wallet className="h-5 w-5" />
                  Connect Wallet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className={`${immersiveView ? 'text-gray-300' : 'text-gray-600'}`}>
                    Choose your preferred blockchain network:
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(supportedChains).map(([chainId, chain]) => (
                      <Button
                        key={chainId}
                        onClick={() => connectWallet(chainId)}
                        variant={selectedChain === chainId ? 'default' : 'outline'}
                        className="h-16 flex flex-col items-center justify-center"
                        style={{
                          backgroundColor: selectedChain === chainId ? chain.color : undefined
                        }}
                      >
                        <span className="text-lg mb-1">{chain.icon}</span>
                        <span className="text-sm">{chain.name}</span>
                        <span className="text-xs opacity-75">{chain.confirmationTime}</span>
                      </Button>
                    ))}
                  </div>

                  {walletConnected && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Wallet connected successfully</span>
                      </div>
                      <div className="mt-2 text-sm text-green-600">
                        Balance: {walletBalance[selectedChain] || '0'} {supportedChains[selectedChain]?.symbol}
                      </div>
                    </div>
                  )}

                  {walletConnected && (
                    <Button
                      onClick={() => setPurchaseStep('confirm')}
                      className="w-full bg-[#D2691E] hover:bg-[#B8860B]"
                    >
                      Continue to Purchase
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Purchase Confirmation */}
          {purchaseStep === 'confirm' && (
            <Card className={immersiveView ? 'bg-gray-900 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${immersiveView ? 'text-white' : ''}`}>
                  <Shield className="h-5 w-5" />
                  Confirm Purchase
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Purchase Summary */}
                  <div className={`p-4 rounded-lg ${immersiveView ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Artwork:</span>
                        <span className="font-semibold">{artwork.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price:</span>
                        <span className="font-semibold">{artwork.price} {artwork.currency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Network:</span>
                        <span>{supportedChains[selectedChain]?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gas Fee:</span>
                        <span>~{supportedChains[selectedChain]?.gasEstimate} {supportedChains[selectedChain]?.symbol}</span>
                      </div>
                      <hr className={immersiveView ? 'border-gray-700' : 'border-gray-200'} />
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>{artwork.price} {artwork.currency}</span>
                      </div>
                    </div>
                  </div>

                  {/* Biometric Authentication */}
                  {artwork.price > 1000 && (
                    <div className={`p-3 rounded-lg ${immersiveView ? 'bg-blue-900' : 'bg-blue-50'} border border-blue-200`}>
                      <div className="flex items-center gap-2 text-blue-700">
                        <Fingerprint className="h-4 w-4" />
                        <span className="text-sm">
                          {biometricAuth ? 'Biometric authentication verified' : 'Biometric authentication required for high-value purchases'}
                        </span>
                        {biometricAuth && <CheckCircle className="h-4 w-4 text-green-500" />}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={() => setPurchaseStep('wallet')}
                      variant="outline"
                      className="flex-1"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={confirmPurchase}
                      className="flex-1 bg-[#D2691E] hover:bg-[#B8860B]"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Confirm Purchase
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Processing */}
          {purchaseStep === 'processing' && (
            <Card className={immersiveView ? 'bg-gray-900 border-gray-700' : ''}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D2691E] mx-auto mb-4"></div>
                  <h3 className={`text-lg font-semibold mb-2 ${immersiveView ? 'text-white' : ''}`}>
                    Processing Purchase
                  </h3>
                  <p className={`${immersiveView ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                    Your transaction is being processed on the {supportedChains[selectedChain]?.name} network
                  </p>
                  <Progress value={66} className="w-48 mx-auto" />
                  <p className={`text-sm mt-2 ${immersiveView ? 'text-gray-400' : 'text-gray-500'}`}>
                    Estimated time: {supportedChains[selectedChain]?.confirmationTime}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Purchase Complete */}
          {purchaseStep === 'complete' && (
            <Card className={immersiveView ? 'bg-gray-900 border-gray-700' : ''}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-green-500 mb-4">
                    <CheckCircle className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${immersiveView ? 'text-white' : ''}`}>
                    Purchase Successful!
                  </h3>
                  <p className={`${immersiveView ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                    You now own "{artwork.title}" by {artwork.artist}
                  </p>
                  
                  {transactionHash && (
                    <div className={`p-3 rounded-lg ${immersiveView ? 'bg-gray-800' : 'bg-gray-50'} mb-4`}>
                      <p className="text-sm font-medium mb-1">Transaction Hash:</p>
                      <p className="text-xs font-mono break-all">{transactionHash}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={() => window.open(`/nft/${artwork.id}`, '_blank')}
                      variant="outline"
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View NFT
                    </Button>
                    <Button
                      onClick={handleShare}
                      variant="outline"
                      className="flex-1"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Similar Artworks */}
          {similarArtworks.length > 0 && purchaseStep === 'preview' && (
            <Card className={immersiveView ? 'bg-gray-900 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className={`text-sm ${immersiveView ? 'text-white' : ''}`}>
                  Similar Artworks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {similarArtworks.slice(0, 4).map((similar, index) => (
                    <div key={index} className="text-center">
                      <img
                        src={similar.imageUrl}
                        alt={similar.title}
                        className="w-full h-20 object-cover rounded mb-2"
                      />
                      <p className={`text-xs ${immersiveView ? 'text-gray-300' : 'text-gray-600'}`}>
                        {similar.title}
                      </p>
                      <p className="text-xs text-[#D2691E] font-semibold">
                        {similar.price} {similar.currency}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Immersive Mode Toggle */}
      {mode !== 'web' && (
        <Button
          onClick={() => setImmersiveView(!immersiveView)}
          className="fixed bottom-4 right-4 z-50"
          variant={immersiveView ? 'default' : 'outline'}
        >
          {immersiveView ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
        </Button>
      )}
    </div>
  );
};

export default ImmersiveMarketplace;

