import React, { useState } from 'react';
import { LeaveRequest, UserRole, Student } from '../types';
import { Calendar, Check, X, Clock, FileText, Send } from 'lucide-react';

interface LeaveManagerProps {
    role: UserRole;
    currentUser?: Student;
    requests: LeaveRequest[];
    onUpdateRequests: (updated: LeaveRequest[]) => void;
}

const LeaveManager: React.FC<LeaveManagerProps> = ({ role, currentUser, requests, onUpdateRequests }) => {
    const [newReason, setNewReason] = useState('');
    const [newDate, setNewDate] = useState('');

    // Filter requests based on role
    const displayedRequests = role === 'Student' && currentUser
        ? requests.filter(r => r.studentId === currentUser.id)
        : requests;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !newDate || !newReason) return;

        const newRequest: LeaveRequest = {
            id: `l-${Date.now()}`,
            studentId: currentUser.id,
            studentName: currentUser.name,
            date: newDate,
            reason: newReason,
            status: 'Pending'
        };

        onUpdateRequests([...requests, newRequest]);
        setNewReason('');
        setNewDate('');
        alert('Leave request submitted successfully.');
    };

    const handleAction = (id: string, status: 'Approved' | 'Rejected') => {
        const updated = requests.map(r => r.id === id ? { ...r, status } : r);
        onUpdateRequests(updated);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Leave Management</h2>
                    <p className="text-slate-500">
                        {role === 'Student' ? 'Request regularization or medical leave.' : 'Review and approve student leave requests.'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Submission Form (Student Only) */}
                {role === 'Student' && (
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-fit">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <Send className="w-5 h-5 text-blue-500" /> New Request
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Date of Absence</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    value={newDate}
                                    onChange={(e) => setNewDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Medical, Family emergency, Official duty..."
                                    value={newReason}
                                    onChange={(e) => setNewReason(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                Submit Request
                            </button>
                        </form>
                    </div>
                )}

                {/* Request List */}
                <div className={`${role === 'Student' ? 'lg:col-span-2' : 'lg:col-span-3'} bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden`}>
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="text-lg font-semibold text-slate-800">
                            {role === 'Student' ? 'My History' : 'Pending Requests'}
                        </h3>
                    </div>

                    {displayedRequests.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">No requests found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50">
                                <tr>
                                    {role === 'Faculty' && <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Student</th>}
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Reason</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                                    {role === 'Faculty' && <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>}
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                {displayedRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                                        {role === 'Faculty' && <td className="px-6 py-4 font-medium text-slate-900">{req.studentName}</td>}
                                        <td className="px-6 py-4 text-slate-600">{req.date}</td>
                                        <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={req.reason}>{req.reason}</td>
                                        <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                          ${req.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                            req.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}>
                          {req.status === 'Approved' && <Check className="w-3 h-3" />}
                            {req.status === 'Rejected' && <X className="w-3 h-3" />}
                            {req.status === 'Pending' && <Clock className="w-3 h-3" />}
                            {req.status}
                        </span>
                                        </td>
                                        {role === 'Faculty' && (
                                            <td className="px-6 py-4 text-right">
                                                {req.status === 'Pending' && (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleAction(req.id, 'Approved')}
                                                            className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
                                                            title="Approve"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(req.id, 'Rejected')}
                                                            className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                                                            title="Reject"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaveManager;