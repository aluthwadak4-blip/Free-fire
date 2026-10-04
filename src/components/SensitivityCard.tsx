import React, { useState } from 'react';
import {
  Zap,
  Target,
  Copy,
  Check,
  BookmarkPlus,
  Play,
  Settings,
  AlertTriangle,
  Flame,
  Shield,
  Gauge,
  HelpCircle,
} from 'lucide-react';
import { PhoneSpecs, PlaystyleMode, SensitivityValues } from '../types';
import { soundEffects } from '../utils/audioEffects';

interface SensitivityCardProps {
  phone: PhoneSpecs;
  playstyle: PlaystyleMode;
  onSelectPlaystyle: (mode: PlaystyleMode) => void;
  sensitivity: SensitivityValues;
  onUpdateSensitivity: (newValues: SensitivityValues) => void;
  onSaveProfile: () => void;
  onOpenSimulator: () => void;
}

const PLAYSTYLE_OPTIONS: { id: PlaystyleMode; label: string; desc: string; icon: string }[] = [
  {
    id: 'one_tap',
    label: 'One-Tap Headshot',
    desc: 'High snap for M1887, Desert Eagle & Woodpecker J-drag flick',
    icon: '🎯',
  },
  {
    id: 'all_round',
    label: 'Balanced Ranked (BR & CS)',
    desc: 'Versatile equilibrium across all weapons and fight ranges',
    icon: '⚔️',
  },
  {
    id: 'spray_control',
    label: 'Spray & Recoil Lock',
    desc: 'Anti-overshoot damping for MP40, UMP, SCAR & AK47 sprays',
    icon: '🌪️',
  },
  {
    id: 'rusher_cqc',
    label: 'Fast CQC Rusher',
    desc: 'Max camera spin for 360 Gloo Wall, jump-shots & close evasions',
    icon: '⚡',
  },
  {
    id: 'sniper_pro',
    label: 'Sniper Quick-Switch',
    desc: 'Calibrated scope tracking for AWM, Kar98k & M82B Barrett',
    icon: '🔭',
  },
];

