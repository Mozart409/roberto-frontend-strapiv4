"use client"; // Error components must be Client Components

import { renderButtonStyle } from "../utils/render-button-style";

export default function ErrorComponent({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto">
      <h2 className="text-3xl font-bold">Something went wrong!</h2>
      <p className="font-mono font-semibold text-red-500">{`${error}`}</p>
      <button
        className={renderButtonStyle("primary")}
        type="button"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
