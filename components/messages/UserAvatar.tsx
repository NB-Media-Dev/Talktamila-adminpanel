import { getInitials } from "@/lib/avatar";

type AvatarUser = {
  username: string;
  full_name?: string | null;
  avatar_url?: string | null;
};

export default function UserAvatar({
  user,
  size = 40,
  className = "",
}: {
  user: AvatarUser;
  size?: number;
  className?: string;
}) {
  const initials = getInitials({ name: user.full_name ?? undefined, username: user.username });
  return (
    <div
      style={{ width: size, height: size, fontSize: Math.max(11, Math.round(size * 0.38)) }}
      className={`rounded-full overflow-hidden bg-orange-100 ring-2 ring-orange-200/70 flex items-center justify-center shrink-0 font-bold text-[#FF6B35] ${className}`}
    >
      {user.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.avatar_url} alt={user.full_name || user.username} className="w-full h-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}