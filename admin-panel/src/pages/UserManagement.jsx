
import React, { useState, useEffect } from 'react';
import { Trash2, Search, MoreVertical, Shield } from 'lucide-react';

const UserManagement = () => {
    // Mock data for now, will integrate with /api/admin/users
    const [users, setUsers] = useState([
        { id: 1, name: 'Eren Yeager', email: 'eren@parad.is', role: 'user', joined: '2023-11-01' },
        { id: 2, name: 'Levi Ackerman', email: 'levi@scouts.org', role: 'admin', joined: '2023-10-15' },
        { id: 3, name: 'Mikasa Ackerman', email: 'mikasa@parad.is', role: 'user', joined: '2023-11-02' },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold dark:text-white">User Management</h1>
                <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary-dark transition-colors">
                    <Shield size={16} />
                    Add Admin
                </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-100 dark:border-white/5">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                    <input type="text" placeholder="Search users by name or email..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <select className="px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 outline-none">
                    <option>All Roles</option>
                    <option>Admin</option>
                    <option>User</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5 text-gray-500 uppercase font-medium">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
                                        <p className="text-gray-500 dark:text-gray-400 text-xs">{user.email}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-primary' : 'bg-gray-100 text-gray-500'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 font-medium">
                                    {user.joined}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
