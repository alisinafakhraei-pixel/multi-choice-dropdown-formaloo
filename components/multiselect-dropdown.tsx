"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Search } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectDropdownProps {
  options: Option[];
  placeholder?: string;
  min?: number;
  max?: number;
  value?: string[];
  onChange?: (values: string[]) => void;
}

export function MultiSelectDropdown({
  options,
  placeholder = "Click to select",
  min,
  max,
  value,
  onChange,
}: MultiSelectDropdownProps) {
  const [selected, setSelected] = useState<string[]>(value ?? []);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  function toggle(val: string) {
    setError(null);
    if (selected.includes(val)) {
      const next = selected.filter((v) => v !== val);
      setSelected(next);
      onChange?.(next);
    } else {
      if (max !== undefined && selected.length >= max) {
        setError(`You can select up to ${max} option${max === 1 ? "" : "s"}`);
        return;
      }
      const next = [...selected, val];
      setSelected(next);
      onChange?.(next);
    }
  }

  function remove(val: string, e: React.MouseEvent) {
    e.stopPropagation();
    setError(null);
    const next = selected.filter((v) => v !== val);
    setSelected(next);
    onChange?.(next);
  }

  const q = search.toLowerCase();
  const filtered = options.filter((o) => o.label.toLowerCase().includes(q));
  const selectedOptions = filtered.filter((o) => selected.includes(o.value));
  const unselectedOptions = filtered.filter((o) => !selected.includes(o.value));
  const showSections = selected.length > 0;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger */}
      <div
        onClick={() => setOpen((p) => !p)}
        className={`min-h-[42px] w-full flex flex-wrap items-center gap-1.5 px-3 py-2 border rounded-lg bg-white cursor-pointer transition-colors ${
          open ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground/40"
        }`}
      >
        {selected.length === 0 ? (
          <span className="text-sm text-muted-foreground flex-1">{placeholder}</span>
        ) : (
          <>
            {selected.map((val) => {
              const opt = options.find((o) => o.value === val);
              return (
                <span
                  key={val}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-xs font-medium text-foreground"
                >
                  {opt?.label ?? val}
                  <button
                    type="button"
                    onClick={(e) => remove(val, e)}
                    className="hover:text-destructive transition-colors ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
            <span className="flex-1" />
          </>
        )}
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg overflow-hidden">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 border-b">
            <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search options..."
              className="flex-1 text-sm outline-none bg-transparent placeholder:text-muted-foreground"
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                No options found
              </div>
            ) : (
              <>
                {showSections && selectedOptions.length > 0 && (
                  <>
                    <div className="px-3 py-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wide bg-secondary/50">
                      Selected
                    </div>
                    {selectedOptions.map((opt) => (
                      <DropdownRow
                        key={opt.value}
                        opt={opt}
                        checked={true}
                        onClick={() => toggle(opt.value)}
                      />
                    ))}
                  </>
                )}
                {showSections && unselectedOptions.length > 0 && (
                  <div className="px-3 py-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wide bg-secondary/50">
                    All options
                  </div>
                )}
                {(showSections ? unselectedOptions : filtered).map((opt) => (
                  <DropdownRow
                    key={opt.value}
                    opt={opt}
                    checked={selected.includes(opt.value)}
                    onClick={() => toggle(opt.value)}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* Validation error */}
      {error && (
        <p className="mt-1.5 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}

function DropdownRow({
  opt,
  checked,
  onClick,
}: {
  opt: Option;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors ${
        checked ? "bg-accent/50" : "hover:bg-secondary"
      }`}
    >
      <span
        className={`w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center transition-colors ${
          checked ? "bg-primary border-primary" : "border-border"
        }`}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className={checked ? "font-medium text-foreground" : "text-foreground/80"}>{opt.label}</span>
    </button>
  );
}
