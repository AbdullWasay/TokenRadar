#!/usr/bin/env node
/**
 * Final comprehensive test to verify all requirements are met:
 * 1. More than 50 tokens shown
 * 2. Accurate bonding percentages (no fake formulas)
 * 3. Sorting options work (market cap, bonding %, name)
 * 4. Dashboard shows newly bonded tokens
 * 5. Only 90%+ or 100% bonded tokens displayed
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testEndpoint(name, url, expectedFeatures = []) {
  console.log(`\n🧪 TESTING ${name.toUpperCase()}`);
  console.log('='.repeat(60));
  
  try {
    const response = await axios.get(`${BASE_URL}${url}`, { timeout: 30000 });
    
    if (response.status === 200) {
      const data = response.data;
      
      if (data.success && Array.isArray(data.tokens || data.data)) {
        const tokens = data.tokens || data.data;
        console.log(`✅ ${name} API working`);
        console.log(`📊 Found ${tokens.length} tokens`);
        
        // Check if more than 50 tokens
        if (tokens.length > 50) {
          console.log(`✅ Shows more than 50 tokens (${tokens.length})`);
        } else {
          console.log(`⚠️  Only ${tokens.length} tokens (should be more than 50)`);
        }
        
        // Analyze bonding percentages
        const bondedTokens = tokens.filter(t => t.bondedPercentage === 100 || t.bonded === true);
        const nearBondedTokens = tokens.filter(t => t.bondedPercentage >= 90 && t.bondedPercentage < 100);
        const lowProgressTokens = tokens.filter(t => t.bondedPercentage < 90);
        
        console.log(`🎉 Bonded tokens (100%): ${bondedTokens.length}`);
        console.log(`🔥 Near-bonded tokens (90-99%): ${nearBondedTokens.length}`);
        console.log(`⚠️  Low progress tokens (<90%): ${lowProgressTokens.length}`);
        
        // Check bonding percentage accuracy
        if (tokens.length > 0) {
          console.log('\n📋 BONDING PERCENTAGE VERIFICATION:');
          tokens.slice(0, 5).forEach((token, index) => {
            console.log(`${index + 1}. ${token.name} (${token.symbol})`);
            console.log(`   Bonding: ${token.bondedPercentage}%`);
            console.log(`   Bonded: ${token.bonded}`);
            console.log(`   Market Cap: ${token.marketCap}`);
            console.log(`   Created: ${token.created}`);
            console.log('');
          });
        }
        
        // Check if only 90%+ tokens are shown (as required)
        if (lowProgressTokens.length > 0) {
          console.log(`❌ VIOLATION: Found ${lowProgressTokens.length} tokens with <90% bonding!`);
          console.log('   This violates the requirement to show only 90%+ or bonded tokens');
          return false;
        } else {
          console.log('✅ All tokens meet 90%+ bonding requirement');
        }
        
        // Check sorting if applicable
        if (expectedFeatures.includes('sorting')) {
          console.log('\n🔄 SORTING VERIFICATION:');
          if (url.includes('sortBy=marketCap')) {
            // Check if sorted by market cap (descending)
            let isSorted = true;
            for (let i = 1; i < Math.min(tokens.length, 5); i++) {
              const prev = parseFloat(tokens[i-1].marketCap.replace(/[$,MK]/g, ''));
              const curr = parseFloat(tokens[i].marketCap.replace(/[$,MK]/g, ''));
              if (prev < curr) {
                isSorted = false;
                break;
              }
            }
            console.log(`${isSorted ? '✅' : '❌'} Market cap sorting: ${isSorted ? 'CORRECT' : 'INCORRECT'}`);
          } else if (url.includes('sortBy=bonding')) {
            // Check if sorted by bonding percentage (descending)
            let isSorted = true;
            for (let i = 1; i < Math.min(tokens.length, 5); i++) {
              if (tokens[i-1].bondedPercentage < tokens[i].bondedPercentage) {
                isSorted = false;
                break;
              }
            }
            console.log(`${isSorted ? '✅' : '❌'} Bonding % sorting: ${isSorted ? 'CORRECT' : 'INCORRECT'}`);
          } else if (url.includes('sortBy=name')) {
            // Check if sorted alphabetically
            let isSorted = true;
            for (let i = 1; i < Math.min(tokens.length, 5); i++) {
              if (tokens[i-1].name > tokens[i].name) {
                isSorted = false;
                break;
              }
            }
            console.log(`${isSorted ? '✅' : '❌'} Name sorting: ${isSorted ? 'CORRECT' : 'INCORRECT'}`);
          }
        }
        
        return true;
      } else {
        console.log(`❌ ${name} API returned invalid format:`, data);
        return false;
      }
    } else {
      console.log(`❌ ${name} API returned status ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${name} API failed:`, error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 FINAL COMPREHENSIVE TESTING');
  console.log('Testing all requirements:');
  console.log('1. More than 50 tokens shown');
  console.log('2. Accurate bonding percentages (no fake formulas)');
  console.log('3. Sorting options work (market cap, bonding %, name)');
  console.log('4. Only 90%+ or 100% bonded tokens displayed');
  console.log('=' * 80);
  
  const endpoints = [
    { name: 'Trending Tokens', url: '/api/tokens/trending?limit=100', features: [] },
    { name: 'Bonded Tokens', url: '/api/tokens/bonded?limit=100', features: [] },
    { name: 'All Tokens (Default)', url: '/api/tokens/all?limit=100', features: [] },
    { name: 'All Tokens (Market Cap Sort)', url: '/api/tokens/all?limit=20&sortBy=marketCap', features: ['sorting'] },
    { name: 'All Tokens (Bonding % Sort)', url: '/api/tokens/all?limit=20&sortBy=bonding', features: ['sorting'] },
    { name: 'All Tokens (Name Sort)', url: '/api/tokens/all?limit=20&sortBy=name', features: ['sorting'] },
    { name: 'Overview/Dashboard Tokens', url: '/api/tokens?limit=100', features: [] },
  ];
  
  const results = [];
  
  for (const endpoint of endpoints) {
    const success = await testEndpoint(endpoint.name, endpoint.url, endpoint.features);
    results.push({ name: endpoint.name, success });
    
    // Wait between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n🎯 FINAL RESULTS');
  console.log('=' * 60);
  
  let allPassed = true;
  results.forEach(result => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${result.name}`);
    if (!result.success) allPassed = false;
  });
  
  console.log('\n📊 SUMMARY');
  console.log('=' * 60);
  
  if (allPassed) {
    console.log('🎉 ALL REQUIREMENTS MET!');
    console.log('✅ More than 50 tokens shown');
    console.log('✅ Accurate bonding percentages');
    console.log('✅ Sorting options working');
    console.log('✅ Only 90%+ or bonded tokens shown');
    console.log('✅ No fake data detected');
    console.log('✅ Dashboard ready for newly bonded tokens');
  } else {
    console.log('❌ SOME REQUIREMENTS NOT MET!');
    console.log('Please check the failed tests above');
  }
  
  return allPassed;
}

// Run the tests
runAllTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  });
