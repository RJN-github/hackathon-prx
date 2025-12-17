export enum AttendanceStatus {
    Present = 'Present',
    Absent = 'Absent',
    Late = 'Late',
    Excused = 'Excused'
}

export enum SessionType {
    Theory = 'Theory',
    Practical = 'Practical',
    Hybrid = 'Hybrid'
}

export type UserRole = 'Faculty' | 'Student';

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    rollNo?: string; // Only for students
}

export interface Student {
    id: string;
    name: string;
    rollNo: string;
    email: string;
    avatar: string;
}

export interface Session {
    id: string;
    date: string;
    type: SessionType;
    topic: string;
    totalStudents: number;
}

export interface AttendanceRecord {
    id: string;
    sessionId: string;
    studentId: string;
    status: AttendanceStatus;
    timestamp: string;
}

export interface AnalysisResult {
    summary: string;
    atRiskStudents: string[];
    recommendations: string[];
}

export interface LeaveRequest {
    id: string;
    studentId: string;
    studentName: string;
    date: string;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}