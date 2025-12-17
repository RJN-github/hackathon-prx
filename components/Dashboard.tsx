import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, AlertTriangle, CheckCircle, Clock, Download, FileText, FlaskConical, BookOpen } from 'lucide-react';
import { Student, AttendanceRecord, Session, AttendanceStatus, SessionType, LeaveRequest } from '../types';

interface DashboardProps {
    students: Student[];
    sessions: Session[];
    records: AttendanceRecord[];
    leaveRequests: LeaveRequest[];
}

const COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6'];

const Dashboard: React.FC<DashboardProps> = ({ students, sessions, records, leaveRequests }) => {
    // Calculate Stats
    const totalSessions = sessions.length;
    const totalExpectedAttendance = totalSessions * students.length;
    const presentCount = records.filter(r => r.status === AttendanceStatus.Present).length;
    const absentCount = records.filter(r => r.status === AttendanceStatus.Absent).length;
    const lateCount = records.filter(r => r.status === AttendanceStatus.Late).length;

    const overallPercentage = totalExpectedAttendance > 0
        ? Math.round(((presentCount + (lateCount * 0.5)) / totalExpectedAttendance) * 100)
        : 0;

    const atRiskStudents = students.filter(student => {
        const studentRecords = records.filter(r => r.studentId === student.id);
        if (studentRecords.length === 0) return false;
        const p = studentRecords.filter(r => r.status === AttendanceStatus.Present).length;
        const l = studentRecords.filter(r => r.status === AttendanceStatus.Late).length;
        const rate = ((p + (l * 0.5)) / studentRecords.length) * 100;
        return rate < 75;
    });

    const pendingLeaves = leaveRequests.filter(r => r.status === 'Pending').length;

    // Theory vs Practical Stats
    const theorySessions = sessions.filter(s => s.type === SessionType.Theory);
    const practicalSessions = sessions.filter(s => s.type === SessionType.Practical || s.type === SessionType.Hybrid);

    const getPercentage = (subsetSessions: Session[]) => {
        if(subsetSessions.length === 0) return 0;
        const subsetIds = subsetSessions.map(s => s.id);
        const subsetRecords = records.filter(r => subsetIds.includes(r.sessionId));
        const p = subsetRecords.filter(r => r.status === AttendanceStatus.Present).length;
        const l = subsetRecords.filter(r => r.status === AttendanceStatus.Late).length;
        const total = subsetSessions.length * students.length;
        return total === 0 ? 0 : Math.round(((p + l*0.5)/total)*100);
    }

    const theoryPct = getPercentage(theorySessions);
    const practicalPct = getPercentage(practicalSessions);

    // Prepare Chart Data - Session Wise Attendance
    const sessionData = sessions.map(session => {
        const sessionRecords = records.filter(r => r.sessionId === session.id);
        const p = sessionRecords.filter(r => r.status === AttendanceStatus.Present).length;
        const a = sessionRecords.filter(r => r.status === AttendanceStatus.Absent).length;
        const l = sessionRecords.filter(r => r.status === AttendanceStatus.Late).length;
        return {
            name: session.date.substring(5), // MM-DD
            type: session.type,
            Present: p,
            Absent: a,
            Late: l
        };
    });

    const distributionData = [
        { name: 'Present', value: presentCount },
        { name: 'Absent', value: absentCount },
        { name: 'Late', value: lateCount },
    ];

    const handleExport = () => {
        alert("Downloading attendance_report_fall2023.csv...");
    }

    const StatCard = ({ title, value, icon: Icon, color, subtext }: any) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow">
            <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
                {subtext && <p className={`text-xs mt-2 ${color === 'red' ? 'text-red-500' : 'text-slate-400'}`}>{subtext}</p>}
            </div>
            <div className={`p-3 rounded-lg ${
                color === 'green' ? 'bg-green-100 text-green-600' :
                    color === 'red' ? 'bg-red-100 text-red-600' :
                        color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-blue-100 text-blue-600'
            }`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Faculty Dashboard</h1>
                    <p className="text-slate-500">Overview for CS-301 • {sessions.length} Sessions Conducted</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleExport} className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 text-sm font-medium">
                        <Download className="w-4 h-4" /> Export Report
                    </button>
                    <div className="text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4"/> Term: Fall 2023
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Overall Attendance"
                    value={`${overallPercentage}%`}
                    icon={CheckCircle}
                    color="green"
                    subtext="Target: >85%"
                />
                <StatCard
                    title="At-Risk Students"
                    value={atRiskStudents.length}
                    icon={AlertTriangle}
                    color="red"
                    subtext="Below 75% threshold"
                />
                <StatCard
                    title="Pending Requests"
                    value={pendingLeaves}
                    icon={FileText}
                    color="yellow"
                    subtext="Requires approval"
                />
                <StatCard
                    title="Total Students"
                    value={students.length}
                    icon={Users}
                    color="blue"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white text-indigo-600 rounded-lg shadow-sm"><BookOpen className="w-6 h-6"/></div>
                        <div>
                            <p className="text-indigo-900 font-semibold">Theory Avg</p>
                            <p className="text-indigo-600 text-sm">Lecture sessions</p>
                        </div>
                    </div>
                    <span className="text-2xl font-bold text-indigo-900">{theoryPct}%</span>
                </div>
                <div className="bg-purple-50 border border-purple-100 p-5 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white text-purple-600 rounded-lg shadow-sm"><FlaskConical className="w-6 h-6"/></div>
                        <div>
                            <p className="text-purple-900 font-semibold">Practical Avg</p>
                            <p className="text-purple-600 text-sm">Labs & Hybrid</p>
                        </div>
                    </div>
                    <span className="text-2xl font-bold text-purple-900">{practicalPct}%</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-800 mb-6">Attendance Trends</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sessionData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                                <Bar dataKey="Present" stackId="a" fill="#22c55e" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="Late" stackId="a" fill="#f59e0b" />
                                <Bar dataKey="Absent" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Status Distribution</h3>
                    <div className="h-48 flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={distributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {distributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 border-t border-slate-100 pt-4">
                        <h4 className="text-slate-800 font-medium text-sm flex items-center gap-2 mb-3">
                            <AlertTriangle className="w-4 h-4 text-red-500" /> At-Risk Students
                        </h4>
                        <ul className="space-y-2">
                            {atRiskStudents.slice(0, 3).map(s => (
                                <li key={s.id} className="text-xs flex justify-between items-center bg-red-50 p-2 rounded border border-red-100">
                                    <span className="font-medium text-red-900">{s.name}</span>
                                    <span className="text-red-700 font-bold bg-white px-1.5 rounded text-[10px]">Low</span>
                                </li>
                            ))}
                            {atRiskStudents.length === 0 && <li className="text-xs text-slate-400 italic">No students at risk.</li>}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;