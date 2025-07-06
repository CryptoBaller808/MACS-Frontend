import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  Wifi, 
  WifiOff, 
  Loader2,
  Server,
  Globe
} from 'lucide-react';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import apiService from '../services/apiService.js';

const APIStatus = ({ showDetails = false, className = '' }) => {
  const [status, setStatus] = useState({
    isConnected: false,
    isChecking: true,
    lastChecked: null,
    error: null
  });

  const checkAPIHealth = async () => {
    setStatus(prev => ({ ...prev, isChecking: true, error: null }));
    
    try {
      const isHealthy = await apiService.checkHealth();
      setStatus({
        isConnected: isHealthy,
        isChecking: false,
        lastChecked: new Date(),
        error: isHealthy ? null : 'API is not responding'
      });
    } catch (error) {
      setStatus({
        isConnected: false,
        isChecking: false,
        lastChecked: new Date(),
        error: error.message || 'Failed to connect to API'
      });
    }
  };

  // Check API health on component mount and set up interval
  useEffect(() => {
    checkAPIHealth();
    
    // Check every 30 seconds
    const interval = setInterval(checkAPIHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (status.isChecking) return 'bg-yellow-500';
    return status.isConnected ? 'bg-green-500' : 'bg-red-500';
  };

  const getStatusText = () => {
    if (status.isChecking) return 'Checking...';
    return status.isConnected ? 'Connected' : 'Disconnected';
  };

  const getStatusIcon = () => {
    if (status.isChecking) {
      return <Loader2 className="h-3 w-3 animate-spin" />;
    }
    return status.isConnected ? 
      <CheckCircle className="h-3 w-3" /> : 
      <AlertCircle className="h-3 w-3" />;
  };

  // Simple badge version
  if (!showDetails) {
    return (
      <Badge 
        variant={status.isConnected ? 'default' : 'destructive'}
        className={`flex items-center gap-1 ${className}`}
      >
        {getStatusIcon()}
        API {getStatusText()}
      </Badge>
    );
  }

  // Detailed card version
  return (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
              <Server className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="font-medium">Backend API</span>
            </div>
            
            <Badge 
              variant={status.isConnected ? 'default' : 'destructive'}
              className="flex items-center gap-1"
            >
              {getStatusIcon()}
              {getStatusText()}
            </Badge>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={checkAPIHealth}
            disabled={status.isChecking}
            className="flex items-center gap-1"
          >
            {status.isChecking ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Globe className="h-3 w-3" />
            )}
            Refresh
          </Button>
        </div>

        {/* Connection Details */}
        <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex justify-between">
            <span>Endpoint:</span>
            <span className="font-mono text-xs">macs-backend-api.onrender.com</span>
          </div>
          
          {status.lastChecked && (
            <div className="flex justify-between">
              <span>Last Checked:</span>
              <span>{status.lastChecked.toLocaleTimeString()}</span>
            </div>
          )}
          
          {status.error && (
            <div className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <span className="text-red-700 dark:text-red-300 text-xs">{status.error}</span>
            </div>
          )}
          
          {status.isConnected && (
            <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-green-700 dark:text-green-300 text-xs">
                All systems operational
              </span>
            </div>
          )}
        </div>

        {/* Connection Features */}
        {status.isConnected && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Available Features:</div>
            <div className="flex flex-wrap gap-1">
              {[
                'Authentication',
                'User Profiles', 
                'Wallet Integration',
                'Booking System',
                'Crowdfunding',
                'Cross-Chain Bridge'
              ].map((feature) => (
                <Badge key={feature} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default APIStatus;

