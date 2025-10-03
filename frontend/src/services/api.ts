const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API Response interface
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
  pagination?: {
    page: number;
    limit: number;
    pages: number;
  };
}

// Request configuration
interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
}

// Base API class
class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const requestConfig: RequestInit = {
      method: config.method || 'GET',
      headers: { ...defaultHeaders, ...config.headers },
      credentials: 'include', // Include cookies
      mode: 'cors', // Explicitly set CORS mode
    };

    if (config.body && config.method !== 'GET') {
      if (config.body instanceof FormData) {
        // Remove Content-Type header for FormData
        delete requestConfig.headers!['Content-Type'];
        requestConfig.body = config.body;
      } else {
        requestConfig.body = JSON.stringify(config.body);
      }
    }

    try {
      const response = await fetch(url, requestConfig);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  auth = {
    login: (credentials: { email: string; password: string }) =>
      this.request('/auth/login', { method: 'POST', body: credentials }),
    
    logout: () =>
      this.request('/auth/logout', { method: 'POST' }),
    
    me: () =>
      this.request('/auth/me'),
    
    forgotPassword: (email: string) =>
      this.request('/auth/forgot-password', { method: 'POST', body: { email } }),
    
    resetPassword: (token: string, password: string) =>
      this.request('/auth/reset-password', { method: 'PUT', body: { token, password } }),
    
    updatePassword: (currentPassword: string, newPassword: string) =>
      this.request('/auth/update-password', { method: 'PUT', body: { currentPassword, newPassword } }),
    
    verifyOtpAndResetPassword: (data: { email: string; otp: string; newPassword: string }) =>
      this.request('/auth/verify-otp-reset', { method: 'POST', body: data }),
  };

  // Projects endpoints
  projects = {
    getAll: (params?: Record<string, any>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : '';
      return this.request(`/projects${query}`);
    },
    
    getById: (id: string) =>
      this.request(`/projects/${id}`),
    
    create: (projectData: any) =>
      this.request('/projects', { method: 'POST', body: projectData }),
    
    update: (id: string, projectData: any) =>
      this.request(`/projects/${id}`, { method: 'PUT', body: projectData }),
    
    delete: (id: string) =>
      this.request(`/projects/${id}`, { method: 'DELETE' }),
    
    toggleFeatured: (id: string) =>
      this.request(`/projects/${id}/featured`, { method: 'PATCH' }),
    
    getStats: () =>
      this.request('/projects/stats/overview'),
  };

  // Messages endpoints
  messages = {
    create: (messageData: any) =>
      this.request('/messages', { method: 'POST', body: messageData }),
    
    getAll: (params?: Record<string, any>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : '';
      return this.request(`/messages${query}`);
    },
    
    getById: (id: string) =>
      this.request(`/messages/${id}`),
    
    updateStatus: (id: string, status: string) =>
      this.request(`/messages/${id}/status`, { method: 'PATCH', body: { status } }),
    
    updatePriority: (id: string, priority: string) =>
      this.request(`/messages/${id}/priority`, { method: 'PATCH', body: { priority } }),
    
    addNotes: (id: string, notes: string) =>
      this.request(`/messages/${id}/notes`, { method: 'PATCH', body: { notes } }),
    
    delete: (id: string) =>
      this.request(`/messages/${id}`, { method: 'DELETE' }),
    
    getStats: () =>
      this.request('/messages/stats/overview'),
  };

  // Meetings endpoints
  meetings = {
    create: (meetingData: any) =>
      this.request('/meetings', { method: 'POST', body: meetingData }),
    
    getAll: (params?: Record<string, any>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : '';
      return this.request(`/meetings${query}`);
    },
    
    getById: (id: string) =>
      this.request(`/meetings/${id}`),
    
    updateStatus: (id: string, status: string) =>
      this.request(`/meetings/${id}/status`, { method: 'PATCH', body: { status } }),
    
    updatePriority: (id: string, priority: string) =>
      this.request(`/meetings/${id}/priority`, { method: 'PATCH', body: { priority } }),
    
    addNotes: (id: string, notes: string) =>
      this.request(`/meetings/${id}/notes`, { method: 'PATCH', body: { notes } }),
    
    update: (id: string, meetingData: any) =>
      this.request(`/meetings/${id}`, { method: 'PUT', body: meetingData }),
    
    delete: (id: string) =>
      this.request(`/meetings/${id}`, { method: 'DELETE' }),
    
    getStats: () =>
      this.request('/meetings/stats/overview'),
  };

  // Reviews endpoints
  reviews = {
    create: (reviewData: any) =>
      this.request('/reviews', { method: 'POST', body: reviewData }),
    
    getAll: (params?: Record<string, any>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : '';
      return this.request(`/reviews${query}`);
    },
    
    getById: (id: string) =>
      this.request(`/reviews/${id}`),
    
    updateStatus: (id: string, status: string) =>
      this.request(`/reviews/${id}/status`, { method: 'PATCH', body: { status } }),
    
    toggleFeatured: (id: string) =>
      this.request(`/reviews/${id}/featured`, { method: 'PATCH' }),
    
    update: (id: string, reviewData: any) =>
      this.request(`/reviews/${id}`, { method: 'PUT', body: reviewData }),
    
    delete: (id: string) =>
      this.request(`/reviews/${id}`, { method: 'DELETE' }),
    
    getFeatured: (limit?: number) => {
      const query = limit ? `?limit=${limit}` : '';
      return this.request(`/reviews/featured/list${query}`);
    },
    
    getStats: () =>
      this.request('/reviews/stats/overview'),
  };

  // Upload endpoints
  upload = {
    image: (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      return this.request('/upload/image', { method: 'POST', body: formData });
    },
    
    images: (files: File[]) => {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));
      return this.request('/upload/images', { method: 'POST', body: formData });
    },
    
    deleteImage: (url: string, publicId?: string) =>
      this.request('/upload/image', { method: 'DELETE', body: { url, publicId } }),
  };
}

// Create and export API instance
export const api = new ApiService();
export default api;
