import requests
import json

token = "EAAONvIhv3IABRXa3XI5h37NDcKzHeHGPnncEZBsC5WuZCliISzK8bQH2FpZBug68eKs78rVVcrwom5XbmImYgaGHTXnuv8pcInSXuKGnZB2y9ZAzrlJ4wDY5vZCN5VgzchkmenuZCY0E3XLBktzhCY1Q2RJSazcDn9sz1Uy3cdrmgqkVcfpZBafPTSdu4b4vzY32"
base_url = "https://graph.facebook.com/v21.0"
account_id = "act_836687475741699" # Mariana Rodrigues

def check_insights():
    print(f"--- Verificando Insights para a conta {account_id} ---")
    params = {
        "access_token": token,
        "fields": "spend,impressions,clicks,reach,actions,action_values",
        "date_preset": "last_30d",
        "level": "account"
    }
    try:
        r = requests.get(f"{base_url}/{account_id}/insights", params=params)
        data = r.json()
        if "error" in data:
            print(f"API Error: {data['error'].get('message')}")
            return
        
        items = data.get("data", [])
        if not items:
            print("Nenhum insight encontrado para os últimos 30 dias.")
            return
            
        res = items[0]
        print(f"Investimento Total (Spend): R$ {res.get('spend')}")
        print(f"Impressões: {res.get('impressions')}")
        print(f"Cliques: {res.get('clicks')}")
        
        actions = res.get("actions", [])
        print("\nAções encontradas:")
        for a in actions:
            print(f"- {a.get('action_type')}: {a.get('value')}")
            
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    check_insights()
