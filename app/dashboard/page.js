"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { useRouter } from 'next/navigation';
import CreateUserForm from './CreateUserForm';
import EmployeeList from './EmployeeList';

export default function Dashboard() {
    const { user, logout, loading } = useAuth();
    const [attendance, setAttendance] = useState([]);
    const [status, setStatus] = useState('');
    const [location, setLocation] = useState(null);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'employees' | 'report'
    const [selectedUser, setSelectedUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            fetchAttendance();
        }
    }, [user]);

    const fetchAttendance = async (userId = null) => {
        try {
            const endpoint = userId ? `/attendance?userId=${userId}` : '/attendance';
            const { data } = await api.get(endpoint);
            setAttendance(data);
        } catch (error) {
            console.error('Failed to fetch attendance', error);
        }
    };

    const getLocation = () => {
        if (!navigator.geolocation) {
            setStatus('Geolocation is not supported by your browser');
            return;
        }
        setStatus('Locating...');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
                setStatus('Location acquired');
            },
            () => {
                setStatus('Unable to retrieve your location');
            }
        );
    };

    const handleCheckIn = async () => {
        if (!location) {
            alert('Please get your location first');
            return;
        }
        try {
            await api.post('/attendance/check-in', location);
            setStatus('Checked In Successfully!');
            fetchAttendance();
        } catch (error) {
            console.log(error);
            setStatus(error.response?.data?.error || 'Check-in failed');
        }
    };

    const handleCheckOut = async () => {
        try {
            await api.post('/attendance/check-out');
            setStatus('Checked Out Successfully!');
            fetchAttendance();
        } catch (error) {
            setStatus(error.response?.data?.error || 'Check-out failed');
        }
    };

    if (loading || !user) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8 bg-gray-800 p-6 rounded-xl shadow-lg">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-400">Dashboard</h1>
                        <p className="text-gray-400">Welcome, {user.name} ({user.role})</p>
                    </div>
                    <button onClick={logout} className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold transition-colors">
                        Logout
                    </button>
                </div>

                {(user.role === 'ADMIN' || user.role === 'HR') && (
                    <div className="mb-6">
                        <div className="flex gap-4 border-b border-gray-700 pb-4">
                            <button
                                onClick={() => { setActiveTab('overview'); setSelectedUser(null); fetchAttendance(); }}
                                className={`px-4 py-2 font-semibold rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Overview & Attendance
                            </button>
                            <button
                                onClick={() => setActiveTab('employees')}
                                className={`px-4 py-2 font-semibold rounded-lg transition-colors ${activeTab === 'employees' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Employees List
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'employees' && (
                    <EmployeeList onViewReport={(emp) => {
                        setSelectedUser(emp);
                        setActiveTab('report');
                        fetchAttendance(emp.id);
                    }} />
                )}

                {(activeTab === 'overview' || activeTab === 'report') && (
                    <>
                        {(user.role === 'ADMIN' || user.role === 'HR') && activeTab === 'overview' && (
                            <CreateUserForm currentUserRole={user.role} />
                        )}

                        {(user.role === 'EMPLOYEE' || user.role === 'HR') && (
                            <div className="bg-gray-800 p-8 rounded-xl shadow-lg mb-8 border border-gray-700">
                                <h2 className="text-2xl font-semibold mb-6 text-emerald-400">Mark Attendance</h2>

                                <div className="bg-blue-500/20 text-blue-300 p-4 rounded-lg mb-6 text-sm">
                                    <p className="font-bold mb-1">⏰ Working Hours: 09:00 AM - 07:30 PM</p>
                                    <p>You must complete 9 hours. Check-in is allowed between 09:00 AM and 10:30 AM.</p>
                                </div>

                                <div className="flex flex-col md:flex-row gap-6 items-center">
                                    <button
                                        onClick={getLocation}
                                        className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold w-full md:w-auto transition-all shadow-lg shadow-purple-500/20"
                                    >
                                        1. Get Location
                                    </button>

                                    <div className="flex gap-4 w-full md:w-auto">
                                        <button
                                            onClick={handleCheckIn}
                                            disabled={!location}
                                            className={`px-6 py-3 rounded-lg font-semibold w-full md:w-auto transition-all ${location ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20' : 'bg-gray-600 cursor-not-allowed'
                                                }`}
                                        >
                                            2. Check In
                                        </button>
                                        <button
                                            onClick={handleCheckOut}
                                            className="bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-lg font-semibold w-full md:w-auto transition-all shadow-lg shadow-yellow-500/20"
                                        >
                                            Check Out
                                        </button>
                                    </div>
                                </div>

                                {status && (
                                    <div className="mt-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600 text-center text-lg">
                                        {status}
                                    </div>
                                )}

                                {location && (
                                    <div className="mt-4 text-sm text-gray-400">
                                        Lat: {location.latitude}, Lng: {location.longitude}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
                            <h2 className="text-2xl font-semibold mb-6 text-blue-400">
                                {activeTab === 'report' && selectedUser
                                    ? `Attendance Report: ${selectedUser.name}`
                                    : 'Attendance Records'
                                }
                            </h2>
                            {activeTab === 'report' && (
                                <button
                                    onClick={() => { setActiveTab('employees'); }}
                                    className="mb-4 text-sm text-gray-400 hover:text-white underline"
                                >
                                    &larr; Back to Employees
                                </button>
                            )}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-700 text-gray-200">
                                            <th className="p-4 rounded-tl-lg">Date</th>
                                            {(user.role === 'HR' || user.role === 'ADMIN') && <th className="p-4">Employee Name</th>}
                                            <th className="p-4">Check In</th>
                                            <th className="p-4">Check Out</th>
                                            <th className="p-4 rounded-tr-lg">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {attendance.map((record) => (
                                            <tr key={record.id} className="hover:bg-gray-750 transition-colors">
                                                <td className="p-4">{record.date}</td>
                                                {(user.role === 'HR' || user.role === 'ADMIN') && <td className="p-4 font-medium text-white">{record.User?.name || 'Unknown'}</td>}
                                                <td className="p-4 text-emerald-400 font-mono">
                                                    {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}
                                                </td>
                                                <td className="p-4 text-yellow-400 font-mono">
                                                    {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${record.status === 'PRESENT' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                                                        }`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {attendance.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="p-8 text-center text-gray-500">No records found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
