'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, Check, Loader2, Upload, RefreshCw,
  ClipboardList, Sparkles, Heart, Users, MessageSquare,
  Palette, Moon, Layout, Zap, Eye, Download, Plus, X,
  Search, Camera,
} from 'lucide-react';
import {
  InstagramPostMockup, InstagramProfileMockup,
  BusinessCardMockup, LetterheadMockup,
  EmailSignatureMockup, WebsiteHeroMockup,
} from '@/lib/brand-decks/mockups';

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

const MOTION_STYLES = [
  { key: 'elegant', name: 'Elegant', description: 'Slow fades, gentle slides, smooth ease-in-out. Premium and luxury brands.' },
  { key: 'energetic', name: 'Energetic', description: 'Quick bounces, spring physics, playful overshoot. Fitness and active brands.' },
  { key: 'minimal', name: 'Minimal', description: 'Subtle opacity changes, clean cuts, understated. Tech and professional brands.' },
  { key: 'playful', name: 'Playful', description: 'Wobbles, scale pops, rotation effects. Creative and lifestyle brands.' },
];

const MOTION_SPEEDS = [
  { key: 'slow', label: 'Slow' },
  { key: 'medium', label: 'Medium' },
  { key: 'fast', label: 'Fast' },
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

interface UnsplashImage {
  id: string;
  urls: { small: string; regular: string; full: string };
  alt: string;
  photographer: string;
  photographerUrl: string;
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

  // ─── Identity Form State ─────────────────────────────────────────
  const [identityBrandStory, setIdentityBrandStory] = useState('');
  const [identityMission, setIdentityMission] = useState('');
  const [identityVision, setIdentityVision] = useState('');
  const [identityValues, setIdentityValues] = useState<{ name: string; description: string }[]>([]);
  const [identityPersonality, setIdentityPersonality] = useState<{ trait: string; description: string }[]>([]);

  // ─── Audience Form State ─────────────────────────────────────────
  const [audiencePersonas, setAudiencePersonas] = useState<{
    name: string;
    ageRange: string;
    occupation: string;
    location: string;
    painPoints: string[];
    goals: string[];
    channels: string[];
  }[]>([]);

  // ─── Voice Form State ─────────────────────────────────────────
  const [voiceTone, setVoiceTone] = useState<string[]>([]);
  const [voicePitch, setVoicePitch] = useState('');
  const [voiceTaglines, setVoiceTaglines] = useState<string[]>([]);
  const [voicePillars, setVoicePillars] = useState<{ title: string; description: string }[]>([]);
  const [voiceDos, setVoiceDos] = useState<string[]>([]);
  const [voiceDonts, setVoiceDonts] = useState<string[]>([]);
  const [voicePhrases, setVoicePhrases] = useState<string[]>([]);
  const [toneInput, setToneInput] = useState('');

  // ─── Visuals Form State ─────────────────────────────────────────
  const [selectedPalette, setSelectedPalette] = useState(0);
  const [selectedFont, setSelectedFont] = useState(0);
  const [customColors, setCustomColors] = useState<Record<string, string>>({});
  const [visualsData, setVisualsData] = useState<FoundationVisuals | null>(null);

  // ─── Dark Mode State ─────────────────────────────────────────
  const [darkModeColors, setDarkModeColors] = useState<Record<string, string>>({});
  const [darkModeCustom, setDarkModeCustom] = useState<Record<string, string>>({});

  // ─── Motion State ─────────────────────────────────────────────
  const [motionStyle, setMotionStyle] = useState('elegant');
  const [motionSpeed, setMotionSpeed] = useState('medium');
  const [motionNotes, setMotionNotes] = useState('');

  // ─── Mood Board State ─────────────────────────────────────────
  const [unsplashQuery, setUnsplashQuery] = useState('');
  const [unsplashResults, setUnsplashResults] = useState<UnsplashImage[]>([]);
  const [unsplashSearching, setUnsplashSearching] = useState(false);
  const [moodBoardImages, setMoodBoardImages] = useState<UnsplashImage[]>([]);
  const [photoNotes, setPhotoNotes] = useState('');

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

  // ─── Hydrate Identity Form from Deck ──────────────────────────────
  useEffect(() => {
    if (!deck?.identity) return;

    try {
      const data = typeof deck.identity === 'string' ? JSON.parse(deck.identity) : deck.identity;
      setIdentityBrandStory(data.brandStory || '');
      setIdentityMission(data.mission || '');
      setIdentityVision(data.vision || '');

      // Values: may come from foundation or previously saved identity
      if (Array.isArray(data.values)) {
        setIdentityValues(data.values.map((v: { name: string; description: string }) => ({
          name: v.name || '',
          description: v.description || '',
        })));
      }

      // Personality: foundation stores personalityTraits (string[]), saved identity stores personality ({ trait, description }[])
      if (Array.isArray(data.personality)) {
        setIdentityPersonality(data.personality.map((p: { trait: string; description: string }) => ({
          trait: p.trait || '',
          description: p.description || '',
        })));
      } else if (Array.isArray(data.personalityTraits)) {
        setIdentityPersonality(data.personalityTraits.map((t: string) => ({
          trait: t,
          description: '',
        })));
      }
    } catch {
      // Identity data not parseable — leave defaults
    }
  }, [deck?.identity]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Hydrate Audience Form from Deck ──────────────────────────────
  useEffect(() => {
    if (!deck?.audience) return;

    try {
      const data = typeof deck.audience === 'string' ? JSON.parse(deck.audience) : deck.audience;
      if (Array.isArray(data.personas)) {
        setAudiencePersonas(data.personas.map((p: {
          name?: string;
          ageRange?: string;
          occupation?: string;
          location?: string;
          painPoints?: string[];
          goals?: string[];
          channels?: string[];
        }) => ({
          name: p.name || '',
          ageRange: p.ageRange || '',
          occupation: p.occupation || '',
          location: p.location || '',
          painPoints: Array.isArray(p.painPoints) ? p.painPoints : [],
          goals: Array.isArray(p.goals) ? p.goals : [],
          channels: Array.isArray(p.channels) ? p.channels : [],
        })));
      }
    } catch {
      // Audience data not parseable — leave defaults
    }
  }, [deck?.audience]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Hydrate Voice Form from Deck ──────────────────────────────
  useEffect(() => {
    if (!deck?.voice) return;

    try {
      const data = typeof deck.voice === 'string' ? JSON.parse(deck.voice) : deck.voice;
      if (Array.isArray(data.toneAttributes)) {
        setVoiceTone(data.toneAttributes);
      }
      if (data.elevatorPitch) {
        setVoicePitch(data.elevatorPitch);
      }
      if (Array.isArray(data.taglines)) {
        setVoiceTaglines(data.taglines);
      }
      if (Array.isArray(data.messagingPillars)) {
        setVoicePillars(data.messagingPillars.map((p: { title?: string; description?: string }) => ({
          title: p.title || '',
          description: p.description || '',
        })));
      }
      if (data.voiceGuide) {
        if (Array.isArray(data.voiceGuide.dos)) setVoiceDos(data.voiceGuide.dos);
        if (Array.isArray(data.voiceGuide.donts)) setVoiceDonts(data.voiceGuide.donts);
      }
      // Also support flat dos/donts from foundation generation
      if (Array.isArray(data.dos) && voiceDos.length === 0) setVoiceDos(data.dos);
      if (Array.isArray(data.donts) && voiceDonts.length === 0) setVoiceDonts(data.donts);
      if (Array.isArray(data.examplePhrases)) {
        setVoicePhrases(data.examplePhrases);
      }
    } catch {
      // Voice data not parseable — leave defaults
    }
  }, [deck?.voice]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Hydrate Visuals Form from Deck ──────────────────────────────
  useEffect(() => {
    if (!deck?.visuals) return;

    try {
      const data = typeof deck.visuals === 'string' ? JSON.parse(deck.visuals) : deck.visuals;
      setVisualsData(data);
      if (typeof data.selectedPalette === 'number') setSelectedPalette(data.selectedPalette);
      if (typeof data.selectedFont === 'number') setSelectedFont(data.selectedFont);
      if (data.customColors && typeof data.customColors === 'object') {
        setCustomColors(data.customColors);
      }
    } catch {
      // Visuals data not parseable — leave defaults
    }
  }, [deck?.visuals]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Hydrate Dark Mode from Deck ──────────────────────────────
  useEffect(() => {
    if (!deck?.visuals) return;

    try {
      const data = typeof deck.visuals === 'string' ? JSON.parse(deck.visuals) : deck.visuals;
      if (data.darkMode) {
        if (data.darkMode.auto && typeof data.darkMode.auto === 'object') {
          setDarkModeColors(data.darkMode.auto);
        }
        if (data.darkMode.custom && typeof data.darkMode.custom === 'object') {
          setDarkModeCustom(data.darkMode.custom);
        }
      }
    } catch {
      // Dark mode data not parseable — leave defaults
    }
  }, [deck?.visuals]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Hydrate Mood Board from Deck ──────────────────────────────
  useEffect(() => {
    if (!deck?.images) return;

    try {
      const data = typeof deck.images === 'string' ? JSON.parse(deck.images) : deck.images;
      if (Array.isArray(data.moodBoard)) {
        setMoodBoardImages(data.moodBoard);
      }
      if (data.photoNotes) {
        setPhotoNotes(data.photoNotes);
      }
    } catch {
      // Images data not parseable — leave defaults
    }
  }, [deck?.images]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Hydrate Motion from Deck ──────────────────────────────────
  useEffect(() => {
    if (!deck?.motion) return;

    try {
      const data = typeof deck.motion === 'string' ? JSON.parse(deck.motion) : deck.motion;
      if (data.style) setMotionStyle(data.style);
      if (data.speed) setMotionSpeed(data.speed);
      if (data.notes) setMotionNotes(data.notes);
    } catch {
      // Motion data not parseable — leave defaults
    }
  }, [deck?.motion]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Load Google Fonts for Visuals ──────────────────────────────
  useEffect(() => {
    if (!visualsData?.fontPairings) return;
    const fonts = visualsData.fontPairings.flatMap(fp => [fp.heading, fp.body]);
    const unique = [...new Set(fonts)];
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?${unique.map(f => `family=${encodeURIComponent(f)}:wght@400;600;700`).join('&')}&display=swap`;
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, [visualsData]);

  // ─── Auto-search Unsplash when arriving at visuals step ──────
  const unsplashAutoSearched = useRef(false);
  useEffect(() => {
    if (activeStep !== 5 || unsplashAutoSearched.current) return;
    if (moodBoardImages.length > 0 || unsplashResults.length > 0) return;
    // Build a query from intake keywords or business name
    const kw = keywords.trim() || businessName.trim();
    if (kw) {
      unsplashAutoSearched.current = true;
      setUnsplashQuery(kw);
      searchUnsplash(kw);
    }
  }, [activeStep]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // ─── Unsplash Search ────────────────────────────────────────────

  const searchUnsplash = async (query: string) => {
    if (!query.trim()) return;
    setUnsplashSearching(true);
    try {
      const res = await fetch(`/api/admin/brand-decks/unsplash?query=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setUnsplashResults(data.images || []);
      }
    } catch {
      /* ignore */
    } finally {
      setUnsplashSearching(false);
    }
  };

  const toggleMoodBoardImage = (image: UnsplashImage) => {
    setMoodBoardImages((prev) => {
      const exists = prev.find((img) => img.id === image.id);
      if (exists) {
        return prev.filter((img) => img.id !== image.id);
      }
      return [...prev, image];
    });
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

      // Save identity data when leaving identity step
      if (activeStep === 2) {
        payload.identity = {
          brandStory: identityBrandStory.trim(),
          mission: identityMission.trim(),
          vision: identityVision.trim(),
          values: identityValues.map((v) => ({
            name: v.name.trim(),
            description: v.description.trim(),
          })),
          personality: identityPersonality.map((p) => ({
            trait: p.trait.trim(),
            description: p.description.trim(),
          })),
        };
      }

      // Save audience data when leaving audience step
      if (activeStep === 3) {
        payload.audience = {
          personas: audiencePersonas.map((p) => ({
            name: p.name.trim(),
            ageRange: p.ageRange.trim(),
            occupation: p.occupation.trim(),
            location: p.location.trim(),
            painPoints: p.painPoints.map((pp) => pp.trim()).filter(Boolean),
            goals: p.goals.map((g) => g.trim()).filter(Boolean),
            channels: p.channels.map((ch) => ch.trim()).filter(Boolean),
          })),
        };
      }

      // Save voice data when leaving voice step
      if (activeStep === 4) {
        payload.voice = {
          toneAttributes: voiceTone.filter(Boolean),
          elevatorPitch: voicePitch.trim(),
          taglines: voiceTaglines.map((t) => t.trim()).filter(Boolean),
          messagingPillars: voicePillars.map((p) => ({
            title: p.title.trim(),
            description: p.description.trim(),
          })),
          voiceGuide: {
            dos: voiceDos.map((d) => d.trim()).filter(Boolean),
            donts: voiceDonts.map((d) => d.trim()).filter(Boolean),
          },
          examplePhrases: voicePhrases.map((p) => p.trim()).filter(Boolean),
        };
      }

      // Save visuals selections when leaving visuals step
      if (activeStep === 5 && visualsData) {
        payload.visuals = {
          ...visualsData,
          selectedPalette,
          selectedFont,
          customColors,
        };
        payload.images = {
          moodBoard: moodBoardImages,
          photoNotes: photoNotes.trim(),
        };
      }

      // Save dark mode data when leaving dark mode step
      if (activeStep === 6) {
        // Merge dark mode into the existing visuals data
        const existingVisuals = visualsData
          ? { ...visualsData, selectedPalette, selectedFont, customColors }
          : {};
        payload.visuals = {
          ...existingVisuals,
          darkMode: { auto: darkModeColors, custom: darkModeCustom },
        };
      }

      // Save motion data when leaving motion step
      if (activeStep === 8) {
        payload.motion = {
          style: motionStyle,
          speed: motionSpeed,
          notes: motionNotes.trim(),
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

  // ─── Identity Step Helpers ────────────────────────────────────

  const updateValue = (index: number, field: 'name' | 'description', value: string) => {
    setIdentityValues((prev) => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)));
  };

  const removeValue = (index: number) => {
    setIdentityValues((prev) => prev.filter((_, i) => i !== index));
  };

  const addValue = () => {
    setIdentityValues((prev) => [...prev, { name: '', description: '' }]);
  };

  const updateTrait = (index: number, field: 'trait' | 'description', value: string) => {
    setIdentityPersonality((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };

  const removeTrait = (index: number) => {
    setIdentityPersonality((prev) => prev.filter((_, i) => i !== index));
  };

  const addTrait = () => {
    setIdentityPersonality((prev) => [...prev, { trait: '', description: '' }]);
  };

  // ─── Audience Step Helpers ────────────────────────────────────

  const updatePersona = (index: number, field: string, value: string) => {
    setAudiencePersonas((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const removePersona = (index: number) => {
    setAudiencePersonas((prev) => prev.filter((_, i) => i !== index));
  };

  const addPersona = () => {
    setAudiencePersonas((prev) => [
      ...prev,
      { name: '', ageRange: '', occupation: '', location: '', painPoints: [''], goals: [''], channels: [''] },
    ]);
  };

  const updatePersonaListItem = (
    personaIndex: number,
    field: 'painPoints' | 'goals' | 'channels',
    itemIndex: number,
    value: string,
  ) => {
    setAudiencePersonas((prev) =>
      prev.map((p, i) => {
        if (i !== personaIndex) return p;
        const updated = [...p[field]];
        updated[itemIndex] = value;
        return { ...p, [field]: updated };
      })
    );
  };

  const removePersonaListItem = (
    personaIndex: number,
    field: 'painPoints' | 'goals' | 'channels',
    itemIndex: number,
  ) => {
    setAudiencePersonas((prev) =>
      prev.map((p, i) => {
        if (i !== personaIndex) return p;
        return { ...p, [field]: p[field].filter((_, j) => j !== itemIndex) };
      })
    );
  };

  const addPersonaListItem = (
    personaIndex: number,
    field: 'painPoints' | 'goals' | 'channels',
  ) => {
    setAudiencePersonas((prev) =>
      prev.map((p, i) => {
        if (i !== personaIndex) return p;
        return { ...p, [field]: [...p[field], ''] };
      })
    );
  };

  // ─── Voice Step Helpers ────────────────────────────────────

  const addToneAttribute = () => {
    const val = toneInput.trim();
    if (!val || voiceTone.includes(val)) return;
    setVoiceTone((prev) => [...prev, val]);
    setToneInput('');
  };

  const removeToneAttribute = (index: number) => {
    setVoiceTone((prev) => prev.filter((_, i) => i !== index));
  };

  const updateTagline = (index: number, value: string) => {
    setVoiceTaglines((prev) => prev.map((t, i) => (i === index ? value : t)));
  };

  const addTagline = () => {
    setVoiceTaglines((prev) => [...prev, '']);
  };

  const removeTagline = (index: number) => {
    setVoiceTaglines((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePillar = (index: number, field: 'title' | 'description', value: string) => {
    setVoicePillars((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };

  const removePillar = (index: number) => {
    setVoicePillars((prev) => prev.filter((_, i) => i !== index));
  };

  const addPillar = () => {
    setVoicePillars((prev) => [...prev, { title: '', description: '' }]);
  };

  const updateVoiceListItem = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string,
  ) => {
    setList(list.map((item, i) => (i === index ? value : item)));
  };

  const removeVoiceListItem = (
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
  ) => {
    setList((prev) => prev.filter((_, i) => i !== index));
  };

  const addVoiceListItem = (
    setList: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setList((prev) => [...prev, '']);
  };

  // ─── Dark Mode Helpers ──────────────────────────────────────

  const hexToHsl = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return [0, 0, 0];
    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    const sN = s / 100;
    const lN = l / 100;
    const c = (1 - Math.abs(2 * lN - 1)) * sN;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = lN - c / 2;
    let r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    const toHex = (n: number) => {
      const hex = Math.round((n + m) * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const generateDarkPalette = (lightColors: Record<string, string>): Record<string, string> => {
    const dark: Record<string, string> = {};
    for (const [role, hex] of Object.entries(lightColors)) {
      const [h, s, l] = hexToHsl(hex);
      if (role === 'background') {
        // Dark background: very low lightness
        dark[role] = hslToHex(h, Math.min(s, 20), 10);
      } else if (role === 'text') {
        // Light text on dark background
        dark[role] = hslToHex(h, Math.max(s - 10, 0), 92);
      } else {
        // Primary/secondary/accent: keep hue, moderate lightness
        dark[role] = hslToHex(h, Math.min(s + 5, 100), Math.max(Math.min(60, l + 10), 55));
      }
    }
    return dark;
  };

  // Auto-generate dark palette when entering the dark mode step
  const darkModeAutoGenerated = useRef(false);
  useEffect(() => {
    if (activeStep !== 6) {
      darkModeAutoGenerated.current = false;
      return;
    }
    // Only auto-generate if we don't already have dark mode colors
    if (Object.keys(darkModeColors).length > 0) return;
    if (darkModeAutoGenerated.current) return;
    if (!visualsData?.palettes?.length) return;

    darkModeAutoGenerated.current = true;
    const basePalette = visualsData.palettes[selectedPalette];
    if (!basePalette?.colors) return;
    const effectiveLight: Record<string, string> = {};
    const COLOR_KEYS = ['primary', 'secondary', 'accent', 'background', 'text'];
    for (const k of COLOR_KEYS) {
      effectiveLight[k] = customColors[k] || (basePalette.colors as Record<string, string>)[k] || '#000000';
    }
    setDarkModeColors(generateDarkPalette(effectiveLight));
  }, [activeStep, visualsData, selectedPalette, customColors, darkModeColors]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Applications Step Renderer ───────────────────────────────

  const renderApplicationsStep = () => {
    // Gather brand data defensively from saved deck fields
    let brandName = deck?.title || 'Brand';
    try {
      const intake = deck?.intake ? (typeof deck.intake === 'string' ? JSON.parse(deck.intake) : deck.intake) : null;
      if (intake?.businessName) brandName = intake.businessName;
    } catch { /* use default */ }

    let tagline: string | undefined;
    try {
      const voice = deck?.voice ? (typeof deck.voice === 'string' ? JSON.parse(deck.voice) : deck.voice) : null;
      if (voice?.selectedTagline) {
        tagline = voice.selectedTagline;
      } else if (Array.isArray(voice?.taglines) && voice.taglines.length > 0) {
        tagline = voice.taglines[0];
      }
    } catch { /* no tagline */ }

    let colors = { primary: '#6366f1', secondary: '#8b5cf6', accent: '#f59e0b', background: '#ffffff', text: '#18181b' };
    let headingFont: string | undefined;
    let bodyFont: string | undefined;
    try {
      const vis = deck?.visuals ? (typeof deck.visuals === 'string' ? JSON.parse(deck.visuals) : deck.visuals) : null;
      if (vis) {
        const paletteIdx = typeof vis.selectedPalette === 'number' ? vis.selectedPalette : 0;
        const palette = vis.palettes?.[paletteIdx];
        if (palette?.colors) {
          const cc = vis.customColors || {};
          colors = {
            primary: cc.primary || palette.colors.primary || colors.primary,
            secondary: cc.secondary || palette.colors.secondary || colors.secondary,
            accent: cc.accent || palette.colors.accent || colors.accent,
            background: cc.background || palette.colors.background || colors.background,
            text: cc.text || palette.colors.text || colors.text,
          };
        }
        const fontIdx = typeof vis.selectedFont === 'number' ? vis.selectedFont : 0;
        const fp = vis.fontPairings?.[fontIdx];
        if (fp) {
          headingFont = fp.heading;
          bodyFont = fp.body;
        }
      }
    } catch { /* use defaults */ }

    let moodBoardImage: string | undefined;
    try {
      const imgs = deck?.images ? (typeof deck.images === 'string' ? JSON.parse(deck.images) : deck.images) : null;
      if (Array.isArray(imgs?.moodBoard) && imgs.moodBoard.length > 0) {
        moodBoardImage = imgs.moodBoard[0].urls?.regular || imgs.moodBoard[0].urls?.small;
      }
    } catch { /* no image */ }

    const mockupProps = { brandName, tagline, colors, headingFont, bodyFont, moodBoardImage };

    return (
      <div className="space-y-12">
        {/* ── Social Media ──────────────────────────────────────── */}
        <section>
          <h3 className="text-lg font-medium text-zinc-200 mb-1 flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-400" />
            Social Media
          </h3>
          <p className="text-sm text-zinc-500 mb-6">
            See how your brand looks on Instagram posts and profiles.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start justify-items-center">
            <InstagramPostMockup {...mockupProps} />
            <InstagramProfileMockup {...mockupProps} />
          </div>
        </section>

        {/* ── Print & Stationery ────────────────────────────────── */}
        <section>
          <h3 className="text-lg font-medium text-zinc-200 mb-1 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-amber-400" />
            Print &amp; Stationery
          </h3>
          <p className="text-sm text-zinc-500 mb-6">
            Business cards and letterhead with your brand system applied.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start justify-items-center">
            <BusinessCardMockup {...mockupProps} />
            <LetterheadMockup {...mockupProps} />
          </div>
        </section>

        {/* ── Digital ───────────────────────────────────────────── */}
        <section>
          <h3 className="text-lg font-medium text-zinc-200 mb-1 flex items-center gap-2">
            <Layout className="w-5 h-5 text-amber-400" />
            Digital
          </h3>
          <p className="text-sm text-zinc-500 mb-6">
            Email signatures and a website hero section preview.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start justify-items-center">
            <EmailSignatureMockup {...mockupProps} />
            <WebsiteHeroMockup {...mockupProps} />
          </div>
        </section>

        {/* ── Note ──────────────────────────────────────────────── */}
        <p className="text-sm text-zinc-500 text-center mt-4">
          These mockups use your selected brand colors, fonts, and images.
          Go back to previous steps to make adjustments.
        </p>
      </div>
    );
  };

  // ─── Dark Mode Step Renderer ──────────────────────────────────

  const renderDarkModeStep = () => {
    if (!visualsData || !visualsData.palettes?.length) {
      return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
          <Moon className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-400 text-sm">
            No visual data available. Go back to the Visual System step and select a color palette first.
          </p>
        </div>
      );
    }

    const COLOR_LABELS = ['primary', 'secondary', 'accent', 'background', 'text'] as const;

    // Get the light palette colors (base + overrides)
    const basePalette = visualsData.palettes[selectedPalette];
    const getLightColor = (role: string) =>
      customColors[role] || (basePalette?.colors as Record<string, string>)?.[role] || '#000000';

    // Get the dark palette color (auto-generated + custom overrides)
    const getDarkColor = (role: string) =>
      darkModeCustom[role] || darkModeColors[role] || '#000000';

    const handleResetDarkOverrides = () => {
      setDarkModeCustom({});
    };

    const handleRegenerateDark = () => {
      const effectiveLight: Record<string, string> = {};
      for (const k of COLOR_LABELS) {
        effectiveLight[k] = getLightColor(k);
      }
      setDarkModeColors(generateDarkPalette(effectiveLight));
      setDarkModeCustom({});
    };

    return (
      <div className="space-y-10">
        {/* ── Side-by-side Palette Comparison ── */}
        <div>
          <h3 className="text-lg font-medium text-zinc-200 mb-2">Palette Comparison</h3>
          <p className="text-sm text-zinc-500 mb-6">
            Your dark mode palette is auto-generated from the selected light palette. Review and customize below.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Light Mode Column */}
            <div className="bg-white rounded-xl p-6 border border-zinc-200">
              <h4 className="text-sm font-semibold text-zinc-800 mb-4">Light Mode</h4>
              <div className="space-y-3">
                {COLOR_LABELS.map((role) => {
                  const color = getLightColor(role);
                  return (
                    <div key={role} className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg border border-zinc-200 shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <div>
                        <p className="text-xs font-medium text-zinc-700 capitalize">{role}</p>
                        <p className="text-xs text-zinc-500 font-mono">{color}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dark Mode Column */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-700">
              <h4 className="text-sm font-semibold text-zinc-200 mb-4">Dark Mode</h4>
              <div className="space-y-3">
                {COLOR_LABELS.map((role) => {
                  const color = getDarkColor(role);
                  return (
                    <div key={role} className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg border border-zinc-600 shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <div>
                        <p className="text-xs font-medium text-zinc-300 capitalize">{role}</p>
                        <p className="text-xs text-zinc-500 font-mono">{color}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-zinc-800" />

        {/* ── Sample Preview Cards ── */}
        <div>
          <h3 className="text-lg font-medium text-zinc-200 mb-2">Preview</h3>
          <p className="text-sm text-zinc-500 mb-6">
            See how your brand looks in both light and dark mode with a realistic card mockup.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Light Preview Card */}
            <div
              className="rounded-xl overflow-hidden border border-zinc-200 shadow-sm"
              style={{ backgroundColor: getLightColor('background') }}
            >
              <div className="h-2" style={{ backgroundColor: getLightColor('primary') }} />
              <div className="p-6">
                <h5
                  className="text-lg font-bold mb-2"
                  style={{ color: getLightColor('text') }}
                >
                  {businessName || 'Your Brand'}
                </h5>
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: getLightColor('text'), opacity: 0.7 }}
                >
                  Elevate your wellness journey with a community that supports, inspires, and celebrates you.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                    style={{ backgroundColor: getLightColor('accent') }}
                  >
                    Get Started
                  </button>
                  <span
                    className="text-sm font-medium"
                    style={{ color: getLightColor('secondary') }}
                  >
                    Learn more
                  </span>
                </div>
              </div>
            </div>

            {/* Dark Preview Card */}
            <div
              className="rounded-xl overflow-hidden border border-zinc-700 shadow-sm"
              style={{ backgroundColor: getDarkColor('background') }}
            >
              <div className="h-2" style={{ backgroundColor: getDarkColor('primary') }} />
              <div className="p-6">
                <h5
                  className="text-lg font-bold mb-2"
                  style={{ color: getDarkColor('text') }}
                >
                  {businessName || 'Your Brand'}
                </h5>
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: getDarkColor('text'), opacity: 0.7 }}
                >
                  Elevate your wellness journey with a community that supports, inspires, and celebrates you.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                    style={{ backgroundColor: getDarkColor('accent') }}
                  >
                    Get Started
                  </button>
                  <span
                    className="text-sm font-medium"
                    style={{ color: getDarkColor('secondary') }}
                  >
                    Learn more
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-zinc-800" />

        {/* ── Custom Dark Mode Overrides ── */}
        <div>
          <h3 className="text-lg font-medium text-zinc-200 mb-2">Customize Dark Palette</h3>
          <p className="text-sm text-zinc-500 mb-4">
            Fine-tune the auto-generated dark mode colors if needed.
          </p>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {COLOR_LABELS.map((role) => (
                <div key={role}>
                  <label className="block text-xs font-medium text-zinc-500 mb-2 capitalize">{role}</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={getDarkColor(role)}
                      onChange={(e) =>
                        setDarkModeCustom((prev) => ({ ...prev, [role]: e.target.value }))
                      }
                      className="w-10 h-10 rounded cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={getDarkColor(role)}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^#[0-9a-fA-F]{0,6}$/.test(val)) {
                          setDarkModeCustom((prev) => ({ ...prev, [role]: val }));
                        }
                      }}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-zinc-100 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-4">
              {Object.keys(darkModeCustom).length > 0 && (
                <button
                  type="button"
                  onClick={handleResetDarkOverrides}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Reset to auto-generated
                </button>
              )}
              <button
                type="button"
                onClick={handleRegenerateDark}
                className="flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-400 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Regenerate from light palette
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── Motion Step Renderer ──────────────────────────────────

  const renderMotionStep = () => {
    // Resolve accent color from visuals data for the demo squares
    let accentColor = '#f59e0b';
    if (visualsData?.palettes?.length) {
      const palette = visualsData.palettes[selectedPalette];
      if (palette?.colors) {
        accentColor = customColors.accent || palette.colors.accent || accentColor;
      }
    }

    return (
      <div className="space-y-8">
        {/* Keyframe animations */}
        <style>{`
          @keyframes elegantSlide {
            0%, 100% { transform: translateX(0); opacity: 0.7; }
            50% { transform: translateX(20px); opacity: 1; }
          }
          @keyframes energeticBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          @keyframes minimalPulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
          @keyframes playfulSpin {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(1.2); }
            100% { transform: rotate(360deg) scale(1); }
          }
        `}</style>

        <p className="text-sm text-zinc-400">
          Choose an animation style that reflects your brand personality. The live previews show how elements will move throughout your brand deck.
        </p>

        {/* Style Cards - 2x2 grid */}
        <div className="grid grid-cols-2 gap-4">
          {MOTION_STYLES.map((style) => {
            const isSelected = motionStyle === style.key;
            const animationMap: Record<string, string> = {
              elegant: 'elegantSlide 3s ease-in-out infinite',
              energetic: 'energeticBounce 0.6s ease-in-out infinite',
              minimal: 'minimalPulse 2s ease-in-out infinite',
              playful: 'playfulSpin 2s ease-in-out infinite',
            };

            return (
              <button
                key={style.key}
                onClick={() => setMotionStyle(style.key)}
                className={`text-left bg-zinc-900 border rounded-xl p-5 transition-all hover:border-zinc-600 ${
                  isSelected
                    ? 'border-amber-500 ring-2 ring-amber-500/30'
                    : 'border-zinc-800'
                }`}
              >
                {/* Live animated demo */}
                <div className="flex items-center justify-center h-20 mb-4 bg-zinc-950 rounded-lg overflow-hidden">
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      backgroundColor: accentColor,
                      animation: animationMap[style.key],
                    }}
                  />
                </div>

                <h3 className={`text-sm font-semibold mb-1 ${
                  isSelected ? 'text-amber-400' : 'text-zinc-200'
                }`}>
                  {style.name}
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {style.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Speed Preference */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-3">
            Animation Speed
          </label>
          <div className="flex gap-2">
            {MOTION_SPEEDS.map((speed) => {
              const isSelected = motionSpeed === speed.key;
              return (
                <button
                  key={speed.key}
                  onClick={() => setMotionSpeed(speed.key)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-amber-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300 border border-zinc-700'
                  }`}
                >
                  {speed.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Animation Notes */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Animation Notes <span className="text-zinc-600 text-xs font-normal">(optional)</span>
          </label>
          <textarea
            value={motionNotes}
            onChange={(e) => setMotionNotes(e.target.value)}
            rows={3}
            placeholder="Any additional notes about motion preferences — e.g., 'Keep hero sections static, only animate CTAs' or 'No rotation effects'..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 resize-none"
          />
        </div>
      </div>
    );
  };

  // ─── Visuals Step Renderer ──────────────────────────────────

  const renderVisualsStep = () => {
    if (!visualsData || !visualsData.palettes?.length) {
      return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
          <Palette className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-400 text-sm">
            No visual data generated yet. Go back to the AI Foundation step to generate your brand foundation first.
          </p>
        </div>
      );
    }

    const COLOR_LABELS = ['primary', 'secondary', 'accent', 'background', 'text'] as const;

    // Get the effective colors for the selected palette (base + overrides)
    const basePalette = visualsData.palettes[selectedPalette];
    const getEffectiveColor = (role: string) =>
      customColors[role] || (basePalette?.colors as Record<string, string>)?.[role] || '#000000';

    return (
      <div className="space-y-10">
        {/* ── Section 1: Color Palettes ── */}
        <div>
          <h3 className="text-lg font-medium text-zinc-200 mb-4">Color Palettes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {visualsData.palettes.map((palette, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setSelectedPalette(i);
                  setCustomColors({});
                }}
                className={`bg-zinc-900 border rounded-xl p-6 cursor-pointer transition-all hover:border-zinc-600 text-left ${
                  selectedPalette === i
                    ? 'ring-2 ring-amber-500 border-amber-500/50'
                    : 'border-zinc-800'
                }`}
              >
                <p className="text-sm font-semibold text-zinc-200 mb-4">{palette.name}</p>
                <div className="flex gap-2 mb-4">
                  {COLOR_LABELS.map((role) => (
                    <div key={role} className="flex flex-col items-center gap-1">
                      <div
                        className="w-14 h-14 rounded-lg border border-zinc-600"
                        style={{ backgroundColor: (palette.colors as Record<string, string>)[role] }}
                      />
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {(palette.colors as Record<string, string>)[role]}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{palette.psychology}</p>
              </button>
            ))}
          </div>

          {/* Custom Color Overrides */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-zinc-400 mb-3">Customize Selected Palette</h4>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {COLOR_LABELS.map((role) => (
                  <div key={role}>
                    <label className="block text-xs font-medium text-zinc-500 mb-2 capitalize">{role}</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={getEffectiveColor(role)}
                        onChange={(e) =>
                          setCustomColors((prev) => ({ ...prev, [role]: e.target.value }))
                        }
                        className="w-10 h-10 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={getEffectiveColor(role)}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^#[0-9a-fA-F]{0,6}$/.test(val)) {
                            setCustomColors((prev) => ({ ...prev, [role]: val }));
                          }
                        }}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-zinc-100 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
              {Object.keys(customColors).length > 0 && (
                <button
                  type="button"
                  onClick={() => setCustomColors({})}
                  className="mt-3 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Reset to palette defaults
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-zinc-800" />

        {/* ── Section 2: Typography ── */}
        <div>
          <h3 className="text-lg font-medium text-zinc-200 mb-4">Typography</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {visualsData.fontPairings.map((fp, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedFont(i)}
                className={`bg-zinc-900 border rounded-xl p-6 cursor-pointer transition-all hover:border-zinc-600 text-left ${
                  selectedFont === i
                    ? 'ring-2 ring-amber-500 border-amber-500/50'
                    : 'border-zinc-800'
                }`}
              >
                {('name' in fp && (fp as { name?: string }).name) ? (
                  <p className="text-xs font-medium text-amber-400 mb-3">{(fp as { name: string }).name}</p>
                ) : null}
                <div className="mb-3">
                  <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Heading</p>
                  <p
                    className="text-xl font-semibold text-zinc-100"
                    style={{ fontFamily: `"${fp.heading}", sans-serif` }}
                  >
                    {fp.heading}
                  </p>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Body</p>
                  <p
                    className="text-base text-zinc-200"
                    style={{ fontFamily: `"${fp.body}", sans-serif` }}
                  >
                    {fp.body}
                  </p>
                </div>
                <div className="border-t border-zinc-800 pt-3 mt-3 space-y-2">
                  <p
                    className="text-lg font-semibold text-zinc-100"
                    style={{ fontFamily: `"${fp.heading}", sans-serif` }}
                  >
                    The quick brown fox
                  </p>
                  <p
                    className="text-sm text-zinc-300 leading-relaxed"
                    style={{ fontFamily: `"${fp.body}", sans-serif` }}
                  >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                  </p>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed mt-3">{fp.rationale}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-zinc-800" />

        {/* ── Section 3: Photography & Mood Board ── */}
        <div>
          <h3 className="text-lg font-medium text-zinc-200 mb-1 flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-400" />
            Photography &amp; Mood Board
          </h3>
          <p className="text-sm text-zinc-500 mb-5">
            Select 4-8 images that capture the visual feel of your brand.
          </p>

          {/* Selected Images */}
          {moodBoardImages.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-medium text-zinc-400 mb-2">
                Selected ({moodBoardImages.length})
              </p>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {moodBoardImages.map((img) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => toggleMoodBoardImage(img)}
                    className="relative rounded-lg overflow-hidden cursor-pointer ring-2 ring-amber-500 aspect-square group"
                  >
                    <img
                      src={img.urls.small}
                      alt={img.alt || 'Mood board image'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <X className="w-4 h-4 text-white" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={unsplashQuery}
                onChange={(e) => setUnsplashQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    searchUnsplash(unsplashQuery);
                  }
                }}
                placeholder="Search Unsplash for images..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
              />
            </div>
            <button
              type="button"
              onClick={() => searchUnsplash(unsplashQuery)}
              disabled={unsplashSearching || !unsplashQuery.trim()}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              {unsplashSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Search
            </button>
          </div>

          {/* Results Grid */}
          {unsplashSearching && unsplashResults.length === 0 && (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-3" />
              <p className="text-sm text-zinc-500">Searching images...</p>
            </div>
          )}

          {!unsplashSearching && unsplashResults.length === 0 && unsplashQuery.trim() && (
            <div className="text-center py-12">
              <Camera className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-sm text-zinc-500">No images found. Try a different search term.</p>
            </div>
          )}

          {unsplashResults.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {unsplashResults.map((img) => {
                const isSelected = moodBoardImages.some((m) => m.id === img.id);
                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => toggleMoodBoardImage(img)}
                    className={`relative rounded-lg overflow-hidden cursor-pointer transition-all aspect-[4/3] group ${
                      isSelected
                        ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-zinc-950'
                        : 'hover:ring-1 hover:ring-zinc-600'
                    }`}
                  >
                    <img
                      src={img.urls.small}
                      alt={img.alt || 'Unsplash image'}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-6">
                      <a
                        href={img.photographerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[10px] text-white/70 hover:text-white/90 transition-colors"
                      >
                        {img.photographer}
                      </a>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Photography Style Notes */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Photography Style Notes
            </label>
            <textarea
              value={photoNotes}
              onChange={(e) => setPhotoNotes(e.target.value)}
              rows={3}
              placeholder="Describe the photography direction for this brand (e.g. warm natural lighting, candid lifestyle shots, minimal flat lays...)"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 resize-none"
            />
            <p className="text-xs text-zinc-600 mt-1">
              Style notes will be included in the brand deck export.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // ─── Audience Step Renderer ──────────────────────────────────

  const renderAudienceStep = () => {
    return (
      <div className="space-y-6">
        {audiencePersonas.map((persona, pi) => (
          <div
            key={pi}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4"
          >
            {/* Header row: persona name + remove */}
            <div className="flex items-center justify-between gap-4">
              <input
                type="text"
                value={persona.name}
                onChange={(e) => updatePersona(pi, 'name', e.target.value)}
                placeholder="Persona name"
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-lg font-semibold text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
              />
              {audiencePersonas.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePersona(pi)}
                  className="text-zinc-500 hover:text-red-400 transition-colors text-sm flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Remove
                </button>
              )}
            </div>

            {/* Demographics row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Age Range</label>
                <input
                  type="text"
                  value={persona.ageRange}
                  onChange={(e) => updatePersona(pi, 'ageRange', e.target.value)}
                  placeholder="e.g., 25-35"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Occupation</label>
                <input
                  type="text"
                  value={persona.occupation}
                  onChange={(e) => updatePersona(pi, 'occupation', e.target.value)}
                  placeholder="e.g., Marketing Manager"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Location</label>
                <input
                  type="text"
                  value={persona.location}
                  onChange={(e) => updatePersona(pi, 'location', e.target.value)}
                  placeholder="e.g., Los Angeles, CA"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                />
              </div>
            </div>

            {/* Pain Points */}
            <div>
              <h4 className="text-xs font-medium text-red-400 mb-2">Pain Points</h4>
              <div className="space-y-2">
                {persona.painPoints.map((pp, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={pp}
                      onChange={(e) => updatePersonaListItem(pi, 'painPoints', j, e.target.value)}
                      placeholder="Pain point..."
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                    />
                    {persona.painPoints.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePersonaListItem(pi, 'painPoints', j)}
                        className="text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addPersonaListItem(pi, 'painPoints')}
                className="flex items-center gap-1 mt-2 text-xs text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Pain Point
              </button>
            </div>

            {/* Goals */}
            <div>
              <h4 className="text-xs font-medium text-emerald-400 mb-2">Goals</h4>
              <div className="space-y-2">
                {persona.goals.map((g, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={g}
                      onChange={(e) => updatePersonaListItem(pi, 'goals', j, e.target.value)}
                      placeholder="Goal..."
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                    />
                    {persona.goals.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePersonaListItem(pi, 'goals', j)}
                        className="text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addPersonaListItem(pi, 'goals')}
                className="flex items-center gap-1 mt-2 text-xs text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Goal
              </button>
            </div>

            {/* Channels */}
            <div>
              <h4 className="text-xs font-medium text-zinc-400 mb-2">Channels</h4>
              <div className="flex flex-wrap gap-2">
                {persona.channels.map((ch, j) => (
                  <div key={j} className="flex items-center gap-1">
                    <input
                      type="text"
                      value={ch}
                      onChange={(e) => updatePersonaListItem(pi, 'channels', j, e.target.value)}
                      placeholder="Channel..."
                      className="w-36 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                    />
                    {persona.channels.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePersonaListItem(pi, 'channels', j)}
                        className="text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addPersonaListItem(pi, 'channels')}
                className="flex items-center gap-1 mt-2 text-xs text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Channel
              </button>
            </div>
          </div>
        ))}

        {/* Add Persona button */}
        {audiencePersonas.length < 4 && (
          <button
            type="button"
            onClick={addPersona}
            className="flex items-center gap-2 px-4 py-3 w-full border border-dashed border-zinc-700 hover:border-zinc-500 rounded-xl text-sm text-zinc-400 hover:text-zinc-100 justify-center transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Persona
          </button>
        )}
      </div>
    );
  };

  // ─── Voice Step Renderer ──────────────────────────────────

  const renderVoiceStep = () => {
    return (
      <div className="space-y-8">
        {/* 1. Tone Attributes */}
        <div>
          <h3 className="text-lg font-medium text-zinc-200 mb-3">Tone Attributes</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {voiceTone.map((attr, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-sm bg-amber-500/20 text-amber-400 flex items-center gap-1.5"
              >
                {attr}
                <button
                  type="button"
                  onClick={() => removeToneAttribute(i)}
                  className="hover:text-amber-200 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={toneInput}
              onChange={(e) => setToneInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addToneAttribute();
                }
              }}
              placeholder="Add a tone attribute..."
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
            />
            <button
              type="button"
              onClick={addToneAttribute}
              className="flex items-center gap-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 hover:text-zinc-100 hover:border-zinc-500 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>

        {/* 2. Elevator Pitch */}
        <div>
          <h3 className="text-lg font-medium text-zinc-200 mb-3">Elevator Pitch</h3>
          <textarea
            value={voicePitch}
            onChange={(e) => setVoicePitch(e.target.value)}
            rows={3}
            placeholder="A concise pitch that captures what makes this brand special..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 resize-none"
          />
        </div>

        {/* 3. Taglines */}
        <div>
          <h3 className="text-lg font-medium text-zinc-200 mb-3">Taglines</h3>
          <div className="space-y-3">
            {voiceTaglines.map((tagline, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => updateTagline(i, e.target.value)}
                  placeholder={`Tagline ${i + 1}...`}
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                />
                {voiceTaglines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTagline(i)}
                    className="text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {voiceTaglines.length < 6 && (
            <button
              type="button"
              onClick={addTagline}
              className="flex items-center gap-1.5 mt-3 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Tagline
            </button>
          )}
        </div>

        {/* 4. Messaging Pillars */}
        <div>
          <h3 className="text-lg font-medium text-zinc-200 mb-3">Messaging Pillars</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {voicePillars.map((pillar, i) => (
              <div
                key={i}
                className="relative bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4"
              >
                {voicePillars.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removePillar(i)}
                    className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <input
                  type="text"
                  value={pillar.title}
                  onChange={(e) => updatePillar(i, 'title', e.target.value)}
                  placeholder="Pillar title"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm mb-2"
                />
                <textarea
                  value={pillar.description}
                  onChange={(e) => updatePillar(i, 'description', e.target.value)}
                  rows={2}
                  placeholder="Describe this messaging pillar..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 resize-none text-sm"
                />
              </div>
            ))}
          </div>
          {voicePillars.length < 6 && (
            <button
              type="button"
              onClick={addPillar}
              className="flex items-center gap-2 px-4 py-3 w-full border border-dashed border-zinc-700 hover:border-zinc-500 rounded-xl text-sm text-zinc-400 hover:text-zinc-100 justify-center transition-colors mt-4"
            >
              <Plus className="w-4 h-4" />
              Add Pillar
            </button>
          )}
        </div>

        {/* 5. Voice Dos and Don'ts */}
        <div>
          <h3 className="text-lg font-medium text-zinc-200 mb-3">Voice Dos &amp; Don&apos;ts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Do column */}
            <div className="bg-zinc-900 border border-emerald-500/30 rounded-xl p-5">
              <h4 className="text-sm font-medium text-emerald-400 mb-3">Do</h4>
              <div className="space-y-2">
                {voiceDos.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <input
                      type="text"
                      value={d}
                      onChange={(e) => updateVoiceListItem(voiceDos, setVoiceDos, i, e.target.value)}
                      placeholder="Do this..."
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                    />
                    {voiceDos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVoiceListItem(setVoiceDos, i)}
                        className="text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addVoiceListItem(setVoiceDos)}
                className="flex items-center gap-1 mt-3 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Do
              </button>
            </div>

            {/* Don't column */}
            <div className="bg-zinc-900 border border-red-500/30 rounded-xl p-5">
              <h4 className="text-sm font-medium text-red-400 mb-3">Don&apos;t</h4>
              <div className="space-y-2">
                {voiceDonts.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-red-500 flex-shrink-0 font-bold">&times;</span>
                    <input
                      type="text"
                      value={d}
                      onChange={(e) => updateVoiceListItem(voiceDonts, setVoiceDonts, i, e.target.value)}
                      placeholder="Don't do this..."
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500"
                    />
                    {voiceDonts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVoiceListItem(setVoiceDonts, i)}
                        className="text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addVoiceListItem(setVoiceDonts)}
                className="flex items-center gap-1 mt-3 text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Don&apos;t
              </button>
            </div>
          </div>
        </div>

        {/* 6. Example Phrases */}
        <div>
          <h3 className="text-lg font-medium text-zinc-200 mb-3">Example Phrases</h3>
          <div className="space-y-2">
            {voicePhrases.map((phrase, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-zinc-600 flex-shrink-0 italic">&ldquo;</span>
                <input
                  type="text"
                  value={phrase}
                  onChange={(e) => updateVoiceListItem(voicePhrases, setVoicePhrases, i, e.target.value)}
                  placeholder="Example brand voice phrase..."
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                />
                <span className="text-zinc-600 flex-shrink-0 italic">&rdquo;</span>
                {voicePhrases.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVoiceListItem(setVoicePhrases, i)}
                    className="text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addVoiceListItem(setVoicePhrases)}
            className="flex items-center gap-1.5 mt-3 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Phrase
          </button>
        </div>
      </div>
    );
  };

  // ─── Identity Step Renderer ──────────────────────────────────

  const renderIdentityStep = () => {
    return (
      <div className="space-y-8">
        {/* Brand Story */}
        <div>
          <h3 className="text-lg font-medium text-zinc-200 mb-3">Brand Story</h3>
          <textarea
            value={identityBrandStory}
            onChange={(e) => setIdentityBrandStory(e.target.value)}
            rows={6}
            placeholder="Your brand story..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 resize-none"
          />
        </div>

        {/* Mission Statement */}
        <div>
          <h3 className="text-lg font-medium text-zinc-200 mb-3">Mission Statement</h3>
          <input
            type="text"
            value={identityMission}
            onChange={(e) => setIdentityMission(e.target.value)}
            placeholder="Your mission statement..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
          />
        </div>

        {/* Vision Statement */}
        <div>
          <h3 className="text-lg font-medium text-zinc-200 mb-3">Vision Statement</h3>
          <input
            type="text"
            value={identityVision}
            onChange={(e) => setIdentityVision(e.target.value)}
            placeholder="Your vision statement..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
          />
        </div>

        {/* Core Values */}
        <div>
          <h3 className="text-lg font-medium text-zinc-200 mb-3">Core Values</h3>
          <div className="space-y-3">
            {identityValues.map((v, i) => (
              <div
                key={i}
                className="relative bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4"
              >
                {identityValues.length > 3 && (
                  <button
                    type="button"
                    onClick={() => removeValue(i)}
                    className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <input
                  type="text"
                  value={v.name}
                  onChange={(e) => updateValue(i, 'name', e.target.value)}
                  placeholder="Value name"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm mb-2"
                />
                <textarea
                  value={v.description}
                  onChange={(e) => updateValue(i, 'description', e.target.value)}
                  rows={2}
                  placeholder="Describe this value..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 resize-none text-sm"
                />
              </div>
            ))}
          </div>
          {identityValues.length < 5 && (
            <button
              type="button"
              onClick={addValue}
              className="flex items-center gap-1.5 mt-3 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Value
            </button>
          )}
        </div>

        {/* Brand Personality */}
        <div>
          <h3 className="text-lg font-medium text-zinc-200 mb-3">Brand Personality</h3>
          <div className="space-y-3">
            {identityPersonality.map((p, i) => (
              <div
                key={i}
                className="relative bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4"
              >
                {identityPersonality.length > 3 && (
                  <button
                    type="button"
                    onClick={() => removeTrait(i)}
                    className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <input
                  type="text"
                  value={p.trait}
                  onChange={(e) => updateTrait(i, 'trait', e.target.value)}
                  placeholder="Trait name"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm mb-2"
                />
                <textarea
                  value={p.description}
                  onChange={(e) => updateTrait(i, 'description', e.target.value)}
                  rows={2}
                  placeholder="Describe this trait..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 resize-none text-sm"
                />
              </div>
            ))}
          </div>
          {identityPersonality.length < 7 && (
            <button
              type="button"
              onClick={addTrait}
              className="flex items-center gap-1.5 mt-3 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Trait
            </button>
          )}
        </div>
      </div>
    );
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
            <div className={`mx-auto ${activeStep === 1 || activeStep === 5 || activeStep === 6 || activeStep === 7 ? 'max-w-5xl' : 'max-w-3xl'}`}>
              <div className="flex items-center gap-3 mb-6">
                <currentStepData.icon className="w-6 h-6 text-amber-400" />
                <h2 className="text-xl font-semibold text-zinc-100">
                  {currentStepData.label}
                </h2>
              </div>

              {activeStep === 8 ? (
                /* ─── Motion Direction ─────────────────────────── */
                renderMotionStep()
              ) : activeStep === 7 ? (
                /* ─── Applications ──────────────────────────────── */
                renderApplicationsStep()
              ) : activeStep === 6 ? (
                /* ─── Dark Mode ─────────────────────────────────── */
                renderDarkModeStep()
              ) : activeStep === 5 ? (
                /* ─── Visual System ─────────────────────────────── */
                renderVisualsStep()
              ) : activeStep === 4 ? (
                /* ─── Voice & Messaging ─────────────────────────── */
                renderVoiceStep()
              ) : activeStep === 3 ? (
                /* ─── Audience ──────────────────────────────────── */
                renderAudienceStep()
              ) : activeStep === 2 ? (
                /* ─── Core Identity ──────────────────────────────── */
                renderIdentityStep()
              ) : activeStep === 0 ? (
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
