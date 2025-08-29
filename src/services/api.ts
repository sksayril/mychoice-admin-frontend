import axios from 'axios';
import { 
  CreateDepartmentRequest, 
  UpdateDepartmentRequest, 
  CreateDesignationRequest, 
  UpdateDesignationRequest 
} from '../types/department';
import {
  CreateIdCardRequest,
  UpdateIdCardRequest,
  UpdateIdCardPictureRequest
} from '../types/idCard';
import {
  ContactFilters,
  UpdateContactStatusRequest
} from '../types/contact';
import {
  DashboardFilters
} from '../types/dashboard';
import { createProductFormData } from '../utils/apiUtils';

// API base configuration
const API_BASE_URL = 'http://localhost:3100/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mychoice_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('mychoice_token');
      localStorage.removeItem('mychoice_auth');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Admin authentication API endpoints
export const adminAuthAPI = {
  // Admin signup
  signup: async (data: {
    fullName: string;
    email: string;
    password: string;
    role: string;
  }) => {
    const response = await api.post('/admin/signup', data);
    return response.data;
  },

  // Admin login
  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/admin/login', data);
    return response.data;
  },

  // Get admin profile
  getProfile: async () => {
    const response = await api.get('/admin/profile');
    return response.data;
  },

  // Update admin profile
  updateProfile: async (data: { fullName?: string; email?: string }) => {
    const response = await api.put('/admin/profile', data);
    return response.data;
  },

  // Change password
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await api.put('/admin/change-password', data);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/admin/logout');
    return response.data;
  },
};

// Department API endpoints
export const departmentAPI = {
  // Create department
  create: async (data: CreateDepartmentRequest) => {
    const response = await api.post('/departments', data);
    return response.data;
  },

  // Get all departments
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const response = await api.get('/departments', { params });
    return response.data;
  },

  // Get single department
  getById: async (departmentId: string) => {
    const response = await api.get(`/departments/${departmentId}`);
    return response.data;
  },

  // Update department
  update: async (departmentId: string, data: UpdateDepartmentRequest) => {
    const response = await api.put(`/departments/${departmentId}`, data);
    return response.data;
  },

  // Delete department
  delete: async (departmentId: string) => {
    const response = await api.delete(`/departments/${departmentId}`);
    return response.data;
  },

  // Get active departments
  getActive: async () => {
    const response = await api.get('/departments/list/active');
    return response.data;
  },
};

