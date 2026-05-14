import os
from dotenv import load_dotenv

load_dotenv()

import dash
import dash_bootstrap_components as dbc

from layout import create_layout
from callbacks import register_callbacks

# Demo mode when token not configured
_token = os.getenv("META_ACCESS_TOKEN", "").strip()
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

dash_app.layout = create_layout(is_demo=IS_DEMO)
register_callbacks(dash_app)

if __name__ == "__main__":
    debug = os.getenv("DEBUG", "false").lower() == "true"
    dash_app.run(debug=debug, host="0.0.0.0", port=int(os.getenv("PORT", 8050)))
