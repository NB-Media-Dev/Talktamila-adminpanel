import type { useRouter } from "next/navigation";

type Router = ReturnType<typeof useRouter>;

export function goBack(router: Router, fallback: string) {
  if (typeof window !== "undefined" && window.history.length > 1) {
    router.back();
  } else {
    router.replace(fallback);
  }
}
