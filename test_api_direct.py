#!/usr/bin/env python3

import pymongo
from pymongo import MongoClient
import json

def test_api_transformation():
    """Test the same transformation logic as the API"""
    try:
        # Connect to MongoDB
        client = MongoClient('mongodb+srv://wasay:mongodb308@cluster0.etvipre.mongodb.net/TokenRadar')
        db = client['TokenRadar']
        collection = db['Rader']

        # Get 5 tokens with different bonding percentages
        tokens = list(collection.find({}).limit(5))
        
        print('TESTING API TRANSFORMATION:')
        print('='*60)
        
        for i, token in enumerate(tokens):
            print(f'\nToken {i+1} - REAL DATABASE DATA:')
            print(f'  name: {token.get("name")}')
            print(f'  symbol: {token.get("symbol")}')
            print(f'  usd_market_cap: {token.get("usd_market_cap")}')
            print(f'  bonding_percentage: {token.get("bonding_percentage")}')
            print(f'  complete: {token.get("complete")}')
            print(f'  created_timestamp: {token.get("created_timestamp")}')
            
            # Apply the same transformation as the API
            real_bonding_percentage = token.get('bonding_percentage', 0)
            is_bonded = token.get('complete') or token.get('is_bonded') or token.get('bonding_percentage') == 100
            
            # Format market cap
            usd_market_cap = token.get('usd_market_cap', 0)
            if usd_market_cap >= 1000000:
                formatted_market_cap = f"${(usd_market_cap / 1000000):.2f}M"
            elif usd_market_cap >= 1000:
                formatted_market_cap = f"${(usd_market_cap / 1000):.2f}K"
            else:
                formatted_market_cap = f"${usd_market_cap:.2f}"
            
            # Format timestamp
            timestamp = token.get('created_timestamp')
            if timestamp:
                from datetime import datetime
                date = datetime.fromtimestamp(timestamp / 1000)  # Convert from milliseconds
                formatted_date = date.strftime('%m/%d/%Y')
            else:
                formatted_date = 'Unknown'
            
            print(f'\n  TRANSFORMED FOR FRONTEND:')
            print(f'    marketCap: {formatted_market_cap}')
            print(f'    bondedPercentage: {real_bonding_percentage}%')
            print(f'    bonded: {is_bonded}')
            print(f'    created: {formatted_date}')
            print(f'    id: {token.get("mint")}')

        # Test bonded tokens query
        print('\n' + '='*60)
        print('TESTING BONDED TOKENS QUERY:')
        
        bonded_query = { 
            '$or': [
                {'complete': True},
                {'is_bonded': True},
                {'bonding_percentage': 100}
            ]
        }
        bonded_tokens = list(collection.find(bonded_query).limit(3))
        print(f'Found {len(bonded_tokens)} bonded tokens')
        
        for i, token in enumerate(bonded_tokens):
            print(f'\nBonded Token {i+1}:')
            print(f'  name: {token.get("name")}')
            print(f'  bonding_percentage: {token.get("bonding_percentage")}%')
            print(f'  complete: {token.get("complete")}')
            print(f'  usd_market_cap: ${token.get("usd_market_cap", 0):.2f}')

        client.close()
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    test_api_transformation()
