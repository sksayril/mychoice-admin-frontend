export interface Admin {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    admin: Admin;
    token: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: Admin | null;
  token: string | null;
  loading: boolean;
}
