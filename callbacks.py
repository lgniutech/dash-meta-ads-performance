from __future__ import annotations
import os
from datetime import datetime, timedelta, date

import plotly.graph_objects as go
from dash import Input, Output, State, html, callback_context, no_update
from dash.exceptions import PreventUpdate

from api import MetaAdsAPI
import helpers as h

# ── Chart theme ───────────────────────────────────────────────────────────────

CHART_LAYOUT = dict(
    paper_bgcolor="rgba(0,0,0,0)",
    plot_bgcolor="rgba(0,0,0,0)",
    font=dict(color="#a8cccc", size=10, family="Inter, Segoe UI, sans-serif"),
    margin=dict(l=40, r=10, t=10, b=30),
    legend=dict(
        orientation="h",
        x=0,
        y=1.12,
        bgcolor="rgba(0,0,0,0)",
        font=dict(size=10, color="#a8cccc"),
    ),
    xaxis=dict(
        gridcolor="#1a4040",
        linecolor="#1a4040",
        tickcolor="#5a8a8a",
        zeroline=False,
    ),
    yaxis=dict(
        gridcolor="#1a4040",
        linecolor="#1a4040",
        tickcolor="#5a8a8a",
        zeroline=False,
    ),
    hovermode="x unified",
    hoverlabel=dict(
        bgcolor="#0c2828",
        bordercolor="#1a4040",
        font=dict(color="#ddf0f0", size=11),
    ),
)

PIE_COLORS = ["#00c4c4", "#009090", "#006060", "#004040"]
LINE_COLORS = {"purchase": "#00c4c4", "spend": "#22d082", "lead": "#00c4c4"}


# ── API / demo helper ─────────────────────────────────────────────────────────

def _get_api() -> MetaAdsAPI | None:
    token = os.getenv("META_ACCESS_TOKEN", "").strip()
    account = os.getenv("META_AD_ACCOUNT_ID", "").strip()
    if not token or token.startswith("your_"):
        return None
    return MetaAdsAPI(token, account)


def _date_args(start: str, end: str) -> dict:
    if start and end:
        return {"since": start[:10], "until": end[:10]}
    return {"date_preset": "last_14d"}


def _prev_dates(start: str, end: str) -> dict:
    if start and end:
        s = datetime.strptime(start[:10], "%Y-%m-%d").date()
        e = datetime.strptime(end[:10], "%Y-%m-%d").date()
        delta = (e - s) + timedelta(days=1)
        ps = s - delta
        pe = e - delta
        return {"since": str(ps), "until": str(pe)}
    return {"date_preset": "last_30d"}


# ── Chart builders ────────────────────────────────────────────────────────────

def _build_timeline(daily: list, objective: str) -> go.Figure:
    if not daily:
        fig = go.Figure()
        fig.update_layout(**CHART_LAYOUT)
        return fig

    dates = [d["date"] for d in daily]
    spend_vals = [d.get("spend", 0) for d in daily]
    conv_label = "Compras" if objective == "purchase" else "Leads"
    conv_vals = [d.get("purchases", 0) if objective == "purchase" else d.get("leads", 0) for d in daily]

    fig = go.Figure()

    fig.add_trace(go.Scatter(
        x=dates,
        y=conv_vals,
        name=conv_label,
        mode="lines+markers+text",
        line=dict(color=LINE_COLORS["purchase"], width=2),
        marker=dict(size=5, color=LINE_COLORS["purchase"]),
        text=[str(int(v)) if v else "" for v in conv_vals],
        textposition="top center",
        textfont=dict(size=9, color=LINE_COLORS["purchase"]),
        yaxis="y1",
    ))

    fig.add_trace(go.Scatter(
        x=dates,
        y=spend_vals,
        name="Investimento",
        mode="lines+markers+text",
        line=dict(color=LINE_COLORS["spend"], width=2),
        marker=dict(size=5, color=LINE_COLORS["spend"]),
        text=[f"R${v:.0f}" if v else "" for v in spend_vals],
        textposition="bottom center",
        textfont=dict(size=9, color=LINE_COLORS["spend"]),
        yaxis="y2",
    ))

    layout = dict(**CHART_LAYOUT)
    layout.update(
        yaxis=dict(
            **CHART_LAYOUT["yaxis"],
            title=None,
            showticklabels=False,
        ),
        yaxis2=dict(
            title=None,
            overlaying="y",
            side="right",
            gridcolor="rgba(0,0,0,0)",
            showticklabels=False,
            zeroline=False,
        ),
        xaxis=dict(
            **CHART_LAYOUT["xaxis"],
            tickformat="%d %b",
            tickangle=-30,
        ),
        margin=dict(l=10, r=10, t=24, b=30),
    )
    fig.update_layout(**layout)
    return fig


