"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

const COLORS: Record<string, { bg: string; bar: string; text: string }> = {
  "Minimal & Clean":        { bar: "#3b82f6", bg: "rgba(59,130,246,0.12)", text: "#1d4ed8" },
  "Dark Mode / Sleek":      { bar: "#8b5cf6", bg: "rgba(139,92,246,0.12)", text: "#6d28d9" },
  "Retro / Vintage":        { bar: "#f97316", bg: "rgba(249,115,22,0.12)",  text: "#c2410c" },
  "Vibrant & Colorful":     { bar: "#ec4899", bg: "rgba(236,72,153,0.12)", text: "#be185d" },
  "Cozy & Low-key":         { bar: "#22c55e", bg: "rgba(34,197,94,0.12)",  text: "#15803d" },
  "High-Energy / Creative": { bar: "#14b8a6", bg: "rgba(20,184,166,0.12)", text: "#0f766e" },
  "Industrial & Brutalist": { bar: "#6b7280", bg: "rgba(107,114,128,0.12)","text": "#374151" },
  "Work meetings":          { bar: "#3b82f6", bg: "rgba(59,130,246,0.12)", text: "#1d4ed8" },
  "Casual outings":         { bar: "#22c55e", bg: "rgba(34,197,94,0.12)",  text: "#15803d" },
  "Formal events":          { bar: "#8b5cf6", bg: "rgba(139,92,246,0.12)", text: "#6d28d9" },
  "Outdoor activities":     { bar: "#14b8a6", bg: "rgba(20,184,166,0.12)", text: "#0f766e" },
  "Travel":                 { bar: "#f97316", bg: "rgba(249,115,22,0.12)", text: "#c2410c" },
  "Staying home":           { bar: "#ec4899", bg: "rgba(236,72,153,0.12)", text: "#be185d" },
};

const AESTHETIC_COUNTS: Record<string, number> = {
  "Dark Mode / Sleek": 3,
  "Vibrant & Colorful": 3,
  "High-Energy / Creative": 2,
  "Minimal & Clean": 2,
  "Retro / Vintage": 2,
  "Industrial & Brutalist": 2,
  "Cozy & Low-key": 1,
};

const OCCASION_COUNTS: Record<string, number> = {
  "Casual outings": 4,
  "Work meetings": 3,
  "Formal events": 2,
  "Outdoor activities": 2,
  "Travel": 2,
  "Staying home": 2,
};

const CHART_H = 160; // px height of bar area

function VerticalBarChart({
  data,
  title,
  total,
}: {
  data: Record<string, number>;
  title: string;
  total: number;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const maxVal = Math.max(...entries.map(([, v]) => v));

  return (
    <div className="bg-white border rounded-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{total} responses</p>
        </div>
        <button className="p-1 rounded hover:bg-secondary transition-colors flex-shrink-0 mt-0.5">
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Chart area */}
      <div className="overflow-x-auto pb-1">
        <div className="flex items-end gap-2 min-w-max" style={{ height: CHART_H + 48 }}>
          {entries.map(([label, count]) => {
            const c = COLORS[label] ?? { bar: "#6b7280", bg: "rgba(107,114,128,0.12)", text: "#374151" };
            const barH = maxVal > 0 ? Math.round((count / maxVal) * CHART_H) : 0;
            const isHov = hovered === label;
            const dimmed = hovered && !isHov;
            return (
              <div
                key={label}
                className="flex flex-col items-center gap-1 cursor-pointer group"
                style={{ opacity: dimmed ? 0.35 : 1, transition: "opacity 0.15s" }}
                onMouseEnter={() => setHovered(label)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Count label on top */}
                <span
                  className="text-xs font-semibold tabular-nums"
                  style={{ color: isHov ? c.bar : "transparent", transition: "color 0.15s", minHeight: 16 }}
                >
                  {count}
                </span>
                {/* Bar */}
                <div
                  className="w-9 rounded-t-md transition-all duration-200"
                  style={{
                    height: barH,
                    background: isHov ? c.bar : c.bg,
                    outline: isHov ? `2px solid ${c.bar}` : "none",
                    outlineOffset: 0,
                  }}
                />
                {/* X-axis label — pill chip */}
                <span
                  className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap max-w-[72px] truncate"
                  style={{ background: c.bg, color: c.text }}
                  title={label}
                >
                  {label.split(" ")[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 pt-2 border-t">
        {entries.map(([label, count]) => {
          const c = COLORS[label] ?? { bar: "#6b7280", bg: "rgba(107,114,128,0.12)", text: "#374151" };
          return (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer"
              style={{ opacity: hovered && hovered !== label ? 0.4 : 1, transition: "opacity 0.15s" }}
              onMouseEnter={() => setHovered(label)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: c.bar }} />
              {label}
              <span className="font-medium text-foreground">{count}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function ChartsPage() {
  return (
    <div className="min-h-full bg-white">
      <div className="border-b px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold">Charts & Insights</h1>
          <p className="text-xs text-muted-foreground">Appointment Form · 7 responses</p>
        </div>
      </div>

      <div className="p-6 space-y-5 max-w-5xl">
        <div className="bg-accent/40 border border-primary/20 rounded-lg px-4 py-2.5 text-xs text-primary/80">
          <strong className="font-medium">PRD spec:</strong> Vertical bar chart — selection count per option across all responses. Same chart type as Multi choice. Hover a bar to highlight.
        </div>

        <VerticalBarChart
          title="How would you describe your personal aesthetic or daily vibe?"
          data={AESTHETIC_COUNTS}
          total={7}
        />

        <VerticalBarChart
          title="Which occasions do you typically dress for?"
          data={OCCASION_COUNTS}
          total={7}
        />
      </div>
    </div>
  );
}
