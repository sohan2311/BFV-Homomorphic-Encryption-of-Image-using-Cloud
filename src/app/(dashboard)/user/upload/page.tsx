'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { Upload, Image, Shield, CheckCircle, AlertCircle, FileImage, X } from 'lucide-react';

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

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

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const res = await fetch('/api/tasks', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            toast.success('🔒 Image securely transmitted for encryption processing', {
                duration: 5000,
            });
            setUploadSuccess(true);
            setFile(null);
            setPreview(null);
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
                        <p className="text-sm" style={{ color: '#334155' }}>Submit images for BFV homomorphic encryption processing</p>
                    </div>
                </div>
            </div>

            {/* Upload zone */}
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
                            <br />Check the <strong>My Tasks</strong> page to monitor progress.
                        </p>
                        <button onClick={() => setUploadSuccess(false)} className="btn-primary">
                            Upload Another Image
                        </button>
                    </div>
                ) : (
                    <>
                        <div
                            {...getRootProps()}
                            className={`dropzone ${isDragActive ? 'active' : ''}`}
                        >
                            <input {...getInputProps()} />
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
                                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
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
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                        style={{ background: 'rgba(6, 182, 212, 0.08)' }}
                                    >
                                        {isDragActive ? (
                                            <FileImage className="w-8 h-8" style={{ color: '#0891b2' }} />
                                        ) : (
                                            <Image className="w-8 h-8" style={{ color: '#334155' }} />
                                        )}
                                    </div>
                                    <p className="text-lg font-semibold mb-2" style={{ color: isDragActive ? '#0891b2' : '#475569' }}>
                                        {isDragActive ? 'Drop your image here' : 'Drag & drop your image here'}
                                    </p>
                                    <p className="text-sm mb-4" style={{ color: '#475569' }}>
                                        or click to browse files
                                    </p>
                                    <div className="flex items-center justify-center gap-4 text-xs" style={{ color: '#475569' }}>
                                        <span className="mono-text">PNG, JPG</span>
                                        <span>•</span>
                                        <span className="mono-text">Max 10MB</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {file && (
                            <div className="mt-6 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs" style={{ color: '#334155' }}>
                                    <Shield className="w-3 h-3" />
                                    <span className="mono-text">Encrypted transfer · End-to-end secure</span>
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
                                            Submit for Processing
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    {
                        icon: Upload,
                        title: 'Upload',
                        desc: 'Submit your raw image file to the secure pipeline',
                    },
                    {
                        icon: Shield,
                        title: 'Process',
                        desc: 'Hardware accelerator performs BFV encryption on FPGA',
                    },
                    {
                        icon: AlertCircle,
                        title: 'Retrieve',
                        desc: 'Download encrypted .mem file & decryption cipher key',
                    },
                ].map((card, i) => (
                    <div key={i} className="glass-card p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ background: 'rgba(6, 182, 212, 0.08)' }}
                            >
                                <card.icon className="w-4 h-4" style={{ color: '#06b6d4' }} />
                            </div>
                            <span className="text-xs font-bold uppercase" style={{ color: '#475569' }}>
                                Step {i + 1}
                            </span>
                        </div>
                        <h3 className="font-semibold text-sm mb-1" style={{ color: '#0f172a' }}>
                            {card.title}
                        </h3>
                        <p className="text-xs" style={{ color: '#334155' }}>{card.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
