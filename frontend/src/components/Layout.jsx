
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-[#120e1b] dark:text-white font-display">
            <Navbar />
            <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
