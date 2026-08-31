"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { DayPicker } from "@daypicker/react";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { formatLongDate } from "@/lib/dateUtils";
import { useLanguage } from "@/components/LanguageProvider";
import "@daypicker/react/style.css";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  minDate?: Date;
}

/* =========================================================
   DATE HELPERS
   ========================================================= */

function formatInputDate(date: Date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseInputDate(value: string): Date | undefined {
  if (!value) {
    return undefined;
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return undefined;
  }

  return new Date(year, month - 1, day);
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/* =========================================================
   DATE PICKER
   ========================================================= */

export default function DatePicker({
  value,
  onChange,
  minDate = new Date(),
}: DatePickerProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  /*
   * Portal mounting state.
   *
   * We wait until the component is mounted in the browser
   * before rendering the calendar into document.body.
   */
  const [mounted, setMounted] = useState(false);

  const selectedDate = useMemo(() => parseInputDate(value), [value]);

  const today = useMemo(() => startOfDay(new Date()), []);

  const minimumDate = useMemo(() => startOfDay(minDate), [minDate]);

  /* =======================================================
     MOUNT
     ======================================================= */

  useEffect(() => {
    setMounted(true);
  }, []);

  /* =======================================================
     ESCAPE KEY
     ======================================================= */

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  /* =======================================================
     PREVENT PAGE SCROLL WHILE CALENDAR IS OPEN
     ======================================================= */

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    const previousPaddingRight = document.body.style.paddingRight;

    /*
     * Prevent background page scrolling.
     */
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;

      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [open]);

  /* =======================================================
     DATE SELECTION
     ======================================================= */

  const handleSelect = (date: Date | undefined) => {
    if (!date) {
      return;
    }

    onChange(formatInputDate(date));

    setOpen(false);
  };

  /* =======================================================
     TODAY
     ======================================================= */

  const handleToday = () => {
    onChange(formatInputDate(today));

    setOpen(false);
  };

  /* =======================================================
     CLEAR
     ======================================================= */

  const handleClear = () => {
    onChange("");

    setOpen(false);
  };

  /* =======================================================
     CALENDAR MODAL
     ======================================================= */

  const calendarModal =
    open && mounted
      ? createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-[5px]"
            onMouseDown={(event) => {
              /*
               * Clicking the backdrop closes the calendar.
               */
              if (event.target === event.currentTarget) {
                setOpen(false);
              }
            }}
          >
            {/* =================================================
                CALENDAR CARD
               ================================================= */}

            <div
              className="
                relative
                w-full
                max-w-[460px]
                overflow-hidden
                rounded-[26px]
                border
                border-white/[0.11]
                bg-[#0B1020]/[0.985]
                shadow-[0_35px_120px_rgba(0,0,0,0.70)]
                backdrop-blur-2xl
              "
              onMouseDown={(event) => {
                /*
                 * Prevent clicks inside the calendar from
                 * closing the modal.
                 */
                event.stopPropagation();
              }}
            >
              {/* =================================================
                  AMBIENT GLOW
                 ================================================= */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-28
                  -top-28
                  h-72
                  w-72
                  rounded-full
                  bg-indigo-500/[0.11]
                  blur-3xl
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-32
                  -left-28
                  h-72
                  w-72
                  rounded-full
                  bg-cyan-500/[0.07]
                  blur-3xl
                "
              />

              {/* =================================================
                  CONTENT
                 ================================================= */}

              <div className="relative p-5 sm:p-6">
                {/* =================================================
                    HEADER
                   ================================================= */}

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-indigo-400/[0.12]
                        bg-indigo-500/[0.10]
                      "
                    >
                      <CalendarDays size={19} className="text-indigo-400" />
                    </div>

                    {/* Text */}
                    <div>
                      <p
                        className="
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-[0.18em]
                          text-indigo-400
                        "
                      >
                        {t("selectJourneyDate")}
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-slate-500
                        "
                      >
                        {t("chooseWhenTravelling")}
                      </p>
                    </div>
                  </div>

                  {/* Close */}
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label={t("closeCalendar")}
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/[0.07]
                      bg-white/[0.025]
                      text-slate-500
                      transition-all
                      duration-200
                      hover:border-white/[0.13]
                      hover:bg-white/[0.06]
                      hover:text-white
                    "
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* =================================================
                    CALENDAR
                   ================================================= */}

                <div className="mt-5">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleSelect}
                    defaultMonth={selectedDate ?? today}
                    startMonth={new Date(today.getFullYear(), today.getMonth())}
                    disabled={{
                      before: minimumDate,
                    }}
                    showOutsideDays
                    fixedWeeks
                    classNames={{
                      root: "rail-calendar",
                      months: "rail-calendar-months",
                      month: "rail-calendar-month",
                      month_caption: "rail-calendar-caption",
                      caption_label: "rail-calendar-caption-label",
                      nav: "rail-calendar-nav",
                      button_previous: "rail-calendar-nav-button",
                      button_next: "rail-calendar-nav-button",
                      month_grid: "rail-calendar-grid",
                      weekdays: "rail-calendar-weekdays",
                      weekday: "rail-calendar-weekday",
                      week: "rail-calendar-week",
                      day: "rail-calendar-day",
                      day_button: "rail-calendar-day-button",
                      selected: "rail-calendar-selected",
                      today: "rail-calendar-today",
                      outside: "rail-calendar-outside",
                      disabled: "rail-calendar-disabled",
                    }}
                    components={{
                      Chevron: ({ orientation, ...props }) => {
                        if (orientation === "left") {
                          return <ChevronLeft {...props} size={17} />;
                        }

                        return <ChevronRight {...props} size={17} />;
                      },
                    }}
                  />
                </div>

                {/* =================================================
                    FOOTER
                   ================================================= */}

                <div
                  className="
                    mt-4
                    flex
                    items-center
                    justify-between
                    border-t
                    border-white/[0.07]
                    pt-4
                  "
                >
                  {/* Clear */}
                  <button
                    type="button"
                    onClick={handleClear}
                    className="
                      rounded-xl
                      px-4
                      py-2.5
                      text-xs
                      font-medium
                      text-slate-500
                      transition-all
                      duration-200
                      hover:bg-white/[0.05]
                      hover:text-white
                    "
                  >
                    {t("clear")}
                  </button>

                  {/* Today */}
                  <button
                    type="button"
                    onClick={handleToday}
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-indigo-400/[0.22]
                      bg-indigo-400/[0.08]
                      px-4
                      py-2.5
                      text-xs
                      font-semibold
                      text-indigo-300
                      transition-all
                      duration-200
                      hover:border-indigo-400/[0.35]
                      hover:bg-indigo-400/[0.14]
                      hover:text-indigo-200
                    "
                  >
                    <CalendarDays size={14} />
                    {t("today")}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  /* =========================================================
     RETURN
     ========================================================= */

  return (
    <>
      {/* =======================================================
          TRIGGER
         ======================================================= */}

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-haspopup="dialog"
          className="
            group
            flex
            h-14
            w-full
            items-center
            gap-3
            rounded-xl
            border
            border-white/10
            bg-white/[0.04]
            px-4
            text-left
            outline-none
            transition-all
            duration-300
            hover:border-white/20
            hover:bg-white/[0.055]
            focus:border-indigo-500/60
            focus:ring-4
            focus:ring-indigo-500/10
          "
        >
          {/* Calendar Icon */}
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-indigo-500/10
              transition-colors
              group-hover:bg-indigo-500/15
            "
          >
            <CalendarDays size={18} className="text-indigo-400" />
          </div>

          {/* Value */}
          <div className="min-w-0 flex-1">
            {selectedDate ? (
              <>
                <p className="truncate text-sm font-medium text-white">
                  {formatLongDate(selectedDate)}
                </p>

                <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-slate-600">
                  {t("journeyDate")}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-slate-400">
                  {t("selectYourJourneyDate")}
                </p>

                <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-slate-600">
                  {t("chooseADate")}
                </p>
              </>
            )}
          </div>

          {/* Clear */}
          {selectedDate && (
            <span
              role="button"
              tabIndex={0}
              aria-label={t("clearDate")}
              onClick={(event) => {
                event.stopPropagation();

                handleClear();
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  event.stopPropagation();

                  handleClear();
                }
              }}
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                text-slate-500
                transition
                hover:bg-white/[0.06]
                hover:text-white
              "
            >
              <X size={16} />
            </span>
          )}

          {/* Arrow */}
          <ChevronRight
            size={18}
            className={`
              shrink-0
              text-slate-600
              transition-transform
              duration-300
              ${
                open
                  ? "rotate-90 text-indigo-400"
                  : "group-hover:text-slate-400"
              }
            `}
          />
        </button>
      </div>

      {/* =======================================================
          PORTAL CALENDAR
         ======================================================= */}

      {calendarModal}
    </>
  );
}
