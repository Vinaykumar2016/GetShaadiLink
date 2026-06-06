import React, { useState } from "react";
import { Invitation } from "../types";
import { Sparkles, Eye, Copy, Check, Send, Trash, Edit, Heart, LogOut, BarChart3, MessageSquare, IndianRupee } from "lucide-react";
import { playClickSound } from "../utils/soundUtils";
import BuilderForm from "./BuilderForm";

interface UserDashboardProps {
  data: Invitation;
  onLogout: () => void;
  onUpdateSuccess: (updatedData: Invitation) => void;
}

export default function UserDashboard({ data, onLogout, onUpdateSuccess }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "edit" | "blessings">("overview");
  const [copiedLink, setCopiedLink] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  const liveUrl = `${window.location.origin}/${data.slug}`;

  const copyLiveLink = () => {
    playClickSound();
    navigator.clipboard.writeText(liveUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const shareLiveLink = () => {
    playClickSound();
    const shareText = `囍 Our wedding invitation is live! 🌸 Visit the link to view details, timeline, and our story:\n\n👉 ${liveUrl}\n\nWe look forward to your blessings!`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  // Moderation: Remove a note by calling the update API with the filtered array
  const handleDeleteNote = async (noteId: string) => {
    playClickSound();
    if (!window.confirm("Are you sure you want to delete this blessing note from the wall?")) return;
    setDeletingNoteId(noteId);

    const updatedNotes = (data.guestbookNotes || []).filter((n) => n.id !== noteId);

    try {
      const res = await fetch(`/api/invitations/${data.slug}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: data.editPassword,
          guestbookNotes: updatedNotes,
        }),
      });

      const parsed = await res.json();
      if (!res.ok) throw new Error(parsed.error || "Failed to delete note.");

      // Fetch the updated invitation to refresh state
      const freshRes = await fetch(`/api/invitations/${data.slug}?admin=true`);
      if (freshRes.ok) {
        const freshData = await freshRes.json();
        onUpdateSuccess(freshData);
      }
    } catch (err: any) {
      alert("Error deleting blessing: " + err.message);
    } finally {
      setDeletingNoteId(null);
    }
  };

  // Total Shagun received accumulator
  const totalShagun = (data.guestbookNotes || [])
    .filter((n) => n.amount)
    .reduce((acc, curr) => acc + (parseFloat(curr.amount || "0") || 0), 0);

  const handleEditorSuccess = async (slugName: string) => {
    setSaveSuccessMsg("Invitation details saved successfully! ✨");
    setTimeout(() => setSaveSuccessMsg(""), 5000);

    // Refresh state
    try {
      const res = await fetch(`/api/invitations/${slugName}?admin=true`);
      if (res.ok) {
        const freshData = await res.json();
        onUpdateSuccess(freshData);
        setActiveTab("overview");
      }
    } catch (err) {
      console.error("Failed to refresh edited data:", err);
    }
  };

  const handleTabChange = (tab: "overview" | "edit" | "blessings") => {
    playClickSound();
    setActiveTab(tab);
  };

  const handleLogoutClick = () => {
    playClickSound();
    onLogout();
  };

  return (
    <div className="w-full bg-brand-cream border border-brand-rust/15 rounded-3xl overflow-hidden shadow-paper-deep">
      {/* Header bar */}
      <header className="p-6 bg-gradient-to-r from-brand-rust to-brand-terracotta border-b border-brand-rust/10 flex flex-wrap gap-4 items-center justify-between">
        <div className="space-y-1">
          <span className="font-cinzel text-[9px] tracking-widest text-brand-gold font-bold block">
            ✦ CARD CREATOR DASHBOARD
          </span>
          <h2 className="font-display italic text-2xl font-bold text-white flex items-center gap-2">
            <span>{data.bride} & {data.groom}</span>
            <Heart className="w-4 h-4 text-brand-gold fill-brand-gold animate-pulse" />
          </h2>
        </div>

        <button
          onClick={handleLogoutClick}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 text-white font-bold text-xs tracking-wider uppercase select-none cursor-pointer transition-colors"
        >
          <LogOut className="w-3.5 h-3.5 text-brand-gold" />
          <span>Exit Dashboard</span>
        </button>
      </header>

      {/* Tabs */}
      <nav className="flex bg-brand-gold-light border-b border-brand-rust/10 text-sm">
        <button
          onClick={() => handleTabChange("overview")}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 py-4 px-6 font-semibold tracking-wide border-b-2 transition-all cursor-pointer ${
            activeTab === "overview"
              ? "border-brand-rust text-brand-rust bg-brand-cream"
              : "border-transparent text-brand-rust/60 hover:text-brand-rust hover:bg-brand-rust/5"
          }`}
        >
          <BarChart3 className="w-4 h-4 text-brand-gold" />
          <span>Overview</span>
        </button>
        <button
          onClick={() => handleTabChange("edit")}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 py-4 px-6 font-semibold tracking-wide border-b-2 transition-all cursor-pointer ${
            activeTab === "edit"
              ? "border-brand-rust text-brand-rust bg-brand-cream"
              : "border-transparent text-brand-rust/60 hover:text-brand-rust hover:bg-brand-rust/5"
          }`}
        >
          <Edit className="w-4 h-4 text-brand-gold" />
          <span>Edit Card</span>
        </button>
        <button
          onClick={() => handleTabChange("blessings")}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 py-4 px-6 font-semibold tracking-wide border-b-2 transition-all cursor-pointer ${
            activeTab === "blessings"
              ? "border-brand-rust text-brand-rust bg-brand-cream"
              : "border-transparent text-brand-rust/60 hover:text-brand-rust hover:bg-brand-rust/5"
          }`}
        >
          <MessageSquare className="w-4 h-4 text-brand-gold" />
          <span>Blessings & Shagun</span>
        </button>
      </nav>

      {/* Panels */}
      <div className="p-6 sm:p-8 min-h-[400px] bg-brand-cream">
        {/* Tab 1: OVERVIEW & ANALYTICS */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Stats */}
            <div className="lg:col-span-7 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-6 rounded-2xl bg-brand-gold-light border border-brand-rust/10 flex flex-col justify-between shadow-paper">
                  <span className="text-[10px] font-cinzel tracking-widest text-brand-rust/60 uppercase block mb-3 font-bold">TOTAL VIEWS</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-display font-extrabold text-brand-rust">{data.views || 0}</span>
                    <span className="text-xs text-brand-gold font-semibold uppercase font-cinzel">Views</span>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-brand-gold-light border border-brand-rust/10 flex flex-col justify-between shadow-paper">
                  <span className="text-[10px] font-cinzel tracking-widest text-brand-rust/60 uppercase block mb-3 font-bold">BLESSINGS</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-display font-extrabold text-brand-rust">{(data.guestbookNotes || []).length}</span>
                    <span className="text-xs text-brand-gold font-semibold uppercase font-cinzel">Wishes</span>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-brand-gold-light border border-brand-rust/10 flex flex-col justify-between shadow-paper">
                  <span className="text-[10px] font-cinzel tracking-widest text-brand-rust/60 uppercase block mb-3 font-bold">SHAGUN COLLECTED</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-display font-extrabold text-brand-rust">₹{totalShagun}</span>
                    <span className="text-[9px] text-brand-gold font-semibold uppercase font-cinzel">Total</span>
                  </div>
                </div>
              </div>

              {/* Share block */}
              <div className="p-6 rounded-2xl bg-[#F4EFE6] border border-brand-rust/10 space-y-4 shadow-paper">
                <h4 className="font-display italic text-lg text-brand-rust font-semibold">Your Live Web Link</h4>
                <p className="text-xs text-brand-rust/70 leading-relaxed">
                  Send this unique invitation link directly to your relatives, friends, and family via WhatsApp or print it onto physical wedding cards.
                </p>

                <div className="flex items-center gap-2 p-3 bg-white border border-brand-rust/15 rounded-2xl font-mono text-xs sm:text-sm select-all overflow-hidden text-brand-rust">
                  <span className="truncate flex-1 text-left">{liveUrl}</span>
                  <button
                    onClick={copyLiveLink}
                    className="w-10 h-10 rounded-xl flex items-center justify-center border border-brand-rust/10 hover:bg-brand-rust/5 text-brand-rust shrink-0 active:scale-95 transition-all cursor-pointer"
                    title="Copy live URL"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-brand-gold" />}
                  </button>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={shareLiveLink}
                    className="py-3 px-6 rounded-full bg-emerald-700 hover:bg-emerald-600 font-bold text-xs tracking-wider uppercase text-white shadow-lg flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>Share on WhatsApp</span>
                  </button>
                  <a
                    href={`/${data.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-6 rounded-full bg-white hover:bg-brand-rust/5 border border-brand-rust/20 font-bold text-xs text-brand-rust flex items-center gap-2 select-none shadow-sm transition-all hover:scale-105 active:scale-95"
                  >
                    <Eye className="w-4 h-4 text-brand-gold" />
                    <span>View Live Card</span>
                  </a>
                </div>
              </div>
            </div>

            {/* QR Code Column */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="p-6 rounded-2xl bg-brand-gold-light border border-brand-rust/10 text-center w-full max-w-[280px] space-y-4 shadow-paper">
                <span className="text-[10px] font-cinzel tracking-widest text-brand-rust/60 uppercase block font-bold">PRINTABLE QR CODE</span>
                
                <div className="bg-white p-4 rounded-2xl inline-block border border-brand-rust/5 shadow-inner">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(liveUrl)}`}
                    alt="Wedding QR Code"
                    className="w-40 h-40 object-contain"
                  />
                </div>

                <p className="text-[10px] text-brand-rust/60 leading-relaxed px-2">
                  Guests can point their smartphone cameras here to load your custom animated card instantly.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: EDITOR */}
        {activeTab === "edit" && (
          <div className="space-y-6">
            {saveSuccessMsg && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold">
                {saveSuccessMsg}
              </div>
            )}
            <BuilderForm
              onSuccess={handleEditorSuccess}
              initialData={data}
              onCancelEdit={() => setActiveTab("overview")}
            />
          </div>
        )}

        {/* Tab 3: BLESSINGS WALL MODERATION & SHAGUN */}
        {activeTab === "blessings" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-rust/10 pb-4">
              <div>
                <h3 className="font-display italic text-2xl font-bold text-brand-rust font-semibold">Guestbook Blessings Registry</h3>
                <p className="text-xs text-brand-rust/60">
                  Moderate messages or track shagun monetary offerings sent to your UPI account.
                </p>
              </div>
              <div className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-brand-gold-light border border-brand-rust/15 text-brand-rust font-mono text-sm font-bold shadow-sm">
                <IndianRupee className="w-4 h-4 text-brand-gold" />
                <span>Total Collected: ₹{totalShagun}</span>
              </div>
            </div>

            {/* Blessing grid ledger */}
            {(!data.guestbookNotes || data.guestbookNotes.length === 0) ? (
              <div className="text-center py-16 text-brand-rust/40 italic text-sm">
                No blessings or shagun notes posted on the wall yet. 🌸
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-brand-rust/15 bg-white shadow-paper">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-brand-gold-light text-brand-rust/70 font-cinzel text-[9.5px] tracking-wider uppercase border-b border-brand-rust/15 select-none">
                      <th className="p-4">Guest Name</th>
                      <th className="p-4">Blessing Message</th>
                      <th className="p-4 text-center">Shagun Paid</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-rust/10">
                    {data.guestbookNotes.map((n) => (
                      <tr key={n.id} className="hover:bg-brand-gold-light/20 transition-colors">
                        <td className="p-4 font-semibold text-brand-rust text-sm whitespace-nowrap">{n.name}</td>
                        <td className="p-4 text-brand-rust/80 max-w-xs sm:max-w-md leading-relaxed">{n.note}</td>
                        <td className="p-4 text-center">
                          {n.amount ? (
                            <span className="font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10.5px]">
                              ₹{n.amount}
                            </span>
                          ) : (
                            <span className="text-brand-rust/35 font-light">—</span>
                          )}
                        </td>
                        <td className="p-4 text-brand-rust/60 whitespace-nowrap">{n.date}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDeleteNote(n.id)}
                            disabled={deletingNoteId === n.id}
                            className="w-8 h-8 rounded-lg flex items-center justify-center border border-brand-rust/15 text-brand-rust/60 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors disabled:opacity-50 cursor-pointer"
                            title="Delete note from wall"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
