import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowUpRight,
  BookOpen,
  ClipboardCheck,
  ClipboardList,
  Ellipsis,
  Home,
  Loader2,
  Search,
  Wrench,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Starfield from "@/components/Starfield";
import MenuHeaderControls from "@/components/MenuHeaderControls";
import { MENU_ITEMS, MENU_SECTIONS, type MenuGroup, type MenuItemConfig } from "@/data/menuConfig";
import { playPopSound } from "@/hooks/useAudio";

type DeepSearchItem = { path: string; title: string; content: string };
type MobileTab = "home" | "learn" | "practice" | "tools" | "more";

const RECENT_STORAGE_KEY = "numatik-menu-recent";

let deepIndexCache: DeepSearchItem[] | null = null;
let deepIndexPromise: Promise<DeepSearchItem[]> | null = null;

function loadDeepSearchIndex(): Promise<DeepSearchItem[]> {
  if (deepIndexCache) return Promise.resolve(deepIndexCache);
  if (!deepIndexPromise) {
    deepIndexPromise = fetch("/search-index.json")
      .then((response) => response.ok ? response.json() : [])
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

function readRecentPaths(): string[] {
  try {
    const saved = localStorage.getItem(RECENT_STORAGE_KEY);
    if (!saved) return [];
    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    const validPaths = new Set<string>(MENU_ITEMS.map((item) => item.path));
    return parsed
      .filter((path): path is string => typeof path === "string" && validPaths.has(path))
      .slice(0, 3);
  } catch (error) {
    console.warn("Unable to read recent menu items.", error);
    return [];
  }
}

function findMenuItem(path: string): MenuItemConfig | undefined {
  return MENU_ITEMS.find((item) => item.path === path);
}

const TAB_ITEMS: ReadonlyArray<{
  id: MobileTab;
  icon: LucideIcon;
  labelKey: string;
}> = [
  { id: "home", icon: Home, labelKey: "menu.homeTab" },
  { id: "learn", icon: BookOpen, labelKey: "menu.learnTab" },
  { id: "practice", icon: ClipboardList, labelKey: "menu.practiceTab" },
  { id: "tools", icon: Wrench, labelKey: "menu.toolsTab" },
  { id: "more", icon: Ellipsis, labelKey: "menu.moreTab" },
];

const MenuPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [deepIndex, setDeepIndex] = useState<DeepSearchItem[] | null>(deepIndexCache);
  const [deepIndexLoading, setDeepIndexLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<MobileTab>("home");
  const [recentPaths, setRecentPaths] = useState(readRecentPaths);
  const [isPageVisible, setIsPageVisible] = useState(() => !document.hidden);

  useEffect(() => {
    const updateVisibility = () => setIsPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

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
        const snippet = contentIndex >= 0
          ? item.content.slice(Math.max(0, contentIndex - 60), contentIndex + normalizedQuery.length + 100)
          : item.content.slice(0, 140);
        const rank = titleHit ? 0 : pathHit ? 1 : 2;
        return { ...item, snippet, rank };
      })
      .filter((item): item is DeepSearchItem & { snippet: string; rank: number } => Boolean(item))
      .sort((a, b) => a.rank - b.rank || a.title.localeCompare(b.title))
      .slice(0, 24);
  }, [normalizedQuery, deepIndex]);

  const recentItems = recentPaths
    .map(findMenuItem)
    .filter((item): item is MenuItemConfig => item !== undefined);

  const handleOpenPath = (path: string) => {
    if (MENU_ITEMS.some((item) => item.path === path)) {
      const updatedPaths = [path, ...recentPaths.filter((recentPath) => recentPath !== path)].slice(0, 3);
      setRecentPaths(updatedPaths);
      try {
        localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(updatedPaths));
      } catch (error) {
        console.warn("Unable to save recent menu items.", error);
      }
    }
    playPopSound();
    navigate(path);
  };

  const handleOpenItem = (item: MenuItemConfig) => handleOpenPath(item.path);

  const renderRecentItems = () => recentItems.length > 0 && (
    <div className="menu-recent-strip" aria-label={t("menu.lastOpened")}>
      <span className="menu-recent-label">{t("menu.lastOpened")}</span>
      {recentItems.map((item) => (
        <button
          key={item.path}
          type="button"
          onClick={() => handleOpenItem(item)}
          className="menu-recent-chip menu-focusable"
          aria-label={t(`menuItems.${item.key}.label`)}
          title={t(`menuItems.${item.key}.label`)}
        >
          {t(`menu.${item.key}`)}
        </button>
      ))}
    </div>
  );

  const renderCompactCard = (item: MenuItemConfig) => {
    const Icon = item.icon;
    return (
      <button
        key={item.path}
        type="button"
        onClick={() => handleOpenItem(item)}
        aria-label={t(`menuItems.${item.key}.label`)}
        className="menu-card menu-focusable menu-compact-card"
      >
        <span className="menu-compact-icon-box">
          <Icon aria-hidden="true" className="h-11 w-11" />
        </span>
        <span className="menu-compact-title">{t(`menu.${item.key}`)}</span>
      </button>
    );
  };

  const renderExpandedCard = (item: MenuItemConfig, desktop = false) => {
    const Icon = item.icon;
    return (
      <button
        key={item.path}
        type="button"
        onClick={() => handleOpenItem(item)}
        aria-label={t(`menuItems.${item.key}.label`)}
        className={`menu-card menu-focusable menu-expanded-card${desktop ? " menu-expanded-card-desktop" : ""}`}
      >
        <Icon aria-hidden="true" className="menu-card-icon h-7 w-7 shrink-0" />
        <span className="menu-expanded-copy">
          <span className="menu-card-title menu-expanded-title">{t(`menuItems.${item.key}.label`)}</span>
          <span className="menu-card-description menu-expanded-description" title={desktop ? t(`menuItems.${item.key}.desc`) : undefined}>
            {t(`menuItems.${item.key}.desc`)}
          </span>
        </span>
      </button>
    );
  };

  const renderFeaturedCard = (item: MenuItemConfig, desktop = false) => {
    const Icon = item.icon;
    return (
      <button
        key={item.path}
        type="button"
        onClick={() => handleOpenItem(item)}
        aria-label={t(`menuItems.${item.key}.label`)}
        className={`menu-card menu-focusable menu-featured-card${desktop ? " menu-featured-card-desktop" : ""}`}
      >
        <span className="menu-featured-icon-box">
          <Icon aria-hidden="true" />
        </span>
        <span className="menu-featured-title">
          {desktop ? t(`menuItems.${item.key}.label`) : t(`menu.${item.key}`)}
        </span>
        {desktop && (
          <span className="menu-card-description menu-featured-description">
            {t(`menuItems.${item.key}.desc`)}
          </span>
        )}
      </button>
    );
  };

  const renderSection = (group: MenuGroup, mode: "compact" | "expanded", desktop = false) => {
    const section = MENU_SECTIONS.find((candidate) => candidate.group === group);
    if (!section) return null;
    const items = MENU_ITEMS.filter((item) => item.group === group);
    return (
      <section key={group} className="menu-section">
        <h2 className="menu-section-title">{t(section.labelKey)}</h2>
        <div className={mode === "compact" ? "menu-compact-grid" : "menu-expanded-grid"}>
          {items.map((item) => mode === "compact" ? renderCompactCard(item) : renderExpandedCard(item, desktop))}
        </div>
      </section>
    );
  };

  const renderInfoBanner = () => (
    <button
      type="button"
      onClick={() => handleOpenPath("/donasi")}
      className="menu-donate-banner menu-focusable"
    >
      <span>{t("menu.donateBanner")}</span>
      <ArrowUpRight aria-hidden="true" className="h-5 w-5 shrink-0" />
    </button>
  );

  const renderSearchResults = (desktop = false) => (
    <div className="menu-search-results">
      {normalizedQuery && deepIndexLoading && filteredDeepResults.length === 0 && (
        <div className="menu-search-status" role="status">
          <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
          <span>{t("menu.deepSearchLoading")}</span>
        </div>
      )}

      {filteredDeepResults.length > 0 && (
        <section className="menu-deep-results">
          <h2 className="menu-section-title">
            {t("menu.deepSearchTitle")} ({filteredDeepResults.length}{filteredDeepResults.length === 24 ? "+" : ""})
          </h2>
          <div className="menu-deep-result-list">
            {filteredDeepResults.map((result) => (
              <button
                key={result.path}
                type="button"
                onClick={() => handleOpenPath(result.path)}
                className="menu-deep-result menu-focusable"
              >
                <span className="menu-deep-result-copy">
                  <span className="menu-card-title menu-deep-result-title">{result.title}</span>
                  <span className="menu-card-description menu-deep-result-snippet">{result.snippet}</span>
                </span>
                <span className="menu-muted shrink-0 text-xs">{t("menu.open")}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {filteredMenuItems.length > 0 && (
        <section className="menu-search-menu-results">
          <h2 className="menu-section-title">{t("menu.matchingMenuItems")}</h2>
          <div className={desktop ? "menu-expanded-grid menu-search-card-grid" : "menu-search-card-grid"}>
            {filteredMenuItems.map((item) => renderExpandedCard(item, desktop))}
          </div>
        </section>
      )}

      {filteredMenuItems.length === 0 && filteredDeepResults.length === 0 && !deepIndexLoading && (
        <div className="menu-empty-state">
          <Search aria-hidden="true" className="menu-card-icon h-8 w-8" />
          <p className="menu-card-title">{t("menu.noSearchResults")}</p>
          <p className="menu-card-description">{t("menu.tryDifferentQuery")}</p>
        </div>
      )}
    </div>
  );

  const renderCategoryView = (group: "learn" | "practice" | "tools" | "more") => (
    <div className="menu-category-view">
      <h2 className="menu-category-title">{t(`menu.sections.${group}`)}</h2>
      {group === "more" ? (
        <>
          <div className="menu-category-grid">
            {MENU_ITEMS.filter((item) => item.group === "more").map((item) => renderExpandedCard(item))}
          </div>
          {renderInfoBanner()}
          <button
            type="button"
            onClick={() => handleOpenPath("/")}
            className="menu-back-home menu-focusable"
          >
            {t("nav.backToHome")}
          </button>
        </>
      ) : (
        <>
          <div className="menu-category-grid">
            {MENU_ITEMS.filter((item) => item.group === group).map((item) => renderExpandedCard(item))}
          </div>
          {group === "tools" && renderInfoBanner()}
        </>
      )}
    </div>
  );

  const renderMobileHome = () => (
    <div className="menu-mobile-home">
      <div className="menu-featured-grid">
        {MENU_ITEMS.filter((item) => item.featured).map((item) => renderFeaturedCard(item))}
      </div>
      <div className="menu-mobile-sections">
        {MENU_SECTIONS.map((section) => renderSection(section.group, "compact"))}
      </div>
    </div>
  );

  const renderDesktopHome = () => (
    <>
      <div className="menu-featured-grid menu-featured-grid-desktop">
        {MENU_ITEMS.filter((item) => item.featured).map((item) => renderFeaturedCard(item, true))}
      </div>
      <div className="menu-desktop-sections">
        {MENU_SECTIONS.map((section) => (
          <div key={section.group} className="menu-desktop-column">
            {renderSection(section.group, "expanded", true)}
            {section.group === "tools" && renderInfoBanner()}
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="menu-page menu-app-root" data-tab-active={isPageVisible}>
      <Starfield />
      <div className="menu-mobile-layout">
        <header className="menu-mobile-header">
          <div className="menu-brand">
            <h1 className="menu-page-title">NUMATIK</h1>
            <p className="menu-muted">{t("menu.subtitle")}</p>
          </div>
          <MenuHeaderControls />
        </header>

        <main className="menu-mobile-main">
          <div className="menu-search-box">
            <Search aria-hidden="true" className="menu-search-icon" />
            <label htmlFor="mobile-menu-search" className="sr-only">{t("menu.searchAriaLabel")}</label>
            <input
              id="mobile-menu-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t("menu.searchPlaceholder")}
              className="menu-search-field menu-search-input menu-focusable"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label={t("menu.clearSearch")}
                onClick={() => setSearchQuery("")}
                className="menu-search-clear menu-focusable"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            )}
          </div>

          {renderRecentItems()}

          <div className={`menu-mobile-content${normalizedQuery ? " menu-mobile-search-content" : ""}`}>
            {normalizedQuery
              ? renderSearchResults()
              : activeTab === "home"
                ? renderMobileHome()
                : renderCategoryView(activeTab === "more" ? "more" : activeTab)}
          </div>
        </main>

        <nav className="menu-mobile-tabs" aria-label={t("menu.homeTab")}>
          {TAB_ITEMS.map(({ id, icon: Icon, labelKey }) => (
            <button
              key={id}
              type="button"
              aria-current={activeTab === id ? "page" : undefined}
              aria-label={t(labelKey)}
              onClick={() => setActiveTab(id)}
              className={`menu-mobile-tab menu-focusable${activeTab === id ? " is-active" : ""}`}
            >
              <Icon aria-hidden="true" className="h-5 w-5" />
              <span>{t(labelKey)}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="menu-desktop-layout">
        <aside className="menu-sidebar">
          <div className="menu-sidebar-brand">
            <h1 className="menu-page-title">NUMATIK</h1>
            <p className="menu-muted">{t("menu.subtitle")}</p>
          </div>

          <nav className="menu-sidebar-primary" aria-label={t("menu.homeTab")}>
            {[
              { id: "home" as const, labelKey: "menu.homeTab", icon: Home },
              { id: "learn" as const, labelKey: "menu.learnTab", icon: BookOpen },
              { id: "practice" as const, labelKey: "menu.practiceTab", icon: ClipboardCheck },
              { id: "tools" as const, labelKey: "menu.toolsTab", icon: Wrench },
            ].map(({ id, labelKey, icon: Icon }) => (
              <button
                key={id}
                type="button"
                aria-current={activeTab === id ? "page" : undefined}
                onClick={() => setActiveTab(id)}
                className={`menu-sidebar-link menu-focusable${activeTab === id ? " is-active" : ""}`}
              >
                <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
                <span>{t(labelKey)}</span>
              </button>
            ))}
          </nav>

          <div className="menu-sidebar-divider" />

          <nav className="menu-sidebar-info" aria-label={t("menu.sections.more")}>
            {MENU_ITEMS.filter((item) => item.group === "more").map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleOpenItem(item)}
                  aria-label={t(`menuItems.${item.key}.label`)}
                  className="menu-sidebar-link menu-focusable"
                >
                  <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                  <span>{t(`menu.${item.key}`)}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="menu-desktop-main">
          <header className="menu-desktop-header">
            <div className="menu-search-box">
              <Search aria-hidden="true" className="menu-search-icon" />
              <label htmlFor="desktop-menu-search" className="sr-only">{t("menu.searchAriaLabel")}</label>
              <input
                id="desktop-menu-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t("menu.searchPlaceholder")}
                className="menu-search-field menu-search-input menu-focusable"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label={t("menu.clearSearch")}
                  onClick={() => setSearchQuery("")}
                  className="menu-search-clear menu-focusable"
                >
                  <X aria-hidden="true" className="h-4 w-4" />
                </button>
              )}
            </div>
            <MenuHeaderControls />
          </header>

          {renderRecentItems()}

          <div className={`menu-desktop-content${normalizedQuery ? " menu-desktop-search-content" : ""}`}>
            {normalizedQuery
              ? renderSearchResults(true)
              : activeTab === "home"
                ? renderDesktopHome()
                : renderCategoryView(activeTab === "more" ? "more" : activeTab)}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MenuPage;
