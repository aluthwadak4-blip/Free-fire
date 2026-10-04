import React from 'react';
import { Volume2, VolumeX, Bookmark, RotateCcw, Crosshair } from 'lucide-react';
import { soundEffects } from '../utils/audioEffects';

interface HeaderProps {
  activeTab: 'calculator' | 'hud' | 'training' | 'guide';
  setActiveTab: (tab: 'calculator' | 'hud' | 'training' | 'guide') => void;
  savedCount: number;
  onOpenSaved: () => void;
  onResetAll: () => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  onOpenSaved,
  onResetAll,
  isMuted,
  setIsMuted,
}) => {
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEffects.setMuted(nextMuted);
    if (!nextMuted) {
      soundEffects.playClickSound();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-stone-950/95 backdrop-blur-md border-b border-stone-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
      {/* Zone 1: Brand title wordmark */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center shadow-md shadow-amber-500/20">
          <Crosshair className="w-5 h-5 text-stone-950 stroke-[2.5]" />
        </div>
        <span className="text-lg font-black tracking-wider uppercase text-stone-100 font-display">
          FF <span className="text-amber-500">Sensi</span> Pro
        </span>
      </div>

      {/* Zone 2: Navigation links */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
        <button
          onClick={() => {
            soundEffects.playClickSound();
            setActiveTab('calculator');
          }}
          className={`transition-colors pb-0.5 ${
            activeTab === 'calculator'
              ? 'text-amber-400 font-semibold border-b-2 border-amber-500'
              : 'text-stone-400 hover:text-stone-100'
          }`}
        >
          Sensitivity & DPI
        </button>
        <button
          onClick={() => {
            soundEffects.playClickSound();
            setActiveTab('hud');
          }}
          className={`transition-colors pb-0.5 ${
            activeTab === 'hud'
              ? 'text-amber-400 font-semibold border-b-2 border-amber-500'
              : 'text-stone-400 hover:text-stone-100'
          }`}
        >
          Custom HUD Lab
        </button>
        <button
          onClick={() => {
            soundEffects.playClickSound();
            setActiveTab('training');
          }}
          className={`transition-colors pb-0.5 ${
            activeTab === 'training'
              ? 'text-amber-400 font-semibold border-b-2 border-amber-500'
              : 'text-stone-400 hover:text-stone-100'
          }`}
        >
          Drag Shot Simulator
        </button>
        <button
          onClick={() => {
            soundEffects.playClickSound();
            setActiveTab('guide');
          }}
          className={`transition-colors pb-0.5 ${
            activeTab === 'guide'
              ? 'text-amber-400 font-semibold border-b-2 border-amber-500'
              : 'text-stone-400 hover:text-stone-100'
          }`}
        >
          Recoil Masterclass
        </button>
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleMute}
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-stone-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
        </button>

        <button
          onClick={() => {
            soundEffects.playClickSound();
            onOpenSaved();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-200 hover:text-white hover:border-stone-700 text-xs font-semibold tracking-wide transition-all shadow-sm"
        >
          <Bookmark className="w-3.5 h-3.5 text-amber-500" />
          <span>Saved</span>
          {savedCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {savedCount}
            </span>
          )}
        </button>

        <button
          onClick={onResetAll}
          title="Reset to device defaults"
          className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-rose-400 hover:bg-stone-800 transition-colors"
          aria-label="Reset Defaults"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
