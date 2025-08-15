
import React from 'react';
import { LogoIcon } from './Icon';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <LogoIcon className="h-10 w-10 text-brand-blue" />
                    <h1 className="text-3xl font-bold text-brand-gray-900">ChurchFlow</h1>
                </div>
                <span className="text-sm font-medium text-brand-gray-500">The Ultimate Check-in & Management App</span>
            </div>
        </header>
    );
};

export default Header;
