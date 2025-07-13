'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, Square, TestTube, Database, Coins } from 'lucide-react';

interface Token {
  mint: string;
  name: string;
  symbol: string;
  usd_market_cap: number;
  complete: boolean;
  bonding_percentage?: number;
  created_timestamp: number;
}

interface APIResponse {
  success: boolean;
  message: string;
  tokens?: Token[];
  total?: number;
  timestamp: string;
  error?: string;
}

export default function TestAPIScraper() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<APIResponse | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);

  const callAPI = async (action: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/test-pump-api?action=${action}`);
      const data: APIResponse = await res.json();
      setResponse(data);
      if (data.tokens) {
        setTokens(data.tokens);
      }
    } catch (error) {
      setResponse({
        success: false,
        message: 'Failed to call API',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const formatMarketCap = (cap: number) => {
    if (cap >= 1000000) return `$${(cap / 1000000).toFixed(2)}M`;
    if (cap >= 1000) return `$${(cap / 1000).toFixed(2)}K`;
    return `$${cap.toFixed(2)}`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Pump.fun API Scraper Test</h1>
        <p className="text-muted-foreground">
          Test the new direct API scraping method from the tutorial
        </p>
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          onClick={() => callAPI('test')}
          disabled={loading}
          variant="outline"
          className="flex items-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <TestTube className="h-4 w-4" />}
          Test API
        </Button>

        <Button
          onClick={() => callAPI('scrape')}
          disabled={loading}
          variant="outline"
          className="flex items-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Coins className="h-4 w-4" />}
          Scrape Tokens
        </Button>

        <Button
          onClick={() => callAPI('start')}
          disabled={loading}
          variant="outline"
          className="flex items-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          Start Continuous
        </Button>

        <Button
          onClick={() => callAPI('stop')}
          disabled={loading}
          variant="outline"
          className="flex items-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Square className="h-4 w-4" />}
          Stop Continuous
        </Button>

        <Button
          onClick={() => callAPI('scrape-bonded')}
          disabled={loading}
          variant="outline"
          className="flex items-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Coins className="h-4 w-4" />}
          Scrape Bonded
        </Button>

        <Button
          onClick={() => callAPI('database')}
          disabled={loading}
          variant="outline"
          className="flex items-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
          View Database
        </Button>

        <Button
          onClick={() => callAPI('bonded-db')}
          disabled={loading}
          variant="outline"
          className="flex items-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
          Bonded DB
        </Button>
      </div>

      {/* Response Display */}
      {response && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              API Response
              <Badge variant={response.success ? "default" : "destructive"}>
                {response.success ? "Success" : "Error"}
              </Badge>
            </CardTitle>
            <CardDescription>
              {response.timestamp}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Message:</strong> {response.message}</p>
              {response.total && (
                <p><strong>Total Tokens:</strong> {response.total}</p>
              )}
              {response.error && (
                <p className="text-red-500"><strong>Error:</strong> {response.error}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tokens Display */}
      {tokens.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tokens ({tokens.length})</CardTitle>
            <CardDescription>
              Sample tokens from the API response
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tokens.map((token, index) => (
                <div key={token.mint || index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{token.name}</h3>
                      <p className="text-sm text-muted-foreground">{token.symbol}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatMarketCap(token.usd_market_cap)}</p>
                      <Badge variant={token.complete ? "default" : "secondary"}>
                        {token.complete ? "Bonded" : `${token.bonding_percentage || 0}%`}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>Mint:</strong> {token.mint}</p>
                    <p><strong>Created:</strong> {formatTimestamp(token.created_timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Test API:</strong> Check if the pump.fun API connection is working</p>
          <p><strong>Scrape Tokens:</strong> Manually fetch latest tokens from pump.fun</p>
          <p><strong>Start Continuous:</strong> Begin automatic scraping every 15 seconds</p>
          <p><strong>Stop Continuous:</strong> Stop the automatic scraping</p>
          <p><strong>Scrape Bonded:</strong> Fetch only bonded tokens (100% complete)</p>
          <p><strong>View Database:</strong> Show tokens stored in the database</p>
          <p><strong>Bonded DB:</strong> Show bonded tokens from the database</p>
        </CardContent>
      </Card>
    </div>
  );
}
