import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Package, CreditCard, Activity, Mail, CreditCard as IdCard, Building, UserCheck } from 'lucide-react';
import { dashboardAPI } from '../services/api';
import { DashboardOverview, RecentActivityData, ChartData } from '../types/dashboard';
import { showErrorToast, showLoadingToast } from '../utils/toast';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardOverview>({
    totalAdmins: 0,
    totalProducts: 0,
    totalContacts: 0,
    totalEmployees: 0,
    totalDepartments: 0,
    totalDesignations: 0,
    recentProducts: 0,
    recentContacts: 0,
    recentEmployees: 0,
    recentDepartments: 0,
    recentDesignations: 0,
    pendingContacts: 0,
    recentLogins: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivityData>({
    recentProducts: [],
    recentContacts: [],
    recentEmployees: [],
    recentDepartments: [],
    recentDesignations: [],
    recentLogins: []
  });
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const loadingToast = showLoadingToast('Loading dashboard data...');

      // Fetch all dashboard data in parallel
      const [overviewResponse, chartsResponse, activityResponse] = await Promise.all([
        dashboardAPI.getOverview(),
        dashboardAPI.getCharts(),
        dashboardAPI.getRecentActivity({ limit: 10 })
      ]);

      toast.dismiss(loadingToast);

      setStats(overviewResponse.data.overview);
      setChartData(chartsResponse.data);
      setRecentActivities(activityResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showErrorToast('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Refresh dashboard data
  const refreshDashboard = async () => {
    try {
      setRefreshing(true);
      await fetchDashboardData();
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Format relative time
  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  // Get module icon
  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'leads': return Users;
      case 'products': return Package;
      case 'contacts': return Mail;
      case 'id-cards': return IdCard;
      case 'departments': return Building;
      case 'designations': return UserCheck;
      default: return Activity;
    }
  };

  // Get module color
  const getModuleColor = (module: string) => {
    switch (module) {
      case 'leads': return 'bg-sky-500';
      case 'products': return 'bg-blue-500';
      case 'contacts': return 'bg-green-500';
      case 'id-cards': return 'bg-purple-500';
      case 'departments': return 'bg-orange-500';
      case 'designations': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  // Dashboard stats configuration
  const statsConfig = [
    { 
      title: 'Total Contacts', 
      value: formatNumber(stats.totalContacts), 
      icon: Mail, 
      color: 'bg-green-500',
      change: '+15%'
    },
    { 
      title: 'Total Products', 
      value: formatNumber(stats.totalProducts), 
      icon: Package, 
      color: 'bg-blue-500',
      change: '+8%'
    },
    { 
      title: 'Total Employees', 
      value: formatNumber(stats.totalEmployees), 
      icon: IdCard, 
      color: 'bg-purple-500',
      change: '+12%'
    },
    { 
      title: 'Total Departments', 
      value: formatNumber(stats.totalDepartments), 
      icon: Building, 
      color: 'bg-orange-500',
      change: '+5%'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your business today.</p>
          </div>
          <button 
            onClick={refreshDashboard}
            disabled={refreshing}
            className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Activity className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-sky-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-emerald-600">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Overview</h3>
          {loading ? (
            <div className="h-64 bg-gradient-to-t from-sky-50 to-transparent rounded-lg flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
            </div>
          ) : chartData ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-sky-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-sky-800 mb-2">Contacts</h4>
                  <p className="text-2xl font-bold text-sky-600">
                    {chartData.contactsByMonth.length > 0 ? chartData.contactsByMonth[chartData.contactsByMonth.length - 1].count : 0}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Products</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {chartData.productsByMonth.length > 0 ? chartData.productsByMonth[chartData.productsByMonth.length - 1].count : 0}
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-t from-sky-50 to-transparent rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Recent Trends</p>
                <div className="space-y-2">
                  {chartData.contactsByMonth.slice(-3).map((point, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{`${point._id.month}/${point._id.year}`}</span>
                      <span className="font-medium">{point.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 bg-gradient-to-t from-sky-50 to-transparent rounded-lg flex items-center justify-center">
              <p className="text-gray-500">No chart data available</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg animate-pulse">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (recentActivities.recentContacts.length > 0 || recentActivities.recentProducts.length > 0 || recentActivities.recentEmployees.length > 0) ? (
            <div className="space-y-4">
              {/* Recent Contacts */}
              {recentActivities.recentContacts.slice(0, 3).map((contact, index) => (
                <div key={contact._id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">New Contact: {contact.fullName}</p>
                    <p className="text-xs text-gray-500">{contact.subject}</p>
                    <p className="text-xs text-gray-400">{formatRelativeTime(contact.createdAt)}</p>
                  </div>
                </div>
              ))}
              
              {/* Recent Products */}
              {recentActivities.recentProducts.slice(0, 2).map((product, index) => (
                <div key={product._id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <Package className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">New Product: {product.productName}</p>
                    <p className="text-xs text-gray-500">Created by {product.createdBy.fullName}</p>
                    <p className="text-xs text-gray-400">{formatRelativeTime(product.createdAt)}</p>
                  </div>
                </div>
              ))}
              
              {/* Recent Employees */}
              {recentActivities.recentEmployees.slice(0, 2).map((employee, index) => (
                <div key={employee._id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                    <IdCard className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">New Employee: {employee.fullName}</p>
                    <p className="text-xs text-gray-500">{employee.department.name} - {employee.designation.title}</p>
                    <p className="text-xs text-gray-400">{formatRelativeTime(employee.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No recent activity</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
            <Mail className="w-8 h-8 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-800">View Contacts</h4>
            <p className="text-sm text-gray-600">Manage contact submissions</p>
          </button>
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
            <Package className="w-8 h-8 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-800">Manage Products</h4>
            <p className="text-sm text-gray-600">Add or edit products</p>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left">
            <IdCard className="w-8 h-8 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-800">ID Cards</h4>
            <p className="text-sm text-gray-600">Manage employee ID cards</p>
          </button>
          <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-left">
            <Building className="w-8 h-8 text-orange-600 mb-2" />
            <h4 className="font-medium text-gray-800">Departments</h4>
            <p className="text-sm text-gray-600">Manage departments</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;