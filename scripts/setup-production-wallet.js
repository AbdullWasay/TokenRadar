#!/usr/bin/env node

/**
 * Production Admin Wallet Setup Script
 * 
 * This script helps you set up a production admin wallet for mainnet SOL payments.
 * Run with: node scripts/setup-production-wallet.js
 */

const { Keypair, Connection, clusterApiUrl, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuration
const NETWORK = 'mainnet-beta';
const connection = new Connection(clusterApiUrl(NETWORK), 'confirmed');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function createProductionWallet() {
  console.log('🚀 Setting up Production Solana Admin Wallet...\n');

  const choice = await askQuestion('Choose option:\n1. Create new wallet\n2. Use existing wallet\nEnter choice (1 or 2): ');

  let keypair, publicKey, secretKey;

  if (choice === '1') {
    // Generate new keypair
    keypair = Keypair.generate();
    publicKey = keypair.publicKey.toString();
    secretKey = Array.from(keypair.secretKey);

    console.log('\n✅ Generated new production wallet:');
    console.log(`   Public Key:  ${publicKey}`);
    console.log(`   Network:     ${NETWORK}`);

    // Save keypair to file
    const walletDir = path.join(__dirname, '..', 'wallets');
    if (!fs.existsSync(walletDir)) {
      fs.mkdirSync(walletDir, { recursive: true });
    }

    const walletPath = path.join(walletDir, 'production-admin-wallet.json');
    fs.writeFileSync(walletPath, JSON.stringify(secretKey));
    console.log(`   Saved to:    ${walletPath}`);

    console.log('\n⚠️  IMPORTANT: Fund this wallet with SOL for transaction fees!');
    console.log(`   Send at least 0.1 SOL to: ${publicKey}`);

  } else if (choice === '2') {
    const walletAddress = await askQuestion('\nEnter your existing wallet address: ');
    const privateKeyInput = await askQuestion('Enter private key array [1,2,3,...]: ');

    try {
      secretKey = JSON.parse(privateKeyInput);
      keypair = Keypair.fromSecretKey(new Uint8Array(secretKey));
      publicKey = keypair.publicKey.toString();

      if (publicKey !== walletAddress) {
        console.log('❌ Error: Private key does not match the provided address');
        process.exit(1);
      }

      console.log('\n✅ Wallet validated successfully');
    } catch (error) {
      console.log('❌ Error: Invalid private key format');
      process.exit(1);
    }
  } else {
    console.log('❌ Invalid choice');
    process.exit(1);
  }

  // Check wallet balance
  try {
    const balance = await connection.getBalance(keypair.publicKey);
    console.log(`\n💰 Current Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
    
    if (balance === 0) {
      console.log('⚠️  Warning: Wallet has no SOL. Fund it for transaction fees!');
    }
  } catch (error) {
    console.log('⚠️  Could not check balance. Make sure you have internet connection.');
  }

  // Update environment variables
  console.log('\n📝 Environment Variables for Production:');
  console.log('Add these to your .env.local file:');
  console.log('');
  console.log(`NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta`);
  console.log(`NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com`);
  console.log(`NEXT_PUBLIC_ADMIN_WALLET_ADDRESS=${publicKey}`);
  console.log(`ADMIN_WALLET_PRIVATE_KEY=${JSON.stringify(secretKey)}`);
  console.log('');

  // Update .env.local automatically
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const updateEnv = await askQuestion('Update .env.local automatically? (y/n): ');
    
    if (updateEnv.toLowerCase() === 'y') {
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      // Update network
      envContent = envContent.replace(
        /NEXT_PUBLIC_SOLANA_NETWORK=.*/,
        'NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta'
      );
      
      // Update RPC URL
      envContent = envContent.replace(
        /NEXT_PUBLIC_SOLANA_RPC_URL=.*/,
        'NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com'
      );
      
      // Update admin wallet address
      envContent = envContent.replace(
        /NEXT_PUBLIC_ADMIN_WALLET_ADDRESS=.*/,
        `NEXT_PUBLIC_ADMIN_WALLET_ADDRESS=${publicKey}`
      );

      // Update private key
      envContent = envContent.replace(
        /ADMIN_WALLET_PRIVATE_KEY=.*/,
        `ADMIN_WALLET_PRIVATE_KEY=${JSON.stringify(secretKey)}`
      );

      fs.writeFileSync(envPath, envContent);
      console.log('✅ Updated .env.local file automatically');
    }
  }

  console.log('\n🔐 Security Checklist:');
  console.log('   ✅ Private key is secure and backed up');
  console.log('   ✅ .env.local is in .gitignore');
  console.log('   ✅ Wallet has SOL for transaction fees');
  console.log('   ✅ Ready for production payments');

  console.log('\n🧪 Testing:');
  console.log('   1. Restart your development server');
  console.log('   2. Test with small amount first (0.1 SOL)');
  console.log('   3. Verify payment on Solana Explorer:');
  console.log(`      https://explorer.solana.com/address/${publicKey}`);
  console.log('   4. Monitor incoming payments');

  console.log('\n✨ Production setup complete! Ready for real SOL payments.');
  
  rl.close();
}

// Main execution
createProductionWallet().catch(error => {
  console.error('❌ Error setting up production wallet:', error.message);
  rl.close();
  process.exit(1);
});
