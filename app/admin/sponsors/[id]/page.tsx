'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Star, ChevronRight, Mail, Phone, Globe, Instagram,
  Plus, Trash2, ExternalLink, Copy, Check, Sparkles, Loader2,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────

interface Sponsor {
  id: number;
  businessName: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  instagram: string | null;
  category: string | null;
  location: string | null;
  stage: string;
  starred: boolean;
  brandFitScore: number | null;
  brandFitRationale: string | null;
  lastContactedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Activity {
  id: number;
  sponsorId: number;
  type: string;
  title: string;
  description: string | null;
  createdAt: string;
}

interface Deal {
  id: number;
  sponsorId: number;
  packageId: number | null;
  packageName: string | null;
  dealValue: number;
  inKindValue: number;
  inKindDescription: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
}

interface Package {
  id: number;
  name: string;
  suggestedValue: number | null;
}

const STAGES = ['prospect', 'contacted', 'negotiating', 'confirmed', 'completed', 'declined'] as const;
const STAGE_LABELS: Record<string, string> = {
  prospect: 'Prospect', contacted: 'Contacted', negotiating: 'Negotiating',
  confirmed: 'Confirmed', completed: 'Completed', declined: 'Declined',
};
const STAGE_BADGE: Record<string, string> = {
  prospect: 'bg-zinc-600/30 text-zinc-300 border-zinc-600',
  contacted: 'bg-blue-600/20 text-blue-300 border-blue-600',
  negotiating: 'bg-amber-600/20 text-amber-300 border-amber-600',
  confirmed: 'bg-emerald-600/20 text-emerald-300 border-emerald-600',
  completed: 'bg-purple-600/20 text-purple-300 border-purple-600',
  declined: 'bg-red-600/20 text-red-300 border-red-600',
};

const ACTIVITY_TYPES = [
  { value: 'email', label: 'Email' },
  { value: 'call', label: 'Call' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'note', label: 'Note' },
  { value: 'proposal-sent', label: 'Proposal Sent' },
];

const DEAL_STATUSES = ['pending', 'active', 'fulfilled', 'cancelled'];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function SponsorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [sponsor, setSponsor] = useState<Sponsor | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [activeTab, setActiveTab] = useState<'activity' | 'deals' | 'proposal'>('activity');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Activity form
  const [activityType, setActivityType] = useState('note');
  const [activityTitle, setActivityTitle] = useState('');
  const [activityDesc, setActivityDesc] = useState('');

  // Deal form
  const [showDealForm, setShowDealForm] = useState(false);
  const [dealPkgId, setDealPkgId] = useState('');
  const [dealValue, setDealValue] = useState('');
  const [dealInKind, setDealInKind] = useState('');
  const [dealInKindDesc, setDealInKindDesc] = useState('');
  const [dealNotes, setDealNotes] = useState('');

