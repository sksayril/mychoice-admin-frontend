import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Package, 
  Menu,
  X,
  LogOut,
  User,
  Building2,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, isCollapsed, onToggle }) => {
  const { logout, user } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'My Leads', icon: Users },
    // { id: 'identity', label: 'Identity Card', icon: CreditCard },
    { id: 'products', label: 'My Products', icon: Package },
      { id: 'departments', label: 'Departments', icon: Building2 },
  { id: 'designations', label: 'Designations', icon: Briefcase },
  { id: 'id-cards', label: 'ID Cards', icon: CreditCard },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className={`fixed top-0 left-0 h-full bg-blue-600 shadow-xl border-r border-blue-500 transition-all duration-300 z-40 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-500">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-white">Mychoice</h1>
        )}
        <button
          onClick={onToggle}
          className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
        >
          {isCollapsed ? <Menu className="w-5 h-5 text-white" /> : <X className="w-5 h-5 text-white" />}
        </button>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4 border-b border-blue-500">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.fullName?.charAt(0) || 'A'}
              </span>
            </div>
            <div>
              <p className="font-medium text-white">{user?.fullName || 'Admin User'}</p>
              <p className="text-sm text-blue-200">{user?.email || 'admin@example.com'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-blue-500">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-200 hover:bg-red-500 hover:text-white transition-colors"
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-blue-500">
          <p className="text-xs text-blue-200 text-center">
            Developed By<br />
            <span className="font-medium text-white">Cripcocode Ai Pvt Ltd</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;