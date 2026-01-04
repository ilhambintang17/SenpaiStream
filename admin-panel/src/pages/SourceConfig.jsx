import React, { useState, useEffect } from 'react';
import { Server, Check, X, RefreshCw, Save } from 'lucide-react';

const SourceConfig = () => {
    const [configs, setConfigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(null);
    const [editedUrls, setEditedUrls] = useState({});

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        try {
            const res = await fetch('/api/admin/configs');
            const result = await res.json();

            if (result.statusCode === 200) {
                setConfigs(result.data.configs);

                // Initialize edited URLs
                const urls = {};
                result.data.configs.forEach(config => {
                    urls[config.sourceName] = config.baseUrl;
                });
                setEditedUrls(urls);
            }
        } catch (error) {
            console.error('Error fetching configs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUrlChange = (sourceName, newUrl) => {
        setEditedUrls(prev => ({
            ...prev,
            [sourceName]: newUrl
        }));
    };

    const handleSave = async (sourceName) => {
        setSaving(sourceName);

        try {
            const res = await fetch(`/api/admin/configs/${sourceName}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    baseUrl: editedUrls[sourceName],
                    isActive: true
                })
            });

            const result = await res.json();

            if (result.statusCode === 200) {
                alert(`✅ ${sourceName} URL updated successfully!`);
                fetchConfigs();
            } else {
                alert(`❌ Error: ${result.message}`);
            }
        } catch (error) {
            alert('❌ Failed to update URL');
            console.error(error);
        } finally {
            setSaving(null);
        }
    };

    const hasChanges = (sourceName) => {
        const original = configs.find(c => c.sourceName === sourceName)?.baseUrl;
        return original !== editedUrls[sourceName];
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-gray-400">Loading configurations...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold dark:text-white mb-2">Source Configuration</h1>
                <p className="text-gray-500">Manage anime source URLs (domain sering berubah, update di sini)</p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <Server className="text-blue-500 mt-0.5" size={20} />
                    <div>
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                            Domain Sering Berubah?
                        </h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            Update URL source di sini tanpa perlu edit code. Perubahan langsung aktif setelah save.
                        </p>
                    </div>
                </div>
            </div>

            {/* Source Cards */}
            <div className="grid gap-6">
                {configs.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        No configurations found. Initializing defaults...
                    </div>
                ) : (
                    configs.map(config => (
                        <div key={config.sourceName} className="bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-white/5 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-bold dark:text-white capitalize flex items-center gap-2">
                                        {config.sourceName}
                                        {config.isActive ? (
                                            <span className="flex items-center gap-1 text-xs font-normal text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                                                <Check size={12} /> Active
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-xs font-normal text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full">
                                                <X size={12} /> Inactive
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Last updated: {new Date(config.lastUpdated).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Base URL
                                    </label>
                                    <input
                                        type="url"
                                        value={editedUrls[config.sourceName] || ''}
                                        onChange={(e) => handleUrlChange(config.sourceName, e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                                        placeholder="https://example.com"
                                    />
                                </div>

                                {hasChanges(config.sourceName) && (
                                    <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
                                        <RefreshCw size={14} />
                                        <span>URL has been modified</span>
                                    </div>
                                )}

                                <button
                                    onClick={() => handleSave(config.sourceName)}
                                    disabled={!hasChanges(config.sourceName) || saving === config.sourceName}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {saving === config.sourceName ? (
                                        <>
                                            <RefreshCw size={16} className="animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Current Config Display */}
                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Current: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{config.baseUrl}</code>
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Initialize Button */}
            {configs.length === 0 && (
                <button
                    onClick={async () => {
                        await handleSave('otakudesu');
                        await handleSave('kuramanime');
                        fetchConfigs();
                    }}
                    className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                    Initialize Default Sources
                </button>
            )}
        </div>
    );
};

export default SourceConfig;
