'use client';

import Link from 'next/link';
import { Shield, Users, ArrowRight, Database, Fingerprint, UploadCloud, Cpu, Cloud, Key } from 'lucide-react';
import PlatformDetails from '@/components/PlatformDetails';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-16 px-4 sm:px-6 relative overflow-hidden bg-[#f8fafc]">
      {/* Abstract Tech Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdHRlcm4gaWQ9ImIiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMTQsIDE2NSwgMjMzLCAwLjA1KSIvPjwvcGF0dGVybj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9InVybCgjYikiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-50 vector-pulse" />
      
      {/* Floating Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full opacity-20 blur-[100px] pointer-events-none bg-cyan-400" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full opacity-20 blur-[100px] pointer-events-none bg-emerald-400" />
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full opacity-10 blur-[80px] pointer-events-none bg-blue-500 animate-pulse" />

      <div className="z-10 text-center mb-16 animate-fade-in-up">
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-8 bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_rgba(6,182,212,0.15)] glow-cyan group">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-400 to-emerald-400 opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
          <Fingerprint className="w-10 h-10 text-cyan-600 relative z-10" />
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight drop-shadow-sm font-sans">
          BFV Encryption <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500">Gateway</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
          Select your cryptographic access tier to initiate a secure session with the hardware-accelerated homomorphic processing cluster.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl z-10 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        {/* User Card */}
        <Link href="/login" className="group relative block overflow-hidden rounded-3xl bg-white/70 backdrop-blur-2xl border border-white p-1 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(6,182,212,0.2)] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 via-transparent to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative p-8 h-full rounded-2xl bg-white/40 ring-1 ring-slate-100/50">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center mb-6 shadow-inner border border-cyan-200/50">
              <Users className="w-7 h-7 text-cyan-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 font-sans">
              User Portal
            </h2>
            <p className="text-slate-500 mb-10 leading-relaxed">
              Submit raw media for robust BFV encryption processing and securely retrieve your generated .mem files and cipher keys.
            </p>
            <div className="flex items-center justify-between w-full">
              <span className="font-semibold text-cyan-600 bg-cyan-50 px-4 py-2 rounded-xl group-hover:bg-cyan-600 group-hover:text-white transition-colors duration-300">
                Authenticate
              </span>
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-cyan-100 group-hover:text-cyan-600 transition-colors duration-300 text-slate-400">
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </Link>

        {/* Admin Card */}
        <Link href="/admin/login" className="group relative block overflow-hidden rounded-3xl bg-white/70 backdrop-blur-2xl border border-white p-1 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.2)] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative p-8 h-full rounded-2xl bg-white/40 ring-1 ring-slate-100/50">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-6 shadow-inner border border-emerald-200/50">
              <Database className="w-7 h-7 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 font-sans">
              Admin Gateway
            </h2>
            <p className="text-slate-500 mb-10 leading-relaxed">
              Command cluster pipeline tasks, review untrusted image uploads, and fulfill pending hardware processing payloads globally.
            </p>
            <div className="flex items-center justify-between w-full">
              <span className="font-semibold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                Authorized Access
              </span>
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors duration-300 text-slate-400">
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </Link>
      </div>
      
      <div className="w-full max-w-5xl z-10 animate-fade-in-up mt-24 mb-12" style={{ animationDelay: '0.3s' }}>
        <h3 className="text-center text-xs font-bold tracking-widest uppercase text-slate-400 mb-10 font-sans flex items-center justify-center gap-4">
          <span className="h-px bg-slate-200 flex-1 max-w-[100px]" />
          Infrastructure Pipeline
          <span className="h-px bg-slate-200 flex-1 max-w-[100px]" />
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-8 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-cyan-200 via-blue-200 to-emerald-200 z-0" />
          
          {[
            { icon: UploadCloud, title: '1. Initiate Transfer', desc: 'Sender authenticates recipient identity. Payload is submitted into the zero-knowledge ingest zone.', color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-100 shadow-cyan-100/50' },
            { icon: Shield, title: '2. Homomorphic Pass', desc: 'Data undergoes Brakerski-Fan-Vercauteren (BFV) polynomial encryption mapping pixels to ciphertexts.', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100 shadow-blue-100/50' },
            { icon: Cpu, title: '3. Hardware Acceleration', desc: 'Encrypted data is processed by FPGA logic arrays performing secure operations without decryption.', color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100 shadow-indigo-100/50' },
            { icon: Key, title: '4. Receiver FPGA Decryption', desc: 'Receiver securely decrypts the .mem file on their edge node using dedicated FPGA decryption hardware.', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100 shadow-emerald-100/50' }
          ].map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center group">
              <div className={`w-16 h-16 rounded-2xl ${step.bg} flex items-center justify-center mb-5 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-lg border bg-white shadow-sm ring-4 ring-white`}>
                <step.icon className={`w-7 h-7 ${step.color}`} />
              </div>
              <h4 className="font-bold text-slate-800 text-sm mb-2">{step.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[220px]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Detailed Platform Overview Section */}
      <div className="w-full relative z-10 bg-white shadow-t-xl shadow-cyan-900/5 clip-path-top">
        <PlatformDetails />
      </div>

      {/* Footer Info */}
      <div className="relative z-10 flex items-center justify-center gap-3 text-xs text-slate-400 font-mono tracking-widest uppercase opacity-70 mt-auto pt-8 mb-8 pb-8">
        <Shield className="w-3.5 h-3.5" />
        <span>FIPS 140-3 Validated</span>
        <span>•</span>
        <span>Post-Quantum Ready</span>
      </div>
    </div>
  );
}
