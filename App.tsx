import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StudentDashboard from './components/StudentDashboard';
import AttendanceTracker from './components/AttendanceTracker';
import GeminiInsights from './components/GeminiInsights';
import LeaveManager from './components/LeaveManager';
import Login from './components/Login';
import { MOCK_STUDENTS, MOCK_SESSIONS, INITIAL_RECORDS, MOCK_LEAVE_REQUESTS } from './constants';
import { AttendanceRecord, UserRole, LeaveRequest, AuthUser } from './types';

const App: React.FC = () => {
    // Authentication State
    const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
    const [currentView, setCurrentView] = useState('dashboard');

    // Database State (Lifted)
    const [students] = useState(MOCK_STUDENTS);
    const [sessions] = useState(MOCK_SESSIONS);
    const [records, setRecords] = useState<AttendanceRecord[]>(INITIAL_RECORDS);
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);

    const handleLogin = (role: UserRole, userData: any) => {
        setCurrentUser({
            ...userData,
            role: role
        });
        setCurrentView('dashboard');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setCurrentView('dashboard');
    };

    const handleRecordUpdate = (newRecords: AttendanceRecord[]) => {
        setRecords(newRecords);
    };

    // If not logged in, show Login Screen
    if (!currentUser) {
        return <Login students={students} onLogin={handleLogin} />;
    }

    // Router Logic
    const renderContent = () => {
        // Role-based routing
        if (currentUser.role === 'Student') {
            const studentProfile = students.find(s => s.id === currentUser.id);
            if (!studentProfile) return <div>Error loading user profile.</div>;

            switch (currentView) {
                case 'dashboard':
                    return <StudentDashboard student={studentProfile} sessions={sessions} records={records} />;
                case 'leaves':
                    return <LeaveManager role="Student" currentUser={studentProfile} requests={leaveRequests} onUpdateRequests={setLeaveRequests} />;
                default:
                    return <StudentDashboard student={studentProfile} sessions={sessions} records={records} />;
            }
        }

        // Faculty Routing
        switch (currentView) {
            case 'dashboard':
                return <Dashboard students={students} sessions={sessions} records={records} leaveRequests={leaveRequests} />;
            case 'tracker':
                return <AttendanceTracker students={students} sessions={sessions} records={records} onSave={handleRecordUpdate} />;
            case 'reports':
                return <GeminiInsights students={students} sessions={sessions} records={records} />;
            case 'leaves':
                return <LeaveManager role="Faculty" requests={leaveRequests} onUpdateRequests={setLeaveRequests} />;
            case 'students':
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Student Directory</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {students.map(s => (
                                <div key={s.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
                                    <img src={s.avatar} alt={s.name} className="w-16 h-16 rounded-full" />
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{s.name}</h3>
                                        <p className="text-slate-500 text-sm">{s.rollNo}</p>
                                        <p className="text-blue-500 text-xs mt-1">{s.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return <div className="p-10 text-center">Page under construction</div>;
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar
                currentView={currentView}
                setCurrentView={setCurrentView}
                user={currentUser}
                onLogout={handleLogout}
            />

            <main className="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default App;