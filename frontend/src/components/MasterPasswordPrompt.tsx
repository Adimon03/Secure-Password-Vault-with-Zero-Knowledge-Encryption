import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

interface MasterPasswordForm {
  masterPassword: string;
}

export default function MasterPasswordPrompt() {
  const [showPassword, setShowPassword] = useState(false);
  const setMasterPassword = useAuthStore((state) => state.setMasterPassword);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MasterPasswordForm>();

  const onSubmit = (data: MasterPasswordForm) => {
    setMasterPassword(data.masterPassword);
    toast.success('Master password set for this session');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* RGB Breathing Watermark */}
      <div className="absolute top-4 right-4 text-sm font-medium">
        <div className="flex items-center space-x-1">
          <span className="rgb-breathe">Built by</span>
          <span className="rgb-breathe-delayed font-semibold">Adi</span>
          <span className="rgb-breathe-heart text-lg">💕</span>
        </div>
      </div>

      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-yellow-100">
            <Shield className="h-6 w-6 text-yellow-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Enter Master Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your master password is used to encrypt/decrypt your vault entries locally.
            It's never sent to our servers.
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Lock className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Zero-Knowledge Security
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Your master password never leaves your device</li>
                  <li>All encryption happens in your browser</li>
                  <li>We only store encrypted data</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="masterPassword" className="block text-sm font-medium text-gray-700">
              Master Password
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('masterPassword', {
                  required: 'Master password is required',
                  minLength: {
                    value: 8,
                    message: 'Master password must be at least 8 characters',
                  },
                })}
                type={showPassword ? 'text' : 'password'}
                className="block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Enter your master password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.masterPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.masterPassword.message}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Unlock Vault
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}