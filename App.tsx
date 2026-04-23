
import React, { useState, useEffect, useRef, useCallback, useMemo, Component, ReactNode, ErrorInfo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, ChevronLeft, CheckCircle, Circle, Menu, X, Trophy, Map,
  Target, Volume2, Pause, Play, Brain, Sparkles, Layout, Loader2,
  BookOpen, Zap, Coffee, TrendingUp, Waves, Clock, PenLine, ExternalLink, 
  Mic, ShieldCheck, ShieldAlert, Database, Trash2, ArrowDown, Lock, BookMarked, Rocket, Layers,
  Users, Image as ImageIcon, Search, ArrowRight, Music,
  FileText, ZapOff, Quote, Home, Compass, Calculator, Activity, AlertCircle, CheckCircle2,
  Microwave, Microscope, Wind, User, Award, BarChart3, ListOrdered, ShoppingBag, TreePine,
  Flame, Coins, Star, Radio, Sun, Moon, Settings as SettingsIcon, Tv, AlertTriangle, Fingerprint
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, collection, getDocs, writeBatch, deleteDoc } from 'firebase/firestore';
import { modules } from './data/modules';
import { get, set } from './services/neuralCache';
import { AIChat } from './components/AIChat';
import { LiveTutor } from './components/LiveTutor';
import { PhysicsCalculator } from './components/PhysicsCalculator';
import { LabsHub } from './components/LabsHub';
import { StudyRoadmap } from './components/StudyRoadmap';
import { PhysicsLab } from './components/PhysicsLab';
import { TransducerLab } from './components/TransducerLab';
import { PulsedWaveLab } from './components/PulsedWaveLab';
import { DopplerLab } from './components/DopplerLab';
import { ArtifactExplorer } from './components/ArtifactExplorer';
import { ResolutionLab } from './components/ResolutionLab';
import { SafetyLab } from './components/SafetyLab';
import { HemodynamicsLab } from './components/HemodynamicsLab';
import { InstrumentationLab } from './components/InstrumentationLab';
import { MathematicsLab } from './components/MathematicsLab';
import { AttenuationLab } from './components/AttenuationLab';
import { AdvancedImagingLab } from './components/AdvancedImagingLab';
import { RegistryReadyDrill } from './components/RegistryReadyDrill';
import { BuildOutPlan } from './components/BuildOutPlan';
import { Archives } from './components/Archives';
import { NeuralAtlas } from './components/NeuralAtlas';
import { Profile } from './components/Profile';
import { Leaderboard } from './components/Leaderboard';
import { Forge } from './components/Forge';
import { SkillTree } from './components/SkillTree';
import { AchievementVault } from './components/AchievementVault';
import { NeuralRadio } from './components/NeuralRadio';
import { Settings } from './components/Settings';
import { 
  generateLectureScript, 
  getRegistryPulse,
  generateTTS,
  generateMasteryChoices,
  generateQuiz,
  generateVisualSummary,
  generateForgeArtifact,
  hashString
} from './services/geminiService';
import { UserVault, ChoiceOption, QuizQuestion, UserStats, Badge, Quest, LeaderboardEntry, CachedLesson } from './types';
import { AnimatedExplainer } from './components/AnimatedExplainer';
import { AnimatedLessonHeader } from './components/AnimatedLessonHeader';
import { MasteryRadar } from './components/MasteryRadar';
import { LogicSpine } from './components/LogicSpine';
import { MockExam } from './components/MockExam';
import { BOT_PERSONAS } from './data/personas';
import { NeuralBriefing } from './components/NeuralBriefing';
import { BatchSynthesizer } from './components/BatchSynthesizer';
import { ArtifactHeuristic } from './components/ArtifactHeuristic';
import { SimulatedStreams } from './components/SimulatedStreams';

import { PerformanceAnalytics } from './components/PerformanceAnalytics';
import { NeuralDuel } from './components/NeuralDuel';
import { RegistryDailyChallenge } from './components/RegistryDailyChallenge';
import { NeuralPulse } from './components/NeuralPulse';

import { MockRegistryExam } from './components/MockRegistryExam';
import { NeuralSRS } from './components/NeuralSRS';
import { StudyGroups } from './components/StudyGroups';
import { CommunityLibrary } from './components/CommunityLibrary';
import { NeuralVisualizer } from './components/NeuralVisualizer';

type ViewMode = 'dashboard' | 'masterclass' | 'roadmap' | 'vault' | 'buildplan' | 'profile' | 'leaderboard' | 'skilltree' | 'labs' | 'mock-exam' | 'forge' | 'settings' | 'streams' | 'achievements' | 'analytics' | 'duel' | 'srs' | 'exam' | 'groups';
type Persona = 'Harvey' | 'Professor' | 'Analyst';

const INITIAL_BADGES: Badge[] = [
  { id: 'first_lesson', name: 'First Step', description: 'Complete your first lesson', icon: 'Rocket' },
  { id: 'quiz_whiz', name: 'Quiz Whiz', description: 'Pass 5 quizzes with 100 PERCENT', icon: 'Trophy' },
  { id: 'streak_3', name: 'Consistent', description: 'Maintain a 3-day streak', icon: 'Zap' },
  { id: 'master_waves', name: 'Wave Master', description: 'Complete all lessons in Waves module', icon: 'Waves' },
  { id: 'master_doppler', name: 'Doppler Master', description: 'Complete all lessons in Doppler module', icon: 'Activity' },
  { id: 'master_transducers', name: 'Transducer Master', description: 'Complete all lessons in Transducers module', icon: 'Microwave' },
];

