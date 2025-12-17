import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Calendar, CheckCircle, XCircle, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { Student, Session, AttendanceRecord, AttendanceStatus } from '../types';

interface StudentDashboardProps {
    student: Student;
    sessions: Session[];
    records: AttendanceRecord[];
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ student, sessions, records }) => {
    const myRecords = records.filter(r => r.studentId === student.id);

    const presentCount = myRecords.filter(r => r.status === AttendanceStatus.Present).length;
    const lateCount = myRecords.filter(r => r.status === AttendanceStatus.Late).length;
    const absentCount = myRecords.filter(r => r.status === AttendanceStatus.Absent).length;
    const excusedCount = myRecords.filter(r => r.status === AttendanceStatus.Excused).length;

    const totalSessions = myRecords.length;
    // Weighted percentage: Present = 1, Late = 0.5, Excused = 1 (usually doesn't count against, but for simplicity let's say it's neutral or counts as present for calculation purposes depending on policy. Here we treat Excused as Present for simplicity)
    // Standard logic: Percentage = (Present + Late*0.5) / Total
    const score = presentCount + (lateCount * 0.5) + excusedCount;
    const percentage = totalSessions > 0 ? (score / totalSessions) * 100 : 0;

    // Projection Logic: How many more classes to reach 75%?
    // Target: (Score + x) / (Total + x) = 0.75
    // Score + x = 0.75*Total + 0.75x => 0.25x = 0.75*Total - Score => x = (0.75*Total - Score) / 0.25
    const targetThreshold = 75;
    let classesNeeded = 0;
    if (percentage < targetThreshold) {
        const numerator = (targetThreshold / 100 * totalSessions) - score;
        const denominator = 1 - (targetThreshold / 100);
        classesNeeded = Math.ceil(numerator / denominator);
        if (classesNeeded < 0) classesNeeded = 0;
    }

    const chartData = sessions.map(session => {
        const record = myRecords.find(r => r.sessionId === session.id);
        return {
            date: session.date.substring(5),
            status: record ? (record.status === 'Present' ? 1 : record.status === 'Late' ? 0.5 : 0) : 0,
            type: record?.status || 'Unknown'
        };
    }).slice(-10); // Last 10 sessions

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Attendance Portal</h1>
                    <p className="text-slate-500">Welcome back, {student.name}</p>
                </div>
                <div className={`px-4 py-2 rounded-lg font-bold text-white shadow-sm ${percentage >= 75 ? 'bg-green-500' : 'bg-red-500'}`}>
                    Current Standing: {percentage.toFixed(1)}%
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Classes Attended</p>
                        <h3 className="text-2xl font-bold text-slate-900">{presentCount}</h3>
                    </div>
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg"><CheckCircle className="w-6 h-6"/></div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Classes Missed</p>
                        <h3 className="text-2xl font-bold text-slate-900">{absentCount}</h3>
                    </div>
                    <div className="p-3 bg-red-100 text-red-600 rounded-lg"><XCircle className="w-6 h-6"/></div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Late Arrivals</p>
                        <h3 className="text-2xl font-bold text-slate-900">{lateCount}</h3>
                    </div>
                    <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg"><Clock className="w-6 h-6"/></div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Total Sessions</p>
                        <h3 className="text-2xl font-bold text-slate-900">{totalSessions}</h3>
                    </div>
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Calendar className="w-6 h-6"/></div>
                </div>
            </div>

            {/* Projection & Alerts */}
            {percentage < 75 && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 flex items-start gap-4">
                    <div className="p-3 bg-white rounded-full shadow-sm text-orange-500">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-orange-800">Attendance Warning</h3>
                        <p className="text-orange-700 mt-1">
                            Your attendance is below the mandatory 75% threshold.
                            You need to attend approximately <strong className="text-orange-900 bg-orange-200 px-2 py-0.5 rounded">{classesNeeded}</strong> consecutive upcoming classes to recover to 75%.
                        </p>
                    </div>
                </div>
            )}

            {/* Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" /> Recent Attendance History
                </h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, 1]} ticks={[0, 0.5, 1]} tickFormatter={(val) => val === 1 ? 'P' : val === 0.5 ? 'L' : 'A'} />
                            <Tooltip
                                cursor={{fill: '#f1f5f9'}}
                                content={({active, payload}) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div className="bg-slate-800 text-white text-xs p-2 rounded shadow-lg">
                                                <p className="font-bold">{data.date}</p>
                                                <p>Status: {data.type}</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar dataKey="status" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40}>
                                {
                                    chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={
                                            entry.type === 'Present' ? '#22c55e' :
                                                entry.type === 'Late' ? '#f59e0b' : '#ef4444'
                                        } />
                                    ))
                                }
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;