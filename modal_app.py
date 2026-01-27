import modal
from supabase import create_client, Client
import os
import random

app = modal.App("city-stacker-backend")

image = modal.Image.debian_slim().pip_install("supabase")

@app.function(image=image, schedule=modal.Period(hours=24))
def daily_tick():
    print("Running Daily Tick...")
    
    # Initialize Supabase
    url: str = os.environ["SUPABASE_URL"]
    key: str = os.environ["SUPABASE_KEY"]
    supabase: Client = create_client(url, key)

    # 1. Distribute Daily Funds
    print("Distributing City Funds...")
    # Logic: Fetch all players, add +1000 funds (Mock)
    # response = supabase.table("players").update({"funds": "funds + 1000"}).execute()
    
    # 2. Trigger Ecological Crisis (10% Chance)
    if random.random() < 0.1:
        trigger_crisis(supabase)
    else:
        print("No crisis today. The city is safe.")

def trigger_crisis(supabase: Client):
    print("⚠️ TRIGGERING ECOLOGICAL CRISIS ⚠️")
    event_data = {
        "type": "flooding",
        "description": "Rising sea levels threaten the lower districts.",
        "impact_multiplier": 0.5,
        "active": True
    }
    # supabase.table("events").insert(event_data).execute()
    print("Crisis logged to database.")

@app.function(image=image)
def test_tick():
    """Manual trigger for testing"""
    daily_tick.local()
