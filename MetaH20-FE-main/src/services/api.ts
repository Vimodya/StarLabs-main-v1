const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface Transaction {
  id: number;
  user_id: number;
  transaction_hash: string;
  payment_currency: string;
  amount_paid: number;
  tokens_received: number;
  exchange_rate: number;
  status: string;
  created_at: string;
}

export interface UserStats {
  public_key: string;
  total_tokens: number;
  total_sol_invested: number;
  total_usdt_invested: number;
  transaction_count: number;
  member_since: string;
}

export interface ICOStatistics {
  total_transactions: number;
  total_sol_raised: number;
  total_usdt_raised: number;
  total_tokens_sold: number;
  unique_investors: number;
}

export interface TopInvestor {
  public_key: string;
  total_tokens: number;
  total_sol_invested: number;
  total_usdt_invested: number;
  total_invested: number;
  transaction_count: number;
}

export interface CreateTransactionRequest {
  publicKey: string;
  transactionHash: string;
  paymentCurrency: string;
  amountPaid: number;
  tokensReceived: number;
  exchangeRate: number;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  }

  // Create a new transaction
  async createTransaction(request: CreateTransactionRequest): Promise<Transaction> {
    return this.request<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Get user transactions by public key
  async getUserTransactions(publicKey: string, limit = 50, offset = 0): Promise<Transaction[]> {
    const response = await this.request<{ transactions: Transaction[] }>(
      `/users/${publicKey}/transactions?limit=${limit}&offset=${offset}`
    );
    return response.transactions;
  }

  // Get user statistics
  async getUserStats(publicKey: string): Promise<UserStats> {
    return this.request<UserStats>(`/users/${publicKey}/stats`);
  }

  // Get all transactions
  async getAllTransactions(limit = 100, offset = 0): Promise<Transaction[]> {
    const response = await this.request<{ transactions: Transaction[] }>(
      `/transactions?limit=${limit}&offset=${offset}`
    );
    return response.transactions;
  }

  // Get ICO statistics
  async getICOStatistics(): Promise<ICOStatistics> {
    return this.request<ICOStatistics>('/statistics');
  }

  // Get top investors
  async getTopInvestors(limit = 10): Promise<TopInvestor[]> {
    return this.request<TopInvestor[]>(`/top-investors?limit=${limit}`);
  }
}

export const api = new ApiService(API_BASE_URL);
