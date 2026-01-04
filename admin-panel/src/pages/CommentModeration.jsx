
import React, { useState } from 'react';
import { Search, MessageSquare, Check, X, AlertTriangle } from 'lucide-react';

const CommentModeration = () => {
    const [comments, setComments] = useState([
        { id: 1, user: 'GojoFan99', content: 'This episode was absolutely insane!', anime: 'Jujutsu Kaisen', date: '2 hours ago', status: 'pending' },
        { id: 2, user: 'SpamBot_3000', content: 'Click here for free gems: www.scam.com', anime: 'One Piece', date: '5 mins ago', status: 'flagged' },
        { id: 3, user: 'AnimeWatcher', content: 'Mid.', anime: 'Bleach', date: '1 day ago', status: 'pending' },
    ]);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold dark:text-white">Comment Moderation</h1>

            {/* Filters */}
            <div className="flex items-center gap-4 bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-100 dark:border-white/5">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                    <input type="text" placeholder="Search comments..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <select className="px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 outline-none">
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Flagged</option>
                </select>
            </div>

            {/* Comment List */}
            <div className="space-y-4">
                {comments.map(comment => (
                    <div key={comment.id} className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-white/5 flex gap-4">
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <MessageSquare size={20} />
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-900 dark:text-white">{comment.user}</span>
                                    <span className="text-gray-400 text-xs">• {comment.anime} • {comment.date}</span>
                                </div>
                                {comment.status === 'flagged' && (
                                    <span className="bg-red-100 text-red-500 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                                        <AlertTriangle size={12} /> Flagged
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">{comment.content}</p>

                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 font-medium text-sm transition-colors">
                                    <Check size={16} /> Approve
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm transition-colors">
                                    <X size={16} /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentModeration;
