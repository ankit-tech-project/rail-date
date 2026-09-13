"use client";

import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  MapPin,
  Repeat2,
  Search,
  TrainFront,
} from "lucide-react";
import TrainResults from "@/components/TrainResults";
import type { TrainResult } from "@/lib/trainTypes";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import TrainJourneyDatePicker from "./TrainJourneyDatePicker";
import QuotaDropdown from "./QuotaDropdown";
import StationAutocomplete from "./StationAutocomplete";

export default function TrainSearchForm() {
  const { t } = useLanguage();

  const [fromStation, setFromStation] = useState<{
    code: string;
    name: string;
    location: string;
  } | null>(null);

  const [toStation, setToStation] = useState<{
    code: string;
    name: string;
    location: string;
  } | null>(null);

  const [journeyDate, setJourneyDate] = useState("");
  const [quota, setQuota] = useState("general");
  const [results, setResults] = useState<TrainResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSwap = () => {
    setFromStation(toStation);
    setToStation(fromStation);
  };

  const handleSearch = async () => {
    setError("");
    setResults([]);
    setHasSearched(false);
    setIsSearching(true);

    if (!fromStation) {
      setError(t("selectFromStation"));
      setIsSearching(false);
      return;
    }

    if (!toStation) {
      setError(t("selectToStation"));
      setIsSearching(false);
      return;
    }

    if (fromStation.code === toStation.code) {
      setError(t("selectDifferentStations"));
      setIsSearching(false);
      return;
    }

    if (!journeyDate) {
      setError(t("selectJourneyDateError"));
      setIsSearching(false);
      return;
    }

    try {
      const apiDate = /^\d{4}-\d{2}-\d{2}$/.test(journeyDate)
        ? journeyDate
        : journeyDate.split("-").reverse().join("-");

      const params = new URLSearchParams({
        from: fromStation.code,
        to: toStation.code,
        date: apiDate,
      });

      const response = await fetch(`/api/trains?${params.toString()}`);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message ?? "Unable to fetch train data.");
      }

      const trainResults = data.data ?? [];

      setResults(trainResults);
      setHasSearched(true);

      setTimeout(() => {
        document.getElementById("train-results")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    } catch (error) {
      console.error("Train search error:", error);

      setError(
        error instanceof Error ? error.message : "Unable to fetch train data."
      );
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="mt-12 w-full"
    >
      <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-3 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-4">
        <div className="rounded-2xl border border-white/[0.06] bg-[#0D121D]/90 p-5 sm:p-7">
          {/* Header */}
          <div className="mb-6 flex items-center gap-3 text-left">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.06]">
              <TrainFront
                size={19}
                strokeWidth={1.9}
                className="text-cyan-300"
              />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-300">
                {t("trainSearch")}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {t("trainSearchDescription")}
              </p>
            </div>
          </div>

          {/* From / To */}
          <div className="relative grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
            {/* From */}
            <div>
              <label
                htmlFor="from-station"
                className="mb-2 block text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-400"
              >
                {t("fromStation")}
              </label>

              <StationAutocomplete
                id="from-station"
                value={fromStation}
                onChange={(station) => {
                  setFromStation(station);
                  setError("");
                }}
                placeholder={t("fromStationPlaceholder")}
              />
            </div>

            {/* Swap */}
            <div className="flex justify-center sm:pb-1">
              <button
                type="button"
                onClick={handleSwap}
                aria-label={t("swapStations")}
                className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] text-slate-400 shadow-lg shadow-black/20 transition-all duration-300 hover:border-cyan-400/20 hover:bg-cyan-400/[0.06] hover:text-cyan-300 active:scale-95"
              >
                <Repeat2
                  size={17}
                  className="transition-transform duration-500 group-hover:rotate-180"
                />
              </button>
            </div>

            {/* To */}
            <div>
              <label
                htmlFor="to-station"
                className="mb-2 block text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-400"
              >
                {t("toStation")}
              </label>

              <StationAutocomplete
                id="to-station"
                value={toStation}
                onChange={(station) => {
                  setToStation(station);
                  setError("");
                }}
                placeholder={t("toStationPlaceholder")}
              />
            </div>
          </div>

          {/* Date + Quota */}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {/* Journey Date */}
            <div>
              <TrainJourneyDatePicker
                value={journeyDate}
                onChange={(date) => {
                  setJourneyDate(date);
                  setError("");
                }}
                minDate={new Date()}
              />
            </div>

            {/* Quota */}
            <div>
              <label className="mb-2 block text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                {t("quota")}
              </label>

              <QuotaDropdown value={quota} onChange={setQuota} />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{
                  duration: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-4 flex items-center justify-center rounded-xl border border-rose-400/10 bg-rose-400/[0.05] px-4 py-3 text-xs font-medium text-rose-300"
                role="alert"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search */}
          <button
            type="button"
            onClick={handleSearch}
            disabled={isSearching}
            className="group mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-cyan-300/10 bg-cyan-400/[0.08] text-sm font-semibold text-cyan-100 shadow-lg shadow-cyan-500/5 transition-all duration-300 hover:border-cyan-300/20 hover:bg-cyan-400/[0.12] hover:shadow-xl hover:shadow-cyan-500/10 active:scale-[0.99]"
          >
            <Search
              size={18}
              className="transition-transform duration-300 group-hover:scale-110"
            />

            {isSearching ? t("searching") : t("searchTrains")}

            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>

          {results.length > 0 && (
            <TrainResults
              trains={results}
              journeyDate={journeyDate}
              quota={quota}
            />
          )}

          {hasSearched && results.length === 0 && (
            <motion.div
              id="train-results"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]"
            >
              <div className="relative px-6 py-10 text-center sm:px-10">
                {/* Glow */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.05] blur-3xl" />

                <div className="relative">
                  {/* Icon */}
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.06]">
                    <TrainFront
                      size={25}
                      strokeWidth={1.8}
                      className="text-cyan-300/80"
                    />
                  </div>

                  {/* Heading */}
                  <h3 className="mt-5 text-lg font-semibold text-white">
                    {t("noTrainsAvailable")}
                  </h3>

                  {/* Description */}
                  <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                  {t("noTrainsBetween")}{" "}
                    <span className="font-medium text-slate-300">
                      {fromStation?.name}
                    </span>{" "}
                    ({fromStation?.code}) {t("and")}{" "}
                    <span className="font-medium text-slate-300">
                      {toStation?.name}
                    </span>{" "}
                    ({toStation?.code}) {t("selectedJourneyDate")}
                  </p>

                  {/* Suggestion */}
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.025] px-4 py-2 text-xs text-slate-500">
                    <CalendarDays size={14} className="text-cyan-300/70" />
                    {t("tryAnotherJourneyDate")}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