// Designation API endpoints
export const designationAPI = {
  // Create designation
  create: async (data: CreateDesignationRequest) => {
    const response = await api.post('/designations', data);
    return response.data;
  },

  // Get all designations
  getAll: async (params?: {
    page?: number;
    limit?: number;
    department?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const response = await api.get('/designations', { params });
    return response.data;
  },

  // Get single designation
  getById: async (designationId: string) => {
    const response = await api.get(`/designations/${designationId}`);
    return response.data;
  },

  // Update designation
  update: async (designationId: string, data: UpdateDesignationRequest) => {
    const response = await api.put(`/designations/${designationId}`, data);
    return response.data;
  },

  // Delete designation
  delete: async (designationId: string) => {
    const response = await api.delete(`/designations/${designationId}`);
    return response.data;
  },

  // Get designations by department
  getByDepartment: async (departmentId: string) => {
    const response = await api.get(`/designations/department/${departmentId}`);
    return response.data;
  },

  // Get active designations
  getActive: async () => {
    const response = await api.get('/designations/list/active');
    return response.data;
  },
};

// Product API endpoints
export const productAPI = {
  // Create product
  create: async (data: {
    mainImage: File;
    productName: string;
    productFeatures: string[];
    description?: string;
    price?: number;
    category?: string;
  }) => {
    const formData = createProductFormData(data);

    // Debug: Log FormData contents
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all products
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get single product
  getById: async (productId: string) => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },

  // Update product
  update: async (productId: string, data: {
    productName?: string;
    productFeatures?: string[];
    description?: string;
    price?: number;
    category?: string;
  }) => {
    const response = await api.put(`/products/${productId}`, data);
    return response.data;
  },

  // Upload additional images
  uploadAdditionalImages: async (productId: string, additionalImages: File[]) => {
    const formData = new FormData();
    additionalImages.forEach((image, index) => {
      formData.append('additionalImages', image);
    });

    const response = await api.post(`/products/${productId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update main image
  updateMainImage: async (productId: string, mainImage: File) => {
    const formData = new FormData();
    formData.append('mainImage', mainImage);

    const response = await api.put(`/products/${productId}/main-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete product
  delete: async (productId: string) => {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  },

  // Get product categories
  getCategories: async () => {
    const response = await api.get('/products/categories/list');
    return response.data;
  },
};

// ID Card API endpoints
export const idCardAPI = {
  // Create ID card
  create: async (data: CreateIdCardRequest) => {
    const formData = new FormData();
    formData.append('employeePicture', data.employeePicture);
    formData.append('employeeType', data.employeeType);
    formData.append('fullName', data.fullName);
    formData.append('address[street]', data.address.street);
    formData.append('address[city]', data.address.city);
    formData.append('address[state]', data.address.state);
    formData.append('address[zipCode]', data.address.zipCode);
    formData.append('address[country]', data.address.country);
    formData.append('bloodGroup', data.bloodGroup);
    formData.append('mobileNumber', data.mobileNumber);
    formData.append('email', data.email);
    formData.append('dateOfBirth', data.dateOfBirth);
    formData.append('dateOfJoining', data.dateOfJoining);
    formData.append('department', data.department);
    formData.append('designation', data.designation);

    const response = await api.post('/id-cards', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all ID cards
  getAll: async (params?: {
    page?: number;
    limit?: number;
    employeeType?: string;
    department?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const response = await api.get('/id-cards', { params });
    return response.data;
  },

  // Get single ID card
  getById: async (idCardId: string) => {
    const response = await api.get(`/id-cards/${idCardId}`);
    return response.data;
  },

  // Get ID card by number
  getByNumber: async (idCardNumber: string) => {
    const response = await api.get(`/id-cards/number/${idCardNumber}`);
    return response.data;
  },

  // Update ID card
  update: async (idCardId: string, data: UpdateIdCardRequest) => {
    const formData = new FormData();
    
    // Add employee picture if provided
    if (data.employeePicture) {
      formData.append('employeePicture', data.employeePicture);
    }
    
    // Add other fields if provided
    if (data.employeeType) {
      formData.append('employeeType', data.employeeType);
    }
    if (data.fullName) {
      formData.append('fullName', data.fullName);
    }
    if (data.address) {
      formData.append('address[street]', data.address.street);
      formData.append('address[city]', data.address.city);
      formData.append('address[state]', data.address.state);
      formData.append('address[zipCode]', data.address.zipCode);
      formData.append('address[country]', data.address.country);
    }
    if (data.bloodGroup) {
      formData.append('bloodGroup', data.bloodGroup);
    }
    if (data.mobileNumber) {
      formData.append('mobileNumber', data.mobileNumber);
    }
    if (data.email) {
      formData.append('email', data.email);
    }
    if (data.dateOfBirth) {
      formData.append('dateOfBirth', data.dateOfBirth);
    }
    if (data.dateOfJoining) {
      formData.append('dateOfJoining', data.dateOfJoining);
    }
    if (data.department) {
      formData.append('department', data.department);
    }
    if (data.designation) {
      formData.append('designation', data.designation);
    }

    const response = await api.put(`/id-cards/${idCardId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update employee picture
  updatePicture: async (idCardId: string, data: UpdateIdCardPictureRequest) => {
    const formData = new FormData();
    formData.append('employeePicture', data.employeePicture);

    const response = await api.put(`/id-cards/${idCardId}/picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete ID card
  delete: async (idCardId: string) => {
    const response = await api.delete(`/id-cards/${idCardId}`);
    return response.data;
  },

  // Get ID card statistics
  getStats: async () => {
    const response = await api.get('/id-cards/stats/overview');
    return response.data;
  },

  // Get departments list for ID cards
  getDepartmentsList: async () => {
    const response = await api.get('/id-cards/departments/list');
    return response.data;
  },
};

// Contact API endpoints
export const contactAPI = {
  // Get all contacts
  getAll: async (params?: ContactFilters) => {
    const response = await api.get('/contact', { params });
    return response.data;
  },

  // Get single contact
  getById: async (contactId: string) => {
    const response = await api.get(`/contact/${contactId}`);
    return response.data;
  },

  // Update contact status
  updateStatus: async (contactId: string, data: UpdateContactStatusRequest) => {
    const response = await api.put(`/contact/${contactId}/status`, data);
    return response.data;
  },

  // Delete contact
  delete: async (contactId: string) => {
    const response = await api.delete(`/contact/${contactId}`);
    return response.data;
  },

  // Get contact statistics
  getStats: async () => {
    const response = await api.get('/contact/stats/overview');
    return response.data;
  },
};

// Dashboard API endpoints
export const dashboardAPI = {
  // Get dashboard overview
  getOverview: async () => {
    const response = await api.get('/dashboard/overview');
    return response.data;
  },

  // Get chart data
  getCharts: async (params?: DashboardFilters) => {
    const response = await api.get('/dashboard/charts', { params });
    return response.data;
  },

  // Get recent activity
  getRecentActivity: async (params?: DashboardFilters) => {
    const response = await api.get('/dashboard/recent-activity', { params });
    return response.data;
  },
};

export default api;
