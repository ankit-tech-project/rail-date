"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Copy,
  Download,
  Ticket,
} from "lucide-react";

import { useState } from "react";
import { jsPDF } from "jspdf";

import { BookingDateResult } from "@/lib/bookingDate";
import { useLanguage } from "@/components/LanguageProvider";
import { formatLongDate } from "@/lib/dateUtils";

interface BookingResultProps {
  result: BookingDateResult;
}

export default function BookingResult({ result }: BookingResultProps) {
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState(false);

  const journeyDateText = formatLongDate(result.journeyDate);

  const bookingDateText = formatLongDate(result.bookingDate);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bookingDateText);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      console.error("Unable to copy booking date.");
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const margin = 18;

    /*
     * -------------------------------------------------------
     * PRINT-FRIENDLY COLORS
     * -------------------------------------------------------
     */

    const background = [255, 255, 255] as const;

    const card = [248, 250, 252] as const;

    const cardLight = [241, 245, 249] as const;

    const white = [255, 255, 255] as const;

    const text = [15, 23, 42] as const;

    const muted = [100, 116, 139] as const;

    const border = [226, 232, 240] as const;

    const blue = [37, 99, 235] as const;

    const blueDark = [30, 64, 175] as const;

    const green = [22, 163, 74] as const;

    const greenLight = [240, 253, 244] as const;

    const greenBorder = [187, 247, 208] as const;

    /*
     * -------------------------------------------------------
     * BACKGROUND
     * -------------------------------------------------------
     */

    doc.setFillColor(background[0], background[1], background[2]);

    doc.rect(0, 0, pageWidth, pageHeight, "F");

    /*
     * -------------------------------------------------------
     * HEADER ACCENT
     * -------------------------------------------------------
     */

    doc.setFillColor(blue[0], blue[1], blue[2]);

    doc.roundedRect(margin, 18, pageWidth - margin * 2, 3, 1.5, 1.5, "F");

    /*
     * -------------------------------------------------------
     * BRAND
     * -------------------------------------------------------
     */

    doc.setFont("helvetica", "bold");

    doc.setFontSize(22);

    doc.setTextColor(text[0], text[1], text[2]);

    doc.text("RAILDATE", margin, 35);

    doc.setFont("helvetica", "normal");

    doc.setFontSize(9);

    doc.setTextColor(muted[0], muted[1], muted[2]);

    doc.text("Train Ticket Booking Date Calculator", margin, 42);

    /*
     * -------------------------------------------------------
     * REPORT LABEL
     * -------------------------------------------------------
     */

    doc.setFont("helvetica", "bold");

    doc.setFontSize(8);

    doc.setTextColor(blueDark[0], blueDark[1], blueDark[2]);

    doc.text("BOOKING INFORMATION", pageWidth - margin, 35, {
      align: "right",
    });

    /*
     * -------------------------------------------------------
     * MAIN RESULT CARD
     * -------------------------------------------------------
     */

    const cardX = margin;

    const cardY = 57;

    const cardWidth = pageWidth - margin * 2;

    const cardHeight = 112;

    /*
     * Card background
     */

    doc.setFillColor(card[0], card[1], card[2]);

    doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 6, 6, "F");

    /*
     * Card border
     */

    doc.setDrawColor(border[0], border[1], border[2]);

    doc.setLineWidth(0.35);

    doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 6, 6, "S");

    /*
     * -------------------------------------------------------
     * JOURNEY DATE
     * -------------------------------------------------------
     */

    doc.setFont("helvetica", "bold");

    doc.setFontSize(8);

    doc.setTextColor(muted[0], muted[1], muted[2]);

    doc.text("YOUR JOURNEY", cardX + 10, cardY + 15);

    doc.setFont("helvetica", "normal");

    doc.setFontSize(13);

    doc.setTextColor(text[0], text[1], text[2]);

    doc.text(journeyDateText, cardX + 10, cardY + 26);

    /*
     * -------------------------------------------------------
     * DIVIDER
     * -------------------------------------------------------
     */

    doc.setDrawColor(border[0], border[1], border[2]);

    doc.setLineWidth(0.25);

    doc.line(cardX + 10, cardY + 34, cardX + cardWidth - 10, cardY + 34);

    /*
     * -------------------------------------------------------
     * BOOKING DATE LABEL
     * -------------------------------------------------------
     */

    doc.setFont("helvetica", "bold");

    doc.setFontSize(8);

    doc.setTextColor(blueDark[0], blueDark[1], blueDark[2]);

    doc.text("YOU CAN BOOK ON", cardX + 10, cardY + 48);

    /*
     * -------------------------------------------------------
     * BOOKING DATE
     * -------------------------------------------------------
     */

    doc.setFont("helvetica", "bold");

    doc.setFontSize(20);

    doc.setTextColor(blue[0], blue[1], blue[2]);

    doc.text(bookingDateText, cardX + 10, cardY + 61);

    /*
     * -------------------------------------------------------
     * OPENING TIME
     * -------------------------------------------------------
     */

    doc.setFont("helvetica", "normal");

    doc.setFontSize(9);

    doc.setTextColor(muted[0], muted[1], muted[2]);

    doc.text("Opening time:", cardX + 10, cardY + 72);

    doc.setFont("helvetica", "bold");

    doc.setTextColor(text[0], text[1], text[2]);

    doc.text("8:00 AM IST", cardX + 37, cardY + 72);

    /*
     * -------------------------------------------------------
     * STATUS
     * -------------------------------------------------------
     */

    let statusTitle = "";

    let statusDescription = "";

    if (result.isBookingToday) {
      statusTitle = "Booking opens today at 8:00 AM";

      statusDescription =
        "The general opening-day booking window is available after 8:00 AM IST.";
    } else if (result.isBookingTomorrow) {
      statusTitle = "Booking opens tomorrow";

      statusDescription = "Booking opens after 8:00 AM IST tomorrow.";
    } else if (result.isBookingFuture) {
      const days = result.daysUntilBooking;

      statusTitle = `Booking opens in ${days} ${days === 1 ? "day" : "days"}`;

      statusDescription = "You can book after 8:00 AM IST on the opening date.";
    } else {
      statusTitle = "Booking window has already opened";

      statusDescription = "The 60-day opening date has already passed.";
    }

    /*
     * -------------------------------------------------------
     * STATUS CARD
     * -------------------------------------------------------
     */

    const statusY = cardY + cardHeight + 12;

    /*
     * Light green status background
     */

    doc.setFillColor(greenLight[0], greenLight[1], greenLight[2]);

    doc.roundedRect(margin, statusY, cardWidth, 30, 5, 5, "F");

    /*
     * Status border
     */

    doc.setDrawColor(greenBorder[0], greenBorder[1], greenBorder[2]);

    doc.setLineWidth(0.3);

    doc.roundedRect(margin, statusY, cardWidth, 30, 5, 5, "S");

    /*
     * Status title
     */

    doc.setFont("helvetica", "bold");

    doc.setFontSize(10);

    doc.setTextColor(green[0], green[1], green[2]);

    doc.text(statusTitle, margin + 10, statusY + 11);

    /*
     * Status description
     */

    doc.setFont("helvetica", "normal");

    doc.setFontSize(8);

    doc.setTextColor(muted[0], muted[1], muted[2]);

    const descriptionLines = doc.splitTextToSize(
      statusDescription,
      cardWidth - 20
    );

    doc.text(descriptionLines, margin + 10, statusY + 19);

    /*
     * -------------------------------------------------------
     * INFORMATION SECTION
     * -------------------------------------------------------
     */

    const infoY = statusY + 45;

    doc.setFont("helvetica", "bold");

    doc.setFontSize(10);

    doc.setTextColor(text[0], text[1], text[2]);

    doc.text("Important Information", margin, infoY);

    const information = [
      "Advance reservation opening is based on the journey date.",
      "The general booking window opens at 8:00 AM IST.",
      "Please verify availability and railway booking rules before booking.",
    ];

    doc.setFont("helvetica", "normal");

    doc.setFontSize(8.5);

    doc.setTextColor(muted[0], muted[1], muted[2]);

    information.forEach((textItem, index) => {
      /*
       * Bullet
       */

      doc.setFillColor(blue[0], blue[1], blue[2]);

      doc.circle(margin + 2, infoY + 10 + index * 9, 0.8, "F");

      /*
       * Information text
       */

      doc.setTextColor(muted[0], muted[1], muted[2]);

      doc.text(textItem, margin + 7, infoY + 11 + index * 9);
    });

    /*
     * -------------------------------------------------------
     * FOOTER
     * -------------------------------------------------------
     */

    doc.setDrawColor(border[0], border[1], border[2]);

    doc.setLineWidth(0.25);

    doc.line(margin, pageHeight - 24, pageWidth - margin, pageHeight - 24);

    doc.setFont("helvetica", "normal");

    doc.setFontSize(7.5);

    doc.setTextColor(muted[0], muted[1], muted[2]);

    doc.text("Generated by RailDate", margin, pageHeight - 14);

    const generatedDate = formatLongDate(new Date());

    doc.text(
      `Generated on ${generatedDate}`,
      pageWidth - margin,
      pageHeight - 14,
      {
        align: "right",
      }
    );

    /*
     * -------------------------------------------------------
     * DOWNLOAD
     * -------------------------------------------------------
     */

    doc.save(`RailDate-${bookingDateText.replace(/[^a-zA-Z0-9]+/g, "-")}.pdf`);
  };

  const renderStatus = () => {
    if (result?.isBookingToday) {
      return (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-4">
          <CheckCircle2
            size={20}
            className="mt-0.5 shrink-0 text-emerald-400"
          />

          <div>
            <p className="text-sm text-left font-semibold text-emerald-300">
              {t("bookingOpensToday")}
            </p>

            <p className="mt-1 text-xs text-left leading-5 text-emerald-300/60">
              {t("bookingOpensTodayDescription")}
            </p>
          </div>
        </div>
      );
    }

    if (result?.isBookingTomorrow) {
      return (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/[0.07] px-4 py-4">
          <Clock3 size={20} className="mt-0.5 shrink-0 text-amber-400" />

          <div>
            <p className="text-sm text-left font-semibold text-amber-300">
              {t("bookingOpensTomorrow")}
            </p>

            <p className="mt-1 text-xs text-left leading-5 text-amber-300/60">
              {t("bookingOpensTomorrowDescription")}
            </p>
          </div>
        </div>
      );
    }

    if (result?.isBookingFuture) {
      const days = result?.daysUntilBooking;

      return (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-indigo-400/20 bg-indigo-400/[0.06] px-4 py-4">
          <Clock3 size={20} className="mt-0.5 shrink-0 text-indigo-400" />

          <div className="text-left">
            <p className="text-sm text-left font-semibold text-indigo-300">
              {t("bookingOpensIn")} {days} {days === 1 ? t("day") : t("days")}
            </p>

            <p className="mt-1 text-xs text-left leading-5 text-indigo-300/60">
              {t("bookingOpensInDescription")}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
        <Clock3 size={20} className="mt-0.5 shrink-0 text-slate-500" />

        <div>
          <p className="text-sm text-left font-semibold text-slate-300">
            {t("bookingWindowAlreadyOpened")}
          </p>

          <p className="mt-1 text-xs text-left leading-5 text-slate-500">
            {t("bookingWindowAlreadyOpenedDescription")}
          </p>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 25,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="mt-6 w-full"
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-3 shadow-2xl shadow-black/30 backdrop-blur-xl">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative rounded-2xl border border-white/[0.06] bg-[#0D121D]/95 p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <Ticket size={15} className="text-indigo-400" />
            {t("bookingInformation")}
          </div>

          {/* Journey */}
          <div className="mt-7">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
              {t("yourJourney")}
            </p>

            <div className="mt-2 flex items-center gap-3">
              <CalendarDays size={20} className="shrink-0 text-slate-500" />

              <p className="text-base font-medium text-slate-200 sm:text-lg">
                {journeyDateText}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="my-7 h-px bg-white/[0.06]" />

          {/* Booking date */}
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-indigo-300">
              {t("youCanBookOn")}
            </p>

            <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.025em] text-transparent bg-clip-text bg-[linear-gradient(110deg,#818cf8_0%,#c084fc_22%,#22d3ee_50%,#c084fc_78%,#818cf8_100%)] bg-[length:250%_100%] animate-booking-date-flow drop-shadow-[0_0_18px_rgba(129,140,248,0.18)] sm:text-3xl">
              {bookingDateText}
            </h2>

            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <Clock3 size={14} />

              <span>
                {t("openingTime")}:{" "}
                <span className="font-medium text-slate-300">
                  {t("bookingOpensTime")}
                </span>
              </span>
            </div>
          </div>

          {/* Status */}
          {renderStatus()}

          {/* Actions */}

          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Copy Date */}
            <button
              type="button"
              onClick={handleCopy}
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
            >
              <Copy size={16} />

              {copied ? t("copied") : t("copyDate")}
            </button>

            {/* Download PDF */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-indigo-400/20 bg-indigo-400/[0.07] text-sm font-medium text-indigo-300 transition hover:border-indigo-400/30 hover:bg-indigo-400/[0.12] hover:text-indigo-200"
            >
              <Download size={16} />
              {t("downloadPDF")}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
