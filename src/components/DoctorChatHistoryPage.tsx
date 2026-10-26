import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  MessageSquare, 
  Calendar, 
  Clock, 
  Building2, 
  Download, 
  FileText, 
  Search, 
  Printer, 
  Stethoscope, 
  CheckCircle2, 
  ChevronDown,
  UserCheck
} from 'lucide-react';
import { playSound } from '../lib/sounds';

interface ChatHistoryRecord {
  id: string;
  doctorName: string;
  degrees: string;
  hospital: string;
  location: string;
  city: string;
  specialty: string;
  date: string;
  time: string;
  sessionDuration: string;
  feePaid: string;
  topic: string;
  summary: string;
  messages: {
    sender: 'user' | 'doctor';
    text: string;
    timestamp: string;
  }[];
}

const SAMPLE_CHAT_HISTORY: ChatHistoryRecord[] = [
  {
    id: 'ch-101',
    doctorName: 'Dr. Anjali Sharma',
    degrees: 'MBBS, MD Pediatrics, DNB, FIAP',
    hospital: 'Cloudnine Pediatrics',
    location: 'Jayanagar',
    city: 'Bengaluru',
    specialty: 'Pediatric Development & Nutrition',
    date: '14 Sep 2026',
    time: '11:15 AM',
    sessionDuration: '20 min',
    feePaid: '₹199',
    topic: 'Low Grade Fever & Teething Drool Guidance',
    summary: 'Infant presenting with mild 99.8°F warmth, swollen lower gum margins, and increased chewing. Prescribed cold teether rings, hydration maintenance, and paracetamol dosing parameters only if fever crosses 100.5°F.',
    messages: [
      {
        sender: 'user',
        text: 'Hello Dr. Anjali, my 16-month-old toddler has a mild temperature around 99.8°F since this morning and is drooling heavily and chewing on wooden toys. Should I give paracetamol right away?',
        timestamp: '11:15 AM'
      },
      {
        sender: 'doctor',
        text: 'Hello! 99.8°F is considered a low-grade physiological elevation, frequently associated with molar eruption (teething). Do not administer paracetamol immediately unless child is in visible distress or temperature exceeds 100.5°F (38°C). Offer chilled silicone teething rings, offer frequent sips of water or breastmilk, and monitor temperature every 4 hours.',
        timestamp: '11:18 AM'
      },
      {
        sender: 'user',
        text: 'Thank you Doctor. How long does teething fever usually last, and what are the red flags?',
        timestamp: '11:22 AM'
      },
      {
        sender: 'doctor',
        text: 'True teething elevation lasts no more than 24-48 hours. Red flags requiring immediate ER visit: temperature above 102°F, extreme lethargy, stiff neck, refusing all fluids for over 8 hours, or unexplained petechial rash. Otherwise, monitor calmly and keep clothing light.',
        timestamp: '11:27 AM'
      }
    ]
  },
  {
    id: 'ch-102',
    doctorName: 'Dr. Vikram Rao',
    degrees: 'MBBS, DCH, Fellowship in Neonatology',
    hospital: 'Apollo Cradle & Children\'s Hospital',
    location: 'Koramangala',
    city: 'Bengaluru',
    specialty: 'Neonatal & Toddler Care',
    date: '28 Aug 2026',
    time: '04:30 PM',
    sessionDuration: '20 min',
    feePaid: '₹199',
    topic: 'Transitioning to Self-Feeding & Gag Reflex vs Choking',
    summary: 'Parent concerned about frequent gagging during initial introduction of soft finger foods (steamed carrots and soft banana pieces). Clarified physiological differences between protective gag reflex and airway choking.',
    messages: [
      {
        sender: 'user',
        text: 'Hi Dr. Vikram, when I offer steamed sweet potato sticks, my 14-month-old gags, makes a coughing sound, and pushes food forward with the tongue. Is this choking?',
        timestamp: '04:30 PM'
      },
      {
        sender: 'doctor',
        text: 'Hello! What you described is the protective gag reflex, not choking. Toddlers have the gag reflex located further forward on their tongue compared to adults. Gagging is loud, red-faced, and moves food forward to prevent choking. Choking, on the other hand, is silent, child cannot breathe or cough, and faces turn bluish. Gagging is normal and necessary for oral motor learning.',
        timestamp: '04:34 PM'
      },
      {
        sender: 'user',
        text: 'Understood, that is such a huge relief! How should I prepare foods so they are safely mashable between gums?',
        timestamp: '04:38 PM'
      },
      {
        sender: 'doctor',
        text: 'The golden rule is the "pinch test": if you can easily mash the food piece between your index finger and thumb, toddler gums can safely chew it. Avoid whole grapes, hard raw apples, whole nuts, or popcorn until age 4.',
        timestamp: '04:44 PM'
      }
    ]
  },
  {
    id: 'ch-103',
    doctorName: 'Dr. Meera Nambiar',
    degrees: 'MBBS, MD Pediatrics, FIAP',
    hospital: 'Rainbow Children\'s Hospital',
    location: 'Marathahalli',
    city: 'Bengaluru',
    specialty: 'Growth, Milestones & Sleep Routines',
    date: '10 Aug 2026',
    time: '02:00 PM',
    sessionDuration: '20 min',
    feePaid: '₹199',
    topic: '18-Month Speech Milestones & Two-Word Combination',
    summary: 'Developmental speech screening. Toddler currently uses 12 distinct words and points enthusiastically. Assessed communication reciprocity; speech trajectory is developmentally age-appropriate.',
    messages: [
      {
        sender: 'user',
        text: 'Hello Dr. Meera, my toddler Ashwath is 18 months old and has about 10-12 single words (mama, dada, ball, milk, bye). Other children at daycare seem to speak full 2-word sentences. Should I be worried about speech delay?',
        timestamp: '02:00 PM'
      },
      {
        sender: 'doctor',
        text: 'Hello! Having 10-12 consistent words with communicative intent at 18 months is well within the normal developmental bell curve (minimum milestone is 6-10 words). The true explosion into 50+ words and 2-word combinations ("more milk", "bye doggy") typically happens between 20 and 24 months. Does he point to show you things and understand 1-step requests like "give me the ball"?',
        timestamp: '02:05 PM'
      },
      {
        sender: 'user',
        text: 'Yes! He points to airplanes in the sky, brings me his shoes, and waves bye-bye to everyone.',
        timestamp: '02:09 PM'
      },
      {
        sender: 'doctor',
        text: 'His receptive language and joint attention are excellent. That indicates strong cognitive comprehension. Continue reading together every night, narrate your day, and pause 5 full seconds to give him time to respond before speaking. We will review again at 24 months!',
        timestamp: '02:15 PM'
      }
    ]
  }
];

