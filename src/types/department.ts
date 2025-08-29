export interface Department {
  _id: string;
  name: string;
  description: string;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Designation {
  _id: string;
  title: string;
  description: string;
  level: number;
  department: string | Department;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateDepartmentRequest {
  name: string;
  description: string;
  code: string;
}

export interface UpdateDepartmentRequest {
  name?: string;
  description?: string;
  code?: string;
}

export interface CreateDesignationRequest {
  title: string;
  description: string;
  level: number;
  department: string;
}

export interface UpdateDesignationRequest {
  title?: string;
  description?: string;
  level?: number;
  department?: string;
}

export interface DepartmentResponse {
  success: boolean;
  message: string;
  data: {
    department: Department;
  };
}

export interface DesignationResponse {
  success: boolean;
  message: string;
  data: {
    designation: Designation;
  };
}

export interface DepartmentsListResponse {
  success: boolean;
  message: string;
  data: {
    departments: Department[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface DesignationsListResponse {
  success: boolean;
  message: string;
  data: {
    designations: Designation[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
