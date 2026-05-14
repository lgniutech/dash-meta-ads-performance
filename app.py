import os
from dotenv import load_dotenv

load_dotenv()

import dash
import dash_bootstrap_components as dbc

from layout import create_layout
from callbacks import register_callbacks
from api import MetaAdsAPI

# Demo mode when token not configured
_token_raw = os.getenv("META_ACCESS_TOKEN", "").strip()
_account = os.getenv("META_AD_ACCOUNT_ID", "").strip()

# Handle JSON token format if pasted directly
_token = _token_raw
if _token_raw.startswith("{"):
    try:
        import json
        _token = json.loads(_token_raw).get("access_token", _token_raw)
    except:
        pass

IS_DEMO = not _token or _token.startswith("your_")

dash_app = dash.Dash(
    __name__,
    external_stylesheets=[dbc.themes.BOOTSTRAP],
    suppress_callback_exceptions=True,
    title="Meta Ads Dashboard",
    meta_tags=[
        {"name": "viewport", "content": "width=device-width, initial-scale=1"},
        {"charset": "utf-8"},
    ],
)
app = dash_app.server

# Initial data fetch for layout
accounts = []
if not IS_DEMO:
    try:
        _api = MetaAdsAPI(_token, _account)
        accounts = _api.get_ad_accounts()
    except Exception as e:
        print(f"Error fetching accounts: {e}")
        accounts = []

dash_app.layout = create_layout(is_demo=IS_DEMO, accounts=accounts)
register_callbacks(dash_app)

if __name__ == "__main__":
    debug = os.getenv("DEBUG", "false").lower() == "true"
    dash_app.run(debug=debug, host="0.0.0.0", port=int(os.getenv("PORT", 8050)))
