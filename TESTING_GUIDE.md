# 🧪 Complete Solana Payment Integration Testing Guide

## 🎯 Overview
This guide will walk you through testing the complete Solana payment integration for your subscription system.

## 📋 Prerequisites Checklist

### ✅ Required Software
- [ ] **Phantom Wallet** browser extension installed
- [ ] **Node.js** and **npm** installed
- [ ] **Development server** running (`npm run dev`)

### ✅ Setup Steps
- [ ] Admin wallet configured (run `node scripts/setup-admin-wallet.js`)
- [ ] Environment variables set in `.env.local`
- [ ] Solana packages installed
- [ ] User account created in your app

## 🚀 Step-by-Step Testing

### **Step 1: Setup Admin Wallet**
```bash
# Run the admin wallet setup script
node scripts/setup-admin-wallet.js

# This will:
# - Generate a new admin wallet
# - Request devnet SOL airdrop
# - Update your .env.local file
# - Save wallet to wallets/admin-wallet.json
```

### **Step 2: Setup Test User Wallet**
1. **Install Phantom Wallet** (if not already installed)
   - Go to https://phantom.app/
   - Install browser extension
   - Create a new wallet or import existing

2. **Switch to Devnet**
   - Open Phantom wallet
   - Go to Settings → Developer Settings
   - Change network to "Devnet"

3. **Get Test SOL**
   - Go to https://faucet.solana.com/
   - Enter your wallet address
   - Request 2 SOL (enough for testing)

### **Step 3: Test Wallet Connection**
1. **Open your app**: `http://localhost:3000`
2. **Login** with your user account
3. **Go to any page** with the "Connect Wallet" button
4. **Click "Connect Wallet"**
5. **Select Phantom** from the wallet list
6. **Approve connection** in Phantom popup

**✅ Expected Result:**
- Wallet shows "Connected" status
- Your SOL balance is displayed
- Wallet address is shown (truncated)

### **Step 4: Test Payment Flow**
1. **Go to Profile page**: `http://localhost:3000/profile`
2. **Find the Premium Plan** card
3. **Click "Upgrade with SOL"** button
4. **Payment modal opens** showing:
   - Subscription price: 2 SOL
   - Duration: 30 days
   - Your current balance
   - Premium features list

5. **Click "Pay 2.0000 SOL"** button
6. **Phantom popup appears** asking to approve transaction
7. **Review transaction details**:
   - To: Admin wallet address
   - Amount: 2 SOL + small fee
   - Network: Devnet

8. **Approve transaction** in Phantom
9. **Wait for confirmation** (usually 1-2 seconds)

**✅ Expected Result:**
- Success toast: "Payment successful!"
- Modal closes automatically
- User subscription status updates to "Premium"
- Premium badge appears next to user name
- Subscription expiry date is shown

### **Step 5: Verify Transaction**
1. **Check Admin Wallet Balance**
   - Admin wallet should have +2 SOL
   - Check on Solana Explorer: https://explorer.solana.com/?cluster=devnet

2. **Check User Profile**
   - Subscription status: "Premium"
   - Premium crown icon visible
   - Expiry date shown (30 days from now)

3. **Check Database**
   - User record updated with:
     - `subscriptionStatus: 'premium'`
     - `subscriptionExpiry: [date]`
     - `walletAddress: [user_wallet]`
     - Payment history entry

### **Step 6: Test Edge Cases**

#### **Insufficient Balance Test**
1. **Use wallet with < 2 SOL**
2. **Try to upgrade**
3. **Expected**: Error message about insufficient balance

#### **Already Premium Test**
1. **User already has premium**
2. **Go to profile page**
3. **Expected**: Premium plan shows "Already Premium" (disabled)

#### **Wallet Disconnection Test**
1. **Disconnect wallet** in Phantom
2. **Try to upgrade**
3. **Expected**: Error message to connect wallet first

## 🔍 Debugging Common Issues

### **Issue: Wallet Won't Connect**
**Symptoms**: Connection fails or times out
**Solutions**:
- Ensure Phantom is unlocked
- Check network is set to Devnet
- Clear browser cache
- Try refreshing the page

### **Issue: Transaction Fails**
**Symptoms**: Transaction rejected or fails
**Solutions**:
- Check wallet has sufficient SOL (2+ SOL)
- Verify network is Devnet
- Check Solana network status
- Try again after a few seconds

### **Issue: Payment Not Verified**
**Symptoms**: Transaction succeeds but subscription not activated
**Solutions**:
- Check browser console for errors
- Verify admin wallet address in .env.local
- Check API logs for verification errors
- Ensure database connection is working

### **Issue: Balance Not Updating**
**Symptoms**: Wallet balance doesn't refresh
**Solutions**:
- Wait a few seconds for blockchain confirmation
- Manually refresh the page
- Check transaction on Solana Explorer

## 📊 Monitoring and Analytics

### **Transaction Monitoring**
- **Solana Explorer**: https://explorer.solana.com/?cluster=devnet
- **Search by**: Transaction signature, wallet address
- **Check**: Transaction status, amount, fees

### **Database Verification**
```javascript
// Check user subscription in MongoDB
db.users.findOne({ email: "user@example.com" })

// Expected fields:
{
  subscriptionStatus: "premium",
  subscriptionExpiry: ISODate("..."),
  walletAddress: "...",
  paymentHistory: [{
    transactionSignature: "...",
    amount: 2,
    timestamp: ISODate("..."),
    walletAddress: "...",
    subscriptionDuration: 30
  }]
}
```

## 🎉 Success Criteria

### ✅ **Complete Success Checklist**
- [ ] Wallet connects successfully
- [ ] Payment modal opens and displays correctly
- [ ] Transaction processes without errors
- [ ] Admin wallet receives 2 SOL
- [ ] User subscription status updates to "Premium"
- [ ] Premium features are unlocked
- [ ] Payment history is recorded
- [ ] Transaction is verifiable on blockchain

### 🚨 **If Tests Fail**
1. **Check Prerequisites** - Ensure all setup steps completed
2. **Review Logs** - Check browser console and server logs
3. **Verify Configuration** - Double-check .env.local variables
4. **Test Network** - Ensure Solana devnet is accessible
5. **Contact Support** - If issues persist, check documentation

## 🔄 Production Deployment

### **Before Going Live**
1. **Switch to Mainnet**:
   - Update `NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta`
   - Update RPC URL to mainnet
   - Use real SOL (not devnet)

2. **Security Review**:
   - Secure admin wallet private key
   - Use hardware wallet for large amounts
   - Implement monitoring and alerts

3. **Final Testing**:
   - Test with small amounts first
   - Verify all edge cases
   - Monitor for 24 hours

## 📞 Support

If you encounter issues:
1. Check this testing guide first
2. Review the main setup guide: `SOLANA_SETUP_GUIDE.md`
3. Check Solana network status: https://status.solana.com/
4. Verify wallet adapter documentation

**Happy Testing! 🚀**
