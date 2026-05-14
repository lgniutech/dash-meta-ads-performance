from __future__ import annotations
from typing import Any


# ---------------------------------------------------------------------------
# Raw-value extractors
# ---------------------------------------------------------------------------

def _action(lst: list, action_type: str) -> float:
    if not lst:
        return 0.0
    for item in lst:
        if item.get("action_type") == action_type:
            try:
                return float(item.get("value", 0))
            except (TypeError, ValueError):
                return 0.0
    return 0.0


def _action_first_match(lst: list, *types: str) -> float:
    for t in types:
        v = _action(lst, t)
        if v:
            return v
    return 0.0


def _safe_float(val: Any) -> float:
    if val is None:
        return 0.0
    if isinstance(val, (int, float)):
        return float(val)
    s = str(val).replace(",", ".").replace("R$", "").replace("\xa0BRL", "").replace("%", "").strip()
    try:
        return float(s)
    except (TypeError, ValueError):
        return 0.0


def _sum_action_list(lst: Any) -> float:
    if not lst:
        return 0.0
    if isinstance(lst, list):
        return sum(_safe_float(x.get("value", 0)) for x in lst if isinstance(x, dict))
    return _safe_float(lst)


def _roas(purchase_roas: Any) -> float:
    if not purchase_roas:
        return 0.0
    if isinstance(purchase_roas, list) and purchase_roas:
        return _safe_float(purchase_roas[0].get("value", 0))
    return _safe_float(purchase_roas)


def _safe_div(a: float, b: float) -> float:
    return a / b if b else 0.0


# Public alias used by callbacks
safe_div = _safe_div


def safe_pct(numerator: float, denominator: float) -> float:
    """Return (numerator / denominator) * 100, or 0 if denominator is 0."""
    return _safe_div(numerator, denominator) * 100


# ---------------------------------------------------------------------------
# Formatters
# ---------------------------------------------------------------------------

def fmt_brl(value: float) -> str:
    if value == 0:
        return "R$ 0,00"
    formatted = f"{value:,.2f}"
    # Convert to BR notation: swap . and ,
    formatted = formatted.replace(",", "X").replace(".", ",").replace("X", ".")
    return f"R$ {formatted}"


def fmt_num(value: float) -> str:
    n = int(round(value))
    return f"{n:,}".replace(",", ".")


def fmt_pct(value: float, decimals: int = 2) -> str:
    return f"{value:.{decimals}f}%".replace(".", ",")


def fmt_roas(value: float) -> str:
    return f"{value:.1f}".replace(".", ",")


def fmt_change(value: float, is_currency: bool = False, is_pct: bool = False) -> tuple[str, str]:
    """Return (text, css_class) for a delta value."""
    if value == 0:
        return "—", "change-neutral"
    sign = "↑" if value > 0 else "↓"
    css = "change-pos" if value > 0 else "change-neg"
    if is_currency:
        text = f"{sign} {fmt_brl(abs(value))}"
    elif is_pct:
        text = f"{sign} {fmt_pct(abs(value))}"
    else:
        text = f"{sign} {fmt_num(abs(value))}"
    return text, css


# ---------------------------------------------------------------------------
# Insight parser
# ---------------------------------------------------------------------------

