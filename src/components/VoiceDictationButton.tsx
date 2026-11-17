import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2, Volume2, VolumeX } from 'lucide-react';
import { playSound } from '../lib/sounds';

const SPEECH_LANG_MAP: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  bn: 'bn-IN',
  pa: 'pa-IN',
  or: 'or-IN',
  ur: 'ur-IN',
};

interface VoiceDictationButtonProps {
  onTranscript: (text: string) => void;
  language?: string;
  label?: string;
  compact?: boolean;
  className?: string;
}

/**
 * Production Audio & Speech Pipeline Component:
 * Combines real-time Web Speech API interim feedback with MediaRecorder capture
 * and server-side Gemini (`gemini-3.5-transcribe`) fallback so live transcription
 * works across all desktop/mobile browsers and Indian languages.
 */
export const VoiceDictationButton: React.FC<VoiceDictationButtonProps> = ({
  onTranscript,
  language = 'en',
  label = 'Voice Input',
  compact = false,
  className = '',
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechDeliveredRef = useRef<boolean>(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch {}
      }
    };
  }, []);

  const stopRecording = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    } else {
      setIsRecording(false);
    }
  };

  const startRecording = async () => {
    playSound('pop');
    setStatusMessage(null);
    speechDeliveredRef.current = false;
    audioChunksRef.current = [];
    setSeconds(0);

    // 1. Start Web Speech API in parallel for instant live streaming where supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = SPEECH_LANG_MAP[language] || 'en-IN';
        recognition.continuous = true;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
          let finalChunk = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalChunk += event.results[i][0].transcript;
            }
          }
          if (finalChunk.trim()) {
            speechDeliveredRef.current = true;
            onTranscript(finalChunk.trim());
          }
        };

        recognition.onerror = () => {
          // Handled seamlessly by MediaRecorder + Gemini server transcription
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch {
        // Ignore and rely on MediaRecorder
      }
    }

    // 2. Start MediaRecorder for production server-side Gemini 3.5 Transcribe pipeline
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : '';

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);

        // If browser SpeechRecognition didn't already deliver a transcript, send audio to /api/transcribe-audio
        if (!speechDeliveredRef.current && audioChunksRef.current.length > 0) {
          const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
          if (blob.size > 200) {
            setIsTranscribing(true);
            try {
              const base64Audio = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  const res = String(reader.result || '');
                  const b64 = res.includes(',') ? res.split(',')[1] : res;
                  resolve(b64);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });

              const response = await fetch('/api/transcribe-audio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  audioBase64: base64Audio,
                  mimeType: (recorder.mimeType || 'audio/webm').split(';')[0],
                  language,
                }),
              });

              if (response.ok) {
                const data = await response.json();
                if (data.transcript && data.transcript.trim()) {
                  onTranscript(data.transcript.trim());
                }
              } else if (response.status === 429) {
                setStatusMessage('Rate limit reached. Try again in a moment.');
              }
            } catch (err) {
              console.error('Server audio transcription failed:', err);
            } finally {
              setIsTranscribing(false);
            }
          }
        }
      };

      recorder.start(250);
      setIsRecording(true);
      timerRef.current = window.setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } catch (err) {
      // If getUserMedia fails but SpeechRecognition started, keep SpeechRecognition active
      if (recognitionRef.current) {
        setIsRecording(true);
        timerRef.current = window.setInterval(() => {
          setSeconds((s) => s + 1);
        }, 1000);
      } else {
        setStatusMessage('Microphone permission required for voice transcription.');
        setTimeout(() => setStatusMessage(null), 4000);
      }
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={toggleRecording}
        disabled={isTranscribing}
        title={isRecording ? 'Stop live audio transcription' : 'Start live audio transcription (Speech-to-Text)'}
        className={`inline-flex items-center justify-center gap-1.5 rounded-xl font-bold transition-all cursor-pointer select-none ${
          compact ? 'px-2.5 py-2 text-xs' : 'px-3.5 py-2 text-xs'
        } ${
          isRecording
            ? 'bg-red-500/25 border border-red-400 text-red-200 shadow-lg shadow-red-500/20 animate-pulse'
            : isTranscribing
            ? 'bg-indigo-500/20 border border-indigo-400/40 text-indigo-200'
            : 'bg-white/10 hover:bg-white/15 border border-white/15 text-white/80 hover:text-white'
        } ${className}`}
      >
        {isTranscribing ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-300" />
            {!compact && <span>Transcribing...</span>}
          </>
        ) : isRecording ? (
          <>
            <MicOff className="w-3.5 h-3.5 text-red-400" />
            <span>Stop ({formatDuration(seconds)})</span>
          </>
        ) : (
          <>
            <Mic className="w-3.5 h-3.5 text-emerald-400" />
            {!compact && <span>{label}</span>}
          </>
        )}
      </button>
      {statusMessage && (
        <span className="text-[11px] font-semibold text-amber-300">{statusMessage}</span>
      )}
    </div>
  );
};

interface CloudTTSButtonProps {
  text: string;
  language?: string;
  className?: string;
}

/**
 * Production Cloud TTS Button using Gemini 3.8 Flash Lite TTS (`/api/tts`)
 * with instant fallback to browser SpeechSynthesis.
 */
export const CloudTTSButton: React.FC<CloudTTSButtonProps> = ({
  text,
  language = 'en',
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleTogglePlay = async () => {
    playSound('pop');
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      return;
    }

    const cleanText = text
      .replace(/[#*_`~>-]/g, ' ')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 1200);

    if (!cleanText) return;

    setIsLoadingAudio(true);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, language }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          const audio = new Audio(`data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`);
          audioRef.current = audio;
          audio.onended = () => setIsPlaying(false);
          audio.onerror = () => setIsPlaying(false);
          setIsLoadingAudio(false);
          setIsPlaying(true);
          await audio.play();
          return;
        }
      }
    } catch {
      // Fallback to browser SpeechSynthesis below
    }

    setIsLoadingAudio(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = SPEECH_LANG_MAP[language] || 'en-IN';
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <button
      type="button"
      onClick={handleTogglePlay}
      disabled={isLoadingAudio}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
        isPlaying
          ? 'bg-amber-500/20 border-amber-400/40 text-amber-200'
          : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/75 hover:text-white'
      } ${className}`}
    >
      {isLoadingAudio ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-300" />
          <span>Preparing Voice...</span>
        </>
      ) : isPlaying ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-amber-400" />
          <span>Stop Audio</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Listen (Cloud TTS)</span>
        </>
      )}
    </button>
  );
};
