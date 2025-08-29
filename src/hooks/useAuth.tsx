import { useState, useEffect, createContext, useContext } from 'react';
import { adminAuthAPI } from '../services/api';
import { Admin, LoginRequest, SignupRequest, UpdateProfileRequest, ChangePasswordRequest } from '../types/auth';
import { showSuccessToast, showErrorToast, showInfoToast, toastMessages } from '../utils/toast';
import { IdCard, Address } from '../types/idCard';

interface AuthContextType {
  isAuthenticated: boolean;
  user: Admin | null;
  loading: boolean;
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  login: (data: LoginRequest) => Promise<{ success: boolean; message: string }>;
  signup: (data: SignupRequest) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<{ success: boolean; message: string }>;
  changePassword: (data: ChangePasswordRequest) => Promise<{ success: boolean; message: string }>;
  refreshProfile: () => Promise<void>;
  demoDepartments: any[];
  demoDesignations: any[];
  demoIdCards: IdCard[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Demo user data
  const demoUser: Admin = {
    _id: 'demo-user-id',
    fullName: 'Demo Admin User',
    email: 'admin@mychoice.com',
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  // Demo departments data
  const demoDepartments = [
    {
      _id: 'dept-1',
      name: 'Engineering',
      description: 'Software development and technical operations',
      code: 'ENG',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'dept-2',
      name: 'Human Resources',
      description: 'Employee management and recruitment',
      code: 'HR',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'dept-3',
      name: 'Finance',
      description: 'Financial planning and accounting',
      code: 'FIN',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ];

  // Demo designations data
  const demoDesignations = [
    {
      _id: 'desig-1',
      title: 'Software Engineer',
      description: 'Full-stack development and system architecture',
      level: 3,
      department: 'dept-1',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'desig-2',
      title: 'Senior Developer',
      description: 'Lead development and code review',
      level: 4,
      department: 'dept-1',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'desig-3',
      title: 'HR Manager',
      description: 'Employee relations and policy management',
      level: 5,
      department: 'dept-2',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ];

  // Demo ID cards data
  const demoIdCards: IdCard[] = [
    {
      _id: 'idcard-1',
      idCardNumber: 'EMP001',
      employeePicture: '/uploads/employees/pictures/employee-1756465655146-244016354.png',
      employeeType: 'full-time',
      fullName: 'John Smith',
      address: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      bloodGroup: 'A+',
      mobileNumber: '+1-555-0123',
      email: 'john.smith@company.com',
      dateOfBirth: '1990-05-15',
      dateOfJoining: '2023-01-15',
      department: 'dept-1',
      designation: 'desig-1',
      isActive: true,
      createdAt: '2024-01-15T10:00:00.000Z'
    },
    {
      _id: 'idcard-2',
      idCardNumber: 'EMP002',
      employeePicture: '/uploads/employees/pictures/employee-1756465655147-244016355.png',
      employeeType: 'full-time',
      fullName: 'Sarah Johnson',
      address: {
        street: '456 Oak Avenue',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA'
      },
      bloodGroup: 'B+',
      mobileNumber: '+1-555-0456',
      email: 'sarah.johnson@company.com',
      dateOfBirth: '1988-12-20',
      dateOfJoining: '2023-03-01',
      department: 'dept-2',
      designation: 'desig-3',
      isActive: true,
      createdAt: '2024-01-15T10:00:00.000Z'
    },
    {
      _id: 'idcard-3',
      idCardNumber: 'EMP003',
      employeePicture: '/uploads/employees/pictures/employee-1756465655148-244016356.png',
      employeeType: 'contract',
      fullName: 'Michael Brown',
      address: {
        street: '789 Pine Street',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'USA'
      },
      bloodGroup: 'O+',
      mobileNumber: '+1-555-0789',
      email: 'michael.brown@company.com',
      dateOfBirth: '1992-08-10',
      dateOfJoining: '2023-06-15',
      department: 'dept-3',
      designation: 'desig-4',
      isActive: true,
      createdAt: '2024-01-15T10:00:00.000Z'
    },
    {
      _id: 'idcard-4',
      idCardNumber: 'EMP004',
      employeePicture: '/uploads/employees/pictures/employee-1756465655149-244016357.png',
      employeeType: 'part-time',
      fullName: 'Emily Davis',
      address: {
        street: '321 Elm Street',
        city: 'Miami',
        state: 'FL',
        zipCode: '33101',
        country: 'USA'
      },
      bloodGroup: 'AB+',
      mobileNumber: '+1-555-0321',
      email: 'emily.davis@company.com',
      dateOfBirth: '1995-03-25',
      dateOfJoining: '2023-09-01',
      department: 'dept-4',
      designation: 'desig-5',
      isActive: true,
      createdAt: '2024-01-15T10:00:00.000Z'
    },
    {
      _id: 'idcard-5',
      idCardNumber: 'EMP005',
      employeePicture: '/uploads/employees/pictures/employee-1756465655150-244016358.png',
      employeeType: 'intern',
      fullName: 'David Wilson',
      address: {
        street: '654 Maple Drive',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101',
        country: 'USA'
      },
      bloodGroup: 'A-',
      mobileNumber: '+1-555-0654',
      email: 'david.wilson@company.com',
      dateOfBirth: '2000-11-05',
      dateOfJoining: '2024-01-01',
      department: 'dept-1',
      designation: 'desig-1',
      isActive: true,
      createdAt: '2024-01-15T10:00:00.000Z'
    }
  ];

  // Check for existing token on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('mychoice_token');
      const demoMode = localStorage.getItem('mychoice_demo_mode') === 'true';
      
      setIsDemoMode(demoMode);
      
      if (demoMode) {
        // Demo mode - check for demo auth
        const savedAuth = localStorage.getItem('mychoice_auth');
        if (savedAuth) {
          const authData = JSON.parse(savedAuth);
          setUser(authData.user);
          setIsAuthenticated(true);
        }
      } else if (token) {
        // Real API mode - validate token
        try {
          const response = await adminAuthAPI.getProfile();
          if (response.success) {
            setUser(response.data.admin);
            setIsAuthenticated(true);
          } else {
            // Invalid token, clear storage
            localStorage.removeItem('mychoice_token');
            localStorage.removeItem('mychoice_auth');
          }
        } catch (error) {
          console.error('Failed to validate token:', error);
          localStorage.removeItem('mychoice_token');
          localStorage.removeItem('mychoice_auth');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const toggleDemoMode = () => {
    const newDemoMode = !isDemoMode;
    setIsDemoMode(newDemoMode);
    localStorage.setItem('mychoice_demo_mode', newDemoMode.toString());
    
    // Clear existing auth when switching modes
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('mychoice_token');
    localStorage.removeItem('mychoice_auth');
    
    // Show toast notification
    if (newDemoMode) {
      showInfoToast(toastMessages.demoModeSwitch);
    } else {
      showInfoToast(toastMessages.realModeSwitch);
    }
  };

  const login = async (data: LoginRequest): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      
      if (isDemoMode) {
        // Demo mode login
        if (data.email === 'admin@mychoice.com' && data.password === 'demo123') {
          setUser(demoUser);
          setIsAuthenticated(true);
          localStorage.setItem('mychoice_auth', JSON.stringify({ user: demoUser }));
          showSuccessToast(toastMessages.loginSuccess + ' (Demo Mode)');
          return { success: true, message: 'Login successful (Demo Mode)' };
        } else {
          showErrorToast('Invalid credentials. Use admin@mychoice.com / demo123');
          return { success: false, message: 'Invalid credentials. Use admin@mychoice.com / demo123' };
        }
      } else {
        // Real API login
        const response = await adminAuthAPI.login(data);
        
        if (response.success) {
          const { admin, token } = response.data;
          setUser(admin);
          setIsAuthenticated(true);
          localStorage.setItem('mychoice_token', token);
          localStorage.setItem('mychoice_auth', JSON.stringify({ user: admin, token }));
          showSuccessToast(toastMessages.loginSuccess);
          return { success: true, message: 'Login successful' };
        } else {
          showErrorToast(response.message || toastMessages.loginError);
          return { success: false, message: response.message || 'Login failed' };
        }
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      showErrorToast(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: SignupRequest): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      
      if (isDemoMode) {
        // Demo mode signup - simulate success
        const newDemoUser: Admin = {
          _id: `demo-${Date.now()}`,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        setUser(newDemoUser);
        setIsAuthenticated(true);
        localStorage.setItem('mychoice_auth', JSON.stringify({ user: newDemoUser }));
        showSuccessToast(toastMessages.signupSuccess + ' (Demo Mode)');
        return { success: true, message: 'Account created successfully (Demo Mode)' };
      } else {
        // Real API signup
        const response = await adminAuthAPI.signup(data);
        
        if (response.success) {
          const { admin, token } = response.data;
          setUser(admin);
          setIsAuthenticated(true);
          localStorage.setItem('mychoice_token', token);
          localStorage.setItem('mychoice_auth', JSON.stringify({ user: admin, token }));
          showSuccessToast(toastMessages.signupSuccess);
          return { success: true, message: 'Account created successfully' };
        } else {
          showErrorToast(response.message || toastMessages.signupError);
          return { success: false, message: response.message || 'Signup failed' };
        }
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Signup failed. Please try again.';
      showErrorToast(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Call logout API if user is authenticated and not in demo mode
      if (isAuthenticated && !isDemoMode) {
        await adminAuthAPI.logout();
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear local state regardless of API call success
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('mychoice_token');
      localStorage.removeItem('mychoice_auth');
      showSuccessToast(toastMessages.logoutSuccess);
    }
  };

  const updateProfile = async (data: UpdateProfileRequest): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      
      if (isDemoMode) {
        // Demo mode profile update
        const updatedUser = { ...user!, ...data };
        setUser(updatedUser);
        localStorage.setItem('mychoice_auth', JSON.stringify({ user: updatedUser }));
        showSuccessToast(toastMessages.profileUpdateSuccess + ' (Demo Mode)');
        return { success: true, message: 'Profile updated successfully (Demo Mode)' };
      } else {
        // Real API profile update
        const response = await adminAuthAPI.updateProfile(data);
        
        if (response.success) {
          setUser(response.data.admin);
          // Update stored auth data
          const storedAuth = localStorage.getItem('mychoice_auth');
          if (storedAuth) {
            const authData = JSON.parse(storedAuth);
            authData.user = response.data.admin;
            localStorage.setItem('mychoice_auth', JSON.stringify(authData));
          }
          showSuccessToast(toastMessages.profileUpdateSuccess);
          return { success: true, message: 'Profile updated successfully' };
        } else {
          showErrorToast(response.message || toastMessages.profileUpdateError);
          return { success: false, message: response.message || 'Profile update failed' };
        }
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Profile update failed. Please try again.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (data: ChangePasswordRequest): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      
      if (isDemoMode) {
        // Demo mode password change
        showSuccessToast(toastMessages.passwordChangeSuccess + ' (Demo Mode)');
        return { success: true, message: 'Password changed successfully (Demo Mode)' };
      } else {
        // Real API password change
        const response = await adminAuthAPI.changePassword(data);
        
        if (response.success) {
          showSuccessToast(toastMessages.passwordChangeSuccess);
          return { success: true, message: 'Password changed successfully' };
        } else {
          showErrorToast(response.message || toastMessages.passwordChangeError);
          return { success: false, message: response.message || 'Password change failed' };
        }
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Password change failed. Please try again.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async (): Promise<void> => {
    try {
      if (isDemoMode) {
        // Demo mode - no need to refresh
        return;
      }
      
      const response = await adminAuthAPI.getProfile();
      if (response.success) {
        setUser(response.data.admin);
        // Update stored auth data
        const storedAuth = localStorage.getItem('mychoice_auth');
        if (storedAuth) {
          const authData = JSON.parse(storedAuth);
          authData.user = response.data.admin;
          localStorage.setItem('mychoice_auth', JSON.stringify(authData));
        }
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        loading, 
        isDemoMode,
        toggleDemoMode,
        login, 
        signup, 
        logout, 
        updateProfile, 
        changePassword, 
        refreshProfile,
        demoDepartments,
        demoDesignations,
        demoIdCards
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};