import React from 'react';

// Collection of ultra cute, crisp vector SVG avatars (Zero emoji dependencies!)
export const AVATAR_OPTIONS = [
  { id: 'ribbon', name: 'Moñito Coquette', color: '#ff65a3' },
  { id: 'kitty', name: 'Gatita Kawaii', color: '#f472b6' },
  { id: 'bunny', name: 'Conejita Dulce', color: '#c084fc' },
  { id: 'sparkle_heart', name: 'Corazón Radiante', color: '#fb7185' },
  { id: 'crown', name: 'Corona Princesa', color: '#f59e0b' },
  { id: 'sakura', name: 'Flor Sakura', color: '#f43f5e' },
  { id: 'coffee', name: 'Café & Latte', color: '#ec4899' },
  { id: 'boutique_bag', name: 'Bolsa Boutique', color: '#a855f7' }
];

export default function CuteAvatar({ id = 'ribbon', size = 36, className = '' }) {
  // If id is a URL, render custom image
  if (typeof id === 'string' && (id.startsWith('http://') || id.startsWith('https://') || id.startsWith('data:image'))) {
    return (
      <img
        src={id}
        alt="avatar"
        style={{ width: `${size}px`, height: `${size}px`, borderRadius: '50%', objectFit: 'cover' }}
        className={className}
      />
    );
  }

  // Normalize legacy emojis to SVG IDs if found in localStorage
  let normId = id;
  if (id === '🎀' || !id) normId = 'ribbon';
  else if (id === '🐱') normId = 'kitty';
  else if (id === '🐰') normId = 'bunny';
  else if (id === '👑') normId = 'crown';
  else if (id === '🌸') normId = 'sakura';
  else if (id === '💖' || id === '❤️') normId = 'sparkle_heart';
  else if (id === '☕') normId = 'coffee';
  else if (id === '🍓' || id === '🛍️') normId = 'boutique_bag';

  const viewBox = "0 0 100 100";

  switch (normId) {
    // 1. Vector Coquette Ribbon Bow
    case 'ribbon':
      return (
        <svg width={size} height={size} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="bowGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ff758c" />
              <stop offset="1" stopColor="#ff4b8b" />
            </linearGradient>
            <linearGradient id="knotGrad" x1="40" y1="40" x2="60" y2="60" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" />
              <stop offset="1" stopColor="#ff9a9e" />
            </linearGradient>
            <filter id="bowGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#ff4b8b" floodOpacity="0.3" />
            </filter>
          </defs>
          <g filter="url(#bowGlow)">
            {/* Left ribbon loop */}
            <path d="M46 50 C25 25 10 38 16 56 C22 72 38 64 46 54 Z" fill="url(#bowGrad)" />
            <path d="M28 44 C20 48 20 54 28 53" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
            {/* Right ribbon loop */}
            <path d="M54 50 C75 25 90 38 84 56 C78 72 62 64 54 54 Z" fill="url(#bowGrad)" />
            <path d="M72 44 C80 48 80 54 72 53" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
            {/* Left ribbon tail */}
            <path d="M44 56 Q32 75 22 84 Q34 80 42 74 Q46 64 48 58 Z" fill="url(#bowGrad)" opacity="0.95" />
            {/* Right ribbon tail */}
            <path d="M56 56 Q68 75 78 84 Q66 80 58 74 Q54 64 52 58 Z" fill="url(#bowGrad)" opacity="0.95" />
            {/* Center knot */}
            <rect x="42" y="44" width="16" height="14" rx="7" fill="url(#knotGrad)" />
            <circle cx="50" cy="51" r="2.5" fill="#ffffff" />
          </g>
        </svg>
      );

    // 2. Vector Kawaii Kitty
    case 'kitty':
      return (
        <svg width={size} height={size} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="catHead" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" />
              <stop offset="1" stopColor="#ffe4ea" />
            </linearGradient>
            <linearGradient id="earPink" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#ff80aa" />
              <stop offset="1" stopColor="#ffb3cc" />
            </linearGradient>
          </defs>
          {/* Left ear */}
          <path d="M24 45 L32 18 L50 32 Z" fill="#ffffff" stroke="#ffb3cc" strokeWidth="2" />
          <path d="M28 42 L34 24 L46 34 Z" fill="url(#earPink)" />
          {/* Right ear */}
          <path d="M76 45 L68 18 L50 32 Z" fill="#ffffff" stroke="#ffb3cc" strokeWidth="2" />
          <path d="M72 42 L66 24 L54 34 Z" fill="url(#earPink)" />
          {/* Head */}
          <ellipse cx="50" cy="56" rx="36" ry="30" fill="url(#catHead)" stroke="#ffccd7" strokeWidth="2" />
          {/* Eyes */}
          <ellipse cx="36" cy="54" rx="3.5" ry="4.5" fill="#3d2b3d" />
          <circle cx="37.5" cy="52.5" r="1.5" fill="#ffffff" />
          <ellipse cx="64" cy="54" rx="3.5" ry="4.5" fill="#3d2b3d" />
          <circle cx="65.5" cy="52.5" r="1.5" fill="#ffffff" />
          {/* Heart nose */}
          <path d="M50 63 C48 60 46 62 50 66 C54 62 52 60 50 63 Z" fill="#ff4b8b" />
          {/* Cute mouth */}
          <path d="M46 66 Q50 69 54 66" stroke="#3d2b3d" strokeWidth="1.8" strokeLinecap="round" />
          {/* Blush cheeks */}
          <circle cx="28" cy="62" r="5" fill="#ff80aa" opacity="0.5" />
          <circle cx="72" cy="62" r="5" fill="#ff80aa" opacity="0.5" />
          {/* Whiskers */}
          <line x1="20" y1="56" x2="10" y2="54" stroke="#ff80aa" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="20" y1="62" x2="10" y2="64" stroke="#ff80aa" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="80" y1="56" x2="90" y2="54" stroke="#ff80aa" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="80" y1="62" x2="90" y2="64" stroke="#ff80aa" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    // 3. Vector Cute Bunny
    case 'bunny':
      return (
        <svg width={size} height={size} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="bunnyGrad" x1="0" y1="0" x2="100" y2="100">
              <stop stopColor="#ffffff" />
              <stop offset="1" stopColor="#fdf0f5" />
            </linearGradient>
          </defs>
          {/* Left ear */}
          <ellipse cx="36" cy="26" rx="9" ry="22" fill="#ffffff" stroke="#ffccd7" strokeWidth="2" />
          <ellipse cx="36" cy="27" rx="5" ry="16" fill="#ff99bb" opacity="0.75" />
          {/* Right ear */}
          <ellipse cx="64" cy="26" rx="9" ry="22" fill="#ffffff" stroke="#ffccd7" strokeWidth="2" />
          <ellipse cx="64" cy="27" rx="5" ry="16" fill="#ff99bb" opacity="0.75" />
          {/* Head */}
          <ellipse cx="50" cy="62" rx="33" ry="28" fill="url(#bunnyGrad)" stroke="#ffccd7" strokeWidth="2" />
          {/* Eyes */}
          <ellipse cx="37" cy="58" rx="3.5" ry="4.5" fill="#3d2b3d" />
          <circle cx="38.5" cy="56.5" r="1.5" fill="#ffffff" />
          <ellipse cx="63" cy="58" rx="3.5" ry="4.5" fill="#3d2b3d" />
          <circle cx="64.5" cy="56.5" r="1.5" fill="#ffffff" />
          {/* Nose */}
          <polygon points="48,65 52,65 50,68" fill="#ff4b8b" />
          {/* Mouth */}
          <path d="M47 69 Q50 72 53 69" stroke="#3d2b3d" strokeWidth="1.8" strokeLinecap="round" />
          {/* Blush */}
          <ellipse cx="27" cy="66" rx="6" ry="4" fill="#ff80aa" opacity="0.55" />
          <ellipse cx="73" cy="66" rx="6" ry="4" fill="#ff80aa" opacity="0.55" />
        </svg>
      );

    // 4. Vector Sparkle Heart
    case 'sparkle_heart':
      return (
        <svg width={size} height={size} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="heartGrad" x1="20" y1="15" x2="80" y2="85" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ff4b8b" />
              <stop offset="1" stopColor="#ff85a2" />
            </linearGradient>
            <filter id="heartShadow">
              <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#ff4b8b" floodOpacity="0.35" />
            </filter>
          </defs>
          <g filter="url(#heartShadow)">
            <path d="M50 82 C20 62 10 44 14 30 C18 16 34 14 46 25 L50 29 L54 25 C66 14 82 16 86 30 C90 44 80 62 50 82 Z" fill="url(#heartGrad)" />
            {/* Gloss highlight */}
            <path d="M24 30 C22 36 24 45 32 54" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.65" />
          </g>
          {/* Sparkles */}
          <polygon points="78,18 80,12 82,18 88,20 82,22 80,28 78,22 72,20" fill="#ffe066" />
          <polygon points="20,22 21,17 22,22 27,23 22,24 21,29 20,24 15,23" fill="#ffe066" />
        </svg>
      );

    // 5. Vector Princess Tiara
    case 'crown':
      return (
        <svg width={size} height={size} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="100" y2="100">
              <stop stopColor="#ffd166" />
              <stop offset="1" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          {/* Base crown band */}
          <path d="M18 72 C35 76 65 76 82 72 L80 64 C65 67 35 67 20 64 Z" fill="url(#goldGrad)" stroke="#d97706" strokeWidth="1.5" />
          {/* Crown peaks */}
          <path d="M20 64 L16 38 L34 52 L50 24 L66 52 L84 38 L80 64 Z" fill="url(#goldGrad)" stroke="#d97706" strokeWidth="1.5" />
          {/* Jewels */}
          <circle cx="50" cy="24" r="5.5" fill="#ff4b8b" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="16" cy="38" r="4.5" fill="#c084fc" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="84" cy="38" r="4.5" fill="#c084fc" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="3" fill="#ffffff" />
          <circle cx="34" cy="54" r="2.5" fill="#ffffff" />
          <circle cx="66" cy="54" r="2.5" fill="#ffffff" />
        </svg>
      );

    // 6. Vector Sakura Blossom
    case 'sakura':
      return (
        <svg width={size} height={size} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="sakuraGrad" x1="0" y1="0" x2="100" y2="100">
              <stop stopColor="#ffb3c6" />
              <stop offset="1" stopColor="#ff5c8a" />
            </linearGradient>
          </defs>
          {/* 5 sakura petals */}
          <g fill="url(#sakuraGrad)">
            {/* Top */}
            <path d="M50 50 C44 32 38 18 50 14 C62 18 56 32 50 50 Z" />
            {/* Top Right */}
            <path d="M50 50 C68 40 82 36 84 48 C82 60 68 56 50 50 Z" />
            {/* Bottom Right */}
            <path d="M50 50 C62 66 70 78 58 84 C48 80 50 66 50 50 Z" />
            {/* Bottom Left */}
            <path d="M50 50 C38 66 30 78 22 72 C18 60 32 56 50 50 Z" />
            {/* Top Left */}
            <path d="M50 50 C32 40 18 36 16 48 C18 60 32 56 50 50 Z" />
          </g>
          {/* Center pistil */}
          <circle cx="50" cy="50" r="7" fill="#ffe066" />
          <circle cx="50" cy="50" r="4" fill="#ff4b8b" />
        </svg>
      );

    // 7. Vector Cute Coffee Cup
    case 'coffee':
      return (
        <svg width={size} height={size} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="cupGrad" x1="20" y1="30" x2="80" y2="85">
              <stop stopColor="#ff758c" />
              <stop offset="1" stopColor="#ff4b8b" />
            </linearGradient>
          </defs>
          {/* Saucer */}
          <ellipse cx="48" cy="84" rx="34" ry="7" fill="#ffb3cc" stroke="#ff758c" strokeWidth="1.5" />
          {/* Cup body */}
          <path d="M22 40 L28 76 C30 82 66 82 68 76 L74 40 Z" fill="url(#cupGrad)" />
          {/* Cup handle */}
          <path d="M72 46 C84 46 86 66 70 68" stroke="#ff4b8b" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Coffee surface */}
          <ellipse cx="48" cy="40" rx="26" ry="6" fill="#78350f" />
          <ellipse cx="48" cy="40" rx="22" ry="4" fill="#fdf2f8" />
          {/* Heart latte foam */}
          <path d="M48 42 C44 38 41 40 43 43 L48 46 L53 43 C55 40 52 38 48 42 Z" fill="#ff758c" />
          {/* Steam */}
          <path d="M40 28 Q44 22 40 16" stroke="#ffb3cc" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M48 26 Q52 18 48 12" stroke="#ffb3cc" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M56 28 Q60 22 56 16" stroke="#ffb3cc" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    // 8. Vector Boutique Bag
    case 'boutique_bag':
    default:
      return (
        <svg width={size} height={size} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="bagGrad" x1="0" y1="0" x2="100" y2="100">
              <stop stopColor="#c084fc" />
              <stop offset="1" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          {/* Handles */}
          <path d="M36 40 C36 22 64 22 64 40" stroke="#f472b6" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          {/* Bag Body */}
          <path d="M20 40 L26 84 C27 88 73 88 74 84 L80 40 Z" fill="url(#bagGrad)" />
          {/* Fold accent */}
          <path d="M20 40 L50 48 L80 40" stroke="#ffffff" strokeWidth="1.5" opacity="0.4" />
          {/* Heart print on bag */}
          <path d="M50 68 C42 60 38 52 42 47 C46 43 50 46 50 48 C50 46 54 43 58 47 C62 52 58 60 50 68 Z" fill="#ffffff" opacity="0.9" />
        </svg>
      );
  }
}
