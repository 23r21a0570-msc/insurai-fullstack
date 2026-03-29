import { useState, useRef } from 'react';
import { Upload, X, Download, Plus, Eye } from 'lucide-react';
import { cn, formatFileSize, formatRelativeTime, formatDateTime } from '@/lib/utils';
import { getClaimNotes } from '@/lib/mockData';
import { Button, Modal } from '@/components/UI';
import { useToast } from '@/lib/contexts';
import type { ClaimDocument, ClaimNote } from '@/types';

// ─── ClaimNotes ───────────────────────────────────────────────────────────────
export const ClaimNotes = ({ claimId }: { claimId: string }) => {
  const { success } = useToast();
  const [notes, setNotes]     = useState<ClaimNote[]>(getClaimNotes(claimId));
  const [content, setContent] = useState('');
  const [saving, setSaving]   = useState(false);

  const handleAdd = async () => {
    if (!content.trim()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    const newNote: ClaimNote = {
      id: `note_${Date.now()}`, claimId,
      authorId: 'user_1', authorName: 'Maruthi', authorRole: 'admin',
      content: content.trim(), createdAt: new Date().toISOString(),
    };
    setNotes(p => [newNote, ...p]);
    setContent('');
    setSaving(false);
    success('Note added', 'Your note has been saved.');
  };

  const roleColors: Record<string, string> = { admin: 'text-purple-400', manager: 'text-emerald-400', analyst: 'text-blue-400', agent: 'text-amber-400' };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Add an internal note…"
          rows={3}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 resize-none"
        />
        <div className="flex justify-end">
          <Button size="sm" onClick={handleAdd} isLoading={saving} disabled={!content.trim()} leftIcon={<Plus size={14} />}>Add Note</Button>
        </div>
      </div>
      {notes.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-6">No notes yet. Be the first to add one.</p>
      ) : (
        <div className="space-y-3 max-h-72 overflow-y-auto">
          {notes.map(note => (
            <div key={note.id} className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-200">{note.authorName}</span>
                  <span className={cn('text-[10px] font-bold uppercase', roleColors[note.authorRole] ?? 'text-gray-400')}>{note.authorRole}</span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">{formatRelativeTime(note.createdAt)}</span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{note.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── ClaimAttachments ─────────────────────────────────────────────────────────
export const ClaimAttachments = ({ documents: initial }: { documents: ClaimDocument[] }) => {
  const { success } = useToast();
  const [docs, setDocs]       = useState<ClaimDocument[]>(initial);
  const [dragging, setDragging] = useState(false);
  const [viewDoc, setViewDoc] = useState<ClaimDocument | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newDocs: ClaimDocument[] = Array.from(files).map(f => ({
      id: `doc_${Date.now()}_${Math.random()}`,
      name: f.name, type: f.type, size: f.size,
      uploadedAt: new Date().toISOString(),
    }));
    setDocs(p => [...p, ...newDocs]);
    success(`${files.length} file${files.length > 1 ? 's' : ''} uploaded`, 'Documents attached to this claim.');
  };

  const fileIcon = (type: string) => type.includes('pdf') ? '📄' : type.includes('image') ? '🖼️' : type.includes('zip') ? '📦' : '📎';

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={cn('border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors', dragging ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]')}
      >
        <Upload className="mx-auto text-gray-500 mb-2" size={24} />
        <p className="text-sm text-gray-400 font-medium">Drag & drop files here</p>
        <p className="text-xs text-gray-600 mt-1">or click to browse — PDF, ZIP, JPG, PNG</p>
        <input ref={inputRef} type="file" className="hidden" multiple onChange={e => handleFiles(e.target.files)} />
      </div>

      {/* Files list */}
      {docs.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">No attachments yet.</p>
      ) : (
        <div className="space-y-2">
          {docs.map(doc => (
            <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 group hover:border-emerald-500/30 transition-colors">
              <span className="text-2xl leading-none">{fileIcon(doc.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate">{doc.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(doc.size)} · {formatDateTime(doc.uploadedAt)}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setViewDoc(doc)} className="p-1.5 rounded hover:bg-white/10 text-gray-500 hover:text-white" aria-label="Preview"><Eye size={14} /></button>
                <button className="p-1.5 rounded hover:bg-white/10 text-gray-500 hover:text-white" aria-label="Download"><Download size={14} /></button>
                <button onClick={() => setDocs(p => p.filter(d => d.id !== doc.id))} className="p-1.5 rounded hover:bg-red-500/10 text-gray-500 hover:text-red-400" aria-label="Remove"><X size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Viewer Modal */}
      <Modal isOpen={!!viewDoc} onClose={() => setViewDoc(null)} title={viewDoc?.name ?? 'Document Preview'}>
        <div className="flex flex-col items-center justify-center py-12 bg-white/[0.02] rounded-xl border border-white/5">
          <span className="text-6xl mb-4">{viewDoc ? fileIcon(viewDoc.type) : '📎'}</span>
          <p className="text-gray-300 font-medium">{viewDoc?.name}</p>
          <p className="text-sm text-gray-500 mt-1">{viewDoc ? formatFileSize(viewDoc.size) : ''}</p>
          <p className="text-xs text-gray-600 mt-4 max-w-xs text-center">
            {viewDoc?.type.includes('pdf') ? 'PDF preview not available in demo mode.' : viewDoc?.type.includes('image') ? 'Image preview not available in demo mode.' : 'File preview not available in demo mode.'}
          </p>
          <Button variant="secondary" size="sm" className="mt-6" leftIcon={<Download size={14} />}>Download File</Button>
        </div>
      </Modal>
    </div>
  );
};

// ─── DocumentViewer ───────────────────────────────────────────────────────────
export const DocumentViewer = ({ doc, isOpen, onClose }: { doc: ClaimDocument | null; isOpen: boolean; onClose: () => void }) => {
  const fileIcon = (type: string) => type.includes('pdf') ? '📄' : type.includes('image') ? '🖼️' : type.includes('zip') ? '📦' : '📎';
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={doc?.name ?? 'Document'}>
      <div className="flex flex-col items-center justify-center py-12 bg-white/[0.02] rounded-xl border border-white/5">
        <span className="text-6xl mb-4">{doc ? fileIcon(doc.type) : '📎'}</span>
        <p className="text-gray-300 font-medium">{doc?.name}</p>
        <p className="text-sm text-gray-500 mt-1">{doc ? formatFileSize(doc.size) : ''}</p>
        <p className="text-xs text-gray-600 mt-4 text-center">Preview not available in demo mode.</p>
        <Button variant="secondary" size="sm" className="mt-6" leftIcon={<Download size={14} />}>Download</Button>
      </div>
    </Modal>
  );
};
