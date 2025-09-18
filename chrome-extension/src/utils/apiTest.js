// Development API test script
// This script can be used to test the new OpenAPI endpoints

import authService from '../services/authService';

export const testNewEndpoints = async () => {
  console.group('🧪 Testing New OpenAPI Endpoints');
  
  try {
    // Test 1: Currency endpoint (Development Mode - No Auth Required)
    console.log('📦 Testing GET /api/eqm/currencies...');
    const currenciesResponse = await authService.getSupportedCurrencies();
    console.log('✅ Currencies Response:', currenciesResponse);
    
    // Test 2: Currency endpoint with mock account ID
    console.log('📦 Testing GET /api/eqm/currencies with mock account...');
    const currenciesWithAccount = await authService.getSupportedCurrencies('mock_acc_1234567890');
    console.log('✅ Currencies with Account Response:', currenciesWithAccount);
    
    // Test 3: EqualsMoney accounts (may require auth)
    console.log('📦 Testing GET /api/eqm/accounts...');
    try {
      const accountsResponse = await authService.getEqualsMoneyAccounts();
      console.log('✅ Accounts Response:', accountsResponse);
    } catch (error) {
      console.log('⚠️ Accounts endpoint requires authentication:', error.message);
    }
    
    console.log('🎉 All available endpoints tested successfully!');
    
  } catch (error) {
    console.error('❌ API Test Error:', error);
    console.log('💡 Note: This is expected if the backend server is not running on port 3001');
    console.log('💡 Fallback data should be used automatically in development mode');
  }
  
  console.groupEnd();
};

// Test API connectivity
export const checkAPIConnectivity = async () => {
  const baseURL = import.meta.env.VITE_APP_BACKEND_API_URL || 'http://localhost:3001';
  console.log(`🔗 Checking API connectivity to: ${baseURL}`);
  
  try {
    const response = await fetch(`${baseURL}/api/eqm/currencies`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API is accessible:', data);
      return true;
    } else {
      console.log('⚠️ API returned error status:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ API is not accessible:', error.message);
    console.log('💡 Using fallback data for development');
    return false;
  }
};

// Export test functions for use in components
export default {
  testNewEndpoints,
  checkAPIConnectivity
};
