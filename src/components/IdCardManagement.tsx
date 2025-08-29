import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  Loader2,
  Filter,
  ChevronLeft,
  ChevronRight,
  Building2,
  Briefcase,
  Camera,
  Eye,
  Download
} from 'lucide-react';
import { idCardAPI, departmentAPI, designationAPI } from '../services/api';
import { IdCard, CreateIdCardRequest, UpdateIdCardRequest, Address } from '../types/idCard';
import { Department, Designation } from '../types/department';
import { useAuth } from '../hooks/useAuth';
import { showSuccessToast, showErrorToast, showDemoToast, toastMessages } from '../utils/toast';
import { getEmployeePictureUrl, generateEmployeePictureFilename, getEmployeePicturePath } from '../utils/imageUtils';
import { generateIdCardPDF } from '../utils/pdfGenerator';

const IdCardManagement: React.FC = () => {
  const { isDemoMode, demoDepartments, demoDesignations, demoIdCards } = useAuth();
  const [idCards, setIdCards] = useState<IdCard[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployeeType, setSelectedEmployeeType] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingIdCard, setEditingIdCard] = useState<IdCard | null>(null);
  const [viewingIdCard, setViewingIdCard] = useState<IdCard | null>(null);
  const [formData, setFormData] = useState({
    employeePicture: undefined as File | undefined,
    employeeType: 'full-time' as 'full-time' | 'part-time' | 'contract' | 'intern' | 'temporary',
    fullName: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    bloodGroup: 'A+' as 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-',
    mobileNumber: '',
    email: '',
    dateOfBirth: '',
    dateOfJoining: '',
    department: '',
    designation: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  // Load ID cards
  const loadIdCards = async () => {
    try {
      setLoading(true);
      
      if (isDemoMode) {
        // Use demo data
        let filteredIdCards = demoIdCards;
        
        // Apply employee type filter
        if (selectedEmployeeType) {
          filteredIdCards = demoIdCards.filter(card =>
            card.employeeType === selectedEmployeeType
          );
        }
        
        // Apply department filter
        if (selectedDepartment) {
          filteredIdCards = filteredIdCards.filter(card =>
            card.department === selectedDepartment
          );
        }
        
        // Apply search filter
        if (searchTerm) {
          filteredIdCards = filteredIdCards.filter(card =>
            card.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            card.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            card.idCardNumber.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        // Apply pagination
        const startIndex = (currentPage - 1) * 10;
        const endIndex = startIndex + 10;
        const paginatedIdCards = filteredIdCards.slice(startIndex, endIndex);
        
        setIdCards(paginatedIdCards);
        setTotalPages(Math.ceil(filteredIdCards.length / 10));
      } else {
        // Use real API
        const response = await idCardAPI.getAll({
          page: currentPage,
          limit: 10,
          search: searchTerm || undefined,
          employeeType: selectedEmployeeType || undefined,
          department: selectedDepartment || undefined,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        });
        
        if (response.success) {
          setIdCards(response.data.idCards);
          setTotalPages(response.data.pagination.totalPages);
        }
      }
    } catch (error: any) {
      setError('Failed to load ID cards');
      showErrorToast(toastMessages.idCardLoadError);
      console.error('Error loading ID cards:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load departments and designations for dropdowns
  const loadDropdownData = async () => {
    try {
      if (isDemoMode) {
        // Use demo data
        setDepartments(demoDepartments);
        setDesignations(demoDesignations);
      } else {
        // Use real API
        const [deptResponse, desigResponse] = await Promise.all([
          departmentAPI.getActive(),
          designationAPI.getActive()
        ]);
        
        if (deptResponse.success) {
          setDepartments(deptResponse.data.departments);
        }
        if (desigResponse.success) {
          setDesignations(desigResponse.data.designations);
        }
      }
    } catch (error) {
      console.error('Error loading dropdown data:', error);
    }
  };

  useEffect(() => {
    loadIdCards();
  }, [currentPage, searchTerm, selectedEmployeeType, selectedDepartment]);

  useEffect(() => {
    loadDropdownData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      if (!formData.employeePicture && !editingIdCard) {
        setError('Employee picture is required');
        return;
      }

      if (isDemoMode) {
        // Demo mode - simulate API response
                       if (editingIdCard) {
                 // Update existing ID card
                 const updatedIdCard: IdCard = {
                   ...editingIdCard,
                   employeePicture: formData.employeePicture 
                     ? getEmployeePicturePath(generateEmployeePictureFilename(formData.employeePicture.name))
                     : editingIdCard.employeePicture,
                   employeeType: formData.employeeType,
            fullName: formData.fullName,
            address: formData.address,
            bloodGroup: formData.bloodGroup,
            mobileNumber: formData.mobileNumber,
            email: formData.email,
            dateOfBirth: formData.dateOfBirth,
            dateOfJoining: formData.dateOfJoining,
            department: formData.department,
            designation: formData.designation,
            updatedAt: new Date().toISOString()
          };
          setIdCards(prev => prev.map(card => 
            card._id === editingIdCard._id ? updatedIdCard : card
          ));
          showDemoToast('ID Card updated');
          handleCloseModal();
        } else {
                           // Create new ID card
                 const newIdCard: IdCard = {
                   _id: `idcard-${Date.now()}`,
                   idCardNumber: `EMP${String(demoIdCards.length + 1).padStart(3, '0')}`,
                   employeePicture: formData.employeePicture 
                     ? getEmployeePicturePath(generateEmployeePictureFilename(formData.employeePicture.name))
                     : '',
                   employeeType: formData.employeeType,
            fullName: formData.fullName,
            address: formData.address,
            bloodGroup: formData.bloodGroup,
            mobileNumber: formData.mobileNumber,
            email: formData.email,
            dateOfBirth: formData.dateOfBirth,
            dateOfJoining: formData.dateOfJoining,
            department: formData.department,
            designation: formData.designation,
            isActive: true,
            createdAt: new Date().toISOString()
          };
          setIdCards(prev => [newIdCard, ...prev]);
          showDemoToast('ID Card created');
          handleCloseModal();
        }
      } else {
        // Real API mode
        if (editingIdCard) {
          // Update existing ID card
          const response = await idCardAPI.update(editingIdCard._id, formData);
          if (response.success) {
            setIdCards(prev => prev.map(card => 
              card._id === editingIdCard._id ? response.data.idCard : card
            ));
            showSuccessToast(toastMessages.idCardUpdateSuccess);
            handleCloseModal();
          } else {
            setError(response.message || 'Failed to update ID card');
            showErrorToast(response.message || toastMessages.idCardUpdateError);
          }
        } else {
          // Create new ID card
          const response = await idCardAPI.create(formData as CreateIdCardRequest);
          if (response.success) {
            setIdCards(prev => [response.data.idCard, ...prev]);
            showSuccessToast(toastMessages.idCardCreateSuccess);
            handleCloseModal();
          } else {
            setError(response.message || 'Failed to create ID card');
            showErrorToast(response.message || toastMessages.idCardCreateError);
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

  // Handle delete ID card
  const handleDelete = async (idCardId: string) => {
    if (!window.confirm('Are you sure you want to delete this ID card?')) {
      return;
    }

    try {
      if (isDemoMode) {
        // Demo mode - simulate deletion
        setIdCards(prev => prev.filter(card => card._id !== idCardId));
        showDemoToast('ID Card deleted');
      } else {
        // Real API mode
        const response = await idCardAPI.delete(idCardId);
        if (response.success) {
          setIdCards(prev => prev.filter(card => card._id !== idCardId));
          showSuccessToast(toastMessages.idCardDeleteSuccess);
        } else {
          setError(response.message || 'Failed to delete ID card');
          showErrorToast(response.message || toastMessages.idCardDeleteError);
        }
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete ID card');
      showErrorToast(error.response?.data?.message || 'Failed to delete ID card');
    }
  };

  // Handle edit ID card
  const handleEdit = (idCard: IdCard) => {
    setEditingIdCard(idCard);
    
    // Convert ISO dates to YYYY-MM-DD format for date inputs
    const formatDateForInput = (isoDate: string) => {
      if (!isoDate) return '';
      return new Date(isoDate).toISOString().split('T')[0];
    };
    
    setFormData({
      employeePicture: undefined,
      employeeType: idCard.employeeType,
      fullName: idCard.fullName,
      address: idCard.address,
      bloodGroup: idCard.bloodGroup,
      mobileNumber: idCard.mobileNumber,
      email: idCard.email,
      dateOfBirth: formatDateForInput(idCard.dateOfBirth),
      dateOfJoining: formatDateForInput(idCard.dateOfJoining),
      department: typeof idCard.department === 'string' ? idCard.department : idCard.department._id,
      designation: typeof idCard.designation === 'string' ? idCard.designation : idCard.designation._id
    });
    setShowCreateModal(true);
  };

  // Handle view ID card
  const handleView = (idCard: IdCard) => {
    setViewingIdCard(idCard);
    setShowViewModal(true);
  };

  // Handle generate ID card PDF
  const handleGenerateIdCard = async (idCard: IdCard) => {
    try {
      const result = await generateIdCardPDF(idCard, departments, designations);
      if (result.success) {
        showSuccessToast(toastMessages.idCardGenerateSuccess);
      } else {
        showErrorToast(result.error || toastMessages.idCardGenerateError);
      }
    } catch (error) {
      console.error('Error generating ID card:', error);
      showErrorToast(toastMessages.idCardGenerateError);
    }
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowCreateModal(false);
    setShowViewModal(false);
    setEditingIdCard(null);
    setViewingIdCard(null);
    setFormData({
      employeePicture: undefined,
      employeeType: 'full-time',
      fullName: '',
      address: { street: '', city: '', state: '', zipCode: '', country: '' },
      bloodGroup: 'A+',
      mobileNumber: '',
      email: '',
      dateOfBirth: '',
      dateOfJoining: '',
      department: '',
      designation: ''
    });
    setError('');
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, employeePicture: file }));
    }
  };

  // Get department name by ID
  const getDepartmentName = (departmentId: string) => {
    const department = departments.find(dept => dept._id === departmentId);
    return department ? department.name : 'Unknown Department';
  };

  // Get designation name by ID
  const getDesignationName = (designationId: string) => {
    const designation = designations.find(desig => desig._id === designationId);
    return designation ? designation.title : 'Unknown Designation';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">ID Card Management</h1>
            <p className="text-gray-600">Manage employee ID cards and information</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create ID Card</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search ID cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <select
              value={selectedEmployeeType}
              onChange={(e) => setSelectedEmployeeType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Employee Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="intern">Intern</option>
              <option value="temporary">Temporary</option>
            </select>
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

      {/* ID Cards List */}
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
            <p className="text-gray-600">Loading ID cards...</p>
          </div>
        ) : idCards.length === 0 ? (
          <div className="p-8 text-center">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No ID cards found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedEmployeeType || selectedDepartment ? 'Try adjusting your search terms.' : 'Get started by creating your first ID card.'}
            </p>
            {!searchTerm && !selectedEmployeeType && !selectedDepartment && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Create ID Card
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
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID Card Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {idCards.map((idCard) => (
                    <tr key={idCard._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                                                     <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                             <img
                               src={getEmployeePictureUrl(idCard.employeePicture)}
                               alt={idCard.fullName}
                               className="w-full h-full object-cover"
                               onError={(e) => {
                                 e.currentTarget.src = 'https://via.placeholder.com/150x150?text=Photo';
                               }}
                             />
                           </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{idCard.fullName}</div>
                            <div className="text-sm text-gray-500">{idCard.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {idCard.idCardNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {typeof idCard.department === 'string' 
                              ? getDepartmentName(idCard.department)
                              : idCard.department.name
                            }
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          idCard.employeeType === 'full-time' ? 'bg-green-100 text-green-800' :
                          idCard.employeeType === 'part-time' ? 'bg-yellow-100 text-yellow-800' :
                          idCard.employeeType === 'contract' ? 'bg-purple-100 text-purple-800' :
                          idCard.employeeType === 'intern' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {idCard.employeeType.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{idCard.mobileNumber}</div>
                        <div className="text-sm text-gray-500">{idCard.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          idCard.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {idCard.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                                             <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                         <div className="flex items-center justify-end space-x-2">
                           <button
                             onClick={() => handleView(idCard)}
                             className="text-green-600 hover:text-green-900 p-1"
                             title="View"
                           >
                             <Eye className="w-4 h-4" />
                           </button>
                           <button
                             onClick={() => handleGenerateIdCard(idCard)}
                             className="text-purple-600 hover:text-purple-900 p-1"
                             title="Generate ID Card"
                           >
                             <Download className="w-4 h-4" />
                           </button>
                           <button
                             onClick={() => handleEdit(idCard)}
                             className="text-blue-600 hover:text-blue-900 p-1"
                             title="Edit"
                           >
                             <Edit className="w-4 h-4" />
                           </button>
                           <button
                             onClick={() => handleDelete(idCard._id)}
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
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingIdCard ? 'Edit ID Card' : 'Create ID Card'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Employee Picture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Picture {!editingIdCard && '*'}
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                    {formData.employeePicture ? (
                      <img
                        src={URL.createObjectURL(formData.employeePicture)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                                         ) : editingIdCard ? (
                       <img
                         src={getEmployeePictureUrl(editingIdCard.employeePicture)}
                         alt="Current"
                         className="w-full h-full object-cover"
                       />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="employeeType" className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Type *
                  </label>
                  <select
                    id="employeeType"
                    name="employeeType"
                    value={formData.employeeType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="intern">Intern</option>
                    <option value="temporary">Temporary</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter mobile number"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Group *
                  </label>
                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="dateOfJoining" className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Joining *
                  </label>
                  <input
                    type="date"
                    id="dateOfJoining"
                    name="dateOfJoining"
                    value={formData.dateOfJoining}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-2">
                    Designation *
                  </label>
                  <select
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Designation</option>
                    {designations.map((desig) => (
                      <option key={desig._id} value={desig._id}>
                        {desig.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-2">
                      Street *
                    </label>
                    <input
                      type="text"
                      id="address.street"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter street address"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      id="address.city"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter city"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="address.state" className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      id="address.state"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter state"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      id="address.zipCode"
                      name="address.zipCode"
                      value={formData.address.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter ZIP code"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="address.country" className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      id="address.country"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter country"
                      required
                    />
                  </div>
                </div>
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
                  <span>{editingIdCard ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewingIdCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">ID Card Details</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center space-x-6 mb-6">
                                 <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden">
                   <img
                     src={getEmployeePictureUrl(viewingIdCard.employeePicture)}
                     alt={viewingIdCard.fullName}
                     className="w-full h-full object-cover"
                     onError={(e) => {
                       e.currentTarget.src = 'https://via.placeholder.com/150x150?text=Photo';
                     }}
                   />
                 </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{viewingIdCard.fullName}</h3>
                  <p className="text-lg text-gray-600">{viewingIdCard.idCardNumber}</p>
                  <p className="text-gray-500">{viewingIdCard.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Employee Type</label>
                      <p className="text-gray-900">{viewingIdCard.employeeType.replace('-', ' ')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Blood Group</label>
                      <p className="text-gray-900">{viewingIdCard.bloodGroup}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
                      <p className="text-gray-900">{new Date(viewingIdCard.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Date of Joining</label>
                      <p className="text-gray-900">{new Date(viewingIdCard.dateOfJoining).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Mobile Number</label>
                      <p className="text-gray-900">{viewingIdCard.mobileNumber}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Work Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Department</label>
                      <p className="text-gray-900">
                        {typeof viewingIdCard.department === 'string' 
                          ? getDepartmentName(viewingIdCard.department)
                          : viewingIdCard.department.name
                        }
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Designation</label>
                      <p className="text-gray-900">
                        {typeof viewingIdCard.designation === 'string' 
                          ? getDesignationName(viewingIdCard.designation)
                          : viewingIdCard.designation.title
                        }
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        viewingIdCard.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {viewingIdCard.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Address</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900">
                      {viewingIdCard.address.street}<br />
                      {viewingIdCard.address.city}, {viewingIdCard.address.state} {viewingIdCard.address.zipCode}<br />
                      {viewingIdCard.address.country}
                    </p>
                  </div>
                </div>
              </div>

                             <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                 <button
                   onClick={() => handleGenerateIdCard(viewingIdCard)}
                   className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                 >
                   <Download className="w-4 h-4" />
                   <span>Generate ID Card</span>
                 </button>
                 <button
                   onClick={() => {
                     setShowViewModal(false);
                     handleEdit(viewingIdCard);
                   }}
                   className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                 >
                   <Edit className="w-4 h-4" />
                   <span>Edit</span>
                 </button>
                 <button
                   onClick={handleCloseModal}
                   className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                 >
                   Close
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdCardManagement;
