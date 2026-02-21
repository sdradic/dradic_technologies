// Mini language toggle styled like ThemeToggle but for EN/ES (no icons)
function LanguageToggle({
  value,
  onChange,
}: {
  value: "EN" | "ES";
  onChange: (lang: "EN" | "ES") => void;
}) {
  return (
    <div
      role="group"
      aria-label="Select CV language"
      className="flex flex-row items-center justify-center w-24 h-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full cursor-pointer transition-colors"
    >
      <button
        type="button"
        aria-pressed={value === "EN"}
        className={`flex-1 h-full rounded-full text-xs font-bold transition-colors cursor-pointer
            ${value === "EN" ? "bg-brand-600 text-white" : "bg-transparent text-slate-800 dark:text-slate-200"}
          `}
        onClick={() => onChange("EN")}
      >
        EN
      </button>
      <button
        type="button"
        aria-pressed={value === "ES"}
        className={`flex-1 h-full rounded-full text-xs font-bold transition-colors cursor-pointer
            ${value === "ES" ? "bg-brand-600 text-white" : "bg-transparent text-slate-800 dark:text-slate-200"}
          `}
        onClick={() => onChange("ES")}
      >
        ES
      </button>
    </div>
  );
}

export default LanguageToggle;
