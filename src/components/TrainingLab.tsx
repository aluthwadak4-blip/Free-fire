import React, { useState, useRef, useEffect } from 'react';
import {
  Crosshair,
  RotateCcw,
  Target,
  Zap,
  Flame,
  Volume2,
  VolumeX,
  Compass,
  Award,
} from 'lucide-react';
import { SensitivityValues, WeaponProfile } from '../types';
import { WEAPONS_DATABASE } from '../data/weaponsData';
import { soundEffects } from '../utils/audioEffects';

interface TrainingLabProps {
  sensitivity: SensitivityValues;
}

interface FloatingDamage {
  id: number;
  val: number;
  isHeadshot: boolean;
  x: number;
  y: number;
}

export const TrainingLab: React.FC<TrainingLabProps> = ({ sensitivity }) => {
  const [selectedWeapon, setSelectedWeapon] = useState<WeaponProfile>(WEAPONS_DATABASE[0]);
  const [targetDistance, setTargetDistance] = useState<'close' | 'mid' | 'long'>('mid');
  const [shotsFired, setShotsFired] = useState(0);
  const [headshotsCount, setHeadshotsCount] = useState(0);
  const [floatingDamages, setFloatingDamages] = useState<FloatingDamage[]>([]);
  const [dragFeedback, setDragFeedback] = useState<{
    status: 'headshot' | 'body' | 'miss' | 'ready';
    text: string;
    velocityScore: number;
  }>({
    status: 'ready',
    text: 'Press and drag the Fire Button upward toward the enemy head!',
    velocityScore: 0,
  });

  const [dragPath, setDragPath] = useState<{ x: number; y: number }[]>([]);
  const [isPressingFire, setIsPressingFire] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const fireButtonRef = useRef<HTMLDivElement>(null);

  // Crosshair position animation
  const [crosshairOffset, setCrosshairOffset] = useState({ x: 0, y: 0 });
  const [recoilBloom, setRecoilBloom] = useState(1);

  const resetStats = () => {
    soundEffects.playClickSound();
    setShotsFired(0);
    setHeadshotsCount(0);
    setFloatingDamages([]);
    setDragPath([]);
    setDragFeedback({
      status: 'ready',
      text: 'Stats reset. Tap and drag fire button to begin training.',
      velocityScore: 0,
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    soundEffects.playGunshotSound();
    setIsPressingFire(true);
    const startX = e.clientX;
    const startY = e.clientY;
    dragStartRef.current = { x: startX, y: startY, time: performance.now() };
    setDragPath([{ x: 0, y: 0 }]);
    setCrosshairOffset({ x: 0, y: 0 });
    setRecoilBloom(1.2);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPressingFire || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    setDragPath((prev) => [...prev.slice(-15), { x: dx, y: dy }]);

    // Move crosshair in simulator based on drag and sensitivity
    const sensiFactor = sensitivity.redDot / 50;
    setCrosshairOffset({
      x: dx * 0.4 * sensiFactor,
      y: dy * 0.8 * sensiFactor, // dy is negative when dragging up
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPressingFire || !dragStartRef.current) return;
    setIsPressingFire(false);

    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Safe catch
    }

    const endX = e.clientX;
    const endY = e.clientY;
    const endTime = performance.now();

    const deltaX = endX - dragStartRef.current.x;
    const deltaY = dragStartRef.current.y - endY; // Positive = Dragged UPWARD
    const durationMs = Math.max(25, endTime - dragStartRef.current.time);

    // Velocity in pixels per ms
    const dragVelocity = deltaY / durationMs;

    processShot(deltaX, deltaY, dragVelocity);
  };

  const processShot = (deltaX: number, deltaY: number, velocity: number) => {
    setShotsFired((prev) => prev + 1);

    // Sensitivity multipliers
    const redDotFactor = sensitivity.redDot / 90;
    const generalFactor = sensitivity.general / 90;

    // Effective drag reach
    const effectiveUpwardLift = deltaY * redDotFactor + velocity * 40 * generalFactor;

    // Distance difficulty modifier
    // Close range: needs steep, fast drag (e.g. 50-100px lift)
    // Mid range: needs medium drag (30-70px lift)
    // Long range: needs delicate tap (15-40px lift)
    let minHeadLift = 28;
    let maxHeadLift = 95;

    if (targetDistance === 'close') {
      minHeadLift = 38;
      maxHeadLift = 130;
    } else if (targetDistance === 'long') {
      minHeadLift = 18;
      maxHeadLift = 65;
    }

    // Check hit condition
    const isUpward = deltaY > 8;
    const isAngleCentered = Math.abs(deltaX) < (targetDistance === 'close' ? 70 : 45);

    let isHead = false;
    let isBody = false;
    let feedbackStatus: 'headshot' | 'body' | 'miss' = 'miss';
    let feedbackMsg = '';
    let dmg = 0;

    if (!isUpward || effectiveUpwardLift < minHeadLift * 0.4) {
      // Drag too weak or pressed without drag -> Hit body or stuck on legs
      isBody = true;
      dmg = Math.round(selectedWeapon.baseDamage * (0.85 + Math.random() * 0.2));
      feedbackStatus = 'body';
      feedbackMsg = 'Body shot (Yellow). Drag was too weak! Flick upward faster toward the head.';
      soundEffects.playBodyHitSound();
    } else if (
      effectiveUpwardLift >= minHeadLift &&
      effectiveUpwardLift <= maxHeadLift &&
      isAngleCentered
    ) {
      // Pure Headshot snap!
      isHead = true;
      dmg = Math.round(selectedWeapon.baseDamage * selectedWeapon.headshotMultiplier);
      feedbackStatus = 'headshot';
      feedbackMsg = '🔥 HEADSHOT (Red Numbers)! Perfect snap velocity and vertical trajectory!';
      soundEffects.playHeadshotSound();
      setHeadshotsCount((prev) => prev + 1);
    } else if (effectiveUpwardLift > maxHeadLift) {
      // Overshot into the sky
      feedbackStatus = 'miss';
      feedbackMsg = 'Missed over head! Drag was too violent or sensitivity is over-accelerating.';
      soundEffects.playGunshotSound();
    } else {
      // Sideways spray / body graze
      isBody = true;
      dmg = Math.round(selectedWeapon.baseDamage * 0.7);
      feedbackStatus = 'body';
      feedbackMsg = 'Body graze. Horizontal angle drifted off center. Keep drag vertical.';
      soundEffects.playBodyHitSound();
    }

    setDragFeedback({
      status: feedbackStatus,
      text: feedbackMsg,
      velocityScore: Math.min(100, Math.round(velocity * 80)),
    });

    // Spawn floating damage numbers
    if (isHead || isBody) {
      const newDmg: FloatingDamage = {
        id: Date.now(),
        val: dmg,
        isHeadshot: isHead,
        x: (Math.random() - 0.5) * 30,
        y: isHead ? -80 : -20,
      };
      setFloatingDamages((prev) => [...prev.slice(-4), newDmg]);
    }

    // Reset recoil bloom after delay
    setTimeout(() => {
      setRecoilBloom(1);
      setCrosshairOffset({ x: 0, y: 0 });
    }, 280);
  };

  // Clean floating damages after animation
  useEffect(() => {
    if (floatingDamages.length > 0) {
      const timer = setTimeout(() => {
        setFloatingDamages((prev) => prev.slice(1));
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [floatingDamages]);

  const headshotRate = shotsFired > 0 ? Math.round((headshotsCount / shotsFired) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Simulator Control Header */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1">
              <Crosshair className="w-3.5 h-3.5" />
              <span>Interactive Drag Mechanics Lab</span>
            </div>
            <h2 className="text-xl font-bold text-stone-100 tracking-tight">
              Headshot Drag & Recoil Training Ground
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetStats}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 text-xs font-semibold transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Score</span>
            </button>
          </div>
        </div>

        {/* Weapons & Range Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Weapon Selector */}
          <div>
            <label className="block text-xs font-medium text-stone-400 mb-1.5">
              Select Weapon Discipline:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {WEAPONS_DATABASE.slice(0, 6).map((w) => (
                <button
                  key={w.id}
                  onClick={() => {
                    soundEffects.playClickSound();
                    setSelectedWeapon(w);
                  }}
                  className={`p-2 rounded-xl text-left border text-xs transition-all ${
                    selectedWeapon.id === w.id
                      ? 'bg-amber-500/20 border-amber-500 text-stone-100 font-bold'
                      : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                  }`}
                >
                  <div className="truncate font-semibold">{w.name}</div>
                  <div className="text-[10px] text-stone-500">{w.category}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Engagement Distance Toggle */}
          <div>
            <label className="block text-xs font-medium text-stone-400 mb-1.5">
              Engagement Distance:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'close', label: 'Close (5m)', sub: 'Fast J-Drag' },
                  { id: 'mid', label: 'Mid (15m)', sub: 'Clean Straight' },
                  { id: 'long', label: 'Long (35m)', sub: 'Gentle Tap' },
                ] as const
              ).map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    soundEffects.playClickSound();
                    setTargetDistance(d.id);
                  }}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    targetDistance === d.id
                      ? 'bg-amber-500 text-stone-950 font-bold border-amber-500 shadow-sm'
                      : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <div className="text-xs font-semibold">{d.label}</div>
                  <div className="text-[10px] opacity-80">{d.sub}</div>
                </button>
              ))}
            </div>

            {/* Weapon Tip Notice */}
            <div className="mt-2.5 p-2 rounded-lg bg-stone-950/80 border border-stone-800 text-[11px] text-stone-400">
              <strong className="text-amber-400">Pro Drag Tip: </strong>
              <span>{selectedWeapon.tips}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Target Area (2 Columns) */}
        <div className="lg:col-span-2 bg-stone-950 border border-stone-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[380px]">
          {/* Subtle battlefield background elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-stone-950 to-stone-950 pointer-events-none" />

          {/* Top Scoreboard HUD */}
          <div className="relative z-10 flex items-center justify-between pb-3 border-b border-stone-800/80 text-xs font-mono">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-stone-500 block text-[10px]">TOTAL SHOTS</span>
                <span className="text-lg font-bold text-stone-200 tabular-nums">{shotsFired}</span>
              </div>
              <div className="w-px h-6 bg-stone-800" />
              <div>
                <span className="text-stone-500 block text-[10px]">HEADSHOTS (RED)</span>
                <span className="text-lg font-bold text-rose-500 tabular-nums">{headshotsCount}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-stone-500 block text-[10px]">HEADSHOT RATE</span>
                <span
                  className={`text-2xl font-black tabular-nums ${
                    headshotRate >= 60 ? 'text-amber-400' : 'text-stone-300'
                  }`}
                >
                  {headshotRate}%
                </span>
              </div>
            </div>
          </div>

          {/* Central Target Silhouette (Enemy Standee) */}
          <div className="relative my-auto flex flex-col items-center justify-center py-6 select-none">
            {/* Distance scaling container */}
            <div
              className="relative transition-transform duration-300 flex flex-col items-center"
              style={{
                transform: `scale(${
                  targetDistance === 'close' ? 1.35 : targetDistance === 'long' ? 0.75 : 1.0
                })`,
              }}
            >
              {/* Floating Damage Numbers */}
              {floatingDamages.map((dmg) => (
                <div
                  key={dmg.id}
                  style={{
                    transform: `translate(${dmg.x}px, ${dmg.y}px)`,
                  }}
                  className={`absolute font-black font-mono text-2xl sm:text-3xl pointer-events-none animate-bounce drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] z-40 ${
                    dmg.isHeadshot
                      ? 'text-rose-500 scale-125'
                      : 'text-amber-300'
                  }`}
                >
                  {dmg.val}
                </div>
              ))}

              {/* Enemy Body Anatomy Silhouette */}
              <div className="flex flex-col items-center relative">
                {/* Level 3 Helmet / Head Hitbox */}
                <div
                  className={`w-14 h-14 rounded-full border-2 transition-all flex items-center justify-center relative ${
                    dragFeedback.status === 'headshot'
                      ? 'bg-rose-500/30 border-rose-500 shadow-lg shadow-rose-500/50 scale-105'
                      : 'bg-stone-800/80 border-stone-600'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full border border-stone-500/60" />
                  <span className="absolute -top-5 text-[9px] font-mono text-rose-400 font-bold tracking-wider">
                    HEAD (CRITICAL)
                  </span>
                </div>

                {/* Neck & Chest Hitbox */}
                <div
                  className={`w-24 h-28 mt-1 rounded-t-xl rounded-b-md border transition-all flex flex-col items-center justify-center ${
                    dragFeedback.status === 'body'
                      ? 'bg-amber-500/20 border-amber-500'
                      : 'bg-stone-800/50 border-stone-700/80'
                  }`}
                >
                  <span className="text-[9px] font-mono text-stone-500">CHEST / BODY</span>
                  <div className="w-12 h-1 bg-stone-700 my-1 rounded" />
                </div>

                {/* Legs Hitbox */}
                <div className="flex gap-2 mt-1">
                  <div className="w-10 h-28 bg-stone-800/40 border border-stone-700/60 rounded-b-md" />
                  <div className="w-10 h-28 bg-stone-800/40 border border-stone-700/60 rounded-b-md" />
                </div>

                {/* Dynamic Crosshair with Recoil Bloom */}
                <div
                  className="absolute pointer-events-none transition-transform duration-75 z-30"
                  style={{
                    top: '32px',
                    left: '50%',
                    transform: `translate(calc(-50% + ${crosshairOffset.x}px), calc(-50% + ${crosshairOffset.y}px))`,
                  }}
                >
                  <div
                    className="relative flex items-center justify-center transition-all duration-100"
                    style={{
                      transform: `scale(${recoilBloom})`,
                    }}
                  >
                    {/* Crosshair pips */}
                    <div className="w-1 h-3 bg-white absolute -top-4 rounded-full" />
                    <div className="w-1 h-3 bg-white absolute -bottom-4 rounded-full" />
                    <div className="h-1 w-3 bg-white absolute -left-4 rounded-full" />
                    <div className="h-1 w-3 bg-white absolute -right-4 rounded-full" />
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Live Feedback Banner */}
          <div
            className={`relative z-10 p-3 rounded-xl border transition-all text-xs flex items-center justify-between gap-3 ${
              dragFeedback.status === 'headshot'
                ? 'bg-rose-950/40 border-rose-600/60 text-rose-200'
                : dragFeedback.status === 'body'
                ? 'bg-amber-950/30 border-amber-600/50 text-amber-200'
                : dragFeedback.status === 'miss'
                ? 'bg-stone-900 border-stone-700 text-stone-400'
                : 'bg-stone-900/60 border-stone-800 text-stone-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">
                {dragFeedback.status === 'headshot'
                  ? '🎯'
                  : dragFeedback.status === 'body'
                  ? '⚠️'
                  : dragFeedback.status === 'miss'
                  ? '💨'
                  : 'ℹ️'}
              </span>
              <span className="font-medium leading-tight">{dragFeedback.text}</span>
            </div>

            {dragFeedback.velocityScore > 0 && (
              <span className="text-stone-400 font-mono text-[11px] whitespace-nowrap">
                Drag Velocity: <strong className="text-amber-400">{dragFeedback.velocityScore}%</strong>
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Virtual Fire Button & Drag Pad */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-stone-200 uppercase tracking-wider">
                  Drag Shot Touchpad
                </h3>
              </div>
              <span className="text-[11px] text-amber-400 font-mono">Simulates Free Fire Physics</span>
            </div>

            <p className="text-xs text-stone-400 mb-4 leading-relaxed">
              Place your thumb or mouse on the fire button below. <strong>Swipe up sharply</strong> toward the arrow to
              trigger a headshot. Try a slight curved "J" motion for close range!
            </p>

            {/* Interactive Drag Stage Area */}
            <div className="relative w-full aspect-square max-w-[260px] mx-auto bg-stone-950 rounded-2xl border-2 border-stone-800/80 p-4 flex flex-col items-center justify-end overflow-hidden">
              {/* Upward Swipe Guidance Arrow */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none opacity-40">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                  Drag Upward
                </span>
                <div className="w-0.5 h-12 bg-gradient-to-t from-transparent via-amber-500 to-amber-300 my-1 animate-pulse" />
                <div className="w-2 h-2 border-t-2 border-r-2 border-amber-400 rotate-[-45deg]" />
              </div>

              {/* Real-time Drag Trajectory SVG */}
              {dragPath.length > 1 && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
                  <polyline
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={dragPath
                      .map(
                        (p) =>
                          `${130 + p.x},${200 + p.y}`
                      )
                      .join(' ')}
                  />
                </svg>
              )}

              {/* The Virtual Fire Button */}
              <div
                ref={fireButtonRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className={`relative z-30 w-24 h-24 rounded-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing select-none transition-transform ${
                  isPressingFire ? 'scale-105' : 'hover:scale-102'
                }`}
                style={{
                  background:
                    'radial-gradient(circle at 35% 35%, #fb923c, #ea580c 45%, #9a3412 100%)',
                  boxShadow: isPressingFire
                    ? '0 0 35px rgba(249, 115, 22, 0.7), inset 0 2px 4px rgba(255,255,255,0.4)'
                    : '0 8px 24px rgba(0, 0, 0, 0.6), inset 0 2px 4px rgba(255,255,255,0.3)',
                  border: '3px solid #fdba74',
                }}
              >
                <Crosshair className="w-8 h-8 text-stone-950 stroke-[2.5]" />
                <span className="text-[10px] font-black font-mono text-stone-950 tracking-wider mt-0.5">
                  FIRE & DRAG
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Footer */}
          <div className="mt-4 pt-3 border-t border-stone-800 text-[11px] text-stone-400 space-y-1">
            <div className="flex justify-between">
              <span>Applied General Sensi:</span>
              <strong className="text-amber-400 font-mono">{sensitivity.general}</strong>
            </div>
            <div className="flex justify-between">
              <span>Applied Red Dot Sensi:</span>
              <strong className="text-amber-400 font-mono">{sensitivity.redDot}</strong>
            </div>
            <div className="flex justify-between">
              <span>Drag Style:</span>
              <span className="text-stone-200">{sensitivity.dragSpeedRecommendation}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
