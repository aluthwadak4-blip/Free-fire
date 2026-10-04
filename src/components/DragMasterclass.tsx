import React from 'react';
import {
  Compass,
  Zap,
  Shield,
  Target,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { soundEffects } from '../utils/audioEffects';

export const DragMasterclass: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* 1. Header Hero Banner */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Esports Pro Mechanics Manual</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-100 tracking-tight mb-2">
              Free Fire Headshot Physics & Recoil Science
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              In Free Fire, auto-aim naturally pulls crosshairs toward the chest. To consistently trigger red headshots,
              you must understand how drag angle, drag velocity, and bullet bloom intersect with your device hardware.
            </p>
          </div>
        </div>
      </div>

      {/* 2. The 3 Golden Drag Techniques */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-stone-100">The 3 Fundamental Drag Shot Techniques</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Technique 1: Straight Up Drag */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-mono font-bold text-xs flex items-center justify-center border border-amber-500/30">
                  01
                </span>
                <span className="text-[11px] font-mono text-stone-400">Mid to Long Range</span>
              </div>

              <h4 className="text-base font-bold text-stone-100 mb-2">Straight Up Drag</h4>
              <p className="text-xs text-stone-400 leading-relaxed mb-4">
                Used when the target is stationary, crouched, or running directly toward or away from you.
              </p>

              {/* Visual Diagram */}
              <div className="h-32 bg-stone-950 rounded-xl border border-stone-800 p-3 flex flex-col items-center justify-between relative overflow-hidden mb-3">
                <span className="text-[10px] text-stone-500 font-mono uppercase">Trajectory</span>
                <div className="relative flex flex-col items-center my-auto">
                  <div className="w-3 h-3 rounded-full bg-rose-500 shadow-md shadow-rose-500/50" />
                  <div className="w-0.5 h-14 bg-gradient-to-t from-amber-500 to-rose-500 my-1 animate-pulse" />
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-[10px] text-amber-300 font-bold">
                    FIRE
                  </div>
                </div>
                <span className="text-[10px] font-mono text-amber-400">Pure 90° Vertical Swipe</span>
              </div>
            </div>

            <div className="text-[11px] text-stone-300 pt-3 border-t border-stone-800 space-y-1">
              <strong className="text-amber-400 block">Recommended Weapons:</strong>
              <span>Woodpecker, SVD, AC80, SCAR, UMP (at 20m+)</span>
            </div>
          </div>

          {/* Technique 2: Rotation / J-Drag */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-mono font-bold text-xs flex items-center justify-center border border-amber-500/30">
                  02
                </span>
                <span className="text-[11px] font-mono text-stone-400">Close to Mid Range</span>
              </div>

              <h4 className="text-base font-bold text-stone-100 mb-2">Rotation Drag (J-Drag)</h4>
              <p className="text-xs text-stone-400 leading-relaxed mb-4">
                Used when the target is sprinting laterally (crossing left or right). You must curve the drag in the
                direction they are moving to intercept head level.
              </p>

              {/* Visual Diagram */}
              <div className="h-32 bg-stone-950 rounded-xl border border-stone-800 p-3 flex flex-col items-center justify-between relative overflow-hidden mb-3">
                <span className="text-[10px] text-stone-500 font-mono uppercase">Trajectory</span>
                <div className="relative w-28 h-16 my-auto flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 60">
                    <path
                      d="M 30,50 Q 55,55 60,35 Q 65,15 80,10"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <circle cx="80" cy="10" r="4" fill="#f43f5e" />
                    <circle cx="30" cy="50" r="6" fill="#f59e0b" />
                  </svg>
                </div>
                <span className="text-[10px] font-mono text-amber-400">Curved "J" Sweep into Target Head</span>
              </div>
            </div>

            <div className="text-[11px] text-stone-300 pt-3 border-t border-stone-800 space-y-1">
              <strong className="text-amber-400 block">Recommended Weapons:</strong>
              <span>M1887, MP40, Thompson, Charge Buster</span>
            </div>
          </div>

          {/* Technique 3: Down-Up Hook Drag */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-mono font-bold text-xs flex items-center justify-center border border-amber-500/30">
                  03
                </span>
                <span className="text-[11px] font-mono text-stone-400">Point Blank (0-5m)</span>
              </div>

              <h4 className="text-base font-bold text-stone-100 mb-2">Down-Up Hook Drag</h4>
              <p className="text-xs text-stone-400 leading-relaxed mb-4">
                At point-blank range, auto-aim locks rigidly onto enemy ribs. Preload by dipping the button down 5% to
                break aim-assist stickiness, then flick violently upward!
              </p>

              {/* Visual Diagram */}
              <div className="h-32 bg-stone-950 rounded-xl border border-stone-800 p-3 flex flex-col items-center justify-between relative overflow-hidden mb-3">
                <span className="text-[10px] text-stone-500 font-mono uppercase">Trajectory</span>
                <div className="relative w-28 h-16 my-auto flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 60">
                    <path
                      d="M 50,30 L 50,45 Q 50,55 60,35 L 75,5"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <circle cx="75" cy="5" r="4" fill="#f43f5e" />
                    <circle cx="50" cy="30" r="5" fill="#f59e0b" />
                  </svg>
                </div>
                <span className="text-[10px] font-mono text-amber-400">Quick Dip Down &gt; Sharp Upward Flick</span>
              </div>
            </div>

            <div className="text-[11px] text-stone-300 pt-3 border-t border-stone-800 space-y-1">
              <strong className="text-amber-400 block">Recommended Weapons:</strong>
              <span>Desert Eagle, M1014, MAG-7, Mini Uzi</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sit-Down Fast Gloo Wall Combo */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-stone-100">
            The 0.2s Pro "Sit-Down" Fast Gloo Wall Combo
          </h3>
        </div>
        <p className="text-xs text-stone-400 mb-5 leading-relaxed">
          Dropping a gloo wall while standing leaves a vulnerable gap beneath your feet where snipers can toe-shot you.
          The competitive "Sit-Down" combo drops the shield directly against your knees in one seamless motion:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[
            {
              step: '1',
              title: 'FIRE SHOT',
              desc: 'Execute upward drag headshot with Right Thumb.',
              color: 'border-amber-500/40 text-amber-400',
            },
            {
              step: '2',
              title: 'DRAG DOWN',
              desc: 'Immediately drag crosshair straight down to the dirt.',
              color: 'border-amber-500/40 text-amber-400',
            },
            {
              step: '3',
              title: 'TAP GLOO',
              desc: 'Hit Gloo Wall button with Left Thumb.',
              color: 'border-cyan-500/40 text-cyan-400',
            },
            {
              step: '4',
              title: 'CROUCH',
              desc: 'Press Crouch with Right Thumb to lower posture.',
              color: 'border-cyan-500/40 text-cyan-400',
            },
            {
              step: '5',
              title: 'DEPLOY WALL',
              desc: 'Tap Left Fire button (or trigger) to plant wall instantly.',
              color: 'border-emerald-500/40 text-emerald-400',
            },
          ].map((s) => (
            <div
              key={s.step}
              className={`p-3.5 rounded-xl bg-stone-950 border ${s.color} flex flex-col justify-between`}
            >
              <div>
                <span className="text-xs font-mono font-bold opacity-60">STEP {s.step}</span>
                <h4 className="text-sm font-black font-mono mt-0.5 mb-1.5">{s.title}</h4>
                <p className="text-[11px] text-stone-400 leading-snug">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Recoil Bloom & The 3-Bullet Rule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-stone-100">
              Recoil Bloom & The 3-Bullet Rule
            </h3>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed mb-4">
            In Free Fire, every weapon features an invisible crosshair expansion coefficient called <em>Recoil Bloom</em>.
            When you hold down the fire button continuously:
          </p>

          <ul className="space-y-2.5 text-xs text-stone-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <span>
                <strong>Bullets 1 to 3:</strong> 100% laser accuracy. Auto-aim drag can easily snap to the helmet.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <span>
                <strong>Bullets 4 to 7:</strong> Crosshair expands by 200%. Bullets spray randomly around the enemy shoulders.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
              <span>
                <strong>Bullets 8+:</strong> Maximum bloom. Even if your crosshair is directly on the head, shots will outline the target!
              </span>
            </li>
          </ul>

          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
            <strong>The Pro Fix:</strong> Fire in controlled bursts of 3-4 bullets. Release the fire button for just 0.15s,
            tap sprint or crouch to instantly reset bloom to zero, and resume dragging!
          </div>
        </div>

        {/* Hardware & Touch Optimization Tips */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-stone-100">
              Hardware & Screen Surface Optimization
            </h3>
          </div>

          <div className="space-y-3 text-xs text-stone-300">
            <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800">
              <h4 className="font-bold text-stone-200 mb-1">Finger Sleeves / Baby Powder:</h4>
              <p className="text-stone-400 leading-snug">
                Friction is the #1 enemy of drag shots. Carbon fiber gaming finger sleeves reduce surface thumb friction
                by 70%, allowing effortless micro-velocity flicking.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800">
              <h4 className="font-bold text-stone-200 mb-1">Touch Sampling Rate Settings:</h4>
              <p className="text-stone-400 leading-snug">
                On Xiaomi (Game Turbo), Realme (GT Mode), Samsung (Touch Sensitivity toggle in Display), and Infinix (X-Boost),
                ensure Touch Response and Aim Sensitivity are set to 100% to minimize input latency.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800">
              <h4 className="font-bold text-stone-200 mb-1">Screen Protector Choice:</h4>
              <p className="text-stone-400 leading-snug">
                Matte glass screen protectors offer consistent drag gliding without fingerprint resistance compared to
                glossy tempered glass that gets sticky when warm.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
