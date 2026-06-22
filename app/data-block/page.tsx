"use client";

import { useState, useRef } from "react";
import {
  RefreshCw, SlidersHorizontal, Filter, Edit2,
  Plus, ArrowUpDown, Maximize2, MoreHorizontal, X, CheckSquare
} from "lucide-react";

const DEFAULT_CHIP_COLORS: Record<string, string> = {
  "Minimal & Clean":        "#3b82f6",
  "Dark Mode / Sleek":      "#8b5cf6",
  "Retro / Vintage":        "#f97316",
  "Vibrant & Colorful":     "#ec4899",
  "Cozy & Low-key":         "#22c55e",
  "High-Energy / Creative": "#14b8a6",
  "Industrial & Brutalist": "#6b7280",
  "Work meetings":          "#3b82f6",
  "Casual outings":         "#22c55e",
  "Formal events":          "#8b5cf6",
  "Outdoor activities":     "#14b8a6",
  "Travel":                 "#f97316",
  "Staying home":           "#ec4899",
};

function hexToLight(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},0.13)`;
}

const ALL_OPTIONS = [
  "Minimal & Clean", "Dark Mode / Sleek", "Retro / Vintage",
  "Vibrant & Colorful", "Cozy & Low-key", "High-Energy / Creative", "Industrial & Brutalist",
];

const RESPONSES = [
  { id: 1, name: "Sara K.", email: "sara@example.com",
    aesthetic: ["Dark Mode / Sleek", "Retro / Vintage", "Vibrant & Colorful"],
    occasions: ["Work meetings", "Casual outings"], submitted: "22 Jun 2026" },
  { id: 2, name: "James T.", email: "james@example.com",
    aesthetic: ["Minimal & Clean"],
    occasions: ["Formal events", "Travel"], submitted: "22 Jun 2026" },
  { id: 3, name: "Priya M.", email: "priya@example.com",
    aesthetic: ["Vibrant & Colorful", "High-Energy / Creative"],
    occasions: ["Outdoor activities", "Casual outings", "Staying home"], submitted: "21 Jun 2026" },
  { id: 4, name: "Leo B.", email: "leo@example.com",
    aesthetic: ["Industrial & Brutalist", "Dark Mode / Sleek"],
    occasions: ["Work meetings", "Formal events"], submitted: "21 Jun 2026" },
  { id: 5, name: "Chloe W.", email: "chloe@example.com",
    aesthetic: ["Cozy & Low-key", "Retro / Vintage"],
    occasions: ["Staying home", "Casual outings"], submitted: "20 Jun 2026" },
  { id: 6, name: "Arjun S.", email: "arjun@example.com",
    aesthetic: ["Minimal & Clean", "Dark Mode / Sleek", "Industrial & Brutalist"],
    occasions: ["Work meetings", "Travel"], submitted: "20 Jun 2026" },
  { id: 7, name: "Nina P.", email: "nina@example.com",
    aesthetic: ["High-Energy / Creative", "Vibrant & Colorful"],
    occasions: ["Casual outings", "Outdoor activities"], submitted: "19 Jun 2026" },
];

function Chip({ label, onClick, active, chipColors }: { label: string; onClick?: () => void; active?: boolean; chipColors?: Record<string, string> }) {
  const hex = (chipColors ?? DEFAULT_CHIP_COLORS)[label] ?? "#6b7280";
  const bg = hexToLight(hex);
  return (
    <span
      onClick={onClick}
      style={{ background: bg, color: hex, outline: active ? `2px solid ${hex}` : undefined, outlineOffset: active ? "2px" : undefined }}
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-all select-none ${active ? "" : "hover:opacity-80"}`}
    >
      {label}
    </span>
  );
}

