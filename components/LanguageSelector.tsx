"use client";

import { useEffect, useState } from "react";
import { Globe2, Check, X, ChevronRight } from "lucide-react";

import { useLanguage } from "@/components/LanguageProvider";

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  const [open, setOpen] = useState(false);

  const languageLabels = {
    en: {
      desktop: "English",
      mobile: "EN",
    },
    bn: {
      desktop: "বাংলা",
      mobile: "বাংলা",
    },
  };

  /*
   * Close the modal with the Escape key.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  /*
   * Prevent background scrolling while
   * the language modal is open.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const handleLanguageChange = (nextLanguage: "en" | "bn") => {
    setLanguage(nextLanguage);
    setOpen(false);
  };

  return (
    <>
      {/* =====================================================
          LANGUAGE BUTTON
          ===================================================== */}

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("chooseLanguage")}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="
          group
          inline-flex
          items-center
          gap-2
          rounded-full
          border
          border-white/10
          bg-white/[0.035]
          px-3
          py-2
          text-xs
          font-medium
          text-slate-400
          shadow-lg
          shadow-black/10
          backdrop-blur-xl
          transition-all
          duration-200
          hover:border-indigo-400/25
          hover:bg-white/[0.06]
          hover:text-white
          "
      >
        <Globe2
          size={15}
          strokeWidth={1.9}
          className="
            text-indigo-400
            transition-transform
            duration-300
            group-hover:rotate-12
          "
        />

        <span className="text-[14px]">
          <span className="hidden sm:inline">
            {languageLabels[language].desktop}
          </span>

          <span className="sm:hidden">{languageLabels[language].mobile}</span>
        </span>

        <ChevronRight
          size={13}
          className="
            text-slate-600
            transition-transform
            duration-200
            group-hover:translate-x-0.5
            group-hover:text-slate-400
          "
        />
      </button>

      {/* =====================================================
          LANGUAGE MODAL
          ===================================================== */}

      {open && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-black/50
            px-4
            py-6
            backdrop-blur-[6px]
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="language-modal-title"
            className="
              relative
              w-full
              max-w-[420px]
              overflow-hidden
              rounded-[26px]
              border
              border-white/[0.11]
              bg-[#0B1020]/[0.985]
              shadow-[0_35px_120px_rgba(0,0,0,0.70)]
              backdrop-blur-2xl
            "
            onMouseDown={(event) => {
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
                -right-24
                -top-24
                h-64
                w-64
                rounded-full
                bg-indigo-500/[0.12]
                blur-3xl
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-28
                -left-24
                h-60
                w-60
                rounded-full
                bg-cyan-500/[0.07]
                blur-3xl
              "
            />

            {/* =================================================
                CONTENT
                ================================================= */}

            <div className="relative p-5 sm:p-6">
              {/* Header */}

              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
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
                    <Globe2 size={19} className="text-indigo-400" />
                  </div>

                  <div>
                    <h2
                      id="language-modal-title"
                      className="
                        text-base
                        font-semibold
                        tracking-[-0.015em]
                        text-white
                      "
                    >
                      {t("chooseLanguage")}
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      {t("chooseLanguageDescription")}
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
                    h-9
                    w-9
                    shrink-0
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
                  <X size={17} />
                </button>
              </div>

              {/* Language options */}

              <div className="mt-6 space-y-3">
                {/* English */}

                <button
                  type="button"
                  onClick={() => handleLanguageChange("en")}
                  aria-pressed={language === "en"}
                  className={`
                    group
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-2xl
                    border
                    p-4
                    text-left
                    transition-all
                    duration-200
                    ${
                      language === "en"
                        ? "border-indigo-400/30 bg-indigo-400/[0.09]"
                        : "border-white/[0.07] bg-white/[0.025] hover:border-white/[0.14] hover:bg-white/[0.05]"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        text-sm
                        ${
                          language === "en"
                            ? "bg-indigo-400/[0.12]"
                            : "bg-white/[0.04]"
                        }
                      `}
                    >
                      EN
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        English
                      </p>

                      <p className="mt-0.5 text-[11px] text-slate-500">
                        English
                      </p>
                    </div>
                  </div>

                  {language === "en" && (
                    <div
                      className="
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-full
                        bg-indigo-500
                        text-white
                        shadow-lg
                        shadow-indigo-500/20
                      "
                    >
                      <Check size={14} />
                    </div>
                  )}
                </button>

                {/* Bengali */}

                <button
                  type="button"
                  onClick={() => handleLanguageChange("bn")}
                  aria-pressed={language === "bn"}
                  className={`
                    group
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-2xl
                    border
                    p-4
                    text-left
                    transition-all
                    duration-200
                    ${
                      language === "bn"
                        ? "border-indigo-400/30 bg-indigo-400/[0.09]"
                        : "border-white/[0.07] bg-white/[0.025] hover:border-white/[0.14] hover:bg-white/[0.05]"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        text-sm
                        ${
                          language === "bn"
                            ? "bg-indigo-400/[0.12]"
                            : "bg-white/[0.04]"
                        }
                      `}
                    >
                      বাংলা
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">বাংলা</p>

                      <p className="mt-0.5 text-[11px] text-slate-500">
                        Bengali
                      </p>
                    </div>
                  </div>

                  {language === "bn" && (
                    <div
                      className="
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-full
                        bg-indigo-500
                        text-white
                        shadow-lg
                        shadow-indigo-500/20
                      "
                    >
                      <Check size={14} />
                    </div>
                  )}
                </button>
              </div>

              {/* Footer note */}

              <div className="mt-5 border-t border-white/[0.06] pt-4">
                <p className="text-center text-[10px] leading-5 text-slate-600">
                  RailDate supports English and Bengali.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
