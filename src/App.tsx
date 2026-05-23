import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  HelpCircle, 
  Shuffle, 
  RotateCcw, 
  Tv, 
  Heart, 
  Briefcase, 
  Coins, 
  Activity, 
  Users, 
  Compass, 
  ArrowRight, 
  Layers, 
  BookOpen, 
  Check, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Info,
  Smartphone,
  Download
} from "lucide-react";
import { TAROT_DECK, TarotCard, getRiderWaiteImageUrl } from "./tarotData";
import { 
  ThemeId, 
  CategoryId, 
  SpreadId, 
  SPREADS, 
  CATEGORIES, 
  DrawnCard, 
  TarotReadingResponse 
} from "./types";

// Dynamic Theme Styles config
const themeStyles = {
  mystic: {
    bg: "bg-[radial-gradient(circle_at_center,_#2a1f16_0%,_#0c0907_100%)] text-[#e2d1b0] font-serif",
    cardBg: "bg-[#16120e]/95 border border-[#d4af37]/20 text-[#e2d1b0] backdrop-blur-xl shadow-2xl",
    cardBack: "bg-[#1c150f]/90 border border-[#d4af37]/50 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-sm",
    cardFront: "bg-[#1c150f]/95 border-2 border-[#d4af37] shadow-[0_0_40px_rgba(212,175,55,0.1)]",
    textHeading: "font-mystique tracking-[0.2em] text-[#d4af37] border-b border-[#d4af37]/35 pb-2",
    textSub: "text-[#d4af37]/60 font-serif text-xs uppercase tracking-widest",
    textMuted: "text-[#e2d1b0]/85 font-serif",
    accentGlow: "shadow-[inset_0_0_20px_rgba(212,175,55,0.03),0_0_30px_rgba(212,175,55,0.15)]",
    button: "bg-[#d4af37] text-[#0c0907] font-serif font-bold uppercase tracking-wider hover:bg-[#c19b2e] active:scale-95 shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-all",
    secondaryBtn: "bg-[#1c150f] hover:bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 transition-all",
    badge: "bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30",
    accentBorder: "border-[#d4af37]/20",
    goldLine: "bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent h-px m-6",
    font: "font-serif",
    label: "Mistinė Biblioteka (Frosted Glass)"
  },
  cosmic: {
    bg: "bg-gradient-to-b from-indigo-950 via-slate-900 to-violet-950 text-indigo-100 font-sans",
    cardBg: "bg-indigo-950/45 border border-indigo-500/30 text-indigo-100 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)]",
    cardBack: "bg-gradient-to-br from-indigo-950 via-violet-950 to-slate-900 border border-indigo-500/60 shadow-[0_0_20px_rgba(99,102,241,0.35)]",
    cardFront: "bg-indigo-950/90 border border-fuchsia-500/50 shadow-[0_0_15px_rgba(236,72,153,0.15)]",
    textHeading: "font-cosmic font-extrabold tracking-tight bg-gradient-to-r from-violet-200 via-fuchsia-400 to-cyan-200 bg-clip-text text-transparent",
    textSub: "text-indigo-200/50 font-mono text-xs uppercase tracking-wider",
    textMuted: "text-indigo-200/70 font-sans",
    accentGlow: "shadow-[0_0_40px_rgba(139,92,246,0.15)]",
    button: "bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-sans font-semibold hover:from-violet-500 hover:to-indigo-500 active:scale-95 shadow-[0_4px_15px_rgba(99,102,241,0.3)] transition-all",
    secondaryBtn: "bg-indigo-950/60 hover:bg-indigo-900/80 text-violet-300 border border-indigo-500/20 transition-all",
    badge: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono",
    accentBorder: "border-indigo-500/30",
    goldLine: "bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent h-px m-6",
    font: "font-sans",
    label: "Kosminė Erdvė"
  },
  minimal: {
    bg: "bg-zinc-50 text-stone-800 font-sans",
    cardBg: "bg-white border border-stone-200 text-stone-800 shadow-[0_2px_15px_rgba(0,0,0,0.05)]",
    cardBack: "bg-stone-100 border border-stone-300 shadow-sm",
    cardFront: "bg-white border border-stone-800/80 shadow-md",
    textHeading: "font-sans font-bold tracking-tight text-stone-900",
    textSub: "text-stone-400 font-sans text-xs uppercase tracking-widest",
    textMuted: "text-stone-600 font-sans",
    accentGlow: "shadow-none",
    button: "bg-stone-900 text-white font-sans font-medium hover:bg-stone-800 active:scale-95 shadow-sm transition-all",
    secondaryBtn: "bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 shadow-xs transition-all",
    badge: "bg-stone-100 text-stone-700 border border-stone-200 text-xs font-semibold",
    accentBorder: "border-stone-200",
    goldLine: "bg-stone-200 h-px m-6",
    font: "font-sans",
    label: "Šiuolaikinis Minimalizmas"
  }
};

// Lithuanian Oracle loaders
const oracleLoadingAlerts = [
  "Maišomos paslaptingos likimo gijos...",
  "Dėliojamas jūsų asmeninis kortų žvaigždėlapis...",
  "Dvasiniai taro archetipai šnabžda atsakymus...",
  "Skaitomi senieji simboliai, pritaikomi jūsų klausimui...",
  "Sujungiami praeities impulsai ir ateities pranašystės...",
  "Siekiamas gilesnis supratimas..."
];