  // Proposal
  const [proposal, setProposal] = useState('');
  const [proposalLoading, setProposalLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [detailRes, pkgRes] = await Promise.all([
        fetch(`/api/admin/sponsors/${id}`),
        fetch('/api/admin/sponsors/packages'),
      ]);

      if (detailRes.ok) {
        const data = await detailRes.json();
        setSponsor(data.sponsor);
        setActivities(data.activities);
        setDeals(data.deals);
      }
      if (pkgRes.ok) {
        const data = await pkgRes.json();
        setPackages(data.packages);
      }
    } catch (err) {
      console.error('Failed to fetch sponsor:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleStar = async () => {
    if (!sponsor) return;
    setSponsor({ ...sponsor, starred: !sponsor.starred });
    await fetch(`/api/admin/sponsors/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ starred: !sponsor.starred }),
    });
  };

  const advanceStage = async () => {
    if (!sponsor) return;
    const idx = STAGES.indexOf(sponsor.stage as typeof STAGES[number]);
    if (idx < 0 || idx >= STAGES.length - 1) return;
    const nextStage = STAGES[idx + 1];
    setSponsor({ ...sponsor, stage: nextStage });
    await fetch(`/api/admin/sponsors/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: nextStage }),
    });
    fetchData();
  };

  const setStage = async (stage: string) => {
    if (!sponsor || sponsor.stage === stage) return;
    setSponsor({ ...sponsor, stage });
    await fetch(`/api/admin/sponsors/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage }),
    });
    fetchData();
  };

  const addActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityTitle.trim()) return;

    const res = await fetch(`/api/admin/sponsors/${id}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: activityType, title: activityTitle, description: activityDesc }),
    });

    if (res.ok) {
      setActivityTitle('');
      setActivityDesc('');
      fetchData();
    }
  };

  const addDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseInt(dealValue, 10);
    if (isNaN(value)) return;

    const res = await fetch(`/api/admin/sponsors/${id}/deals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        packageId: dealPkgId ? parseInt(dealPkgId, 10) : null,
        dealValue: value,
        inKindValue: parseInt(dealInKind, 10) || 0,
        inKindDescription: dealInKindDesc,
        notes: dealNotes,
      }),
    });

    if (res.ok) {
      setShowDealForm(false);
      setDealPkgId('');
      setDealValue('');
      setDealInKind('');
      setDealInKindDesc('');
      setDealNotes('');
      fetchData();
    }
  };

  const deleteDeal = async (dealId: number) => {
    await fetch(`/api/admin/sponsors/${id}/deals/${dealId}`, { method: 'DELETE' });
    fetchData();
  };

  const updateDealStatus = async (dealId: number, status: string) => {
    await fetch(`/api/admin/sponsors/${id}/deals/${dealId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchData();
  };

  const generateProposal = async () => {
    setProposalLoading(true);
    try {
      const res = await fetch(`/api/admin/sponsors/${id}/proposal`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setProposal(data.proposal);
      }
    } catch (err) {
      console.error('Failed to generate proposal:', err);
    } finally {
      setProposalLoading(false);
    }
  };

  const copyEmail = async () => {
    if (!sponsor?.email) return;
    await navigator.clipboard.writeText(sponsor.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const deleteSponsor = async () => {
    if (!confirm('Delete this sponsor and all related data?')) return;
    const res = await fetch(`/api/admin/sponsors/${id}`, { method: 'DELETE' });
    if (res.ok) {
      router.push('/admin/sponsors');
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-zinc-500">Loading...</div>;
  }

  if (!sponsor) {
    return <div className="text-center py-20 text-zinc-400">Sponsor not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back + Actions */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.push('/admin/sponsors')} className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
          <ArrowLeft size={16} /> Back to Pipeline
        </button>
        <button onClick={deleteSponsor} className="text-xs text-red-400 hover:text-red-300 transition-colors">
          Delete Sponsor
        </button>
      </div>

      {/* Header */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-zinc-100">{sponsor.businessName}</h1>
              <button onClick={toggleStar} className="text-zinc-600 hover:text-amber-400 transition-colors">
                <Star size={20} fill={sponsor.starred ? 'currentColor' : 'none'} className={sponsor.starred ? 'text-amber-400' : ''} />
              </button>
            </div>
            {sponsor.category && (
              <span className="inline-block text-xs font-medium px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                {sponsor.category}
              </span>
            )}
            {sponsor.location && (
              <span className="text-xs text-zinc-500 ml-2">{sponsor.location}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STAGE_BADGE[sponsor.stage] || STAGE_BADGE.prospect}`}>
              {STAGE_LABELS[sponsor.stage] || sponsor.stage}
            </span>
            {sponsor.stage !== 'completed' && sponsor.stage !== 'declined' && (
              <button
                onClick={advanceStage}
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded transition-colors"
              >
                Advance <ChevronRight size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Stage selector */}
        <div className="flex gap-1 mb-4">
          {STAGES.map((s) => (
            <button
              key={s}
              onClick={() => setStage(s)}
              className={`text-[11px] px-2 py-0.5 rounded transition-colors ${
                sponsor.stage === s
                  ? `${STAGE_BADGE[s]} border`
                  : 'text-zinc-600 hover:text-zinc-400'
              }`}
            >
              {STAGE_LABELS[s]}
            </button>
          ))}
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {sponsor.contactName && (
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wide mb-0.5">Contact</p>
              <p className="text-sm text-zinc-200">{sponsor.contactName}</p>
            </div>
          )}
          {sponsor.email && (
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wide mb-0.5">Email</p>
              <div className="flex items-center gap-1.5">
                <Mail size={12} className="text-zinc-500" />
                <span className="text-sm text-zinc-200 truncate">{sponsor.email}</span>
                <button onClick={copyEmail} className="text-zinc-500 hover:text-zinc-300 transition-colors">
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </button>
              </div>
            </div>
          )}
          {sponsor.phone && (
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wide mb-0.5">Phone</p>
              <div className="flex items-center gap-1.5">
                <Phone size={12} className="text-zinc-500" />
                <span className="text-sm text-zinc-200">{sponsor.phone}</span>
              </div>
            </div>
          )}
          {sponsor.website && (
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wide mb-0.5">Website</p>
              <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300">
                <Globe size={12} /> Visit <ExternalLink size={10} />
              </a>
            </div>
          )}
          {sponsor.instagram && (
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wide mb-0.5">Instagram</p>
              <a
                href={`https://instagram.com/${sponsor.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-pink-400 hover:text-pink-300"
              >
                <Instagram size={12} /> @{sponsor.instagram.replace('@', '')}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* AI Insights */}
      {(sponsor.brandFitScore != null || sponsor.brandFitRationale) && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
            <Sparkles size={14} className="text-amber-400" />
            AI Brand Fit Analysis
          </h2>
          {sponsor.brandFitScore != null && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-zinc-400">Brand Fit Score</span>
                <span className="text-sm font-semibold text-zinc-200">{sponsor.brandFitScore}/100</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    sponsor.brandFitScore >= 70 ? 'bg-emerald-500' :
                    sponsor.brandFitScore >= 40 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${sponsor.brandFitScore}%` }}
                />
              </div>
            </div>
          )}
          {sponsor.brandFitRationale && (
            <p className="text-sm text-zinc-400 leading-relaxed">{sponsor.brandFitRationale}</p>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-zinc-800">
        <div className="flex gap-1">
          {(['activity', 'deals', 'proposal'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-zinc-100 text-zinc-100'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'activity' && (
        <div className="space-y-4">
          {/* Add Activity Form */}
          <form onSubmit={addActivity} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
            <div className="flex gap-2">
              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-zinc-500"
              >
                {ACTIVITY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Activity summary..."
                value={activityTitle}
                onChange={(e) => setActivityTitle(e.target.value)}
                className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
                required
              />
            </div>
            <textarea
              placeholder="Details (optional)"
              value={activityDesc}
              onChange={(e) => setActivityDesc(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 resize-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded-lg text-sm transition-colors"
              >
                Add Activity
              </button>
            </div>
          </form>

          {/* Activity Timeline */}
          <div className="space-y-1">
            {activities.length === 0 ? (
              <p className="text-sm text-zinc-500 py-4 text-center">No activities yet</p>
            ) : (
              activities.map((a) => (
                <div key={a.id} className="flex gap-3 py-2.5 border-b border-zinc-800/60 last:border-0">
                  <div className="text-[10px] text-zinc-600 w-16 flex-shrink-0 pt-0.5">
                    {timeAgo(a.createdAt)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                        {a.type}
                      </span>
                      <span className="text-sm text-zinc-200">{a.title}</span>
                    </div>
                    {a.description && (
                      <p className="text-xs text-zinc-500 mt-0.5">{a.description}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'deals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-300">Deals</h3>
            <button
              onClick={() => setShowDealForm(!showDealForm)}
              className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <Plus size={14} /> New Deal
            </button>
          </div>

          {showDealForm && (
            <form onSubmit={addDeal} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={dealPkgId}
                  onChange={(e) => {
                    setDealPkgId(e.target.value);
                    if (e.target.value) {
                      const pkg = packages.find((p) => p.id === parseInt(e.target.value, 10));
                      if (pkg?.suggestedValue) setDealValue(String(pkg.suggestedValue));
                    }
                  }}
                  className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-zinc-500"
                >
                  <option value="">Custom Deal</option>
                  {packages.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} {p.suggestedValue ? `($${p.suggestedValue.toLocaleString()})` : ''}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Deal Value ($) *"
                  value={dealValue}
                  onChange={(e) => setDealValue(e.target.value)}
                  className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
                  required
                />
                <input
                  type="number"
                  placeholder="In-Kind Value ($)"
                  value={dealInKind}
                  onChange={(e) => setDealInKind(e.target.value)}
                  className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
                />
                <input
                  type="text"
                  placeholder="In-Kind Description"
                  value={dealInKindDesc}
                  onChange={(e) => setDealInKindDesc(e.target.value)}
                  className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
                />
              </div>
              <textarea
                placeholder="Notes"
                value={dealNotes}
                onChange={(e) => setDealNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 resize-none"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowDealForm(false)} className="px-3 py-1.5 text-sm text-zinc-400">Cancel</button>
                <button type="submit" className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm transition-colors">Create Deal</button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {deals.length === 0 ? (
              <p className="text-sm text-zinc-500 py-4 text-center">No deals yet</p>
            ) : (
              deals.map((deal) => (
                <div key={deal.id} className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-base font-semibold text-zinc-100">${deal.dealValue.toLocaleString()}</span>
                        {deal.inKindValue > 0 && (
                          <span className="text-xs text-zinc-400">+ ${deal.inKindValue.toLocaleString()} in-kind</span>
                        )}
                      </div>
                      {deal.packageName && (
                        <span className="text-xs text-zinc-400">{deal.packageName}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={deal.status}
                        onChange={(e) => updateDealStatus(deal.id, e.target.value)}
                        className="text-xs bg-zinc-800 border border-zinc-700 rounded px-2 py-0.5 text-zinc-300"
                      >
                        {DEAL_STATUSES.map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                      <button onClick={() => deleteDeal(deal.id)} className="text-zinc-600 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  {deal.inKindDescription && (
                    <p className="text-xs text-zinc-500 mb-1">In-kind: {deal.inKindDescription}</p>
                  )}
                  {deal.notes && (
                    <p className="text-xs text-zinc-500">{deal.notes}</p>
                  )}
                  <p className="text-[10px] text-zinc-600 mt-1">{formatDate(deal.createdAt)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'proposal' && (
        <div className="space-y-4">
          {!proposal && !proposalLoading && (
            <div className="text-center py-12">
              <Sparkles size={32} className="text-zinc-600 mx-auto mb-3" />
              <p className="text-sm text-zinc-400 mb-4">Generate an AI-powered sponsorship proposal tailored to {sponsor.businessName}</p>
              <button
                onClick={generateProposal}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Generate Proposal
              </button>
            </div>
          )}

          {proposalLoading && (
            <div className="text-center py-12">
              <Loader2 size={24} className="text-amber-400 mx-auto mb-3 animate-spin" />
              <p className="text-sm text-zinc-400">Crafting your proposal...</p>
            </div>
          )}

          {proposal && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-zinc-300">Generated Proposal</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { navigator.clipboard.writeText(proposal); }}
                    className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
                  >
                    <Copy size={12} /> Copy
                  </button>
                  <button
                    onClick={generateProposal}
                    className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Regenerate
                  </button>
                </div>
              </div>
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 prose prose-invert prose-sm max-w-none">
                {proposal.split('\n').map((line, i) => {
                  if (line.startsWith('# ')) return <h1 key={i} className="text-lg font-bold text-zinc-100 mt-4 mb-2">{line.slice(2)}</h1>;
                  if (line.startsWith('## ')) return <h2 key={i} className="text-base font-semibold text-zinc-200 mt-3 mb-1.5">{line.slice(3)}</h2>;
                  if (line.startsWith('### ')) return <h3 key={i} className="text-sm font-semibold text-zinc-300 mt-2 mb-1">{line.slice(4)}</h3>;
                  if (line.startsWith('- ')) return <li key={i} className="text-sm text-zinc-400 ml-4">{line.slice(2)}</li>;
                  if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="text-sm font-semibold text-zinc-200">{line.slice(2, -2)}</p>;
                  if (line.trim() === '') return <br key={i} />;
                  return <p key={i} className="text-sm text-zinc-400 leading-relaxed">{line}</p>;
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
