import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, Mail, Check, X } from 'lucide-react';

export const CommunityGuidelines: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 text-slate-100">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-indigo-300 hover:text-indigo-200 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
          <ShieldCheck className="w-8 h-8 text-cheerful-green" />
          Community Guidelines
        </h1>
        <p className="text-lg text-white/80">
          Welcome to our parent community! This is a safe, supportive, and positive space where parents can ask questions, share real-life experiences, and grow together. To ensure our community remains trustworthy and constructive for everyone, please follow these guidelines:
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-cheerful-green">The Do’s</h2>
          <div className="space-y-4 text-white/80">
            <div className="flex gap-3">
              <Check className="w-5 h-5 text-cheerful-green shrink-0 mt-0.5" />
              <p><strong>Be kind and encouraging:</strong> Treat every parent with empathy and respect. Parenting journeys differ, and constructive encouragement goes a long way.</p>
            </div>
            <div className="flex gap-3">
              <Check className="w-5 h-5 text-cheerful-green shrink-0 mt-0.5" />
              <p><strong>Share firsthand experiences:</strong> Share what worked (or didn’t) for you and your child to inspire and help other families.</p>
            </div>
            <div className="flex gap-3">
              <Check className="w-5 h-5 text-cheerful-green shrink-0 mt-0.5" />
              <p><strong>Ask openly and offer support:</strong> Feel free to ask questions, exchange practical parenting tips, and help fellow members learn.</p>
            </div>
            <div className="flex gap-3">
              <Check className="w-5 h-5 text-cheerful-green shrink-0 mt-0.5" />
              <p><strong>Keep communication friendly and constructive:</strong> Maintain warm, considerate, and family-appropriate language across all discussions.</p>
            </div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-red-400">The Don’ts</h2>
          <div className="space-y-4 text-white/80">
            <div className="flex gap-3">
              <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p><strong>Zero tolerance for harassment:</strong> Hate speech, bullying, shaming, discriminatory remarks, or personal attacks will result in immediate removal.</p>
            </div>
            <div className="flex gap-3">
              <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p><strong>No unverified medical advice:</strong> Share everyday lifestyle and parenting routines, but leave clinical diagnoses, medical treatments, and prescriptions to qualified pediatricians.</p>
            </div>
            <div className="flex gap-3">
              <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p><strong>No spam or unsolicited promotion:</strong> Keep conversations authentic. Do not post advertisements, affiliate links, or self-promotional content.</p>
            </div>
            <div className="flex gap-3">
              <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p><strong>Protect personal privacy:</strong> Do not post phone numbers, home addresses, government IDs, or sensitive financial data.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
        <h3 className="text-xl font-semibold text-white">Privacy Notice & Liability Disclaimer</h3>
        <p className="text-white/70"><strong>Personal Information Disclaimer:</strong> Sharing any Personally Identifiable Information (PII) - including child names, photos, location details, or medical history - in public community feeds is done strictly at your own discretion and risk. Tricky Toddlers is not responsible or liable for any issues, misuse, or consequences arising from information you voluntarily share in public forums.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center space-y-4">
        <h3 className="text-xl font-semibold text-white">Need Help or Spot a Violation?</h3>
        <p className="text-white/70">If you encounter content that violates these guidelines or have concerns about community safety, our moderation team is here to assist:</p>
        <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-full font-semibold transition-all">
          <Mail className="w-4 h-4" />
          Contact Support
        </a>
      </div>
    </div>
  );
};