def parse_insight(raw: dict) -> dict:
    actions = raw.get("actions") or []
    action_values = raw.get("action_values") or []

    purchases = _action_first_match(
        actions,
        "omni_purchase",
        "purchase",
        "offsite_conversion.fb_pixel_purchase",
    )
    purchase_value = _action_first_match(
        action_values,
        "omni_purchase",
        "purchase",
        "offsite_conversion.fb_pixel_purchase",
    )
    leads = _action_first_match(
        actions,
        "lead",
        "offsite_conversion.fb_pixel_lead",
        "onsite_conversion.lead_grouped",
    )
    initiate_checkout = _action_first_match(
        actions,
        "initiate_checkout",
        "offsite_conversion.fb_pixel_initiate_checkout",
    )
    view_content = _action_first_match(
        actions,
        "view_content",
        "offsite_conversion.fb_pixel_view_content",
    )
    link_clicks = _action_first_match(actions, "link_click") or _safe_float(raw.get("clicks", 0))

    thruplay = _sum_action_list(raw.get("video_thruplay_watched_actions"))
    three_sec = _sum_action_list(raw.get("3_second_video_plays"))

    spend = _safe_float(raw.get("spend", 0))
    impressions = _safe_float(raw.get("impressions", 0))
    clicks = _safe_float(raw.get("clicks", 0))
    reach = _safe_float(raw.get("reach", 0))
    frequency = _safe_float(raw.get("frequency", 0))
    ctr = _safe_float(raw.get("ctr", 0))
    cpc = _safe_float(raw.get("cpc", 0))
    cpm = _safe_float(raw.get("cpm", 0))
    roas = _roas(raw.get("purchase_roas"))

    ticket_medio = _safe_div(purchase_value, purchases)
    cpa = _safe_div(spend, purchases) if purchases > 0 else _safe_div(spend, leads)
    hook_rate = _safe_div(three_sec, impressions) * 100
    connect_rate = _safe_div(link_clicks, three_sec) * 100

    # Tx. Compras = purchases / initiate_checkout (conversion rate)
    tx_compras = _safe_div(purchases, initiate_checkout) * 100
    # Tx. Iniciou Compra = initiate_checkout / view_content
    tx_iniciou = _safe_div(initiate_checkout, view_content) * 100
    # Tx. Página de Vendas = purchases / view_content
    tx_pagina = _safe_div(purchases, view_content) * 100

    return {
        "spend": spend,
        "impressions": impressions,
        "clicks": clicks,
        "reach": reach,
        "frequency": frequency,
        "ctr": ctr,
        "cpc": cpc,
        "cpm": cpm,
        "thruplay": thruplay,
        "three_sec": three_sec,
        "link_clicks": link_clicks,
        "purchases": purchases,
        "purchase_value": purchase_value,
        "leads": leads,
        "initiate_checkout": initiate_checkout,
        "view_content": view_content,
        "roas": roas,
        "ticket_medio": ticket_medio,
        "cpa": cpa,
        "hook_rate": hook_rate,
        "connect_rate": connect_rate,
        "tx_compras": tx_compras,
        "tx_iniciou": tx_iniciou,
        "tx_pagina": tx_pagina,
    }


def parse_daily(rows: list) -> list:
    out = []
    for r in rows:
        m = parse_insight(r)
        m["date"] = r.get("date_start", "")
        out.append(m)
    return sorted(out, key=lambda x: x["date"])


def detect_objective(metrics: dict) -> str:
    """Detect if account is purchase- or lead-focused."""
    if metrics.get("purchases", 0) > 0 or metrics.get("purchase_value", 0) > 0:
        return "purchase"
    if metrics.get("leads", 0) > 0:
        return "lead"
    return "awareness"


# ---------------------------------------------------------------------------
# Demo data (used when META_ACCESS_TOKEN is not set)
# ---------------------------------------------------------------------------

DEMO_SUMMARY = {
    "spend": 760.01,
    "impressions": 89981,
    "clicks": 528,
    "reach": 45000,
    "frequency": 2.0,
    "ctr": 2.89,
    "cpc": 1.44,
    "cpm": 8.45,
    "thruplay": 2233,
    "three_sec": 9898,
    "link_clicks": 528,
    "purchases": 54,
    "purchase_value": 6114.69,
    "leads": 0,
    "initiate_checkout": 20,
    "view_content": 408,
    "roas": 8.0,
    "ticket_medio": 113.24,
    "cpa": 14.07,
    "hook_rate": 11.0,
    "connect_rate": 77.0,
    "tx_compras": 270.0,
    "tx_iniciou": 5.0,
    "tx_pagina": 13.24,
}

DEMO_SUMMARY_PREV = {
    "spend": 659.01,
    "impressions": 78506,
    "clicks": 455,
    "reach": 39000,
    "purchases": 49,
    "purchase_value": 5224.69,
    "leads": 0,
    "initiate_checkout": 19,
    "view_content": 353,
    "roas": 7.9,
    "ticket_medio": 106.64,
    "cpa": 13.45,
    "hook_rate": 10.2,
    "connect_rate": 74.0,
    "ctr": 2.51,
    "thruplay": 800,
    "three_sec": 8465,
    "link_clicks": 455,
}

