#!/usr/bin/env python3
"""
Continuous pump.fun scraper
Runs the pump_scraper_mongodb.py script every 30 seconds
"""

import subprocess
import time
import sys
from datetime import datetime

def run_scraper():
    """Run the pump.fun scraper"""
    try:
        print(f"\n[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Starting scraper...")

        # Run the scraper for all tokens with limit 500
        result = subprocess.run([
            'python', 'pump_scraper_mongodb.py', 'all', '500'
        ], capture_output=True, text=True, timeout=300)

        if result.returncode == 0:
            print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Scraper completed successfully")
            # Print last few lines of output
            output_lines = result.stdout.strip().split('\n')
            for line in output_lines[-3:]:
                if line.strip():
                    print(f"   {line}")
        else:
            print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Scraper failed with code {result.returncode}")
            if result.stderr:
                print(f"   Error: {result.stderr}")

    except subprocess.TimeoutExpired:
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Scraper timed out after 2 minutes")
    except Exception as e:
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Error running scraper: {e}")

def main():
    """Main continuous scraping loop"""
    print("CONTINUOUS PUMP.FUN SCRAPER")
    print("=" * 50)
    print("Scraping pump.fun every 30 seconds...")
    print("Press Ctrl+C to stop")
    print("=" * 50)
    
    try:
        while True:
            run_scraper()
            
            # Wait 30 seconds before next run
            print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Waiting 30 seconds...")
            time.sleep(30)

    except KeyboardInterrupt:
        print(f"\n[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Continuous scraper stopped by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Continuous scraper error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
