#!/usr/bin/env python3
"""
Pump.fun scraper that saves data to MongoDB
This script implements the Python scraping method and stores data in MongoDB
"""

import requests
import json
import time
import sys
from datetime import datetime
from pymongo import MongoClient
import os

# MongoDB connection
MONGODB_URI = "mongodb+srv://wasay:mongodb308@cluster0.etvipre.mongodb.net/TokenRadar"

# Headers and cookies from the tutorial (you'll need to update these with fresh ones)
cookies = {
    '_ga': 'GA1.1.1085779232.1743616310',
    'intercom-id-w7scljv7': 'c042e584-67f0-4653-b79c-e724e4030fa1',
    'intercom-device-id-w7scljv7': '0d5c5a65-93aa-486f-8784-0bd4f1a63cd3',
    'fs_uid': '#o-1YWTMD-na1#34094bea-8456-49bd-b821-968173400217:091b5c8f-9018-43f2-b7f4-abe27606f49d:1745422245728::1#/1767903960',
    '_ga_T65NVS2TQ6': 'GS1.1.1745422266.7.0.1745422266.60.0.0',
    'intercom-session-w7scljv7': '',
    '_cf_bm': 'bXgkxQ3QMgPDJI_j628.5Lp04FJFfMBb2GOnDfJ418-1748963512-1.0.1.1-rHQcg_XQhNsJopxGC_yCNB5QQiWXBP_rSkMoXvsWeFBwWmRdhk5aJhVNVRBWm.WDJyZ',
    'cf_clearance': 'fmx.QscgUNIM0bi831dIxK1CNseSVZz6TukXfOGPpL4-1748963513-1.2.1.1-xkPmOfkX_2fCy.jaViYEnIiRAwpFQuhv3vmmbHowWX_Du9hBK7BFgfLZ_yne9C'
}

headers = {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9,es;q=0.8',
    'content-type': 'application/json',
    'origin': 'https://pump.fun',
    'priority': 'u=1, i',
    'referer': 'https://pump.fun/',
    'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
}

def connect_to_mongodb():
    """Connect to MongoDB"""
    try:
        client = MongoClient(MONGODB_URI)
        db = client.TokenRadar
        collection = db.Rader
        # Test connection
        client.admin.command('ping')
        print("Connected to MongoDB successfully")
        return collection
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        return None

def fetch_pump_tokens(token_type='all', offset=0, limit=500):
    """
    Fetch tokens from pump.fun using the tutorial method
    token_type: 'all', 'bonded', or 'recent'
    """
    params = {
        'offset': str(offset),
        'limit': str(limit),
        'sort': 'created_timestamp',
        'includeNsfw': 'false',
        'order': 'DESC',
    }
    
    # Add complete parameter for bonded tokens
    if token_type == 'bonded':
        params['complete'] = 'true'
    
    try:
        response = requests.get(
            'https://frontend-api-v3.pump.fun/coins', 
            params=params, 
            cookies=cookies, 
            headers=headers,
            timeout=30
        )
        
        if response.status_code == 200:
            tokens = response.json()
            print(f"Found {len(tokens)} {token_type} tokens from pump.fun")
            return tokens
        else:
            print(f"Request failed with status: {response.status_code}")
            return []

    except Exception as e:
        print(f"Error fetching tokens: {e}")
        return []

