
import { Event, Member, MemberType } from './types';

const today = new Date();
today.setHours(0, 0, 0, 0);

const setTime = (hours: number, minutes: number) => {
    const date = new Date(today);
    date.setHours(hours, minutes, 0, 0);
    return date;
};

export const EVENTS: Event[] = [
    {
        id: 'evt-001',
        name: 'Sunday Service',
        startTime: setTime(9, 0),
        endTime: setTime(10, 30),
        location: 'Main Auditorium',
        isPrimary: true,
    },
    {
        id: 'evt-002',
        name: 'Choir Rehearsal',
        startTime: setTime(9, 45),
        endTime: setTime(11, 0),
        location: 'Rehearsal Hall',
        isPrimary: false,
    },
    {
        id: 'evt-003',
        name: 'Youth Group',
        startTime: setTime(11, 0),
        endTime: setTime(12, 30),
        location: 'Youth Center',
        isPrimary: false,
    },
];

export const MEMBERS: Member[] = [
    { id: 'mem-001', name: 'John Okoro', type: MemberType.MEMBER },
    { id: 'mem-002', name: 'Mary Uduak', type: MemberType.MEMBER },
    { id: 'mem-003', name: 'Samuel Ajayi', type: MemberType.MEMBER },
    { id: 'mem-004', name: 'Emeka James', type: MemberType.MEMBER },
    { id: 'mem-005', name: 'David Lee', type: MemberType.MEMBER },
    { id: 'mem-006', name: 'Sophia Chen', type: MemberType.MEMBER },
];

export const GRACE_PERIOD_MINUTES = 30;
