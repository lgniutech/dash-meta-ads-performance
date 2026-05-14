from datetime import date, timedelta
from dash import html, dcc


# ── SVG logo icon ────────────────────────────────────────────────────────────

LOGO_SVG = html.Span(
    "◆",
    style={"color": "#3ddb6e", "fontSize": "18px", "lineHeight": "1"},
)


# ── Helpers ───────────────────────────────────────────────────────────────────

def _icon_sort():
    return html.Span("⇅", style={"color": "#5a8a8a", "fontSize": "11px", "cursor": "pointer"})


def _icon_filter():
    return html.Span("≡", style={"color": "#5a8a8a", "fontSize": "14px", "cursor": "pointer"})


def _icon_dots():
    return html.Span("⋯", style={"color": "#5a8a8a", "fontSize": "14px", "cursor": "pointer"})


# ── Navbar ────────────────────────────────────────────────────────────────────

def create_navbar(accounts: list = None) -> html.Div:
    account_opts = []
    if accounts:
        account_opts = [
            {"label": a.get("name", a["id"]), "value": a["id"]}
            for a in accounts
        ]

    today = date.today()
    default_end = today
    default_start = today - timedelta(days=13)

    return html.Div(
        className="dash-navbar",
        children=[
            # Logo
            html.Div(
                className="dash-logo",
                children=[
                    LOGO_SVG,
                    html.Span("meta ads", className="dash-logo-text"),
                ],
            ),
            # Title
            html.Div(
                "Acompanhe seus Resultados por período, conta e público",
                className="dash-title",
            ),
            # Date range
            dcc.DatePickerRange(
                id="date-range",
                start_date=default_start,
                end_date=default_end,
                display_format="DD MMM YYYY",
                first_day_of_week=1,
                style={"fontSize": "12px"},
            ),
            # Account dropdown
            dcc.Dropdown(
                id="dropdown-account",
                options=account_opts,
                value=account_opts[0]["value"] if account_opts else None,
                placeholder="Conta de Anúncio",
                clearable=False,
                className="dash-filter",
                style={
                    "backgroundColor": "#0c2020",
                    "border": "1px solid #1a4040",
                    "borderRadius": "4px",
                    "color": "#ddf0f0",
                    "minWidth": "180px",
                    "fontSize": "12px",
                },
            ),
            # Campaign dropdown
            dcc.Dropdown(
                id="dropdown-campaign",
                options=[],
                value=None,
                placeholder="Campanha",
                multi=True,
                className="dash-filter",
                style={
                    "backgroundColor": "#0c2020",
                    "border": "1px solid #1a4040",
                    "borderRadius": "4px",
                    "color": "#ddf0f0",
                    "minWidth": "160px",
                    "fontSize": "12px",
                },
            ),
            # Ad set dropdown
            dcc.Dropdown(
                id="dropdown-adset",
                options=[],
                value=None,
                placeholder="Conjunto de Anúncios",
                multi=True,
                className="dash-filter",
                style={
                    "backgroundColor": "#0c2020",
                    "border": "1px solid #1a4040",
                    "borderRadius": "4px",
                    "color": "#ddf0f0",
                    "minWidth": "180px",
                    "fontSize": "12px",
                },
            ),
        ],
    )


# ── KPI Cards ─────────────────────────────────────────────────────────────────

def _kpi(label: str, val_id: str, chg_id: str) -> html.Div:
    return html.Div(
        className="kpi-card",
        children=[
            html.Div(label, className="kpi-label"),
            html.Div("—", id=val_id, className="kpi-value"),
            html.Div("", id=chg_id, className="kpi-change change-pos"),
        ],
    )


def create_kpi_row() -> html.Div:
    return html.Div(
        className="kpi-row",
        children=[
            _kpi("Investimento Total", "kpi-spend", "kpi-spend-chg"),
            _kpi("Receita Total", "kpi-revenue", "kpi-revenue-chg"),
            _kpi("Compras / Leads", "kpi-conv", "kpi-conv-chg"),
            _kpi("Ticket Médio / CPL", "kpi-aov", "kpi-aov-chg"),
            _kpi("Custo por Compra (CPA)", "kpi-cpa", "kpi-cpa-chg"),
            _kpi("ROAS / CTR", "kpi-roas", "kpi-roas-chg"),
        ],
    )


# ── Funnel Panel ──────────────────────────────────────────────────────────────

def _fsub(label: str, val_id: str, chg_id: str = None) -> html.Div:
    children = [
        html.Div(label, className="funnel-sub-label"),
        html.Div("—", id=val_id, className="funnel-sub-value"),
    ]
    if chg_id:
        children.append(html.Div("", id=chg_id, className="funnel-sub-change change-pos"))
    return html.Div(children, className="funnel-sub-item")


def _fcard(title: str, val_id: str, chg_id: str, subs: list = None) -> html.Div:
    children = [
        html.Div(title, className="funnel-section-title"),
        html.Div("—", id=val_id, className="funnel-main-value"),
        html.Div("", id=chg_id, className="funnel-main-change change-pos"),
    ]
    if subs:
        children.append(html.Div(subs, className="funnel-sub-row"))
    return html.Div(children, className="funnel-card")


