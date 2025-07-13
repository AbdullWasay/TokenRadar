#!/usr/bin/env python3

import pymongo
from pymongo import MongoClient

def debug_bonded_query():
    """Debug why bonded tokens query is failing"""
    try:
        # Connect to MongoDB
        client = MongoClient('mongodb+srv://wasay:mongodb308@cluster0.etvipre.mongodb.net/TokenRadar')
        db = client['TokenRadar']
        collection = db['Rader']

        print('DEBUGGING BONDED TOKENS QUERY:')
        print('='*50)

        # Test the exact query used by the API
        api_query = { 
            '$or': [
                {'complete': True},
                {'is_bonded': True},
                {'bonding_percentage': 100}
            ]
        }

        print('Testing API query:', api_query)
        bonded_count = collection.count_documents(api_query)
        print(f'Bonded tokens found: {bonded_count}')

        # Test individual conditions
        complete_true = collection.count_documents({'complete': True})
        print(f'complete=True: {complete_true}')

        is_bonded_true = collection.count_documents({'is_bonded': True})
        print(f'is_bonded=True: {is_bonded_true}')

        bonding_100 = collection.count_documents({'bonding_percentage': 100})
        print(f'bonding_percentage=100: {bonding_100}')

        # Get sample bonded tokens
        bonded_tokens = list(collection.find({'complete': True}).limit(3))
        print(f'\nSample bonded tokens:')
        for token in bonded_tokens:
            print(f'  {token.get("name")} - complete: {token.get("complete")}, bonding: {token.get("bonding_percentage")}%')

        # Test today's bonded tokens (for newly bonded section)
        from datetime import datetime, timedelta
        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        today_timestamp = int(today.timestamp() * 1000)
        
        print(f'\nToday timestamp: {today_timestamp}')
        
        today_bonded = collection.count_documents({
            'complete': True,
            'created_timestamp': {'$gte': today_timestamp}
        })
        print(f'Tokens bonded today: {today_bonded}')

        client.close()
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    debug_bonded_query()
