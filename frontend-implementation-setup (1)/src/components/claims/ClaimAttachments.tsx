import { useState, useRef } from 'react';
import { Upload, FileText, FileImage, Archive, X, Download, Eye } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { formatRelativeTime, formatFileSize } from '@/utils/formatters';
import type { ClaimDocument } from '@/types';
import { cn } from '@/utils/cn';

const getFileIcon = (name: string) => {
  if (name.endsWith('.pdf')) return FileText;
  if (name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return FileImage;
  if (name.match(/\.(zip|rar|7z)$/i)) return Archive;
  return FileText;
};

const getFileColor = (name: string) => {
  if (name.endsWith('.pdf')) return 'text-red-400';
  if (name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return 'text-blue-400';
  if (name.match(/\.(zip|rar|7z)$/i)) return 'text-amber-400';
  return 'text-gray-400';
};

interface ClaimAttachmentsProps {
  documents: ClaimDocument[];
  claimNumber: string;
}

export const ClaimAttachments = ({ documents: initialDocs, claimNumber }: ClaimAttachmentsProps) => {
  const { success } = useToast();
  const [docs, setDocs] = useState<ClaimDocument[]>(initialDocs);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const newDocs: ClaimDocument[] = Array.from(files).map((f) => ({
      id: `doc_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name: f.name,
      type: f.type,
      size: f.size,
      uploadedAt: new Date().toISOString(),
    }));
    setDocs((prev) => [...prev, ...newDocs]);
    success('Files uploaded', `${files.length} file(s) attached to ${claimNumber}`);
  };

  const removeDoc = (id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  return (
    <GlassPanel>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
          Attachments ({docs.length})
        </h3>
        <Button size="sm" variant="secondary" leftIcon={<Upload size={13} />} onClick={() => inputRef.current?.click()}>
          Upload
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
          accept=".pdf,.jpg,.jpeg,.png,.zip,.docx,.xlsx"
        />
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-all mb-4',
          isDragging
            ? 'border-[#10B981]/50 bg-[#10B981]/[0.05]'
            : 'border-white/[0.08] hover:border-[#10B981]/30 hover:bg-[#10B981]/[0.02]'
        )}
      >
        <Upload size={22} className={isDragging ? 'text-[#10B981]' : 'text-gray-600'} />
        <p className="text-xs text-gray-500 text-center">
          <span className="font-semibold text-gray-400">Drop files here</span> or click to browse
        </p>
        <p className="text-[10px] text-gray-700">PDF, JPG, PNG, ZIP up to 10MB each</p>
      </div>

      {/* File list */}
      {docs.length > 0 && (
        <div className="space-y-2">
          {docs.map((doc) => {
            const Icon = getFileIcon(doc.name);
            const color = getFileColor(doc.name);
            return (
              <div
                key={doc.id}
                className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 group hover:border-white/[0.10] transition-all"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.05]">
                  <Icon size={15} className={color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">{doc.name}</p>
                  <p className="text-[10px] text-gray-600">
                    {formatFileSize(doc.size)} · {formatRelativeTime(doc.uploadedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 hover:text-blue-400 hover:bg-blue-400/10 transition-all" title="Preview">
                    <Eye size={13} />
                  </button>
                  <button className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 hover:text-[#10B981] hover:bg-[#10B981]/10 transition-all" title="Download">
                    <Download size={13} />
                  </button>
                  <button
                    onClick={() => removeDoc(doc.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all"
                    title="Remove"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {docs.length === 0 && (
        <p className="text-xs text-gray-600 text-center py-2">No attachments yet.</p>
      )}
    </GlassPanel>
  );
};