def _build_campaign_pie(campaigns: list) -> go.Figure:
    if not campaigns:
        fig = go.Figure()
        fig.update_layout(**{**CHART_LAYOUT, "margin": dict(l=0, r=0, t=0, b=0)})
        return fig

    labels = [c.get("campaign_name", "")[:25] for c in campaigns]
    values = [float(str(c.get("spend", 0)).replace(",", ".").replace("R$", "").strip() or 0)
              for c in campaigns]
    total = sum(values) or 1

    fig = go.Figure(go.Pie(
        labels=labels,
        values=values,
        hole=0.45,
        marker=dict(colors=PIE_COLORS),
        textinfo="percent",
        textfont=dict(size=10, color="#ddf0f0"),
        insidetextorientation="radial",
        hovertemplate="%{label}<br>R$ %{value:,.2f}<br>%{percent}<extra></extra>",
    ))
    fig.update_layout(
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(color="#a8cccc", size=10),
        margin=dict(l=0, r=0, t=0, b=10),
        legend=dict(
            orientation="v",
            x=1.0,
            y=0.5,
            font=dict(size=9, color="#a8cccc"),
            bgcolor="rgba(0,0,0,0)",
        ),
        showlegend=True,
    )
    return fig


def _build_audience_pie(audience: list, breakdown: str = "gender") -> go.Figure:
    if not audience:
        fig = go.Figure()
        fig.update_layout(**{**CHART_LAYOUT, "margin": dict(l=0, r=0, t=0, b=0)})
        return fig

    LABEL_MAP = {
        "female": "Feminino",
        "male": "Masculino",
        "unknown": "Desconhecido",
    }

    labels, values = [], []
    for row in audience:
        key = row.get(breakdown, row.get("gender", "?"))
        labels.append(LABEL_MAP.get(key, key))
        values.append(float(str(row.get("impressions", 0)).replace(".", "").replace(",", "") or 0))

    fig = go.Figure(go.Pie(
        labels=labels,
        values=values,
        hole=0.45,
        marker=dict(colors=PIE_COLORS),
        textinfo="percent",
        textfont=dict(size=10, color="#ddf0f0"),
        insidetextorientation="radial",
        hovertemplate="%{label}<br>%{value:,} impressões<br>%{percent}<extra></extra>",
    ))
    fig.update_layout(
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(color="#a8cccc", size=10),
        margin=dict(l=0, r=0, t=0, b=10),
        legend=dict(
            orientation="v",
            x=1.0,
            y=0.5,
            font=dict(size=9, color="#a8cccc"),
            bgcolor="rgba(0,0,0,0)",
        ),
        showlegend=True,
    )
    return fig


