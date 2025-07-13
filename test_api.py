#!/usr/bin/env python3

import pymongo
from pymongo import MongoClient

def test_mongodb_query():
    """Test MongoDB query to see if bonded tokens are found"""
    try:
        # Connect to MongoDB
        client = MongoClient('mongodb+srv://wasay:mongodb308@cluster0.etvipre.mongodb.net/TokenRadar')
        db = client['TokenRadar']
        collection = db['Rader']

        print("Testing MongoDB queries...")
        
        # Test 1: Count all tokens
        total_tokens = collection.count_documents({})
        print(f"Total tokens in database: {total_tokens}")
        
        # Test 2: Count bonded tokens using different criteria
        bonded_complete = collection.count_documents({'complete': True})
        print(f"Tokens with complete=True: {bonded_complete}")
        
        bonded_is_bonded = collection.count_documents({'is_bonded': True})
        print(f"Tokens with is_bonded=True: {bonded_is_bonded}")
        
        bonded_percentage = collection.count_documents({'bonding_percentage': 100})
        print(f"Tokens with bonding_percentage=100: {bonded_percentage}")
        
        # Test 3: Use the same query as the API
        api_query = { 
            '$or': [
                {'complete': True},
                {'is_bonded': True},
                {'bonding_percentage': 100}
            ]
        }
        bonded_api_query = collection.count_documents(api_query)
        print(f"Tokens matching API query: {bonded_api_query}")
        
        # Test 4: Get a few bonded tokens to see their structure
        bonded_tokens = list(collection.find(api_query).limit(3))
        print(f"\nSample bonded tokens:")
        for i, token in enumerate(bonded_tokens):
            print(f"Token {i+1}:")
            print(f"  Name: {token.get('name')}")
            print(f"  Symbol: {token.get('symbol')}")
            print(f"  Complete: {token.get('complete')}")
            print(f"  Is Bonded: {token.get('is_bonded')}")
            print(f"  Bonding %: {token.get('bonding_percentage')}")
            print(f"  Created: {token.get('created_timestamp')}")
            print()
        
        client.close()
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    test_mongodb_query()
