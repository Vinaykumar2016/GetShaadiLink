import { useState, useEffect } from "react";
import { playClickSound } from "../utils/soundUtils";
import { LayoutDashboard, Mail, FileText, LogOut, Trash2, CheckCircle, Clock, Eye, ShieldAlert, ArrowLeft, Search, Star, MessageSquare } from "lucide-react";

const formatCreatedDate = (isoStr: string) => {
  if (!isoStr) return "-";
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr.split("T")[0] || "-";
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return "-";
  }
};

interface AdminDashboardProps {
  onClose: () => void;
}

export default function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("gst_admin_token"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "invitations" | "queries" | "reviews">("dashboard");

  // Data states
  const [stats, setStats] = useState({ totalInvitations: 0, totalViews: 0, totalQueries: 0, totalReviews: 0, pendingReviews: 0 });
  const [invitations, setInvitations] = useState<any[]>([]);
  const [queries, setQueries] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuery, setSelectedQuery] = useState<any | null>(null);

  // Fetch admin stats & tables
  const fetchAllData = async (authToken: string) => {
    try {
      // Fetch Stats
      const statsRes = await fetch("/api/admin/stats", {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
      }

      // Fetch Invitations
      const invRes = await fetch("/api/admin/invitations", {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      if (invRes.ok) {
        const data = await invRes.json();
        setInvitations(data.invitations || []);
      }

      // Fetch Support Queries
      const qRes = await fetch("/api/admin/queries", {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      if (qRes.ok) {
        const data = await qRes.json();
        setQueries(data.queries || []);
      }

      // Fetch Reviews
      const rRes = await fetch("/api/admin/reviews", {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      if (rRes.ok) {
        const data = await rRes.json();
        const allReviews = data.reviews || [];
        setReviews(allReviews);
        setStats(prev => ({
          ...prev,
          totalReviews: allReviews.length,
          pendingReviews: allReviews.filter((r: any) => r.status === "pending").length,
        }));
      }
    } catch (err) {
      console.error("Failed to load admin dashboard data:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllData(token);
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem("gst_admin_token", data.token);
        setToken(data.token);
      } else {
        setError(data.error || "Invalid username or password");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    playClickSound();
    localStorage.removeItem("gst_admin_token");
    setToken(null);
  };

  const handleDeleteInvitation = async (slug: string) => {
    if (!confirm(`Are you sure you want to permanently delete invitation: /${slug}? This action cannot be undone.`)) {
      return;
    }
    playClickSound();
    try {
      const res = await fetch(`/api/admin/invitations/${slug}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setInvitations(prev => prev.filter(inv => inv.slug !== slug));
        // Refresh stats
        if (token) fetchAllData(token);
      } else {
        alert("Failed to delete invitation.");
      }
    } catch (err) {
      alert("Error occurred while deleting.");
    }
  };

  const handleTogglePaymentStatus = async (slug: string, currentPaymentId: string | null) => {
    playClickSound();
    const newPaymentId = currentPaymentId ? null : `pay_admin_unlock_${Date.now()}`;
    const actionText = currentPaymentId ? "mark this invitation as UNPAID?" : "mark this invitation as PAID (unlocked)?";
    if (!confirm(`Are you sure you want to ${actionText}`)) return;

    try {
      const res = await fetch(`/api/admin/invitations/${slug}/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ razorpayPaymentId: newPaymentId })
      });
      if (res.ok) {
        const result = await res.json();
        setInvitations(prev => prev.map(inv => inv.slug === slug ? { ...inv, razorpayPaymentId: result.razorpayPaymentId } : inv));
      } else {
        alert("Failed to update payment status on the server.");
      }
    } catch (err) {
      console.error("Failed to update payment status:", err);
      alert("Error occurred while updating payment status.");
    }
  };

  const handleToggleQueryStatus = async (id: string, currentStatus: string) => {
    playClickSound();
    const newStatus = currentStatus === "resolved" ? "pending" : "resolved";
    try {
      const res = await fetch(`/api/admin/queries/${id}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setQueries(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q));
        if (selectedQuery && selectedQuery.id === id) {
          setSelectedQuery(prev => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (err) {
      console.error("Failed to update query status:", err);
    }
  };

  const handleDeleteQuery = async (id: string) => {
    if (!confirm("Are you sure you want to delete this support query?")) return;
    playClickSound();
    try {
      const res = await fetch(`/api/admin/queries/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setQueries(prev => prev.filter(q => q.id !== id));
        setSelectedQuery(null);
        if (token) fetchAllData(token);
      }
    } catch (err) {
      console.error("Failed to delete support query:", err);
    }
  };

  // Filter invitations based on search
  const filteredInvitations = invitations.filter(inv => {
    const s = searchQuery.toLowerCase();
    return (
      inv.slug.toLowerCase().includes(s) ||
      inv.bride.toLowerCase().includes(s) ||
      inv.groom.toLowerCase().includes(s) ||
      inv.ownerEmail.toLowerCase().includes(s)
    );
  });

  // Render Login Panel
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#060414] via-[#100D26] to-[#181236] text-[#F3EFE0] flex flex-col justify-center items-center p-4">
        <button
          onClick={onClose}
          className="absolute top-6 left-6 flex items-center gap-2 text-stone-400 hover:text-white transition-colors cursor-pointer text-xs font-semibold uppercase tracking-wider font-marcellus active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="w-full max-w-md bg-[#0F0B26]/80 border border-white/10 rounded-[32px] p-8 backdrop-blur-md shadow-2xl relative">
          <div className="absolute inset-x-0 -top-10 flex justify-center">
            <div className="w-20 h-20 bg-amber-500/10 border border-amber-400/20 rounded-full flex items-center justify-center text-amber-400 text-3xl shadow-lg shadow-amber-500/5">
              🛡️
            </div>
          </div>

          <div className="text-center mt-8 mb-6">
            <h2 className="font-marcellus text-2xl font-bold tracking-widest text-amber-400 uppercase">Admin Portal</h2>
            <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">GetShaadiLink Control Center</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-400 text-xs text-center">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Admin Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-amber-400/40 text-xs transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Admin Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-amber-400/40 text-xs font-mono transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-widest shadow-md cursor-pointer disabled:opacity-50 active:scale-95 transition-all font-marcellus mt-2"
            >
              {loading ? "Authenticating..." : "🛡️ Enter Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render Dashboard Layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060414] via-[#0D0A23] to-[#120D2F] text-[#F3EFE0] font-sans flex flex-col md:flex-row relative">
      
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-[#080518]/90 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-between p-6 shrink-0 z-20">
        <div>
          <div className="flex items-center gap-2 mb-8 border-b border-white/5 pb-4">
            <span className="text-2xl">✨</span>
            <div>
              <h1 className="font-marcellus text-sm font-bold tracking-widest text-amber-400 uppercase">ShaadiLink Admin</h1>
              <p className="text-[9px] text-stone-500 uppercase tracking-widest">System Manager</p>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => { playClickSound(); setActiveTab("dashboard"); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-amber-500/10 text-amber-400 border-l-2 border-amber-400 pl-3"
                  : "text-stone-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </button>
            <button
              onClick={() => { playClickSound(); setActiveTab("invitations"); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "invitations"
                  ? "bg-amber-500/10 text-amber-400 border-l-2 border-amber-400 pl-3"
                  : "text-stone-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <FileText className="w-4 h-4" /> Invitations
            </button>
            <button
              onClick={() => { playClickSound(); setActiveTab("queries"); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "queries"
                  ? "bg-amber-500/10 text-amber-400 border-l-2 border-amber-400 pl-3"
                  : "text-stone-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Mail className="w-4 h-4" /> Support Queries
            </button>
            <button
              onClick={() => { playClickSound(); setActiveTab("reviews"); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "reviews"
                  ? "bg-amber-500/10 text-amber-400 border-l-2 border-amber-400 pl-3"
                  : "text-stone-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Star className="w-4 h-4" /> Reviews
              {stats.pendingReviews > 0 && (
                <span className="ml-auto text-[9px] font-bold bg-amber-500 text-stone-950 px-1.5 py-0.5 rounded-full">
                  {stats.pendingReviews}
                </span>
              )}
            </button>
          </nav>
        </div>

        <div className="mt-8 border-t border-white/5 pt-4 space-y-2">
          <button
            onClick={onClose}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-stone-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Exit Portal
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all cursor-pointer font-bold"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Body */}
      <main className="flex-1 p-6 md:p-10 max-h-screen overflow-y-auto z-10">
        
        {/* TAB 1: DASHBOARD VIEW */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-marcellus text-2xl font-bold tracking-wider text-amber-400">👋 Welcome back, Admin</h2>
              <p className="text-xs text-stone-400 mt-1">Here is a quick look at the platform analytics and recent metrics.</p>
            </div>

            {/* Stats Overview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Stat card 1 */}
              <div className="bg-[#120E2F]/65 border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-lg">
                <div className="absolute top-4 right-4 text-3xl opacity-20 select-none">💍</div>
                <h3 className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold">Total Invitations</h3>
                <p className="text-4xl font-bold mt-2 font-marcellus text-white">{stats.totalInvitations}</p>
                <div className="w-full h-1 bg-amber-500/20 absolute bottom-0 inset-x-0">
                  <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, stats.totalInvitations * 5)}%` }} />
                </div>
              </div>

              {/* Stat card 2 */}
              <div className="bg-[#120E2F]/65 border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-lg">
                <div className="absolute top-4 right-4 text-3xl opacity-20 select-none">👁️</div>
                <h3 className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold">Total Visitor Views</h3>
                <p className="text-4xl font-bold mt-2 font-marcellus text-white">{stats.totalViews}</p>
                <div className="w-full h-1 bg-emerald-500/20 absolute bottom-0 inset-x-0">
                  <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, stats.totalViews * 0.1)}%` }} />
                </div>
              </div>

              {/* Stat card 3 */}
              <div className="bg-[#120E2F]/65 border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-lg">
                <div className="absolute top-4 right-4 text-3xl opacity-20 select-none">✉️</div>
                <h3 className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold">Support Queries</h3>
                <p className="text-4xl font-bold mt-2 font-marcellus text-white">{stats.totalQueries}</p>
                <div className="w-full h-1 bg-sky-500/20 absolute bottom-0 inset-x-0">
                  <div className="h-full bg-sky-500" style={{ width: `${Math.min(100, stats.totalQueries * 10)}%` }} />
                </div>
              </div>

              {/* Stat card 4 - Reviews */}
              <div className="bg-[#120E2F]/65 border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-lg sm:col-span-3 lg:col-span-1">
                <div className="absolute top-4 right-4 text-3xl opacity-20 select-none">⭐</div>
                <h3 className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold">Reviews</h3>
                <p className="text-4xl font-bold mt-2 font-marcellus text-white">{stats.totalReviews}</p>
                {stats.pendingReviews > 0 && (
                  <p className="text-[10px] text-amber-400 font-bold mt-1">{stats.pendingReviews} pending approval</p>
                )}
                <div className="w-full h-1 bg-amber-500/20 absolute bottom-0 inset-x-0">
                  <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, stats.totalReviews * 10)}%` }} />
                </div>
              </div>

            </div>

            {/* Quick Actions / Recent status panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              
              {/* Quick links to view recent site */}
              <div className="bg-[#120E2F]/50 border border-white/5 rounded-2xl p-6 shadow-md">
                <h3 className="font-marcellus text-sm font-semibold tracking-wider text-amber-400 mb-4 uppercase">Popular Invitations</h3>
                
                {invitations.length === 0 ? (
                  <p className="text-xs text-stone-500 text-center py-4">No invitations created yet.</p>
                ) : (
                  <div className="space-y-3">
                    {invitations.slice(0, 4).map((inv) => (
                      <div key={inv.slug} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                        <div>
                          <p className="text-xs font-bold text-white">{inv.bride} & {inv.groom}</p>
                          <p className="text-[10px] text-stone-400 font-mono mt-0.5">/{inv.slug}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-stone-400 font-bold bg-white/5 px-2 py-0.5 rounded-md">👁️ {inv.views} views</span>
                          <a
                            href={`/${inv.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent queries panel */}
              <div className="bg-[#120E2F]/50 border border-white/5 rounded-2xl p-6 shadow-md">
                <h3 className="font-marcellus text-sm font-semibold tracking-wider text-amber-400 mb-4 uppercase">Recent Queries</h3>
                
                {queries.length === 0 ? (
                  <p className="text-xs text-stone-500 text-center py-4">No recent queries.</p>
                ) : (
                  <div className="space-y-3">
                    {queries.slice(0, 4).map((q) => (
                      <div
                        key={q.id}
                        onClick={() => { playClickSound(); setSelectedQuery(q); setActiveTab("queries"); }}
                        className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center cursor-pointer hover:bg-white/10 transition-colors"
                      >
                        <div className="truncate pr-4">
                          <p className="text-xs font-bold text-white truncate">{q.subject}</p>
                          <p className="text-[9px] text-stone-400 mt-0.5">From: {q.name} ({q.email})</p>
                        </div>
                        <div>
                          {q.status === "resolved" ? (
                            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Resolved</span>
                          ) : (
                            <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">Pending</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: INVITATIONS MANAGER VIEW */}
        {activeTab === "invitations" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="font-marcellus text-2xl font-bold tracking-wider text-amber-400">💍 Invitation Cards</h2>
                <p className="text-xs text-stone-400 mt-1">Review and delete active invitation sites hosted on the platform.</p>
              </div>

              {/* Search bar */}
              <div className="w-full sm:w-80 relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by slug, name, email..."
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-amber-400/40 text-xs text-white"
                />
              </div>
            </div>

            {/* Invitations Table */}
            <div className="bg-[#120E2F]/65 border border-white/5 rounded-2xl shadow-lg overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5 text-stone-300 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Couple</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4">Created At</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Wedding Date</th>
                    <th className="p-4">Owner Email</th>
                    <th className="p-4 text-center">Views</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-stone-300">
                  {filteredInvitations.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-stone-500 font-medium">No invitations match your search parameters.</td>
                    </tr>
                  ) : (
                    filteredInvitations.map((inv) => (
                      <tr key={inv.slug} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <span className="font-bold text-white">{inv.bride} & {inv.groom}</span>
                          <span className="block text-[10px] text-stone-500">{inv.city}</span>
                        </td>
                        <td className="p-4 font-mono text-amber-400 font-semibold">/{inv.slug}</td>
                        <td className="p-4 text-stone-400">{formatCreatedDate(inv.createdDate)}</td>
                        <td className="p-4">
                          <button
                            onClick={() => handleTogglePaymentStatus(inv.slug, inv.razorpayPaymentId)}
                            className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-wide uppercase transition-all cursor-pointer border ${
                              inv.razorpayPaymentId 
                                ? "bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400 border-emerald-500/20" 
                                : "bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 border-rose-500/20"
                            }`}
                          >
                            {inv.razorpayPaymentId ? "Paid" : "Unpaid"}
                          </button>
                        </td>
                        <td className="p-4">{inv.wdate}</td>
                        <td className="p-4 text-stone-400 truncate max-w-[150px]" title={inv.ownerEmail}>
                          <span className="block">{inv.ownerEmail || "-"}</span>
                          {inv.editPassword && (
                            <span className="block text-[9px] text-amber-500/80 font-mono mt-0.5">🔑 {inv.editPassword}</span>
                          )}
                        </td>
                        <td className="p-4 text-center font-bold text-white">{inv.views}</td>
                        <td className="p-4 text-right space-x-2">
                          <a
                            href={`/${inv.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleDeleteInvitation(inv.slug)}
                            className="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer inline-flex items-center justify-center"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SUPPORT QUERIES MANAGER */}
        {activeTab === "queries" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-marcellus text-2xl font-bold tracking-wider text-amber-400">✉️ Support Queries</h2>
              <p className="text-xs text-stone-400 mt-1">Review contact inquiries submitted by users of the platform.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Queries List */}
              <div className="bg-[#120E2F]/65 border border-white/5 rounded-2xl shadow-lg p-4 lg:col-span-2 space-y-3 max-h-[70vh] overflow-y-auto">
                <h3 className="font-marcellus text-xs font-bold tracking-widest text-stone-400 uppercase mb-2">Message Inbox</h3>
                {queries.length === 0 ? (
                  <p className="text-xs text-stone-500 text-center py-8">No queries received.</p>
                ) : (
                  <div className="space-y-2">
                    {queries.map((q) => (
                      <div
                        key={q.id}
                        onClick={() => { playClickSound(); setSelectedQuery(q); }}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-start ${
                          selectedQuery && selectedQuery.id === q.id
                            ? "bg-amber-500/10 border-amber-500/30 shadow-md"
                            : "bg-white/5 border-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-white">{q.subject}</p>
                          <p className="text-[10px] text-stone-400">From: {q.name} ({q.email})</p>
                          <p className="text-[9px] text-stone-500">{new Date(q.date).toLocaleString()}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {q.status === "resolved" ? (
                            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                              <CheckCircle className="w-2.5 h-2.5" /> Resolved
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" /> Pending
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Query Details Side View */}
              <div className="bg-[#120E2F]/65 border border-white/5 rounded-2xl shadow-lg p-6 min-h-[400px]">
                {selectedQuery ? (
                  <div className="space-y-6">
                    <div className="border-b border-white/5 pb-4">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-marcellus text-lg font-bold text-amber-400">{selectedQuery.subject}</h3>
                        <button
                          onClick={() => handleDeleteQuery(selectedQuery.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                          title="Delete Query"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[10px] text-stone-400 mt-2 font-bold">Query ID: <span className="font-mono text-stone-300">{selectedQuery.id}</span></p>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-[9px] text-stone-500 uppercase tracking-widest font-bold block">Sender Name</span>
                        <span className="text-white font-semibold">{selectedQuery.name}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-stone-500 uppercase tracking-widest font-bold block">Sender Email</span>
                        <a href={`mailto:${selectedQuery.email}`} className="text-amber-400 font-semibold hover:underline block">{selectedQuery.email}</a>
                      </div>
                      <div>
                        <span className="text-[9px] text-stone-500 uppercase tracking-widest font-bold block">Date Received</span>
                        <span className="text-stone-300 font-mono">{new Date(selectedQuery.date).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-stone-500 uppercase tracking-widest font-bold block">Message Query</span>
                        <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-stone-300 whitespace-pre-wrap leading-relaxed">
                          {selectedQuery.message}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-4 flex gap-3">
                      <button
                        onClick={() => handleToggleQueryStatus(selectedQuery.id, selectedQuery.status)}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                          selectedQuery.status === "resolved"
                            ? "bg-stone-500/15 border border-stone-500/30 text-stone-400 hover:bg-stone-500/25"
                            : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25"
                        }`}
                      >
                        {selectedQuery.status === "resolved" ? (
                          <>🕒 Mark as Pending</>
                        ) : (
                          <>✓ Mark as Resolved</>
                        )}
                      </button>
                      <a
                        href={`mailto:${selectedQuery.email}?subject=Re: ${selectedQuery.subject}`}
                        className="py-2 px-4 rounded-lg bg-amber-500 text-stone-950 text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition-colors text-center inline-flex items-center justify-center"
                      >
                        ✉️ Reply
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-stone-500 space-y-2">
                    <ShieldAlert className="w-10 h-10 text-stone-600 animate-pulse" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-400">No message selected</p>
                      <p className="text-[10px] text-stone-500 max-w-xs mt-1">Select a query from the message inbox to view message contents and reply.</p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: REVIEWS MANAGER */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-marcellus text-2xl font-bold tracking-wider text-amber-400">⭐ Customer Reviews</h2>
              <p className="text-xs text-stone-400 mt-1">Approve or reject reviews submitted by couples. Only approved reviews show on the landing page.</p>
            </div>

            {/* Review summary pills */}
            <div className="flex gap-3 flex-wrap">
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                ✓ {reviews.filter(r => r.status === "approved").length} Approved
              </span>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
                ⏳ {reviews.filter(r => r.status === "pending").length} Pending
              </span>
              <span className="text-[10px] font-bold text-stone-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                Total: {reviews.length}
              </span>
            </div>

            {reviews.length === 0 ? (
              <div className="bg-[#120E2F]/65 border border-white/5 rounded-2xl p-10 text-center">
                <MessageSquare className="w-10 h-10 text-stone-600 mx-auto mb-3" />
                <p className="text-xs text-stone-500">No reviews submitted yet. Share your site to get your first review!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className={`bg-[#120E2F]/65 border rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-start justify-between shadow-md ${
                      review.status === "approved" ? "border-emerald-500/20" : "border-amber-500/20"
                    }`}
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                          review.status === "approved"
                            ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                            : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                        }`}>
                          {review.status === "approved" ? "✓ Approved" : "⏳ Pending"}
                        </span>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${ i < review.stars ? "fill-amber-400 text-amber-400" : "text-stone-600" }`} />
                          ))}
                        </div>
                        <span className="text-[10px] text-stone-500 font-mono">{new Date(review.submittedAt).toLocaleDateString("en-IN")}</span>
                      </div>
                      <p className="text-xs text-stone-300 leading-relaxed font-cormorant italic">"{review.text}"</p>
                      <div>
                        <p className="text-xs font-bold text-white font-marcellus">{review.name}</p>
                        {review.location && <p className="text-[10px] text-stone-500 font-marcellus mt-0.5">{review.location}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={async () => {
                          playClickSound();
                          const res = await fetch(`/api/admin/reviews/${review.id}/approve`, {
                            method: "POST",
                            headers: { "Authorization": `Bearer ${token}` },
                          });
                          if (res.ok) { if (token) fetchAllData(token); }
                        }}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                          review.status === "approved"
                            ? "bg-stone-500/15 border border-stone-500/30 text-stone-400 hover:bg-stone-500/25"
                            : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25"
                        }`}
                      >
                        {review.status === "approved" ? "Unpublish" : "✓ Approve"}
                      </button>
                      <button
                        onClick={async () => {
                          if (!confirm("Delete this review permanently?")) return;
                          playClickSound();
                          const res = await fetch(`/api/admin/reviews/${review.id}`, {
                            method: "DELETE",
                            headers: { "Authorization": `Bearer ${token}` },
                          });
                          if (res.ok) { if (token) fetchAllData(token); }
                        }}
                        className="w-9 h-9 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer flex items-center justify-center border border-rose-500/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
