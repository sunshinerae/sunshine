'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, Check, Loader2,
  ClipboardList, Sparkles, Heart, Users, MessageSquare,
  Palette, Moon, Layout, Zap, Eye, Download,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────

interface BrandDeck {
  id: number;
  title: string;
  status: string;
  currentStep: number;
  intakeData: Record<string, unknown> | null;
  aiFoundation: Record<string, unknown> | null;
  identity: Record<string, unknown> | null;
  audience: Record<string, unknown> | null;
  voiceMessaging: Record<string, unknown> | null;
  visualSystem: Record<string, unknown> | null;
  darkMode: Record<string, unknown> | null;
  applications: Record<string, unknown> | null;
  motion: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
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

  // ─── Navigation ───────────────────────────────────────────────

  const handleNext = async () => {
    if (!deck) return;
    if (activeStep >= WIZARD_STEPS.length - 1) return;

    const nextStep = activeStep + 1;

    // Save progress if advancing beyond the current highest step
    if (nextStep > deck.currentStep) {
      setSaving(true);
      try {
        const res = await fetch(`/api/admin/brand-decks/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentStep: nextStep }),
        });

        if (!res.ok) {
          showToast('Failed to save progress');
          return;
        }

        const data = await res.json();
        setDeck(data.deck);
      } catch {
        showToast('Failed to save progress');
        return;
      } finally {
        setSaving(false);
      }
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
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <currentStepData.icon className="w-6 h-6 text-amber-400" />
                <h2 className="text-xl font-semibold text-zinc-100">
                  {currentStepData.label}
                </h2>
              </div>

              {/* Placeholder content */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center">
                <currentStepData.icon className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-400 text-sm">
                  Step {activeStep + 1}: {currentStepData.label} — Coming soon
                </p>
                <p className="text-zinc-600 text-xs mt-2">
                  This step will be implemented in a future update.
                </p>
              </div>
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
