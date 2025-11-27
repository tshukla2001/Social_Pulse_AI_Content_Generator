import React, { useState, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { GoogleGenAI, Type, Schema } from "@google/genai";

// --- Types ---
type Platform = 'linkedin' | 'twitter' | 'instagram';
type Tone = 'Professional' | 'Witty' | 'Urgent';
type View = 'generator' | 'saved' | 'compare';
type SavedTab = 'list' | 'analytics';

interface AnalyticsData {
    estimatedReach: string;
    engagementRate: number;
    viralityScore: number;
    bestTime: string;
}

interface SavedPost {
  id: string;
  text: string;
  platform: Platform;
  tone: Tone;
  timestamp: number;
  analytics: AnalyticsData;
}

// --- Icons ---
const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

const SparkleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="currentColor"/>
    </svg>
);

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const RefreshIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 4v6h-6"></path>
    <path d="M1 20v-6h6"></path>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);

const BookmarkIcon = ({ filled }: { filled?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const XIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
  </svg>
);

const InstagramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const CompareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
    <line x1="9" y1="9" x2="9" y2="10"></line>
    <line x1="9" y1="13" x2="9" y2="14"></line>
    <line x1="9" y1="17" x2="9" y2="18"></line>
    <line x1="13" y1="9" x2="13" y2="10"></line>
    <line x1="13" y1="13" x2="13" y2="14"></line>
    <line x1="13" y1="17" x2="13" y2="18"></line>
  </svg>
);

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const ChartIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>
);

const ListIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
);

const Loader = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
    <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
      <style>{`
        .spinner_V8m1{transform-origin:center;animation:spinner_zKoa 2s linear infinite}
        .spinner_V8m1 circle{stroke-linecap:round;animation:spinner_YpZS 1.5s ease-in-out infinite}
        @keyframes spinner_zKoa{100%{transform:rotate(360deg)}}
        @keyframes spinner_YpZS{0%{stroke-dasharray:0 150;stroke-dashoffset:0}47.5%{stroke-dasharray:42 150;stroke-dashoffset:-16}95%,100%{stroke-dasharray:42 150;stroke-dashoffset:-59}}
      `}</style>
      <g className="spinner_V8m1">
        <circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3"></circle>
      </g>
    </svg>
    <span style={{ fontSize: '0.9rem', opacity: 0.8, letterSpacing: '0.05em', fontWeight: 500 }}>CREATING MAGIC...</span>
  </div>
);

// --- Theme ---
const themes = {
    light: {
        bg: '#F9FAFB', // Cool gray 50
        surface: 'rgba(255, 255, 255, 0.8)',
        text: '#111827',
        textSecondary: '#6B7280',
        border: '#E5E7EB',
        primary: '#6366F1', // Indigo 500
        primaryHover: '#4F46E5',
        inputBg: '#FFFFFF',
        cardBorder: '1px solid rgba(229, 231, 235, 0.8)',
        shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        highlight: 'rgba(99, 102, 241, 0.08)',
        error: '#EF4444',
        glass: 'blur(12px)',
        analyticsBarBg: '#E2E8F0',
    },
    dark: {
        bg: '#0B1120', // Deep dark blue
        surface: 'rgba(30, 41, 59, 0.5)', // Transparent slate
        text: '#F8FAFC',
        textSecondary: '#94A3B8',
        border: 'rgba(51, 65, 85, 0.6)',
        primary: '#818CF8', // Indigo 400
        primaryHover: '#6366F1',
        inputBg: 'rgba(15, 23, 42, 0.5)', 
        cardBorder: '1px solid rgba(51, 65, 85, 0.5)',
        shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)', 
        highlight: 'rgba(129, 140, 248, 0.1)',
        error: '#F87171',
        glass: 'blur(16px)',
        analyticsBarBg: '#1e293b',
    }
};

const PlatformConfig: Record<Platform, {
    name: string;
    color: string;
    darkColor?: string;
    description: string;
    icon: React.ComponentType;
}> = {
  linkedin: {
    name: "LinkedIn",
    color: "#0A66C2",
    description: "Professional & Detailed",
    icon: LinkedInIcon
  },
  twitter: {
    name: "X (Twitter)",
    color: "#000000",
    darkColor: "#FFFFFF",
    description: "Short & Punchy",
    icon: XIcon
  },
  instagram: {
    name: "Instagram",
    color: "#E1306C",
    description: "Visual & Hashtags",
    icon: InstagramIcon
  }
};

// Helper to generate mock analytics
const generateMockAnalytics = (platform: Platform, tone: Tone): AnalyticsData => {
    let reachBase = 0;
    let engagementBase = 0;
    let viralityBase = 0;
    let time = "9:00 AM";

    // Logic to simulate AI estimation based on platform trends
    if (platform === 'linkedin') {
        reachBase = 1500;
        engagementBase = 3.5;
        viralityBase = 20;
        time = tone === 'Urgent' ? "Tue 8:00 AM" : "Wed 10:00 AM";
        if (tone === 'Professional') { reachBase += 500; engagementBase += 1.0; }
        if (tone === 'Witty') { engagementBase += 1.5; viralityBase += 15; }
    } else if (platform === 'twitter') {
        reachBase = 800;
        engagementBase = 2.0;
        viralityBase = 60;
        time = "Thu 12:00 PM";
        if (tone === 'Witty') { viralityBase += 25; reachBase += 400; }
        if (tone === 'Urgent') { engagementBase += 2.0; }
    } else if (platform === 'instagram') {
        reachBase = 1200;
        engagementBase = 5.0;
        viralityBase = 40;
        time = "Sat 6:00 PM";
        if (tone === 'Urgent') { engagementBase += 2.5; }
        if (tone === 'Professional') { reachBase += 300; }
    }

    // Add some random variance
    const rVar = Math.floor(Math.random() * 500) - 250;
    const eVar = (Math.random() * 1.5) - 0.75;
    const vVar = Math.floor(Math.random() * 15) - 7;

    const finalReach = Math.max(100, Math.round(reachBase + rVar));
    const finalEngagement = Math.max(0.1, (engagementBase + eVar)).toFixed(1);
    const finalVirality = Math.min(100, Math.max(1, viralityBase + vVar));

    return {
        estimatedReach: `${(finalReach / 1000).toFixed(1)}k`,
        engagementRate: Number(finalEngagement),
        viralityScore: finalVirality,
        bestTime: time
    };
};

