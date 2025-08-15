
import React, { useState, useEffect, useCallback } from 'react';
import { Event, Member, AttendanceRecord, CheckinStatus, MemberType } from './types';
import { EVENTS, MEMBERS, GRACE_PERIOD_MINUTES } from './constants';
import Header from './components/Header';
import Clock from './components/Clock';
import EventCard from './components/EventCard';
import AttendanceTable from './components/AttendanceTable';
import AIAssistant from './components/AIAssistant';
import { UserIcon, UsersIcon } from './components/Icon';

const App: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [events] = useState<Event[]>(EVENTS);
    const [members, setMembers] = useState<Member[]>(MEMBERS);
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleCheckIn = useCallback((memberId: string, eventId: string) => {
        const member = members.find(m => m.id === memberId);
        const event = events.find(e => e.id === eventId);

        if (!member || !event) {
            console.error("Member or Event not found for check-in");
            return;
        }

        const existingRecord = attendanceRecords.find(
            r => r.memberId === memberId && r.eventId === eventId
        );
        if (existingRecord) {
            // Already checked in for this event
            return;
        }
        
        const gracePeriodEndTime = new Date(event.startTime.getTime() + GRACE_PERIOD_MINUTES * 60000);

        let status: CheckinStatus;
        if (currentTime <= gracePeriodEndTime) {
            status = CheckinStatus.PRESENT;
        } else {
            status = CheckinStatus.LATE;
        }

        const newRecord: AttendanceRecord = {
            memberId: member.id,
            memberName: member.name,
            memberType: member.type,
            status,
            checkinTime: currentTime,
            eventId: event.id,
            eventName: event.name,
        };

        setAttendanceRecords(prevRecords => [...prevRecords, newRecord]);

    }, [currentTime, members, events, attendanceRecords]);


    const handleNewcomerCheckIn = useCallback(() => {
        const activeEvents = events.filter(e => currentTime >= e.startTime && currentTime <= e.endTime);
        const eventToCheckIn = activeEvents[0]; // Check into the first active event

        if (!eventToCheckIn) {
            alert("No active event to check into.");
            return;
        }

        const newMember: Member = {
            id: `mem-${Date.now()}`,
            name: `Grace Bello (New)`,
            type: MemberType.NEWCOMER,
        };

        setMembers(prev => [...prev, newMember]);
        handleCheckIn(newMember.id, eventToCheckIn.id);
    }, [currentTime, events, handleCheckIn]);
    
    const activeEvents = events.filter(e => currentTime >= e.startTime && currentTime <= e.endTime);

    return (
        <div className="min-h-screen bg-brand-gray-100 text-brand-gray-800 font-sans">
            <Header />
            <main className="container mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-1 space-y-8">
                        <Clock currentTime={currentTime} />
                        <div>
                            <h2 className="text-2xl font-bold text-brand-gray-900 mb-4">Current & Upcoming Events</h2>
                            <div className="space-y-4">
                                {events.map(event => (
                                    <EventCard key={event.id} event={event} currentTime={currentTime} />
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-md">
                            <h2 className="text-2xl font-bold text-brand-gray-900 mb-4">Simulate Check-in</h2>
                             <button
                                onClick={handleNewcomerCheckIn}
                                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm"
                            >
                                <UserIcon className="h-5 w-5" />
                                Newcomer Check-in
                            </button>
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold text-brand-gray-700 mb-2">Member Check-in</h3>
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                    {members.filter(m=>m.type === MemberType.MEMBER).map(member => (
                                        <button 
                                            key={member.id} 
                                            onClick={() => activeEvents.length > 0 && handleCheckIn(member.id, activeEvents[0].id)}
                                            disabled={activeEvents.length === 0 || attendanceRecords.some(r => r.memberId === member.id && r.eventId === (activeEvents[0] && activeEvents[0].id))}
                                            className="w-full text-left p-3 bg-brand-gray-100 rounded-lg hover:bg-brand-gray-200 transition-colors disabled:bg-brand-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                                        >
                                            <UsersIcon className="h-5 w-5 text-brand-gray-500"/>
                                            {member.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-6 rounded-2xl shadow-md">
                            <h2 className="text-2xl font-bold text-brand-gray-900 mb-4">Live Attendance Records</h2>
                            <AttendanceTable 
                                members={members}
                                attendanceRecords={attendanceRecords}
                                events={events}
                                currentTime={currentTime}
                            />
                        </div>
                        <AIAssistant members={members} attendanceRecords={attendanceRecords} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
