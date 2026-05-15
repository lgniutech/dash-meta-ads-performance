import requests
import json

token = "EAAONvIhv3IABRXa3XI5h37NDcKzHeHGPnncEZBsC5WuZCliISzK8bQH2FpZBug68eKs78rVVcrwom5XbmImYgaGHTXnuv8pcInSXuKGnZB2y9ZAzrlJ4wDY5vZCN5VgzchkmenuZCY0E3XLBktzhCY1Q2RJSazcDn9sz1Uy3cdrmgqkVcfpZBafPTSdu4b4vzY32"
base_url = "https://graph.facebook.com/v21.0"

def find_active_account():
    # List first 10 accounts
    r = requests.get(f"{base_url}/me/adaccounts", params={"access_token": token, "fields": "id,name"})
    accounts = r.json().get("data", [])
    
    for a in accounts:
        aid = a["id"]
        print(f"Verificando {a['name']} ({aid})...")
        params = {
            "access_token": token,
            "fields": "spend,impressions",
            "date_preset": "last_30d",
            "level": "account"
        }
        ri = requests.get(f"{base_url}/{aid}/insights", params=params)
        idata = ri.json().get("data", [])
        if idata:
            res = idata[0]
            print(f"✅ DADOS ENCONTRADOS: Spend R$ {res.get('spend')}, Impressoes: {res.get('impressions')}")
            return aid
        else:
            print("Sem dados nos ultimos 30 dias.")
    return None

if __name__ == "__main__":
    find_active_account()
