import React, { useState } from 'react';
import {
  X,
  Bookmark,
  Trash2,
  Check,
  ArrowRight,
  Sliders,
  Scale,
  Download,
  Upload,
} from 'lucide-react';
import { SavedSetup } from '../types';
import { soundEffects } from '../utils/audioEffects';

interface SavedProfilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedSetups: SavedSetup[];
  onLoadSetup: (setup: SavedSetup) => void;
  onDeleteSetup: (id: string) => void;
}

export const SavedProfilesModal: React.FC<SavedProfilesModalProps> = ({
  isOpen,
  onClose,
  savedSetups,
  onLoadSetup,
  onDeleteSetup,
}) => {
  const [compareIds, setCompareIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const toggleCompare = (id: string) => {
    soundEffects.playClickSound();
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter((x) => x !== id));
    } else {
      if (compareIds.length >= 2) {
        setCompareIds([compareIds[1], id]);
      } else {
        setCompareIds([...compareIds, id]);
      }
    }
  };

  const setupA = savedSetups.find((s) => s.id === compareIds[0]);
  const setupB = savedSetups.find((s) => s.id === compareIds[1]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-stone-100">Saved Sensitivity & HUD Profiles</h3>
            <span className="text-xs font-mono text-stone-400 bg-stone-800 px-2 py-0.5 rounded-full">
              {savedSetups.length} stored
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {savedSetups.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-sm">
              <Bookmark className="w-10 h-10 mx-auto mb-2 opacity-30 text-amber-400" />
              <p className="text-stone-300 font-semibold mb-1">No custom presets saved yet.</p>
              <p className="text-xs text-stone-500">
                Configure your phone model & sensitivity sliders, then click "Save Preset" to save it here!
              </p>
            </div>
          ) : (
            <>
              {/* Compare Banner */}
              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-stone-300">
                  <Scale className="w-4 h-4 text-amber-400" />
                  <span>
                    Select any <strong>2 profiles</strong> to compare sensitivities and specs side-by-side:
                  </span>
                </div>
                <span className="font-mono text-amber-400 font-semibold">
                  {compareIds.length}/2 selected
                </span>
              </div>

              {/* Side-by-side comparison card if 2 selected */}
              {setupA && setupB && (
                <div className="p-4 rounded-xl bg-stone-950 border border-amber-500/40 text-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-800 font-bold text-sm">
                    <span className="text-amber-400">{setupA.title}</span>
                    <span className="text-stone-500 font-mono text-xs">VS</span>
                    <span className="text-amber-400">{setupB.title}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-1 text-center border-b border-stone-800/60 font-mono">
                    <span className="text-left font-sans text-stone-400">Device Model</span>
                    <span className="text-stone-200 truncate">{setupA.phoneSpecs.model}</span>
                    <span className="text-stone-200 truncate">{setupB.phoneSpecs.model}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-1 text-center border-b border-stone-800/60 font-mono">
                    <span className="text-left font-sans text-stone-400">General</span>
                    <span className="text-amber-400 font-bold">{setupA.sensitivity.general}</span>
                    <span className="text-amber-400 font-bold">{setupB.sensitivity.general}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-1 text-center border-b border-stone-800/60 font-mono">
                    <span className="text-left font-sans text-stone-400">Red Dot</span>
                    <span className="text-amber-400 font-bold">{setupA.sensitivity.redDot}</span>
                    <span className="text-amber-400 font-bold">{setupB.sensitivity.redDot}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-1 text-center border-b border-stone-800/60 font-mono">
                    <span className="text-left font-sans text-stone-400">2x Scope</span>
                    <span className="text-stone-200">{setupA.sensitivity.scope2x}</span>
                    <span className="text-stone-200">{setupB.sensitivity.scope2x}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-1 text-center border-b border-stone-800/60 font-mono">
                    <span className="text-left font-sans text-stone-400">Fire Button</span>
                    <span className="text-stone-200">{setupA.sensitivity.fireButtonSize}%</span>
                    <span className="text-stone-200">{setupB.sensitivity.fireButtonSize}%</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-1 text-center font-mono">
                    <span className="text-left font-sans text-stone-400">Recommended DPI</span>
                    <span className="text-emerald-400">{setupA.sensitivity.recommendedDpi}</span>
                    <span className="text-emerald-400">{setupB.sensitivity.recommendedDpi}</span>
                  </div>
                </div>
              )}

              {/* Profiles List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {savedSetups.map((setup) => {
                  const isCompared = compareIds.includes(setup.id);
                  return (
                    <div
                      key={setup.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        isCompared
                          ? 'bg-amber-950/20 border-amber-500/80'
                          : 'bg-stone-950/80 border-stone-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-semibold uppercase text-stone-400">
                            {setup.playstyle.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-stone-500 font-mono">{setup.dateCreated}</span>
                        </div>

                        <h4 className="text-sm font-bold text-stone-100">{setup.title}</h4>
                        <p className="text-xs text-amber-400 font-medium mb-3">
                          {setup.phoneSpecs.model}
                        </p>

                        {/* Quick values pills */}
                        <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[11px] p-2 rounded-lg bg-stone-900 border border-stone-800/80 mb-3">
                          <div>
                            <span className="text-[9px] text-stone-500 block">GEN</span>
                            <span className="font-bold text-stone-200">{setup.sensitivity.general}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-stone-500 block">RED</span>
                            <span className="font-bold text-amber-400">{setup.sensitivity.redDot}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-stone-500 block">FIRE BTN</span>
                            <span className="font-bold text-stone-200">{setup.sensitivity.fireButtonSize}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-xs">
                        <button
                          onClick={() => toggleCompare(setup.id)}
                          className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                            isCompared
                              ? 'bg-amber-500 text-stone-950 font-bold'
                              : 'text-stone-400 hover:text-stone-200 bg-stone-900'
                          }`}
                        >
                          {isCompared ? 'Comparing' : 'Compare'}
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              soundEffects.playClickSound();
                              onLoadSetup(setup);
                              onClose();
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors"
                          >
                            <span>Load</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>

                          <button
                            onClick={() => {
                              soundEffects.playClickSound();
                              onDeleteSetup(setup.id);
                            }}
                            className="p-1 rounded text-stone-500 hover:text-rose-400 hover:bg-stone-900 transition-colors"
                            title="Delete Profile"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-stone-950 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
