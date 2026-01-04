
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, MessageSquare, Server, LogOut } from 'lucide-react';

const AdminLayout = ({ onLogout }) => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex h-screen bg-background-light dark:bg-background-dark text-text-main dark:text-gray-100 font-display">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-surface-dark border-r border-gray-200 dark:border-white/5 flex flex-col">
                <div className="p-6 border-b border-gray-200 dark:border-white/5 flex items-center gap-3">
                    <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        S
                    </div>
                    <span className="font-bold text-lg dark:text-white">SenpaiStream</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <Link
                        to="/"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive('/')
                            ? 'bg-primary/10 text-primary'
                            : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                    <Link
                        to="/users"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive('/users')
                            ? 'bg-primary/10 text-primary'
                            : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        <Users size={20} />
                        Users
                    </Link>
                    <Link
                        to="/comments"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive('/comments')
                            ? 'bg-primary/10 text-primary'
                            : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        <MessageSquare size={20} />
                        Comments
                    </Link>
                    <Link
                        to="/sources"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive('/sources')
                            ? 'bg-primary/10 text-primary'
                            : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        <Server size={20} />
                        Sources
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-white/5">
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 w-full transition-colors"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
