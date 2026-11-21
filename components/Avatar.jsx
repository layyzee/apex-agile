'use client';

import { useState } from 'react';

const TEAM_PALETTES = {
  elena: {
    initials: 'ER',
    name: 'Elena Rostova',
    bg: 'bg-indigo-600',
    text: 'text-white',
    border: 'border-indigo-400/40',
  },
  marcus: {
    initials: 'MV',
    name: 'Marcus Vance',
    bg: 'bg-emerald-600',
    text: 'text-white',
    border: 'border-emerald-400/40',
  },
  priya: {
    initials: 'PN',
    name: 'Priya Nair',
    bg: 'bg-amber-600',
    text: 'text-white',
    border: 'border-amber-400/40',
  },
  kenji: {
    initials: 'KS',
    name: 'Kenji Sato',
    bg: 'bg-blue-600',
    text: 'text-white',
    border: 'border-blue-400/40',
  },
  balaji: {
    initials: 'BP',
    name: 'Balaji Palani',
    bg: 'bg-teal-600',
    text: 'text-white',
    border: 'border-teal-400/40',
  },
};

function getMemberInfo(name = '') {
  const n = (name || '').toLowerCase();
  if (n.includes('elena')) return TEAM_PALETTES.elena;
  if (n.includes('marcus')) return TEAM_PALETTES.marcus;
  if (n.includes('priya')) return TEAM_PALETTES.priya;
  if (n.includes('kenji')) return TEAM_PALETTES.kenji;
  if (n.includes('balaji')) return TEAM_PALETTES.balaji;

  const parts = (name || 'User').trim().split(/\s+/);
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
  return {
    initials: initials || 'U',
    name: name || 'User',
    bg: 'bg-slate-700',
    text: 'text-white',
    border: 'border-slate-500/40',
  };
}

export default function Avatar({
  name = '',
  src = '',
  size = 'md', // 'xs' (20px), 'sm' (24px), 'md' (32px), 'lg' (40px)
  className = '',
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const member = getMemberInfo(name);

  const sizeClasses = {
    xs: 'w-5 h-5 text-[10px]',
    sm: 'w-6 h-6 text-[11px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm font-semibold',
  }[size] || 'w-8 h-8 text-xs';

  // If the src is from the blocked Google content URL or image fails, use the clean initials badge
  const isBlockedUrl = src && src.includes('googleusercontent.com');
  const shouldUseFallback = !src || imgFailed || isBlockedUrl;

  if (shouldUseFallback) {
    return (
      <div
        title={member.name}
        className={`inline-flex items-center justify-center rounded-full font-bold select-none shrink-0 border ${sizeClasses} ${member.bg} ${member.text} ${member.border} ${className}`}
      >
        <span>{member.initials}</span>
      </div>
    );
  }

  return (
    <div className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 border border-slate-300 dark:border-slate-700 ${sizeClasses} ${className}`}>
      <img
        src={src}
        alt={member.name}
        onError={() => setImgFailed(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
