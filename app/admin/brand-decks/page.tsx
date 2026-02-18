'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Palette, Plus, Pencil, Trash2, Loader2, X,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────

interface BrandDeck {
  id: number;
  title: string;
  status: string;
  currentStep: number;
  createdAt: string;
  updatedAt: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function BrandDecksPage() {
  const router = useRouter();
  const [decks, setDecks] = useState<BrandDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ─── Fetch Decks ──────────────────────────────────────────────

  const fetchDecks = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/brand-decks');
      if (res.ok) {
        const data = await res.json();
        setDecks(data.decks || []);
      }
    } catch {
      showToast('Failed to load brand decks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  // ─── Create Deck ──────────────────────────────────────────────

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/admin/brand-decks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim() }),
      });

      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || 'Failed to create deck');
        return;
      }

      const data = await res.json();
      router.push(`/admin/brand-decks/${data.deck.id}`);
    } catch {
      showToast('Failed to create brand deck');
    } finally {
      setCreating(false);
    }
  };

  // ─── Delete Deck ──────────────────────────────────────────────

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/brand-decks/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setDecks((prev) => prev.filter((d) => d.id !== id));
        setDeletingId(null);
        showToast('Brand deck deleted');
      } else {
        showToast('Failed to delete deck');
      }
    } catch {
      showToast('Failed to delete deck');
    }
  };

  // ─── Render ───────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-zinc-800 border border-zinc-700 text-zinc-200 px-4 py-3 rounded-lg shadow-lg text-sm">
          {toast}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
              <Palette className="w-6 h-6 text-amber-400" />
              Brand Decks
            </h1>
            <p className="text-zinc-500 mt-1">
              Create and manage brand identity decks
            </p>
          </div>
          <button
            onClick={() => setShowNewForm(true)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Brand Deck
          </button>
        </div>

        {/* New Deck Form */}
        {showNewForm && (
          <div className="mb-6 bg-zinc-900 border border-zinc-800 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-zinc-200">
                Create New Brand Deck
              </h2>
              <button
                onClick={() => {
                  setShowNewForm(false);
                  setNewTitle('');
                }}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                placeholder="Business or brand name..."
                className="flex-1 px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 text-sm"
                autoFocus
              />
              <button
                onClick={handleCreate}
                disabled={creating || !newTitle.trim()}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                {creating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 animate-pulse"
              >
                <div className="h-5 bg-zinc-800 rounded w-3/4 mb-3" />
                <div className="h-4 bg-zinc-800 rounded w-1/3 mb-3" />
                <div className="h-3 bg-zinc-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && decks.length === 0 && (
          <div className="text-center py-16">
            <Palette className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-400 mb-1">No brand decks yet.</p>
            <p className="text-zinc-600 text-sm">
              Create your first one!
            </p>
            <button
              onClick={() => setShowNewForm(true)}
              className="mt-4 text-sm text-amber-500 hover:text-amber-400 transition-colors"
            >
              Get started
            </button>
          </div>
        )}

        {/* Deck Grid */}
        {!loading && decks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {decks.map((deck) => (
              <div
                key={deck.id}
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-zinc-100 truncate flex-1 mr-2">
                    {deck.title}
                  </h3>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full flex-shrink-0 ${
                      deck.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    {deck.status === 'completed' ? 'Completed' : 'Draft'}
                  </span>
                </div>

                <p className="text-xs text-zinc-600 mb-4">
                  Created {formatDate(deck.createdAt)}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      router.push(`/admin/brand-decks/${deck.id}`)
                    }
                    className="flex items-center gap-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded transition-colors"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </button>

                  {deletingId === deck.id ? (
                    <div className="flex items-center gap-1 ml-auto">
                      <span className="text-xs text-red-400">Delete?</span>
                      <button
                        onClick={() => handleDelete(deck.id)}
                        className="text-xs text-red-400 hover:text-red-300 px-2 py-1 transition-colors font-medium"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1 transition-colors"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingId(deck.id)}
                      className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-red-400 px-3 py-1.5 rounded transition-colors ml-auto"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
