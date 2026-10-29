import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Search, Sparkles, Loader2, Baby, MessageCircle, 
  HelpCircle, ChevronRight, RotateCcw, Send, User, 
  Mic, MicOff, RefreshCw, AlertTriangle, ShieldCheck,
  CheckCircle2, Info, ArrowRight, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '../lib/AuthContext';
import { useLanguage } from '../lib/LanguageContext';
import { playSound } from '../lib/sounds';
import { 
  saveAISearchRecord, 
  isPersonalInfoQuery, 
  getResponsibleAIRefusal, 
  getHowICanSupportYou 
} from '../lib/aiHistory';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isError?: boolean;
  failedQuery?: string;
}

interface ParsedResponse {
  cleanContent: string;
  clarificationOptions: string[];
  relatedQuestions: string[];
  medicalDisclaimer?: string;
}

function parseAIResponse(rawText: string): ParsedResponse {
  if (!rawText) {
    return { cleanContent: '', clarificationOptions: [], relatedQuestions: [] };
  }

  let text = rawText;
  let clarificationOptions: string[] = [];
  let relatedQuestions: string[] = [];
  let medicalDisclaimer: string | undefined = undefined;

  const isDisclaimerLine = (line: string) => {
    const lower = line.toLowerCase();
    return (
      lower.includes('medical information note') ||
      lower.includes('educational guidance only') ||
      lower.includes('consult your pediatrician') ||
      lower.includes('clinical diagnosis') ||
      lower.includes('medical disclaimer') ||
      lower.includes('emergency care') ||
      lower.startsWith('⚠️') ||
      lower.startsWith('*medical information')
    );
  };

  // Extract Clarification Options delimiter
  if (text.includes('---CLARIFICATION_OPTIONS---')) {
    const parts = text.split('---CLARIFICATION_OPTIONS---');
    text = parts[0].trim();
    const optionsBlock = parts[1] || '';
    clarificationOptions = optionsBlock
      .split('\n')
      .map(line => line.replace(/^[-*•\d.]+\s*/, '').replace(/[\[\]]/g, '').trim())
      .filter(line => {
        if (!line || line.includes('---')) return false;
        if (isDisclaimerLine(line)) {
          if (!medicalDisclaimer) {
            medicalDisclaimer = line.replace(/⚠️\s*\*?|\*?$/g, '').trim();
          }
          return false;
        }
        return true;
      });
  }

  // Extract Related Questions delimiter
  if (text.includes('---RELATED_QUESTIONS---')) {
    const parts = text.split('---RELATED_QUESTIONS---');
    text = parts[0].trim();
    const questionsBlock = parts[1] || '';
    relatedQuestions = questionsBlock
      .split('\n')
      .map(line => line.replace(/^[-*•\d.]+\s*/, '').replace(/[\[\]]/g, '').trim())
      .filter(line => {
        if (!line || line.includes('---')) return false;
        if (isDisclaimerLine(line)) {
          if (!medicalDisclaimer) {
            medicalDisclaimer = line.replace(/⚠️\s*\*?|\*?$/g, '').trim();
          }
          return false;
        }
        return true;
      });
  }

  // Extract Contextual Medical Disclaimer
  const disclaimerMatch = text.match(/(⚠️\s*\*?Medical Information Note:[^*]+\*?)/i);
  if (disclaimerMatch) {
    if (!medicalDisclaimer) {
      medicalDisclaimer = disclaimerMatch[1].replace(/⚠️\s*\*?|\*?$/g, '').trim();
    }
    text = text.replace(disclaimerMatch[0], '').trim();
  }

  // Robust Markdown Table Normalization
  // 1. If rows are joined by '| |' or '||' on a single line, split them with newlines
  text = text.replace(/\|\s*\|\s*/g, '|\n| ');
  text = text.replace(/\|:(-+)/g, '| :$1');

  // 2. Ensure heading preceding a table is cleanly separated by double newlines
  text = text.replace(/([^\n|])\s*\n*(\|(?:\s*[^|\n]+\s*\|)+)\n*(\|(?:\s*[:\-]+\s*\|)+)/g, '$1\n\n$2\n$3');
  text = text.replace(/([^\n|])\n+(\|(?:\s*[^|\n]+\s*\|)+)/g, '$1\n\n$2');

  // 3. Ensure heading immediately following a table row gets a blank line before it
  text = text.replace(/\|\s*(#{1,6}\s+)/g, '|\n\n$1');

  // 4. Ensure double newline follows the end of the table before regular text
  text = text.replace(/(\|(?:\s*[^|\n]+\s*\|)+)\n+([^\n|#\s])/g, '$1\n\n$2');

  // 5. Clean up any trailing double pipe at end of lines
  text = text.replace(/\|\s*\|\s*$/gm, '|');

  return {
    cleanContent: text,
    clarificationOptions,
    relatedQuestions,
    medicalDisclaimer,
  };
}

export const SearchSection: React.FC = () => {
  const { profile, activeChildIndex, childProfiles, switchActiveChild } = useAuth();
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState('');
  const [followUpText, setFollowUpText] = useState('');
  const [otherClarificationMap, setOtherClarificationMap] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const followUpInputRef = useRef<HTMLTextAreaElement>(null);
  const searchFormRef = useRef<HTMLDivElement>(null);
  const responseContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Dynamic Parent & Child names from profile or demo defaults
  const parentName = profile?.parentName || profile?.firstName || profile?.name || localStorage.getItem('parent_name') || 'Lashmi';
  const childName = profile?.babyName || profile?.childName || localStorage.getItem('baby_name') || 'Ashwath';
  const childAge = profile?.babyAge || localStorage.getItem('baby_age') || '14 Months';

  // Voice speech-to-text integration
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) {
          if (hasSearched) {
            setFollowUpText(prev => (prev ? `${prev} ${transcript}` : transcript));
          } else {
            setQuery(prev => (prev ? `${prev} ${transcript}` : transcript));
          }
          playSound('pop');
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [hasSearched]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser. Please use keyboard input.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        playSound('glass');
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  // Auto-run query if coming from another page with initialQuery param
  useEffect(() => {
    const initQ = searchParams.get('initialQuery');
    if (initQ && initQ.trim()) {
      setQuery(initQ);
      handleExecuteQuery(initQ, []);
    }
  }, [searchParams]);

  const handleStartNewTopic = () => {
    playSound('pop');
    setQuery('');
    setFollowUpText('');
    setMessages([]);
    setHasSearched(false);

    if (searchParams.get('initialQuery')) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('initialQuery');
      setSearchParams(newParams, { replace: true });
    }

    setTimeout(() => {
      if (searchFormRef.current) {
        searchFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 120, behavior: 'smooth' });
      }
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }, 50);
  };

  const handleExecuteQuery = async (userPrompt: string, existingHistory: ChatMessage[]) => {
    const promptText = userPrompt.trim();
    if (!promptText || loading) return;

    playSound('glass');
    setLoading(true);
    setHasSearched(true);
    setQuery('');
    setFollowUpText('');

    const userMessage: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const assistantPlaceholderId = `a_${Date.now()}`;
    const initialAssistantMessage: ChatMessage = {
      id: assistantPlaceholderId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      failedQuery: promptText,
    };

    const newMessagesList = [...existingHistory, userMessage, initialAssistantMessage];
    setMessages(newMessagesList);

    // Scroll to bottom of conversation
    setTimeout(() => {
      responseContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);

    // Responsible AI: Refuse sensitive personal info / credentials
    if (isPersonalInfoQuery(promptText)) {
      const piiNotice = getResponsibleAIRefusal(parentName, childName, childAge);
      setMessages(prev =>
        prev.map(m => m.id === assistantPlaceholderId ? { ...m, content: piiNotice } : m)
      );
      saveAISearchRecord(promptText, piiNotice);
      setLoading(false);
      playSound('pop');
      return;
    }

    // Build multi-turn conversational array for Gemini
    const conversationHistoryForApi = existingHistory
      .filter(m => !m.isError && m.content)
      .map(m => {
        if (m.role === 'assistant') {
          // Keep summary/first 350 chars of previous assistant responses to avoid latency lag while preserving memory
          const trimmed = m.content.length > 350 ? m.content.slice(0, 350) + '...' : m.content;
          return { role: m.role, content: trimmed };
        }
        return { role: m.role, content: m.content };
      });
    conversationHistoryForApi.push({ role: 'user', content: promptText });

    let accumulatedText = '';
    let lastUpdate = 0;
    let updateTimer: any = null;

    const flushTextToState = (text: string) => {
      setMessages(prev =>
        prev.map(m => m.id === assistantPlaceholderId ? { ...m, content: text, isError: false } : m)
      );
    };

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => {
      abortController.abort();
    }, 15000); // 15-second stream timeout

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: abortController.signal,
        body: JSON.stringify({
          query: promptText,
          messages: conversationHistoryForApi,
          parentName,
          childName,
          childAge,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`AI service responded with HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let isFirstChunk = true;
      let isHtmlErrorPayload = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        if (chunk) {
          // Detect and discard raw HTML server error pages (504/502 gateway timeouts)
          if (isFirstChunk) {
            const trimmed = chunk.trim().toLowerCase();
            if (trimmed.startsWith('<!doctype') || trimmed.startsWith('<html') || trimmed.startsWith('<head')) {
              isHtmlErrorPayload = true;
              break;
            }
            playSound('pop');
            isFirstChunk = false;
          }

          accumulatedText += chunk;
          
          // Throttled UI update for smooth real-time rendering
          const now = Date.now();
          if (now - lastUpdate > 60) {
            lastUpdate = now;
            flushTextToState(accumulatedText);
          } else if (!updateTimer) {
            updateTimer = setTimeout(() => {
              flushTextToState(accumulatedText);
              updateTimer = null;
            }, 60);
          }
        }
      }

      clearTimeout(timeoutId);
      if (updateTimer) clearTimeout(updateTimer);

      if (isHtmlErrorPayload || !accumulatedText.trim()) {
        throw new Error("Invalid or empty response payload");
      }

      // Synchronously flush the final text so no chunk is ever dropped
      flushTextToState(accumulatedText);

      // Save valid record
      saveAISearchRecord(promptText, accumulatedText);
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (updateTimer) clearTimeout(updateTimer);

      console.warn("AI Assistant streaming interrupted:", err);

      // Render the Smart Retry Card without raw HTML code glitches
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantPlaceholderId
            ? {
                ...m,
                content: '',
                isError: true,
                failedQuery: promptText,
              }
            : m
        )
      );
      playSound('pop');
    } finally {
      clearTimeout(timeoutId);
      if (updateTimer) clearTimeout(updateTimer);
      setLoading(false);
    }
  };

  const handleRetry = (failedQuery?: string) => {
    if (!failedQuery) return;
    // Strip the failed assistant message and re-run
    const cleanHistory = messages.filter(m => !m.isError && m.content);
    // Remove the last user message if it was the failed query
    if (cleanHistory.length > 0 && cleanHistory[cleanHistory.length - 1].content === failedQuery) {
      cleanHistory.pop();
    }
    handleExecuteQuery(failedQuery, cleanHistory);
  };

  const starterTopics = [
    {
      title: "Sensory Meltdown vs. Boundary Tantrum",
      query: "What is the difference between a sensory meltdown and a boundary tantrum?",
      badge: "Behavior Comparison",
      color: "border-purple-500/30 bg-purple-500/10 text-purple-200 hover:border-purple-400",
    },
    {
      title: "5 Indoor Games for a Rainy Day",
      query: "Give me five fun indoor games to play with my child on a rainy day using simple household items.",
      badge: "Creative Play",
      color: "border-amber-500/30 bg-amber-500/10 text-amber-200 hover:border-amber-400",
    },
    {
      title: "Refusing to Sleep Alone at Night",
      query: "My child refuses to sleep alone and cries when I leave the room. How do I transition peacefully?",
      badge: "Bedtime & Sleep",
      color: "border-indigo-500/30 bg-indigo-500/10 text-indigo-200 hover:border-indigo-400",
    },
    {
      title: "Handling Fear of Ghosts or Monsters",
      query: "My child says they saw a ghost and are scared of shadows under their bed. How should I talk to them?",
      badge: "Childhood Fears",
      color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200 hover:border-emerald-400",
    },
    {
      title: "Picky Eating & First Ragi Porridge",
      query: "How do I introduce sprouted ragi porridge to a picky toddler without mealtime battles?",
      badge: "Indian Nutrition",
      color: "border-rose-500/30 bg-rose-500/10 text-rose-200 hover:border-rose-400",
    },
    {
      title: "Tackling Hitting & Biting Calmly",
      query: "My toddler hits and pinches when angry. What immediate calming script and action steps should I take?",
      badge: "Big Feelings",
      color: "border-cyan-500/30 bg-cyan-500/10 text-cyan-200 hover:border-cyan-400",
    },
  ];

  return (
    <div className="w-full max-w-full mx-auto py-2 sm:py-4 px-2 sm:px-4 lg:px-6 text-center">
      {/* Google AI Mode Header */}
      <div className="flex flex-col items-center justify-center text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-black uppercase tracking-wider shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>Google AI Mode · Direct Child Intelligence</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-sans font-black tracking-tight leading-tight px-2">
          <span className="text-white">How can we help </span>
          <span className="italic font-serif bg-gradient-to-r from-teal-300 via-indigo-300 to-pink-400 bg-clip-text text-transparent">
            today?
          </span>
        </h1>

        {/* Child Profile Checkbox Selector & Session Controls */}
        <div className="flex flex-col items-center justify-center gap-2 pt-1 w-full max-w-2xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-2 bg-[#0a1224]/90 border border-indigo-500/30 rounded-2xl p-1.5 px-3 shadow-xl backdrop-blur-md">
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-indigo-300 flex items-center gap-1.5 px-1">
              <Baby className="w-3.5 h-3.5 text-indigo-400" />
              <span>Select Child Profile:</span>
            </span>

            <div className="flex items-center gap-2">
              {childProfiles.map((cp) => {
                const isSelected = activeChildIndex === cp.id;
                return (
                  <label
                    key={cp.id}
                    onClick={() => {
                      if (!isSelected) {
                        playSound('pop');
                        switchActiveChild(cp.id);
                      }
                    }}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all border select-none ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-600/40 to-purple-600/40 text-white border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.4)] ring-1 ring-indigo-400'
                        : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {
                        playSound('pop');
                        switchActiveChild(cp.id);
                      }}
                      className="w-4 h-4 rounded border-indigo-400 text-indigo-500 focus:ring-indigo-400 cursor-pointer accent-indigo-500"
                    />
                    <span className="flex items-center gap-1.5">
                      <span className="font-extrabold">{cp.name}</span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${
                        isSelected ? 'bg-indigo-400/25 text-indigo-200' : 'bg-white/10 text-slate-400'
                      }`}>
                        {cp.age}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-300 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Active across site: <strong>{childName}</strong> ({childAge}) · Personalized for <strong>{parentName}</strong></span>
            </span>
            {hasSearched && (
              <button
                onClick={handleStartNewTopic}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 hover:text-white text-[11px] font-bold transition-all cursor-pointer active:scale-95"
                title="Start a new conversation topic and reset history"
              >
                <RotateCcw className="w-3 h-3" />
                <span>New Topic</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Omnibox (Always Available on Empty State) */}
      {!hasSearched && (
        <div id="ask-ai-search-bar" ref={searchFormRef} className="relative group max-w-4xl mx-auto mb-8 text-left">
          <div className="relative rounded-3xl bg-[#090f1f]/80 border-2 border-indigo-500/30 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/20 transition-all shadow-2xl p-3 sm:p-4 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <div className="text-indigo-400 pt-1.5 shrink-0">
                <Search className="w-5 h-5" />
              </div>
              <textarea
                ref={inputRef}
                rows={2}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (query.trim() && !loading) {
                      handleExecuteQuery(query, []);
                    }
                  }
                }}
                placeholder={`Ask any question about ${childName}... (e.g. "What is the difference between a sensory meltdown and a boundary tantrum?" or "5 games for a rainy day")`}
                className="w-full bg-transparent border-none text-sm sm:text-base md:text-lg text-white focus:outline-none resize-none placeholder:text-slate-500 leading-relaxed min-h-[56px]"
              />
            </div>

            <div className="flex items-center justify-between gap-2.5 pt-3 mt-2 border-t border-white/10">
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                Press <strong>Enter</strong> to submit · <strong>Shift+Enter</strong> for line break
              </span>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isListening
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
                      : 'bg-white/5 hover:bg-white/15 text-slate-300 border-white/15'
                  }`}
                  title={isListening ? "Listening... click to stop" : "Speak your question"}
                >
                  {isListening ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleExecuteQuery(query, [])}
                  disabled={loading || !query.trim()}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 disabled:opacity-40 text-white rounded-xl font-black text-xs sm:text-sm transition-all shadow-lg shadow-indigo-500/25 active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Thinking...</span>
                    </>
                  ) : (
                    <>
                      <span>Ask AI</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categorized Starter Suggestion Cards */}
      {!hasSearched && (
        <div className="max-w-5xl mx-auto mb-10 text-left">
          <div className="flex items-center justify-between mb-3.5 px-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Explore Everyday Topics</span>
            </span>
            <span className="text-xs text-slate-500">Tap to test real-time intelligence</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {starterTopics.map((topic, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => handleExecuteQuery(topic.query, [])}
                className={`p-4 rounded-2xl border text-left transition-all active:scale-98 cursor-pointer shadow-md group flex flex-col justify-between gap-2.5 ${topic.color}`}
              >
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider opacity-80 block mb-1">
                    {topic.badge}
                  </span>
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-200 transition-colors leading-snug">
                    {topic.title}
                  </h4>
                </div>
                <div className="flex items-center justify-between text-[11px] opacity-70 group-hover:opacity-100 transition-opacity pt-2 border-t border-white/5">
                  <span>Ask this now</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Multi-Turn Continuous Conversation Feed */}
      <AnimatePresence mode="wait">
        {hasSearched && (
          <motion.div
            ref={responseContainerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-5xl mx-auto text-left space-y-6 mb-8"
          >
            {messages.map((msg, index) => {
              if (msg.role === 'user') {
                return (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-5 py-3.5 rounded-3xl rounded-tr-sm shadow-xl border border-indigo-400/20">
                      <div className="flex items-center justify-between gap-3 mb-1 text-[10px] text-indigo-200 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3 h-3" />
                          <span>{parentName}</span>
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="text-sm sm:text-base font-medium leading-relaxed">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                );
              }

              // Assistant Message Turn
              const parsed = parseAIResponse(msg.content);

              return (
                <div key={msg.id} className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/20 mt-1">
                    <Sparkles className="w-5 h-5" />
                  </div>

                  <div className="flex-1 bg-[#090f1f]/90 border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                    <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-white/10 text-xs text-slate-400">
                      <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                        <Baby className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Guidance for {childName} ({childAge})</span>
                      </span>
                      <span className="text-[10px]">{msg.timestamp}</span>
                    </div>

                    {/* Loading State */}
                    {!msg.content && loading && !msg.isError && (
                      <div className="flex items-center gap-3 text-indigo-300 py-6 animate-pulse">
                        <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                        <span className="text-sm font-bold">
                          Evaluating developmental guidance for {childName}...
                        </span>
                      </div>
                    )}

                    {/* Smart Retry Card on Interruption/Error (Zero HTML code glitch) */}
                    {msg.isError && (
                      <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-slate-200 space-y-3">
                        <div className="flex items-center gap-2.5 text-rose-300 font-bold text-sm">
                          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>Connection delay encountered</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          We were unable to complete the response due to a momentary network delay. Tap below to continue smoothly.
                        </p>
                        <button
                          onClick={() => handleRetry(msg.failedQuery)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Retry this question</span>
                        </button>
                      </div>
                    )}

                    {/* Empty Content Fallback (Never show a blank card) */}
                    {!msg.content && !loading && !msg.isError && (
                      <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-slate-200 space-y-3">
                        <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
                          <Sparkles className="w-4 h-4 text-indigo-400" />
                          <span>Personalized Guidance for {childName}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          Tap below to load the guidance for this question.
                        </p>
                        <button
                          onClick={() => handleRetry(msg.failedQuery)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Load Guidance Now</span>
                        </button>
                      </div>
                    )}

                    {/* Clean Markdown Response */}
                    {parsed.cleanContent && (
                      <div className="prose prose-invert max-w-none text-slate-200 leading-relaxed font-sans text-sm sm:text-base">
                        <Markdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({ children }) => <h1 className="text-lg sm:text-xl font-black text-white mt-4 mb-2 pb-1 border-b border-white/10">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-base sm:text-lg font-bold text-indigo-300 mt-4 mb-2">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-sm sm:text-base font-bold text-emerald-400 mt-3.5 mb-1.5">{children}</h3>,
                            p: ({ children }) => <p className="mb-3 text-slate-200 leading-relaxed">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1.5 text-slate-200">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1.5 text-slate-200">{children}</ol>,
                            li: ({ children }) => <li className="text-slate-200">{children}</li>,
                            strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                            table: ({ children }) => (
                              <div className="overflow-x-auto my-5 rounded-2xl border border-indigo-500/30 bg-[#090f1f]/95 shadow-xl shadow-black/40">
                                <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[540px]">{children}</table>
                              </div>
                            ),
                            thead: ({ children }) => (
                              <thead className="bg-gradient-to-r from-indigo-950/90 via-purple-950/70 to-slate-900/90 border-b border-indigo-500/30">
                                {children}
                              </thead>
                            ),
                            th: ({ children }) => (
                              <th className="p-3.5 sm:p-4 text-indigo-200 font-extrabold text-xs sm:text-sm tracking-wide border-r border-white/10 last:border-r-0">
                                {children}
                              </th>
                            ),
                            tbody: ({ children }) => (
                              <tbody className="divide-y divide-white/10">
                                {children}
                              </tbody>
                            ),
                            tr: ({ children }) => (
                              <tr className="hover:bg-white/[0.04] transition-colors">
                                {children}
                              </tr>
                            ),
                            td: ({ children }) => (
                              <td className="p-3.5 sm:p-4 border-r border-white/10 last:border-r-0 text-slate-200 text-xs sm:text-sm leading-relaxed align-top">
                                {children}
                              </td>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="my-3 p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 italic font-medium">
                                {children}
                              </blockquote>
                            ),
                          }}
                        >
                          {parsed.cleanContent}
                        </Markdown>

                        {loading && index === messages.length - 1 && (
                          <span className="inline-block w-2 h-4 bg-indigo-400 animate-pulse ml-1 align-middle" />
                        )}
                      </div>
                    )}

                    {/* Ambiguity Clarification Options as Clickable Buttons */}
                    {parsed.clarificationOptions.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-white/10 space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                          <span>Tap your intended question:</span>
                        </span>

                        {/* Strictly vertical stack: one below the other even if small */}
                        <div className="flex flex-col gap-2.5 w-full">
                          {parsed.clarificationOptions.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              onClick={() => handleExecuteQuery(opt, messages.slice(0, index + 1))}
                              disabled={loading}
                              className="w-full text-left p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 hover:border-amber-400/60 text-amber-100 hover:text-white font-medium text-xs sm:text-sm transition-all shadow-sm flex items-center justify-between gap-3 group active:scale-[0.99] cursor-pointer"
                            >
                              <span className="flex-1 leading-snug">{opt}</span>
                              <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 group-hover:translate-x-1 transition-transform" />
                            </button>
                          ))}
                        </div>

                        {/* Other - text box for parent to write their own question for clarification */}
                        <div className="pt-2 w-full">
                          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#090e1d]/90 border border-amber-400/35 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 transition-all shadow-md">
                            <div className="flex items-center gap-2 mb-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                              <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-[11px] font-black">
                                Other
                              </span>
                              <span>Write your own question for clarification:</span>
                            </div>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                              <input
                                type="text"
                                value={otherClarificationMap[msg.id] || ''}
                                onChange={(e) => setOtherClarificationMap(prev => ({ ...prev, [msg.id]: e.target.value }))}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const val = (otherClarificationMap[msg.id] || '').trim();
                                    if (val && !loading) {
                                      handleExecuteQuery(val, messages.slice(0, index + 1));
                                      setOtherClarificationMap(prev => ({ ...prev, [msg.id]: '' }));
                                    }
                                  }
                                }}
                                placeholder={`Write your specific clarification or question for ${childName}...`}
                                disabled={loading}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-400/60 transition-colors"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const val = (otherClarificationMap[msg.id] || '').trim();
                                  if (val && !loading) {
                                    handleExecuteQuery(val, messages.slice(0, index + 1));
                                    setOtherClarificationMap(prev => ({ ...prev, [msg.id]: '' }));
                                  }
                                }}
                                disabled={loading || !(otherClarificationMap[msg.id] || '').trim()}
                                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                              >
                                <span>Submit</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Contextual Medical Disclaimer Note */}
                    {parsed.medicalDisclaimer && (
                      <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200/90 flex items-start gap-2">
                        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{parsed.medicalDisclaimer}</span>
                      </div>
                    )}

                    {/* Related Follow-Up Questions (Interactive Chips) */}
                    {parsed.relatedQuestions.length > 0 && !loading && (
                      <div className="mt-6 pt-4 border-t border-white/10 space-y-2.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Related questions parents ask:</span>
                        </span>
                        <div className="flex flex-col gap-2 w-full">
                          {parsed.relatedQuestions.map((qText, qIdx) => (
                            <button
                              key={qIdx}
                              onClick={() => handleExecuteQuery(qText, messages.slice(0, index + 1))}
                              disabled={loading}
                              className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-400/40 text-slate-200 hover:text-white text-xs font-medium transition-all active:scale-[0.99] cursor-pointer shadow-sm flex items-center justify-between gap-2.5 group"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <HelpCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0 group-hover:scale-110 transition-transform" />
                                <span className="leading-snug">{qText}</span>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 group-hover:translate-x-1 transition-transform" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Conversation Follow-Up Omnibox (Docked at Bottom of Chat) */}
            <div className="pt-4">
              <div className="relative rounded-3xl bg-[#090f1f]/90 border border-indigo-500/30 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/20 transition-all p-3 sm:p-4 shadow-2xl backdrop-blur-xl">
                <div className="flex items-start gap-3">
                  <div className="text-indigo-400 pt-1.5 shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <textarea
                    ref={followUpInputRef}
                    rows={2}
                    value={followUpText}
                    onChange={(e) => setFollowUpText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (followUpText.trim() && !loading) {
                          handleExecuteQuery(followUpText, messages);
                        }
                      }
                    }}
                    placeholder={`Reply or ask follow-up for ${childName}... (e.g. "What if ${childName} refuses that?" or "How long should I wait?")`}
                    disabled={loading}
                    className="w-full bg-transparent border-none text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none resize-none leading-relaxed min-h-[50px]"
                  />
                </div>

                <div className="flex items-center justify-between gap-2.5 pt-2.5 mt-2 border-t border-white/10">
                  <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                    Conversation remembers context · Press <strong>Enter</strong> to send
                  </span>
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={toggleVoiceInput}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isListening
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
                          : 'bg-white/5 hover:bg-white/15 text-slate-300 border-white/15'
                      }`}
                      title={isListening ? "Listening... click to stop" : "Speak reply"}
                    >
                      {isListening ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExecuteQuery(followUpText, messages)}
                      disabled={loading || !followUpText.trim()}
                      className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 disabled:opacity-40 text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg shadow-indigo-500/25 active:scale-95 cursor-pointer flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Send</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions: Clear / New Topic */}
            <div className="flex items-center justify-between pt-2 px-1 text-xs text-slate-400">
              <button
                onClick={handleStartNewTopic}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white font-bold transition-all cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
                <span>Start New Topic</span>
              </button>

              <span className="italic text-[11px] text-slate-400">
                Pediatric guidance aligned with IAP, ICMR-NIN &amp; WHO
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
