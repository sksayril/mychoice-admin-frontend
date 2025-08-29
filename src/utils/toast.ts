import toast from 'react-hot-toast';

// Success toasts
export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#10B981',
      color: '#fff',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10B981',
    },
  });
};

// Error toasts
export const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 5000,
    position: 'top-right',
    style: {
      background: '#EF4444',
      color: '#fff',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#EF4444',
    },
  });
};

// Info toasts
export const showInfoToast = (message: string) => {
  toast(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#3B82F6',
      color: '#fff',
      fontWeight: '500',
    },
    icon: 'ℹ️',
  });
};

// Warning toasts
export const showWarningToast = (message: string) => {
  toast(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#F59E0B',
      color: '#fff',
      fontWeight: '500',
    },
    icon: '⚠️',
  });
};

// Loading toasts
export const showLoadingToast = (message: string) => {
  return toast.loading(message, {
    position: 'top-right',
    style: {
      background: '#6B7280',
      color: '#fff',
      fontWeight: '500',
    },
  });
};

// Specific toast messages for different actions
export const toastMessages = {
  // Auth messages
  loginSuccess: 'Login successful! Welcome back.',
  loginError: 'Login failed. Please check your credentials.',
  signupSuccess: 'Account created successfully! Welcome aboard.',
  signupError: 'Account creation failed. Please try again.',
  logoutSuccess: 'Logged out successfully.',
  profileUpdateSuccess: 'Profile updated successfully.',
  profileUpdateError: 'Profile update failed. Please try again.',
  passwordChangeSuccess: 'Password changed successfully.',
  passwordChangeError: 'Password change failed. Please try again.',

  // Department messages
  departmentCreateSuccess: 'Department created successfully!',
  departmentCreateError: 'Failed to create department. Please try again.',
  departmentUpdateSuccess: 'Department updated successfully!',
  departmentUpdateError: 'Failed to update department. Please try again.',
  departmentDeleteSuccess: 'Department deleted successfully!',
  departmentDeleteError: 'Failed to delete department. Please try again.',
  departmentLoadError: 'Failed to load departments. Please refresh the page.',

  // Designation messages
  designationCreateSuccess: 'Designation created successfully!',
  designationCreateError: 'Failed to create designation. Please try again.',
  designationUpdateSuccess: 'Designation updated successfully!',
  designationUpdateError: 'Failed to update designation. Please try again.',
  designationDeleteSuccess: 'Designation deleted successfully!',
  designationDeleteError: 'Failed to delete designation. Please try again.',
  designationLoadError: 'Failed to load designations. Please refresh the page.',

  // ID Card messages
  idCardCreateSuccess: 'ID Card created successfully!',
  idCardCreateError: 'Failed to create ID Card. Please try again.',
  idCardUpdateSuccess: 'ID Card updated successfully!',
  idCardUpdateError: 'Failed to update ID Card. Please try again.',
  idCardDeleteSuccess: 'ID Card deleted successfully!',
  idCardDeleteError: 'Failed to delete ID Card. Please try again.',
  idCardLoadError: 'Failed to load ID Cards. Please refresh the page.',
  idCardPictureUpdateSuccess: 'Employee picture updated successfully!',
  idCardGenerateSuccess: 'ID Card PDF generated successfully!',
  idCardGenerateError: 'Failed to generate ID Card PDF',
  idCardPictureUpdateError: 'Failed to update employee picture. Please try again.',

  // Contact messages
  contactLoadSuccess: 'Contacts loaded successfully!',
  contactLoadError: 'Failed to load contacts. Please try again.',
  contactUpdateSuccess: 'Contact status updated successfully!',
  contactUpdateError: 'Failed to update contact status. Please try again.',
  contactDeleteSuccess: 'Contact deleted successfully!',
  contactDeleteError: 'Failed to delete contact. Please try again.',
  contactStatsLoadError: 'Failed to load contact statistics.',

  // Dashboard messages
  dashboardLoadSuccess: 'Dashboard data loaded successfully!',
  dashboardLoadError: 'Failed to load dashboard data. Please try again.',
  dashboardRefreshSuccess: 'Dashboard refreshed successfully!',
  dashboardRefreshError: 'Failed to refresh dashboard. Please try again.',

  // General messages
  networkError: 'Network error. Please check your connection.',
  unauthorized: 'You are not authorized to perform this action.',
  serverError: 'Server error. Please try again later.',
  validationError: 'Please check your input and try again.',
  demoMode: 'This is demo mode. Changes are not saved.',
  demoModeSwitch: 'Switched to demo mode. All changes are simulated.',
  realModeSwitch: 'Switched to real mode. Changes will be saved to server.',
};

// Toast for demo mode actions
export const showDemoToast = (action: string) => {
  showInfoToast(`${action} (Demo Mode - Changes are not saved)`);
};

// Toast for network errors
export const showNetworkErrorToast = () => {
  showErrorToast(toastMessages.networkError);
};

// Toast for server errors
export const showServerErrorToast = () => {
  showErrorToast(toastMessages.serverError);
};

// Toast for validation errors
export const showValidationErrorToast = (message?: string) => {
  showErrorToast(message || toastMessages.validationError);
};
