import React, { useState, useMemo } from 'react';
import { Search, Smartphone, Sliders, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { PhoneBrand, PhoneSpecs } from '../types';
import { POPULAR_PHONES_DATABASE, DEFAULT_CUSTOM_PHONE } from '../data/phonesDatabase';
import { soundEffects } from '../utils/audioEffects';

interface DeviceSelectorProps {
  selectedPhone: PhoneSpecs;
  onSelectPhone: (phone: PhoneSpecs) => void;
}

const BRANDS: (PhoneBrand | 'All')[] = [
  'All',
  'Apple',
  'Samsung',
  'Xiaomi / POCO',
  'Realme',
  'OnePlus',
  'Vivo / iQOO',
  'Infinix',
  'Tecno',
  'ASUS ROG',
  'Motorola',
  'Google Pixel',
  'Other / Custom',
];

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({ selectedPhone, onSelectPhone }) => {
  const [selectedBrand, setSelectedBrand] = useState<PhoneBrand | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCustomEditing, setIsCustomEditing] = useState(false);
  const [customPhone, setCustomPhone] = useState<PhoneSpecs>({ ...DEFAULT_CUSTOM_PHONE });

  const filteredPhones = useMemo(() => {
    return POPULAR_PHONES_DATABASE.filter((phone) => {
      const matchBrand = selectedBrand === 'All' || phone.brand === selectedBrand;
      const matchQuery =
        phone.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        phone.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchBrand && matchQuery;
    });
  }, [selectedBrand, searchQuery]);

  const handleCustomChange = (field: keyof PhoneSpecs, val: string | number) => {
    const updated = { ...customPhone, [field]: val };
    setCustomPhone(updated);
    onSelectPhone(updated);
  };

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
      {/* Background subtle glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Target Hardware Specification</span>
          </div>
          <h2 className="text-xl font-bold text-stone-100 tracking-tight">Select or Configure Phone Model</h2>
        </div>

        {/* Custom phone trigger button */}
        <button
          onClick={() => {
            soundEffects.playClickSound();
            setIsCustomEditing(!isCustomEditing);
            if (!isCustomEditing) {
              onSelectPhone(customPhone);
            }
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isCustomEditing || selectedPhone.id === 'custom-user-phone'
              ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
              : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{isCustomEditing ? 'Custom Specs Active' : 'Enter Custom Phone Specs'}</span>
        </button>
      </div>

      {/* Custom Phone Editor Panel */}
      {isCustomEditing && (
        <div className="mb-5 p-4 rounded-xl bg-stone-950/80 border border-amber-500/30">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold text-stone-200">Custom Phone Hardware Spec Tuner</span>
            </div>
            <span className="text-xs text-amber-400 font-mono">Calibrated in real-time</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-stone-400 mb-1 font-medium">Device Name</label>
              <input
                type="text"
                value={customPhone.model}
                onChange={(e) => handleCustomChange('model', e.target.value)}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-100 focus:outline-none focus:border-amber-500"
                placeholder="e.g. Realme 10 / Redmi Note"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-medium">Screen Refresh Rate</label>
              <select
                value={customPhone.refreshRateHz}
                onChange={(e) => handleCustomChange('refreshRateHz', Number(e.target.value))}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-100 focus:outline-none focus:border-amber-500"
              >
                <option value={60}>60 Hz (Standard)</option>
                <option value={90}>90 Hz (Smooth)</option>
                <option value={120}>120 Hz (Ultra Smooth)</option>
                <option value={144}>144 Hz (Esports)</option>
                <option value={165}>165 Hz (Gaming Ultra)</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-medium">Touch Sampling Rate</label>
              <select
                value={customPhone.touchSamplingRateHz}
                onChange={(e) => handleCustomChange('touchSamplingRateHz', Number(e.target.value))}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-100 focus:outline-none focus:border-amber-500"
              >
                <option value={120}>120 Hz (Basic / Older)</option>
                <option value={180}>180 Hz (Budget standard)</option>
                <option value={240}>240 Hz (Mid-range standard)</option>
                <option value={360}>360 Hz (High responsiveness)</option>
                <option value={480}>480 Hz (Flagship instant)</option>
                <option value={720}>720 Hz (Esports phone)</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-medium">Screen Size (Inches)</label>
              <input
                type="number"
                step="0.1"
                min="5.0"
                max="12.0"
                value={customPhone.screenSizeInches}
                onChange={(e) => handleCustomChange('screenSizeInches', parseFloat(e.target.value) || 6.5)}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-medium">RAM Memory</label>
              <select
                value={customPhone.ramGB}
                onChange={(e) => handleCustomChange('ramGB', Number(e.target.value))}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-100 focus:outline-none focus:border-amber-500"
              >
                <option value={3}>3 GB RAM</option>
                <option value={4}>4 GB RAM</option>
                <option value={6}>6 GB RAM</option>
                <option value={8}>8 GB RAM</option>
                <option value={12}>12 GB RAM</option>
                <option value={16}>16 GB RAM</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-medium">Operating System</label>
              <select
                value={customPhone.os}
                onChange={(e) => handleCustomChange('os', e.target.value as 'android' | 'ios')}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-100 focus:outline-none focus:border-amber-500"
              >
                <option value="android">Android (MIUI, OneUI, ColorOS, etc.)</option>
                <option value="ios">iOS (iPhone / iPad)</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-medium">Default Display DPI</label>
              <input
                type="number"
                min="280"
                max="600"
                value={customPhone.defaultDpi}
                onChange={(e) => handleCustomChange('defaultDpi', parseInt(e.target.value, 10) || 384)}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-medium">Hardware Class Tier</label>
              <select
                value={customPhone.chipsetTier}
                onChange={(e) => handleCustomChange('chipsetTier', e.target.value as PhoneSpecs['chipsetTier'])}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-100 focus:outline-none focus:border-amber-500"
              >
                <option value="budget">Budget / Entry (e.g. Helio G85, SD680)</option>
                <option value="mid">Mid-Range (e.g. Dimensity 7050, SD778G)</option>
                <option value="upper_mid">Upper-Mid (e.g. Dimensity 8300, SD 7+ Gen 2)</option>
                <option value="flagship">Flagship (e.g. SD 8 Gen 2/3, A16/A17)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Brand Filters Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-3">
        {BRANDS.map((brand) => (
          <button
            key={brand}
            onClick={() => {
              soundEffects.playClickSound();
              setSelectedBrand(brand);
              if (brand === 'Other / Custom') {
                setIsCustomEditing(true);
                onSelectPhone(customPhone);
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedBrand === brand
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'bg-stone-800/80 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            {brand}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by phone name (e.g. POCO X6 Pro, iPhone 15, S23 Ultra, Infinix GT, Redmi 12)..."
          className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-200 bg-stone-800 px-1.5 py-0.5 rounded"
          >
            Clear
          </button>
        )}
      </div>

      {/* Device Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[290px] overflow-y-auto pr-1">
        {filteredPhones.map((phone) => {
          const isSelected = selectedPhone.id === phone.id;
          return (
            <button
              key={phone.id}
              onClick={() => {
                soundEffects.playClickSound();
                setIsCustomEditing(false);
                onSelectPhone(phone);
              }}
              className={`p-3 rounded-xl text-left transition-all border relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-950/30 border-amber-500/80 shadow-md shadow-amber-500/10'
                  : 'bg-stone-950/60 border-stone-800/80 hover:bg-stone-800/50 hover:border-stone-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    {phone.brand}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-stone-950 stroke-[3]" />
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-bold text-stone-100 leading-snug line-clamp-1">{phone.model}</h3>
              </div>

              {/* Hardware chips */}
              <div className="mt-2.5 pt-2 border-t border-stone-800/60 flex items-center gap-1.5 text-[11px] text-stone-400 font-mono">
                <span className="text-amber-400 font-semibold">{phone.refreshRateHz}Hz</span>
                <span className="text-stone-600">·</span>
                <span>{phone.touchSamplingRateHz}Hz touch</span>
                <span className="text-stone-600">·</span>
                <span>{phone.screenSizeInches}"</span>
              </div>
            </button>
          );
        })}

        {filteredPhones.length === 0 && (
          <div className="col-span-full py-8 text-center text-stone-500 text-sm">
            <p>No phone found matching "{searchQuery}".</p>
            <button
              onClick={() => {
                soundEffects.playClickSound();
                setIsCustomEditing(true);
                onSelectPhone(customPhone);
              }}
              className="mt-2 text-amber-400 hover:underline text-xs font-semibold"
            >
              Use Custom Hardware Tuner instead →
            </button>
          </div>
        )}
      </div>

      {/* Active Device Summary Bar */}
      <div className="mt-4 pt-3.5 border-t border-stone-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-stone-300 font-semibold">Active Hardware Profile:</span>
          <span className="text-amber-400 font-bold">{selectedPhone.model}</span>
          <span className="text-stone-500">
            ({selectedPhone.refreshRateHz}Hz · {selectedPhone.touchSamplingRateHz}Hz Touch · {selectedPhone.ramGB}GB RAM ·{' '}
            {selectedPhone.os.toUpperCase()})
          </span>
        </div>

        {selectedPhone.notes && (
          <div className="flex items-center gap-1.5 text-stone-400 italic">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="line-clamp-1">{selectedPhone.notes}</span>
          </div>
        )}
      </div>
    </div>
  );
};
