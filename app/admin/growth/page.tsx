'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Search, Sparkles, Copy, Check, ExternalLink,
  UserPlus, X, ChevronDown, Loader2,
  Globe, Instagram, Mail, Phone, MapPin,
  Target, MessageSquare, Trash2, ArrowRight,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────

interface SearchResult {
  businessName: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  instagram: string | null;
  category: string | null;
  location: string | null;
  relevanceScore: number;
  aiRationale: string;
  suggestedOutreach: string;
}

interface Prospect {
  id: number;
  businessName: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  instagram: string | null;
  category: string | null;
  location: string | null;
  relevanceScore: number | null;
  aiRationale: string | null;
  suggestedOutreach: string | null;
  status: string;
  source: string | null;
  convertedToSponsorId: number | null;
  createdAt: string;
  updatedAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  responded: 'Responded',
  converted: 'Converted',
  dismissed: 'Dismissed',
};

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-400',
  contacted: 'bg-amber-500/20 text-amber-400',
  responded: 'bg-emerald-500/20 text-emerald-400',
  converted: 'bg-purple-500/20 text-purple-400',
  dismissed: 'bg-zinc-500/20 text-zinc-500',
};

const CATEGORIES = [
  'yoga', 'fitness', 'wellness', 'venue', 'influencer', 'beauty',
  'food', 'lifestyle', 'meditation', 'breathwork', 'coaching', 'other',
];

function scoreColor(score: number): string {
  if (score >= 70) return 'text-emerald-400 border-emerald-500/50';
  if (score >= 40) return 'text-amber-400 border-amber-500/50';
  return 'text-red-400 border-red-500/50';
}

