'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, Loader2, Sparkles, Plus, TrendingUp, Lightbulb, Target,
} from 'lucide-react';

interface ResearchResult {
  businessName: string;
  website: string | null;
  instagram: string | null;
  brandFitScore: number;
  rationale: string;
  suggestedApproach: string;
  keyInsights: string[];
  category: string;
}

export default function ResearchPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<ResearchResult[]>([]);
  const [adding, setAdding] = useState(false);

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/admin/sponsors/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: businessName.trim(),
          website: website.trim() || undefined,
          instagram: instagram.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Research failed');
      }

      const data = await res.json();
      setResult(data.research);
      setHistory((prev) => [data.research, ...prev.filter((r) => r.businessName !== data.research.businessName)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Research failed');
    } finally {
      setLoading(false);
    }
  };

  const addToPipeline = async () => {
    if (!result) return;
    setAdding(true);

    try {
      const res = await fetch('/api/admin/sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: result.businessName,
          website: result.website || null,
          instagram: result.instagram || null,
          category: result.category,
          brandFitScore: result.brandFitScore,
          brandFitRationale: result.rationale,
          stage: 'prospect',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/admin/sponsors/${data.sponsor.id}`);
      }
    } catch (err) {
      console.error('Failed to add sponsor:', err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-100 mb-1">AI Sponsor Research</h1>
        <p className="text-sm text-zinc-500">Research businesses for brand fit with The Sunshine Effect</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleResearch} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-3">
        <input
          type="text"
          placeholder="Business Name *"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="url"
            placeholder="Website URL (optional)"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
          />
          <input
            type="text"
            placeholder="Instagram handle (optional)"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !businessName.trim()}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Researching...
            </>
          ) : (
            <>
              <Search size={16} /> Research Business
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Research Result */}
      {result && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-zinc-100 mb-0.5">{result.businessName}</h2>
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                {result.category}
              </span>
            </div>
            <button
              onClick={addToPipeline}
              disabled={adding}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {adding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Add to Pipeline
            </button>
          </div>

          {/* Score */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-zinc-400 flex items-center gap-1"><Sparkles size={12} className="text-amber-400" /> Brand Fit Score</span>
              <span className="text-lg font-bold text-zinc-100">{result.brandFitScore}/100</span>
            </div>
            <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  result.brandFitScore >= 70 ? 'bg-emerald-500' :
                  result.brandFitScore >= 40 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${result.brandFitScore}%` }}
              />
            </div>
          </div>

          {/* Rationale */}
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <h3 className="text-xs font-medium text-zinc-400 mb-1.5 flex items-center gap-1"><TrendingUp size={12} /> Why They Fit</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">{result.rationale}</p>
          </div>

          {/* Approach */}
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <h3 className="text-xs font-medium text-zinc-400 mb-1.5 flex items-center gap-1"><Target size={12} /> Suggested Approach</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">{result.suggestedApproach}</p>
          </div>

          {/* Key Insights */}
          {result.keyInsights?.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-zinc-400 mb-2 flex items-center gap-1"><Lightbulb size={12} /> Key Insights</h3>
              <ul className="space-y-1.5">
                {result.keyInsights.map((insight, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0" />
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Research History */}
      {history.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-zinc-400 mb-3">Recent Research</h3>
          <div className="space-y-2">
            {history.map((r, i) => (
              <button
                key={i}
                onClick={() => setResult(r)}
                className="w-full text-left bg-zinc-900/40 border border-zinc-800 rounded-lg p-3 hover:border-zinc-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-zinc-200">{r.businessName}</span>
                    <span className="text-xs text-zinc-500 ml-2">{r.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-12 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          r.brandFitScore >= 70 ? 'bg-emerald-500' :
                          r.brandFitScore >= 40 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${r.brandFitScore}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-zinc-400">{r.brandFitScore}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
