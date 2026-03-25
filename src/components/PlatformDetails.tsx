import { Shield, Cpu, Lock, Network, Zap, Fingerprint } from 'lucide-react';

export default function PlatformDetails() {
    return (
        <div className="w-full mt-24 pt-16 pb-20 border-t relative z-10 bg-slate-50/50" style={{ borderColor: 'rgba(30, 41, 59, 0.1)' }}>
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-4 font-sans tracking-tight">
                        About the Platform
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        The BFV Encryption Gateway is a dedicated hardware-software pipeline built to execute computation on encrypted data without ever decrypting it, ensuring zero-knowledge privacy.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="glass-card p-8 hover:-translate-y-1 transition-transform duration-300">
                        <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center mb-6 shadow-sm border border-cyan-100">
                            <Shield className="w-6 h-6 text-cyan-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-3">Homomorphic Encryption</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Using the Brakerski-Fan-Vercauteren (BFV) scheme, data remains strictly in ciphertext form during operations. Computations are mathematically mapped so the end result identical to processing raw data, fundamentally solving the privacy-utility tradeoff.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="glass-card p-8 hover:-translate-y-1 transition-transform duration-300">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6 shadow-sm border border-blue-100">
                            <Cpu className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-3">Dual-Node FPGA Architecture</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Homomorphic operations require intensive polynomial multiplications executed on cluster FPGAs. Once processed, the receiver securely decrypts the computed `.mem` ciphertext strictly using their own local edge FPGA hardware.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="glass-card p-8 hover:-translate-y-1 transition-transform duration-300">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-6 shadow-sm border border-emerald-100">
                            <Lock className="w-6 h-6 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-3">Strict Tenant Isolation</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Our routing architecture enforces asymmetric access. Senders input raw payloads but cannot retrieve processed files. Receivers obtain the `.mem` arrays for local hardware decryption but can never access the raw origin inputs.
                        </p>
                    </div>

                    {/* Feature 4 */}
                    <div className="glass-card p-8 hover:-translate-y-1 transition-transform duration-300">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-6 shadow-sm border border-indigo-100">
                            <Network className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-3">Secure Cloud Transport</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Every transition—from client ingest to the FPGA cluster, back to cloud storage—is TLS-wrapped. Data resting in our Supabase vaults is perpetually encrypted, and database records use row-level security.
                        </p>
                    </div>

                    {/* Feature 5 */}
                    <div className="glass-card p-8 hover:-translate-y-1 transition-transform duration-300">
                        <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center mb-6 shadow-sm border border-violet-100">
                            <Zap className="w-6 h-6 text-violet-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-3">Admin Hub Management</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Privileged administrators oversee the pipeline health, catching stalled processing jobs and fulfilling ciphertext computations. The gateway is completely auditable and tracked in real-time.
                        </p>
                    </div>

                    {/* Feature 6 */}
                    <div className="glass-card p-8 hover:-translate-y-1 transition-transform duration-300">
                        <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center mb-6 shadow-sm border border-rose-100">
                            <Fingerprint className="w-6 h-6 text-rose-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-3">Identity Verification</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            No open endpoints. Every payload transfer demands a verified recipient constraint. Users are required to cross-check target emails via a secure directory search before the ingest zone will even authorize a transmission.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
