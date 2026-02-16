'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Star, Plus, Search, X, ChevronRight,
  DollarSign, Users, TrendingUp, Handshake,
  Filter,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────

interface Sponsor {
  id: number;
  businessName: string;
  contactName: string | null;
  email: string | null;
  category: string | null;
  stage: string;
  starred: boolean;
  brandFitScore: number | null;
  lastContactedAt: string | null;
  updatedAt: string;
  dealTotal: number;
}

interface PipelineStats {
  stages: Record<string, number>;
  totalSponsors: number;
  confirmedDeals: number;
  confirmedValue: number;
  pipelineValue: number;
}

const STAGES = ['prospect', 'contacted', 'negotiating', 'confirmed', 'completed', 'declined'] as const;
const STAGE_LABELS: Record<string, string> = {
  prospect: 'Prospect',
  contacted: 'Contacted',
  negotiating: 'Negotiating',
  confirmed: 'Confirmed',
  completed: 'Completed',
  declined: 'Declined',
};
const STAGE_COLORS: Record<string, string> = {
  prospect: 'bg-zinc-600',
  contacted: 'bg-blue-600',
  negotiating: 'bg-amber-600',
  confirmed: 'bg-emerald-600',
  completed: 'bg-purple-600',
  declined: 'bg-red-600',
};

const CATEGORIES = [
  'wellness', 'beauty', 'fitness', 'venue', 'food-beverage',
  'fashion', 'tech', 'health', 'lifestyle', 'other',
];

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

