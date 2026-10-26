import React, { useState, useEffect, useRef } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../lib/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Loader2, MessageCircle, 
  Bold, Italic, List, Search, 
  ShieldCheck, CheckCircle2, ChevronLeft,
  X, Sparkles, MessageSquare, Paperclip
} from 'lucide-react';
import { isPersonalInfoQuery } from '../lib/aiHistory';
import { playSound } from '../lib/sounds';

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  receiverName?: string;
  text: string;
  createdAt: any;
  timeString?: string;
}

interface ParentAccount {
  id: string;
  name: string;
  initials: string;
  avatarGradient: string;
  childTag: string;
  location: string;
  status: string;
  isOnline: boolean;
  isVerified?: boolean;
  messages: ChatMessage[];
}

const INITIAL_PARENT_ACCOUNTS: ParentAccount[] = [
  {
    id: 'lashmi_conv',
    name: 'Sarah (18mo)',
    initials: 'S',
    avatarGradient: 'from-indigo-500 to-blue-600',
    childTag: 'Mom to 18-month-old',
    location: 'Sleep Help',
    status: 'Active',
    isOnline: true,
    messages: [
      { id: 'l1', userId: 'sarah18', username: 'Sarah', text: "Hi Lashmi! My 18-month-old has started waking up multiple times at night. Any advice?", createdAt: new Date(), timeString: '18:52' },
      { id: 'l2', userId: 'lashmi', username: 'Lashmi', text: "Yes, we went through that sleep regression too! Try sitting beside her cot and placing a gentle hand on her tummy instead of picking her up.", createdAt: new Date(), timeString: '19:52' },
      { id: 'l3', userId: 'sarah18', username: 'Sarah', text: "She slept through till 6 AM! Thanks so much!", createdAt: new Date(), timeString: '21:42' }
    ]
  },
  {
    id: 'mike',
    name: 'Mike',
    initials: 'M',
    avatarGradient: 'from-amber-500 to-orange-600',
    childTag: 'Dad to 2yo',
    location: 'Food Lens',
    status: 'Offline',
    isOnline: false,
    messages: [
      { id: 'm1', userId: 'mike', username: 'Mike', text: "Is broccoli okay for a picky eater?", createdAt: new Date(), timeString: '14:20' }
    ]
  },
  {
    id: 'priya',
    name: 'Priya',
    initials: 'P',
    avatarGradient: 'from-emerald-500 to-teal-600',
    childTag: 'Mom to 2.5yo',
    location: 'Toddler Academy',
    status: 'Active',
    isOnline: true,
    messages: [
      { id: 'p1', userId: 'priya', username: 'Priya', text: "Any tips for learning colors?", createdAt: new Date(), timeString: '10:05' }
    ]
  },
  {
    id: 'rahul',
    name: 'Rahul',
    initials: 'R',
    avatarGradient: 'from-purple-500 to-violet-600',
    childTag: 'Dad to 3yo',
    location: 'Vaccines',
    status: 'Offline',
    isOnline: false,
    messages: [
      { id: 'r1', userId: 'rahul', username: 'Rahul', text: "Where can I find the latest immunization schedule?", createdAt: new Date(), timeString: '09:00' }
    ]
  }
];

