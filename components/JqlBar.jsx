'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X, Sparkles, Bookmark, Check } from 'lucide-react';

export default function JqlBar({
  jqlQuery,
  setJqlQuery,
  matchingCount,
  totalCount,
}) {
  const [inputVal, setInputVal] = useState(jqlQuery || '');
  const [activePreset, setActivePreset] = useState(null);

  const presets = [
    { id: 'p1_bugs', label: 'P1 Critical Bugs', query: "type = 'bug' AND priority = 'critical'" },
    { id: 'blockers', label: 'Active Impediments', query: 'blocked = true' },
    { id: 'heavy_spikes', label: 'Heavy Sizing (>= 8 pts)', query: 'points >= 8' },
    { id: 'missing_ac', label: 'Missing DoR / AC', query: 'ac = false' },
  ];

  const handleApplyPreset = (preset) => {
    if (activePreset === preset.id) {
      setActivePreset(null);
      setInputVal('');
      setJqlQuery('');
    } else {
      setActivePreset(preset.id);
      setInputVal(preset.query);
      setJqlQuery(preset.query);
    }
  };

  const handleClear = () => {
    setInputVal('');
    setJqlQuery('');
    setActivePreset(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setJqlQuery(inputVal.trim());
    } else if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className="bg-[#0c0c0e] border-b border-white/[0.05] px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* JQL Search Input */}
      <div className="flex items-center gap-2 flex-1 min-w-[280px] max-w-2xl">
        <div className="relative w-full flex items-center">
          <span className="absolute left-2.5 text-[10px] font-mono font-bold text-blue-400 select-none">
            JQL
          </span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              setJqlQuery(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder="e.g. status = 'Done' AND points >= 5 AND priority = 'critical'"
            className="w-full bg-zinc-950/80 border border-white/[0.07] hover:border-white/[0.14] focus:border-blue-500/80 rounded-lg pl-10 pr-8 py-1.5 text-xs text-zinc-100 font-mono placeholder:text-zinc-600 focus:outline-none transition-colors"
          />
          {inputVal && (
            <button
              onClick={handleClear}
              className="absolute right-2 p-1 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Results Counter */}
        {inputVal && (
          <span className="text-[11px] font-mono text-zinc-400 shrink-0">
            {matchingCount} / {totalCount} matching
          </span>
        )}
      </div>

      {/* Preset Filter Chips */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] font-mono text-zinc-500 mr-1 hidden sm:inline">Presets:</span>
        {presets.map((p) => {
          const isActive = activePreset === p.id;
          return (
            <button
              key={p.id}
              onClick={() => handleApplyPreset(p)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors border ${
                isActive
                  ? 'bg-blue-600/20 text-blue-300 border-blue-500/30 font-medium'
                  : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border-white/[0.04]'
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
