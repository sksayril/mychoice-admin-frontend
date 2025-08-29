// Utility functions for API response validation and error handling

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: {
    [key: string]: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  message: string;
}

/**
 * Safely validates if a response has the expected structure
 */
export function isValidApiResponse(response: any): response is ApiResponse {
  return (
    response &&
    typeof response === 'object' &&
    typeof response.success === 'boolean' &&
    'data' in response &&
    typeof response.message === 'string'
  );
}

/**
 * Safely validates if a response is a paginated response
 */
export function isValidPaginatedResponse(response: any): response is PaginatedResponse {
  return (
    isValidApiResponse(response) &&
    response.data &&
    typeof response.data === 'object' &&
    response.data.pagination &&
    typeof response.data.pagination === 'object' &&
    typeof response.data.pagination.page === 'number' &&
    typeof response.data.pagination.limit === 'number' &&
    typeof response.data.pagination.total === 'number' &&
    typeof response.data.pagination.totalPages === 'number'
  );
}

/**
 * Safely extracts data from API response with fallback
 */
export function safeExtractData<T>(response: any, fallback: T): T {
  if (isValidApiResponse(response) && response.success) {
    return response.data as T;
  }
  return fallback;
}

/**
 * Safely extracts array data from API response
 */
export function safeExtractArrayData<T>(response: any): T[] {
  const data = safeExtractData(response, []);
  return Array.isArray(data) ? data : [];
}

/**
 * Handles API errors consistently
 */
export function handleApiError(error: any, defaultMessage: string = 'An error occurred'): string {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return defaultMessage;
}

/**
 * Creates a safe async function wrapper with error handling
 */
export function createSafeAsyncFunction<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  errorHandler?: (error: any) => void
) {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error('Async function error:', error);
      if (errorHandler) {
        errorHandler(error);
      }
      return null;
    }
  };
}

/**
 * Validates product data before sending to API
 */
export function validateProductData(data: {
  mainImage: File;
  productName: string;
  productFeatures: string[];
  description?: string;
  price?: number;
  category?: string;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.mainImage) {
    errors.push('Main image is required');
  }
  
  if (!data.productName?.trim()) {
    errors.push('Product name is required');
  }
  
  if (!Array.isArray(data.productFeatures) || data.productFeatures.length === 0) {
    errors.push('At least one product feature is required');
  } else {
    const validFeatures = data.productFeatures.filter(f => f.trim());
    if (validFeatures.length === 0) {
      errors.push('At least one product feature is required');
    }
  }
  
  if (data.price !== undefined && (isNaN(data.price) || data.price < 0)) {
    errors.push('Price must be a valid positive number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Creates FormData for product creation with proper array handling
 */
export function createProductFormData(data: {
  mainImage: File;
  productName: string;
  productFeatures: string[];
  description?: string;
  price?: number;
  category?: string;
}): FormData {
  const formData = new FormData();
  
  formData.append('mainImage', data.mainImage);
  formData.append('productName', data.productName);
  
  // Append each product feature individually to FormData
  data.productFeatures.forEach((feature, index) => {
    formData.append(`productFeatures[${index}]`, feature);
  });
  
  if (data.description) {
    formData.append('description', data.description);
  }
  if (data.price) {
    formData.append('price', data.price.toString());
  }
  if (data.category) {
    formData.append('category', data.category);
  }
  
  return formData;
}

/**
 * Utility function to get full image URL
 */
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) {
    console.log('getImageUrl: No image path provided');
    return 'https://via.placeholder.com/48x48?text=No+Image';
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    console.log('getImageUrl: Full URL detected:', imagePath);
    return imagePath;
  }
  
  // If it starts with /uploads, add the base URL
  if (imagePath.startsWith('/uploads/')) {
    const fullUrl = `http://localhost:3100${imagePath}`;
    console.log('getImageUrl: Uploads path detected:', fullUrl);
    return fullUrl;
  }
  
  // If it doesn't start with /, add /uploads/ prefix
  if (!imagePath.startsWith('/')) {
    const fullUrl = `http://localhost:3100/uploads/${imagePath}`;
    console.log('getImageUrl: Relative path detected:', fullUrl);
    return fullUrl;
  }
  
  // Default case
  const fullUrl = `http://localhost:3100${imagePath}`;
  console.log('getImageUrl: Default case:', fullUrl);
  return fullUrl;
};
