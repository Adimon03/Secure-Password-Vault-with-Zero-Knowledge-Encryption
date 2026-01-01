import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { vaultAPI, VaultEntry } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { encryptData, decryptData, generatePassword, VaultEntryData, EncryptedData } from '../utils/crypto';
import toast from 'react-hot-toast';

interface VaultEntryForm {
  title: string;
  website: string;
  username: string;
  password: string;
  notes?: string;
}

interface VaultEntryModalProps {
  entry?: VaultEntry | null;
  onClose: () => void;
  onSave: () => void;
}

export default function VaultEntryModal({ entry, onClose, onSave }: VaultEntryModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const masterPassword = useAuthStore((state) => state.masterPassword);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VaultEntryForm>();

  const passwordValue = watch('password');

  useEffect(() => {
    if (entry && masterPassword) {
      try {
        const encryptedData: EncryptedData = JSON.parse(entry.encrypted_data);
        const decryptedData = decryptData(encryptedData, masterPassword);
        
        setValue('title', entry.title);
        setValue('website', decryptedData.website);
        setValue('username', decryptedData.username);
        setValue('password', decryptedData.password);
        setValue('notes', decryptedData.notes || '');
      } catch (error) {
        toast.error('Failed to decrypt entry data');
      }
    }
  }, [entry, masterPassword, setValue]);

  const onSubmit = async (data: VaultEntryForm) => {
    if (!masterPassword) {
      toast.error('Master password not available');
      return;
    }

    setIsLoading(true);
    try {
      const vaultData: VaultEntryData = {
        website: data.website,
        username: data.username,
        password: data.password,
        notes: data.notes,
      };

      const encryptedData = encryptData(vaultData, masterPassword);
      const payload = {
        title: data.title,
        encrypted_data: JSON.stringify(encryptedData),
      };

      if (entry) {
        await vaultAPI.updateEntry(entry.id, payload);
        toast.success('Entry updated successfully');
      } else {
        await vaultAPI.createEntry(payload);
        toast.success('Entry created successfully');
      }

      onSave();
    } catch (error) {
      toast.error(entry ? 'Failed to update entry' : 'Failed to create entry');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword(16);
    setValue('password', newPassword);
    toast.success('Password generated');
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {entry ? 'Edit Entry' : 'Add New Entry'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              {...register('title', { required: 'Title is required' })}
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="e.g., Gmail Account"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">
              Website
            </label>
            <input
              {...register('website', { required: 'Website is required' })}
              type="url"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="https://example.com"
            />
            {errors.website && (
              <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username/Email
            </label>
            <input
              {...register('username', { required: 'Username is required' })}
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="username or email"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative">
              <input
                {...register('password', { required: 'Password is required' })}
                type={showPassword ? 'text' : 'password'}
                className="block w-full px-3 py-2 pr-20 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm font-mono"
                placeholder="Enter password"
              />
              <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="text-gray-400 hover:text-gray-600"
                  title="Generate password"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
            {passwordValue && (
              <div className="mt-1 text-xs text-gray-500">
                Password strength: {passwordValue.length >= 12 ? 'Strong' : passwordValue.length >= 8 ? 'Medium' : 'Weak'}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes (optional)
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : entry ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}