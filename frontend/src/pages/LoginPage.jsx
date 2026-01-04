
import React from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-md bg-white dark:bg-[#231e33] p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-white/5">
                <h1 className="text-2xl font-bold text-center mb-2 dark:text-white">Welcome Back</h1>
                <p className="text-gray-500 text-center mb-8">Sign in to continue watching</p>

                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email</label>
                        <input type="email" className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 focus:ring-2 focus:ring-primary outline-none transition-all" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Password</label>
                        <input type="password" className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 focus:ring-2 focus:ring-primary outline-none transition-all" />
                    </div>

                    <button className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30">
                        Sign In
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-gray-500">
                    Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
