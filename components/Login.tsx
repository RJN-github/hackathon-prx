import React, { useState } from 'react';
import { UserRole, Student } from '../types';
import { Briefcase, GraduationCap, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

interface LoginProps {
    students: Student[];
    onLogin: (role: UserRole, userData: any) => void;
}

const Login: React.FC<LoginProps> = ({ students, onLogin }) => {
    const [role, setRole] = useState<UserRole>('Faculty');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (role === 'Faculty') {
            if (email === 'faculty@uni.edu' && password === 'admin123') {
                onLogin('Faculty', { id: 'fac-1', name: 'Dr. Sarah Wilson', email, role: 'Faculty' });
            } else {
                setError('Invalid Faculty credentials');
            }
        } else {
            // Find student by email
            const student = students.find(s => s.email.toLowerCase() === email.toLowerCase());
            if (student && password === 'student123') {
                onLogin('Student', { ...student, role: 'Student' });
            } else {
                setError('Invalid Student credentials or user not found');
            }
        }
    };

    // Pre-fill for demo purposes
    const fillDemo = (demoRole: UserRole) => {
        setRole(demoRole);
        if (demoRole === 'Faculty') {
            setEmail('faculty@uni.edu');
            setPassword('admin123');
        } else {
            setEmail('charlie@uni.edu');
            setPassword('student123');
        }
        setError('');
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center text-white">
                    <div className="mx-auto w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm mb-4">
                        <span className="font-bold text-2xl">A</span>
                    </div>
                    <h1 className="text-2xl font-bold">Welcome Back</h1>
                    <p className="text-blue-100 mt-2 text-sm">Sign in to Attendify AI System</p>
                </div>

                {/* Role Toggles */}
                <div className="flex border-b border-slate-100">
                    <button
                        onClick={() => { setRole('Faculty'); setError(''); }}
                        className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                            role === 'Faculty' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <Briefcase className="w-4 h-4" /> Faculty Portal
                    </button>
                    <button
                        onClick={() => { setRole('Student'); setError(''); }}
                        className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                            role === 'Student' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <GraduationCap className="w-4 h-4" /> Student Portal
                    </button>
                </div>

                {/* Form */}
                <div className="p-8">
                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2 border border-red-100 animate-fade-in">
                                <AlertCircle className="w-4 h-4" /> {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder={role === 'Faculty' ? "faculty@uni.edu" : "student@uni.edu"}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
                        >
                            Sign In <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    {/* Demo Helpers */}
                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <p className="text-xs text-center text-slate-400 mb-3 uppercase tracking-wider font-semibold">Demo Credentials</p>
                        <div className="flex gap-2">
                            <button onClick={() => fillDemo('Faculty')} className="flex-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 py-2 rounded transition-colors">
                                Use Faculty Demo
                            </button>
                            <button onClick={() => fillDemo('Student')} className="flex-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 py-2 rounded transition-colors">
                                Use Student Demo
                            </button>
                        </div>
                        <p className="text-[10px] text-center text-slate-400 mt-2">
                            Faculty: faculty@uni.edu / admin123 <br/>
                            Student: charlie@uni.edu / student123
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;