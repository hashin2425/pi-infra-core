import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-blue-600 p-4 shadow-md">
            <h1 className="text-white text-2xl font-bold">Server Management System</h1>
            <nav>
            <ul className="flex space-x-4 mt-2">
                <li><a href="/" className="text-white hover:text-gray-300">Home</a></li>
                <li><a href="/about" className="text-white hover:text-gray-300">About</a></li>
                <li><a href="/contact" className="text-white hover:text-gray-300">Contact</a></li>
            </ul>
            </nav>
        </header>
    );
};

export default Header;