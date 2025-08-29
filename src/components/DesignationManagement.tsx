import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  Loader2,
  Filter,
  ChevronLeft,
  ChevronRight,
  Building2
} from 'lucide-react';
import { designationAPI, departmentAPI } from '../services/api';
import { Designation, CreateDesignationRequest, UpdateDesignationRequest, Department } from '../types/department';
import { useAuth } from '../hooks/useAuth';
import { showSuccessToast, showErrorToast, showDemoToast, toastMessages } from '../utils/toast';

const DesignationManagement: React.FC = () => {
  const { isDemoMode, demoDepartments, demoDesignations } = useAuth();
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDesignation, setEditingDesignation] = useState<Designation | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 1,
    department: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  // Load designations
  const loadDesignations = async () => {
    try {
      setLoading(true);
      
      if (isDemoMode) {
        // Use demo data
        let filteredDesignations = demoDesignations;
        
        // Apply department filter
        if (selectedDepartment) {
          filteredDesignations = demoDesignations.filter(desig =>
            desig.department === selectedDepartment
          );
        }
        
        // Apply search filter
        if (searchTerm) {
          filteredDesignations = filteredDesignations.filter(desig =>
            desig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            desig.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        // Apply pagination
        const startIndex = (currentPage - 1) * 10;
        const endIndex = startIndex + 10;
        const paginatedDesignations = filteredDesignations.slice(startIndex, endIndex);
        
        setDesignations(paginatedDesignations);
        setTotalPages(Math.ceil(filteredDesignations.length / 10));
      } else {
        // Use real API
        const response = await designationAPI.getAll({
          page: currentPage,
          limit: 10,
          search: searchTerm || undefined,
          department: selectedDepartment || undefined,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        });
        
        if (response.success) {
          setDesignations(response.data.designations);
          setTotalPages(response.data.pagination.totalPages);
        }
      }
    } catch (error: any) {
      setError('Failed to load designations');
      showErrorToast(toastMessages.designationLoadError);
      console.error('Error loading designations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load departments for dropdown
  const loadDepartments = async () => {
    try {
      if (isDemoMode) {
        // Use demo departments
        setDepartments(demoDepartments);
      } else {
        // Use real API
        const response = await departmentAPI.getActive();
        if (response.success) {
          setDepartments(response.data.departments);
        }
      }
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

  useEffect(() => {
    loadDesignations();
  }, [currentPage, searchTerm, selectedDepartment]);

  useEffect(() => {
    loadDepartments();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      if (isDemoMode) {
        // Demo mode - simulate API response
        if (editingDesignation) {
          // Update existing designation
          const updatedDesignation = {
            ...editingDesignation,
            ...formData,
            updatedAt: new Date().toISOString()
          };
          setDesignations(prev => prev.map(desig => 
            desig._id === editingDesignation._id ? updatedDesignation : desig
          ));
          showDemoToast('Designation updated');
          handleCloseModal();
        } else {
          // Create new designation
          const newDesignation = {
            _id: `desig-${Date.now()}`,
            ...formData,
            isActive: true,
            createdAt: new Date().toISOString()
          };
          setDesignations(prev => [newDesignation, ...prev]);
          showDemoToast('Designation created');
          handleCloseModal();
        }
      } else {
        // Real API mode
        if (editingDesignation) {
          // Update existing designation
          const response = await designationAPI.update(editingDesignation._id, formData);
          if (response.success) {
            setDesignations(prev => prev.map(desig => 
              desig._id === editingDesignation._id ? response.data.designation : desig
            ));
            showSuccessToast(toastMessages.designationUpdateSuccess);
            handleCloseModal();
          } else {
            setError(response.message || 'Failed to update designation');
            showErrorToast(response.message || toastMessages.designationUpdateError);
          }
        } else {
          // Create new designation
          const response = await designationAPI.create(formData);
          if (response.success) {
            setDesignations(prev => [response.data.designation, ...prev]);
            showSuccessToast(toastMessages.designationCreateSuccess);
            handleCloseModal();
          } else {
            setError(response.message || 'Failed to create designation');
            showErrorToast(response.message || toastMessages.designationCreateError);
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

  // Handle delete designation
  const handleDelete = async (designationId: string) => {
    if (!window.confirm('Are you sure you want to delete this designation?')) {
      return;
    }

    try {
      if (isDemoMode) {
        // Demo mode - simulate deletion
        setDesignations(prev => prev.filter(desig => desig._id !== designationId));
        showDemoToast('Designation deleted');
      } else {
        // Real API mode
        const response = await designationAPI.delete(designationId);
        if (response.success) {
          setDesignations(prev => prev.filter(desig => desig._id !== designationId));
          showSuccessToast(toastMessages.designationDeleteSuccess);
        } else {
          setError(response.message || 'Failed to delete designation');
          showErrorToast(response.message || toastMessages.designationDeleteError);
        }
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete designation');
      showErrorToast(error.response?.data?.message || 'Failed to delete designation');
    }
  };

  // Handle edit designation
  const handleEdit = (designation: Designation) => {
    setEditingDesignation(designation);
    setFormData({
      title: designation.title,
      description: designation.description,
      level: designation.level,
      department: typeof designation.department === 'string' ? designation.department : designation.department._id
    });
    setShowCreateModal(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingDesignation(null);
    setFormData({ title: '', description: '', level: 1, department: '' });
    setError('');
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'level' ? parseInt(value) : value 
    }));
  };

  // Get department name by ID
  const getDepartmentName = (departmentId: string) => {
    const department = departments.find(dept => dept._id === departmentId);
    return department ? department.name : 'Unknown Department';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Designation Management</h1>
            <p className="text-gray-600">Manage job titles and roles within departments</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Designation</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search designations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Designations List */}
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
            <p className="text-gray-600">Loading designations...</p>
          </div>
        ) : designations.length === 0 ? (
          <div className="p-8 text-center">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No designations found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedDepartment ? 'Try adjusting your search terms.' : 'Get started by creating your first designation.'}
            </p>
            {!searchTerm && !selectedDepartment && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Create Designation
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
                      Designation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
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
                  {designations.map((designation) => (
                    <tr key={designation._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{designation.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {typeof designation.department === 'string' 
                              ? getDepartmentName(designation.department)
                              : designation.department.name
                            }
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                          Level {designation.level}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {designation.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          designation.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {designation.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(designation.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(designation)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(designation._id)}
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
                  {editingDesignation ? 'Edit Designation' : 'Create Designation'}
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
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Software Engineer, Manager"
                  required
                />
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                  Level *
                </label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                    <option key={level} value={level}>
                      Level {level}
                    </option>
                  ))}
                </select>
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
                  placeholder="Enter job description and responsibilities"
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
                  <span>{editingDesignation ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignationManagement;
