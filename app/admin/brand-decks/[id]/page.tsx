'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, Check, Loader2, Upload, RefreshCw,
  ClipboardList, Sparkles, Heart, Users, MessageSquare,
  Palette, Moon, Layout, Zap, Eye, Download,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────

interface BrandDeck {
  id: number;
  title: string;
  status: string;
  currentStep: number;
  intake: string | null;
  identity: string | null;
  audience: string | null;
  voice: string | null;
  visuals: string | null;
  applications: string | null;
  motion: string | null;
  images: string | null;
  createdAt: string;
  updatedAt: string;
}

interface IntakeData {
  businessName: string;
  industry: string;
  keywords: string;
  about: string;
  targetCustomer: string;
  existingCopy: string;
  logoFilename: string;
  logoDataUrl: string;
}

const INDUSTRIES = [
  'Wellness', 'Beauty', 'Fashion', 'Food & Beverage', 'Fitness',
  'Lifestyle', 'Tech', 'Creative', 'Retail', 'Services', 'Other',
];

const GENERATION_MESSAGES = [
  'Crafting your brand story...',
  'Designing color palettes...',
  'Building audience personas...',
  'Defining your voice...',
  'Almost there...',
];

// ─── Foundation Types ─────────────────────────────────────────

interface FoundationIdentity {
  brandStory: string;
  mission: string;
  vision: string;
  values: { name: string; description: string }[];
  personalityTraits: string[];
}

interface FoundationVoice {
  taglines: string[];
  elevatorPitch: string;
  toneAttributes: string[];
  dos: string[];
  donts: string[];
  examplePhrases: string[];
}

interface FoundationVisuals {
  palettes: {
    name: string;
    psychology: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
  }[];
  fontPairings: {
    heading: string;
    body: string;
    rationale: string;
  }[];
}

interface FoundationAudience {
  personas: {
    name: string;
    ageRange: string;
    occupation: string;
    location: string;
    painPoints: string[];
    goals: string[];
    channels: string[];
  }[];
}

// ─── Wizard Steps ───────────────────────────────────────────────

const WIZARD_STEPS = [
  { key: 'intake', label: 'Intake', icon: ClipboardList },
  { key: 'foundation', label: 'AI Foundation', icon: Sparkles },
  { key: 'identity', label: 'Core Identity', icon: Heart },
  { key: 'audience', label: 'Audience', icon: Users },
  { key: 'voice', label: 'Voice & Messaging', icon: MessageSquare },
  { key: 'visuals', label: 'Visual System', icon: Palette },
  { key: 'darkMode', label: 'Dark Mode', icon: Moon },
  { key: 'applications', label: 'Applications', icon: Layout },
  { key: 'motion', label: 'Motion', icon: Zap },
  { key: 'preview', label: 'Preview', icon: Eye },
  { key: 'export', label: 'Export', icon: Download },
];

