export type PhoneBrand =
  | 'Apple'
  | 'Samsung'
  | 'Xiaomi / POCO'
  | 'Realme'
  | 'OnePlus'
  | 'Vivo / iQOO'
  | 'Oppo'
  | 'Infinix'
  | 'Tecno'
  | 'ASUS ROG'
  | 'Motorola'
  | 'Google Pixel'
  | 'Other / Custom';

export type PlaystyleMode =
  | 'one_tap'     // One-Tap Headshot specialist (M1887, Deagle, Woodpecker)
  | 'all_round'    // Balanced BR & Clash Squad
  | 'spray_control'// Full-Auto Recoil Control (MP40, UMP, SCAR)
  | 'rusher_cqc'   // Extreme close-combat & fast 360 jump-shots
  | 'sniper_pro';  // Sniper quick-switch tracking (AWM, M82B)

export interface PhoneSpecs {
  id: string;
  brand: PhoneBrand;
  model: string;
  screenSizeInches: number;
  refreshRateHz: number;
  touchSamplingRateHz: number;
  ramGB: number;
  chipsetTier: 'flagship' | 'upper_mid' | 'mid' | 'budget';
  os: 'android' | 'ios';
  defaultDpi: number;
  maxSafeDpi: number;
  notes?: string;
}

export interface SensitivityValues {
  general: number;      // 0 - 100
  redDot: number;       // 0 - 100
  scope2x: number;      // 0 - 100
  scope4x: number;      // 0 - 100
  sniperScope: number;  // 0 - 100
  freeLook: number;     // 0 - 100
  fireButtonSize: number; // % (typically 35% - 70%)
  fireButtonPosition: string; // e.g. "Lower Right (22% from bottom)"
  recommendedDpi: number;
  pointerSpeed: string; // e.g. "Default +2 notches" or "Maximum"
  dragSpeedRecommendation: 'Light & Fast' | 'Medium Snap' | 'Heavy Long Drag';
}

export interface HudButton {
  id: string;
  label: string;
  name: string;
  xPercent: number; // 0 - 100 from left
  yPercent: number; // 0 - 100 from top
  sizePercent: number; // 20 - 100 relative
  opacityPercent: number; // 20 - 100
  finger: string; // e.g., "Right Thumb", "Left Index"
  importance: 'critical' | 'secondary' | 'utility';
  role: string;
}

export interface HudPreset {
  id: string;
  name: string;
  clawType: '2_finger' | '3_finger' | '4_finger';
  tagline: string;
  description: string;
  recommendedFor: string;
  buttons: HudButton[];
}

export interface WeaponProfile {
  id: string;
  name: string;
  category: 'Shotgun' | 'SMG' | 'Pistol' | 'Marksman Rifle' | 'Assault Rifle';
  baseDamage: number;
  headshotMultiplier: number;
  dragTechnique: 'Rotation / J-Drag' | 'Straight Up Fast Drag' | 'Down-Up Hook Drag' | 'Controlled Smooth Drag';
  optimalRange: 'Close (0-10m)' | 'Mid (10-25m)' | 'Long (25m+)';
  recoilBloomRate: 'Very Fast' | 'Moderate' | 'Low';
  tips: string;
}

export interface SavedSetup {
  id: string;
  title: string;
  dateCreated: string;
  phoneSpecs: PhoneSpecs;
  playstyle: PlaystyleMode;
  sensitivity: SensitivityValues;
  hudPresetName: string;
}
