'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  const [tokens, setTokens] = useState<BondedToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

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
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-500 text-blue-500 hover:bg-blue-50"
                      onClick={async () => {
                        try {
                          const response = await fetch(`/api/wishlist/${token.id}`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                          })
                          if (response.ok) {
                            alert('Added to wishlist!')
                          }
                        } catch (error) {
                          console.error('Error adding to wishlist:', error)
                        }
                      }}
                    >
                      Add to Wishlist
                    </Button>

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
