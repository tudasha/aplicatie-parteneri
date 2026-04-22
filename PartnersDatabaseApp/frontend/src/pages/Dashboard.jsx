import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  LogOut, Plus, Search, Filter, 
  CheckCircle2, Clock, Trash2, 
  User as UserIcon, Building2, Users,
  DollarSign, TrendingUp, Award, ExternalLink, Star, X, Briefcase, MessageSquare, HelpCircle,
  CalendarPlus
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

const CURRENT_SEASON = String(new Date().getFullYear());

const Dashboard = ({ user, onLogout, onOpenTutorial, dashboardActionsRef }) => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [myPartners, setMyPartners] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [newPartner, setNewPartner] = useState({ compName: '', compProfile: '' });
  const [confirmData, setConfirmData] = useState({ pkgName: '', amount: 0, year: CURRENT_SEASON });
  const [stats, setStats] = useState(null);
  const [showMetrics, setShowMetrics] = useState(false);
  const [metricsSeason, setMetricsSeason] = useState('All');

  // Register dashboard actions so the tutorial overlay (in App.jsx) can call them
  useEffect(() => {
    if (dashboardActionsRef) {
      dashboardActionsRef.current.setShowMetrics = setShowMetrics;
      dashboardActionsRef.current.getPartners = () => partners;
    }
  }, [dashboardActionsRef, partners, setShowMetrics]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterYear, setFilterYear] = useState('All');
  const [filterMinValue, setFilterMinValue] = useState('');
  const [filterContacted, setFilterContacted] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [partnersRes, myPartnersRes, teamRes, statsRes] = await Promise.all([
        axios.get('/api/partners?year=All'),
        axios.get('/api/partners/my-companies'),
        axios.get('/api/users'),
        axios.get('/api/stats')
      ]);
      setPartners(partnersRes.data);
      setMyPartners(myPartnersRes.data);
      setTeam(teamRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats filtered by season
  const fetchStatsBySeason = async (season) => {
    try {
      const res = await axios.get(`/api/stats?season=${season}`);
      setStats(res.data);
    } catch (err) { console.error(err); }
  };

  const handleMetricsSeasonChange = (season) => {
    setMetricsSeason(season);
    fetchStatsBySeason(season);
  };

  const handleAddToSeason = async (companyId) => {
    try {
      await axios.post(`/api/partners/${companyId}/add-to-season`, { season: CURRENT_SEASON });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (filterStatus !== 'All') params.append('status', filterStatus);
      if (filterYear !== 'All') params.append('year', filterYear);
      if (filterMinValue) params.append('minValue', filterMinValue);
      if (filterContacted !== 'All') params.append('contactedWithin', filterContacted);
      params.append('sortBy', sortBy);
      
      const res = await axios.get(`/api/partners/search?${params.toString()}`);
      setPartners(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterStatus('All');
    setFilterYear('All');
    setFilterMinValue('');
    setFilterContacted('All');
    setSortBy('name');
    fetchData();
  };

  const handleDelete = async (id) => {
    if (user.role !== 'Team Leader') return;
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`/api/partners/${id}`);
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleAddPartner = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/partners', newPartner);
      setShowAddModal(false);
      setNewPartner({ compName: '', compProfile: '' });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleConfirmPartner = async (e) => {
    e.preventDefault();
    if (!selectedPartner) return;
    try {
      await axios.post('/api/partners/confirm', { 
        ...confirmData, 
        amount: Number(confirmData.amount),
        companyId: selectedPartner.companyId 
      });
      setShowConfirmModal(false);
      setConfirmData({ pkgName: '', amount: 0, year: CURRENT_SEASON });
      fetchData();
    } catch (err) { 
      console.error(err); 
    }
  };

  const handleLogout = async () => {
    await axios.post('/api/auth/logout');
    onLogout();
  };

  // Build per-package color map for metrics
  const pkgColorMap = {};
  let colorIdx = 0;
  stats?.packageDistribution?.forEach(p => {
    if (!pkgColorMap[p.name]) {
      pkgColorMap[p.name] = PACKAGE_COLORS[colorIdx % PACKAGE_COLORS.length];
      colorIdx++;
    }
  });

  const hasActiveFilters = searchQuery || filterStatus !== 'All' || filterYear !== 'All' || filterMinValue || filterContacted !== 'All' || sortBy !== 'name';

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto overflow-x-hidden">
      {/* Header */}
      <header className="clay-card flex flex-col md:flex-row justify-between items-center gap-6 mb-10 py-4 px-4 md:px-8 text-center md:text-left">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-clay-brand rounded-xl shadow-clay-sm flex items-center justify-center text-white">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-clay-brand">ARTTU DASHBOARD</h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter">Partner Management System</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 mt-4 md:mt-0">
          <button 
            id="show-stats-btn"
            onClick={() => setShowMetrics(!showMetrics)}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${showMetrics ? 'bg-clay-brand text-white shadow-clay-sm' : 'bg-white text-slate-500 shadow-clay-sm hover:shadow-clay-md'}`}
          >
            <TrendingUp className="w-4 h-4" /> {showMetrics ? 'Hide Stats' : 'Show Stats'}
          </button>
          <div className="text-right ml-2 mr-2">
            <p className="font-black text-slate-700">{user.username}</p>
            <p className="text-xs font-bold text-slate-400 bg-white shadow-clay-inset px-2 py-0.5 rounded-full">{user.role}</p>
          </div>
          <button
            id="tutorial-btn"
            onClick={onOpenTutorial}
            title="Open Tutorial"
            className="w-10 h-10 bg-white rounded-full shadow-clay-sm flex items-center justify-center text-clay-brand hover:shadow-clay-md transition-shadow"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <button id="logout-btn" onClick={handleLogout} className="w-10 h-10 bg-white rounded-full shadow-clay-sm flex items-center justify-center text-red-500 hover:shadow-clay-md transition-shadow">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Metrics Section */}
      {showMetrics && stats && (
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
          {/* Season filter for metrics */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-slate-700">Metrics</h2>
            <div className="flex items-center gap-3">
              <label className="text-xs font-black text-slate-400 uppercase">Season</label>
              <select
                className="clay-input text-sm !py-2 !px-3 w-32"
                value={metricsSeason}
                onChange={e => handleMetricsSeasonChange(e.target.value)}
              >
                <option value="All">All Years</option>
                <option value={CURRENT_SEASON}>{CURRENT_SEASON}</option>
                <option value={String(Number(CURRENT_SEASON) - 1)}>{String(Number(CURRENT_SEASON) - 1)}</option>
              </select>
            </div>
          </div>
          <div id="metrics-stats-row" className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Revenue', value: `${stats.totalRevenue?.toLocaleString() || 0}€`, icon: <DollarSign className="w-6 h-6"/>, color: 'text-green-500', id: 'metric-revenue' },
              { label: 'Total Partners', value: stats.totalCompanies || 0, icon: <Users className="w-6 h-6"/>, color: 'text-blue-500', id: 'metric-partners' },
              { label: 'Confirmed', value: stats.confirmedCompanies || 0, icon: <Award className="w-6 h-6"/>, color: 'text-orange-500', id: 'metric-confirmed' },
              { label: 'Avg. Response (Blended)', value: stats.avgSatisfaction ? `${stats.avgSatisfaction.toFixed(1)}/10` : 'N/A', icon: <Star className="w-6 h-6"/>, color: stats.avgSatisfaction >= 7 ? 'text-green-500' : stats.avgSatisfaction >= 4 ? 'text-orange-500' : 'text-red-500', id: 'metric-satisfaction' },
            ].map((m, i) => (
              <div id={m.id} key={i} className="clay-card p-4 md:p-6 flex items-center gap-4 md:gap-6 min-w-0">
                <div className={`w-12 h-12 md:w-14 md:h-14 shrink-0 bg-white rounded-2xl shadow-clay-sm flex items-center justify-center ${m.color}`}>
                  {m.icon}
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
                  <p className="text-2xl font-black text-slate-700">{m.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div id="chart-revenue" className="clay-card p-4 md:p-8 min-w-0">
              <h3 className="text-sm font-black text-slate-400 uppercase mb-4 md:mb-8 ml-2">Revenue trend by Year</h3>
              <div className="h-64 mt-4">
                <ReResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={stats.revenueByYear}>
                    <ReCartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <ReXAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontWeight: 'bold'}} />
                    <ReYAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontWeight: 'bold'}} />
                    <ReTooltip 
                      cursor={{fill: '#F8FAFC'}}
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', padding: '12px'}}
                    />
                    <ReBar dataKey="total" fill="#800020" radius={[8, 8, 0, 0]} barSize={40} />
                  </ReBarChart>
                </ReResponsiveContainer>
              </div>
            </div>

            <div id="chart-packages" className="clay-card p-4 md:p-8 min-w-0 overflow-hidden">
              <h3 className="text-sm font-black text-slate-400 uppercase mb-4 md:mb-8 ml-2">Package Distribution</h3>
              <div className="h-64">
                <ReResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <RePie
                      data={stats.packageDistribution}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.packageDistribution?.map((entry, index) => (
                        <ReCell key={`cell-${index}`} fill={pkgColorMap[entry.name] || PACKAGE_COLORS[index % PACKAGE_COLORS.length]} />
                      ))}
                    </RePie>
                    <ReTooltip 
                       contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'}}
                    />
                    <ReLegend verticalAlign="middle" align="right" layout="vertical" iconType="circle" wrapperStyle={{paddingLeft: '20px', fontWeight: 'bold', fontSize: '12px'}} />
                  </RePieChart>
                </ReResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Optimal Outreach Windows */}
          {(stats.satisfactionByHour?.length > 0 || stats.satisfactionByDay?.length > 0 || stats.satisfactionByMonth?.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              {stats.satisfactionByMonth?.length > 0 && (
                <div className="clay-card p-4 md:p-8 hover:shadow-clay-md transition-shadow min-w-0">
                  <h3 className="text-sm font-black text-slate-400 uppercase mb-4 md:mb-8 ml-2 flex items-center gap-2">
                    <Star className="w-4 h-4 text-emerald-500" /> Best Month to Contact
                  </h3>
                  <div className="h-64 mt-4">
                    <ReResponsiveContainer width="100%" height="100%">
                      <ReBarChart data={stats.satisfactionByMonth}>
                        <ReCartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <ReXAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontWeight: 'bold'}} />
                        <ReYAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontWeight: 'bold'}} />
                        <ReTooltip 
                          cursor={{fill: '#F8FAFC'}}
                          contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', padding: '12px'}}
                          formatter={(val, name, props) => [`${Number(val).toFixed(1)} (${props.payload.noteCount} notes)`, 'Avg Rating']}
                        />
                        <ReBar dataKey="avgSatisfaction" name="Avg Satisfaction" fill="#0EA5E9" radius={[8, 8, 0, 0]} barSize={40} />
                      </ReBarChart>
                    </ReResponsiveContainer>
                  </div>
                </div>
              )}

              {stats.satisfactionByDay?.length > 0 && (
                <div className="clay-card p-4 md:p-8 hover:shadow-clay-md transition-shadow min-w-0">
                  <h3 className="text-sm font-black text-slate-400 uppercase mb-4 md:mb-8 ml-2 flex items-center gap-2">
                    <Star className="w-4 h-4 text-orange-500" /> Best Day to Contact
                  </h3>
                  <div className="h-64 mt-4">
                    <ReResponsiveContainer width="100%" height="100%">
                      <ReBarChart data={stats.satisfactionByDay}>
                        <ReCartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <ReXAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontWeight: 'bold'}} />
                        <ReYAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontWeight: 'bold'}} />
                        <ReTooltip 
                          cursor={{fill: '#F8FAFC'}}
                          contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', padding: '12px'}}
                          formatter={(val, name, props) => [`${Number(val).toFixed(1)} (${props.payload.noteCount} notes)`, 'Avg Rating']}
                        />
                        <ReBar dataKey="avgSatisfaction" name="Avg Satisfaction" fill="#EA580C" radius={[8, 8, 0, 0]} barSize={40} />
                      </ReBarChart>
                    </ReResponsiveContainer>
                  </div>
                </div>
              )}

              {stats.satisfactionByHour?.length > 0 && (
                <div className="clay-card p-4 md:p-8 hover:shadow-clay-md transition-shadow min-w-0">
                  <h3 className="text-sm font-black text-slate-400 uppercase mb-4 md:mb-8 ml-2 flex items-center gap-2">
                    <Star className="w-4 h-4 text-indigo-500" /> Best Hour to Contact
                  </h3>
                  <div className="h-64 mt-4">
                    <ReResponsiveContainer width="100%" height="100%">
                      <ReLineChart data={stats.satisfactionByHour}>
                        <ReCartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <ReXAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontWeight: 'bold', fontSize: 10}} />
                        <ReYAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontWeight: 'bold'}} />
                        <ReTooltip 
                          cursor={{stroke: '#E2E8F0', strokeWidth: 2}}
                          contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', padding: '12px'}}
                          formatter={(val) => [Number(val).toFixed(1), 'Avg Rating']}
                        />
                        <ReLine type="monotone" dataKey="avgSatisfaction" name="Avg Satisfaction" stroke="#4F46E5" strokeWidth={4} dot={{ r: 6, fill: '#4F46E5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                      </ReLineChart>
                    </ReResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          
          {/* Controls & Search */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <button 
                id="add-partner-btn"
                onClick={() => setShowAddModal(true)}
                className="clay-button-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" /> Add Partner
              </button>
              
              <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div id="search-bar" className="flex items-center bg-white shadow-clay-inset rounded-clay overflow-hidden">
                  <div className="px-3 text-slate-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    className="py-2.5 pr-4 bg-transparent outline-none text-sm font-bold text-slate-700 placeholder-slate-300 w-48"
                  />
                  {searchQuery && (
                    <button onClick={() => { setSearchQuery(''); fetchData(); }} className="pr-3 text-slate-300 hover:text-slate-500">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Filter Toggle */}
                <button
                  id="filter-btn"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                    showFilters || hasActiveFilters
                      ? 'bg-clay-brand text-white shadow-clay-sm'
                      : 'bg-white text-slate-500 shadow-clay-sm hover:shadow-clay-md'
                  }`}
                >
                  <Filter className="w-4 h-4" /> Filters
                  {hasActiveFilters && (
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  )}
                </button>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="clay-button-primary text-sm px-5"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="clay-card !p-4 flex flex-wrap gap-4 items-end animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Status</label>
                  <select
                    className="clay-input text-sm !py-2"
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                  >
                    <option value="All">All</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Year</label>
                  <select
                    className="clay-input text-sm !py-2"
                    value={filterYear}
                    onChange={e => setFilterYear(e.target.value)}
                  >
                    <option value="All">All</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </select>
                </div>
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Min Value (€)</label>
                  <input
                    type="number"
                    className="clay-input text-sm !py-2"
                    placeholder="e.g. 5000"
                    value={filterMinValue}
                    onChange={e => setFilterMinValue(e.target.value)}
                  />
                </div>
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Contacted In</label>
                  <select
                    className="clay-input text-sm !py-2"
                    value={filterContacted}
                    onChange={e => setFilterContacted(e.target.value)}
                  >
                    <option value="All">All Time</option>
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 90 Days</option>
                  </select>
                </div>
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Sort By</label>
                  <select
                    className="clay-input text-sm !py-2"
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="lastContactedDesc">Last Contact (Newest)</option>
                    <option value="lastContactedAsc">Last Contact (Oldest)</option>
                  </select>
                </div>
                <button
                  onClick={clearFilters}
                  className="clay-button-secondary text-sm px-4 py-2"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="clay-card !p-0 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left relative">
              <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase">Company</th>
                   <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase">Assigned</th>
                   <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase text-center">Last Contact</th>
                   <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase text-center">Notes</th>
                  <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase text-center">Year</th>
                  <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase text-center">Details</th>
                  <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-20 font-bold text-slate-400">Loading partners...</td></tr>
                ) : partners && partners.length > 0 ? partners.map((p) => (
                  <tr key={p.companyId} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <p className="font-black text-clay-brand text-lg">{p.compName || 'Unnamed'}</p>
                      <p className="text-xs font-bold text-slate-400">{p.compProfile || 'No profile'}</p>
                    </td>
                    <td className="px-6 py-5">
                      {/* Status is now read-only — no onClick */}
                      <span
                        className={`inline-flex items-center gap-2 font-bold text-sm px-4 py-1.5 rounded-full shadow-clay-inset ${
                          p.confirmed ? 'text-green-600 bg-green-50' : 'text-orange-500 bg-orange-50'
                        }`}
                      >
                        {p.confirmed ? <CheckCircle2 className="w-4 h-4"/> : <Clock className="w-4 h-4"/>}
                        {p.confirmed ? 'Confirmed' : 'Pending'}
                      </span>
                      {p.confirmed && (
                        <div className="mt-2 text-[10px] font-bold text-slate-400 pl-4 border-l-2 border-green-200">
                          {p.sponsorshipPackage} • {p.sponsorshipAmount}€
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      {p.assignedUser ? (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 shadow-clay-inset">
                            <UserIcon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-sm font-bold text-slate-600">{p.assignedUser}</span>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-slate-300 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-center">
                      {p.lastContacted ? (
                        <div className="text-sm font-bold text-slate-600">
                          {new Date(p.lastContacted).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-slate-300 italic">Never</span>
                      )}
                    </td>
                     <td className="px-6 py-5 text-center">
                      {p.noteCount > 0 ? (
                        <span className="inline-flex items-center gap-1.5 font-bold text-xs px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 shadow-clay-inset">
                          <MessageSquare className="w-3 h-3" /> {p.noteCount}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 font-bold text-xs px-3 py-1.5 rounded-full bg-slate-50 text-slate-300 shadow-clay-inset">
                          <MessageSquare className="w-3 h-3" /> None
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-center font-black text-slate-600">
                      {p.year}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button
                        id={partners.indexOf(p) === 0 ? 'details-btn-first' : undefined}
                        onClick={() => navigate(`/company/${p.companyId}`)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow-clay-sm text-clay-brand font-bold text-sm hover:shadow-clay-md transition-all hover:scale-105"
                      >
                        <ExternalLink className="w-4 h-4" /> Details
                      </button>
                    </td>
                    <td className="px-6 py-5">
                      {user.role === 'Team Leader' || user.role === 'Admin' ? (
                        <div className="flex items-center gap-2">
                          {p.year !== CURRENT_SEASON && (
                            <button 
                              onClick={() => handleAddToSeason(p.companyId)}
                              title={`Add to ${CURRENT_SEASON} season`}
                              className="w-9 h-9 bg-white rounded-xl shadow-clay-sm flex items-center justify-center text-blue-500 hover:shadow-clay-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                            >
                              <CalendarPlus className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(p.companyId)}
                            className="w-9 h-9 bg-white rounded-xl shadow-clay-sm flex items-center justify-center text-red-500 hover:shadow-clay-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {p.year !== CURRENT_SEASON && (
                            <button 
                              onClick={() => handleAddToSeason(p.companyId)}
                              title={`Add to ${CURRENT_SEASON} season`}
                              className="w-9 h-9 bg-white rounded-xl shadow-clay-sm flex items-center justify-center text-blue-500 hover:shadow-clay-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                            >
                              <CalendarPlus className="w-4 h-4" />
                            </button>
                          )}
                          {p.year === CURRENT_SEASON && (
                            <span className="text-xs font-bold text-slate-300">—</span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="7" className="text-center py-20 font-bold text-slate-400 italic">No partners found. Start by adding one!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* My Companies Panel */}
          <div id="my-companies-panel" className="clay-card">
            <h3 className="text-lg font-black text-clay-brand mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5" /> My Companies
            </h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {myPartners.length === 0 ? (
                <p className="text-sm font-bold text-slate-400 italic text-center py-4">No companies assigned to you.</p>
              ) : myPartners.map((p) => (
                <div 
                  key={p.companyId} 
                  onClick={() => navigate(`/company/${p.companyId}`)}
                  className="p-4 bg-white rounded-2xl shadow-clay-sm border border-white/50 cursor-pointer hover:shadow-clay-md transition-all group active:scale-95"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-black text-slate-700 group-hover:text-clay-brand transition-colors">{p.compName}</p>
                    {p.confirmed ? (
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                    ) : (
                      <Clock className="w-3 h-3 text-orange-500" />
                    )}
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-400">{p.year}</span>
                    <span className={p.confirmed ? 'text-green-600' : 'text-orange-500'}>
                      {p.confirmed ? 'Confirmed' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Members */}
          <div className="clay-card">
            <h3 className="text-lg font-black text-slate-700 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-clay-brand" /> Team Members
            </h3>
            <div className="space-y-4">
              {team.map((m, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl shadow-clay-inset border-white border-2">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-clay-brand shadow-clay-sm">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-700">{m.fullName}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{m.position}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Partner Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="clay-card w-full max-w-md animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black text-clay-brand mb-6 text-center">Add New Partner</h2>
            <form onSubmit={handleAddPartner} className="space-y-4">
              <input 
                className="clay-input" 
                placeholder="Company Name" 
                value={newPartner.compName}
                onChange={e => setNewPartner({...newPartner, compName: e.target.value})}
                required 
              />
              <input 
                className="clay-input" 
                placeholder="Business Profile" 
                value={newPartner.compProfile}
                onChange={e => setNewPartner({...newPartner, compProfile: e.target.value})}
                required 
              />
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 clay-button-secondary">Cancel</button>
                <button type="submit" className="flex-1 clay-button-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