export default function DataBlockPage() {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [chipColors, setChipColors] = useState<Record<string, string>>(DEFAULT_CHIP_COLORS);
  const colorInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  function toggleFilter(label: string) {
    setActiveFilters((prev) =>
      prev.includes(label) ? prev.filter((f) => f !== label) : [...prev, label]
    );
  }

  const filtered = activeFilters.length === 0
    ? RESPONSES
    : RESPONSES.filter((r) =>
        activeFilters.every((f) => r.aesthetic.includes(f) || r.occasions.includes(f))
      );

  return (
    <div className="flex h-full bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <div className="border-b px-5 py-2 flex items-center gap-3 text-sm flex-shrink-0">
          <span className="text-muted-foreground text-xs">Responses</span>
          <span className="text-muted-foreground text-xs">/</span>
          <span className="font-medium text-xs">Appointment Form</span>
          <div className="ml-auto flex items-center gap-1">
            <button className="flex items-center gap-1 px-2 py-1 rounded text-xs text-muted-foreground hover:bg-secondary transition-colors">
              <RefreshCw className="w-3 h-3" /> Sync
            </button>
            <button className="flex items-center gap-1 px-2 py-1 rounded text-xs text-muted-foreground hover:bg-secondary transition-colors">
              <ArrowUpDown className="w-3 h-3" /> Sort
            </button>
            <button className="flex items-center gap-1 px-2 py-1 rounded text-xs text-muted-foreground hover:bg-secondary transition-colors">
              <Filter className="w-3 h-3" /> Filter
            </button>
            <button className="flex items-center gap-1 px-2 py-1 rounded text-xs text-muted-foreground hover:bg-secondary transition-colors">
              <Edit2 className="w-3 h-3" /> Edit Form
            </button>
            <button
              onClick={() => setShowOptions((p) => !p)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${showOptions ? "bg-accent text-primary" : "text-muted-foreground hover:bg-secondary"}`}
            >
              <SlidersHorizontal className="w-3 h-3" /> Options
            </button>
            <button className="flex items-center gap-1 px-2.5 py-1 rounded text-xs bg-primary text-white hover:bg-primary/90 transition-colors">
              <Plus className="w-3 h-3" /> New
            </button>
          </div>
        </div>

        {/* Active filters banner */}
        {activeFilters.length > 0 && (
          <div className="px-5 py-2 bg-accent/40 border-b flex items-center gap-2 flex-shrink-0">
            <Filter className="w-3 h-3 text-primary flex-shrink-0" />
            <span className="text-xs text-primary font-medium">Filtering by:</span>
            <div className="flex flex-wrap gap-1">
              {activeFilters.map((f) => (
                <Chip key={f} label={f} active chipColors={chipColors} onClick={() => toggleFilter(f)} />
              ))}
            </div>
            <button onClick={() => setActiveFilters([])} className="ml-auto text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 flex-shrink-0">
              <X className="w-3 h-3" /> Clear
            </button>
          </div>
        )}

        {/* Hint */}
        {activeFilters.length === 0 && (
          <div className="px-5 py-1.5 border-b bg-secondary/30 flex-shrink-0">
            <p className="text-[11px] text-muted-foreground">Click any pill to filter responses by that choice. Combine multiple pills.</p>
          </div>
        )}

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="border-b bg-secondary/50">
                <th className="w-8 px-3 py-2 text-left">
                  <CheckSquare className="w-3.5 h-3.5 text-muted-foreground" />
                </th>
                <th className="w-6 px-1 py-2" />
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">Name</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                  Aesthetic / Vibe
                  <span className="ml-1 normal-case text-primary/60 font-normal text-[10px]">multi-select</span>
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                  Occasions
                  <span className="ml-1 normal-case text-primary/60 font-normal text-[10px]">multi-select</span>
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">Submitted</th>
                <th className="w-6" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-sm text-muted-foreground">
                    No responses match the selected filters.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-secondary/30 transition-colors group">
                    <td className="px-3 py-2.5">
                      <input type="checkbox" className="w-3.5 h-3.5 accent-primary" />
                    </td>
                    <td className="px-1 py-2.5">
                      <Maximize2 className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <div className="font-medium">{row.name}</div>
                      <div className="text-xs text-muted-foreground">{row.email}</div>
                    </td>
                    <td className="px-3 py-2.5 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {row.aesthetic.map((a) => (
                          <Chip key={a} label={a} active={activeFilters.includes(a)} chipColors={chipColors} onClick={() => toggleFilter(a)} />
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {row.occasions.map((o) => (
                          <Chip key={o} label={o} active={activeFilters.includes(o)} chipColors={chipColors} onClick={() => toggleFilter(o)} />
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{row.submitted}</td>
                    <td className="px-2 py-2.5">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <button className="flex items-center gap-2 px-5 py-2 text-xs text-muted-foreground hover:bg-secondary/40 transition-colors w-full border-b">
            <Plus className="w-3.5 h-3.5" /> Add new row
          </button>
        </div>

        {/* Footer */}
        <div className="border-t px-5 py-1.5 flex items-center gap-2 text-xs text-muted-foreground flex-shrink-0">
          <span>{filtered.length} of {RESPONSES.length} responses</span>
          {activeFilters.length > 0 && (
            <span className="text-primary">· {activeFilters.length} filter{activeFilters.length > 1 ? "s" : ""} active</span>
          )}
        </div>
      </div>

      {/* Options slide-in panel */}
      {showOptions && (
        <div className="w-60 border-l bg-white flex flex-col flex-shrink-0">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <span className="font-semibold text-sm">Options</span>
            <button onClick={() => setShowOptions(false)}>
              <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-5">
            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Visible columns</p>
              <div className="space-y-1.5">
                {["Name", "Aesthetic / Vibe", "Occasions", "Submitted"].map((col) => (
                  <label key={col} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-primary w-3.5 h-3.5" />
                    <span className="text-sm">{col}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Choice colors</p>
              <div className="space-y-2">
                {ALL_OPTIONS.map((opt) => {
                  const hex = chipColors[opt] ?? "#6b7280";
                  return (
                    <div key={opt} className="flex items-center gap-2">
                      {/* Color swatch — clicking opens native color picker */}
                      <button
                        className="w-5 h-5 rounded-full border-2 border-white shadow flex-shrink-0 ring-1 ring-border transition-transform hover:scale-110"
                        style={{ background: hex }}
                        onClick={() => colorInputRefs.current[opt]?.click()}
                        title="Pick color"
                      />
                      <input
                        type="color"
                        className="sr-only"
                        value={hex}
                        ref={(el) => { colorInputRefs.current[opt] = el; }}
                        onChange={(e) => setChipColors((prev) => ({ ...prev, [opt]: e.target.value }))}
                      />
                      <span className="text-xs text-foreground/80 flex-1 truncate">{opt}</span>
                      <Chip label={opt} chipColors={chipColors} />
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Export</p>
              <button className="w-full px-3 py-1.5 border rounded-md text-xs hover:bg-secondary transition-colors text-center">
                Export CSV
              </button>
              <p className="text-[11px] text-muted-foreground mt-1.5 leading-4">
                Each row exports as dash-separated string:<br />
                <code className="bg-secondary px-1 py-0.5 rounded text-[10px] mt-0.5 inline-block">
                  Minimal & Clean - Dark Mode / Sleek
                </code>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
