import { 
  Zap, Brain, Target, Shield, Rocket, Activity, ZapOff, Sun, Moon, 
  Flame, Waves, Microscope, Radio, Tv, Database, PenLine
} from 'lucide-react';

export interface AvatarOption {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  minLevel: number;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { 
    id: 'acoustic_pioneer', 
    name: 'Acoustic Pioneer', 
    description: 'A master of the initial wave propagation.', 
    icon: Waves, 
    color: 'from-blue-500 to-indigo-500', 
    minLevel: 1 
  },
  { 
    id: 'doppler_ghost', 
    name: 'Doppler Ghost', 
    description: 'Moves through spectral shifts with ease.', 
    icon: Activity, 
    color: 'from-emerald-500 to-teal-500', 
    minLevel: 3 
  },
  { 
    id: 'pixel_surgeon', 
    name: 'Pixel Surgeon', 
    description: 'Unmatched axial and lateral precision.', 
    icon: Target, 
    color: 'from-rose-500 to-orange-500', 
    minLevel: 5 
  },
  { 
    id: 'neural_node', 
    name: 'Neural Node', 
    description: 'A direct link to the sonography matrix.', 
    icon: Brain, 
    color: 'from-purple-500 to-indigo-500', 
    minLevel: 10 
  },
  { 
    id: 'artifact_hunter', 
    name: 'Artifact Hunter', 
    description: 'Finds the truth hidden in acoustic shadows.', 
    icon: Shield, 
    color: 'from-amber-500 to-yellow-500', 
    minLevel: 15 
  },
  { 
    id: 'beam_architect', 
    name: 'Beam Architect', 
    description: 'Constructs perfect focal zones.', 
    icon: PenLine, 
    color: 'from-cyan-500 to-blue-500', 
    minLevel: 20 
  },
  { 
    id: 'cortex_commander', 
    name: 'Cortex Commander', 
    description: 'Supreme mastery of all registry domains.', 
    icon: Rocket, 
    color: 'from-indigo-600 to-purple-600', 
    minLevel: 50 
  }
];
