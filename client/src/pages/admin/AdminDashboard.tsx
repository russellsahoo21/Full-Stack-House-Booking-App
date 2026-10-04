import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '@/services/api';
import { UserAvatar } from '@/components/common/UserAvatar';

interface BookingRecord {
  id: string;
  guestName: string;
  guestLocation: string;
  guestEmail: string;
  guestPhone: string;
  property: string;
  location: string;
  dates: string;
  nights: number;
  amount: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  paymentGateway: string;
  avatarInitials: string;
}

const RECENT_BOOKINGS: BookingRecord[] = [
  {
    id: 'WF-10284',
    guestName: 'Aarav Mehta',
    guestLocation: 'Mumbai, MH',
    guestEmail: 'aarav.m@example.com',
    guestPhone: '+91 98201 44812',
    property: 'Casa Verde Retreat',
    location: 'Lonavala',
    dates: 'Oct 04 - Oct 07',
    nights: 3,
    amount: 28500,
    status: 'Confirmed',
    paymentGateway: 'Razorpay UPI',
    avatarInitials: 'AM',
  },
  {
    id: 'WF-10283',
    guestName: 'Riya Shah',
    guestLocation: 'Ahmedabad, GJ',
    guestEmail: 'riya.shah@outlook.com',
    guestPhone: '+91 97123 55891',
    property: 'Lakeview Villa',
    location: 'Udaipur',
    dates: 'Oct 05 - Oct 08',
    nights: 3,
    amount: 31200,
    status: 'Pending',
    paymentGateway: 'Direct UPI Escrow',
    avatarInitials: 'RS',
  },
  {
    id: 'WF-10282',
    guestName: 'Vikram Malhotra',
    guestLocation: 'Delhi, DL',
    guestEmail: 'v.malhotra@zenith.in',
    guestPhone: '+91 98101 22941',
    property: 'Azure Beach House',
    location: 'Goa',
    dates: 'Oct 08 - Oct 12',
    nights: 4,
    amount: 64000,
    status: 'Confirmed',
    paymentGateway: 'HDFC Corporate',
    avatarInitials: 'VM',
  },
  {
    id: 'WF-10281',
    guestName: 'Ananya Iyer',
    guestLocation: 'Bengaluru, KA',
    guestEmail: 'ananya.iyer@gmail.com',
    guestPhone: '+91 99002 44102',
    property: 'The Hillside Cabin',
    location: 'Manali',
    dates: 'Oct 10 - Oct 14',
    nights: 4,
    amount: 22800,
    status: 'Cancelled',
    paymentGateway: 'Card Reversal',
    avatarInitials: 'AI',
  },
];

