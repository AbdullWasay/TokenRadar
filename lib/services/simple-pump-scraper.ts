// Simplified pump.fun API scraper

let isScrapingActive = false;
let scrapingInterval: NodeJS.Timeout | null = null;

// Headers for pump.fun API requests
const headers = {
  'accept': '*/*',
  'accept-language': 'en-US,en;q=0.9,es;q=0.8',
  'content-type': 'application/json',
  'origin': 'https://pump.fun',
  'priority': 'u=1, i',
  'referer': 'https://pump.fun/',
  'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-site',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
};

const cookies = {
  '_ga': 'GA1.1.1085779232.1743616310',
  'intercom-id-w7scljv7': 'c042e584-67f0-4653-b79c-e724e4030fa1',
  'intercom-device-id-w7scljv7': '0d5c5a65-93aa-486f-8784-0bd4f1a63cd3',
  'fs_uid': '#o-1YWTMD-na1#34094bea-8456-49bd-b821-968173400217:091b5c8f-9018-43f2-b7f4-abe27606f49d:1745422245728::1#/1767903960',
  '_ga_T65NVS2TQ6': 'GS1.1.1745422266.7.0.1745422266.60.0.0',
  'intercom-session-w7scljv7': '',
};

function getCookieString(): string {
  return Object.entries(cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join('; ');
}

export async function fetchPumpTokens(limit: number = 500): Promise<any[]> {
  console.log('🔍 Fetching pump.fun tokens using Python scraper...');

  try {
    // Use Python scraper which is working
    const { spawn } = require('child_process');

    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python', ['pump_scraper_mongodb.py', 'all', limit.toString()], {
        cwd: process.cwd(),
        stdio: 'pipe'
      });

      let output = '';
      let errorOutput = '';

      pythonProcess.stdout.on('data', (data: Buffer) => {
        output += data.toString();
        console.log(`🐍 Python: ${data.toString().trim()}`);
      });

      pythonProcess.stderr.on('data', (data: Buffer) => {
        errorOutput += data.toString();
        console.error(`🐍 Python Error: ${data.toString().trim()}`);
      });

      pythonProcess.on('close', async (code: number) => {
        if (code === 0) {
          console.log('✅ Python scraper completed successfully');

          // Now fetch the data from MongoDB
          try {
            const dbTokens = await fetchTokensFromMongoDB(limit);
            resolve(dbTokens);
          } catch (dbError) {
            console.error('❌ Error fetching from MongoDB:', dbError);
            resolve([]);
          }
        } else {
          console.error(`❌ Python scraper failed with code ${code}`);
          console.error('Error output:', errorOutput);
          resolve([]);
        }
      });

      pythonProcess.on('error', (error: Error) => {
        console.error('❌ Failed to start Python scraper:', error);
        resolve([]);
      });
    });
  } catch (error: any) {
    console.error('❌ Error running Python scraper:', error);
    return [];
  }
}

// Helper function to fetch tokens from MongoDB
async function fetchTokensFromMongoDB(limit: number): Promise<any[]> {
  try {
    const dbConnect = await import('@/lib/mongodb');
    await dbConnect.default();

    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    const collection = db.collection('Rader'); // Using the correct collection name

    const tokens = await collection
      .find({})
      .sort({ created_timestamp: -1 })
      .limit(Math.max(limit, 1000)) // Get at least 1000 tokens
      .toArray();

    console.log(`📊 Retrieved ${tokens.length} tokens from MongoDB`);
    return tokens;
  } catch (error) {
    console.error('❌ Error fetching from MongoDB:', error);
    return [];
  }
}

export async function startContinuousScraping(): Promise<void> {
  if (isScrapingActive) {
    console.log('⚠️ Scraping is already active');
    return;
  }

  console.log('🚀 Starting continuous pump.fun scraping...');
  isScrapingActive = true;

  // Initial fetch
  await fetchPumpTokens();

  // Set up continuous scraping every 30 seconds
  scrapingInterval = setInterval(async () => {
    try {
      await fetchPumpTokens();
    } catch (error) {
      console.error('❌ Error in continuous scraping:', error);
    }
  }, 30000);

  console.log('✅ Continuous scraping started (every 30 seconds)');
}

export function stopContinuousScraping(): void {
  if (scrapingInterval) {
    clearInterval(scrapingInterval);
    scrapingInterval = null;
  }
  isScrapingActive = false;
  console.log('🛑 Continuous scraping stopped');
}

export function isScrapingRunning(): boolean {
  return isScrapingActive;
}

export function getBondingPercentage(token: any): number {
  if (token.complete || token.raydium_pool) {
    return 100;
  }

  const marketCap = token.usd_market_cap || 0;
  const bondingThreshold = 69000; // pump.fun bonding threshold

  return Math.min(Math.round((marketCap / bondingThreshold) * 100), 99);
}

// Format market cap for display
export function formatMarketCap(marketCap: number): string {
  if (marketCap >= 1000000) {
    return `$${(marketCap / 1000000).toFixed(2)}M`;
  } else if (marketCap >= 1000) {
    return `$${(marketCap / 1000).toFixed(2)}K`;
  } else {
    return `$${marketCap.toFixed(2)}`;
  }
}

// Format timestamp for display
export function formatTimestamp(timestamp: number): string {
  const timestampMs = timestamp > 1000000000000 ? timestamp : timestamp * 1000;
  const date = new Date(timestampMs);
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
}