def create_funnel_panel() -> html.Div:
    return html.Div(
        className="funnel-panel",
        children=[
            _fcard(
                "Impressões",
                "f-impressions", "f-impressions-chg",
                subs=[
                    _fsub("ThruPlay", "f-thruplay", "f-thruplay-chg"),
                    _fsub("CTR", "f-ctr", "f-ctr-chg"),
                ],
            ),
            _fcard(
                "Cliques",
                "f-clicks", "f-clicks-chg",
                subs=[
                    _fsub("Hook Rate", "f-hook"),
                    _fsub("Connect Rate", "f-connect"),
                ],
            ),
            _fcard(
                "Visitas na Página",
                "f-views", "f-views-chg",
                subs=[
                    _fsub("Retenção", "f-retention", "f-retention-chg"),
                    _fsub("Tx. Inic. Compra", "f-tx-iniciou"),
                ],
            ),
            _fcard(
                "Iniciou Compra",
                "f-checkout", "f-checkout-chg",
                subs=[
                    _fsub("CPM", "f-cpm"),
                    _fsub("Tx. Compras", "f-tx-compras"),
                ],
            ),
            _fcard(
                "Compras / Leads",
                "f-conv", "f-conv-chg",
                subs=[
                    _fsub("CPC", "f-cpc"),
                    _fsub("Tx. Página Vendas", "f-tx-pagina"),
                ],
            ),
            _fcard(
                "Frequência",
                "f-frequency", "f-frequency-chg",
                subs=[
                    _fsub("Alcance", "f-reach"),
                    _fsub("CPP", "f-cpp"),
                ],
            ),
        ],
    )


# ── Charts ────────────────────────────────────────────────────────────────────

def create_center_panel() -> html.Div:
    return html.Div(
        className="center-panel",
        children=[
            # Timeline chart
            html.Div(
                className="chart-card",
                style={"flex": "1.4"},
                children=[
                    html.Div(
                        className="chart-header",
                        children=[
                            html.Span("Evolução Diária", className="chart-title"),
                            html.Div([_icon_sort(), _icon_filter(), _icon_dots()],
                                     style={"display": "flex", "gap": "8px"}),
                        ],
                    ),
                    dcc.Graph(
                        id="chart-timeline",
                        config={"displayModeBar": False},
                        style={"height": "200px"},
                    ),
                ],
            ),
            # Bottom row: campaign pie + audience pie
            html.Div(
                className="charts-bottom-row",
                style={"flex": "1"},
                children=[
                    html.Div(
                        className="chart-card",
                        children=[
                            html.Div(
                                className="chart-header",
                                children=[
                                    html.Span("Campanha", className="chart-title"),
                                    html.Div([_icon_sort(), _icon_filter(), _icon_dots()],
                                             style={"display": "flex", "gap": "8px"}),
                                ],
                            ),
                            dcc.Graph(
                                id="chart-campaign-pie",
                                config={"displayModeBar": False},
                                style={"height": "180px"},
                            ),
                        ],
                    ),
                    html.Div(
                        className="chart-card",
                        children=[
                            html.Div(
                                className="chart-header",
                                children=[
                                    html.Span("Detalhes do Público", className="chart-title"),
                                    html.Div([_icon_sort(), _icon_filter(), _icon_dots()],
                                             style={"display": "flex", "gap": "8px"}),
                                ],
                            ),
                            dcc.Graph(
                                id="chart-audience-pie",
                                config={"displayModeBar": False},
                                style={"height": "180px"},
                            ),
                            html.Div(
                                "Use as setas ↑↓ para navegar por gênero, idade, posicionamento e plataforma.",
                                style={
                                    "fontSize": "9px",
                                    "color": "#5a8a8a",
                                    "padding": "0 8px 4px",
                                    "textAlign": "center",
                                },
                            ),
                        ],
                    ),
                ],
            ),
        ],
    )


# ── Creative Champion ─────────────────────────────────────────────────────────

def create_creative_panel() -> html.Div:
    return html.Div(
        className="creative-panel",
        children=[
            html.Div("Criativo Campeão", className="creative-header"),
            html.Div(
                id="creative-champion-table",
                className="creative-table-wrap",
                children=[html.Div("Carregando...", style={"padding": "20px", "color": "#5a8a8a"})],
            ),
        ],
    )


# ── Full Layout ───────────────────────────────────────────────────────────────

def create_layout(is_demo: bool = False, accounts: list = None) -> html.Div:
    # Add demo account if in demo mode and no accounts provided
    if is_demo and not accounts:
        accounts = [{"id": "act_demo_123", "name": "Conta de Demonstração"}]
    
    return html.Div(
        children=[
            # Demo mode banner
            html.Div(
                "⚠ MODO DEMO — Configure META_ACCESS_TOKEN no arquivo .env para dados reais",
                className="demo-banner",
                id="demo-banner",
                style={"display": "block" if is_demo else "none"},
            ),
            # Navbar
            create_navbar(accounts=accounts),
            # KPI row
            create_kpi_row(),
            # Main content
            html.Div(
                className="main-content",
                children=[
                    create_funnel_panel(),
                    create_center_panel(),
                    create_creative_panel(),
                ],
            ),
            # Data stores
            dcc.Store(id="store-summary"),
            dcc.Store(id="store-daily"),
            dcc.Store(id="store-campaigns"),
            dcc.Store(id="store-audience"),
            dcc.Store(id="store-ads"),
            dcc.Store(id="store-prev-summary"),
        ],
        style={"backgroundColor": "#061919", "minHeight": "100vh"},
    )
