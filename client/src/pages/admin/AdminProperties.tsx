import React, { useState, useEffect } from 'react';
import { adminApi } from '@/services/api';

interface PropertyItem {
  id: string;
  name: string;
  category: string;
  hostName: string;
  isSuperhost: boolean;
  city: string;
  state: string;
  pricePerNight: number;
  rating: number;
  reviewsCount: number;
  monthlyBookings: number;
  status: 'Published' | 'Pending Approval' | 'Draft' | 'Archived';
  image: string;
  photosCount?: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  beds: number;
  submittedTime: string;
  amenities?: string[];
}

const INITIAL_PROPERTIES: PropertyItem[] = [
  {
    id: 'WF-8821',
    name: 'Casa Verde Retreat',
    category: 'Luxury 4BHK Villa',
    hostName: 'Sunita Rao',
    isSuperhost: true,
    city: 'Lonavala',
    state: 'Maharashtra',
    pricePerNight: 28500,
    rating: 4.96,
    reviewsCount: 128,
    monthlyBookings: 18,
    status: 'Published',
    image:
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
    bedrooms: 4,
    bathrooms: 4,
    maxGuests: 8,
    beds: 5,
    submittedTime: '2 weeks ago',
  },
  {
    id: 'WF-4419',
    name: 'Lakeview Villa & Spa',
    category: 'Private Pool Haveli',
    hostName: 'Kunal Singhania',
    isSuperhost: false,
    city: 'Udaipur',
    state: 'Rajasthan',
    pricePerNight: 42000,
    rating: 4.92,
    reviewsCount: 94,
    monthlyBookings: 14,
    status: 'Published',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    bedrooms: 5,
    bathrooms: 6,
    maxGuests: 10,
    beds: 6,
    submittedTime: '1 month ago',
  },
  {
    id: 'WF-1092',
    name: 'Azure Beach Villa',
    category: 'Seafront Estate',
    hostName: 'Tanya Fernandes',
    isSuperhost: true,
    city: 'Goa',
    state: 'Goa',
    pricePerNight: 36000,
    rating: 4.88,
    reviewsCount: 215,
    monthlyBookings: 22,
    status: 'Published',
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    bedrooms: 4,
    bathrooms: 4,
    maxGuests: 8,
    beds: 4,
    submittedTime: '3 months ago',
  },
  {
    id: 'WF-5520',
    name: 'The Himalayan Perch',
    category: 'Pine Forest Chalet',
    hostName: 'Devendra Negi',
    isSuperhost: false,
    city: 'Manali',
    state: 'Himachal',
    pricePerNight: 18500,
    rating: 4.98,
    reviewsCount: 86,
    monthlyBookings: 11,
    status: 'Pending Approval',
    image:
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 6,
    beds: 4,
    submittedTime: '4 hours ago',
  },
  {
    id: 'WF-7391',
    name: 'Saffron Palace Suite',
    category: 'Royal Heritage Stay',
    hostName: 'Vikramaditya Rathore',
    isSuperhost: false,
    city: 'Jaipur',
    state: 'Rajasthan',
    pricePerNight: 55000,
    rating: 5.0,
    reviewsCount: 12,
    monthlyBookings: 0,
    status: 'Pending Approval',
    image:
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80',
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 6,
    beds: 3,
    submittedTime: '1 day ago',
  },
  {
    id: 'WF-3129',
    name: 'Nilgiri Tea Bungalow',
    category: 'Heritage Planter Home',
    hostName: 'Ayesha Kurian',
    isSuperhost: false,
    city: 'Ooty',
    state: 'Tamil Nadu',
    pricePerNight: 24000,
    rating: 4.75,
    reviewsCount: 42,
    monthlyBookings: 8,
    status: 'Draft',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 6,
    beds: 3,
    submittedTime: '5 days ago',
  },
];

export const AdminProperties: React.FC = () => {
  const [properties, setProperties] = useState<PropertyItem[]>(INITIAL_PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState<PropertyItem | null>(
    INITIAL_PROPERTIES[3]
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cityFilter, setCityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectFeedback, setRejectFeedback] = useState(
    'Sorry, we could not publish your property at this time. Please upload higher resolution photos and clarify check-in procedures.'
  );
  const [isSubmittingReject, setIsSubmittingReject] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchProperties = async () => {
    try {
      const res = await adminApi.getProperties();
      if (res?.success && res.data && res.data.length > 0) {
        const mapped: PropertyItem[] = res.data.map((l: any) => ({
          id: l._id,
          name: l.title,
          category: l.category?.[0] ? `${l.category[0].toUpperCase()} Villa` : (l.propertyType || 'Villa'),
          hostName: l.host?.name || 'Verified Host',
          isSuperhost: l.host?.isSuperhost || false,
          city: l.location?.city || 'India',
          state: l.location?.state || 'India',
          pricePerNight: typeof l.price === 'number' ? l.price : (l.price?.perNight || 0),
          rating: typeof l.rating?.average === 'number' && l.rating.average > 0 ? l.rating.average : (l.rating?.count > 0 ? 5.0 : 0),
          reviewsCount: l.rating?.count || 0,
          monthlyBookings: l.bookingStats?.count || 0,
          status: l.status || 'Published',
          image: l.images?.[0] || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
          photosCount: Array.isArray(l.images) ? l.images.length : 1,
          bedrooms: l.bedrooms || 1,
          bathrooms: l.bathrooms || 1,
          maxGuests: l.maxGuests || 2,
          beds: l.beds || 1,
          submittedTime: l.createdAt ? new Date(l.createdAt).toLocaleDateString() : 'Recent',
          amenities: l.amenities || [],
        }));
        setProperties(mapped);
        if (mapped.length > 0 && !selectedProperty) {
          setSelectedProperty(mapped[0]);
        }
      }
    } catch (err: any) {
      console.warn('Could not load properties from API:', err);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.hostName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCity = cityFilter === 'All' || p.city.toLowerCase() === cityFilter.toLowerCase();
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;

    return matchesSearch && matchesCity && matchesStatus;
  });

  const handleApproveProperty = async (id: string) => {
    try {
      await adminApi.updatePropertyStatus(id, { status: 'Published' });
      setProperties((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: 'Published' } : item))
      );
      setDrawerOpen(false);
      showToast(`Property ${id} approved & published to search index.`);
    } catch (err: any) {
      showToast(`Error: ${err?.message || 'Could not approve property'}`);
    }
  };

  const handleOpenRejectModal = () => {
    if (!selectedProperty) return;
    setRejectFeedback(
      `Sorry, we couldn't publish "${selectedProperty.name}" at this time. To meet Wayfound's architectural and quality standards, please provide clearer photos and verify host documentation.`
    );
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedProperty) return;
    setIsSubmittingReject(true);
    try {
      await adminApi.updatePropertyStatus(selectedProperty.id, {
        status: 'Draft',
        reviewFeedback: rejectFeedback.trim(),
        rejectionReason: rejectFeedback.trim(),
      });

      setProperties((prev) =>
        prev.map((item) =>
          item.id === selectedProperty.id ? { ...item, status: 'Draft' } : item
        )
      );

      // Trigger event so host navbar notification updates if active in same browser
      window.dispatchEvent(new Event('wayfound_property_status_changed'));

      setIsRejectModalOpen(false);
      setDrawerOpen(false);
      showToast(`Property returned to draft & feedback notification sent to ${selectedProperty.hostName}.`);
    } catch (err: any) {
      showToast(`Error: ${err?.message || 'Could not update property'}`);
    } finally {
      setIsSubmittingReject(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-8">
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

      {/* Page Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1 text-[11px] uppercase tracking-widest text-[#b52603] font-bold">
            <span>Inventory Management</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span className="text-[#555f6f] dark:text-gray-400">Curated Architecture</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#151c27] dark:text-white tracking-tight">
            Properties Catalog
          </h1>
          <p className="text-sm text-[#555f6f] dark:text-gray-400 mt-0.5">
            Manage, review, and monitor all luxury listings across India.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => showToast('Exporting property catalog (.CSV)')}
            className="flex items-center gap-1.5 px-4 h-10 rounded-xl bg-white dark:bg-[#171826] border border-[#e2e8f8] dark:border-white/10 text-[#151c27] dark:text-white text-xs font-semibold shadow-sm hover:bg-[#f0f3ff] transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-[#555f6f]">file_download</span>
            <span>Export Catalog</span>
          </button>

          <button
            onClick={() => alert('New listing builder wizard opening...')}
            className="flex items-center gap-1.5 px-5 h-10 rounded-xl bg-[#b52603] text-white text-xs font-bold shadow-md hover:bg-[#8c1900] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>+ Add Property</span>
          </button>
        </div>
      </section>

      {/* KPI Summary Bar */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="relative bg-white dark:bg-[#171826] p-5 rounded-2xl border border-[#e2e8f8] dark:border-white/10 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#555f6f]"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#555f6f] dark:text-gray-400 font-bold">
              Total Properties
            </span>
            <span className="material-symbols-outlined text-[#555f6f] text-[22px]">villa</span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[#151c27] dark:text-white">{properties.length}</span>
            <span className="text-[10px] text-[#555f6f] dark:text-gray-400 bg-[#f0f3ff] dark:bg-white/5 px-2 py-0.5 rounded-full font-bold">
              All States
            </span>
          </div>
          <div className="mt-3 w-full bg-[#f0f3ff] dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#555f6f] h-full rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className="relative bg-white dark:bg-[#171826] p-5 rounded-2xl border border-[#e2e8f8] dark:border-white/10 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#006a61]"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#555f6f] dark:text-gray-400 font-bold">
              Published
            </span>
            <span className="material-symbols-outlined text-[#006a61] text-[22px]">check_circle</span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[#151c27] dark:text-white">
              {properties.filter((p) => p.status === 'Published').length}
            </span>
            <span className="text-[10px] text-[#006a61] bg-[#89f5e7]/30 px-2 py-0.5 rounded-full font-bold">
              {properties.length > 0 ? Math.round((properties.filter((p) => p.status === 'Published').length / properties.length) * 100) : 0}% active
            </span>
          </div>
          <div className="mt-3 w-full bg-[#f0f3ff] dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#006a61] h-full rounded-full"
              style={{
                width: `${properties.length > 0 ? Math.round((properties.filter((p) => p.status === 'Published').length / properties.length) * 100) : 0}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="relative bg-white dark:bg-[#171826] p-5 rounded-2xl border border-[#e2e8f8] dark:border-white/10 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#b52603]"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#555f6f] dark:text-gray-400 font-bold">
              Pending Approval
            </span>
            <span className="material-symbols-outlined text-[#b52603] text-[22px]">pending_actions</span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[#151c27] dark:text-white">
              {properties.filter((p) => p.status === 'Pending Approval').length}
            </span>
            <span className="text-[10px] text-[#b52603] bg-[#ffdad2] px-2 py-0.5 rounded-full font-bold">
              Needs Review
            </span>
          </div>
          <div className="mt-3 w-full bg-[#f0f3ff] dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#b52603] h-full rounded-full"
              style={{
                width: `${properties.length > 0 ? Math.round((properties.filter((p) => p.status === 'Pending Approval').length / properties.length) * 100) : 0}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="relative bg-white dark:bg-[#171826] p-5 rounded-2xl border border-[#e2e8f8] dark:border-white/10 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#555f6f] dark:text-gray-400 font-bold">
              Draft / Archived
            </span>
            <span className="material-symbols-outlined text-amber-600 text-[22px]">inventory_2</span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[#151c27] dark:text-white">
              {properties.filter((p) => p.status === 'Draft' || p.status === 'Archived').length}
            </span>
            <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-bold">
              Inactive
            </span>
          </div>
          <div className="mt-3 w-full bg-[#f0f3ff] dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full"
              style={{
                width: `${properties.length > 0 ? Math.round((properties.filter((p) => p.status === 'Draft' || p.status === 'Archived').length / properties.length) * 100) : 0}%`,
              }}
            ></div>
          </div>
        </div>
      </section>

      {/* Complex Filter Toolbar */}
      <section className="bg-white dark:bg-[#171826] border border-[#e2e8f8] dark:border-white/10 rounded-2xl shadow-sm p-4 mb-4 flex flex-col gap-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#555f6f] text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by property name, host, city, or ID..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#f0f3ff] dark:bg-white/5 border border-transparent dark:border-white/10 text-xs text-[#151c27] dark:text-white placeholder:text-[#555f6f] focus:outline-none focus:bg-white dark:focus:bg-[#12131e] focus:border-[#b52603] transition-colors"
            />
          </div>

          {/* Reset Action */}
          <div className="flex items-center gap-2 self-end lg:self-auto">
            <button
              onClick={() => {
                setSearchTerm('');
                setCityFilter('All');
                setStatusFilter('All');
              }}
              className="flex items-center gap-1 px-3 h-10 rounded-xl text-xs text-[#555f6f] dark:text-gray-400 hover:text-[#b52603] hover:bg-[#ffdad6]/30 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
          {/* City Filter Pills */}
          <div className="flex items-center gap-1 bg-[#f0f3ff] dark:bg-white/5 p-1 rounded-xl border border-[#e2e8f8]/60 dark:border-white/5">
            <span className="text-[10px] text-[#555f6f] dark:text-gray-400 pl-2 pr-1 font-bold uppercase">
              City:
            </span>
            {['All', 'Goa', 'Lonavala', 'Udaipur', 'Manali', 'Jaipur'].map((c) => (
              <button
                key={c}
                onClick={() => setCityFilter(c)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  cityFilter.toLowerCase() === c.toLowerCase()
                    ? 'bg-[#b52603] text-white font-bold'
                    : 'text-[#555f6f] dark:text-gray-400 hover:text-[#151c27] dark:hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Status Dropdown Filter */}
          <div className="flex items-center gap-1 bg-[#f0f3ff] dark:bg-white/5 p-1 rounded-xl border border-[#e2e8f8]/60 dark:border-white/5">
            <span className="text-[10px] text-[#555f6f] dark:text-gray-400 pl-2 pr-1 font-bold uppercase">
              Status:
            </span>
            {['All', 'Published', 'Pending Approval', 'Draft'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  statusFilter === s
                    ? 'bg-[#b52603] text-white font-bold'
                    : 'text-[#555f6f] dark:text-gray-400 hover:text-[#151c27] dark:hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Property Data Table Section */}
      <section className="bg-white dark:bg-[#171826] border border-[#e2e8f8] dark:border-white/10 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f0f3ff] dark:bg-white/5 text-[#555f6f] dark:text-gray-400 text-[11px] uppercase tracking-wider font-semibold h-11">
                <th className="px-4 py-3 font-semibold">Property</th>
                <th className="px-4 py-3 font-semibold">Host</th>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold text-right">Price / Night</th>
                <th className="px-4 py-3 font-semibold text-center">Rating</th>
                <th className="px-4 py-3 font-semibold text-center">Bookings (MTD)</th>
                <th className="px-4 py-3 font-semibold text-center">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f3ff] dark:divide-white/5 text-xs text-[#151c27] dark:text-white">
              {filteredProperties.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => {
                    setSelectedProperty(p);
                    setDrawerOpen(true);
                  }}
                  className={`hover:bg-[#f0f3ff]/50 dark:hover:bg-white/5 cursor-pointer transition-colors ${
                    p.status === 'Pending Approval' ? 'bg-amber-50/20 dark:bg-amber-950/10' : ''
                  }`}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3 min-w-[220px]">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-16 h-12 rounded-xl object-cover ring-1 ring-black/5 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-[#151c27] dark:text-white truncate block">
                          {p.name}
                        </span>
                        <span className="text-[11px] text-[#555f6f] dark:text-gray-400">
                          {p.category} • {p.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 font-medium">
                      <span>{p.hostName}</span>
                      {p.isSuperhost && (
                        <span className="text-[9px] bg-[#ffdad2] text-[#8c1900] px-1.5 py-0.5 rounded font-extrabold uppercase">
                          Superhost
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-[#555f6f] dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">
                        location_on
                      </span>
                      <span>
                        {p.city}, {p.state}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-right font-bold text-sm">
                    ₹{p.pricePerNight.toLocaleString('en-IN')}
                    <span className="block text-[10px] text-[#555f6f] dark:text-gray-400 font-normal">
                      per night
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-center">
                    {p.reviewsCount > 0 ? (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#f0f3ff] dark:bg-white/5 border border-[#e2e8f8]/60 dark:border-white/5">
                        <span className="material-symbols-outlined text-[14px] text-amber-500 fill-current">
                          star
                        </span>
                        <span className="font-bold">{p.rating}</span>
                        <span className="text-[10px] text-[#555f6f]">({p.reviewsCount})</span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-warm-100 dark:bg-white/5 text-[11px] font-semibold text-ink-600 dark:text-warm-300">
                        New
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3.5 text-center font-bold">{p.monthlyBookings}</td>

                  <td className="px-4 py-3.5 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'Published'
                          ? 'bg-[#ecfdf5] text-[#065f46]'
                          : p.status === 'Pending Approval'
                          ? 'bg-[#fffbeb] text-[#92400e]'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {p.status}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      {p.status === 'Pending Approval' && (
                        <button
                          onClick={() => {
                            setSelectedProperty(p);
                            setDrawerOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#b52603] text-white text-[10px] font-bold hover:bg-[#8c1900] shadow-sm transition-all"
                        >
                          Review
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedProperty(p);
                          setDrawerOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-[#555f6f] hover:text-[#151c27] hover:bg-[#f0f3ff] transition-colors"
                        title="View Property Specs"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-[#f0f3ff] dark:bg-white/5 border-t border-[#e2e8f8]/60 dark:border-white/5 flex items-center justify-between text-xs text-[#555f6f] dark:text-gray-400">
          <span>
            Showing <strong className="text-[#151c27] dark:text-white">{filteredProperties.length}</strong> of{' '}
            <strong className="text-[#151c27] dark:text-white">486</strong> listings
          </span>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-lg bg-[#b52603] text-white font-bold flex items-center justify-center">
              1
            </button>
          </div>
        </div>
      </section>

      {/* Slide-over Property Review Drawer */}
      {drawerOpen && selectedProperty && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
            onClick={() => setDrawerOpen(false)}
          ></div>
          <aside className="fixed top-0 right-0 h-full w-full max-w-xl bg-white dark:bg-[#171826] shadow-2xl flex flex-col justify-between overflow-y-auto no-scrollbar z-50 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="sticky top-0 bg-white/95 dark:bg-[#171826]/95 backdrop-blur-md px-6 py-4 z-10 flex items-center justify-between border-b border-[#e2e8f8] dark:border-white/10">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedProperty.status === 'Published'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {selectedProperty.status}
                </span>
                <span className="text-[11px] text-[#555f6f] dark:text-gray-400 font-semibold uppercase tracking-wider">
                  Verification Inspector
                </span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg text-[#555f6f] hover:text-[#151c27] hover:bg-[#f0f3ff] transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Drawer Body Content */}
            <div className="flex-1 px-6 py-4 flex flex-col gap-5 text-xs text-[#555f6f] dark:text-gray-400">
              {/* Hero Image */}
              <div className="relative h-60 w-full rounded-2xl overflow-hidden shadow-sm">
                <img
                  src={selectedProperty.image}
                  alt={selectedProperty.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-white/90 dark:bg-black/80 backdrop-blur-md text-[#151c27] dark:text-white font-bold text-xs">
                  ID: #{selectedProperty.id}
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md text-white text-[11px] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">photo_library</span>
                  <span>{selectedProperty.photosCount || 1} {(selectedProperty.photosCount || 1) === 1 ? 'Photo' : 'Photos'}</span>
                </div>
              </div>

              {/* Title & Location */}
              <div>
                <h2 className="text-xl font-extrabold text-[#151c27] dark:text-white">
                  {selectedProperty.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-0.5 text-[#151c27] dark:text-white font-semibold">
                    <span className="material-symbols-outlined text-[16px] text-[#b52603]">location_on</span>
                    {selectedProperty.city}, {selectedProperty.state}
                  </span>
                  <span>•</span>
                  <span>Submitted {selectedProperty.submittedTime}</span>
                </div>
              </div>

              {/* Host & Price Bento */}
              <div className="p-4 rounded-xl bg-[#f0f3ff] dark:bg-white/5 border border-[#e2e8f8]/60 dark:border-white/5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-[#151c27] dark:text-white">
                    <span>{selectedProperty.hostName}</span>
                    <span className="material-symbols-outlined text-[#006a61] text-[18px]">verified</span>
                  </div>
                  <p className="text-xs">
                    Verified Host • {selectedProperty.reviewsCount > 0 ? `${selectedProperty.rating}★ (${selectedProperty.reviewsCount} reviews)` : 'New Property (0 reviews)'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-[#b52603]">
                    ₹{selectedProperty.pricePerNight.toLocaleString('en-IN')}
                  </span>
                  <span className="block text-[10px]">base / night</span>
                </div>
              </div>

              {/* Specs Bento Grid */}
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold block mb-2">
                  Space & Capacity Specs
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <div className="p-3 rounded-xl bg-[#f0f3ff] dark:bg-white/5 text-center border border-[#e2e8f8]/60 dark:border-white/5">
                    <span className="material-symbols-outlined text-[20px] block mb-1">bed</span>
                    <span className="font-bold text-sm text-[#151c27] dark:text-white block">
                      {selectedProperty.bedrooms}
                    </span>
                    <span className="text-[10px]">Bedrooms</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f0f3ff] dark:bg-white/5 text-center border border-[#e2e8f8]/60 dark:border-white/5">
                    <span className="material-symbols-outlined text-[20px] block mb-1">bathtub</span>
                    <span className="font-bold text-sm text-[#151c27] dark:text-white block">
                      {selectedProperty.bathrooms}
                    </span>
                    <span className="text-[10px]">Bathrooms</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f0f3ff] dark:bg-white/5 text-center border border-[#e2e8f8]/60 dark:border-white/5">
                    <span className="material-symbols-outlined text-[20px] block mb-1">group</span>
                    <span className="font-bold text-sm text-[#151c27] dark:text-white block">
                      Max {selectedProperty.maxGuests}
                    </span>
                    <span className="text-[10px]">Guests</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f0f3ff] dark:bg-white/5 text-center border border-[#e2e8f8]/60 dark:border-white/5">
                    <span className="material-symbols-outlined text-[20px] block mb-1">hotel</span>
                    <span className="font-bold text-sm text-[#151c27] dark:text-white block">
                      {selectedProperty.beds}
                    </span>
                    <span className="text-[10px]">Total Beds</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Amenities */}
              {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold block mb-2">
                    Key Features & Amenities
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProperty.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-[#f0f3ff] dark:bg-white/5 border border-[#e2e8f8]/60 dark:border-white/10 text-[11px] font-medium text-slate-800 dark:text-slate-200"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Verification Audit Checklist */}
              <div className="p-4 rounded-xl bg-[#f0f3ff] dark:bg-white/5 border border-[#e2e8f8]/60 dark:border-white/5 flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-wider font-bold">
                  Verification Audit Checklist
                </span>
                <div className="flex items-center justify-between py-1 border-b border-[#e2e8f8]/60 dark:border-white/5">
                  <div className="flex items-center gap-2 text-[#151c27] dark:text-white">
                    <span className="material-symbols-outlined text-[#006a61] text-[18px]">task_alt</span>
                    <span>Government ID & Aadhaar Verified</span>
                  </div>
                  <span className="text-[#006a61] font-bold">Passed</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#e2e8f8]/60 dark:border-white/5">
                  <div className="flex items-center gap-2 text-[#151c27] dark:text-white">
                    <span className="material-symbols-outlined text-[#006a61] text-[18px]">task_alt</span>
                    <span>Property ownership registry deed</span>
                  </div>
                  <span className="text-[#006a61] font-bold">Verified</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2 text-[#151c27] dark:text-white">
                    <span className="material-symbols-outlined text-[#b52603] text-[18px]">schedule</span>
                    <span>Safety compliance on-site review</span>
                  </div>
                  <span className="text-[#b52603] font-bold">Under Review</span>
                </div>
              </div>
            </div>

            {/* Drawer Actions Sticky Footer */}
            <div className="sticky bottom-0 bg-white/95 dark:bg-[#171826]/95 backdrop-blur-md px-6 py-4 flex flex-col gap-2 border-t border-[#e2e8f8] dark:border-white/10">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleApproveProperty(selectedProperty.id)}
                  className="flex-1 h-11 rounded-xl bg-[#b52603] text-white text-xs font-bold shadow-md hover:bg-[#8c1900] transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Approve & Publish</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenRejectModal}
                  className="flex-1 h-11 rounded-xl bg-[#f0f3ff] dark:bg-white/5 hover:bg-[#ffdad6]/40 text-[#ba1a1a] text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-[#e2e8f8]/60 dark:border-white/5"
                >
                  <span className="material-symbols-outlined text-[18px]">cancel</span>
                  <span>Reject with Feedback</span>
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Rejection Feedback Dialog Modal */}
      {isRejectModalOpen && selectedProperty && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !isSubmittingReject && setIsRejectModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white dark:bg-[#171826] border border-rose-500/20 rounded-3xl shadow-2xl overflow-hidden z-10 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#e2e8f8] dark:border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">feedback</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#151c27] dark:text-white">
                    Reject & Send Feedback
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Host: <span className="font-semibold text-slate-900 dark:text-white">{selectedProperty.hostName}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                disabled={isSubmittingReject}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Feedback & Rejection Reason for Host
              </label>
              <textarea
                value={rejectFeedback}
                onChange={(e) => setRejectFeedback(e.target.value)}
                rows={4}
                placeholder="Explain clearly to the host why the listing cannot be published and what needs to be improved..."
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none leading-relaxed"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                This message will immediately appear in <strong>{selectedProperty.hostName}'s</strong> notifications inbox and the property will be set to Draft.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                disabled={isSubmittingReject}
                className="px-4 py-2 rounded-full border border-slate-300 dark:border-white/15 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={isSubmittingReject || !rejectFeedback.trim()}
                className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md disabled:opacity-50 transition-all flex items-center gap-1.5"
              >
                {isSubmittingReject ? (
                  <span>Sending Feedback...</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">send</span>
                    <span>Confirm & Send Notification</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProperties;
