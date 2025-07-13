'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, Square, RefreshCw } from 'lucide-react';

interface ScraperStatus {
  isActive: boolean;
  totalTokensInDatabase: number;
  recentlyScrapedCount: number;
  lastScrapedAt: string | null;
  message: string;
}

export default function ScraperAdminPage() {
  const [status, setStatus] = useState<ScraperStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<'start' | 'stop' | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/scraper/status');
      const data = await response.json();
      if (data.success) {
        setStatus(data.status);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    } finally {
      setLoading(false);
    }
  };

  const startScraper = async () => {
    try {
      setActionLoading('start');
      const response = await fetch('/api/scraper/start', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        await fetchStatus();
      }
    } catch (error) {
      console.error('Error starting scraper:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const stopScraper = async () => {
    try {
      setActionLoading('stop');
      const response = await fetch('/api/scraper/stop', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        await fetchStatus();
      }
    } catch (error) {
      console.error('Error stopping scraper:', error);
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Pump.fun Scraper Admin</h1>
        <p className="text-muted-foreground">
          Control the continuous pump.fun token scraper
        </p>
      </div>

      <div className="grid gap-6">
        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Scraper Status
              <Button
                variant="outline"
                size="sm"
                onClick={fetchStatus}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh
              </Button>
            </CardTitle>
            <CardDescription>
              Current status of the pump.fun token scraper
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <Badge variant={status.isActive ? "default" : "secondary"}>
                    {status.isActive ? "ACTIVE" : "INACTIVE"}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Total Tokens:</span>
                    <p className="text-2xl font-bold">{status.totalTokensInDatabase}</p>
                  </div>
                  <div>
                    <span className="font-medium">Recently Scraped:</span>
                    <p className="text-2xl font-bold">{status.recentlyScrapedCount}</p>
                  </div>
                </div>
                
                <div>
                  <span className="font-medium">Last Scraped:</span>
                  <p className="text-sm text-muted-foreground">
                    {status.lastScrapedAt 
                      ? new Date(status.lastScrapedAt).toLocaleString()
                      : 'Never'
                    }
                  </p>
                </div>
                
                <div>
                  <span className="font-medium">Message:</span>
                  <p className="text-sm">{status.message}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Controls Card */}
        <Card>
          <CardHeader>
            <CardTitle>Scraper Controls</CardTitle>
            <CardDescription>
              Start or stop the continuous pump.fun token scraper
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                onClick={startScraper}
                disabled={actionLoading === 'start' || status?.isActive}
                className="flex items-center gap-2"
              >
                {actionLoading === 'start' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                Start Scraper
              </Button>
              
              <Button
                variant="destructive"
                onClick={stopScraper}
                disabled={actionLoading === 'stop' || !status?.isActive}
                className="flex items-center gap-2"
              >
                {actionLoading === 'stop' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
                Stop Scraper
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>• The scraper continuously monitors pump.fun for new tokens</p>
              <p>• Tokens are automatically saved to the MongoDB database</p>
              <p>• The scraper runs every 30 seconds when active</p>
              <p>• All tokens are available via /api/tokens/all</p>
              <p>• Bonded/almost bonded tokens via /api/tokens</p>
              <p>• Individual token details via /api/tokens/[id]</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
