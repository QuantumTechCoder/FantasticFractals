import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, Sparkles, X } from 'lucide-react';

export function SearchableDropdown({
  options,
  value,
  onChange,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const selectedOption = options.find((opt) => opt.id === value) || options[0];

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(['All']);
    options.forEach((opt) => {
      if (opt.category) set.add(opt.category);
    });
    return Array.from(set);
  }, [options]);

  // Filtered options based on search query and category
  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase();
    return options.filter((opt) => {
      const matchesCategory =
        selectedCategory === 'All' || opt.category === selectedCategory;
      const matchesQuery =
        !q ||
        opt.name.toLowerCase().includes(q) ||
        opt.id.toLowerCase().includes(q) ||
        (opt.formula && opt.formula.toLowerCase().includes(q)) ||
        (opt.description && opt.description.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [options, search, selectedCategory]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-900/90 text-slate-100 text-xs rounded-xl px-3 py-2.5 border border-white/15 hover:border-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 flex items-center justify-between font-medium cursor-pointer shadow-inner transition-colors text-left"
      >
        <div className="flex items-center space-x-2 truncate pr-2">
          <span className="truncate font-semibold text-slate-100">
            {selectedOption.name}
          </span>
          <span className="text-[10px] text-indigo-300 font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 truncate">
            {selectedOption.category}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-indigo-400' : ''
          }`}
        />
      </button>

      {/* Floating Searchable Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 glass-panel rounded-2xl border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[380px] animate-in fade-in zoom-in-95 duration-150">
          {/* Search Box Header */}
          <div className="p-2.5 border-b border-white/10 bg-slate-950/60 flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type to find fractal (e.g. snowflake, vicsek, newton)..."
              className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-400 focus:outline-none font-medium"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="px-2.5 py-1.5 border-b border-white/5 bg-black/20 flex items-center space-x-1 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Options List */}
          <div className="overflow-y-auto p-1.5 space-y-1 divide-y divide-white/5 max-h-[260px]">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No fractals matching "{search}"
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.id === value;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onChange(opt.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl text-xs transition flex items-center justify-between group ${
                      isSelected
                        ? 'bg-indigo-600/30 text-white border border-indigo-500/40'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-slate-100 group-hover:text-indigo-200">
                          {opt.name}
                        </span>
                        <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-white/5 text-slate-400">
                          {opt.category}
                        </span>
                      </div>
                      {opt.formula && (
                        <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                          {opt.formula}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Count */}
          <div className="px-3 py-1.5 bg-black/40 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
            <span>Showing {filteredOptions.length} of {options.length} fractals</span>
            <span className="font-mono text-cyan-400">Esc to close</span>
          </div>
        </div>
      )}
    </div>
  );
}
