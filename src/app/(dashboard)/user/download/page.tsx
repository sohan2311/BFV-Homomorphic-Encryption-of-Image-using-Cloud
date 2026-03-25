'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
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
    Send,
    Inbox,
    Eye,
} from 'lucide-react';

interface Task {
    id: string;
    originalImageUrl: string;
    memFileUrl: string | null;
    cipherKey: string | null;
    status: 'PENDING_ADMIN' | 'PROCESSED_READY' | 'DOWNLOADED';
    createdAt: string;
    sender: {
        name: string;
        email: string;
    };
    receiver: {
        name: string;
        email: string;
    };
}

export default function DownloadPage() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'RECEIVED' | 'SENT'>('RECEIVED');

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
        if (user) {
            fetchTasks();
        }
    }, [user]);

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
            
            // Mark as downloaded if it's currently PROCESSED_READY
            if (task.status === 'PROCESSED_READY') {
                markAsDownloaded(task.id);
            }
        } catch {
            toast.error('Download failed');
        }
    };

    const handleCopyCipherKey = (task: Task) => {
        if (!task.cipherKey) return;
        navigator.clipboard.writeText(task.cipherKey);
        toast.success('Cipher key copied to clipboard');
        
        if (task.status === 'PROCESSED_READY') {
            markAsDownloaded(task.id);
        }
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
        
        if (task.status === 'PROCESSED_READY') {
            markAsDownloaded(task.id);
        }
    };

    const markAsDownloaded = async (taskId: string) => {
        try {
            const res = await fetch(`/api/tasks/${taskId}/downloaded`, {
                method: 'POST'
            });
            if (res.ok) {
                setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'DOWNLOADED' } : t));
            }
        } catch (err) {
            console.error('Failed to mark downloaded', err);
        }
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

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" style={{ color: '#06b6d4' }} />
                    <p className="text-sm mono-text" style={{ color: '#334155' }}>Loading task tracker...</p>
                </div>
            </div>
        );
    }

    const receivedTasks = tasks.filter(t => t.receiver.email === user.email);
    const sentTasks = tasks.filter(t => t.sender.email === user.email);
    const displayTasks = activeTab === 'RECEIVED' ? receivedTasks : sentTasks;

    return (
        <div className="animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: 'rgba(6, 182, 212, 0.1)' }}
                    >
                        <FileText className="w-5 h-5" style={{ color: '#0891b2' }} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: '#0f172a' }}>Task Tracker</h1>
                        <p className="text-sm" style={{ color: '#334155' }}>Monitor payloads sent to you and tracked by you</p>
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

            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6 border-b" style={{ borderColor: 'rgba(30, 41, 59, 0.1)' }}>
                <button
                    onClick={() => setActiveTab('RECEIVED')}
                    className={`px-6 py-3 text-sm font-semibold flex items-center gap-2 transition-all border-b-2`}
                    style={{
                        color: activeTab === 'RECEIVED' ? '#0891b2' : '#64748b',
                        borderColor: activeTab === 'RECEIVED' ? '#0891b2' : 'transparent',
                    }}
                >
                    <Inbox className="w-4 h-4" />
                    Inbox (Sent to Me)
                    <span className="ml-1 text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(6, 182, 212, 0.1)' }}>
                        {receivedTasks.length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('SENT')}
                    className={`px-6 py-3 text-sm font-semibold flex items-center gap-2 transition-all border-b-2`}
                    style={{
                        color: activeTab === 'SENT' ? '#0f172a' : '#64748b',
                        borderColor: activeTab === 'SENT' ? '#0f172a' : 'transparent',
                    }}
                >
                    <Send className="w-4 h-4" />
                    Outbox (Sent by Me)
                    <span className="ml-1 text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(15, 23, 42, 0.1)' }}>
                        {sentTasks.length}
                    </span>
                </button>
            </div>

            {/* Tasks table */}
            {displayTasks.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4" style={{ color: '#475569' }} />
                    <h3 className="text-lg font-semibold mb-2" style={{ color: '#475569' }}>
                        {activeTab === 'RECEIVED' ? 'Inbox empty' : 'No outgoing tracking'}
                    </h3>
                    <p className="text-sm" style={{ color: '#334155' }}>
                        {activeTab === 'RECEIVED' 
                            ? 'When someone sends you an encrypted image, it will appear here.'
                            : "You haven't transmitted any encrypted payloads yet."}
                    </p>
                </div>
            ) : (
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Task ID</th>
                                    <th>{activeTab === 'RECEIVED' ? 'Sender' : 'Recipient'}</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>{activeTab === 'RECEIVED' ? 'Actions' : ''}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayTasks.map((task) => (
                                    <tr key={task.id}>
                                        <td>
                                            <span className="mono-text text-xs" style={{ color: '#475569' }}>
                                                {task.id.slice(0, 8)}...
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium" style={{ color: '#0f172a' }}>
                                                    {activeTab === 'RECEIVED' ? task.sender.name : task.receiver.name}
                                                </span>
                                                <span className="text-xs mono-text" style={{ color: '#475569' }}>
                                                    {activeTab === 'RECEIVED' ? task.sender.email : task.receiver.email}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            {task.status === 'PENDING_ADMIN' ? (
                                                <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#d97706' }}>
                                                    <Clock className="w-3 h-3" />
                                                    Processing (Admin)
                                                </span>
                                            ) : task.status === 'PROCESSED_READY' ? (
                                                <span className="badge badge-processed">
                                                    <CheckCircle className="w-3 h-3" />
                                                    {activeTab === 'SENT' ? 'Task Fulfilled' : 'Ready for Download'}
                                                </span>
                                            ) : (
                                                <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#2563eb' }}>
                                                    <Eye className="w-3 h-3" />
                                                    {activeTab === 'SENT' ? 'Downloaded by Receiver' : 'Downloaded'}
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
                                                {activeTab === 'RECEIVED' && (
                                                    // Download actions for receiver
                                                    (task.status === 'PROCESSED_READY' || task.status === 'DOWNLOADED') && task.memFileUrl ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleDownloadMem(task)}
                                                                className="btn-secondary !py-1.5 !px-3 flex items-center gap-1.5 text-xs"
                                                            >
                                                                <Download className="w-3 h-3" />
                                                                .mem
                                                            </button>
                                                            {task.cipherKey && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleCopyCipherKey(task)}
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
                                                        </>
                                                    ) : activeTab === 'RECEIVED' && task.status === 'PENDING_ADMIN' ? (
                                                        <span className="text-xs mono-text" style={{ color: '#64748b' }}>Waiting on Processing</span>
                                                    ) : null
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
        </div>
    );
}
