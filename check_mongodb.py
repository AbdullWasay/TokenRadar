#!/usr/bin/env python3
"""
Simple script to check MongoDB data
"""

from pymongo import MongoClient

# Connect to MongoDB
MONGODB_URI = "mongodb+srv://wasay:mongodb308@cluster0.etvipre.mongodb.net/TokenRadar"

try:
    client = MongoClient(MONGODB_URI)
    db = client.TokenRadar
    collection = db.Rader
    
    # Check total count
    total_count = collection.count_documents({})
    print(f"Total tokens in MongoDB: {total_count}")
    
    if total_count > 0:
        # Get a few sample tokens
        sample_tokens = list(collection.find().limit(3))
        print("\nSample tokens:")
        for i, token in enumerate(sample_tokens, 1):
            name = token.get('name', 'Unknown')
            symbol = token.get('symbol', 'UNK')
            mint = token.get('mint', 'N/A')
            complete = token.get('complete', False)
            print(f"{i}. {name} ({symbol}) - Mint: {mint[:10]}... - Complete: {complete}")
            
        # Check collection names
        collections = db.list_collection_names()
        print(f"\nAvailable collections: {collections}")
    else:
        print("No tokens found in database!")
        
        # Check if collections exist
        collections = db.list_collection_names()
        print(f"Available collections: {collections}")
        
except Exception as e:
    print(f"Error: {e}")
