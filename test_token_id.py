#!/usr/bin/env python3

import pymongo
from pymongo import MongoClient

def test_token_ids():
    """Test token IDs in database"""
    try:
        # Connect to MongoDB
        client = MongoClient('mongodb+srv://wasay:mongodb308@cluster0.etvipre.mongodb.net/TokenRadar')
        db = client['TokenRadar']
        collection = db['Rader']

        print('Sample token IDs from database:')
        print('='*60)
        
        # Get a few tokens to see their mint addresses
        tokens = list(collection.find({}).limit(10))
        
        for i, token in enumerate(tokens):
            mint = token.get('mint', 'NO_MINT')
            name = token.get('name', 'NO_NAME')
            symbol = token.get('symbol', 'NO_SYMBOL')
            print(f'{i+1}. {name} ({symbol})')
            print(f'   Mint: {mint}')
            print(f'   Length: {len(mint) if mint != "NO_MINT" else 0}')
            print()

        # Test a specific token ID from the URL
        test_id = "8vMy7KAeu41mJcFGxQ9uPGhWfTpJuJXt6auPRgX"
        print(f'Testing specific token ID: {test_id}')
        
        token = collection.find_one({'mint': test_id})
        if token:
            print(f'✅ Found token: {token.get("name")} ({token.get("symbol")})')
        else:
            print('❌ Token not found in database')
            
            # Check if there's a partial match
            partial_matches = list(collection.find({'mint': {'$regex': test_id[:20]}}))
            if partial_matches:
                print(f'Found {len(partial_matches)} partial matches:')
                for match in partial_matches[:3]:
                    print(f'  - {match.get("name")} ({match.get("symbol")}) - {match.get("mint")}')

        client.close()
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    test_token_ids()
