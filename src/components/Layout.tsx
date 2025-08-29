import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import MyLeads from './MyLeads';
import IdentityCard from './IdentityCard';
import MyProducts from './MyProducts';
import DepartmentManagement from './DepartmentManagement';
import DesignationManagement from './DesignationManagement';
import IdCardManagement from './IdCardManagement';
import Profile from './Profile';

const Layout: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'leads':
        return <MyLeads />;
      case 'identity':
        return <IdentityCard />;
      case 'products':
        return <MyProducts />;
      case 'departments':
        return <DepartmentManagement />;
      case 'designations':
        return <DesignationManagement />;
      case 'id-cards':
        return <IdCardManagement />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <main className="p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default Layout;