export default function SponsorsPage() {
  const router = useRouter();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [stats, setStats] = useState<PipelineStats | null>(null);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [starredFilter, setStarredFilter] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Add form state
  const [newSponsor, setNewSponsor] = useState({
    businessName: '', contactName: '', email: '', phone: '',
    website: '', instagram: '', category: '', location: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (stageFilter) params.set('stage', stageFilter);
      if (categoryFilter) params.set('category', categoryFilter);
      if (starredFilter) params.set('starred', 'true');

      const [sponsorsRes, statsRes] = await Promise.all([
        fetch(`/api/admin/sponsors?${params}`),
        fetch('/api/admin/sponsors/pipeline-stats'),
      ]);

      if (sponsorsRes.ok) {
        const data = await sponsorsRes.json();
        setSponsors(data.sponsors);
      }
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, [search, stageFilter, categoryFilter, starredFilter]);

  useEffect(() => {
    const timeout = setTimeout(fetchData, 300);
    return () => clearTimeout(timeout);
  }, [fetchData]);

  const handleAddSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSponsor.businessName.trim()) return;

    const res = await fetch('/api/admin/sponsors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSponsor),
    });

    if (res.ok) {
      setShowAddForm(false);
      setNewSponsor({ businessName: '', contactName: '', email: '', phone: '', website: '', instagram: '', category: '', location: '' });
      fetchData();
    }
  };

  const toggleStar = async (id: number, starred: boolean) => {
    setSponsors((prev) => prev.map((s) => s.id === id ? { ...s, starred: !starred } : s));
    await fetch(`/api/admin/sponsors/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ starred: !starred }),
    });
  };

  const advanceStage = async (id: number, currentStage: string) => {
    const idx = STAGES.indexOf(currentStage as typeof STAGES[number]);
    if (idx < 0 || idx >= STAGES.length - 1) return;
    const nextStage = STAGES[idx + 1];

    setSponsors((prev) => prev.map((s) => s.id === id ? { ...s, stage: nextStage } : s));
    await fetch(`/api/admin/sponsors/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: nextStage }),
    });
    fetchData();
  };

  // Group sponsors by stage for kanban
  const kanban = STAGES.reduce((acc, stage) => {
    acc[stage] = sponsors.filter((s) => s.stage === stage);
    return acc;
  }, {} as Record<string, Sponsor[]>);

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={Users} label="Total Sponsors" value={stats.totalSponsors} />
          <StatCard icon={TrendingUp} label="Pipeline Value" value={`$${stats.pipelineValue.toLocaleString()}`} />
          <StatCard icon={Handshake} label="Confirmed Deals" value={stats.confirmedDeals} />
          <StatCard icon={DollarSign} label="Confirmed Value" value={`$${stats.confirmedValue.toLocaleString()}`} />
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search sponsors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-zinc-800/60 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
              <X size={14} />
            </button>
          )}
        </div>

        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="px-3 py-2 bg-zinc-800/60 border border-zinc-700 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-zinc-500"
        >
          <option value="">All Stages</option>
          {STAGES.map((s) => (
            <option key={s} value={s}>{STAGE_LABELS[s]}</option>
          ))}
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 bg-zinc-800/60 border border-zinc-700 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-zinc-500"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' & ')}</option>
          ))}
        </select>

        <button
          onClick={() => setStarredFilter(!starredFilter)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border transition-colors ${
            starredFilter
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
              : 'bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Star size={14} fill={starredFilter ? 'currentColor' : 'none'} />
          Starred
        </button>

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors ml-auto"
        >
          <Plus size={15} />
          Add Sponsor
        </button>
      </div>

      {/* Add Sponsor Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowAddForm(false)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-zinc-100">New Sponsor</h2>
              <button onClick={() => setShowAddForm(false)} className="text-zinc-500 hover:text-zinc-300"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddSponsor} className="space-y-3">
              <input
                type="text"
                placeholder="Business Name *"
                value={newSponsor.businessName}
                onChange={(e) => setNewSponsor({ ...newSponsor, businessName: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Contact Name"
                  value={newSponsor.contactName}
                  onChange={(e) => setNewSponsor({ ...newSponsor, contactName: e.target.value })}
                  className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newSponsor.email}
                  onChange={(e) => setNewSponsor({ ...newSponsor, email: e.target.value })}
                  className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={newSponsor.phone}
                  onChange={(e) => setNewSponsor({ ...newSponsor, phone: e.target.value })}
                  className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
                />
                <input
                  type="url"
                  placeholder="Website"
                  value={newSponsor.website}
                  onChange={(e) => setNewSponsor({ ...newSponsor, website: e.target.value })}
                  className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
                />
                <input
                  type="text"
                  placeholder="Instagram"
                  value={newSponsor.instagram}
                  onChange={(e) => setNewSponsor({ ...newSponsor, instagram: e.target.value })}
                  className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={newSponsor.location}
                  onChange={(e) => setNewSponsor({ ...newSponsor, location: e.target.value })}
                  className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
                />
              </div>
              <select
                value={newSponsor.category}
                onChange={(e) => setNewSponsor({ ...newSponsor, category: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-zinc-500"
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' & ')}</option>
                ))}
              </select>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Add Sponsor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      {loading ? (
        <div className="text-center py-20 text-zinc-500">Loading sponsors...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {STAGES.map((stage) => (
            <div key={stage} className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${STAGE_COLORS[stage]}`} />
                  <span className="text-sm font-medium text-zinc-300">{STAGE_LABELS[stage]}</span>
                </div>
                <span className="text-xs text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">
                  {kanban[stage]?.length ?? 0}
                </span>
              </div>
              <div className="space-y-2 min-h-[100px]">
                {kanban[stage]?.map((sponsor) => (
                  <SponsorCard
                    key={sponsor.id}
                    sponsor={sponsor}
                    onStar={() => toggleStar(sponsor.id, sponsor.starred)}
                    onAdvance={() => advanceStage(sponsor.id, sponsor.stage)}
                    onClick={() => router.push(`/admin/sponsors/${sponsor.id}`)}
                    isLastStage={stage === 'completed'}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-center gap-2 text-zinc-400 mb-1">
        <Icon size={15} />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="text-xl font-semibold text-zinc-100">{value}</div>
    </div>
  );
}

function SponsorCard({
  sponsor,
  onStar,
  onAdvance,
  onClick,
  isLastStage,
}: {
  sponsor: Sponsor;
  onStar: () => void;
  onAdvance: () => void;
  onClick: () => void;
  isLastStage: boolean;
}) {
  return (
    <div
      className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-3 cursor-pointer hover:border-zinc-600 transition-colors group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-1.5">
        <h3 className="text-sm font-medium text-zinc-200 leading-tight pr-2">{sponsor.businessName}</h3>
        <button
          onClick={(e) => { e.stopPropagation(); onStar(); }}
          className="text-zinc-600 hover:text-amber-400 transition-colors flex-shrink-0"
        >
          <Star size={14} fill={sponsor.starred ? 'currentColor' : 'none'} className={sponsor.starred ? 'text-amber-400' : ''} />
        </button>
      </div>

      {sponsor.category && (
        <span className="inline-block text-[10px] font-medium px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 mb-1.5">
          {sponsor.category}
        </span>
      )}

      {sponsor.contactName && (
        <p className="text-xs text-zinc-500 mb-1">{sponsor.contactName}</p>
      )}

      {sponsor.brandFitScore != null && (
        <div className="mb-1.5">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[10px] text-zinc-500">Brand Fit</span>
            <span className="text-[10px] font-medium text-zinc-400">{sponsor.brandFitScore}</span>
          </div>
          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
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

      {sponsor.lastContactedAt && (
        <p className="text-[10px] text-zinc-600">Last contact: {timeAgo(sponsor.lastContactedAt)}</p>
      )}

      {!isLastStage && (
        <button
          onClick={(e) => { e.stopPropagation(); onAdvance(); }}
          className="mt-2 flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-200 transition-colors opacity-0 group-hover:opacity-100"
        >
          Advance <ChevronRight size={12} />
        </button>
      )}
    </div>
  );
}
