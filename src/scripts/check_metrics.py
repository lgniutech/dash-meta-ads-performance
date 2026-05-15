import os
import json
import requests

TOKEN = "EAAONvIhv3IABRXa3XI5h37NDcKzHeHGPnncEZBsC5WuZCliISzK8bQH2FpZBug68eKs78rVVcrwom5XbmImYgaGHTXnuv8pcInSXuKGnZB2y9ZAzrlJ4wDY5vZCN5VgzchkmenuZCY0E3XLBktzhCY1Q2RJSazcDn9sz1Uy3cdrmgqkVcfpZBafPTSdu4b4vzY32"

def find_active_account():
    resp = requests.get(f"https://graph.facebook.com/v21.0/me/adaccounts?access_token={TOKEN}&fields=id,name,account_status")
    accounts = resp.json().get('data', [])
    
    print(f"Encontradas {len(accounts)} contas. Buscando uma com investimento...")
    
    for acc in accounts:
        acc_id = acc['id']
        # Check spend in last 90 days to find an active one
        check = requests.get(f"https://graph.facebook.com/v21.0/{acc_id}/insights?access_token={TOKEN}&fields=spend&date_preset=last_90d")
        data = check.json().get('data', [])
        if data and float(data[0].get('spend', 0)) > 0:
            print(f"Bingo! Conta Ativa: {acc['name']} ({acc_id})")
            return acc_id
    
    return None

def probe_account(account_id):
    fields = [
        "spend", "impressions", "clicks", "reach", "frequency", "ctr", "cpc", "cpm",
        "actions", "action_values", "cost_per_action_type",
        "video_p25_watched_actions", "video_p50_watched_actions", "video_p75_watched_actions", "video_p100_watched_actions",
        "video_thruplay_watched_actions", "video_avg_time_watched_actions",
        "outbound_clicks", "cost_per_outbound_click", "outbound_clicks_ctr",
        "purchase_roas", "website_ctr"
    ]
    
    params = {
        "access_token": TOKEN,
        "fields": ",".join(fields),
        "date_preset": "last_30d",
        "level": "account"
    }
    
    resp = requests.get(f"https://graph.facebook.com/v21.0/{account_id}/insights", params=params)
    print("\n--- Insights Detalhados ---")
    print(json.dumps(resp.json(), indent=2))

    # Ad creatives
    resp = requests.get(f"https://graph.facebook.com/v21.0/{account_id}/ads?access_token={TOKEN}&fields=name,creative{{id,name,image_url,thumbnail_url,video_id}}&limit=10")
    print("\n--- Criativos ---")
    print(json.dumps(resp.json(), indent=2))

if __name__ == "__main__":
    active_id = find_active_account()
    if active_id:
        probe_account(active_id)
    else:
        print("Não encontrei nenhuma conta com investimento nos últimos 90 dias.")
