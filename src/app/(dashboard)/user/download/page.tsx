'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
    Download,
    Key,
    FileText,
    Clock,
    CheckCircle,
    RefreshCw,
    Copy,
    Loader2,
} from 'lucide-react';

interface Task {
    id: string;
    originalFileName: string;
    originalImageUrl: string;
    memFileUrl: string | null;
    cipherKey: string | null;
    status: 'PENDING' | 'PROCESSED';
    createdAt: string;
    updatedAt: string;
}

export default function DownloadPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

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

    const handleDownloadMem = async (task: Task) => {
        if (!task.memFileUrl) return;
        try {
            const res = await fetch(`/api/files/${task.memFileUrl}`);
            if (!res.ok) throw new Error('Download failed');
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `encrypted_${task.id.slice(0, 8)}.mem`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success('Encrypted .mem file downloaded');
        } catch {
            toast.error('Download failed');
        }
    };

    const handleCopyCipherKey = (key: string) => {
        navigator.clipboard.writeText(key);
        toast.success('Cipher key copied to clipboard');
    };

    const handleDownloadCipherKey = (task: Task) => {
        if (!task.cipherKey) return;
        const blob = new Blob([task.cipherKey], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cipher_key_${task.id.slice(0, 8)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Cipher key downloaded');
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" style={{ color: '#06b6d4' }} />
                    <p className="text-sm mono-text" style={{ color: '#334155' }}>Loading encryption tasks...</p>
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
                        style={{ background: 'rgba(6, 182, 212, 0.1)' }}
                    >
                        <Download className="w-5 h-5" style={{ color: '#0891b2' }} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: '#0f172a' }}>My Tasks</h1>
                        <p className="text-sm" style={{ color: '#334155' }}>Track your encryption jobs and download results</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                            <p className="text-xs" style={{ color: '#334155' }}>Processing</p>
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
                            <p className="text-xs" style={{ color: '#334155' }}>Completed</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tasks table */}
            {tasks.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4" style={{ color: '#475569' }} />
                    <h3 className="text-lg font-semibold mb-2" style={{ color: '#475569' }}>No tasks yet</h3>
                    <p className="text-sm" style={{ color: '#334155' }}>
                        Upload an image to start your first encryption task
                    </p>
                </div>
            ) : (
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Task ID</th>
                                    <th>File</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task) => (
                                    <tr key={task.id}>
                                        <td>
                                            <span className="mono-text text-xs" style={{ color: '#475569' }}>
                                                {task.id.slice(0, 8)}...
                                            </span>
                                        </td>
                                        <td>
                                            <span className="text-sm" style={{ color: '#0f172a' }}>
                                                {task.originalFileName}
                                            </span>
                                        </td>
                                        <td>
                                            {task.status === 'PENDING' ? (
                                                <span className="badge badge-pending">
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                    Processing
                                                </span>
                                            ) : (
                                                <span className="badge badge-processed">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Completed
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <span className="text-xs mono-text" style={{ color: '#334155' }}>
                                                {formatDate(task.createdAt)}
                                            </span>
                                        </td>
                                        <td>
                                            {task.status === 'PROCESSED' ? (
                                                <div className="flex items-center gap-2">
                                                    {task.memFileUrl && (
                                                        <button
                                                            onClick={() => handleDownloadMem(task)}
                                                            className="btn-secondary !py-1.5 !px-3 flex items-center gap-1.5 text-xs"
                                                        >
                                                            <Download className="w-3 h-3" />
                                                            .mem
                                                        </button>
                                                    )}
                                                    {task.cipherKey && (
                                                        <>
                                                            <button
                                                                onClick={() => handleCopyCipherKey(task.cipherKey!)}
                                                                className="btn-secondary !py-1.5 !px-3 flex items-center gap-1.5 text-xs"
                                                            >
                                                                <Copy className="w-3 h-3" />
                                                                Copy Key
                                                            </button>
                                                            <button
                                                                onClick={() => handleDownloadCipherKey(task)}
                                                                className="btn-secondary !py-1.5 !px-3 flex items-center gap-1.5 text-xs"
                                                            >
                                                                <Key className="w-3 h-3" />
                                                                Key File
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-xs mono-text animate-pulse-glow" style={{ color: '#d97706' }}>
                                                    Awaiting hardware processing...
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
