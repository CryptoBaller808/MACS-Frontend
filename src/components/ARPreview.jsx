/**
 * MACS AR Preview Component - Phase 7
 * Mobile AR experience for "Preview in My Space" functionality
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, 
  Scan, 
  Move3D, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut,
  Settings, 
  Share2, 
  Download,
  Eye,
  Target,
  Grid3X3,
  Ruler,
  Lightbulb,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  SkipBack
} from 'lucide-react';

const ARPreview = ({ artworkId, galleryId, onPlacement, onShare }) => {
  // State management
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [arSession, setArSession] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [placedObjects, setPlacedObjects] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [arMode, setArMode] = useState('placement'); // 'placement', 'viewing', 'measuring'
  const [showGrid, setShowGrid] = useState(true);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [lightingMode, setLightingMode] = useState('auto');
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0, z: -2 });
  const [deviceCapabilities, setDeviceCapabilities] = useState({});
  const [trackingQuality, setTrackingQuality] = useState('good');

  // Refs for AR functionality
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const arContextRef = useRef(null);
  const anchorsRef = useRef(new Map());
  const gestureRef = useRef(null);

  // AR configuration
  const arConfig = {
    requiredFeatures: ['hit-test', 'local-floor'],
    optionalFeatures: ['light-estimation', 'anchors', 'plane-detection'],
    environmentBlendMode: 'alpha-blend',
    interactionMode: 'world-space'
  };

  // Load artwork data
  useEffect(() => {
    loadArtwork();
    checkDeviceCapabilities();
  }, [artworkId]);

  // Initialize AR when component mounts
  useEffect(() => {
    if (artwork && deviceCapabilities.arSupported) {
      initializeAR();
    }
    return () => {
      cleanup();
    };
  }, [artwork, deviceCapabilities]);

  const loadArtwork = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/artworks/${artworkId}`);
      const data = await response.json();

      if (data.success) {
        setArtwork(data.artwork);
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

  const checkDeviceCapabilities = async () => {
    const capabilities = {
      arSupported: false,
      webXRSupported: false,
      cameraAccess: false,
      motionSensors: false,
      lightEstimation: false,
      planeDetection: false,
      hitTesting: false,
      anchors: false
    };

    // Check WebXR support
    if (navigator.xr) {
      try {
        capabilities.webXRSupported = true;
        capabilities.arSupported = await navigator.xr.isSessionSupported('immersive-ar');
      } catch (error) {
        console.log('WebXR not fully supported:', error);
      }
    }

    // Check camera access
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        capabilities.cameraAccess = true;
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.log('Camera access denied:', error);
      }
    }

    // Check motion sensors
    if (window.DeviceMotionEvent) {
      capabilities.motionSensors = true;
    }

    // Check for iOS ARKit support
    if (window.DeviceMotionEvent && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
      capabilities.arSupported = true;
      capabilities.planeDetection = true;
      capabilities.hitTesting = true;
      capabilities.anchors = true;
    }

    // Check for Android ARCore support
    if (window.DeviceMotionEvent && /Android/.test(navigator.userAgent)) {
      capabilities.arSupported = true;
      capabilities.planeDetection = true;
      capabilities.hitTesting = true;
    }

    setDeviceCapabilities(capabilities);
  };

  const initializeAR = async () => {
    try {
      if (deviceCapabilities.webXRSupported) {
        await initializeWebXR();
      } else {
        await initializeFallbackAR();
      }
    } catch (error) {
      console.error('AR initialization error:', error);
      setError('Failed to initialize AR. Please check camera permissions.');
    }
  };

  const initializeWebXR = async () => {
    try {
      const session = await navigator.xr.requestSession('immersive-ar', arConfig);
      setArSession(session);

      // Set up WebXR session
      session.addEventListener('end', () => {
        setArSession(null);
        setIsTracking(false);
      });

      // Initialize hit testing
      const hitTestSource = await session.requestHitTestSource({ space: 'viewer' });
      
      // Start tracking
      setIsTracking(true);
      
      // Track AR session start
      await trackInteraction({
        type: 'ar_session_start',
        target: artworkId,
        metadata: { 
          sessionType: 'webxr',
          capabilities: deviceCapabilities
        }
      });

    } catch (error) {
      console.error('WebXR initialization error:', error);
      throw error;
    }
  };

  const initializeFallbackAR = async () => {
    try {
      // Get camera stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Initialize canvas for AR overlay
      if (canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        arContextRef.current = context;
      }

      setIsTracking(true);

      // Start motion tracking for fallback AR
      if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleDeviceOrientation);
      }

      // Track AR session start
      await trackInteraction({
        type: 'ar_session_start',
        target: artworkId,
        metadata: { 
          sessionType: 'fallback',
          capabilities: deviceCapabilities
        }
      });

    } catch (error) {
      console.error('Fallback AR initialization error:', error);
      throw error;
    }
  };

  const handleDeviceOrientation = (event) => {
    // Simple orientation tracking for fallback AR
    const { alpha, beta, gamma } = event;
    
    // Update tracking quality based on motion stability
    const motionIntensity = Math.abs(beta) + Math.abs(gamma);
    if (motionIntensity < 5) {
      setTrackingQuality('excellent');
    } else if (motionIntensity < 15) {
      setTrackingQuality('good');
    } else {
      setTrackingQuality('poor');
    }
  };

  const placeArtwork = useCallback(async (hitPosition) => {
    try {
      const placedObject = {
        id: `placed_${Date.now()}`,
        artworkId,
        position: hitPosition,
        rotation: rotation,
        scale: scale,
        anchor: null,
        timestamp: new Date().toISOString()
      };

      // Create spatial anchor if supported
      if (arSession && deviceCapabilities.anchors) {
        try {
          const anchor = await arSession.createAnchor(hitPosition);
          placedObject.anchor = anchor;
          anchorsRef.current.set(placedObject.id, anchor);
        } catch (error) {
          console.log('Anchor creation failed, using position tracking:', error);
        }
      }

      setPlacedObjects(prev => [...prev, placedObject]);
      setSelectedObject(placedObject);

      // Track placement
      await trackInteraction({
        type: 'artwork_placement',
        target: artworkId,
        position: hitPosition,
        metadata: {
          scale,
          rotation,
          trackingQuality,
          hasAnchor: !!placedObject.anchor
        }
      });

      if (onPlacement) {
        onPlacement(placedObject);
      }

    } catch (error) {
      console.error('Place artwork error:', error);
    }
  }, [artworkId, scale, rotation, arSession, deviceCapabilities, trackingQuality, onPlacement]);

  const handleScreenTap = useCallback(async (event) => {
    if (arMode !== 'placement' || !isTracking) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convert screen coordinates to world position
    const normalizedX = (x / rect.width) * 2 - 1;
    const normalizedY = -(y / rect.height) * 2 + 1;

    // For fallback AR, use simple depth estimation
    const worldPosition = {
      x: normalizedX * 2,
      y: 0,
      z: -2
    };

    await placeArtwork(worldPosition);
  }, [arMode, isTracking, placeArtwork]);

  const adjustScale = (delta) => {
    const newScale = Math.max(0.1, Math.min(5.0, scale + delta));
    setScale(newScale);
    
    if (selectedObject) {
      updateSelectedObject({ scale: newScale });
    }
  };

  const adjustRotation = (delta) => {
    const newRotation = (rotation + delta) % 360;
    setRotation(newRotation);
    
    if (selectedObject) {
      updateSelectedObject({ rotation: newRotation });
    }
  };

  const updateSelectedObject = (updates) => {
    setPlacedObjects(prev => 
      prev.map(obj => 
        obj.id === selectedObject.id 
          ? { ...obj, ...updates }
          : obj
      )
    );
    setSelectedObject(prev => ({ ...prev, ...updates }));
  };

  const removeSelectedObject = () => {
    if (selectedObject) {
      // Remove anchor if it exists
      const anchor = anchorsRef.current.get(selectedObject.id);
      if (anchor) {
        anchor.delete();
        anchorsRef.current.delete(selectedObject.id);
      }

      setPlacedObjects(prev => prev.filter(obj => obj.id !== selectedObject.id));
      setSelectedObject(null);
    }
  };

  const captureARPhoto = async () => {
    try {
      if (canvasRef.current) {
        // Capture the AR scene
        const dataURL = canvasRef.current.toDataURL('image/png');
        
        // Create download link
        const link = document.createElement('a');
        link.download = `ar-preview-${artwork.title}-${Date.now()}.png`;
        link.href = dataURL;
        link.click();

        // Track photo capture
        await trackInteraction({
          type: 'ar_photo_capture',
          target: artworkId,
          metadata: {
            placedObjects: placedObjects.length,
            trackingQuality
          }
        });
      }
    } catch (error) {
      console.error('Capture AR photo error:', error);
    }
  };

  const shareARExperience = async () => {
    try {
      const shareData = {
        title: `AR Preview: ${artwork.title}`,
        text: `Check out this artwork in AR! ${artwork.description}`,
        url: window.location.href
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }

      // Track share
      await trackInteraction({
        type: 'ar_share',
        target: artworkId,
        metadata: { method: navigator.share ? 'native' : 'clipboard' }
      });

      if (onShare) {
        onShare(shareData);
      }

    } catch (error) {
      console.error('Share AR experience error:', error);
    }
  };

  const trackInteraction = async (interactionData) => {
    try {
      const response = await fetch('/api/spatial/interactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...interactionData,
          galleryId,
          sessionId: arSession?.id,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        console.error('Failed to track interaction');
      }
    } catch (error) {
      console.error('Track interaction error:', error);
    }
  };

  const cleanup = () => {
    // Clean up AR session
    if (arSession) {
      arSession.end();
    }

    // Clean up camera stream
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }

    // Clean up anchors
    anchorsRef.current.forEach(anchor => {
      if (anchor.delete) anchor.delete();
    });
    anchorsRef.current.clear();

    // Remove event listeners
    window.removeEventListener('deviceorientation', handleDeviceOrientation);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D2691E] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AR preview...</p>
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
              <Camera className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">AR Unavailable</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={initializeAR} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!deviceCapabilities.arSupported) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-gray-400 mb-4">
              <Eye className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">AR Not Supported</h3>
            <p className="text-gray-600 mb-4">
              Your device doesn't support AR features. Please use a compatible mobile device.
            </p>
            <Button variant="outline">View 3D Model</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative w-full h-full min-h-screen bg-black">
      {/* Camera Feed */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
      />

      {/* AR Overlay Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        onClick={handleScreenTap}
        style={{ touchAction: 'none' }}
      />

      {/* AR UI Header */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <Card className="bg-black/50 backdrop-blur-sm text-white border-gray-600">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-white">{artwork.title}</CardTitle>
                <p className="text-sm text-gray-300">by {artwork.artist}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={trackingQuality === 'excellent' ? 'default' : 
                          trackingQuality === 'good' ? 'secondary' : 'destructive'}
                  className="text-xs"
                >
                  <Target className="h-3 w-3 mr-1" />
                  {trackingQuality}
                </Badge>
                <Badge variant="outline" className="text-white border-gray-400">
                  AR Preview
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* AR Controls */}
      <div className="absolute bottom-20 left-4 right-4 z-10">
        <Card className="bg-black/50 backdrop-blur-sm border-gray-600">
          <CardContent className="pt-4">
            {/* Mode Selection */}
            <div className="flex justify-center gap-2 mb-4">
              <Button
                onClick={() => setArMode('placement')}
                variant={arMode === 'placement' ? 'default' : 'outline'}
                size="sm"
                className="text-white border-gray-400"
              >
                <Move3D className="h-4 w-4 mr-1" />
                Place
              </Button>
              <Button
                onClick={() => setArMode('viewing')}
                variant={arMode === 'viewing' ? 'default' : 'outline'}
                size="sm"
                className="text-white border-gray-400"
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button
                onClick={() => setArMode('measuring')}
                variant={arMode === 'measuring' ? 'default' : 'outline'}
                size="sm"
                className="text-white border-gray-400"
              >
                <Ruler className="h-4 w-4 mr-1" />
                Measure
              </Button>
            </div>

            {/* Placement Controls */}
            {arMode === 'placement' && (
              <div className="space-y-3">
                <div className="text-center text-white text-sm mb-2">
                  Tap to place artwork in your space
                </div>
                
                {/* Scale Control */}
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Size</span>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => adjustScale(-0.1)}
                      variant="outline"
                      size="sm"
                      className="text-white border-gray-400"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-white text-sm w-12 text-center">
                      {Math.round(scale * 100)}%
                    </span>
                    <Button
                      onClick={() => adjustScale(0.1)}
                      variant="outline"
                      size="sm"
                      className="text-white border-gray-400"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Rotation Control */}
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Rotation</span>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => adjustRotation(-15)}
                      variant="outline"
                      size="sm"
                      className="text-white border-gray-400"
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <span className="text-white text-sm w-12 text-center">
                      {rotation}°
                    </span>
                    <Button
                      onClick={() => adjustRotation(15)}
                      variant="outline"
                      size="sm"
                      className="text-white border-gray-400"
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Object Management */}
            {selectedObject && (
              <div className="mt-3 pt-3 border-t border-gray-600">
                <div className="flex justify-between items-center">
                  <span className="text-white text-sm">Selected Object</span>
                  <Button
                    onClick={removeSelectedObject}
                    variant="destructive"
                    size="sm"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="flex justify-center gap-3">
          <Button
            onClick={captureARPhoto}
            variant="outline"
            size="lg"
            className="text-white border-gray-400 bg-black/50"
          >
            <Camera className="h-5 w-5" />
          </Button>
          
          <Button
            onClick={shareARExperience}
            variant="outline"
            size="lg"
            className="text-white border-gray-400 bg-black/50"
          >
            <Share2 className="h-5 w-5" />
          </Button>
          
          <Button
            onClick={() => setShowGrid(!showGrid)}
            variant="outline"
            size="lg"
            className="text-white border-gray-400 bg-black/50"
          >
            <Grid3X3 className="h-5 w-5" />
          </Button>
          
          <Button
            onClick={() => setLightingMode(lightingMode === 'auto' ? 'manual' : 'auto')}
            variant="outline"
            size="lg"
            className="text-white border-gray-400 bg-black/50"
          >
            <Lightbulb className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Tracking Status */}
      {!isTracking && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <Card className="bg-black/80 backdrop-blur-sm border-gray-600">
            <CardContent className="pt-6 text-center">
              <div className="text-white mb-4">
                <Scan className="h-12 w-12 mx-auto animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Initializing AR</h3>
              <p className="text-gray-300 mb-4">
                Move your device to scan the environment
              </p>
              <Progress value={50} className="w-48 mx-auto" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Instructions Overlay */}
      {isTracking && placedObjects.length === 0 && arMode === 'placement' && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <Card className="bg-black/70 backdrop-blur-sm border-gray-600">
            <CardContent className="pt-4 text-center">
              <div className="text-white mb-2">
                <Target className="h-8 w-8 mx-auto" />
              </div>
              <p className="text-white text-sm">
                Tap anywhere to place the artwork
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Grid Overlay */}
      {showGrid && isTracking && (
        <div className="absolute inset-0 pointer-events-none z-5">
          <svg className="w-full h-full">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default ARPreview;

