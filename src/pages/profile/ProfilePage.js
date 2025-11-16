import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Wallet,
  Edit3,
  Save,
  X,
  Lock,
  CheckCircle,
  AlertCircle,
  Copy,
  Award,
  Camera,
  Upload,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/auth';
import { Button, Input } from '../../components';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user: authUser, updateProfile: updateUserProfile } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await authService.getProfile();
      if (response.success) {
        setUser(response.user);
        setAvatarPreview(response.user?.avatar || null);
        reset({
          fullName: response.user.fullName || '',
          email: response.user.email || '',
          phone: response.user.phone || '',
          walletInfo: response.user.walletInfo || '',
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(false);
    setAvatarFile(null);
    setAvatarPreview(user?.avatar || null);
    reset({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      walletInfo: user?.walletInfo || '',
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setAvatarFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(false);

      // Create FormData if avatar file is selected
      let formData;
      if (avatarFile) {
        formData = new FormData();
        formData.append('avatar', avatarFile);
        formData.append('fullName', data.fullName);
        formData.append('phone', data.phone);
        formData.append('walletInfo', data.walletInfo || '');
      }

      const response = await authService.updateProfile(avatarFile ? formData : data);
      if (response.success) {
        setUser(response.user);
        setAvatarPreview(response.user?.avatar || null);
        setAvatarFile(null);
        // Update user in AuthContext
        if (updateUserProfile) {
          updateUserProfile(response.user);
        }
        setIsEditing(false);
        setSuccess(true);
        toast.success('Profile updated successfully!');
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('All password fields are required');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setChangingPassword(true);
      setError(null);
      setSuccess(false);

      const response = await authService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      if (response.success) {
        setSuccess(true);
        setShowChangePassword(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        toast.success('Password changed successfully!');
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.message || 'Failed to change password');
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{error || 'User not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Profile
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            View and manage your account information
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 sm:p-6 md:p-8"
            >
              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6"
                >
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <p className="text-green-700 dark:text-green-400">
                      Profile updated successfully!
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
                >
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <p className="text-red-700 dark:text-red-400">{error}</p>
                  </div>
                </motion.div>
              )}

              {/* Profile Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="relative">
                    {avatarPreview || user.avatar ? (
                      <img
                        src={avatarPreview || user.avatar}
                        alt={user.fullName || 'User'}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-indigo-500 dark:border-indigo-400"
                      />
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold border-2 border-indigo-500 dark:border-indigo-400">
                        {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-1.5 sm:p-2 cursor-pointer shadow-lg transition-colors">
                        <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                      {user.fullName || 'User'}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate break-all">
                      {user.email}
                    </p>
                  </div>
                </div>
                {!isEditing && (
                  <Button
                    onClick={handleEdit}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </Button>
                )}
              </div>

              {/* Profile Form */}
              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                  <Input
                    label="Full Name"
                    type="text"
                    leftIcon={<User className="w-5 h-5" />}
                    error={errors.fullName?.message}
                    {...register('fullName', {
                      required: 'Full name is required',
                      minLength: {
                        value: 2,
                        message: 'Full name must be at least 2 characters',
                      },
                    })}
                  />

                  <Input
                    label="Email"
                    type="email"
                    leftIcon={<Mail className="w-5 h-5" />}
                    error={errors.email?.message}
                    disabled
                    className="bg-gray-100 dark:bg-gray-700"
                    {...register('email', {
                      required: 'Email is required',
                    })}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2">
                    Email cannot be changed
                  </p>

                  <Input
                    label="Phone"
                    type="tel"
                    leftIcon={<Phone className="w-5 h-5" />}
                    error={errors.phone?.message}
                    {...register('phone', {
                      required: 'Phone is required',
                      minLength: {
                        value: 10,
                        message: 'Phone must be at least 10 characters',
                      },
                    })}
                  />

                  <Input
                    label="Wallet Info"
                    type="text"
                    leftIcon={<Wallet className="w-5 h-5" />}
                    error={errors.walletInfo?.message}
                    placeholder="Enter your wallet address (optional)"
                    {...register('walletInfo', {
                      required: false,
                    })}
                  />

                  <div className="flex items-center gap-3 pt-4">
                    <Button
                      type="submit"
                      loading={submitting}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white flex-1"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancel}
                      className="flex items-center gap-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600 flex-1"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Full Name
                      </p>
                      <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                        {user.fullName || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Email
                      </p>
                      <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                        {user.email || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Phone
                      </p>
                      <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                        {user.phone || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Referral Code
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm sm:text-base font-mono font-semibold text-gray-900 dark:text-white">
                          {user.refCode || 'N/A'}
                        </p>
                        {user.refCode && (
                          <button
                            onClick={() => copyToClipboard(user.refCode)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded transition-colors"
                          >
                            <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {user.walletInfo && (
                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Wallet Info
                      </p>
                      <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white break-all">
                        {user.walletInfo}
                      </p>
                    </div>
                  )}

                  {/* Change Password Section */}
                  <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Change Password
                    </h3>
                    {!showChangePassword ? (
                      <Button
                        onClick={() => setShowChangePassword(true)}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Lock className="w-4 h-4" />
                        Change Password
                      </Button>
                    ) : (
                      <div className="space-y-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
                        <Input
                          label="Current Password"
                          type="password"
                          leftIcon={<Lock className="w-5 h-5" />}
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, currentPassword: e.target.value })
                          }
                        />
                        <Input
                          label="New Password"
                          type="password"
                          leftIcon={<Lock className="w-5 h-5" />}
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, newPassword: e.target.value })
                          }
                        />
                        <Input
                          label="Confirm New Password"
                          type="password"
                          leftIcon={<Lock className="w-5 h-5" />}
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                          }
                        />
                        <div className="flex items-center gap-3">
                          <Button
                            onClick={handleChangePassword}
                            loading={changingPassword}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                          >
                            <Save className="w-4 h-4" />
                            Update Password
                          </Button>
                          <Button
                            onClick={() => {
                              setShowChangePassword(false);
                              setPasswordData({
                                currentPassword: '',
                                newPassword: '',
                                confirmPassword: '',
                              });
                              setError(null);
                            }}
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar Stats */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Account Stats */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Account Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Rank</span>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {user.rank || 'No Rank'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Team Count</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {user.teamCount || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Investment</span>
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      ${(user.totalInvestment || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</span>
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      ${(user.totalEarnings || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Available Balance</span>
                    <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                      ${(user.availableBalance || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

