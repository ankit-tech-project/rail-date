"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Route,
  TrainFront,
  X,
} from "lucide-react";
import type { TrainResult } from "@/lib/trainTypes";
import { useLanguage } from "./LanguageProvider";

const fareCache = new Map<
  string,
  {
    classes: string[];
    fares: {
      classCode: string;
      totalFare: number;
      breakdown?: {
        baseFare?: number;
        reservationCharge?: number;
        superfastCharge?: number;
        tatkalFare?: number;
        goodsServiceTax?: number;
        cateringCharge?: number;
        dynamicFare?: number;
        otherCharge?: number;
      };
    }[];
  }
>();

const fareRequestCache = new Map<
  string,
  Promise<{
    classes: string[];
    fares: {
      classCode: string;
      totalFare: number;
      breakdown?: {
        baseFare?: number;
        reservationCharge?: number;
        superfastCharge?: number;
        tatkalFare?: number;
        goodsServiceTax?: number;
        cateringCharge?: number;
        dynamicFare?: number;
        otherCharge?: number;
      };
    }[];
  }>
>();

const routeCache = new Map<
  string,
  {
    trainNumber: string;
    stops: {
      sequence: number;
      code: string;
      name: string;
      lat?: number;
      lng?: number;
    }[];
  }
>();

const routeRequestCache = new Map<
  string,
  Promise<{
    trainNumber: string;
    stops: {
      sequence: number;
      code: string;
      name: string;
      lat?: number;
      lng?: number;
    }[];
  }>
>();

const scheduleCache = new Map<
  string,
  {
    trainNumber: string;
    stops: {
      sequence: number;
      code: string;
      name: string;
      arrival: number | null;
      departure: number | null;
      platform: string | null;
      isHalt: boolean;
    }[];
  }
>();

const scheduleRequestCache = new Map<
  string,
  Promise<{
    trainNumber: string;
    stops: {
      sequence: number;
      code: string;
      name: string;
      arrival: number | null;
      departure: number | null;
      platform: string | null;
      isHalt: boolean;
    }[];
  }>
>();

interface TrainDetailsModalProps {
  train: TrainResult | null;
  journeyDate: string;
  quota: string;
  open: boolean;
  onClose: () => void;
}

type DetailTab = "classes" | "stoppages" | "alternatives" | "more";

