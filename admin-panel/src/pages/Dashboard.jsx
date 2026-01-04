import React, { useState, useEffect } from 'react';
import { Users, Eye, Star, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-current`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
            <span className={`text-sm font-medium ${change >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center gap-1`}>
                <TrendingUp size={16} />
                {change >= 0 ? '+' : ''}{change}%
            </span>
        </div>
        <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold dark:text-white">{value}</p>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        users: { total: 0, active: 0, growth: 0 },
        views: { total: 0, unique: 0 },
        server: { uptime: 0, memory: {}, cpu: {} }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/stats');
            const result = await res.json();

            if (result.statusCode === 200) {
                setStats(result.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatUptime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    const formatMemory = (bytes) => {
        if (!bytes) return '0 MB';
        return Math.round(bytes / 1024 / 1024) + ' MB';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-gray-400">Loading stats...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold dark:text-white mb-2">Dashboard Overview</h1>
                <p className="text-gray-500">Welcome back, Administrator.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats.users?.total?.toLocaleString() || '0'}
                    change={stats.users?.growth || 0}
                    icon={Users}
                    color="text-blue-500 bg-blue-500"
                />
                <StatCard
                    title="Active Users"
                    value={stats.users?.active?.toLocaleString() || '0'}
                    change={0}
                    icon={Eye}
                    color="text-green-500 bg-green-500"
                />
                <StatCard
                    title="Total Views"
                    value={stats.views?.total?.toLocaleString() || '0'}
                    change={0}
                    icon={Star}
                    color="text-amber-500 bg-amber-500"
                />
                <StatCard
                    title="Server Uptime"
                    value={stats.server?.uptime ? formatUptime(stats.server.uptime) : '0m'}
                    change={0}
                    icon={TrendingUp}
                    color="text-primary bg-primary"
                />
            </div>

            {/* Server Info */}
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-white/5 p-6">
                <h2 className="text-lg font-bold dark:text-white mb-4">Server Metrics</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Memory (RSS)</p>
                        <p className="text-xl font-semibold dark:text-white">
                            {formatMemory(stats.server?.memory?.rss)}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Heap Used</p>
                        <p className="text-xl font-semibold dark:text-white">
                            {formatMemory(stats.server?.memory?.heapUsed)}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Uptime</p>
                        <p className="text-xl font-semibold dark:text-white">
                            {stats.server?.uptime ? formatUptime(stats.server.uptime) : '0m'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
