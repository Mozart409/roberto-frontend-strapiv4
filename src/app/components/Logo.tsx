import Image from "next/image";
import Link from "next/link";

export default function Logo({
  src,
  children,
}: {
  src: string | null;
  children?: React.ReactNode;
}) {
  return (
    <Link
      href="/"
      aria-label="Back to homepage"
      className="flex items-center p-2"
    >
      {src && (
        <Image
          src={src}
          alt="logo"
          // Intrinsic size only drives the srcset; CSS caps the rendered
          // height to the navbar and keeps the aspect ratio.
          width={240}
          height={120}
          preload
          style={{
            width: "auto",
            height: "3.5rem",
          }}
        />
      )}
      <div className="ml-2">{children}</div>
    </Link>
  );
}
