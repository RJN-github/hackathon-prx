import React from 'react';
import { LayoutDashboard, CheckSquare, Users, BarChart3, Settings, LogOut, Briefcase, GraduationCap, ClipboardList } from 'lucide-react';
import { UserRole, AuthUser } from '../types';

interface SidebarProps {
    currentView: string;
    setCurrentView: (view: string) => void;
    user: AuthUser;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, user, onLogout }) => {

    const facultyItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'tracker', label: 'Mark Attendance', icon: CheckSquare },
        { id: 'students', label: 'Students', icon: Users },
        { id: 'leaves', label: 'Leave Requests', icon: ClipboardList },
        { id: 'reports', label: 'AI Reports', icon: BarChart3 },
    ];

    const studentItems = [
        { id: 'dashboard', label: 'My Stats', icon: LayoutDashboard },
        { id: 'leaves', label: 'Request Leave', icon: ClipboardList },
    ];

    const navItems = user.role === 'Faculty' ? facultyItems : studentItems;

    return (
        <div className="w-20 lg:w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 shadow-xl">
            <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-700 bg-slate-900">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-0 lg:mr-3 shadow-lg shadow-blue-500/30">
                    <span className="font-bold text-white">A</span>
                </div>
                <span className="font-bold text-xl hidden lg:block tracking-tight">Attendify</span>
            </div>

            <div className="px-4 py-4">
                <div className="bg-slate-800 rounded-lg p-3 flex items-center justify-center lg:justify-start gap-3 border border-slate-700">
                    <div className={`p-1.5 rounded-md ${user.role === 'Faculty' ? 'bg-purple-500' : 'bg-emerald-500'}`}>
                        {user.role === 'Faculty' ? <Briefcase className="w-4 h-4"/> : <GraduationCap className="w-4 h-4"/>}
                    </div>
                    <div className="hidden lg:block overflow-hidden">
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{user.role}</p>
                        <p className="text-sm font-bold truncate">{user.name}</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-3 py-2 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setCurrentView(item.id)}
                            className={`w-full flex items-center py-3 px-3 rounded-lg transition-all duration-200 group relative ${
                                isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                            <span className="ml-3 font-medium hidden lg:block">{item.label}</span>
                            {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full opacity-20 hidden lg:block"></div>}
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-700 bg-slate-900">
                <button className="flex items-center text-slate-400 hover:text-white transition-colors w-full p-2 hover:bg-slate-800 rounded-lg mb-2">
                    <Settings className="w-5 h-5" />
                    <span className="ml-3 hidden lg:block text-sm">Settings</span>
                </button>
                <button
                    onClick={onLogout}
                    className="flex items-center text-red-400 hover:text-white hover:bg-red-500/20 transition-all w-full p-2 rounded-lg"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="ml-3 hidden lg:block text-sm">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;