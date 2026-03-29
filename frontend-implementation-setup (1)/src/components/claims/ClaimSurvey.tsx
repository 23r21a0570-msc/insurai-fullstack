import { useState } from 'react';
import { Star, Send, CheckCircle, MessageSquare } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useToast } from '@/context/ToastContext';

interface SurveyData {
  overall: number;
  adjusterRating: number;
  speedRating: number;
  communicationRating: number;
  comment: string;
  recommend: boolean | null;
}

const SURVEY_QUESTIONS = [
  { key: 'overall', label: 'Overall Experience' },
  { key: 'adjusterRating', label: 'Adjuster Professionalism' },
  { key: 'speedRating', label: 'Speed of Resolution' },
  { key: 'communicationRating', label: 'Communication Quality' },
] as const;

const StarRating = ({ value, onChange, disabled }: { value: number; onChange: (v: number) => void; disabled?: boolean }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          disabled={disabled}
          onClick={() => onChange(star)}
          onMouseEnter={() => !disabled && setHovered(star)}
          onMouseLeave={() => !disabled && setHovered(0)}
          className="transition-transform hover:scale-110 disabled:cursor-default"
          aria-label={`${star} star`}
        >
          <Star
            size={20}
            className={cn(
              'transition-colors',
              (hovered || value) >= star ? 'text-amber-400 fill-amber-400' : 'text-gray-700'
            )}
          />
        </button>
      ))}
    </div>
  );
};

export const ClaimSurvey = ({ claimNumber }: { claimNumber: string }) => {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [survey, setSurvey] = useState<SurveyData>({
    overall: 0, adjusterRating: 0, speedRating: 0, communicationRating: 0,
    comment: '', recommend: null,
  });
  const { success } = useToast();

  const setRating = (key: keyof SurveyData, value: number) => {
    setSurvey((prev) => ({ ...prev, [key]: value }));
  };

  const canSubmit = survey.overall > 0 && survey.adjusterRating > 0 && survey.recommend !== null;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    setSubmitted(true);
    success('Survey submitted', `Thank you for your feedback on claim ${claimNumber}!`);
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] p-6 flex flex-col items-center gap-3 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center">
          <CheckCircle size={24} className="text-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-emerald-400">Thank you for your feedback!</p>
          <p className="text-xs text-gray-500 mt-1">Your responses help us improve our service.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
      <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
        <MessageSquare size={15} className="text-[#10B981]" />
        <div>
          <p className="text-sm font-bold text-gray-200">Claim Experience Survey</p>
          <p className="text-xs text-gray-500">Your claim {claimNumber} has been resolved — share your feedback</p>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Star ratings */}
        {SURVEY_QUESTIONS.map((q) => (
          <div key={q.key} className="flex items-center justify-between gap-4">
            <p className="text-sm text-gray-300">{q.label}</p>
            <StarRating
              value={survey[q.key as keyof SurveyData] as number}
              onChange={(v) => setRating(q.key as keyof SurveyData, v)}
            />
          </div>
        ))}

        {/* Recommend */}
        <div>
          <p className="text-sm text-gray-300 mb-3">Would you recommend us to a friend?</p>
          <div className="flex gap-3">
            {[
              { label: '👍 Yes, definitely!', value: true },
              { label: '👎 No, not really', value: false },
            ].map((opt) => (
              <button
                key={String(opt.value)}
                onClick={() => setSurvey((prev) => ({ ...prev, recommend: opt.value }))}
                className={cn(
                  'flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all',
                  survey.recommend === opt.value
                    ? opt.value
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                      : 'border-red-500/30 bg-red-500/10 text-red-400'
                    : 'border-white/[0.08] text-gray-500 hover:border-white/[0.15]'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="text-xs text-gray-500 mb-2 block">Additional comments (optional)</label>
          <textarea
            rows={3}
            value={survey.comment}
            onChange={(e) => setSurvey((prev) => ({ ...prev, comment: e.target.value }))}
            placeholder="Tell us about your experience..."
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-[#10B981]/40 resize-none transition-all"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit || isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#10B981]/15 text-[#10B981] font-bold text-sm border border-[#10B981]/20 hover:bg-[#10B981]/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-[#10B981]/30 border-t-[#10B981] rounded-full animate-spin" />
          ) : (
            <Send size={15} />
          )}
          Submit Feedback
        </button>
      </div>
    </div>
  );
};
