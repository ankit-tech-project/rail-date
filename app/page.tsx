"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ArrowRight,
  TrainFront,
  RotateCcw,
} from "lucide-react";
import { motion } from "framer-motion";

import DatePicker from "@/components/DatePicker";
import BookingResult from "@/components/BookingResult";
import { calculateBookingDate } from "@/lib/bookingDate";
import {
  formatInputDate,
  formatLongDate,
} from "@/lib/dateUtils";

export default function Home() {
  const [journeyDate, setJourneyDate] = useState("");
  const [result, setResult] = useState<
    ReturnType<typeof calculateBookingDate> | null
  >(null);

  const [error, setError] = useState("");

  /*
   * Today's date in YYYY-MM-DD format.
   * This is used by the native date picker as its minimum.
   */
  const todayString = useMemo(() => {
    return formatInputDate(new Date());
  }, []);

  

  const handleCalculate = () => {
    setError("");

    if (!journeyDate) {
      setError(
        "Please select your journey date."
      );

      return;
    }

    const calculated =
      calculateBookingDate(journeyDate);

    setResult(calculated);
  };

  const handleToday = () => {
    setJourneyDate(todayString);

    setError("");

    setResult(null);
  };

  const handleClear = () => {
    setJourneyDate("");

    setError("");

    setResult(null);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#070B14] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-220px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[140px]" />

        <div className="absolute bottom-[-200px] left-[-150px] h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[140px]" />

        <div className="absolute right-[-150px] top-[35%] h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[140px]" />
      </div>

      {/* Main */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col px-5 py-8 sm:px-8 lg:px-10">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-lg shadow-indigo-500/20">
              <TrainFront
                size={21}
                strokeWidth={2.2}
              />
            </div>

            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-white">
                RAILDATE
              </p>

              <p className="text-[10px] tracking-wide text-slate-500">
                INDIAN RAILWAY DATE CALCULATOR
              </p>
            </div>
          </div>

          <div className="hidden rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-slate-400 sm:block">
            60 Day Advance Reservation
          </div>
        </header>

        {/* Hero */}
        <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center py-16 text-center">
          {/* Hero Text */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            {/* Badge */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/[0.07] px-4 py-2 text-xs font-medium text-indigo-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />

              Plan your journey smarter
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Know when to
              <br />

              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                book your ticket.
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
              Select your journey date and instantly
              find out when your train ticket booking
              window opens.
            </p>
          </motion.div>

          {/* Calculator */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.15,
            }}
            className="mt-12 w-full"
          >
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-3 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-4">
              <div className="rounded-2xl border border-white/[0.06] bg-[#0D121D]/90 p-5 sm:p-7">
                {/* Label row */}
                <div className="mb-3 flex items-center justify-between">
                  <label
                    htmlFor="journey-date"
                    className="text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-400"
                  >
                    Journey Date
                  </label>

                  <span className="text-[11px] text-slate-600">
                    Required
                  </span>
                </div>

                {/* Date input */}
                <DatePicker
  value={journeyDate}
  onChange={(value) => {
    setJourneyDate(value);

    setError("");

    setResult(null);
  }}
  minDate={new Date()}
/>

               

                
                

                {/* Error */}
                {error && (
                  <motion.p
                    initial={{
                      opacity: 0,
                      y: -5,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="mt-3 text-left text-xs font-medium text-rose-400"
                  >
                    {error}
                  </motion.p>
                )}

                {/* Calculate */}
                <button
                  type="button"
                  onClick={handleCalculate}
                  className="group mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-indigo-500/25 active:scale-[0.99]"
                >
                  Calculate Booking Date

                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Result */}
          {result && (
            <BookingResult result={result} />
          )}

          {/* Information */}
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.7,
              delay: 0.35,
            }}
            className="mt-8 flex max-w-lg items-start gap-3 text-left"
          >
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.05]">
              <CalendarDays
                size={14}
                className="text-slate-500"
              />
            </div>

            <p className="text-xs leading-5 text-slate-500">
              The general Advance Reservation Period
              is 60 days before the journey date,
              excluding the journey date. Opening-day
              booking is available after 8:00 AM IST.
              Some trains may have a shorter
              reservation period.
            </p>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] py-6 text-[11px] text-slate-600 sm:flex-row">
          <p>
            RAILDATE · Personal Utility
          </p>

          <p>
            Built for easier journey planning.
          </p>
        </footer>
      </div>
    </main>
  );
}