"use client";
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../../utils/api';

export default function CreateUserForm({ currentUserRole }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const roleToCreate = currentUserRole === 'ADMIN' ? 'HR' : 'EMPLOYEE';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await api.post('/user', {
                name,
                phone,
                password,
                role: roleToCreate
            });
            setSuccess(`Successfully created ${roleToCreate} account!`);
            setName('');
            setPhone('');
            setPassword('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create user');
        }
    };

    return (
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-emerald-400">
                Create New {roleToCreate}
            </h2>

            {error && <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4 text-center">{error}</div>}
            {success && <div className="bg-emerald-500/20 text-emerald-400 p-3 rounded mb-4 text-center">{success}</div>}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-400 mb-2">Full Name</label>
                        <input
                            type="text"
                            className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-emerald-500 focus:outline-none text-white"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Phone Number</label>
                        <input
                            type="text"
                            className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-emerald-500 focus:outline-none text-white"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-emerald-500 focus:outline-none text-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors">
                    Create {roleToCreate} Account
                </button>
            </form>
        </div>
    );
}
