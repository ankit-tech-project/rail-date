"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Clock3, MapPin, TrainFront } from "lucide-react";
import type { TrainResult } from "@/lib/trainTypes";
import { useLanguage } from "@/components/LanguageProvider";
import TrainDetailsModal from "@/components/TrainDetailsModal";
import { useState } from "react";

interface TrainResultsProps {
  trains: TrainResult[];
  journeyDate: string;
  quota: string;
}

export default function TrainResults({
  trains,
  journeyDate,
  quota,
}: TrainResultsProps) {
  const { t } = useLanguage();
  const [selectedTrain, setSelectedTrain] = useState<TrainResult | null>(null);

  if (!trains.length) {
    return null;
  }

  return (
    <>
      <section id="train-results" className="mt-8 w-full scroll-mt-24">
        {/* Divider */}
        <div className="mb-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-white/5" />

          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-cyan-300/60" />
            <div className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
            <div className="h-1 w-1 rounded-full bg-cyan-300/60" />
          </div>

          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/10 to-white/5" />
        </div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-5"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
              <TrainFront className="h-4 w-4 text-cyan-300" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white text-left">
                {t("availableTrains")}
              </h2>

              <p className="text-xs text-slate-400">
                {t("trainsFoundForJourney")}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Train Cards */}
        <div className="space-y-4">
          <AnimatePresence>
            {trains.map((train, index) => (
              <motion.div
                key={`${train.trainNumber}-${index}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.06,
                }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/20 hover:bg-white/[0.055]"
              >
                {/* Subtle glow */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-cyan-400/5 blur-3xl transition-opacity duration-300 group-hover:bg-cyan-400/10" />

                {/* Top row */}
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                      <TrainFront className="h-5 w-5 text-cyan-300" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-cyan-300">
                          {train.trainNumber}
                        </span>

                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-slate-400">
                          {train.trainType}
                        </span>
                      </div>

                      <h3 className="mt-1 text-base font-semibold text-white">
                        {train.trainName}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock3 className="h-3.5 w-3.5" />
                    <span>{train.duration}</span>
                  </div>
                </div>

                {/* Journey */}
                <div className="relative mt-6 rounded-xl border border-white/5 bg-black/10 p-4">
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    {/* Source */}
                    <div>
                      <p className="text-xl font-bold tracking-tight text-white">
                        {train.source.departure}
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-200">
                        {train.source.code}
                      </p>

                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                        {train.source.name}
                      </p>
                    </div>

                    {/* Route */}
                    <div className="flex min-w-[80px] flex-col items-center">
                      <div className="flex w-full items-center">
                        <div className="h-px flex-1 bg-white/10" />

                        <div className="mx-2 flex h-8 w-8 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10">
                          <ArrowRight className="h-3.5 w-3.5 text-cyan-300" />
                        </div>

                        <div className="h-px flex-1 bg-white/10" />
                      </div>

                      <span className="mt-1 text-[10px] text-slate-500">
                        {train.distance ? `${train.distance} km` : "Journey"}
                      </span>
                    </div>

                    {/* Destination */}
                    <div className="text-center">
                      <p className="text-xl font-bold tracking-tight text-white">
                        {train.destination.arrival}
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-200">
                        {train.destination.code}
                      </p>

                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                        {train.destination.name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom information */}
                <div className="relative mt-4 flex flex-col gap-3 border-t border-white/5 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Running days */}
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-slate-500" />

                    <div className="flex flex-wrap gap-1.5">
                      {train.runsOn.map((day) => (
                        <span
                          key={day}
                          className="rounded-md border border-white/5 bg-white/[0.03] px-1.5 py-1 text-[10px] text-slate-400"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Classes */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {train.classes.map((trainClass) => (
                      <span
                        key={trainClass}
                        className="rounded-md border border-cyan-400/10 bg-cyan-400/5 px-2 py-1 text-[10px] font-medium text-cyan-200/80"
                      >
                        {trainClass}
                      </span>
                    ))}
                  </div>
                </div>

                {/* View Details */}
                <div className="relative mt-4 border-t border-white/5 pt-4">
                  <button
                    type="button"
                    onClick={() => setSelectedTrain(train)}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.05] px-4 py-3 font-sans text-xs font-medium text-cyan-200 transition-all duration-300 hover:border-cyan-400/20 hover:bg-cyan-400/[0.08] hover:text-cyan-100"
                  >
                    <span>{t("viewDetails")}</span>

                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      <TrainDetailsModal
        train={selectedTrain}
        journeyDate={journeyDate}
        quota={quota}
        open={selectedTrain !== null}
        onClose={() => setSelectedTrain(null)}
      />
    </>
  );
}
