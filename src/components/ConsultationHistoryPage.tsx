import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  CalendarDays, 
  Clock, 
  Building2, 
  MapPin, 
  FileText, 
  Search, 
  Printer, 
  Stethoscope, 
  CheckCircle2, 
  Calendar, 
  User, 
  Sparkles, 
  Trash2, 
  Plus, 
  Check, 
  X,
  Share2
} from 'lucide-react';
import { playSound } from '../lib/sounds';
import { useAuth } from '../lib/AuthContext';
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  PastConsultation, 
  UpcomingConsultation,
  getSavedPastConsultations, 
  savePastConsultations,
  getSavedUpcomingConsultations,
  saveUpcomingConsultations
} from '../data/consultationsData';

export const ConsultationHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, profile } = useAuth();

  // Tab: upcoming vs past (synced with query param)
  const initialTab = searchParams.get('tab') === 'upcoming' ? 'upcoming' : 'past';
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>(initialTab);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCityFilter, setSelectedCityFilter] = useState('all');

  // Past consultations state
  const [pastConsultations, setPastConsultations] = useState<PastConsultation[]>(() => getSavedPastConsultations());
  const [selectedClinicalSlip, setSelectedClinicalSlip] = useState<PastConsultation | null>(null);

  // Upcoming consultations state (synced with Firestore when logged in)
  const [upcomingConsultations, setUpcomingConsultations] = useState<UpcomingConsultation[]>(() => getSavedUpcomingConsultations());
  const [loadingUpcoming, setLoadingUpcoming] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync tab with URL
  const handleTabChange = (tab: 'upcoming' | 'past') => {
    playSound('click');
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Listen to Firestore consultations for user
  useEffect(() => {
    if (!user) return;
    setLoadingUpcoming(true);
    const q = query(
      collection(db, 'consultations'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: UpcomingConsultation[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          doctorName: data.doctorName || 'Verified Pediatrician',
          degrees: data.degrees || 'MBBS, DNB',
          clinic: data.clinic || 'Children Clinic',
          hospital: data.clinic || 'Children Clinic',
          city: data.city || 'Bengaluru',
          date: data.date || 'Upcoming',
          time: data.time || '10:00 AM',
          specialty: data.specialty || 'General Pediatrics',
          status: data.status || 'Confirmed',
          feePaid: '₹399 (Pay at Hospital)',
          mode: 'In-Person Clinic Visit'
        });
      });

      if (items.length > 0) {
        setUpcomingConsultations(items);
        saveUpcomingConsultations(items);
      }
      setLoadingUpcoming(false);
    }, (error) => {
      console.error("Error loading user consultations:", error);
      setLoadingUpcoming(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Cancel upcoming appointment
  const handleCancelAppointment = async (id: string, docName: string) => {
    playSound('pop');
    try {
      // Remove from Firestore if online
      if (user && db) {
        try {
          await deleteDoc(doc(db, 'consultations', id));
        } catch (e) {
          console.warn("Firestore delete fallback:", e);
        }
      }
      const updated = upcomingConsultations.filter(c => c.id !== id);
      setUpcomingConsultations(updated);
      saveUpcomingConsultations(updated);

      setToastMessage(`Consultation with ${docName} was successfully cancelled.`);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  // Delete past consultation record
  const handleDeletePastConsultation = (id: string) => {
    playSound('pop');
    const updated = pastConsultations.filter(c => c.id !== id);
    setPastConsultations(updated);
    savePastConsultations(updated);
    setToastMessage("Record deleted from consultation history.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cities extracted from both lists for filter
  const allCities = useMemo(() => {
    const set = new Set<string>();
    pastConsultations.forEach(c => c.city && set.add(c.city));
    upcomingConsultations.forEach(c => c.city && set.add(c.city));
    return Array.from(set).sort();
  }, [pastConsultations, upcomingConsultations]);

  // Filtered Upcoming list
  const filteredUpcoming = useMemo(() => {
    return upcomingConsultations.filter(item => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || 
        item.doctorName.toLowerCase().includes(q) ||
        item.clinic.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.specialty.toLowerCase().includes(q);
      
      const matchCity = selectedCityFilter === 'all' || item.city.toLowerCase() === selectedCityFilter.toLowerCase();
      return matchSearch && matchCity;
    });
  }, [upcomingConsultations, searchQuery, selectedCityFilter]);

  // Filtered Past list
  const filteredPast = useMemo(() => {
    return pastConsultations.filter(item => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || 
        item.doctorName.toLowerCase().includes(q) ||
        item.hospital.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.topic.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q);
      
      const matchCity = selectedCityFilter === 'all' || item.city.toLowerCase() === selectedCityFilter.toLowerCase();
      return matchSearch && matchCity;
    });
  }, [pastConsultations, searchQuery, selectedCityFilter]);

  return (
    <div className="min-h-screen bg-[#070b14] text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Breadcrumb & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <button
            type="button"
            onClick={() => { playSound('pop'); navigate('/?tab=pediatric'); }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-bold transition-all border border-white/10 w-fit cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Pediatric Care</span>
          </button>

          <button
            type="button"
            onClick={() => { playSound('pop'); navigate('/?tab=pediatric'); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/25 w-fit cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Book New 1:1 Consultation</span>
          </button>
        </div>

        {/* Page Hero Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-purple-950/40 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-black uppercase tracking-wider mb-2">
                <Stethoscope className="w-3.5 h-3.5 text-indigo-400" />
                <span>Certified Pediatric Health Records</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                <CalendarDays className="w-8 h-8 text-indigo-400" />
                <span>Pediatric Consultation History</span>
              </h1>
              <p className="text-white/60 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
                Review your upcoming verified doctor appointments, clinical diagnosis slips, pediatric prescriptions (Rx), and child health milestones.
              </p>
            </div>

            {/* Quick Stat Badges */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center min-w-[110px]">
                <div className="text-2xl font-black text-indigo-300">{upcomingConsultations.length}</div>
                <div className="text-[11px] font-bold text-white/50 uppercase mt-0.5">Upcoming</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center min-w-[110px]">
                <div className="text-2xl font-black text-emerald-400">{pastConsultations.length}</div>
                <div className="text-[11px] font-bold text-white/50 uppercase mt-0.5">Past Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold shadow-lg"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-white/60 hover:text-white px-2 py-1">✕</button>
          </motion.div>
        )}

        {/* Tab Selector & Filter Toolbar */}
        <div className="p-4 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Main Tabs: Upcoming vs Past Consultations */}
          <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => handleTabChange('upcoming')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'upcoming'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 font-black'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Upcoming Appointments</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                activeTab === 'upcoming' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/50'
              }`}>
                {upcomingConsultations.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('past')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'past'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 font-black'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Past Consultations</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                activeTab === 'past' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/50'
              }`}>
                {pastConsultations.length}
              </span>
            </button>
          </div>

          {/* Search and City Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* City Dropdown */}
            {allCities.length > 0 && (
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-2 rounded-xl border border-white/10 text-xs">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="text-white/50 font-bold hidden sm:inline">City:</span>
                <select
                  value={selectedCityFilter}
                  onChange={(e) => { playSound('click'); setSelectedCityFilter(e.target.value); }}
                  className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer pr-1"
                >
                  <option value="all" className="bg-neutral-900 text-white">All Cities</option>
                  {allCities.map(city => (
                    <option key={city} value={city} className="bg-neutral-900 text-white">{city}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Keyword Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search doctor, hospital, diagnosis..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-7 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-400 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        {activeTab === 'upcoming' ? (
          /* ================= UPCOMING APPOINTMENTS TAB ================= */
          <div className="space-y-4">
            {loadingUpcoming ? (
              <div className="p-16 rounded-3xl bg-white/[0.02] border border-white/10 text-center">
                <Clock className="w-10 h-10 text-indigo-400 animate-spin mx-auto mb-3" />
                <p className="text-white/60 text-sm">Loading confirmed consultations...</p>
              </div>
            ) : filteredUpcoming.length === 0 ? (
              <div className="p-16 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-4">
                <CalendarDays className="w-14 h-14 text-white/20 mx-auto" />
                <div>
                  <h3 className="text-lg font-bold text-white">No Upcoming Consultations Found</h3>
                  <p className="text-xs text-white/50 mt-1 max-w-md mx-auto leading-relaxed">
                    You do not have any upcoming pediatric appointments matching your search. Book an instant appointment with certified pediatricians nationwide.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { playSound('pop'); navigate('/?tab=pediatric'); }}
                  className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
                >
                  + Book an Appointment Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredUpcoming.map(item => (
                  <div
                    key={item.id}
                    className="p-6 sm:p-7 rounded-3xl bg-white/[0.025] hover:bg-white/[0.04] border border-white/10 hover:border-white/25 transition-all shadow-xl flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* Header */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                          {item.mode || 'In-Person Clinic Visit'}
                        </span>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Confirmed ✓</span>
                        </span>
                      </div>

                      {/* Doctor details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0 text-xl font-bold">
                            👨‍⚕️
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-lg sm:text-xl font-black text-white">{item.doctorName}</h3>
                              {item.degrees && (
                                <span className="text-[10px] font-mono text-amber-300 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded font-bold">
                                  {item.degrees}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-indigo-300 font-medium mt-0.5">{item.specialty}</p>
                          </div>
                        </div>

                        {/* Clinic info */}
                        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1 text-xs">
                          <div className="flex items-center gap-1.5 text-white/90 font-bold">
                            <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>{item.clinic || item.hospital}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-white/50 text-[11px] ml-5.5">
                            <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span>{item.city} {item.state ? `• ${item.state}` : ''}</span>
                          </div>
                        </div>

                        {/* Date & Time pill boxes */}
                        <div className="grid grid-cols-2 gap-2.5 pt-1">
                          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-red-400 shrink-0" />
                            <div>
                              <div className="text-[9px] uppercase font-bold text-white/40">Date</div>
                              <div className="text-xs font-bold text-white">{item.date}</div>
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                            <div>
                              <div className="text-[9px] uppercase font-bold text-white/40">Time Slot</div>
                              <div className="text-xs font-bold text-white">{item.time}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                      <div className="text-xs text-emerald-400 font-bold">
                        {item.feePaid || '₹399 (Pay at Hospital)'}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => { playSound('pop'); navigate('/?tab=pediatric'); }}
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition-colors"
                        >
                          Reschedule
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancelAppointment(item.id, item.doctorName)}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-all text-xs"
                          title="Cancel appointment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ================= PAST CONSULTATIONS TAB ================= */
          <div className="space-y-4">
            {filteredPast.length === 0 ? (
              <div className="p-16 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-3">
                <FileText className="w-14 h-14 text-white/20 mx-auto" />
                <h3 className="text-lg font-bold text-white">No Past Consultations Found</h3>
                <p className="text-xs text-white/50 max-w-md mx-auto">
                  No records match your active search filter.
                </p>
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setSelectedCityFilter('all'); }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPast.map(past => (
                  <div
                    key={past.id}
                    className="p-6 sm:p-7 rounded-3xl bg-white/[0.025] hover:bg-white/[0.04] border border-white/10 hover:border-white/25 transition-all shadow-xl flex flex-col justify-between relative overflow-hidden"
                  >
                    <div>
                      {/* Top status */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="text-xs font-bold text-white/50 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{past.date} • {past.time}</span>
                        </span>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          Completed ✓
                        </span>
                      </div>

                      {/* Doctor info */}
                      <div className="space-y-3 mb-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg sm:text-xl font-black text-white">{past.doctorName}</h3>
                            <span className="text-[10px] font-mono text-amber-300 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded font-bold">
                              {past.degrees}
                            </span>
                          </div>
                          <div className="text-xs text-indigo-300 font-semibold flex items-center gap-1 mt-1">
                            <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{past.hospital}, {past.location} ({past.city})</span>
                          </div>
                          <div className="text-[11px] text-white/45 mt-0.5">{past.specialty}</div>
                        </div>

                        {/* Focus Topic & Clinical Summary Box */}
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                          <div className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                            <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>Focus: {past.topic}</span>
                          </div>
                          <p className="text-xs text-white/70 leading-relaxed">
                            {past.summary}
                          </p>

                          {/* Vitals pill */}
                          {past.vitals && (
                            <div className="pt-2 border-t border-white/5 text-[11px] text-white/60 font-mono">
                              📊 <strong className="text-white/80">Vitals:</strong> {past.vitals}
                            </div>
                          )}
                        </div>

                        {/* Prescriptions Preview */}
                        {past.prescriptionRx && past.prescriptionRx.length > 0 && (
                          <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 space-y-1.5">
                            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>Prescribed Care (Rx):</span>
                            </div>
                            {past.prescriptionRx.map((rx, idx) => (
                              <div key={idx} className="text-xs text-emerald-200/90 font-medium flex items-start gap-1.5">
                                <span className="font-mono text-emerald-400 font-bold shrink-0">{idx + 1}.</span>
                                <span>{rx}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => { playSound('glass'); setSelectedClinicalSlip(past); }}
                        className="px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white text-xs font-bold border border-indigo-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Clinical Slip (PDF)</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            playSound('click');
                            navigate('/?tab=pediatric');
                          }}
                          className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition-colors"
                        >
                          Book Follow-up
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePastConsultation(past.id)}
                          className="p-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-white/30 hover:text-rose-300 border border-white/10 transition-colors text-xs"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= CLINICAL SLIP MODAL ================= */}
      <AnimatePresence>
        {selectedClinicalSlip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="max-w-2xl w-full bg-slate-900 border border-white/15 rounded-3xl overflow-hidden shadow-2xl text-left"
            >
              {/* Slip Header */}
              <div className="p-6 bg-gradient-to-r from-indigo-900/60 to-purple-900/40 border-b border-white/10 relative">
                <button
                  onClick={() => setSelectedClinicalSlip(null)}
                  className="absolute right-5 top-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-black uppercase tracking-wider mb-2">
                  <Stethoscope className="w-3.5 h-3.5" />
                  Official Certified Clinical Slip
                </div>
                <h3 className="text-xl font-black text-white">Pediatric Consultation Record</h3>
                <p className="text-xs text-indigo-200/70 mt-0.5">
                  Verified electronic health consultation record &amp; developmental notes.
                </p>
              </div>

              {/* Slip Body */}
              <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto scrollbar-none">
                {/* Doctor details banner */}
                <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/10 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-2xl shrink-0">
                    👨‍⚕️
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-black text-white">{selectedClinicalSlip.doctorName}</span>
                      <span className="text-[10px] font-mono text-amber-300 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded font-bold">
                        {selectedClinicalSlip.degrees}
                      </span>
                    </div>
                    <div className="text-xs text-indigo-300 font-semibold flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{selectedClinicalSlip.hospital}, {selectedClinicalSlip.location} ({selectedClinicalSlip.city})</span>
                    </div>
                    <div className="text-xs text-white/50 mt-0.5">
                      Specialty: {selectedClinicalSlip.specialty}
                    </div>
                  </div>
                </div>

                {/* Date & Vitals info */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-white/40 block font-bold uppercase text-[10px]">Consultation Date &amp; Time</span>
                    <span className="text-white font-black mt-0.5 block">{selectedClinicalSlip.date} • {selectedClinicalSlip.time}</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-white/40 block font-bold uppercase text-[10px]">Recorded Vitals</span>
                    <span className="text-amber-300 font-bold mt-0.5 block">{selectedClinicalSlip.vitals}</span>
                  </div>
                </div>

                {/* Clinical Notes */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Clinical Diagnosis &amp; Evaluation: {selectedClinicalSlip.topic}
                  </h4>
                  <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl text-xs text-white/80 leading-relaxed">
                    {selectedClinicalSlip.summary}
                  </div>
                </div>

                {/* Prescription & Protocol */}
                {selectedClinicalSlip.prescriptionRx && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      Prescribed Care &amp; Dietary Protocol (Rx)
                    </h4>
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-2xl space-y-1.5">
                      {selectedClinicalSlip.prescriptionRx.map((rx, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-emerald-200/90 font-medium">
                          <span className="font-mono text-emerald-400 font-bold">{idx + 1}.</span>
                          <span>{rx}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Slip Footer */}
              <div className="p-5 bg-white/[0.02] border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => { playSound('pop'); window.print(); }}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Slip</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedClinicalSlip(null)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
