import React, { useState, useEffect } from 'react';
import {
  Crosshair,
  Flame,
  Smartphone,
  Shield,
  Layers,
  Sparkles,
  Zap,
  Bookmark,
  ChevronRight,
  Target,
} from 'lucide-react';
import {
  PhoneSpecs,
  PlaystyleMode,
  SensitivityValues,
  HudPreset,
  HudButton,
  SavedSetup,
} from './types';
import { POPULAR_PHONES_DATABASE } from './data/phonesDatabase';
import { HUD_PRESETS } from './data/hudPresets';
import { calculateSensitivity } from './utils/sensitivityCalculator';
import { soundEffects } from './utils/audioEffects';
import { Header } from './components/Header';
import { DeviceSelector } from './components/DeviceSelector';
import { SensitivityCard } from './components/SensitivityCard';
import { HudVisualizer } from './components/HudVisualizer';
import { TrainingLab } from './components/TrainingLab';
import { DragMasterclass } from './components/DragMasterclass';
import { SavedProfilesModal } from './components/SavedProfilesModal';

const HERO_IMAGE_URL = '/src/assets/images/ff_tactical_hero_1791100655719.jpg';
const BADGE_IMAGE_URL = '/src/assets/images/ff_esports_badge_1791100668571.jpg';

export default function App() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'hud' | 'training' | 'guide'>('calculator');
  const [selectedPhone, setSelectedPhone] = useState<PhoneSpecs>(POPULAR_PHONES_DATABASE[0]);
  const [playstyle, setPlaystyle] = useState<PlaystyleMode>('one_tap');
  const [sensitivity, setSensitivity] = useState<SensitivityValues>(() =>
    calculateSensitivity(POPULAR_PHONES_DATABASE[0], 'one_tap')
  );

  const [hudPreset, setHudPreset] = useState<HudPreset>(HUD_PRESETS[0]);
  const [hudButtons, setHudButtons] = useState<HudButton[]>([...HUD_PRESETS[0].buttons]);

  const [savedSetups, setSavedSetups] = useState<SavedSetup[]>(() => {
    try {
      const stored = localStorage.getItem('ff_sensi_saved_setups');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return [
      {
        id: 'default-pro-setup',
        title: 'Competitive Clash Squad One-Tap',
        dateCreated: 'Default Preset',
        phoneSpecs: POPULAR_PHONES_DATABASE[0],
        playstyle: 'one_tap',
        sensitivity: calculateSensitivity(POPULAR_PHONES_DATABASE[0], 'one_tap'),
        hudPresetName: '2-Finger Thumb Master',
      },
    ];
  });

  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto recalculate sensitivity when device or playstyle changes
  const handleSelectPhone = (phone: PhoneSpecs) => {
    setSelectedPhone(phone);
    const newSensi = calculateSensitivity(phone, playstyle);
    setSensitivity(newSensi);
    showToast(`Updated specs for ${phone.model}`);
  };

  const handleSelectPlaystyle = (mode: PlaystyleMode) => {
    setPlaystyle(mode);
    const newSensi = calculateSensitivity(selectedPhone, mode);
    setSensitivity(newSensi);
  };

  const handleResetAll = () => {
    soundEffects.playClickSound();
    const defaultSensi = calculateSensitivity(selectedPhone, playstyle);
    setSensitivity(defaultSensi);
    setHudButtons([...hudPreset.buttons]);
    showToast('Reset sensitivity to default formula');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleSaveProfile = () => {
    const title = prompt('Enter a name for this preset profile:', `${selectedPhone.model} - ${playstyle.toUpperCase()}`);
    if (!title) return;

    const newSetup: SavedSetup = {
      id: `setup-${Date.now()}`,
      title: title.trim(),
      dateCreated: new Date().toLocaleDateString(),
      phoneSpecs: selectedPhone,
      playstyle,
      sensitivity,
      hudPresetName: hudPreset.name,
    };

    const updated = [newSetup, ...savedSetups];
    setSavedSetups(updated);
    try {
      localStorage.setItem('ff_sensi_saved_setups', JSON.stringify(updated));
    } catch {
      // Safe catch
    }
    soundEffects.playClickSound();
    showToast(`Saved preset "${newSetup.title}"!`);
  };

  const handleDeleteSetup = (id: string) => {
    const updated = savedSetups.filter((s) => s.id !== id);
    setSavedSetups(updated);
    try {
      localStorage.setItem('ff_sensi_saved_setups', JSON.stringify(updated));
    } catch {
      // Safe catch
    }
    showToast('Preset removed');
  };

  const handleLoadSetup = (setup: SavedSetup) => {
    setSelectedPhone(setup.phoneSpecs);
    setPlaystyle(setup.playstyle);
    setSensitivity(setup.sensitivity);
    const matchingHud = HUD_PRESETS.find((h) => h.name === setup.hudPresetName) || HUD_PRESETS[0];
    setHudPreset(matchingHud);
    setHudButtons([...matchingHud.buttons]);
    showToast(`Loaded profile "${setup.title}"`);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Top Bar Contract compliant Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedSetups.length}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        onResetAll={handleResetAll}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />

      {/* Floating notification toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 border border-amber-500/80 text-amber-300 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl animate-fade-in flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 space-y-8">
        {/* Dynamic Hero Spotlight Banner (Visible on all tabs as contextual anchor) */}
        <section className="relative rounded-3xl overflow-hidden border border-stone-800/80 shadow-2xl bg-stone-950">
          {/* Hero background image with measured contrast scrim */}
          <div className="absolute inset-0">
            <img
              src={HERO_IMAGE_URL}
              alt="Free Fire Arena Backdrop"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-35 object-center"
              onError={(e) => {
                // Graceful CSS fallback container if asset unavailable
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/85 to-stone-950/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-amber-400">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>Next-Gen Drag Physics & Recoil Calculator</span>
                <span className="text-stone-500">·</span>
                <span className="text-stone-400">OB44 / OB45 Calibrated</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white font-display text-balance">
                Precision Sensitivity & Ergonomic HUD for High-Rate Headshots
              </h1>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
                Select your exact phone model to calculate optimal Free Fire sensitivity values, safe developer DPI,
                fire button size, and pro claw HUD setups tailored to your screen refresh rate and touch sampling.
              </p>
            </div>

            {/* Quick Stats / Active Device Pill */}
            <div className="flex items-center gap-4 bg-stone-900/85 backdrop-blur-md border border-stone-800 rounded-2xl p-4 shrink-0 shadow-lg">
              <div className="w-14 h-14 rounded-xl overflow-hidden border border-amber-500/40 shrink-0 bg-stone-800 flex items-center justify-center">
                <img
                  src={BADGE_IMAGE_URL}
                  alt="Esports Badge"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <div className="space-y-1 text-xs">
                <div className="text-[10px] uppercase font-mono text-stone-400">Selected Device</div>
                <div className="font-bold text-amber-400 text-sm line-clamp-1">{selectedPhone.model}</div>
                <div className="text-stone-300 text-[11px] font-mono">
                  {selectedPhone.refreshRateHz}Hz Display · {selectedPhone.touchSamplingRateHz}Hz Touch
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tab 1: Sensitivity Calculator & DPI Settings */}
        {activeTab === 'calculator' && (
          <div className="space-y-8">
            <DeviceSelector
              selectedPhone={selectedPhone}
              onSelectPhone={handleSelectPhone}
            />

            <SensitivityCard
              phone={selectedPhone}
              playstyle={playstyle}
              onSelectPlaystyle={handleSelectPlaystyle}
              sensitivity={sensitivity}
              onUpdateSensitivity={setSensitivity}
              onSaveProfile={handleSaveProfile}
              onOpenSimulator={() => setActiveTab('training')}
            />
          </div>
        )}

        {/* Tab 2: Custom HUD Visualizer & Claw Architecture */}
        {activeTab === 'hud' && (
          <HudVisualizer
            currentPreset={hudPreset}
            onSelectPreset={setHudPreset}
            buttons={hudButtons}
            onUpdateButtons={setHudButtons}
          />
        )}

        {/* Tab 3: Interactive Headshot Drag Simulator */}
        {activeTab === 'training' && (
          <TrainingLab sensitivity={sensitivity} />
        )}

        {/* Tab 4: Recoil Masterclass & Drag Techniques Guide */}
        {activeTab === 'guide' && (
          <DragMasterclass />
        )}
      </main>

      {/* Saved Presets & Comparison Modal */}
      <SavedProfilesModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedSetups={savedSetups}
        onLoadSetup={handleLoadSetup}
        onDeleteSetup={handleDeleteSetup}
      />

      {/* Quiet, Clean Footer */}
      <footer className="mt-12 border-t border-stone-900 bg-stone-950 py-6 px-4 md:px-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-stone-400">FF Sensi & HUD Pro</span>
            <span>·</span>
            <span>Tournament & Ranked Companion</span>
          </div>

          <p className="text-[11px] text-stone-600 text-center sm:text-right">
            Independent tactical utility designed for mobile gamers. Free Fire is a trademark of Garena.
          </p>
        </div>
      </footer>
    </div>
  );
}
