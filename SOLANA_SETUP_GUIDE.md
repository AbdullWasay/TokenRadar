# 🚀 Solana Payment Integration Setup Guide

## 📋 Overview
This guide will help you set up the complete Solana payment integration for your subscription system.

## 🔧 Prerequisites
1. **Solana CLI** installed on your system
2. **Phantom Wallet** or **Solflare Wallet** browser extension
3. **Devnet SOL** for testing

## 🏗️ Step 1: Create Admin Wallet

### Option A: Using Solana CLI (Recommended)
```bash
# Install Solana CLI (if not already installed)
sh -c "$(curl -sSfL https://release.solana.com/v1.16.0/install)"

# Create a new keypair for admin wallet
solana-keygen new --outfile ~/admin-wallet.json

# Get the public key (this is your admin wallet address)
solana-keygen pubkey ~/admin-wallet.json

# Set to devnet for testing
solana config set --url https://api.devnet.solana.com

# Airdrop some SOL for testing (devnet only)
solana airdrop 2 ~/admin-wallet.json
```

### Option B: Using Phantom Wallet
1. Create a new wallet in Phantom
2. Switch to **Devnet** in settings
3. Copy the wallet address
4. Get devnet SOL from: https://faucet.solana.com/

## 🔐 Step 2: Configure Environment Variables

Update your `.env.local` file with the admin wallet details:

```env
# Solana Configuration
SOLANA_NETWORK=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com
ADMIN_WALLET_ADDRESS=YOUR_ADMIN_WALLET_PUBLIC_KEY_HERE
ADMIN_WALLET_PRIVATE_KEY=YOUR_ADMIN_WALLET_PRIVATE_KEY_HERE

# Subscription Settings
SUBSCRIPTION_PRICE_SOL=2
SUBSCRIPTION_DURATION_DAYS=30
```

**Important Security Notes:**
- Never commit private keys to version control
- Use environment variables for all sensitive data
- For production, use a hardware wallet or secure key management

## 🧪 Step 3: Testing the Integration

### 3.1 Test Wallet Connection
1. Open your app: `http://localhost:3000`
2. Go to any page with the "Connect Wallet" button
3. Click "Connect Wallet" and connect your Phantom/Solflare wallet
4. Verify wallet shows connected status and balance

### 3.2 Test Payment Flow
1. Login to your app
2. Go to Profile page: `http://localhost:3000/profile`
3. Click "Upgrade with SOL" on the Premium plan
4. Complete the payment transaction
5. Verify subscription status updates to "Premium"

### 3.3 Verify Transaction
1. Check your admin wallet balance increased by 2 SOL
2. Verify transaction on Solana Explorer:
   - Devnet: https://explorer.solana.com/?cluster=devnet
   - Search for your transaction signature

## 🔄 Step 4: Production Setup

### 4.1 Switch to Mainnet
Update `.env.local` for production:
```env
SOLANA_NETWORK=mainnet-beta
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

### 4.2 Security Considerations
- Use a hardware wallet for admin wallet
- Implement multi-signature for large amounts
- Set up monitoring for incoming payments
- Regular backup of wallet keys

## 🛠️ Step 5: Advanced Features

### 5.1 Automatic Subscription Renewal
- Set up a cron job to check expiring subscriptions
- Send renewal reminders via email
- Implement auto-renewal with user consent

### 5.2 Payment Monitoring
- Set up webhooks for real-time payment notifications
- Implement payment reconciliation
- Add payment analytics dashboard

### 5.3 Multi-Token Support
- Accept other SPL tokens (USDC, USDT)
- Implement token price conversion
- Add token selection in payment UI

## 🚨 Troubleshooting

### Common Issues:

1. **Wallet Connection Fails**
   - Ensure wallet extension is installed and unlocked
   - Check if wallet is on correct network (devnet/mainnet)
   - Clear browser cache and try again

2. **Transaction Fails**
   - Check wallet has sufficient SOL for transaction + fees
   - Verify network connectivity
   - Check Solana network status

3. **Payment Verification Fails**
   - Ensure admin wallet address is correct in env
   - Check transaction signature is valid
   - Verify payment amount matches subscription price

4. **Balance Not Updating**
   - Wait for transaction confirmation (usually 1-2 seconds)
   - Check if transaction was successful on explorer
   - Refresh wallet balance manually

## 📞 Support
If you encounter issues:
1. Check browser console for errors
2. Verify all environment variables are set
3. Test on devnet first before mainnet
4. Check Solana network status: https://status.solana.com/

## 🎯 Next Steps
- Implement subscription management dashboard
- Add payment history and receipts
- Set up automated billing reminders
- Implement refund functionality
- Add analytics and reporting
