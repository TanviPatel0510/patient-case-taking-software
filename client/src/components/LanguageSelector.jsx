import { useState, useRef, useEffect } from "react";
import { RiTranslate2, RiArrowDownSLine, RiCheckLine } from "@remixicon/react";
import { useLanguage, SUPPORTED_LANGUAGES } from "../context/LanguageContext";

export function LanguageSelector({ className = "" }) {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) ||
    SUPPORTED_LANGUAGES[0];

  return (
    <div className={`relative inline-block text-left notranslate ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group inline-flex items-center gap-2 rounded-xl border border-[#d1e2dc] bg-white px-3 py-1.5 text-xs font-semibold text-[#143337] shadow-2xs transition-all hover:border-[#0c5e5b] hover:bg-[#f2f8f6] focus:outline-hidden focus:ring-2 focus:ring-[#0c5e5b]/20 cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Select system language"
      >
        <span className="flex size-6 items-center justify-center rounded-lg bg-[#e2f2ef] text-[#0c5e5b] transition-transform group-hover:scale-105">
          <RiTranslate2 className="size-3.5" />
        </span>
        <span className="font-bold text-[#0c5e5b]">
          {activeLang.nativeName}
        </span>
        <RiArrowDownSLine
          className={`size-3.5 text-[#5d7c80] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-2xl border border-[#d1e2dc] bg-white p-2 shadow-2xl ring-1 ring-black/5 focus:outline-hidden animate-fadeIn">
          <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2 mb-1.5">
            <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
              Select Language
            </span>
            <span className="text-[10px] font-medium text-[#0c5e5b] bg-[#e2f2ef] px-2 py-0.5 rounded-full">
              Google Translate
            </span>
          </div>
          <div className="max-h-72 overflow-y-auto space-y-1 pr-1">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLanguage;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    changeLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#e2f2ef] font-bold text-[#0c5e5b]"
                      : "text-[#143337] hover:bg-gray-50 hover:text-[#0c5e5b]"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold leading-snug">
                      {lang.nativeName}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {lang.name} {lang.isDefault ? "(Default)" : ""}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-[#0c5e5b] text-white">
                      <RiCheckLine className="size-3.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
