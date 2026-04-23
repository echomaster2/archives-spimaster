
import { Waves, Shield, Radio, Activity, TrendingUp, AlertTriangle, Droplet, Gauge, Search, Zap, Filter, Cpu, Database, Eye, Calculator, BarChart3, Sparkles } from 'lucide-react';
import { Module } from '../types';

export const modules: Module[] = [
  {
    title: "Mathematics & Units",
    weight: "Foundations",
    icon: Calculator,
    color: "from-slate-400 to-slate-600",
    lessons: [
      { id_formatted: "1.1", title: "Metric System & Units", id: "metric-units" },
      { id_formatted: "1.2", title: "Logarithms & Decibels", id: "log-decibels" },
      { id_formatted: "1.3", title: "Scientific Notation", id: "sci-notation" }
    ]
  },
  {
    title: "Waves and Sound",
    weight: "Core Physics",
    icon: Waves,
    color: "from-blue-500 to-cyan-500",
    lessons: [
      { id_formatted: "2.1", title: "Introduction to Waves", id: "intro-waves" },
      { id_formatted: "2.2", title: "Essential Wave Parameters", id: "wave-params" },
      { id_formatted: "2.3", title: "Interaction with Media", id: "media-interaction" }
    ]
  },
  {
    title: "Attenuation & Absorption",
    weight: "High Yield",
    icon: Filter,
    color: "from-indigo-500 to-purple-500",
    lessons: [
      { id_formatted: "3.1", title: "Reflection & Refraction", id: "refl-refr" },
      { id_formatted: "3.2", title: "Attenuation Coefficients", id: "atten-coeffs" },
      { id_formatted: "3.3", title: "Absorption & Heat", id: "absorption" }
    ]
  },
  {
    title: "Pulsed Wave",
    weight: "Core",
    icon: Activity,
    color: "from-emerald-500 to-teal-500",
    lessons: [
      { id_formatted: "4.1", title: "Pulse-Echo Principle", id: "pulse-echo" },
      { id_formatted: "4.2", title: "Pulsed Wave Parameters", id: "pw-params" },
      { id_formatted: "4.3", title: "The 13-Microsecond Rule", id: "13us-rule" }
    ]
  },
  {
    title: "Transducers",
    weight: "15-20%",
    icon: Radio,
    color: "from-purple-500 to-pink-500",
    lessons: [
      { id_formatted: "5.1", title: "Piezoelectric Effect", id: "pzt-effect" },
      { id_formatted: "5.2", title: "Array Types & Steering", id: "array-types" },
      { id_formatted: "5.3", title: "Beam Focusing & Zones", id: "beam-focus" }
    ]
  },
  {
    title: "Resolution",
    weight: "High Yield",
    icon: Search,
    color: "from-blue-600 to-indigo-600",
    lessons: [
      { id_formatted: "6.1", title: "Axial Resolution (LARRD)", id: "axial-res", description: "Master the 'Flying Whales' rule: Frequency dictates wavelength, wavelength dictates SPL, and SPL dictates LARRD resolution." },
      { id_formatted: "6.2", title: "Lateral Resolution (LATA)", id: "lateral-res" },
      { id_formatted: "6.3", title: "Temporal & Contrast Res", id: "temp-contrast" }
    ]
  },
  {
    title: "Instrumentation",
    weight: "28%",
    icon: Cpu,
    color: "from-slate-600 to-slate-800",
    lessons: [
      { id_formatted: "7.1", title: "Receiver Functions (ACCDP)", id: "receiver" },
      { id_formatted: "7.2", title: "Dynamic Range & Compression", id: "dynamic-range" },
      { id_formatted: "7.3", title: "Digital Memory & Monitors", id: "storage" }
    ]
  },
  {
    title: "Doppler",
    weight: "31%",
    icon: TrendingUp,
    color: "from-red-500 to-orange-500",
    lessons: [
      { id_formatted: "8.1", title: "Doppler Principle & Equation", id: "doppler-intro" },
      { id_formatted: "8.2", title: "CW vs PW Doppler", id: "doppler-modalities" },
      { id_formatted: "8.3", title: "Color & Power Doppler", id: "doppler-color" }
    ]
  },
  {
    title: "Hemodynamics",
    weight: "10%",
    icon: Droplet,
    color: "from-rose-500 to-red-500",
    lessons: [
      { id_formatted: "9.1", title: "Flow Patterns & Resistance", id: "flow-patterns" },
      { id_formatted: "9.2", title: "Bernoulli's & Poiseuille's", id: "bernoulli" }
    ]
  },
  {
    title: "Artifacts",
    weight: "15%",
    icon: AlertTriangle,
    color: "from-yellow-500 to-amber-500",
    lessons: [
      { id_formatted: "10.1", title: "Propagation Artifacts", id: "prop-artifacts", description: "Use the 'Reckless Cats Ruin Echocardiograms' heuristic to map phantom plots to biological truth." },
      { id_formatted: "10.2", title: "Attenuation Artifacts", id: "atten-artifacts" },
      { id_formatted: "10.3", title: "Doppler Artifacts", id: "doppler-artifacts" }
    ]
  },
  {
    title: "Bioeffects & Safety",
    weight: "10%",
    icon: Shield,
    color: "from-teal-500 to-cyan-500",
    lessons: [
      { id_formatted: "11.1", title: "ALARA & Thermal Effects", id: "alara-thermal" },
      { id_formatted: "11.2", title: "Safety Indices (TI & MI)", id: "safety-indices" }
    ]
  },
  {
    title: "Quality Assurance",
    weight: "5-10%",
    icon: BarChart3,
    color: "from-emerald-600 to-green-600",
    lessons: [
      { id_formatted: "12.1", title: "Phantoms & Test Objects", id: "phantoms" },
      { id_formatted: "12.2", title: "Statistical Accuracy", id: "stats-accuracy" }
    ]
  },
  {
    title: "Advanced Imaging",
    weight: "Specialized",
    icon: Sparkles,
    color: "from-cyan-600 to-blue-600",
    lessons: [
      { id_formatted: "13.1", title: "Harmonics & Contrast", id: "harmonics" },
      { id_formatted: "13.2", title: "Elastography & Fusion", id: "elastography" }
    ]
  }
];