export default function App() {
  const [theme, setTheme] = useState<ThemeId>("mystic");
  const [step, setStep] = useState<number>(1); // 1: Klausimas, 2: Kortų Būrimas, 3: Rezultatas
  
  // Custom states
  const [question, setQuestion] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("meile");
  const [selectedSpreadId, setSelectedSpreadId] = useState<SpreadId>("trys_kortos");
  
  // Tarot deck operations
  const [shuffledDeck, setShuffledDeck] = useState<TarotCard[]>([]);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [deckGeneratedAngles, setDeckGeneratedAngles] = useState<number[]>([]);
  const [activeDrawDeckIndices, setActiveDrawDeckIndices] = useState<number[]>([]); // indexes of 24 cards on table
  const [isDeckShuffled, setIsDeckShuffled] = useState<boolean>(false);
  const [shufflingAnimation, setShufflingAnimation] = useState<boolean>(false);
  
  // Loading & Results
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>("");
  const [reading, setReading] = useState<TarotReadingResponse | null>(null);
  
  // UI Interactive Details
  const [selectedDetailCard, setSelectedDetailCard] = useState<DrawnCard | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Premium Paid Session states
  const [sessionsCompleted, setSessionsCompleted] = useState<number>(() => {
    const val = localStorage.getItem("taro_sessions_completed");
    return val ? Number(val) : 0;
  });
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState<boolean>(() => {
    return localStorage.getItem("taro_premium_unlocked") === "true";
  });
  const [showPaywall, setShowPaywall] = useState<boolean>(false);
  const [paywallSuccess, setPaywallSuccess] = useState<boolean>(false);
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "4000 1234 5678 9010",
    expiry: "12/28",
    cvv: "333",
    name: ""
  });
  const [showInstallGuide, setShowInstallGuide] = useState<boolean>(false);
  const [selectedOS, setSelectedOS] = useState<'ios' | 'android'>('ios');

  const style = themeStyles[theme];

  // Auto cycling loader text
  useEffect(() => {
    let interval: any;
    if (loading) {
      setLoadingText(oracleLoadingAlerts[0]);
      let index = 1;
      interval = setInterval(() => {
        setLoadingText(oracleLoadingAlerts[index % oracleLoadingAlerts.length]);
        index++;
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Set initial default question placeholder or presets
  const handleCategorySelect = (catId: CategoryId) => {
    setSelectedCategory(catId);
    // Fill first preset defaultly
    const category = CATEGORIES.find(c => c.id === catId);
    if (category && category.presets.length > 0) {
      setQuestion(category.presets[0]);
    }
  };

  const handlePresetSelect = (preset: string) => {
    setQuestion(preset);
  };

  // Fisher-Yates Shuffle
  const shuffleDeck = () => {
    setShufflingAnimation(true);
    setTimeout(() => {
      const deckCopy = [...TAROT_DECK];
      for (let i = deckCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deckCopy[i], deckCopy[j]] = [deckCopy[j], deckCopy[i]];
      }
      setShuffledDeck(deckCopy);
      
      // Generate randomized tilt angles for the 24 cards laid down on table to choose from
      const angles = Array.from({ length: 24 }, () => Math.floor(Math.random() * 24) - 12);
      setDeckGeneratedAngles(angles);
      
      // Setup indices of 24 cards that can be clicked on
      const indices = Array.from({ length: 24 }, (_, i) => i);
      setActiveDrawDeckIndices(indices);
      
      setDrawnCards([]);
      setIsDeckShuffled(true);
      setShufflingAnimation(false);
    }, 1200);
  };

  // Draw card logic
  const handleDrawCardFromChoiceDeck = (choiceIndex: number) => {
    const activeSpread = SPREADS[selectedSpreadId];
    const maxRequired = activeSpread.positions.length;
    
    // Check if we have already drawn enough cards
    if (drawnCards.length >= maxRequired) return;

    // Pull next unique card from shuffled deck
    const tarotCard = shuffledDeck[drawnCards.length + choiceIndex]; 
    if (!tarotCard) return;

    // Remove card from choice desk
    setActiveDrawDeckIndices(prev => prev.filter(idx => idx !== choiceIndex));

    // Determind upright vs reversed position (25% chance of being reversed / apversta)
    const isReversed = Math.random() < 0.25;

    // Match with current position
    const positionIndex = drawnCards.length;
    const position = activeSpread.positions[positionIndex];

    const newDrawn: DrawnCard = {
      card: tarotCard,
      isReversed,
      positionId: position.id,
      positionName: position.name,
      positionDesc: position.description
    };

    const updated = [...drawnCards, newDrawn];
    setDrawnCards(updated);

    // Auto-select drawn card detail for better UI focus
    setSelectedDetailCard(newDrawn);
  };

  // Simulated Payment Submission Handler
  const handleSimulatedPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentLoading(true);
    setTimeout(() => {
      setPaymentLoading(false);
      setPaywallSuccess(true);
      setTimeout(() => {
        setIsPremiumUnlocked(true);
        localStorage.setItem("taro_premium_unlocked", "true");
        setPaywallSuccess(false);
        setShowPaywall(false);
        // Automatically proceed with the reading now that it's unlocked!
        setTimeout(() => {
          handleRevealDestiny();
        }, 100);
      }, 1800);
    }, 2200);
  };

  // Submit to API
  const handleRevealDestiny = async () => {
    const activeSpread = SPREADS[selectedSpreadId];
    if (drawnCards.length < activeSpread.positions.length) {
      alert(`Prašome išsirinkti visas ${activeSpread.positions.length} kortas!`);
      return;
    }

    // Check if free session is used up and premium not yet unlocked
    if (sessionsCompleted >= 1 && !isPremiumUnlocked) {
      setShowPaywall(true);
      return;
    }

    setLoading(true);
    setErrorText(null);
    setStep(3); // Go to results pane (starts with loading state)

    try {
      const response = await fetch("/api/tarot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim() || "Bendra ateities kryptis",
          category: selectedCategory,
          combination: selectedSpreadId,
          cards: drawnCards.map(c => ({
            id: c.card.id,
            name: c.card.name,
            originalName: c.card.originalName,
            isReversed: c.isReversed,
            positionName: c.positionName
          })),
          theme
        })
      });

      if (!response.ok) {
        let errorMsg = "Nepavyko susisiekti su serveriu.";
        try {
          const errData = await response.json();
          if (errData && errData.error) {
            errorMsg = errData.error;
            if (errData.details) {
              errorMsg += `\n\n(Konkreti sisteminė klaida: ${errData.details})`;
            }
          }
        } catch (_) {}
        throw new Error(errorMsg);
      }

      const data: TarotReadingResponse = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setReading(data);

      // Increment completed sessions count
      const updatedSessions = sessionsCompleted + 1;
      setSessionsCompleted(updatedSessions);
      localStorage.setItem("taro_sessions_completed", String(updatedSessions));

      // Auto highlight first interpretation
      if (data.cardsInterpretation && data.cardsInterpretation.length > 0) {
        const found = drawnCards.find(c => c.card.id === data.cardsInterpretation[0].cardId);
        if (found) {
          setSelectedDetailCard(found);
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || "Apmaudu, bet nepavyko gauti Taro būrimo interpretacijos. Bandykite dar kartą.");
    } finally {
      setLoading(false);
    }
  };

  // Reset helper
  const handleReset = () => {
    setQuestion("");
    setDrawnCards([]);
    setReading(null);
    setIsDeckShuffled(false);
    setStep(1);
  };

  // Reset sessions tracker for testing/previewing easily
  const handleDeveloperResetSessions = () => {
    localStorage.removeItem("taro_sessions_completed");
    localStorage.removeItem("taro_premium_unlocked");
    setSessionsCompleted(0);
    setIsPremiumUnlocked(false);
    setShowPaywall(false);
    alert("Testavimo rėžis: Nemokamas seansas atstatytas sėkmingai!");
  };

  return (
    <div className={`min-h-screen pb-16 transition-colors duration-700 ${style.bg} overflow-x-hidden relative`}>
      {/* Dynamic Background Accents based on active theme */}
      {theme === "mystic" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#d4af37 0.5px, transparent 0.5px)", backgroundSize: "40px 40px" }} />
          <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-[#d4af37]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-[150px]" />
        </div>
      )}
      {theme === "cosmic" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[15%] right-[5%] w-96 h-96 bg-fuchsia-500/10 rounded-full blur-[110px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-[10%] left-[8%] w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[130px] animate-pulse" style={{ animationDuration: '12s' }} />
          <div className="absolute top-[5%] left-[50%] w-px h-px bg-white rounded-full shadow-[0_0_10px_white] animate-star-float" />
          <div className="absolute top-[40%] left-[20%] w-1 h-1 bg-violet-400 rounded-full opacity-60 animate-star-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[60%] right-[15%] w-px h-px bg-cyan-300 rounded-full shadow-[0_0_8px_cyan] animate-star-float" style={{ animationDelay: '4s' }} />
        </div>
      )}
      {theme === "minimal" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: '16px 16px' }} />
        </div>
      )}

      {/* Floating Theme Chooser & Branding bar */}
      <nav className={`max-w-7xl mx-auto px-4 py-2.5 sm:py-4 flex flex-col sm:flex-row justify-between items-center border-b ${style.accentBorder} relative z-10 gap-3 sm:gap-4 mb-4 sm:mb-8`}>
        <div className="flex items-center gap-3">
          <div className={`p-1.5 sm:p-2 rounded-lg ${theme === 'mystic' ? 'bg-amber-500/10 text-amber-400' : theme === 'cosmic' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-stone-900 text-white'}`}>
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-lg sm:text-xl md:text-2xl font-bold tracking-wider ${style.textHeading}`}>Taro Kortos</h1>
              <button
                onClick={() => setShowInstallGuide(true)}
                className="inline-flex items-center gap-1.5 py-0.5 px-2 rounded-full text-[9px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/20 hover:bg-amber-500/25 transition-all text-center cursor-pointer pointer-events-auto"
                title="Kaip atsisiųsti / įsidiegti šią programėlę telefone"
              >
                <Smartphone className="w-2.5 h-2.5 animate-bounce" />
                <span>Atsisiųsti programėlę</span>
              </button>
            </div>
            <p className="text-[9px] sm:text-[10px] uppercase tracking-wider opacity-60 mt-0.5 font-sans">Senoji Išmintis ir Dirbtinis Intelektas</p>
          </div>
        </div>

        {/* 3 Theme Choice options as requested */}
        <div className="flex flex-col items-center sm:items-end gap-1.5 sm:gap-2">
          {/* Status badge and sessions count */}
          <div className="flex flex-col items-center sm:items-end">
            <div className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-semibold flex items-center gap-1 sm:gap-1.5 shadow-sm border ${
              sessionsCompleted === 0 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : isPremiumUnlocked
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  : "bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/40"
            }`}>
              <span className="relative flex h-1 w-1 sm:h-1.5 sm:w-1.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${sessionsCompleted === 0 ? "bg-emerald-400" : "bg-amber-400"}`}></span>
                <span className={`relative inline-flex rounded-full h-1 w-1 sm:h-1.5 sm:w-1.5 ${sessionsCompleted === 0 ? "bg-emerald-500" : "bg-amber-500"}`}></span>
              </span>
              <span>
                {sessionsCompleted === 0 
                  ? "Pirmas seansas: NEMOKAMAS" 
                  : `Premium: tik 3.99€ ${isPremiumUnlocked ? '(Aktyvuota ☑)' : '(Reikalingas atrakinimas)'}`
                }
              </span>
            </div>
            
            {sessionsCompleted > 0 && (
              <button 
                onClick={handleDeveloperResetSessions}
                className="text-[8px] sm:text-[9px] text-[#e2d1b0]/40 hover:text-[#d4af37] transition-colors mt-0.5 sm:mt-1 underline decoration-dotted"
                title="Atstato visus limitus testavimui"
              >
                Atstatyti nemokamus seansus (Kūrėjo įrankis)
              </button>
            )}
          </div>

          <div className="flex flex-col items-center sm:items-end">
            <div className="text-[9px] sm:text-[10px] uppercase font-sans tracking-widest opacity-60 mb-1 sm:mb-1.5">Pasirinkite BūrimO Aplinką:</div>
            <div className={`flex items-center p-1 rounded-xl bg-black/10 backdrop-blur-xs border ${style.accentBorder} gap-1`}>
              {(["mystic", "cosmic", "minimal"] as ThemeId[]).map((t) => (
                <button
                  key={t}
                  id={`theme-btn-${t}`}
                  onClick={() => setTheme(t)}
                  className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium cursor-pointer transition-all duration-300 ${
                    theme === t 
                      ? theme === "mystic"
                        ? "bg-amber-500 text-stone-950 font-bold font-serif shadow-xs"
                        : theme === "cosmic"
                          ? "bg-indigo-600 text-white font-semibold font-sans shadow-md shadow-indigo-600/30"
                          : "bg-stone-900 text-white font-sans font-semibold"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  {t === "mystic" ? "🔮 Biblioteka" : t === "cosmic" ? "🌌 Kosmosas" : "⚪ Minimalus"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 relative z-10">

        {/* ================= STEP 1: CONFIGURING THE QUESTION AND SPREAD ================= */}
        {step === 1 && (
          <div className="max-w-4xl mx-auto">
            {/* Elegant intro header */}
            <div className="text-center mb-10">
              <span className={`inline-block py-1 px-3 rounded-full text-xs font-semibold mb-3 ${style.badge}`}>
                Asmeninis Taro Orakulas Lietuvių Kalba
              </span>
              <h2 className={`text-3xl md:text-5.55xl font-extrabold tracking-tight mb-4 ${style.textHeading}`}>
                {theme === "mystic" 
                  ? "Atverkite Likimo Knygą" 
                  : theme === "cosmic" 
                    ? "Kai Žvaigždės Susijungia" 
                    : "Gili Savianalizė ir Ramus Aiškumas"}
              </h2>
              <p className={`text-sm md:text-base max-w-2xl mx-auto ${style.textMuted} leading-relaxed`}>
                Suformuluokite klausimą, pasirinkite būrimo kombinaciją bei leiskite likimui per maišomas kortas parodyti atsakymą. Gemini giluminis modelis interpretuos iškritusias kortas pagal jūsų pasirinktą sritį.
              </p>
            </div>

            {/* Layout Box with custom styling */}
            <div className={`p-6 md:p-8 rounded-2xl ${style.cardBg} ${style.accentGlow} border ${style.accentBorder} space-y-8`}>
              
              {/* Category selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-3 opacity-80">
                  1. Pasirinkite Gyvenimo Sritį:
                </label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 md:gap-3">
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        id={`cat-btn-${cat.id}`}
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`p-2 sm:p-3 md:py-4 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                          isSelected 
                            ? theme === "mystic"
                              ? "bg-amber-500/15 border-amber-400 text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.15)] bg-radial from-amber-500/10 to-transparent"
                              : theme === "cosmic"
                                ? "bg-indigo-500/20 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.25)]"
                                : "bg-stone-900 text-white border-stone-800 font-semibold"
                            : "bg-black/5 hover:bg-black/10 border-transparent hover:border-stone-500/30 text-stone-400 hover:text-stone-200"
                        }`}
                      >
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="text-xs font-semibold tracking-wide">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Automatic Preset Lithuania Questions Choice as requested */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-80 flex items-center justify-between">
                  <span>Greitas Klausimas (Rekomenduojami pasiūlymai):</span>
                  <span className="text-[10px] font-normal opacity-50 lowercase tracking-normal">spustelkite korta užpildyti klausimui</span>
                </label>
                <div className="flex flex-wrap gap-2 py-1 max-h-48 overflow-y-auto pr-2">
                  {CATEGORIES.find(c => c.id === selectedCategory)?.presets.map((preset, index) => (
                    <button
                      key={index}
                      id={`preset-q-${index}`}
                      onClick={() => handlePresetSelect(preset)}
                      className={`text-left text-xs px-3 py-2 rounded-lg border transition-all text-stone-300 hover:text-white cursor-pointer ${
                        question === preset
                          ? theme === "mystic"
                            ? "bg-amber-950/40 border-amber-500/50 text-amber-200"
                            : theme === "cosmic"
                              ? "bg-indigo-950/60 border-indigo-500/60 text-indigo-200"
                              : "bg-stone-100 border-stone-800 text-stone-900 font-medium"
                          : "bg-black/10 hover:bg-black/20 border-stone-800/40"
                      }`}
                    >
                      💡 {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Write custom question */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-80">
                  2. Įrašykite asmeninį klausimą arba suformuluokite situaciją:
                </label>
                <div className="relative">
                  <textarea
                    id="question-input"
                    rows={3}
                    maxLength={200}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Pvz.: Ar mano planuojamas verslas pavyks ateinančiais metais? Ko turėčiau saugotis?"
                    className={`w-full p-4 rounded-xl text-sm leading-relaxed focus:outline-hidden transition-all bg-black/20 border ${style.accentBorder} focus:border-amber-500/80 text-white`}
                  />
                  <div className="absolute right-3 bottom-3 text-[10px] font-mono text-stone-400">
                    {question.length}/200 simbolių
                  </div>
                </div>
              </div>

              {/* Combinations (Spreads) 3 Versions */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-3 opacity-80">
                  3. Pasirinkite Taro dėlionės kombinaciją (3 versijos):
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(Object.keys(SPREADS) as SpreadId[]).map((spreadId) => {
                    const info = SPREADS[spreadId];
                    const isSelected = selectedSpreadId === spreadId;
                    return (
                      <button
                        key={spreadId}
                        id={`spread-btn-${spreadId}`}
                        onClick={() => setSelectedSpreadId(spreadId)}
                        className={`p-3.5 sm:p-5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? theme === "mystic"
                              ? "bg-amber-500/10 border-amber-400 text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                              : theme === "cosmic"
                                ? "bg-indigo-500/20 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.25)]"
                                : "bg-stone-900 border-stone-800 text-white"
                            : "bg-black/10 hover:bg-black/20 border-transparent hover:border-stone-500/20 text-stone-300"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                            <span className="font-bold text-xs sm:text-sm tracking-wide">{info.name}</span>
                            <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-black/30 font-mono">
                              {info.positions.length} {info.positions.length === 1 ? 'korta' : info.positions.length === 3 ? 'kortos' : 'kortų'}
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-xs opacity-75 leading-relaxed mb-2.5 sm:mb-4">{info.description}</p>
                        </div>
                        
                        <div className="flex items-center gap-1 mt-2 text-[10px] uppercase font-mono tracking-widest text-amber-400/90 font-semibold">
                          <span>Sudėtis:</span>
                          <span className="opacity-70">{info.positions.map(p => p.name).join(" ➔ ")}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={style.goldLine} />

              {/* Action trigger button */}
              <div className="flex justify-center pt-2">
                <button
                  id="btn-confirm-setup"
                  onClick={() => {
                    shuffleDeck(); // Auto pre-shuffle deck 
                    setStep(2); // Go to draw phase
                  }}
                  className={`w-full sm:w-auto px-8 py-4 px-10 rounded-xl flex items-center justify-center gap-3 cursor-pointer text-base uppercase tracking-wider ${style.button}`}
                >
                  <Sparkles className="w-5 h-5" />
                  Pradėti kortų būrimą
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ================= STEP 2: SHUFFLING & MANUAL CARD DRAWING ================= */}
        {step === 2 && (
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Quick configuration bar to see what we entered */}
            <div className={`p-4 rounded-xl ${style.cardBg} border ${style.accentBorder} flex flex-wrap justify-between items-center gap-4 text-xs`}>
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-500/80" />
                <span><strong>Sritis:</strong> {CATEGORIES.find(c => c.id === selectedCategory)?.label}</span>
                <span className="opacity-40">|</span>
                <span><strong>Kombinacija:</strong> {SPREADS[selectedSpreadId].name}</span>
              </div>
              <div className="max-w-md truncate italic text-stone-300">
                &ldquo;{question || "Bendra likimo žinia..."}&rdquo;
              </div>
              <button 
                onClick={() => setStep(1)} 
                className="hover:underline text-amber-400 font-semibold cursor-pointer"
              >
                Pakeisti klausimą
              </button>
            </div>

            {/* Instruction header */}
            <div className="text-center">
              <h2 className={`text-2xl md:text-3xl font-extrabold mb-2 ${style.textHeading}`}>
                {!isDeckShuffled ? "Sumaišykite Likimo Kortas" : `Išsirinkite ${SPREADS[selectedSpreadId].positions.length} kortas`}
              </h2>
              <p className={`text-xs md:text-sm ${style.textMuted} max-w-xl mx-auto`}>
                {!isDeckShuffled 
                  ? "Prieš pradedant burti, kortos turi sugerti jūsų energiją. Spustelkite maišymo mygtuką." 
                  : "Pasirinkite kortas iš mįslingo sumaišyto kaladės stalo. Jūsų rankos prisilietimas nulems, kuri korta atsidurs likimo pozicijose."}
              </p>
            </div>

            {/* Deck control panel */}
            <div className="flex justify-center gap-4">
              <button
                id="btn-shuffle-op"
                onClick={shuffleDeck}
                className={`px-6 py-3 rounded-lg flex items-center gap-2 cursor-pointer text-xs uppercase tracking-wider ${style.secondaryBtn}`}
              >
                <Shuffle className={`w-4 h-4 ${shufflingAnimation ? 'animate-spin' : ''}`} />
                Perfrazuoti / Permaišyti Likimą
              </button>
            </div>

            {/* Shuffling animation area or Choice Deck spread */}
            <div className={`p-6 md:p-8 rounded-2xl ${style.cardBg} border ${style.accentBorder} relative min-h-[300px] flex flex-col justify-center items-center`}>
              {shufflingAnimation ? (
                <div id="shuffling-loader-container" className="flex flex-col items-center gap-4 py-12">
                  <div className="relative w-24 h-36 border-2 border-dashed border-amber-500/40 rounded-xl flex items-center justify-center animate-pulse">
                    <Shuffle className="w-10 h-10 text-amber-500/60 animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                  <div className="text-sm font-semibold tracking-wider text-amber-400 animate-pulse">Maišomos kortos...</div>
                </div>
              ) : !isDeckShuffled ? (
                <div id="not-shuffled-splash" className="text-center py-12 space-y-4">
                  <div className="text-5xl">🃏</div>
                  <p className={`${style.textMuted} text-sm`}>Kortos paruoštos. Užmerkite akis, giliai įkvėpkite ir paspauskite mygtuką.</p>
                  <button
                    id="btn-start-shuffle-big"
                    onClick={shuffleDeck}
                    className={`px-8 py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider cursor-pointer ${style.button}`}
                  >
                    Sumaišyti likimo energetiką
                  </button>
                </div>
              ) : (
                <div id="draw-deck-area" className="w-full">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs uppercase tracking-wider opacity-60 font-mono">Likimo Stalas</span>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                      drawnCards.length === SPREADS[selectedSpreadId].positions.length 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                        : style.badge
                    }`}>
                      Ištraukta: {drawnCards.length} iš {SPREADS[selectedSpreadId].positions.length} kortų
                    </span>
                  </div>

                  {/* FANNED DECK DRAWING ZONE AS REQUESTED */}
                  {activeDrawDeckIndices.length > 0 ? (
                    <div 
                      id="fanned-shuffled-table"
                      className="relative flex flex-row flex-nowrap overflow-x-auto md:flex-wrap justify-start md:justify-center items-center gap-1.5 md:gap-2.5 max-w-4xl mx-auto py-4 md:py-8 rounded-xl bg-black/15 border border-stone-800/40 px-3 md:px-4 overflow-y-hidden"
                    >
                      {activeDrawDeckIndices.map((choiceIdx, i) => {
                        const angle = deckGeneratedAngles[choiceIdx % deckGeneratedAngles.length] || 0;
                        return (
                          <button
                            key={choiceIdx}
                            id={`choice-card-${choiceIdx}`}
                            onClick={() => handleDrawCardFromChoiceDeck(choiceIdx)}
                            disabled={drawnCards.length >= SPREADS[selectedSpreadId].positions.length}
                            className={`w-[52px] sm:w-16 h-20 sm:h-26 rounded-lg ${style.cardBack} relative cursor-pointer hover:-translate-y-4 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md flex items-center justify-center font-bold flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed`}
                            style={{ 
                              transform: `rotate(${angle}deg)`,
                              transformOrigin: 'bottom center'
                            }}
                          >
                            <div className="absolute inset-1 rounded-sm border border-amber-500/10 flex items-center justify-center">
                              <span className="text-[10px] opacity-40 font-mono">🔮</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-xs text-stone-500">
                      Visos kortos ištrauktos iš sumaišytos kaladės.
                    </div>
                  )}

                  <div className="text-center mt-3 text-[10px] italic opacity-60">
                    Spustelkite bet kurią nugarėlę viršuje – ištraukti kortą likimo dėlionės pozicijai.
                  </div>
                </div>
              )}
            </div>

            {/* ================= DRAWN CARDS PLACEHOLDERS ================= */}
            {isDeckShuffled && (
              <div className={`p-6 rounded-2xl ${style.cardBg} border ${style.accentBorder} space-y-6`}>
                <h3 className="text-sm font-bold uppercase tracking-widest text-center border-b pb-3 border-stone-800">
                  Pasirinkto šabloninė dėlionė: {SPREADS[selectedSpreadId].name}
                </h3>

                {/* SPREAD CARD PLACEHOLDERS GRAPHICAL REPRESENTATION */}
                {selectedSpreadId === "viena_korta" && (
                  <div id="spread-render-one" className="flex justify-center py-6">
                    {renderPlaceholderSlot(0, SPREADS.viena_korta.positions[0])}
                  </div>
                )}

                {selectedSpreadId === "trys_kortos" && (
                  <div id="spread-render-three" className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-6 max-w-3xl mx-auto py-3 sm:py-6">
                    {SPREADS.trys_kortos.positions.map((pos, idx) => renderPlaceholderSlot(idx, pos))}
                  </div>
                )}

                {selectedSpreadId === "keltu_kryzius" && (
                  <div id="spread-render-celtic" className="space-y-4 max-w-4xl mx-auto py-2 sm:py-4">
                    {/* Visual warning for complex Celtic grid */}
                    <div className="text-xs text-center opacity-60 mb-1">
                      Keltų kryžius – tai pilnas 10 pozicijų dvasios atspindys.
                    </div>

                    {/* Desktop Split Cross + Staff Map / Mobile layout is handled gracefully */}
                    <div className="flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-14">
                      {/* Left side: The Cross Map block */}
                      <div className="relative w-full max-w-[340px] h-[320px] sm:h-[340px] flex items-center justify-center border border-stone-800/15 rounded-xl bg-black/10 p-2 sm:p-4 scale-95 sm:scale-100 transition-transform duration-300">
                        {/* Area 1: Center (Dabartinė situacija) */}
                        <div className="absolute z-10 w-14 h-20 sm:w-20 sm:h-28 flex items-center justify-center">
                          {renderPlaceholderSlot(0, SPREADS.keltu_kryzius.positions[0], true)}
                        </div>

                        {/* Area 2: Challenge (Immediate obstacle) */}
                        <div className="absolute z-20 w-14 h-20 sm:w-20 sm:h-28 transform rotate-90 scale-95 opacity-90 flex items-center justify-center">
                          {renderPlaceholderSlot(1, SPREADS.keltu_kryzius.positions[1], true)}
                        </div>

                        {/* Area 3: Conscious (Sąmonė - Above) */}
                        <div className="absolute top-2 z-10 w-14 h-20 sm:w-20 sm:h-28 flex items-center justify-center">
                          {renderPlaceholderSlot(2, SPREADS.keltu_kryzius.positions[2], true)}
                        </div>

                        {/* Area 4: Unconscious (Pasąmonė - Below) */}
                        <div className="absolute bottom-2 z-10 w-14 h-20 sm:w-20 sm:h-28 flex items-center justify-center">
                          {renderPlaceholderSlot(3, SPREADS.keltu_kryzius.positions[3], true)}
                        </div>

                        {/* Area 5: Past (Praeitis - Left) */}
                        <div className="absolute left-2 z-10 w-14 h-20 sm:w-20 sm:h-28 flex items-center justify-center">
                          {renderPlaceholderSlot(4, SPREADS.keltu_kryzius.positions[4], true)}
                        </div>

                        {/* Area 6: Future (Ateitis - Right) */}
                        <div className="absolute right-2 z-10 w-14 h-20 sm:w-20 sm:h-28 flex items-center justify-center">
                          {renderPlaceholderSlot(5, SPREADS.keltu_kryzius.positions[5], true)}
                        </div>
                      </div>

                      {/* Right side: The Staff / Column */}
                      <div className="w-full max-w-md lg:max-w-xs grid grid-cols-4 lg:grid-cols-1 gap-2 bg-black/10 p-3 rounded-xl border border-stone-800/20">
                        {renderPlaceholderSlot(9, SPREADS.keltu_kryzius.positions[9], true)}
                        {renderPlaceholderSlot(8, SPREADS.keltu_kryzius.positions[8], true)}
                        {renderPlaceholderSlot(7, SPREADS.keltu_kryzius.positions[7], true)}
                        {renderPlaceholderSlot(6, SPREADS.keltu_kryzius.positions[6], true)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Final Trigger Button once fully drawn */}
                {drawnCards.length === SPREADS[selectedSpreadId].positions.length && (
                  <div id="reveal-destiny-action" className="flex flex-col items-center gap-3 pt-4 border-t border-stone-800/40">
                    <div className="text-sm text-center text-emerald-400 font-semibold flex items-center gap-2">
                      <Check className="w-4 h-4" /> Visos kortos sėkmingai parinktos jūsų asmenine ranka!
                    </div>
                    <button
                      id="btn-trigger-ai"
                      onClick={handleRevealDestiny}
                      className={`px-10 py-4.5 rounded-xl text-base uppercase font-bold tracking-wider cursor-pointer shadow-lg w-full sm:w-auto ${style.button}`}
                    >
                      ✨ Atskleisti Likimo Žinią (DI Interpretacija) ✨
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* ================= STEP 3: REVEALING & INTUITIVE INTERPRETATION ================= */}
        {step === 3 && (
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* LOBBY / LOADING PANE */}
            {loading && (
              <div id="ai-loading-screen" className={`p-10 md:p-16 rounded-2xl ${style.cardBg} border ${style.accentBorder} text-center space-y-10 animate-pulse flex flex-col items-center justify-center min-h-[450px]`}>
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-t-amber-400 border-amber-950/20 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-amber-400 animate-bounce" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl md:text-2xl font-bold text-amber-300">Skaitomi Likimo Ženklai Lietuvoje...</h3>
                  <p className="text-xs text-stone-400 max-w-md mx-auto">
                    Siunčiame jūsų užklausą ir dvasinius kortų tinklelius giliajam Gemini dirbtiniam intelektui. Tai gali užtrukti kelias sekundes...
                  </p>
                </div>

                {/* Shifting messages */}
                <div className="px-6 py-3 rounded-lg bg-black/40 border border-stone-800 border-dashed text-xs italic tracking-wider text-amber-200/80 max-w-sm">
                  📢 &ldquo;{loadingText}&rdquo;
                </div>
              </div>
            )}

            {/* ERROR PRESENTATION */}
            {errorText && (
              <div id="ai-error-screen" className={`p-6 sm:p-8 rounded-2xl ${style.cardBg} border ${errorText.includes("raktas nėra sukonfigūruotas") || errorText.includes("Paskyros likutis išnaudotas") || errorText.includes("Prepayment") ? "border-amber-500/30" : "border-red-500/30"} space-y-6 max-w-2xl mx-auto text-left`}>
                {errorText.includes("raktas nėra sukonfigūruotas") || errorText.includes("Paskyros likutis išnaudotas") || errorText.includes("Prepayment") ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-amber-500/20 pb-4">
                      <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                        <Info className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-amber-400">
                          {errorText.includes("Paskyros likutis išnaudotas") ? "Svarbi informacija dėl limitų / likučio 💳" : "Pajunkime Jūsų Gemini API Raktą 🔑"}
                        </h3>
                        <p className="text-xs text-stone-400 uppercase tracking-wider font-mono">Paprastas sprendimų gidas pradedantiesiems Lithuanian kalba</p>
                      </div>
                    </div>

                    {errorText.includes("Paskyros likutis išnaudotas") && (
                      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-xs leading-relaxed text-amber-200/95 space-y-3">
                        <p className="font-bold text-amber-300">🚨 Gauta klaida: Google Prepayment Likutis Išnaudotas (Depleted)</p>
                        <p>
                          Jūsų įvestas raktas priklauso Google Cloud projektui, kuriame įjungtas mokamas planas (Prepay billing), bet šio projekto balanse nėra įneštų piniginių lėšų kreditų.
                        </p>
                        <p className="font-semibold text-white">Kaip tai greitai patvarkyti nesumokant nei cento?</p>
                        <ul className="list-disc pl-5 space-y-1 text-stone-300">
                          <li>
                            <strong>Sukurkite nemokamą raktą naujame projekte:</strong> Nueikite į Google AI Studio ir pasirinkite sukurti raktą visiškai naujame projekte, kuriam nėra priskirta kortelė ar billing planas. Jis naudos visiškai nemokamus modelio išteklius.
                          </li>
                          <li>
                            <strong>Arba papildykite balansą:</strong> Jeigu norite naudoti būtent šį projektą be nemokamo plano greičio ribojimų, papildykite prepay balansą Google AI Studio nustatymuose.
                          </li>
                        </ul>
                      </div>
                    )}

                    <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 text-xs leading-relaxed text-stone-300 space-y-2">
                      <p className="font-bold text-red-400">❓ Ką daryti, jei rodo „Failed to create project“ Google puslapyje?</p>
                      <p>
                        Jei gaunate klaidą, kad nepavyko sukurti projekto (<strong>Failed to create project, please try again later</strong>), taip nutinka dėl Google Cloud projektų kūrimo kvotos ribojimo naujoms arba įmonės paskyroms.
                      </p>
                      <p className="font-semibold text-white">Sprendimo žingsniai:</p>
                      <div className="space-y-1.5 font-sans pl-2">
                        <p className="text-stone-300">🎯 <span className="font-semibold text-amber-300">Svarbiausias patarimas:</span> Nesukurkite naujo projekto! Sąraše pasirinkite jau esantį projektą (pvz. <strong className="text-white">My First Project</strong>) ir sukurkite raktą prie jo.</p>
                        <p className="text-stone-300">💼 Jei naudojate darbinę el. pašto dėžutę, korporatyvinis administratorius gali blokuoti projektų kūrimą. Pabandykite prisijungti su asmeniniu <strong className="text-white">@gmail.com</strong> adresu.</p>
                        <p className="text-stone-300">🧹 Norėdami išvalyti kvotą, galite ištrinti senus, nenaudojamus Cloud projektus čia: <a href="https://console.cloud.google.com/iam-admin/projects" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline hover:text-amber-300">GCP projektų priežiūra</a>.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-stone-200 uppercase tracking-wide text-amber-400 font-mono">Bendra instrukcija jūsų naujam raktui:</h4>
                      
                      <div className="space-y-3 font-sans text-xs text-stone-300">
                        <div className="flex gap-3 items-start">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold font-mono">1</div>
                          <div>
                            <p className="font-semibold text-stone-100">Pasirinkite esamą projektą (My First Project) arba kitą</p>
                            <p className="text-stone-400 mt-0.5">Vietoj „new project“ pasirinkite esantį projektą ir spustelkite gauti raktą. Taip apeisite kūrimo klaidas.</p>
                          </div>
                        </div>

                        <div className="flex gap-3 items-start">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold font-mono">2</div>
                          <div>
                            <p className="font-semibold text-stone-100">Nukopijuokite sukurtą raktą</p>
                            <p className="text-stone-400 mt-0.5">Pamatysite kodą (prasidedantį <strong className="text-[#d4af37] font-mono">AIzaSy...</strong>). Spustelkite nukopijavimo mygtuką.</p>
                          </div>
                        </div>

                        <div className="flex gap-3 items-start">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold font-mono">3</div>
                          <div>
                            <p className="font-semibold text-stone-100">Spustelkite Settings (Nustatymai) viršuje</p>
                            <p className="text-stone-400 mt-0.5">Mūsų svetainės pačiame viršuje dešinėje rasite baltą krumpliaračio ikoną <strong className="text-stone-200 font-semibold">Settings ⚙️</strong>.</p>
                          </div>
                        </div>

                        <div className="flex gap-3 items-start">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold font-mono">4</div>
                          <div>
                            <p className="font-semibold text-stone-100">Įrašykite raktą į GEMINI_API_KEY</p>
                            <p className="text-stone-400 mt-0.5">Įklijuokite nukopijuotą kodą į atitinkamą laukelį ir išsaugokite (paspauskite „Save“).</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-stone-900 rounded-xl p-3 border border-stone-800 text-xs text-stone-400 space-y-1">
                      <p className="font-semibold text-stone-300">Gauta techninė klaida:</p>
                      <p className="font-mono text-[10px] break-all text-stone-500">{errorText}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-stone-800">
                      <button 
                        onClick={handleRevealDestiny} 
                        className={`flex-1 px-5 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider text-center cursor-pointer ${style.button}`}
                      >
                        Išsaugojau naują raktą ➔ Tikrinti iš naujo
                      </button>
                      <button 
                        onClick={handleReset} 
                        className={`flex-1 px-5 py-3 rounded-lg text-xs font-semibold text-center cursor-pointer ${style.secondaryBtn}`}
                      >
                        Atšaukti / Į pradžią
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 text-center">
                    <div className="text-5xl">⚠️</div>
                    <h3 className="text-lg font-bold text-red-400">Įvyko nenumatyta klaidėlė</h3>
                    <p className="text-xs sm:text-sm text-stone-300 whitespace-pre-wrap max-w-lg mx-auto text-left sm:text-center leading-relaxed">{errorText}</p>
                    <div className="flex gap-4 justify-center">
                      <button 
                        onClick={handleRevealDestiny} 
                        className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-500 cursor-pointer"
                      >
                        Bandyti dar kartą
                      </button>
                      <button 
                        onClick={handleReset} 
                        className={`px-5 py-2.5 rounded-lg text-xs font-semibold cursor-pointer ${style.secondaryBtn}`}
                      >
                        Grįžti į sritį
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* FINAL LUXURY READING SCREEN */}
            {reading && !loading && !errorText && (
              <div id="ai-tarot-interpretation-report" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start duration-500 animate-fadeIn">
                
                {/* LEFT BLOCK: VISUAL SPREAD PERSPECTIVE MAP (4 cols) */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Card configuration overview */}
                  <div className={`p-5 rounded-2xl ${style.cardBg} border ${style.accentBorder} space-y-4`}>
                    <p className={style.textSub}>Lietuviškas būrimas</p>
                    <h3 className="text-sm md:text-base font-bold italic line-clamp-2">
                       &ldquo;{question || "Bendra ateitis"}&rdquo;
                    </h3>
                    <div className="flex flex-wrap gap-2 text-[10px] font-semibold">
                      <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 uppercase">
                        Sritis: {CATEGORIES.find(c => c.id === selectedCategory)?.label}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300">
                        Dėlionė: {SPREADS[selectedSpreadId].name.split("(")[0]}
                      </span>
                    </div>
                  </div>

                  {/* VISUAL CARDS MAP AT READ MODE */}
                  <div className={`p-6 rounded-2xl ${style.cardBg} border ${style.accentBorder} space-y-4`}>
                    <div className="flex justify-between items-center border-b border-stone-800 pb-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider">Iškritusios likimo kortos</h4>
                      <span className="text-[10px] opacity-60">spustelkite peržiūrėti DI reikšmei</span>
                    </div>

                    {/* Map layout or list of final drawn cards */}
                    <div className="flex flex-col gap-3">
                      {drawnCards.map((dc) => {
                        const isCurrentlyHighlighted = selectedDetailCard?.card.id === dc.card.id;
                        return (
                          <button
                            key={dc.card.id}
                            id={`reading-deck-item-${dc.card.id}`}
                            onClick={() => setSelectedDetailCard(dc)}
                            className={`w-full p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between gap-3 ${
                              isCurrentlyHighlighted
                                ? theme === "mystic"
                                  ? "bg-amber-500/10 border-amber-400 text-amber-200"
                                  : theme === "cosmic"
                                    ? "bg-indigo-500/20 border-indigo-400 text-white shadow-xs"
                                    : "bg-stone-900 border-stone-800 text-white"
                                : "bg-black/20 border-transparent hover:border-stone-800 hover:bg-black/35 text-stone-300"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {/* Small card aesthetic mini box */}
                              <div className={`w-9 h-12 rounded-sm overflow-hidden flex items-center justify-center relative bg-stone-900 border border-stone-800 ${
                                dc.isReversed ? 'rotate-180' : ''
                              }`}>
                                <img 
                                  src={getRiderWaiteImageUrl(dc.card)} 
                                  alt={dc.card.name} 
                                  className="w-full h-full object-cover" 
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div>
                                <p className="text-[10px] opacity-50 uppercase font-mono tracking-wider">{dc.positionName}</p>
                                <h5 className="text-xs font-bold">{dc.card.name}</h5>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {dc.isReversed && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-800/20 text-red-300 border border-red-500/30">
                                  Reversed
                                </span>
                              )}
                              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reset and starting over */}
                  <div className="flex justify-center">
                    <button
                      id="btn-restart-reading"
                      onClick={handleReset}
                      className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer border ${style.secondaryBtn}`}
                    >
                      <RotateCcw className="w-4 h-4" />
                      Atlikti Naują Būrimą
                    </button>
                  </div>

                </div>

                {/* RIGHT BLOCK: THE REAL DI READING RESPONSIVE (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* 1. Main summary block */}
                  <div className={`p-6 md:p-8 rounded-2xl ${style.cardBg} border ${style.accentBorder} ${style.accentGlow} space-y-4`}>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <h3 className="text-xs uppercase tracking-widest opacity-60 font-mono">Bendra Likimo Interpretacija</h3>
                    </div>
                    {theme === "mystic" && <h4 className="text-xl font-bold font-mystique text-amber-300">Orakulas Prabilo:</h4>}
                    <p className={`text-sm md:text-base leading-relaxed ${style.textMuted} whitespace-pre-line`}>
                      {reading.summary}
                    </p>
                  </div>

                  {/* 2. Highlighted Selected Card meaning detail box */}
                  {selectedDetailCard && (
                    <div className={`p-6 md:p-8 rounded-2xl ${style.cardBg} border ${style.accentBorder} space-y-6`}>
                      <div className="flex items-start justify-between gap-4 border-b border-stone-800/40 pb-4">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                             Pozicija: {selectedDetailCard.positionName}
                          </span>
                          <h4 className="text-lg md:text-xl font-bold mt-1">
                            {selectedDetailCard.card.name} <span className="text-xs font-normal text-stone-400">(${selectedDetailCard.card.originalName})</span>
                          </h4>
                          <div className="text-[10px] opacity-70 mt-1 flex flex-wrap gap-2">
                            <span>Elementas: <strong>{selectedDetailCard.card.element}</strong></span>
                            <span>•</span>
                            <span>Raktiniai žodžiai: {selectedDetailCard.card.keywords.join(", ")}</span>
                          </div>
                        </div>

                        {/* Interactive aesthetic card visualization face */}
                        <div className="flex-shrink-0 flex flex-col items-center">
                          <div className={`w-20 h-32 rounded-lg overflow-hidden relative flex flex-col items-center justify-between border border-amber-500/20 bg-stone-900 shadow-md ${
                            selectedDetailCard.isReversed ? 'rotate-180' : ''
                          }`}>
                            <img 
                              src={getRiderWaiteImageUrl(selectedDetailCard.card)} 
                              alt={selectedDetailCard.card.name} 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          {selectedDetailCard.isReversed && (
                            <span className="text-[8px] tracking-wide uppercase px-1 py-0.5 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/30 mt-2 font-mono">
                              Apversta
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Display the Gemini explanation of that card */}
                      <div className="space-y-3">
                        <h5 className="text-xs uppercase font-mono tracking-widest text-[#d97706]/85 font-semibold">
                          Giluminis kortos reikšmės išaiškinimas:
                        </h5>
                        <p className={`text-xs md:text-sm leading-relaxed ${style.textMuted} whitespace-pre-line bg-black/10 p-4 rounded-xl border border-stone-800/20`}>
                          {(() => {
                            // 1. Try exact card ID matching
                            let item = reading.cardsInterpretation.find(item => item.cardId === selectedDetailCard.card.id);
                            
                            // 2. Try case-insensitive matching
                            if (!item) {
                              const cleanId = selectedDetailCard.card.id.toLowerCase();
                              item = reading.cardsInterpretation.find(i => i.cardId.toLowerCase() === cleanId);
                            }
                            
                            // 3. Try fallback to alignment by order/index
                            if (!item) {
                              const cardIdx = drawnCards.findIndex(c => c.card.id === selectedDetailCard.card.id);
                              if (cardIdx !== -1 && reading.cardsInterpretation[cardIdx]) {
                                item = reading.cardsInterpretation[cardIdx];
                              }
                            }
                            
                            return item?.meaning || "Šios išskirtinės kortos interpretacija yra pateikta bendrame orakulo apraše viršuje.";
                          })()}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 3. Universal Guidance (Orakulo patarimas) */}
                  <div className={`p-6 rounded-2xl ${style.cardBg} border ${style.accentBorder} bg-radial from-amber-500/[0.02] to-transparent space-y-4`}>
                    <div className="flex items-center gap-2">
                      <Compass className="w-5 h-5 text-amber-500" />
                      <h4 className="text-xs uppercase tracking-widest font-mono text-amber-400 font-bold">Orakulo Nukreipimas / Patarimas</h4>
                    </div>
                    <p className={`text-xs md:text-sm leading-relaxed ${style.textMuted}`}>
                      {reading.guidance}
                    </p>
                  </div>

                  {/* 4. Outlook for future (Ateities perspektyva) */}
                  <div className={`p-6 rounded-2xl ${style.cardBg} border ${style.accentBorder} bg-black/15 space-y-4`}>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-indigo-400" />
                      <h4 className="text-xs uppercase tracking-widest font-mono text-indigo-300 font-bold">Tolimesnė kelionės kryptis</h4>
                    </div>
                    <p className={`text-xs md:text-sm leading-relaxed ${style.textMuted}`}>
                      {reading.outlook}
                    </p>
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* PREMIUM SEANSO ATRAKINIMO MODALAS (PAYWALL) */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg overflow-y-auto animate-fadeIn">
          <div className={`w-full max-w-4xl rounded-2xl overflow-hidden border ${style.accentBorder} ${style.cardBg} transition-all duration-500 shadow-2xl relative`}>
            
            {/* Background design stars or mystic details */}
            <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-20">
              <Sparkles className="w-24 h-24 text-amber-500 animate-spin-slow" />
            </div>

            {/* Paywall Header */}
            <div className="p-6 md:p-8 border-b border-white/5 bg-black/40 text-center relative">
              <span className="inline-block py-1 px-3 rounded-full text-[10px] font-mono uppercase tracking-widest bg-amber-500/15 text-amber-400 border border-amber-500/25 mb-4 animate-pulse">
                Pasiekėte Nemokamo Seanso Limitą
              </span>
              <h3 className="text-2.5xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
                Atrakinkite gilesnį savo likimo seansą
              </h3>
              <p className="text-sm text-[#e2d1b0]/70 max-w-2xl mx-auto">
                Pirmasis seansas buvo nemokamas! Norint gauti tolesnį pilną pranašystės interpretavimą ir aiškumą, šis profesionalus seansas kainuoja tik <strong className="text-amber-400 text-lg">3.99€</strong> – <span className="underline decoration-amber-500/50">pigiau negu gardžios kavos puodelis Vilniuje ☕</span>.
              </p>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
              
              {/* Left Column: Why premium, price tag, testimonials */}
              <div className="space-y-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs uppercase font-mono tracking-widest text-amber-400 font-bold mb-3">
                    Kodėl verta tęsti?
                  </h4>
                  <ul className="space-y-3.5 text-xs text-[#e2d1b0]/85">
                    <li className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span><strong>Asmeninis giluminis Gemini interpretavimas:</strong> AI Orakulas analizuoja kortų išdėstymą tiesiogiai pagal jūsų klausimo specifiką.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span><strong>Detalus kiekvienos kortos išaiškinimas:</strong> Sužinokite, kokiame aspekte kortos dvasinė jėga veikia jūsų meilę, karjerą ar sveikatą.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span><strong>Profesionalūs patarimai:</strong> Gausite aiškų ir išsamų likimo nukreipimą jūsų dabartinei gyvenimo kelionei.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span><strong>Paprastas, vienkartinis atsiskaitymas:</strong> Jokių paslėptų prenumeratų! Tik vienkartinis 3,99€ seansas.</span>
                    </li>
                  </ul>
                </div>

                {/* Testimonials snippet */}
                <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-3">
                  <div className="text-[10px] uppercase font-mono tracking-widest text-[#d4af37]/60 italic">Ką sako kiti:</div>
                  <div className="italic text-[11px] text-[#e2d1b0]/80">
                    "Geriausia investicija! Gavau tokį tikslų atsakymą apie santykius, kad net šiurpas nuėjo. Tikrai pigiau nei kava, o naudos – dešimteriopai!"
                  </div>
                  <div className="text-[10px] text-right font-semibold text-amber-400/85">— Kamilė J., Vilnius</div>
                </div>

                <div className="text-[10px] opacity-50 flex items-center gap-2">
                  <span>🔒 Saugus šifruotas apmokėjimas</span>
                  <span>•</span>
                  <span>💳 Visa, MasterCard, Maestro</span>
                </div>
              </div>

              {/* Right Column: Checkout Simulated Payment Form */}
              <div className="p-5 md:p-6 rounded-xl bg-black/25 border border-white/5 space-y-5">
                
                {/* Simulated Payment Success Animation or Core form */}
                {paywallSuccess ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-10 space-y-4 animate-scaleIn">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center animate-pulse">
                      <Check className="w-10 h-10" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Apmokėjimas sėkmingas!</h4>
                      <p className="text-xs text-[#e2d1b0]/60 mt-1">Transakcijos kodas: <span className="font-mono bg-black/40 px-1 py-0.5 rounded">TARO-PAY-{(Math.random()*1000000).toFixed(0)}</span></p>
                    </div>
                    <p className="text-xs text-amber-400 animate-pulse">
                      🔮 Žvaigždės atsiveria. Atveriamas jūsų likimas...
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSimulatedPayment} className="space-y-4">
                    <div className="text-center md:text-left">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">Apmokėjimas kortele</h4>
                      <p className="text-[11px] text-[#e2d1b0]/55 mt-0.5">Įveskite demonstracinės kortelės duomenis transakcijos aktyvavimui</p>
                    </div>

                    {/* Credit Card Mockup UI */}
                    <div className="bg-gradient-to-br from-indigo-900 via-stone-900 to-amber-950 p-4 rounded-xl border border-white/10 text-white font-mono space-y-4 shadow-lg select-none">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37]">Orakulo Kortelė</span>
                        <div className="flex gap-1.5">
                          <span className="w-6 h-3.5 rounded bg-amber-500/40 opacity-70"></span>
                          <span className="w-6 h-3.5 rounded bg-amber-200/20 opacity-70"></span>
                        </div>
                      </div>
                      <div className="text-sm md:text-base tracking-[0.16em] py-1 text-center font-bold">
                        {paymentForm.cardNumber}
                      </div>
                      <div className="flex justify-between text-[10px] items-center">
                        <div>
                          <span className="text-[7px] block opacity-50 uppercase font-sans">Savininkas</span>
                          <input 
                            type="text" 
                            placeholder="VARDAS PAVARDĖ" 
                            value={paymentForm.name} 
                            onChange={(e) => setPaymentForm(prev => ({ ...prev, name: e.target.value.toUpperCase() }))}
                            className="bg-transparent border-b border-transparent hover:border-white/20 focus:border-amber-400/50 focus:outline-none w-28 uppercase text-[10px]"
                            required
                          />
                        </div>
                        <div className="flex gap-4">
                          <div>
                            <span className="text-[7px] block opacity-50 uppercase font-sans">Iki</span>
                            <span className="text-[10px]">{paymentForm.expiry}</span>
                          </div>
                          <div>
                            <span className="text-[7px] block opacity-50 uppercase font-sans">CVV</span>
                            <span className="text-[10px]">{paymentForm.cvv}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Standard inputs for validation */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-semibold opacity-70 mb-1">
                          Pilnas Vardas ant kortelės
                        </label>
                        <input 
                          type="text" 
                          placeholder="Pvz., Jonas Pranaitis" 
                          value={paymentForm.name}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-black/40 border border-white/15 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                          <label className="block text-[10px] uppercase tracking-wider font-semibold opacity-70 mb-1">
                            Kortelės numeris
                          </label>
                          <input 
                            type="text" 
                            placeholder="4000 1234 5678 9010" 
                            value={paymentForm.cardNumber}
                            onChange={(e) => setPaymentForm(prev => ({ ...prev, cardNumber: e.target.value }))}
                            className="w-full bg-black/40 border border-white/15 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-semibold opacity-70 mb-1">
                            CVV
                          </label>
                          <input 
                            type="password" 
                            maxLength={3} 
                            placeholder="333" 
                            value={paymentForm.cvv}
                            onChange={(e) => setPaymentForm(prev => ({ ...prev, cvv: e.target.value }))}
                            className="w-full bg-black/40 border border-white/15 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400 text-center font-mono"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit safe and encrypted */}
                    <div className="pt-2">
                      <button 
                        type="submit"
                        disabled={paymentLoading}
                        className={`w-full py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all relative flex items-center justify-center gap-2 cursor-pointer ${
                          paymentLoading 
                            ? "bg-stone-800 text-stone-500 cursor-not-allowed" 
                            : style.button
                        }`}
                      >
                        {paymentLoading ? (
                          <>
                            <div className="w-4 w-4 h-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                            <span>Apdorojamas saugus mokėjimas...</span>
                          </>
                        ) : (
                          <>
                            <span>Saugiai apmokėti 3.99€</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Decline / Go back */}
                    <div className="text-center">
                      <button 
                        type="button"
                        onClick={() => setShowPaywall(false)}
                        className="text-[11px] text-[#e2d1b0]/55 hover:text-red-400 transition-colors pointer-events-auto"
                      >
                        Grįžti atgal į kortų dėlionę
                      </button>
                    </div>
                  </form>
                )}

              </div>
            </div>

          </div>
        </div>
      )}

      {/* ATSISIŪSTIMO / ĮDIEGIMO TELEFONE INSTRUKCIJA */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg overflow-y-auto animate-fadeIn">
          <div className={`w-full max-w-md rounded-2xl border ${style.accentBorder} ${style.cardBg} transition-all duration-300 shadow-2xl relative p-5 sm:p-7 space-y-5 text-left`}>
            
            {/* Close Button */}
            <button 
              onClick={() => setShowInstallGuide(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white transition-colors cursor-pointer text-xs uppercase tracking-widest font-mono p-1 border border-white/5 rounded bg-black/30 pointer-events-auto"
            >
              Uždaryti ✕
            </button>

            {/* Header */}
            <div className="text-center pt-2">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25 flex items-center justify-center mx-auto mb-3">
                <Smartphone className="w-6 h-6 animate-bounce" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white">
                Įsidiekite Taro programėlę telefone
              </h3>
              <p className="text-xs text-[#e2d1b0]/70 mt-1 max-w-sm mx-auto leading-relaxed text-center">
                Tai pilnavertė programa (PWA), kuri neužima telefono atminties, veikia greičiau ir atsidaro iškart iš jūsų pagrindinio ekrano.
              </p>
            </div>

            {/* TELEFONO LANGAS / APP IKONA PREVIEW */}
            <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex flex-col items-center gap-2">
              <span className="text-[9px] uppercase font-bold text-amber-400 tracking-wider text-center block">
                Programėlės ikona telefono ekrane:
              </span>
              
              {/* Clean CSS Smartphone Mockup */}
              <div className="relative mx-auto w-[170px] h-[280px] rounded-[28px] bg-neutral-950 ring-4 ring-neutral-800 border border-white/10 shadow-2xl p-1.5 flex flex-col justify-between overflow-hidden">
                {/* Wallpaper */}
                <div className={`absolute inset-0 z-0 opacity-60 transition-all duration-500 ${
                  theme === 'mystic' 
                    ? 'bg-[radial-gradient(circle_at_center,_#2a1f16_0%,_#0c0907_100%)]' 
                    : theme === 'cosmic' 
                      ? 'bg-gradient-to-b from-indigo-950 via-slate-900 to-violet-950' 
                      : 'bg-zinc-100'
                }`} />
                
                {/* Highlight Shine */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none z-10" />

                {/* Speaker Notch */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-12 h-2.5 bg-neutral-950 rounded-full z-30 flex items-center justify-center">
                  <div className="w-3 h-0.5 bg-neutral-800 rounded-full" />
                </div>

                {/* Status Bar */}
                <div className="relative z-20 flex justify-between items-center px-1.5 text-[7px] text-white/60 font-medium mt-0.5 select-none font-sans">
                  <span>11:11</span>
                  <div className="flex items-center gap-0.5">
                    <span>📶</span>
                    <span>🔋</span>
                  </div>
                </div>

                {/* Widget */}
                <div className="relative z-20 text-center mt-2 select-none">
                  <div className="text-[8px] font-bold text-white/90 font-serif tracking-wider">Taro Kortos</div>
                  <div className="text-[6px] text-amber-400 font-mono tracking-widest uppercase">Orakulas</div>
                </div>

                {/* Apps Grid */}
                <div className="relative z-20 grid grid-cols-3 gap-y-3 gap-x-1 px-1 items-center justify-items-center mt-2 mb-auto">
                  {/* Fake App 1: Safari */}
                  <div className="flex flex-col items-center gap-0.5 opacity-50">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-green-400 p-0.5 flex items-center justify-center text-xs">
                      🧭
                    </div>
                    <span className="text-[6px] text-white/80 truncate w-8 text-center select-none">Safari</span>
                  </div>

                  {/* ACTIVE APP ICON (Taro Kortos) WITH PULSING GLOW */}
                  <div className="flex flex-col items-center gap-0.5 relative">
                    <div className="relative z-25">
                      <img 
                        src="/src/assets/images/app_icon_1779554899605.png" 
                        alt="Taro"
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-lg shadow-[0_0_10px_rgba(251,191,36,0.6)] border border-amber-400/40 object-cover z-25"
                      />
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-neutral-950 text-neutral-950 font-extrabold text-[5px] flex items-center justify-center">
                        1
                      </div>
                    </div>
                    <span className="text-[7px] text-amber-300 font-bold text-center drop-shadow-md truncate w-8 leading-none select-none">
                      Taro
                    </span>
                  </div>

                  {/* Fake App 3: Settings */}
                  <div className="flex flex-col items-center gap-0.5 opacity-50">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8e8e93] to-[#c7c7cc] p-0.5 flex items-center justify-center text-xs">
                      ⚙️
                    </div>
                    <span className="text-[6px] text-white/80 truncate w-8 text-center select-none">Nustatymai</span>
                  </div>

                  {/* Fake App 4: Mail */}
                  <div className="flex flex-col items-center gap-0.5 opacity-50">
                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-xs">
                      ✉️
                    </div>
                    <span className="text-[6px] text-white/80 truncate w-8 text-center select-none">Paštas</span>
                  </div>

                  {/* Fake App 5: Photos */}
                  <div className="flex flex-col items-center gap-0.5 opacity-50">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-xs">
                      🌸
                    </div>
                    <span className="text-[6px] text-white/80 truncate w-8 text-center select-none">Galerija</span>
                  </div>

                  {/* Fake App 6: Health */}
                  <div className="flex flex-col items-center gap-0.5 opacity-50">
                    <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center text-xs">
                      ❤️
                    </div>
                    <span className="text-[6px] text-white/80 truncate w-8 text-center select-none">Sveikata</span>
                  </div>
                </div>

                {/* Home Indicator */}
                <div className="relative z-20 w-10 h-0.5 bg-white/40 mx-auto rounded-full mb-0.5" />
              </div>
              
              <p className="text-[10px] text-[#e2d1b0]/60 italic text-center leading-normal max-w-xs">
                Magiškas alcheminis mikrokosmoso simbolis pritaikytas kaip programėlės paleidimo ikona!
              </p>
            </div>

            {/* OS Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-black/30 p-1 rounded-xl border border-white/5">
              <button 
                type="button"
                onClick={() => setSelectedOS('ios')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedOS === 'ios' 
                    ? 'bg-amber-500 text-stone-950 font-bold' 
                    : 'text-[#e2d1b0]/60 hover:text-white'
                }`}
              >
                🍏 Apple iPhone
              </button>
              <button 
                type="button"
                onClick={() => setSelectedOS('android')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedOS === 'android' 
                    ? 'bg-indigo-600 text-white font-bold' 
                    : 'text-[#e2d1b0]/60 hover:text-white'
                }`}
              >
                🤖 Android telefonai
              </button>
            </div>

            {/* Instruction Contents */}
            <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-4 text-xs text-[#e2d1b0]/90">
              {selectedOS === 'ios' ? (
                <div className="space-y-3.5">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/35 flex items-center justify-center flex-shrink-0 font-bold text-amber-400 text-[11px]">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-white">Atidarykite Safari naršyklę</p>
                      <p className="opacity-70 text-[11px] mt-0.5">Įsitikinkite, kad šį tinklapį skaitote per „Safari“ programėlę savo iPhone.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/35 flex items-center justify-center flex-shrink-0 font-bold text-amber-400 text-[11px]">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-white">Paspauskite „Dalintis“ (Share)</p>
                      <p className="opacity-70 text-[11px] mt-0.5">Suraskite ir paspauskite mygtuką <span className="bg-black/40 px-1 py-0.5 rounded font-bold">Dalintis 📤</span> (kvadratas su rodykle į viršų) ekranėlio apačioje.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/35 flex items-center justify-center flex-shrink-0 font-bold text-amber-400 text-[11px]">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-white">Pridėkite prie pagrindinio ekrano</p>
                      <p className="opacity-70 text-[11px] mt-0.5">Slinkite žemyn meniu sąrašu, kol pamatysite parinktį <span className="font-bold text-amber-400">„Pridėti į pagrindinį ekraną“ ➕</span> (Add to Home Screen) bei patvirtinkite paspausdami „Įrašyti“.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/15 border border-indigo-500/35 flex items-center justify-center flex-shrink-0 font-bold text-indigo-400 text-[11px]">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-white">Naudokite Chrome naršyklę</p>
                      <p className="opacity-70 text-[11px] mt-0.5">Būkite tikri, kad programą atidarėte su Google Chrome naršykle.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/15 border border-indigo-500/35 flex items-center justify-center flex-shrink-0 font-bold text-indigo-400 text-[11px]">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-white">Atidarykite meniu</p>
                      <p className="opacity-70 text-[11px] mt-0.5">Paspauskite trijų taškelių meniu ikoną <span className="bg-black/40 px-1.5 py-0.5 rounded font-bold">⋮</span> viršutiniame dešiniajame kampe.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/15 border border-indigo-500/35 flex items-center justify-center flex-shrink-0 font-bold text-indigo-400 text-[11px]">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-white">Spauskite „Įdiegti programą“</p>
                      <p className="opacity-70 text-[11px] mt-0.5">Sąraše suraskite ir pasirinkite <span className="font-bold text-indigo-400">„Įdiegti programą“</span> arba <span className="font-bold text-indigo-400">„Pridėti į pagrindinį ekraną“</span> (Add to Home Screen) ir patvirtinkite.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Motivational Footer */}
            <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-[11px] leading-relaxed text-center italic text-[#e2d1b0]/85">
              ✨ Atlikus šiuos paprastus žingsnius, Taro programėlė atsiras jūsų telefone kartu su kitomis aplikacijomis ir atsidarys pasakiškai gražiu, visą ekraną apimančiu režimu!
            </div>

            {/* Close Button beneath */}
            <div>
              <button 
                type="button"
                onClick={() => setShowInstallGuide(false)}
                className={`w-full py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all pointer-events-auto cursor-pointer ${style.button}`}
              >
                Viskas aišku, ačiū!
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );

  // Helper renderer for Tarot spread slots
  function renderPlaceholderSlot(index: number, position: any, compact = false) {
    const isFilled = drawnCards.length > index;
    const item = isFilled ? drawnCards[index] : null;

    // Card highlight hover states
    const isNextToDraw = drawnCards.length === index;

    return (
      <div 
        key={index}
        className={`flex flex-col items-center justify-center transition-all ${
          compact ? '' : 'w-full'
        }`}
      >
        {/* Draw Slot Block */}
        <div 
          onClick={() => {
            // Clicking slot if next to draw behaves like drawing from pool
            if (isNextToDraw && activeDrawDeckIndices.length > 0) {
              // Draw using a random index
              const rIdx = activeDrawDeckIndices[Math.floor(Math.random() * activeDrawDeckIndices.length)];
              handleDrawCardFromChoiceDeck(rIdx);
            }
          }}
          className={`w-[70px] h-[100px] sm:w-20 sm:h-28 md:w-24 md:h-34 rounded-xl border flex flex-col justify-between items-center p-1.5 sm:p-2 relative transition-all duration-300 ${
            isFilled 
              ? item?.isReversed 
                ? 'rotate-180' 
                : ''
              : ''
          } ${
            isFilled
              ? step === 3
                ? style.cardFront // Show front when revealed
                : style.cardBack // Keep back shown in drawing phase
              : isNextToDraw
                ? theme === "mystic"
                  ? "border-[#d4af37] border-2 border-dashed bg-[#d4af37]/5 animate-pulse scale-102 shadow-md cursor-pointer"
                  : "border-amber-400 border-2 border-dashed bg-amber-500/5 animate-pulse scale-102 shadow-md cursor-pointer"
                : "border-stone-800 border bg-black/15 opacity-65"
          }`}
        >
          {theme === "mystic" && (
            <div className="absolute inset-1.5 border border-[#d4af37]/15 rounded-lg pointer-events-none z-0" />
          )}
          {isFilled ? (
            // FILLED STATE
            step === 3 ? (
              // Face-up final revealed state
              <div className={`absolute inset-0 rounded-xl overflow-hidden flex flex-col justify-between p-1 z-10 bg-stone-950 ${
                item?.isReversed ? 'rotate-180' : ''
              }`}>
                {item && (
                  <img 
                    src={getRiderWaiteImageUrl(item.card)} 
                    alt={item.card.name} 
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="relative z-10 w-full bg-black/80 backdrop-blur-[1px] p-1 rounded-lg mt-auto flex flex-col items-center">
                  <span className="text-[6.5px] sm:text-[7px] font-mono uppercase tracking-tighter opacity-80 text-[#e2d1b0] truncate w-full">
                    {item?.positionName}
                  </span>
                  <span className={`text-[7.5px] sm:text-[8px] font-extrabold uppercase tracking-tighter text-center max-w-full ${
                    theme === 'mystic' ? 'text-[#d4af37]' : 'text-amber-400'
                  } truncate`}>
                    {item?.card.name}
                  </span>
                </div>
              </div>
            ) : (
              // Face-down selected drawing state
              <div className={`absolute inset-0 flex flex-col items-center justify-center rounded-xl z-10 ${
                theme === "mystic"
                  ? "bg-[#1c150f] border border-[#d4af37]/30"
                  : "bg-radial from-amber-900 to-stone-900 border border-amber-500/40"
              }`}>
                <span className="text-[8px] sm:text-[9px] font-mono text-amber-400 font-bold">🔮</span>
                <span className="text-[7px] sm:text-[8px] opacity-40 mt-1 uppercase font-mono tracking-widest text-center px-1">
                   {index + 1}
                </span>
              </div>
            )
          ) : (
            // EMPTY PLACEHOLDER STATE
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl text-center p-1 z-10">
              <span className={`text-xs font-mono font-bold select-none ${theme === 'mystic' ? 'text-[#e2d1b0]/40' : 'text-stone-600'}`}>{index + 1}</span>
              {!compact && (
                <span className={`text-[6.5px] sm:text-[8px] font-medium tracking-tight mt-0.5 sm:mt-1 line-clamp-2 uppercase ${theme === 'mystic' ? 'text-[#e2d1b0]/60' : 'text-stone-500'}`}>
                  {position.name}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Position Description beneath individual blocks (if not compact) */}
        {!compact && (
          <div className="text-center mt-1.5 sm:mt-2 max-w-[80px] sm:max-w-[140px]">
            <span className="text-[8px] sm:text-[10px] font-bold block uppercase tracking-wide opacity-80 truncate">
              {position.name}
            </span>
            <span className="text-[7px] sm:text-[8px] opacity-65 leading-tight block mt-0.5 max-h-8 sm:max-h-12 overflow-hidden text-ellipsis line-clamp-2">
              {position.description}
            </span>
          </div>
        )}
      </div>
    );
  }
}
