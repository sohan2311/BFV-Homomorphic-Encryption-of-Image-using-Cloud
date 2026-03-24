'use client';

import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import {
    LayoutDashboard,
    Download,
    Upload,
    CheckCircle,
    Clock,
    Loader2,
    RefreshCw,
    X,
    Shield,
    Users,
    FileText,
    Key,
    Send,
} from 'lucide-react';

interface Task {
    id: string;
    userId: string;
    originalFileName: string;
    originalImageUrl: string;
    memFileUrl: string | null;
    cipherKey: string | null;
    status: 'PENDING' | 'PROCESSED';
    createdAt: string;
    updatedAt: string;
    user: {
        name: string;
        email: string;
    };
}

export default function AdminDashboard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [fulfillTaskId, setFulfillTaskId] = useState<string | null>(null);
    const [fulfilling, setFulfilling] = useState(false);
    const [cipherKeyInput, setCipherKeyInput] = useState('');
    const [memFileInput, setMemFileInput] = useState<File | null>(null);
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'PROCESSED'>('ALL');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchTasks = async () => {
        try {
            const res = await fetch('/api/tasks');
            const data = await res.json();
            if (res.ok) {
                setTasks(data.tasks);
            }
        } catch (err) {
            console.error('Failed to fetch tasks:', err);
            toast.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleDownloadImage = async (task: Task) => {
        try {
            const res = await fetch(`/api/files/${task.originalImageUrl}`);
            if (!res.ok) throw new Error('Download failed');
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = task.originalFileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success('Image downloaded');
        } catch {
            toast.error('Download failed');
        }
    };

    const handleFulfill = async (taskId: string) => {
        if (!memFileInput && !cipherKeyInput.trim()) {
            toast.error('Please provide a .mem file or cipher key');
            return;
        }

        setFulfilling(true);
        try {
            const formData = new FormData();
            if (memFileInput) {
                formData.append('memFile', memFileInput);
            }
            if (cipherKeyInput.trim()) {
                formData.append('cipherKey', cipherKeyInput.trim());
            }

            const res = await fetch(`/api/tasks/${taskId}/fulfill`, {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Fulfillment failed');
            }

            toast.success('Task fulfilled! Results are now available to the user.');
            setFulfillTaskId(null);
            setCipherKeyInput('');
            setMemFileInput(null);
            fetchTasks();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Fulfillment failed');
        } finally {
            setFulfilling(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const filteredTasks = tasks.filter((t) => {
        if (filter === 'ALL') return true;
        return t.status === filter;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" style={{ color: '#06b6d4' }} />
                    <p className="text-sm mono-text" style={{ color: '#334155' }}>Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: 'rgba(245, 158, 11, 0.1)' }}
                    >
                        <LayoutDashboard className="w-5 h-5" style={{ color: '#d97706' }} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: '#0f172a' }}>Admin Hub</h1>
                        <p className="text-sm" style={{ color: '#334155' }}>Manage all encryption tasks across the platform</p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setLoading(true);
                        fetchTasks();
                    }}
                    className="btn-secondary flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="glass-card p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(6, 182, 212, 0.08)' }}>
                            <FileText className="w-4 h-4" style={{ color: '#06b6d4' }} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold mono-text" style={{ color: '#0f172a' }}>{tasks.length}</p>
                            <p className="text-xs" style={{ color: '#334155' }}>Total Tasks</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245, 158, 11, 0.08)' }}>
                            <Clock className="w-4 h-4" style={{ color: '#d97706' }} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold mono-text" style={{ color: '#0f172a' }}>
                                {tasks.filter((t) => t.status === 'PENDING').length}
                            </p>
                            <p className="text-xs" style={{ color: '#334155' }}>Pending</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.08)' }}>
                            <CheckCircle className="w-4 h-4" style={{ color: '#059669' }} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold mono-text" style={{ color: '#0f172a' }}>
                                {tasks.filter((t) => t.status === 'PROCESSED').length}
                            </p>
                            <p className="text-xs" style={{ color: '#334155' }}>Processed</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.08)' }}>
                            <Users className="w-4 h-4" style={{ color: '#7c3aed' }} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold mono-text" style={{ color: '#0f172a' }}>
                                {new Set(tasks.map((t) => t.userId)).size}
                            </p>
                            <p className="text-xs" style={{ color: '#334155' }}>Unique Users</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-2 mb-6">
                {(['ALL', 'PENDING', 'PROCESSED'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${filter === f
                                ? 'text-white'
                                : ''
                            }`}
                        style={{
                            background: filter === f
                                ? f === 'PENDING' ? 'rgba(245, 158, 11, 0.15)' : f === 'PROCESSED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(6, 182, 212, 0.15)'
                                : 'rgba(241, 245, 249, 1)',
                            color: filter === f
                                ? f === 'PENDING' ? '#d97706' : f === 'PROCESSED' ? '#059669' : '#0891b2'
                                : '#334155',
                            border: `1px solid ${filter === f
                                    ? f === 'PENDING' ? 'rgba(245, 158, 11, 0.3)' : f === 'PROCESSED' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(6, 182, 212, 0.3)'
                                    : 'transparent'
                                }`,
                        }}
                    >
                        {f} ({f === 'ALL' ? tasks.length : tasks.filter((t) => t.status === f).length})
                    </button>
                ))}
            </div>

            {/* Tasks table */}
            {filteredTasks.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <Shield className="w-12 h-12 mx-auto mb-4" style={{ color: '#475569' }} />
                    <h3 className="text-lg font-semibold mb-2" style={{ color: '#475569' }}>No tasks found</h3>
                    <p className="text-sm" style={{ color: '#334155' }}>
                        {filter !== 'ALL' ? `No ${filter.toLowerCase()} tasks at the moment` : 'No encryption tasks submitted yet'}
                    </p>
                </div>
            ) : (
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Task ID</th>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>File</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTasks.map((task) => (
                                    <tr key={task.id}>
                                        <td>
                                            <span className="mono-text text-xs" style={{ color: '#475569' }}>
                                                {task.id.slice(0, 8)}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="text-sm font-medium" style={{ color: '#0f172a' }}>
                                                {task.user.name}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="text-xs mono-text" style={{ color: '#334155' }}>
                                                {task.user.email}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="text-sm" style={{ color: '#475569' }}>
                                                {task.originalFileName}
                                            </span>
                                        </td>
                                        <td>
                                            {task.status === 'PENDING' ? (
                                                <span className="badge badge-pending">
                                                    <Clock className="w-3 h-3" />
                                                    Pending
                                                </span>
                                            ) : (
                                                <span className="badge badge-processed">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Done
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <span className="text-xs mono-text" style={{ color: '#334155' }}>
                                                {formatDate(task.createdAt)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleDownloadImage(task)}
                                                    className="btn-secondary !py-1.5 !px-3 flex items-center gap-1.5 text-xs"
                                                >
                                                    <Download className="w-3 h-3" />
                                                    Image
                                                </button>
                                                {task.status === 'PENDING' && (
                                                    <button
                                                        onClick={() => {
                                                            setFulfillTaskId(task.id);
                                                            setCipherKeyInput('');
                                                            setMemFileInput(null);
                                                        }}
                                                        className="btn-primary !py-1.5 !px-3 flex items-center gap-1.5 text-xs"
                                                    >
                                                        <Upload className="w-3 h-3" />
                                                        Fulfill
                                                    </button>
                                                )}
                                                {task.status === 'PROCESSED' && (
                                                    <span className="text-xs" style={{ color: '#059669' }}>✓ Fulfilled</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Fulfill Modal */}
            {fulfillTaskId && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)' }}
                    onClick={() => setFulfillTaskId(null)}
                >
                    <div
                        className="glass-card-heavy w-full max-w-lg p-8 animate-fade-in-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: 'rgba(6, 182, 212, 0.1)' }}
                                >
                                    <Upload className="w-5 h-5" style={{ color: '#0891b2' }} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold" style={{ color: '#0f172a' }}>Fulfill Task</h3>
                                    <p className="text-xs mono-text" style={{ color: '#334155' }}>
                                        ID: {fulfillTaskId.slice(0, 8)}...
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setFulfillTaskId(null)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                                style={{ background: 'rgba(30, 41, 59, 0.5)', color: '#475569' }}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-5">
                            {/* .mem file upload */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#475569' }}>
                                    Encrypted .mem File
                                </label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={(e) => setMemFileInput(e.target.files?.[0] || null)}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full p-4 rounded-xl border-2 border-dashed transition-colors text-left"
                                    style={{
                                        borderColor: memFileInput ? '#06b6d4' : '#1e293b',
                                        background: memFileInput ? 'rgba(6, 182, 212, 0.05)' : 'transparent',
                                    }}
                                >
                                    {memFileInput ? (
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5" style={{ color: '#0891b2' }} />
                                            <div>
                                                <p className="text-sm font-medium" style={{ color: '#0f172a' }}>{memFileInput.name}</p>
                                                <p className="text-xs mono-text" style={{ color: '#334155' }}>
                                                    {(memFileInput.size / 1024).toFixed(1)} KB
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <Upload className="w-5 h-5" style={{ color: '#334155' }} />
                                            <p className="text-sm" style={{ color: '#334155' }}>Click to select .mem file</p>
                                        </div>
                                    )}
                                </button>
                            </div>

                            {/* Cipher key */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#475569' }}>
                                    <Key className="inline w-3 h-3 mr-1" />
                                    Decryption Cipher Key
                                </label>
                                <textarea
                                    value={cipherKeyInput}
                                    onChange={(e) => setCipherKeyInput(e.target.value)}
                                    className="input-field mono-text resize-none"
                                    rows={4}
                                    placeholder="Paste the cipher key here..."
                                />
                            </div>

                            {/* Submit */}
                            <button
                                onClick={() => handleFulfill(fulfillTaskId)}
                                disabled={fulfilling || (!memFileInput && !cipherKeyInput.trim())}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                {fulfilling ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Submit & Fulfill Task
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
