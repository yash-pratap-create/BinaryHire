import React, { useCallback, useState } from 'react';
import { Upload, File, X, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  currentFile?: string;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = '.pdf,.doc,.docx',
  currentFile,
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState(false);

  const handleFile = useCallback((file: File) => {
    setSelectedFile(file);
    setUploaded(false);
    onFileSelect(file);
    setTimeout(() => setUploaded(true), 800);
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setUploaded(false);
  };

  if (selectedFile) {
    return (
      <div
        className={clsx('rounded-xl p-4', className)}
        style={{ background: '#111116', border: '1px solid #1f1d27' }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ background: uploaded ? 'rgba(95,224,168,0.15)' : 'rgba(201,77,255,0.15)' }}>
            {uploaded ? (
              <CheckCircle size={20} style={{ color: '#5fe0a8' }} />
            ) : (
              <File size={20} style={{ color: '#c94dff' }} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#f2f1f5] truncate">
              {selectedFile.name}
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#8b899a' }}>
              {uploaded ? 'Upload complete' : 'Uploading…'} · {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <button onClick={clearFile} className="p-1.5 rounded-lg text-[#8b899a] hover:text-[#f2f1f5]">
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx('relative', className)}>
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        id="resume-upload"
      />
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className="rounded-xl border-2 border-dashed p-6 text-center transition-all duration-200"
        style={{
          background: isDragging ? 'rgba(201,77,255,0.06)' : '#111116',
          borderColor: isDragging ? '#c94dff' : '#24212c',
        }}
      >
        <div className="flex flex-col items-center gap-2.5">
          <div className="p-3 rounded-xl" style={{ background: '#1a1820' }}>
            <Upload size={20} style={{ color: isDragging ? '#c94dff' : '#8b899a' }} />
          </div>
          <div>
            <p className="text-sm font-medium text-[#f2f1f5]">
              {isDragging ? 'Drop your resume here' : 'Drag & drop resume'}
            </p>
            <p className="text-xs mt-1" style={{ color: '#8b899a' }}>
              or <span className="text-[#c94dff] font-medium">browse files</span> · PDF, DOC, DOCX
            </p>
          </div>
          {currentFile && (
            <p className="text-xs px-3 py-1 rounded-full" style={{ background: '#1a1820', color: '#e0b3ff' }}>
              Current: {currentFile}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
