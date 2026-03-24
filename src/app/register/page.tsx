'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Shield, Mail, Lock, User, UserPlus, ArrowRight, Fingerprint, Activity, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await register(name, email, password);
            toast.success('Clearance granted. Please authenticate.');
            router.push('/login');
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50/50">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-white border-r border-slate-200/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdHRlcm4gaWQ9ImIiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMTQsIDE2NSwgMjMzLCAwLjA1KSIvPjwvcGF0dGVybj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9InVybCgjYikiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-50" />

                <div className="absolute top-[20%] right-[15%] w-96 h-96 rounded-full opacity-10 blur-[80px] pointer-events-none bg-cyan-400" />
                <div className="absolute bottom-[20%] left-[10%] w-72 h-72 rounded-full opacity-10 blur-[80px] pointer-events-none bg-blue-500" />

                <div className="relative z-10 p-16 max-w-xl text-left">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8 bg-cyan-50 border border-cyan-100 shadow-lg shadow-cyan-500/20">
                        <Fingerprint className="w-8 h-8 text-cyan-600" />
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 text-slate-900 tracking-tight font-sans">
                        Client Initialization
                    </h1>
                    <p className="text-lg mb-10 text-slate-500 leading-relaxed">
                        Request cryptographic clearance to interact with the hardware-accelerated BFV processing cluster.
                    </p>
                    <div className="space-y-4">
                        {[
                            { title: 'Isolated Workspaces', desc: 'Strict zero-knowledge boundaries between tenants' },
                            { title: 'Secure Key Exchange', desc: 'Asymmetric distribution of homomorphic cipher keys' }
                        ].map((feature, i) => (
                            <div key={i} className="flex flex-col p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
                                <div className="flex items-center gap-3 mb-1 text-slate-800 font-bold">
                                    <Activity className="w-4 h-4 text-cyan-500" />
                                    <span>{feature.title}</span>
                                </div>
                                <span className="text-sm text-slate-500 pl-7">{feature.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel - Registration Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative">
                <Link href="/" className="absolute top-8 right-8 text-sm font-semibold text-slate-400 hover:text-cyan-600 transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 rotate-180" /> Gateway
                </Link>

                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-cyan-50 shadow-lg shadow-cyan-500/20 border border-cyan-100">
                            <Fingerprint className="w-8 h-8 text-cyan-600" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 font-sans">Register</h1>
                    </div>

                    <div className="glass-card-heavy p-8 lg:p-10 animate-fade-in-up">
                        <div className="mb-10 text-center">
                            <h2 className="text-2xl font-bold text-slate-900 font-sans">Request Clearance</h2>
                            <p className="text-sm mt-3 text-slate-500 font-medium">Establish a secure workspace identity</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-widest mb-2 text-slate-400 ml-1">
                                    Name
                                </label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="input-field pl-11"
                                        placeholder="John Doe"
                                        required
                                        autoComplete="name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-widest mb-2 text-slate-400 ml-1">
                                    User Email
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input-field pl-11"
                                        placeholder="user@example.com"
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-widest mb-2 text-slate-400 ml-1">
                                    Password
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input-field pl-11 pr-11"
                                        placeholder="Minimum 6 characters"
                                        required
                                        minLength={6}
                                        autoComplete="new-password"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-widest mb-2 text-slate-400 ml-1">
                                    Verify Password
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="input-field pl-11 pr-11"
                                        placeholder="Re-enter password"
                                        required
                                        minLength={6}
                                        autoComplete="new-password"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full flex items-center justify-center gap-2 mt-4 py-3.5"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Register <ArrowRight className="w-4 h-4 ml-1" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center pt-6 border-t border-slate-100">
                            <p className="text-sm font-medium text-slate-500">
                                Already have clearance?{' '}
                                <Link href="/login" className="font-bold text-cyan-600 hover:text-cyan-500 transition-colors">
                                    Authenticate
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-3 text-xs text-slate-400 opacity-80">
                        <Shield className="w-4 h-4 text-cyan-500" />
                        <span className="font-mono uppercase tracking-wider">AES-256 Transport • TEE Enabled</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
