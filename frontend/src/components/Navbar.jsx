
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Play, Search, Bookmark, Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    // Helper function to check if link is active
    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    // Helper function to get link classes
    const getLinkClasses = (path) => {
        const baseClasses = "font-medium text-sm px-4 py-2 rounded-xl transition-all";
        if (isActive(path)) {
            return `${baseClasses} bg-primary text-white shadow-lg shadow-primary/30 font-semibold`;
        }
        return `${baseClasses} text-[#64748b] dark:text-gray-300 hover:text-primary hover:bg-primary/10`;
    };

    return (
        <>
            <header className="sticky top-0 z-50 glass-nav w-full px-4 sm:px-6 lg:px-8 py-3 transition-all duration-300">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-8 lg:gap-12">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 text-primary hover:opacity-80 transition-opacity">
                            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                                <Play className="fill-current text-white size-5" />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight text-[#120e1b] dark:text-white font-heading">SenpaiStream</h2>
                        </Link>

                        {/* Nav Links - Desktop */}
                        <nav className="hidden md:flex items-center gap-2">
                            <Link to="/" className={getLinkClasses('/')}>Home</Link>
                            <Link to="/browse" className={getLinkClasses('/browse')}>Browse</Link>
                            <Link to="/genre" className={getLinkClasses('/genre')}>Genre</Link>
                            <Link to="/schedule" className={getLinkClasses('/schedule')}>Schedule</Link>
                            <Link to="/ongoing" className={getLinkClasses('/ongoing')}>Ongoing</Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Bar (Desktop) */}
                        <div className="hidden lg:flex relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-primary">
                                <Search className="size-5" />
                            </div>
                            <input
                                type="text"
                                className="block w-full min-w-[240px] p-2 pl-10 text-sm text-gray-900 border-none rounded-xl bg-white/50 focus:ring-2 focus:ring-primary/20 placeholder-primary/60 focus:bg-white transition-all outline-none"
                                placeholder="Search anime..."
                            />
                        </div>

                        {/* Icons */}
                        <button className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-xl transition-colors">
                            <Bookmark className="size-5" />
                        </button>
                        <button className="lg:hidden p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-xl transition-colors">
                            <Search className="size-5" />
                        </button>

                        {/* Profile */}
                        <div
                            className="size-9 rounded-full bg-cover bg-center border-2 border-white shadow-sm cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBqnVJi_lxYs0CK0kul1JHsVDzNn02SAhQtajBo9nUwPpAnPrUllu5DXE4e6MJZ-4kc0zteXk5FBpwHdcNKvNvmcZqe2PDoRMxYts2LkbK_fd10Bpb6gESUI1GfB5QJ4LxetLbmeGcSKLXYvsgbS-ThvXt4TlLdGy7AZm1deJ3MEe1tVhxhEX67ItF_vZ0IxZKkokSEw-nrzCmN_gaV874QEL25_ykemOmeaKfVy9DynOG2FBvqStFtFIzwMcatlgEJG1vKrtqjqhYT")' }}
                        >
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 top-[64px] z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}>
                    <nav className="bg-white dark:bg-[#231e33] p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-col gap-2">
                            <Link
                                to="/"
                                className={getLinkClasses('/')}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                to="/browse"
                                className={getLinkClasses('/browse')}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Browse
                            </Link>
                            <Link
                                to="/genre"
                                className={getLinkClasses('/genre')}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Genre
                            </Link>
                            <Link
                                to="/schedule"
                                className={getLinkClasses('/schedule')}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Schedule
                            </Link>
                            <Link
                                to="/ongoing"
                                className={getLinkClasses('/ongoing')}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Ongoing
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </>
    );
};

export default Navbar;