def process_token_data(token):
    """Process and normalize token data"""
    # Handle timestamp conversion safely (pump.fun uses milliseconds)
    created_timestamp = token.get('created_timestamp', 0)
    try:
        if created_timestamp and created_timestamp > 0:
            # Convert from milliseconds to seconds for Python datetime
            timestamp_seconds = created_timestamp / 1000
            created_date = datetime.fromtimestamp(timestamp_seconds)
        else:
            created_date = datetime.now()
    except (OSError, ValueError):
        created_date = datetime.now()
    
    # Calculate bonding percentage
    market_cap = token.get('usd_market_cap', 0)
    bonding_percentage = min(round((market_cap / 69000) * 100), 99) if not token.get('complete') else 100
    
    # Determine bonding status
    is_complete = token.get('complete', False)
    has_raydium = token.get('raydium_pool') is not None
    is_bonded = is_complete or has_raydium
    
    return {
        'mint': token.get('mint', ''),
        'name': token.get('name', 'Unknown'),
        'symbol': token.get('symbol', 'UNK'),
        'description': token.get('description', ''),
        'image': token.get('image', ''),
        'created_timestamp': created_timestamp,
        'created_date': created_date,
        'usd_market_cap': market_cap,
        'market_cap': token.get('market_cap', 0),
        'bonding_percentage': bonding_percentage,
        'complete': is_complete,
        'raydium_pool': token.get('raydium_pool'),
        'is_bonded': is_bonded,
        'total_supply': token.get('total_supply', 1000000000),
        'website': token.get('website'),
        'twitter': token.get('twitter'),
        'telegram': token.get('telegram'),
        'bonding_curve': token.get('bonding_curve', ''),
        'associated_bonding_curve': token.get('associated_bonding_curve', ''),
        'creator': token.get('creator', ''),
        'metadataUri': token.get('metadataUri', ''),
        'virtual_sol_reserves': token.get('virtual_sol_reserves', 0),
        'virtual_token_reserves': token.get('virtual_token_reserves', 0),
        'nsfw': token.get('nsfw', False),
        'reply_count': token.get('reply_count', 0),
        'last_reply': token.get('last_reply', 0),
        'show_name': token.get('show_name', True),
        'is_currently_live': token.get('is_currently_live', False),
        'scraped_at': datetime.now(),
        'source': 'pump-fun-python-scraper'
    }

def save_tokens_to_mongodb(tokens, collection):
    """Save tokens to MongoDB with upsert"""
    if collection is None:
        print("No MongoDB collection available")
        return 0
    
    saved_count = 0
    updated_count = 0
    
    for token_data in tokens:
        processed_token = process_token_data(token_data)
        
        try:
            # Use upsert to avoid duplicates based on mint address
            result = collection.update_one(
                {'mint': processed_token['mint']},
                {'$set': processed_token},
                upsert=True
            )
            
            if result.upserted_id:
                saved_count += 1
            elif result.modified_count > 0:
                updated_count += 1
                
        except Exception as e:
            print(f"Error saving token {processed_token.get('name', 'Unknown')}: {e}")

    print(f"Saved {saved_count} new tokens, updated {updated_count} existing tokens")
    return saved_count + updated_count

def scrape_and_save(token_type='all', limit=500):
    """Main function to scrape tokens and save to MongoDB"""
    print(f"Starting pump.fun scraper for {token_type} tokens...")

    # Connect to MongoDB
    collection = connect_to_mongodb()
    if collection is None:
        return False

    # Fetch tokens in batches since API limits to ~50 per request
    all_tokens = []
    batch_size = 50
    max_batches = min(10, (limit // batch_size) + 1)  # Limit to 10 batches max

    for batch in range(max_batches):
        offset = batch * batch_size
        print(f"Fetching batch {batch + 1}/{max_batches} (offset: {offset})")

        tokens = fetch_pump_tokens(token_type=token_type, offset=offset, limit=batch_size)
        if not tokens:
            print(f"No tokens in batch {batch + 1}, stopping")
            break

        all_tokens.extend(tokens)

        # If we got fewer tokens than requested, we've reached the end
        if len(tokens) < batch_size:
            print(f"Got {len(tokens)} tokens (less than {batch_size}), reached end")
            break

    if not all_tokens:
        print("No tokens fetched")
        return False

    # Save to MongoDB
    saved_count = save_tokens_to_mongodb(all_tokens, collection)

    print(f"Scraping complete! Processed {len(all_tokens)} tokens, saved/updated {saved_count}")
    return True

def main():
    """Main function"""
    # Get command line arguments
    token_type = sys.argv[1] if len(sys.argv) > 1 else 'all'
    limit = int(sys.argv[2]) if len(sys.argv) > 2 else 500

    print(f"PUMP.FUN PYTHON SCRAPER (MongoDB Integration)")
    print(f"Token Type: {token_type}, Limit: {limit}")
    print("=" * 60)

    success = scrape_and_save(token_type=token_type, limit=limit)

    if success:
        print("\nScraping completed successfully!")
    else:
        print("\nScraping failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
