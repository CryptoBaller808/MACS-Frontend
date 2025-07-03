/**
 * MACS Virtual Gallery Component - Phase 7
 * Immersive AR/VR gallery experience with WebXR integration
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Eye, 
  Headphones, 
  Navigation, 
  Settings, 
  Share2, 
  Heart, 
  ShoppingCart,
  Maximize,
  Minimize,
  RotateCcw,
  Move3D,
  Zap,
  Users,
  Clock,
  Star,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';

const VirtualGallery = ({ galleryId, mode = 'web', onPurchase, onShare }) => {
  // State management
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [xrSession, setXrSession] = useState(null);
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 1.6, z: 5 });
  const [currentRotation, setCurrentRotation] = useState({ x: 0, y: 0, z: 0 });
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [tourMode, setTourMode] = useState(false);
  const [tourProgress, setTourProgress] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [immersiveMode, setImmersiveMode] = useState(false);
  const [interactions, setInteractions] = useState([]);
  const [performance, setPerformance] = useState({ fps: 60, latency: 0 });

  // Refs for 3D rendering and XR
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const xrManagerRef = useRef(null);

  // Gallery templates for rendering
  const galleryTemplates = {
    modern: {
      backgroundColor: '#f8f9fa',
      wallColor: '#ffffff',
      floorColor: '#e9ecef',
      lighting: 'bright',
      ambientIntensity: 0.6
    },
    industrial: {
      backgroundColor: '#2c3e50',
      wallColor: '#8B4513',
      floorColor: '#34495e',
      lighting: 'dramatic',
      ambientIntensity: 0.3
    },
    classical: {
      backgroundColor: '#f5f5dc',
      wallColor: '#F5F5DC',
      floorColor: '#deb887',
      lighting: 'warm',
      ambientIntensity: 0.5
    },
    futuristic: {
      backgroundColor: '#0a0a0a',
      wallColor: '#1a1a1a',
      floorColor: '#2a2a2a',
      lighting: 'neon',
      ambientIntensity: 0.2
    },
    nature: {
      backgroundColor: '#8FBC8F',
      wallColor: '#8FBC8F',
      floorColor: '#654321',
      lighting: 'natural',
      ambientIntensity: 0.7
    }
  };

  // Load gallery data
  useEffect(() => {
    loadGallery();
  }, [galleryId]);

  // Initialize 3D scene
  useEffect(() => {
    if (gallery && canvasRef.current) {
      initializeScene();
    }
    return () => {
      cleanup();
    };
  }, [gallery]);

  // XR session management
  useEffect(() => {
    if (mode === 'vr' || mode === 'ar') {
      initializeXR();
    }
  }, [mode]);

  const loadGallery = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/spatial/galleries/${galleryId}`);
      const data = await response.json();

      if (data.success) {
        setGallery(data.gallery);
        // Track gallery visit
        await trackInteraction({
          type: 'gallery_visit',
          target: galleryId,
          position: currentPosition
        });
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to load gallery');
      console.error('Load gallery error:', err);
    } finally {
      setLoading(false);
    }
  };

  const initializeScene = () => {
    if (!window.THREE) {
      // Fallback for when Three.js is not available
      console.warn('Three.js not available, using 2D fallback');
      return;
    }

    try {
      // Create scene
      const scene = new THREE.Scene();
      const template = galleryTemplates[gallery.template.id] || galleryTemplates.modern;
      scene.background = new THREE.Color(template.backgroundColor);

      // Create camera
      const camera = new THREE.PerspectiveCamera(
        75,
        canvasRef.current.clientWidth / canvasRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.set(currentPosition.x, currentPosition.y, currentPosition.z);

      // Create renderer
      const renderer = new THREE.WebGLRenderer({ 
        canvas: canvasRef.current,
        antialias: true,
        alpha: true
      });
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.xr.enabled = true;

      // Create gallery environment
      createGalleryEnvironment(scene, template);
      
      // Add artworks
      addArtworksToScene(scene);

      // Add lighting
      addLighting(scene, template);

      // Create controls
      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.maxPolarAngle = Math.PI / 2;
      controls.minDistance = 1;
      controls.maxDistance = 50;

      // Store references
      sceneRef.current = scene;
      rendererRef.current = renderer;
      cameraRef.current = camera;
      controlsRef.current = controls;

      // Start render loop
      startRenderLoop();

    } catch (error) {
      console.error('Scene initialization error:', error);
      setError('Failed to initialize 3D scene');
    }
  };

  const createGalleryEnvironment = (scene, template) => {
    const dimensions = gallery.template.dimensions;

    // Create floor
    const floorGeometry = new THREE.PlaneGeometry(dimensions.width, dimensions.depth);
    const floorMaterial = new THREE.MeshLambertMaterial({ 
      color: template.floorColor,
      side: THREE.DoubleSide
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Create walls
    const wallHeight = dimensions.height;
    const wallMaterial = new THREE.MeshLambertMaterial({ color: template.wallColor });

    // North wall
    const northWall = new THREE.Mesh(
      new THREE.PlaneGeometry(dimensions.width, wallHeight),
      wallMaterial
    );
    northWall.position.set(0, wallHeight / 2, -dimensions.depth / 2);
    northWall.receiveShadow = true;
    scene.add(northWall);

    // South wall
    const southWall = new THREE.Mesh(
      new THREE.PlaneGeometry(dimensions.width, wallHeight),
      wallMaterial
    );
    southWall.position.set(0, wallHeight / 2, dimensions.depth / 2);
    southWall.rotation.y = Math.PI;
    southWall.receiveShadow = true;
    scene.add(southWall);

    // East wall
    const eastWall = new THREE.Mesh(
      new THREE.PlaneGeometry(dimensions.depth, wallHeight),
      wallMaterial
    );
    eastWall.position.set(dimensions.width / 2, wallHeight / 2, 0);
    eastWall.rotation.y = -Math.PI / 2;
    eastWall.receiveShadow = true;
    scene.add(eastWall);

    // West wall
    const westWall = new THREE.Mesh(
      new THREE.PlaneGeometry(dimensions.depth, wallHeight),
      wallMaterial
    );
    westWall.position.set(-dimensions.width / 2, wallHeight / 2, 0);
    westWall.rotation.y = Math.PI / 2;
    westWall.receiveShadow = true;
    scene.add(westWall);

    // Add ceiling if needed
    if (gallery.template.features?.includes('ceiling')) {
      const ceiling = new THREE.Mesh(
        new THREE.PlaneGeometry(dimensions.width, dimensions.depth),
        new THREE.MeshLambertMaterial({ color: template.wallColor })
      );
      ceiling.position.y = wallHeight;
      ceiling.rotation.x = Math.PI / 2;
      scene.add(ceiling);
    }
  };

  const addArtworksToScene = (scene) => {
    gallery.artworks.forEach((artwork, index) => {
      // Create artwork frame
      const frameGeometry = new THREE.BoxGeometry(
        artwork.scale?.x || 2,
        artwork.scale?.y || 1.5,
        0.1
      );
      const frameMaterial = new THREE.MeshLambertMaterial({ color: '#8B4513' });
      const frame = new THREE.Mesh(frameGeometry, frameMaterial);

      // Position artwork
      frame.position.set(
        artwork.position.x,
        artwork.position.y,
        artwork.position.z
      );
      frame.rotation.set(
        artwork.rotation.x || 0,
        artwork.rotation.y || 0,
        artwork.rotation.z || 0
      );
      frame.castShadow = true;

      // Add artwork texture if available
      if (artwork.metadata.imageUrl) {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(artwork.metadata.imageUrl, (texture) => {
          const artworkGeometry = new THREE.PlaneGeometry(
            (artwork.scale?.x || 2) - 0.2,
            (artwork.scale?.y || 1.5) - 0.2
          );
          const artworkMaterial = new THREE.MeshLambertMaterial({ 
            map: texture,
            side: THREE.DoubleSide
          });
          const artworkMesh = new THREE.Mesh(artworkGeometry, artworkMaterial);
          artworkMesh.position.z = 0.06;
          artworkMesh.userData = { 
            artworkId: artwork.artworkId,
            metadata: artwork.metadata,
            interactionZone: artwork.interactionZone
          };
          frame.add(artworkMesh);

          // Add click interaction
          artworkMesh.addEventListener = (event, handler) => {
            // Simplified event handling for demo
            if (event === 'click') {
              artworkMesh.onClick = handler;
            }
          };
        });
      }

      // Add information plaque
      const plaqueGeometry = new THREE.PlaneGeometry(1, 0.3);
      const plaqueMaterial = new THREE.MeshLambertMaterial({ color: '#ffffff' });
      const plaque = new THREE.Mesh(plaqueGeometry, plaqueMaterial);
      plaque.position.set(0, -1, 0.1);
      frame.add(plaque);

      // Add to scene
      scene.add(frame);
    });
  };

  const addLighting = (scene, template) => {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, template.ambientIntensity);
    scene.add(ambientLight);

    // Directional light (main lighting)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Spot lights for artworks
    if (gallery.template.features?.includes('spotlights')) {
      gallery.artworks.forEach(artwork => {
        const spotLight = new THREE.SpotLight(0xffffff, 0.5);
        spotLight.position.set(
          artwork.position.x,
          artwork.position.y + 2,
          artwork.position.z + 1
        );
        spotLight.target.position.set(
          artwork.position.x,
          artwork.position.y,
          artwork.position.z
        );
        spotLight.angle = Math.PI / 6;
        spotLight.penumbra = 0.1;
        spotLight.castShadow = true;
        scene.add(spotLight);
        scene.add(spotLight.target);
      });
    }
  };

  const startRenderLoop = () => {
    const animate = () => {
      requestAnimationFrame(animate);

      // Update controls
      if (controlsRef.current) {
        controlsRef.current.update();
      }

      // Update camera position state
      if (cameraRef.current) {
        setCurrentPosition({
          x: cameraRef.current.position.x,
          y: cameraRef.current.position.y,
          z: cameraRef.current.position.z
        });
      }

      // Render scene
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      // Update performance metrics
      updatePerformanceMetrics();
    };

    animate();
  };

  const initializeXR = async () => {
    if (!navigator.xr) {
      setError('WebXR not supported on this device');
      return;
    }

    try {
      const sessionMode = mode === 'vr' ? 'immersive-vr' : 'immersive-ar';
      const isSupported = await navigator.xr.isSessionSupported(sessionMode);

      if (!isSupported) {
        setError(`${mode.toUpperCase()} not supported on this device`);
        return;
      }

      // Initialize XR session
      const session = await navigator.xr.requestSession(sessionMode, {
        requiredFeatures: ['local-floor'],
        optionalFeatures: ['hand-tracking', 'eye-tracking']
      });

      setXrSession(session);

      // Set up XR renderer
      if (rendererRef.current) {
        await rendererRef.current.xr.setSession(session);
        rendererRef.current.setAnimationLoop(renderXR);
      }

      // Track XR session start
      await trackInteraction({
        type: 'xr_session_start',
        target: mode,
        position: currentPosition,
        metadata: { sessionMode }
      });

    } catch (error) {
      console.error('XR initialization error:', error);
      setError(`Failed to initialize ${mode.toUpperCase()}`);
    }
  };

  const renderXR = () => {
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
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
          sessionId: xrSession?.id,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        const result = await response.json();
        setInteractions(prev => [...prev, result.interaction]);
      }
    } catch (error) {
      console.error('Track interaction error:', error);
    }
  };

  const handleArtworkClick = useCallback(async (artwork) => {
    setSelectedArtwork(artwork);
    
    // Track artwork interaction
    await trackInteraction({
      type: 'artwork_view',
      target: artwork.artworkId,
      position: currentPosition,
      duration: 0,
      metadata: artwork.metadata
    });
  }, [currentPosition, galleryId]);

  const handlePurchase = async (artwork) => {
    if (onPurchase) {
      await onPurchase(artwork);
      
      // Track purchase interaction
      await trackInteraction({
        type: 'purchase',
        target: artwork.artworkId,
        position: currentPosition,
        metadata: { price: artwork.metadata.price }
      });
    }
  };

  const startTour = async () => {
    try {
      const response = await fetch(`/api/spatial/tours/${gallery.tourId}/route`);
      const data = await response.json();

      if (data.success) {
        setTourMode(true);
        setTourProgress(0);
        
        // Start automated tour
        animateTourMovement(data.route.waypoints);
      }
    } catch (error) {
      console.error('Start tour error:', error);
    }
  };

  const animateTourMovement = (waypoints) => {
    let currentWaypoint = 0;
    
    const moveToNextWaypoint = () => {
      if (currentWaypoint >= waypoints.length) {
        setTourMode(false);
        setTourProgress(100);
        return;
      }

      const waypoint = waypoints[currentWaypoint];
      
      // Animate camera movement
      if (cameraRef.current && controlsRef.current) {
        const startPos = cameraRef.current.position.clone();
        const endPos = new THREE.Vector3(
          waypoint.position.x,
          waypoint.position.y,
          waypoint.position.z
        );

        const duration = 3000; // 3 seconds
        const startTime = Date.now();

        const animateMovement = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Smooth interpolation
          const currentPos = startPos.clone().lerp(endPos, progress);
          cameraRef.current.position.copy(currentPos);
          controlsRef.current.update();

          if (progress < 1) {
            requestAnimationFrame(animateMovement);
          } else {
            // Play narration if available
            if (waypoint.narration && audioEnabled) {
              playNarration(waypoint.narration);
            }

            // Wait at waypoint
            setTimeout(() => {
              currentWaypoint++;
              setTourProgress((currentWaypoint / waypoints.length) * 100);
              moveToNextWaypoint();
            }, waypoint.duration * 1000);
          }
        };

        animateMovement();
      }
    };

    moveToNextWaypoint();
  };

  const playNarration = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const updatePerformanceMetrics = () => {
    // Simple performance monitoring
    const now = performance.now();
    if (window.lastFrameTime) {
      const fps = 1000 / (now - window.lastFrameTime);
      setPerformance(prev => ({
        ...prev,
        fps: Math.round(fps)
      }));
    }
    window.lastFrameTime = now;
  };

  const cleanup = () => {
    if (rendererRef.current) {
      rendererRef.current.dispose();
    }
    if (xrSession) {
      xrSession.end();
    }
  };

  const toggleImmersiveMode = () => {
    setImmersiveMode(!immersiveMode);
    
    if (!immersiveMode) {
      // Enter fullscreen
      if (canvasRef.current.requestFullscreen) {
        canvasRef.current.requestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D2691E] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading virtual gallery...</p>
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
              <Eye className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Gallery Unavailable</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={loadGallery} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full h-full relative">
      {/* Gallery Header */}
      <div className={`absolute top-4 left-4 right-4 z-10 ${immersiveMode ? 'hidden' : ''}`}>
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{gallery.name}</CardTitle>
                <p className="text-sm text-gray-600">{gallery.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{gallery.template.name}</Badge>
                <Badge variant="outline">
                  <Users className="h-3 w-3 mr-1" />
                  {gallery.analytics.totalVisits}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Gallery Controls */}
      <div className={`absolute top-4 right-4 z-20 ${immersiveMode ? 'hidden' : ''}`}>
        <div className="flex flex-col gap-2">
          <Button
            onClick={toggleImmersiveMode}
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm"
          >
            {immersiveMode ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
          
          {mode === 'web' && (
            <>
              <Button
                onClick={() => initializeXR()}
                variant="outline"
                size="sm"
                className="bg-white/90 backdrop-blur-sm"
              >
                <Eye className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={startTour}
                variant="outline"
                size="sm"
                className="bg-white/90 backdrop-blur-sm"
                disabled={tourMode}
              >
                <Navigation className="h-4 w-4" />
              </Button>
            </>
          )}
          
          <Button
            onClick={() => setAudioEnabled(!audioEnabled)}
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm"
          >
            {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Tour Progress */}
      {tourMode && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Guided Tour</span>
                <span className="text-sm text-gray-600">{Math.round(tourProgress)}%</span>
              </div>
              <Progress value={tourProgress} className="h-2" />
              <div className="flex items-center justify-between mt-2">
                <Button
                  onClick={() => setTourMode(false)}
                  variant="outline"
                  size="sm"
                >
                  <Pause className="h-4 w-4 mr-1" />
                  Stop Tour
                </Button>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Estimated: 15 min</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance Monitor */}
      {mode !== 'web' && (
        <div className="absolute bottom-4 right-4 z-10">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="pt-2 pb-2">
              <div className="text-xs text-gray-600">
                <div>FPS: {performance.fps}</div>
                <div>Latency: {performance.latency}ms</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ minHeight: '600px' }}
      />

      {/* Artwork Detail Modal */}
      {selectedArtwork && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-2xl w-full mx-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedArtwork.metadata.title}</CardTitle>
                <Button
                  onClick={() => setSelectedArtwork(null)}
                  variant="ghost"
                  size="sm"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedArtwork.metadata.imageUrl}
                    alt={selectedArtwork.metadata.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Artist</h4>
                      <p className="text-gray-600">{selectedArtwork.metadata.artist}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Description</h4>
                      <p className="text-gray-600">{selectedArtwork.metadata.description}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Price</h4>
                      <p className="text-lg font-bold text-[#D2691E]">
                        {selectedArtwork.metadata.price} {selectedArtwork.metadata.chain}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handlePurchase(selectedArtwork)}
                        className="flex-1"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Purchase
                      </Button>
                      <Button
                        onClick={() => onShare && onShare(selectedArtwork)}
                        variant="outline"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Fallback for non-WebGL browsers */}
      {!window.WebGLRenderingContext && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <Eye className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">3D Not Supported</h3>
              <p className="text-gray-600 mb-4">
                Your browser doesn't support 3D graphics. Please use a modern browser for the full experience.
              </p>
              <Button variant="outline">View 2D Gallery</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VirtualGallery;

