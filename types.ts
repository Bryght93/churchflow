
export enum CheckinStatus {
  PRESENT = 'Present',
  LATE = 'Present (Late)',
  ABSENT = 'Absent',
}

export enum MemberType {
    MEMBER = 'Member',
    NEWCOMER = 'Newcomer',
}

export interface Event {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  location: string;
  isPrimary: boolean;
}

export interface Member {
  id: string;
  name: string;
  type: MemberType;
}

export interface AttendanceRecord {
  memberId: string;
  memberName: string;
  memberType: MemberType;
  status: CheckinStatus;
  checkinTime: Date | null;
  eventId: string;
  eventName: string;
}

export interface AIAnalysisResult {
    atRiskMembers: {
        name: string;
        suggestion: string;
    }[];
}
