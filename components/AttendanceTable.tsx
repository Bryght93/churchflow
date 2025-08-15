
import React from 'react';
import { Member, AttendanceRecord, Event, CheckinStatus } from '../types';

interface AttendanceTableProps {
    members: Member[];
    attendanceRecords: AttendanceRecord[];
    events: Event[];
    currentTime: Date;
}

const StatusBadge: React.FC<{ status: CheckinStatus }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-semibold rounded-full inline-block";
    let colorClasses = "";
    switch (status) {
        case CheckinStatus.PRESENT:
            colorClasses = "bg-green-100 text-green-800";
            break;
        case CheckinStatus.LATE:
            colorClasses = "bg-yellow-100 text-yellow-800";
            break;
        case CheckinStatus.ABSENT:
            colorClasses = "bg-red-100 text-red-800";
            break;
        default:
            colorClasses = "bg-brand-gray-100 text-brand-gray-800";
    }
    return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>;
};


const AttendanceTable: React.FC<AttendanceTableProps> = ({ members, attendanceRecords, events, currentTime }) => {
    
    const primaryEvent = events.find(e => e.isPrimary);

    const consolidatedRecords = members.map(member => {
        let recordForPrimaryEvent = attendanceRecords.find(r => r.memberId === member.id && r.eventId === primaryEvent?.id);

        if (recordForPrimaryEvent) {
            return recordForPrimaryEvent;
        }

        if (primaryEvent && currentTime > primaryEvent.endTime) {
            return {
                memberId: member.id,
                memberName: member.name,
                memberType: member.type,
                status: CheckinStatus.ABSENT,
                checkinTime: null,
                eventId: primaryEvent.id,
                eventName: primaryEvent.name
            };
        }
        return null;
    }).filter(Boolean) as AttendanceRecord[];

    const otherEventRecords = attendanceRecords.filter(r => !r.eventId.includes(primaryEvent?.id ?? ''));

    const allDisplayRecords = [...consolidatedRecords, ...otherEventRecords].sort((a,b) => {
        if(a.checkinTime && b.checkinTime) return b.checkinTime.getTime() - a.checkinTime.getTime();
        if(a.checkinTime) return -1;
        if(b.checkinTime) return 1;
        return a.memberName.localeCompare(b.memberName);
    });

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-brand-gray-500">
                <thead className="text-xs text-brand-gray-700 uppercase bg-brand-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Name</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Time In</th>
                        <th scope="col" className="px-6 py-3">Type</th>
                        <th scope="col" className="px-6 py-3">Event</th>
                    </tr>
                </thead>
                <tbody>
                    {allDisplayRecords.length === 0 && (
                        <tr className="bg-white border-b">
                            <td colSpan={5} className="px-6 py-4 text-center text-brand-gray-500">
                                No check-ins yet for active events.
                            </td>
                        </tr>
                    )}
                    {allDisplayRecords.map((record, index) => (
                        <tr key={`${record.memberId}-${record.eventId}-${index}`} className="bg-white border-b hover:bg-brand-gray-50">
                            <th scope="row" className="px-6 py-4 font-medium text-brand-gray-900 whitespace-nowrap">
                                {record.memberName}
                            </th>
                            <td className="px-6 py-4">
                                <StatusBadge status={record.status} />
                            </td>
                            <td className="px-6 py-4">
                                {record.checkinTime ? record.checkinTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}
                            </td>
                            <td className="px-6 py-4">{record.memberType}</td>
                            <td className="px-6 py-4">{record.eventName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceTable;