function scoreBg(score: number): string {
  if (score >= 70) return 'bg-emerald-500/10';
  if (score >= 40) return 'bg-amber-500/10';
  return 'bg-red-500/10';
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

// ─── Search Examples ────────────────────────────────────────────

const SEARCH_EXAMPLES = [
  'yoga studios in Silver Lake',
  'wellness influencers LA',
  'event venues West Hollywood 30-50 people',
  'breathwork facilitators Los Angeles',
  'meditation studios Echo Park',
  'women-owned wellness brands LA',
];

export default function GrowthPage() {
  const [tab, setTab] = useState<'search' | 'prospects'>('search');
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [lastQuery, setLastQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [expandedOutreach, setExpandedOutreach] = useState<number | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [savingIdx, setSavingIdx] = useState<number | null>(null);
  const [savedIdxs, setSavedIdxs] = useState<Set<number>>(new Set());

  // Prospects state
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [prospectsLoading, setProspectsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [prospectSearch, setProspectSearch] = useState('');
  const [expandedProspect, setExpandedProspect] = useState<number | null>(null);
  const [convertingId, setConvertingId] = useState<number | null>(null);

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ─── Search ─────────────────────────────────────────────────

  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim() || q.trim().length < 3) return;

    setSearching(true);
    setResults([]);
    setSavedIdxs(new Set());
    setExpandedOutreach(null);

    try {
      const res = await fetch('/api/admin/growth/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q.trim() }),
      });

      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || 'Search failed');
        return;
      }

      const data = await res.json();
      setResults(data.results || []);
      setLastQuery(q.trim());

      // Track recent searches
      setRecentSearches((prev) => {
        const updated = [q.trim(), ...prev.filter((s) => s !== q.trim())].slice(0, 5);
        return updated;
      });

      if (data.results?.length === 0) {
        showToast('No results found - try a different search');
      }
    } catch {
      showToast('Search failed - check your connection');
    } finally {
      setSearching(false);
    }
  };

  // ─── Save Prospect ───────────────────────────────────────────

  const saveProspect = async (result: SearchResult, idx: number) => {
    setSavingIdx(idx);
    try {
      const res = await fetch('/api/admin/growth/prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...result,
          source: lastQuery,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || 'Failed to save');
        return;
      }

      setSavedIdxs((prev) => new Set([...prev, idx]));
      showToast(`Saved ${result.businessName}`);
    } catch {
      showToast('Failed to save prospect');
    } finally {
      setSavingIdx(null);
    }
  };

  // ─── Copy Outreach ──────────────────────────────────────────

  const copyOutreach = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
    showToast('Copied to clipboard');
  };

  // ─── Prospects ──────────────────────────────────────────────

  const fetchProspects = useCallback(async () => {
    setProspectsLoading(true);
    try {
      const params = new URLSearchParams();
      if (prospectSearch) params.set('search', prospectSearch);
      if (statusFilter) params.set('status', statusFilter);
      if (categoryFilter) params.set('category', categoryFilter);

      const res = await fetch(`/api/admin/growth/prospects?${params}`);
      if (res.ok) {
        const data = await res.json();
        setProspects(data.prospects || []);
      }
    } catch {
      showToast('Failed to load prospects');
    } finally {
      setProspectsLoading(false);
    }
  }, [prospectSearch, statusFilter, categoryFilter]);

  useEffect(() => {
    if (tab === 'prospects') {
      fetchProspects();
    }
  }, [tab, fetchProspects]);

  const updateProspectStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/admin/growth/prospects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setProspects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status } : p))
        );
        showToast(`Updated to ${STATUS_LABELS[status]}`);
      }
    } catch {
      showToast('Failed to update status');
    }
  };

  const deleteProspect = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/growth/prospects/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProspects((prev) => prev.filter((p) => p.id !== id));
        showToast('Prospect removed');
      }
    } catch {
      showToast('Failed to delete');
    }
  };

  const convertToSponsor = async (id: number) => {
    setConvertingId(id);
    try {
      const res = await fetch(`/api/admin/growth/prospects/${id}`, {
        method: 'POST',
      });

      if (res.ok) {
        setProspects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: 'converted' } : p))
        );
        showToast('Added to sponsor pipeline');
      }
    } catch {
      showToast('Failed to convert');
    } finally {
      setConvertingId(null);
    }
  };

  // ─── Render ─────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-zinc-800 border border-zinc-700 text-zinc-200 px-4 py-3 rounded-lg shadow-lg text-sm animate-in fade-in slide-in-from-top-2">
          {toast}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            AI Prospector
          </h1>
          <p className="text-zinc-500 mt-1">
            Find partners, venues, and collaborators for The Sunshine Effect
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-zinc-900 rounded-lg p-1 w-fit">
          <button
            onClick={() => setTab('search')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === 'search'
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Search className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
            Search
          </button>
          <button
            onClick={() => setTab('prospects')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === 'prospects'
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <UserPlus className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
            My Prospects
            {prospects.length > 0 && (
              <span className="ml-1.5 bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded text-xs">
                {prospects.length}
              </span>
            )}
          </button>
        </div>

        {/* ─── Search Tab ─────────────────────────────────────── */}
        {tab === 'search' && (
          <div>
            {/* Search Bar */}
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Find yoga studios in Silver Lake..."
                  className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 text-sm"
                />
              </div>
              <button
                onClick={() => handleSearch()}
                disabled={searching || !query.trim() || query.trim().length < 3}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                {searching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>

            {/* Recent Searches & Examples */}
            {results.length === 0 && !searching && (
              <div className="mb-8">
                {recentSearches.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-zinc-600 mb-2">Recent searches</p>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((s) => (
                        <button
                          key={s}
                          onClick={() => { setQuery(s); handleSearch(s); }}
                          className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-xs text-zinc-600 mb-2">Try searching for</p>
                  <div className="flex flex-wrap gap-2">
                    {SEARCH_EXAMPLES.map((s) => (
                      <button
                        key={s}
                        onClick={() => { setQuery(s); handleSearch(s); }}
                        className="px-3 py-1.5 bg-zinc-900/50 border border-zinc-800/50 rounded-full text-xs text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Loading Skeleton */}
            {searching && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 animate-pulse">
                    <div className="flex justify-between mb-3">
                      <div className="h-5 bg-zinc-800 rounded w-40" />
                      <div className="h-8 w-8 bg-zinc-800 rounded-full" />
                    </div>
                    <div className="h-3 bg-zinc-800 rounded w-24 mb-3" />
                    <div className="h-4 bg-zinc-800 rounded w-full mb-2" />
                    <div className="h-4 bg-zinc-800 rounded w-3/4" />
                  </div>
                ))}
              </div>
            )}

            {/* Results */}
            {!searching && results.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-zinc-500">
                    {results.length} results for &ldquo;{lastQuery}&rdquo;
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.map((result, idx) => (
                    <div
                      key={idx}
                      className={`bg-zinc-900 border rounded-lg p-5 transition-colors ${
                        savedIdxs.has(idx)
                          ? 'border-emerald-800/50 bg-emerald-950/10'
                          : 'border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-zinc-100 truncate">
                            {result.businessName}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            {result.category && (
                              <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                                {result.category}
                              </span>
                            )}
                            {result.location && (
                              <span className="text-xs text-zinc-600 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {result.location}
                              </span>
                            )}
                          </div>
                        </div>
                        <div
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0 ml-3 ${scoreColor(result.relevanceScore)} ${scoreBg(result.relevanceScore)}`}
                        >
                          {result.relevanceScore}
                        </div>
                      </div>

                      {/* Rationale */}
                      <p className="text-sm text-zinc-400 mb-3 line-clamp-2">
                        {result.aiRationale}
                      </p>

                      {/* Contact Info */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {result.website && (
                          <a
                            href={result.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 bg-zinc-800/50 px-2 py-1 rounded"
                          >
                            <Globe className="w-3 h-3" /> Website
                          </a>
                        )}
                        {result.instagram && (
                          <a
                            href={`https://instagram.com/${result.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 bg-zinc-800/50 px-2 py-1 rounded"
                          >
                            <Instagram className="w-3 h-3" /> {result.instagram}
                          </a>
                        )}
                        {result.email && (
                          <a
                            href={`mailto:${result.email}`}
                            className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 bg-zinc-800/50 px-2 py-1 rounded"
                          >
                            <Mail className="w-3 h-3" /> {result.email}
                          </a>
                        )}
                        {result.phone && (
                          <span className="text-xs text-zinc-500 flex items-center gap-1 bg-zinc-800/50 px-2 py-1 rounded">
                            <Phone className="w-3 h-3" /> {result.phone}
                          </span>
                        )}
                      </div>

                      {/* Outreach Message */}
                      <div className="mb-3">
                        <button
                          onClick={() =>
                            setExpandedOutreach(expandedOutreach === idx ? null : idx)
                          }
                          className="text-xs text-amber-500 hover:text-amber-400 flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" />
                          {expandedOutreach === idx ? 'Hide' : 'Show'} outreach message
                          <ChevronDown
                            className={`w-3 h-3 transition-transform ${
                              expandedOutreach === idx ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {expandedOutreach === idx && (
                          <div className="mt-2 bg-zinc-800/50 rounded-lg p-3 text-sm text-zinc-300 relative">
                            <p className="whitespace-pre-wrap pr-8">
                              {result.suggestedOutreach}
                            </p>
                            <button
                              onClick={() =>
                                copyOutreach(result.suggestedOutreach, idx)
                              }
                              className="absolute top-2 right-2 p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                              title="Copy to clipboard"
                            >
                              {copiedIdx === idx ? (
                                <Check className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {savedIdxs.has(idx) ? (
                          <span className="text-xs text-emerald-500 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Saved
                          </span>
                        ) : (
                          <button
                            onClick={() => saveProspect(result, idx)}
                            disabled={savingIdx === idx}
                            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                          >
                            {savingIdx === idx ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <UserPlus className="w-3 h-3" />
                            )}
                            Save Prospect
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── Prospects Tab ──────────────────────────────────── */}
        {tab === 'prospects' && (
          <div>
            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={prospectSearch}
                  onChange={(e) => setProspectSearch(e.target.value)}
                  placeholder="Search prospects..."
                  className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 text-sm"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 text-sm px-3 py-2 focus:outline-none focus:border-zinc-600"
              >
                <option value="">All statuses</option>
                {Object.entries(STATUS_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 text-sm px-3 py-2 focus:outline-none focus:border-zinc-600"
              >
                <option value="">All categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Prospects List */}
            {prospectsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-zinc-600" />
              </div>
            ) : prospects.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-500 mb-1">No prospects yet</p>
                <p className="text-zinc-600 text-sm">
                  Search for businesses and save them as prospects
                </p>
                <button
                  onClick={() => setTab('search')}
                  className="mt-4 text-sm text-amber-500 hover:text-amber-400"
                >
                  Start searching
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {prospects.map((prospect) => (
                  <div
                    key={prospect.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
                  >
                    {/* Main Row */}
                    <div
                      className="flex items-center gap-4 p-4 cursor-pointer"
                      onClick={() =>
                        setExpandedProspect(
                          expandedProspect === prospect.id ? null : prospect.id
                        )
                      }
                    >
                      {/* Score */}
                      {prospect.relevanceScore != null && (
                        <div
                          className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${scoreColor(prospect.relevanceScore)} ${scoreBg(prospect.relevanceScore)}`}
                        >
                          {prospect.relevanceScore}
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-zinc-200 truncate">
                            {prospect.businessName}
                          </h3>
                          {prospect.category && (
                            <span className="text-xs bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded flex-shrink-0">
                              {prospect.category}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          {prospect.location && (
                            <span className="text-xs text-zinc-600 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {prospect.location}
                            </span>
                          )}
                          <span className="text-xs text-zinc-700">
                            {timeAgo(prospect.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Status */}
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_COLORS[prospect.status]}`}
                      >
                        {STATUS_LABELS[prospect.status]}
                      </span>

                      <ChevronDown
                        className={`w-4 h-4 text-zinc-600 flex-shrink-0 transition-transform ${
                          expandedProspect === prospect.id ? 'rotate-180' : ''
                        }`}
                      />
                    </div>

                    {/* Expanded Details */}
                    {expandedProspect === prospect.id && (
                      <div className="border-t border-zinc-800 px-4 py-4 space-y-4">
                        {/* Rationale */}
                        {prospect.aiRationale && (
                          <div>
                            <p className="text-xs text-zinc-600 mb-1">AI Analysis</p>
                            <p className="text-sm text-zinc-400">
                              {prospect.aiRationale}
                            </p>
                          </div>
                        )}

                        {/* Contact */}
                        <div className="flex flex-wrap gap-2">
                          {prospect.website && (
                            <a
                              href={prospect.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 bg-zinc-800/50 px-2 py-1 rounded"
                            >
                              <Globe className="w-3 h-3" /> Website
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {prospect.instagram && (
                            <a
                              href={`https://instagram.com/${prospect.instagram.replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 bg-zinc-800/50 px-2 py-1 rounded"
                            >
                              <Instagram className="w-3 h-3" /> {prospect.instagram}
                            </a>
                          )}
                          {prospect.email && (
                            <a
                              href={`mailto:${prospect.email}`}
                              className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 bg-zinc-800/50 px-2 py-1 rounded"
                            >
                              <Mail className="w-3 h-3" /> {prospect.email}
                            </a>
                          )}
                          {prospect.phone && (
                            <span className="text-xs text-zinc-500 flex items-center gap-1 bg-zinc-800/50 px-2 py-1 rounded">
                              <Phone className="w-3 h-3" /> {prospect.phone}
                            </span>
                          )}
                        </div>

                        {/* Outreach */}
                        {prospect.suggestedOutreach && (
                          <div>
                            <p className="text-xs text-zinc-600 mb-1">
                              Suggested Outreach
                            </p>
                            <div className="bg-zinc-800/50 rounded-lg p-3 text-sm text-zinc-300 relative">
                              <p className="whitespace-pre-wrap pr-8">
                                {prospect.suggestedOutreach}
                              </p>
                              <button
                                onClick={() =>
                                  copyOutreach(
                                    prospect.suggestedOutreach!,
                                    prospect.id + 10000
                                  )
                                }
                                className="absolute top-2 right-2 p-1.5 text-zinc-500 hover:text-zinc-300"
                                title="Copy to clipboard"
                              >
                                {copiedIdx === prospect.id + 10000 ? (
                                  <Check className="w-4 h-4 text-emerald-400" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Source */}
                        {prospect.source && (
                          <p className="text-xs text-zinc-700">
                            Found via: &ldquo;{prospect.source}&rdquo;
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-2 border-t border-zinc-800/50">
                          {prospect.status === 'new' && (
                            <button
                              onClick={() =>
                                updateProspectStatus(prospect.id, 'contacted')
                              }
                              className="text-xs bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                            >
                              <ArrowRight className="w-3 h-3" /> Mark Contacted
                            </button>
                          )}
                          {prospect.status === 'contacted' && (
                            <button
                              onClick={() =>
                                updateProspectStatus(prospect.id, 'responded')
                              }
                              className="text-xs bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                            >
                              <ArrowRight className="w-3 h-3" /> Mark Responded
                            </button>
                          )}
                          {prospect.status !== 'converted' &&
                            prospect.status !== 'dismissed' && (
                              <button
                                onClick={() => convertToSponsor(prospect.id)}
                                disabled={convertingId === prospect.id}
                                className="text-xs bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                              >
                                {convertingId === prospect.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <UserPlus className="w-3 h-3" />
                                )}
                                Add to Sponsors
                              </button>
                            )}
                          {prospect.status !== 'dismissed' &&
                            prospect.status !== 'converted' && (
                              <button
                                onClick={() =>
                                  updateProspectStatus(prospect.id, 'dismissed')
                                }
                                className="text-xs text-zinc-600 hover:text-zinc-400 px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                              >
                                <X className="w-3 h-3" /> Dismiss
                              </button>
                            )}
                          <button
                            onClick={() => deleteProspect(prospect.id)}
                            className="text-xs text-red-600/60 hover:text-red-400 px-3 py-1.5 rounded flex items-center gap-1 transition-colors ml-auto"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
