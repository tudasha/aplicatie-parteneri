import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft, Building2, UserCheck, MessageSquare, Mail, Phone,
  Star, TrendingUp, Save, Plus, CheckCircle2, Clock, Zap, Calendar, CalendarPlus
} from 'lucide-react';
import {
  BarChart as ReBarChart, Bar as ReBar, XAxis as ReXAxis, YAxis as ReYAxis,
  CartesianGrid as ReCartesianGrid, Tooltip as ReTooltip, ResponsiveContainer as ReResponsiveContainer,
  PieChart as RePieChart, Pie as RePie, Cell as ReCell, Legend as ReLegend,
  LineChart as ReLineChart, Line as ReLine
} from 'recharts';

const PACKAGE_COLORS = [
  '#800020', '#2563EB', '#059669', '#D97706', '#7C3AED',
  '#DC2626', '#0891B2', '#C026D3', '#EA580C', '#4F46E5'
];

// Package tier weights for auto-satisfaction calculation
const PACKAGE_TIERS = {
  'Platinum': 10, 'Diamond': 9, 'Gold': 8, 'Silver': 6, 'Bronze': 4
};

const CURRENT_SEASON = String(new Date().getFullYear());

// Auto-calculate satisfaction based on amount, package, and confirmation
function computeAutoSatisfaction(company) {
  if (!company) return null;
  let score = 0;
  let factors = 0;

  // Factor 1: Confirmation status (0-10)
  if (company.confirmed) { score += 10; } else { score += 2; }
  factors++;

  // Factor 2: Package tier (0-10)
  if (company.sponsorshipPackage && company.sponsorshipPackage !== '-') {
    const tierScore = PACKAGE_TIERS[company.sponsorshipPackage] || 5;
    score += tierScore;
  } else {
    score += 1;
  }
  factors++;

  // Factor 3: Amount (based on typical ranges) (0-10)
  const amount = company.sponsorshipAmount || 0;
  if (amount >= 50000) score += 10;
  else if (amount >= 20000) score += 8;
  else if (amount >= 10000) score += 6;
  else if (amount >= 5000) score += 4;
  else if (amount > 0) score += 2;
  else score += 1;
  factors++;

  return Math.min(10, Math.round(score / factors));
}

const CompanyDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [notes, setNotes] = useState([]);
  const [stats, setStats] = useState(null);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  // Note form state
  const [noteText, setNoteText] = useState('');
  const [emailModel, setEmailModel] = useState('');
  const [phoneScript, setPhoneScript] = useState('');
  const [satisfaction, setSatisfaction] = useState(5);
  const [showNoteForm, setShowNoteForm] = useState(false);

  // Confirm form state
  const [showConfirmForm, setShowConfirmForm] = useState(false);
  const [confirmData, setConfirmData] = useState({ pkgName: '', amount: 0, year: String(new Date().getFullYear()) });

  // Assignment
  const [assignUser, setAssignUser] = useState('');

  // Season selector state
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [metricsSeason, setMetricsSeason] = useState('All');

  useEffect(() => {
    fetchAll();
  }, [id]);

  const fetchAll = async (targetSeason) => {
    setLoading(true);
    try {
      let activeSeason = targetSeason;
      
      // Grab available seasons first if we lack one
      const seasonsRes = await axios.get(`/api/partners/${id}/seasons`);
      const availableSeasons = seasonsRes.data || [];
      setSeasons(availableSeasons);
      
      if (!activeSeason && availableSeasons.length > 0) {
        activeSeason = availableSeasons[0];
        setSelectedSeason(activeSeason);
        setMetricsSeason(activeSeason);
      }

      const seasonParam = activeSeason ? `?season=${activeSeason}` : '';
      
      const [compRes, notesRes, statsRes, teamRes] = await Promise.all([
        axios.get(`/api/partners/${id}${seasonParam}`),
        axios.get(`/api/partners/${id}/notes${seasonParam}`),
        axios.get(`/api/partners/${id}/stats${seasonParam}`),
        axios.get('/api/users')
      ]);

      setCompany(compRes.data);
      setNotes(notesRes.data);
      setStats(statsRes.data);
      setTeam(teamRes.data);
      if (compRes.data?.assignedUser) {
        setAssignUser(compRes.data.assignedUser);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeasonChange = (season) => {
    setSelectedSeason(season);
    setMetricsSeason(season);
    fetchAll(season);
  };

  const handleAddToCurrentSeason = async () => {
    try {
      await axios.post(`/api/partners/${id}/add-to-season`, { season: CURRENT_SEASON });
      handleSeasonChange(CURRENT_SEASON);
    } catch (err) { console.error(err); }
  };

  // Metrics season filter (right panel)
  const handleMetricsSeasonChange = async (season) => {
    setMetricsSeason(season);
    try {
      const param = season === 'All' ? '' : `?season=${season}`;
      const res = await axios.get(`/api/partners/${id}/stats${param}`);
      setStats(res.data);
    } catch (err) { console.error(err); }
  };

  const handleAssign = async () => {
    if (!assignUser) return;
    try {
      await axios.post(`/api/partners/${id}/assign`, { username: assignUser });
      fetchAll(selectedSeason);
    } catch (err) { console.error(err); }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/partners/${id}/notes`, {
        noteText,
        emailModel,
        phoneScript,
        satisfactionRating: satisfaction,
        season: selectedSeason
      });
      setNoteText('');
      setEmailModel('');
      setPhoneScript('');
      setSatisfaction(5);
      setShowNoteForm(false);
      fetchAll(selectedSeason);
    } catch (err) { console.error(err); }
  };

  const handleConfirmPartner = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/partners/confirm', {
        ...confirmData,
        amount: Number(confirmData.amount),
        companyId: Number(id)
      });
      setShowConfirmForm(false);
      setConfirmData({ pkgName: '', amount: 0, year: selectedSeason || String(new Date().getFullYear()) });
      fetchAll(selectedSeason);
    } catch (err) { console.error(err); }
  };

  const handleToggleStatus = async () => {
    try {
      await axios.post(`/api/partners/toggle/${id}`, { season: selectedSeason });
      fetchAll(selectedSeason);
    } catch (err) { console.error(err); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-clay-brand"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="clay-card text-center p-12">
          <p className="text-slate-400 font-bold text-lg">Company not found</p>
          <button onClick={() => navigate('/dashboard')} className="clay-button-primary mt-4">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Build unique package color map for stats
  const pkgColorMap = {};
  let colorIdx = 0;
  stats?.packageBreakdown?.forEach(p => {
    if (!pkgColorMap[p.name]) {
      pkgColorMap[p.name] = PACKAGE_COLORS[colorIdx % PACKAGE_COLORS.length];
      colorIdx++;
    }
  });

  const autoSatisfaction = stats?.autoSatisfaction ?? computeAutoSatisfaction(company);

  // Access control: only Team Leader, Admin, or assigned user can modify
  const canEdit = user.role === 'Team Leader' || user.role === 'Admin' || user.username === company.assignedUser;

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      {/* Back button & Header */}
      <header className="clay-card flex justify-between items-center mb-8 py-4 px-8">
        <div className="flex items-center gap-4">
          <button
            id="cd-back-btn"
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 bg-white rounded-xl shadow-clay-sm flex items-center justify-center text-clay-brand hover:shadow-clay-md transition-shadow"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 bg-clay-brand rounded-xl shadow-clay-sm flex items-center justify-center text-white">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-clay-brand">{company.compName}</h1>
            <p className="text-sm font-bold text-slate-400">{company.compProfile || 'No profile'}</p>
          </div>
        </div>
        <div id="cd-actions" className="flex items-center gap-3">
          {/* Season Dropdown */}
          {seasons.length > 0 && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <select
                className="clay-input text-sm !py-2 !px-3 w-28 appearance-none font-bold text-slate-700"
                value={selectedSeason}
                onChange={e => handleSeasonChange(e.target.value)}
              >
                {seasons.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}
          {/* Add to Current Season button — only if not already in current season */}
          {!seasons.includes(CURRENT_SEASON) && (
            <button
              onClick={handleAddToCurrentSeason}
              title={`Add to ${CURRENT_SEASON} season`}
              className="clay-button-primary text-sm flex items-center gap-2"
            >
              <CalendarPlus className="w-4 h-4" /> Add to {CURRENT_SEASON}
            </button>
          )}
          <div id="cd-status-badge" className={`flex items-center gap-2 font-bold text-sm px-5 py-2 rounded-full shadow-clay-inset ${company.confirmed ? 'text-green-600 bg-green-50' : 'text-orange-500 bg-orange-50'}`}>
            {company.confirmed ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            {company.confirmed ? 'Confirmed' : 'Pending'}
          </div>
          {/* Confirm / Unconfirm buttons — only authorized users */}
          {canEdit && !company.confirmed && (
            <button
              id="cd-confirm-btn"
              onClick={() => setShowConfirmForm(true)}
              className="clay-button-primary text-sm flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Confirm Partner
            </button>
          )}
          {canEdit && company.confirmed && (
            <button
              onClick={handleToggleStatus}
              className="px-4 py-2 rounded-xl bg-orange-50 text-orange-500 font-bold text-sm shadow-clay-sm hover:shadow-clay-md transition-all"
            >
              Unconfirm
            </button>
          )}
        </div>
      </header>

      {/* Confirm Form (modal-like panel) */}
      {showConfirmForm && (
        <div className="clay-card mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-black text-clay-brand mb-4">Confirm Sponsorship</h3>
          <form onSubmit={handleConfirmPartner} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-2">Package Name</label>
              <input
                className="clay-input text-sm"
                placeholder="e.g. Platinum, Gold"
                value={confirmData.pkgName}
                onChange={e => setConfirmData({ ...confirmData, pkgName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-2">Amount (€)</label>
              <input
                type="number"
                className="clay-input text-sm"
                placeholder="20000"
                value={confirmData.amount}
                onChange={e => setConfirmData({ ...confirmData, amount: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-2">Season</label>
              <select
                className="clay-input text-sm appearance-none"
                value={confirmData.year}
                onChange={e => setConfirmData({ ...confirmData, year: e.target.value })}
              >
                {[...new Set([selectedSeason, CURRENT_SEASON, ...seasons])].filter(Boolean).sort().reverse().map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3 flex gap-4">
              <button type="button" onClick={() => setShowConfirmForm(false)} className="clay-button-secondary text-sm">Cancel</button>
              <button type="submit" className="clay-button-primary text-sm">Confirm & Save</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">

          {/* Assignment & Sponsorship Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div id="cd-assignment-card" className="clay-card">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-clay-brand" /> Assigned Contact
              </h3>
              {user.role === 'Team Leader' || user.role === 'Admin' ? (
                <div className="flex gap-2">
                  <select
                    className="clay-input text-sm flex-1"
                    value={assignUser}
                    onChange={e => setAssignUser(e.target.value)}
                  >
                    <option value="">Select user...</option>
                    {team.map(t => (
                      <option key={t.username} value={t.username}>{t.fullName} ({t.position})</option>
                    ))}
                  </select>
                  <button onClick={handleAssign} className="clay-button-primary text-sm px-4">
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className="font-bold text-slate-700 text-lg">
                  {company.assignedUser || <span className="text-slate-300 italic">Unassigned</span>}
                </p>
              )}
            </div>

            <div id="cd-sponsorship-card" className="clay-card">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Sponsorship</h3>
              {company.confirmed ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-bold text-slate-400">Package</span>
                    <span className="font-black text-slate-700">{company.sponsorshipPackage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-bold text-slate-400">Amount</span>
                    <span className="font-black text-green-600">{company.sponsorshipAmount?.toLocaleString()}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-bold text-slate-400">Season</span>
                    <span className="font-black text-slate-700">{company.year}</span>
                  </div>
                </div>
              ) : (
                <p className="text-slate-300 font-bold italic">No sponsorship confirmed yet</p>
              )}
            </div>
          </div>

          {/* Auto Satisfaction Score */}
          <div id="cd-auto-satisfaction" className="clay-card">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" /> Auto-Calculated Satisfaction
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-full max-w-xs bg-clay-bg rounded-full h-3 shadow-clay-inset overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(autoSatisfaction || 0) * 10}%`,
                      background: (autoSatisfaction || 0) >= 7 ? '#059669' : (autoSatisfaction || 0) >= 4 ? '#D97706' : '#DC2626'
                    }}
                  />
                </div>
                <span className="w-12 h-12 bg-white rounded-xl shadow-clay-sm flex items-center justify-center font-black text-xl"
                  style={{ color: (autoSatisfaction || 0) >= 7 ? '#059669' : (autoSatisfaction || 0) >= 4 ? '#D97706' : '#DC2626' }}
                >
                  {autoSatisfaction || '—'}
                </span>
              </div>
            </div>
            <p className="text-[10px] text-slate-300 font-bold mt-2">
              Based on: confirmation status, package tier, and sponsorship amount
            </p>
          </div>

          {/* Communication Templates (last used from notes) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="clay-card">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" /> Last Email Model
              </h3>
              <div className="bg-clay-bg rounded-xl p-4 shadow-clay-inset min-h-[80px] text-sm text-slate-600 whitespace-pre-wrap">
                {notes.find(n => n.emailModel)?.emailModel || <span className="text-slate-300 italic">No email model recorded</span>}
              </div>
            </div>
            <div className="clay-card">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-500" /> Last Phone Script
              </h3>
              <div className="bg-clay-bg rounded-xl p-4 shadow-clay-inset min-h-[80px] text-sm text-slate-600 whitespace-pre-wrap">
                {notes.find(n => n.phoneScript)?.phoneScript || <span className="text-slate-300 italic">No phone script recorded</span>}
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div id="cd-notes-section" className="clay-card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-clay-brand" /> Notations
              </h3>
              {canEdit && (
                <button
                  id="cd-add-note-btn"
                  onClick={() => setShowNoteForm(!showNoteForm)}
                  className="clay-button-primary text-sm flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Note
                </button>
              )}
            </div>

            {/* Add Note Form */}
            {showNoteForm && (
              <form onSubmit={handleAddNote} className="mb-8 p-6 bg-clay-bg rounded-2xl shadow-clay-inset space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-2">Note</label>
                  <textarea
                    className="clay-input min-h-[80px] resize-y"
                    placeholder="Write your notation..."
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-2">Email Model Used</label>
                    <textarea
                      className="clay-input min-h-[60px] resize-y text-sm"
                      placeholder="Paste the email template..."
                      value={emailModel}
                      onChange={e => setEmailModel(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-2">Phone Call Script</label>
                    <textarea
                      className="clay-input min-h-[60px] resize-y text-sm"
                      placeholder="Paste the phone script..."
                      value={phoneScript}
                      onChange={e => setPhoneScript(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-2">
                    Company Response — Satisfaction ({satisfaction}/10)
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-red-400">Low</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={satisfaction}
                      onChange={e => setSatisfaction(Number(e.target.value))}
                      className="flex-1 h-2 rounded-full appearance-none cursor-pointer accent-clay-brand"
                      style={{
                        background: `linear-gradient(to right, #DC2626 0%, #D97706 50%, #059669 100%)`
                      }}
                    />
                    <span className="text-xs font-bold text-green-500">High</span>
                    <span className="w-10 h-10 bg-white rounded-xl shadow-clay-sm flex items-center justify-center font-black text-clay-brand text-lg">
                      {satisfaction}
                    </span>
                  </div>
                </div>
                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => setShowNoteForm(false)} className="flex-1 clay-button-secondary">Cancel</button>
                  <button type="submit" className="flex-1 clay-button-primary">Save Note</button>
                </div>
              </form>
            )}

            {/* Notes List */}
            <div className="space-y-4">
              {notes.length === 0 ? (
                <p className="text-center text-slate-300 font-bold italic py-8">No notations yet</p>
              ) : notes.map(note => (
                <div key={note.noteId} className="p-4 bg-white rounded-2xl shadow-clay-sm border border-white/50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-clay-brand">{note.authorUsername}</span>
                      <span className="text-[10px] font-bold text-slate-300">
                        {note.createdAt ? new Date(note.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        }) : ''}
                      </span>
                    </div>
                    {note.satisfactionRating > 0 && (
                      <div className="flex items-center gap-1 px-3 py-1 rounded-full shadow-clay-inset text-xs font-black"
                        style={{
                          color: note.satisfactionRating >= 7 ? '#059669' : note.satisfactionRating >= 4 ? '#D97706' : '#DC2626',
                          backgroundColor: note.satisfactionRating >= 7 ? '#ECFDF5' : note.satisfactionRating >= 4 ? '#FFFBEB' : '#FEF2F2'
                        }}
                      >
                        <Star className="w-3 h-3" />
                        {note.satisfactionRating}/10
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap">{note.noteText}</p>
                  {(note.emailModel || note.phoneScript) && (
                    <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3">
                      {note.emailModel && (
                        <div className="text-[10px]">
                          <span className="font-black text-blue-400 uppercase">Email Model</span>
                          <p className="text-slate-400 mt-1 line-clamp-2">{note.emailModel}</p>
                        </div>
                      )}
                      {note.phoneScript && (
                        <div className="text-[10px]">
                          <span className="font-black text-green-400 uppercase">Phone Script</span>
                          <p className="text-slate-400 mt-1 line-clamp-2">{note.phoneScript}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — Company Metrics */}
        <div id="cd-right-metrics" className="space-y-8">
          {/* Metrics Season Filter */}
          <div className="clay-card">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Metrics View</h3>
              <select
                className="clay-input text-sm !py-1.5 !px-3 w-32 appearance-none font-bold text-slate-700"
                value={metricsSeason}
                onChange={e => handleMetricsSeasonChange(e.target.value)}
              >
                <option value="All">All Seasons</option>
                {seasons.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Average Satisfaction */}
          <div className="clay-card text-center">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Avg. Response (Blended)</h3>
            <div className="w-24 h-24 mx-auto bg-white rounded-full shadow-clay-md flex items-center justify-center">
              <span className="text-3xl font-black" style={{
                color: (stats?.avgSatisfaction || 0) >= 7 ? '#059669' : (stats?.avgSatisfaction || 0) >= 4 ? '#D97706' : '#DC2626'
              }}>
                {stats?.avgSatisfaction ? stats.avgSatisfaction.toFixed(1) : '—'}
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-300 mt-2">out of 10 (manual + auto)</p>
          </div>

          {/* Total Revenue */}
          <div className="clay-card">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Total Revenue</h3>
            <p className="text-2xl font-black text-green-600">
              {stats?.totalRevenue ? `${stats.totalRevenue.toLocaleString()}€` : '0€'}
            </p>
          </div>

          {/* Revenue by Year Chart */}
          {stats?.revenueByYear?.length > 0 && (
            <div className="clay-card">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Revenue by Year</h3>
              <div className="h-48">
                <ReResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={stats.revenueByYear}>
                    <ReCartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <ReXAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontWeight: 'bold', fontSize: 11 }} />
                    <ReYAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontWeight: 'bold', fontSize: 11 }} />
                    <ReTooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '10px' }} />
                    <ReBar dataKey="total" fill="#800020" radius={[8, 8, 0, 0]} barSize={30} />
                  </ReBarChart>
                </ReResponsiveContainer>
              </div>
            </div>
          )}

          {/* Package Breakdown (colored per package) */}
          {stats?.packageBreakdown?.length > 0 && (
            <div className="clay-card">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Package Breakdown</h3>
              <div className="h-48">
                <ReResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <RePie
                      data={stats.packageBreakdown}
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="name"
                    >
                      {stats.packageBreakdown.map((entry, index) => (
                        <ReCell key={`cell-${index}`} fill={pkgColorMap[entry.name] || PACKAGE_COLORS[index % PACKAGE_COLORS.length]} />
                      ))}
                    </RePie>
                    <ReTooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
                    <ReLegend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                  </RePieChart>
                </ReResponsiveContainer>
              </div>
            </div>
          )}

          {/* Satisfaction Over Time */}
          {stats?.satisfactionHistory?.length > 0 && (
            <div className="clay-card">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Response History</h3>
              <div className="h-48">
                <ReResponsiveContainer width="100%" height="100%">
                  <ReLineChart data={stats.satisfactionHistory}>
                    <ReCartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <ReXAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94A3B8', fontWeight: 'bold', fontSize: 9 }}
                      tickFormatter={(val) => {
                        try { return new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); } catch { return val; }
                      }}
                    />
                    <ReYAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontWeight: 'bold', fontSize: 11 }} />
                    <ReTooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
                    <ReLine type="monotone" dataKey="rating" stroke="#800020" strokeWidth={3} dot={{ r: 5, fill: '#800020' }} />
                  </ReLineChart>
                </ReResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
