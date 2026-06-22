"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Table2, BarChart2, PenSquare } from "lucide-react";

const pages = [
  { href: "/", label: "Form View", icon: FileText, desc: "Public form" },
  { href: "/data-block", label: "Data Block", icon: Table2, desc: "Responses table" },
  { href: "/charts", label: "Charts", icon: BarChart2, desc: "Analytics" },
  { href: "/form-editor", label: "Form Editor", icon: PenSquare, desc: "Builder canvas" },
];

export function DemoNav() {
  const pathname = usePathname();
  return (
    <aside className="flex flex-col w-[200px] min-w-[200px] border-r bg-white h-full">
      {/* Brand */}
      <div className="flex items-center gap-2 px-4 py-3 border-b">
        <div
          className="w-6 h-6 rounded flex items-center justify-center text-white text-[11px] font-bold"
          style={{ background: "var(--brand, #ff5a00)" }}
        >
          F
        </div>
        <span className="text-xs font-semibold text-foreground/70">PRD Demo</span>
      </div>

      {/* Section label */}
      <div className="px-3 pt-3 pb-1">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
          Multi-select Dropdown
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-2 space-y-0.5">
        {pages.map(({ href, label, icon: Icon, desc }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors ${
                active
                  ? "bg-accent text-primary font-medium"
                  : "text-foreground/75 hover:bg-secondary"
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-primary" : "text-muted-foreground"}`} />
              <div className="min-w-0">
                <div className="truncate">{label}</div>
                <div className="text-[11px] text-muted-foreground font-normal truncate">{desc}</div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer note */}
      <div className="border-t px-3 py-2">
        <p className="text-[10px] text-muted-foreground leading-4">
          Interactive prototype — no API connected
        </p>
      </div>
    </aside>
  );
}
