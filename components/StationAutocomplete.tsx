"use client";

import { useEffect, useRef, useState } from "react";
import { Check, MapPin, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";

interface Station {
  code: string;
  name: string;
  location: string;
}

interface StationAutocompleteProps {
  id: string;
  value: Station | null;
  onChange: (station: Station | null) => void;
  placeholder: string;
}

export default function StationAutocomplete({
  id,
  value,
  onChange,
  placeholder,
}: StationAutocompleteProps) {
  const { t } = useLanguage();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [isLoadingStations, setIsLoadingStations] = useState(false);

  useEffect(() => {
    const normalizedQuery = query.trim();

    if (normalizedQuery.length < 2) {
      setFilteredStations([]);
      setIsLoadingStations(false);
      return;
    }

    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      try {
        setIsLoadingStations(true);

        const response = await fetch(
          `/api/stations?q=${encodeURIComponent(normalizedQuery)}`,
          {
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message ?? "Unable to search stations.");
        }

        setFilteredStations(data.data ?? []);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Station search error:", error);
        setFilteredStations([]);
      } finally {
        setIsLoadingStations(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* =======================================================
     CLOSE ON OUTSIDE CLICK
     ======================================================= */

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  /* =======================================================
     SELECT STATION
     ======================================================= */

  const handleSelect = (station: Station) => {
    onChange(station);
    setQuery("");
    setOpen(false);
    setHighlightedIndex(0);
  };

  /* =======================================================
     CLEAR
     ======================================================= */

  const handleClear = () => {
    onChange(null);
    setQuery("");
    setOpen(false);
    setHighlightedIndex(0);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  /* =======================================================
     KEYBOARD NAVIGATION
     ======================================================= */

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || filteredStations.length === 0) {
      if (event.key === "ArrowDown" && query.trim()) {
        setOpen(true);
      }

      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setHighlightedIndex((current) =>
        current < filteredStations.length - 1 ? current + 1 : 0
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setHighlightedIndex((current) =>
        current > 0 ? current - 1 : filteredStations.length - 1
      );
    }

    if (event.key === "Enter") {
      event.preventDefault();

      const station = filteredStations[highlightedIndex];

      if (station) {
        handleSelect(station);
      }
    }

    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Input */}
      <div
        className={`
          group
          flex
          h-14
          w-full
          items-center
          rounded-xl
          border
          bg-white/[0.035]
          transition-all
          duration-300
          ${
            open
              ? "border-cyan-400/30 bg-white/[0.05] ring-2 ring-cyan-400/5"
              : "border-white/[0.08] hover:border-white/20 hover:bg-white/[0.05]"
          }
        `}
      >
        <MapPin size={17} className="ml-4 shrink-0 text-cyan-300/70" />

        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value ? value.name : query}
          onChange={(event) => {
            onChange(null);
            setQuery(event.target.value);
            setOpen(event.target.value.trim().length >= 2);
            setHighlightedIndex(0);
          }}
          onFocus={() => {
            if (query.trim()) {
              setOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm font-medium text-white outline-none placeholder:text-slate-600"
        />

        {/* Search icon */}
        {!value && !query && (
          <Search size={16} className="mr-4 shrink-0 text-slate-600" />
        )}

        {/* Clear */}
        {(value || query) && (
          <button
            type="button"
            onClick={handleClear}
            aria-label={t("clearStation")}
            className="
              mr-2
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-slate-500
              transition-all
              duration-200
              hover:bg-white/[0.06]
              hover:text-white
            "
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Suggestions */}
      <AnimatePresence>
        {open && query.trim() && (
          <motion.div
            initial={{
              opacity: 0,
              y: -5,
              scale: 0.985,
            }}
            animate={{
              opacity: 1,
              y: 8,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -4,
              scale: 0.985,
            }}
            transition={{
              duration: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              absolute
              left-0
              right-0
              z-50
              overflow-hidden
              rounded-2xl
              border
              border-white/[0.10]
              bg-[#0D121D]/[0.98]
              p-1.5
              shadow-[0_24px_70px_rgba(0,0,0,0.50)]
              backdrop-blur-2xl
            "
          >
            {isLoadingStations ? (
              <div className="px-4 py-6 text-center">
                <div className="mx-auto mb-2 h-5 w-5 animate-spin rounded-full border-2 border-cyan-300/20 border-t-cyan-300" />

                <p className="text-xs font-medium text-slate-400">
                  Searching stations...
                </p>
              </div>
            ) : filteredStations.length > 0 ? (
              <div role="listbox">
                {filteredStations.map((station, index) => {
                  const isHighlighted = index === highlightedIndex;

                  return (
                    <button
                      key={station.code}
                      type="button"
                      role="option"
                      aria-selected={isHighlighted}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        handleSelect(station);
                      }}
                      className={`
                        relative
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-3
                        text-left
                        transition-all
                        duration-200
                        ${
                          isHighlighted
                            ? "bg-cyan-400/[0.07]"
                            : "hover:bg-white/[0.04]"
                        }
                      `}
                    >
                      {/* Station icon */}
                      <div
                        className={`
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          border
                          transition-all
                          duration-200
                          ${
                            isHighlighted
                              ? "border-cyan-300/20 bg-cyan-300/[0.08] text-cyan-300"
                              : "border-white/[0.06] bg-white/[0.025] text-slate-500"
                          }
                        `}
                      >
                        <MapPin size={16} />
                      </div>

                      {/* Station information */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={`
                              truncate
                              text-sm
                              font-medium
                              ${isHighlighted ? "text-white" : "text-slate-300"}
                            `}
                          >
                            {station.name}
                          </p>

                          <span className="shrink-0 rounded-md bg-white/[0.05] px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-slate-500">
                            {station.code}
                          </span>
                        </div>

                        <p className="mt-0.5 truncate text-[11px] text-slate-600">
                          {station.location}
                        </p>
                      </div>

                      {/* Selected / highlighted indicator */}
                      {isHighlighted && (
                        <Check size={15} className="shrink-0 text-cyan-300" />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="px-4 py-6 text-center">
                <MapPin size={20} className="mx-auto mb-2 text-slate-600" />

                <p className="text-xs font-medium text-slate-400">
                  {t("noStationsFound")}
                </p>

                <p className="mt-1 text-[10px] text-slate-600">
                  {t("tryStationNameOrCode")}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
