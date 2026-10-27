// Inline SVG icons and the animal picture used on the login screen

function pawIcon(color) {
  return `
    <svg viewBox="0 0 24 24" width="28" height="28" fill="${color}" aria-hidden="true">
      <ellipse cx="6" cy="10" rx="2.2" ry="2.8" transform="rotate(-20 6 10)"/>
      <ellipse cx="10.5" cy="5.8" rx="2.2" ry="2.8"/>
      <ellipse cx="15.5" cy="6.4" rx="2.2" ry="2.8" transform="rotate(12 15.5 6.4)"/>
      <ellipse cx="19.2" cy="11" rx="2" ry="2.6" transform="rotate(28 19.2 11)"/>
      <path d="M12.4 11c-3 0-6 3.4-6 6.2 0 2 1.6 2.9 3.4 2.6 1.1-.2 1.7-.5 2.6-.5s1.5.3 2.6.5c1.8.3 3.4-.6 3.4-2.6 0-2.8-3-6.2-6-6.2z"/>
    </svg>`;
}

const ICONS = {
  user: `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#4c2f7a">
      <circle cx="12" cy="7.5" r="4.2"/>
      <path d="M4 21c0-4.4 3.6-7.2 8-7.2s8 2.8 8 7.2z"/>
    </svg>`,

  lock: `
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none">
      <rect x="4.5" y="10.5" width="15" height="10.5" rx="2.2" fill="#f2b84b"/>
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="#8a97a8" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="12" cy="15.7" r="1.6" fill="#a8641a"/>
    </svg>`,

  eye: `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#475569" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>`,

  eyeOff: `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#475569" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 3l18 18M10.6 5.1A9.6 9.6 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.5 6.5C3.8 8.3 2 12 2 12s3.6 7 10 7c1.7 0 3.2-.4 4.5-1M9.9 9.9a3 3 0 0 0 4.2 4.2"/>
    </svg>`,

  signIn: `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <rect x="4.5" y="10.5" width="15" height="10.5" rx="2.2" fill="#f5c26b"/>
      <path d="M8 10.5V8a4 4 0 0 1 7.6-1.7" stroke="#e2e8f0" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="12" cy="15.7" r="1.6" fill="#a8641a"/>
    </svg>`,
};

// A dog, a cat and a rabbit drawn with simple shapes
const LOGIN_ANIMALS = `
  <svg viewBox="0 0 230 175" width="230" height="175" aria-hidden="true">
    <g fill="#e6f2ef">
      <!-- bodies -->
      <ellipse cx="46" cy="118" rx="36" ry="30"/>
      <ellipse cx="116" cy="124" rx="34" ry="28"/>
      <ellipse cx="186" cy="124" rx="34" ry="30"/>
      <!-- dog -->
      <ellipse cx="20" cy="66" rx="12" ry="19" transform="rotate(14 20 66)"/>
      <ellipse cx="72" cy="66" rx="12" ry="19" transform="rotate(-14 72 66)"/>
      <ellipse cx="46" cy="76" rx="30" ry="27"/>
      <!-- cat -->
      <path d="M88 74 100 42l16 16 16-16 12 32z"/>
      <ellipse cx="116" cy="88" rx="31" ry="26"/>
      <!-- rabbit -->
      <ellipse cx="172" cy="48" rx="8" ry="26" transform="rotate(-6 172 48)"/>
      <ellipse cx="200" cy="48" rx="8" ry="26" transform="rotate(6 200 48)"/>
      <ellipse cx="186" cy="94" rx="28" ry="25"/>
    </g>
    <!-- pink ears and noses -->
    <g fill="#f6b8c4">
      <ellipse cx="172" cy="50" rx="3.6" ry="18" transform="rotate(-6 172 50)"/>
      <ellipse cx="200" cy="50" rx="3.6" ry="18" transform="rotate(6 200 50)"/>
      <ellipse cx="46" cy="87" rx="7" ry="5"/>
      <ellipse cx="116" cy="96" rx="5" ry="3.6"/>
      <ellipse cx="186" cy="102" rx="5" ry="3.6"/>
    </g>
    <!-- eyes -->
    <g fill="#0f4d47">
      <ellipse cx="37" cy="74" rx="3.4" ry="3"/>
      <ellipse cx="55" cy="74" rx="3.4" ry="3"/>
      <ellipse cx="105" cy="86" rx="3.4" ry="3"/>
      <ellipse cx="127" cy="86" rx="3.4" ry="3"/>
      <ellipse cx="176" cy="92" rx="3.2" ry="3"/>
      <ellipse cx="196" cy="92" rx="3.2" ry="3"/>
    </g>
    <!-- paw prints under each animal -->
    <g fill="#8fd0c3">
      <circle cx="40" cy="162" r="4"/><circle cx="52" cy="162" r="4"/><circle cx="46" cy="155" r="3.4"/>
      <circle cx="110" cy="164" r="4"/><circle cx="122" cy="164" r="4"/><circle cx="116" cy="157" r="3.4"/>
      <circle cx="180" cy="162" r="4"/><circle cx="192" cy="162" r="4"/><circle cx="186" cy="155" r="3.4"/>
    </g>
  </svg>`;
