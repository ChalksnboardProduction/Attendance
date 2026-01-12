"use client";
import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function EmployeeList({ onViewReport }) {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const { data } = await api.get('/user'); // Assuming this endpoint returns all users
            // Filter out Admins maybe? Or show all? User request says "report of that particular record of the employee".
            // Let's show all for now.
            setEmployees(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch employees', error);
            setLoading(false);
        }
    };

    if (loading) return <div className="text-white">Loading employees...</div>;

    return (
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-blue-400">Employee List</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-700 text-gray-200">
                            <th className="p-4 rounded-tl-lg">Name</th>
                            <th className="p-4">Phone</th>
                            <th className="p-4">Role</th>
                            <th className="p-4 rounded-tr-lg">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {employees.map((emp) => (
                            <tr key={emp.id} className="hover:bg-gray-750 transition-colors">
                                <td className="p-4 font-medium text-white">{emp.name}</td>
                                <td className="p-4 text-gray-300">{emp.phone}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${emp.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' :
                                            emp.role === 'HR' ? 'bg-purple-500/20 text-purple-400' :
                                                'bg-emerald-500/20 text-emerald-400'
                                        }`}>
                                        {emp.role}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => onViewReport(emp)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
                                    >
                                        View Report
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