export default function BrandDeckWizardPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [deck, setDeck] = useState<BrandDeck | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // ─── Intake Form State ─────────────────────────────────────────
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [keywords, setKeywords] = useState('');
  const [about, setAbout] = useState('');
  const [targetCustomer, setTargetCustomer] = useState('');
  const [existingCopy, setExistingCopy] = useState('');
  const [logoFilename, setLogoFilename] = useState('');
  const [logoDataUrl, setLogoDataUrl] = useState('');
  const [intakeErrors, setIntakeErrors] = useState<Record<string, string>>({});

  // ─── Foundation State ──────────────────────────────────────────
  const [generating, setGenerating] = useState(false);
  const [generationMsgIndex, setGenerationMsgIndex] = useState(0);
  const generationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ─── Fetch Deck ───────────────────────────────────────────────

  const fetchDeck = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/brand-decks/${id}`);
      if (!res.ok) {
        showToast('Failed to load brand deck');
        return;
      }

      const data = await res.json();
      setDeck(data.deck);
      setActiveStep(data.deck.currentStep || 0);
    } catch {
      showToast('Failed to load brand deck');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDeck();
  }, [fetchDeck]);

  // ─── Hydrate Intake Form from Deck ──────────────────────────────
  useEffect(() => {
    if (!deck) return;

    // Pre-fill business name from title if no intake data
    if (!deck.intake) {
      setBusinessName(deck.title || '');
      return;
    }

    try {
      const data: IntakeData =
        typeof deck.intake === 'string' ? JSON.parse(deck.intake) : deck.intake;
      setBusinessName(data.businessName || deck.title || '');
      setIndustry(data.industry || '');
      setKeywords(data.keywords || '');
      setAbout(data.about || '');
      setTargetCustomer(data.targetCustomer || '');
      setExistingCopy(data.existingCopy || '');
      setLogoFilename(data.logoFilename || '');
      setLogoDataUrl(data.logoDataUrl || '');
    } catch {
      setBusinessName(deck.title || '');
    }
  }, [deck?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Logo Handler ────────────────────────────────────────────
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFilename(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setLogoDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // ─── Foundation Generation ──────────────────────────────────────

  const handleGenerateFoundation = async () => {
    if (!deck) return;

    setGenerating(true);
    setGenerationMsgIndex(0);

    // Cycle through progress messages
    generationIntervalRef.current = setInterval(() => {
      setGenerationMsgIndex((prev) =>
        prev < GENERATION_MESSAGES.length - 1 ? prev + 1 : prev
      );
    }, 5000);

    try {
      const res = await fetch(`/api/admin/brand-decks/${id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 'foundation' }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Generation failed');
        return;
      }

      const data = await res.json();
      setDeck(data.deck);
      showToast('Brand foundation generated!');
    } catch {
      showToast('Generation failed — please try again');
    } finally {
      setGenerating(false);
      if (generationIntervalRef.current) {
        clearInterval(generationIntervalRef.current);
        generationIntervalRef.current = null;
      }
    }
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (generationIntervalRef.current) {
        clearInterval(generationIntervalRef.current);
      }
    };
  }, []);

  // ─── Intake Validation ─────────────────────────────────────────
  const validateIntake = (): boolean => {
    const errors: Record<string, string> = {};
    if (!businessName.trim()) errors.businessName = 'Business name is required';
    if (!industry) errors.industry = 'Industry is required';
    setIntakeErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ─── Navigation ───────────────────────────────────────────────

  const handleNext = async () => {
    if (!deck) return;
    if (activeStep >= WIZARD_STEPS.length - 1) return;

    // Validate intake step before proceeding
    if (activeStep === 0 && !validateIntake()) return;

    const nextStep = activeStep + 1;

    setSaving(true);
    try {
      // Build the payload
      const payload: Record<string, unknown> = {};

      // Always save intake data when leaving intake step
      if (activeStep === 0) {
        payload.intake = {
          businessName: businessName.trim(),
          industry,
          keywords: keywords.trim(),
          about: about.trim(),
          targetCustomer: targetCustomer.trim(),
          existingCopy: existingCopy.trim(),
          logoFilename,
          logoDataUrl,
        };
      }

      // Update currentStep if advancing beyond the saved step
      if (nextStep > deck.currentStep) {
        payload.currentStep = nextStep;
      }

      if (Object.keys(payload).length > 0) {
        const res = await fetch(`/api/admin/brand-decks/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          showToast('Failed to save progress');
          return;
        }

        const data = await res.json();
        setDeck(data.deck);
      }
    } catch {
      showToast('Failed to save progress');
      return;
    } finally {
      setSaving(false);
    }

    setActiveStep(nextStep);
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (!deck) return;
    // Can only click completed steps or the current frontier
    if (stepIndex <= deck.currentStep) {
      setActiveStep(stepIndex);
    }
  };

  // ─── Foundation Step Renderer ──────────────────────────────────

  const renderFoundationStep = () => {
    if (!deck) return null;

    // Parse stored JSON
    const identity: FoundationIdentity | null = deck.identity ? JSON.parse(deck.identity) : null;
    const voice: FoundationVoice | null = deck.voice ? JSON.parse(deck.voice) : null;
    const visuals: FoundationVisuals | null = deck.visuals ? JSON.parse(deck.visuals) : null;
    const audience: FoundationAudience | null = deck.audience ? JSON.parse(deck.audience) : null;

    const hasData = identity && voice && visuals && audience;

    // ── State 2: Generating ──
    if (generating) {
      return (
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <Loader2 className="w-12 h-12 animate-spin text-amber-500" />
          <p className="text-lg text-zinc-300 font-medium animate-pulse">
            {GENERATION_MESSAGES[generationMsgIndex]}
          </p>
          <p className="text-sm text-zinc-600">
            This takes about 30–60 seconds
          </p>
        </div>
      );
    }

    // ── State 1: No data yet ──
    if (!hasData) {
      return (
        <div className="flex flex-col items-center justify-center py-16 gap-6">
          <div className="w-20 h-20 rounded-full bg-amber-600/20 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-amber-400" />
          </div>
          <div className="text-center max-w-md">
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">
              Generate Brand Foundation
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Based on your intake data, our AI will generate your complete brand foundation
              including story, values, color palettes, typography, audience personas, and voice guide.
            </p>
            <p className="text-xs text-zinc-600 mt-3">
              This takes about 30–60 seconds
            </p>
          </div>
          <button
            onClick={handleGenerateFoundation}
            className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            Generate Brand Foundation
          </button>
        </div>
      );
    }

    // ── State 3: Show Results ──
    return (
      <div className="space-y-8">
        {/* Regenerate button */}
        <div className="flex justify-end">
          <button
            onClick={handleGenerateFoundation}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 rounded-lg text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate All
          </button>
        </div>

        {/* A. Brand Story & Identity */}
        <section>
          <h3 className="text-xl font-semibold text-zinc-100 mb-4">Brand Story &amp; Identity</h3>

          {/* Brand Story */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-4">
            <p className="text-sm font-medium text-amber-400 mb-2">Brand Story</p>
            <p className="text-zinc-300 leading-relaxed italic border-l-2 border-amber-600/40 pl-4">
              {identity.brandStory}
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <p className="text-sm font-medium text-amber-400 mb-2">Mission</p>
              <p className="text-zinc-300 text-sm leading-relaxed">{identity.mission}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <p className="text-sm font-medium text-amber-400 mb-2">Vision</p>
              <p className="text-zinc-300 text-sm leading-relaxed">{identity.vision}</p>
            </div>
          </div>

          {/* Values */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-4">
            <p className="text-sm font-medium text-amber-400 mb-3">Values</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {identity.values.map((v, i) => (
                <div key={i} className="bg-zinc-800/50 rounded-lg p-3">
                  <p className="text-sm font-medium text-zinc-200">{v.name}</p>
                  <p className="text-xs text-zinc-400 mt-1">{v.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Personality Traits */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <p className="text-sm font-medium text-amber-400 mb-3">Personality Traits</p>
            <div className="flex flex-wrap gap-2">
              {identity.personalityTraits.map((trait, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* B. Taglines & Elevator Pitch */}
        <section>
          <h3 className="text-xl font-semibold text-zinc-100 mb-4">Taglines &amp; Messaging</h3>

          {/* Taglines */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {voice.taglines.map((tagline, i) => (
              <div
                key={i}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex items-center justify-center text-center"
              >
                <p className="text-lg font-semibold text-zinc-100 leading-snug">
                  &ldquo;{tagline}&rdquo;
                </p>
              </div>
            ))}
          </div>

          {/* Elevator Pitch */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <p className="text-sm font-medium text-amber-400 mb-2">Elevator Pitch</p>
            <p className="text-zinc-300 leading-relaxed">{voice.elevatorPitch}</p>
          </div>
        </section>

        {/* C. Color Palettes */}
        <section>
          <h3 className="text-xl font-semibold text-zinc-100 mb-4">Color Palettes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {visuals.palettes.map((palette, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <p className="text-sm font-semibold text-zinc-200 mb-3">{palette.name}</p>
                <div className="flex gap-2 mb-3">
                  {Object.entries(palette.colors).map(([role, hex]) => (
                    <div key={role} className="flex flex-col items-center gap-1">
                      <div
                        className="w-12 h-12 rounded-lg border border-zinc-700"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="text-[10px] text-zinc-500 font-mono">{hex}</span>
                      <span className="text-[10px] text-zinc-600 capitalize">{role}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{palette.psychology}</p>
              </div>
            ))}
          </div>
        </section>

        {/* D. Font Pairings */}
        <section>
          <h3 className="text-xl font-semibold text-zinc-100 mb-4">Font Pairings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {visuals.fontPairings.map((fp, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="mb-3">
                  <p className="text-xs text-zinc-500 uppercase tracking-wide">Heading</p>
                  <p className="text-lg font-semibold text-zinc-100">{fp.heading}</p>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-zinc-500 uppercase tracking-wide">Body</p>
                  <p className="text-base text-zinc-200">{fp.body}</p>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{fp.rationale}</p>
              </div>
            ))}
          </div>
        </section>

        {/* E. Audience Personas */}
        <section>
          <h3 className="text-xl font-semibold text-zinc-100 mb-4">Audience Personas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {audience.personas.map((persona, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-base font-semibold text-zinc-100">{persona.name}</p>
                    <p className="text-xs text-zinc-500">
                      {persona.ageRange} &middot; {persona.occupation} &middot; {persona.location}
                    </p>
                  </div>
                  <Users className="w-5 h-5 text-zinc-700 flex-shrink-0" />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs font-medium text-red-400 mb-1">Pain Points</p>
                    <ul className="space-y-1">
                      {persona.painPoints.map((pp, j) => (
                        <li key={j} className="text-xs text-zinc-400 flex gap-1.5">
                          <span className="text-zinc-600 mt-0.5">&#8226;</span>
                          {pp}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-emerald-400 mb-1">Goals</p>
                    <ul className="space-y-1">
                      {persona.goals.map((g, j) => (
                        <li key={j} className="text-xs text-zinc-400 flex gap-1.5">
                          <span className="text-zinc-600 mt-0.5">&#8226;</span>
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-zinc-500 mb-1.5">Channels</p>
                  <div className="flex flex-wrap gap-1.5">
                    {persona.channels.map((ch, j) => (
                      <span
                        key={j}
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400"
                      >
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* F. Voice Guide */}
        <section>
          <h3 className="text-xl font-semibold text-zinc-100 mb-4">Voice Guide</h3>

          {/* Tone Attributes */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-4">
            <p className="text-sm font-medium text-amber-400 mb-3">Tone Attributes</p>
            <div className="flex flex-wrap gap-2">
              {voice.toneAttributes.map((attr, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400"
                >
                  {attr}
                </span>
              ))}
            </div>
          </div>

          {/* Dos & Don'ts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <p className="text-sm font-medium text-emerald-400 mb-3">Do</p>
              <ul className="space-y-2">
                {voice.dos.map((d, i) => (
                  <li key={i} className="text-sm text-zinc-300 flex gap-2">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <p className="text-sm font-medium text-red-400 mb-3">Don&apos;t</p>
              <ul className="space-y-2">
                {voice.donts.map((d, i) => (
                  <li key={i} className="text-sm text-zinc-300 flex gap-2">
                    <span className="text-red-500 flex-shrink-0 mt-0.5 font-bold">&times;</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Example Phrases */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <p className="text-sm font-medium text-amber-400 mb-3">Example Phrases</p>
            <div className="space-y-2">
              {voice.examplePhrases.map((phrase, i) => (
                <p key={i} className="text-sm text-zinc-300 italic border-l-2 border-zinc-700 pl-3">
                  &ldquo;{phrase}&rdquo;
                </p>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  };

  // ─── Render ───────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <p className="text-zinc-400">Brand deck not found</p>
        <button
          onClick={() => router.push('/admin/brand-decks')}
          className="text-sm text-amber-500 hover:text-amber-400 transition-colors"
        >
          Back to Brand Decks
        </button>
      </div>
    );
  }

  const currentStepData = WIZARD_STEPS[activeStep];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-zinc-800 border border-zinc-700 text-zinc-200 px-4 py-3 rounded-lg shadow-lg text-sm">
          {toast}
        </div>
      )}

      {/* Top Bar */}
      <div className="border-b border-zinc-800 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/admin/brand-decks')}
              className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <span className="text-zinc-700">|</span>
            <h1 className="text-sm font-medium text-zinc-200 truncate max-w-xs">
              {deck.title}
            </h1>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                deck.status === 'completed'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-blue-500/20 text-blue-400'
              }`}
            >
              {deck.status === 'completed' ? 'Completed' : 'Draft'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar + Content */}
      <div className="flex min-h-[calc(100vh-57px)]">
        {/* Sidebar */}
        <aside className="w-60 flex-shrink-0 bg-zinc-900 border-r border-zinc-800 py-4">
          <nav className="space-y-1 px-3">
            {WIZARD_STEPS.map((step, index) => {
              const isActive = index === activeStep;
              const isCompleted = index < deck.currentStep;
              const isAccessible = index <= deck.currentStep;
              const StepIcon = step.icon;

              return (
                <button
                  key={step.key}
                  onClick={() => handleStepClick(index)}
                  disabled={!isAccessible}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                    isActive
                      ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30'
                      : isCompleted
                        ? 'text-zinc-300 hover:bg-zinc-800 cursor-pointer'
                        : 'text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  {/* Step indicator */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isActive
                        ? 'bg-amber-600 text-white'
                        : isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-zinc-800 text-zinc-600'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <span className="text-xs font-medium">{index + 1}</span>
                    )}
                  </div>

                  {/* Label */}
                  <span className="flex-1 truncate">{step.label}</span>

                  {/* Icon */}
                  <StepIcon
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive
                        ? 'text-amber-400'
                        : isCompleted
                          ? 'text-zinc-500'
                          : 'text-zinc-700'
                    }`}
                  />
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 flex flex-col">
          {/* Step Content */}
          <div className="flex-1 p-8">
            <div className={`mx-auto ${activeStep === 1 ? 'max-w-5xl' : 'max-w-3xl'}`}>
              <div className="flex items-center gap-3 mb-6">
                <currentStepData.icon className="w-6 h-6 text-amber-400" />
                <h2 className="text-xl font-semibold text-zinc-100">
                  {currentStepData.label}
                </h2>
              </div>

              {activeStep === 0 ? (
                /* ─── Intake Form ────────────────────────────────── */
                <div className="space-y-6">
                  {/* Business Name */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Business Name <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => {
                        setBusinessName(e.target.value);
                        if (intakeErrors.businessName) setIntakeErrors((prev) => ({ ...prev, businessName: '' }));
                      }}
                      placeholder="e.g., The Sunshine Effect"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                    />
                    {intakeErrors.businessName && (
                      <p className="text-sm text-red-400 mt-1">{intakeErrors.businessName}</p>
                    )}
                  </div>

                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Industry <span className="text-amber-500">*</span>
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => {
                        setIndustry(e.target.value);
                        if (intakeErrors.industry) setIntakeErrors((prev) => ({ ...prev, industry: '' }));
                      }}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                    >
                      <option value="" className="text-zinc-500">Select an industry...</option>
                      {INDUSTRIES.map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                    {intakeErrors.industry && (
                      <p className="text-sm text-red-400 mt-1">{intakeErrors.industry}</p>
                    )}
                  </div>

                  {/* Keywords / Vibe */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Keywords / Vibe
                    </label>
                    <input
                      type="text"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="e.g., earthy, feminine, bold, modern, luxe"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                    />
                  </div>

                  {/* About the Business */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                      About the Business
                    </label>
                    <textarea
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      rows={3}
                      placeholder="What does this business do? 2-3 sentences..."
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 resize-none"
                    />
                  </div>

                  {/* Target Customer */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Target Customer
                    </label>
                    <textarea
                      value={targetCustomer}
                      onChange={(e) => setTargetCustomer(e.target.value)}
                      rows={3}
                      placeholder="Who do they serve? Describe their ideal customer..."
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 resize-none"
                    />
                  </div>

                  {/* Existing Copy */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Existing Copy <span className="text-zinc-600 text-xs font-normal">(optional)</span>
                    </label>
                    <textarea
                      value={existingCopy}
                      onChange={(e) => setExistingCopy(e.target.value)}
                      rows={4}
                      placeholder="Paste any existing copy — Instagram bio, website text, marketing materials... This helps us analyze their existing voice."
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 resize-none"
                    />
                  </div>

                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Logo <span className="text-zinc-600 text-xs font-normal">(optional)</span>
                    </label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer bg-zinc-800/50 hover:bg-zinc-800 hover:border-zinc-600 transition-colors">
                      {logoDataUrl ? (
                        <div className="flex flex-col items-center gap-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={logoDataUrl}
                            alt="Logo preview"
                            className="max-h-16 max-w-[200px] object-contain"
                          />
                          <span className="text-xs text-zinc-400">{logoFilename}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-zinc-500">
                          <Upload className="w-6 h-6" />
                          <span className="text-sm">Upload logo (optional)</span>
                          <span className="text-xs text-zinc-600">PNG, JPG, or SVG</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </label>
                    {logoDataUrl && (
                      <button
                        type="button"
                        onClick={() => { setLogoFilename(''); setLogoDataUrl(''); }}
                        className="text-xs text-zinc-500 hover:text-red-400 mt-1.5 transition-colors"
                      >
                        Remove logo
                      </button>
                    )}
                  </div>
                </div>
              ) : activeStep === 1 ? (
                /* ─── AI Foundation ───────────────────────────────── */
                renderFoundationStep()
              ) : (
                /* ─── Placeholder for other steps ────────────────── */
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center">
                  <currentStepData.icon className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-400 text-sm">
                    Step {activeStep + 1}: {currentStepData.label} — Coming soon
                  </p>
                  <p className="text-zinc-600 text-xs mt-2">
                    This step will be implemented in a future update.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-zinc-800 bg-zinc-950 px-8 py-4">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={activeStep === 0}
                className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 disabled:text-zinc-700 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <span className="text-xs text-zinc-600">
                Step {activeStep + 1} of {WIZARD_STEPS.length}
              </span>

              <button
                onClick={handleNext}
                disabled={saving || activeStep >= WIZARD_STEPS.length - 1}
                className="flex items-center gap-2 px-5 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
