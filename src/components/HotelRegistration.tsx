"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

// --- Data Types ---
type Registration = {
  id: number;
  customer_id: string;
  full_name: string;
  email: string;
  check_in_date: string;
  check_out_date: string;
  room_type: string;
};

// --- Sub-component for the Edit Modal ---
function EditModal({ registration, onClose, onSave }: { registration: Registration, onClose: () => void, onSave: () => void }) {
  const [formData, setFormData] = useState(registration);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // This logic correctly handles snake_case to camelCase conversion for state keys
    const stateKey = name.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    setFormData(prev => ({ ...prev, [stateKey]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Updating registration...');
    try {
      const response = await fetch('/api/registrations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: formData.id,
          customerId: formData.customer_id,
          fullName: formData.full_name,
          email: formData.email,
          checkInDate: formData.check_in_date.split('T')[0],
          checkOutDate: formData.check_out_date.split('T')[0],
          roomType: formData.room_type,
        }),
      });
      if (!response.ok) throw new Error('Failed to update registration');
      toast.success('Registration updated successfully.', { id: loadingToast });
      onSave();
      onClose();
    } catch (err) {
      toast.error('Error updating registration.', { id: loadingToast });
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-zinc-800 rounded-2xl p-6 sm:p-8 w-full max-w-2xl"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        <h3 className="text-2xl font-bold text-white mb-6">Edit Registration</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="customer_id" placeholder="Customer ID" value={formData.customer_id} onChange={handleInputChange} className="w-full bg-zinc-700 border border-zinc-600 rounded-lg py-3 px-4 text-white" />
            <input type="text" name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleInputChange} className="w-full bg-zinc-700 border border-zinc-600 rounded-lg py-3 px-4 text-white" />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="w-full bg-zinc-700 border border-zinc-600 rounded-lg py-3 px-4 text-white" />
            <input type="date" name="check_in_date" value={formData.check_in_date.split('T')[0]} onChange={handleInputChange} className="w-full bg-zinc-700 border border-zinc-600 rounded-lg py-3 px-4 text-white" />
            <input type="date" name="check_out_date" value={formData.check_out_date.split('T')[0]} onChange={handleInputChange} className="w-full bg-zinc-700 border border-zinc-600 rounded-lg py-3 px-4 text-white" />
            <select name="room_type" value={formData.room_type} onChange={handleInputChange} className="w-full bg-zinc-700 border border-zinc-600 rounded-lg py-3 px-4 text-white">
                <option>Standard</option>
                <option>Deluxe</option>
                <option>Suite</option>
            </select>
            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onClose} className="bg-zinc-600 text-white font-bold py-2 px-6 rounded-md hover:bg-zinc-500 transition">Cancel</button>
                <button type="submit" className="bg-yellow-600 text-white font-bold py-2 px-6 rounded-md hover:bg-yellow-700 transition">Save Changes</button>
            </div>
        </form>
      </motion.div>
    </motion.div>
  );
}


