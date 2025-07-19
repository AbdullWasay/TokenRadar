'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Clock, ExternalLink, Loader2, RefreshCw, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BondedToken {
  id: string;
  name: string;
  symbol: string;
  marketCap: string;
  created: string;
  bonded: string;
  bondedAt: string;
  bondedTimestamp: string;
  contractAddress: string;
  dexScreenerUrl: string;
  minutesAgoBonded: number | null;
  wasNewlyBonded: boolean;
  bondingPercentage: number;
}

export default function BondedTokensPage() {
  const { toast } = useToast();
  const [tokens, setTokens] = useState<BondedToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [wishlistTokenIds, setWishlistTokenIds] = useState<string[]>([]);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Check wishlist status for current tokens (same as overview page)
  const checkWishlistStatus = async (tokenIds: string[]) => {
    try {
      const authToken = localStorage.getItem('auth_token')
      if (!authToken) {
        setWishlistTokenIds([])
        return
      }

      const response = await fetch('/api/wishlist', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ tokenIds })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setWishlistTokenIds(data.data || [])
        }
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error)
      setWishlistTokenIds([])
    }
  }

  // Check wishlist status when tokens change
  useEffect(() => {
    if (tokens.length > 0) {
      const tokenIds = tokens.map(token => token.id)
      checkWishlistStatus(tokenIds)
    }
  }, [tokens])

  // Add token to wishlist (simplified version like overview page)
  const addToWishlist = async (token: BondedToken) => {
    if (!token) return

    setIsAddingToWishlist(true)
    try {
      const authToken = localStorage.getItem('auth_token')
      if (!authToken) {
        console.log('No auth token found')
        return
      }

      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          tokenId: token.id,
          tokenName: token.name,
          tokenSymbol: token.symbol,
          tokenAddress: token.contractAddress || token.id || null
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Update wishlist status (same as overview page)
        setWishlistTokenIds(prev => [...prev, token.id])
        console.log(`✅ ${token.symbol} added to wishlist`)
      } else {
        console.error('Failed to add to wishlist:', data)
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error)
    } finally {
      setIsAddingToWishlist(false)
    }
  }

  const fetchBondedTokens = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tokens/bonded?search=${encodeURIComponent(search)}&limit=1000`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        setTokens(data.data);
        setLastUpdated(new Date());
      } else {
        console.error('Invalid response format:', data);
        setTokens([]);
      }
    } catch (error) {
      console.error('Error fetching bonded tokens:', error);
      setTokens([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBondedTokens();
  }, [search]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchBondedTokens();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, search]);

  const handleRefresh = () => {
    fetchBondedTokens();
  };



  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bonded Tokens</h1>
          <p className="text-muted-foreground">
            Tokens that have reached 100% bonding curve completion
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleRefresh}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>

          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
          >
            Auto Refresh {autoRefresh ? "ON" : "OFF"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search tokens by name or symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex gap-2">
        </div>
      </div>

      {lastUpdated && (
        <div className="text-sm text-muted-foreground">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}

      <div className="grid gap-4">
        {loading && tokens.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading bonded tokens...</span>
          </div>
        ) : tokens.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No bonded tokens found</h3>
                <p className="text-muted-foreground">
                  {search ?
                    `No tokens matching "${search}" found.` :
                    `No bonded tokens found.`
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          tokens.map((token) => (
            <Card key={token.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{token.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span>{token.symbol}</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        100% Bonded
                      </Badge>
                      {(() => {
                        // Show "New" tag only for tokens bonded on the same day
                        if (token.bondedTimestamp) {
                          // Handle both seconds and milliseconds timestamps
                          const timestamp = parseInt(token.bondedTimestamp);
                          const bondedTime = new Date(timestamp > 1000000000000 ? timestamp : timestamp * 1000);
                          const now = new Date();

                          // Check if bonded on the same calendar day
                          const isSameDay = bondedTime.toDateString() === now.toDateString();

                          if (isSameDay) {
                            return (
                              <Badge variant="default" className="bg-blue-100 text-blue-800">
                                <Clock className="h-3 w-3 mr-1" />
                                New
                              </Badge>
                            );
                          }
                        }
                        return null;
                      })()}
                    </CardDescription>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-semibold">{token.marketCap}</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Created: {token.created}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Wishlist status indicator (same as overview page) */}
                    {wishlistTokenIds.includes(token.id) && (
                      <div className="flex items-center gap-1 text-red-500">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <span className="text-xs">In Wishlist</span>
                      </div>
                    )}
                    {!wishlistTokenIds.includes(token.id) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          addToWishlist(token)
                        }}
                        disabled={isAddingToWishlist}
                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
                      >
                        {isAddingToWishlist ? 'Adding...' : 'Add to Wishlist'}
                      </button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://pump.fun/${token.contractAddress}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Pump.fun
                    </Button>

                    {token.dexScreenerUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(token.dexScreenerUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        DexScreener
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>


    </div>
  );
}
