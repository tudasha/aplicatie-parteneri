import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X, ChevronRight, ChevronLeft, BookOpen,
  Plus, TrendingUp, Search, Filter, ExternalLink,
  LogOut, Briefcase, Star, HelpCircle, DollarSign,
  Users, Award, BarChart2, PieChart, ArrowLeft,
  CheckCircle2, MessageSquare, Zap
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────
   Step definitions
   Each step may have a `before` async function that runs before the
   spotlight is measured. It receives { navigate, dashboardActionsRef }.
──────────────────────────────────────────────────────────────────────*/
const buildSteps = () => [
  // ── Dashboard overview ──────────────────────────────────────────
  {
    targetId: null,
    icon: <BookOpen className="w-7 h-7" />,
    iconColor: '#800020',
    title: 'Welcome to ARTTU! 👋',
    description:
      "This tour will walk you through every important section of the app, including the stats panel and a company's detail page. Use Next / Back or keyboard arrows to navigate.",
    placement: 'center',
    before: async ({ navigate }) => { navigate('/dashboard'); },
  },
  {
    targetId: 'add-partner-btn',
    icon: <Plus className="w-7 h-7" />,
    iconBg: '#800020',
    iconColor: 'white',
    title: 'Add Partner',
    description:
      'Opens a quick form to register a new prospective company. Enter a name and business profile — the partner appears in the table with Pending status.',
    placement: 'bottom',
    before: async ({ navigate }) => { navigate('/dashboard'); },
  },
  {
    targetId: 'show-stats-btn',
    icon: <TrendingUp className="w-7 h-7" />,
    iconColor: '#800020',
    title: 'Show / Hide Stats',
    description:
      'Toggles the full analytics panel below the header. Click it now — the next steps will walk through each metric card and chart.',
    placement: 'bottom',
    before: async ({ navigate, dashboardActionsRef }) => {
      navigate('/dashboard');
      await sleep(300);
      dashboardActionsRef?.current?.setShowMetrics?.(true);
    },
  },

  // ── Metrics section ─────────────────────────────────────────────
  {
    targetId: 'metric-revenue',
    icon: <DollarSign className="w-7 h-7" />,
    iconColor: '#059669',
    title: 'Total Revenue',
    description:
      'The total confirmed sponsorship revenue across all partners and years. Updates automatically when a partnership is confirmed with an amount.',
    placement: 'bottom',
    before: async ({ navigate, dashboardActionsRef }) => {
      navigate('/dashboard');
      await sleep(300);
      dashboardActionsRef?.current?.setShowMetrics?.(true);
    },
  },
  {
    targetId: 'metric-partners',
    icon: <Users className="w-7 h-7" />,
    iconColor: '#2563EB',
    title: 'Total Partners',
    description:
      'The total number of companies in the system — both confirmed and pending. Grows every time you add a new partner.',
    placement: 'bottom',
  },
  {
    targetId: 'metric-confirmed',
    icon: <Award className="w-7 h-7" />,
    iconColor: '#D97706',
    title: 'Confirmed Partners',
    description:
      'How many of the companies have been confirmed with a sponsorship package and amount. Aim to move as many from Pending → Confirmed as possible!',
    placement: 'bottom',
  },
  {
    targetId: 'metric-satisfaction',
    icon: <Star className="w-7 h-7" />,
    iconColor: '#EAB308',
    title: 'Avg. Response (Blended)',
    description:
      'A blended average satisfaction score across all companies — combining manual ratings you log in notes with the auto-calculated score from package tier and amounts.',
    placement: 'bottom',
  },
  {
    targetId: 'chart-revenue',
    icon: <BarChart2 className="w-7 h-7" />,
    iconColor: '#800020',
    title: 'Revenue Trend Chart',
    description:
      'A bar chart showing confirmed revenue grouped by year. Hover the bars for exact totals. Useful for comparing season over season performance.',
    placement: 'right',
  },
  {
    targetId: 'chart-packages',
    icon: <PieChart className="w-7 h-7" />,
    iconColor: '#7C3AED',
    title: 'Package Distribution',
    description:
      'A donut chart breaking down confirmed partners by sponsorship package name. Helps identify which tiers are most popular.',
    placement: 'left',
  },

  // ── Table controls ──────────────────────────────────────────────
  {
    targetId: 'search-bar',
    icon: <Search className="w-7 h-7" />,
    iconColor: '#800020',
    title: 'Search Bar',
    description:
      'Type a company name and press Enter or "Search" to filter the table. The × icon clears the query and reloads all partners.',
    placement: 'bottom',
    before: async ({ navigate, dashboardActionsRef }) => {
      navigate('/dashboard');
      await sleep(300);
      dashboardActionsRef?.current?.setShowMetrics?.(false);
    },
  },
  {
    targetId: 'filter-btn',
    icon: <Filter className="w-7 h-7" />,
    iconColor: '#800020',
    title: 'Filters Panel',
    description:
      'Expands advanced filters: Status, Year, Minimum Value, Contacted-within window, and Sort order. A pulsing dot shows when filters are active.',
    placement: 'bottom',
  },
  {
    targetId: 'my-companies-panel',
    icon: <Briefcase className="w-7 h-7" />,
    iconColor: '#800020',
    title: 'My Companies',
    description:
      'The right sidebar shows companies assigned to you. Click any card to jump straight to that company\'s detail page.',
    placement: 'left',
  },

  {
    targetId: 'details-btn-first',
    icon: <ExternalLink className="w-7 h-7" />,
    iconColor: '#800020',
    title: 'Partner Details',
    description:
      'Each company in the database has a Details button. Clicking it opens a deep-dive workspace for that specific partner.',
    placement: 'left',
    before: async ({ navigate, dashboardActionsRef }) => {
      navigate('/dashboard');
      await sleep(300);
      dashboardActionsRef?.current?.setShowMetrics?.(false);
    },
  },

  // ── Company detail page ─────────────────────────────────────────
  {
    targetId: null,
    icon: <ExternalLink className="w-7 h-7" />,
    iconColor: '#800020',
    title: 'Entering the Workspace',
    description:
      "We've now entered a company's private workspace. Let's explore the tools available for managing this specific partnership.",
    placement: 'center',
    before: async ({ navigate, dashboardActionsRef }) => {
      const partners = dashboardActionsRef?.current?.getPartners?.() || [];
      if (partners.length > 0) {
        navigate(`/company/${partners[0].companyId}`);
        await sleep(600);
      }
    },
  },
  {
    targetId: 'cd-status-badge',
    icon: <CheckCircle2 className="w-7 h-7" />,
    iconColor: '#059669',
    title: 'Status Badge',
    description:
      'Shows whether the company is Confirmed (green) or Pending (orange). Status changes automatically when you confirm or unconfirm a sponsorship.',
    placement: 'bottom',
  },
  {
    targetId: 'cd-confirm-btn',
    icon: <CheckCircle2 className="w-7 h-7" />,
    iconBg: '#800020',
    iconColor: 'white',
    title: 'Confirm Partner Button',
    description:
      'Only visible when the company is still Pending (and you have edit rights). Opens a form to enter the package name, amount, and season year.',
    placement: 'bottom',
  },
  {
    targetId: 'cd-assignment-card',
    icon: <Users className="w-7 h-7" />,
    iconColor: '#800020',
    title: 'Assigned Contact',
    description:
      'Team Leaders and Admins can assign any team member to this company. The assigned person becomes responsible for outreach and follow-ups.',
    placement: 'right',
  },
  {
    targetId: 'cd-sponsorship-card',
    icon: <Award className="w-7 h-7" />,
    iconColor: '#D97706',
    title: 'Sponsorship Details',
    description:
      'Displays the confirmed package name, amount (€), and season year. Only populated after a partnership is confirmed.',
    placement: 'right',
  },
  {
    targetId: 'cd-auto-satisfaction',
    icon: <Zap className="w-7 h-7" />,
    iconColor: '#EAB308',
    title: 'Auto-Calculated Satisfaction',
    description:
      'A score (0–10) computed from confirmation status, package tier, and sponsorship amount. Feeds into the overall average blended response metric.',
    placement: 'right',
  },
  {
    targetId: 'cd-notes-section',
    icon: <MessageSquare className="w-7 h-7" />,
    iconColor: '#800020',
    title: 'Notations',
    description:
      'Log every contact attempt here — add a written note, paste the email template used, the phone script, and rate the company\'s response (1–10). These ratings drive the optimal outreach analytics.',
    placement: 'top',
  },
  {
    targetId: 'cd-right-metrics',
    icon: <BarChart2 className="w-7 h-7" />,
    iconColor: '#800020',
    title: 'Company Metrics Panel',
    description:
      'Right-column shows this company\'s blended avg. response score, total revenue, revenue by year chart, package breakdown donut, and satisfaction history line chart.',
    placement: 'left',
  },

  // ── Wrap-up ─────────────────────────────────────────────────────
  {
    targetId: 'cd-back-btn',
    icon: <ArrowLeft className="w-7 h-7" />,
    iconColor: '#800020',
    title: 'Back to Dashboard',
    description:
      'The arrow button in the header returns you to the main dashboard whenever you\'re done with a company page.',
    placement: 'bottom',
  },
  {
    targetId: null,
    icon: <Star className="w-7 h-7" />,
    iconColor: '#EAB308',
    title: "You're all set! 🎉",
    description:
      "You've seen everything. Click Finish to start managing your partners — and remember, the ? button in the dashboard header reopens this tour anytime.",
    placement: 'center',
  },
];