const INITIAL_QUESTS: Quest[] = [
  { id: 'daily_lesson', title: 'Daily Scholar', description: 'Complete 1 lesson today', xpReward: 100, coinReward: 10, isCompleted: false, progress: 0, target: 1, type: 'daily' },
  { id: 'quiz_master', title: 'Quiz Master', description: 'Pass 3 quizzes', xpReward: 300, coinReward: 50, isCompleted: false, progress: 0, target: 3, type: 'milestone' },
  { id: 'perfect_score', title: 'Perfect Logic', description: 'Get 100 PERCENT on a quiz', xpReward: 500, coinReward: 100, isCompleted: false, progress: 0, target: 1, type: 'milestone' },
];

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    (this as any).state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    const state = (this as any).state;
    if (state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8 text-center">
          <div className="glass-panel p-12 md:p-20 rounded-[3rem] border border-white/10 max-w-2xl space-y-8 animate-in zoom-in duration-500">
            <div className="p-6 bg-rose-500/20 text-rose-500 rounded-full w-fit mx-auto border border-rose-500/30">
              <AlertCircle size={48} />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">Neural Link Severed</h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] md:text-xs tracking-[0.4em] leading-relaxed">
              An unexpected heuristic failure has occurred in the registry logic.
            </p>
            <div className="bg-black/40 p-6 rounded-2xl border border-white/5 text-left font-mono text-xs text-rose-400 overflow-auto max-h-40">
              {state.error?.message}
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary w-full py-6"
            >
              Re-Initialize System
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

export const App: React.FC = () => {
  const [currentModuleIdx, setCurrentModuleIdx] = useState(0);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [lessonNotes, setLessonNotes] = useState<Record<string, string>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bufferOpen, setBufferOpen] = useState(false);
  const [hotMicEnabled, setHotMicEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('spi_hotmic') !== 'false';
    }
    return true;
  });
  const [notifPreferences, setNotifPreferences] = useState({
    neuralPulse: true,
    weeklyBrief: true,
    streakAlerts: true
  });

  // Sync Hot-Mic setting
  useEffect(() => {
    localStorage.setItem('spi_hotmic', hotMicEnabled.toString());
  }, [hotMicEnabled]);

  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [liveTutorOpen, setLiveTutorOpen] = useState(false);
  const [communityLibraryOpen, setCommunityLibraryOpen] = useState(false);
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [tutorOpen, setTutorOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [radioOpen, setRadioOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
    }
    return 'dark';
  });

  // Theme effect
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleBlocksCount, setVisibleBlocksCount] = useState(1);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [quizTimer, setQuizTimer] = useState<number>(0);
  const quizIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [appBooted, setAppBooted] = useState(false);
  const [lessonBooting, setLessonBooting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setCalculatorOpen(false);
        setRadioOpen(false);
        setTutorOpen(false);
        setLiveTutorOpen(false);
      }
      // Quick navigation shortcuts (only if no input is focused)
      if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        switch (e.key.toLowerCase()) {
          case 'd': setViewMode('dashboard'); break;
          case 'r': setViewMode('roadmap'); break;
          case 'v': setViewMode('vault'); break;
          case 'l': setViewMode('labs'); break;
          case 'c': setCalculatorOpen(prev => !prev); break;
          case 'p': setViewMode('profile'); break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [userStats, setUserStats] = useState<UserStats>({
    xp: 0,
    level: 1,
    coins: 0,
    streak: 1,
    lastActive: Date.now(),
    badges: [],
    completedQuests: [],
    totalLessonsCompleted: 0,
    totalQuizzesPassed: 0,
    skillTree: { 'wave_basics': true },
    activeBoosts: {},
    avatarId: 'acoustic_pioneer',
    dailyQuestsResetAt: Date.now(),
    history: []
  });

  const [activeQuests, setActiveQuests] = useState<Quest[]>(INITIAL_QUESTS);

  useEffect(() => {
    (window as any).setGlobalViewMode = setViewMode;
    return () => { delete (window as any).setGlobalViewMode; };
  }, [setViewMode]);

  const awardXP = (amount: number) => {
    let finalAmount = amount;
    if ((userStats.activeBoosts?.['xp_overclock'] || 0) > 0) {
      finalAmount *= 2;
      setUserStats(prev => ({
        ...prev,
        activeBoosts: { ...prev.activeBoosts, 'xp_overclock': (prev.activeBoosts?.['xp_overclock'] || 0) - 1 }
      }));
      toast.info('XP Overclock Active: Double XP Awarded!', { icon: <Zap className="text-indigo-500" /> });
    }
    setUserStats(prev => {
      const newXP = prev.xp + finalAmount;
      const newLevel = Math.floor(newXP / 1000) + 1;
      
      // Update history
      const today = new Date().toDateString();
      const history = [...prev.history];
      const todayIdx = history.findIndex(h => h.date === today);
      if (todayIdx >= 0) {
        history[todayIdx] = { ...history[todayIdx], xpEarned: history[todayIdx].xpEarned + finalAmount };
      } else {
        history.push({ date: today, xpEarned: finalAmount, lessonsCompleted: 0 });
      }

      if (newLevel > prev.level) {
        toast.success(`Level Up! You are now Level ${newLevel}`, {
          icon: <Rocket className="text-indigo-600" />,
          description: "New skills unlocked in the Skill Tree!"
        });
      }
      return { ...prev, xp: newXP, level: newLevel, history: history.slice(-30) }; // Keep last 30 days
    });
    toast.success(`+${finalAmount} XP Neural Integration`, {
      icon: <Star className="text-yellow-500" size={16} />
    });
  };

  const awardCoins = (amount: number) => {
    setUserStats(prev => ({ ...prev, coins: prev.coins + amount }));
    toast.success(`+${amount} Neural Credits`, {
      icon: <Coins className="text-amber-500" size={16} />
    });
  };

  const unlockBadge = (badgeId: string) => {
    if (!userStats.badges.includes(badgeId)) {
      setUserStats(prev => ({ ...prev, badges: [...prev.badges, badgeId] }));
      const badge = INITIAL_BADGES.find(b => b.id === badgeId);
      if (badge) {
        toast.success(`Achievement Unlocked: ${badge.name}`, {
          icon: <Award className="text-indigo-500" size={20} />,
          description: badge.description
        });
      }
    }
  };

  const updateQuestProgress = (questId: string, amount: number) => {
    setActiveQuests(prev => prev.map(q => {
      if (q.id === questId && !q.isCompleted) {
        const newProgress = Math.min(q.progress + amount, q.target);
        const isNowCompleted = newProgress === q.target;
        if (isNowCompleted) {
          awardXP(q.xpReward);
          awardCoins(q.coinReward);
          toast.success(`Quest Completed: ${q.title}`, {
            icon: <Target className="text-emerald-500" size={20} />,
            description: `Rewards: +${q.xpReward} XP, +${q.coinReward} Coins`
          });
        }
        return { ...q, progress: newProgress, isCompleted: isNowCompleted };
      }
      return q;
    }));
  };

  const handleUnlockSkill = (nodeId: string, cost: number) => {
    if (userStats.coins >= cost) {
      setUserStats(prev => ({
        ...prev,
        coins: prev.coins - cost,
        skillTree: { ...prev.skillTree, [nodeId]: true }
      }));
      toast.success("Skill Unlocked", {
        description: "New diagnostic capability synthesized.",
        icon: <Zap className="text-indigo-500" />
      });
    }
  };

  const handleDuelVictory = (xpEarned: number) => {
    awardXP(xpEarned);
    awardCoins(50);
    updateQuestProgress('daily_duel', 1);
    setViewMode('dashboard');
  };

  const handleBuyBoost = (boostId: string, cost: number) => {
    if (userStats.coins >= cost) {
      setUserStats(prev => ({
        ...prev,
        coins: prev.coins - cost,
        activeBoosts: { ...prev.activeBoosts, [boostId]: ((prev.activeBoosts?.[boostId]) || 0) + 1 }
      }));
      toast.success(`Purchased Boost: ${boostId.replace('_', ' ').toUpperCase()}`, { icon: <ShoppingBag className="text-indigo-500" /> });
    }
  };

  const handleEasterEgg = () => {
    if (!userStats.badges.includes('easter_egg')) {
      awardXP(5000);
      awardCoins(1000);
      unlockBadge('easter_egg');
      toast.success('Neural Link Established! Secret Archives Unlocked.', {
        icon: <Sparkles className="text-yellow-500" />,
        description: 'Rewards: +5000 XP, +1000 Coins'
      });
    } else {
      toast.info('Neural Link already established.');
    }
  };

  const handleUpdateAvatar = (avatarId: string) => {
    setUserStats(prev => ({ ...prev, avatarId }));
    toast.success('Neural Persona Updated', {
      icon: <User className="text-indigo-400" />
    });
  };

  const [vault, setVault] = useState<UserVault>({ mnemonics: {}, lessons: {}, globalFlashcards: [], examHistory: [], pinnedArtifacts: [] });

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      if (currentUser) {
        toast.success(`Neural Link Established: ${currentUser.displayName}`, {
          icon: <ShieldCheck className="text-emerald-500" />
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch Data from Firestore
  useEffect(() => {
    if (!user || !isAuthReady) return;

    const statsRef = doc(db, 'users', user.uid);
    const vaultRef = doc(db, 'users', user.uid, 'vault', 'data');

    const unsubStats = onSnapshot(statsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as UserStats & { completedLessons: string[] };
        setUserStats(prev => ({ ...prev, ...data }));
        if (data.completedLessons) {
          setCompletedLessons(new Set(data.completedLessons));
        }
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, `users/${user.uid}`));

    const unsubVault = onSnapshot(vaultRef, (docSnap) => {
      if (docSnap.exists()) {
        const metadata = docSnap.data();
        setVault(prev => ({ ...prev, ...metadata }));
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, `users/${user.uid}/vault/data`));

    const lessonsRef = collection(db, 'users', user.uid, 'vault', 'data', 'lessons');
    const unsubVaultLessons = onSnapshot(lessonsRef, (querySnap) => {
      const cloudLessons: Record<string, CachedLesson> = {};
      querySnap.forEach(doc => {
        cloudLessons[doc.id] = doc.data() as CachedLesson;
      });
      
      setVault(prev => {
        const newLessons = { ...prev.lessons };
        // Update or add lessons from cloud
        Object.keys(cloudLessons).forEach(id => {
          newLessons[id] = {
            ...newLessons[id],
            ...cloudLessons[id]
          };
        });
        return { ...prev, lessons: newLessons };
      });
    }, (error) => handleFirestoreError(error, OperationType.GET, `users/${user.uid}/vault/data/lessons`));

    const settingsRef = doc(db, 'users', user.uid, 'settings', 'config');
    const unsubSettings = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.theme) setTheme(data.theme);
        if (data.notifications) setNotifPreferences(data.notifications);
        if (data.hotMic !== undefined) setHotMicEnabled(data.hotMic);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, `users/${user.uid}/settings/config`));

    return () => {
      unsubStats();
      unsubVault();
      unsubVaultLessons();
      unsubSettings();
    };
  }, [user, isAuthReady]);

  const handleTogglePin = (artifactId: string) => {
    setVault(prev => {
      const currentPinned = prev.pinnedArtifacts || [];
      const isPinned = currentPinned.includes(artifactId);
      const newPinned = isPinned 
        ? currentPinned.filter(id => id !== artifactId)
        : [...currentPinned, artifactId];
      
      if (!isPinned) {
        toast.success('Artifact Pinned to Neural Core', { icon: <Lock className="text-indigo-400" /> });
      } else {
        toast.info('Artifact Unpinned');
      }
      
      return { ...prev, pinnedArtifacts: newPinned };
    });
  };

  // Sync to Cloud
  const syncToCloud = useCallback(async (stats: UserStats, currentVault: UserVault, lessons: Set<string>, currentTheme: 'dark' | 'light', currentNotifs: any, currentHotMic: boolean) => {
    if (!user || !isAuthReady) return;
    setIsSyncing(true);
    try {
      const statsRef = doc(db, 'users', user.uid);
      const vaultRef = doc(db, 'users', user.uid, 'vault', 'data');
      const settingsRef = doc(db, 'users', user.uid, 'settings', 'config');
      const profileRef = doc(db, 'public_profiles', user.uid);

      const statsToSync = {
        ...stats,
        completedLessons: Array.from(lessons),
        lastActive: Date.now()
      };

      // Exclude lessons from vault sync here, they are handled individually
      const { lessons: _, ...vaultMetadata } = currentVault;

      await setDoc(statsRef, statsToSync, { merge: true });
      await setDoc(vaultRef, vaultMetadata, { merge: true });
      await setDoc(settingsRef, {
        theme: currentTheme,
        notifications: currentNotifs,
        hotMic: currentHotMic
      }, { merge: true });
      
      // Update Public Profile for Leaderboard
      await setDoc(profileRef, {
        userId: user.uid,
        name: user.displayName || 'Anonymous Sonographer',
        xp: stats.xp,
        level: stats.level,
        badgesCount: stats.badges.length,
        streak: stats.streak,
        avatarId: stats.avatarId
      }, { merge: true });

    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    } finally {
      setIsSyncing(false);
    }
  }, [user, isAuthReady]);

  // Auto-sync on changes
  useEffect(() => {
    if (user && isAuthReady) {
      const timer = setTimeout(() => {
        syncToCloud(userStats, vault, completedLessons, theme, notifPreferences, hotMicEnabled);
      }, 5000); // 5s debounce for settings and stats
      return () => clearTimeout(timer);
    }
  }, [userStats, vault, completedLessons, theme, notifPreferences, hotMicEnabled, user, isAuthReady, syncToCloud]);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      toast.error("Neural Link Failed: Authentication Error");
      console.error(error);
    }
  };

  const handleSaveForgeArtifact = (artifact: any) => {
    const newArtifact = {
      ...artifact,
      id: Math.random().toString(36).substring(7).toUpperCase(),
      timestamp: Date.now()
    };
    setVault(prev => ({
      ...prev,
      forgedArtifacts: [...(prev.forgedArtifacts || []), newArtifact]
    }));
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.info("Neural Link Severed: Logged Out");
    } catch (error) {
      console.error(error);
    }
  };

  const handlePinMedia = (media: any) => {
    const artifact = {
      title: media.title,
      heuristic: media.description || "Shared community resource.",
      mnemonic: `Shared by ${media.authorName}`,
      imageUrl: media.url,
      type: 'shared'
    };
    handleSaveForgeArtifact(artifact);
    toast.success("Media Integrated: Asset synced to your private vault.", {
      icon: <Database className="text-indigo-400" />
    });
  };

  const [lectureScript, setLectureScript] = useState<string>('');
  const [registryPulse, setRegistryPulse] = useState<{text: string, sources: any[]} | null>(null);
  const [masteryChoices, setMasteryChoices] = useState<ChoiceOption[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);

  const [audioLoading, setAudioLoading] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<Persona>('Harvey');

  const currentModule = modules[currentModuleIdx];
  const currentLesson = currentModule.lessons[currentLessonIdx];
  const lessonKey = `${currentModuleIdx}-${currentLessonIdx}`;

  const progress = useMemo(() => {
    const total = modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
    return total > 0 ? (completedLessons.size / total) * 100 : 0;
  }, [completedLessons]);

  const masteryData = useMemo(() => {
    const getModuleProgress = (title: string) => {
      const mod = modules.find(m => m.title.toLowerCase().includes(title.toLowerCase()));
      if (!mod) return 0;
      const modIdx = modules.indexOf(mod);
      const completed = mod.lessons.filter((_, lIdx) => completedLessons.has(`${modIdx}-${lIdx}`)).length;
      return (completed / mod.lessons.length) * 100;
    };

    return {
      Waves: getModuleProgress('Waves'),
      Transducers: getModuleProgress('Transducers'),
      Doppler: getModuleProgress('Doppler'),
      Resolution: getModuleProgress('Resolution'),
      Instrumentation: getModuleProgress('Instrumentation'),
      Safety: getModuleProgress('Bioeffects')
    };
  }, [completedLessons]);

  const blocks = useMemo(() => {
    return lectureScript.split(/\[BLOCK_\d+\]:?/).map(b => b.trim()).filter(b => b.length > 0);
  }, [lectureScript]);

  const nextLessonData = useMemo(() => {
    const currMod = modules[currentModuleIdx];
    if (currentLessonIdx < currMod.lessons.length - 1) {
      return currMod.lessons[currentLessonIdx + 1];
    } else if (currentModuleIdx < modules.length - 1) {
      return modules[currentModuleIdx + 1].lessons[0];
    }
    return null;
  }, [currentModuleIdx, currentLessonIdx]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Load from IndexedDB (New Storage)
        const [v, s, q, p, n] = await Promise.all([
          get('spi_vault'),
          get('spi_stats'),
          get('spi_quests'),
          get('spi_progress'),
          get('spi_notes')
        ]);

        // 2. Migration from LocalStorage if needed
        if (!v) {
          const savedVault = localStorage.getItem('spi_vault');
          if (savedVault) {
            const parsed = JSON.parse(savedVault);
            setVault(parsed);
            await set('spi_vault', parsed);
            localStorage.removeItem('spi_vault');
          }
        } else {
          setVault(v);
        }

        if (!s) {
          const savedStats = localStorage.getItem('spi_stats');
          if (savedStats) {
            const parsed = JSON.parse(savedStats);
            setUserStats(parsed);
            await set('spi_stats', parsed);
            localStorage.removeItem('spi_stats');
          }
        } else {
          setUserStats(s);
        }

        if (!q) {
          const savedQuests = localStorage.getItem('spi_quests');
          if (savedQuests) {
            const parsed = JSON.parse(savedQuests);
            setActiveQuests(parsed);
            await set('spi_quests', parsed);
            localStorage.removeItem('spi_quests');
          }
        } else {
          setActiveQuests(q);
        }

        if (p) {
          setCompletedLessons(new Set(p));
        } else {
          const savedProgress = localStorage.getItem('spi_progress');
          if (savedProgress) {
            const parsed = JSON.parse(savedProgress);
            setCompletedLessons(new Set(parsed));
            await set('spi_progress', parsed);
            localStorage.removeItem('spi_progress');
          }
        }

        if (n) {
          setLessonNotes(n);
        } else {
          const savedNotes = localStorage.getItem('spi_notes');
          if (savedNotes) {
            const parsed = JSON.parse(savedNotes);
            setLessonNotes(parsed);
            await set('spi_notes', parsed);
            localStorage.removeItem('spi_notes');
          }
        }

        if (window.innerWidth >= 1280) {
          setSidebarOpen(true);
          setBufferOpen(true);
        }

        // Streak and Quest Reset Logic
        const now = Date.now();
        const lastActive = s?.lastActive || Date.now();
        const lastActiveDate = new Date(lastActive).toDateString();
        const nowDate = new Date(now).toDateString();

        if (lastActiveDate !== nowDate) {
          const diffDays = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            setUserStats(prev => ({ ...prev, streak: prev.streak + 1, lastActive: now }));
          } else if (diffDays > 1) {
            setUserStats(prev => ({ ...prev, streak: 1, lastActive: now }));
          } else {
            setUserStats(prev => ({ ...prev, lastActive: now }));
          }
          
          // Reset daily quests and update reset timestamp
          setActiveQuests(prev => prev.map(q => {
            if (q.type === 'daily') {
              return { ...q, progress: 0, isCompleted: false };
            }
            return q;
          }));
          setUserStats(prev => ({ ...prev, dailyQuestsResetAt: now }));
        } else {
          setUserStats(prev => ({ ...prev, lastActive: now }));
        }
      } catch (error) {
        console.error("Neural Boot Failure:", error);
        const detailedError = error instanceof Error ? error.message : JSON.stringify(error);
        setFetchError(`System recovery initiated. Neural link integrity compromised: ${detailedError}`);
      } finally {
        // App Boot Sequence
        setTimeout(() => setAppBooted(true), 1500);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (appBooted) {
      set('spi_progress', [...completedLessons]);
      set('spi_notes', lessonNotes);
      set('spi_vault', vault);
      set('spi_stats', userStats);
      set('spi_quests', activeQuests);
    }
  }, [completedLessons, lessonNotes, vault, userStats, activeQuests, appBooted]);

  const fetchContent = useCallback(async (force = false) => {
    if (viewMode !== 'masterclass') return;
    setLessonBooting(true);
    setFetchError(null);
    setVisibleBlocksCount(1);
    setSelectedChoice(null);
    setCurrentQuiz([]);
    setQuizAnswers({});
    setShowQuizResults(false);
    
    if (!force && vault.lessons[lessonKey]) {
      const cached = vault.lessons[lessonKey];
      setLectureScript(cached.script);
      setRegistryPulse(cached.pulse);
      setMasteryChoices(cached.masteryChoices || []);
      setCurrentQuiz(cached.quiz || []);
      
      // Attempt to recover imageUrl from local cache if missing (e.g. after cloud sync)
      if (!cached.imageUrl) {
        generateVisualSummary(currentLesson.title).then(url => {
          if (url) {
            setVault(prev => ({
              ...prev,
              lessons: {
                ...prev.lessons,
                [lessonKey]: { ...prev.lessons[lessonKey], imageUrl: url }
              }
            }));
          }
        });
      }

      // Pre-check for cached audio to avoid re-synthesis phase in UI
      const cleanText = cached.script.replace(/\[BLOCK_\d+\]/g, '').trim();
      const audioCacheKey = `tts_v2_Harvey_${await hashString(cleanText)}`;
      get(audioCacheKey).then(audioData => {
        if (audioData) {
          const url = createWavBlobUrlFromBase64(audioData);
          setAudioUrl(url);
          setCurrentPersona('Harvey');
        }
      }).catch(console.error);

      setLoadingAI(false);
      setTimeout(() => setLessonBooting(false), 1000);
      return;
    }

    setLoadingAI(true);
    try {
      // Step 1: Core Content + Assessment (Primary)
      const [script, choices, quiz] = await Promise.all([
        generateLectureScript(currentLesson.title),
        generateMasteryChoices(currentLesson.title),
        generateQuiz(currentLesson.title)
      ]);
      
      setLectureScript(script);
      setMasteryChoices(choices);
      setCurrentQuiz(quiz);
      
      const mnemonicMatch = script.match(/\[BLOCK_5\]:?\s*([\s\S]*?)(?=\[BLOCK_6\]|$)/i);
      const extractedMnemonic = mnemonicMatch ? mnemonicMatch[1].replace(/<[^>]*>?/gm, '').trim() : '';
      
      const initialLesson = { script, pulse: { text: "Neural alignment pending...", sources: [] }, masteryChoices: choices, quiz, flashcards: [], timestamp: Date.now() };

      setVault(prev => ({
        ...prev,
        mnemonics: extractedMnemonic ? { ...prev.mnemonics, [currentLesson.title]: extractedMnemonic } : prev.mnemonics,
        lessons: { 
          ...prev.lessons, 
          [lessonKey]: initialLesson 
        }
      }));

      setLoadingAI(false);
      setTimeout(() => setLessonBooting(false), 500);

      // Step 2: Secondary Assets (Background)
      Promise.all([
        getRegistryPulse(currentLesson.title),
        generateVisualSummary(currentLesson.title)
      ]).then(([pulse, imageUrl]) => {
        setVault(prev => {
          // Verify we are still updating the correct lesson in the vault
          if (!prev.lessons[lessonKey]) return prev;
          
          const updatedLesson = { ...prev.lessons[lessonKey], pulse, imageUrl };
          setRegistryPulse(pulse);
          
          // Background cloud sync update
          if (user) {
            const lessonDocRef = doc(db, 'users', user.uid, 'vault', 'data', 'lessons', lessonKey);
            const { imageUrl: _, ...cloudLesson } = updatedLesson;
            setDoc(lessonDocRef, cloudLesson).catch(console.error);
          }

          return {
            ...prev,
            lessons: {
              ...prev.lessons,
              [lessonKey]: updatedLesson
            }
          };
        });

        // If visual was just generated, update state immediately
        if (imageUrl) {
          // Handled via setVault above
        }
      }).catch(console.error);

      // Step 3: Background Audio
      generateTTS(script, 'Harvey').then((audioData) => {
        if (audioData) {
          const url = createWavBlobUrlFromBase64(audioData);
          setAudioUrl(url);
          setCurrentPersona('Harvey');
        }
      }).catch(console.error);

    } catch (e) { 
      console.error(e); 
      setFetchError("The neural link was interrupted during synthesis. Please attempt a manual reload.");
      setLoadingAI(false);
      setLessonBooting(false);
    }
  }, [lessonKey, viewMode, currentLesson.title, vault.lessons]);

  useEffect(() => {
    fetchContent();
    stopNarration();
  }, [fetchContent]);

  const stopNarration = () => { 
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  };
  
  const clearVault = async () => {
    const emptyVault: UserVault = { mnemonics: {}, lessons: {}, globalFlashcards: [], examHistory: [] };
    setVault(emptyVault);
    await set('spi_vault', emptyVault);
    setCompletedLessons(new Set());
    await set('spi_progress', []);
    
    if (user) {
      try {
        const lessonsRef = collection(db, 'users', user.uid, 'vault', 'data', 'lessons');
        const lessonsSnap = await getDocs(lessonsRef);
        const batch = writeBatch(db);
        lessonsSnap.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        
        const vaultMetadataRef = doc(db, 'users', user.uid, 'vault', 'data');
        await setDoc(vaultMetadataRef, { mnemonics: {}, globalFlashcards: [], examHistory: [] });
      } catch (error) {
        console.error("Error clearing cloud vault:", error);
      }
    }

    setViewMode('dashboard');
    setShowPurgeConfirm(false);
  };

  const goToNextLesson = () => {
    const currentModule = modules[currentModuleIdx];
    if (currentLessonIdx < currentModule.lessons.length - 1) {
      setCurrentLessonIdx(prev => prev + 1);
    } else if (currentModuleIdx < modules.length - 1) {
      setCurrentModuleIdx(prev => prev + 1);
      setCurrentLessonIdx(0);
    }
    // Target the specific masterclass container first, then fallback to main
    const lessonContainer = document.getElementById('masterclass-scroll-container') || document.querySelector('main.overflow-y-auto');
    lessonContainer?.scrollTo({ top: 0, behavior: 'instant' });
  };

  const goToPrevLesson = () => {
    if (currentLessonIdx > 0) {
      setCurrentLessonIdx(prev => prev - 1);
    } else if (currentModuleIdx > 0) {
      const prevModuleIdx = currentModuleIdx - 1;
      setCurrentModuleIdx(prevModuleIdx);
      setCurrentLessonIdx(modules[prevModuleIdx].lessons.length - 1);
    }
    const lessonContainer = document.getElementById('masterclass-scroll-container') || document.querySelector('main.overflow-y-auto');
    lessonContainer?.scrollTo({ top: 0, behavior: 'instant' });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'masterclass' || loadingAI || audioLoading || briefingOpen || commandPaletteOpen) return;
      if (e.key === 'ArrowRight' && !e.ctrlKey && !e.metaKey) {
        goToNextLesson();
      } else if (e.key === 'ArrowLeft' && !e.ctrlKey && !e.metaKey) {
        goToPrevLesson();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, loadingAI, audioLoading, briefingOpen, commandPaletteOpen, goToNextLesson, goToPrevLesson]);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const createWavBlobUrlFromBase64 = (b64: string): string => {
    const binary = atob(b64);
    const length = binary.length;
    const view = new DataView(new ArrayBuffer(44 + length));
    
    const writeString = (offset: number, string: string) => { 
        for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i)); 
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    writeString(8, 'WAVE');
    
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // 1 channel
    view.setUint32(24, 24000, true); // 24kHz
    view.setUint32(28, 48000, true); // byteRate
    view.setUint16(32, 2, true); // blockAlign
    view.setUint16(34, 16, true); // 16 bitsPerSample
    
    writeString(36, 'data');
    view.setUint32(40, length, true);
    
    for (let i = 0; i < length; i++) {
        view.setUint8(44 + i, binary.charCodeAt(i));
    }
    
    const blob = new Blob([view.buffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  };

  const startNarration = async () => {
    if (audioLoading || audioUrl) return;
    setAudioLoading(true);
    
    const personas: Persona[] = ['Harvey', 'Professor', 'Analyst'];
    const nextIdx = (personas.indexOf(currentPersona) + 1) % personas.length;
    const nextPersona = personas[nextIdx];
    setCurrentPersona(nextPersona);

    try {
      const audioData = await generateTTS(lectureScript, nextPersona);
      if (audioData) {
        const url = createWavBlobUrlFromBase64(audioData);
        setAudioUrl(url);
      }
    } catch (e) { 
      console.error(e); 
    } finally { 
      setAudioLoading(false); 
    }
  };

  const handleChoice = (idx: number) => {
    setSelectedChoice(idx);
  };

  const markComplete = () => {
    // Award Base Rewards
    awardXP(200);
    awardCoins(20);

    // Update Quests
    updateQuestProgress('daily_lesson', 1);

    // Update History & State
    setCompletedLessons(prev => new Set([...prev, lessonKey]));
    setUserStats(prev => {
      const today = new Date().toDateString();
      const history = [...prev.history];
      const todayIdx = history.findIndex(h => h.date === today);
      if (todayIdx >= 0) {
        history[todayIdx] = { ...history[todayIdx], lessonsCompleted: history[todayIdx].lessonsCompleted + 1 };
      }
      return { ...prev, lastActive: Date.now(), history };
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setViewMode('dashboard');
  };

  const renderLessonLab = () => {
    const id = currentLesson.id;
    if (id.includes('metric') || id.includes('log') || id.includes('sci')) return <MathematicsLab topic={currentLesson.title} />;
    if (id.includes('waves') || id.includes('params')) return <PhysicsLab topic={currentLesson.title} hotMicEnabled={hotMicEnabled} />;
    if (id.includes('atten') || id.includes('absorption') || id.includes('refl') || id.includes('media')) return (
      <div className="space-y-8">
        <AttenuationLab topic={currentLesson.title} />
        <PhysicsCalculator defaultTab="snell" />
      </div>
    );
    if (id.includes('transducer') || id.includes('array') || id.includes('pzt') || id.includes('beam')) return <TransducerLab />;
    if (id.includes('pulse') || id.includes('13us')) return (
      <div className="space-y-8">
        <PulsedWaveLab />
        <PhysicsCalculator defaultTab="13us" />
      </div>
    );
    if (id.includes('doppler')) return <DopplerLab hotMicEnabled={hotMicEnabled} />;
    if (id.includes('artifact')) return <ArtifactExplorer />;
    if (id.includes('res')) return (
      <div className="space-y-8">
        <ResolutionLab />
        <PhysicsCalculator defaultTab="axial" />
      </div>
    );
    if (id.includes('safety') || id.includes('bioeffects')) return <SafetyLab />;
    if (id.includes('hemo') || id.includes('flow') || id.includes('bernoulli')) return <HemodynamicsLab />;
    if (id.includes('receiver') || id.includes('instrument') || id.includes('dynamic') || id.includes('storage')) return <InstrumentationLab />;
    if (id.includes('harmonics') || id.includes('contrast') || id.includes('elasto') || id.includes('fusion')) return <AdvancedImagingLab topic={currentLesson.title} />;
    return null;
  };

  const getLessonVisual = (index: number) => {
    const id = currentLesson.id;
    const seeds = [
      'ultrasound', 'physics-waves', 'medical-imaging', 'frequency-signal', 'science-nodes', 
      'quantum-data', 'neural-network', 'plasma-energy', 'cyber-medical', 'bio-mechanics'
    ];
    const seed = seeds[(id.length + index) % seeds.length];
    // Using a more structured prompt-like seed
    return `https://picsum.photos/seed/harvey-${seed}/1280/720`;
  };

  const renderLecture = () => {
    if (blocks.length === 0 && !loadingAI) {
      return (
        <div className="flex flex-col items-center justify-center p-20 text-center space-y-6 glass-panel rounded-[3rem] border border-rose-500/30">
          <ZapOff size={48} className="text-rose-500" />
          <h3 className="text-2xl font-black uppercase italic text-rose-500 tracking-tighter">Synthesis Failed</h3>
          <p className="text-rose-400/70 font-bold max-w-md">The neural script for this unit could not be reconstructed. This is often due to a temporary link failure.</p>
          <button onClick={() => fetchContent(true)} className="px-8 py-4 bg-rose-500 text-white rounded-full font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl">
            Re-Attempt Synthesis
          </button>
        </div>
      );
    }

    const blockTitles = [
      "Quantifying Effort",
      "The Promise",
      "The Roadmap",
      "Definitions",
      "Via Negativa",
      "Mnemonic Locker",
      "The Analogy",
      "Practical Workflow",
      "The Registry Trap",
      "Clinical Case Study",
      "Neural Alignment",
      "The Assessment"
    ];

    const blockIcons = [
      Database, Target, Map, BookOpen, ZapOff, Brain, Sparkles, Calculator, AlertTriangle, Microscope, Fingerprint, Trophy
    ];

    return (
      <div className="space-y-8 md:space-y-32 max-w-5xl mx-auto pb-40 relative px-4 md:px-0">
        <AnimatedLessonHeader 
          title={currentLesson.title} 
          moduleTitle={modules[currentModuleIdx].title} 
          weight={modules[currentModuleIdx].weight} 
        />

        {vault.lessons[lessonKey]?.imageUrl && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="w-full aspect-video rounded-[1.5rem] md:rounded-[6rem] overflow-hidden border-2 md:border-4 border-white/10 shadow-4xl mb-8 md:mb-40 group relative"
          >
            <img 
              src={vault.lessons[lessonKey].imageUrl} 
              alt={currentLesson.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 md:bottom-12 md:left-12 md:right-12 flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-6">
                <div className="p-2 md:p-4 bg-indigo-600 rounded-lg md:rounded-2xl text-white shadow-2xl shadow-indigo-500/40 border border-white/20">
                  <ImageIcon size={14} className="md:w-7 md:h-7" />
                </div>
                <div>
                  <p className="text-[6px] md:text-[12px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-indigo-400 mb-0.5 md:mb-1">Visual Heuristic</p>
                  <p className="text-sm md:text-4xl font-black text-white italic uppercase tracking-tighter text-gradient">Neural Synthesis Matrix</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <AnimatedExplainer topic={currentLesson.title} lessonId={currentLesson.id} />

        <div className="absolute left-[-2rem] md:left-[-5rem] top-0 bottom-40 w-1 bg-gradient-to-b from-indigo-500/40 via-white/5 to-transparent rounded-full hidden sm:block"></div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 }
            }
          }}
          className="space-y-12 md:space-y-24"
        >
          {blocks.slice(0, visibleBlocksCount).map((block, i) => {
            const Icon = blockIcons[i] || Sparkles;
            const Title = blockTitles[i] || "Unit Insight";
            const isSpecial = [0, 1, 4, 5, 6, 8, 9, 10].includes(i);
            const rawText = block.replace(/<[^>]*>?/gm, '').trim();

            return (
              <motion.div 
                key={i} 
                variants={{
                  hidden: { opacity: 0, x: -20, y: 20 },
                  visible: { opacity: 1, x: 0, y: 0 }
                }}
                transition={{ duration: 0.8 }}
                className="relative group lecture-block"
              >
              {/* Dynamic Neural Visualizer Injections */}
              {i === 3 && rawText.includes('=') && (
                <NeuralVisualizer 
                  type="formula" 
                  title="Mathematical Law" 
                  subtitle={rawText.split(/[.?!]/)[0]} 
                />
              )}
              
              {i === 8 && (
                <NeuralVisualizer 
                  type="registry_alert" 
                  title="Registry Trap Detected" 
                  subtitle={rawText.split(/[.?!]/)[0]} 
                />
              )}

              {i === 9 && (
                <NeuralVisualizer 
                  type="artifact" 
                  title="Clinical Case Simulation" 
                  subtitle="Procedural Decision Mapping" 
                />
              )}

              {/* Visual Interstitial */}
              {i === 1 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                  className="my-16 md:my-64 relative group/visual"
                >
                  <div className="absolute -inset-6 md:-inset-10 bg-indigo-500/10 blur-[60px] md:blur-[100px] rounded-full opacity-0 group-hover/visual:opacity-100 transition-opacity duration-1000" />
                  <div className="relative aspect-video md:aspect-[21/9] rounded-[1.5rem] md:rounded-[6rem] overflow-hidden border border-white/10 shadow-4xl group-hover:border-indigo-500/30 transition-colors duration-1000">
                    <img 
                      src={getLessonVisual(i)} 
                      alt="Neural Visualization" 
                      className="w-full h-full object-cover grayscale opacity-30 group-hover/visual:grayscale-0 group-hover/visual:opacity-100 transition-all duration-[2000ms] scale-110 group-hover/visual:scale-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute inset-0 neural-grid opacity-[0.05] group-hover/visual:opacity-[0.1] transition-opacity duration-1000" />
                    
                    <div className="absolute bottom-6 left-6 md:bottom-24 md:left-24 max-w-2xl">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <span className="text-[8px] md:text-[12px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-indigo-400 mb-2 md:mb-4 block">Neural Visualization Matrix</span>
                        <h4 className="text-xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-[0.9] mb-3 md:mb-6">
                          {currentLesson.title} <span className="text-indigo-500/50">Schematic</span>
                        </h4>
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="h-px w-8 md:w-12 bg-indigo-500" />
                          <span className="text-[7px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400">Heuristic Reconstruction Active</span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}

              {i === 3 && renderLessonLab() && (
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="my-12 md:my-48 relative"
                >
                  <div className="absolute -inset-4 bg-indigo-500/5 blur-3xl rounded-[2rem] md:rounded-[4rem] pointer-events-none" />
                  <div className="mb-6 md:mb-12 flex items-center gap-4 md:gap-6 px-4 md:px-0">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                    <div className="flex flex-col items-center gap-1 md:gap-2 text-center">
                      <span className="text-[8px] md:text-[12px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-indigo-400">Interactive Heuristic Lab</span>
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-widest text-emerald-500/60">System Online</span>
                      </div>
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
                  </div>
                  <div className="animate-in zoom-in duration-1000 overflow-x-hidden tech-card rounded-[1.5rem] md:rounded-[4rem] border border-white/10 shadow-4xl p-1 md:p-2 bg-slate-950/50">
                    {renderLessonLab()}
                  </div>
                </motion.div>
              )}

              <div className="absolute left-[-2.3rem] md:left-[-5.3rem] top-2 w-4 h-4 rounded-full bg-black border-2 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] hidden sm:block z-10 group-hover:scale-125 transition-transform duration-500">
                <div className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-20" />
              </div>
             <div className={`lecture-content transition-all duration-1000
                ${isSpecial ? 'neural-block group shadow-2xl relative overflow-hidden group/special' : 'px-4 md:px-0'}`}>
                
                {isSpecial && (
                  <>
                    <div className="absolute inset-0 neural-grid opacity-[0.05] pointer-events-none" />
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-500/5 blur-[120px] rounded-full group-hover/special:bg-indigo-500/10 transition-all duration-1000" />
                  </>
                )}
                
                <div className={`micro-label mb-8 md:mb-16 flex items-center gap-4 md:gap-8 ${
                  i === 8 ? 'text-rose-400' : 
                  i === 9 ? 'text-emerald-400' : 
                  'text-indigo-400'
                }`}>
                  <div className="p-2 md:p-5 bg-white/5 rounded-2xl md:rounded-[2rem] border border-white/10 shadow-2xl group-hover:rotate-12 transition-transform duration-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <Icon size={16} className="md:w-8 md:h-8 relative z-10" />
                  </div> 
                  <span className="opacity-80 group-hover:opacity-100 transition-opacity italic font-display font-black text-xs md:text-sm">{Title}</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                {i === 5 ? (
                  <NeuralVisualizer 
                    type="formula" 
                    title="Neural Mnemonic" 
                    subtitle={block.replace(/<[^>]*>?/gm, '').trim()} 
                  />
                ) : (
                  <div className="relative z-10">
                    <div dangerouslySetInnerHTML={{ __html: block }} />
                  </div>
                )}
             </div>
             

             {i === visibleBlocksCount - 1 && i === blocks.length - 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-24 md:mt-48"
                >
                  <RegistryReadyDrill topic={currentLesson.title} />
                </motion.div>
              )}

             {i === visibleBlocksCount - 1 && i < blocks.length - 1 && (
               <div className="mt-12 md:mt-20 flex flex-col items-center">
                  <div className="h-12 md:h-20 w-1 bg-gradient-to-b from-indigo-500/50 to-transparent mb-6 md:mb-8"></div>
                  <div className="flex gap-8 md:gap-16">
                    <button onClick={() => setVisibleBlocksCount(v => v + 1)} className="group flex flex-col items-center gap-4 focus:outline-none">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">Internalize & Proceed</span>
                      <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-white/5 border-4 border-white/10 flex items-center justify-center group-hover:border-indigo-500 group-hover:scale-110 transition-all shadow-xl">
                        <ArrowDown size={32} className="text-indigo-400 group-hover:translate-y-2 transition-transform" />
                      </div>
                    </button>

                    {(userStats.activeBoosts?.['neural_surge'] || 0) > 0 && (
                      <button 
                        onClick={() => {
                          setVisibleBlocksCount(v => Math.min(v + 2, blocks.length));
                          setUserStats(prev => ({
                            ...prev,
                            activeBoosts: { ...prev.activeBoosts, 'neural_surge': (prev.activeBoosts?.['neural_surge'] || 0) - 1 }
                          }));
                        }}
                        className="group flex flex-col items-center gap-4 focus:outline-none"
                      >
                        <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest group-hover:text-purple-600 transition-colors">Neural Surge</span>
                        <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-purple-50 border-4 border-purple-100 flex items-center justify-center group-hover:border-purple-600 group-hover:scale-110 transition-all shadow-xl">
                          <Rocket size={32} className="text-purple-600 group-hover:-translate-y-2 transition-transform" />
                        </div>
                      </button>
                    )}
                  </div>
               </div>
             )}
          </motion.div>
        );
      })}
      </motion.div>

        {visibleBlocksCount === blocks.length && (
          <div className="mt-12 md:mt-32 space-y-16 md:space-y-40 border-t border-white/10 pt-12 md:pt-32 animate-in fade-in duration-1000">
             {/* Neural Synthesis Summary */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="tech-card rounded-[3rem] md:rounded-[6rem] p-10 md:p-24 border border-indigo-500/20 shadow-4xl relative overflow-hidden group/summary"
             >
               <div className="absolute inset-0 neural-grid opacity-[0.05] pointer-events-none" />
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover/summary:opacity-100 transition-opacity duration-1000" />
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient bg-[length:200%_100%]" />
               
               <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-20">
                 <div className="w-32 h-32 md:w-56 md:h-56 bg-indigo-600 rounded-[2rem] md:rounded-[4rem] flex items-center justify-center text-white shadow-3xl shadow-indigo-500/40 border border-white/20 group-hover/summary:rotate-6 transition-transform duration-700 relative overflow-hidden">
                   <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/summary:opacity-100 transition-opacity" />
                   <Trophy size={64} className="md:w-[100px] md:h-[100px] relative z-10" />
                 </div>
                 <div className="text-center md:text-left space-y-6 md:space-y-10 flex-1">
                   <div>
                     <p className="text-[10px] md:text-[14px] font-black uppercase tracking-[0.5em] text-indigo-400 mb-4">Unit Synthesis Complete</p>
                     <h3 className="text-4xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-[0.8] glitch-text" data-text="Mastery Achieved">
                       Mastery <span className="text-gradient">Achieved</span>
                     </h3>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
                     {[
                       { label: "Neural Retention", value: "98 PERCENT", icon: Brain },
                       { label: "Registry Alignment", value: "Optimal", icon: Target },
                       { label: "Synthesis Depth", value: "Level 4", icon: Layers },
                       { label: "Unit XP", value: "+1,250", icon: Zap },
                     ].map((stat, idx) => (
                       <div key={idx} className="flex items-center gap-4 md:gap-6 group/stat">
                         <div className="p-2 md:p-4 bg-white/5 rounded-xl border border-white/10 group-hover/stat:bg-indigo-500/20 transition-colors border-b-2 border-transparent group-hover/stat:border-indigo-500/50">
                           <stat.icon size={16} className="md:w-6 md:h-6 text-indigo-400" />
                         </div>
                         <div>
                           <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</p>
                           <p className="text-lg md:text-2xl font-black text-white italic">{stat.value}</p>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
             </motion.div>

             <div className="space-y-10 md:space-y-16">
                <div className="text-center space-y-4 md:space-y-6">
                    <div className="p-4 md:p-6 bg-indigo-600 rounded-2xl md:rounded-3xl w-fit mx-auto text-white shadow-2xl mb-6 md:mb-12 border border-white/20"><Target size={32} className="md:w-12 md:h-12" /></div>
                    <h3 className="text-2xl md:text-7xl font-black tracking-tighter uppercase italic text-gradient">Proof of Learning</h3>
                    <p className="text-slate-500 font-bold max-w-lg mx-auto uppercase text-[8px] md:text-[12px] tracking-[0.3em] md:tracking-[0.4em] leading-relaxed">Demonstrate your education through these determination paths.</p>
                </div>
                <div className="grid gap-4 md:gap-10">
                    {masteryChoices.map((choice, idx) => (
                    <button key={idx} onClick={() => handleChoice(idx)} disabled={selectedChoice !== null}
                        className={`w-full p-6 md:p-16 rounded-[1.5rem] md:rounded-[4rem] border-2 md:border-4 transition-all text-left group relative overflow-hidden
                        ${selectedChoice === idx 
                            ? choice.isLogical ? 'bg-emerald-500/10 border-emerald-500' : 'bg-rose-500/10 border-rose-500'
                            : 'glass-card border-white/5 hover:border-indigo-500/50 hover:shadow-4xl hover:-translate-y-2'}`}>
                        <div className="absolute inset-0 neural-grid opacity-5 pointer-events-none" />
                        <div className="flex items-center justify-between mb-4 md:mb-6 relative z-10">
                          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Heuristic Path {idx + 1}</span>
                          {selectedChoice === idx && (choice.isLogical ? <CheckCircle2 className="text-emerald-500" size={18} /> : <AlertCircle className="text-rose-500" size={18} />)}
                        </div>
                        <p className={`text-base md:text-3xl font-black leading-tight relative z-10 ${selectedChoice === idx ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>{choice.text}</p>
                        {selectedChoice === idx && (
                          <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 md:mt-10 text-xs md:text-lg font-bold text-slate-400 italic relative z-10 border-t border-white/10 pt-4 md:pt-6"
                          >
                            Result: {choice.outcome}
                          </motion.p>
                        )}
                    </button>
                    ))}
                </div>
             </div>

             {currentQuiz.length > 0 && (
               <div className="space-y-10 md:space-y-16 p-5 md:p-20 glass-panel rounded-[1.5rem] md:rounded-[5rem] text-white shadow-4xl relative overflow-hidden border border-white/10">
                  <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                      <div className="p-1.5 md:p-2 bg-indigo-600 rounded-lg text-white"><Activity size={16} className="md:w-5 md:h-5" /></div>
                      <h4 className="text-[8px] md:text-sm font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-indigo-400">Registry Assessment</h4>
                    </div>
                    <h3 className="text-2xl md:text-6xl font-black tracking-tighter italic uppercase mb-8 md:mb-20 text-gradient">Submit Your Logic Map</h3>
                    
                    <div className="space-y-10 md:space-y-16">
                       {currentQuiz.map((q, qIdx) => (
                         <div key={qIdx} className="space-y-6 md:space-y-12">
                            <div className="flex gap-4 md:gap-6 items-start">
                              <span className="text-3xl md:text-6xl font-black text-indigo-500/30 font-mono leading-none">{String(qIdx + 1).padStart(2, '0')}</span>
                              <p className="text-lg md:text-3xl font-black text-slate-100 leading-tight pt-1 md:pt-2">{q.question}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 pl-0 md:pl-24">
                               {q.options.map((opt, oIdx) => {
                                 const isSelected = quizAnswers[qIdx] === oIdx;
                                 const isCorrect = oIdx === q.correctIndex;
                                 return (
                                   <button 
                                     key={oIdx}
                                     onClick={() => setQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                                     disabled={showQuizResults}
                                     className={`p-4 md:p-8 rounded-2xl md:rounded-3xl border-2 text-left transition-all font-black text-[9px] md:text-xs uppercase tracking-widest relative overflow-hidden
                                        ${showQuizResults 
                                          ? isCorrect ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' : isSelected ? 'bg-rose-500 border-rose-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]' : 'bg-white/5 border-white/10 text-slate-500'
                                          : isSelected ? 'bg-indigo-600 border-indigo-500 text-white shadow-2xl scale-[1.02]' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20'
                                        }`}
                                   >
                                      {opt}
                                   </button>
                                 );
                               })}
                            </div>
                            {showQuizResults && (
                               <p className="text-[9px] md:text-xs font-bold text-indigo-300 italic p-3 md:p-4 bg-white/5 rounded-xl border border-white/5 animate-in fade-in duration-700">
                                 Logic: {q.explanation}
                                </p>
                            )}
                         </div>
                       ))}
                    </div>

                        {!showQuizResults ? (
                          <button 
                            onClick={() => {
                              setShowQuizResults(true);
                              let correct = Object.entries(quizAnswers).filter(([idx, ans]) => currentQuiz[parseInt(idx)].correctIndex === ans).length;
                              
                              if (correct < currentQuiz.length && (userStats.activeBoosts?.['logic_shield'] || 0) > 0) {
                                correct++;
                                setUserStats(prev => ({
                                  ...prev,
                                  activeBoosts: { ...prev.activeBoosts, 'logic_shield': (prev.activeBoosts?.['logic_shield'] || 0) - 1 }
                                }));
                              }

                              const isPerfect = correct === currentQuiz.length;
                              awardXP(correct * 50);
                              awardCoins(correct * 5);
                              if (isPerfect) {
                                updateQuestProgress('perfect_score', 1);
                                awardXP(100);
                              }
                              updateQuestProgress('quiz_master', 1);
                              setUserStats(prev => ({ ...prev, totalQuizzesPassed: prev.totalQuizzesPassed + 1 }));
                              if (userStats.totalQuizzesPassed + 1 >= 5) unlockBadge('quiz_whiz');
                            }}
                            disabled={Object.keys(quizAnswers).length < currentQuiz.length}
                            className="mt-10 md:mt-16 w-full py-4 md:py-6 bg-white text-slate-900 rounded-full font-black uppercase text-[9px] md:text-xs tracking-widest hover:scale-105 transition-all disabled:opacity-30 shadow-2xl"
                          >
                            Finalize Unit Synthesis
                          </button>
                        ) : (
                      <div className="mt-10 md:mt-16 text-center animate-in zoom-in duration-500">
                         <div className="p-6 md:p-8 bg-emerald-500/20 rounded-2xl md:rounded-3xl border border-emerald-500/30">
                            <CheckCircle2 size={32} className="md:w-12 md:h-12 text-emerald-500 mx-auto mb-3 md:mb-4" />
                            <h4 className="text-lg md:text-2xl font-black uppercase italic">Sequence Mastered</h4>
                            <p className="text-slate-400 text-[9px] md:text-sm mt-1.5 md:mt-2">You have officially navigated the heuristics of {currentLesson.title}.</p>
                            <div className="mt-5 md:mt-6 flex items-center justify-center gap-3 md:gap-4">
                              <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-indigo-600 rounded-xl md:rounded-2xl text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                                <Star size={10} className="md:w-3 md:h-3" /> +250 XP
                              </div>
                              <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-amber-500 rounded-xl md:rounded-2xl text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                                <Coins size={10} className="md:w-3 md:h-3" /> +25 Coins
                              </div>
                            </div>
                            <button 
                              onClick={() => {
                                setCompletedLessons(prev => new Set([...prev, lessonKey]));
                                awardXP(250);
                                awardCoins(25);
                                updateQuestProgress('daily_lesson', 1);
                                setUserStats(prev => ({ ...prev, totalLessonsCompleted: prev.totalLessonsCompleted + 1 }));
                                if (userStats.totalLessonsCompleted + 1 === 1) unlockBadge('first_lesson');
                                setViewMode('dashboard');
                              }}
                              className="mt-6 md:mt-8 w-full py-3.5 md:py-4 bg-emerald-500 text-white rounded-full font-black uppercase text-[9px] md:text-[10px] tracking-widest hover:bg-emerald-600 transition-all shadow-xl"
                            >
                              Return to Command Center
                            </button>
                         </div>
                      </div>
                    )}
                    <div className="mt-24 pt-12 border-t border-white/5 flex items-center justify-between">
                      <button 
                        onClick={goToPrevLesson}
                        className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-all group"
                      >
                        <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:bg-white/10 transition-colors">
                          <ChevronRight size={18} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                        </div>
                        Previous Unit
                      </button>
                      <button 
                        onClick={goToNextLesson}
                        className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.3em] text-indigo-400 hover:text-indigo-300 transition-all group"
                      >
                        Next Unit
                        <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    </div>
                  </div>
               </div>
             )}
          </div>
        )}
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <div className={`min-h-screen ${theme === 'light' ? 'light bg-slate-50 text-slate-900' : 'bg-[#0a0502] text-slate-100'} flex overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-white relative transition-colors duration-500`}>
      <div className="atmosphere" />
      <div className="noise-overlay" />
      <div className="scanline" />
      <div className="fixed inset-0 neural-grid opacity-[0.03] pointer-events-none" />
      <Toaster position="top-right" theme={theme} richColors closeButton />
      <AnimatePresence>
        {showPurgeConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[3rem] p-12 max-w-xl w-full text-center space-y-8 shadow-4xl"
            >
              <div className="w-24 h-24 bg-rose-100 text-rose-500 rounded-3xl flex items-center justify-center mx-auto">
                <Trash2 size={48} />
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-black tracking-tighter italic uppercase text-slate-950">Purge Archives?</h3>
                <p className="text-slate-500 font-medium">This will permanently delete all neural syncs, mnemonics, and progress. This action cannot be reversed.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setShowPurgeConfirm(false)}
                  className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-full font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Abort
                </button>
                <button 
                  onClick={clearVault}
                  className="flex-1 py-5 bg-rose-500 text-white rounded-full font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl"
                >
                  Confirm Purge
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!appBooted && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="fixed inset-0 z-[1000] bg-slate-950 flex flex-col items-center justify-center text-white"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col items-center gap-8"
            >
              <div className="relative">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  className="w-32 h-32 md:w-48 md:h-48 rounded-full border-t-4 border-indigo-500 border-r-4 border-r-transparent"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-indigo-400 animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic">SPI MASTER</h1>
                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-slate-500">Neural Archives Initializing</p>
              </div>
              <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.5, ease: 'easeInOut' }}
                  className="h-full bg-indigo-500"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lessonBooting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-white/80 backdrop-blur-2xl flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              className="text-center space-y-6 max-w-md px-6"
            >
              <div className="p-6 bg-slate-950 rounded-3xl text-white inline-block shadow-2xl">
                <div className="flex gap-1 items-end h-8">
                  {[1,2,3,4].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ height: ['20%', '100%', '20%'] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      className="w-2 bg-indigo-500 rounded-full"
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Synchronizing Heuristics</h4>
                <p className="text-2xl md:text-4xl font-black tracking-tighter italic uppercase text-slate-950">{currentLesson.title}</p>
              </div>
              
              {fetchError && (
                <div className="mt-8 p-6 bg-rose-50 border-2 border-rose-100 rounded-2xl text-rose-600 animate-in fade-in slide-in-from-top-4">
                  <p className="text-xs font-bold italic mb-4">{fetchError}</p>
                  <button 
                    onClick={() => fetchContent(true)}
                    className="w-full py-3 bg-rose-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-rose-600 transition-all"
                  >
                    Force Re-Sync
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {sidebarOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[45] xl:hidden" onClick={() => setSidebarOpen(false)} />}
      
      <div className="atmosphere" />
      <div className="noise-overlay" />
      <div className="scanline" />

      {/* Hardware Rails */}
      <div className="fixed left-0 top-0 bottom-0 w-1 md:w-3 z-[100] bg-indigo-600/10 border-r border-white/5 pointer-events-none hidden xl:block">
        <div className="h-full w-full hardware-border opacity-20" />
      </div>

      <aside className={`fixed inset-y-0 left-0 xl:relative z-50 bg-[#080c14] border-r border-white/5 transition-all duration-700 flex flex-col h-screen overflow-hidden shadow-2xl ${sidebarOpen ? 'w-[85vw] sm:w-[400px] md:w-[450px]' : 'w-0 xl:w-[320px] md:w-[320px]'} ml-1 md:ml-3`}>
        <div className="absolute inset-0 hardware-border opacity-5 pointer-events-none" />
        <div className="p-5 md:p-10 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#080c14]/80 backdrop-blur-xl z-20 overflow-hidden">
          <div className="flex items-center gap-3 md:gap-4 group cursor-pointer" onClick={() => setViewMode('dashboard')}>
            <div className="bg-indigo-600 p-2.5 md:p-3 rounded-xl md:rounded-2xl shadow-2xl shadow-indigo-500/40 group-hover:scale-110 transition-transform duration-500 border border-white/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <Sparkles className="text-white w-5 h-5 md:w-8 md:h-8 relative z-10" />
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="font-black text-xl md:text-2xl tracking-tighter text-white italic leading-none truncate uppercase">Archives</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <span className="micro-label opacity-60">Neural v3.2</span>
              </div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="p-2.5 md:p-4 bg-white/5 rounded-xl md:rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/10 xl:hidden"><X size={20}/></button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 md:p-8 space-y-10 md:space-y-16 scrollbar-hide">
          <div className="space-y-4">
            <span className="micro-label px-4">The Logic Hub</span>
            <button onClick={() => { setViewMode('dashboard'); if(window.innerWidth < 1280) setSidebarOpen(false); }} className={`w-full p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] flex items-center gap-4 md:gap-6 transition-all font-black text-[10px] md:text-xs uppercase tracking-widest border border-transparent relative overflow-hidden group ${viewMode === 'dashboard' ? 'bg-white text-black shadow-2xl scale-[1.02] border-white' : 'text-slate-400 hover:bg-white/5 hover:border-white/10'}`}>
              <Home size={20} className={viewMode === 'dashboard' ? 'text-indigo-600' : 'group-hover:text-white transition-colors'}/> Performance
            </button>
            <button onClick={() => { setViewMode('roadmap'); if(window.innerWidth < 1280) setSidebarOpen(false); }} className={`w-full p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] flex items-center gap-4 md:gap-6 transition-all font-black text-[10px] md:text-xs uppercase tracking-widest border border-transparent relative overflow-hidden group ${viewMode === 'roadmap' ? 'bg-white text-black shadow-2xl scale-[1.02] border-white' : 'text-slate-400 hover:bg-white/5 hover:border-white/10'}`}>
              <Compass size={20} className={viewMode === 'roadmap' ? 'text-indigo-600' : 'group-hover:text-white transition-colors'}/> Registry Path
            </button>
            <button onClick={() => { setViewMode('forge'); if(window.innerWidth < 1280) setSidebarOpen(false); }} className={`w-full p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] flex items-center gap-4 md:gap-6 transition-all font-black text-[10px] md:text-xs uppercase tracking-widest border border-transparent relative overflow-hidden group ${viewMode === 'forge' ? 'bg-white text-black shadow-2xl scale-[1.02] border-white' : 'text-slate-400 hover:bg-white/5 hover:border-white/10'}`}>
              <Zap size={20} className={viewMode === 'forge' ? 'text-indigo-600' : 'group-hover:text-white transition-colors'}/> Neural Forge
            </button>
            <button onClick={() => { setViewMode('vault'); if(window.innerWidth < 1280) setSidebarOpen(false); }} className={`w-full p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] flex items-center gap-4 md:gap-6 transition-all font-black text-[10px] md:text-xs uppercase tracking-widest border border-transparent relative overflow-hidden group ${viewMode === 'vault' ? 'bg-white text-black shadow-2xl scale-[1.02] border-white' : 'text-slate-400 hover:bg-white/5 hover:border-white/10'}`}>
              <Database size={20} className={viewMode === 'vault' ? 'text-indigo-600' : 'group-hover:text-white transition-colors'}/> Archives
            </button>
            <button onClick={() => { setViewMode('labs'); if(window.innerWidth < 1280) setSidebarOpen(false); }} className={`w-full p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] flex items-center gap-4 md:gap-6 transition-all font-black text-[10px] md:text-xs uppercase tracking-widest border border-transparent relative overflow-hidden group ${viewMode === 'labs' ? 'bg-white text-black shadow-2xl scale-[1.02] border-white' : 'text-slate-400 hover:bg-white/5 hover:border-white/10'}`}>
              <Activity size={20} className={viewMode === 'labs' ? 'text-indigo-600' : 'group-hover:text-white transition-colors'}/> Interaction Lab
            </button>
            <button onClick={() => { setViewMode('streams'); if(window.innerWidth < 1280) setSidebarOpen(false); }} className={`w-full p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] flex items-center gap-4 md:gap-6 transition-all font-black text-[10px] md:text-xs uppercase tracking-widest border border-transparent relative overflow-hidden group ${viewMode === 'streams' ? 'bg-white text-black shadow-2xl scale-[1.02] border-white' : 'text-slate-400 hover:bg-white/5 hover:border-white/10'}`}>
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-0.5 bg-rose-500 rounded-full">
                <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                <span className="text-[6px] text-white">LIVE</span>
              </div>
              <Tv size={20} className={viewMode === 'streams' ? 'text-rose-600' : 'group-hover:text-white transition-colors'}/> Neural Cast
            </button>
            <button onClick={() => { setViewMode('srs'); if(window.innerWidth < 1280) setSidebarOpen(false); }} className={`w-full p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] flex items-center gap-4 md:gap-6 transition-all font-black text-[10px] md:text-xs uppercase tracking-widest border border-transparent relative overflow-hidden group ${viewMode === 'srs' ? 'bg-white text-black shadow-2xl scale-[1.02] border-white' : 'text-slate-400 hover:bg-white/5 hover:border-white/10'}`}>
              <Brain size={20} className={viewMode === 'srs' ? 'text-indigo-600' : 'group-hover:text-white transition-colors'}/> Neural SRS
            </button>
            <button onClick={() => { setViewMode('exam'); if(window.innerWidth < 1280) setSidebarOpen(false); }} className={`w-full p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] flex items-center gap-4 md:gap-6 transition-all font-black text-[10px] md:text-xs uppercase tracking-widest border border-transparent relative overflow-hidden group ${viewMode === 'exam' ? 'bg-white text-black shadow-2xl scale-[1.02] border-white' : 'text-slate-400 hover:bg-white/5 hover:border-white/10'}`}>
              <Trophy size={20} className={viewMode === 'exam' ? 'text-indigo-600' : 'group-hover:text-white transition-colors'}/> Mock Registry
            </button>
            <button onClick={() => { setViewMode('groups'); if(window.innerWidth < 1280) setSidebarOpen(false); }} className={`w-full p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] flex items-center gap-4 md:gap-6 transition-all font-black text-[10px] md:text-xs uppercase tracking-widest border border-transparent relative overflow-hidden group ${viewMode === 'groups' ? 'bg-white text-black shadow-2xl scale-[1.02] border-white' : 'text-slate-400 hover:bg-white/5 hover:border-white/10'}`}>
              <Users size={20} className={viewMode === 'groups' ? 'text-indigo-600' : 'group-hover:text-white transition-colors'}/> Study Groups
            </button>
            <button onClick={() => { setCommunityLibraryOpen(true); if(window.innerWidth < 1280) setSidebarOpen(false); }} className="w-full p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] flex items-center gap-4 md:gap-6 transition-all font-black text-[10px] md:text-xs uppercase tracking-widest border border-transparent relative overflow-hidden group text-indigo-400 hover:bg-white/5 hover:border-indigo-500/10">
              <ImageIcon size={20} className="group-hover:text-white transition-colors"/> Community Library
            </button>
            <button onClick={() => { setViewMode('buildplan'); if(window.innerWidth < 1280) setSidebarOpen(false); }} className={`w-full p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] flex items-center gap-4 md:gap-6 transition-all font-black text-[10px] md:text-xs uppercase tracking-widest border border-transparent relative overflow-hidden group ${viewMode === 'buildplan' ? 'bg-white text-black shadow-2xl scale-[1.02] border-white' : 'text-slate-400 hover:bg-white/5 hover:border-white/10'}`}>
              <Rocket size={20} className={viewMode === 'buildplan' ? 'text-indigo-600' : 'group-hover:text-white transition-colors'}/> Build Plan
            </button>
          </div>

          <div className="space-y-4">
            <span className="micro-label px-4">Advancement</span>
            <button onClick={() => { setViewMode('profile'); if(window.innerWidth < 1280) setSidebarOpen(false); }} className={`w-full p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] flex items-center gap-4 transition-all font-black text-[10px] uppercase tracking-widest border border-transparent ${viewMode === 'profile' ? 'bg-white text-black shadow-2xl scale-[1.02] border-white' : 'text-slate-400 hover:bg-white/5 hover:border-white/10'}`}><User size={18}/> Profile</button>
            <button onClick={() => { setViewMode('achievements'); if(window.innerWidth < 1280) setSidebarOpen(false); }} className={`w-full p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] flex items-center gap-4 transition-all font-black text-[10px] uppercase tracking-widest border border-transparent ${viewMode === 'achievements' ? 'bg-white text-black shadow-2xl scale-[1.02] border-white' : 'text-slate-400 hover:bg-white/5 hover:border-white/10'}`}><Trophy size={18}/> Vault</button>
            <button onClick={() => { setViewMode('analytics'); if(window.innerWidth < 1280) setSidebarOpen(false); }} className={`w-full p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] flex items-center gap-4 transition-all font-black text-[10px] uppercase tracking-widest border border-transparent ${viewMode === 'analytics' ? 'bg-white text-black shadow-2xl scale-[1.02] border-white' : 'text-slate-400 hover:bg-white/5 hover:border-white/10'}`}><BarChart3 size={18}/> Analytics</button>
            <button onClick={() => { setViewMode('leaderboard'); if(window.innerWidth < 1280) setSidebarOpen(false); }} className={`w-full p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] flex items-center gap-4 transition-all font-black text-[10px] uppercase tracking-widest border border-transparent ${viewMode === 'leaderboard' ? 'bg-white text-black shadow-2xl scale-[1.02] border-white' : 'text-slate-400 hover:bg-white/5 hover:border-white/10'}`}><ListOrdered size={18}/> Leaderboard</button>
            <button onClick={() => { setViewMode('settings'); if(window.innerWidth < 1280) setSidebarOpen(false); }} className={`w-full p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] flex items-center gap-4 transition-all font-black text-[10px] uppercase tracking-widest border border-transparent ${viewMode === 'settings' ? 'bg-white text-black shadow-2xl scale-[1.02] border-white' : 'text-slate-400 hover:bg-white/5 hover:border-white/10'}`}><SettingsIcon size={18}/> Settings</button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Neural Link</span>
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-6" />
            </div>
            {user ? (
              <div className="p-6 bg-[#0a0c10] rounded-[2.5rem] border border-white/5 space-y-8 relative overflow-hidden group/link tech-card">
                <div className="absolute inset-0 atmosphere opacity-40 pointer-events-none" />
                <div className="flex items-center gap-6 relative z-10">
                  <div className="relative">
                    <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-16 h-16 rounded-2xl border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.2)] group-hover/link:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-lg border-[3px] border-[#0a0c10] animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-white truncate italic tracking-tighter uppercase">{user.displayName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="led-status bg-indigo-500 text-indigo-500" />
                      <span className="hardware-label text-indigo-400">Registry Verified</span>
                    </div>
                  </div>
                </div>
                <button onClick={handleSignOut} className="w-full py-5 bg-white/5 text-slate-400 border border-white/5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-500/20 hover:text-rose-500 transition-all relative z-10">Sever Link</button>
              </div>
            ) : (
              <button onClick={handleSignIn} className="w-full p-8 bg-indigo-600 text-white rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-indigo-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                <ShieldCheck size={24} /> Establish Link
              </button>
            )}
          </div>

          <div className="space-y-10 md:space-y-14 py-8">
            <button onClick={() => { setRadioOpen(true); if(window.innerWidth < 1280) setSidebarOpen(false); }} className={`w-full p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] flex items-center gap-4 md:gap-6 transition-all font-black text-[10px] md:text-xs uppercase tracking-widest border border-transparent relative overflow-hidden group ${radioOpen ? 'bg-white text-black shadow-2xl scale-[1.02] border-white' : 'text-slate-400 hover:bg-white/5 hover:border-white/10'}`}>
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500 rounded-full">
                <div className="w-1 h-1 rounded-full bg-white animate-pulse shadow-[0_0_5px_white]" />
                <span className="text-[6px] text-white">LIVE</span>
              </div>
              <Music size={20} className={radioOpen ? 'text-indigo-600' : 'group-hover:text-white transition-colors'}/> Neural Radio
            </button>

             <div className="px-8 flex items-center gap-4">
               <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
               <span className="micro-label opacity-40">Neural Units</span>
               <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
             </div>
             {modules.map((mod, mIdx) => (
               <div key={mIdx} className="space-y-4 px-4">
                  <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl bg-gradient-to-br ${mod.color} text-white shadow-xl shadow-indigo-500/10 border border-white/10 relative overflow-hidden group/mod cursor-default`}>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/mod:opacity-100 transition-opacity" />
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                      <mod.icon size={64} />
                    </div>
                    <mod.icon size={18} className="relative z-10" />
                    <span className="text-[10px] font-black uppercase tracking-widest italic relative z-10">{mod.title}</span>
                  </div>
                  <div className="pl-4 space-y-1.5 border-l border-white/5 ml-8">
                    {mod.lessons.map((les, lIdx) => {
                      const isActive = mIdx === currentModuleIdx && lIdx === currentLessonIdx && viewMode === 'masterclass';
                      const isDone = completedLessons.has(`${mIdx}-${lIdx}`);
                      return (
                        <button key={`${mIdx}-${lIdx}`} onClick={() => { setCurrentModuleIdx(mIdx); setCurrentLessonIdx(lIdx); setViewMode('masterclass'); if(window.innerWidth < 1280) setSidebarOpen(false); }} 
                          className={`w-full text-left px-5 py-3 md:py-3.5 rounded-xl flex items-center justify-between transition-all group border border-transparent relative overflow-hidden ${isActive ? 'bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.3)] translate-x-2' : 'text-slate-400 hover:bg-white/5 hover:border-white/5'}`}>
                          {isActive && <motion.div layoutId="active-pill" className="absolute inset-0 bg-white" />}
                          <div className="flex items-center gap-4 truncate relative z-10">
                             <span className={`font-mono text-[9px] ${isActive ? 'text-black/40' : 'opacity-30'} group-hover:opacity-100 transition-opacity`}>{(lIdx + 1).toString().padStart(2, '0')}</span>
                             {isDone ? <CheckCircle size={14} className={isActive ? 'text-indigo-600' : 'text-emerald-400'}/> : <Circle size={14} className="opacity-20"/>}
                             <span className={`text-[10px] md:text-[11px] uppercase tracking-wide truncate ${isActive ? 'font-black' : 'font-bold'}`}>{les.title}</span>
                          </div>
                          {isActive && <ChevronRight size={12} className="relative z-10 text-black/40" />}
                        </button>
                      );
                    })}
                  </div>
               </div>
             ))}
          </div>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto relative flex flex-col scrollbar-hide pb-24 xl:pb-0 ml-0 xl:ml-0">
        {/* Hardware Status Rail - Top */}
        <div className="fixed top-0 left-0 right-0 h-1 md:h-2 bg-indigo-500/10 z-[100] pointer-events-none">
          <motion.div 
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,1)]" 
            style={{ width: `${progress}%` }} 
          />
        </div>

        <header className="sticky top-0 z-40 bg-slate-950/60 backdrop-blur-3xl border-b border-white/5 px-4 md:px-8 xl:px-12 py-3 md:py-6 flex items-center justify-between shadow-2xl hardware-border">
          <div className="flex items-center gap-2 md:gap-8">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="p-2.5 md:p-4 border border-white/10 rounded-2xl bg-white/5 text-white shadow-lg hover:bg-white/10 transition-all group">
                <Menu size={18} className="group-hover:rotate-90 transition-transform duration-500" />
              </button>
            )}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.3em] mb-1">
                <button onClick={() => setViewMode('dashboard')} className="hover:text-white transition-colors">SPI MASTER</button>
                {viewMode !== 'dashboard' && (
                  <>
                    <ChevronRight size={10} className="opacity-30" />
                    <button onClick={() => setViewMode(viewMode === 'masterclass' ? 'roadmap' : 'dashboard')} className="hover:text-white transition-colors">
                      {viewMode === 'masterclass' ? 'REGISTRY PATH' : viewMode.toUpperCase()}
                    </button>
                  </>
                )}
                {viewMode === 'masterclass' && (
                  <>
                    <ChevronRight size={10} className="opacity-30" />
                    <span className="text-indigo-400 font-black tracking-tighter">UNIT {currentLessonIdx + 1} OF {modules[currentModuleIdx].lessons.length}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-4">
                <h2 className="text-[11px] md:text-[13px] font-black uppercase tracking-[0.3em] md:tracking-[0.6em] text-gradient italic border-b-2 md:border-b-4 border-indigo-600 pb-1 md:pb-2 truncate max-w-[120px] sm:max-w-none">
                   {viewMode === 'masterclass' ? currentLesson.title : viewMode === 'buildplan' ? 'BUILD PLAN' : viewMode.toUpperCase()}
                </h2>
                {viewMode === 'masterclass' && (
                  <div className="flex items-center gap-2 md:gap-4 ml-2">
                    <button onClick={goToPrevLesson} className="p-1.5 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all active:scale-90" title="Prev Unit (Left Arrow)"><ChevronLeft size={16}/></button>
                    <button onClick={goToNextLesson} className="p-1.5 bg-indigo-600/20 hover:bg-indigo-600 rounded-lg text-indigo-400 hover:text-white transition-all active:scale-90" title="Next Unit (Right Arrow)"><ChevronRight size={16}/></button>
                  </div>
                )}
                <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                  <div className="led-status bg-emerald-500 text-emerald-500 animate-pulse" />
                  <span className="hardware-label text-emerald-500 opacity-100 italic">Neural Active</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-6">
            <div className="hidden xl:flex items-center gap-10 mr-6">
              <div className="flex flex-col items-end">
                <span className="micro-label opacity-40">System Status</span>
                <span className="text-[11px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-emerald-500" /> Nominal
                </span>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div className="flex flex-col items-end">
                <span className="micro-label opacity-40">Neural Load</span>
                <span className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">12.4 GFLOPS</span>
              </div>
            </div>
            {user && (
              <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 mr-2 group cursor-default">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest group-hover:text-white transition-colors">Syncing Neural State</span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-2xl border border-white/10 shadow-inner">
              <button onClick={() => { setTutorOpen(!tutorOpen); }} className={`p-2.5 md:p-3.5 rounded-xl transition-all relative group ${tutorOpen ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:bg-white/5'}`}>
                <Brain size={18}/>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button onClick={() => { setCalculatorOpen(!calculatorOpen); }} className={`p-2.5 md:p-3.5 rounded-xl transition-all relative group ${calculatorOpen ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:bg-white/5'}`}>
                <Calculator size={18}/>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button onClick={() => { setRadioOpen(!radioOpen); }} className={`p-2.5 md:p-3.5 rounded-xl transition-all relative group ${radioOpen ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:bg-white/5'}`}>
                <Music size={18}/>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button onClick={() => { setBufferOpen(!bufferOpen); }} className={`p-2.5 md:p-3.5 rounded-xl transition-all relative group ${bufferOpen ? 'bg-white text-black shadow-xl' : 'text-slate-400 hover:bg-white/5'}`}>
                <BookMarked size={18}/>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
                className="p-2.5 md:p-3.5 rounded-xl transition-all relative group text-slate-400 hover:bg-white/5"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}
              </button>
            </div>
            <button onClick={() => { setLiveTutorOpen(true); }} className="btn-primary px-6 md:px-10 py-3 md:py-4 !rounded-2xl !text-[9px] md:!text-[11px]">
              <Mic size={16} /> <span className="hidden md:inline">Neural Interaction</span>
            </button>
          </div>
        </header>

        <div className="flex-1 flex flex-col xl:flex-row overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 md:p-8 xl:p-12 scrollbar-hide relative">
            {/* Scroll Progress Bar for Masterclass */}
            {viewMode === 'masterclass' && (
              <motion.div 
                className="fixed top-[60px] md:top-[105px] left-0 right-0 h-1 bg-indigo-600 z-50 origin-left shadow-[0_0_15px_rgba(99,102,241,0.8)]"
                style={{ scaleX: visibleBlocksCount / 12 }}
              />
            )}
            {viewMode === 'buildplan' ? (
              <BuildOutPlan 
                onStartLearning={() => setViewMode('dashboard')} 
                onViewRoadmap={() => setViewMode('roadmap')} 
              />
            ) : viewMode === 'vault' ? (
              <Archives 
                vault={vault} 
                onClearVault={() => setShowPurgeConfirm(true)} 
                onSelectLesson={(mIdx, lIdx) => {
                  setCurrentModuleIdx(mIdx);
                  setCurrentLessonIdx(lIdx);
                  setViewMode('masterclass');
                }}
                onEasterEgg={handleEasterEgg}
                onOpenRadio={() => setRadioOpen(true)}
                onTogglePin={handleTogglePin}
              />
            ) : viewMode === 'exam' ? (
              <MockRegistryExam 
                onComplete={(score) => {
                  awardXP(score * 10);
                  awardCoins(Math.floor(score / 2));
                  if (score >= 70) unlockBadge('quiz_whiz');
                }}
              />
            ) : viewMode === 'groups' ? (
              <StudyGroups user={user} />
            ) : viewMode === 'srs' ? (
              <NeuralSRS />
            ) : viewMode === 'labs' ? (
              <LabsHub onOpenRadio={() => setRadioOpen(true)} masteryData={masteryData} />
            ) : viewMode === 'forge' ? (
              <Forge onSaveArtifact={handleSaveForgeArtifact} />
            ) : viewMode === 'dashboard' ? (
              <div className="space-y-12 md:space-y-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 page-container py-12">
                 {/* Hero Section for Desktop */}
                 <div className="tech-card rounded-[3rem] md:rounded-[6rem] p-10 md:p-24 border border-white/5 relative overflow-hidden group/hero hardware-border">
                    <div className="absolute inset-0 atmosphere opacity-20" />
                    <div className="absolute inset-0 neural-grid opacity-[0.05]" />
                    <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                       <div className="space-y-8">
                          <div className="inline-flex items-center gap-4 px-6 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                             <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                             <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Neural Link Status: Optimal</span>
                          </div>
                          <h2 className="text-4xl md:text-9xl font-black text-white italic uppercase tracking-tighter leading-[0.8] drop-shadow-2xl">
                             Master the <br/> <span className="text-gradient-vibrant">Physics</span>
                          </h2>
                          <p className="text-slate-400 text-sm md:text-xl font-bold uppercase tracking-[0.2em] md:tracking-[0.4em] leading-relaxed max-w-xl opacity-60">
                             Welcome back, {user?.displayName?.split(' ')[0] || 'Aspirant'}. Your registry alignment is at {Math.round(progress)}%. Accessing cognitive archives...
                          </p>
                          <div className="flex gap-6">
                             <button onClick={() => setViewMode('roadmap')} className="btn-primary">Initialize Pathway <ArrowRight size={20}/></button>
                             <button onClick={() => setBriefingOpen(true)} className="btn-secondary">View Pulse <Activity size={20}/></button>
                          </div>
                       </div>
                       <div className="hidden lg:block relative">
                          <div className="absolute -inset-20 bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
                          <div className="blueprint-card p-12 aspect-square flex items-center justify-center transform rotate-6 hover:rotate-0 transition-transform duration-1000 border-indigo-500/10">
                             <Brain size={300} className="text-indigo-500/20 animate-pulse" />
                             <div className="absolute inset-x-0 bottom-0 p-8 border-t border-indigo-500/10">
                                <div className="flex justify-between items-center">
                                   <div className="space-y-1">
                                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Cognitive Load</p>
                                      <p className="text-xl font-black text-indigo-400 font-mono">2.44 TB/s</p>
                                   </div>
                                   <Zap className="text-amber-500" size={32} />
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 md:gap-12">
                    <div className="sm:col-span-2 p-8 md:p-16 bg-indigo-600 rounded-[3rem] md:rounded-[5.5rem] text-white shadow-4xl relative overflow-hidden group border-4 border-white/10 hover:scale-[1.01] transition-transform duration-500 hardware-border">
                       <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-transparent to-transparent opacity-50" />
                       <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
                       <motion.div 
                         animate={{ opacity: [0.1, 0.3, 0.1] }}
                         transition={{ duration: 4, repeat: Infinity }}
                         className="absolute inset-0 bg-indigo-500/10 blur-[100px] pointer-events-none"
                       />
                       <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-4 md:mb-6">
                            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md"><Brain size={16} className="text-white" /></div>
                            <h4 className="micro-label text-white/60">Neural Integration Matrix</h4>
                          </div>
                          <div className="flex items-baseline gap-2 md:gap-4">
                            <p className="text-6xl md:text-[10rem] font-black tracking-tighter leading-none text-white drop-shadow-2xl glitch-text" data-text={Math.round(progress)}>{Math.round(progress)}</p>
                            <div className="flex flex-col">
                              <span className="text-2xl md:text-5xl font-black text-indigo-400 tracking-tighter leading-none">%</span>
                              <span className="text-[10px] md:text-sm font-bold opacity-40 tracking-widest uppercase">Registry</span>
                            </div>
                          </div>
                          <div className="mt-8 md:mt-16 flex flex-wrap gap-3 md:gap-6">
                             <div className="px-5 md:px-10 py-3 md:py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-[9px] md:text-[12px] font-black uppercase tracking-widest flex items-center gap-3 md:gap-4 hover:bg-white/20 transition-all hover:-translate-y-1">
                               <CheckCircle size={14} className="text-emerald-400" />
                               {completedLessons.size} Units Mastered
                             </div>
                             <div className="px-5 md:px-10 py-3 md:py-4 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 text-[9px] md:text-[12px] font-black uppercase tracking-widest flex items-center gap-3 md:gap-4 hover:bg-black/30 transition-all hover:-translate-y-1">
                               <Zap size={14} className="text-amber-400" />
                               {userStats.streak} Day Streak
                             </div>
                          </div>
                       </div>
                       <Sparkles className="absolute right-[-40px] bottom-[-40px] text-white/5 w-48 md:w-[30rem] h-48 md:h-[30rem] animate-pulse pointer-events-none" />
                    </div>
                    
                    <div className="tech-card flex flex-col justify-between group rounded-[2.5rem] relative overflow-hidden transition-all duration-700 hover:-translate-y-2 border border-white/5">
                       <div className="bento-inner p-8">
                          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><ShieldCheck size={120} /></div>
                          <div className="space-y-6">
                             <div className="flex items-center gap-3">
                               <div className="led-status text-emerald-500 bg-emerald-500" />
                               <h4 className="hardware-label">Ready Status</h4>
                             </div>
                             <p className="text-5xl font-black tracking-[-0.04em] text-white italic">65<span className="text-lg opacity-40 ml-1">%</span></p>
                             <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-1000" style={{ width: '65%' }} />
                             </div>
                          </div>
                          <div className="mt-8 pt-6 border-t border-white/5">
                             <span className="hardware-label !opacity-30">Diagnostic Alignment</span>
                          </div>
                       </div>
                    </div>

                    <div className="tech-card flex flex-col justify-between group rounded-[2.5rem] relative overflow-hidden transition-all duration-700 hover:-translate-y-2 border border-white/5">
                       <div className="bento-inner p-8">
                          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Database size={120} /></div>
                          <div className="space-y-6">
                             <div className="flex items-center gap-3">
                               <div className="led-status bg-indigo-500 text-indigo-500" />
                               <h4 className="hardware-label">Archive Core</h4>
                             </div>
                             <div>
                                <p className="text-5xl font-black tracking-[-0.04em] text-white italic">{Object.keys(vault.lessons).length.toString().padStart(2, '0')}</p>
                                <span className="hardware-label !opacity-30">Units Forged</span>
                             </div>
                          </div>
                          <button 
                            onClick={() => { setViewMode('forge'); }} 
                            className="mt-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400 hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
                          >
                            Access Forge <ArrowRight size={14} />
                          </button>
                       </div>
                    </div>

                    <div className="tech-card flex flex-col justify-between group rounded-[2.5rem] relative overflow-hidden transition-all duration-700 hover:-translate-y-2 border border-white/5 cursor-pointer">
                       <div className="bento-inner p-8">
                          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Music size={120} /></div>
                          <div className="space-y-6">
                             <div className="flex items-center gap-3">
                               <div className="led-status bg-emerald-500 text-emerald-500 animate-pulse" />
                               <h4 className="hardware-label">Neural Cast</h4>
                             </div>
                             <div className="space-y-1">
                               <p className="text-3xl font-black tracking-[-0.04em] text-white uppercase italic truncate">Neural Radio</p>
                               <span className="hardware-label !opacity-40">SPI Physics Beats</span>
                             </div>
                          </div>
                          <div className="mt-8 flex items-center gap-3">
                            <div className="flex-1 h-[2px] bg-white/5 rounded-full relative overflow-hidden">
                               <motion.div 
                                 animate={{ x: ['-100%', '100%'] }}
                                 transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                 className="absolute inset-0 bg-emerald-500/50 w-1/3"
                               />
                            </div>
                            <span className="font-mono text-[8px] text-emerald-500 uppercase tracking-widest">Live</span>
                          </div>
                       </div>
                    </div>

                    {/* New Mnemonic Quick-Ref */}
                    <div className="blueprint-card flex flex-col justify-between group relative overflow-hidden border-b-4 border-indigo-500/30">
                       <div className="bento-inner p-6 md:p-8">
                          <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5 group-hover:scale-125 transition-transform"><Activity size={100} className="md:w-[120px] md:h-[120px]"/></div>
                          <div className="p-3 md:p-6 bg-indigo-500/10 rounded-2xl md:rounded-3xl w-fit mb-4 md:mb-6 group-hover:scale-110 transition-transform border border-indigo-500/20"><Activity className="text-indigo-500 md:w-8 md:h-8" size={20} /></div>
                          <div>
                             <h4 className="micro-label mb-2">Neural Mnemonic</h4>
                             <p className="text-xl md:text-2xl font-black tracking-tighter text-white italic uppercase leading-tight mb-2">Flying Whales Smash Rocks</p>
                             <div className="space-y-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Freq → Wave → SPL → Res</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
                 
                 <div className="grid lg:grid-cols-3 gap-6 md:gap-12">
                    <div className="lg:col-span-2 tech-card rounded-[2rem] md:rounded-[6rem] p-6 md:p-16 shadow-4xl relative overflow-hidden border-b-[8px] md:border-b-[24px] border-black/40 group transition-all">
                       <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
                       <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 md:gap-16">
                          <div className="space-y-8 md:space-y-10 flex-1 w-full">
                             <div className="space-y-1 md:space-y-2">
                               <h4 className="micro-label text-indigo-400 italic">Cognitive Mapping</h4>
                               <h3 className="text-3xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none text-gradient-vibrant">Diagnostic <br/>Heuristics</h3>
                             </div>
                             <div className="space-y-6 md:space-y-8">
                                {['Waves', 'Doppler', 'Resolution'].map(k => (
                                  <div key={k} className="space-y-2 md:space-y-3">
                                     <div className="flex justify-between items-center text-[8px] md:text-[11px] font-black uppercase tracking-widest text-slate-500">
                                       <span className="flex items-center gap-2"><div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-indigo-500" /> {k}</span>
                                       <span className="text-white font-mono">{Math.round(masteryData[k as keyof typeof masteryData] || 0)} PERCENT</span>
                                     </div>
                                     <div className="h-1.5 md:h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px] md:p-[2px]">
                                       <div className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-1000" style={{ width: `${masteryData[k as keyof typeof masteryData] || 0}%` }} />
                                     </div>
                                  </div>
                                ))}
                             </div>
                          </div>
                          <div className="scale-90 sm:scale-110 md:scale-150 py-6 md:py-10 drop-shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:scale-[1] sm:hover:scale-[1.15] md:hover:scale-[1.55] transition-transform duration-700"><MasteryRadar data={masteryData} /></div>
                       </div>
                    </div>
                    <div className="space-y-6 md:space-y-12">
                        <RegistryDailyChallenge 
                          onSuccess={(xp, coins) => {
                            awardXP(xp);
                            awardCoins(coins);
                            updateQuestProgress('daily_lesson', 1);
                          }} 
                        />
                        <div className="tech-card rounded-[2rem] md:rounded-[5rem] p-8 md:p-12 border border-white/5 relative overflow-hidden h-fit">
                           <div className="absolute inset-0 neural-grid opacity-[0.03] pointer-events-none" />
                           <NeuralPulse />
                        </div>
                     </div>
                 </div>

                 <div className="mt-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[
                      { id: 'physics', icon: Activity, label: 'Acoustic Field' },
                      { id: 'doppler', icon: Zap, label: 'Spectral Doppler' },
                      { id: 'transducer', icon: Radio, label: 'Transducer Array' },
                      { id: 'attenuation', icon: Layers, label: 'Attenuation' },
                      { id: 'memory', icon: Database, label: 'Digital Memory' },
                      { id: 'artifact', icon: Sparkles, label: 'Artifact Sandbox' }
                    ].map((lab) => (
                      <div 
                        key={`quick-access-${lab.id}`}
                        onClick={() => { setViewMode('labs'); }}
                        className="tech-card p-4 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:scale-105 transition-all group border-b-2 border-indigo-500/10"
                      >
                        <div className="p-3 bg-indigo-500/10 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                          <lab.icon className="text-indigo-400" size={20} />
                        </div>
                        <span className="text-[10px] font-black text-white uppercase tracking-tighter leading-tight">{lab.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Physics Streamers Section */}
                  <div className="mt-16 md:mt-32 space-y-12 md:space-y-20">
                    <div 
                        onClick={() => setBriefingOpen(true)}
                        className="tech-card rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-12 relative overflow-hidden border-b-[8px] md:border-b-[16px] border-indigo-900/20 group cursor-pointer hover:scale-[1.01] transition-all shadow-4xl mb-12 md:mb-20"
                     >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
                           <div className="w-24 h-24 md:w-40 md:h-40 bg-white/5 rounded-[2rem] md:rounded-[3rem] flex items-center justify-center border border-white/10 group-hover:border-indigo-500/50 transition-all shadow-4xl group-hover:scale-105">
                              <ShieldAlert className="text-white group-hover:text-indigo-400 transition-colors md:w-20 md:h-20" size={48} />
                           </div>
                           <div className="flex-1 text-center md:text-left space-y-4 md:space-y-6">
                              <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                                 <div className="led-status bg-indigo-500 text-indigo-500" />
                                 <span className="text-[10px] md:text-[12px] font-black text-indigo-400 uppercase tracking-[0.2em]">Priority Transmission</span>
                              </div>
                              <h3 className="text-3xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none italic uppercase">Diagnostic <span className="text-gradient">Briefing</span></h3>
                              <p className="text-slate-400 font-bold uppercase text-[10px] md:text-sm tracking-[0.2em] md:tracking-[0.4em] leading-relaxed max-w-2xl italic">
                                 "Neural Core Heuristics: Bridging the gap between theory and Clinical Resolution challenges."
                              </p>
                           </div>
                           <div className="flex flex-col items-center gap-4">
                              <button className="px-10 py-5 md:px-16 md:py-8 bg-white text-slate-950 rounded-2xl font-black uppercase text-xs md:text-sm tracking-[0.2em] shadow-2xl hover:bg-indigo-50 active:scale-95 transition-all flex items-center gap-4">
                                Initialize <Play size={18} fill="currentColor" />
                              </button>
                           </div>
                        </div>
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Brain size={300} /></div>
                    </div>

                    <ArtifactHeuristic />

                    <NeuralAtlas />

                    <div className="flex flex-col md:flex-row items-end justify-between gap-6 px-4 md:px-0">
                      <div className="space-y-2 md:space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[8px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">Live Neural Stream</span>
                        </div>
                        <h2 className="text-3xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none">Physics <span className="text-gradient">Streamers</span></h2>
                        <p className="text-slate-500 font-bold max-w-lg uppercase text-[9px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] leading-relaxed italic">Engage with distinct cognitive models specializing in specific registry domains.</p>
                      </div>
                      <button onClick={() => setLiveTutorOpen(true)} className="btn-primary px-8 md:px-12 py-4 md:py-6 rounded-2xl flex items-center gap-3 md:gap-4 group">
                        <Mic size={18} className="md:w-6 md:h-6 group-hover:rotate-12 transition-transform" />
                        <span className="font-black uppercase tracking-widest text-[10px] md:text-xs">Enter Stream Hub</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 pb-12">
                      {BOT_PERSONAS.map((persona) => (
                        <div 
                          key={persona.id}
                          onClick={() => setLiveTutorOpen(true)}
                          className="tech-card rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 group cursor-pointer border-b-[8px] md:border-b-[16px] border-black/40 hover:scale-[1.03] transition-all relative overflow-hidden"
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${persona.color} opacity-0 group-hover:opacity-[0.03] transition-opacity`} />
                          <div className="flex flex-col items-center text-center space-y-6 md:space-y-8 relative z-10">
                            <div className={`w-20 h-20 md:w-32 md:h-32 bg-gradient-to-br ${persona.color} rounded-[1.5rem] md:rounded-[3rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20 group-hover:rotate-6 transition-transform rotate-3`}>
                              <persona.icon size={40} className="md:w-16 md:h-16" />
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-xl md:text-4xl font-black text-white uppercase italic tracking-tighter leading-none">{persona.name}</h3>
                              <p className="micro-label text-indigo-400">{persona.specialization}</p>
                            </div>
                            <div className="p-4 md:p-6 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-white/10 transition-colors">
                              <p className="text-[9px] md:text-[12px] font-bold text-slate-400 italic leading-relaxed">"{persona.intro.substring(0, 80)}..."</p>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 rounded-full text-indigo-400">
                               <div className="w-1 h-1 rounded-full bg-indigo-400" />
                               <span className="text-[7px] md:text-[9px] font-black uppercase tracking-widest leading-none">Style: {persona.style.split('.')[0]}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
              </div>
            ) : viewMode === 'mock-exam' ? (
              <MockExam 
                onComplete={(score, categoryScores) => {
                  awardXP(score * 20);
                  awardCoins(score * 5);
                  if (score >= 70) unlockBadge('quiz_whiz');
                  
                  // Update diagnostic history
                  setVault(prev => ({
                    ...prev,
                    examHistory: [...(prev.examHistory || []), { score, total: 100, timestamp: Date.now(), weakTopics: [] }]
                  }));

                  toast.success(`Simulation Complete: ${score}% Mastery`, {
                     description: "Diagnostic summary added to your performance dashboard."
                  });
                }}
                onExit={() => setViewMode('dashboard')}
              />
            ) : viewMode === 'roadmap' ? (
              <StudyRoadmap completedLessons={completedLessons} onOpenRadio={() => setRadioOpen(true)} onModuleClick={(idx) => { setCurrentModuleIdx(idx); setCurrentLessonIdx(0); setViewMode('masterclass'); }} />
            ) : viewMode === 'profile' ? (
              <Profile 
                stats={userStats} 
                badges={INITIAL_BADGES} 
                quests={activeQuests} 
                user={user} 
                onBuyBoost={handleBuyBoost} 
                onUpdateAvatar={handleUpdateAvatar}
                hotMicEnabled={hotMicEnabled}
                onToggleHotMic={() => setHotMicEnabled(!hotMicEnabled)}
              />
            ) : viewMode === 'skilltree' ? (
              <SkillTree stats={userStats} onUnlock={handleUnlockSkill} />
            ) : viewMode === 'achievements' ? (
              <AchievementVault stats={userStats} badges={INITIAL_BADGES} />
            ) : viewMode === 'duel' ? (
              <NeuralDuel 
                onExit={() => setViewMode('dashboard')} 
                onVictory={handleDuelVictory} 
              />
            ) : viewMode === 'analytics' ? (
              <PerformanceAnalytics vault={vault} stats={userStats} onOpenSRS={() => setViewMode('srs')} />
            ) : viewMode === 'leaderboard' ? (
              <Leaderboard currentUserId={user?.uid || 'anonymous'} />
            ) : viewMode === 'streams' ? (
              <SimulatedStreams />
            ) : viewMode === 'settings' ? (
              <Settings 
                user={user}
                stats={userStats}
                theme={theme}
                setTheme={setTheme}
                notifPreferences={notifPreferences}
                setNotifPreferences={setNotifPreferences}
                hotMicEnabled={hotMicEnabled}
                onToggleHotMic={() => setHotMicEnabled(!hotMicEnabled)}
                onClearVault={() => setShowPurgeConfirm(true)}
              />
            ) : (
              <div className="animate-in fade-in duration-1000">
                 <div className="flex-1 flex flex-col xl:flex-row h-[calc(100vh-80px)] xl:h-screen overflow-hidden">
                    <div id="masterclass-scroll-container" className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-12 lg:px-24">
                       <div className="max-w-[1000px] mx-auto pt-16 md:pt-32 pb-40">
                          <div className="flex flex-col items-center text-center mb-16 md:mb-40 space-y-8 md:space-y-16">
                             <div className="flex items-center gap-6 md:gap-12">
                                <div className="h-1 w-12 md:w-64 bg-gradient-to-r from-transparent to-indigo-600 rounded-full"></div>
                                <span className="text-indigo-600 font-black text-[12px] md:text-[24px] uppercase tracking-[0.5em] md:tracking-[1.4em] italic leading-none">Sequence {currentLesson.id_formatted}</span>
                                <div className="h-1 w-12 md:w-64 bg-gradient-to-l from-transparent to-indigo-600 rounded-full"></div>
                             </div>
                             <h2 className="text-5xl sm:text-7xl md:text-[8rem] lg:text-[14rem] font-black text-white tracking-[-0.06em] leading-[0.8] mb-8 md:mb-16 transition-all text-gradient italic uppercase">
                               {currentLesson.title}
                             </h2>
                             
                             <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-16 pt-6 md:pt-20">
                                {audioUrl ? (
                                  <div className="w-full max-w-5xl bg-indigo-900/40 backdrop-blur-3xl text-white px-8 md:px-16 py-8 md:py-12 rounded-[2rem] md:rounded-[4rem] border border-indigo-500/30 shadow-4xl animate-in zoom-in duration-500 relative overflow-hidden group flex flex-col gap-6">
                                     <div className="absolute inset-0 scanline opacity-20" />
                                     <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-50" />
                                     
                                     <div className="flex items-center justify-between relative z-10 w-full mb-4">
                                        <div>
                                          <p className="text-[11px] md:text-[16px] font-black uppercase tracking-[0.4em] mb-2 text-indigo-400">Full Masterclass Audio</p>
                                          <p className="text-xl md:text-5xl font-black italic uppercase tracking-tighter text-white">Narrator: {currentPersona}</p>
                                        </div>
                                        <button onClick={stopNarration} className="p-3 md:p-6 bg-white/10 text-white rounded-2xl md:rounded-[2rem] hover:bg-rose-500/20 hover:text-rose-500 transition-all border border-white/10 group-hover:border-rose-500/30 flex items-center gap-4">
                                          <span className="hidden md:block text-[10px] font-black uppercase tracking-widest">Terminate</span>
                                          <X size={24} className="md:w-8 md:h-8" />
                                        </button>
                                     </div>
                                     
                                     <div className="relative z-10 w-full">
                                        <audio 
                                          src={audioUrl} 
                                          controls 
                                          autoPlay 
                                          className="w-full h-16 md:h-20 outline-none rounded-2xl"
                                          style={{ filter: "invert(100%) hue-rotate(180deg) brightness(1.5)" }} 
                                        />
                                     </div>
                                  </div>
                                ) : (
                                  <button onClick={startNarration} disabled={loadingAI || audioLoading} className="btn-primary group relative overflow-hidden min-w-[300px] md:min-w-[700px] py-8 md:py-20 !rounded-[2rem] md:!rounded-[5rem] shadow-[0_0_100px_rgba(79,70,229,0.3)]">
                                     <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-indigo-400 to-indigo-600 bg-[length:200%_100%] animate-gradient" />
                                     <div className="relative z-10 flex items-center justify-center gap-6 md:gap-12">
                                       {audioLoading ? <Loader2 className="animate-spin md:w-16 md:h-16" size={32} /> : <Volume2 size={32} className="group-hover:scale-110 transition-transform duration-700 md:w-24 md:h-24" />}
                                       <div className="text-left">
                                          <span className="block text-[8px] md:text-xs font-black uppercase tracking-[0.4em] text-white/50 mb-2">Initialize Audio Stream</span>
                                          <span className="text-lg md:text-6xl font-black italic uppercase tracking-tighter block">{audioLoading ? 'Deserializing...' : 'Synthesize Masterclass'}</span>
                                       </div>
                                     </div>
                                  </button>
                                )}
                             </div>
                          </div>

                          {loadingAI ? (
                            <div className="glass-panel rounded-[3rem] md:rounded-[5.5rem] p-24 md:p-60 shadow-4xl flex flex-col items-center justify-center gap-12 md:gap-20 relative overflow-hidden">
                               <div className="absolute inset-0 bg-indigo-500/5 opacity-10" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                               <div className="w-32 h-32 md:w-64 md:h-64 border-[16px] md:border-[24px] border-white/5 border-t-indigo-600 rounded-full animate-spin shadow-[0_0_80px_rgba(99,102,241,0.4)]"></div>
                               <div className="text-center space-y-6">
                                  <h3 className="text-2xl md:text-5xl font-black uppercase italic tracking-tighter text-white">Synthesizing Neural Archives</h3>
                                  <p className="text-[11px] md:text-sm font-bold text-slate-500 uppercase tracking-[0.5em] animate-pulse">Generating Masterclass AND Visual Heuristics...</p>
                               </div>
                            </div>
                          ) : (
                            <div className="animate-in fade-in duration-1000">
                               <div className="flex justify-center mb-24 md:mb-40">
                                 <button 
                                   onClick={() => setRadioOpen(true)}
                                   className="px-10 py-5 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 transition-all group flex items-center gap-6 shadow-4xl scale-110"
                                 >
                                   <Music size={24} className="text-purple-400 group-hover:rotate-12 transition-transform" />
                                   <span className="text-[11px] font-black uppercase tracking-[0.3em]">Neural Radio: SPI Beats</span>
                                 </button>
                               </div>
                               {renderLecture()}

                               <div className="mt-40 mb-20 pointer-events-auto">
                                 {nextLessonData ? (
                                   <div 
                                     onClick={goToNextLesson}
                                     className="tech-card rounded-[3rem] md:rounded-[5rem] p-12 md:p-20 group cursor-pointer border border-white/5 hover:border-indigo-500/30 transition-all relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12"
                                   >
                                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                      <div className="space-y-6 relative z-10 text-center md:text-left flex-1">
                                         <p className="text-[11px] font-black uppercase tracking-[0.5em] text-indigo-400">Up Next in Archive</p>
                                         <h4 className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none group-hover:text-indigo-400 transition-all">{nextLessonData.title}</h4>
                                         <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest max-w-xl">{nextLessonData.description}</p>
                                      </div>
                                      <div className="w-24 h-24 md:w-40 md:h-40 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:bg-indigo-600 transition-all shadow-4xl relative z-10 shrink-0">
                                         <ArrowRight size={40} className="text-white group-hover:translate-x-2 transition-transform md:w-20 md:h-20" />
                                      </div>
                                   </div>
                                 ) : (
                                   <div 
                                     onClick={() => setViewMode('roadmap')}
                                     className="tech-card rounded-[3rem] md:rounded-[5rem] p-12 md:p-20 group cursor-pointer border border-white/5 hover:border-emerald-500/30 transition-all relative overflow-hidden flex flex-col items-center justify-center text-center gap-8"
                                   >
                                      <Trophy size={64} className="text-emerald-500 mb-4 animate-bounce" />
                                      <h4 className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none">Module Completed</h4>
                                      <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">You've reached the end of this neural sequence.</p>
                                      <button className="btn-primary mt-8 px-12 py-6 rounded-full">Return to Registry Hub</button>
                                   </div>
                                 )}
                               </div>

                               <footer className="mt-20 md:mt-60 pt-16 md:pt-40 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20 pb-20 md:pb-60">
                                  <div className="space-y-3 md:space-y-6 text-center md:text-left">
                                     <p className="text-[10px] md:text-[16px] font-black uppercase tracking-[0.4em] text-slate-500 font-mono">Sequence Mastery level</p>
                                     <span className={`text-3xl md:text-6xl font-black tracking-tighter leading-none italic uppercase ${completedLessons.has(lessonKey) ? 'text-emerald-500' : 'text-white/20'}`}>
                                       {completedLessons.has(lessonKey) ? 'CERTIFIED MASTER' : 'PENDING DETERMINATION'}
                                     </span>
                                  </div>
                                  <div className="flex flex-col sm:flex-row gap-4 md:gap-8 w-full md:w-auto">
                                    <button 
                                      onClick={goToPrevLesson}
                                      className="flex-1 flex items-center justify-center gap-4 bg-white/5 text-slate-400 px-8 py-6 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-slate-950 transition-all border border-white/5 active:scale-95 whitespace-nowrap"
                                    >
                                       <ChevronLeft size={20} /> PREVIOUS
                                    </button>
                                    {showQuizResults && (
                                      <button 
                                        onClick={markComplete}
                                        className="flex-1 btn-primary !bg-emerald-600 !hover:bg-emerald-700 px-12 md:px-20 py-8 md:py-10 !rounded-[3rem] md:!rounded-[5rem] animate-bounce"
                                      >
                                         Certify Mastery <CheckCircle2 size={32} />
                                      </button>
                                    )}
                                    <button 
                                      onClick={goToNextLesson}
                                      className="flex-1 flex items-center justify-center gap-8 md:gap-16 bg-slate-950 text-white px-12 md:px-24 py-8 md:py-12 rounded-[3.5rem] md:rounded-[6rem] font-black uppercase tracking-[0.3em] text-[11px] md:text-sm shadow-4xl hover:bg-indigo-600 hover:-translate-y-4 transition-all border-b-[12px] md:border-b-[24px] border-slate-800 active:translate-y-0"
                                    >
                                       Next Unit <ChevronRight size={32} className="md:w-12 md:h-12" />
                                    </button>
                                  </div>
                               </footer>
                            </div>
                          )}
                       </div>
                    </div>
                    {bufferOpen && (
                      <div className="w-full xl:w-[550px] border-l border-white/5 bg-[#0a0502]/95 backdrop-blur-3xl transition-all duration-700 h-[50vh] xl:h-full shadow-[-20px_0_50px_rgba(0,0,0,0.5)] relative z-10">
                         <LogicSpine 
                           bufferOpen={bufferOpen}
                           setBufferOpen={setBufferOpen}
                           currentLesson={currentLesson}
                           cachedLesson={vault.lessons[lessonKey] || null}
                           currentBlockIndex={visibleBlocksCount}
                           totalBlocks={blocks.length}
                           registryPulse={registryPulse}
                           lessonNotes={lessonNotes}
                           setLessonNotes={setLessonNotes}
                           lessonKey={lessonKey}
                         />
                      </div>
                    )}
                 </div>
              </div>
            )}
          </div>
        </div>
        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-[60] xl:hidden bg-slate-950/80 backdrop-blur-2xl border-t border-white/5 px-6 py-4 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <button 
            onClick={() => { setViewMode('dashboard'); setSidebarOpen(false); }}
            className={`flex flex-col items-center gap-1 transition-all ${viewMode === 'dashboard' ? 'text-indigo-400 scale-110' : 'text-slate-500'}`}
          >
            <Home size={20} />
            <span className="text-[8px] font-black uppercase tracking-widest">Home</span>
          </button>
          <button 
            onClick={() => { setViewMode('roadmap'); setSidebarOpen(false); }}
            className={`flex flex-col items-center gap-1 transition-all ${viewMode === 'roadmap' ? 'text-indigo-400 scale-110' : 'text-slate-500'}`}
          >
            <Compass size={20} />
            <span className="text-[8px] font-black uppercase tracking-widest">Path</span>
          </button>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex flex-col items-center gap-1 text-white bg-indigo-600 p-3 rounded-2xl -translate-y-6 shadow-2xl shadow-indigo-500/40 border border-white/20 active:scale-95 transition-all"
          >
            <Layout size={24} />
          </button>
          <button 
            onClick={() => { setViewMode('vault'); setSidebarOpen(false); }}
            className={`flex flex-col items-center gap-1 transition-all ${viewMode === 'vault' ? 'text-indigo-400 scale-110' : 'text-slate-500'}`}
          >
            <Database size={20} />
            <span className="text-[8px] font-black uppercase tracking-widest">Vault</span>
          </button>
          <button 
            onClick={() => { setViewMode('labs'); setSidebarOpen(false); }}
            className={`flex flex-col items-center gap-1 transition-all ${viewMode === 'labs' ? 'text-indigo-400 scale-110' : 'text-slate-500'}`}
          >
            <Activity size={20} />
            <span className="text-[8px] font-black uppercase tracking-widest">Labs</span>
          </button>
        </div>
      </main>

      {tutorOpen && <AIChat lessonTitle={currentLesson.title} lectureScript={lectureScript} onClose={() => setTutorOpen(false)} />}
      {liveTutorOpen && <LiveTutor lessonTitle={currentLesson.title} onClose={() => setLiveTutorOpen(false)} />}
      
      <AnimatePresence>
        {communityLibraryOpen && <CommunityLibrary onClose={() => setCommunityLibraryOpen(false)} onPinMedia={handlePinMedia} />}
        {/* Command Palette Modal */}
        <AnimatePresence>
          {commandPaletteOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-xl flex items-start justify-center pt-[15vh] p-4"
              onClick={() => setCommandPaletteOpen(false)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: -20 }}
                className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-4xl overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-8 border-b border-white/5 flex items-center gap-6">
                  <Search className="text-slate-500" size={24} />
                  <input 
                    autoFocus
                    type="text"
                    placeholder="Search lessons, labs, or commands..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none text-white font-black uppercase tracking-widest focus:ring-0 placeholder:text-slate-700"
                  />
                  <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[10px] font-black text-slate-500">ESC</div>
                </div>
                
                <div className="max-h-[50vh] overflow-y-auto p-4 space-y-2">
                  {searchQuery.length === 0 ? (
                    <div className="p-8 text-center space-y-4">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Quick Actions</p>
                      <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => { setViewMode('dashboard'); setCommandPaletteOpen(false); }} className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all text-left flex items-center gap-4">
                          <Home size={20} className="text-indigo-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
                        </button>
                        <button onClick={() => { setViewMode('roadmap'); setCommandPaletteOpen(false); }} className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all text-left flex items-center gap-4">
                          <Compass size={20} className="text-rose-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Roadmap</span>
                        </button>
                        <button onClick={() => { setCalculatorOpen(true); setCommandPaletteOpen(false); }} className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all text-left flex items-center gap-4">
                          <Calculator size={20} className="text-emerald-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Calculator</span>
                        </button>
                        <button onClick={() => { setViewMode('labs'); setCommandPaletteOpen(false); }} className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all text-left flex items-center gap-4">
                          <Activity size={20} className="text-amber-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Labs</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {modules.flatMap((m, mIdx) => m.lessons.map((l, lIdx) => ({ ...l, mIdx, lIdx })))
                        .filter(l => l.title.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(l => (
                          <button 
                            key={`${l.mIdx}-${l.lIdx}`}
                            onClick={() => {
                              setCurrentModuleIdx(l.mIdx);
                              setCurrentLessonIdx(l.lIdx);
                              setViewMode('masterclass');
                              setCommandPaletteOpen(false);
                              setSearchQuery('');
                            }}
                            className="w-full p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-indigo-600 hover:text-white transition-all text-left flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-6">
                              <div className="p-3 bg-white/5 rounded-xl group-hover:bg-white/20"><BookOpen size={18} /></div>
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest">{l.title}</p>
                                <p className="text-[8px] font-bold opacity-40 uppercase tracking-widest">Module {l.mIdx + 1}</p>
                              </div>
                            </div>
                            <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))
                      }
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {calculatorOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCalculatorOpen(false)}
            className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full"
            >
              <PhysicsCalculator onClose={() => setCalculatorOpen(false)} />
            </motion.div>
          </motion.div>
        )}

        {radioOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <NeuralRadio onClose={() => setRadioOpen(false)} />
          </motion.div>
        )}

        {briefingOpen && (
          <NeuralBriefing 
            onClose={() => setBriefingOpen(false)} 
            onNavigateToLesson={(m, l) => {
              setCurrentModuleIdx(m);
              setCurrentLessonIdx(l);
              setViewMode('masterclass');
              setBriefingOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
    </ErrorBoundary>
  );
};
