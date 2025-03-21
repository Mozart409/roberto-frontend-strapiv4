"use client";

import Form from "next/form";
import { createEmail } from "../email/actions";
import toast from "react-hot-toast";
import { renderButtonStyle } from "../utils/render-button-style";

export const runtime = "edge";

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

export function NextEmailForm({ data }: { data: EmailProps }) {
  return (
    <>
      <section className="py-6 mx-auto w-full max-w-4xl dark:text-gray-50 dark:bg-black">
        <div className="container flex flex-col justify-center p-4 mx-auto space-y-8 md:p-10 lg:flex-row lg:justify-between lg:space-y-0 lg:space-x-12">
          <div className="flex flex-col space-y-4 text-center lg:text-left">
            <h1 className="text-5xl font-bold leading-none">{data.title}</h1>
            <p className="text-lg">{data.description}</p>
          </div>
        </div>

        <Form action={createEmail}>
          <div className="mt-2">
            <input
              className="block py-1.5 w-full text-gray-900 rounded-md border-0 ring-1 ring-inset ring-gray-300 shadow-sm sm:text-sm sm:leading-6 focus:ring-2 focus:ring-inset placeholder:text-gray-400 focus:ring-primary-600"
              type="text"
              placeholder="Name"
              required={true}
            />
          </div>
          <div className="mt-2">
            <input
              className="block py-1.5 w-full text-gray-900 rounded-md border-0 ring-1 ring-inset ring-gray-300 shadow-sm sm:text-sm sm:leading-6 focus:ring-2 focus:ring-inset placeholder:text-gray-400 focus:ring-primary-600"
              type="email"
              placeholder="name@example.com"
              required={true}
            />
          </div>
          <div className="mt-2">
            <input
              className="block py-1.5 w-full text-gray-900 rounded-md border-0 ring-1 ring-inset ring-gray-300 shadow-sm sm:text-sm sm:leading-6 focus:ring-2 focus:ring-inset placeholder:text-gray-400 focus:ring-primary-600"
              placeholder="0049 12345678"
              type="tel"
            />
          </div>

          <div className="mt-2">
            <input
              className="block py-1.5 w-full text-gray-900 rounded-md border-0 ring-1 ring-inset ring-gray-300 shadow-sm sm:text-sm sm:leading-6 focus:ring-2 focus:ring-inset placeholder:text-gray-400 focus:ring-primary-600"
              placeholder="Betreff"
              required={true}
            />
          </div>

          <div className="mt-2">
            <textarea
              className="block py-1.5 w-full text-gray-900 rounded-md border-0 ring-1 ring-inset ring-gray-300 shadow-sm sm:text-sm sm:leading-6 focus:ring-2 focus:ring-inset placeholder:text-gray-400 focus:ring-primary-600"
              required={true}
              rows={12}
            />
          </div>

          <button
            // disabled={pending}
            type="submit"
            className={renderButtonStyle("secondary")}
          >
            {data.submitButton.text}
          </button>
        </Form>
      </section>
    </>
  );
}
