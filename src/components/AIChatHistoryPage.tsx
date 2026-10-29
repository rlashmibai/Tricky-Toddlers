import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Search,
  Calendar,
  Clock,
  Sparkles,
  Tag,
  Trash2,
  Copy,
  Printer,
  ChevronRight,
  HelpCircle,
  RotateCcw,
  Check,
  MessageCircle,
  ExternalLink,
  BookOpen,
  Filter
} from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { playSound } from '../lib/sounds';
import {
  AISearchRecord,
  getAISearchRecords,
  deleteAISearchRecord,
  clearAllAISearchRecords,
  CATEGORY_COLORS
} from '../lib/aiHistory';

const ALL_CATEGORIES = [
  'All Categories',
  'Bedtime & Sleep',
  'Nutrition & Feeding',
  'Tantrums & Behavior',
  'Potty Training',
  'Growth & Milestones',
  'General Pediatric'
];

export const AIChatHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<AISearchRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('All Months');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const data = getAISearchRecords();
    setRecords(data);
    if (data.length > 0) {
      setSelectedRecordId(data[0].id);
    }
  }, []);

  // Compute available months dynamically
  const availableMonths = [
    'All Months',
    ...Array.from(new Set(records.map(r => r.month))).filter(Boolean)
  ];

  // Filtering
  const filteredRecords = records.filter(r => {
    const matchesSearch =
      r.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.tags && r.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesMonth = selectedMonth === 'All Months' || r.month === selectedMonth;
    const matchesCategory = selectedCategory === 'All Categories' || r.category === selectedCategory;

    return matchesSearch && matchesMonth && matchesCategory;
  });

  const selectedRecord = records.find(r => r.id === selectedRecordId) || filteredRecords[0] || null;

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playSound('pop');
    const updated = deleteAISearchRecord(id);
    setRecords(updated);
    if (selectedRecordId === id) {
      const next = updated.find(r => r.id !== id);
      setSelectedRecordId(next ? next.id : null);
    }
  };

  const handleClearAll = () => {
    playSound('pop');
    clearAllAISearchRecords();
    setRecords([]);
    setSelectedRecordId(null);
    setShowClearConfirm(false);
  };

  const handleCopy = (text: string, id: string) => {
    playSound('glass');
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAskFollowUp = (question: string) => {
    playSound('glass');
    navigate('/?tab=ai&initialQuery=' + encodeURIComponent(question));
  };

  const handlePrint = () => {
    playSound('glass');
    window.print();
  };

  return (
    <div className="flex-1 w-full bg-slate-950 text-white font-sans selection:bg-indigo-500 selection:text-white pb-10">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-600/10 blur-[130px] rounded-full" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-600/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Top Navigation & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <button
            onClick={() => {
              playSound('glass');
              navigate('/?tab=ai');
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider border border-white/10 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to AI Assistant</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playSound('glass');
                navigate('/?tab=ai');
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold tracking-wide transition-all shadow-lg shadow-indigo-600/25 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask New Question</span>
            </button>

            {records.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-xs font-bold border border-rose-500/20 transition-all cursor-pointer"
                title="Clear all search history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear History</span>
              </button>
            )}
          </div>
        </div>

        {/* Hero Header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-black uppercase tracking-widest mb-3">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Parent Search History</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            AI Chat & Pediatric Search History
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
            Review past questions asked by parents with timestamps, complete AI assessments, and instant filters by month and category.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 shadow-xl backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search queries, keywords, or answers..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter by Month */}
            <div className="md:col-span-3 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none">
                <Calendar className="w-4 h-4" />
              </div>
              <select
                value={selectedMonth}
                onChange={(e) => {
                  playSound('pop');
                  setSelectedMonth(e.target.value);
                }}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer appearance-none"
              >
                {availableMonths.map((m) => (
                  <option key={m} value={m} className="bg-slate-900 text-white">
                    {m === 'All Months' ? '📅 Filter: All Months' : `📅 ${m}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Category */}
            <div className="md:col-span-3 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none">
                <Tag className="w-4 h-4" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  playSound('pop');
                  setSelectedCategory(e.target.value);
                }}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer appearance-none"
              >
                {ALL_CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-slate-900 text-white">
                    {c === 'All Categories' ? '🏷️ Filter: All Categories' : `🏷️ ${c}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filter Chips & Quick Reset */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-white/5 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-medium">Active Filters:</span>
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-bold">
                {selectedMonth}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold">
                {selectedCategory}
              </span>
              {searchTerm && (
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold">
                  "{searchTerm}"
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-400">
                Showing <strong className="text-white">{filteredRecords.length}</strong> of{' '}
                <strong className="text-white">{records.length}</strong> records
              </span>
              {(selectedMonth !== 'All Months' || selectedCategory !== 'All Categories' || searchTerm) && (
                <button
                  onClick={() => {
                    playSound('pop');
                    setSelectedMonth('All Months');
                    setSelectedCategory('All Categories');
                    setSearchTerm('');
                  }}
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold underline cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content: 2-Column Split for Desktop / Stacked for Mobile */}
        {filteredRecords.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/10 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Matching Search History</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              No questions found matching your search term or active month and category filters.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSelectedMonth('All Months');
                  setSelectedCategory('All Categories');
                  setSearchTerm('');
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Clear All Filters
              </button>
              <button
                onClick={() => navigate('/?tab=ai')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Ask a New Question
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: History Items List */}
            <div className="lg:col-span-5 space-y-3">
              {filteredRecords.map((item) => {
                const isSelected = selectedRecord?.id === item.id;
                const catColor = CATEGORY_COLORS[item.category] || CATEGORY_COLORS['General Pediatric'];

                return (
                  <motion.div
                    key={item.id}
                    layout
                    onClick={() => {
                      playSound('pop');
                      setSelectedRecordId(item.id);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-left relative overflow-hidden ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-950/80 to-slate-900 border-indigo-500/60 shadow-lg shadow-indigo-500/10'
                        : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/10'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                    )}

                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${catColor.bg} ${catColor.text} ${catColor.border}`}
                      >
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Calendar className="w-3 h-3" />
                        <span>{item.date}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        <span>{item.time}</span>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug mb-2">
                      {item.question}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.answer.replace(/###|\*\*|\*/g, '').slice(0, 140)}...
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5 text-[11px]">
                      <span className="text-indigo-400 font-semibold flex items-center gap-1">
                        View Assessment <ChevronRight className="w-3 h-3" />
                      </span>
                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Right Column: Selected Record Detail */}
            <div className="lg:col-span-7 sticky top-6">
              {selectedRecord ? (
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-xl text-left">
                  {/* Metadata Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                          CATEGORY_COLORS[selectedRecord.category]?.bg || 'bg-indigo-500/15'
                        } ${
                          CATEGORY_COLORS[selectedRecord.category]?.text || 'text-indigo-300'
                        } ${
                          CATEGORY_COLORS[selectedRecord.category]?.border || 'border-indigo-500/30'
                        }`}
                      >
                        {selectedRecord.category}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1.5 ml-2">
                        <Calendar className="w-3.5 h-3.5" />
                        {selectedRecord.date} at {selectedRecord.time}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(selectedRecord.answer, selectedRecord.id)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                        title="Copy answer"
                      >
                        {copiedId === selectedRecord.id ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={handlePrint}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                        title="Print / Save PDF"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(selectedRecord.id)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                        title="Delete this record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Parent Question Box */}
                  <div className="my-5 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Parent Question</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                      "{selectedRecord.question}"
                    </h3>
                  </div>

                  {/* AI Response Box */}
                  <div className="prose prose-invert max-w-none text-white/90 leading-relaxed font-sans text-left my-6 pr-1">
                    <Markdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-xl sm:text-2xl font-black text-white mt-6 mb-3 border-b border-white/10 pb-2">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-lg sm:text-xl font-black text-indigo-300 mt-5 mb-2">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-base sm:text-lg font-black text-emerald-400 mt-4 mb-2">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="mb-4 text-white/80 leading-relaxed text-sm sm:text-base">
                            {children}
                          </p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc pl-5 mb-4 space-y-2 text-sm sm:text-base">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal pl-5 mb-4 space-y-2 text-sm sm:text-base">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-white/80 leading-relaxed">{children}</li>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-extrabold text-white">{children}</strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic text-white/70">{children}</em>
                        ),
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
                        )
                      }}
                    >
                      {selectedRecord.answer
                        .replace(/([^\n|])\s*(\|(?:\s*[^|\n]+\s*\|)+\s*\|(?:\s*[:\-]+\s*\|)+)/g, '$1\n\n$2')
                        .replace(/([^\n|])\n\s*(\|)/g, '$1\n\n$2')
                        .replace(/\|\s*\|\s*(?=[^|\n\r])/g, '|\n| ')
                        .replace(/\|\s*(#{1,6}\s+)/g, '|\n\n$1')
                        .replace(/\|\s*\|\s*$/gm, '|')}
                    </Markdown>
                  </div>

                  {/* Bottom Action: Ask Follow-up or re-open AI Assistant */}
                  <div className="mt-8 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={() => handleAskFollowUp(selectedRecord.question)}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold tracking-wide transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Ask Follow-Up to this in AI Assistant</span>
                    </button>

                    <button
                      onClick={() => {
                        playSound('glass');
                        navigate('/?tab=ai');
                      }}
                      className="text-xs text-slate-400 hover:text-white font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <span>New Inquiry</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Clearing History */}
      <AnimatePresence>
        {showClearConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Clear All AI Chat History?</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                This will delete all saved search logs from your device. This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-600/25 cursor-pointer"
                >
                  Yes, Clear Everything
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
