import React, { useState, useRef } from 'react';
import {
  Smartphone,
  RotateCcw,
  Sliders,
  Share2,
  Copy,
  Check,
  Sparkles,
  Info,
  Hand,
  Maximize2,
} from 'lucide-react';
import { HudButton, HudPreset } from '../types';
import { HUD_PRESETS } from '../data/hudPresets';
import { soundEffects } from '../utils/audioEffects';

interface HudVisualizerProps {
  currentPreset: HudPreset;
  onSelectPreset: (preset: HudPreset) => void;
  buttons: HudButton[];
  onUpdateButtons: (buttons: HudButton[]) => void;
}

export const HudVisualizer: React.FC<HudVisualizerProps> = ({
  currentPreset,
  onSelectPreset,
  buttons,
  onUpdateButtons,
}) => {
  const [selectedButtonId, setSelectedButtonId] = useState<string>('main_fire');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const screenRef = useRef<HTMLDivElement>(null);

  const selectedBtn = buttons.find((b) => b.id === selectedButtonId) || buttons[0];

  const handleButtonSelect = (id: string) => {
    soundEffects.playClickSound();
    setSelectedButtonId(id);
  };

  const handleUpdateSelected = (field: keyof HudButton, val: number | string) => {
    const updated = buttons.map((b) => {
      if (b.id === selectedButtonId) {
        return { ...b, [field]: val };
      }
      return b;
    });
    onUpdateButtons(updated);
  };

  // Screen pointer drag handling
  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    soundEffects.playClickSound();
    setSelectedButtonId(id);
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !screenRef.current) return;
    const rect = screenRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));

    const updated = buttons.map((b) => {
      if (b.id === selectedButtonId) {
        return { ...b, xPercent: Math.round(x), yPercent: Math.round(y) };
      }
      return b;
    });
    onUpdateButtons(updated);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Safe catch
      }
    }
  };

  const handleCopyPresetJson = () => {
    soundEffects.playClickSound();
    const jsonStr = JSON.stringify(
      {
        preset: currentPreset.name,
        clawType: currentPreset.clawType,
        buttons: buttons.map((b) => ({
          id: b.id,
          name: b.name,
          x: `${b.xPercent}%`,
          y: `${b.yPercent}%`,
          size: `${b.sizePercent}%`,
          opacity: `${b.opacityPercent}%`,
          finger: b.finger,
        })),
      },
      null,
      2
    );
    navigator.clipboard.writeText(jsonStr).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Claw Mode Selector */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1">
              <Hand className="w-3.5 h-3.5" />
              <span>Free Fire Custom HUD Architecture</span>
            </div>
            <h2 className="text-xl font-bold text-stone-100 tracking-tight">
              Ergonomic Layouts & Drag-Clearance Zones
            </h2>
          </div>

          {/* Quick Copy / Share */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPresetJson}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-semibold transition-all active:scale-95"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
              <span>{copiedCode ? 'Copied Config!' : 'Export HUD'}</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playClickSound();
                onUpdateButtons([...currentPreset.buttons]);
              }}
              title="Reset layout to preset defaults"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium border border-stone-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Positions</span>
            </button>
          </div>
        </div>

        {/* Claw Preset Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {HUD_PRESETS.map((preset) => {
            const isSelected = currentPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  soundEffects.playClickSound();
                  onSelectPreset(preset);
                  onUpdateButtons([...preset.buttons]);
                }}
                className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500 text-stone-100 shadow-md shadow-amber-500/10'
                    : 'bg-stone-950/60 border-stone-800/80 text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black font-mono uppercase text-amber-400">
                      {preset.clawType.replace('_', ' ').toUpperCase()}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] bg-amber-500 text-stone-950 px-2 py-0.5 rounded font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-stone-100 mb-1">{preset.name}</h3>
                  <p className="text-[11px] text-stone-400 line-clamp-2">{preset.tagline}</p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-stone-800/60 text-[10px] text-stone-500 italic">
                  Best for: {preset.recommendedFor}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Smartphone Screen Canvas */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-2 text-stone-400">
            <Smartphone className="w-4 h-4 text-amber-500" />
            <span>
              Interactive Landscape Preview: <strong className="text-stone-200">Tap or drag any button</strong> to customize its position and size.
            </span>
          </div>
          <span className="hidden sm:inline text-amber-400/80 font-mono text-[11px]">
            Drag clearance corridor highlighted
          </span>
        </div>

        {/* Mobile Phone Bezel */}
        <div className="relative mx-auto w-full max-w-4xl bg-stone-950 rounded-2xl p-3 border-4 border-stone-800 shadow-2xl shadow-black/80">
          {/* Speaker / Camera Notch Simulator */}
          <div className="absolute top-1/2 left-1.5 -translate-y-1/2 w-1.5 h-10 bg-stone-800 rounded-full" />
          <div className="absolute top-1/2 right-1.5 -translate-y-1/2 w-1.5 h-10 bg-stone-800 rounded-full" />

          {/* Virtual Display Area (16:9 ratio) */}
          <div
            ref={screenRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="relative w-full aspect-[16/9] bg-stone-950 rounded-xl overflow-hidden border border-stone-800/80 select-none cursor-crosshair touch-none"
            style={{
              backgroundImage: `
                radial-gradient(ellipse at 80% 70%, rgba(245, 158, 11, 0.08) 0%, transparent 60%),
                radial-gradient(ellipse at 20% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 60%),
                linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
              `,
              backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px',
            }}
          >
            {/* Visual Crosshair in Center Screen */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40">
              <div className="w-6 h-6 border border-stone-500 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
              </div>
            </div>

            {/* Vertical Drag Headshot Clearance Corridor (Above Main Fire Button) */}
            {buttons.find((b) => b.id === 'main_fire') && (
              <div
                className="absolute border border-dashed border-amber-500/30 bg-amber-500/5 rounded-xl pointer-events-none flex flex-col items-center justify-start pt-2"
                style={{
                  left: `${(buttons.find((b) => b.id === 'main_fire')?.xPercent || 78) - 10}%`,
                  width: '20%',
                  top: '12%',
                  bottom: `${100 - (buttons.find((b) => b.id === 'main_fire')?.yPercent || 74) + 6}%`,
                }}
              >
                <span className="text-[10px] font-mono font-bold text-amber-500/70 tracking-widest uppercase">
                  ↑ Drag Corridor
                </span>
                <span className="text-[8px] text-stone-500 text-center px-1">
                  Keep empty for 100% headshot flick room
                </span>
              </div>
            )}

            {/* Draggable HUD Buttons */}
            {buttons.map((btn) => {
              const isSelected = btn.id === selectedButtonId;
              const pxSize = Math.max(30, Math.min(80, (btn.sizePercent / 100) * 80));
              const isMainFire = btn.id === 'main_fire';
              const isLeftFire = btn.id === 'left_fire';
              const isGloo = btn.id === 'gloo_wall';

              return (
                <div
                  key={btn.id}
                  onPointerDown={(e) => handlePointerDown(btn.id, e)}
                  onClick={() => handleButtonSelect(btn.id)}
                  style={{
                    left: `${btn.xPercent}%`,
                    top: `${btn.yPercent}%`,
                    transform: 'translate(-50%, -50%)',
                    width: `${pxSize}px`,
                    height: `${pxSize}px`,
                    opacity: btn.opacityPercent / 100,
                  }}
                  className={`absolute rounded-full flex flex-col items-center justify-center transition-transform cursor-grab active:cursor-grabbing font-mono font-bold select-none ${
                    isSelected
                      ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-stone-950 scale-105 z-30'
                      : 'hover:scale-105 z-10'
                  } ${
                    isMainFire
                      ? 'bg-gradient-to-tr from-amber-600 to-rose-600 text-stone-950 border border-amber-300 shadow-lg shadow-amber-500/30'
                      : isLeftFire
                      ? 'bg-gradient-to-tr from-rose-700 to-orange-500 text-white border border-rose-400'
                      : isGloo
                      ? 'bg-gradient-to-tr from-cyan-600 to-blue-600 text-white border border-cyan-300'
                      : btn.importance === 'critical'
                      ? 'bg-stone-800 text-stone-200 border border-stone-600'
                      : 'bg-stone-900/90 text-stone-400 border border-stone-800'
                  }`}
                >
                  <span className="text-[10px] sm:text-[11px] font-black leading-none drop-shadow">
                    {btn.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Button Customizer Panel */}
        {selectedBtn && (
          <div className="mt-5 p-4 rounded-xl bg-stone-950/80 border border-amber-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-stone-800">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xs font-mono font-bold">
                  {selectedBtn.label}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                    <span>{selectedBtn.name}</span>
                    <span className="text-xs font-normal text-amber-400 font-mono">
                      (Assigned to: {selectedBtn.finger})
                    </span>
                  </h4>
                  <p className="text-xs text-stone-400">{selectedBtn.role}</p>
                </div>
              </div>

              <div className="text-xs text-stone-400 font-mono">
                Position: X: {selectedBtn.xPercent}% · Y: {selectedBtn.yPercent}%
              </div>
            </div>

            {/* Sliders for Size & Opacity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-stone-300 font-medium">Button Size:</span>
                  <span className="font-mono font-bold text-amber-400 tabular-nums">
                    {selectedBtn.sizePercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min={25}
                  max={100}
                  value={selectedBtn.sizePercent}
                  onChange={(e) => handleUpdateSelected('sizePercent', parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-stone-300 font-medium">Transparency / Opacity:</span>
                  <span className="font-mono font-bold text-amber-400 tabular-nums">
                    {selectedBtn.opacityPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={selectedBtn.opacityPercent}
                  onChange={(e) => handleUpdateSelected('opacityPercent', parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Button Inventory & Ergonomic Finger Legend */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-stone-200 uppercase tracking-wider mb-3">
          Complete Button Hierarchy & Finger Assignments
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-stone-950/60 text-stone-400 font-semibold border-b border-stone-800">
              <tr>
                <th className="py-2.5 px-3">Button Name</th>
                <th className="py-2.5 px-3">Assigned Finger</th>
                <th className="py-2.5 px-3">Recommended Size</th>
                <th className="py-2.5 px-3">Opacity</th>
                <th className="py-2.5 px-3">Tactical Purpose</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 font-mono">
              {buttons.map((btn) => (
                <tr
                  key={btn.id}
                  onClick={() => handleButtonSelect(btn.id)}
                  className={`cursor-pointer transition-colors ${
                    selectedButtonId === btn.id ? 'bg-amber-500/10' : 'hover:bg-stone-800/40'
                  }`}
                >
                  <td className="py-2.5 px-3 font-sans font-bold text-stone-100 flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-stone-800 border border-stone-700 flex items-center justify-center text-[10px] font-mono text-amber-400">
                      {btn.label.slice(0, 3)}
                    </span>
                    <span>{btn.name}</span>
                  </td>
                  <td className="py-2.5 px-3 font-sans text-amber-400">{btn.finger}</td>
                  <td className="py-2.5 px-3 tabular-nums">{btn.sizePercent}%</td>
                  <td className="py-2.5 px-3 tabular-nums">{btn.opacityPercent}%</td>
                  <td className="py-2.5 px-3 font-sans text-stone-400 max-w-xs truncate">{btn.role}</td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleButtonSelect(btn.id);
                      }}
                      className="px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] font-sans"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
