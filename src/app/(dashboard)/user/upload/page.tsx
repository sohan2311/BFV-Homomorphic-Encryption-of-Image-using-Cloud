'use client';

import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { Upload, Image, Shield, CheckCircle, AlertCircle, FileImage, X, Search, User } from 'lucide-react';

interface SearchedUser {
    id: string;
    name: string;
    email: string;
}

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchedUser[]>([]);
    const [selectedReceiver, setSelectedReceiver] = useState<SearchedUser | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    // Debounced search
    useEffect(() => {
        if (!searchQuery || selectedReceiver) {
            setSearchResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`);
                if (res.ok) {
                    const data = await res.json();
                    setSearchResults(data.users || []);
                }
            } catch (err) {
                console.error('Search failed', err);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, selectedReceiver]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0];
        if (selectedFile) {
            setFile(selectedFile);
            setUploadSuccess(false);
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result as string);
            reader.readAsDataURL(selectedFile);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
        },
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024, // 10MB
        onDropRejected: (rejections) => {
            const error = rejections[0]?.errors[0];
            if (error?.code === 'file-too-large') {
                toast.error('File must be under 10MB');
            } else if (error?.code === 'file-invalid-type') {
                toast.error('Only PNG and JPG files are accepted');
            } else {
                toast.error('Invalid file');
            }
        },
    });

    const clearFile = () => {
        setFile(null);
        setPreview(null);
        setUploadSuccess(false);
    };

    const handleUpload = async () => {
        if (!file) return;
        if (!selectedReceiver) {
            toast.error('Please select a valid recipient');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('receiverEmail', selectedReceiver.email);

            const res = await fetch('/api/tasks', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            toast.success('🔒 Image securely transmitted to ' + selectedReceiver.name, {
                duration: 5000,
            });
            setUploadSuccess(true);
            setFile(null);
            setPreview(null);
            setSelectedReceiver(null);
            setSearchQuery('');
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="animate-fade-in-up">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(8, 145, 178, 0.1))',
                        }}
                    >
                        <Upload className="w-5 h-5" style={{ color: '#0891b2' }} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: '#0f172a' }}>Upload Image</h1>
                        <p className="text-sm" style={{ color: '#334155' }}>Send images for BFV homomorphic encryption processing to a specific recipient</p>
                    </div>
                </div>
            </div>

            {/* Upload form container */}
            <div className="glass-card p-8 mb-6">
                {uploadSuccess ? (
                    <div className="text-center py-12">
                        <div
                            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                            style={{ background: 'rgba(16, 185, 129, 0.1)' }}
                        >
                            <CheckCircle className="w-10 h-10" style={{ color: '#059669' }} />
                        </div>
                        <h3 className="text-xl font-bold mb-2" style={{ color: '#0f172a' }}>Securely Transmitted</h3>
                        <p className="text-sm mb-6" style={{ color: '#334155' }}>
                            Your image has been queued for hardware-accelerated BFV encryption.
                            <br />It will be available for pickup when processed.
                        </p>
                        <button onClick={() => setUploadSuccess(false)} className="btn-primary">
                            Send Another Image
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Recipient Search */}
                        <div className="mb-8 p-6 rounded-xl border border-slate-200" style={{ background: 'rgba(248, 250, 252, 0.5)' }}>
                            <label className="block text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#0f172a' }}>
                                <User className="w-4 h-4 text-cyan-500" />
                                Recipient Verification
                            </label>
                            
                            <div className="relative">
                                {selectedReceiver ? (
                                    <div className="flex items-center justify-between p-3 rounded-lg border border-cyan-200 bg-cyan-50/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-cyan-100 flex items-center justify-center text-cyan-600 font-bold text-sm">
                                                {selectedReceiver.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold" style={{ color: '#0f172a' }}>{selectedReceiver.name}</p>
                                                <p className="text-xs font-mono" style={{ color: '#475569' }}>{selectedReceiver.email}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setSelectedReceiver(null);
                                                setSearchQuery('');
                                            }}
                                            className="p-2 hover:bg-cyan-100 rounded-lg transition-colors"
                                        >
                                            <X className="w-4 h-4 text-slate-500" />
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                {isSearching ? (
                                                    <div className="w-4 h-4 border-2 border-slate-300 border-t-cyan-500 rounded-full animate-spin" />
                                                ) : (
                                                    <Search className="h-4 w-4 text-slate-400" />
                                                )}
                                            </div>
                                            <input
                                                type="text"
                                                className="input-field pl-10 w-full"
                                                placeholder="Search by name or email..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        
                                        {/* Dropdown results */}
                                        {searchResults.length > 0 && (
                                            <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden max-h-60 overflow-y-auto">
                                                {searchResults.map((user) => (
                                                    <button
                                                        key={user.id}
                                                        onClick={() => {
                                                            setSelectedReceiver(user);
                                                            setSearchResults([]);
                                                        }}
                                                        className="w-full text-left px-4 py-3 hover:bg-slate-50 flex flex-col transition-colors border-b border-slate-100 last:border-0"
                                                    >
                                                        <span className="text-sm font-medium text-slate-900">{user.name}</span>
                                                        <span className="text-xs font-mono text-slate-500">{user.email}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {searchQuery.length > 2 && searchResults.length === 0 && !isSearching && (
                                            <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow border border-red-200 p-3 flex items-start gap-2 text-red-600">
                                                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium">User not found</p>
                                                    <p className="text-xs opacity-80 mt-1">Please check the email/name and try again. You cannot send files to yourself or Admin accounts.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Upload zone */}
                        <div
                            {...getRootProps()}
                            className={`dropzone ${isDragActive ? 'active' : ''} ${!selectedReceiver ? 'opacity-50 pointer-events-none cursor-not-allowed' : ''}`}
                        >
                            <input {...getInputProps()} disabled={!selectedReceiver} />
                            {preview ? (
                                <div className="relative inline-block">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="max-h-48 rounded-lg mx-auto mb-4"
                                        style={{ border: '1px solid rgba(30, 41, 59, 0.6)' }}
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            clearFile();
                                        }}
                                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                                        style={{ background: '#dc2626', color: 'white' }}
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                    <p className="text-sm mono-text" style={{ color: '#475569' }}>
                                        {file?.name} ({((file?.size || 0) / 1024 / 1024).toFixed(2)} MB)
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors"
                                        style={{ background: 'rgba(6, 182, 212, 0.08)' }}
                                    >
                                        {isDragActive ? (
                                            <FileImage className="w-8 h-8" style={{ color: '#0891b2' }} />
                                        ) : (
                                            <Image className="w-8 h-8" style={{ color: '#334155' }} />
                                        )}
                                    </div>
                                    <p className="text-lg font-semibold mb-2" style={{ color: isDragActive ? '#0891b2' : '#475569' }}>
                                        {!selectedReceiver 
                                            ? 'Select a recipient first' 
                                            : isDragActive 
                                                ? 'Drop your image here' 
                                                : 'Drag & drop image for ' + selectedReceiver.name}
                                    </p>
                                    <p className="text-sm mb-4" style={{ color: '#475569' }}>
                                        {selectedReceiver && 'or click to browse files'}
                                    </p>
                                    <div className="flex items-center justify-center gap-4 text-xs" style={{ color: '#475569' }}>
                                        <span className="mono-text">PNG, JPG</span>
                                        <span>•</span>
                                        <span className="mono-text">Max 10MB</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {file && selectedReceiver && (
                            <div className="mt-6 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs" style={{ color: '#334155' }}>
                                    <Shield className="w-3 h-3" style={{ color: '#10b981' }} />
                                    <span className="mono-text">Verifying strict isolation transfer to {selectedReceiver.name.split(' ')[0]}</span>
                                </div>
                                <button
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    className="btn-primary flex items-center gap-2"
                                >
                                    {uploading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Encrypting...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4" />
                                            Send to Processor
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>


        </div>
    );
}
