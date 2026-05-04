export interface MeliTokens {
  access_token: string;
  refresh_token: string;
  user_id: string;
  expires_in: number;
  token_type: string;
}

export interface MeliConfig {
  clientId: string | undefined;
  clientSecret: string | undefined;
  redirectUri: string | undefined;
  sellerId: string | undefined;
  frontendUrl: string;
  apiBaseUrl: string;
  authBaseUrl: string;
}

export interface OrderPaging {
  total: number;
  limit: number;
  offset: number;
}

export interface OrderResult {
  id: string;
  status: string;
  [key: string]: unknown;
}

export interface OrderSearchResponse {
  paging: OrderPaging;
  results: OrderResult[];
}