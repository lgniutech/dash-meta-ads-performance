import os
import json
import requests
from datetime import datetime, timedelta

TOKEN = "EAAONvIhv3IABRXa3XI5h37NDcKzHeHGPnncEZBsC5WuZCliISzK8bQH2FpZBug68eKs78rVVcrwom5XbmImYgaGHTXnuv8pcInSXuKGnZB2y9ZAzrlJ4wDY5vZCN5VgzchkmenuZCY0E3XLBktzhCY1Q2RJSazcDn9sz1Uy3cdrmgqkVcfpZBafPTSdu4b4vzY32"
ACCOUNT_ID = "act_455824790263555"

def check_dates_and_funnel():
    print(f"--- Analisando Dados Recentes da Conta: {ACCOUNT_ID} ---")
    
    fields = [
        "date_start", "spend", "impressions", "clicks", "actions"
    ]
    
    params = {
        "access_token": TOKEN,
        "fields": ",".join(fields),
        "date_preset": "last_30d",
        "time_increment": 1,
        "level": "account"
    }
    
    resp = requests.get(f"https://graph.facebook.com/v21.0/{ACCOUNT_ID}/insights", params=params)
    data = resp.json().get('data', [])
    
    if not data:
        print("Nenhum dado retornado para last_30d.")
        return

    print("\n[ÚLTIMOS 5 DIAS RETORNADOS]")
    for item in data[:5]:
        print(f"Data: {item['date_start']} | Gasto: {item.get('spend')} | Cliques: {item.get('clicks')}")

    print("\n[PRIMEIROS 5 DIAS RETORNADOS]")
    for item in data[-5:]:
        print(f"Data: {item['date_start']} | Gasto: {item.get('spend')} | Cliques: {item.get('clicks')}")

    # Check funnel actions in the last day with data
    last_day = data[0]
    print(f"\n[AÇÕES NO DIA {last_day['date_start']}]")
    actions = last_day.get('actions', [])
    for action in actions:
        print(f"- {action['action_type']}: {action['value']}")

if __name__ == "__main__":
    check_dates_and_funnel()
