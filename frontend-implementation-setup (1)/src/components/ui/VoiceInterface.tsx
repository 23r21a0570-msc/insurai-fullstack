import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, X, Loader2, MessageSquare } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/context/ToastContext';

interface VoiceCommand {
  command: string;
  action: () => void;
  example: string;
}

const WAKE_WORD = 'insurai';

export const VoiceInterface = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [processing, setProcessing] = useState(false);
  const [pulseSize, setPulseSize] = useState(1);
  const navigate = useNavigate();
  const { success, info } = useToast();
  const intervalRef = useRef<number | null>(null);

  const voiceCommands: VoiceCommand[] = [
    { command: 'go to dashboard', action: () => navigate('/dashboard'), example: 'Go to dashboard' },
    { command: 'show my claims', action: () => navigate('/customer/claims'), example: 'Show my claims' },
    { command: 'file a claim', action: () => navigate('/claims/new'), example: 'File a claim' },
    { command: 'show payments', action: () => navigate('/customer/payments'), example: 'Show payments' },
    { command: 'open policies', action: () => navigate('/customer/policies'), example: 'Open policies' },
    { command: 'go to fraud detection', action: () => navigate('/fraud'), example: 'Go to fraud detection' },
    { command: 'show analytics', action: () => navigate('/analytics/advanced'), example: 'Show analytics' },
    { command: 'help', action: () => setResponse('You can say: "Go to dashboard", "Show my claims", "File a claim", "Show payments", "Open policies"'), example: 'Help' },
  ];

  const processVoiceInput = (input: string) => {
    setProcessing(true);
    const lower = input.toLowerCase().replace(WAKE_WORD, '').trim();

    setTimeout(() => {
      const matched = voiceCommands.find(vc => lower.includes(vc.command));
      if (matched) {
        setResponse(`Navigating to ${matched.example}...`);
        setTimeout(() => {
          matched.action();
          success('Voice Command', `Executed: ${matched.example}`);
          setIsOpen(false);
          setTranscript('');
          setResponse('');
        }, 800);
      } else if (lower.includes('status') || lower.includes('claim')) {
        setResponse('Your most recent claim CLM-2024-1042 is currently Under Review. Expected completion in 2-3 days.');
      } else if (lower.includes('payment') || lower.includes('due')) {
        setResponse('Your next payment of $195 is due on January 20th. Would you like me to process it now?');
      } else if (lower.includes('balance') || lower.includes('policy')) {
        setResponse('You have 2 active policies: Auto Premium ($195/mo) and Home Basic ($85/mo). Both are in good standing.');
      } else {
        setResponse("I didn't quite catch that. Try saying 'Help' to see available commands, or navigate naturally like 'Show my claims'.");
      }
      setProcessing(false);
    }, 1200);
  };

  const simulateListening = () => {
    if (isListening) {
      setIsListening(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    setIsListening(true);
    setTranscript('');
    setResponse('');

    // Simulate voice recognition with demo text
    const demoCommands = ['Show my claims', 'What is my claim status?', 'Go to payments', 'Open policies'];
    const chosen = demoCommands[Math.floor(Math.random() * demoCommands.length)];

    let i = 0;
    intervalRef.current = window.setInterval(() => {
      if (i <= chosen.length) {
        setTranscript(chosen.slice(0, i));
        i++;
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsListening(false);
        processVoiceInput(chosen);
      }
    }, 60);
  };

  // Animate the mic pulse
  useEffect(() => {
    if (!isListening) { setPulseSize(1); return; }
    const interval = setInterval(() => {
      setPulseSize(prev => prev === 1 ? 1.15 : 1);
    }, 500);
    return () => clearInterval(interval);
  }, [isListening]);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <>
      {/* Floating Voice Button */}
      <button
        onClick={() => { setIsOpen(true); info('Voice Interface', 'Click the mic to start a voice command'); }}
        className="fixed bottom-28 right-6 z-40 w-12 h-12 rounded-full bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/30 flex items-center justify-center transition-all hover:scale-110"
        aria-label="Open voice interface"
        title="Voice Commands (Say 'INSURAI...')"
      >
        <Mic size={20} />
      </button>

      {/* Voice Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-end justify-center p-4 sm:items-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#0F1629] border border-white/10 shadow-2xl overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Volume2 className="text-violet-400" size={20} />
                <span className="font-bold">Voice Interface</span>
              </div>
              <button
                onClick={() => { setIsOpen(false); setIsListening(false); if (intervalRef.current) clearInterval(intervalRef.current); }}
                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mic Visualizer */}
            <div className="flex flex-col items-center py-10 px-6">
              <div className="relative mb-6">
                {/* Pulse rings */}
                {isListening && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-violet-500/10 animate-ping" style={{ animationDuration: '1.5s' }} />
                    <div className="absolute inset-0 rounded-full bg-violet-500/5 animate-ping" style={{ animationDuration: '2s' }} />
                  </>
                )}
                <button
                  onClick={simulateListening}
                  className={cn(
                    'relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg',
                    isListening
                      ? 'bg-violet-600 shadow-violet-500/40'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  )}
                  style={{ transform: `scale(${pulseSize})` }}
                  aria-label={isListening ? 'Stop listening' : 'Start listening'}
                >
                  {isListening ? (
                    <MicOff size={32} className="text-white" />
                  ) : (
                    <Mic size={32} className="text-violet-400" />
                  )}
                </button>
              </div>

              {/* Status */}
              <p className="text-sm font-medium text-gray-400 mb-4">
                {isListening ? '🎙️ Listening...' : processing ? '🤔 Processing...' : '👆 Click to speak'}
              </p>

              {/* Transcript */}
              {(transcript || processing) && (
                <div className="w-full p-3 rounded-xl bg-white/5 border border-white/5 mb-4 min-h-[48px] flex items-center">
                  {processing ? (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Loader2 size={14} className="animate-spin" />
                      <span className="text-sm">Processing "{transcript}"...</span>
                    </div>
                  ) : (
                    <p className="text-sm text-white">"{transcript}"</p>
                  )}
                </div>
              )}

              {/* Response */}
              {response && (
                <div className="w-full p-4 rounded-xl bg-violet-500/5 border border-violet-500/20 mb-4">
                  <div className="flex items-start gap-2">
                    <MessageSquare size={16} className="text-violet-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-200">{response}</p>
                  </div>
                </div>
              )}

              {/* Example commands */}
              <div className="w-full">
                <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">Try saying:</p>
                <div className="flex flex-wrap gap-2">
                  {['Show my claims', 'File a claim', 'Go to payments', 'Help'].map(cmd => (
                    <button
                      key={cmd}
                      onClick={() => { setTranscript(cmd); processVoiceInput(cmd); }}
                      className="text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/5"
                    >
                      "{cmd}"
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
