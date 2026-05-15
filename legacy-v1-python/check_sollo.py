import requests
import json

token = "EAAONvIhv3IABRXa3XI5h37NDcKzHeHGPnncEZBsC5WuZCliISzK8bQH2FpZBug68eKs78rVVcrwom5XbmImYgaGHTXnuv8pcInSXuKGnZB2y9ZAzrlJ4wDY5vZCN5VgzchkmenuZCY0E3XLBktzhCY1Q2RJSazcDn9sz1Uy3cdrmgqkVcfpZBafPTSdu4b4vzY32"
base_url = "https://graph.facebook.com/v21.0"
aid = "act_455824790263555" # Sollo Pizzas

def check_sollo():
    print(f"--- Insights: SOLLO PIZZAS ({aid}) ---")
    params = {
        "access_token": token,
        "fields": "spend,impressions,clicks,reach,actions,action_values",
        "date_preset": "last_30d",
        "level": "account"
    }
    r = requests.get(f"{base_url}/{aid}/insights", params=params)
    items = r.json().get("data", [])
    if items:
        res = items[0]
        print(f"Spend: R$ {res.get('spend')}")
        print(f"Impressions: {res.get('impressions')}")
        print(f"Clicks: {res.get('clicks')}")
        # Check for purchases/leads
        actions = res.get("actions", [])
        for a in actions:
            if "purchase" in a['action_type'] or "lead" in a['action_type']:
                print(f"- {a['action_type']}: {a['value']}")
    else:
        print("No data found.")

if __name__ == "__main__":
    check_sollo()
