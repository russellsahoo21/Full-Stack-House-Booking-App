import React, { useState, useEffect } from 'react';
import { adminApi } from '@/services/api';
import { UserAvatar } from '@/components/common/UserAvatar';

interface BookingItem {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  avatar: string;
  property: string;
  location: string;
  propertyType: string;
  hostName: string;
  hostPhone: string;
  dates: string;
  nights: number;
  guestsCount: string;
  amount: number;
  paymentStatus: 'Paid' | 'In Escrow' | 'Refunded';
  status: 'Confirmed' | 'Pending Confirmation' | 'Completed' | 'Cancelled by Guest';
  gatewayId: string;
  nightlyRate: number;
}

const INITIAL_BOOKINGS: BookingItem[] = [
  {
    id: 'WF-10284',
    guestName: 'Aarav Mehta',
    guestEmail: 'aarav.m@gmail.com',
    guestPhone: '+91 98201 44521',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    property: 'Casa Verde Retreat',
    location: 'Lonavala, Maharashtra',
    propertyType: 'Entire Villa',
    hostName: 'Sunita Rao',
    hostPhone: '+91 94220 18492',
    dates: 'Oct 04 → Oct 07, 2026',
    nights: 3,
    guestsCount: '4 Adults',
    amount: 99502,
    nightlyRate: 28500,
    paymentStatus: 'Paid',
    status: 'Confirmed',
    gatewayId: 'pay_Nx982Q01kl',
  },
  {
    id: 'WF-10283',
    guestName: 'Riya Shah',
    guestEmail: 'riya.shah@outlook.com',
    guestPhone: '+91 97123 55891',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    property: 'Lakeview Villa',
    location: 'Udaipur, Rajasthan',
    propertyType: 'Haveli Suite',
    hostName: 'Kunal Singhania',
    hostPhone: '+91 98291 00219',
    dates: 'Oct 05 → Oct 08, 2026',
    nights: 3,
    guestsCount: '6 Adults, 2 Kids',
    amount: 126000,
    nightlyRate: 42000,
    paymentStatus: 'In Escrow',
    status: 'Pending Confirmation',
    gatewayId: 'pay_Rs8193Kms9',
  },
  {
    id: 'WF-10282',
    guestName: 'Vikram Malhotra',
    guestEmail: 'v.malhotra@zenith.in',
    guestPhone: '+91 98101 22941',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    property: 'Azure Beach Villa',
    location: 'Candolim, Goa',
    propertyType: 'Beachfront Estate',
    hostName: 'Tanya Fernandes',
    hostPhone: '+91 98221 44021',
    dates: 'Oct 08 → Oct 12, 2026',
    nights: 4,
    guestsCount: '8 Adults',
    amount: 144000,
    nightlyRate: 36000,
    paymentStatus: 'Paid',
    status: 'Confirmed',
    gatewayId: 'pay_Vm390192la',
  },
  {
    id: 'WF-10280',
    guestName: 'Siddharth Sen',
    guestEmail: 's.sen@outlook.com',
    guestPhone: '+91 98301 92831',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    property: 'Royal Haveli Suite',
    location: 'Jaipur, Rajasthan',
    propertyType: 'Palace Suite',
    hostName: 'Vikramaditya Rathore',
    hostPhone: '+91 98290 88291',
    dates: 'Sep 28 → Oct 02, 2026',
    nights: 4,
    guestsCount: '2 Adults',
    amount: 62000,
    nightlyRate: 15500,
    paymentStatus: 'Paid',
    status: 'Completed',
    gatewayId: 'pay_Ss192830al',
  },
  {
    id: 'WF-10279',
    guestName: 'Meera Nair',
    guestEmail: 'meera.nair@icloud.com',
    guestPhone: '+91 98471 29381',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    property: 'The Hillside Cabin',
    location: 'Manali, Himachal',
    propertyType: 'Cedar Chalet',
    hostName: 'Devendra Negi',
    hostPhone: '+91 94180 33921',
    dates: 'Sep 24 → Sep 27, 2026',
    nights: 3,
    guestsCount: '3 Adults',
    amount: 38000,
    nightlyRate: 12666,
    paymentStatus: 'Refunded',
    status: 'Cancelled by Guest',
    gatewayId: 'pay_Mn9831920k',
  },
];

export const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<BookingItem[]>(INITIAL_BOOKINGS);
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(INITIAL_BOOKINGS[0]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Confirmed' | 'Pending' | 'Cancelled'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [refundReason, setRefundReason] = useState('guest');
  const [adminMemo, setAdminMemo] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchBookings = async () => {
    try {
      const res = await adminApi.getBookings();
      if (res?.success && res.data && res.data.length > 0) {
        const mapped: BookingItem[] = res.data.map((b: any) => {
          const l = b.listing;
          return {
            id: b._id,
            guestName: b.guestInfo?.name || 'Guest Traveler',
            guestEmail: b.guestInfo?.email || 'guest@wayfound.stay',
            guestPhone: b.guestInfo?.phone || '+91 98000 00000',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            property: l?.title || 'Luxury Estate',
            location: `${l?.location?.city || 'Goa'}, ${l?.location?.state || 'India'}`,
            propertyType: l?.propertyType || 'Villa',
            hostName: l?.host?.name || 'Host',
            hostPhone: '+91 98765 43210',
            dates: `${b.checkIn} → ${b.checkOut}`,
            nights: b.nights || 2,
            guestsCount: `${b.guests?.adults || 2} Adults`,
            amount: b.pricing?.total || 25000,
            nightlyRate: b.pricing?.perNight || 12000,
            paymentStatus: b.paymentStatus === 'paid' ? 'Paid' : b.paymentStatus === 'refunded' ? 'Refunded' : 'In Escrow',
            status: b.status === 'confirmed' ? 'Confirmed' : b.status === 'cancelled' ? 'Cancelled by Guest' : 'Pending Confirmation',
            gatewayId: b.paymentId || 'pay_online',
          };
        });
        setBookings(mapped);
        if (mapped.length > 0 && !selectedBooking) {
          setSelectedBooking(mapped[0]);
        }
      }
    } catch (err: any) {
      console.warn('Could not load bookings from API:', err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.location.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'Confirmed') return matchesSearch && b.status === 'Confirmed';
    if (statusFilter === 'Pending') return matchesSearch && b.status === 'Pending Confirmation';
    if (statusFilter === 'Cancelled') return matchesSearch && b.status === 'Cancelled by Guest';
    return matchesSearch;
  });

  // Dynamic Metrics derived directly from live database bookings
  const totalBookingsCount = bookings.length;
  const confirmedCount = bookings.filter((b) => b.status === 'Confirmed').length;
  const pendingCount = bookings.filter((b) => b.status === 'Pending Confirmation').length;
  const cancelledCount = bookings.filter((b) => b.status === 'Cancelled by Guest').length;

  const confirmedPercent = totalBookingsCount > 0 ? ((confirmedCount / totalBookingsCount) * 100).toFixed(1) : '0';
  const cancelledPercent = totalBookingsCount > 0 ? ((cancelledCount / totalBookingsCount) * 100).toFixed(1) : '0';

  const handleConfirmReservation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await adminApi.updateBookingStatus(id, { status: 'confirmed', paymentStatus: 'paid' });
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'Confirmed', paymentStatus: 'Paid' } : b))
      );
      showToast(`Reservation ${id} successfully confirmed.`);
    } catch (err: any) {
      showToast(`Error: ${err?.message || 'Could not confirm reservation'}`);
    }
  };

  const handleProcessRefund = async () => {
    if (!selectedBooking) return;
    try {
      await adminApi.updateBookingStatus(selectedBooking.id, {
        status: 'cancelled',
        paymentStatus: 'refunded',
        reason: adminMemo || refundReason,
      });
      setBookings((prev) =>
        prev.map((b) =>
          b.id === selectedBooking.id
            ? { ...b, status: 'Cancelled by Guest', paymentStatus: 'Refunded' }
            : b
        )
      );
      setRefundModalOpen(false);
      setDrawerOpen(false);
      showToast(`Refund of ₹${selectedBooking.amount.toLocaleString('en-IN')} disbursed for ${selectedBooking.id}`);
    } catch (err: any) {
      showToast(`Error: ${err?.message || 'Could not process refund'}`);
    }
  };

  const handleDeleteBooking = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm(`Are you sure you want to permanently remove reservation ${id} from the records?`)) {
      return;
    }
    try {
      await adminApi.deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      if (selectedBooking?.id === id) {
        setSelectedBooking(null);
        setDrawerOpen(false);
      }
      showToast(`Reservation ${id} permanently removed.`);
    } catch (err: any) {
      showToast(`Error: ${err?.message || 'Could not remove reservation'}`);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#151c27] text-white shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <span className="material-symbols-outlined text-emerald-400 text-[20px]">check_circle</span>
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-gray-400 hover:text-white">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-[#555f6f] dark:text-gray-400 text-[11px] uppercase tracking-widest font-semibold mb-1">
            <span>Inventory Hub</span>
            <span>•</span>
            <span className="text-[#b52603] font-bold">Ledger Operations</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#151c27] dark:text-white tracking-tight">
            Bookings & Reservations
          </h1>
          <p className="text-sm text-[#555f6f] dark:text-gray-400 mt-0.5">
            Monitor, verify, and resolve guest reservations across all Wayfound properties.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => showToast('Exported reservations manifest (.CSV)')}
            className="h-10 px-4 rounded-xl bg-white dark:bg-[#171826] border border-[#e2e8f8] dark:border-white/10 text-[#151c27] dark:text-white text-xs font-semibold shadow-sm hover:bg-[#f0f3ff] transition-all flex items-center gap-1.5"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#555f6f]">download</span>
            <span>Download Manifest</span>
          </button>

          <button
            onClick={() => alert('Opening manual reservation concierge creator...')}
            className="h-10 px-4 rounded-xl bg-[#b52603] text-white text-xs font-bold shadow-md hover:bg-[#8c1900] active:scale-95 transition-all flex items-center gap-1.5"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Manual Reservation</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Quartet */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-[#171826] border border-[#e2e8f8] dark:border-white/10 rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#b52603]"></div>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#555f6f] dark:text-gray-400 font-bold">
                Total Bookings
              </span>
              <h2 className="text-2xl font-extrabold text-[#151c27] dark:text-white mt-1">
                {totalBookingsCount.toLocaleString('en-IN')}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#ffdad2] text-[#3d0600] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">villa</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs">
            <span className="flex items-center text-[#006a61] font-bold">
              <span className="material-symbols-outlined text-[16px]">arrow_upward</span>Live
            </span>
            <span className="text-[#555f6f] dark:text-gray-400">Total ledger records</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#171826] border border-[#e2e8f8] dark:border-white/10 rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#006a61]"></div>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#555f6f] dark:text-gray-400 font-bold">
                Confirmed
              </span>
              <h2 className="text-2xl font-extrabold text-[#151c27] dark:text-white mt-1">
                {confirmedCount.toLocaleString('en-IN')}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#89f5e7] text-[#00201d] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">verified</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs">
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
              {confirmedPercent}%
            </span>
            <span className="text-[#555f6f] dark:text-gray-400">of total bookings</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#171826] border border-[#e2e8f8] dark:border-white/10 rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#555f6f] dark:text-gray-400 font-bold">
                Pending Review
              </span>
              <h2 className="text-2xl font-extrabold text-[#151c27] dark:text-white mt-1">
                {pendingCount.toLocaleString('en-IN')}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">hourglass_top</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-[#555f6f] dark:text-gray-400">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Awaiting confirmation</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#171826] border border-[#e2e8f8] dark:border-white/10 rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#555f6f]"></div>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#555f6f] dark:text-gray-400 font-bold">
                Cancelled / Refunded
              </span>
              <h2 className="text-2xl font-extrabold text-[#151c27] dark:text-white mt-1">
                {cancelledCount.toLocaleString('en-IN')}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#d6e0f3] text-[#121c2a] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">assignment_return</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-[#555f6f] dark:text-gray-400">
            <span className="font-bold text-[#151c27] dark:text-white">{cancelledPercent}%</span>
            <span>Cancellation rate</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-[#171826] border border-[#e2e8f8] dark:border-white/10 rounded-2xl p-4 shadow-sm mb-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="md:col-span-5 relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-[18px] text-[#555f6f] pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by booking ID, guest name, property..."
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-[#f0f3ff] dark:bg-white/5 border border-transparent dark:border-white/10 text-xs text-[#151c27] dark:text-white placeholder:text-[#555f6f] focus:outline-none focus:bg-white dark:focus:bg-[#12131e] focus:border-[#b52603] transition-all"
            />
          </div>

          {/* Status Pills */}
          <div className="md:col-span-7 flex flex-wrap items-center justify-start md:justify-end gap-2">
            <div className="flex items-center bg-[#f0f3ff] dark:bg-white/5 rounded-xl p-1 border border-[#e2e8f8]/60 dark:border-white/5">
              {(['All', 'Confirmed', 'Pending', 'Cancelled'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-all ${statusFilter === tab
                      ? 'bg-white dark:bg-[#202235] text-[#b52603] font-bold shadow-sm'
                      : 'text-[#555f6f] dark:text-gray-400 hover:text-[#151c27] dark:hover:text-white'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
              }}
              className="h-9 px-3 rounded-xl bg-[#f0f3ff] dark:bg-white/5 text-xs text-[#555f6f] dark:text-gray-400 hover:text-[#151c27] dark:hover:text-white flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Ledger Data Table */}
      <div className="bg-white dark:bg-[#171826] border border-[#e2e8f8] dark:border-white/10 rounded-2xl shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f0f3ff] dark:bg-white/5 text-[#555f6f] dark:text-gray-400 text-[11px] uppercase tracking-wider font-semibold h-11">
                <th className="px-4">Booking ID</th>
                <th className="px-4">Guest</th>
                <th className="px-4">Property & Location</th>
                <th className="px-4">Dates of Stay</th>
                <th className="px-4">Guests</th>
                <th className="px-4 text-right">Amount</th>
                <th className="px-4 text-center">Payment</th>
                <th className="px-4 text-center">Status</th>
                <th className="px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f3ff] dark:divide-white/5 text-xs text-[#151c27] dark:text-white">
              {filteredBookings.map((b) => (
                <tr
                  key={b.id}
                  onClick={() => {
                    setSelectedBooking(b);
                    setDrawerOpen(true);
                  }}
                  className="h-16 hover:bg-[#f0f3ff]/60 dark:hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <td className="px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#b52603]">{b.id}</span>
                      {selectedBooking?.id === b.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#b52603] animate-pulse"></span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#555f6f] dark:text-gray-400">Direct Gateway</span>
                  </td>

                  <td className="px-4">
                    <div className="flex items-center gap-2.5">
                      <UserAvatar name={b.guestName} size="sm" />
                      <div className="min-w-0">
                        <p className="font-semibold text-xs text-[#151c27] dark:text-white truncate">
                          {b.guestName}
                        </p>
                        <p className="text-[11px] text-[#555f6f] dark:text-gray-400 truncate">
                          {b.guestEmail}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4">
                    <div className="flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-[16px] text-[#006a61]">villa</span>
                      <span className="truncate max-w-[150px]">{b.property}</span>
                    </div>
                    <span className="text-[11px] text-[#555f6f] dark:text-gray-400 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">location_on</span>
                      {b.location}
                    </span>
                  </td>

                  <td className="px-4">
                    <div className="font-medium">{b.dates}</div>
                    <span className="text-[10px] text-[#555f6f] dark:text-gray-400">{b.nights} nights</span>
                  </td>

                  <td className="px-4 font-medium">{b.guestsCount}</td>

                  <td className="px-4 text-right">
                    <div className="font-bold text-sm">₹{b.amount.toLocaleString('en-IN')}</div>
                    <span className="text-[10px] text-[#555f6f] dark:text-gray-400">Captured</span>
                  </td>

                  <td className="px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${b.paymentStatus === 'Paid'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                          : b.paymentStatus === 'In Escrow'
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400'
                            : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400'
                        }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {b.paymentStatus}
                    </span>
                  </td>

                  <td className="px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${b.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'Pending Confirmation'
                            ? 'bg-amber-100 text-amber-900'
                            : b.status === 'Completed'
                              ? 'bg-[#d6e0f3] text-[#121c2a]'
                              : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td className="px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      {b.status === 'Pending Confirmation' && (
                        <button
                          onClick={(e) => handleConfirmReservation(b.id, e)}
                          className="h-7 px-2.5 rounded-lg bg-[#006a61] text-white text-[11px] font-bold hover:bg-[#005049] transition-all flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">check</span>Confirm
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedBooking(b);
                          setDrawerOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-[#555f6f] hover:text-[#b52603] hover:bg-[#f0f3ff] transition-colors"
                        title="View Full Dossier"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                      {b.status !== 'Cancelled by Guest' ? (
                        <button
                          onClick={() => {
                            setSelectedBooking(b);
                            setRefundModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors"
                          title="Cancel & Refund"
                        >
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleDeleteBooking(b.id, e)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-white hover:bg-rose-600 transition-colors"
                          title="Remove Cancelled Reservation"
                        >
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f0f3ff] dark:bg-white/5 border-t border-[#e2e8f8]/60 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#555f6f] dark:text-gray-400">
          <span>
            Showing <strong className="text-[#151c27] dark:text-white">{filteredBookings.length}</strong> of{' '}
            <strong className="text-[#151c27] dark:text-white">{bookings.length}</strong> bookings
          </span>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-lg bg-[#b52603] text-white font-bold flex items-center justify-center">
              1
            </button>
          </div>
        </div>
      </div>

      {/* Slide-over Detail Drawer */}
      {drawerOpen && selectedBooking && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
            onClick={() => setDrawerOpen(false)}
          ></div>
          <div className="fixed inset-y-0 right-0 w-full max-w-[540px] bg-white dark:bg-[#171826] shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-6 bg-[#f0f3ff] dark:bg-white/5 border-b border-[#e2e8f8] dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#b52603] animate-ping"></span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-[#151c27] dark:text-white">
                      Booking {selectedBooking.id}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {selectedBooking.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#555f6f] dark:text-gray-400 mt-0.5">
                    Stay period: {selectedBooking.dates}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-xl text-[#555f6f] dark:text-gray-400 hover:text-[#151c27] dark:hover:text-white hover:bg-white dark:hover:bg-white/10"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col gap-5 text-xs text-[#555f6f] dark:text-gray-400">
              {/* Alert */}
              <div className="rounded-xl p-4 bg-[#f0f3ff] dark:bg-white/5 border border-[#e2e8f8]/60 dark:border-white/5 flex items-start gap-3">
                <span className="material-symbols-outlined text-[#b52603] text-[22px] mt-0.5">
                  event_upcoming
                </span>
                <div>
                  <h3 className="font-bold text-sm text-[#151c27] dark:text-white">
                    Self Check-In Confirmed
                  </h3>
                  <p className="text-xs text-[#555f6f] dark:text-gray-400 mt-0.5">
                    Smart lock passcodes generated and dispatched to guest phone via SMS.
                  </p>
                </div>
              </div>

              {/* Guest & Host Profile */}
              <div className="rounded-xl bg-[#f0f3ff] dark:bg-white/5 border border-[#e2e8f8]/60 dark:border-white/5 p-4 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={selectedBooking.guestName} size="lg" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-[#151c27] dark:text-white">
                          {selectedBooking.guestName}
                        </h4>
                        <span className="material-symbols-outlined text-[#006a61] text-[18px]">
                          verified_user
                        </span>
                      </div>
                      <p className="text-xs">{selectedBooking.guestPhone} • Aadhaar KYC Verified</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#d6e0f3] text-[#121c2a] text-[10px] uppercase font-bold tracking-wider">
                    VIP Guest
                  </span>
                </div>

                <div className="h-px bg-[#e2e8f8] dark:bg-white/10"></div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#555f6f] dark:text-gray-400 font-bold">
                    Assigned Estate & Host
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1.5 font-semibold text-sm text-[#151c27] dark:text-white">
                      <span className="material-symbols-outlined text-[#b52603] text-[20px]">villa</span>
                      <span>{selectedBooking.property}</span>
                    </div>
                    <span className="text-xs text-[#006a61] font-bold">{selectedBooking.location}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between bg-white dark:bg-white/5 p-2.5 rounded-xl border border-[#e2e8f8]/60 dark:border-white/5">
                    <span>
                      Host: <strong className="text-[#151c27] dark:text-white">{selectedBooking.hostName}</strong>
                    </span>
                    <span className="font-semibold text-[#151c27] dark:text-white flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-[#006a61]">call</span>
                      {selectedBooking.hostPhone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Ledger Breakdown */}
              <div className="rounded-xl bg-[#f0f3ff] dark:bg-white/5 border border-[#e2e8f8]/60 dark:border-white/5 p-4 space-y-2.5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-sm text-[#151c27] dark:text-white flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#006a61] text-[18px]">
                      account_balance_wallet
                    </span>
                    Financial Ledger Breakdown
                  </h3>
                  <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                    Razorpay Settled
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>
                    Nightly Rate (₹{selectedBooking.nightlyRate.toLocaleString('en-IN')} × {selectedBooking.nights}{' '}
                    nights)
                  </span>
                  <span className="font-semibold text-[#151c27] dark:text-white">
                    ₹{(selectedBooking.nightlyRate * selectedBooking.nights).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cleaning & Linen Sanitization</span>
                  <span className="font-semibold text-[#151c27] dark:text-white">₹3,500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Wayfound Platform Fee (10%)</span>
                  <span className="font-semibold text-[#151c27] dark:text-white">₹8,900</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>GST on Platform Commission (18%)</span>
                  <span className="font-semibold text-[#151c27] dark:text-white">₹1,602</span>
                </div>

                <div className="h-px bg-[#e2e8f8] dark:bg-white/10 my-2"></div>

                <div className="flex justify-between items-center text-sm font-bold text-[#151c27] dark:text-white">
                  <span>Total Gross Charged</span>
                  <span className="text-[#b52603] text-base">
                    ₹{selectedBooking.amount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-[#e2e8f8]/60 dark:border-white/5 flex flex-col gap-1 mt-2">
                  <div className="flex justify-between items-center text-xs text-[#151c27] dark:text-white">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-[#006a61]">alt_route</span>
                      Net Host Payout
                    </span>
                    <span className="font-bold text-[#006a61] text-sm">
                      ₹{Math.round(selectedBooking.amount * 0.85).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#555f6f] dark:text-gray-400">
                    Automated Razorpay Route payout scheduled T+1 post-checkin.
                  </p>
                </div>
              </div>

              {/* Gateway Telemetry */}
              <div className="rounded-xl bg-[#f0f3ff] dark:bg-white/5 border border-[#e2e8f8]/60 dark:border-white/5 p-4 space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#555f6f]">
                  Gateway Transaction Telemetry
                </span>
                <div className="flex items-center justify-between">
                  <span>Gateway Identifier:</span>
                  <code className="px-2 py-0.5 rounded bg-white dark:bg-white/10 font-mono text-[11px] text-[#151c27] dark:text-white">
                    {selectedBooking.gatewayId}
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span>Settlement State:</span>
                  <span className="text-[#006a61] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">done_all</span> Captured in Escrow
                  </span>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 bg-white dark:bg-[#171826] border-t border-[#e2e8f8] dark:border-white/10 flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => showToast('Generated Tax Invoice PDF')}
                  className="h-10 px-4 rounded-xl bg-[#f0f3ff] dark:bg-white/5 text-[#151c27] dark:text-white text-xs font-semibold hover:bg-[#e7eefe] flex items-center justify-center gap-1.5 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">receipt</span>
                  <span>Tax Invoice</span>
                </button>
                {selectedBooking.status !== 'Cancelled by Guest' ? (
                  <button
                    type="button"
                    onClick={() => setRefundModalOpen(true)}
                    className="h-10 px-4 rounded-xl bg-[#ffdad6] text-[#ba1a1a] text-xs font-bold hover:bg-[#ffb4a3] flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">price_change</span>
                    <span>Issue Refund</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleDeleteBooking(selectedBooking.id)}
                    className="h-10 px-4 rounded-xl bg-rose-100 text-rose-700 text-xs font-bold hover:bg-rose-200 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                    <span>Remove</span>
                  </button>
                )}
              </div>

              {selectedBooking.status !== 'Cancelled by Guest' ? (
                <button
                  type="button"
                  onClick={() => setRefundModalOpen(true)}
                  className="h-10 w-full rounded-xl bg-[#ba1a1a] text-white text-xs font-bold hover:bg-[#8c1900] flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">cancel</span>
                  <span>Cancel Reservation & Authorize Full Refund</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleDeleteBooking(selectedBooking.id)}
                  className="h-10 w-full rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                  <span>Permanently Delete Reservation Record</span>
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Accessible Refund & Cancellation Modal Dialog */}
      {refundModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#171826] shadow-2xl p-6 flex flex-col gap-4 border border-[#e2e8f8] dark:border-white/10 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[22px]">currency_exchange</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#151c27] dark:text-white">
                    Initiate Refund for {selectedBooking.id}?
                  </h3>
                  <p className="text-xs text-[#555f6f] dark:text-gray-400">
                    {selectedBooking.property} • {selectedBooking.guestName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRefundModalOpen(false)}
                className="p-1 rounded-lg text-[#555f6f] hover:text-[#151c27]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="bg-[#f0f3ff] dark:bg-white/5 p-4 rounded-xl flex items-center justify-between border border-[#e2e8f8]/60 dark:border-white/5">
              <span className="text-xs text-[#555f6f] dark:text-gray-400">Refund Amount Calculated:</span>
              <span className="text-xl font-bold text-[#ba1a1a]">
                ₹{selectedBooking.amount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider font-bold text-[#555f6f] dark:text-gray-400">
                Authorized Reason for Cancellation
              </label>
              <select
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#f0f3ff] dark:bg-white/5 border border-transparent dark:border-white/10 text-xs text-[#151c27] dark:text-white focus:outline-none focus:border-[#b52603]"
              >
                <option value="guest">Guest Request (Free Cancellation Window)</option>
                <option value="host">Host Cancellation / Property Maintenance</option>
                <option value="force">Force Majeure / Weather Disruption</option>
                <option value="dispute">Payment Dispute / Fraudulent Charge</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider font-bold text-[#555f6f] dark:text-gray-400">
                Administrative Memo
              </label>
              <textarea
                value={adminMemo}
                onChange={(e) => setAdminMemo(e.target.value)}
                rows={2}
                placeholder="Document internal justification for audit logs..."
                className="w-full p-2.5 rounded-xl bg-[#f0f3ff] dark:bg-white/5 border border-transparent dark:border-white/10 text-xs text-[#151c27] dark:text-white placeholder:text-[#555f6f] focus:outline-none focus:border-[#b52603] resize-none"
              ></textarea>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300 text-xs flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] text-amber-600 mt-0.5">info</span>
              <span>
                Reversal will be credited to guest's original payment instrument within 3-5 standard banking days.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-2">
              <button
                type="button"
                onClick={() => setRefundModalOpen(false)}
                className="h-10 px-4 rounded-xl bg-[#f0f3ff] dark:bg-white/5 text-[#151c27] dark:text-white text-xs font-semibold hover:bg-[#e7eefe]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProcessRefund}
                className="h-10 px-4 rounded-xl bg-[#ba1a1a] text-white text-xs font-bold hover:bg-[#8c1900] shadow-md flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                <span>Confirm & Disburse Refund</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
