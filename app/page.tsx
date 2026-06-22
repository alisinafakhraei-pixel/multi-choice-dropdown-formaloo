"use client";

import { useState } from "react";
import { MultiSelectDropdown } from "@/components/multiselect-dropdown";

const AESTHETIC_OPTIONS = [
  { value: "minimal", label: "Minimal & Clean" },
  { value: "dark", label: "Dark Mode / Sleek" },
  { value: "retro", label: "Retro / Vintage" },
  { value: "vibrant", label: "Vibrant & Colorful" },
  { value: "cozy", label: "Cozy & Low-key" },
  { value: "high-energy", label: "High-Energy / Creative" },
  { value: "industrial", label: "Industrial & Brutalist" },
];

const OCCASION_OPTIONS = [
  { value: "work", label: "Work meetings" },
  { value: "casual", label: "Casual outings" },
  { value: "formal", label: "Formal events" },
  { value: "outdoor", label: "Outdoor activities" },
  { value: "travel", label: "Travel" },
  { value: "home", label: "Staying home" },
];

export default function FormViewPage() {
  const [aesthetics, setAesthetics] = useState<string[]>([]);
  const [occasions, setOccasions] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (aesthetics.length === 0) newErrors.aesthetics = "Please select at least 1 option";
    if (occasions.length === 0) newErrors.occasions = "Please select at least 1 option";
    setFieldErrors(newErrors);
    if (Object.keys(newErrors).length === 0) setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-full bg-white flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10L8 14L16 6" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">Response submitted!</h2>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Piped value:</span>{" "}
            {aesthetics.map((a) => AESTHETIC_OPTIONS.find((o) => o.value === a)?.label).join(" - ")}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Occasions:</span>{" "}
            {occasions.map((o) => OCCASION_OPTIONS.find((op) => op.value === o)?.label).join(" - ")}
          </p>
          <button
            onClick={() => { setSubmitted(false); setAesthetics([]); setOccasions([]); setFieldErrors({}); }}
            className="mt-4 px-5 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-secondary transition-colors"
          >
            Reset form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white">
      <div className="max-w-xl mx-auto px-6 pt-16 pb-16">
        <h1 className="text-3xl font-bold text-foreground mb-1">Appointment Form</h1>
        <p className="text-sm text-muted-foreground mb-10">
          Tell us about your style preferences.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Multi-select dropdown — max 3 */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold">
              How would you describe your personal aesthetic or daily vibe?
              <span className="text-destructive ml-0.5">*</span>
            </label>
            <p className="text-xs text-muted-foreground italic">Select up to 3 that feel most like you.</p>
            <MultiSelectDropdown
              options={AESTHETIC_OPTIONS}
              placeholder="Click to select"
              max={3}
              value={aesthetics}
              onChange={(v) => { setAesthetics(v); setFieldErrors((p) => ({ ...p, aesthetics: "" })); }}
            />
            {fieldErrors.aesthetics && (
              <p className="text-xs text-destructive">{fieldErrors.aesthetics}</p>
            )}
          </div>

          {/* Multi-select dropdown — no max */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold">
              Which occasions do you typically dress for?
              <span className="text-destructive ml-0.5">*</span>
            </label>
            <p className="text-xs text-muted-foreground italic">Pick all that apply.</p>
            <MultiSelectDropdown
              options={OCCASION_OPTIONS}
              placeholder="Click to select"
              value={occasions}
              onChange={(v) => { setOccasions(v); setFieldErrors((p) => ({ ...p, occasions: "" })); }}
            />
            {fieldErrors.occasions && (
              <p className="text-xs text-destructive">{fieldErrors.occasions}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-foreground text-background text-sm font-medium rounded-lg hover:bg-foreground/90 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
