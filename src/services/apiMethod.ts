type ApiResponse<T> = {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
};

type ApiError = {
  message: string;
  status: number;
  statusText: string;
};

class APIMethod {
  private baseURL: string;
  private timeout: number;
  private retryAttempts: number;
  private retryDelay: number;

  constructor(
    baseURL: string = '',
    timeout: number = 10000,
    retryAttempts: number = 3,
    retryDelay: number = 1000
  ) {
    this.baseURL = baseURL;
    this.timeout = timeout;
    this.retryAttempts = retryAttempts;
    this.retryDelay = retryDelay;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async retryRequest<T>(
    url: string,
    options: RequestInit,
    attempt: number = 1
  ): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error) {
      if (attempt < this.retryAttempts) {
        console.warn(`Request failed (attempt ${attempt}), retrying in ${this.retryDelay}ms...`);
        await this.delay(this.retryDelay * attempt);
        return this.retryRequest<T>(url, options, attempt + 1);
      }
      throw error;
    }
  }

  private transformTokenData(data: Record<string, number>): Record<string, number> {
    const transformedData: Record<string, number> = {};
    
    for (const [symbol, price] of Object.entries(data)) {
      if (typeof price === 'number' && price > 0) {
        transformedData[symbol] = price;
      }
    }
    
    return transformedData;
  }

  async get<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await this.retryRequest<T>(url, defaultOptions);
      
      if (endpoint.includes('prices.json')) {
        response.data = this.transformTokenData(response.data as any) as T;
      }
      
      return response;
    } catch (error) {
      const apiError: ApiError = {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 0,
        statusText: 'Network Error',
      };
      
      throw apiError;
    }
  }

  async post<T>(endpoint: string, data: any, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    };

    return this.retryRequest<T>(url, defaultOptions);
  }
}

export const apiMethod = new APIMethod('https://interview.switcheo.com');
export type { ApiResponse, ApiError };
