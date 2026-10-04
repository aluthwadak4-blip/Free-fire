import { PhoneSpecs, PlaystyleMode, SensitivityValues } from '../types';

/**
 * Calculates scientifically tuned Free Fire sensitivity settings
 * tailored to screen diagonal, touch sampling rate, display refresh rate,
 * operating system latency profile, and preferred playstyle.
 */
export function calculateSensitivity(phone: PhoneSpecs, playstyle: PlaystyleMode): SensitivityValues {
  // Base calculations based on hardware characteristics
  let baseGeneral = 95;
  let baseRedDot = 92;
  let base2x = 88;
  let base4x = 82;
  let baseSniper = 62;
  let baseFreeLook = 80;

  // 1. Hardware Screen Size Adjustment (Large screens require slightly lower values to prevent over-drag)
  if (phone.screenSizeInches >= 8.0) {
    // Tablets (iPad, Galaxy Tab)
    baseGeneral = 80;
    baseRedDot = 78;
    base2x = 74;
    base4x = 68;
    baseSniper = 48;
    baseFreeLook = 70;
  } else if (phone.screenSizeInches >= 6.7) {
    // Large phones (iPhone Pro Max, S24 Ultra, POCO X6 Pro)
    baseGeneral = 94;
    baseRedDot = 91;
  } else if (phone.screenSizeInches <= 6.2) {
    // Compact screens (iPhone 13 mini, 12, S22 small)
    baseGeneral = 99;
    baseRedDot = 97;
  }

  // 2. Touch Sampling Rate & Refresh Rate Calibration
  // High touch sampling (360Hz - 720Hz) registers thumb drag instantly.
  // Low touch sampling (120Hz - 180Hz) requires maximum sensitivity to compensate.
  if (phone.touchSamplingRateHz >= 480) {
    baseGeneral -= 3;
    baseRedDot -= 2;
  } else if (phone.touchSamplingRateHz <= 180) {
    baseGeneral += 4;
    baseRedDot += 5;
    base2x += 4;
  }

  if (phone.refreshRateHz >= 144) {
    baseGeneral -= 2;
  } else if (phone.refreshRateHz <= 60) {
    baseGeneral += 3;
    baseRedDot += 3;
  }

  // 3. Operating System Latency Curve
  if (phone.os === 'ios') {
    // iOS has built-in touch acceleration curve
    baseRedDot = Math.min(baseRedDot, 94);
    baseGeneral = Math.min(baseGeneral, 96);
  }

  // 4. Playstyle adjustments
  let fireBtnSize = 48;
  let fireBtnPos = 'Lower Right (22% from bottom)';
  let dragSpeed: 'Light & Fast' | 'Medium Snap' | 'Heavy Long Drag' = 'Medium Snap';

  switch (playstyle) {
    case 'one_tap':
      // One-Tap headshot (M1887, Desert Eagle, Woodpecker):
      // Needs rapid vertical flick. High General and Red Dot. Smaller fire button placed lower.
      baseGeneral = Math.min(100, baseGeneral + 4);
      baseRedDot = Math.min(100, baseRedDot + 5);
      base2x = Math.min(100, base2x + 2);
      fireBtnSize = phone.screenSizeInches >= 6.7 ? 44 : 48;
      fireBtnPos = 'Lower Right (18% from bottom, generous upward drag room)';
      dragSpeed = 'Light & Fast';
      break;

    case 'spray_control':
      // Full-Auto (MP40, UMP, SCAR):
      // Needs controlled drag so crosshair doesn't climb above the helmet.
      baseGeneral = Math.max(85, baseGeneral - 3);
      baseRedDot = Math.max(82, baseRedDot - 4);
      base2x = Math.max(78, base2x - 3);
      base4x = Math.max(72, base4x - 4);
      fireBtnSize = 54;
      fireBtnPos = 'Mid-Lower Right (24% from bottom, stable thumb anchor)';
      dragSpeed = 'Medium Snap';
      break;

    case 'rusher_cqc':
      // Close Quarters Rusher:
      // Maximum turnaround speed for 360 Gloo Wall, jump-shots, and slide mechanics.
      baseGeneral = 100;
      baseRedDot = Math.min(100, baseRedDot + 4);
      baseFreeLook = 95;
      fireBtnSize = 46;
      fireBtnPos = 'Lower Right (20% from bottom)';
      dragSpeed = 'Light & Fast';
      break;

    case 'sniper_pro':
      // Long-range sniper quick switch (AWM, M82B, Barrett):
      // Slower sniper scope for micro-flicks; moderate General for spotting.
      baseSniper = 48;
      base4x = 76;
      baseGeneral = 92;
      fireBtnSize = 52;
      fireBtnPos = 'Standard Right (25% from bottom)';
      dragSpeed = 'Heavy Long Drag';
      break;

    case 'all_round':
    default:
      // Balanced CS & BR ranked
      fireBtnSize = phone.screenSizeInches >= 6.7 ? 48 : 52;
      fireBtnPos = 'Lower Right (22% from bottom)';
      dragSpeed = 'Medium Snap';
      break;
  }

  // 5. Hardware-specific fire button tuning
  // If budget phone with lower touch sampling, bigger fire button prevents thumb miss
  if (phone.chipsetTier === 'budget') {
    fireBtnSize = Math.min(62, fireBtnSize + 6);
  }

  // 6. Safe Recommended DPI calculation
  let recommendedDpi = phone.defaultDpi;
  if (phone.os === 'android') {
    // Add safe DPI margin: ~80-120 DPI increase without risking crash or boot-loop
    const targetDpi = phone.defaultDpi + (phone.chipsetTier === 'budget' ? 50 : 90);
    recommendedDpi = Math.min(targetDpi, phone.maxSafeDpi);
  }

  // Pointer speed recommendation
  const pointerSpeed = phone.touchSamplingRateHz >= 360
    ? 'Standard (Default 5th / 6th notch)'
    : 'Boosted (+2 to +3 notches to right or Maximum)';

  return {
    general: clamp(Math.round(baseGeneral), 60, 100),
    redDot: clamp(Math.round(baseRedDot), 60, 100),
    scope2x: clamp(Math.round(base2x), 50, 100),
    scope4x: clamp(Math.round(base4x), 45, 100),
    sniperScope: clamp(Math.round(baseSniper), 30, 95),
    freeLook: clamp(Math.round(baseFreeLook), 50, 100),
    fireButtonSize: fireBtnSize,
    fireButtonPosition: fireBtnPos,
    recommendedDpi,
    pointerSpeed,
    dragSpeedRecommendation: dragSpeed,
  };
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}
