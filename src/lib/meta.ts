import axios from "axios";

const BASE_URL = "https://graph.facebook.com/v21.0";

export const INSIGHT_FIELDS = [
  "spend",
  "impressions",
  "clicks",
  "reach",
  "frequency",
  "ctr",
  "cpc",
  "cpm",
  "actions",
  "action_values",
  "purchase_roas",
  "video_p25_watched_actions",
  "video_p50_watched_actions",
  "video_p75_watched_actions",
  "video_p100_watched_actions",
  "video_thruplay_watched_actions",
  "outbound_clicks",
  "outbound_clicks_ctr",
  "cost_per_outbound_click"
];

export class MetaAdsAPI {
  private token: string;
  private accountId: string;

  constructor(token: string, accountId: string) {
    this.token = token;
    this.accountId = accountId.startsWith("act_") ? accountId : `act_${accountId}`;
  }

  private async get<T>(path: string, params: Record<string, any> = {}): Promise<T> {
    const response = await axios.get(`${BASE_URL}${path}`, {
      params: {
        access_token: this.token,
        ...params,
      },
    });
    return response.data;
  }

  private async paginate<T>(path: string, params: Record<string, any> = {}): Promise<T[]> {
    let results: T[] = [];
    let response = await this.get<any>(path, params);
    results = [...results, ...(response.data || [])];

    while (response.paging?.next) {
      const nextResponse = await axios.get(response.paging.next);
      response = nextResponse.data;
      results = [...results, ...(response.data || [])];
    }

    return results;
  }

  async getAdAccounts() {
    try {
      const response = await this.get<any>("/me/adaccounts", {
        fields: "id,name,account_status,business_name",
        limit: 100,
      });
      return response.data || [];
    } catch (error) {
      console.error("Error fetching ad accounts:", error);
      return [];
    }
  }

  async getInsights(params: Record<string, any> = {}) {
    try {
      const { date_preset, time_range, ...rest } = params;
      const queryParams: Record<string, any> = {
        fields: INSIGHT_FIELDS.join(","),
        ...rest,
      };

      if (time_range) {
        queryParams.time_range = JSON.stringify(time_range);
      } else {
        queryParams.date_preset = date_preset || "last_30d";
      }

      const response = await this.get<any>(`/${this.accountId}/insights`, queryParams);
      return response.data?.[0] || null;
    } catch (error) {
      console.error("Error fetching insights:", error);
      return null;
    }
  }

  async getCampaignInsights(params: Record<string, any> = {}) {
    try {
      const { date_preset, time_range, ...rest } = params;
      const queryParams: Record<string, any> = {
        fields: "campaign_id,campaign_name,spend,impressions,clicks,reach,actions,action_values,purchase_roas,ctr,cpc,cpm,frequency",
        level: "campaign",
        ...rest,
      };

      if (time_range) {
        queryParams.time_range = JSON.stringify(time_range);
      } else {
        queryParams.date_preset = date_preset || "last_30d";
      }

      return await this.paginate<any>(`/${this.accountId}/insights`, queryParams);
    } catch (error) {
      console.error("Error fetching campaign insights:", error);
      return [];
    }
  }

  async getDailyInsights(params: Record<string, any> = {}) {
    try {
      const { date_preset, time_range, ...rest } = params;
      const queryParams: Record<string, any> = {
        fields: "spend,impressions,clicks,reach,actions,action_values",
        level: "account",
        time_increment: 1,
        ...rest,
      };

      if (time_range) {
        queryParams.time_range = JSON.stringify(time_range);
      } else {
        queryParams.date_preset = date_preset || "last_30d";
      }

      const response = await this.get<any>(`/${this.accountId}/insights`, queryParams);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching daily insights:", error);
      return [];
    }
  }

  async getAudienceBreakdown(params: Record<string, any> = {}) {
    try {
      const { date_preset, time_range, ...rest } = params;
      const queryParams: Record<string, any> = {
        fields: "spend,impressions,clicks,reach,actions,action_values",
        level: "account",
        breakdowns: "gender",
        ...rest,
      };

      if (time_range) {
        queryParams.time_range = JSON.stringify(time_range);
      } else {
        queryParams.date_preset = date_preset || "last_30d";
      }

      const response = await this.get<any>(`/${this.accountId}/insights`, queryParams);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching audience breakdown:", error);
      return [];
    }
  }

  async getBestCreative(params: Record<string, any> = {}) {
    try {
      const response = await this.get<any>(`/${this.accountId}/ads`, {
        fields: "name,creative{id,name,image_url,thumbnail_url,video_id}",
        limit: 10,
        ...params,
      });
      return response.data || [];
    } catch (error) {
      console.error("Error fetching creatives:", error);
      return [];
    }
  }
}
