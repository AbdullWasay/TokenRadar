# Token Radar 🚀

A comprehensive real-time token tracking platform that monitors pump.fun tokens as they bond and provides advanced analytics through DexScreener integration. Built to replace broken shitcoin trackers with reliable, real-time data.

## 🎯 Project Overview

Token Radar is a premium token tracking platform that:
- Shows tokens as soon as they bond on pump.fun (100% bonding curve completion)
- Displays tokens almost at bond (90%+ bonding percentage)
- Integrates with DexScreener for additional analytics and price data
- Implements a subscription model at 2 SOL per month
- Provides real-time monitoring without fake data or fallbacks

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.2.4 with React 19
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI primitives with custom styling
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization
- **Theme**: Next-themes for dark/light mode
- **State Management**: React Context API

### Backend
- **Runtime**: Node.js with Next.js API routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs for password hashing
- **File Upload**: Cloudinary integration
- **Real-time**: WebSocket connections for live updates

### Blockchain Integration
- **Network**: Solana (Devnet for development, Mainnet for production)
- **Wallet Adapters**: Phantom, Solflare wallet support
- **Web3**: @solana/web3.js for blockchain interactions
- **Payment Processing**: Direct SOL transfers for subscriptions

### Data Scraping
- **Language**: Python 3
- **HTTP Client**: Requests library
- **Database**: PyMongo for MongoDB operations
- **Automation**: Continuous scraping with subprocess management
- **Browser Simulation**: Puppeteer for complex scraping scenarios

### Development Tools
- **Language**: TypeScript
- **Linting**: ESLint with Next.js configuration
- **Package Manager**: npm/pnpm
- **Build Tool**: Next.js built-in bundler

## 🏗️ Architecture

### Data Flow
1. **Python Scraper** → Fetches data from pump.fun API
2. **MongoDB** → Stores token data in 'Rader' collection
3. **Next.js API** → Serves data to frontend with DexScreener integration
4. **React Frontend** → Displays real-time token information
5. **WebSocket** → Provides live updates for bonding status

### Pump.fun Scraping Mechanism

The scraping system works by:

1. **Direct API Access**: Connects to `frontend-api-v3.pump.fun/coins` endpoint
2. **Browser Simulation**: Uses proper headers and cookies to mimic browser requests
3. **Parameter Control**: 
   - `offset`: Pagination control
   - `limit`: Number of tokens per request (max 500)
   - `sort`: Sorted by `created_timestamp`
   - `order`: DESC for newest first
4. **Data Processing**: Filters and processes tokens based on bonding percentage
5. **Real-time Updates**: Continuous scraping every 30 seconds
6. **Database Storage**: Stores in MongoDB with proper indexing

### Key Features Implementation

- **Premium Guard**: Restricts bonded tokens page to premium users only
- **Wishlist System**: Users can save tokens for tracking
- **Real-time Bonding**: Shows accurate bonding percentages from pump.fun
- **DexScreener Integration**: Fetches price changes (5M, 1H, 6H, 24H)
- **Transaction Data**: Generates realistic transaction history based on volume
- **Mobile Responsive**: Works seamlessly on all screen sizes

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- MongoDB Atlas account
- Cloudinary account (for image uploads)
- Solana wallet for admin functions

### Installation

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://wasay:mongodb308@cluster0.etvipre.mongodb.net/Rader

# JWT Secret (change in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Next.js Environment
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# App Environment
NODE_ENV=development

# Solana Configuration - PRODUCTION (UNCOMMENT FOR MAINNET)
# NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
# NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
# NEXT_PUBLIC_ADMIN_WALLET_ADDRESS=YOUR_ACTUAL_MAINNET_WALLET_ADDRESS_HERE
# NEXT_PUBLIC_SUBSCRIPTION_PRICE_SOL=2
# NEXT_PUBLIC_SUBSCRIPTION_DURATION_DAYS=30
# ADMIN_WALLET_PRIVATE_KEY=[YOUR_ACTUAL_MAINNET_PRIVATE_KEY_ARRAY_HERE]

# Solana Configuration - DEVELOPMENT (COMMENT OUT FOR PRODUCTION)
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_ADMIN_WALLET_ADDRESS=BTqobiV2YKRVHzZQWzkW1d4eTuv6vwSLMKj4CNGN8jsR
ADMIN_WALLET_PRIVATE_KEY=[41,178,124,1,58,214,187,243,159,226,129,221,193,85,77,60,192,202,5,201,20,107,104,166,251,228,249,97,99,225,193,198,155,117,39,10,159,239,4,81,130,32,36,137,121,66,145,193,61,123,139,119,20,214,24,217,91,50,126,56,178,26,54,220]
NEXT_PUBLIC_SUBSCRIPTION_PRICE_SOL=2
NEXT_PUBLIC_SUBSCRIPTION_DURATION_DAYS=30

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dkwzwy17v
CLOUDINARY_API_KEY=934121348486484
CLOUDINARY_API_SECRET=aHT_62k-aPOpDPu6nXVaHI2vIEY
```

**⚠️ IMPORTANT FOR PRODUCTION:**
- Uncomment mainnet environment variables in .env.local
- Comment out devnet variables when using for production
- Replace placeholder values with your actual mainnet wallet and private key
- Ensure your admin wallet has sufficient SOL for operations

### Running the Application

1. **Start the development server**
```bash
npm run dev
```

2. **Start the Python scraper (in a separate terminal)**
```bash

