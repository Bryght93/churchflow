
import React from 'react';
import { ClockIcon } from './Icon';

interface ClockProps {
    currentTime: Date;
}

const Clock: React.FC<ClockProps> = ({ currentTime }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-between">
            <div>
                <h2 className="text-lg font-semibold text-brand-gray-500">System Time</h2>
                <p className="text-4xl font-bold text-brand-gray-900 tracking-tight">
                    {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
                <p className="text-brand-gray-500">{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <ClockIcon className="h-16 w-16 text-brand-blue opacity-20" />
        </div>
    );
};

export default Clock;
