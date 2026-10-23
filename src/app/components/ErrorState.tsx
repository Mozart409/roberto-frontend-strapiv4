import Link from "next/link";
import type { ReactNode } from "react";
import { FiAlertTriangle } from "react-icons/fi";

interface ErrorStateProps {
  title: string;
  description: string;
  code?: string;
  action?: ReactNode;
}

export default function ErrorState({
  title,
  description,
  code,
  action,
}: ErrorStateProps) {
  return (
    <section className="flex flex-1 justify-center items-center py-24 px-6">
      <div className="w-full max-w-lg text-center">
        <div className="flex justify-center items-center mx-auto mb-6 w-14 h-14 bg-yellow-100 rounded-full dark:bg-yellow-900/40">
          <FiAlertTriangle
            className="w-7 h-7 text-yellow-600 dark:text-yellow-400"
            aria-hidden="true"
          />
        </div>
        {code ? (
          <p className="mb-2 text-sm font-semibold tracking-widest text-yellow-600 uppercase dark:text-yellow-400">
            {code}
          </p>
        ) : null}
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-50">
          {title}
        </h1>
        <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
          {description}
        </p>
        <div className="flex flex-wrap gap-3 justify-center items-center mt-8">
          {action}
          <Link
            href="/"
            className="py-2.5 px-5 text-sm font-semibold text-gray-900 rounded-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:text-gray-100 dark:ring-gray-700 dark:hover:bg-gray-900"
          >
            Zur Startseite
          </Link>
        </div>
      </div>
    </section>
  );
}
