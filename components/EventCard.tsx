
import React from 'react';
import { Event } from '../types';
import { CalendarIcon, LocationIcon } from './Icon';

interface EventCardProps {
    event: Event;
    currentTime: Date;
}

const EventCard: React.FC<EventCardProps> = ({ event, currentTime }) => {
    const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const isActive = currentTime >= event.startTime && currentTime <= event.endTime;
    const isFinished = currentTime > event.endTime;
    const isUpcoming = currentTime < event.startTime;

    let statusText = 'Upcoming';
    let statusColor = 'bg-yellow-100 text-yellow-800';
    if (isActive) {
        statusText = 'Live';
        statusColor = 'bg-green-100 text-green-800 animate-pulse';
    } else if (isFinished) {
        statusText = 'Finished';
        statusColor = 'bg-brand-gray-100 text-brand-gray-600';
    }

    return (
        <div className={`bg-white p-4 rounded-xl shadow-md border-l-4 ${isActive ? 'border-green-500' : isFinished ? 'border-brand-gray-300' : 'border-yellow-400'}`}>
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-brand-gray-800">{event.name}</h3>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
                    {statusText}
                </span>
            </div>
            <div className="mt-2 text-sm text-brand-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-brand-gray-400" />
                    <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <LocationIcon className="h-4 w-4 text-brand-gray-400" />
                    <span>{event.location}</span>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
