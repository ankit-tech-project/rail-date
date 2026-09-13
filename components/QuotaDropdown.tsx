"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";

interface QuotaDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export default function QuotaDropdown({
  value,
  onChange,
}: QuotaDropdownProps) {
  const { t } = useLanguage();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    {
      value: "general",
      label: t("general"),
    },
    {
      value: "tatkal",
      label: t("tatkal"),
    },
    {
      value: "premium-tatkal",
      label: t("premiumTatkal"),
    },
  ];

  const selectedOption =
    options.find((option) => option.value === value) ?? options[0];

  /* =======================================================
     CLOSE WHEN CLICKING OUTSIDE
     ======================================================= */

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
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
     SELECT
     ======================================================= */

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`
          group
          flex
          h-14
          w-full
          items-center
          justify-between
          rounded-xl
          border
          bg-white/[0.035]
          px-4
          text-left
          text-sm
          outline-none
          transition-all
          duration-300
          ${
            open
              ? "border-cyan-400/30 bg-white/[0.05] ring-2 ring-cyan-400/5"
              : "border-white/[0.08] hover:border-white/20 hover:bg-white/[0.05]"
          }
        `}
      >
        <span
          className={`font-medium transition-colors duration-300 ${
            open ? "text-white" : "text-slate-200"
          }`}
        >
          {selectedOption.label}
        </span>

        <ChevronDown
          size={18}
          className={`
            text-slate-500
            transition-all
            duration-300
            ${
              open
                ? "rotate-180 text-cyan-300"
                : "group-hover:text-slate-300"
            }
          `}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: -6,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 8,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -4,
              scale: 0.98,
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
              shadow-[0_20px_60px_rgba(0,0,0,0.45)]
              backdrop-blur-2xl
            "
            role="listbox"
            aria-label={t("quota")}
          >
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  className={`
                    group
                    relative
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    px-4
                    py-3
                    text-left
                    text-sm
                    transition-all
                    duration-200
                    ${
                      isSelected
                        ? "bg-cyan-400/[0.08] text-white"
                        : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                    }
                  `}
                >
                  <span>{option.label}</span>

                  <span
                    className={`
                      flex
                      h-6
                      w-6
                      items-center
                      justify-center
                      rounded-lg
                      transition-all
                      duration-200
                      ${
                        isSelected
                          ? "bg-cyan-400/10 text-cyan-300"
                          : "text-transparent"
                      }
                    `}
                  >
                    <Check size={14} strokeWidth={2.5} />
                  </span>

                  {/* Selected option highlight */}
                  {isSelected && (
                    <motion.span
                      layoutId="quota-selected-indicator"
                      className="absolute left-1 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-cyan-300"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}