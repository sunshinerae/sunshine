'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Pencil, Trash2, X, ChevronUp, ChevronDown, Check,
} from 'lucide-react';

interface SponsorPackage {
  id: number;
  name: string;
  description: string | null;
  suggestedValue: number | null;
  benefits: string | null;
  isActive: boolean;
  displayOrder: number;
}

function safeParseBenefits(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<SponsorPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [suggestedValue, setSuggestedValue] = useState('');
  const [benefits, setBenefits] = useState<string[]>([]);
  const [newBenefit, setNewBenefit] = useState('');

  const fetchPackages = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/sponsors/packages');
      if (res.ok) {
        const data = await res.json();
        setPackages(data.packages);
      }
    } catch (err) {
      console.error('Failed to fetch packages:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPackages(); }, [fetchPackages]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setSuggestedValue('');
    setBenefits([]);
    setNewBenefit('');
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (pkg: SponsorPackage) => {
    setEditingId(pkg.id);
    setName(pkg.name);
    setDescription(pkg.description || '');
    setSuggestedValue(pkg.suggestedValue?.toString() || '');
    setBenefits(safeParseBenefits(pkg.benefits));
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      suggestedValue: suggestedValue ? parseInt(suggestedValue, 10) : null,
      benefits,
    };

    const url = editingId
      ? `/api/admin/sponsors/packages/${editingId}`
      : '/api/admin/sponsors/packages';

    const res = await fetch(url, {
      method: editingId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      resetForm();
      fetchPackages();
    }
  };

  const deletePackage = async (id: number) => {
    if (!confirm('Delete this package?')) return;
    await fetch(`/api/admin/sponsors/packages/${id}`, { method: 'DELETE' });
    fetchPackages();
  };

  const toggleActive = async (id: number, isActive: boolean) => {
    await fetch(`/api/admin/sponsors/packages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchPackages();
  };

  const movePackage = async (id: number, direction: 'up' | 'down') => {
    const idx = packages.findIndex((p) => p.id === id);
    if (idx < 0) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= packages.length) return;

    const currentOrder = packages[idx].displayOrder;
    const swapOrder = packages[swapIdx].displayOrder;

    await Promise.all([
      fetch(`/api/admin/sponsors/packages/${packages[idx].id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayOrder: swapOrder }),
      }),
      fetch(`/api/admin/sponsors/packages/${packages[swapIdx].id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayOrder: currentOrder }),
      }),
    ]);
    fetchPackages();
  };

  const addBenefit = () => {
    if (!newBenefit.trim()) return;
    setBenefits([...benefits, newBenefit.trim()]);
    setNewBenefit('');
  };

  const removeBenefit = (idx: number) => {
    setBenefits(benefits.filter((_, i) => i !== idx));
  };

  if (loading) {
    return <div className="text-center py-20 text-zinc-500">Loading packages...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 mb-1">Sponsorship Packages</h1>
          <p className="text-sm text-zinc-500">Define tiers and benefits for sponsor outreach</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={15} /> New Package
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-zinc-200">{editingId ? 'Edit Package' : 'New Package'}</h2>
            <button type="button" onClick={resetForm} className="text-zinc-500 hover:text-zinc-300"><X size={16} /></button>
          </div>

          <input
            type="text"
            placeholder="Package Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Suggested Value ($)"
              value={suggestedValue}
              onChange={(e) => setSuggestedValue(e.target.value)}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
            />
            <div />
          </div>

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 resize-none"
          />

          {/* Benefits */}
          <div>
            <p className="text-xs text-zinc-400 mb-2">Benefits</p>
            <div className="space-y-1.5 mb-2">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-2 bg-zinc-800/60 rounded px-2.5 py-1.5">
                  <Check size={12} className="text-emerald-500 flex-shrink-0" />
                  <span className="text-sm text-zinc-300 flex-1">{b}</span>
                  <button type="button" onClick={() => removeBenefit(i)} className="text-zinc-600 hover:text-red-400 transition-colors">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a benefit..."
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addBenefit(); } }}
                className="flex-1 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
              />
              <button type="button" onClick={addBenefit} className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded-lg text-sm transition-colors">
                Add
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors">
              {editingId ? 'Update' : 'Create'} Package
            </button>
          </div>
        </form>
      )}

      {/* Package Cards */}
      <div className="space-y-3">
        {packages.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 text-sm">
            No packages yet. Create your first sponsorship tier.
          </div>
        ) : (
          packages.map((pkg, idx) => {
            const benefitsList: string[] = safeParseBenefits(pkg.benefits);
            return (
              <div
                key={pkg.id}
                className={`bg-zinc-900/60 border rounded-xl p-5 transition-colors ${
                  pkg.isActive ? 'border-zinc-800' : 'border-zinc-800/50 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-base font-semibold text-zinc-100">{pkg.name}</h3>
                      {!pkg.isActive && (
                        <span className="text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">Inactive</span>
                      )}
                    </div>
                    {pkg.suggestedValue != null && (
                      <p className="text-sm text-emerald-400 font-medium">${pkg.suggestedValue.toLocaleString()}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => movePackage(pkg.id, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-zinc-600 hover:text-zinc-300 disabled:opacity-30 transition-colors"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      onClick={() => movePackage(pkg.id, 'down')}
                      disabled={idx === packages.length - 1}
                      className="p-1 text-zinc-600 hover:text-zinc-300 disabled:opacity-30 transition-colors"
                    >
                      <ChevronDown size={14} />
                    </button>
                    <button
                      onClick={() => toggleActive(pkg.id, pkg.isActive)}
                      className={`text-xs px-2 py-0.5 rounded transition-colors ${
                        pkg.isActive
                          ? 'text-emerald-400 hover:text-emerald-300'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {pkg.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <button onClick={() => startEdit(pkg)} className="p-1 text-zinc-600 hover:text-zinc-300 transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => deletePackage(pkg.id)} className="p-1 text-zinc-600 hover:text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {pkg.description && (
                  <p className="text-sm text-zinc-400 mb-3">{pkg.description}</p>
                )}

                {benefitsList.length > 0 && (
                  <ul className="space-y-1">
                    {benefitsList.map((b: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                        <Check size={12} className="text-emerald-500 flex-shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
