"use client";

import { useState } from "react";
import {
  Eye, Share2, Settings, Plus, GripVertical, Trash2,
  ChevronDown, ChevronUp, X, ListFilter, Type,
  CheckSquare, Star, Calendar, Upload, Phone, Hash, AlignLeft,
  ToggleLeft, ToggleRight, Info,
} from "lucide-react";

/* ─── Types ─────────────────────────── */
interface Choice { id: number; label: string }
interface FieldConfig {
  label: string;
  fieldId: string;
  required: boolean;
  adminOnly: boolean;
  invisible: boolean;
  fieldWidth: "default" | "full" | "1/2" | "1/3" | "2/3";
  shuffle: boolean;
  min: string;
  max: string;
  choices: Choice[];
  defaultAnswers: number[];
}

/* ─── Field palette ──────────────────── */
const PALETTE = [
  { section: "Choice", items: [
    { icon: CheckSquare, label: "Multi choice" },
    { icon: ChevronDown, label: "Dropdown" },
    { icon: ListFilter,  label: "Multi-select Dropdown", isNew: true },
    { icon: ToggleLeft,  label: "Yes / No" },
  ]},
  { section: "Text", items: [
    { icon: Type,       label: "Short answer" },
    { icon: AlignLeft,  label: "Long answer" },
  ]},
  { section: "Number", items: [
    { icon: Hash,  label: "Number" },
    { icon: Star,  label: "Rating" },
  ]},
  { section: "Other", items: [
    { icon: Calendar, label: "Date" },
    { icon: Upload,   label: "File upload" },
    { icon: Phone,    label: "Phone" },
  ]},
];

const INITIAL_CHOICES: Choice[] = [
  { id: 1, label: "Minimal & Clean" },
  { id: 2, label: "Dark Mode / Sleek" },
  { id: 3, label: "Retro / Vintage" },
  { id: 4, label: "Vibrant & Colorful" },
  { id: 5, label: "Cozy & Low-key" },
  { id: 6, label: "High-Energy / Creative" },
  { id: 7, label: "Industrial & Brutalist" },
];

const TRANSLATABLE = [
  { key: "Field placeholder", default: "Click to select" },
  { key: "Searching options message", default: "Searching options..." },
  { key: "No options message", default: "No options found" },
  { key: "Min. error message", default: "Please select at least {min} option" },
  { key: "Max. error message", default: "You can select up to {max} options" },
];

/* ─── Mini helpers ───────────────────── */
function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${on ? "bg-primary" : "bg-muted-foreground/30"}`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? "translate-x-4" : "translate-x-0.5"}`}
      />
    </button>
  );
}

