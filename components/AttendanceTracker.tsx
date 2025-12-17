import React, { useState } from 'react';
import { Student, Session, AttendanceRecord, AttendanceStatus, SessionType } from '../types';
import { Calendar, Save, Check, X, Clock, QrCode, Wifi, Smartphone, Users } from 'lucide-react';

interface AttendanceTrackerProps {
    students: Student[];
    sessions: Session[];
    records: AttendanceRecord[];
    onSave: (newRecords: AttendanceRecord[]) => void;
}

type CaptureMode = 'Manual' | 'QR' | 'OTP';

const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({ students, sessions, records, onSave }) => {
    const [selectedSessionId, setSelectedSessionId] = useState<string>(sessions[sessions.length - 1]?.id || '');
    const [captureMode, setCaptureMode] = useState<CaptureMode>('Manual');
    const [currentChanges, setCurrentChanges] = useState<Record<string, AttendanceStatus>>({});

    const currentSession = sessions.find(s => s.id === selectedSessionId);

    // Get current status for a student (merged saved records + unsaved changes)
    const getStatus = (studentId: string) => {
        if (currentChanges[studentId]) return currentChanges[studentId];
        const record = records.find(r => r.sessionId === selectedSessionId && r.studentId === studentId);
        return record ? record.status : null; // Null means not yet marked
    };

    const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
        setCurrentChanges(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const handleSave = () => {
        if (!selectedSessionId) return;

        const newRecordsList: AttendanceRecord[] = [];

        // Process all students
        students.forEach(student => {
            const status = currentChanges[student.id];
            // Only proceed if there is a change or a status is set
            if (status) {
                newRecordsList.push({
                    id: `${selectedSessionId}-${student.id}`,
                    sessionId: selectedSessionId,
                    studentId: student.id,
                    status: status,
                    timestamp: new Date().toISOString()
                });
            } else {
                const existing = records.find(r => r.sessionId === selectedSessionId && r.studentId === student.id);
                if (existing) newRecordsList.push(existing);
            }
        });

        const otherRecords = records.filter(r => r.sessionId !== selectedSessionId);
        onSave([...otherRecords, ...newRecordsList]);
        setCurrentChanges({});
        alert('Attendance saved successfully!');
    };

    const markAll = (status: AttendanceStatus) => {
        const updates: Record<string, AttendanceStatus> = {};
        students.forEach(s => {
            updates[s.id] = status;
        });
        setCurrentChanges(updates);
    };

    return (
        <div className="space-y-6">
            {/* Header & Controls */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Attendance Tracker</h2>
                        <p className="text-slate-500">Session management & real-time tracking</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <select
                                className="appearance-none bg-slate-50 border border-slate-300 text-slate-900 py-2.5 pl-4 pr-10 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-medium"
                                value={selectedSessionId}
                                onChange={(e) => {
                                    setSelectedSessionId(e.target.value);
                                    setCurrentChanges({});
                                }}
                            >
                                {sessions.map(s => (
                                    <option key={s.id} value={s.id}>{s.date} - {s.topic} ({s.type})</option>
                                ))}
                            </select>
                            <Calendar className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                        <button
                            onClick={handleSave}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-6 rounded-lg flex items-center gap-2 transition-colors shadow-sm font-medium"
                        >
                            <Save className="w-4 h-4" /> Save
                        </button>
                    </div>
                </div>

                {currentSession && (
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Mode Selector */}
                        <div className="flex gap-2 p-1 bg-slate-100 rounded-lg w-fit h-fit">
                            {(['Manual', 'QR', 'OTP'] as CaptureMode[]).map(mode => (
                                <button
                                    key={mode}
                                    onClick={() => setCaptureMode(mode)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                                        captureMode === mode ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    {mode === 'Manual' && <Users className="w-4 h-4" />}
                                    {mode === 'QR' && <QrCode className="w-4 h-4" />}
                                    {mode === 'OTP' && <Wifi className="w-4 h-4" />}
                                    {mode}
                                </button>
                            ))}
                        </div>

                        {/* Session Info */}
                        <div className="flex-1 flex flex-wrap gap-4 items-center p-3 bg-blue-50 rounded-lg border border-blue-100 text-blue-900">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">Type:</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full border bg-white border-blue-200`}>
                      {currentSession.type}
                    </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">Topic:</span>
                                <span className="text-sm">{currentSession.topic}</span>
                            </div>
                            <div className="flex items-center gap-2 ml-auto">
                                <span className="text-sm font-semibold">Total Students:</span>
                                <span className="text-sm font-bold">{students.length}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Mode Specific Views */}
            {captureMode === 'QR' && (
                <div className="bg-slate-900 text-white p-12 rounded-xl flex flex-col items-center justify-center text-center animate-fade-in shadow-xl">
                    <div className="bg-white p-4 rounded-xl mb-6">
                        <QrCode className="w-48 h-48 text-slate-900" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Scan to Check-In</h3>
                    <p className="text-slate-400 mb-6">Students can scan this code using the Attendify App to mark their presence.</p>
                    <div className="flex items-center gap-2 text-sm text-green-400 bg-green-900/30 px-4 py-2 rounded-full border border-green-800">
                        <Wifi className="w-4 h-4 animate-pulse" /> Live Sync Active
                    </div>
                </div>
            )}

            {captureMode === 'OTP' && (
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-12 rounded-xl flex flex-col items-center justify-center text-center animate-fade-in shadow-xl">
                    <h3 className="text-xl font-medium opacity-80 mb-4">Session OTP</h3>
                    <div className="text-7xl font-mono font-bold tracking-[1rem] mb-6">4829</div>
                    <p className="text-indigo-200 mb-2">Share this code with students joining remotely.</p>
                    <p className="text-xs text-indigo-300">Code expires in 04:59</p>
                </div>
            )}

            {/* Manual List (Always visible below or as main view) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                        <Smartphone className="w-4 h-4" /> Student List
                    </h3>
                    <button onClick={() => markAll(AttendanceStatus.Present)} className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline">
                        Mark All Present
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="border-b border-slate-200">
                            <th className="py-3 px-4 text-slate-500 font-medium text-sm">Student</th>
                            <th className="py-3 px-4 text-slate-500 font-medium text-sm">Roll No</th>
                            <th className="py-3 px-4 text-slate-500 font-medium text-sm text-center">Status</th>
                            <th className="py-3 px-4 text-slate-500 font-medium text-sm text-right">Manual Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {students.map((student) => {
                            const status = getStatus(student.id);
                            const isUnsaved = currentChanges[student.id] !== undefined;

                            return (
                                <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full object-cover" />
                                            <span className="font-medium text-slate-900">{student.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-slate-600 text-sm">{student.rollNo}</td>
                                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${status === AttendanceStatus.Present ? 'bg-green-100 text-green-700 border-green-200' :
                          status === AttendanceStatus.Absent ? 'bg-red-100 text-red-700 border-red-200' :
                              status === AttendanceStatus.Late ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                  'bg-slate-100 text-slate-500 border-slate-200'
                      }
                      `}>
                        {status || 'Not Marked'}
                          {isUnsaved && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 ml-1"></span>}
                      </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex justify-end gap-1">
                                            <button
                                                onClick={() => handleStatusChange(student.id, AttendanceStatus.Present)}
                                                className={`p-2 rounded-md transition-all ${status === AttendanceStatus.Present ? 'bg-green-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-200'}`}
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(student.id, AttendanceStatus.Late)}
                                                className={`p-2 rounded-md transition-all ${status === AttendanceStatus.Late ? 'bg-yellow-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-200'}`}
                                            >
                                                <Clock className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(student.id, AttendanceStatus.Absent)}
                                                className={`p-2 rounded-md transition-all ${status === AttendanceStatus.Absent ? 'bg-red-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-200'}`}
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendanceTracker;