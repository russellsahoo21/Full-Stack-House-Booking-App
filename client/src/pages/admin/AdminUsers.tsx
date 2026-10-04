import React, { useState, useEffect } from 'react';
import { adminApi } from '@/services/api';
import { UserAvatar } from '@/components/common/UserAvatar';

interface UserDirectoryItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'Guest' | 'Host' | 'Admin';
  isSuperhost?: boolean;
  staysCount: number;
  listingsCount: number;
  lifetimeVolume: number;
  joinedDate: string;
  status: 'Active' | 'Under Review' | 'Suspended';
}

const INITIAL_USERS: UserDirectoryItem[] = [
  {
    id: 'USR-8901',
    name: 'Priya Sharma',
    email: 'priya.sharma@traveler.in',
    phone: '+91 98112 30491',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    role: 'Host',
    isSuperhost: true,
    staysCount: 12,
    listingsCount: 4,
    lifetimeVolume: 1842000,
    joinedDate: 'Jan 14, 2024',
    status: 'Active',
  },
  {
    id: 'USR-8902',
    name: 'Aarav Mehta',
    email: 'aarav.m@gmail.com',
    phone: '+91 98201 44521',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    role: 'Guest',
    staysCount: 18,
    listingsCount: 0,
    lifetimeVolume: 482400,
    joinedDate: 'Mar 08, 2023',
    status: 'Active',
  },
  {
    id: 'USR-8903',
    name: 'Devendra Negi',
    email: 'd.negi@himalayanchalets.in',
    phone: '+91 94180 33921',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    role: 'Host',
    staysCount: 4,
    listingsCount: 2,
    lifetimeVolume: 620000,
    joinedDate: 'Nov 19, 2024',
    status: 'Under Review',
  },
];

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserDirectoryItem[]>(INITIAL_USERS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Guest' | 'Host' | 'Admin'>('All');
  const [activeModalUser, setActiveModalUser] = useState<UserDirectoryItem | null>(null);
  const [selectedRole, setSelectedRole] = useState<'Guest' | 'Host' | 'Admin'>('Guest');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.getUsers();
      if (res?.success && res.data && res.data.length > 0) {
        const mappedUsers: UserDirectoryItem[] = res.data.map((u: any) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          phone: u.phone || '+91 98000 00000',
          avatar: u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          role: u.role === 'admin' ? 'Admin' : u.role === 'host' ? 'Host' : 'Guest',
          isSuperhost: u.isSuperhost || false,
          staysCount: u.staysCount || 0,
          listingsCount: u.listingsCount || 0,
          lifetimeVolume: u.lifetimeVolume || 0,
          joinedDate: u.createdAt
            ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
            : 'Recently',
          status: u.status || 'Active',
        }));
        setUsers(mappedUsers);
        if (res.stats) {
          setStats(res.stats);
        }
      }
    } catch (err: any) {
      console.warn('Could not load users from backend API:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleUpdateRole = async () => {
    if (!activeModalUser) return;
    const targetRole = selectedRole === 'Admin' ? 'admin' : selectedRole === 'Host' ? 'host' : 'user';
    try {
      await adminApi.updateUserRole(activeModalUser.id, targetRole);
      setUsers((prev) =>
        prev.map((item) => (item.id === activeModalUser.id ? { ...item, role: selectedRole } : item))
      );
      showToast(`Updated permissions for ${activeModalUser.name} to ${selectedRole}`);
    } catch (err: any) {
      showToast(`Error: ${err?.message || 'Could not update role'}`);
    }
    setActiveModalUser(null);
  };

  const handleToggleSuspend = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const targetUser = users.find((u) => u.id === id);
    if (!targetUser) return;
    const newStatus = targetUser.status === 'Suspended' ? 'Active' : 'Suspended';
    try {
      await adminApi.updateUserStatus(id, newStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
      );
      showToast(`Account status set to ${newStatus} for ${targetUser.name}`);
    } catch (err: any) {
      showToast(`Error: ${err?.message || 'Could not update status'}`);
    }
  };

  const handleDeleteUser = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to permanently delete user "${name}"?`)) return;
    try {
      await adminApi.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      showToast(`User ${name} removed successfully.`);
    } catch (err: any) {
      showToast(`Error: ${err?.message || 'Could not delete user'}`);
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

      {/* Top Utility Sub-Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#b52603] font-bold mb-1">
            <span>Identity & Privileges</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span className="text-[#555f6f] dark:text-gray-400">Central Directory</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#151c27] dark:text-white tracking-tight">
            Users & Hosts Directory
          </h1>
          <p className="text-sm text-[#555f6f] dark:text-gray-400 mt-0.5">
            Manage registered guests, verified property hosts, and administrative access privileges.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => showToast('Exporting User Directory (.CSV)')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#171826] border border-[#e2e8f8] dark:border-white/10 text-xs font-semibold text-[#151c27] dark:text-white hover:bg-[#f0f3ff] transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px] text-[#555f6f]">download</span>
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => showToast('KYC Queue: 14 pending verifications')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#d6e0f3] text-[#121c2a] text-xs font-bold hover:bg-[#bdc7d9] transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px] text-[#006a61]">verified_user</span>
            <span>KYC Queue (14)</span>
          </button>
        </div>
      </div>

      {/* Key Metric Summary Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="relative overflow-hidden bg-white dark:bg-[#171826] border border-[#e2e8f8] dark:border-white/10 rounded-2xl p-5 shadow-sm">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#ff5a36]"></div>
          <div className="flex items-center justify-between text-[#555f6f] dark:text-gray-400 mb-2">
            <span className="text-[11px] uppercase tracking-wider font-bold">Total Users</span>
            <span className="material-symbols-outlined text-[#ff5a36] text-[20px]">groups</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#151c27] dark:text-white">
              {stats?.totalUsers || users.length}
            </span>
            <span className="text-emerald-700 dark:text-emerald-400 text-xs font-bold">+14.6%</span>
          </div>
          <p className="text-xs text-[#555f6f] dark:text-gray-400 mt-1">Platform community count</p>
        </div>

        <div className="relative overflow-hidden bg-white dark:bg-[#171826] border border-[#e2e8f8] dark:border-white/10 rounded-2xl p-5 shadow-sm">
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-400"></div>
          <div className="flex items-center justify-between text-[#555f6f] dark:text-gray-400 mb-2">
            <span className="text-[11px] uppercase tracking-wider font-bold">Active Guests</span>
            <span className="material-symbols-outlined text-[#555f6f] text-[20px]">flight_takeoff</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#151c27] dark:text-white">
              {stats?.guestsCount ?? users.filter((u) => u.role === 'Guest').length}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#f0f3ff] text-[10px] text-[#006a61] font-bold">
              Verified
            </span>
          </div>
          <p className="text-xs text-[#555f6f] dark:text-gray-400 mt-1">Travelers & Explorers</p>
        </div>

        <div className="relative overflow-hidden bg-white dark:bg-[#171826] border border-[#e2e8f8] dark:border-white/10 rounded-2xl p-5 shadow-sm">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#006a61]"></div>
          <div className="flex items-center justify-between text-[#555f6f] dark:text-gray-400 mb-2">
            <span className="text-[11px] uppercase tracking-wider font-bold">Listed Hosts</span>
            <span className="material-symbols-outlined text-[#006a61] text-[20px]">villa</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#151c27] dark:text-white">
              {stats?.hostsCount ?? users.filter((u) => u.role === 'Host').length}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#ffdad2] text-[#8c1900] text-[10px] font-bold">
              Property Owners
            </span>
          </div>
          <p className="text-xs text-[#555f6f] dark:text-gray-400 mt-1">Villas, Havelis & Estates</p>
        </div>

        <div className="relative overflow-hidden bg-white dark:bg-[#171826] border border-[#e2e8f8] dark:border-white/10 rounded-2xl p-5 shadow-sm">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-500"></div>
          <div className="flex items-center justify-between text-[#555f6f] dark:text-gray-400 mb-2">
            <span className="text-[11px] uppercase tracking-wider font-bold">Admin Team</span>
            <span className="material-symbols-outlined text-[#555f6f] text-[20px]">admin_panel_settings</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#151c27] dark:text-white">
              {stats?.adminsCount ?? users.filter((u) => u.role === 'Admin').length}
            </span>
            <span className="text-xs text-[#555f6f]">Active Seats</span>
          </div>
          <p className="text-xs text-[#555f6f] dark:text-gray-400 mt-1">Strict role-based access</p>
        </div>
      </div>

      {/* Search & Modular Filter */}
      <div className="bg-white dark:bg-[#171826] border border-[#e2e8f8] dark:border-white/10 rounded-2xl p-4 shadow-sm mb-4">
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
              placeholder="Search users by name, email, or phone..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#f0f3ff] dark:bg-white/5 border border-transparent dark:border-white/10 text-xs text-[#151c27] dark:text-white placeholder:text-[#555f6f] focus:outline-none focus:bg-white dark:focus:bg-[#12131e] focus:border-[#b52603]"
            />
          </div>

          {/* Role Filter Pills */}
          <div className="flex items-center gap-1 bg-[#f0f3ff] dark:bg-white/5 p-1 rounded-xl border border-[#e2e8f8]/60 dark:border-white/5 text-xs">
            {(['All', 'Guest', 'Host', 'Admin'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  roleFilter === r
                    ? 'bg-[#b52603] text-white font-bold'
                    : 'text-[#555f6f] dark:text-gray-400 hover:text-[#151c27] dark:hover:text-white'
                }`}
              >
                {r === 'All' ? 'All Roles' : `${r}s`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Data Ledger Canvas */}
      <div className="bg-white dark:bg-[#171826] border border-[#e2e8f8] dark:border-white/10 rounded-2xl shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f0f3ff] dark:bg-white/5 text-[#555f6f] dark:text-gray-400 text-[11px] uppercase tracking-wider font-semibold h-11">
                <th className="px-4 font-semibold">User Profile</th>
                <th className="px-4 font-semibold">Contact</th>
                <th className="px-4 font-semibold">Role & Badge</th>
                <th className="px-4 font-semibold text-center">Activity</th>
                <th className="px-4 font-semibold text-right">Lifetime Volume</th>
                <th className="px-4 font-semibold">Joined Date</th>
                <th className="px-4 font-semibold">Status</th>
                <th className="px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f3ff] dark:divide-white/5 text-xs text-[#151c27] dark:text-white">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#f0f3ff]/50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={u.name} size="md" className="flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 font-bold">
                          <span className="truncate">{u.name}</span>
                          <span className="material-symbols-outlined text-[#006a61] text-[16px]">
                            verified
                          </span>
                        </div>
                        <span className="text-[11px] text-[#555f6f] dark:text-gray-400 truncate block">
                          {u.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-[#555f6f] dark:text-gray-400">{u.phone}</td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#f0f3ff] dark:bg-white/5 border border-[#e2e8f8]/60 dark:border-white/5 font-bold text-[10px]">
                        {u.role}
                      </span>
                      {u.isSuperhost && (
                        <span className="px-2 py-0.5 rounded-full bg-[#ffdad2] text-[#8c1900] text-[9px] font-extrabold tracking-wide uppercase flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[12px]">star</span>
                          Superhost
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-center">
                    <span className="font-semibold block">{u.staysCount} stays</span>
                    <span className="text-[10px] text-[#555f6f]">{u.listingsCount} listings</span>
                  </td>

                  <td className="px-4 py-3.5 text-right font-bold">
                    ₹{u.lifetimeVolume.toLocaleString('en-IN')}
                  </td>

                  <td className="px-4 py-3.5 text-[#555f6f] dark:text-gray-400">{u.joinedDate}</td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : u.status === 'Under Review'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {u.status}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setActiveModalUser(u);
                          setSelectedRole(u.role);
                        }}
                        className="p-1.5 rounded-lg text-[#555f6f] hover:text-[#b52603] hover:bg-[#f0f3ff] transition-colors"
                        title="Edit Role / Privileges"
                      >
                        <span className="material-symbols-outlined text-[18px]">badge</span>
                      </button>
                      <button
                        onClick={(e) => handleToggleSuspend(u.id, e)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          u.status === 'Suspended'
                            ? 'text-emerald-600 hover:bg-emerald-50'
                            : 'text-[#ba1a1a] hover:bg-[#ffdad6]/40'
                        }`}
                        title={u.status === 'Suspended' ? 'Unsuspend Account' : 'Suspend Account'}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {u.status === 'Suspended' ? 'lock_open' : 'block'}
                        </span>
                      </button>
                      <button
                        onClick={(e) => handleDeleteUser(u.id, u.name, e)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                        title="Delete User Account"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role / Privileges Modal */}
      {activeModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#171826] shadow-2xl p-6 flex flex-col gap-4 border border-[#e2e8f8] dark:border-white/10 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-[#151c27] dark:text-white">
                  Modify Access Role
                </h3>
                <p className="text-xs text-[#555f6f] dark:text-gray-400">
                  {activeModalUser.name} ({activeModalUser.email})
                </p>
              </div>
              <button
                onClick={() => setActiveModalUser(null)}
                className="p-1 rounded-lg text-[#555f6f] hover:text-[#151c27]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-[#555f6f]">Assign Role Level</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Guest', 'Host', 'Admin'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRole(r)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      selectedRole === r
                        ? 'bg-[#b52603] text-white border-[#b52603]'
                        : 'bg-[#f0f3ff] dark:bg-white/5 border-transparent text-[#151c27] dark:text-white hover:border-gray-300'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300 text-xs">
              <strong>Caution:</strong> Elevating to Admin grants access to all platform transactions,
              refund authorizations, and inventory audit controls.
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-2">
              <button
                onClick={() => setActiveModalUser(null)}
                className="h-10 px-4 rounded-xl bg-[#f0f3ff] dark:bg-white/5 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRole}
                className="h-10 px-4 rounded-xl bg-[#b52603] text-white text-xs font-bold shadow-md hover:bg-[#8c1900]"
              >
                Save Role Updates
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
