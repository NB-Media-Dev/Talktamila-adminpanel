"use client";

import { useParams } from "next/navigation";
import PublicProfileView from "@/components/profile/PublicProfileView";

export default function Page() {
  const params = useParams<{ username: string }>();
  const raw = Array.isArray(params.username) ? params.username[0] : params.username;
  const username = decodeURIComponent(raw ?? "");
  return <PublicProfileView key={username} username={username} />;
}
