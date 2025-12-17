import { Student, Session, SessionType, AttendanceStatus, AttendanceRecord, LeaveRequest } from './types';

export const MOCK_STUDENTS: Student[] = [
    { id: '1', name: 'Alice Johnson', rollNo: 'CS-001', email: 'alice@uni.edu', avatar: 'https://picsum.photos/seed/alice/200/200' },
    { id: '2', name: 'Bob Smith', rollNo: 'CS-002', email: 'bob@uni.edu', avatar: 'https://picsum.photos/seed/bob/200/200' },
    { id: '3', name: 'Charlie Brown', rollNo: 'CS-003', email: 'charlie@uni.edu', avatar: 'https://picsum.photos/seed/charlie/200/200' },
    { id: '4', name: 'Diana Prince', rollNo: 'CS-004', email: 'diana@uni.edu', avatar: 'https://picsum.photos/seed/diana/200/200' },
    { id: '5', name: 'Evan Wright', rollNo: 'CS-005', email: 'evan@uni.edu', avatar: 'https://picsum.photos/seed/evan/200/200' },
    { id: '6', name: 'Fiona Gallagher', rollNo: 'CS-006', email: 'fiona@uni.edu', avatar: 'https://picsum.photos/seed/fiona/200/200' },
    { id: '7', name: 'George Miller', rollNo: 'CS-007', email: 'george@uni.edu', avatar: 'https://picsum.photos/seed/george/200/200' },
    { id: '8', name: 'Hannah Abbott', rollNo: 'CS-008', email: 'hannah@uni.edu', avatar: 'https://picsum.photos/seed/hannah/200/200' },
];

export const MOCK_SESSIONS: Session[] = [
    { id: 's1', date: '2023-10-01', type: SessionType.Theory, topic: 'Introduction to React', totalStudents: 8 },
    { id: 's2', date: '2023-10-03', type: SessionType.Practical, topic: 'Lab: Component Basics', totalStudents: 8 },
    { id: 's3', date: '2023-10-05', type: SessionType.Hybrid, topic: 'State Management', totalStudents: 8 },
    { id: 's4', date: '2023-10-08', type: SessionType.Theory, topic: 'Hooks Deep Dive', totalStudents: 8 },
    { id: 's5', date: '2023-10-10', type: SessionType.Practical, topic: 'Lab: Custom Hooks', totalStudents: 8 },
    { id: 's6', date: '2023-10-12', type: SessionType.Theory, topic: 'Context API', totalStudents: 8 },
    { id: 's7', date: '2023-10-15', type: SessionType.Practical, topic: 'Lab: Global State', totalStudents: 8 },
];

// Generate some random attendance history
export const INITIAL_RECORDS: AttendanceRecord[] = [];

MOCK_SESSIONS.forEach(session => {
    MOCK_STUDENTS.forEach(student => {
        const rand = Math.random();
        let status = AttendanceStatus.Present;
        if (rand > 0.85) status = AttendanceStatus.Absent;
        else if (rand > 0.75) status = AttendanceStatus.Late;

        // Make Charlie have bad attendance for demo purposes
        if (student.name.includes('Charlie') && Math.random() > 0.4) {
            status = AttendanceStatus.Absent;
        }

        INITIAL_RECORDS.push({
            id: `${session.id}-${student.id}`,
            sessionId: session.id,
            studentId: student.id,
            status,
            timestamp: new Date().toISOString()
        });
    });
});

export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
    { id: 'l1', studentId: '3', studentName: 'Charlie Brown', date: '2023-10-12', reason: 'Medical appointment', status: 'Pending' },
    { id: 'l2', studentId: '1', studentName: 'Alice Johnson', date: '2023-10-05', reason: 'Family emergency', status: 'Approved' },
];