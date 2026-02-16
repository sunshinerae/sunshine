'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  Star,
  Copy,
  X,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Mail,
  MessageSquare,
  Send,
  Upload,
  ChevronDown,
  Clock,
  Check,
  LogOut,
  Users,
  TrendingUp,
  Activity,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────

interface PersonTag {
  id: number;
  name: string;
  color: string | null;
  personTagId?: number;
}

interface PersonNote {
  id: number;
  personId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface TimelineEntry {
  type: string;
  date: string;
  detail: string;
}

interface AttendanceInsights {
  totalCheckins: number;
  favoriteEventType: string | null;
  firstEvent: string | null;
  lastEvent: string | null;
  streak: string;
}

interface Person {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  photoUrl: string | null;
  starred: boolean;
  lastReachedOut: string | null;
  createdAt: string;
  updatedAt: string;
  tags: PersonTag[];
  notePreview: string | null;
  sources: string[];
  lastActivity: string;
}

interface PersonDetail {
  person: Person;
  tags: PersonTag[];
  notes: PersonNote[];
  timeline: TimelineEntry[];
  attendanceInsights: AttendanceInsights;
}

interface Tag {
  id: number;
  name: string;
  color: string | null;
  count: number;
}

interface Stats {
  totalPeople: number;
  newThisMonth: number;
  eventsThisMonth: number;
  nudges: {
    noNotes: { count: number; sample: Array<{ id: number; firstName: string | null; lastName: string | null; email: string }> };
    noTags: { count: number };
    starredNotReachedOut: { count: number; people: Array<{ id: number; firstName: string | null; lastName: string | null }> };
    goneQuiet: { count: number; people: Array<{ id: number; firstName: string | null; lastName: string | null }> };
  };
}

// ─── Helpers ────────────────────────────────────────────────────

function timeAgo(date: string | Date): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = now - then;

  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;

  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

function getInitials(firstName: string | null, lastName: string | null): string {
  const f = firstName?.charAt(0)?.toUpperCase() || '';
  const l = lastName?.charAt(0)?.toUpperCase() || '';
  return f + l || '?';
}

function getInitialColor(name: string): string {
  const colors = [
    'bg-blue-600', 'bg-emerald-600', 'bg-violet-600', 'bg-rose-600',
    'bg-amber-600', 'bg-cyan-600', 'bg-pink-600', 'bg-indigo-600',
    'bg-teal-600', 'bg-orange-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function displayName(person: { firstName: string | null; lastName: string | null; email: string }): string {
  const parts = [person.firstName, person.lastName].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : person.email;
}

function sourceLabel(source: string): string {
  const map: Record<string, string> = {
    newsletter: 'Newsletter',
    sms: 'SMS',
    'glow-notes': 'Glow Notes',
    guide: 'Guide',
    waitlist: 'Waitlist',
    launch: 'Launch',
    'event-checkin': 'Event',
    'contact-form': 'Contact',
  };
  return map[source] || source;
}

function sourceColor(source: string): string {
  const map: Record<string, string> = {
    newsletter: 'bg-blue-500/20 text-blue-400',
    sms: 'bg-green-500/20 text-green-400',
    'glow-notes': 'bg-purple-500/20 text-purple-400',
    guide: 'bg-orange-500/20 text-orange-400',
    waitlist: 'bg-cyan-500/20 text-cyan-400',
    launch: 'bg-pink-500/20 text-pink-400',
    'event-checkin': 'bg-amber-500/20 text-amber-400',
    'contact-form': 'bg-rose-500/20 text-rose-400',
  };
  return map[source] || 'bg-zinc-700 text-zinc-300';
}

function timelineIcon(type: string) {
  switch (type) {
    case 'subscription': return <Mail className="w-4 h-4 text-blue-400" />;
    case 'event-checkin': return <Calendar className="w-4 h-4 text-amber-400" />;
    case 'contact': return <MessageSquare className="w-4 h-4 text-rose-400" />;
    case 'note': return <Pencil className="w-4 h-4 text-zinc-400" />;
    case 'reached-out': return <Send className="w-4 h-4 text-emerald-400" />;
    default: return <Clock className="w-4 h-4 text-zinc-500" />;
  }
}

// ─── Main Component ─────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter();

  // Toast state
  const [toast, setToast] = useState<string | null>(null);
  const toastTimeout = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToast(null), 2000);
  }, []);

  // Data state
  const [stats, setStats] = useState<Stats | null>(null);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [totalPeople, setTotalPeople] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sort, setSort] = useState<'activity' | 'newest' | 'starred'>('newest');
  const [sortOpen, setSortOpen] = useState(false);

  // Detail panel state
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
  const [personDetail, setPersonDetail] = useState<PersonDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // ─── Data Fetching ──────────────────────────────────────────

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.status === 401) { router.push('/admin/login'); return; }
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, [router]);

  const fetchTags = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/tags');
      if (res.ok) {
        const data = await res.json();
        setAllTags(data.tags);
      }
    } catch (err) {
      console.error('Failed to fetch tags:', err);
    }
  }, []);

  const fetchPeople = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (activeTag) params.set('tag', activeTag);
      params.set('sort', sort);

      const res = await fetch(`/api/admin/people?${params.toString()}`);
      if (res.status === 401) { router.push('/admin/login'); return; }
      if (res.ok) {
        const data = await res.json();
        setPeople(data.people);
        setTotalPeople(data.total);
      }
    } catch (err) {
      console.error('Failed to fetch people:', err);
    }
  }, [search, activeTag, sort, router]);

  const fetchPersonDetail = useCallback(async (id: number) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/admin/people/${id}`);
      if (res.ok) {
        const data = await res.json();
        setPersonDetail(data);
      }
    } catch (err) {
      console.error('Failed to fetch person detail:', err);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    Promise.all([fetchStats(), fetchTags(), fetchPeople()]).finally(() =>
      setLoading(false)
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-fetch people on filter changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchPeople();
    }, search ? 300 : 0); // Debounce search input
    return () => clearTimeout(timeout);
  }, [search, activeTag, sort, fetchPeople]);

  // Fetch detail when person is selected
  useEffect(() => {
    if (selectedPersonId !== null) {
      fetchPersonDetail(selectedPersonId);
    }
  }, [selectedPersonId, fetchPersonDetail]);

  // ─── Actions ────────────────────────────────────────────────

  const handleSignOut = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  const handleCopyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      showToast('Copied!');
    } catch {
      showToast('Failed to copy');
    }
  };

  const handleToggleStar = async (person: Person, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newStarred = !person.starred;

    // Optimistic update in list
    setPeople((prev) =>
      prev.map((p) => (p.id === person.id ? { ...p, starred: newStarred } : p))
    );
    // Optimistic update in detail
    if (personDetail && personDetail.person.id === person.id) {
      setPersonDetail((prev) =>
        prev ? { ...prev, person: { ...prev.person, starred: newStarred } } : prev
      );
    }

    try {
      await fetch(`/api/admin/people/${person.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ starred: newStarred }),
      });
    } catch {
      // Revert on failure
      setPeople((prev) =>
        prev.map((p) => (p.id === person.id ? { ...p, starred: !newStarred } : p))
      );
    }
  };

  const handleReachedOut = async () => {
    if (!personDetail) return;
    const now = new Date().toISOString();

    setPersonDetail((prev) =>
      prev ? { ...prev, person: { ...prev.person, lastReachedOut: now } } : prev
    );

    try {
      await fetch(`/api/admin/people/${personDetail.person.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lastReachedOut: now }),
      });
      showToast('Marked as reached out');
      fetchPersonDetail(personDetail.person.id);
    } catch {
      showToast('Failed to update');
    }
  };

  // ─── Photo Upload ───────────────────────────────────────────

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!personDetail || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('personId', String(personDetail.person.id));

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        setPersonDetail((prev) =>
          prev ? { ...prev, person: { ...prev.person, photoUrl: data.url } } : prev
        );
        setPeople((prev) =>
          prev.map((p) =>
            p.id === personDetail.person.id ? { ...p, photoUrl: data.url } : p
          )
        );
        showToast('Photo uploaded');
      }
    } catch {
      showToast('Upload failed');
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ─── Notes ──────────────────────────────────────────────────

  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editingNoteContent, setEditingNoteContent] = useState('');
  const [deletingNoteId, setDeletingNoteId] = useState<number | null>(null);

  const handleAddNote = async () => {
    if (!personDetail || !newNote.trim()) return;
    try {
      const res = await fetch(`/api/admin/people/${personDetail.person.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote.trim() }),
      });
      if (res.ok) {
        setNewNote('');
        fetchPersonDetail(personDetail.person.id);
        fetchPeople();
        showToast('Note added');
      }
    } catch {
      showToast('Failed to add note');
    }
  };

  const handleUpdateNote = async (noteId: number) => {
    if (!personDetail || !editingNoteContent.trim()) return;
    try {
      const res = await fetch(
        `/api/admin/people/${personDetail.person.id}/notes/${noteId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: editingNoteContent.trim() }),
        }
      );
      if (res.ok) {
        setEditingNoteId(null);
        setEditingNoteContent('');
        fetchPersonDetail(personDetail.person.id);
        fetchPeople();
        showToast('Note updated');
      }
    } catch {
      showToast('Failed to update note');
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!personDetail) return;
    try {
      const res = await fetch(
        `/api/admin/people/${personDetail.person.id}/notes/${noteId}`,
        { method: 'DELETE' }
      );
      if (res.ok) {
        setDeletingNoteId(null);
        fetchPersonDetail(personDetail.person.id);
        fetchPeople();
        showToast('Note deleted');
      }
    } catch {
      showToast('Failed to delete note');
    }
  };

  // ─── Tags (detail panel) ───────────────────────────────────

  const [newTag, setNewTag] = useState('');

  const handleAddTag = async () => {
    if (!personDetail || !newTag.trim()) return;
    try {
      const res = await fetch(`/api/admin/people/${personDetail.person.id}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tagName: newTag.trim() }),
      });
      if (res.ok) {
        setNewTag('');
        fetchPersonDetail(personDetail.person.id);
        fetchTags();
        fetchPeople();
        showToast('Tag added');
      }
    } catch {
      showToast('Failed to add tag');
    }
  };

  const handleRemoveTag = async (tagId: number) => {
    if (!personDetail) return;
    try {
      const res = await fetch(
        `/api/admin/people/${personDetail.person.id}/tags?tagId=${tagId}`,
        { method: 'DELETE' }
      );
      if (res.ok) {
        fetchPersonDetail(personDetail.person.id);
        fetchTags();
        fetchPeople();
        showToast('Tag removed');
      }
    } catch {
      showToast('Failed to remove tag');
    }
  };

  // ─── Sort dropdown close on outside click ───────────────────

  const sortRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!sortOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [sortOpen]);

  // ─── Build nudge messages ──────────────────────────────────

  const nudgeMessages: Array<{ message: string }> = [];
  if (stats) {
    if (stats.nudges.noNotes.count > 0) {
      nudgeMessages.push({
        message: `${stats.nudges.noNotes.count} ${stats.nudges.noNotes.count === 1 ? 'person has' : 'people have'} no notes yet`,
      });
    }
    if (stats.nudges.noTags.count > 0) {
      nudgeMessages.push({
        message: `${stats.nudges.noTags.count} ${stats.nudges.noTags.count === 1 ? 'person has' : 'people have'} no tags`,
      });
    }
    if (stats.nudges.starredNotReachedOut.count > 0) {
      nudgeMessages.push({
        message: `${stats.nudges.starredNotReachedOut.count} starred ${stats.nudges.starredNotReachedOut.count === 1 ? 'person' : 'people'} not reached out to in 4+ weeks`,
      });
    }
    if (stats.nudges.goneQuiet.count > 0) {
      nudgeMessages.push({
        message: `${stats.nudges.goneQuiet.count} ${stats.nudges.goneQuiet.count === 1 ? 'regular has' : 'regulars have'} gone quiet (30+ days)`,
      });
    }
  }

  // ─── Streak badge ─────────────────────────────────────────

  function streakBadge(streak: string) {
    switch (streak) {
      case 'regular':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400">
            Regular
          </span>
        );
      case 'occasional':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400">
            Occasional
          </span>
        );
      case 'subscriber-only':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-700 text-zinc-300">
            Subscriber only
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-700 text-zinc-300">
            One-timer
          </span>
        );
    }
  }

  // ─── Render ─────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-600 border-t-zinc-300 rounded-full animate-spin" />
      </div>
    );
  }

  const sortLabels: Record<string, string> = {
    activity: 'Recent Activity',
    newest: 'Newest',
    starred: 'Starred First',
  };

  return (
    <div className="min-h-screen">
      {/* ── Toast ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-[100] bg-zinc-800 border border-zinc-700 text-zinc-100 px-4 py-2 rounded-lg shadow-lg text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top Bar ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-zinc-100">Sunshine Admin</h1>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600 rounded-lg px-3 py-1.5"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ── Dashboard Stats ─────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
              <Users className="w-4 h-4" />
              Total People
            </div>
            <div className="text-3xl font-bold text-zinc-100">
              {stats?.totalPeople ?? 0}
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
              <TrendingUp className="w-4 h-4" />
              New This Month
            </div>
            <div className="text-3xl font-bold text-zinc-100">
              {stats?.newThisMonth ?? 0}
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
              <Activity className="w-4 h-4" />
              Events This Month
            </div>
            <div className="text-3xl font-bold text-zinc-100">
              {stats?.eventsThisMonth ?? 0}
            </div>
          </div>
        </div>

        {/* ── Smart Nudges ────────────────────────────────────── */}
        {nudgeMessages.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
            {nudgeMessages.map((nudge, i) => (
              <div
                key={i}
                className="flex-shrink-0 bg-amber-500/10 text-amber-400 text-sm px-4 py-2 rounded-full border border-amber-500/20"
              >
                {nudge.message}
              </div>
            ))}
          </div>
        )}

        {/* ── Search + Filters ────────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-colors text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort dropdown */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="h-10 px-4 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm flex items-center gap-2 hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600 whitespace-nowrap"
              >
                {sortLabels[sort]}
                <ChevronDown className={`w-4 h-4 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
              </button>
              {sortOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-20 overflow-hidden">
                  {(Object.entries(sortLabels) as [string, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSort(key as 'activity' | 'newest' | 'starred');
                        setSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        sort === key
                          ? 'bg-zinc-800 text-zinc-100'
                          : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tag filter chips */}
          {allTags.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setActiveTag(null)}
                className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  activeTag === null
                    ? 'bg-zinc-700 border-zinc-600 text-zinc-100'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setActiveTag(activeTag === tag.name ? null : tag.name)}
                  className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    activeTag === tag.name
                      ? 'bg-zinc-700 border-zinc-600 text-zinc-100'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  {tag.name} ({tag.count})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── People List ─────────────────────────────────────── */}
        <div className="space-y-2">
          <div className="text-xs text-zinc-500 px-1">
            {totalPeople} {totalPeople === 1 ? 'person' : 'people'}
          </div>

          {people.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-12 text-center text-zinc-500">
              No people found
            </div>
          ) : (
            <div className="space-y-1">
              {people.map((person) => (
                <button
                  key={person.id}
                  onClick={() => setSelectedPersonId(person.id)}
                  className={`w-full text-left bg-zinc-900 border rounded-lg p-4 hover:bg-zinc-800/70 transition-colors group ${
                    selectedPersonId === person.id
                      ? 'border-zinc-600'
                      : 'border-zinc-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {person.photoUrl ? (
                        <img
                          src={person.photoUrl}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium text-white ${getInitialColor(
                            person.email
                          )}`}
                        >
                          {getInitials(person.firstName, person.lastName)}
                        </div>
                      )}
                    </div>

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-zinc-100 text-sm">
                          {displayName(person)}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-zinc-400 text-sm truncate">
                            {person.email}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyEmail(person.email);
                            }}
                            className="text-zinc-600 hover:text-zinc-400 transition-colors opacity-0 group-hover:opacity-100"
                            title="Copy email"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {person.phone && (
                          <span className="text-zinc-500 text-sm">
                            {person.phone}
                          </span>
                        )}
                      </div>

                      {/* Sources + Tags */}
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        {person.sources.map((source) => (
                          <span
                            key={source}
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${sourceColor(source)}`}
                          >
                            {sourceLabel(source)}
                          </span>
                        ))}
                        {person.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-zinc-700/50 text-zinc-300"
                            style={
                              tag.color
                                ? {
                                    backgroundColor: `${tag.color}20`,
                                    color: tag.color,
                                  }
                                : undefined
                            }
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>

                      {/* Note preview */}
                      {person.notePreview && (
                        <p className="text-zinc-500 text-xs italic mt-1 truncate">
                          {person.notePreview}
                        </p>
                      )}
                    </div>

                    {/* Right side: star + time */}
                    <div className="flex-shrink-0 flex flex-col items-end gap-1">
                      <button
                        onClick={(e) => handleToggleStar(person, e)}
                        className="transition-colors focus:outline-none"
                        title={person.starred ? 'Unstar' : 'Star'}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            person.starred
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-zinc-600 hover:text-zinc-400'
                          }`}
                        />
                      </button>
                      <span className="text-zinc-500 text-xs whitespace-nowrap">
                        {timeAgo(person.lastActivity)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Detail Panel (slide-out) ──────────────────────────── */}
      <AnimatePresence>
        {selectedPersonId !== null && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedPersonId(null);
                setPersonDetail(null);
                setEditingNoteId(null);
                setDeletingNoteId(null);
                setNewNote('');
                setNewTag('');
              }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />

            {/* Panel */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-zinc-950 border-l border-zinc-800 z-50 overflow-y-auto"
            >
              {detailLoading || !personDetail ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-6 h-6 border-2 border-zinc-600 border-t-zinc-300 rounded-full animate-spin" />
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {/* Panel Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {/* Avatar (clickable for upload) */}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="relative group flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-zinc-600 rounded-full"
                        title="Upload photo"
                      >
                        {personDetail.person.photoUrl ? (
                          <img
                            src={personDetail.person.photoUrl}
                            alt=""
                            className="w-20 h-20 rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-medium text-white ${getInitialColor(
                              personDetail.person.email
                            )}`}
                          >
                            {getInitials(
                              personDetail.person.firstName,
                              personDetail.person.lastName
                            )}
                          </div>
                        )}
                        <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Upload className="w-5 h-5 text-white" />
                        </div>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />

                      <div className="min-w-0">
                        <h2 className="text-lg font-semibold text-zinc-100">
                          {displayName(personDetail.person)}
                        </h2>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-zinc-400 text-sm truncate">
                            {personDetail.person.email}
                          </span>
                          <button
                            onClick={() =>
                              handleCopyEmail(personDetail.person.email)
                            }
                            className="text-zinc-500 hover:text-zinc-300 transition-colors"
                            title="Copy email"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {personDetail.person.phone && (
                          <p className="text-zinc-500 text-sm mt-0.5">
                            {personDetail.person.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedPersonId(null);
                        setPersonDetail(null);
                        setEditingNoteId(null);
                        setDeletingNoteId(null);
                        setNewNote('');
                        setNewTag('');
                      }}
                      className="text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600 rounded-lg p-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Star + Reached Out */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleStar(personDetail.person)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors border ${
                        personDetail.person.starred
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          personDetail.person.starred ? 'fill-amber-400' : ''
                        }`}
                      />
                      {personDetail.person.starred ? 'Starred' : 'Star'}
                    </button>

                    <button
                      onClick={handleReachedOut}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      Reached out
                    </button>

                    {personDetail.person.lastReachedOut && (
                      <span className="text-zinc-500 text-xs">
                        Last: {timeAgo(personDetail.person.lastReachedOut)}
                      </span>
                    )}
                  </div>

                  {/* ── Attendance ─────────────────────────────── */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-zinc-300">Attendance</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                        <div className="text-zinc-500 text-xs">Total Events</div>
                        <div className="text-lg font-semibold text-zinc-100">
                          {personDetail.attendanceInsights.totalCheckins}
                        </div>
                      </div>
                      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                        <div className="text-zinc-500 text-xs">Favorite Type</div>
                        <div className="text-sm font-medium text-zinc-100 truncate">
                          {personDetail.attendanceInsights.favoriteEventType || '--'}
                        </div>
                      </div>
                      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                        <div className="text-zinc-500 text-xs">First Event</div>
                        <div className="text-sm font-medium text-zinc-100">
                          {personDetail.attendanceInsights.firstEvent
                            ? timeAgo(personDetail.attendanceInsights.firstEvent)
                            : '--'}
                        </div>
                      </div>
                      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                        <div className="text-zinc-500 text-xs">Last Event</div>
                        <div className="text-sm font-medium text-zinc-100">
                          {personDetail.attendanceInsights.lastEvent
                            ? timeAgo(personDetail.attendanceInsights.lastEvent)
                            : '--'}
                        </div>
                      </div>
                    </div>
                    <div>
                      {streakBadge(personDetail.attendanceInsights.streak)}
                    </div>
                  </div>

                  {/* ── Tags ───────────────────────────────────── */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-zinc-300">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {personDetail.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300"
                          style={
                            tag.color
                              ? {
                                  backgroundColor: `${tag.color}20`,
                                  color: tag.color,
                                }
                              : undefined
                          }
                        >
                          {tag.name}
                          <button
                            onClick={() => handleRemoveTag(tag.id)}
                            className="text-current opacity-60 hover:opacity-100 transition-opacity"
                            title="Remove tag"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add tag..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        className="flex-1 h-8 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-colors"
                      />
                      <button
                        onClick={handleAddTag}
                        disabled={!newTag.trim()}
                        className="h-8 px-3 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add
                      </button>
                    </div>
                  </div>

                  {/* ── Notes ──────────────────────────────────── */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-zinc-300">Notes</h3>

                    {/* Add note */}
                    <div className="space-y-2">
                      <textarea
                        placeholder="Add a note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-colors resize-none"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={handleAddNote}
                          disabled={!newNote.trim()}
                          className="h-8 px-4 rounded-lg bg-zinc-100 text-zinc-900 text-sm font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add note
                        </button>
                      </div>
                    </div>

                    {/* Existing notes */}
                    <div className="space-y-2">
                      {personDetail.notes.map((note) => (
                        <div
                          key={note.id}
                          className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 space-y-2"
                        >
                          {editingNoteId === note.id ? (
                            <>
                              <textarea
                                value={editingNoteContent}
                                onChange={(e) =>
                                  setEditingNoteContent(e.target.value)
                                }
                                rows={3}
                                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-colors resize-none"
                                autoFocus
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setEditingNoteId(null);
                                    setEditingNoteContent('');
                                  }}
                                  className="h-7 px-3 rounded-lg text-zinc-400 hover:text-zinc-100 text-xs transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleUpdateNote(note.id)}
                                  disabled={!editingNoteContent.trim()}
                                  className="h-7 px-3 rounded-lg bg-zinc-100 text-zinc-900 text-xs font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50"
                                >
                                  Save
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <p className="text-zinc-300 text-sm whitespace-pre-wrap">
                                {note.content}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-zinc-600 text-xs">
                                  {timeAgo(note.createdAt)}
                                </span>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => {
                                      setEditingNoteId(note.id);
                                      setEditingNoteContent(note.content);
                                    }}
                                    className="text-zinc-600 hover:text-zinc-400 transition-colors p-1"
                                    title="Edit note"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  {deletingNoteId === note.id ? (
                                    <div className="flex items-center gap-1">
                                      <span className="text-xs text-red-400">
                                        Delete?
                                      </span>
                                      <button
                                        onClick={() =>
                                          handleDeleteNote(note.id)
                                        }
                                        className="text-red-400 hover:text-red-300 transition-colors p-1 text-xs font-medium"
                                      >
                                        Yes
                                      </button>
                                      <button
                                        onClick={() =>
                                          setDeletingNoteId(null)
                                        }
                                        className="text-zinc-500 hover:text-zinc-300 transition-colors p-1 text-xs"
                                      >
                                        No
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        setDeletingNoteId(note.id)
                                      }
                                      className="text-zinc-600 hover:text-red-400 transition-colors p-1"
                                      title="Delete note"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                      {personDetail.notes.length === 0 && (
                        <p className="text-zinc-600 text-sm text-center py-4">
                          No notes yet
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ── Timeline ───────────────────────────────── */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-zinc-300">Timeline</h3>
                    {personDetail.timeline.length > 0 ? (
                      <div className="space-y-0">
                        {personDetail.timeline.map((entry, i) => (
                          <div key={i} className="flex gap-3 py-2.5">
                            <div className="flex-shrink-0 mt-0.5">
                              {timelineIcon(entry.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-zinc-300 text-sm">
                                {entry.detail}
                              </p>
                              <p className="text-zinc-600 text-xs mt-0.5">
                                {timeAgo(entry.date)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-zinc-600 text-sm text-center py-4">
                        No activity yet
                      </p>
                    )}
                  </div>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