// Hook for window size
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}

function App() {
  const [currentView, setCurrentView] = useState<View>('generator');
  const [savedTab, setSavedTab] = useState<SavedTab>('list');
  const [idea, setIdea] = useState("");
  const [tone, setTone] = useState<Tone>("Professional");
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | "">("");
  const [displayPlatform, setDisplayPlatform] = useState<Platform | "">(""); 
  const [apiKeySet, setApiKeySet] = useState(false);
  const [loadingText, setLoadingText] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [maxCharLimit, setMaxCharLimit] = useState("");
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [selectedSavedIds, setSelectedSavedIds] = useState<Set<string>>(new Set());

  const theme = isDarkMode ? themes.dark : themes.light;
  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth < 640;

  useEffect(() => {
    if (process.env.API_KEY) {
        setApiKeySet(true);
    }
  }, []);

  useEffect(() => {
    if (!generatedContent) {
        setDisplayPlatform(selectedPlatform);
    }
  }, [selectedPlatform, generatedContent]);

  const generateContent = async () => {
    if (!idea || !selectedPlatform) return;
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    setDisplayPlatform(selectedPlatform);
    setLoadingText(true);
    setGeneratedContent(null);

    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        post: { type: Type.STRING, description: `The generated ${selectedPlatform} post text.` },
      },
      required: ["post"],
    };

    const charLimitInstruction = maxCharLimit 
      ? `STRICT CONSTRAINT: The post must be under ${maxCharLimit} characters.` 
      : "Length: Optimal for the platform and tone.";

    const prompt = `Create a social media post for ${selectedPlatform} based on this idea: "${idea}". 
    Tone: ${tone}.
    ${charLimitInstruction}
    
    Platform & Tone Guidelines:
    - LinkedIn + Professional: Detailed, authoritative, structured.
    - LinkedIn + Witty: Clever, engaging, professional but approachable.
    - LinkedIn + Urgent: Action-oriented, direct, clear call to action.
    - X (Twitter) + Professional: Concise news/insight style.
    - X (Twitter) + Witty: Snarky or clever observation, viral potential.
    - X (Twitter) + Urgent: "Breaking" news style or immediate call to action.
    - Instagram + Professional: Polished aesthetic description, professional hashtags.
    - Instagram + Witty: Punny caption, fun emojis.
    - Instagram + Urgent: "Link in bio" focus, flash sale/announcement vibe.

    Output ONLY the post text content.`;

    try {
      let jsonResponseText = "{}";

      try {
        // Attempt 1: Gemini 3 Pro (High Quality)
        const result = await ai.models.generateContent({
          model: "gemini-3-pro-preview",
          contents: prompt,
          config: {
              responseMimeType: "application/json",
              responseSchema: schema
          }
        });
        jsonResponseText = result.text || "{}";
      } catch (primaryError) {
        console.warn("Gemini 3 Pro failed, failing back to Flash...", primaryError);
        // Attempt 2: Gemini 2.5 Flash (High Stability)
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema
            }
          });
          jsonResponseText = result.text || "{}";
      }

      const data = JSON.parse(jsonResponseText);
      
      if (data.post) {
        setGeneratedContent(data.post);
      } else {
        throw new Error("No post content generated");
      }
      setLoadingText(false);

    } catch (e) {
      console.error("Error generating content:", e);
      setLoadingText(false);
      alert("Something went wrong generating content. Please try again.");
    }
  };

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleShare = (platform: Platform, text: string) => {
    if (!text) return;
    const encodedText = encodeURIComponent(text);
    let url = '';

    switch (platform) {
        case 'linkedin':
            url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodedText}`;
            window.open(url, '_blank');
            break;
        case 'twitter':
            url = `https://twitter.com/intent/tweet?text=${encodedText}`;
            window.open(url, '_blank');
            break;
        case 'instagram':
            handleCopy(text);
            alert("Text copied! Opening Instagram for you to paste.");
            window.open('https://www.instagram.com/', '_blank');
            break;
    }
  };

  const isCurrentSaved = useMemo(() => {
      return savedPosts.some(p => p.text === generatedContent);
  }, [savedPosts, generatedContent]);

  const handleSavePost = () => {
      if (!generatedContent || !displayPlatform) return;
      
      if (isCurrentSaved) {
          const postToRemove = savedPosts.find(p => p.text === generatedContent);
          if (postToRemove) {
              handleDeletePost(postToRemove.id);
          }
      } else {
          // Determine analytics
          const analytics = generateMockAnalytics(displayPlatform as Platform, tone);

          const newPost: SavedPost = {
              id: Date.now().toString(),
              text: generatedContent,
              platform: displayPlatform as Platform,
              tone: tone,
              timestamp: Date.now(),
              analytics: analytics
          };
          setSavedPosts([newPost, ...savedPosts]);
      }
  };

  const handleDeletePost = (id: string) => {
      setSavedPosts(savedPosts.filter(post => post.id !== id));
      if (selectedSavedIds.has(id)) {
        const newSet = new Set(selectedSavedIds);
        newSet.delete(id);
        setSelectedSavedIds(newSet);
      }
  };

  const toggleSavedSelection = (id: string) => {
    const newSet = new Set(selectedSavedIds);
    if (newSet.has(id)) {
        newSet.delete(id);
    } else {
        newSet.add(id);
    }
    setSelectedSavedIds(newSet);
  };

  const startComparison = () => {
    if (selectedSavedIds.size > 0) {
        setCurrentView('compare');
    }
  };

  const isFormValid = apiKeySet && !loadingText && selectedPlatform && idea.trim().length > 0;

  // --- Dynamic Styles ---
  const styles = useMemo(() => ({
    container: {
      minHeight: '100vh',
      background: isDarkMode 
          ? `radial-gradient(circle at 15% 15%, #1e1b4b 0%, transparent 45%), radial-gradient(circle at 85% 85%, #312e81 0%, transparent 40%), linear-gradient(145deg, #020617 0%, #0F172A 100%)`
          : `radial-gradient(circle at 15% 15%, #e0e7ff 0%, transparent 45%), radial-gradient(circle at 85% 85%, #c7d2fe 0%, transparent 40%), linear-gradient(145deg, #f3f4f6 0%, #e5e7eb 100%)`,
      color: theme.text,
      transition: 'background 0.5s ease',
      padding: isMobile ? '1rem 0.75rem' : '2rem 1.5rem',
      position: 'relative' as const,
      overflowX: 'hidden' as const,
    },
    wrapper: {
        maxWidth: currentView === 'compare' ? '1440px' : '840px', 
        margin: '0 auto',
        transition: 'max-width 0.4s ease-in-out',
        position: 'relative' as const,
        zIndex: 1,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2.5rem',
      padding: '0 0.5rem',
    },
    compareHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between', 
        marginBottom: '2rem',
        padding: '0 0.5rem',
        position: 'relative' as const, 
        height: '40px',
    },
    compareTitle: {
        margin: 0,
        fontSize: isMobile ? '1.1rem' : '1.25rem',
        fontWeight: '700',
        position: 'absolute' as const,
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center' as const,
        width: '100%',
        pointerEvents: 'none' as const, 
        whiteSpace: 'nowrap' as const,
        letterSpacing: '-0.01em',
    },
    brand: {
      display: 'flex',
      flexDirection: 'column' as const,
    },
    title: {
      fontSize: isMobile ? '1.75rem' : '2.5rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: 0,
      letterSpacing: '-0.03em',
      filter: 'drop-shadow(0 2px 4px rgba(99, 102, 241, 0.2))',
    },
    subtitle: {
      color: theme.textSecondary,
      fontSize: '0.95rem',
      marginTop: '0.5rem',
      fontWeight: '500',
      letterSpacing: '0.01em',
    },
    toggleBtn: {
      background: theme.surface,
      backdropFilter: theme.glass,
      WebkitBackdropFilter: theme.glass,
      border: `1px solid ${theme.border}`,
      color: theme.text,
      padding: '0.75rem',
      borderRadius: '50%',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: theme.shadow,
    },
    navContainer: {
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2.5rem',
        background: theme.surface,
        backdropFilter: theme.glass,
        WebkitBackdropFilter: theme.glass,
        padding: '0.4rem',
        borderRadius: '20px',
        border: `1px solid ${theme.border}`,
        boxShadow: theme.shadow,
    },
    navButton: {
        flex: 1,
        padding: '0.85rem',
        border: 'none',
        background: 'transparent',
        color: theme.textSecondary,
        cursor: 'pointer',
        borderRadius: '16px',
        fontWeight: '600',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.6rem',
        fontSize: isMobile ? '0.85rem' : '0.95rem',
    },
    navButtonActive: {
        background: theme.highlight,
        color: theme.primary,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    },
    mainCard: {
      background: theme.surface,
      backdropFilter: theme.glass,
      WebkitBackdropFilter: theme.glass,
      borderRadius: '32px',
      padding: isMobile ? '1.5rem' : '2.5rem',
      border: theme.cardBorder,
      boxShadow: theme.shadow,
      marginBottom: '3.5rem',
    },
    inputLabel: {
      display: 'block',
      fontWeight: '700',
      marginBottom: '0.75rem',
      color: theme.text,
      fontSize: '0.85rem',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.08em',
      opacity: 0.9,
    },
    requiredMark: {
        color: theme.error,
        marginLeft: '4px',
    },
    textarea: {
      width: '100%',
      padding: '1.25rem',
      borderRadius: '20px',
      border: `1px solid ${theme.border}`,
      fontSize: '1.05rem',
      backgroundColor: theme.inputBg,
      color: theme.text,
      marginBottom: '0.75rem',
      resize: 'vertical' as const,
      minHeight: '140px',
      fontFamily: 'inherit',
      boxSizing: 'border-box' as const,
      outline: 'none',
      transition: 'all 0.2s ease',
      lineHeight: 1.6,
    },
    charCount: {
        textAlign: 'right' as const,
        fontSize: '0.8rem',
        color: theme.textSecondary,
        marginBottom: '2.5rem',
        fontWeight: 600,
        fontVariantNumeric: 'tabular-nums',
    },
    platformGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
      gap: '1rem',
      marginBottom: '2.5rem',
    },
    platformButton: {
      background: theme.inputBg,
      border: `1px solid ${theme.border}`,
      borderRadius: '20px',
      padding: isMobile ? '1.25rem 1rem' : '1.75rem 1rem',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: (isMobile ? 'row' : 'column') as React.CSSProperties['flexDirection'],
      alignItems: 'center',
      justifyContent: (isMobile ? 'flex-start' : 'center') as React.CSSProperties['justifyContent'],
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      color: theme.textSecondary,
      gap: '0.85rem',
      fontSize: '0.95rem',
      fontWeight: '600',
    },
    controls: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: '1.5rem',
      marginBottom: '2.5rem',
    },
    select: {
      width: '100%',
      padding: '1rem 1.25rem',
      borderRadius: '16px',
      border: `1px solid ${theme.border}`,
      fontSize: '1rem',
      backgroundColor: theme.inputBg,
      color: theme.text,
      cursor: 'pointer',
      appearance: 'none' as const,
      fontFamily: 'inherit',
      boxSizing: 'border-box' as const,
      outline: 'none',
      transition: 'all 0.2s ease',
    },
    toneSelect: { 
      width: '100%',
      padding: '1rem 1.25rem',
      borderRadius: '16px',
      border: `1px solid ${theme.border}`,
      fontSize: '1rem',
      backgroundColor: theme.inputBg,
      color: theme.text,
      cursor: 'pointer',
      appearance: 'none' as const,
      fontFamily: 'inherit',
      boxSizing: 'border-box' as const,
      outline: 'none',
      backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23${theme.textSecondary.replace('#', '')}%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 1.25rem center',
      backgroundSize: '0.8rem',
      transition: 'all 0.2s ease',
    },
    generateBtn: {
      background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryHover})`,
      color: '#fff',
      border: 'none',
      padding: '1.4rem',
      borderRadius: '20px',
      fontSize: '1.1rem',
      fontWeight: '700',
      cursor: 'pointer',
      width: '100%',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: `0 8px 20px ${theme.primary}50`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.85rem',
      opacity: isFormValid ? 1 : 0.6,
      pointerEvents: isFormValid ? 'auto' as const : 'none' as const,
      letterSpacing: '0.02em',
    },
    resultArea: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '2rem',
    },
    card: {
      background: theme.surface,
      backdropFilter: theme.glass,
      WebkitBackdropFilter: theme.glass,
      borderRadius: '32px', 
      overflow: 'hidden',
      border: theme.cardBorder,
      boxShadow: theme.shadow,
      display: 'flex',
      flexDirection: 'column' as const,
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s',
      height: '100%', 
    },
    cardHeader: {
      padding: isMobile ? '1rem 1.25rem' : '1.5rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: `1px solid ${theme.border}`,
    },
    platformBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        fontWeight: '700',
        fontSize: '1rem',
        letterSpacing: '-0.01em',
        whiteSpace: 'nowrap' as const,
    },
    iconBtn: {
        background: 'transparent',
        border: `1px solid ${theme.border}`,
        color: theme.textSecondary,
        cursor: 'pointer',
        padding: '0.5rem',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
        marginLeft: '0.6rem',
        minWidth: '36px',
        height: '36px',
    },
    cardBody: {
      padding: currentView === 'compare' ? (isMobile ? '1.5rem' : '3rem') : (isMobile ? '1.5rem' : '2.5rem'),
      flexGrow: 1,
    },
    postText: {
      whiteSpace: 'pre-wrap' as const,
      lineHeight: '1.7',
      color: theme.text,
      fontSize: '1.15rem',
      margin: 0,
      fontWeight: 400,
    },
    placeholder: {
      color: theme.textSecondary,
      textAlign: 'center' as const,
      fontStyle: 'italic',
      padding: '2rem',
    },
    cardFooter: {
        marginTop: '2rem',
        paddingTop: '1.25rem',
        borderTop: `1px solid ${theme.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap' as const,
        gap: '1rem',
    },
    compareFooter: {
        marginTop: 'auto',
        paddingTop: '1.5rem',
        borderTop: `1px solid ${theme.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: isMobile ? '1.5rem' : '2rem',
        paddingRight: isMobile ? '1.5rem' : '2rem',
        paddingBottom: '1.5rem',
    },
    compareMetaItem: {
        fontSize: '0.9rem',
        color: theme.textSecondary,
        fontFamily: 'monospace',
        fontWeight: 600,
    },
    toneTag: {
        fontSize: '0.75rem',
        fontWeight: '800',
        padding: '0.4rem 0.85rem',
        borderRadius: '8px',
        background: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
        color: theme.text,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.08em',
        display: 'inline-block',
    },
    generatedCharCount: {
        fontSize: '0.85rem',
        color: theme.textSecondary,
        fontWeight: 600,
        fontVariantNumeric: 'tabular-nums',
    },
    regenerateBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: 'transparent',
      border: `1px solid ${theme.primary}`,
      color: theme.primary,
      padding: '0.6rem 1rem',
      borderRadius: '10px',
      fontSize: '0.9rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    satisfactionText: {
        fontSize: '0.9rem',
        color: theme.textSecondary,
        marginRight: '0.85rem',
    },
    savedSection: {
        marginTop: '0',
    },
    savedTabsContainer: {
        display: 'flex',
        gap: '1rem',
        borderBottom: `1px solid ${theme.border}`,
        marginBottom: '1.5rem',
        paddingBottom: '0.5rem',
    },
    savedTab: {
        background: 'transparent',
        border: 'none',
        padding: '0.5rem 1rem',
        color: theme.textSecondary,
        cursor: 'pointer',
        fontSize: '0.95rem',
        fontWeight: '600',
        borderRadius: '8px',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    savedTabActive: {
        color: theme.primary,
        background: theme.highlight,
    },
    emptySaved: {
        textAlign: 'center' as const,
        padding: '5rem 2rem',
        color: theme.textSecondary,
        background: theme.surface,
        backdropFilter: theme.glass,
        WebkitBackdropFilter: theme.glass,
        borderRadius: '32px',
        border: theme.cardBorder,
        boxShadow: theme.shadow,
    },
    savedTitle: {
        fontSize: '1.5rem',
        fontWeight: '700',
        marginBottom: '1.5rem',
        color: theme.text,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    savedGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '1.5rem',
        paddingBottom: '6rem', 
    },
    savedCard: {
        background: theme.surface,
        backdropFilter: theme.glass,
        WebkitBackdropFilter: theme.glass,
        border: `1px solid ${theme.border}`,
        borderRadius: '24px',
        padding: '2rem',
        position: 'relative' as const,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column' as const,
        boxShadow: theme.shadow,
    },
    savedHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1.25rem',
    },
    savedMeta: {
        display: 'flex',
        gap: '0.85rem',
        alignItems: 'center',
        flexWrap: 'wrap' as const,
    },
    tag: {
        fontSize: '0.75rem',
        padding: '0.35rem 0.65rem',
        borderRadius: '8px',
        fontWeight: '700',
        background: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
        border: `1px solid ${theme.border}`,
        letterSpacing: '0.02em',
    },
    checkbox: {
        width: '22px',
        height: '22px',
        borderRadius: '6px',
        border: `2px solid ${theme.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
        marginRight: '1rem',
        background: 'transparent',
    },
    floatingAction: {
        position: 'fixed' as const,
        bottom: '2.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        background: theme.primary,
        color: '#fff',
        padding: '1rem 2.5rem',
        borderRadius: '50px',
        boxShadow: `0 15px 30px -5px ${theme.primary}60`,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontWeight: '700',
        cursor: 'pointer',
        zIndex: 100,
        border: 'none',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        fontSize: '1rem',
    },
    comparisonGrid: {
        display: 'grid',
        gridTemplateColumns: isMobile 
            ? '1fr' 
            : ((windowWidth >= 700 && windowWidth <= 1100) ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(380px, 1fr))'), 
        gap: '2.5rem', 
        alignItems: 'stretch',
    },
    backButton: {
        background: theme.surface,
        backdropFilter: theme.glass,
        border: `1px solid ${theme.border}`,
        color: theme.textSecondary,
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        fontSize: '0.95rem',
        fontWeight: '600',
        cursor: 'pointer',
        padding: '0.6rem 1rem',
        borderRadius: '12px',
        zIndex: 10,
        boxShadow: theme.shadow,
    },
    analyticsGrid: {
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
        paddingBottom: '2rem',
    },
    analyticsCard: {
        background: theme.surface,
        backdropFilter: theme.glass,
        border: `1px solid ${theme.border}`,
        borderRadius: '20px',
        padding: isMobile ? '1.25rem' : '1.5rem', // Reduced padding on mobile
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '1rem',
    },
    analyticsHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5rem',
        gap: '1rem',
    },
    analyticsSnippet: {
        fontSize: '0.9rem',
        color: theme.text,
        fontWeight: 600,
        marginBottom: '0.75rem',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical' as any,
        overflow: 'hidden',
        lineHeight: 1.5,
    },
    analyticsRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: isMobile ? '0.8rem' : '0.85rem',
        color: theme.textSecondary,
    },
    progressBarBg: {
        width: isMobile ? '80px' : '100px', // Smaller on mobile
        height: '6px',
        background: theme.analyticsBarBg,
        borderRadius: '3px',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        background: theme.primary,
        borderRadius: '3px',
    },
    disclaimer: {
        fontSize: '0.8rem',
        color: theme.textSecondary,
        fontStyle: 'italic',
        textAlign: 'center' as const,
        marginTop: '2rem',
        opacity: 0.7,
    }
  }), [theme, isDarkMode, isFormValid, selectedPlatform, displayPlatform, currentView, windowWidth, isMobile]);

  const currentConfig = displayPlatform ? PlatformConfig[displayPlatform] : null;
  const badgeColor = (currentConfig && isDarkMode && currentConfig.darkColor) ? currentConfig.darkColor : (currentConfig ? currentConfig.color : 'transparent');

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        
        {/* Header */}
        {currentView !== 'compare' && (
             <header style={styles.header}>
                <div style={styles.brand}>
                    <h1 style={styles.title}>Social Pulse</h1>
                    <div style={styles.subtitle}>AI-Powered Content Engine</div>
                </div>
                <button 
                    onClick={() => setIsDarkMode(!isDarkMode)} 
                    style={styles.toggleBtn}
                    title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {isDarkMode ? <SunIcon /> : <MoonIcon />}
                </button>
            </header>
        )}

        {/* Navigation Tabs - Hidden in Compare View */}
        {currentView !== 'compare' && (
            <div style={styles.navContainer}>
                <button 
                    style={{...styles.navButton, ...(currentView === 'generator' ? styles.navButtonActive : {})}}
                    onClick={() => setCurrentView('generator')}
                >
                    <SparkleIcon /> Generator
                </button>
                <button 
                    style={{...styles.navButton, ...(currentView === 'saved' ? styles.navButtonActive : {})}}
                    onClick={() => setCurrentView('saved')}
                >
                    <BookmarkIcon /> Saved Drafts ({savedPosts.length})
                </button>
            </div>
        )}

        {/* Compare View Header */}
        {currentView === 'compare' && (
            <div style={styles.compareHeader}>
                 <button 
                    style={styles.backButton} 
                    onClick={() => setCurrentView('saved')}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                 >
                    <BackIcon /> 
                    {windowWidth > 640 && "Back to Drafts"}
                 </button>
                 <h2 style={styles.compareTitle}>
                    {windowWidth > 640 ? `Comparing ${selectedSavedIds.size} Drafts` : 'Comparison'}
                 </h2>
                 <div style={{width: 40}}></div> 
            </div>
        )}

        {/* Generator View */}
        {currentView === 'generator' && (
            <>
                <section style={styles.mainCard}>
                    <label style={styles.inputLabel}>
                        Content Idea
                        <span style={styles.requiredMark}>*</span>
                    </label>
                    <textarea
                        style={styles.textarea}
                        placeholder="What do you want to post about today?"
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        onFocus={(e) => e.target.style.borderColor = theme.primary}
                        onBlur={(e) => e.target.style.borderColor = theme.border.replace('1px solid ', '')}
                    />
                    <div style={styles.charCount}>{idea.length} characters</div>

                    <label style={styles.inputLabel}>
                        Select Platform
                        <span style={styles.requiredMark}>*</span>
                    </label>
                    <div style={styles.platformGrid}>
                        {(Object.keys(PlatformConfig) as Platform[]).map((key) => {
                            const config = PlatformConfig[key];
                            const isActive = selectedPlatform === key;
                            const activeColor = isDarkMode && config.darkColor ? config.darkColor : config.color;
                            const Icon = config.icon;

                            return (
                                <button
                                    key={key}
                                    style={{
                                        ...styles.platformButton,
                                        ...(isActive ? {
                                            borderColor: activeColor,
                                            color: theme.text,
                                            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                                            boxShadow: `0 8px 16px -4px ${activeColor}20`,
                                            transform: 'translateY(-3px)'
                                        } : {})
                                    }}
                                    onClick={() => setSelectedPlatform(key)}
                                    onMouseEnter={(e) => !isActive && (e.currentTarget.style.borderColor = isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)')}
                                    onMouseLeave={(e) => !isActive && (e.currentTarget.style.borderColor = theme.border.replace('1px solid ', ''))}
                                >
                                    <div style={{
                                        color: isActive ? activeColor : 'inherit', 
                                        transition: 'all 0.2s', 
                                        transform: isActive ? 'scale(1.1)' : 'scale(1)'
                                    }}>
                                        <Icon />
                                    </div>
                                    {config.name}
                                </button>
                            )
                        })}
                    </div>

                    <div style={styles.controls}>
                        <div>
                            <label style={styles.inputLabel}>
                                Voice Tone
                                <span style={styles.requiredMark}>*</span>
                            </label>
                            <select 
                                style={styles.toneSelect} 
                                value={tone} 
                                onChange={(e) => setTone(e.target.value as Tone)}
                                onFocus={(e) => e.target.style.borderColor = theme.primary}
                                onBlur={(e) => e.target.style.borderColor = theme.border.replace('1px solid ', '')}
                            >
                                <option value="Professional">Professional</option>
                                <option value="Witty">Witty</option>
                                <option value="Urgent">Urgent</option>
                            </select>
                        </div>
                        <div>
                            <label style={styles.inputLabel}>Max Length (Characters)</label>
                            <input
                                type="number"
                                style={styles.select}
                                placeholder="e.g. 280"
                                value={maxCharLimit}
                                onChange={(e) => setMaxCharLimit(e.target.value)}
                                min="1"
                                onFocus={(e) => e.target.style.borderColor = theme.primary}
                                onBlur={(e) => e.target.style.borderColor = theme.border.replace('1px solid ', '')}
                            />
                        </div>
                    </div>

                    <button 
                        style={styles.generateBtn}
                        onClick={generateContent}
                        disabled={!isFormValid}
                        onMouseEnter={(e) => isFormValid && (e.currentTarget.style.transform = 'translateY(-2px)')}
                        onMouseLeave={(e) => isFormValid && (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                        {loadingText ? (
                            <>Generating Assets...</>
                        ) : (
                            <><SparkleIcon /> Generate Content</>
                        )}
                    </button>
                </section>

                {/* Results - Only show if platform is selected/displayed */}
                {displayPlatform && currentConfig && (
                    <div style={styles.resultArea}>
                        <article style={styles.card}>
                            <div style={styles.cardHeader}>
                                <div style={{...styles.platformBadge, color: badgeColor}}>
                                    <div style={{width: 12, height: 12, borderRadius: '50%', backgroundColor: badgeColor, boxShadow: `0 0 10px ${badgeColor}`}}></div>
                                    {currentConfig.name}
                                </div>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    {!isMobile && (
                                        <span style={{fontSize: '0.85rem', color: theme.textSecondary, fontWeight: 500, marginRight: '1rem'}}>
                                            {currentConfig.description}
                                        </span>
                                    )}
                                    
                                    <button
                                        style={{
                                            ...styles.iconBtn,
                                            color: isCurrentSaved ? theme.primary : theme.textSecondary,
                                            borderColor: isCurrentSaved ? theme.primary : theme.border,
                                            opacity: generatedContent ? 1 : 0.5,
                                            cursor: generatedContent ? 'pointer' : 'default'
                                        }}
                                        onClick={handleSavePost}
                                        disabled={!generatedContent}
                                        title={isCurrentSaved ? "Remove from Favorites" : "Save to Favorites"}
                                        onMouseEnter={(e) => generatedContent && (e.currentTarget.style.transform = 'translateY(-2px)')}
                                        onMouseLeave={(e) => generatedContent && (e.currentTarget.style.transform = 'translateY(0)')}
                                    >
                                        <BookmarkIcon filled={isCurrentSaved} />
                                    </button>

                                    <button
                                        style={{
                                            ...styles.iconBtn,
                                            color: isCopied ? theme.primary : theme.textSecondary,
                                            borderColor: isCopied ? theme.primary : theme.border,
                                            opacity: generatedContent ? 1 : 0.5,
                                            cursor: generatedContent ? 'pointer' : 'default'
                                        }}
                                        onClick={() => generatedContent && handleCopy(generatedContent)}
                                        disabled={!generatedContent}
                                        title="Copy to clipboard"
                                        onMouseEnter={(e) => generatedContent && (e.currentTarget.style.transform = 'translateY(-2px)')}
                                        onMouseLeave={(e) => generatedContent && (e.currentTarget.style.transform = 'translateY(0)')}
                                    >
                                        {isCopied ? <CheckIcon /> : <CopyIcon />}
                                    </button>
                                    
                                    <button
                                        style={{
                                            ...styles.iconBtn,
                                            opacity: generatedContent ? 1 : 0.5,
                                            cursor: generatedContent ? 'pointer' : 'default'
                                        }}
                                        onClick={() => generatedContent && displayPlatform && handleShare(displayPlatform, generatedContent)}
                                        disabled={!generatedContent}
                                        title={`Share on ${currentConfig.name}`}
                                        onMouseEnter={(e) => generatedContent && (e.currentTarget.style.transform = 'translateY(-2px)')}
                                        onMouseLeave={(e) => generatedContent && (e.currentTarget.style.transform = 'translateY(0)')}
                                    >
                                        <ShareIcon />
                                    </button>
                                </div>
                            </div>

                            <div style={styles.cardBody}>
                                {loadingText ? (
                                    <div style={styles.placeholder}>
                                        <Loader />
                                    </div>
                                ) : generatedContent ? (
                                    <>
                                        <div style={styles.postText}>{generatedContent}</div>
                                        <div style={styles.cardFooter}>
                                            <div style={styles.generatedCharCount}>{generatedContent.length} characters</div>
                                            <div style={{display: 'flex', alignItems: 'center'}}>
                                                <span style={styles.satisfactionText}>Not satisfied?</span>
                                                <button 
                                                    style={styles.regenerateBtn} 
                                                    onClick={generateContent}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = theme.highlight}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                >
                                                    <RefreshIcon /> Regenerate
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div style={styles.placeholder}>Ready to generate your {currentConfig.name} post</div>
                                )}
                            </div>
                        </article>
                    </div>
                )}
            </>
        )}

        {/* Saved Drafts View */}
        {currentView === 'saved' && (
            <div style={styles.savedSection}>
                {savedPosts.length === 0 ? (
                    <div style={styles.emptySaved}>
                        <BookmarkIcon />
                        <h3 style={{marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.25rem'}}>No saved drafts yet</h3>
                        <p style={{margin: 0, opacity: 0.7, lineHeight: 1.6}}>Generate some content and tap the bookmark icon<br/>to save it here for later.</p>
                        <button 
                            style={{
                                marginTop: '2rem', 
                                background: theme.primary, 
                                color: '#fff', 
                                border: 'none', 
                                padding: '1rem 2rem', 
                                borderRadius: '50px', 
                                fontWeight: '700',
                                cursor: 'pointer',
                                boxShadow: `0 8px 20px ${theme.primary}40`,
                                transition: 'transform 0.2s',
                            }}
                            onClick={() => setCurrentView('generator')}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            Go to Generator
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Saved Tabs Sub-Navigation */}
                         <div style={styles.savedTabsContainer}>
                            <button 
                                style={{
                                    ...styles.savedTab, 
                                    ...(savedTab === 'list' ? styles.savedTabActive : {})
                                }}
                                onClick={() => setSavedTab('list')}
                            >
                                <ListIcon /> All Drafts
                            </button>
                            <button 
                                style={{
                                    ...styles.savedTab, 
                                    ...(savedTab === 'analytics' ? styles.savedTabActive : {})
                                }}
                                onClick={() => setSavedTab('analytics')}
                            >
                                <ChartIcon /> Analytics Insights
                            </button>
                        </div>

                        {savedTab === 'list' ? (
                            <>
                                <div style={styles.savedGrid}>
                                    {savedPosts.map((post) => {
                                        const postConfig = PlatformConfig[post.platform];
                                        const postColor = isDarkMode && postConfig.darkColor ? postConfig.darkColor : postConfig.color;
                                        const isSelected = selectedSavedIds.has(post.id);
                                        
                                        return (
                                            <div 
                                                key={post.id} 
                                                style={{
                                                    ...styles.savedCard,
                                                    borderColor: isSelected ? theme.primary : theme.border,
                                                    boxShadow: isSelected ? `0 0 0 2px ${theme.primary}` : theme.shadow,
                                                    transform: isSelected ? 'translateY(-2px)' : 'none'
                                                }}
                                            >
                                                <div style={styles.savedHeader}>
                                                    <div style={styles.savedMeta}>
                                                        <div 
                                                            style={{
                                                                ...styles.checkbox,
                                                                borderColor: isSelected ? theme.primary : theme.border,
                                                                background: isSelected ? theme.primary : 'transparent'
                                                            }}
                                                            onClick={() => toggleSavedSelection(post.id)}
                                                            title="Select to compare"
                                                        >
                                                            {isSelected && <CheckIcon />} 
                                                        </div>

                                                        <div style={{...styles.platformBadge, color: postColor}}>
                                                            <div style={{width: 8, height: 8, borderRadius: '50%', backgroundColor: postColor, boxShadow: `0 0 6px ${postColor}`}}></div>
                                                            {postConfig.name}
                                                        </div>
                                                        <span style={styles.tag}>{post.tone}</span>
                                                        <span style={{fontSize: '0.8rem', color: theme.textSecondary, marginLeft: '0.5rem'}}>
                                                            {new Date(post.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                        </span>
                                                    </div>
                                                    <div style={{display: 'flex', gap: '0.5rem'}}>
                                                        <button 
                                                            style={styles.iconBtn} 
                                                            onClick={() => handleCopy(post.text)}
                                                            title="Copy"
                                                            onMouseEnter={(e) => e.currentTarget.style.background = theme.highlight}
                                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                        >
                                                            <CopyIcon />
                                                        </button>
                                                        <button 
                                                            style={styles.iconBtn} 
                                                            onClick={() => handleShare(post.platform, post.text)}
                                                            title={`Share on ${postConfig.name}`}
                                                            onMouseEnter={(e) => e.currentTarget.style.background = theme.highlight}
                                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                        >
                                                            <ShareIcon />
                                                        </button>
                                                        <button 
                                                            style={{...styles.iconBtn, color: theme.error, borderColor: theme.border}} 
                                                            onClick={() => handleDeletePost(post.id)}
                                                            title="Delete"
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                                                e.currentTarget.style.borderColor = theme.error;
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.background = 'transparent';
                                                                e.currentTarget.style.borderColor = theme.border;
                                                            }}
                                                        >
                                                            <TrashIcon />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div style={{...styles.postText, fontSize: '1.05rem'}}>{post.text}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {selectedSavedIds.size >= 2 && (
                                    <button 
                                        style={styles.floatingAction} 
                                        onClick={startComparison}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-50%) translateY(-4px)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(-50%) translateY(0)'}
                                    >
                                        <CompareIcon /> Compare ({selectedSavedIds.size}) Drafts
                                    </button>
                                )}
                            </>
                        ) : (
                            /* Analytics View */
                            <div style={{paddingBottom: '4rem'}}>
                                <div style={styles.analyticsGrid}>
                                    {savedPosts.map((post) => {
                                        const config = PlatformConfig[post.platform];
                                        const badgeColor = isDarkMode && config.darkColor ? config.darkColor : config.color;
                                        // Use generated analytics or fallback if older post
                                        const analytics = post.analytics || generateMockAnalytics(post.platform, post.tone);
                                        
                                        return (
                                            <div key={post.id} style={styles.analyticsCard}>
                                                <div style={styles.analyticsHeader}>
                                                     <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                                         <div style={{...styles.platformBadge, color: badgeColor, fontSize: '0.9rem'}}>
                                                            <div style={{width: 8, height: 8, borderRadius: '50%', backgroundColor: badgeColor}}></div>
                                                            {config.name}
                                                        </div>
                                                        <div style={{fontSize: '0.75rem', color: theme.textSecondary, opacity: 0.8}}>
                                                            {new Date(post.timestamp).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                                                        </div>
                                                    </div>
                                                    <span style={styles.tag}>{post.tone}</span>
                                                </div>
                                                <div style={styles.analyticsSnippet} title={post.text}>
                                                    "{post.text}"
                                                </div>
                                                
                                                {/* Metrics */}
                                                <div style={styles.analyticsRow}>
                                                    <span>Est. Reach</span>
                                                    <span style={{fontWeight: 700, color: theme.text}}>{analytics.estimatedReach}</span>
                                                </div>
                                                
                                                <div style={styles.analyticsRow}>
                                                    <span>Engagement</span>
                                                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                                        <div style={styles.progressBarBg}>
                                                            <div style={{...styles.progressBarFill, width: `${Math.min(100, analytics.engagementRate * 10)}%`}}></div>
                                                        </div>
                                                        <span style={{fontWeight: 700, color: theme.text, minWidth: '40px', textAlign: 'right'}}>{analytics.engagementRate}%</span>
                                                    </div>
                                                </div>

                                                <div style={styles.analyticsRow}>
                                                    <span>Virality Score</span>
                                                     <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                                        <div style={styles.progressBarBg}>
                                                            <div style={{...styles.progressBarFill, width: `${analytics.viralityScore}%`, background: analytics.viralityScore > 75 ? '#10B981' : theme.primary}}></div>
                                                        </div>
                                                        <span style={{fontWeight: 700, color: theme.text, minWidth: '40px', textAlign: 'right'}}>{analytics.viralityScore}/100</span>
                                                    </div>
                                                </div>

                                                 <div style={{...styles.analyticsRow, marginTop: '0.5rem', borderTop: `1px solid ${theme.border}`, paddingTop: '0.75rem'}}>
                                                    <span>Best Time to Post</span>
                                                    <span style={{fontWeight: 600, color: theme.primary}}>{analytics.bestTime}</span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div style={styles.disclaimer}>
                                    * Metrics are AI-estimated based on platform averages and content tone. Actual performance may vary.
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        )}

        {/* Comparison View */}
        {currentView === 'compare' && (
            <div style={styles.comparisonGrid}>
                {savedPosts.filter(p => selectedSavedIds.has(p.id)).map(post => {
                    const postConfig = PlatformConfig[post.platform];
                    const postColor = isDarkMode && postConfig.darkColor ? postConfig.darkColor : postConfig.color;
                    
                    return (
                        <article key={post.id} style={styles.card}>
                             <div style={styles.cardHeader}>
                                <div style={{...styles.platformBadge, color: postColor}}>
                                    <div style={{width: 10, height: 10, borderRadius: '50%', backgroundColor: postColor, boxShadow: `0 0 8px ${postColor}`}}></div>
                                    {postConfig.name}
                                </div>
                                <div style={{display: 'flex', gap: '0.6rem'}}>
                                    <button 
                                        style={styles.iconBtn} 
                                        onClick={() => handleCopy(post.text)}
                                        title="Copy"
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        <CopyIcon />
                                    </button>
                                    <button 
                                        style={styles.iconBtn} 
                                        onClick={() => handleShare(post.platform, post.text)}
                                        title={`Share on ${postConfig.name}`}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        <ShareIcon />
                                    </button>
                                </div>
                            </div>
                             <div style={styles.cardBody}>
                                <div style={styles.postText}>{post.text}</div>
                             </div>
                             {/* Improved Comparison Footer */}
                             <div style={styles.compareFooter}>
                                <span style={styles.toneTag}>{post.tone}</span>
                                <div style={styles.compareMetaItem}>{post.text.length} chars</div>
                             </div>
                        </article>
                    )
                })}
            </div>
        )}

      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("app")!);
root.render(<App />);