import React, { useState, useEffect } from 'react';
import { Plus, Search, LogOut, Lock, Eye, EyeOff, Copy, Edit, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { vaultAPI, VaultEntry } from '../services/api';
import { decryptData, VaultEntryData, EncryptedData } from '../utils/crypto';
import VaultEntryModal from './VaultEntryModal';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, logout, masterPassword, clearMasterPassword } = useAuthStore();
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [decryptedEntries, setDecryptedEntries] = useState<Map<number, VaultEntryData>>(new Map());
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswords, setShowPasswords] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<VaultEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const response = await vaultAPI.getEntries();
      setEntries(response.data);
      
      // Decrypt entries
      const decrypted = new Map<number, VaultEntryData>();
      for (const entry of response.data) {
        try {
          const encryptedData: EncryptedData = JSON.parse(entry.encrypted_data);
          const decryptedData = decryptData(encryptedData, masterPassword!);
          decrypted.set(entry.id, decryptedData);
        } catch (error) {
          console.error(`Failed to decrypt entry ${entry.id}:`, error);
        }
      }
      setDecryptedEntries(decrypted);
    } catch (error) {
      toast.error('Failed to load vault entries');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEntry = async (id: number) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    
    try {
      await vaultAPI.deleteEntry(id);
      setEntries(entries.filter(entry => entry.id !== id));
      setDecryptedEntries(prev => {
        const newMap = new Map(prev);
        newMap.delete(id);
        return newMap;
      });
      toast.success('Entry deleted successfully');
    } catch (error) {
      toast.error('Failed to delete entry');
    }
  };

  const togglePasswordVisibility = (id: number) => {
    setShowPasswords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const filteredEntries = entries.filter(entry => {
    const decrypted = decryptedEntries.get(entry.id);
    if (!decrypted) return false;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      entry.title.toLowerCase().includes(searchLower) ||
      decrypted.website.toLowerCase().includes(searchLower) ||
      decrypted.username.toLowerCase().includes(searchLower)
    );
  });

  const handleLogout = () => {
    logout();
    clearMasterPassword();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow relative">
        {/* RGB Breathing Watermark */}
        <div className="absolute top-2 right-4 text-xs font-medium">
          <div className="flex items-center space-x-1">
            <span className="rgb-breathe">Built by</span>
            <span className="rgb-breathe-delayed font-semibold">Adi</span>
            <span className="rgb-breathe-heart">💕</span>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Lock className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Password Vault</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Search and Add Button */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
            <div className="relative w-full sm:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </button>
          </div>

          {/* Entries Grid */}
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <Lock className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No entries found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first password entry.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEntries.map((entry) => {
                const decrypted = decryptedEntries.get(entry.id);
                if (!decrypted) return null;

                return (
                  <div key={entry.id} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {entry.title}
                        </h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingEntry(entry);
                              setIsModalOpen(true);
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Website
                          </label>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-900 truncate">{decrypted.website}</span>
                            <button
                              onClick={() => copyToClipboard(decrypted.website, 'Website')}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Username
                          </label>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-900 truncate">{decrypted.username}</span>
                            <button
                              onClick={() => copyToClipboard(decrypted.username, 'Username')}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Password
                          </label>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-900 font-mono">
                              {showPasswords.has(entry.id) ? decrypted.password : '••••••••'}
                            </span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => togglePasswordVisibility(entry.id)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                {showPasswords.has(entry.id) ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                              <button
                                onClick={() => copyToClipboard(decrypted.password, 'Password')}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {decrypted.notes && (
                          <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Notes
                            </label>
                            <p className="text-sm text-gray-900 truncate">{decrypted.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <VaultEntryModal
          entry={editingEntry}
          onClose={() => {
            setIsModalOpen(false);
            setEditingEntry(null);
          }}
          onSave={() => {
            loadEntries();
            setIsModalOpen(false);
            setEditingEntry(null);
          }}
        />
      )}
    </div>
  );
}