function SectionHeader({
  title,
  open,
  onToggle,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-4 py-3 border-b border-t bg-secondary/30 hover:bg-secondary/50 transition-colors"
    >
      <span className="text-sm font-semibold">{title}</span>
      {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
    </button>
  );
}

/* ─── Settings sidebar ───────────────── */
function FieldSettings({
  config,
  setConfig,
}: {
  config: FieldConfig;
  setConfig: (c: FieldConfig) => void;
}) {
  const [openSettings, setOpenSettings] = useState(true);
  const [openInsert, setOpenInsert] = useState(false);
  const [openTranslate, setOpenTranslate] = useState(false);
  const [newChoice, setNewChoice] = useState("");
  const [nextId, setNextId] = useState(100);

  function addChoice() {
    const label = newChoice.trim();
    if (!label) return;
    setConfig({ ...config, choices: [...config.choices, { id: nextId, label }] });
    setNextId((n) => n + 1);
    setNewChoice("");
  }

  function removeChoice(id: number) {
    setConfig({ ...config, choices: config.choices.filter((c) => c.id !== id), defaultAnswers: config.defaultAnswers.filter((d) => d !== id) });
  }

  return (
    <div className="flex flex-col h-full text-sm overflow-hidden">
      <div className="flex-1 overflow-y-auto">

        {/* ── Top block: field type + ID + toggles ── */}
        <div className="px-4 py-3 space-y-3 border-b">
          {/* Field type dropdown */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Field type</label>
            <div className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-background cursor-pointer hover:border-primary/50 transition-colors">
              <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                <ListFilter className="w-3 h-3 text-primary" />
              </div>
              <span className="flex-1 text-sm">Multi-select Dropdown</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          {/* Field ID */}
          <div>
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs font-medium text-muted-foreground">ID</span>
            </div>
            <input
              className="w-full px-3 py-1.5 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              value={config.fieldId}
              onChange={(e) => setConfig({ ...config, fieldId: e.target.value })}
            />
            <p className="text-[11px] text-muted-foreground mt-1">use numbers, letters and underscore with no space</p>
          </div>

          {/* Required / Admin-only / Invisible */}
          {[
            { key: "required" as const, label: "Required" },
            { key: "adminOnly" as const, label: "Make this field Admin-only" },
            { key: "invisible" as const, label: "Invisible" },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm">{label}</span>
              <Toggle on={config[key] as boolean} onToggle={() => setConfig({ ...config, [key]: !config[key] })} />
            </div>
          ))}

          {/* Field width */}
          <div>
            <div className="flex items-center gap-1 mb-1.5">
              <span className="text-sm">Field width</span>
              <Info className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <div className="flex gap-1">
              {(["default", "full", "1/2", "1/3", "2/3"] as const).map((w) => (
                <button
                  key={w}
                  onClick={() => setConfig({ ...config, fieldWidth: w })}
                  className={`px-2 py-0.5 rounded text-xs font-medium capitalize transition-colors ${
                    config.fieldWidth === w
                      ? "text-primary font-semibold underline underline-offset-2"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {w === "default" ? "Default" : w}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Settings section ── */}
        <SectionHeader title="Settings" open={openSettings} onToggle={() => setOpenSettings((p) => !p)} />
        {openSettings && (
          <div className="px-4 py-3 space-y-4">
            {/* Choices */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">Choices</p>
              <div className="space-y-1.5">
                {config.choices.map((c) => (
                  <div key={c.id} className="flex items-center gap-1.5 group/choice">
                    <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0 cursor-grab" />
                    <input
                      className="flex-1 px-2.5 py-1.5 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      value={c.label}
                      onChange={(e) =>
                        setConfig({ ...config, choices: config.choices.map((ch) => ch.id === c.id ? { ...ch, label: e.target.value } : ch) })
                      }
                    />
                    <button onClick={() => removeChoice(c.id)} className="opacity-0 group-hover/choice:opacity-100 transition-opacity flex-shrink-0">
                      <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                ))}
                {/* Add new item */}
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5" />
                  <input
                    className="flex-1 px-2.5 py-1.5 text-sm border border-dashed rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-muted-foreground placeholder:text-muted-foreground/60"
                    placeholder="Add new item"
                    value={newChoice}
                    onChange={(e) => setNewChoice(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addChoice()}
                  />
                </div>
              </div>
            </div>

            {/* Insert choices (inline quick add) */}
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Insert choices</p>
              <textarea
                rows={3}
                className="w-full px-2.5 py-1.5 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-muted-foreground placeholder:text-muted-foreground/50"
                placeholder="Option 1  Option 2  Option 3"
              />
              <p className="text-[11px] text-muted-foreground mt-1 leading-4">
                Quickly add multiple options by typing or pasting a list separated by new lines.{" "}
                <span className="text-primary underline cursor-pointer">Learn how</span>
              </p>
              <button className="mt-2 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors">
                Insert choices
              </button>
            </div>

            {/* Default answer */}
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Default Answer</p>
              <div className="flex items-center justify-between px-3 py-2 border rounded-lg bg-background text-sm text-muted-foreground cursor-pointer hover:border-primary/40">
                <span>Click to select</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            {/* Shuffle */}
            <div className="flex items-center justify-between">
              <span className="text-sm">Shuffle choices</span>
              <Toggle on={config.shuffle} onToggle={() => setConfig({ ...config, shuffle: !config.shuffle })} />
            </div>

            {/* Min / Max */}
            <div className="flex gap-3">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Min. selectable options:</p>
                <input
                  type="number" min={0}
                  className="w-full px-2.5 py-1.5 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={config.min}
                  onChange={(e) => setConfig({ ...config, min: e.target.value })}
                  placeholder="Enter a num"
                />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Max. selectable options:</p>
                <input
                  type="number" min={0}
                  className="w-full px-2.5 py-1.5 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={config.max}
                  onChange={(e) => setConfig({ ...config, max: e.target.value })}
                  placeholder="Enter a num"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Insert section ── */}
        <SectionHeader title="Insert" open={openInsert} onToggle={() => setOpenInsert((p) => !p)} />
        {openInsert && (
          <div className="px-4 py-3 space-y-2">
            <p className="text-xs text-muted-foreground">Bulk choices</p>
            <textarea
              rows={4}
              className="w-full px-2.5 py-1.5 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-muted-foreground placeholder:text-muted-foreground/50"
              placeholder="Option 1  Option 2  Option 3"
            />
            <p className="text-[11px] text-muted-foreground leading-4">
              Quickly add multiple options by typing or pasting a list separated by new lines.{" "}
              <span className="text-primary underline cursor-pointer">Learn how</span>
            </p>
            <button className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors">
              Insert choices
            </button>
          </div>
        )}

        {/* ── Translate & Customize ── */}
        <SectionHeader title="Translate and customize" open={openTranslate} onToggle={() => setOpenTranslate((p) => !p)} />
        {openTranslate && (
          <div className="px-4 py-3 space-y-4">
            {TRANSLATABLE.map((t) => (
              <div key={t.key}>
                <p className="text-sm mb-0.5">{t.key}</p>
                <p className="text-xs text-muted-foreground mb-1">Default: {t.default}</p>
                <input
                  className="w-full px-2.5 py-1.5 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder={t.default}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Canvas field preview ───────────── */
function CanvasField({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`group relative rounded-xl border px-5 py-4 cursor-pointer transition-all ${
        active ? "border-primary ring-2 ring-primary/20 bg-white shadow-sm" : "border-border hover:border-primary/40 bg-white"
      }`}
    >
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-px w-1 h-6 bg-primary rounded-full" />}
      <p className="text-sm font-semibold mb-3">{label}<span className="text-destructive ml-0.5">*</span></p>
      <div className="flex items-center justify-between px-3 py-2.5 border rounded-lg bg-background text-sm text-muted-foreground">
        <span>Click to select</span>
        <ChevronDown className="w-4 h-4" />
      </div>
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <button className="p-1 rounded hover:bg-secondary"><GripVertical className="w-3.5 h-3.5 text-muted-foreground" /></button>
        <button className="p-1 rounded hover:bg-secondary"><Trash2 className="w-3.5 h-3.5 text-muted-foreground" /></button>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────── */
export default function FormEditorPage() {
  const [activeField, setActiveField] = useState<"multiselect" | "none">("multiselect");
  const [config, setConfig] = useState<FieldConfig>({
    label: "How would you describe your personal aesthetic or daily vibe?",
    fieldId: "aesthetic_vibe",
    required: false,
    adminOnly: false,
    invisible: false,
    fieldWidth: "default",
    shuffle: false,
    min: "",
    max: "",
    choices: INITIAL_CHOICES,
    defaultAnswers: [],
  });

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top bar */}
      <div className="flex items-center border-b px-4 py-2 gap-2 flex-shrink-0">
        <div className="flex items-center gap-1.5 mr-2">
          <div className="w-5 h-5 rounded bg-teal-500 flex items-center justify-center text-white text-[10px] font-bold">A</div>
          <span className="text-sm font-medium">Appointment Form</span>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
        <div className="flex items-center rounded-lg border overflow-hidden">
          <button className="px-3 py-1.5 text-xs font-medium bg-white border-r flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> View
          </button>
          <button className="px-3 py-1.5 text-xs font-medium bg-primary text-white flex items-center gap-1.5">
            Edit
          </button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs text-muted-foreground hover:bg-secondary transition-colors">
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
          <button className="p-1.5 rounded-lg border text-muted-foreground hover:bg-secondary transition-colors">
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left palette */}
        <div className="w-52 border-r bg-secondary/10 flex flex-col flex-shrink-0 overflow-y-auto">
          <div className="px-3 py-2.5 border-b bg-white">
            <p className="text-xs font-medium text-muted-foreground">Add field</p>
          </div>
          {PALETTE.map((group) => (
            <div key={group.section}>
              <p className="px-3 pt-3 pb-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{group.section}</p>
              {group.items.map((item) => {
                const isActive = item.label === "Multi-select Dropdown";
                return (
                  <button
                    key={item.label}
                    className={`w-[calc(100%-8px)] mx-1 my-0.5 flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg transition-all ${
                      isActive
                        ? "bg-accent text-primary font-medium border border-primary/20"
                        : "text-foreground/70 hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    <item.icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="truncate">{item.label}</span>
                    {item.isNew && (
                      <span className="ml-auto flex-shrink-0 px-1 py-0.5 bg-primary text-white text-[9px] font-bold rounded">NEW</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-[#f6f7f9]">
          <div className="max-w-xl mx-auto px-6 py-10 space-y-4">
            <div className="text-center mb-6">
              <p className="text-2xl font-bold">Appointment Form</p>
            </div>
            {/* Static faded field */}
            <div className="rounded-xl border border-border px-5 py-4 bg-white opacity-50">
              <p className="text-sm font-semibold mb-3">Your name</p>
              <div className="h-9 border rounded-lg bg-background px-3 flex items-center">
                <span className="text-sm text-muted-foreground">Write your answer here…</span>
              </div>
            </div>
            {/* Multi-select dropdown field */}
            <CanvasField
              label={config.label}
              active={activeField === "multiselect"}
              onClick={() => setActiveField("multiselect")}
            />
            <button
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-border rounded-xl text-xs text-muted-foreground hover:border-primary/40 hover:text-primary/70 hover:bg-white/80 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add field
            </button>
          </div>
        </div>

        {/* Right settings panel */}
        {activeField === "multiselect" && (
          <div className="w-64 border-l bg-white flex-shrink-0 flex flex-col overflow-hidden">
            {/* Panel header — mimics the "2 How would you describe you... × " tab */}
            <div className="flex items-center gap-2 px-3 py-2.5 border-b bg-secondary/20">
              <div className="w-4 h-4 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-primary">2</span>
              </div>
              <span className="text-xs font-medium truncate flex-1">How would you describe you…</span>
              <button onClick={() => setActiveField("none")} className="flex-shrink-0">
                <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            <FieldSettings config={config} setConfig={setConfig} />
          </div>
        )}
      </div>
    </div>
  );
}
