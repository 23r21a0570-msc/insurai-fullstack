import { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { formatRelativeTime } from '@/utils/formatters';
import type { ClaimNote, UserRole } from '@/types';
import { cn } from '@/utils/cn';

const roleColor: Record<UserRole, string> = {
  admin: 'bg-purple-500/15 text-purple-400',
  manager: 'bg-blue-500/15 text-blue-400',
  analyst: 'bg-amber-500/15 text-amber-400',
  agent: 'bg-gray-500/15 text-gray-400',
  customer: 'bg-emerald-500/15 text-emerald-400',
};

const getInitials = (name: string) =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

interface ClaimNotesProps {
  claimId: string;
  notes: ClaimNote[];
}

export const ClaimNotes = ({ notes: initialNotes }: ClaimNotesProps) => {
  const { user } = useAuth();
  const { success } = useToast();
  const [notes, setNotes] = useState<ClaimNote[]>(initialNotes);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));

    const newNote: ClaimNote = {
      id: `note_${Date.now()}`,
      claimId: '',
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [...prev, newNote]);
    setContent('');
    setIsSubmitting(false);
    success('Note added', 'Your note has been saved.');
  };

  return (
    <GlassPanel>
      <div className="flex items-center gap-2 mb-5">
        <MessageSquare size={15} className="text-gray-500" />
        <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
          Notes ({notes.length})
        </h3>
      </div>

      {/* Notes list */}
      <div className="space-y-4 mb-5">
        {notes.length === 0 && (
          <p className="text-xs text-gray-600 text-center py-6">No notes yet. Add the first one below.</p>
        )}
        {notes.map((note) => (
          <div key={note.id} className="flex gap-3">
            <div className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
              roleColor[note.authorRole]
            )}>
              {getInitials(note.authorName)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-gray-300">{note.authorName}</span>
                <span className={cn('text-[9px] font-bold uppercase px-1.5 py-0.5 rounded', roleColor[note.authorRole])}>
                  {note.authorRole}
                </span>
                <span className="text-[10px] text-gray-600 ml-auto tabular-nums">
                  {formatRelativeTime(note.createdAt)}
                </span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed bg-white/[0.02] border border-white/[0.05] rounded-lg px-3 py-2.5">
                {note.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add note form */}
      <form onSubmit={handleSubmit} className="border-t border-white/[0.06] pt-4">
        <div className="flex gap-3">
          <div className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
            user ? roleColor[user.role] : 'bg-gray-500/15 text-gray-400'
          )}>
            {getInitials(user?.name ?? 'U')}
          </div>
          <div className="flex-1 space-y-2">
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Add a note about this claim..."
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-[#10B981]/40 resize-none transition-all"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                size="sm"
                isLoading={isSubmitting}
                disabled={!content.trim()}
                leftIcon={<Send size={13} />}
              >
                Add Note
              </Button>
            </div>
          </div>
        </div>
      </form>
    </GlassPanel>
  );
};
