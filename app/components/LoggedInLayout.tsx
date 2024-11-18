import { Link } from "@remix-run/react";
import { useState } from "react";
import type { User } from "~/types"; // Import User type

import defaultAvatar from '~/assets/default_avatar.png';

const LoggedInLayout: React.FC<{ children: React.ReactNode; user: User }> = ({ children, user }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const toggleDarkMode = () => setDarkMode(!darkMode);

    return (
        <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
            {/* Header */}
            <header className="w-full bg-white shadow py-4">
                <div className="flex justify-between items-center px-4">
                    {/* Left - App Title */}
                    <h1 className="text-3xl font-bold">
                        <Link to="/" className="text-gray-800 hover:text-blue-500">Dad Routes</Link>
                    </h1>

                    {/* Right - User Avatar, Dropdown, Dark Mode */}
                    <div className="flex items-center space-x-4">
                        {/* Dark Mode Toggle */}
                        <button onClick={toggleDarkMode} className="text-gray-600 hover:text-blue-500">
                            {darkMode ? "🌙" : "🌞"}
                        </button>

                        {/* Avatar and Dropdown */}
                        <div className="relative">
                            <img
                                src={user?.picture || defaultAvatar} // Default avatar if picture is missing
                                alt="User Avatar"
                                className="w-10 h-10 rounded-full cursor-pointer"
                                onClick={toggleDropdown}
                            />
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48 z-10">
                                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                        Profile
                                    </Link>
                                    <Link to="/upload" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                        Upload GPX
                                    </Link>
                                    <Link to="/new" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                        New Route
                                    </Link>
                                    <hr />
                                    <Link to="/logout" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                        Log Out
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow p-4">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white shadow py-4">
                <nav className="flex justify-center space-x-4">
                    <Link to="/" className="text-gray-600 hover:text-blue-500">Home</Link>
                    <Link to="/users" className="text-gray-600 hover:text-blue-500">Community</Link>
                    <Link to="/about" className="text-gray-600 hover:text-blue-500">About</Link>
                    <Link to="/contact" className="text-gray-600 hover:text-blue-500">Contact</Link>
                    <Link to="/blog" className="text-gray-600 hover:text-blue-500">Blog</Link>
                    <Link to="/privacy" className="text-gray-600 hover:text-blue-500">Privacy Policy</Link>
                </nav>
            </footer>
        </div>
    );
};

export default LoggedInLayout;