def _build_creative_table(ads: list, objective: str) -> html.Table:
    if not ads:
        return html.Div("Sem dados de criativos", style={"padding": "20px", "color": "#5a8a8a"})

    # Truncate to 3 top ads
    ads = ads[:3]
    conv_label = "Compras" if objective == "purchase" else "Leads"

    def _cell(content, highlight=False):
        cls = "highlight-col" if highlight else ""
        return html.Td(content, className=cls)

    def _thumb(ad):
        url = ad.get("_thumbnail", "")
        name = (ad.get("ad_name") or "")[:22]
        if url:
            return html.Td(
                [
                    html.Img(src=url, className="creative-thumb"),
                    html.Span(name, className="creative-ad-name"),
                ],
                className="creative-thumb-cell",
            )
        return html.Td(
            [
                html.Div(name[:12] + ("…" if len(name) > 12 else ""),
                         className="creative-thumb-placeholder"),
                html.Span(name, className="creative-ad-name"),
            ],
            className="creative-thumb-cell",
        )

    def _link(ad):
        ad_id = ad.get("ad_id", "")
        return html.Td(
            html.A("Ver anúncio agora", href=f"https://www.facebook.com/ads/manager/account/campaigns?act={ad_id}",
                   target="_blank", className="ad-link")
        )

    # Parse each ad metrics
    parsed = []
    for ad in ads:
        m = h.parse_insight(ad)
        parsed.append(m)

    # Determine best ad (highest ROAS or lowest CPA)
    best_idx = 0
    if objective == "purchase":
        roas_vals = [p["roas"] for p in parsed]
        if any(r > 0 for r in roas_vals):
            best_idx = roas_vals.index(max(roas_vals))
    else:
        cpa_vals = [p["cpa"] for p in parsed]
        nonzero = [c for c in cpa_vals if c > 0]
        if nonzero:
            best_idx = cpa_vals.index(min(nonzero))

    rows_def = [
        ("Nome do Anúncio", lambda ad, m: (ad.get("ad_name") or "")[:20]),
        ("_thumb_row", None),
        ("Ver Anúncio", None),
        ("Custo por Conv.", lambda ad, m: h.fmt_brl(m["cpa"]) if m["cpa"] else "—"),
        ("Investimento", lambda ad, m: h.fmt_brl(m["spend"])),
        ("Receita", lambda ad, m: h.fmt_brl(m["purchase_value"]) if objective == "purchase" else "—"),
        ("ROAS", lambda ad, m: h.fmt_roas(m["roas"]) if objective == "purchase" else "—"),
        ("Cliques", lambda ad, m: h.fmt_num(m["link_clicks"])),
        (conv_label, lambda ad, m: h.fmt_num(m["purchases"] if objective == "purchase" else m["leads"])),
        ("CTR", lambda ad, m: h.fmt_pct(m["ctr"])),
        ("Frequência", lambda ad, m: h.fmt_roas(m["frequency"])),
    ]

    table_rows = []
    for label, extractor in rows_def:
        if label == "_thumb_row":
            table_rows.append(html.Tr([
                html.Td("Anúncio", className="row-label"),
                *[_thumb(ad) for ad in ads],
            ]))
            continue
        if label == "Ver Anúncio":
            table_rows.append(html.Tr([
                html.Td("", className="row-label"),
                *[_link(ad) for ad in ads],
            ]))
            continue

        cells = [html.Td(label, className="row-label")]
        for i, (ad, m) in enumerate(zip(ads, parsed)):
            val = extractor(ad, m)
            cells.append(_cell(val, highlight=(i == best_idx)))
        table_rows.append(html.Tr(cells))

    # Header row with ad names
    header_cells = [html.Th("")]
    for ad in ads:
        header_cells.append(html.Th(
            (ad.get("ad_name") or "Ad")[:18] + ("…" if len(ad.get("ad_name") or "") > 18 else "")
        ))

    return html.Table(
        [html.Thead(html.Tr(header_cells)), html.Tbody(table_rows)],
        className="creative-table",
    )


# ── Register all callbacks ────────────────────────────────────────────────────