export const DoctorChatHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<ChatHistoryRecord | null>(SAMPLE_CHAT_HISTORY[0]);
  const [records, setRecords] = useState<ChatHistoryRecord[]>(SAMPLE_CHAT_HISTORY);

  useEffect(() => {
    // Load any locally saved chats if available
    try {
      const saved = localStorage.getItem('doctor_chat_history_archive');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecords([...parsed, ...SAMPLE_CHAT_HISTORY]);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const filtered = records.filter(r => 
    r.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => {
    playSound('glass');
    window.print();
  };

  return (
    <div className="flex-1 w-full bg-[#070b19] text-white pt-8 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                playSound('click');
                navigate('/?tab=pediatrician&ped_tab=chat');
              }}
              className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all cursor-pointer flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-xs font-bold sm:inline">Back to Doctor Chat</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-indigo-400" />
                  Doctor Chat Conversation History
                </h1>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-bold border border-indigo-500/30">
                  {records.length} Consultations
                </span>
              </div>
              <p className="text-xs text-white/50 mt-0.5">
                Official medical transcripts, doctor clinical advice, and 20-min session consultation logs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-bold text-white flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Pricing & Guarantee Notice */}
        <div className="p-4 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/50 border border-indigo-500/20 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-indigo-200">
            <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>All sessions are conducted 1:1 with qualified pediatricians through our partner network (₹199 per 20 min session).</span>
          </div>
          <div className="flex items-center gap-2 text-white/50 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>End-to-End Encrypted Medical Records</span>
          </div>
        </div>

        {/* Main Grid: Consultations List vs Detailed Transcript */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Sessions List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by doctor, hospital, symptom, or topic..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1 scrollbar-none">
              {filtered.map(rec => {
                const isSelected = selectedRecord?.id === rec.id;
                return (
                  <div
                    key={rec.id}
                    onClick={() => {
                      playSound('click');
                      setSelectedRecord(rec);
                    }}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative ${
                      isSelected
                        ? 'bg-indigo-500/15 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30'
                        : 'bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-black text-white">{rec.doctorName}</span>
                          <span className="text-[9px] font-mono text-amber-300 bg-amber-400/10 border border-amber-400/20 px-1 py-0.5 rounded font-bold">
                            {rec.degrees}
                          </span>
                        </div>
                        <div className="text-xs text-indigo-300 font-semibold flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-indigo-400 shrink-0" />
                          <span>{rec.hospital}, {rec.city}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full shrink-0">
                        {rec.feePaid} • {rec.sessionDuration}
                      </span>
                    </div>

                    <div className="mt-2.5 p-2 bg-white/5 rounded-xl border border-white/5">
                      <div className="text-xs font-bold text-amber-300/90 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="line-clamp-1">{rec.topic}</span>
                      </div>
                      <p className="text-[11px] text-white/60 line-clamp-2 mt-1 leading-relaxed">
                        {rec.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/5 text-[11px] text-white/40">
                      <span>📅 {rec.date} • {rec.time}</span>
                      <span className="text-indigo-300 font-bold text-xs hover:underline">
                        View Chat Logs →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Full Conversation Transcript */}
          <div className="lg:col-span-7 bg-white/[0.02] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6">
            {selectedRecord ? (
              <>
                {/* Doctor Clinical Profile Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-white/10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg sm:text-xl font-black text-white">
                        {selectedRecord.doctorName}
                      </h2>
                      <span className="text-xs font-mono text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-md font-bold">
                        {selectedRecord.degrees}
                      </span>
                    </div>
                    <p className="text-xs text-indigo-300 font-semibold flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{selectedRecord.hospital} • {selectedRecord.location}, {selectedRecord.city}</span>
                    </p>
                    <p className="text-xs text-white/50">
                      Specialty: {selectedRecord.specialty}
                    </p>
                  </div>

                  <div className="text-right sm:shrink-0 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <div className="text-xs text-white/50">Session Details</div>
                    <div className="text-xs font-bold text-emerald-400">Paid: {selectedRecord.feePaid}</div>
                    <div className="text-[11px] font-mono text-white/60">Duration: {selectedRecord.sessionDuration}</div>
                    <div className="text-[10px] text-white/40 mt-0.5">{selectedRecord.date} at {selectedRecord.time}</div>
                  </div>
                </div>

                {/* Clinical Summary Box */}
                <div className="p-4 bg-indigo-950/30 border border-indigo-500/20 rounded-2xl space-y-1.5">
                  <div className="text-xs font-black text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-indigo-400" />
                    <span>Clinical Consultation Focus: {selectedRecord.topic}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                    {selectedRecord.summary}
                  </p>
                </div>

                {/* Conversation Messages Transcript */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Live Session Transcript</span>
                  </h3>

                  <div className="space-y-3 bg-black/30 p-4 rounded-2xl border border-white/5 max-h-[420px] overflow-y-auto scrollbar-none">
                    {selectedRecord.messages.map((m, idx) => {
                      const isDoc = m.sender === 'doctor';
                      return (
                        <div key={idx} className={`flex ${isDoc ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                            isDoc
                              ? 'bg-white/10 text-white rounded-tl-none border border-white/10'
                              : 'bg-indigo-600 text-white rounded-tr-none shadow-md'
                          }`}>
                            <div className="flex items-center justify-between gap-3 text-[10px] opacity-70 mb-1">
                              <span className="font-bold">{isDoc ? selectedRecord.doctorName : 'Lashmi (Parent)'}</span>
                              <span>{m.timestamp}</span>
                            </div>
                            <p className="whitespace-pre-wrap">{m.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Legal & Medical Disclaimer */}
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-[11px] text-white/40 leading-relaxed">
                  Medical Note: This chat transcript represents guidance provided during an on-demand 20-minute pediatric consultation. It does not replace in-person physical emergency intervention. In case of acute respiratory distress, severe dehydration, or persistent high fever, visit your nearest pediatric emergency department immediately.
                </div>
              </>
            ) : (
              <div className="text-center py-16 text-white/40">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Select a consultation from the left to view the complete chat transcript.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
