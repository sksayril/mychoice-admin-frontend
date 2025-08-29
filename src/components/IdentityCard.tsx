import React from 'react';
import { CreditCard, Edit, Download, Share2, Calendar, MapPin } from 'lucide-react';

const IdentityCard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Identity Card</h1>
            <p className="text-gray-600">Manage your digital identity and credentials</p>
          </div>
          <div className="flex space-x-2">
            <button className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Identity Card Display */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl shadow-2xl overflow-hidden">
          {/* Card Header */}
          <div className="bg-white bg-opacity-10 p-6 border-b border-white border-opacity-20">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold text-xl">Mychoice</h2>
              <CreditCard className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Card Content */}
          <div className="p-8 text-white">
            <div className="flex items-start space-x-6">
              {/* Profile Image */}
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold">AU</span>
              </div>
              
              {/* Profile Info */}
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-2xl font-bold">Admin User</h3>
                  <p className="text-sky-100">System Administrator</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Member since: January 2025</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">New York, USA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="mt-8 pt-6 border-t border-white border-opacity-20 flex justify-between items-center">
              <div>
                <p className="text-xs text-sky-100">ID Number</p>
                <p className="font-mono text-sm">MC-2025-001</p>
              </div>
              <div>
                <p className="text-xs text-sky-100">Valid Until</p>
                <p className="text-sm">Dec 31, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Full Name</label>
              <p className="text-gray-800">Admin User</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-800">admin@mychoice.com</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <p className="text-gray-800">+1 (555) 123-4567</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Department</label>
              <p className="text-gray-800">Administration</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors">
              <Share2 className="w-5 h-5 text-sky-600" />
              <span className="font-medium text-sky-700">Share Digital Card</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors">
              <Download className="w-5 h-5 text-emerald-600" />
              <span className="font-medium text-emerald-700">Export as PDF</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <Edit className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-700">Update Information</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentityCard;