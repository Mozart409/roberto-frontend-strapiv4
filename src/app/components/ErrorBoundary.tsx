"use client";

import { useEffect } from "react";
import ErrorState from "./ErrorState";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      title="Etwas ist schiefgelaufen"
      description="Diese Seite konnte gerade nicht geladen werden. Bitte versuchen Sie es in einem Moment erneut."
      code={error.digest ? `Fehler ${error.digest}` : undefined}
      action={
        <button
          type="button"
          onClick={() => reset()}
          className="py-2.5 px-5 text-sm font-semibold text-gray-900 bg-yellow-600 rounded-md hover:bg-yellow-700"
        >
          Erneut versuchen
        </button>
      }
    />
  );
}
