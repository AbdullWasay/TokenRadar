#!/usr/bin/env python3

import pymongo
from pymongo import MongoClient

def check_raydium_pools():
    """Check tokens with and without raydium pools"""
    try:
        # Connect to MongoDB
        client = MongoClient('mongodb+srv://wasay:mongodb308@cluster0.etvipre.mongodb.net/TokenRadar')
        db = client['TokenRadar']
        collection = db['Rader']

        print('Checking tokens with raydium pools:')
        print('='*50)

        # Check tokens with raydium pools
        with_pools_count = collection.count_documents({'raydium_pool': {'$ne': None}})
        print(f'Total tokens with raydium pools: {with_pools_count}')

        with_pools = list(collection.find({'raydium_pool': {'$ne': None}}).limit(5))
        for token in with_pools:
            print(f'  {token.get("name")} ({token.get("symbol")}) - Pool: {token.get("raydium_pool")}')

        print('\nChecking tokens without raydium pools:')
        without_pools_count = collection.count_documents({'raydium_pool': None})
        print(f'Total tokens without raydium pools: {without_pools_count}')

        without_pools = list(collection.find({'raydium_pool': None}).limit(5))
        for token in without_pools:
            print(f'  {token.get("name")} ({token.get("symbol")}) - Bonding: {token.get("bonding_percentage")}%')

        # Check if we can get DexScreener data for tokens without raydium pools
        print('\nTesting DexScreener API for token without raydium pool:')
        test_token = without_pools[0] if without_pools else None
        if test_token:
            print(f'Testing token: {test_token.get("name")} ({test_token.get("symbol")})')
            print(f'Mint address: {test_token.get("mint")}')
            
            # Test DexScreener API call
            import requests
            try:
                url = f'https://api.dexscreener.com/latest/dex/tokens/{test_token.get("mint")}'
                print(f'DexScreener URL: {url}')
                
                response = requests.get(url, headers={
                    'Accept': 'application/json',
                    'User-Agent': 'TokenRadar-DexScreener-Client/1.0'
                }, timeout=10)
                
                print(f'Response status: {response.status_code}')
                if response.status_code == 200:
                    data = response.json()
                    if data.get('pairs'):
                        print(f'Found {len(data["pairs"])} pairs on DexScreener')
                        pair = data['pairs'][0]
                        print(f'  Price: ${pair.get("priceUsd", "N/A")}')
                        if pair.get('priceChange'):
                            changes = pair['priceChange']
                            print(f'  5m: {changes.get("m5", "N/A")}%')
                            print(f'  1h: {changes.get("h1", "N/A")}%')
                            print(f'  6h: {changes.get("h6", "N/A")}%')
                            print(f'  24h: {changes.get("h24", "N/A")}%')
                    else:
                        print('No pairs found on DexScreener')
                else:
                    print(f'DexScreener API error: {response.status_code}')
            except Exception as e:
                print(f'Error testing DexScreener API: {e}')

        client.close()
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    check_raydium_pools()
