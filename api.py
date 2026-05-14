import json
import requests
from typing import Optional

BASE_URL = "https://graph.facebook.com/v21.0"

INSIGHT_FIELDS = [
    "spend",
    "impressions",
    "clicks",
    "reach",
    "frequency",
    "ctr",
    "cpc",
    "cpm",
    "cpp",
    "actions",
    "action_values",
    "cost_per_action_type",
    "video_thruplay_watched_actions",
    "video_p25_watched_actions",
    "video_p50_watched_actions",
    "video_p75_watched_actions",
    "video_p100_watched_actions",
    "video_play_actions",
    "3_second_video_plays",
    "purchase_roas",
]


class MetaAdsAPI:
    def __init__(self, access_token: str, ad_account_id: str):
        self.token = access_token
        aid = str(ad_account_id).replace("act_", "")
        self.account_id = f"act_{aid}"

    def _get(self, path: str, params: dict = None) -> dict:
        url = f"{BASE_URL}{path}"
        p = {"access_token": self.token, **(params or {})}
        r = requests.get(url, params=p, timeout=30)
        r.raise_for_status()
        return r.json()

    def _paginate(self, path: str, params: dict = None) -> list:
        results = []
        data = self._get(path, params)
        results.extend(data.get("data", []))
        while data.get("paging", {}).get("next"):
            url = data["paging"]["next"]
            r = requests.get(url, timeout=30)
            r.raise_for_status()
            data = r.json()
            results.extend(data.get("data", []))
        return results

    def _time_params(self, date_preset: str = None, since: str = None, until: str = None) -> dict:
        if since and until:
            return {"time_range": json.dumps({"since": since, "until": until})}
        return {"date_preset": date_preset or "last_30d"}

    def _filter(self, campaign_ids: list = None, adset_ids: list = None) -> Optional[str]:
        if campaign_ids:
            return json.dumps([{"field": "campaign.id", "operator": "IN", "value": list(campaign_ids)}])
        if adset_ids:
            return json.dumps([{"field": "adset.id", "operator": "IN", "value": list(adset_ids)}])
        return None

    def get_ad_accounts(self) -> list:
        try:
            return self._paginate(
                "/me/adaccounts",
                {"fields": "id,name,account_status,business_name,currency,owner_business", "limit": 100}
            )
        except Exception:
            return []

    def get_campaigns(self) -> list:
        try:
            return self._paginate(
                f"/{self.account_id}/campaigns",
                {"fields": "id,name,status,objective", "limit": 200},
            )
        except Exception:
            return []

    def get_adsets(self, campaign_id: str = None) -> list:
        try:
            params = {"fields": "id,name,status,campaign_id", "limit": 200}
            if campaign_id:
                params["filtering"] = json.dumps([
                    {"field": "adset.campaign_id", "operator": "EQUAL", "value": campaign_id}
                ])
            return self._paginate(f"/{self.account_id}/adsets", params)
        except Exception:
            return []

    def get_account_summary(
        self,
        date_preset: str = None,
        since: str = None,
        until: str = None,
        campaign_ids: list = None,
        adset_ids: list = None,
    ) -> dict:
        params = {
            "fields": ",".join(INSIGHT_FIELDS),
            "level": "account",
            **self._time_params(date_preset, since, until),
        }
        f = self._filter(campaign_ids, adset_ids)
        if f:
            params["filtering"] = f
        try:
            d = self._get(f"/{self.account_id}/insights", params)
            items = d.get("data", [])
            return items[0] if items else {}
        except Exception:
            return {}

    def get_daily_insights(
        self,
        date_preset: str = None,
        since: str = None,
        until: str = None,
        campaign_ids: list = None,
    ) -> list:
        params = {
            "fields": "spend,impressions,clicks,reach,actions,action_values,"
                      "video_thruplay_watched_actions,3_second_video_plays",
            "level": "account",
            "time_increment": "1",
            **self._time_params(date_preset, since, until),
        }
        f = self._filter(campaign_ids)
        if f:
            params["filtering"] = f
        try:
            d = self._get(f"/{self.account_id}/insights", params)
            return d.get("data", [])
        except Exception:
            return []

    def get_campaign_insights(
        self,
        date_preset: str = None,
        since: str = None,
        until: str = None,
    ) -> list:
        params = {
            "fields": "campaign_id,campaign_name,spend,impressions,clicks,reach,"
                      "actions,action_values,purchase_roas,ctr,cpc,cpm,frequency",
            "level": "campaign",
            **self._time_params(date_preset, since, until),
        }
        try:
            d = self._get(f"/{self.account_id}/insights", params)
            return d.get("data", [])
        except Exception:
            return []

    def get_audience_breakdown(
        self,
        breakdown: str = "gender",
        date_preset: str = None,
        since: str = None,
        until: str = None,
    ) -> list:
        params = {
            "fields": "impressions,clicks,spend,reach,actions",
            "level": "account",
            "breakdowns": breakdown,
            **self._time_params(date_preset, since, until),
        }
        try:
            d = self._get(f"/{self.account_id}/insights", params)
            return d.get("data", [])
        except Exception:
            return []

    def get_ad_insights(
        self,
        date_preset: str = None,
        since: str = None,
        until: str = None,
        limit: int = 6,
    ) -> list:
        params = {
            "fields": "ad_id,ad_name,spend,impressions,clicks,reach,ctr,cpc,frequency,"
                      "actions,action_values,purchase_roas,cost_per_action_type,"
                      "video_thruplay_watched_actions,3_second_video_plays",
            "level": "ad",
            "sort": "spend_descending",
            "limit": limit,
            **self._time_params(date_preset, since, until),
        }
        try:
            d = self._get(f"/{self.account_id}/insights", params)
            return d.get("data", [])
        except Exception:
            return []

    def get_ad_creative(self, ad_id: str) -> dict:
        try:
            d = self._get(f"/{ad_id}", {
                "fields": "name,creative{thumbnail_url,image_url,title,body}"
            })
            c = d.get("creative", {})
            return {
                "name": d.get("name", ""),
                "thumbnail": c.get("thumbnail_url") or c.get("image_url") or "",
                "title": c.get("title", ""),
                "body": c.get("body", ""),
            }
        except Exception:
            return {"name": "", "thumbnail": "", "title": "", "body": ""}
