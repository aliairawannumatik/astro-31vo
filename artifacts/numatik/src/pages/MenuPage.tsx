import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import { Search, X, Loader2 } from "lucide-react";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { MENU_ITEMS } from "@/data/menuConfig";

// Deep-search index of every routed page's title + readable text content.
// Generated at build time by scripts/build-search-index.mjs (see "predev"/
// "prebuild" in package.json) — NOT bundled into JS, fetched lazily on
// demand so the menu screen stays light for users who never search.
type DeepSearchItem = { path: string; title: string; content: string };

let deepIndexCache: DeepSearchItem[] | null = null;
let deepIndexPromise: Promise<DeepSearchItem[]> | null = null;
function loadDeepSearchIndex(): Promise<DeepSearchItem[]> {
  if (deepIndexCache) return Promise.resolve(deepIndexCache);
  if (!deepIndexPromise) {
    deepIndexPromise = fetch("/search-index.json")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: DeepSearchItem[]) => {
        deepIndexCache = data;
        return data;
      })
      .catch(() => {
        deepIndexCache = [];
        return [];
      });
  }
  return deepIndexPromise;
}

const MenuPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [deepIndex, setDeepIndex] = useState<DeepSearchItem[] | null>(deepIndexCache);
  const [deepIndexLoading, setDeepIndexLoading] = useState(false);

  // Only fetch the (fairly small, ~700KB) deep-search index once the user
  // actually starts typing — no cost at all for people who just browse the menu.
  useEffect(() => {
    if (!searchQuery.trim() || deepIndex) return;
    let cancelled = false;
    setDeepIndexLoading(true);
    loadDeepSearchIndex().then((data) => {
      if (!cancelled) {
        setDeepIndex(data);
        setDeepIndexLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [searchQuery, deepIndex]);

  const handleClick = (path: string) => {
    playPopSound();
    navigate(path);
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredMenuItems = MENU_ITEMS.filter((item) => {
    if (!normalizedQuery) return true;
    const label = t(`menuItems.${item.key}.label`).toLowerCase();
    const description = t(`menuItems.${item.key}.desc`).toLowerCase();
    return `${label} ${description}`.includes(normalizedQuery);
  });

  const filteredDeepResults = useMemo(() => {
    if (!normalizedQuery || !deepIndex) return [];
    return deepIndex
      .map((item) => {
        const titleLower = item.title.toLowerCase();
        const contentLower = item.content.toLowerCase();
        const titleHit = titleLower.includes(normalizedQuery);
        const pathHit = item.path.toLowerCase().includes(normalizedQuery);
        const contentIndex = contentLower.indexOf(normalizedQuery);
        if (!titleHit && !pathHit && contentIndex < 0) return null;
        const snippet =
          contentIndex >= 0
            ? item.content.slice(Math.max(0, contentIndex - 60), contentIndex + normalizedQuery.length + 100)
            : item.content.slice(0, 140);
        // Rank exact/near title matches above content-only matches.
        const rank = titleHit ? 0 : pathHit ? 1 : 2;
        return { ...item, snippet, rank };
      })
      .filter((item): item is DeepSearchItem & { snippet: string; rank: number } => Boolean(item))
      .sort((a, b) => a.rank - b.rank || a.title.localeCompare(b.title))
      .slice(0, 24);
  }, [normalizedQuery, deepIndex]);

  return (
    <div className="menu-page relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation prevPath="/" />
      <div className="relative z-10 text-center px-4 max-w-3xl w-full pt-20 pb-12 md:pt-24 md:pb-16">
        <h1 className="menu-page-title font-display text-3xl md:text-4xl font-bold mb-2">
          NUMATIK
        </h1>
        <p className="menu-muted mb-5 text-sm">{t("menu.subtitle")}</p>

        <div className="relative max-w-2xl mx-auto mb-8">
          <Search
            aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
          />
          <label htmlFor="menu-search" className="sr-only">{t("menu.searchAriaLabel")}</label>
          <input
            id="menu-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={t("menu.searchPlaceholder")}
            className="menu-search-field menu-focusable w-full rounded-xl border py-3 pl-12 pr-11 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-primary/25"
          />
          {searchQuery && (
            <button
              type="button"
              aria-label={t("menu.clearSearch")}
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {normalizedQuery && deepIndexLoading && filteredDeepResults.length === 0 && (
          <div className="menu-muted mb-6 flex items-center justify-center gap-2 max-w-2xl mx-auto rounded-xl border border-border bg-card/70 p-3 text-xs">
            <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
            {t("menu.deepSearchLoading")}
          </div>
        )}

        {filteredDeepResults.length > 0 && (
          <div className="mb-6 max-w-2xl mx-auto rounded-xl border border-border bg-card/70 p-3 text-left shadow-sm">
            <p className="menu-muted px-3 pb-2 text-xs font-semibold uppercase tracking-wide">
              {t("menu.deepSearchTitle")} ({filteredDeepResults.length}{filteredDeepResults.length === 24 ? "+" : ""})
            </p>
            <div className="flex flex-col gap-1">
              {filteredDeepResults.map((result) => (
                <button
                  key={result.path}
                  type="button"
                  onClick={() => handleClick(result.path)}
                  className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-primary/10"
                >
                  <span className="min-w-0 text-left">
                    <span className="menu-card-title block truncate text-sm font-medium">{result.title}</span>
                    <span className="menu-muted block truncate text-xs">{result.snippet}</span>
                  </span>
                  <span className="menu-muted shrink-0 text-xs">{t("menu.open")}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {filteredMenuItems.length > 0 || filteredDeepResults.length > 0 || (normalizedQuery && deepIndexLoading) ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {filteredMenuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleClick(item.path)}
                className="menu-card menu-focusable group relative backdrop-blur border rounded-xl p-6 transition-all duration-300 cursor-pointer text-left animate-slide-up"
              >
                <item.icon className="menu-card-icon w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="menu-card-title font-display text-[11px] sm:text-base font-bold mb-1 leading-tight">
                  {t(`menuItems.${item.key}.label`)}
                </h3>
                <p className="menu-card-description text-xs">
                  {t(`menuItems.${item.key}.desc`)}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="menu-card mx-auto max-w-2xl rounded-xl border px-6 py-10 text-center">
            <Search className="menu-card-icon mx-auto mb-3 w-8 h-8" aria-hidden="true" />
            <p className="menu-card-title font-display text-base font-semibold">{t("menu.noSearchResults")}</p>
            <p className="menu-card-description mt-1 text-sm">{t("menu.tryDifferentQuery")}</p>
          </div>
        )}

        <button
          onClick={() => { playPopSound(); navigate("/"); }}
          className="menu-muted menu-focusable mt-8 text-sm hover:text-primary transition-colors font-body cursor-pointer"
        >
          {t("nav.backToHome")}
        </button>
      </div>

    </div>
  );
};

export default MenuPage;
