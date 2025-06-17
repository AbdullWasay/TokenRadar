#!/usr/bin/env node

/**
 * Admin Wallet Setup Script for Solana Payment Integration
 * 
 * This script helps you set up an admin wallet for receiving subscription payments.
 * Run with: node scripts/setup-admin-wallet.js
 */

const { Keypair, Connection, clusterApiUrl, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

// Configuration
const NETWORK = 'devnet'; // Change to 'mainnet-beta' for production
const connection = new Connection(clusterApiUrl(NETWORK), 'confirmed');

async function createAdminWallet() {
  console.log('🚀 Setting up Solana Admin Wallet...\n');

  // Generate new keypair
  const keypair = Keypair.generate();
  const publicKey = keypair.publicKey.toString();
  const secretKey = Array.from(keypair.secretKey);

  console.log('✅ Generated new wallet:');
  console.log(`   Public Key:  ${publicKey}`);
  console.log(`   Network:     ${NETWORK}`);

  // Save keypair to file
  const walletDir = path.join(__dirname, '..', 'wallets');
  if (!fs.existsSync(walletDir)) {
    fs.mkdirSync(walletDir, { recursive: true });
  }

  const walletPath = path.join(walletDir, 'admin-wallet.json');
  fs.writeFileSync(walletPath, JSON.stringify(secretKey));
  console.log(`   Saved to:    ${walletPath}`);

  // For devnet, request airdrop
  if (NETWORK === 'devnet') {
    console.log('\n💰 Requesting devnet SOL airdrop...');
    try {
      const signature = await connection.requestAirdrop(keypair.publicKey, 2 * LAMPORTS_PER_SOL);
      await connection.confirmTransaction(signature);
      
      const balance = await connection.getBalance(keypair.publicKey);
      console.log(`   ✅ Airdrop successful! Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
    } catch (error) {
      console.log(`   ⚠️  Airdrop failed: ${error.message}`);
      console.log('   You can request SOL manually at: https://faucet.solana.com/');
    }
  }

  // Update environment variables
  console.log('\n📝 Environment Variables:');
  console.log('Add these to your .env.local file:');
  console.log('');
  console.log(`NEXT_PUBLIC_ADMIN_WALLET_ADDRESS=${publicKey}`);
  console.log(`ADMIN_WALLET_PRIVATE_KEY=${JSON.stringify(secretKey)}`);
  console.log(`NEXT_PUBLIC_SOLANA_NETWORK=${NETWORK}`);
  console.log('');

  // Update .env.local automatically
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Update or add admin wallet address
    if (envContent.includes('NEXT_PUBLIC_ADMIN_WALLET_ADDRESS=')) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_ADMIN_WALLET_ADDRESS=.*/,
        `NEXT_PUBLIC_ADMIN_WALLET_ADDRESS=${publicKey}`
      );
    } else {
      envContent += `\nNEXT_PUBLIC_ADMIN_WALLET_ADDRESS=${publicKey}`;
    }

    // Update or add private key (server-side only)
    if (envContent.includes('ADMIN_WALLET_PRIVATE_KEY=')) {
      envContent = envContent.replace(
        /ADMIN_WALLET_PRIVATE_KEY=.*/,
        `ADMIN_WALLET_PRIVATE_KEY=${JSON.stringify(secretKey)}`
      );
    } else {
      envContent += `\nADMIN_WALLET_PRIVATE_KEY=${JSON.stringify(secretKey)}`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated .env.local file automatically');
  }

  console.log('\n🔐 Security Notes:');
  console.log('   • Keep your private key secure and never commit it to version control');
  console.log('   • For production, use a hardware wallet or secure key management');
  console.log('   • The private key is stored in wallets/admin-wallet.json');
  console.log('   • Add wallets/ to your .gitignore file');

  console.log('\n🧪 Testing:');
  console.log('   1. Start your development server: npm run dev');
  console.log('   2. Go to the profile page and try upgrading to premium');
  console.log('   3. Connect your wallet and complete a test payment');
  console.log(`   4. Check your admin wallet balance on Solana Explorer:`);
  console.log(`      https://explorer.solana.com/address/${publicKey}?cluster=${NETWORK}`);

  console.log('\n✨ Setup complete! Your Solana payment integration is ready.');
}

async function checkExistingWallet() {
  const walletPath = path.join(__dirname, '..', 'wallets', 'admin-wallet.json');
  
  if (fs.existsSync(walletPath)) {
    console.log('⚠️  Admin wallet already exists!');
    console.log(`   Location: ${walletPath}`);
    
    try {
      const secretKey = JSON.parse(fs.readFileSync(walletPath, 'utf8'));
      const keypair = Keypair.fromSecretKey(new Uint8Array(secretKey));
      const publicKey = keypair.publicKey.toString();
      
      console.log(`   Public Key: ${publicKey}`);
      
      const balance = await connection.getBalance(keypair.publicKey);
      console.log(`   Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
      
      console.log('\nOptions:');
      console.log('   1. Use existing wallet (recommended)');
      console.log('   2. Delete wallets/admin-wallet.json and run this script again');
      
      return true;
    } catch (error) {
      console.log('   ❌ Error reading existing wallet file');
      return false;
    }
  }
  
  return false;
}

// Main execution
async function main() {
  try {
    const hasExisting = await checkExistingWallet();
    
    if (!hasExisting) {
      await createAdminWallet();
    }
  } catch (error) {
    console.error('❌ Error setting up admin wallet:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { createAdminWallet, checkExistingWallet };
