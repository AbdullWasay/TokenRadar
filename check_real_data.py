#!/usr/bin/env python3

import pymongo
from pymongo import MongoClient

def check_real_database_fields():
    """Check the REAL field names and values in the database"""
    try:
        # Connect to MongoDB
        client = MongoClient('mongodb+srv://wasay:mongodb308@cluster0.etvipre.mongodb.net/TokenRadar')
        db = client['TokenRadar']
        collection = db['Rader']

        # Get a few tokens to see the REAL field names and values
        tokens = list(collection.find({}).limit(5))
        print('REAL DATABASE FIELDS:')
        for i, token in enumerate(tokens):
            print(f'\nToken {i+1}:')
            print(f'  name: {token.get("name")}')
            print(f'  symbol: {token.get("symbol")}')
            print(f'  usd_market_cap: {token.get("usd_market_cap")}')
            print(f'  market_cap: {token.get("market_cap")}')
            print(f'  bonding_percentage: {token.get("bonding_percentage")}')
            print(f'  complete: {token.get("complete")}')
            print(f'  is_bonded: {token.get("is_bonded")}')
            print(f'  created_timestamp: {token.get("created_timestamp")}')
            print(f'  created_date: {token.get("created_date")}')
            
        # Check different bonding percentages
        print('\n' + '='*50)
        print('BONDING PERCENTAGE DISTRIBUTION:')
        
        # Get unique bonding percentages
        bonding_percentages = collection.distinct('bonding_percentage')
        bonding_percentages.sort()
        print(f'Unique bonding percentages: {bonding_percentages}')
        
        # Count tokens by bonding percentage
        for percentage in [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]:
            count = collection.count_documents({'bonding_percentage': percentage})
            if count > 0:
                print(f'Tokens with {percentage}% bonding: {count}')

        client.close()
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    check_real_database_fields()
