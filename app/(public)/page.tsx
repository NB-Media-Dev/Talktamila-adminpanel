;
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

export default function Page() {
  return (
    <div className="p-6">
      <Link
        href="/admin"
    className={buttonVariants({variant:"default"})}
      >
        Go to admin page
      </Link>
    </div>
  );
}
