'use client';

import { useState, useEffect } from 'react';

export default function TestPumpTokens() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [onlyBonded, setOnlyBonded] = useState(false);

  const fetchTokens = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (onlyBonded) params.append('bonded', 'true');
      params.append('limit', '20');

      const response = await fetch(`/api/pump-tokens?${params}`);
      const data = await response.json();

      if (data.success) {
        setTokens(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch tokens');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTokens();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Pump.fun Token Tracker</h1>
        <p className="text-gray-600">Real-time data from pump.fun API</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search tokens..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Search'}
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={onlyBonded}
                onChange={(e) => setOnlyBonded(e.target.checked)}
                className="rounded"
              />
              <span>Only Bonded Tokens (100%)</span>
            </label>
            
            <button
              type="button"
              onClick={fetchTokens}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              Refresh
            </button>
          </div>
        </form>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2">Loading real tokens from pump.fun...</p>
        </div>
      )}

      {/* Tokens Display */}
      {!loading && tokens.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold">
              Found {tokens.length} Real Tokens from Pump.fun
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Token
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Market Cap
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bonding %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tokens.map((token, index) => (
                  <tr key={token.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {token.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {token.symbol}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">
                          {token.contractAddress?.substring(0, 8)}...
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{token.marketCap}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              token.bondedPercentage === 100 ? 'bg-green-500' : 
                              token.bondedPercentage >= 90 ? 'bg-yellow-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${token.bondedPercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">
                          {token.bondedPercentage}%
                        </span>
                        {token.complete && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Bonded
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {token.created}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {token.dexScreenerUrl && (
                        <a
                          href={token.dexScreenerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          DexScreener
                        </a>
                      )}
                      <button
                        onClick={() => navigator.clipboard.writeText(token.contractAddress)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Copy Address
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && tokens.length === 0 && !error && (
        <div className="text-center py-8">
          <p className="text-gray-500">No tokens found. Try adjusting your search criteria.</p>
        </div>
      )}

      {/* Footer Info */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">About This Data</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Real-time data fetched directly from pump.fun API</li>
          <li>• No fake or simulated data - only live tokens</li>
          <li>• Bonded tokens are 100% complete and tradeable on Raydium</li>
          <li>• Market cap and bonding percentage calculated from live data</li>
        </ul>
      </div>
    </div>
  );
}
