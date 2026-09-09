import { createContext, useContext, useEffect, useState, useCallback, useTransition } from "react";
import { authService } from "../services/auth.service";
import { useAuth } from "./AuthContext";

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", isDefault: true },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
];

export const LanguageContext = createContext({
  currentLanguage: "en",
  changeLanguage: () => {},
  languages: SUPPORTED_LANGUAGES,
});

/**
 * Cookie helpers for Google Translate element integration
 */
function setGoogleTranslateCookie(langCode) {
  if (typeof document === "undefined") return;
  const cookieValue = langCode === "en" ? "/en/en" : `/en/${langCode}`;
  document.cookie = `googtrans=${cookieValue}; path=/;`;
  
  // Set on top-level domain if applicable
  const host = window.location.hostname;
  if (host && host !== "localhost" && !host.startsWith("127.")) {
    const parts = host.split(".");
    if (parts.length > 1) {
      document.cookie = `googtrans=${cookieValue}; path=/; domain=.${parts.slice(-2).join(".")};`;
    }
  }
}

function clearGoogleTranslateCookie() {
  if (typeof document === "undefined") return;
  document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  const host = window.location.hostname;
  if (host && host !== "localhost" && !host.startsWith("127.")) {
    const parts = host.split(".");
    if (parts.length > 1) {
      document.cookie = `googtrans=; path=/; domain=.${parts.slice(-2).join(".")}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    }
  }
}

function triggerGoogleTranslateCombo(langCode) {
  if (typeof document === "undefined") return false;
  const select = document.querySelector(".goog-te-combo");
  if (select) {
    select.value = langCode;
    select.dispatchEvent(new Event("change"));
    return true;
  }
  return false;
}

export function LanguageProvider({ children }) {
  const { user } = useAuth();
  const [, startTransition] = useTransition();

  const [currentLanguage, setCurrentLanguage] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("medikiosk_language");
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved;
      }
    }
    return "en";
  });

  // Apply Google Translate translation whenever currentLanguage changes or widget becomes ready
  useEffect(() => {
    if (currentLanguage === "en") {
      clearGoogleTranslateCookie();
      setGoogleTranslateCookie("en");
      triggerGoogleTranslateCombo("en");
    } else {
      setGoogleTranslateCookie(currentLanguage);
      triggerGoogleTranslateCombo(currentLanguage);
    }

    // Interval to ensure late-loading Google Translate widget applies the language
    const timer = setInterval(() => {
      const success = triggerGoogleTranslateCombo(currentLanguage);
      if (success) {
        clearInterval(timer);
      }
    }, 500);

    const timeout = setTimeout(() => clearInterval(timer), 8000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [currentLanguage]);

  // Sync preference if logged-in patient has a stored preference
  useEffect(() => {
    const patientLang = user?.patient?.preferences?.preferredLanguage;
    if (patientLang && SUPPORTED_LANGUAGES.some((l) => l.code === patientLang)) {
      const localLang = localStorage.getItem("medikiosk_language");
      if (!localLang || localLang === "en") {
        setCurrentLanguage(patientLang);
        localStorage.setItem("medikiosk_language", patientLang);
      }
    }
  }, [user]);

  const changeLanguage = useCallback(
    async (langCode) => {
      if (!SUPPORTED_LANGUAGES.some((l) => l.code === langCode)) return;

      startTransition(() => {
        setCurrentLanguage(langCode);
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("medikiosk_language", langCode);
      }

      if (langCode === "en") {
        clearGoogleTranslateCookie();
        setGoogleTranslateCookie("en");
        triggerGoogleTranslateCombo("en");
      } else {
        setGoogleTranslateCookie(langCode);
        triggerGoogleTranslateCombo(langCode);
      }

      // If user is authenticated, persist preferred language to patient profile
      if (user?.role === "patient") {
        try {
          await authService.updatePreferredLanguage(langCode);
        } catch (err) {
          console.error("Failed to persist preferred language to profile:", err);
        }
      }
    },
    [user]
  );

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
        languages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export default LanguageContext;