def register_callbacks(app):

    # ── Load campaigns when account changes ──────────────────────────────────
    @app.callback(
        Output("dropdown-campaign", "options"),
        Input("dropdown-account", "value"),
    )
    def load_campaigns(account_id):
        api = _get_api()
        if not api or not account_id:
            return [
                {"label": c["campaign_name"], "value": c["campaign_id"]}
                for c in h.DEMO_CAMPAIGNS
            ]
        api.account_id = f"act_{str(account_id).replace('act_', '')}"
        campaigns = api.get_campaigns()
        return [{"label": c["name"], "value": c["id"]} for c in campaigns]

    # ── Load adsets when campaign changes ────────────────────────────────────
    @app.callback(
        Output("dropdown-adset", "options"),
        Input("dropdown-campaign", "value"),
        State("dropdown-account", "value"),
    )
    def load_adsets(campaign_ids, account_id):
        api = _get_api()
        if not api or not campaign_ids:
            return []
        api.account_id = f"act_{str(account_id).replace('act_', '')}"
        cid = campaign_ids[0] if isinstance(campaign_ids, list) else campaign_ids
        adsets = api.get_adsets(cid)
        return [{"label": a["name"], "value": a["id"]} for a in adsets]

    # ── Fetch all data and update stores ─────────────────────────────────────
    @app.callback(
        [
            Output("store-summary", "data"),
            Output("store-prev-summary", "data"),
            Output("store-daily", "data"),
            Output("store-campaigns", "data"),
            Output("store-audience", "data"),
            Output("store-ads", "data"),
        ],
        [
            Input("date-range", "start_date"),
            Input("date-range", "end_date"),
            Input("dropdown-account", "value"),
            Input("dropdown-campaign", "value"),
            Input("dropdown-adset", "value"),
        ],
    )
    def fetch_data(start, end, account_id, campaign_ids, adset_ids):
        api = _get_api()
        if not api:
            return (
                h.DEMO_SUMMARY,
                h.DEMO_SUMMARY_PREV,
                h.DEMO_DAILY,
                h.DEMO_CAMPAIGNS,
                h.DEMO_AUDIENCE,
                h.DEMO_ADS,
            )

        api.account_id = f"act_{str(account_id or os.getenv('META_AD_ACCOUNT_ID', '')).replace('act_', '')}"
        date_kw = _date_args(start, end)
        prev_kw = _prev_dates(start, end)

        cids = campaign_ids if campaign_ids else None
        aids = adset_ids if adset_ids else None

        summary_raw = api.get_account_summary(**date_kw, campaign_ids=cids, adset_ids=aids)
        summary = h.parse_insight(summary_raw)

        prev_raw = api.get_account_summary(**prev_kw, campaign_ids=cids, adset_ids=aids)
        prev = h.parse_insight(prev_raw)

        daily_raw = api.get_daily_insights(**date_kw, campaign_ids=cids)
        daily = h.parse_daily(daily_raw)

        campaigns = api.get_campaign_insights(**date_kw)
        audience = api.get_audience_breakdown(**date_kw)
        ads_raw = api.get_ad_insights(**date_kw)

        # Enrich ads with creative thumbnails
        for ad in ads_raw:
            ad_id = ad.get("ad_id", "")
            creative = api.get_ad_creative(ad_id) if ad_id else {}
            ad["_thumbnail"] = creative.get("thumbnail", "")

        return summary, prev, daily, campaigns, audience, ads_raw

    # ── Update KPI cards ─────────────────────────────────────────────────────
    @app.callback(
        [
            Output("kpi-spend", "children"), Output("kpi-spend-chg", "children"),
            Output("kpi-spend-chg", "className"),
            Output("kpi-revenue", "children"), Output("kpi-revenue-chg", "children"),
            Output("kpi-revenue-chg", "className"),
            Output("kpi-conv", "children"), Output("kpi-conv-chg", "children"),
            Output("kpi-conv-chg", "className"),
            Output("kpi-aov", "children"), Output("kpi-aov-chg", "children"),
            Output("kpi-aov-chg", "className"),
            Output("kpi-cpa", "children"), Output("kpi-cpa-chg", "children"),
            Output("kpi-cpa-chg", "className"),
            Output("kpi-roas", "children"), Output("kpi-roas-chg", "children"),
            Output("kpi-roas-chg", "className"),
        ],
        [Input("store-summary", "data"), Input("store-prev-summary", "data")],
    )
    def update_kpis(curr, prev):
        if not curr:
            raise PreventUpdate
        prev = prev or {}
        obj = h.detect_objective(curr)

        def chg(key, is_brl=False, is_pct=False, invert=False):
            cv, pv = curr.get(key, 0), prev.get(key, 0)
            delta = cv - pv
            if invert:
                delta = -delta
            txt, css = h.fmt_change(delta, is_currency=is_brl, is_pct=is_pct)
            return txt, "kpi-change " + css

        spend_chg, spend_cls = chg("spend", is_brl=True, invert=False)
        # Lower spend is neutral, so we invert for CPA
        rev = curr.get("purchase_value", 0)
        rev_prev = prev.get("purchase_value", 0)
        rev_delta = rev - rev_prev
        rev_chg_txt, rev_chg_cls = h.fmt_change(rev_delta, is_currency=True)

        conv = curr.get("purchases", 0) if obj == "purchase" else curr.get("leads", 0)
        conv_prev = prev.get("purchases", 0) if obj == "purchase" else prev.get("leads", 0)
        conv_delta = conv - conv_prev
        conv_chg_txt, conv_chg_cls = h.fmt_change(conv_delta)

        aov = curr.get("ticket_medio", 0) if obj == "purchase" else curr.get("cpa", 0)
        aov_prev = prev.get("ticket_medio", 0) if obj == "purchase" else prev.get("cpa", 0)
        aov_delta = aov - aov_prev
        aov_label = "ticket_medio" if obj == "purchase" else "cpa"
        aov_chg_txt, aov_chg_cls = h.fmt_change(aov_delta, is_currency=True)

        cpa_delta = curr.get("cpa", 0) - prev.get("cpa", 0)
        cpa_chg_txt, cpa_chg_cls = h.fmt_change(-cpa_delta, is_currency=True)  # lower = better

        roas = curr.get("roas", 0) if obj == "purchase" else curr.get("ctr", 0)
        roas_prev = prev.get("roas", 0) if obj == "purchase" else prev.get("ctr", 0)
        roas_delta = roas - roas_prev
        roas_chg_txt, roas_chg_cls = h.fmt_change(roas_delta, is_pct=(obj != "purchase"))

        return (
            h.fmt_brl(curr.get("spend", 0)), spend_chg, spend_cls,
            h.fmt_brl(rev) if rev else "—",
            rev_chg_txt if rev else "—", "kpi-change " + ("change-pos" if rev_delta >= 0 else "change-neg"),
            h.fmt_num(conv), conv_chg_txt, "kpi-change " + ("change-pos" if conv_delta >= 0 else "change-neg"),
            h.fmt_brl(aov) if aov else "—",
            aov_chg_txt if aov else "—", "kpi-change " + ("change-pos" if aov_delta >= 0 else "change-neg"),
            h.fmt_brl(curr.get("cpa", 0)) if curr.get("cpa") else "—",
            cpa_chg_txt, cpa_chg_cls,
            h.fmt_roas(roas) if obj == "purchase" else h.fmt_pct(roas),
            roas_chg_txt, "kpi-change " + ("change-pos" if roas_delta >= 0 else "change-neg"),
        )

    # ── Update funnel panel ───────────────────────────────────────────────────
    @app.callback(
        [
            Output("f-impressions", "children"), Output("f-impressions-chg", "children"),
            Output("f-impressions-chg", "className"),
            Output("f-thruplay", "children"), Output("f-thruplay-chg", "children"),
            Output("f-thruplay-chg", "className"),
            Output("f-ctr", "children"), Output("f-ctr-chg", "children"),
            Output("f-ctr-chg", "className"),
            Output("f-clicks", "children"), Output("f-clicks-chg", "children"),
            Output("f-clicks-chg", "className"),
            Output("f-hook", "children"),
            Output("f-connect", "children"),
            Output("f-views", "children"), Output("f-views-chg", "children"),
            Output("f-views-chg", "className"),
            Output("f-retention", "children"), Output("f-retention-chg", "children"),
            Output("f-retention-chg", "className"),
            Output("f-tx-iniciou", "children"),
            Output("f-checkout", "children"), Output("f-checkout-chg", "children"),
            Output("f-checkout-chg", "className"),
            Output("f-cpm", "children"),
            Output("f-tx-compras", "children"),
            Output("f-conv", "children"), Output("f-conv-chg", "children"),
            Output("f-conv-chg", "className"),
            Output("f-cpc", "children"),
            Output("f-tx-pagina", "children"),
            Output("f-frequency", "children"), Output("f-frequency-chg", "children"),
            Output("f-frequency-chg", "className"),
            Output("f-reach", "children"),
            Output("f-cpp", "children"),
        ],
        [Input("store-summary", "data"), Input("store-prev-summary", "data")],
    )
    def update_funnel(curr, prev):
        if not curr:
            raise PreventUpdate
        prev = prev or {}
        obj = h.detect_objective(curr)

        def delta_cls(key, invert=False):
            d = curr.get(key, 0) - prev.get(key, 0)
            if invert:
                d = -d
            _, css = h.fmt_change(d)
            return "funnel-main-change " + css

        def delta_sub_cls(key, invert=False):
            d = curr.get(key, 0) - prev.get(key, 0)
            if invert:
                d = -d
            _, css = h.fmt_change(d)
            return "funnel-sub-change " + css

        def chg_txt(key, is_brl=False, is_pct=False):
            d = curr.get(key, 0) - prev.get(key, 0)
            txt, _ = h.fmt_change(d, is_currency=is_brl, is_pct=is_pct)
            return txt

        retention = h.fmt_pct(h.safe_pct(curr.get("thruplay", 0), curr.get("impressions", 0)))
        retention_prev = h.safe_pct(prev.get("thruplay", 0), prev.get("impressions", 0))
        retention_curr = h.safe_pct(curr.get("thruplay", 0), curr.get("impressions", 0))
        ret_delta = retention_curr - retention_prev
        ret_chg, ret_chg_css = h.fmt_change(ret_delta, is_pct=True)

        conv = curr.get("purchases", 0) if obj == "purchase" else curr.get("leads", 0)
        conv_prev = prev.get("purchases", 0) if obj == "purchase" else prev.get("leads", 0)
        conv_delta = conv - conv_prev
        conv_chg_txt, conv_chg_cls = h.fmt_change(conv_delta)

        freq_delta = curr.get("frequency", 0) - prev.get("frequency", 0)
        freq_chg_txt, freq_chg_cls = h.fmt_change(freq_delta, is_pct=True)

        return (
            # Impressões
            h.fmt_num(curr.get("impressions", 0)),
            chg_txt("impressions"), delta_cls("impressions"),
            # ThruPlay
            h.fmt_num(curr.get("thruplay", 0)),
            chg_txt("thruplay"), delta_sub_cls("thruplay"),
            # CTR
            h.fmt_pct(curr.get("ctr", 0)),
            chg_txt("ctr", is_pct=True), delta_sub_cls("ctr"),
            # Cliques
            h.fmt_num(curr.get("link_clicks", 0)),
            chg_txt("link_clicks"), delta_cls("link_clicks"),
            # Hook Rate
            h.fmt_pct(curr.get("hook_rate", 0)),
            # Connect Rate
            h.fmt_pct(curr.get("connect_rate", 0)),
            # Visitas na Página
            h.fmt_num(curr.get("view_content", 0)),
            chg_txt("view_content"), delta_cls("view_content"),
            # Retenção
            h.fmt_pct(retention_curr), ret_chg, "funnel-sub-change " + ("change-pos" if ret_delta >= 0 else "change-neg"),
            # Tx. Iniciou Compra
            h.fmt_pct(curr.get("tx_iniciou", 0)),
            # Iniciou Compra
            h.fmt_num(curr.get("initiate_checkout", 0)),
            chg_txt("initiate_checkout"), delta_cls("initiate_checkout"),
            # CPM
            h.fmt_brl(curr.get("cpm", 0)),
            # Tx. Compras
            h.fmt_pct(curr.get("tx_compras", 0)),
            # Compras / Leads
            h.fmt_num(conv),
            conv_chg_txt, "funnel-main-change " + ("change-pos" if conv_delta >= 0 else "change-neg"),
            # CPC
            h.fmt_brl(curr.get("cpc", 0)),
            # Tx. Página Vendas
            h.fmt_pct(curr.get("tx_pagina", 0)),
            # Frequência
            h.fmt_roas(curr.get("frequency", 0)),
            freq_chg_txt, "funnel-main-change " + ("change-pos" if freq_delta >= 0 else "change-neg"),
            # Alcance
            h.fmt_num(curr.get("reach", 0)),
            # CPP (cost per person reached)
            h.fmt_brl(h._safe_div(curr.get("spend", 0), curr.get("reach", 0))),
        )

    # ── Update charts ─────────────────────────────────────────────────────────
    @app.callback(
        [
            Output("chart-timeline", "figure"),
            Output("chart-campaign-pie", "figure"),
            Output("chart-audience-pie", "figure"),
        ],
        [
            Input("store-daily", "data"),
            Input("store-campaigns", "data"),
            Input("store-audience", "data"),
            Input("store-summary", "data"),
        ],
    )
    def update_charts(daily, campaigns, audience, summary):
        if not summary:
            raise PreventUpdate
        obj = h.detect_objective(summary)
        return (
            _build_timeline(daily or [], obj),
            _build_campaign_pie(campaigns or []),
            _build_audience_pie(audience or []),
        )

    # ── Update creative champion ───────────────────────────────────────────────
    @app.callback(
        Output("creative-champion-table", "children"),
        [Input("store-ads", "data"), Input("store-summary", "data")],
    )
    def update_creatives(ads, summary):
        if ads is None:
            raise PreventUpdate
        obj = h.detect_objective(summary or {})
        return _build_creative_table(ads, obj)
