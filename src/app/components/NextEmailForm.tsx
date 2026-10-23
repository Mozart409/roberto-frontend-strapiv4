"use client";

import Form from "next/form";
import Script from "next/script";
import { useActionState, useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { createEmail } from "../email/actions";
import { renderButtonStyle } from "../utils/render-button-style";

interface EmailProps {
  id: string;
  __component: string;
  title: string;
  description: string;
  emailPlaceholder: string;
  submitButton: {
    text: string;
  };
}

const initialState = {
  message: "",
  type: "",
};

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: { sitekey: string }) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export function NextEmailForm({ data }: { data: EmailProps }) {
  const [state, formAction, pending] = useActionState(
    createEmail,
    initialState,
  );
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  // Explicit rendering so the widget also appears after client-side navigation.
  const renderTurnstile = useCallback(() => {
    if (!window.turnstile || !turnstileRef.current || widgetId.current) return;
    widgetId.current = window.turnstile.render(turnstileRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
    });
  }, []);

  useEffect(() => {
    renderTurnstile();
    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [renderTurnstile]);

  useEffect(() => {
    if (state.type === "success") toast.success(state.message);
    if (state.type === "error") toast.error(state.message);
    // Turnstile tokens are single-use; get a fresh one for the next submit.
    if (state.type && widgetId.current) {
      window.turnstile?.reset(widgetId.current);
    }
  }, [state]);

  return (
    <>
      <section className="py-6 mx-auto w-full max-w-4xl dark:text-gray-50 dark:bg-black">
        <div className="container flex flex-col justify-center p-4 mx-auto space-y-8 md:p-10 lg:flex-row lg:justify-between lg:space-y-0 lg:space-x-12">
          <div className="flex flex-col space-y-4 text-center lg:text-left">
            <h1 className="text-5xl font-bold leading-none">{data.title}</h1>
            <p className="text-lg">{data.description}</p>
          </div>
        </div>

        <Form action={formAction}>
          <div className="mt-2">
            <input
              className="block py-1.5 w-full text-gray-900 rounded-md border-0 ring-1 ring-inset ring-gray-300 shadow-sm sm:text-sm sm:leading-6 focus:ring-2 focus:ring-inset placeholder:text-gray-400 focus:ring-primary-600"
              type="text"
              placeholder="Name"
              id="username"
              name="username"
              required={true}
            />
          </div>
          <div className="mt-2">
            <input
              className="block py-1.5 w-full text-gray-900 rounded-md border-0 ring-1 ring-inset ring-gray-300 shadow-sm sm:text-sm sm:leading-6 focus:ring-2 focus:ring-inset placeholder:text-gray-400 focus:ring-primary-600"
              type="email"
              placeholder="name@example.com"
              id="email"
              name="email"
              required={true}
            />
          </div>
          <div className="mt-2">
            <input
              className="block py-1.5 w-full text-gray-900 rounded-md border-0 ring-1 ring-inset ring-gray-300 shadow-sm sm:text-sm sm:leading-6 focus:ring-2 focus:ring-inset placeholder:text-gray-400 focus:ring-primary-600"
              placeholder="0049 12345678"
              id="phonenumber"
              name="phonenumber"
              type="tel"
            />
          </div>

          <div className="mt-2">
            <input
              className="block py-1.5 w-full text-gray-900 rounded-md border-0 ring-1 ring-inset ring-gray-300 shadow-sm sm:text-sm sm:leading-6 focus:ring-2 focus:ring-inset placeholder:text-gray-400 focus:ring-primary-600"
              placeholder="Betreff"
              id="subject"
              name="subject"
              required={true}
            />
          </div>

          <div className="mt-2">
            <textarea
              className="block py-1.5 w-full text-gray-900 rounded-md border-0 ring-1 ring-inset ring-gray-300 shadow-sm sm:text-sm sm:leading-6 focus:ring-2 focus:ring-inset placeholder:text-gray-400 focus:ring-primary-600"
              required={true}
              id="message"
              name="message"
              placeholder="Nachricht"
              rows={12}
            />
          </div>

          <div className="mt-2" ref={turnstileRef} />

          <button
            disabled={pending}
            type="submit"
            className={renderButtonStyle("secondary")}
          >
            {data.submitButton.text}
          </button>
        </Form>
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          onReady={renderTurnstile}
        />
      </section>
    </>
  );
}
