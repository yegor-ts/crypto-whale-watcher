export interface WalletBalanceResponse {
  address: string;
  ethBalance: string;
  usdBalance: number;
  ethPriceUsd: number;
  updatedAt: string;
}

export interface SearchHistoryEntry {
  id: number;
  address: string;
  searchedAt: Date;
}

export interface EtherscanBalanceResponse {
  status: string;
  message: string;
  result: string;
}

export interface CoinGeckoEthPriceResponse {
  ethereum: {
    usd: number;
  };
}