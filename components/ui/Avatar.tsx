import Image from "next/image";

type Props = {
  src?: string | null;
  alt?: string;
  size?: number; // px
  className?: string;
};

export default function Avatar({
  src,
  alt = "avatar",
  size = 40,
  className = "",
}: Props) {
  return (
    <Image
      src={src || "/Images/avatar1.png"}
      alt={alt}
      width={size}
      height={size}
      className={`shrink-0 rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
}