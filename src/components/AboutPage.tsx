import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Sparkles, 
  MessageSquareHeart 
} from 'lucide-react';
import { playSound } from '../lib/sounds';

export const AboutPage: React.FC<{ embedded?: boolean }> = ({ embedded = false }) => {
  return (
    <div className={`w-full ${embedded ? 'py-4' : 'flex-1 py-8 sm:py-12'} px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto`}>
      
      {/* Top Heading Banner */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-pink-500/20 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-bold tracking-wide shadow-lg shadow-amber-500/10">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>One Child Profile · One Integrated Ecosystem - Personalised Guidance</span>
        </div>
      </div>

      {/* Main Story Letter Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-8"
      >
        <div className="glass-card p-6 sm:p-10 lg:p-12 relative overflow-hidden border-indigo-500/20 bg-gradient-to-b from-[#0e172a]/90 via-[#0a0f1d]/90 to-[#070a14]/95 text-left">
          {/* Background glowing aura */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Ashwath Amudhan Intro */}
          <div className="pb-8 border-b border-white/10 text-left">
            <div className="space-y-2.5 text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug text-balance">
                The Story Behind Tricky Toddlers
              </h1>
              <div className="text-slate-200 text-base sm:text-lg leading-relaxed space-y-2 text-left pt-2">
                <p className="text-left">
                  Hi, I’m <strong className="text-white font-bold">Ashwath Amudhan</strong>, a Young Innovator and Startup Entrepreneur with a passion for technology and problem-solving.
                </p>
                <p className="text-left">
                  I often wondered, if technology can simplify so many parts of our lives, why can’t it make parenting simpler too?
                </p>
                <p className="text-indigo-300 font-semibold text-left">
                  That question led me to create Tricky Toddlers.
                </p>
              </div>
            </div>
          </div>

          {/* The Story Text as Narrated by Ashwath Amudhan */}
          <div className="prose prose-invert max-w-none text-slate-200 text-base sm:text-lg leading-relaxed space-y-6 pt-6">
            
            <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              An Everyday Conversation That Sparked an Idea
            </h3>

            <p>
              One day, I went to a family friend's house with my mom. They have a toddler, and naturally, my mom and my friend's mom started talking about parenting.
            </p>

            <p>
              For almost <strong className="text-white font-semibold">30 minutes</strong>, they talked about everything.
            </p>

            <p className="text-indigo-200 font-medium">
              Food. Allergies. Sleep. Vaccines. Milestones. Routines. Tantrums. And so many other small things that come with raising a toddler.
            </p>

            <p>
              I was just listening to them, but at one point I started thinking...
            </p>

            <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-white leading-snug text-balance">
                “How much information does a parent actually have to manage every single day?”
              </h2>
            </div>

            <p className="text-lg font-bold text-amber-300">
              And that's when it struck me.
            </p>

            <p>
              The problem isn't really that parents don't have information.
            </p>

            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/15 via-indigo-500/15 to-purple-500/15 border border-amber-400/30">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug text-balance">
                “There is actually too much information. The information is just scattered everywhere.”
              </h2>
            </div>

            <p>
              One thing is in an app. Another is on a website. Something else is in a WhatsApp message. There are reminders, paper notes, doctor cards, videos, screenshots...
            </p>

            <p>
              And when you need one simple answer, you end up searching through five different places.
            </p>

            {/* Visual problem vs solution representation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              <div className="p-5 rounded-2xl bg-red-500/[0.06] border border-red-500/20 space-y-2">
                <h3 className="flex items-center gap-2 text-red-400 font-bold text-sm sm:text-base">
                  <span>❌ The Old Way: Scattered Frustration</span>
                </h3>
                <ul className="text-xs sm:text-sm text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>6 different apps with separate logins</li>
                  <li>Searching multiple websites with scary conflicting opinions</li>
                  <li>Watching multiple videos just to find one simple weaning answer</li>
                  <li>Crumpled doctor cards, lost reminders and paper notes</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/20 space-y-2">
                <h3 className="flex items-center gap-2 text-emerald-400 font-bold text-sm sm:text-base">
                  <span>✅ My Solution: One Connected Ecosystem</span>
                </h3>
                <ul className="text-xs sm:text-sm text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>One child profile holding routines, growth, and foods</li>
                  <li>Fine-tuned AI giving verified answers in 10 seconds</li>
                  <li>NutriBand sensor &amp; FoodLens camera feeding the same profile</li>
                  <li>WHO, Indian IAP and FSSAI verified pediatric guidelines</li>
                </ul>
              </div>
            </div>

            <p className="text-xl font-bold text-white">
              Then I thought:
            </p>

            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-500/15 to-indigo-500/15 border border-purple-400/30">
              <h2 className="text-xl sm:text-2xl font-black text-indigo-200 italic leading-snug text-balance">
                “Why can’t all this information be connected in one place?”
              </h2>
            </div>

            <p>
              And that became the starting point for <strong className="text-amber-300 font-bold">Tricky Toddlers</strong>.
            </p>

            <p>
              So I asked myself:
            </p>

            <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10">
              <h2 className="text-xl sm:text-2xl font-black text-white italic leading-snug text-balance">
                “What if I could bring all these things together?”
              </h2>
            </div>

            <p className="text-lg text-slate-200">
              That is what <span className="text-amber-300 font-bold">Tricky Toddlers</span> does. It brings nutrition, wellness, development, routines, vaccines and parenting guidance into one connected ecosystem.
            </p>

            {/* 4 Pillars of Ashwath's Innovation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
              <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/25">
                <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">Main Innovation</div>
                <h4 className="text-base sm:text-lg font-black text-white">“Integration is my main innovation.”</h4>
              </div>

              <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/25">
                <div className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">Architecture</div>
                <h4 className="text-base sm:text-lg font-black text-white">“One child profile”</h4>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25">
                <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">Care System</div>
                <h4 className="text-base sm:text-lg font-black text-white">“Personalised Guidance”</h4>
              </div>

              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25">
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">Parent Promise</div>
                <h4 className="text-base sm:text-lg font-black text-white text-balance">“Less juggling apps, more caring.”</h4>
              </div>
            </div>

            {/* Dedication Card */}
            <div className="mt-10 pt-8 border-t border-white/10 text-center sm:text-left">
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-indigo-500/15 border-2 border-pink-400/30 space-y-4">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-pink-300 font-black text-sm uppercase tracking-wider">
                  <Heart className="w-4 h-4 fill-pink-400 text-pink-400" />
                  <span>Dedication</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight italic leading-snug text-balance">
                  "I dedicate this app to my family, without whom I'm not here."
                </h2>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-slate-300 pt-2 border-t border-white/10">
                  <span className="font-semibold text-white">
                    Ashwath Amudhan | Founder &amp; Creator of Tricky Toddlers
                  </span>
                  <Link
                    to="/?tab=home"
                    onClick={() => {
                      playSound('click');
                      window.dispatchEvent(new CustomEvent('nav-reset-to-home'));
                    }}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Go to Tricky Toddlers Home"
                  >
                    Tricky Toddlers
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </motion.div>

      {/* Bottom Navigation to other parts */}
      <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <Link
          to="/?tab=home"
          onClick={() => {
            playSound('click');
            window.dispatchEvent(new CustomEvent('nav-reset-to-home'));
          }}
          className="hover:text-white flex items-center gap-1 font-bold text-indigo-400 transition-colors"
        >
          ← Back to Tricky Toddlers Home
        </Link>

        <Link
          to="/contact"
          onClick={() => playSound('click')}
          className="cursor-pointer hover:text-emerald-300 text-emerald-400 font-bold transition-colors flex items-center gap-1"
        >
          <MessageSquareHeart className="w-3.5 h-3.5" />
          <span>Contact &amp; Feedback</span>
        </Link>
      </div>

    </div>
  );
};