python continuous_scraper.py

```

3. **Access the application**
- Frontend: http://localhost:3000
- API endpoints: http://localhost:3000/api/*

## 📁 Project Structure

```
token-radar/
├── app/                          # Next.js app directory
│   ├── (auth)/                   # Authentication pages
│   ├── (dashboard)/              # Protected dashboard pages
│   ├── api/                      # API routes
│   └── globals.css               # Global styles
├── components/                   # Reusable React components
│   ├── ui/                       # Base UI components
│   └── *.tsx                     # Feature components
├── lib/                          # Utility libraries
│   ├── auth-context.tsx          # Authentication context
│   ├── wallet-context.tsx        # Solana wallet context
│   ├── mongodb.ts               # Database connection
│   └── types.ts                 # TypeScript definitions
├── public/                       # Static assets
├── scripts/                      # Setup scripts
├── styles/                       # Additional stylesheets
├── pump_scraper_mongodb.py       # Main Python scraper
├── continuous_scraper.py         # Continuous scraping runner
└── README.md                     # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Tokens
- `GET /api/tokens` - Get all tokens with filtering
- `GET /api/tokens/[id]` - Get specific token details
- `GET /api/tokens/bonded` - Get bonded tokens (premium)
- `GET /api/tokens/trending` - Get trending tokens

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add token to wishlist
- `DELETE /api/wishlist/[id]` - Remove from wishlist

### Subscription
- `POST /api/subscription/verify-payment` - Verify SOL payment

### Data Sources
- `GET /api/dexscreener/[tokenAddress]` - DexScreener data
- `GET /api/pumpfun/[tokenAddress]` - Pump.fun data

## 🎮 User Roles & Features

### Free Users
- ✅ Token lookup and current price viewing
- ✅ Basic token information
- ✅ Wishlist functionality
- ❌ Bonded tokens page (premium only)
- ❌ Advanced analytics
- ❌ Real-time alerts

### Premium Users (2 SOL/month)
- ✅ All free features
- ✅ Access to bonded tokens page
- ✅ Advanced token analytics
- ✅ Real-time price alerts
- ✅ Priority customer support
- ✅ Transaction history

## 🔄 Data Processing Pipeline

### 1. Pump.fun Scraping
```python
# Endpoint: frontend-api-v3.pump.fun/coins
# Parameters:
{
    "offset": 0,
    "limit": 500,
    "sort": "created_timestamp",
    "order": "DESC"
}
```

### 2. Data Filtering
- Only displays 90%+ or 100% bonded tokens (except all-tokens page)
- Filters out tokens with impossible future dates
- Validates bonding percentages against pump.fun data

### 3. DexScreener Integration
- Fetches real-time price data
- Gets volume and liquidity information
- Provides price change percentages (5M, 1H, 6H, 24H)

### 4. Database Storage
```javascript
// MongoDB Collection: 'Rader'
{
    mint: String,           // Token contract address
    name: String,           // Token name
    symbol: String,         // Token symbol
    description: String,    // Token description
    image_uri: String,      // Token image URL
    metadata_uri: String,   // Metadata URI
    twitter: String,        // Twitter handle
    telegram: String,       // Telegram link
    bonding_curve: String,  // Bonding curve address
    associated_bonding_curve: String,
    creator: String,        // Creator wallet address
    created_timestamp: Number,
    raydium_pool: String,   // Raydium pool address (if bonded)
    complete: Boolean,      // Bonding completion status
    total_supply: Number,   // Total token supply
    website: String,        // Website URL
    show_name: Boolean,     // Display name flag
    king_of_the_hill_timestamp: Number,
    market_cap: Number,     // Market capitalization
    reply_count: Number,    // Social engagement
    last_reply: Number,     // Last social activity
    nsfw: Boolean,          // NSFW content flag
    market_id: String,      // Market identifier
    inverted: Boolean,      // Price inversion flag
    is_currently_live: Boolean,
    username: String,       // Creator username
    profile_image: String,  // Creator profile image
    usd_market_cap: Number  // USD market cap
}
```

## 🔐 Security Features

### Authentication
- JWT-based authentication with secure token storage
- Password hashing using bcryptjs
- Protected API routes with middleware validation

### Solana Integration
- Secure wallet connection using official Solana wallet adapters
- Private key encryption for admin wallet
- Transaction verification for subscription payments

### Data Validation
- Input sanitization on all API endpoints
- MongoDB injection prevention
- Rate limiting on scraping endpoints

## 🚀 Deployment

## 📝 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `JWT_SECRET` | JWT signing secret | ✅ |
| `NEXT_PUBLIC_SOLANA_NETWORK` | Solana network (devnet/mainnet-beta) | ✅ |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Solana RPC endpoint | ✅ |
| `NEXT_PUBLIC_ADMIN_WALLET_ADDRESS` | Admin wallet public key | ✅ |
| `ADMIN_WALLET_PRIVATE_KEY` | Admin wallet private key array | ✅ |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ✅ |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ✅ |
