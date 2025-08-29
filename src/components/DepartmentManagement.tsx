import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  Save, 
  Loader2,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { departmentAPI } from '../services/api';
import { Department, CreateDepartmentRequest, UpdateDepartmentRequest } from '../types/department';
import { useAuth } from '../hooks/useAuth';
import { showSuccessToast, showErrorToast, showDemoToast, toastMessages } from '../utils/toast';

const DepartmentManagement: React.FC = () => {
  const { isDemoMode, demoDepartments } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  // Load departments
  const loadDepartments = async () => {
    try {
      setLoading(true);
      
      if (isDemoMode) {
        // Use demo data
        let filteredDepartments = demoDepartments;
        
        // Apply search filter
        if (searchTerm) {
          filteredDepartments = demoDepartments.filter(dept =>
            dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dept.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        // Apply pagination
        const startIndex = (currentPage - 1) * 10;
        const endIndex = startIndex + 10;
        const paginatedDepartments = filteredDepartments.slice(startIndex, endIndex);
        
        setDepartments(paginatedDepartments);
        setTotalPages(Math.ceil(filteredDepartments.length / 10));
      } else {
        // Use real API
        const response = await departmentAPI.getAll({
          page: currentPage,
          limit: 10,
          search: searchTerm || undefined,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        });
        
        if (response.success) {
          setDepartments(response.data.departments);
          setTotalPages(response.data.pagination.totalPages);
        }
      }
    } catch (error: any) {
      setError('Failed to load departments');
      showErrorToast(toastMessages.departmentLoadError);
      console.error('Error loading departments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, [currentPage, searchTerm]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      if (isDemoMode) {
        // Demo mode - simulate API response
        if (editingDepartment) {
          // Update existing department
          const updatedDepartment = {
            ...editingDepartment,
            ...formData,
            updatedAt: new Date().toISOString()
          };
          setDepartments(prev => prev.map(dept => 
            dept._id === editingDepartment._id ? updatedDepartment : dept
          ));
          showDemoToast('Department updated');
          handleCloseModal();
        } else {
          // Create new department
          const newDepartment = {
            _id: `dept-${Date.now()}`,
            ...formData,
            isActive: true,
            createdAt: new Date().toISOString()
          };
          setDepartments(prev => [newDepartment, ...prev]);
          showDemoToast('Department created');
          handleCloseModal();
        }
      } else {
        // Real API mode
        if (editingDepartment) {
          // Update existing department
          const response = await departmentAPI.update(editingDepartment._id, formData);
          if (response.success) {
            setDepartments(prev => prev.map(dept => 
              dept._id === editingDepartment._id ? response.data.department : dept
            ));
            showSuccessToast(toastMessages.departmentUpdateSuccess);
            handleCloseModal();
          } else {
            setError(response.message || 'Failed to update department');
            showErrorToast(response.message || toastMessages.departmentUpdateError);
          }
        } else {
          // Create new department
          const response = await departmentAPI.create(formData);
          if (response.success) {
            setDepartments(prev => [response.data.department, ...prev]);
            showSuccessToast(toastMessages.departmentCreateSuccess);
            handleCloseModal();
          } else {
            setError(response.message || 'Failed to create department');
            showErrorToast(response.message || toastMessages.departmentCreateError);
          }
        }
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred');
      showErrorToast(error.response?.data?.message || 'An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete department
  const handleDelete = async (departmentId: string) => {
    if (!window.confirm('Are you sure you want to delete this department?')) {
      return;
    }

    try {
      if (isDemoMode) {
        // Demo mode - simulate deletion
        setDepartments(prev => prev.filter(dept => dept._id !== departmentId));
        showDemoToast('Department deleted');
      } else {
        // Real API mode
        const response = await departmentAPI.delete(departmentId);
        if (response.success) {
          setDepartments(prev => prev.filter(dept => dept._id !== departmentId));
          showSuccessToast(toastMessages.departmentDeleteSuccess);
        } else {
          setError(response.message || 'Failed to delete department');
          showErrorToast(response.message || toastMessages.departmentDeleteError);
        }
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete department');
      showErrorToast(error.response?.data?.message || 'Failed to delete department');
    }
  };

  // Handle edit department
  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      description: department.description,
      code: department.code
    });
    setShowCreateModal(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingDepartment(null);
    setFormData({ name: '', description: '', code: '' });
    setError('');
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Department Management</h1>
            <p className="text-gray-600">Manage your organization's departments and structure</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Department</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Departments List */}
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
            <p className="text-gray-600">Loading departments...</p>
          </div>
        ) : departments.length === 0 ? (
          <div className="p-8 text-center">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first department.'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Create Department
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {departments.map((department) => (
                    <tr key={department._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{department.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {department.code}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {department.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          department.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {department.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(department.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(department)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(department._id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing page <span className="font-medium">{currentPage}</span> of{' '}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingDepartment ? 'Edit Department' : 'Create Department'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Department Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter department name"
                  required
                />
              </div>

              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  Department Code *
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., ENG, HR, FIN"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter department description"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingDepartment ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;
