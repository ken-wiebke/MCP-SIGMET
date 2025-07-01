import axios, { AxiosInstance } from 'axios';
import { 
  GetDomesticSigmetsParams, 
  GetInternationalSigmetsParams, 
  SigmetResponse,
  GetDomesticSigmetsParamsSchema,
  GetInternationalSigmetsParamsSchema
} from './types';

export class AviationWeatherApiClient {
  private client: AxiosInstance;
  private baseUrl = 'https://aviationweather.gov/api/data';

  constructor() {
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'MCP-Sigmet-Server/1.0.0'
      }
    });

    // Add request interceptor to log URLs
    this.client.interceptors.request.use((config) => {
      const fullUrl = `${config.baseURL}${config.url}`;
      console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${fullUrl}`);
      if (config.params) {
        console.log(`📋 Query Parameters:`, config.params);
      }
      return config;
    });

    // Add response interceptor to log responses
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} ${response.statusText}`);
        console.log(`📊 Response size: ${JSON.stringify(response.data).length} characters`);
        return response;
      },
      (error) => {
        console.error(`❌ API Error: ${error.response?.status || 'No response'} ${error.response?.statusText || error.message}`);
        if (error.response?.data) {
          console.error(`📄 Error response data:`, error.response.data);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get domestic SIGMETs from the United States
   */
  async getDomesticSigmets(params: GetDomesticSigmetsParams = {}): Promise<any[]> {
    // Validate params
    try {
      GetDomesticSigmetsParamsSchema.parse(params);
    } catch (err) {
      throw new Error('Invalid parameters for getDomesticSigmets: ' + (err instanceof Error ? err.message : String(err)));
    }
    const queryParams = new URLSearchParams();
    
    if (params.hazard) {
      queryParams.append('hazard', params.hazard);
    }
    
    if (params.level !== undefined) {
      queryParams.append('level', params.level.toString());
    }
    
    if (params.date) {
      queryParams.append('date', params.date);
    }
    
    // Always request JSON format
    queryParams.append('format', 'json');

    const url = `/airsigmet?${queryParams.toString()}`;
    console.log(`🔍 Calling domestic SIGMETs API with URL: ${url}`);

    const response = await this.client.get(url);
    return response.data;
  }

  /**
   * Get international SIGMETs
   */
  async getInternationalSigmets(params: GetInternationalSigmetsParams = {}): Promise<any[]> {
    // Validate params
    try {
      GetInternationalSigmetsParamsSchema.parse(params);
    } catch (err) {
      throw new Error('Invalid parameters for getInternationalSigmets: ' + (err instanceof Error ? err.message : String(err)));
    }
    const queryParams = new URLSearchParams();
    
    if (params.hazard) {
      queryParams.append('hazard', params.hazard);
    }
    
    if (params.level !== undefined) {
      queryParams.append('level', params.level.toString());
    }
    
    if (params.date) {
      queryParams.append('date', params.date);
    }
    
    // Always request JSON format
    queryParams.append('format', 'json');

    const url = `/isigmet?${queryParams.toString()}`;
    console.log(`🔍 Calling international SIGMETs API with URL: ${url}`);

    const response = await this.client.get(url);
    return response.data;
  }

  /**
   * Test the API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      console.log(`🔍 Testing API connection to: ${this.baseUrl}/airsigmet?format=json`);
      const response = await this.client.get('/airsigmet?format=json');
      return response.status === 200;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }

  /**
   * Generate the URL for domestic SIGMETs without making the request
   */
  generateDomesticSigmetsUrl(params: GetDomesticSigmetsParams = {}): string {
    const queryParams = new URLSearchParams();
    
    if (params.hazard) {
      queryParams.append('hazard', params.hazard);
    }
    
    if (params.level !== undefined) {
      queryParams.append('level', params.level.toString());
    }
    
    if (params.date) {
      queryParams.append('date', params.date);
    }
    
    queryParams.append('format', 'json');

    return `${this.baseUrl}/airsigmet?${queryParams.toString()}`;
  }

  /**
   * Generate the URL for international SIGMETs without making the request
   */
  generateInternationalSigmetsUrl(params: GetInternationalSigmetsParams = {}): string {
    const queryParams = new URLSearchParams();
    
    if (params.hazard) {
      queryParams.append('hazard', params.hazard);
    }
    
    if (params.level !== undefined) {
      queryParams.append('level', params.level.toString());
    }
    
    if (params.date) {
      queryParams.append('date', params.date);
    }
    
    queryParams.append('format', 'json');

    return `${this.baseUrl}/isigmet?${queryParams.toString()}`;
  }

  /**
   * Log all possible URLs for testing
   */
  logAllUrls(): void {
    console.log('\n🔗 All possible API URLs:');
    console.log('=====================================');
    
    // Domestic SIGMETs URLs
    console.log('\n🇺🇸 Domestic SIGMETs:');
    console.log('Base:', this.generateDomesticSigmetsUrl());
    console.log('With hazard (turb):', this.generateDomesticSigmetsUrl({ hazard: 'turb' }));
    console.log('With level (300):', this.generateDomesticSigmetsUrl({ level: 300 }));
    console.log('With date:', this.generateDomesticSigmetsUrl({ date: '20250630_000000Z' }));
    console.log('With all params:', this.generateDomesticSigmetsUrl({ 
      hazard: 'turb', 
      level: 300, 
      date: '20250630_000000Z' 
    }));
    
    // International SIGMETs URLs
    console.log('\n🌍 International SIGMETs:');
    console.log('Base:', this.generateInternationalSigmetsUrl());
    console.log('With hazard (turb):', this.generateInternationalSigmetsUrl({ hazard: 'turb' }));
    console.log('With level (300):', this.generateInternationalSigmetsUrl({ level: 300 }));
    console.log('With date:', this.generateInternationalSigmetsUrl({ date: '20250630_000000Z' }));
    console.log('With all params:', this.generateInternationalSigmetsUrl({ 
      hazard: 'turb', 
      level: 300, 
      date: '20250630_000000Z' 
    }));
    
    console.log('=====================================\n');
  }
} 