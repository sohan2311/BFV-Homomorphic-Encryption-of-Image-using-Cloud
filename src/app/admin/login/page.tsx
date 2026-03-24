'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Shield, Mail, Lock, ArrowRight, Database, Server, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
            
            const res = await fetch('/api/auth/me');
            const data = await res.json();
            
            if (data.user?.role !== 'ADMIN') {
                toast.error('Unauthorized: Admin access required');
                await fetch('/api/auth/logout', { method: 'POST' });
                router.push('/login');
                return;
            }

            toast.success('Admin authentication verified');
            router.push('/admin/dashboard');
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50/50">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-white border-r border-slate-200/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdHRlcm4gaWQ9ImIiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMTQsIDE2NSwgMjMzLCAwLjA1KSIvPjwvcGF0dGVybj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9InVybCgjYikiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-50" />

                <div className="absolute top-[20%] right-[15%] w-96 h-96 rounded-full opacity-10 blur-[80px] pointer-events-none bg-emerald-400" />
                <div className="absolute bottom-[20%] left-[10%] w-72 h-72 rounded-full opacity-10 blur-[80px] pointer-events-none bg-teal-500" />

                <div className="relative z-10 p-16 max-w-xl text-left">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8 bg-emerald-50 border border-emerald-100 shadow-lg shadow-emerald-500/20">
                        <Database className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 text-slate-900 tracking-tight font-sans">
                        Admin Systems
                    </h1>
                    <p className="text-lg mb-10 text-slate-500 leading-relaxed">
                        Control gateway for the cryptographic platform. Interface directly with hardware queues and manage workload dispatch.
                    </p>
                    <div className="space-y-4">
                        {[
                            { title: 'Task Queue Management', desc: 'Oversee and fulfill pending BFV transformations' },
                            { title: 'Key Provisioning', desc: 'Distribute encryption artifacts securely to clients' }
                        ].map((feature, i) => (
                            <div key={i} className="flex flex-col p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
                                <div className="flex items-center gap-3 mb-1 text-slate-800 font-bold">
                                    <Server className="w-4 h-4 text-emerald-500" />
                                    <span>{feature.title}</span>
                                </div>
                                <span className="text-sm text-slate-500 pl-7">{feature.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative">
                <Link href="/" className="absolute top-8 right-8 text-sm font-semibold text-slate-400 hover:text-emerald-600 transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 rotate-180" /> Gateway
                </Link>

                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-emerald-50 shadow-lg shadow-emerald-500/20 border border-emerald-100">
                            <Database className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 font-sans">Admin Portal</h1>
                    </div>

                    <div className="glass-card-heavy p-8 lg:p-10 animate-fade-in-up">
                        <div className="mb-10 text-center">
                            <h2 className="text-2xl font-bold text-slate-900 font-sans">System Access</h2>
                            <p className="text-sm mt-3 text-slate-500 font-medium">Verify credentials for cluster administration</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-widest mb-2 text-slate-400 ml-1">
                                    Admin Email
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input-field pl-11 focus:border-emerald-500 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.15)]"
                                        placeholder="admin@system.local"
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-widest mb-2 text-slate-400 ml-1">
                                    Admin Password
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input-field pl-11 pr-11 focus:border-emerald-500 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.15)]"
                                        placeholder="••••••••"
                                        required
                                        autoComplete="current-password"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)' }}
                                className="w-full text-white font-bold text-sm tracking-wide rounded-xl flex items-center justify-center gap-2 mt-4 py-3.5 transition-all hover:-translate-y-0.5"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Admin Login <ArrowRight className="w-4 h-4 ml-1" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-3 text-xs text-slate-400 opacity-80">
                        <Shield className="w-4 h-4 text-emerald-500" />
                        <span className="font-mono uppercase tracking-wider text-emerald-700/60">Restricted Dispatch Terminal</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
