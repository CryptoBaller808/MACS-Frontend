import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  X, 
  CheckCircle, 
  Circle,
  Lightbulb,
  Target,
  Wallet,
  Users,
  Award,
  Star,
  Zap,
  Heart,
  Calendar,
  Globe,
  Play,
  Pause,
  SkipForward
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Progress } from '@/components/ui/progress.jsx';

const GuidedOnboarding = ({ userType = 'creator', onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  // Onboarding steps for creators
  const creatorSteps = [
    {
      id: 'welcome',
      title: 'Welcome to MACS!',
      description: 'Let\'s get you started on your creative journey. This quick tour will show you everything you need to know.',
      icon: Star,
      target: null,
      position: 'center',
      content: (
        <div className="text-center space-y-4">
          <div className="h-16 w-16 bg-gradient-to-r from-orange-500 to-teal-500 rounded-full flex items-center justify-center mx-auto">
            <Star className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Welcome to MACS!</h2>
          <p className="text-gray-600">The Muse Art Creative Sphere - where artists connect, create, and thrive in Web3.</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Globe className="h-4 w-4" />
            <span>Multichain • Decentralized • Artist-First</span>
          </div>
        </div>
      )
    },
    {
      id: 'profile',
      title: 'Create Your Profile',
      description: 'Set up your artist profile to showcase your work and connect with collectors worldwide.',
      icon: Users,
      target: '.profile-section',
      position: 'bottom',
      content: (
        <div className="space-y-3">
          <h3 className="font-semibold">Your Artist Profile</h3>
          <p className="text-sm text-gray-600">This is where collectors will discover you. Make it shine!</p>
          <ul className="text-sm space-y-1">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Upload a professional profile photo
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Write a compelling bio
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Add your social media links
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'wallet',
      title: 'Connect Your Wallet',
      description: 'Connect your multichain wallet to start earning MACS tokens and manage your assets.',
      icon: Wallet,
      target: '.wallet-connect',
      position: 'bottom',
      content: (
        <div className="space-y-3">
          <h3 className="font-semibold">Multichain Wallet Support</h3>
          <p className="text-sm text-gray-600">MACS supports multiple blockchains for maximum flexibility.</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
              <span>Polygon</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 bg-cyan-500 rounded-full"></div>
              <span>Solana</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span>XRP</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
              <span>XDC</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'marketplace',
      title: 'Explore the Marketplace',
      description: 'Discover how to mint, list, and sell your NFTs to collectors around the world.',
      icon: Award,
      target: '.marketplace-section',
      position: 'top',
      content: (
        <div className="space-y-3">
          <h3 className="font-semibold">NFT Marketplace</h3>
          <p className="text-sm text-gray-600">Your gateway to the global art market.</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>Instant minting on multiple chains</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span>Set your own prices and royalties</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-green-500" />
              <span>Reach collectors worldwide</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'booking',
      title: 'Accept Bookings',
      description: 'Set up your booking system to accept commissions and custom work requests.',
      icon: Calendar,
      target: '.booking-section',
      position: 'top',
      content: (
        <div className="space-y-3">
          <h3 className="font-semibold">Booking System</h3>
          <p className="text-sm text-gray-600">Secure commission work with escrow protection.</p>
          <div className="bg-green-50 p-3 rounded-lg text-sm">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Secure Payments</span>
            </div>
            <p className="text-green-600 mt-1">All payments are held in escrow until work is completed and approved.</p>
          </div>
        </div>
      )
    },
    {
      id: 'campaigns',
      title: 'Launch Campaigns',
      description: 'Create crowdfunding campaigns to fund your next big artistic project.',
      icon: Target,
      target: '.campaigns-section',
      position: 'top',
      content: (
        <div className="space-y-3">
          <h3 className="font-semibold">Crowdfunding Campaigns</h3>
          <p className="text-sm text-gray-600">Fund your creative projects with community support.</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-pink-500" />
              <span>Build a community of supporters</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-purple-500" />
              <span>Offer exclusive rewards</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>Milestone-based funding</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'complete',
      title: 'You\'re All Set!',
      description: 'Congratulations! You\'re ready to start your journey as a MACS creator.',
      icon: CheckCircle,
      target: null,
      position: 'center',
      content: (
        <div className="text-center space-y-4">
          <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold">You\'re Ready to Create!</h2>
          <p className="text-gray-600">Your MACS journey begins now. Start by setting up your profile and connecting your wallet.</p>
          <div className="bg-gradient-to-r from-orange-50 to-teal-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Quick Start Tips:</h4>
            <ul className="text-sm text-left space-y-1">
              <li>• Complete your profile to attract more collectors</li>
              <li>• Upload your first NFT to the marketplace</li>
              <li>• Set up your booking preferences</li>
              <li>• Join the MACS community on Discord</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  // Onboarding steps for collectors
  const collectorSteps = [
    {
      id: 'welcome',
      title: 'Welcome to MACS!',
      description: 'Discover amazing art and support talented creators in the Web3 ecosystem.',
      icon: Star,
      target: null,
      position: 'center',
      content: (
        <div className="text-center space-y-4">
          <div className="h-16 w-16 bg-gradient-to-r from-orange-500 to-teal-500 rounded-full flex items-center justify-center mx-auto">
            <Star className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Welcome to MACS!</h2>
          <p className="text-gray-600">Discover, collect, and support amazing artists in the multichain ecosystem.</p>
        </div>
      )
    },
    {
      id: 'wallet',
      title: 'Connect Your Wallet',
      description: 'Connect your wallet to start collecting NFTs and supporting artists.',
      icon: Wallet,
      target: '.wallet-connect',
      position: 'bottom',
      content: (
        <div className="space-y-3">
          <h3 className="font-semibold">Your Collector Wallet</h3>
          <p className="text-sm text-gray-600">Manage your collection across multiple blockchains.</p>
        </div>
      )
    },
    {
      id: 'marketplace',
      title: 'Explore Art',
      description: 'Browse the marketplace to discover unique NFTs from talented artists.',
      icon: Award,
      target: '.marketplace-section',
      position: 'top',
      content: (
        <div className="space-y-3">
          <h3 className="font-semibold">Art Marketplace</h3>
          <p className="text-sm text-gray-600">Discover unique pieces from artists worldwide.</p>
        </div>
      )
    },
    {
      id: 'campaigns',
      title: 'Support Campaigns',
      description: 'Back crowdfunding campaigns to support artists\' creative projects.',
      icon: Target,
      target: '.campaigns-section',
      position: 'top',
      content: (
        <div className="space-y-3">
          <h3 className="font-semibold">Support Artists</h3>
          <p className="text-sm text-gray-600">Help fund amazing creative projects.</p>
        </div>
      )
    },
    {
      id: 'complete',
      title: 'Start Collecting!',
      description: 'You\'re ready to start your collecting journey on MACS.',
      icon: CheckCircle,
      target: null,
      position: 'center',
      content: (
        <div className="text-center space-y-4">
          <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Happy Collecting!</h2>
          <p className="text-gray-600">Start exploring and building your unique art collection.</p>
        </div>
      )
    }
  ];

  const steps = userType === 'creator' ? creatorSteps : collectorSteps;
  const currentStepData = steps[currentStep];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    setIsActive(false);
    if (onComplete) onComplete();
  };

  const handleSkip = () => {
    setIsActive(false);
    if (onSkip) onSkip();
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Onboarding Modal */}
      <Card className="relative w-full max-w-lg mx-4 border-0 shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-r from-orange-500 to-teal-500 rounded-lg flex items-center justify-center">
                {currentStepData.icon && <currentStepData.icon className="h-5 w-5 text-white" />}
              </div>
              <div>
                <CardTitle className="text-lg">{currentStepData.title}</CardTitle>
                <p className="text-sm text-gray-600">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Step Content */}
          <div>
            {currentStepData.content}
          </div>
          
          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-orange-500'
                      : completedSteps.has(index)
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button variant="outline" size="sm" onClick={prevStep}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              
              {currentStep < steps.length - 1 ? (
                <Button size="sm" onClick={nextStep} className="bg-gradient-to-r from-orange-500 to-teal-500 hover:from-orange-600 hover:to-teal-600">
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button size="sm" onClick={handleComplete} className="bg-green-500 hover:bg-green-600">
                  Get Started
                  <CheckCircle className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
          
          {/* Skip Option */}
          <div className="text-center pt-2">
            <Button variant="ghost" size="sm" onClick={handleSkip} className="text-gray-500 hover:text-gray-700">
              <SkipForward className="h-4 w-4 mr-2" />
              Skip tutorial
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuidedOnboarding;

