import React, { useState, useEffect } from 'react';
import { Search, Plus, Phone, Mail, MapPin, Filter, Users, X, Calendar, Globe, Monitor, RefreshCw } from 'lucide-react';
import { contactAPI } from '../services/api';
import { Contact } from '../types/contact';
import { showSuccessToast, showErrorToast, showLoadingToast } from '../utils/toast';
import toast from 'react-hot-toast';

const MyLeads: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'new' | 'read' | 'replied' | 'closed' | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    read: 0,
    replied: 0,
    closed: 0
  });

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc' as const
      };

      console.log('Fetching contacts with params:', params);
      const response = await contactAPI.getAll(params);
      console.log('Contacts API response:', response);
      
      setContacts(response.data.contacts);
      setTotalPages(response.data.pagination.totalPages);
      
      // Refresh stats after loading contacts
      await fetchStats();
      
      // Also calculate stats from loaded contacts as fallback
      const calculatedStats = {
        total: response.data.contacts.length,
        new: response.data.contacts.filter((c: Contact) => c.status === 'new').length,
        read: response.data.contacts.filter((c: Contact) => c.status === 'read').length,
        replied: response.data.contacts.filter((c: Contact) => c.status === 'replied').length,
        closed: response.data.contacts.filter((c: Contact) => c.status === 'closed').length
      };
      
      // Update stats if the API stats are all zeros
      if (stats.total === 0 && stats.new === 0 && stats.read === 0 && stats.replied === 0 && stats.closed === 0) {
        setStats(calculatedStats);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      showErrorToast('Failed to load contacts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      console.log('Fetching contact statistics...');
      const response = await contactAPI.getStats();
      console.log('Stats API response:', response);
      
      // Update stats based on the actual API response structure
      if (response && response.data) {
        const statsData = {
          total: response.data.total || 0,
          new: response.data.new || 0,
          read: response.data.read || 0,
          replied: response.data.replied || 0,
          closed: response.data.closed || 0
        };
        console.log('Setting stats:', statsData);
        setStats(statsData);
      } else {
        console.warn('No stats data received from API');
        // Set default stats if API doesn't return data
        setStats({
          total: contacts.length,
          new: contacts.filter((c: Contact) => c.status === 'new').length,
          read: contacts.filter((c: Contact) => c.status === 'read').length,
          replied: contacts.filter((c: Contact) => c.status === 'replied').length,
          closed: contacts.filter((c: Contact) => c.status === 'closed').length
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set stats based on current contacts if API fails
      setStats({
        total: contacts.length,
        new: contacts.filter((c: Contact) => c.status === 'new').length,
        read: contacts.filter((c: Contact) => c.status === 'read').length,
        replied: contacts.filter((c: Contact) => c.status === 'replied').length,
        closed: contacts.filter((c: Contact) => c.status === 'closed').length
      });
    }
  };

  // Update contact status
  const updateContactStatus = async (contactId: string, newStatus: string) => {
    try {
      const loadingToast = showLoadingToast('Updating status...');
      await contactAPI.updateStatus(contactId, { status: newStatus as any });
      toast.dismiss(loadingToast);
      showSuccessToast('Status updated successfully!');
      fetchContacts(); // Refresh the list
    } catch (error) {
      console.error('Error updating status:', error);
      showErrorToast('Failed to update status. Please try again.');
    }
  };

  // Show delete confirmation
  const showDeleteConfirmation = (contact: Contact) => {
    setContactToDelete(contact);
    setShowDeleteModal(true);
  };

  // Delete contact
  const deleteContact = async () => {
    if (!contactToDelete) return;

    try {
      const loadingToast = showLoadingToast('Deleting contact...');
      await contactAPI.delete(contactToDelete._id);
      toast.dismiss(loadingToast);
      showSuccessToast('Contact deleted successfully!');
      
      // Close modal and refresh data
      setShowDeleteModal(false);
      setContactToDelete(null);
      fetchContacts(); // Refresh the list
    } catch (error) {
      console.error('Error deleting contact:', error);
      showErrorToast('Failed to delete contact. Please try again.');
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchContacts();
    }
  }, [searchTerm, statusFilter]);

  // Refetch when page changes
  useEffect(() => {
    if (currentPage > 0) {
      fetchContacts();
    }
  }, [currentPage]);

  // Handle keyboard shortcuts for modals
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showViewModal) {
          setShowViewModal(false);
          setSelectedContact(null);
        }
        if (showDeleteModal) {
          setShowDeleteModal(false);
          setContactToDelete(null);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showViewModal, showDeleteModal]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'read': return 'bg-yellow-100 text-yellow-700';
      case 'replied': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Contact Management</h1>
            <p className="text-gray-600">Manage and track contact form submissions</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={async () => {
                setRefreshing(true);
                try {
                  await fetchContacts();
                  await fetchStats();
                  showSuccessToast('Data refreshed successfully!');
                } catch (error) {
                  console.error('Error refreshing data:', error);
                } finally {
                  setRefreshing(false);
                }
              }}
              disabled={refreshing}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          <button className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Plus className="w-4 h-4" />
              <span>Export Contacts</span>
          </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search contacts by name, email address, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="closed">Closed</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Contacts</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-sky-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New</p>
              <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-yellow-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Read</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.read}</p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Replied</p>
              <p className="text-2xl font-bold text-green-600">{stats.replied}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Closed</p>
              <p className="text-2xl font-bold text-gray-600">{stats.closed}</p>
            </div>
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Contacts Grid */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading contacts...</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {contacts.map((contact) => (
            <div key={contact._id} className="bg-white rounded-xl shadow-sm border border-sky-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                  <h3 className="text-lg font-semibold text-gray-800">{contact.fullName}</h3>
                  <p className="text-gray-600 text-sm">{formatDate(contact.createdAt)}</p>
              </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                  {contact.status}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail className="w-4 h-4 text-sky-500" />
                  <span className="text-sm">{contact.emailAddress}</span>
              </div>
                {contact.mobileNumber && (
              <div className="flex items-center space-x-3 text-gray-600">
                <Phone className="w-4 h-4 text-sky-500" />
                    <span className="text-sm">{contact.mobileNumber}</span>
              </div>
                )}
                <div className="text-gray-600">
                  <p className="text-sm font-medium mb-1">{contact.subject}</p>
                  <p className="text-sm text-gray-500 line-clamp-2">{contact.message}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="space-x-2">
                  <select
                    value={contact.status}
                    onChange={(e) => updateContactStatus(contact._id, e.target.value)}
                    className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              <div className="space-x-2">
                  <button 
                    onClick={() => showDeleteConfirmation(contact)}
                    className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200 transition-colors"
                  >
                    Delete
                </button>
                  <button 
                    onClick={() => {
                      setSelectedContact(contact);
                      setShowViewModal(true);
                    }}
                    className="px-3 py-1 bg-sky-100 text-sky-600 rounded-lg text-sm hover:bg-sky-200 transition-colors"
                  >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Page {currentPage} of {totalPages} • {contacts.length} contacts
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-sky-100 text-sky-600 rounded-lg text-sm hover:bg-sky-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-sky-100 text-sky-600 rounded-lg text-sm hover:bg-sky-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {contacts.length === 0 && !loading && (
        <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No contacts found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or check back later for new submissions.</p>
        </div>
      )}

            {/* Contact View Modal */}
      {showViewModal && selectedContact && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowViewModal(false);
            setSelectedContact(null);
          }}
        >
          <div 
            className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Contact Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                    <p className="text-gray-800">{selectedContact.fullName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                    <p className="text-gray-800">{selectedContact.emailAddress}</p>
                  </div>
                  {selectedContact.mobileNumber && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Mobile Number</label>
                      <p className="text-gray-800">{selectedContact.mobileNumber}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedContact.status)}`}>
                      {selectedContact.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Message Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Subject</label>
                    <p className="text-gray-800">{selectedContact.subject}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Message</label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-800 whitespace-pre-wrap">{selectedContact.message}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Technical Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">IP Address</label>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-800">{selectedContact.ipAddress || 'Not available'}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">User Agent</label>
                    <div className="flex items-center space-x-2">
                      <Monitor className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-800 text-sm truncate" title={selectedContact.userAgent}>
                        {selectedContact.userAgent || 'Not available'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Timestamps</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Created At</label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-800">{formatDate(selectedContact.createdAt)}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Last Updated</label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-800">{formatDate(selectedContact.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Mark as read if status is new
                  if (selectedContact.status === 'new') {
                    updateContactStatus(selectedContact._id, 'read');
                  }
                  setShowViewModal(false);
                }}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
              >
                {selectedContact.status === 'new' ? 'Mark as Read' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && contactToDelete && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowDeleteModal(false);
            setContactToDelete(null);
          }}
        >
                    <div 
            className="bg-white rounded-xl shadow-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Delete Contact</h2>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setContactToDelete(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{contactToDelete.fullName}</h3>
                  <p className="text-sm text-gray-600">{contactToDelete.emailAddress}</p>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-red-600 text-xs font-bold">!</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-red-800 mb-1">Warning</h4>
                    <p className="text-sm text-red-700">
                      Are you sure you want to delete this contact? This action cannot be undone and will permanently remove the contact from the system.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p><strong>Subject:</strong> {contactToDelete.subject}</p>
                  <p><strong>Status:</strong> 
                    <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contactToDelete.status)}`}>
                      {contactToDelete.status}
                    </span>
                  </p>
                  <p><strong>Created:</strong> {formatDate(contactToDelete.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setContactToDelete(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteContact}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>Delete Contact</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLeads;