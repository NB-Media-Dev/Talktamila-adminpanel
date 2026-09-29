import type { useRouter } from "next/navigation";

type Router = ReturnType<typeof useRouter>;

/**
 * Real "back" (like Instagram): pops ONE history entry.
 * If the page was opened directly (no history), goes to `fallback` using
 * replace so no extra entry is added.
 */
export function goBack(router: Router, fallback: string) {
  if (typeof window !== "undefined" && window.history.length > 1) {
    router.back();
  } else {
    router.replace(fallback);
  }
}
