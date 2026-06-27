import React, { useState, useEffect } from "react";
import { playClickSound } from "../utils/soundUtils";
import { 
  Lock, Unlock, LogOut, TrendingUp, DollarSign, Users, Percent, 
  Search, ExternalLink, Calendar, Eye, Share2, Activity
} from "lucide-react";

interface CardReferral {
  slug: string;
  bride: string;
  groom: string;
  createdAt: string;
  paidAt: string | null;
  isPaid: boolean;
  views: number;
  paymentAmount: number;
}

interface AgencyStatsResponse {
  agencyId: string;
  createdCount: number;
  paidCount: number;
  salesThisMonth: number;
  revenueThisMonth: number;
  cardConversionRate: number;
  dailyViews: Array<{ date: string; views: number }>;
  trafficSources: Array<{ source: string; count: number }>;
  cards: CardReferral[];
}

interface AgencyDashboardProps {
  agencyId: string;
  onClose: () => void;
}

export default function AgencyDashboard({ agencyId, onClose }: AgencyDashboardProps) {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Dashboard stats state
  const [stats, setStats] = useState<AgencyStatsResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"paid" | "draft">("paid");

  // Check for stored passcode on mount
  useEffect(() => {
    const storedPasscode = sessionStorage.getItem(`agency_auth_${agencyId}`);
    if (storedPasscode) {
      verifyPasscode(storedPasscode);
    }
  }, [agencyId]);

  const verifyPasscode = async (codeToVerify: string) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`/api/agency/${encodeURIComponent(agencyId)}/stats?password=${encodeURIComponent(codeToVerify)}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setIsAuthenticated(true);
        sessionStorage.setItem(`agency_auth_${agencyId}`, codeToVerify);
      } else {
        const errData = await res.json();
        setErrorMsg(errData.error || "Authentication failed");
        sessionStorage.removeItem(`agency_auth_${agencyId}`);
      }
    } catch (err) {
      console.error("Auth error:", err);
      setErrorMsg("Failed to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    if (!passcode.trim()) {
      setErrorMsg("Please enter your passcode");
      return;
    }
    verifyPasscode(passcode.trim());
  };

  const handleLogout = () => {
    playClickSound();
    sessionStorage.removeItem(`agency_auth_${agencyId}`);
    setIsAuthenticated(false);
    setStats(null);
    setPasscode("");
  };

  // Helper to format dates
  const formatDate = (isoString: string) => {
    if (!isoString) return "-";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    } catch (e) {
      return isoString;
    }
  };

  // Filter referred cards
  const filteredCards = stats?.cards.filter(c => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      c.bride.toLowerCase().includes(query) ||
      c.groom.toLowerCase().includes(query) ||
      c.slug.toLowerCase().includes(query)
    );
  }) || [];

  const paidCards = filteredCards.filter(c => c.isPaid);
  const draftCards = filteredCards.filter(c => !c.isPaid);

  // If not authenticated, render login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#110C08] text-stone-100 flex items-center justify-center p-4 relative font-sans">
        {/* Background Decorative Circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#722F37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#B85A1C]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-stone-900/60 border border-stone-800 backdrop-blur-xl p-8 rounded-3xl shadow-2xl relative z-10 text-center">
          <div className="w-16 h-16 bg-[#722F37]/20 border border-[#722F37]/30 text-[#e0a899] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="font-marcellus text-2xl font-bold tracking-wider text-amber-400 mb-2 uppercase">Agency Portal</h2>
          <p className="text-xs text-stone-400 tracking-widest uppercase mb-8">Referred stats for partner: <span className="text-amber-400 font-semibold">{agencyId}</span></p>

          <form onSubmit={handleLoginSubmit} className="space-y-5 text-left">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="agency-id" className="text-[10px] text-stone-400 uppercase tracking-widest font-bold font-mono">Agency Code</label>
              <input
                id="agency-id"
                type="text"
                value={agencyId}
                disabled
                className="w-full px-4 py-3 bg-stone-950/80 border border-stone-800 rounded-2xl text-stone-400 text-xs font-semibold focus:outline-none opacity-60"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="agency-password" className="text-[10px] text-stone-400 uppercase tracking-widest font-bold font-mono">Enter Passcode</label>
              <input
                id="agency-password"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 bg-stone-950/80 border border-stone-850 focus:border-amber-500/40 rounded-2xl text-white text-xs font-semibold focus:outline-none transition-all placeholder-stone-700"
                autoFocus
              />
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs text-center font-semibold">
                ⚠️ {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-550 hover:to-amber-650 active:scale-[0.98] text-white font-bold tracking-widest text-xs uppercase rounded-2xl transition-all shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5" />
                  Unlock Dashboard
                </>
              )}
            </button>
          </form>

          <button
            onClick={() => { playClickSound(); onClose(); }}
            className="mt-6 text-[10px] text-stone-500 hover:text-stone-300 font-bold uppercase tracking-widest transition-colors cursor-pointer"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  // If loading and no stats yet
  if (!stats) {
    return (
      <div className="min-h-screen bg-[#110C08] text-stone-100 flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto" />
          <p className="font-marcellus text-[10px] tracking-[4px] text-stone-400 uppercase font-semibold">Loading Report...</p>
        </div>
      </div>
    );
  }

  // Calculate total traffic views
  const totalViewsAggregate = stats.cards.reduce((sum, c) => sum + c.views, 0);

  return (
    <div className="min-h-screen bg-[#110C08] text-stone-100 font-sans pb-16">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#722F37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#B85A1C]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="sticky top-0 bg-[#110C08]/85 border-b border-stone-850 backdrop-blur-md z-30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#722F37] to-[#B85A1C] rounded-xl flex items-center justify-center font-marcellus text-lg font-bold text-white shadow-md">
              SL
            </div>
            <div>
              <h1 className="font-marcellus text-base sm:text-lg font-bold tracking-wider text-amber-400 uppercase">
                {agencyId}
              </h1>
              <p className="text-[9px] text-stone-400 uppercase tracking-widest font-semibold font-mono">Agency Partner Panel</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { playClickSound(); verifyPasscode(sessionStorage.getItem(`agency_auth_${agencyId}`) || ""); }}
              className="px-3.5 py-2 bg-stone-900 border border-stone-800 hover:bg-stone-800 active:scale-95 text-stone-300 font-bold text-[10px] tracking-widest uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Activity className="w-3 h-3" />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 bg-[#722F37]/15 border border-[#722F37]/35 hover:bg-[#722F37]/30 text-rose-300 font-bold text-[10px] tracking-widest uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3 h-3" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="max-w-6xl mx-auto px-4 mt-8 relative z-10">
        
        {/* KPI Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-stone-900/50 border border-stone-850 p-5 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200">
            <div className="flex items-center justify-between mb-3 text-stone-400">
              <span className="text-[10px] font-bold uppercase tracking-widest">Sales (This Month)</span>
              <div className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold font-mono text-emerald-400">{stats.salesThisMonth}</h3>
              <p className="text-[9px] text-stone-500 uppercase font-semibold mt-1">Paid cards generated</p>
            </div>
          </div>

          <div className="bg-stone-900/50 border border-stone-850 p-5 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200">
            <div className="flex items-center justify-between mb-3 text-stone-400">
              <span className="text-[10px] font-bold uppercase tracking-widest">Revenue (This Month)</span>
              <div className="p-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold font-mono text-amber-400">₹{(stats.revenueThisMonth).toLocaleString("en-IN")}</h3>
              <p className="text-[9px] text-stone-500 uppercase font-semibold mt-1">Total checkout value</p>
            </div>
          </div>

          <div className="bg-stone-900/50 border border-stone-850 p-5 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200">
            <div className="flex items-center justify-between mb-3 text-stone-400">
              <span className="text-[10px] font-bold uppercase tracking-widest">Total Referrals</span>
              <div className="p-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold font-mono text-blue-400">{stats.createdCount}</h3>
              <p className="text-[9px] text-stone-500 uppercase font-semibold mt-1">{stats.paidCount} paid &bull; {stats.createdCount - stats.paidCount} draft</p>
            </div>
          </div>

          <div className="bg-stone-900/50 border border-stone-850 p-5 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200">
            <div className="flex items-center justify-between mb-3 text-stone-400">
              <span className="text-[10px] font-bold uppercase tracking-widest">Conversion Rate</span>
              <div className="p-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold font-mono text-purple-400">
                {stats.cardConversionRate.toFixed(1)}%
              </h3>
              <p className="text-[9px] text-stone-500 uppercase font-semibold mt-1">Draft to Premium ratio</p>
            </div>
          </div>
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Traffic sources */}
          <div className="bg-stone-900/40 border border-stone-850 p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="font-marcellus text-sm font-bold tracking-wider text-amber-400 border-b border-stone-850 pb-3 mb-4 uppercase">
                Referral Traffic Sources
              </h3>
              <div className="space-y-4">
                {stats.trafficSources.length === 0 ? (
                  <p className="text-xs text-stone-500 text-center py-8 font-semibold">No visitor traffic logs recorded yet.</p>
                ) : (
                  stats.trafficSources.map((item, idx) => {
                    const percentage = totalViewsAggregate > 0 ? (item.count / totalViewsAggregate) * 100 : 0;
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="capitalize text-stone-300 font-mono">{item.source}</span>
                          <span className="text-stone-400 font-mono">{item.count} views ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full h-2 bg-stone-950 rounded-full overflow-hidden border border-stone-850">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-600 to-amber-700 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            <div className="text-[10px] text-stone-500 uppercase tracking-widest font-bold mt-4 pt-3 border-t border-stone-850">
              Total Guest Views: {totalViewsAggregate}
            </div>
          </div>

          {/* Daily views ledger */}
          <div className="bg-stone-900/40 border border-stone-850 p-6 rounded-2xl flex flex-col">
            <h3 className="font-marcellus text-sm font-bold tracking-wider text-amber-400 border-b border-stone-850 pb-3 mb-4 uppercase">
              Daily Visitors count
            </h3>
            <div className="flex-1 overflow-y-auto max-h-56 pr-2 scrollbar-thin">
              {stats.dailyViews.length === 0 ? (
                <p className="text-xs text-stone-500 text-center py-8 font-semibold">No visitor logs over time recorded yet.</p>
              ) : (
                <div className="space-y-2">
                  {stats.dailyViews.slice().reverse().map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-stone-850/50 text-xs">
                      <div className="flex items-center gap-2 text-stone-300">
                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
                        <span className="font-semibold font-mono">{formatDate(item.date)}</span>
                      </div>
                      <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-lg font-mono font-bold">
                        {item.views} guests
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </section>

        {/* Referred Cards Detail Tables */}
        <section className="bg-stone-900/40 border border-stone-850 rounded-2xl overflow-hidden">
          
          {/* Table Header Filter & Tabs */}
          <div className="p-6 border-b border-stone-850 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-marcellus text-lg font-bold tracking-wider text-amber-400 uppercase">Referred Cards Detail</h3>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold mt-0.5">Created vs. Paid status ledger</p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Search couples..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-stone-950/80 border border-stone-850 focus:border-amber-500/40 text-stone-100 placeholder-stone-600 text-xs rounded-xl focus:outline-none w-full sm:w-60 font-semibold"
                />
              </div>
            </div>

            {/* Separate Created vs Paid Tabs */}
            <div className="flex border-b border-stone-850 pt-2 gap-6">
              <button
                onClick={() => { playClickSound(); setActiveTab("paid"); }}
                className={`pb-2.5 font-marcellus text-xs uppercase font-bold tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeTab === "paid" 
                    ? "border-emerald-500 text-emerald-400" 
                    : "border-transparent text-stone-400 hover:text-white"
                }`}
              >
                🏆 Premium Live Cards ({paidCards.length})
              </button>
              <button
                onClick={() => { playClickSound(); setActiveTab("draft"); }}
                className={`pb-2.5 font-marcellus text-xs uppercase font-bold tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeTab === "draft" 
                    ? "border-amber-500 text-amber-400" 
                    : "border-transparent text-stone-400 hover:text-white"
                }`}
              >
                📝 Draft Cards ({draftCards.length})
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            {activeTab === "paid" ? (
              paidCards.length === 0 ? (
                <div className="text-center py-12 text-stone-500 text-xs font-semibold">No paid premium cards match your criteria.</div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-950 text-stone-400 border-b border-stone-850 font-mono text-[9px] uppercase tracking-widest">
                      <th className="p-4 font-bold">Couple names</th>
                      <th className="p-4 font-bold">Creation Date</th>
                      <th className="p-4 font-bold">Paid Date</th>
                      <th className="p-4 font-bold">Total Views</th>
                      <th className="p-4 font-bold">Price Paid</th>
                      <th className="p-4 font-bold text-right">View Card</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paidCards.map((c, idx) => (
                      <tr key={idx} className="border-b border-stone-850/50 hover:bg-stone-800/10 transition-colors">
                        <td className="p-4 font-semibold text-stone-200">
                          {c.bride} & {c.groom}
                        </td>
                        <td className="p-4 text-stone-400 font-mono">
                          {formatDate(c.createdAt)}
                        </td>
                        <td className="p-4 text-emerald-400 font-mono font-semibold">
                          {formatDate(c.paidAt || c.createdAt)}
                        </td>
                        <td className="p-4 text-stone-300 font-mono">
                          {c.views} views
                        </td>
                        <td className="p-4 text-amber-400 font-mono font-bold">
                          ₹{c.paymentAmount}
                        </td>
                        <td className="p-4 text-right">
                          <a
                            href={`/${c.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 active:scale-95 font-semibold text-[10px] uppercase tracking-wider transition-all"
                          >
                            Live View
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : (
              draftCards.length === 0 ? (
                <div className="text-center py-12 text-stone-500 text-xs font-semibold">No unpaid draft cards match your criteria.</div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-950 text-stone-400 border-b border-stone-850 font-mono text-[9px] uppercase tracking-widest">
                      <th className="p-4 font-bold">Couple names</th>
                      <th className="p-4 font-bold">Creation Date</th>
                      <th className="p-4 font-bold">Total Views</th>
                      <th className="p-4 font-bold">Link Path</th>
                      <th className="p-4 font-bold text-right">Preview Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {draftCards.map((c, idx) => (
                      <tr key={idx} className="border-b border-stone-850/50 hover:bg-stone-800/10 transition-colors">
                        <td className="p-4 font-semibold text-stone-200">
                          {c.bride} & {c.groom}
                        </td>
                        <td className="p-4 text-stone-400 font-mono">
                          {formatDate(c.createdAt)}
                        </td>
                        <td className="p-4 text-stone-300 font-mono">
                          {c.views} views
                        </td>
                        <td className="p-4 text-amber-500 font-mono">
                          /{c.slug}
                        </td>
                        <td className="p-4 text-right">
                          <a
                            href={`/${c.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg hover:bg-amber-500/20 active:scale-95 font-semibold text-[10px] uppercase tracking-wider transition-all"
                          >
                            Draft Preview
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}
          </div>

        </section>

      </main>
    </div>
  );
}
