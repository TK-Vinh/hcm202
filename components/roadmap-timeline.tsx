"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

import type { RoadmapData, RoadmapEntry } from "@/data/hcm-roadmap";

type RoadmapTimelineProps = {
  entries: RoadmapData;
};

export function RoadmapTimeline({ entries }: RoadmapTimelineProps) {
  const { currentLanguage, getLocalizedContent, t } = useLanguage();
  const [activeId, setActiveId] = useState(entries[0]?.id ?? "");

  const activeEntry = entries.find((entry) => entry.id === activeId);

  if (!entries.length) {
    return null;
  }

  const renderLabel = (entry: RoadmapEntry) => {
    return {
      period: getLocalizedContent(entry.period),
      stage: getLocalizedContent(entry.stage),
    };
  };

  return (
    <section className="mt-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 dark:from-emerald-300 dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
          {t("home.roadmapTitle")}
        </h2>
        <p className="text-lg text-muted-foreground">
          {t("home.roadmapDescription")}
        </p>
        <p className="text-sm text-muted-foreground/70 mt-3">
          {t("home.roadmapHint")}
        </p>
      </div>

      {/* Timeline */}
      <div className="relative rounded-3xl border border-emerald-200/60 dark:border-emerald-900/40 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-emerald-950/40 dark:via-slate-950/40 dark:to-purple-950/40 shadow-xl">
        <div className="overflow-x-auto pb-8">
          <div className="relative flex min-w-max gap-12 px-8 py-12">
            <div className="pointer-events-none absolute left-8 right-8 top-1/2 h-px bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 dark:from-emerald-500/60 dark:via-blue-500/60 dark:to-purple-500/60"></div>
            {entries.map((entry) => {
              const { period, stage } = renderLabel(entry);
              const isActive = entry.id === activeId;

              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setActiveId(entry.id)}
                  onMouseEnter={() => setActiveId(entry.id)}
                  className="relative z-10 flex flex-col items-center gap-3 outline-none group"
                  aria-pressed={isActive}
                >
                  <span
                    className={cn(
                      "text-sm font-medium text-muted-foreground transition-colors duration-300",
                      isActive &&
                        "text-emerald-600 dark:text-emerald-300 drop-shadow-sm"
                    )}
                  >
                    {period}
                  </span>
                  <span
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full border-2 border-emerald-300/70 bg-white/80 dark:bg-emerald-950/70 backdrop-blur transition-all duration-300 group-focus-visible:ring-4 group-focus-visible:ring-emerald-400/50",
                      isActive
                        ? "scale-110 border-emerald-500/90 shadow-lg shadow-emerald-500/30"
                        : "hover:scale-105"
                    )}
                  >
                    <span
                      className={cn(
                        "h-3 w-3 rounded-full bg-emerald-400 transition-all duration-300",
                        isActive
                          ? "h-4 w-4 bg-emerald-500 shadow shadow-emerald-400/60"
                          : "group-hover:bg-emerald-500"
                      )}
                    ></span>
                  </span>
                  <span
                    className={cn(
                      "w-40 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors duration-300",
                      isActive && "text-emerald-600 dark:text-emerald-300"
                    )}
                  >
                    {stage}
                  </span>
                  {/* Overlay QR/Image khi hover */}
                  {entry.id === "1945-independence" && (
                    <div className="absolute top-full  left-1/2 -translate-x-1/2 hidden group-hover:block z-[9999]">
                      <div className="rounded-lg shadow-lg bg-white dark:bg-gray-900 border">
                        <img
                          src="/assets/roadmap-images/2-9-1945(2).jpg"
                          alt="QR Code"
                        />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Entry Content */}
        {activeEntry && (
          <div className="border-t border-emerald-200/60 dark:border-emerald-900/40 bg-white/80 dark:bg-emerald-950/40 backdrop-blur px-8 py-10">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl bg-gradient-to-br from-emerald-100/80 via-emerald-50 to-white dark:from-emerald-900/40 dark:via-emerald-900/30 dark:to-emerald-950/60 p-6 shadow-md">
                <h3 className="text-base font-semibold text-emerald-700 dark:text-emerald-300 mb-2 uppercase tracking-wide">
                  {t("home.roadmapEventLabel")}
                </h3>
                <ReactMarkdown
                  components={{
                    img: ({ node, ...props }) => (
                      <img
                        className="mx-auto my-4 rounded-lg shadow-lg h-[400px] object-contain"
                        {...props}
                      />
                    ),
                  }}
                >
                  {activeEntry.event[currentLanguage]}
                </ReactMarkdown>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-purple-100/80 via-blue-50 to-white dark:from-purple-900/40 dark:via-blue-900/30 dark:to-slate-950/60 p-6 shadow-md">
                <h3 className="text-base font-semibold text-purple-700 dark:text-purple-300 mb-2 uppercase tracking-wide">
                  {t("home.roadmapImpactLabel")}
                </h3>
                <ReactMarkdown
                  components={{
                    img: ({ node, ...props }) => (
                      <img
                        className="mx-auto my-4 rounded-lg shadow-lg max-w-full h-auto bg-transparent"
                        {...props}
                      />
                    ),
                  }}
                >
                  {activeEntry.significance[currentLanguage]}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
