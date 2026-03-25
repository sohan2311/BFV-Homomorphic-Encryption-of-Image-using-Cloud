'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import {
    Upload,
    Download,
    LayoutDashboard,
    LogOut,
    Shield,
    Cpu,
    ChevronRight,
} from 'lucide-react';
import PlatformDetails from '@/components/PlatformDetails';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
                    <p style={{ color: '#64748b' }} className="text-sm mono-text">Loading secure session...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    const userLinks = [
        { href: '/user/upload', label: 'Upload Image', icon: Upload },
        { href: '/user/download', label: 'Task Tracker', icon: Download },
    ];

    const adminLinks = [
        { href: '/admin/dashboard', label: 'Admin Hub', icon: LayoutDashboard },
    ];

    const navLinks = user.role === 'ADMIN' ? [...adminLinks, ...userLinks] : userLinks;

    return (
        <div className="min-h-screen flex bg-grid">
            {/* Sidebar */}
            <aside
                className="w-64 flex flex-col border-r fixed h-full z-20"
                style={{
                    background: 'rgba(13, 19, 33, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderColor: 'rgba(30, 41, 59, 0.5)',
                }}
            >
                {/* Logo area */}
                <div className="p-6 border-b" style={{ borderColor: 'rgba(30, 41, 59, 0.5)' }}>
                    <Link href="/" className="flex items-center gap-3 group">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-105"
                            style={{
                                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(8, 145, 178, 0.1))',
                                boxShadow: '0 0 20px rgba(6, 182, 212, 0.1)',
                            }}
                        >
                            <Cpu className="w-5 h-5" style={{ color: '#22d3ee' }} />
                        </div>
                        <div>
                            <h1 className="text-sm font-bold" style={{ color: '#f1f5f9' }}>BFV Portal</h1>
                            <p className="text-[10px] mono-text" style={{ color: '#475569' }}>v2.0 · ENCRYPTED</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest mb-3 px-3" style={{ color: '#475569' }}>
                        Navigation
                    </p>
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`sidebar-link ${isActive ? 'active' : ''}`}
                            >
                                <link.icon className="w-4 h-4" />
                                <span className="flex-1">{link.label}</span>
                                {isActive && <ChevronRight className="w-3 h-3" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* User section */}
                <div className="p-4 border-t" style={{ borderColor: 'rgba(30, 41, 59, 0.5)' }}>
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold"
                            style={{
                                background: user.role === 'ADMIN'
                                    ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.1))'
                                    : 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(8, 145, 178, 0.1))',
                                color: user.role === 'ADMIN' ? '#fbbf24' : '#22d3ee',
                            }}
                        >
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate" style={{ color: '#f1f5f9' }}>
                                {user.name}
                            </p>
                            <p className="text-[10px] mono-text truncate" style={{ color: '#64748b' }}>
                                {user.role === 'ADMIN' ? (
                                    <span className="flex items-center gap-1">
                                        <Shield className="w-2.5 h-2.5" style={{ color: '#fbbf24' }} />
                                        ADMIN
                                    </span>
                                ) : (
                                    user.email
                                )}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="sidebar-link w-full hover:!bg-red-500/10 hover:!text-red-400 hover:!border-red-500/20"
                        style={{ border: '1px solid transparent' }}
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 ml-64 flex flex-col min-h-screen">
                <div className="p-8 max-w-7xl mx-auto flex-1 w-full">
                    {children}
                </div>
                
                {/* Platform Documentation Footer */}
                <div className="w-full mt-auto">
                    <PlatformDetails />
                </div>
            </main>
        </div>
    );
}
