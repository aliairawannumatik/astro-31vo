const GUIDE_SEEN_STORAGE_KEY = "numatik_guide_seen";

export function hasSeenGuide(): boolean {
  try {
    return localStorage.getItem(GUIDE_SEEN_STORAGE_KEY) !== null;
  } catch (error) {
    console.warn("Unable to read guide visit status.", error);
    return false;
  }
}

export function markGuideSeen(): void {
  try {
    localStorage.setItem(GUIDE_SEEN_STORAGE_KEY, "true");
  } catch (error) {
    console.warn("Unable to save guide visit status.", error);
  }
}
