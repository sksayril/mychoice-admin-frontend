import React, { useState } from 'react';
import { User, Edit, Lock, Save, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Profile: React.FC = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateProfile({
        fullName: profileData.fullName,
        email: profileData.email,
      });

      if (result.success) {
        setIsEditing(false);
      }
    } catch (error) {
      // Error is handled by the updateProfile function with toast
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return;
    }

    if (passwordData.newPassword.length < 6) {
      return;
    }

    setLoading(true);

    try {
      const result = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (result.success) {
        setIsChangingPassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      // Error is handled by the changePassword function with toast
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setProfileData({
      fullName: user?.fullName || '',
      email: user?.email || '',
    });
  };

  const cancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <User className="w-6 h-6 mr-2 text-blue-600" />
            Profile Settings
          </h1>
        </div>



        {/* Profile Information */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Profile Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit Profile
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                  <p className="text-gray-800">{user?.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <p className="text-gray-800">{user?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
                  <p className="text-gray-800 capitalize">{user?.role}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Member Since</label>
                  <p className="text-gray-800">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProfileSubmit} className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-700 font-medium"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-1" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Change Password */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Security</h2>
            {!isChangingPassword && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                <Lock className="w-4 h-4 mr-1" />
                Change Password
              </button>
            )}
          </div>

          {isChangingPassword && (
            <form onSubmit={handlePasswordSubmit} className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-600 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-600 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={cancelPasswordChange}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-700 font-medium"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium disabled:opacity-50"
                >
                  <Lock className="w-4 h-4 mr-1" />
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
