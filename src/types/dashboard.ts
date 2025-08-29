export interface DashboardOverview {
  totalAdmins: number;
  totalProducts: number;
  totalContacts: number;
  totalEmployees: number;
  totalDepartments: number;
  totalDesignations: number;
  recentProducts: number;
  recentContacts: number;
  recentEmployees: number;
  recentDepartments: number;
  recentDesignations: number;
  pendingContacts: number;
  recentLogins: number;
}

export interface DashboardOverviewResponse {
  success: boolean;
  message: string;
  data: {
    overview: DashboardOverview;
  };
}

export interface ChartDataPoint {
  _id: {
    year: number;
    month: number;
  };
  count: number;
}

export interface DistributionData {
  _id: string;
  count: number;
}

export interface ChartData {
  productsByMonth: ChartDataPoint[];
  contactsByMonth: ChartDataPoint[];
  employeesByMonth: ChartDataPoint[];
  contactStatusDistribution: DistributionData[];
  employeeTypeDistribution: DistributionData[];
  departmentDistribution: DistributionData[];
  designationDistribution: DistributionData[];
}

export interface ChartDataResponse {
  success: boolean;
  message: string;
  data: ChartData;
}

export interface RecentProduct {
  _id: string;
  productName: string;
  createdBy: {
    _id: string;
    fullName: string;
  };
  createdAt: string;
}

export interface RecentContact {
  _id: string;
  fullName: string;
  emailAddress: string;
  subject: string;
  status: string;
  createdAt: string;
}

export interface RecentEmployee {
  _id: string;
  fullName: string;
  department: {
    _id: string;
    name: string;
  };
  designation: {
    _id: string;
    title: string;
  };
  createdBy: {
    _id: string;
    fullName: string;
  };
  idCardNumber: string;
  createdAt: string;
}

export interface RecentDepartment {
  _id: string;
  name: string;
  code: string;
  createdBy: {
    _id: string;
    fullName: string;
  };
  createdAt: string;
}

export interface RecentDesignation {
  _id: string;
  title: string;
  level: number;
  department: {
    _id: string;
    name: string;
  };
  createdBy: {
    _id: string;
    fullName: string;
  };
  createdAt: string;
}

export interface RecentLogin {
  _id: string;
  fullName: string;
  email: string;
  lastLogin: string;
}

export interface RecentActivityData {
  recentProducts: RecentProduct[];
  recentContacts: RecentContact[];
  recentEmployees: RecentEmployee[];
  recentDepartments: RecentDepartment[];
  recentDesignations: RecentDesignation[];
  recentLogins: RecentLogin[];
}

export interface RecentActivityResponse {
  success: boolean;
  message: string;
  data: RecentActivityData;
}

export interface DashboardFilters {
  limit?: number;
  period?: 'day' | 'week' | 'month' | 'year';
  module?: string;
}