/* ── helpers ────────────────────────────────────────────────────── */
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const PADDING = 10;
const TIP_W = 340;
const TIP_GAP = 18;
const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
const DURATION = '380ms';

function getTooltipStyle(rect, placement, vpW, vpH) {
  if (!rect || placement === 'center') {
    return { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: TIP_W };
  }

  const px = {
    top: rect.top - PADDING, left: rect.left - PADDING,
    right: rect.right + PADDING, bottom: rect.bottom + PADDING,
  };
  const pw = rect.width  + PADDING * 2;
  const ph = rect.height + PADDING * 2;

  let place = placement;
  if (place === 'bottom' && px.bottom + TIP_GAP + 260 > vpH) place = 'top';
  if (place === 'top'    && px.top - TIP_GAP - 260 < 0) place = 'bottom';
  if (place === 'left'   && px.left  - TIP_GAP - TIP_W < 0) place = 'right';
  if (place === 'right'  && px.right + TIP_GAP + TIP_W > vpW) place = 'left';

  const centredLeft = Math.min(Math.max(px.left + pw / 2 - TIP_W / 2, 12), vpW - TIP_W - 12);
  const centredTop  = Math.min(Math.max(px.top  + ph / 2 - 130, 12), vpH - 270 - 12);
  const style = { position: 'fixed', width: TIP_W };

  switch (place) {
    case 'bottom': return { ...style, top:    px.bottom + TIP_GAP, left:  centredLeft };
    case 'top':    return { ...style, bottom: vpH - px.top + TIP_GAP, left:  centredLeft };
    case 'left':   return { ...style, right:  vpW - px.left + TIP_GAP, top:   centredTop };
    case 'right':  return { ...style, left:   px.right + TIP_GAP, top:   centredTop };
    default:       return { ...style, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' };
  }
}

/* ─────────────────────────────────────────────────────────────────
   Main component
──────────────────────────────────────────────────────────────────*/
const TutorialOverlay = ({ onClose, navigate, dashboardActionsRef }) => {
  const STEPS = buildSteps();
  const [step, setStep] = useState(0);
  const [spotRect, setSpotRect] = useState(null);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const [vpSize, setVpSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [mounted, setMounted] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const measureTimer = useRef(null);

  const current = STEPS[step];
  const isLast  = step === STEPS.length - 1;
  const isFirst = step === 0;

  const measure = useCallback((targetId, placement) => {
    clearTimeout(measureTimer.current);
    if (!targetId) {
      setSpotRect(null);
      setTooltipStyle(getTooltipStyle(null, 'center', window.innerWidth, window.innerHeight));
      return;
    }
    const el = document.getElementById(targetId);
    if (!el) {
      setSpotRect(null);
      setTooltipStyle(getTooltipStyle(null, 'center', window.innerWidth, window.innerHeight));
      return;
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    measureTimer.current = setTimeout(() => {
      const r = el.getBoundingClientRect();
      const rect = { top: r.top, left: r.left, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
      setSpotRect(rect);
      setTooltipStyle(getTooltipStyle(rect, placement, window.innerWidth, window.innerHeight));
    }, 350);
  }, []);

  const goToStep = useCallback(async (nextStep) => {
    if (transitioning) return;
    setTransitioning(true);
    const target = STEPS[nextStep];
    if (target?.before) {
      try { await target.before({ navigate, dashboardActionsRef }); } catch {}
    }
    setStep(nextStep);
    setTransitioning(false);
  }, [transitioning, navigate, dashboardActionsRef, STEPS]);

  useEffect(() => {
    measure(current.targetId, current.placement);
    return () => clearTimeout(measureTimer.current);
  }, [step, measure, current.targetId, current.placement]);

  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);

  useEffect(() => {
    const onResize = () => {
      setVpSize({ w: window.innerWidth, h: window.innerHeight });
      measure(current.targetId, current.placement);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [current.targetId, current.placement, measure]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        isLast ? onClose() : goToStep(step + 1);
      }
      if (e.key === 'ArrowLeft' && !isFirst) goToStep(step - 1);
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isLast, isFirst, onClose, goToStep, step]);

  /* ── Run before-action for step 0 on mount ── */
  useEffect(() => {
    if (STEPS[0]?.before) {
      STEPS[0].before({ navigate, dashboardActionsRef }).catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Spotlight style ── */
  const spotStyle = spotRect ? {
    position: 'fixed',
    top:    spotRect.top  - PADDING,
    left:   spotRect.left - PADDING,
    width:  spotRect.width  + PADDING * 2,
    height: spotRect.height + PADDING * 2,
    borderRadius: 14,
    boxShadow: [
      '0 0 0 9999px rgba(15,23,42,0.60)',
      '0 0 0 2.5px rgba(128,0,32,0.85)',
      '0 0 18px 4px rgba(128,0,32,0.35)',
    ].join(', '),
    transition: `top ${DURATION} ${EASE}, left ${DURATION} ${EASE}, width ${DURATION} ${EASE}, height ${DURATION} ${EASE}`,
    pointerEvents: 'none',
    zIndex: 9998,
  } : null;

  const overlayStyle = {
    position: 'fixed', inset: 0, zIndex: 9997,
    background: spotRect ? 'transparent' : 'rgba(15,23,42,0.55)',
    backdropFilter: spotRect ? 'none' : 'blur(3px)',
    transition: `background ${DURATION} ${EASE}`,
    pointerEvents: 'all',
  };

  /* ── Render ── */
  return (
    <>
      <div style={overlayStyle} />
      {spotStyle && <div style={spotStyle} />}

      <div style={{
        ...tooltipStyle,
        zIndex: 9999,
        pointerEvents: 'all',
        opacity: mounted ? 1 : 0,
        transform: tooltipStyle.transform
          ? tooltipStyle.transform + (mounted ? '' : ' scale(0.94)')
          : mounted ? 'scale(1)' : 'scale(0.94)',
        transition: `opacity 0.25s ${EASE}, transform 0.25s ${EASE}, top ${DURATION} ${EASE}, left ${DURATION} ${EASE}, right ${DURATION} ${EASE}, bottom ${DURATION} ${EASE}`,
      }}>
        <div style={{
          background: 'white',
          borderRadius: '1.5rem',
          border: '1px solid rgba(255,255,255,0.5)',
          boxShadow: '0 24px 64px -12px rgba(128,0,32,0.18), 0 8px 32px -8px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
          overflow: 'hidden',
        }}>

          {/* Top */}
          <div style={{ padding: '1rem 1.25rem 0', background: 'linear-gradient(135deg,rgba(128,0,32,0.04),transparent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
              {/* Progress dots */}
              <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap', maxWidth: '70%' }}>
                {STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => !transitioning && goToStep(i)}
                    disabled={transitioning}
                    style={{
                      border: 'none', cursor: transitioning ? 'wait' : 'pointer', padding: 0,
                      borderRadius: 9999,
                      width: i === step ? 18 : 6, height: 6,
                      background: i === step ? '#800020' : i < step ? 'rgba(128,0,32,0.28)' : '#E2E8F0',
                      transition: `width ${DURATION} ${EASE}, background ${DURATION} ${EASE}`,
                    }}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 10, fontWeight: 900, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {step + 1}/{STEPS.length}
                </span>
                <button
                  onClick={onClose}
                  style={{
                    width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#F1F5F9', color: '#94A3B8',
                    boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.06)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#E2E8F0'}
                  onMouseLeave={e => e.currentTarget.style.background = '#F1F5F9'}
                >
                  <X style={{ width: 13, height: 13 }} />
                </button>
              </div>
            </div>

            {/* Icon + title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '0.75rem' }}>
              <div style={{
                width: 44, height: 44, borderRadius: '0.875rem', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: current.iconBg || '#F8FAFC',
                boxShadow: current.iconBg
                  ? '0 6px 18px -4px rgba(128,0,32,0.4)'
                  : 'inset 3px 3px 8px rgba(0,0,0,0.06),inset -3px -3px 8px rgba(255,255,255,0.8)',
                color: current.iconBg ? 'white' : (current.iconColor || '#800020'),
                transition: `background ${DURATION} ${EASE}`,
              }}>
                {current.icon}
              </div>
              <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#800020', lineHeight: 1.25 }}>
                {current.title}
              </h2>
            </div>
          </div>

          {/* Description */}
          <div style={{ padding: '0 1.25rem 1rem' }}>
            <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 700, color: '#64748B', lineHeight: 1.65 }}>
              {current.description}
            </p>
          </div>

          {/* Nav */}
          <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid #F1F5F9', display: 'flex', gap: 8 }}>
            {!isFirst && (
              <button
                onClick={() => !transitioning && goToStep(step - 1)}
                disabled={transitioning}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '0.5rem 1rem', borderRadius: '0.75rem', border: 'none',
                  cursor: transitioning ? 'wait' : 'pointer',
                  background: '#F8FAFC', color: '#64748B', fontWeight: 800, fontSize: '0.8125rem',
                  boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.06)',
                  opacity: transitioning ? 0.6 : 1,
                }}
              >
                <ChevronLeft style={{ width: 14, height: 14 }} /> Back
              </button>
            )}
            <button
              onClick={() => isLast ? onClose() : !transitioning && goToStep(step + 1)}
              disabled={transitioning && !isLast}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '0.5rem 1rem', borderRadius: '0.75rem', border: 'none',
                cursor: transitioning ? 'wait' : 'pointer',
                background: '#800020', color: 'white', fontWeight: 900, fontSize: '0.8125rem',
                boxShadow: '0 6px 18px -4px rgba(128,0,32,0.4)',
                opacity: transitioning ? 0.7 : 1,
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => { if (!transitioning) e.currentTarget.style.opacity = '0.88'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = transitioning ? '0.7' : '1'; }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {isLast ? 'Finish 🎉' : transitioning ? 'Loading…' : 'Next'}
              {!isLast && !transitioning && <ChevronRight style={{ width: 14, height: 14 }} />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TutorialOverlay;
