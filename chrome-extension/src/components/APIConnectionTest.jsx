import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const APIConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('testing');
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    const testConnection = async () => {
      const baseURL = import.meta.env.VITE_APP_BACKEND_API_URL;
      setApiUrl(baseURL);
      
      console.log('🔗 Testing API connection to:', baseURL);
      
      try {
        // Test basic connectivity first
        const response = await fetch(`${baseURL}/api/eqm/currencies`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Don't include auth headers for development mode
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ API connection successful:', data);
          setConnectionStatus('connected');
          toast.success('API connection successful!');
        } else {
          console.warn('⚠️ API returned error status:', response.status, response.statusText);
          setConnectionStatus('error');
          toast.error(`API error: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error('❌ API connection failed:', error);
        setConnectionStatus('failed');
        toast.error('API connection failed - using offline data');
      }
    };
    
    testConnection();
  }, []);

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'testing': return '🔄';
      case 'connected': return '✅';
      case 'error': return '⚠️';
      case 'failed': return '❌';
      default: return '❓';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'testing': return 'Testing connection...';
      case 'connected': return 'API Connected';
      case 'error': return 'API Error';
      case 'failed': return 'Connection Failed';
      default: return 'Unknown Status';
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600';
      case 'error': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-white border rounded-lg p-3 shadow-lg max-w-sm z-50">
      <div className="flex items-center space-x-2">
        <span className="text-xl">{getStatusIcon()}</span>
        <div className="flex-1">
          <div className={`font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {apiUrl}
          </div>
        </div>
      </div>
      
      {connectionStatus === 'failed' && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <div className="font-medium text-yellow-800">Using Offline Mode</div>
          <div className="text-yellow-700">
            • Check if backend server is running<br/>
            • Verify API URL: {apiUrl}<br/>
            • Fallback currency data will be used
          </div>
        </div>
      )}
    </div>
  );
};

export default APIConnectionTest;
