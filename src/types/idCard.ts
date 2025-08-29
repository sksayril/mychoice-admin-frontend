export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IdCard {
  _id: string;
  idCardNumber: string;
  employeePicture: string;
  employeeType: 'full-time' | 'part-time' | 'contract' | 'intern' | 'temporary';
  fullName: string;
  address: Address;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  mobileNumber: string;
  email: string;
  dateOfBirth: string;
  dateOfJoining: string;
  department: string | Department;
  designation: string | Designation;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateIdCardRequest {
  employeePicture: File;
  employeeType: 'full-time' | 'part-time' | 'contract' | 'intern' | 'temporary';
  fullName: string;
  address: Address;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  mobileNumber: string;
  email: string;
  dateOfBirth: string;
  dateOfJoining: string;
  department: string;
  designation: string;
}

export interface UpdateIdCardRequest {
  employeePicture?: File;
  employeeType?: 'full-time' | 'part-time' | 'contract' | 'intern' | 'temporary';
  fullName?: string;
  address?: Address;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  mobileNumber?: string;
  email?: string;
  dateOfBirth?: string;
  dateOfJoining?: string;
  department?: string;
  designation?: string;
}

export interface UpdateIdCardPictureRequest {
  employeePicture: File;
}

export interface IdCardResponse {
  success: boolean;
  message: string;
  data: {
    idCard: IdCard;
  };
}

export interface IdCardsListResponse {
  success: boolean;
  message: string;
  data: {
    idCards: IdCard[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface IdCardStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalIdCards: number;
    activeIdCards: number;
    inactiveIdCards: number;
    employeeTypeDistribution: {
      'full-time': number;
      'part-time': number;
      'contract': number;
      'intern': number;
      'temporary': number;
    };
    departmentDistribution: {
      [departmentId: string]: number;
    };
    recentIdCards: IdCard[];
  };
}

// Import Department and Designation types
import { Department, Designation } from './department';