// --- Main Component ---
export default function HotelRegistration() {
  const [allRegistrations, setAllRegistrations] = useState<Registration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([]);
  const [formData, setFormData] = useState({ customerId: '', fullName: '', email: '', checkInDate: '', checkOutDate: '', roomType: 'Standard' });
  const [isLoading, setIsLoading] = useState(true);
  const [editingRegistration, setEditingRegistration] = useState<Registration | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRegistrations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/registrations');
      if (!response.ok) throw new Error('Failed to fetch registrations');
      const data = await response.json();
      setAllRegistrations(data);
      setFilteredRegistrations(data);
    } catch (err) {
      toast.error('Could not load registrations.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  useEffect(() => {
    const results = allRegistrations.filter(reg =>
      reg.customer_id && reg.customer_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRegistrations(results);
  }, [searchTerm, allRegistrations]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Registering guest...');
    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to submit registration');
      toast.success('Registration completed successfully!', { id: loadingToast });
      setFormData({ customerId: '', fullName: '', email: '', checkInDate: '', checkOutDate: '', roomType: 'Standard' });
      fetchRegistrations();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An unknown error occurred.', { id: loadingToast });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
        const loadingToast = toast.loading('Deleting registration...');
        try {
            const response = await fetch('/api/registrations', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (!response.ok) throw new Error('Failed to delete registration');
            toast.success('Registration deleted successfully.', { id: loadingToast });
            fetchRegistrations();
        } catch (err) {
            toast.error('Error deleting registration.', { id: loadingToast });
        }
    }
  };

  return (
    <section className="py-20 px-4">
        <Toaster 
            position="bottom-center"
            toastOptions={{
                style: {
                    background: '#1F2937',
                    color: '#F9FAFB',
                    border: '1px solid #374151',
                }
            }}
        />

      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold text-white text-center mb-12">Hotel Guest Registration</h2>
        
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 sm:p-8 mb-12">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="customerId" className="block text-sm font-medium text-gray-300 mb-2">Customer ID</label>
                        <input type="text" name="customerId" id="customerId" value={formData.customerId} onChange={handleInputChange} required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                    </div>
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                        <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleInputChange} required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                    </div>
                    <div>
                        <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-300 mb-2">Check-in Date</label>
                        <input type="date" name="checkInDate" id="checkInDate" value={formData.checkInDate} onChange={handleInputChange} required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                    </div>
                    <div>
                        <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-300 mb-2">Check-out Date</label>
                        <input type="date" name="checkOutDate" id="checkOutDate" value={formData.checkOutDate} onChange={handleInputChange} required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                    </div>
                    <div>
                        <label htmlFor="roomType" className="block text-sm font-medium text-gray-300 mb-2">Room Type</label>
                        <select name="roomType" id="roomType" value={formData.roomType} onChange={handleInputChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500">
                        <option>Standard</option>
                        <option>Deluxe</option>
                        <option>Suite</option>
                        </select>
                    </div>
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-bold py-3 px-4 rounded-md hover:opacity-90 transition-opacity duration-300">
                Register Guest
                </button>
            </form>
        </div>

        <div className="flex justify-between items-center mb-4">
            <h3 className="text-3xl font-bold text-white">Registered Guests</h3>
            <input 
                type="text"
                placeholder="Search by Customer ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-1/3 bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
        </div>
        <div className="overflow-x-auto bg-zinc-900/50 border border-zinc-800 rounded-2xl">
          <table className="min-w-full divide-y divide-zinc-700">
            <thead className="bg-zinc-800">
              <tr>
                <th className="py-3.5 px-6 text-left text-sm font-semibold text-white">Customer ID</th>
                <th className="py-3.5 px-6 text-left text-sm font-semibold text-white">Name</th>
                <th className="py-3.5 px-6 text-left text-sm font-semibold text-white">Email</th>
                <th className="py-3.5 px-6 text-left text-sm font-semibold text-white">Check-in</th>
                <th className="py-3.5 px-6 text-left text-sm font-semibold text-white">Check-out</th>
                <th className="py-3.5 px-6 text-left text-sm font-semibold text-white">Room</th>
                <th className="py-3.5 px-6 text-left text-sm font-semibold text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {isLoading ? (
                <tr><td colSpan={7} className="text-center py-4 text-gray-400">Loading...</td></tr>
              ) : (
                <AnimatePresence>
                  {filteredRegistrations.map((reg) => (
                    <motion.tr key={reg.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <td className="py-4 px-6 text-sm font-medium text-white">{reg.customer_id}</td>
                      <td className="py-4 px-6 text-sm text-gray-300">{reg.full_name}</td>
                      <td className="py-4 px-6 text-sm text-gray-300">{reg.email}</td>
                      <td className="py-4 px-6 text-sm text-gray-300">{new Date(reg.check_in_date).toLocaleDateString()}</td>
                      <td className="py-4 px-6 text-sm text-gray-300">{new Date(reg.check_out_date).toLocaleDateString()}</td>
                      <td className="py-4 px-6 text-sm text-gray-300">{reg.room_type}</td>
                      <td className="py-4 px-6 text-sm text-gray-300 flex gap-2">
                        <button onClick={() => setEditingRegistration(reg)} className="text-blue-400 hover:text-blue-300">Edit</button>
                        <button onClick={() => handleDelete(reg.id)} className="text-red-400 hover:text-red-300">Delete</button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {editingRegistration && (
            <EditModal 
                registration={editingRegistration}
                onClose={() => setEditingRegistration(null)}
                onSave={fetchRegistrations}
            />
        )}
      </AnimatePresence>
    </section>
  );
}