DEMO_DAILY = [
    {"date": "2026-04-27", "spend": 0, "impressions": 0, "purchases": 0, "leads": 0},
    {"date": "2026-04-28", "spend": 0, "impressions": 0, "purchases": 0, "leads": 0},
    {"date": "2026-04-29", "spend": 96.45, "impressions": 8200, "purchases": 2, "leads": 0},
    {"date": "2026-04-30", "spend": 95.12, "impressions": 7800, "purchases": 9, "leads": 0},
    {"date": "2026-05-01", "spend": 113.65, "impressions": 9600, "purchases": 8, "leads": 0},
    {"date": "2026-05-02", "spend": 99.87, "impressions": 8900, "purchases": 6, "leads": 0},
    {"date": "2026-05-03", "spend": 3.52, "impressions": 1100, "purchases": 0, "leads": 0},
    {"date": "2026-05-04", "spend": 0, "impressions": 0, "purchases": 0, "leads": 0},
    {"date": "2026-05-05", "spend": 0, "impressions": 0, "purchases": 0, "leads": 0},
    {"date": "2026-05-06", "spend": 7.62, "impressions": 2100, "purchases": 1, "leads": 0},
    {"date": "2026-05-07", "spend": 0, "impressions": 0, "purchases": 0, "leads": 0},
    {"date": "2026-05-08", "spend": 91.18, "impressions": 8300, "purchases": 9, "leads": 0},
    {"date": "2026-05-09", "spend": 126.04, "impressions": 10200, "purchases": 8, "leads": 0},
    {"date": "2026-05-10", "spend": 99.98, "impressions": 8700, "purchases": 7, "leads": 0},
]

DEMO_CAMPAIGNS = [
    {"campaign_id": "c1", "campaign_name": "[VENDAS] AND...", "spend": 646.01,
     "impressions": 76480, "actions": [{"action_type": "omni_purchase", "value": "46"}],
     "action_values": [{"action_type": "omni_purchase", "value": "5197.49"}]},
    {"campaign_id": "c2", "campaign_name": "[180] [VENDA] C...", "spend": 114.00,
     "impressions": 13501, "actions": [{"action_type": "omni_purchase", "value": "8"}],
     "action_values": [{"action_type": "omni_purchase", "value": "917.20"}]},
]

DEMO_AUDIENCE = [
    {"gender": "female", "impressions": "43311", "clicks": "254", "spend": "366.24"},
    {"gender": "male", "impressions": "46670", "clicks": "274", "spend": "393.77"},
]

DEMO_ADS = [
    {
        "ad_id": "a1", "ad_name": "Crostini Foto",
        "spend": "212.21", "impressions": "14100", "clicks": "218",
        "ctr": "1.55", "frequency": "3.37",
        "actions": [{"action_type": "omni_purchase", "value": "21"}],
        "action_values": [{"action_type": "omni_purchase", "value": "2111.79"}],
        "purchase_roas": [{"action_type": "omni_purchase", "value": "9.95"}],
        "_thumbnail": "",
    },
    {
        "ad_id": "a2", "ad_name": "Casa Tali 2",
        "spend": "303.49", "impressions": "18500", "clicks": "336",
        "ctr": "1.81", "frequency": "3.16",
        "actions": [{"action_type": "omni_purchase", "value": "20"}],
        "action_values": [{"action_type": "omni_purchase", "value": "2276.90"}],
        "purchase_roas": [{"action_type": "omni_purchase", "value": "7.5"}],
        "_thumbnail": "",
    },
    {
        "ad_id": "a3", "ad_name": "SOMENTE MAIO A nossa...",
        "spend": "93.72", "impressions": "14300", "clicks": "214",
        "ctr": "1.49", "frequency": "1.99",
        "actions": [{"action_type": "omni_purchase", "value": "3"}],
        "action_values": [{"action_type": "omni_purchase", "value": "508.00"}],
        "purchase_roas": [{"action_type": "omni_purchase", "value": "5.42"}],
        "_thumbnail": "",
    },
]
