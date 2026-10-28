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
    id: 'sarah',
    name: 'Sarah (18mo)',
    initials: 'S',
    avatarGradient: 'from-indigo-500 to-blue-600',
    childTag: 'Mom to 18-month-old',
    location: 'Mumbai · Sleep Help',
    status: 'Active now',
    isOnline: true,
    messages: [
      { id: 's1', userId: 'sarah', username: 'Sarah', text: "Hi Lashmi! My 18-month-old daughter has started waking up multiple times crying around 1 AM and 3 AM. Any advice?", createdAt: new Date(Date.now() - 1000 * 60 * 6), timeString: '18:52' },
      { id: 's2', userId: 'lashmi', username: 'Lashmi', text: "Yes, we went through that 18-month sleep regression too! Try sitting beside her cot and placing a gentle hand on her tummy with soft shushing instead of picking her up immediately. It reassures her without restarting the bedtime routine.", createdAt: new Date(Date.now() - 1000 * 60 * 4), timeString: '18:53' },
      { id: 's3', userId: 'sarah', username: 'Sarah', text: "She settled back in 10 minutes and slept through till 6 AM! Thanks so much Lashmi, that hand-on-tummy trick was pure magic!", createdAt: new Date(Date.now() - 1000 * 60 * 2), timeString: '18:54' }
    ]
  },
  {
    id: 'priya',
    name: 'Priya',
    initials: 'P',
    avatarGradient: 'from-emerald-500 to-teal-600',
    childTag: 'Mom to 2.5yo',
    location: 'Bengaluru · Nutrition',
    status: 'Active now',
    isOnline: true,
    messages: [
      { id: 'p1', userId: 'priya', username: 'Priya', text: "Lashmi, my 2.5-year-old completely rejects vegetables now. The moment she spots spinach or carrot pieces, she pushes the plate away! How do you handle this?", createdAt: new Date(Date.now() - 1000 * 60 * 6), timeString: '10:05' },
      { id: 'p2', userId: 'lashmi', username: 'Lashmi', text: "Totally understand, Priya! Toddlers can spot a tiny green speck from a mile away! What worked wonders for us was making grated beetroot and palak parathas kneaded with a little desi cow ghee and serving homemade curd on the side. When it looks pink and colorful, toddler curiosity takes over. Don't force them to finish, just keep exposure playful.", createdAt: new Date(Date.now() - 1000 * 60 * 4), timeString: '10:06' },
      { id: 'p3', userId: 'priya', username: 'Priya', text: "Making pink parathas tonight! Such a huge relief knowing this is a normal developmental phase and not a failure. Thank you!", createdAt: new Date(Date.now() - 1000 * 60 * 2), timeString: '10:07' }
    ]
  },
  {
    id: 'rahul',
    name: 'Rahul & Sneha',
    initials: 'R',
    avatarGradient: 'from-purple-500 to-violet-600',
    childTag: 'Parents to 14mo boy',
    location: 'Pune · Milestones',
    status: 'Active now',
    isOnline: true,
    messages: [
      { id: 'r1', userId: 'rahul', username: 'Rahul', text: "Hi Lashmi! Our 14-month-old son pulls at his diaper right after peeing and hides behind the sofa curtains. Is it too early to introduce a potty chair?", createdAt: new Date(Date.now() - 1000 * 60 * 6), timeString: '09:00' },
      { id: 'r2', userId: 'lashmi', username: 'Lashmi', text: "Hi Rahul! That awareness and wanting privacy is actually a wonderful readiness signal! You don't need strict potty training yet, but placing a small child potty chair in your bathroom and letting him sit fully clothed while looking at a picture book normalizes it without any pressure.", createdAt: new Date(Date.now() - 1000 * 60 * 4), timeString: '09:01' },
      { id: 'r3', userId: 'rahul', username: 'Rahul', text: "That makes so much sense! We placed the small potty chair today and he happily sat on it while clapping. Appreciate the calm practical tip!", createdAt: new Date(Date.now() - 1000 * 60 * 2), timeString: '09:02' }
    ]
  },
  {
    id: 'ananya',
    name: 'Ananya',
    initials: 'A',
    avatarGradient: 'from-pink-500 to-rose-600',
    childTag: 'Mom to 2yo',
    location: 'Chennai · Screen-Free',
    status: 'Active now',
    isOnline: true,
    messages: [
      { id: 'a1', userId: 'ananya', username: 'Ananya', text: "Hey Lashmi, after 7 PM my 2-year-old gets super hyper and demands nursery rhymes on the mobile phone. How do you keep evenings peaceful without screens?", createdAt: new Date(Date.now() - 1000 * 60 * 6), timeString: '17:15' },
      { id: 'a2', userId: 'lashmi', username: 'Lashmi', text: "Hi Ananya! We had that exact post-dinner screen battle. We switched to dim warm amber lighting after 7:30 PM, playing soft classical flute lullabies on a bluetooth speaker, and doing a 5-minute warm water foot wash. It drops cortisol levels and signals to their brain that night is here.", createdAt: new Date(Date.now() - 1000 * 60 * 4), timeString: '17:16' },
      { id: 'a3', userId: 'ananya', username: 'Ananya', text: "The warm foot wash and dim lights worked like magic! He fell asleep holding his plush bear without asking for the screen once.", createdAt: new Date(Date.now() - 1000 * 60 * 2), timeString: '17:17' }
    ]
  },
  {
    id: 'meera',
    name: 'Meera',
    initials: 'M',
    avatarGradient: 'from-amber-500 to-orange-600',
    childTag: 'Mom to 11mo',
    location: 'Delhi · FoodLens & BLW',
    status: 'Active now',
    isOnline: true,
    messages: [
      { id: 'm1', userId: 'meera', username: 'Meera', text: "Hi Lashmi! Little Ayaan is 11 months old now. I really want to introduce finger foods, but I get so anxious about choking. What are safe starters?", createdAt: new Date(Date.now() - 1000 * 60 * 6), timeString: '08:30' },
      { id: 'm2', userId: 'lashmi', username: 'Lashmi', text: "Hi Meera! Start with steamed sweet potato fingers, ripe banana spears, or well-boiled carrot sticks that easily squash between your thumb and index finger. At this stage, squishable texture is everything. Avoid hard raw foods like nuts, whole grapes, or crunchy chips. Always sit right with him face-to-face.", createdAt: new Date(Date.now() - 1000 * 60 * 4), timeString: '08:31' },
      { id: 'm3', userId: 'meera', username: 'Meera', text: "Steamed sweet potato sticks were a massive hit! He chewed them happily with his gums and self-fed for the first time. Thank you for calming my mommy anxiety!", createdAt: new Date(Date.now() - 1000 * 60 * 2), timeString: '08:32' }
    ]
  },
  {
    id: 'kavita',
    name: 'Kavita',
    initials: 'K',
    avatarGradient: 'from-cyan-500 to-blue-600',
    childTag: 'Mom to 3yo',
    location: 'Hyderabad · Big Emotions',
    status: 'Active now',
    isOnline: true,
    messages: [
      { id: 'k1', userId: 'kavita', username: 'Kavita', text: "Hi Lashmi, whenever my 3-year-old gets frustrated with blocks collapsing, he hits or throws items across the room. How should I respond in that moment?", createdAt: new Date(Date.now() - 1000 * 60 * 6), timeString: '11:10' },
      { id: 'k2', userId: 'lashmi', username: 'Lashmi', text: "Hi Kavita, hold his little hands gently, get down to his eye level, and say in a steady, calm voice: 'Hands are not for hitting. You are mad the tower fell. Let us stomp our feet or squeeze this cushion together.' Acknowledging the frustration while holding the physical boundary helps them learn emotional regulation.", createdAt: new Date(Date.now() - 1000 * 60 * 4), timeString: '11:11' },
      { id: 'k3', userId: 'kavita', username: 'Kavita', text: "Used the calm hands and cushion squeeze today when his puzzle got stuck. He took two big deep breaths instead of throwing it! Life saver advice.", createdAt: new Date(Date.now() - 1000 * 60 * 2), timeString: '11:12' }
    ]
  },
  {
    id: 'rohit',
    name: 'Rohit',
    initials: 'R',
    avatarGradient: 'from-amber-600 to-yellow-600',
    childTag: 'Dad to 2yo',
    location: 'Ahmedabad · Digestion',
    status: 'Offline',
    isOnline: false,
    messages: [
      { id: 'rh1', userId: 'rohit', username: 'Rohit', text: "Hello Lashmi! My 2-year-old gets constipated whenever we travel or change routine. What gentle home remedies or diet tweaks do you suggest?", createdAt: new Date(Date.now() - 1000 * 60 * 6), timeString: '07:20' },
      { id: 'rh2', userId: 'lashmi', username: 'Lashmi', text: "Hello Rohit! Overnight soaked munakka (black raisins) water in the morning works wonders for toddler bowels. Also add half a teaspoon of pure A2 desi cow ghee to his warm moong dal khichdi, and offer fresh papaya slices. Ensure he drinks enough water throughout the day.", createdAt: new Date(Date.now() - 1000 * 60 * 4), timeString: '07:21' },
      { id: 'rh3', userId: 'rohit', username: 'Rohit', text: "The soaked munakka water and papaya worked within hours! He is comfortable and running around happily again. Thanks a ton!", createdAt: new Date(Date.now() - 1000 * 60 * 2), timeString: '07:22' }
    ]
  },
  {
    id: 'deepa',
    name: 'Deepa',
    initials: 'D',
    avatarGradient: 'from-teal-500 to-emerald-600',
    childTag: 'Mom to 15mo',
    location: 'Kolkata · Teething',
    status: 'Active now',
    isOnline: true,
    messages: [
      { id: 'd1', userId: 'deepa', username: 'Deepa', text: "Hi Lashmi, little Riya is cutting her molars and her gums look red and swollen. She is drooling constantly and refusing warm meals. Any soothing ideas?", createdAt: new Date(Date.now() - 1000 * 60 * 6), timeString: '16:00' },
      { id: 'd2', userId: 'lashmi', username: 'Lashmi', text: "Hi Deepa! Warm food stings inflamed gums right now. Try chilled thick fresh curd or cool cucumber sticks wrapped in a safe silicone feeder. You can also massage her gums with a clean damp cloth chilled in the fridge for a few minutes — it numbs the throbbing naturally.", createdAt: new Date(Date.now() - 1000 * 60 * 4), timeString: '16:01' },
      { id: 'd3', userId: 'deepa', username: 'Deepa', text: "The cold damp cloth and chilled curd soothed her instantly! She finally fell asleep for a peaceful 2-hour afternoon nap.", createdAt: new Date(Date.now() - 1000 * 60 * 2), timeString: '16:02' }
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
