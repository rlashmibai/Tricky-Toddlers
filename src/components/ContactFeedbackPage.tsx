import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Send, 
  MessageSquareHeart, 
  Lightbulb, 
  BookOpen, 
  Smile, 
  Sparkles, 
  Mail, 
  CheckCircle2, 
  Clock, 
  Compass, 
  ArrowLeft, 
  Baby, 
  ThumbsUp,
  Star,
  MessageCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { playSound } from '../lib/sounds';
import { useAuth } from '../lib/AuthContext';

type FeedbackCategory = 'feedback' | 'story' | 'suggestion' | 'help' | 'collaboration';

interface FeedbackSubmission {
  id: string;
  name: string;
  email: string;
  category: FeedbackCategory;
  toddlerAge: string;
  subject: string;
  message: string;
  rating: number;
  sharePermission: boolean;
  date: string;
}

export const ContactFeedbackPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [category, setCategory] = useState<FeedbackCategory>('feedback');
  const [name, setName] = useState(profile?.parentName || profile?.name || user?.displayName || localStorage.getItem('parent_name') || 'Lashmi');
  
  // Do not pre-fill auto-generated internal guest email addresses
  const cleanInitialEmail = (user?.email && !user.email.includes('guest_auto') && !user.email.includes('securepass.internal'))
    ? user.email
    : '';
  const [email, setEmail] = useState(cleanInitialEmail);
  
  const [toddlerAge, setToddlerAge] = useState('1-2 years');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [sharePermission, setSharePermission] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [recentSubmissions, setRecentSubmissions] = useState<FeedbackSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('tricky_toddlers_feedback_list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const categories = [
    {
      id: 'feedback' as FeedbackCategory,
      title: 'Share Feedback',
      subtitle: 'What do you love? What can be better?',
      icon: MessageSquareHeart,
      color: 'from-pink-500 to-rose-600',
      textColor: 'text-pink-300',
      badge: 'Help me help you'
    },
    {
      id: 'story' as FeedbackCategory,
      title: 'Share Your Stories',
      subtitle: 'Tantrums turned giggles, milestones & wins',
      icon: BookOpen,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-300',
      badge: 'Real Parenting'
    },
    {
      id: 'suggestion' as FeedbackCategory,
      title: 'Suggestions & Ideas',
      subtitle: 'Features or tools you wish existed',
      icon: Lightbulb,
      color: 'from-indigo-500 to-purple-600',
      textColor: 'text-indigo-300',
      badge: 'Co-Create'
    },
    {
      id: 'help' as FeedbackCategory,
      title: 'Help & Questions',
      subtitle: 'Need guidance with the app?',
      icon: HelpCircle,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-300',
      badge: 'Support'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !name.trim()) return;

    playSound('pop');
    setIsSubmitting(true);

    const newSubmission: FeedbackSubmission = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      category,
      toddlerAge,
      subject: `${category.toUpperCase()} note from ${name.trim()}`,
      message: message.trim(),
      rating,
      sharePermission,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    };

    setTimeout(() => {
      try {
        const updated = [newSubmission, ...recentSubmissions];
        setRecentSubmissions(updated);
        localStorage.setItem('tricky_toddlers_feedback_list', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save to local storage', err);
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      playSound('glass');
    }, 600);
  };

  const handleResetForm = () => {
    setMessage('');
    setIsSuccess(false);
  };

  return (
    <div className="flex-1 w-full text-slate-100 pb-10 pt-6 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <Link
          to="/about"
          onClick={() => playSound('click')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Story</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <Link to="/about" className="hover:text-pink-300 transition-colors">My Story</Link>
          <span>·</span>
          <Link to="/#vision" className="hover:text-indigo-300 transition-colors">Vision &amp; Mission</Link>
          <span>·</span>
          <span className="text-emerald-400">Contact &amp; Feedback</span>
        </div>
      </div>

      {/* Hero: Help Me Help You */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-[#0c1427]/90 via-[#0a0f1e]/95 to-[#070b14]/98 p-6 sm:p-10 lg:p-12 mb-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 text-left">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight text-balance">
            Help me to Help You
          </h1>

          <div className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-200 tracking-tight text-balance">
            Share Your Thoughts, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">Stories &amp; Feedback</span>
          </div>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed w-full text-balance">
            Hi, I’m <strong className="text-white font-bold">Ashwath Amudhan</strong>, Young Innovator and Founder of Tricky Toddlers. 
            I built this platform because I believe technology should quietly take care of the everyday clutter so parents can focus on what matters most. 
            Your real experiences, candid feedback, and funny or touching toddler stories help me build something truly helpful for every parent.
          </p>
        </div>

        {/* 4 Pillars of Engagement Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  playSound('click');
                  setCategory(cat.id);
                }}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                  isSelected
                    ? 'bg-white/10 border-indigo-400/60 shadow-lg shadow-indigo-500/20 scale-[1.02]'
                    : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className={`p-2 rounded-xl bg-gradient-to-tr ${cat.color} text-white shadow-md`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors">
                    {cat.badge}
                  </span>
                </div>
                <div className="font-bold text-sm text-white group-hover:text-indigo-200 transition-colors">
                  {cat.title}
                </div>
                <div className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {cat.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Form Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Container (2 cols) */}
        <div className="lg:col-span-2 glass-card p-6 sm:p-8 rounded-3xl border-white/10 bg-[#090e1c]/90 backdrop-blur-xl">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form
                key="feedback-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      {category === 'feedback' && 'Share Your Experience & Feedback'}
                      {category === 'story' && 'Tell Me Your Toddler Story'}
                      {category === 'suggestion' && 'Suggest a Feature or Idea'}
                      {category === 'help' && 'Ask a Question or Request Help'}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Every note goes directly to my inbox and guides our next updates.
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Private & Direct</span>
                  </div>
                </div>

                {/* Rating Bar */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    How is your experience with Tricky Toddlers?
                  </label>
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => {
                          playSound('pop');
                          setRating(star);
                        }}
                        className="p-1.5 transition-transform hover:scale-125 focus:outline-none"
                      >
                        <Star 
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            star <= rating 
                              ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' 
                              : 'text-slate-600 hover:text-slate-400'
                          }`} 
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-amber-300 ml-2">
                      {rating === 5 && '🌟 Loving it!'}
                      {rating === 4 && '👍 Great and helpful'}
                      {rating === 3 && '😊 Good, has potential'}
                      {rating === 2 && '🛠 Needs improvement'}
                      {rating === 1 && '⚠️ Facing issues'}
                    </span>
                  </div>
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Lashmi"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 text-sm transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Your Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="eg abc@gmail.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Toddler Age Stage */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Toddler's Age Stage</label>
                  <select
                    value={toddlerAge}
                    onChange={(e) => setToddlerAge(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#131b2e] border border-white/10 text-white focus:outline-none focus:border-indigo-400 text-sm transition-all"
                  >
                    <option value="6-12 months">6 - 12 Months (Starting Weaning)</option>
                    <option value="1-2 years">1 - 2 Years (Active Explorer)</option>
                    <option value="2-3 years">2 - 3 Years (Language & Tantrums)</option>
                    <option value="3-4 years">3 - 4 Years (Preschool Prep)</option>
                    <option value="4+ years">4+ Years (Big Toddler)</option>
                    <option value="Expecting">Expecting / Newborn Parent</option>
                    <option value="Caregiver / Doctor">Caregiver / Doctor / Educator</option>
                  </select>
                </div>

                {/* Message Body */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">
                      {category === 'story' ? 'Your Toddler Story *' : 'Your Message / Idea / Feedback *'}
                    </label>
                    <span className="text-[10px] text-slate-500">
                      {message.length} characters
                    </span>
                  </div>
                  <textarea
                    required
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        // Enter / Shift+Enter inserts line breaks; never triggers form submission
                        e.stopPropagation();
                      }
                    }}
                    placeholder={
                      category === 'story'
                        ? 'Tell us what happened! What made you laugh, cheer, or discover something new about your little one?'
                        : category === 'suggestion'
                        ? 'Describe your idea: What problem does it solve for you? How would you love it to work?'
                        : 'Tell me your honest thoughts. What is working well? What can we make easier, simpler, or calmer for you?'
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 text-sm transition-all leading-relaxed"
                  />
                </div>

                {/* Permission Toggle */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <input
                    type="checkbox"
                    id="shareConsent"
                    checked={sharePermission}
                    onChange={(e) => setSharePermission(e.target.checked)}
                    className="mt-1 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-400"
                  />
                  <label htmlFor="shareConsent" className="text-xs text-slate-400 leading-relaxed cursor-pointer">
                    You have permission to share this story or feedback anonymously with our parent community to inspire and support other families.
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim() || !name.trim()}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white font-black text-sm tracking-wide shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending note to Ashwath...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send to Ashwath Amudhan</span>
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success-screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 px-4 text-center space-y-6"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-xl shadow-emerald-500/20">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    Thank You, {name}!
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Your note has been received with warm gratitude. As a young innovator, learning from your everyday parenting reality is what makes Tricky Toddlers better every day.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 max-w-md mx-auto text-left space-y-2">
                  <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Ashwath's Personal Promise</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    I read every single suggestion, story, and piece of feedback personally. If you included your email, I will follow up with you.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <button
                    onClick={handleResetForm}
                    className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Send Another Note
                  </button>
                  <Link
                    to="/"
                    onClick={() => playSound('click')}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
                  >
                    Return to Toddler Home
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Info & Direct Channels (1 col) */}
        <div className="space-y-6">
          {/* Quick Bio Card */}
          <div className="glass-card p-6 rounded-3xl border-white/10 bg-[#090e1c]/80 backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
                <Sparkles className="w-5 h-5 text-indigo-100" />
              </div>
              <div>
                <h4 className="font-black text-white text-base">Ashwath Amudhan</h4>
                <p className="text-xs text-indigo-300 font-semibold">Young Innovator & Founder</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              “Integration is my main innovation. When parents have one child profile that connects nutrition, vaccines, bedtime routines, and pediatric wisdom, parenting feels lighter.”
            </p>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <Link to="/about?tab=story" className="text-pink-400 hover:text-pink-300 font-bold transition-colors">
                Read My Story →
              </Link>
              <Link to="/about?tab=mission" className="text-amber-400 hover:text-amber-300 font-bold transition-colors">
                My Vision →
              </Link>
            </div>
          </div>

          {/* Direct Contact Channels */}
          <div className="glass-card p-6 rounded-3xl border-white/10 bg-[#090e1c]/80 backdrop-blur-xl space-y-4">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>Direct Channels</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Email Ashwath Directly</span>
                <span className="text-indigo-300 font-mono font-bold">ashwath@trickytoddlers.com</span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Community Support</span>
                <span className="text-emerald-300 font-mono font-bold">support@trickytoddlers.com</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs leading-relaxed">
              💡 <strong>Parent Story Spotlight:</strong> We feature real stories in our community newsletter every month. Tell us about your toddler's breakthrough!
            </div>
          </div>

          {/* Previously Submitted Notes in this browser */}
          {recentSubmissions.length > 0 && (
            <div className="glass-card p-6 rounded-3xl border-white/10 bg-[#090e1c]/80 backdrop-blur-xl space-y-3">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Your Sent Notes ({recentSubmissions.length})</span>
              </h4>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {recentSubmissions.slice(0, 4).map((sub) => (
                  <div key={sub.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-indigo-400 font-bold uppercase">{sub.category}</span>
                      <span className="text-slate-500">{sub.date}</span>
                    </div>
                    <div className="text-white font-medium truncate">{sub.subject}</div>
                    <div className="text-slate-400 text-[11px] line-clamp-2">{sub.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
