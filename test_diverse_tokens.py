#!/usr/bin/env python3

import pymongo
from pymongo import MongoClient

def test_diverse_bonding_percentages():
    """Test tokens with different bonding percentages"""
    try:
        # Connect to MongoDB
        client = MongoClient('mongodb+srv://wasay:mongodb308@cluster0.etvipre.mongodb.net/TokenRadar')
        db = client['TokenRadar']
        collection = db['Rader']

        print('DIVERSE BONDING PERCENTAGE SAMPLE:')
        print('='*50)

        # Get tokens with different bonding percentages
        for percentage in [10, 30, 50, 77, 99, 100]:
            token = collection.find_one({'bonding_percentage': percentage})
            if token:
                print(f'\n{percentage}% Bonded Token:')
                print(f'  name: {token.get("name")}')
                print(f'  symbol: {token.get("symbol")}')
                print(f'  usd_market_cap: ${token.get("usd_market_cap", 0):.2f}')
                print(f'  bonding_percentage: {token.get("bonding_percentage")}%')
                print(f'  complete: {token.get("complete")}')
                print(f'  mint: {token.get("mint")}')

        # Also get some random tokens to show variety
        print('\n' + '='*50)
        print('RANDOM SAMPLE OF TOKENS:')
        
        # Get 10 random tokens
        random_tokens = list(collection.aggregate([{'$sample': {'size': 10}}]))
        
        for i, token in enumerate(random_tokens):
            print(f'\nRandom Token {i+1}:')
            print(f'  name: {token.get("name")}')
            print(f'  symbol: {token.get("symbol")}')
            print(f'  usd_market_cap: ${token.get("usd_market_cap", 0):.2f}')
            print(f'  bonding_percentage: {token.get("bonding_percentage")}%')
            print(f'  complete: {token.get("complete")}')

        client.close()
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    test_diverse_bonding_percentages()
