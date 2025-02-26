"use client";
import ErrorPage from "./components/Error"; // Error components must be Client components

export default function RootErrorBoundary() {
  return <ErrorPage />;
}
