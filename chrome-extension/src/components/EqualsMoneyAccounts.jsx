import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const EqualsMoneyAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await authService.getEqualsMoneyAccounts();
      if (response?.success) {
        setAccounts(response.accounts);
        toast.success(response.message || 'Accounts loaded successfully');
      } else {
        toast.error(response?.message || 'Failed to load accounts');
      }
    } catch (error) {
      console.error('Error fetching EqualsMoney accounts:', error);
      toast.error('Failed to fetch accounts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">EqualsMoney Accounts</h2>
      
      {accounts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No accounts found
        </div>
      ) : (
        <div className="grid gap-4">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {account.id}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Customer Reference: {account.customerReference}
                  </p>
                  <p className="text-sm text-gray-600">
                    Account Type: {account.accountType}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    account.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : account.status === 'PENDING_VERIFICATION'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {account.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button
        onClick={fetchAccounts}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Refresh Accounts'}
      </button>
    </div>
  );
};

export default EqualsMoneyAccounts;