export default function TrainDetailsModal({
  train,
  journeyDate,
  quota,
  open,
  onClose,
}: TrainDetailsModalProps) {
  const { t } = useLanguage();

  const tabs: {
    id: DetailTab;
    label: string;
  }[] = [
    {
      id: "classes",
      label: t("classesAndFare"),
    },
    {
      id: "stoppages",
      label: t("stoppages"),
    },
    {
      id: "alternatives",
      label: t("alternatives"),
    },
    {
      id: "more",
      label: t("more"),
    },
  ];
  const [activeTab, setActiveTab] = useState<DetailTab>("classes");
  const [mounted, setMounted] = useState(false);

  const [fareData, setFareData] = useState<{
    classes: string[];
    fares: {
      classCode: string;
      totalFare: number;
      breakdown?: {
        baseFare?: number;
        reservationCharge?: number;
        superfastCharge?: number;
        tatkalFare?: number;
        goodsServiceTax?: number;
        cateringCharge?: number;
        dynamicFare?: number;
        otherCharge?: number;
      };
    }[];
  } | null>(null);

  const [isFareLoading, setIsFareLoading] = useState(false);
  const [fareError, setFareError] = useState("");
  const [routeData, setRouteData] = useState<{
    trainNumber: string;
    stops: {
      sequence: number;
      code: string;
      name: string;
      lat?: number;
      lng?: number;
    }[];
  } | null>(null);

  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState("");

  const [scheduleData, setScheduleData] = useState<{
    trainNumber: string;
    stops: {
      sequence: number;
      code: string;
      name: string;
      arrival: number | null;
      departure: number | null;
      platform: string | null;
      isHalt: boolean;
    }[];
  } | null>(null);

  const [isScheduleLoading, setIsScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState("");

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setActiveTab("classes");

      setRouteData(null);
      setRouteError("");
      setIsRouteLoading(false);

      setScheduleData(null);
      setScheduleError("");
      setIsScheduleLoading(false);
    }
  }, [open, train]);

  useEffect(() => {
    if (!open || !train || !journeyDate) {
      return;
    }

    const controller = new AbortController();

    const loadFareData = async () => {
      try {
        setIsFareLoading(true);
        setFareError("");
        setFareData(null);

        const apiDate = /^\d{4}-\d{2}-\d{2}$/.test(journeyDate)
          ? journeyDate
          : journeyDate.split("-").reverse().join("-");

        const cacheKey = [
          train.trainNumber,
          train.source.code,
          train.destination.code,
          apiDate,
          quota,
        ].join("-");

        const cachedFareData = fareCache.get(cacheKey);

        if (cachedFareData) {
          setFareData(cachedFareData);
          setIsFareLoading(false);
          return;
        }

        const params = new URLSearchParams({
          trainNumber: train.trainNumber,
          source: train.source.code,
          destination: train.destination.code,
          journeyDate: apiDate,
          quota,
        });

        let fareRequest = fareRequestCache.get(cacheKey);

        if (!fareRequest) {
          fareRequest = fetch(`/api/train-details/fare?${params.toString()}`, {
            signal: controller.signal,
          })
            .then(async (response) => {
              const data = await response.json();

              if (!response.ok || !data.success) {
                throw new Error(
                  data.message ?? "Unable to load fare information."
                );
              }

              return data.data;
            })
            .finally(() => {
              fareRequestCache.delete(cacheKey);
            });

          fareRequestCache.set(cacheKey, fareRequest);
        }

        const data = await fareRequest;

        fareCache.set(cacheKey, data);
        setFareData(data);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Fare loading error:", error);

        setFareError(
          error instanceof Error
            ? error.message
            : "Unable to load fare information."
        );
      } finally {
        setIsFareLoading(false);
      }
    };

    loadFareData();

    return () => {
      controller.abort();
    };
  }, [open, train, journeyDate, quota]);

  useEffect(() => {
    if (!open || !train || activeTab !== "stoppages") {
      return;
    }

    const controller = new AbortController();

    const loadRouteData = async () => {
      try {
        setIsRouteLoading(true);
        setRouteError("");

        const cacheKey = train.trainNumber;

        const cachedRouteData = routeCache.get(cacheKey);

        if (cachedRouteData) {
          setRouteData(cachedRouteData);
          setIsRouteLoading(false);
          return;
        }

        const params = new URLSearchParams({
          trainNumber: train.trainNumber,
        });

        let routeRequest = routeRequestCache.get(cacheKey);

        if (!routeRequest) {
          routeRequest = fetch(
            `/api/train-details/route?${params.toString()}`,
            {
              signal: controller.signal,
            }
          )
            .then(async (response) => {
              const data = await response.json();

              if (!response.ok || !data.success) {
                throw new Error(data.message ?? "Unable to load train route.");
              }

              return data.data;
            })
            .finally(() => {
              routeRequestCache.delete(cacheKey);
            });

          routeRequestCache.set(cacheKey, routeRequest);
        }

        const data = await routeRequest;

        routeCache.set(cacheKey, data);
        setRouteData(data);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Route loading error:", error);

        setRouteError(
          error instanceof Error
            ? error.message
            : "Unable to load train route information."
        );
      } finally {
        setIsRouteLoading(false);
      }
    };

    loadRouteData();

    return () => {
      controller.abort();
    };
  }, [open, train, activeTab]);

  useEffect(() => {
    if (!open || !train || activeTab !== "stoppages") {
      return;
    }

    const controller = new AbortController();

    const loadScheduleData = async () => {
      try {
        setIsScheduleLoading(true);
        setScheduleError("");

        const cacheKey = train.trainNumber;

        const cachedScheduleData = scheduleCache.get(cacheKey);

        if (cachedScheduleData) {
          setScheduleData(cachedScheduleData);
          setIsScheduleLoading(false);
          return;
        }

        const params = new URLSearchParams({
          trainNumber: train.trainNumber,
        });

        let scheduleRequest = scheduleRequestCache.get(cacheKey);

        if (!scheduleRequest) {
          scheduleRequest = fetch(
            `/api/train-details/schedule?${params.toString()}`,
            {
              signal: controller.signal,
            }
          )
            .then(async (response) => {
              const data = await response.json();

              if (!response.ok || !data.success) {
                throw new Error(
                  data.message ?? "Unable to load train schedule."
                );
              }

              return data.data;
            })
            .finally(() => {
              scheduleRequestCache.delete(cacheKey);
            });

          scheduleRequestCache.set(cacheKey, scheduleRequest);
        }

        const data = await scheduleRequest;

        scheduleCache.set(cacheKey, data);
        setScheduleData(data);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Schedule loading error:", error);

        setScheduleError(
          error instanceof Error
            ? error.message
            : "Unable to load train schedule information."
        );
      } finally {
        setIsScheduleLoading(false);
      }
    };

    loadScheduleData();

    return () => {
      controller.abort();
    };
  }, [open, train, activeTab]);

  const formatScheduleTime = (minutes: number | null | undefined) => {
    if (minutes === null || minutes === undefined) {
      return "—";
    }

    const normalizedMinutes = ((minutes % 1440) + 1440) % 1440;

    const hours = Math.floor(normalizedMinutes / 60);
    const mins = normalizedMinutes % 60;

    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  };

  if (!mounted || !train) {
    return null;
  }

  const actualStoppageCount =
    routeData?.stops.filter((stop) => {
      const scheduleStop = scheduleData?.stops.find(
        (item) => item.code === stop.code
      );

      return (
        scheduleStop?.isHalt === true ||
        stop.code === train.source.code ||
        stop.code === train.destination.code
      );
    }).length ?? 0;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 30,
              scale: 0.98,
            }}
            transition={{
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative flex h-[calc(100dvh-2rem)] max-h-[900px] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#121722] shadow-2xl shadow-black/40 sm:h-[88vh] sm:max-h-[900px]"
          >
            {/* Subtle glow */}
            <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

            {/* Header */}
            <div className="relative shrink-0 border-b border-white/10 px-5 py-5 sm:px-7 sm:py-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                    <TrainFront className="h-5 w-5 text-cyan-300" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-cyan-300">
                        {train.trainNumber}
                      </span>

                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-slate-400">
                        {train.trainType}
                      </span>
                    </div>

                    <h2 className="mt-1 truncate text-base font-semibold text-white sm:text-lg">
                      {train.trainName}
                    </h2>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                      <span>
                        {train.source.code} → {train.destination.code}
                      </span>

                      <span className="text-white/20">•</span>

                      <span>
                        {train.source.departure} → {train.destination.arrival}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close details"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition-all duration-200 hover:border-white/15 hover:bg-white/[0.08] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="relative shrink-0 border-b border-white/10 bg-[#121722]/95 backdrop-blur-xl">
              <div className="flex overflow-x-auto px-4 scrollbar-none sm:px-6">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className="relative shrink-0 px-4 py-3.5 text-xs font-semibold transition-colors duration-200 sm:px-5"
                    >
                      <span
                        className={
                          isActive
                            ? "text-cyan-200"
                            : "text-slate-500 hover:text-slate-300"
                        }
                      >
                        {tab.label}
                      </span>

                      {isActive && (
                        <motion.div
                          layoutId="train-details-active-tab"
                          className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-cyan-300 shadow-lg shadow-cyan-400/30 sm:inset-x-4"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="train-details-scrollbar relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="p-5 sm:p-7"
                >
                  {activeTab === "classes" && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-base font-semibold text-white">
                          {t("classesAndFareTitle")}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {t("classesAndFareDescription")}
                        </p>
                      </div>

                      {isFareLoading ? (
                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-8 text-center">
                          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-cyan-300/20 border-t-cyan-300" />

                          <p className="mt-4 text-sm font-medium text-slate-300">
                            {t("loadingFareInformation")}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {t("fetchingClassesAndFares")}
                          </p>
                        </div>
                      ) : fareError ? (
                        <div className="rounded-2xl border border-amber-400/10 bg-amber-400/[0.04] p-6 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-400/10 bg-amber-400/5">
                            <TrainFront className="h-5 w-5 text-amber-300/70" />
                          </div>

                          <p className="mt-4 text-sm font-medium text-slate-300">
                            {t("fareInformationUnavailable")}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {t("fareDetailsCouldNotBeLoaded")}
                          </p>
                        </div>
                      ) : fareData?.fares?.length ? (
                        <div className="space-y-3">
                          {fareData?.fares?.map((fare) => (
                            <div
                              key={fare.classCode}
                              className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 transition-colors duration-200 hover:border-cyan-400/10 hover:bg-white/[0.035]"
                            >
                              <div className="flex items-center justify-between gap-4">
                                <div>
                                  <p className="text-sm font-semibold text-white">
                                    {fare?.classCode}
                                  </p>

                                  <p className="mt-1 text-xs text-slate-500">
                                    {fare?.classCode === "SL"
                                      ? "Sleeper Class"
                                      : fare.classCode === "3A"
                                      ? "AC 3 Tier"
                                      : fare.classCode === "2A"
                                      ? "AC 2 Tier"
                                      : fare.classCode === "1A"
                                      ? "AC First Class"
                                      : fare.classCode === "CC"
                                      ? "AC Chair Car"
                                      : fare.classCode === "EC"
                                      ? "Executive Chair Car"
                                      : fare.classCode === "2S"
                                      ? "Second Sitting"
                                      : "Travel Class"}
                                  </p>
                                </div>

                                <div className="text-right">
                                  <p className="text-xl font-bold tracking-tight text-cyan-200">
                                    ₹{fare?.totalFare}
                                  </p>

                                  <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
                                    {t("totalFare")}
                                  </p>
                                </div>
                              </div>

                              {fare?.breakdown && (
                                <div className="mt-4 border-t border-white/5 pt-3">
                                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                                    {fare?.breakdown?.baseFare !==
                                      undefined && (
                                      <div className="flex justify-between gap-3 text-slate-500">
                                        <span>{t("baseFare")}</span>
                                        <span className="text-slate-300">
                                          ₹{fare?.breakdown?.baseFare}
                                        </span>
                                      </div>
                                    )}

                                    {fare?.breakdown?.reservationCharge !==
                                      undefined && (
                                      <div className="flex justify-between gap-3 text-slate-500">
                                        <span>{t("reservation")}</span>
                                        <span className="text-slate-300">
                                          ₹{fare?.breakdown?.reservationCharge}
                                        </span>
                                      </div>
                                    )}

                                    {fare?.breakdown?.superfastCharge !==
                                      undefined &&
                                      fare?.breakdown?.superfastCharge > 0 && (
                                        <div className="flex justify-between gap-3 text-slate-500">
                                          <span>{t("superfast")}</span>
                                          <span className="text-slate-300">
                                            ₹{fare?.breakdown?.superfastCharge}
                                          </span>
                                        </div>
                                      )}

                                    {fare?.breakdown?.goodsServiceTax !==
                                      undefined &&
                                      fare?.breakdown?.goodsServiceTax > 0 && (
                                        <div className="flex justify-between gap-3 text-slate-500">
                                          <span>GST</span>
                                          <span className="text-slate-300">
                                            ₹{fare?.breakdown?.goodsServiceTax}
                                          </span>
                                        </div>
                                      )}

                                    {fare?.breakdown?.cateringCharge !==
                                      undefined &&
                                      fare?.breakdown?.cateringCharge > 0 && (
                                        <div className="flex justify-between gap-3 text-slate-500">
                                          <span>{t("catering")}</span>
                                          <span className="text-slate-300">
                                            ₹{fare?.breakdown?.cateringCharge}
                                          </span>
                                        </div>
                                      )}

                                    {fare?.breakdown?.otherCharge !==
                                      undefined &&
                                      fare?.breakdown?.otherCharge > 0 && (
                                        <div className="flex justify-between gap-3 text-slate-500">
                                          <span>{t("otherCharges")}</span>
                                          <span className="text-slate-300">
                                            ₹{fare?.breakdown?.otherCharge}
                                          </span>
                                        </div>
                                      )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-6 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/5">
                            <TrainFront className="h-5 w-5 text-cyan-300/70" />
                          </div>

                          <p className="mt-4 text-sm font-medium text-slate-300">
                            {t("noFareInformationAvailable")}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {t("fareDetailsNotAvailable")}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "stoppages" && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-base font-semibold text-white">
                          {t("stationStoppages")}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {t("stationStoppagesDescription")}
                        </p>
                      </div>

                      {isRouteLoading || isScheduleLoading ? (
                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-8 text-center">
                          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-cyan-300/20 border-t-cyan-300" />

                          <p className="mt-4 text-sm font-medium text-slate-300">
                            {t("loadingStoppages")}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {t("fetchingTrainRouteAndStoppages")}
                          </p>
                        </div>
                      ) : routeError || scheduleError ? (
                        <div className="rounded-2xl border border-amber-400/10 bg-amber-400/[0.04] p-6 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-400/10 bg-amber-400/5">
                            <Route className="h-5 w-5 text-amber-300/70" />
                          </div>

                          <p className="mt-4 text-sm font-medium text-slate-300">
                            {t("stoppageInformationUnavailable")}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {routeError || scheduleError}
                          </p>
                        </div>
                      ) : routeData?.stops?.length &&
                        scheduleData?.stops?.length ? (
                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 sm:p-5">
                          <div className="mb-5 flex items-center justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-slate-100">
                                {t("trainRoute")}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {actualStoppageCount} {t("stoppagesCount")}
                              </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-2 rounded-full border border-cyan-300/10 bg-cyan-300/[0.05] px-3 py-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_rgba(103,232,249,0.6)]" />

                              <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-300">
                                {t("yourJourney")}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-0">
                            {routeData?.stops
                              .filter((stop) => {
                                const scheduleStop = scheduleData?.stops.find(
                                  (item) => item.code === stop.code
                                );

                                if (!scheduleStop) {
                                  return false;
                                }

                                return (
                                  scheduleStop.isHalt === true ||
                                  stop.code === train.source.code ||
                                  stop.code === train.destination.code
                                );
                              })
                              .map((stop, index, filteredStops) => {
                                const scheduleStop = scheduleData?.stops.find(
                                  (item) => item.code === stop.code
                                );
                                const originIndex = filteredStops.findIndex(
                                  (item) => item.code === train.source.code
                                );

                                const destinationIndex =
                                  filteredStops.findIndex(
                                    (item) =>
                                      item.code === train.destination.code
                                  );

                                const journeyStartIndex = Math.min(
                                  originIndex === -1 ? 0 : originIndex,
                                  destinationIndex === -1
                                    ? filteredStops.length - 1
                                    : destinationIndex
                                );

                                const journeyEndIndex = Math.max(
                                  originIndex === -1 ? 0 : originIndex,
                                  destinationIndex === -1
                                    ? filteredStops.length - 1
                                    : destinationIndex
                                );

                                const isOrigin =
                                  stop.code === train.source.code;

                                const isDestination =
                                  stop.code === train.destination.code;

                                const isLast =
                                  index === filteredStops.length - 1;

                                const isJourneyStop =
                                  index >= journeyStartIndex &&
                                  index <= journeyEndIndex;

                                const isJourneyLine =
                                  index >= journeyStartIndex &&
                                  index < journeyEndIndex;

                                return (
                                  <div
                                    key={`${stop?.sequence}-${stop?.code}`}
                                    className="relative flex gap-4"
                                  >
                                    {/* Timeline */}
                                    <div className="relative flex w-8 shrink-0 justify-center">
                                      {!isLast && (
                                        <div
                                          className={[
                                            "absolute top-7 bottom-0 w-px transition-colors duration-300",
                                            isJourneyLine
                                              ? "bg-cyan-300/50 shadow-[0_0_8px_rgba(103,232,249,0.18)]"
                                              : "bg-white/10",
                                          ].join(" ")}
                                        />
                                      )}

                                      <div
                                        className={[
                                          "relative z-10 mt-1 flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-300",
                                          isOrigin || isDestination
                                            ? "border-cyan-300/50 bg-cyan-400/10 shadow-lg shadow-cyan-500/15"
                                            : isJourneyStop
                                            ? "border-cyan-300/20 bg-cyan-400/[0.05]"
                                            : "border-white/10 bg-[#151b27]",
                                        ].join(" ")}
                                      >
                                        <span
                                          className={[
                                            "rounded-full transition-all duration-300",
                                            isOrigin || isDestination
                                              ? "h-2.5 w-2.5 bg-cyan-200 shadow-[0_0_8px_rgba(103,232,249,0.5)]"
                                              : isJourneyStop
                                              ? "h-2 w-2 bg-cyan-300/60"
                                              : "h-2 w-2 bg-slate-600",
                                          ].join(" ")}
                                        />
                                      </div>
                                    </div>

                                    {/* Station */}
                                    <div
                                      className={[
                                        "mb-1 flex min-w-0 flex-1 items-center justify-between gap-4 rounded-xl px-3 py-3 transition-all duration-300",
                                        isOrigin || isDestination
                                          ? "border border-cyan-400/15 bg-cyan-400/[0.06] shadow-sm shadow-cyan-500/5"
                                          : isJourneyStop
                                          ? "border border-transparent bg-cyan-400/[0.015]"
                                          : "border border-transparent",
                                      ].join(" ")}
                                    >
                                      <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                          <p
                                            className={[
                                              "truncate text-sm font-medium",
                                              isOrigin || isDestination
                                                ? "text-cyan-100"
                                                : isJourneyStop
                                                ? "text-slate-200"
                                                : "text-slate-300",
                                            ].join(" ")}
                                          >
                                            {stop?.name}
                                          </p>

                                          {(isOrigin || isDestination) && (
                                            <span className="rounded-full border border-cyan-300/10 bg-cyan-300/[0.06] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-cyan-300">
                                              {isOrigin
                                                ? "Boarding"
                                                : "Destination"}
                                            </span>
                                          )}
                                        </div>

                                        <p
                                          className={[
                                            "mt-1 text-[11px] font-medium uppercase tracking-[0.14em]",
                                            isOrigin || isDestination
                                              ? "text-cyan-300/60"
                                              : "text-slate-500",
                                          ].join(" ")}
                                        >
                                          {stop?.code}
                                        </p>
                                      </div>

                                      <div className="shrink-0 text-right">
                                        {scheduleStop ? (
                                          (() => {
                                            const arrival =
                                              scheduleStop.arrival;

                                            const departure =
                                              scheduleStop.departure;

                                            const hasArrival = arrival !== null;

                                            const hasDeparture =
                                              departure !== null;

                                            const sameTime =
                                              hasArrival &&
                                              hasDeparture &&
                                              arrival === departure;

                                            return (
                                              <div className="min-w-[78px]">
                                                {sameTime ? (
                                                  <p
                                                    className={[
                                                      "text-sm font-semibold tabular-nums",
                                                      isOrigin || isDestination
                                                        ? "text-cyan-100"
                                                        : "text-slate-200",
                                                    ].join(" ")}
                                                  >
                                                    {formatScheduleTime(
                                                      arrival
                                                    )}
                                                  </p>
                                                ) : (
                                                  <div className="space-y-1">
                                                    {hasArrival && (
                                                      <div className="flex items-center justify-end gap-2">
                                                        <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                                                          {t("arrival")}
                                                        </span>

                                                        <span
                                                          className={[
                                                            "text-sm font-semibold tabular-nums",
                                                            isOrigin ||
                                                            isDestination
                                                              ? "text-cyan-100"
                                                              : "text-slate-200",
                                                          ].join(" ")}
                                                        >
                                                          {formatScheduleTime(
                                                            arrival
                                                          )}
                                                        </span>
                                                      </div>
                                                    )}

                                                    {hasDeparture && (
                                                      <div className="flex items-center justify-end gap-2">
                                                        <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                                                          {t("departure")}
                                                        </span>

                                                        <span className="text-[10px] font-medium tabular-nums text-slate-500">
                                                          {formatScheduleTime(
                                                            departure
                                                          )}
                                                        </span>
                                                      </div>
                                                    )}
                                                  </div>
                                                )}

                                                {scheduleStop?.platform && (
                                                  <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.1em] text-cyan-300/50">
                                                    {t("platform")}{" "}
                                                    {scheduleStop?.platform}
                                                  </p>
                                                )}
                                              </div>
                                            );
                                          })()
                                        ) : isScheduleLoading ? (
                                          <div className="h-8 w-16 animate-pulse rounded-md bg-white/[0.04]" />
                                        ) : scheduleError ? (
                                          <p className="max-w-[90px] text-[9px] leading-4 text-slate-600">
                                            {t("timeUnavailable")}
                                          </p>
                                        ) : (
                                          <>
                                            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-600">
                                              {t("stop")}
                                            </p>

                                            <p className="mt-1 text-xs font-semibold text-slate-400">
                                              #{stop?.sequence}
                                            </p>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-8 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03]">
                            <MapPin className="h-5 w-5 text-slate-500" />
                          </div>

                          <p className="mt-4 text-sm font-medium text-slate-300">
                            {t("noStoppageInformationAvailable")}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {t("routeInformationCouldNotBeFound")}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "alternatives" && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-base font-semibold text-white">
                          {t("alternativeJourney")}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {t("alternativeJourneyDescription")}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-6 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/5">
                          <Route className="h-5 w-5 text-cyan-300/70" />
                        </div>

                        <p className="mt-4 text-sm font-medium text-slate-300">
                          {t("alternativeRoutesComingSoon")}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {t("connectingJourneysDescription")}
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === "more" && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-base font-semibold text-white">
                          {t("moreInformation")}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {t("moreInformationDescription")}
                        </p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                          <div className="flex items-center gap-2">
                            <TrainFront className="h-4 w-4 text-cyan-300/70" />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                              {t("trainNumber")}
                            </span>
                          </div>

                          <p className="mt-3 text-sm font-semibold text-slate-200">
                            {train?.trainNumber}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                          <div className="flex items-center gap-2">
                            <Clock3 className="h-4 w-4 text-cyan-300/70" />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                              {t("journeyDuration")}
                            </span>
                          </div>

                          <p className="mt-3 text-sm font-semibold text-slate-200">
                            {train?.duration || "—"}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                          <div className="flex items-center gap-2">
                            <Route className="h-4 w-4 text-cyan-300/70" />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                              {t("distance")}
                            </span>
                          </div>

                          <p className="mt-3 text-sm font-semibold text-slate-200">
                            {train?.distance ? `${train?.distance} km` : "—"}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-cyan-300/70" />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                              {t("runsOn")}
                            </span>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {train?.runsOn?.length > 0 ? (
                              train?.runsOn?.map((day) => (
                                <span
                                  key={day}
                                  className="rounded-md border border-white/5 bg-white/[0.03] px-2 py-1 text-[10px] text-slate-400"
                                >
                                  {day}
                                </span>
                              ))
                            ) : (
                              <span className="text-sm text-slate-500">—</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
