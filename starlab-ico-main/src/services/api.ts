import axiosInstance from '@/lib/axiosInstance';

// ─────────────────────────────────────────────────────────────────────────────
// Types for the Solana ICO backend (existing)
// ─────────────────────────────────────────────────────────────────────────────

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
  message?: string;
  signature?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Types for the MongoDB backend (new)
// ─────────────────────────────────────────────────────────────────────────────
export interface OrderProduct {
  name: string;
  quantity: number;
  price: number;
  [key: string]: unknown;
}

export interface CreateOrderRequest {
  products: OrderProduct[];
  totalAmount: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Solana ICO API Service using global axiosInstance
// ─────────────────────────────────────────────────────────────────────────────
class ApiService {
  // Create a new blockchain transaction record using axiosInstance to include JWT
  async createTransaction(request: CreateTransactionRequest): Promise<Transaction> {
    const response = await axiosInstance.post('/transactions', request);
    return response.data.data || response.data;
  }

  // Get user transactions by public key
  async getUserTransactions(publicKey: string): Promise<Transaction[]> {
    const response = await axiosInstance.get(`/transactions/${publicKey}`);
    // Adjust to handle potential data nesting from the new endpoint
    return response.data.data?.transactions || response.data.transactions || response.data.data || response.data || [];
  }

  // Get user statistics
  async getUserStats(publicKey: string): Promise<UserStats> {
    const response = await axiosInstance.get(`/users/${publicKey}/stats`);
    return response.data.data || response.data;
  }

  // Get all transactions
  async getAllTransactions(limit = 100, offset = 0): Promise<Transaction[]> {
    const response = await axiosInstance.get(`/transactions?limit=${limit}&offset=${offset}`);
    return response.data.data?.transactions || [];
  }

  // Get ICO statistics
  async getICOStatistics(): Promise<ICOStatistics> {
    const response = await axiosInstance.get('/statistics');
    return response.data.data || response.data;
  }

  // Get top investors
  async getTopInvestors(limit = 10): Promise<TopInvestor[]> {
    const response = await axiosInstance.get(`/top-investors?limit=${limit}`);
    return response.data.data || response.data;
  }
}

export const api = new ApiService();

// ─────────────────────────────────────────────────────────────────────────────
// MongoDB Backend helpers (use central axiosInstance with JWT)
// ─────────────────────────────────────────────────────────────────────────────

/** Create an order in MongoDB (POST /order/create) */
export const createOrder = async (payload: CreateOrderRequest) => {
  const res = await axiosInstance.post('/order/create', payload);
  return res.data;
};

/** Login with Solana wallet (POST /auth/wallet-login) */
export const walletLoginApi = async (payload: { publicKey: string; signature: string; message: string }) => {
  const res = await axiosInstance.post('/auth/wallet-login', payload);
  return res.data;
};

/** Follow a celebrity (POST /user/follow) */
export const followCelebrity = async (celebrityId: string) => {
  const res = await axiosInstance.post('/user/follow', { celebrityId });
  return res.data;
};

/** Fetch the logged-in user's profile (GET /user/profile) */
export const fetchUserProfile = async () => {
  const res = await axiosInstance.get('/user/profile');
  return res.data;
};