export const AdminDashboard: React.FC = () => {
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(RECENT_BOOKINGS[0]);
  const [chartRange, setChartRange] = useState<'7D' | '30D' | '3M' | '12M'>('30D');
  const [liveSynced, setLiveSynced] = useState('just now');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const fetchTelemetry = async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.getDashboard(chartRange);
      if (res?.success && res.data) {
        setDashboardData(res.data);
        if (res.data.recentBookings && res.data.recentBookings.length > 0) {
          setSelectedBooking(res.data.recentBookings[0]);
        }
        setLiveSynced('just now');
      }
    } catch (err) {
      console.warn('Using offline telemetry baseline:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, [chartRange]);

  const handleExportReport = async () => {
    try {
      setIsExporting(true);
      await adminApi.exportReport('bookings');
    } catch (err: any) {
      alert(err?.message || 'Failed to export platform report');
    } finally {
      setIsExporting(false);
    }
  };

  const kpis = dashboardData?.kpis;
  const revenueVelocity = dashboardData?.revenueVelocity;
  const displayBookings: BookingRecord[] =
    dashboardData?.recentBookings && dashboardData.recentBookings.length > 0
      ? dashboardData.recentBookings
      : RECENT_BOOKINGS;

  return (
    <div className="flex flex-col w-full gap-6 max-w-7xl mx-auto">
      {/* 1. TOP PAGE HEADER & CONTEXT TOOLBAR */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] uppercase tracking-widest text-[#b52603] font-bold">
              Executive Command
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#b52603]/40"></span>
            <span className="text-[11px] text-[#555f6f] dark:text-gray-400">Pan-India Operations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#151c27] dark:text-white tracking-tight">
            Platform Command Center
          </h1>
          <p className="text-sm text-[#555f6f] dark:text-gray-400 mt-1">
            Real-time financial telemetry and occupancy across luxury Indian estates.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Live Refresh Pill */}
          <button
            onClick={fetchTelemetry}
            type="button"
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-[#171826] border border-[#e2e8f8] dark:border-white/10 shadow-sm text-xs text-[#555f6f] dark:text-gray-400 hover:border-[#b52603]/40 transition-colors"
          >
            <span className={`w-2 h-2 rounded-full bg-[#2ca397] ${isLoading ? 'animate-spin' : 'animate-ping'}`}></span>
            <span className="text-[#151c27] dark:text-white font-semibold">Live Feed</span>
            <span className="text-gray-400">Synced {liveSynced}</span>
          </button>

          {/* Date Range Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-[#171826] border border-[#e2e8f8] dark:border-white/10 shadow-sm text-xs">
            {(['7D', '30D', '3M', '12M'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setChartRange(r)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  chartRange === r
                    ? 'bg-[#b52603] text-white shadow-sm'
                    : 'text-[#555f6f] dark:text-gray-400 hover:text-[#151c27] dark:hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Export Report */}
          <button
            type="button"
            disabled={isExporting}
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#b52603] text-white text-xs font-bold shadow-sm hover:bg-[#8c1900] active:scale-95 disabled:opacity-60 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isExporting ? 'hourglass_top' : 'download'}
            </span>
            <span>{isExporting ? 'Exporting...' : 'Export Report'}</span>
          </button>
        </div>
      </div>

      {/* 2. FOUR LARGE KPI METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KPI 1: Platform Gross */}
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#171826] p-6 shadow-sm border border-[#e2e8f8] dark:border-white/10 hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#b52603]"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase tracking-wider text-[#555f6f] dark:text-gray-400 font-bold">
              Total Platform Gross
            </span>
            <div className="w-8 h-8 rounded-full bg-[#b52603]/10 text-[#b52603] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">currency_rupee</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-[#151c27] dark:text-white tracking-tight">
              {kpis?.grossRevenue ? `₹${kpis.grossRevenue.toLocaleString('en-IN')}` : '₹24,86,400'}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
              <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span>
              {kpis?.grossGrowth || '+12.8%'}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-[#555f6f] dark:text-gray-400">
              Platform margin: <span className="font-semibold text-[#151c27] dark:text-white">{kpis?.platformMargin ? `₹${kpis.platformMargin.toLocaleString('en-IN')}` : '₹2,48,640'}</span>
            </span>
            {/* Mini Sparkline Area Chart */}
            <svg className="w-20 h-6 overflow-visible" fill="none" viewBox="0 0 80 24">
              <defs>
                <linearGradient id="sparklineGrad" x1="0" x2="0" y1="0" y2="24" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#b52603" stopOpacity="0.25"></stop>
                  <stop offset="1" stopColor="#b52603" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <path
                d="M0 18 Q 15 14, 25 16 T 50 8 T 70 11 T 80 4 L 80 24 L 0 24 Z"
                fill="url(#sparklineGrad)"
              ></path>
              <path
                d="M0 18 Q 15 14, 25 16 T 50 8 T 70 11 T 80 4"
                fill="none"
                stroke="#b52603"
                strokeLinecap="round"
                strokeWidth="2"
              ></path>
            </svg>
          </div>
        </div>

        {/* KPI 2: Active Bookings */}
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#171826] p-6 shadow-sm border border-[#e2e8f8] dark:border-white/10 hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#006a61]"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase tracking-wider text-[#555f6f] dark:text-gray-400 font-bold">
              Active Bookings
            </span>
            <div className="w-8 h-8 rounded-full bg-[#006a61]/10 text-[#006a61] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-[#151c27] dark:text-white tracking-tight">
              {kpis?.activeBookings ? kpis.activeBookings.toLocaleString('en-IN') : '1,248'}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
              <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span>
              {kpis?.bookingsGrowth || '+8.4%'}
            </span>
          </div>
          <p className="text-xs text-[#555f6f] dark:text-gray-400 pt-2 truncate">
            <span className="font-semibold text-[#151c27] dark:text-white">{kpis?.confirmedCount || 932}</span> confirmed · {kpis?.pendingCount || 222} pending
          </p>
        </div>

        {/* KPI 3: Curated Inventory */}
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#171826] p-6 shadow-sm border border-[#e2e8f8] dark:border-white/10 hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#555f6f]"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase tracking-wider text-[#555f6f] dark:text-gray-400 font-bold">
              Curated Inventory
            </span>
            <div className="w-8 h-8 rounded-full bg-[#555f6f]/10 text-[#555f6f] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">villa</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-[#151c27] dark:text-white tracking-tight">
              {kpis?.curatedInventory || 486}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
              <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span>
              {kpis?.inventoryGrowth || '+5.2%'}
            </span>
          </div>
          <p className="text-xs text-[#555f6f] dark:text-gray-400 pt-2 truncate">
            <span className="font-semibold text-[#151c27] dark:text-white">{kpis?.curatedInventory || 412}</span> published estates
          </p>
        </div>

        {/* KPI 4: Registered Users */}
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#171826] p-6 shadow-sm border border-[#e2e8f8] dark:border-white/10 hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#ff5a36]"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase tracking-wider text-[#555f6f] dark:text-gray-400 font-bold">
              Platform Community
            </span>
            <div className="w-8 h-8 rounded-full bg-[#ff5a36]/10 text-[#ff5a36] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">group</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-[#151c27] dark:text-white tracking-tight">
              {kpis?.registeredUsers ? kpis.registeredUsers.toLocaleString('en-IN') : '18,492'}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
              <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span>
              {kpis?.communityGrowth || '+14.6%'}
            </span>
          </div>
          <p className="text-xs text-[#555f6f] dark:text-gray-400 pt-2 truncate">
            <span className="font-semibold text-[#151c27] dark:text-white">{kpis?.hostsCount || 1624}</span> hosts · {kpis?.travelersCount ? kpis.travelersCount.toLocaleString('en-IN') : '16,868'} travelers
          </p>
        </div>
      </div>

      {/* 3. MIDDLE ANALYTICS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Velocity Dual-Curve Chart (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-white dark:bg-[#171826] p-6 shadow-sm border border-[#e2e8f8] dark:border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-lg font-bold text-[#151c27] dark:text-white">
                    Revenue Velocity
                  </h2>
                  <span className="px-2 py-0.5 rounded bg-[#f0f3ff] dark:bg-white/5 text-[#555f6f] dark:text-gray-400 text-[11px] font-bold">
                    ₹ in Lakhs
                  </span>
                </div>
                <p className="text-xs text-[#555f6f] dark:text-gray-400 mt-0.5">
                  Daily gross transaction performance against previous cycle
                </p>
              </div>

              {/* Range Tabs */}
              <div className="inline-flex p-1 bg-[#f0f3ff] dark:bg-white/5 rounded-xl border border-[#e2e8f8]/60 dark:border-white/5">
                {(['7D', '30D', '3M', '12M'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setChartRange(r)}
                    className={`px-3 py-1 text-xs rounded-lg transition-all ${
                      chartRange === r
                        ? 'bg-white dark:bg-[#202235] text-[#b52603] font-bold shadow-sm'
                        : 'text-[#555f6f] dark:text-gray-400 hover:text-[#151c27] dark:hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Legend & Hover Stat Snapshot */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pt-1">
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#b52603]"></span>
                  <span className="font-semibold text-[#151c27] dark:text-white">
                    {revenueVelocity?.currentMonthName || 'Current Cycle'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1.5 rounded-full bg-slate-300 dark:bg-gray-600"></span>
                  <span className="text-[#555f6f] dark:text-gray-400">
                    {revenueVelocity?.previousMonthName || 'Previous Benchmark'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#f0f3ff] dark:bg-white/5 text-xs shadow-sm border border-[#e2e8f8]/60 dark:border-white/5">
                <span className="w-2 h-2 rounded-full bg-[#b52603]"></span>
                <span className="text-[#151c27] dark:text-white">{revenueVelocity?.peakDate || 'Peak'}:</span>
                <span className="font-bold text-[#b52603] text-sm">
                  ₹{(revenueVelocity?.peakAmount || 114200).toLocaleString('en-IN')}
                </span>
                <span className="text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-1.5 py-0.5 rounded text-[10px] font-bold">
                  +16% YoY
                </span>
              </div>
            </div>

            {/* Dynamic High-Precision SVG Chart */}
            <div className="relative w-full h-[220px] pt-4">
              {(() => {
                const chartLabels: string[] = revenueVelocity?.labels?.length ? revenueVelocity.labels : ['Oct 01', 'Oct 06', 'Oct 11', 'Oct 16', 'Oct 21', 'Oct 26', 'Oct 31'];
                const currentActuals: number[] = revenueVelocity?.currentCycle?.length ? revenueVelocity.currentCycle : [25000, 48000, 70000, 95000, 114200, 92000, 105000];
                const benchmarkPrevious: number[] = revenueVelocity?.previousCycle?.length ? revenueVelocity.previousCycle : [20000, 38000, 58000, 78000, 95000, 75000, 88000];
                const maxVal = Math.max(...currentActuals, ...benchmarkPrevious, 100000);

                const generateSvgPath = (points: number[]) => {
                  if (!points || points.length === 0) return { line: '', area: '', peakCoord: [640, 18] };
                  const w = 690; // x from 40 to 730
                  const h = 155; // y from 25 to 180
                  const len = Math.max(1, points.length - 1);

                  const coords = points.map((p, idx) => {
                    const x = 40 + (idx / len) * w;
                    const y = 185 - (p / maxVal) * h;
                    return [x, y];
                  });

                  let line = `M ${coords[0][0].toFixed(1)} ${coords[0][1].toFixed(1)}`;
                  for (let i = 1; i < coords.length; i++) {
                    const prev = coords[i - 1];
                    const curr = coords[i];
                    const cp1x = prev[0] + (curr[0] - prev[0]) / 2;
                    const cp1y = prev[1];
                    const cp2x = prev[0] + (curr[0] - prev[0]) / 2;
                    const cp2y = curr[1];
                    line += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${curr[0].toFixed(1)} ${curr[1].toFixed(1)}`;
                  }

                  const lastX = coords[coords.length - 1][0].toFixed(1);
                  const area = `${line} L ${lastX} 185 L 40 185 Z`;

                  let maxIdx = 0;
                  let maxP = points[0];
                  points.forEach((p, idx) => {
                    if (p > maxP) {
                      maxP = p;
                      maxIdx = idx;
                    }
                  });

                  return { line, area, peakCoord: coords[maxIdx] || [640, 18] };
                };

                const actualPath = generateSvgPath(currentActuals);
                const prevPath = generateSvgPath(benchmarkPrevious);

                const yLevels = [
                  { label: `₹${(maxVal / 100000).toFixed(1)}L`, y: 20 },
                  { label: `₹${((maxVal * 0.72) / 100000).toFixed(1)}L`, y: 65 },
                  { label: `₹${((maxVal * 0.44) / 100000).toFixed(1)}L`, y: 110 },
                  { label: `₹${((maxVal * 0.16) / 100000).toFixed(1)}L`, y: 155 },
                ];

                return (
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 740 200">
                    <defs>
                      <linearGradient id="areaGradientPrimary" x1="0" x2="0" y1="0" y2="200" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#b52603" stopOpacity="0.22"></stop>
                        <stop offset="85%" stopColor="#b52603" stopOpacity="0.0"></stop>
                      </linearGradient>
                    </defs>

                    {/* Horizontal Reference Gridlines */}
                    {yLevels.map((lvl, idx) => (
                      <React.Fragment key={idx}>
                        <line x1="40" x2="730" y1={lvl.y} y2={lvl.y} stroke="currentColor" className="text-gray-100 dark:text-gray-800" strokeWidth="1.5"></line>
                        <text x="5" y={lvl.y + 4} className="text-[11px] fill-gray-400">{lvl.label}</text>
                      </React.Fragment>
                    ))}

                    {/* Benchmark Previous Cycle (Dashed) */}
                    {prevPath.line && (
                      <path
                        d={prevPath.line}
                        fill="none"
                        opacity="0.85"
                        stroke="#bdc7d9"
                        strokeDasharray="4 4"
                        strokeWidth="2"
                      ></path>
                    )}

                    {/* Current Actuals Area Fill */}
                    {actualPath.area && (
                      <path
                        d={actualPath.area}
                        fill="url(#areaGradientPrimary)"
                      ></path>
                    )}

                    {/* Current Actuals Stroke */}
                    {actualPath.line && (
                      <path
                        d={actualPath.line}
                        fill="none"
                        stroke="#b52603"
                        strokeLinecap="round"
                        strokeWidth="3"
                      ></path>
                    )}

                    {/* Dynamic Highlight marker for Peak Date */}
                    {actualPath.peakCoord && (
                      <>
                        <line
                          x1={actualPath.peakCoord[0]}
                          x2={actualPath.peakCoord[0]}
                          y1={actualPath.peakCoord[1]}
                          y2="185"
                          opacity="0.6"
                          stroke="#b52603"
                          strokeDasharray="2 3"
                          strokeWidth="1.5"
                        ></line>
                        <circle
                          cx={actualPath.peakCoord[0]}
                          cy={actualPath.peakCoord[1]}
                          fill="#b52603"
                          r="6"
                          stroke="#ffffff"
                          strokeWidth="2.5"
                        ></circle>
                      </>
                    )}
                  </svg>
                );
              })()}
            </div>

            {/* Dynamic X-Axis Labels */}
            <div className="flex justify-between pl-10 pr-2 pt-2 text-[#555f6f] dark:text-gray-400 text-[11px]">
              {(revenueVelocity?.labels?.length ? revenueVelocity.labels : ['Oct 01', 'Oct 06', 'Oct 11', 'Oct 16', 'Oct 21', 'Oct 26', 'Oct 31']).map((lbl: string, idx: number, arr: string[]) => (
                <span
                  key={idx}
                  className={idx === arr.length - 1 || idx === Math.floor(arr.length / 2) ? 'text-[#b52603] font-bold' : ''}
                >
                  {lbl}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#e2e8f8]/60 dark:border-white/5 flex items-center justify-between text-xs text-[#555f6f] dark:text-gray-400">
            <span>
              Projected monthly close: <strong className="text-[#151c27] dark:text-white font-semibold">₹{(revenueVelocity?.projectedMonthlyClose || 2710000).toLocaleString('en-IN')}</strong>
            </span>
            <Link
              to="/admin/bookings"
              className="text-[#b52603] font-semibold hover:underline flex items-center gap-1"
            >
              Full Revenue Ledger <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Dynamic Booking Breakdown & Occupancy Gauge (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-white dark:bg-[#171826] p-6 shadow-sm border border-[#e2e8f8] dark:border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-lg font-bold text-[#151c27] dark:text-white">
                  Velocity & Health
                </h2>
                <p className="text-xs text-[#555f6f] dark:text-gray-400">
                  Distribution across {kpis?.curatedInventory || 12} stays
                </p>
              </div>
              <button className="p-1 rounded-lg text-[#555f6f] dark:text-gray-400 hover:bg-[#f0f3ff] dark:hover:bg-white/5 transition-colors">
                <span className="material-symbols-outlined text-[20px]">info</span>
              </button>
            </div>

            {/* Radial Occupancy Gauge */}
            {(() => {
              const occ = kpis?.occupancyPercentage != null ? kpis.occupancyPercentage : 78.4;
              const confirmedCount = kpis?.confirmedCount ?? 932;
              const pendingCount = kpis?.pendingCount ?? 222;
              const cancelledCount = kpis?.cancelledCount ?? 94;
              const totalAllocations = Math.max(1, confirmedCount + pendingCount + cancelledCount);

              const confirmedPct = ((confirmedCount / totalAllocations) * 100).toFixed(1);
              const pendingPct = ((pendingCount / totalAllocations) * 100).toFixed(1);
              const cancelledPct = ((cancelledCount / totalAllocations) * 100).toFixed(1);

              return (
                <>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#f0f3ff] dark:bg-white/5 mb-4 border border-[#e2e8f8]/60 dark:border-white/5">
                    <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-[#dce2f3] dark:text-gray-700"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                        ></path>
                        <path
                          className="text-[#b52603]"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeDasharray={`${occ}, 100`}
                          strokeLinecap="round"
                          strokeWidth="3.5"
                        ></path>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-base font-bold text-[#151c27] dark:text-white leading-none">
                          {Math.round(occ)}%
                        </span>
                      </div>
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] uppercase tracking-wide text-[#555f6f] dark:text-gray-400 font-bold">
                        Average Occupancy
                      </span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-xl font-bold text-[#151c27] dark:text-white">{occ}%</span>
                        <span className="text-emerald-700 dark:text-emerald-400 text-xs font-bold">+4.2%</span>
                      </div>
                      <p className="text-xs text-[#555f6f] dark:text-gray-400 truncate mt-0.5">
                        Curated Indian villas operating at high demand
                      </p>
                    </div>
                  </div>

                  {/* Dynamic Stacked Velocity Breakdown Bar */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-[#151c27] dark:text-white">Status Allocation</span>
                      <span className="text-[#555f6f] dark:text-gray-400">{totalAllocations} Bookings Total</span>
                    </div>

                    <div className="w-full h-3 rounded-full bg-[#e7eefe] dark:bg-white/10 overflow-hidden flex">
                      <div className="h-full bg-[#b52603]" style={{ width: `${confirmedPct}%` }} title={`Confirmed: ${confirmedCount}`}></div>
                      <div className="h-full bg-amber-500" style={{ width: `${pendingPct}%` }} title={`Pending: ${pendingCount}`}></div>
                      <div className="h-full bg-slate-400" style={{ width: `${cancelledPct}%` }} title={`Cancelled: ${cancelledCount}`}></div>
                    </div>

                    {/* Dynamic Legend rows */}
                    <div className="pt-2 space-y-2 text-xs">
                      <div className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#b52603]"></span>
                          <span className="text-[#151c27] dark:text-white">Confirmed & Paid</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-[#151c27] dark:text-white">{confirmedCount}</span>
                          <span className="text-[#555f6f] dark:text-gray-400 w-10 text-right">{confirmedPct}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                          <span className="text-[#151c27] dark:text-white">Pending Verification</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-[#151c27] dark:text-white">{pendingCount}</span>
                          <span className="text-[#555f6f] dark:text-gray-400 w-10 text-right">{pendingPct}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                          <span className="text-[#151c27] dark:text-white">Cancelled / Voided</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-[#151c27] dark:text-white">{cancelledCount}</span>
                          <span className="text-[#555f6f] dark:text-gray-400 w-10 text-right">{cancelledPct}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          <div className="mt-4 pt-3 bg-[#f0f3ff] dark:bg-white/5 rounded-xl p-3 flex items-center justify-between border border-[#e2e8f8]/60 dark:border-white/5">
            <span className="text-xs text-[#555f6f] dark:text-gray-400">Host payout run scheduled</span>
            <Link to="/admin/bookings" className="text-xs text-[#b52603] font-bold hover:underline">
              Review (₹{kpis?.hostPayout ? (kpis.hostPayout / 100000).toFixed(1) : '8.4'}L)
            </Link>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM SECTION: OPERATIONAL LEDGER & LIVE ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Bookings Table (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="rounded-2xl bg-white dark:bg-[#171826] p-6 shadow-sm border border-[#e2e8f8] dark:border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="font-display text-lg font-bold text-[#151c27] dark:text-white">
                  Recent Reservations
                </h2>
                <p className="text-xs text-[#555f6f] dark:text-gray-400">
                  Live audit ledger of guest check-ins across premium properties
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#555f6f] dark:text-gray-400">Showing latest 4</span>
                <Link
                  to="/admin/bookings"
                  className="px-3 py-1.5 rounded-xl bg-[#f0f3ff] dark:bg-white/5 hover:bg-[#e7eefe] text-[#151c27] dark:text-white text-xs font-semibold transition-colors"
                >
                  View All Stays
                </Link>
              </div>
            </div>

            {/* Ledger Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f0f3ff] dark:bg-white/5 text-[#555f6f] dark:text-gray-400 text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4 rounded-l-xl">ID</th>
                    <th className="py-3 px-3">Guest</th>
                    <th className="py-3 px-3">Property</th>
                    <th className="py-3 px-3">Dates</th>
                    <th className="py-3 px-3 text-right">Amount</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-4 text-right rounded-r-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f3ff] dark:divide-white/5 text-xs">
                  {displayBookings.map((b) => (
                    <tr
                      key={b.id}
                      onClick={() => setSelectedBooking(b)}
                      className={`cursor-pointer transition-colors ${
                        selectedBooking?.id === b.id
                          ? 'bg-[#b52603]/5 dark:bg-[#b52603]/10'
                          : 'hover:bg-[#f0f3ff]/50 dark:hover:bg-white/5'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-[#b52603] whitespace-nowrap">
                        {b.id}
                        {selectedBooking?.id === b.id && (
                          <span className="block text-[10px] text-[#b52603]/70 font-normal">Active</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <UserAvatar name={b.guestName} size="sm" />
                          <div className="min-w-0">
                            <p className="font-semibold text-[#151c27] dark:text-white truncate">
                              {b.guestName}
                            </p>
                            <p className="text-[11px] text-[#555f6f] dark:text-gray-400 truncate">
                              {b.guestLocation}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <p className="font-medium text-[#151c27] dark:text-white truncate max-w-[150px]">
                          {b.property}
                        </p>
                        <p className="text-[11px] text-[#555f6f] dark:text-gray-400">{b.location}</p>
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap text-[#151c27] dark:text-white">
                        {b.dates}
                        <span className="block text-[#555f6f] dark:text-gray-400 text-[10px]">
                          {b.nights} Nights
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-[#151c27] dark:text-white whitespace-nowrap">
                        ₹{b.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            b.status === 'Confirmed'
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400'
                              : b.status === 'Pending'
                              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400'
                              : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-400'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBooking(b);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#b52603] text-white text-[11px] font-semibold hover:bg-[#8c1900] transition-colors shadow-sm"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Integrated Sliding Booking Details Drawer (WF Inspector) */}
          {selectedBooking && (
            <div className="rounded-2xl bg-white dark:bg-[#171826] p-6 shadow-md border-l-4 border-[#b52603] border border-[#e2e8f8] dark:border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-[#b52603]/10 text-[#b52603] text-[10px] font-bold tracking-wider uppercase">
                    Reservation Inspector
                  </span>
                  <span className="font-bold text-[#151c27] dark:text-white text-base">
                    {selectedBooking.id}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 text-[10px] font-bold">
                    Guaranteed
                  </span>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-[#555f6f] dark:text-gray-400 hover:text-[#151c27] dark:hover:text-white p-1 rounded-lg hover:bg-[#f0f3ff] dark:hover:bg-white/5"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Column 1: Guest Dossier */}
                <div className="p-4 rounded-xl bg-[#f0f3ff] dark:bg-white/5 border border-[#e2e8f8]/60 dark:border-white/5">
                  <div className="flex items-center gap-3 mb-3">
                    <UserAvatar name={selectedBooking.guestName} size="md" />
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-[#151c27] dark:text-white truncate">
                        {selectedBooking.guestName}
                      </p>
                      <p className="text-xs text-[#555f6f] dark:text-gray-400 truncate">
                        {selectedBooking.guestEmail}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs text-[#555f6f] dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Phone:</span>
                      <span className="text-[#151c27] dark:text-white font-medium">
                        {selectedBooking.guestPhone}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>KYC Status:</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                        Aadhaar Verified
                      </span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Stay & Villa */}
                <div className="p-4 rounded-xl bg-[#f0f3ff] dark:bg-white/5 border border-[#e2e8f8]/60 dark:border-white/5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] uppercase tracking-wide text-[#555f6f] dark:text-gray-400 font-bold">
                        Property Summary
                      </span>
                      <span className="text-[10px] text-[#b52603] font-bold">4 Guests</span>
                    </div>
                    <h4 className="font-semibold text-sm text-[#151c27] dark:text-white">
                      {selectedBooking.property}
                    </h4>
                    <p className="text-xs text-[#555f6f] dark:text-gray-400">
                      {selectedBooking.location} · Entire Villa
                    </p>
                  </div>
                  <div className="pt-2 text-xs flex justify-between items-center text-[#151c27] dark:text-white">
                    <span>{selectedBooking.dates}, 2026</span>
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-white/10 text-xs font-semibold">
                      Self Check-in
                    </span>
                  </div>
                </div>

                {/* Column 3: Payment & Escrow */}
                <div className="p-4 rounded-xl bg-[#f0f3ff] dark:bg-white/5 border border-[#e2e8f8]/60 dark:border-white/5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] uppercase tracking-wide text-[#555f6f] dark:text-gray-400 font-bold">
                        Settlement
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                        Paid
                      </span>
                    </div>
                    <div className="text-xl font-bold text-[#151c27] dark:text-white">
                      ₹{selectedBooking.amount.toLocaleString('en-IN')}
                    </div>
                    <p className="text-xs text-[#555f6f] dark:text-gray-400">
                      Gateway: {selectedBooking.paymentGateway}
                    </p>
                  </div>
                  <div className="pt-2 text-xs text-[#555f6f] dark:text-gray-400 flex items-center justify-between">
                    <span>Ref: #{selectedBooking.id}-TXN</span>
                    <span className="material-symbols-outlined text-[16px] text-[#006a61]">verified</span>
                  </div>
                </div>
              </div>

              {/* Drawer Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#e2e8f8]/60 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <Link
                    to="/admin/users"
                    className="px-3 py-1.5 rounded-xl bg-[#f0f3ff] dark:bg-white/5 text-[#151c27] dark:text-white text-xs font-semibold hover:bg-[#e7eefe] transition-colors"
                  >
                    View Guest Profile
                  </Link>
                  <button
                    onClick={() => alert(`Connecting with ${selectedBooking.guestName}...`)}
                    className="px-3 py-1.5 rounded-xl bg-[#f0f3ff] dark:bg-white/5 text-[#151c27] dark:text-white text-xs font-semibold hover:bg-[#e7eefe] transition-colors"
                  >
                    Message Guest
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/admin/bookings"
                    className="px-4 py-1.5 rounded-xl bg-[#b52603] text-white text-xs font-bold hover:bg-[#8c1900] shadow-sm transition-all"
                  >
                    Manage Reservation & Refund
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Platform Activity Timeline (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-white dark:bg-[#171826] p-6 shadow-sm border border-[#e2e8f8] dark:border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-bold text-[#151c27] dark:text-white">
                  Live Activity
                </h2>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <button
                onClick={() => setLiveSynced('just now')}
                className="text-xs text-[#555f6f] dark:text-gray-400 hover:text-[#151c27] dark:hover:text-white font-semibold"
              >
                Refresh
              </button>
            </div>

            {/* Dynamic Activity Items from live database telemetry */}
            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#f0f3ff] dark:before:bg-white/5 before:h-full">
              {(() => {
                const getRelativeTime = (timestamp?: string | Date) => {
                  if (!timestamp) return 'just now';
                  const now = new Date();
                  const past = new Date(timestamp);
                  const diffSec = Math.max(0, Math.floor((now.getTime() - past.getTime()) / 1000));
                  if (diffSec < 60) return 'just now';
                  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
                  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
                  return `${Math.floor(diffSec / 86400)}d ago`;
                };

                const activities: any[] =
                  dashboardData?.liveActivities?.length > 0
                    ? dashboardData.liveActivities
                    : [
                        {
                          id: 'def-1',
                          type: 'listing',
                          title: 'New Inventory Curated',
                          description: 'Luxury Villa in Assagao, Goa added to catalog',
                          timestamp: new Date(),
                          meta: '4 BHK · Villa',
                          link: '/admin/properties',
                        },
                        {
                          id: 'def-2',
                          type: 'booking',
                          title: 'Confirmed Stay',
                          description: 'Reservation confirmed for Guest Traveler',
                          timestamp: new Date(Date.now() - 25 * 60 * 1000),
                          meta: 'Paid',
                          link: '/admin/bookings',
                        },
                        {
                          id: 'def-3',
                          type: 'host',
                          title: 'Host Onboarded',
                          description: 'Host verified and listed initial inventory portfolio',
                          timestamp: new Date(Date.now() - 90 * 60 * 1000),
                          meta: 'Curated Host',
                          link: '/admin/users',
                        },
                      ];

                return activities.slice(0, 4).map((act, idx) => {
                  const isListing = act.type === 'listing';
                  const isBooking = act.type === 'booking';

                  return (
                    <div key={act.id || idx} className="relative flex items-start gap-3">
                      <div
                        className={`w-7 h-7 rounded-full text-white flex items-center justify-center flex-shrink-0 z-10 shadow-sm ${
                          isListing
                            ? 'bg-[#b52603]'
                            : isBooking
                            ? 'bg-[#006a61]'
                            : 'bg-indigo-600'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {isListing ? 'villa' : isBooking ? 'check_circle' : 'verified_user'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 bg-[#f0f3ff] dark:bg-white/5 p-3 rounded-xl border border-[#e2e8f8]/60 dark:border-white/5">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span
                            className={`text-[11px] font-bold ${
                              isListing
                                ? 'text-[#b52603]'
                                : isBooking
                                ? 'text-[#006a61]'
                                : 'text-indigo-600 dark:text-indigo-400'
                            }`}
                          >
                            {act.title}
                          </span>
                          <span className="text-[10px] text-[#555f6f] dark:text-gray-400">
                            {getRelativeTime(act.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-[#151c27] dark:text-white leading-snug">
                          {act.description}
                        </p>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          {act.link ? (
                            <Link
                              to={act.link}
                              className={`px-2.5 py-1 rounded text-white text-[10px] font-bold transition-colors ${
                                isListing ? 'bg-[#b52603] hover:bg-[#8c1900]' : 'bg-[#006a61] hover:bg-[#00514a]'
                              }`}
                            >
                              {act.isPending ? 'Review Listing' : 'View Details'}
                            </Link>
                          ) : (
                            <span />
                          )}
                          {act.meta && (
                            <span className="text-[10px] text-[#555f6f] dark:text-gray-400 font-semibold">
                              {act.meta}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          <div className="mt-4 pt-3 bg-[#f0f3ff] dark:bg-white/5 p-3 rounded-xl flex items-center justify-between border border-[#e2e8f8]/60 dark:border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-[#151c27] dark:text-white font-medium">
                {dashboardData?.systemHealth?.services || 'All Core Services Operational'}
              </span>
            </div>
            <span className="text-[11px] text-[#555f6f] dark:text-gray-400">
              {dashboardData?.systemHealth?.gateway || 'Razorpay · AWS Mumbai'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
