'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, ShieldAlert } from 'lucide-react';

export default function CommandPalette({
  isOpen,
  onClose,
  issues,
  onSelectIssue,
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filtered = issues.filter((i) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      i.key.toLowerCase().includes(q) ||
      i.title.toLowerCase().includes(q) ||
      (i.assignee && i.assignee.toLowerCase().includes(q))
    );
  });

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      onSelectIssue(filtered[selectedIndex]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center pt-24 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#121215] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in duration-100"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-3.5 border-b border-white/10 bg-zinc-950">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type ticket key (BFSI-101), title, or keyword..."
            className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
          <kbd className="text-[10px] font-mono bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded border border-white/5">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-white/5 p-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-zinc-500">
              No matching issues found for &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((issue, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={issue.id}
                  onClick={() => {
                    onSelectIssue(issue);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-600/20 text-white' : 'text-zinc-300 hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="font-mono text-xs text-blue-400 shrink-0">
                      {issue.key}
                    </span>
                    <span className="text-xs truncate">{issue.title}</span>
                    {issue.is_blocked === 1 && (
                      <ShieldAlert className="w-3 h-3 text-rose-400 shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-[11px] font-mono text-zinc-500">
                    <span>{issue.story_points} pts</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