export const GlobalChat: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ParentAccount[]>(INITIAL_PARENT_ACCOUNTS);
  const [selectedParentId, setSelectedParentId] = useState<string>('sarah');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [privacyWarning, setPrivacyWarning] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('chat');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Active parent object
  const activeParent = conversations.find(p => p.id === selectedParentId) || conversations[0];

  // Filtered conversations based on "To:" search query
  const filteredParents = conversations.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(q) ||
      p.childTag.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.messages.some(m => m.text.toLowerCase().includes(q))
    );
  });

  // Auto-scroll on active parent or message updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeParent?.messages, selectedParentId]);

  const handleSelectParent = (parent: ParentAccount) => {
    playSound('pop');
    setSelectedParentId(parent.id);
    setSearchQuery('');
    setMobileView('chat');
  };

  const handleStartCustomConversation = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const newId = 'parent_' + Date.now();
    const initials = trimmed.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'P';
    const newAccount: ParentAccount = {
      id: newId,
      name: trimmed,
      initials,
      avatarGradient: 'from-blue-500 to-indigo-600',
      childTag: 'Toddler Parent',
      location: 'India',
      status: 'Active now',
      isOnline: true,
      messages: [
        {
          id: 'welcome_' + Date.now(),
          userId: 'system',
          username: trimmed,
          receiverName: 'Lashmi',
          text: `Hi Lashmi! Started a new private conversation with you. Ask me anything about toddler routines or parenting!`,
          createdAt: new Date()
        }
      ]
    };
    setConversations(prev => [newAccount, ...prev]);
    setSelectedParentId(newId);
    setSearchQuery('');
    setMobileView('chat');
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e?.preventDefault) e.preventDefault();
    if (!newMessage.trim()) return;

    // Responsible AI: Protect family and child privacy
    if (isPersonalInfoQuery(newMessage)) {
      setPrivacyWarning("Responsible AI: For child safety and privacy protection, personal information (phone numbers, passwords, emails, financial details) cannot be asked or shared in chat.");
      setTimeout(() => setPrivacyWarning(null), 6000);
      return;
    }

    setLoading(true);
    const sentText = newMessage.trim();
    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      userId: user?.uid || 'lashmi',
      username: 'Lashmi',
      receiverName: activeParent.name,
      text: sentText,
      createdAt: new Date()
    };

    // Update conversation in state
    setConversations(prev => prev.map(p => {
      if (p.id === activeParent.id) {
        return {
          ...p,
          messages: [...p.messages, newMsg]
        };
      }
      return p;
    }));

    setNewMessage('');
    playSound('click');

    // Also persist to Firestore if online/authenticated
    try {
      if (user && db) {
        await addDoc(collection(db, 'messages'), {
          userId: user.uid,
          username: 'Lashmi',
          receiverName: activeParent.name,
          text: sentText,
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.warn("Firestore sync optional note:", err);
    } finally {
      setLoading(false);
    }
  };

  const insertFormat = (format: string) => {
    const text = newMessage;
    if (format === 'bold') setNewMessage(text + "**bold text**");
    if (format === 'italic') setNewMessage(text + "*italic text*");
    if (format === 'bullet') setNewMessage(text + "\n• ");
  };

  return (
    <div className="flex flex-col h-[700px] max-w-6xl mx-auto space-y-3">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 shadow-sm">
            <MessageCircle className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Parent 1:1 Connect</span>
            </h2>
            <p className="text-slate-400 text-xs">
              Connect with fellow parents for practical advice, shared experiences, and peer support.
            </p>
            {!user && (
              <div className="text-amber-400 text-xs font-bold p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 mt-3">
                Guest users need to create an account to connect with community or other parents.
              </div>
            )}
          </div>
        </div>

        {/* To: Search Box */}
        <div className="flex items-center gap-2 w-full sm:w-80">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-indigo-500/40 focus-within:border-indigo-500 focus-within:bg-white/[0.08] rounded-xl px-3.5 py-2 transition-all shadow-sm w-full">
            <Search className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider shrink-0">To:</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or type parent name..."
              className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full font-medium"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Messenger Container */}
      <div className="flex-1 rounded-3xl border border-white/15 bg-gradient-to-br from-[#0c142b]/95 via-[#091122]/95 to-[#060b17]/95 backdrop-blur-xl overflow-hidden flex flex-col md:flex-row shadow-2xl relative min-h-0">
        
        {/* =========================================================
            LEFT COLUMN: CONVERSATION LIST (5 TO 6 PARENT ACCOUNTS)
        ========================================================== */}
        <div className={`w-full md:w-80 lg:w-96 border-r border-white/10 flex flex-col shrink-0 bg-[#070b16]/60 ${
          mobileView === 'chat' ? 'hidden md:flex' : 'flex'
        }`}>
          {/* List Header */}
          <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                Conversations
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
              {filteredParents.length} Available
            </span>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5 scrollbar-thin scrollbar-thumb-white/10">
            {filteredParents.length === 0 ? (
              <div className="p-6 text-center space-y-3">
                <p className="text-xs text-slate-400">
                  No existing conversation matching &ldquo;{searchQuery}&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={() => handleStartCustomConversation(searchQuery)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 font-bold text-xs transition-all cursor-pointer"
                >
                  Start conversation with &ldquo;{searchQuery}&rdquo;
                </button>
              </div>
            ) : (
              filteredParents.map((parent) => {
                const isSelected = parent.id === activeParent.id;
                const lastMsg = parent.messages[parent.messages.length - 1];
                return (
                  <button
                    key={parent.id}
                    type="button"
                    onClick={() => handleSelectParent(parent)}
                    className={`w-full text-left p-3.5 transition-all flex items-start gap-3 cursor-pointer group relative ${
                      isSelected 
                        ? 'bg-indigo-500/15 border-l-4 border-indigo-500' 
                        : 'hover:bg-white/[0.04]'
                    }`}
                  >
                    {/* Parent Avatar with initials */}
                    <div className="relative shrink-0">
                      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${parent.avatarGradient} flex items-center justify-center text-white font-black text-xs shadow-md group-hover:scale-105 transition-transform`}>
                        {parent.initials}
                      </div>
                      {parent.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#091122] rounded-full" />
                      )}
                    </div>

                    {/* Text Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <h4 className={`text-xs sm:text-sm font-bold truncate ${
                            isSelected ? 'text-indigo-200' : 'text-white'
                          }`}>
                            {parent.name}
                          </h4>
                          {parent.isVerified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium shrink-0">
                          {parent.status.replace('Active ', '')}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 truncate font-medium">
                        {parent.childTag}
                      </div>

                      {lastMsg && (
                        <p className="text-[11px] text-slate-300/80 truncate mt-1 leading-snug">
                          {lastMsg.username === 'Lashmi' ? 'You: ' : ''}{lastMsg.text}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN: ACTIVE CHAT CONVERSATION VIEW
        ========================================================== */}
        <div className={`flex-1 flex flex-col min-h-0 bg-[#091122]/40 ${
          mobileView === 'list' ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Chat Header */}
          <div className="p-3.5 sm:p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              {/* Mobile Back Button */}
              <button
                type="button"
                onClick={() => setMobileView('list')}
                className="md:hidden p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="relative">
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${activeParent.avatarGradient} flex items-center justify-center text-white font-black text-sm shadow-md`}>
                  {activeParent.initials}
                </div>
                {activeParent.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#091122] rounded-full" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-white">
                    {activeParent.name}
                  </h3>
                  {activeParent.isVerified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span>{activeParent.childTag}</span>
                  <span>•</span>
                  <span>{activeParent.location}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">{activeParent.status}</span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider px-2.5 py-1 rounded-xl bg-white/5 border border-white/10">
                Logged in as @Lashmi
              </span>
            </div>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 relative z-10 scrollbar-thin scrollbar-thumb-white/10"
          >
            <div className="text-center py-2">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>Private peer conversation between Lashmi &amp; {activeParent.name}</span>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {activeParent.messages.map((msg) => {
                const isMyMessage = (msg.username || '').toLowerCase() === 'lashmi';
                const timeString = msg.createdAt instanceof Date 
                  ? msg.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : (msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'just now');

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] sm:max-w-[75%] flex flex-col ${isMyMessage ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-2 mb-1 px-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          @{msg.username}
                        </span>
                        <span className="text-[9px] text-slate-500">
                          {timeString}
                        </span>
                      </div>
                      <div className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed transition-all shadow-md ${
                        isMyMessage 
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-tr-none shadow-indigo-600/20' 
                          : 'bg-white/[0.08] text-slate-100 rounded-tl-none border border-white/10'
                      }`}>
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Composer Box */}
          <div className="p-3.5 sm:p-4 bg-[#070b16]/80 border-t border-white/10 relative z-10 space-y-2">
            {privacyWarning && (
              <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-medium flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{privacyWarning}</span>
              </div>
            )}
            {!user && (
              <div className="text-amber-400 text-xs font-bold p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
                Please create an account to connect with parents.
              </div>
            )}

            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button 
                  type="button" 
                  onClick={() => insertFormat('bold')} 
                  className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="Bold"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button 
                  type="button" 
                  onClick={() => insertFormat('italic')} 
                  className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="Italic"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button 
                  type="button" 
                  onClick={() => insertFormat('bullet')} 
                  className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="Bullet list"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <label className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer" title="Upload Image/File">
                  <Paperclip className="w-3.5 h-3.5" />
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      // Logic to upload
                    }
                  }} />
                </label>
              </div>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Responsible AI Guardrails Protected
              </span>
            </div>

            {/* Input + Send */}
            <form onSubmit={handleSendMessage} className="flex items-end gap-2.5">
              <textarea
                ref={inputRef}
                rows={1}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={`Message ${activeParent.name}... (Press Enter to send, Shift+Enter for line break)`}
                className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all placeholder:text-slate-500 resize-none min-h-[44px] max-h-32 leading-relaxed"
              />
              <button
                type="submit"
                disabled={loading || !newMessage.trim()}
                className="px-5 py-2.5 h-[44px] bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white rounded-xl font-bold transition-all disabled:opacity-40 shadow-lg shadow-indigo-500/25 active:scale-95 shrink-0 flex items-center justify-center cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
