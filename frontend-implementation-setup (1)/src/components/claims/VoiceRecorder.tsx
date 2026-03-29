import { useState, useRef, useCallback } from 'react';
import { Mic, Square, Trash2, CheckCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useToast } from '@/context/ToastContext';

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
}

export const VoiceRecorder = ({ onTranscript }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { success, error } = useToast();

  const startRecording = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SR) {
      error('Not supported', 'Voice recording is not supported in this browser. Try Chrome.');
      return;
    }

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let final = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript;
        else interim += event.results[i][0].transcript;
      }
      setTranscript((prev) => prev + final || interim);
    };

    recognition.onerror = () => {
      error('Recording error', 'Could not process audio. Please try again.');
      setIsRecording(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
  }, [error]);

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const applyTranscript = useCallback(() => {
    if (!transcript.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      onTranscript(transcript.trim());
      success('Voice transcription applied', 'Your spoken description has been added.');
      setIsProcessing(false);
    }, 600);
  }, [transcript, onTranscript, success]);

  const clearTranscript = () => {
    setTranscript('');
    setRecordingTime(0);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Voice Description</p>
        {isRecording && (
          <span className="flex items-center gap-1.5 text-xs text-red-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            REC {formatTime(recordingTime)}
          </span>
        )}
      </div>

      {/* Waveform visualizer */}
      {isRecording && (
        <div className="flex items-center justify-center gap-0.5 h-10 px-4 rounded-xl bg-red-500/[0.06] border border-red-500/20">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="w-1 bg-red-400 rounded-full animate-pulse"
              style={{
                height: `${Math.random() * 24 + 4}px`,
                animationDelay: `${i * 50}ms`,
                animationDuration: `${400 + Math.random() * 300}ms`,
              }}
            />
          ))}
        </div>
      )}

      {/* Transcript box */}
      {transcript && (
        <div className="relative rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
          <p className="text-sm text-gray-300 leading-relaxed">{transcript}</p>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.06]">
            <button
              onClick={applyTranscript}
              disabled={isProcessing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10B981]/15 text-[#10B981] text-xs font-bold hover:bg-[#10B981]/25 transition-all border border-[#10B981]/20 disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="w-3 h-3 border-2 border-[#10B981]/40 border-t-[#10B981] rounded-full animate-spin" />
              ) : (
                <CheckCircle size={12} />
              )}
              Use This Text
            </button>
            <button
              onClick={clearTranscript}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-500 text-xs font-medium hover:text-red-400 hover:bg-red-400/10 transition-all"
            >
              <Trash2 size={12} /> Clear
            </button>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border',
              'bg-red-500/[0.08] text-red-400 border-red-500/20 hover:bg-red-500/[0.15]'
            )}
          >
            <Mic size={16} /> Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-gray-500/10 text-gray-300 border border-gray-500/20 hover:bg-gray-500/20 transition-all"
          >
            <Square size={16} /> Stop Recording
          </button>
        )}
        <p className="text-xs text-gray-600">
          {isRecording ? 'Speak clearly into your microphone' : 'Click to describe the incident by voice'}
        </p>
      </div>
    </div>
  );
};