export const SensitivityCard: React.FC<SensitivityCardProps> = ({
  phone,
  playstyle,
  onSelectPlaystyle,
  sensitivity,
  onUpdateSensitivity,
  onSaveProfile,
  onOpenSimulator,
}) => {
  const [copied, setCopied] = useState(false);
  const [showDpiGuide, setShowDpiGuide] = useState(false);

  const handleSliderChange = (field: keyof SensitivityValues, value: number) => {
    onUpdateSensitivity({
      ...sensitivity,
      [field]: value,
    });
  };

  const handleCopyClipboard = () => {
    soundEffects.playClickSound();
    const text = `=== FREE FIRE SENSI PROFILE ===
Device: ${phone.model} (${phone.refreshRateHz}Hz / ${phone.touchSamplingRateHz}Hz Touch)
Playstyle: ${playstyle.toUpperCase()}

[IN-GAME SENSITIVITY]
• General: ${sensitivity.general}
• Red Dot: ${sensitivity.redDot}
• 2x Scope: ${sensitivity.scope2x}
• 4x Scope: ${sensitivity.scope4x}
• Sniper Scope: ${sensitivity.sniperScope}
• Free Look: ${sensitivity.freeLook}

[FIRE BUTTON SPECS]
• Button Size: ${sensitivity.fireButtonSize}%
• Placement: ${sensitivity.fireButtonPosition}
• Drag Speed: ${sensitivity.dragSpeedRecommendation}

[DEVELOPER OPTIONS & DPI]
• Minimum Width (DPI): ${sensitivity.recommendedDpi} (Default: ${phone.defaultDpi})
• Pointer Speed: ${sensitivity.pointerSpeed}
• Animation Scales: 0.5x or OFF
===============================`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const sensiSliders: { key: keyof SensitivityValues; label: string; desc: string; iconLabel: string }[] = [
    {
      key: 'general',
      label: 'General',
      desc: 'Controls 360° camera turning speed and drag momentum',
      iconLabel: 'GEN',
    },
    {
      key: 'redDot',
      label: 'Red Dot',
      desc: 'Primary headshot drag sensitivity for close-range hipfire',
      iconLabel: 'RED',
    },
    {
      key: 'scope2x',
      label: '2x Scope',
      desc: 'Mid-range spray drag and head-lock with 2x zoom',
      iconLabel: '2X',
    },
    {
      key: 'scope4x',
      label: '4x Scope',
      desc: 'Long-range tap drag for assault and marksman rifles',
      iconLabel: '4X',
    },
    {
      key: 'sniperScope',
      label: 'Sniper Scope',
      desc: 'Crosshair tracking speed for AWM / Kar98k quick scope',
      iconLabel: 'AWM',
    },
    {
      key: 'freeLook',
      label: 'Free Look',
      desc: 'Eye button camera pan for 360 situational awareness',
      iconLabel: 'EYE',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Playstyle Mode Selector */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-200">
              Select Weapon & Playstyle Specialization
            </h3>
          </div>
          <span className="text-xs text-stone-400 font-mono">5 Custom Tuned Modes</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {PLAYSTYLE_OPTIONS.map((opt) => {
            const isSelected = playstyle === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  soundEffects.playClickSound();
                  onSelectPlaystyle(opt.id);
                }}
                className={`p-3 rounded-xl text-left border transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500 text-stone-100 shadow-md shadow-amber-500/10'
                    : 'bg-stone-950/60 border-stone-800/80 text-stone-400 hover:text-stone-200 hover:bg-stone-800/50 hover:border-stone-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xl">{opt.icon}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
                    )}
                  </div>
                  <h4
                    className={`text-xs font-bold leading-tight mb-1 ${
                      isSelected ? 'text-amber-400' : 'text-stone-200'
                    }`}
                  >
                    {opt.label}
                  </h4>
                </div>
                <p className="text-[11px] leading-snug text-stone-400 line-clamp-2">{opt.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main Sensitivity Sliders Grid */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1">
              <Target className="w-3.5 h-3.5" />
              <span>Recommended Game Settings</span>
            </div>
            <h2 className="text-xl font-bold text-stone-100 tracking-tight">
              Free Fire In-Game Sensitivity Settings
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyClipboard}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Sensitivity'}</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playClickSound();
                onSaveProfile();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs border border-stone-700 transition-all active:scale-95"
            >
              <BookmarkPlus className="w-4 h-4 text-amber-400" />
              <span>Save Preset</span>
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {sensiSliders.map((slider) => {
            const val = Number(sensitivity[slider.key]) || 0;
            return (
              <div
                key={slider.key}
                className="bg-stone-950/70 border border-stone-800/80 rounded-xl p-4 transition-colors hover:border-stone-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-7 rounded-md bg-stone-900 border border-stone-800 flex items-center justify-center text-[10px] font-mono font-bold text-amber-400">
                      {slider.iconLabel}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-stone-200">{slider.label}</h4>
                      <p className="text-[11px] text-stone-400 leading-tight">{slider.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black font-mono text-amber-400 tabular-nums">{val}</span>
                    <span className="text-[10px] text-stone-500 font-mono">/ 100</span>
                  </div>
                </div>

                {/* Range Track with Gradient Fill */}
                <div className="relative flex items-center mt-3">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={val}
                    onChange={(e) => handleSliderChange(slider.key, parseInt(e.target.value, 10))}
                    className="w-full h-2.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
                  />
                </div>

                {/* Progress bar visual indicator */}
                <div className="flex justify-between items-center text-[10px] font-mono text-stone-400 mt-1.5 px-0.5">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick simulator launch bar */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-200">Want to test this sensitivity right now?</p>
              <p className="text-[11px] text-stone-400">
                Experience the real drag velocity, recoil bloom, and damage numbers in the interactive trainer.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEffects.playClickSound();
              onOpenSimulator();
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Headshot Simulator</span>
          </button>
        </div>
      </div>

      {/* 3. Fire Button Specs & Developer DPI Tuning Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fire Button Specifications */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-stone-200 uppercase tracking-wider">
                  Fire Button Sizing & Placement
                </h3>
              </div>
              <span className="text-xs text-amber-400 font-mono font-semibold">Tuned for Headshots</span>
            </div>

            <div className="flex items-center gap-6 my-4">
              {/* Visual circle scale */}
              <div className="relative flex items-center justify-center w-28 h-28 bg-stone-950 rounded-2xl border border-stone-800 shrink-0">
                <div
                  className="rounded-full bg-gradient-to-tr from-amber-600 to-rose-500 shadow-lg shadow-amber-500/20 border-2 border-amber-300 flex items-center justify-center transition-all duration-300"
                  style={{
                    width: `${Math.max(38, Math.min(84, (sensitivity.fireButtonSize / 100) * 95))}px`,
                    height: `${Math.max(38, Math.min(84, (sensitivity.fireButtonSize / 100) * 95))}px`,
                  }}
                >
                  <Target className="w-4 h-4 text-stone-950 stroke-[2.5]" />
                </div>
                <span className="absolute bottom-1 right-2 text-[9px] font-mono text-stone-400">Scale Preview</span>
              </div>

              {/* Specs detail */}
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-stone-400 block text-[11px]">Recommended Button Size:</span>
                  <span className="text-2xl font-black font-mono text-amber-400 tabular-nums">
                    {sensitivity.fireButtonSize}%
                  </span>
                  <span className="text-[11px] text-stone-400 ml-1.5">
                    (Standard range: {phone.screenSizeInches >= 6.7 ? '42% - 48%' : '48% - 56%'})
                  </span>
                </div>

                <div>
                  <span className="text-stone-400 block text-[11px]">Drag Swipe Pressure:</span>
                  <span className="font-semibold text-stone-200">{sensitivity.dragSpeedRecommendation}</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800 text-xs text-stone-300 space-y-1">
              <span className="font-bold text-amber-400 block">Positioning Guideline:</span>
              <p className="text-stone-400 leading-relaxed">
                Place fire button in <strong className="text-stone-200">{sensitivity.fireButtonPosition}</strong>.
                Always leave at least 50% of vertical screen space <span className="text-amber-400">ABOVE</span> the button
                completely free of other HUD elements to give your thumb unrestricted upward flick travel!
              </p>
            </div>
          </div>
        </div>

        {/* Android Developer Options & DPI Optimizer */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-stone-200 uppercase tracking-wider">
                  Android Developer Options Tuning
                </h3>
              </div>
              <button
                onClick={() => setShowDpiGuide(!showDpiGuide)}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>How to Set</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800">
                <span className="text-[11px] text-stone-400 block">Minimum Width (DPI):</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-black font-mono text-amber-400 tabular-nums">
                    {sensitivity.recommendedDpi}
                  </span>
                  <span className="text-[10px] text-stone-400">Default: {phone.defaultDpi}</span>
                </div>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                  <Shield className="w-3 h-3" /> Safe calibrated range
                </span>
              </div>

              <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800">
                <span className="text-[11px] text-stone-400 block">System Pointer Speed:</span>
                <span className="text-xs font-bold text-stone-200 block mt-1 leading-snug">
                  {sensitivity.pointerSpeed}
                </span>
                <span className="text-[10px] text-stone-400 block mt-1">Settings &gt; System &gt; Language & Input</span>
              </div>
            </div>

            {/* Animation Scales */}
            <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800 text-xs text-stone-300 space-y-1 mb-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-200">Window, Transition & Animator Scale:</span>
                <span className="font-mono font-bold text-amber-400">0.5x or Off</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-tight">
                Reduces Android UI render latency, making Free Fire touch events register up to 14ms faster.
              </p>
            </div>

            {/* DPI Warning note */}
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/40 text-[11px] text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p>
                <strong>DPI Safety Warning:</strong> Never set DPI above{' '}
                <span className="font-mono font-bold">{phone.maxSafeDpi}</span>. Extreme values (e.g. 700+) can trigger
                system crash loops or UI lockouts on certain Android devices.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Developer Mode Modal/Accordion */}
      {showDpiGuide && (
        <div className="p-4 rounded-xl bg-stone-950 border border-amber-500/40 text-xs text-stone-300 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-800">
            <h4 className="font-bold text-amber-400 text-sm">How to Enable Developer Options & Set DPI</h4>
            <button onClick={() => setShowDpiGuide(false)} className="text-stone-400 hover:text-white font-bold">
              ✕
            </button>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 text-stone-300 leading-relaxed">
            <li>
              Open your phone's <strong>Settings</strong> &gt; <strong>About Phone</strong>.
            </li>
            <li>
              Tap <strong>Build Number</strong> (or <strong>MIUI Version</strong> / <strong>ColorOS Version</strong>) 7
              times until it says <em>"You are now a developer!"</em>.
            </li>
            <li>
              Go back to <strong>Settings</strong> &gt; <strong>System</strong> (or <strong>Additional Settings</strong>)
              &gt; <strong>Developer Options</strong>.
            </li>
            <li>
              Scroll down to the <em>Drawing</em> section and locate <strong>Smallest Width</strong> (or{' '}
              <strong>Minimum Width / DPI</strong>).
            </li>
            <li>
              Remember your original number (usually around {phone.defaultDpi}) so you can revert it anytime.
            </li>
            <li>
              Change the number to <strong className="text-amber-400">{sensitivity.recommendedDpi}</strong> and tap OK!
            </li>
          </ol>
        </div>
      )}
    </div>
  );
};
