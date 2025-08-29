export interface Product {
  _id: string;
  productName: string;
  productFeatures: string[];
  description?: string;
  price?: number;
  category?: string;
  mainImage: string;
  additionalImages?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  mainImage: File;
  productName: string;
  productFeatures: string[];
  description?: string;
  price?: number;
  category?: string;
}

export interface UpdateProductRequest {
  productName?: string;
  productFeatures?: string[];
  description?: string;
  price?: number;
  category?: string;
}

export interface ProductCategory {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  message: string;
}

export interface ProductResponse {
  success: boolean;
  data: Product;
  message: string;
}

export interface ProductCategoriesResponse {
  success: boolean;
  data: ProductCategory[];
  message: string;
}
