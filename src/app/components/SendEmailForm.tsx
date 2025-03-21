"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { type EmailSchema, sendResendEmail } from "../actions";
import { renderButtonStyle } from "../utils/render-button-style";

export function SendEmailForm({
  placeholder,
  text,
}: {
  placeholder: string;
  text: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailSchema>();

  const onSubmit = async (data: EmailSchema) => {
    try {
      console.log(data);
      const email = await sendResendEmail(data);
      if (email.type === "error") {
        toast.error(`${email.message}`);
      } else {
        toast.success(`${email.message}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(`Email not sent ${error}`);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} encType={"application/json"}>
        <div className="space-y-12 max-w-5xl">
          <div className="pb-12 space-y-4 w-full border-b border-gray-900/10">
            <div>
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Ihr Name"
                  className="block py-1.5 w-full text-gray-900 rounded-md border-0 ring-1 ring-inset ring-gray-300 shadow-sm sm:text-sm sm:leading-6 focus:ring-2 focus:ring-inset placeholder:text-gray-400 focus:ring-primary-600"
                  {...register("username", {})}
                />
              </div>
            </div>
            <div>
              <div className="mt-2">
                <input
                  className="block py-1.5 w-full text-gray-900 rounded-md border-0 ring-1 ring-inset ring-gray-300 shadow-sm sm:text-sm sm:leading-6 focus:ring-2 focus:ring-inset placeholder:text-gray-400 focus:ring-primary-600"
                  type="email"
                  placeholder="name@example.com"
                  {...register("email", { required: true })}
                />
              </div>
              {errors.email?.type === "required" && (
                <div role="alert" className="mt-2 text-sm text-red-600">
                  Not a valid email address.
                </div>
              )}
            </div>

            <div>
              <div className="mt-2">
                <input
                  className="block py-1.5 w-full text-gray-900 rounded-md border-0 ring-1 ring-inset ring-gray-300 shadow-sm sm:text-sm sm:leading-6 focus:ring-2 focus:ring-inset placeholder:text-gray-400 focus:ring-primary-600"
                  placeholder="0049 12345678"
                  type="tel"
                  {...register("phonenumber", { required: false })}
                />
              </div>
            </div>

            <div>
              <div className="mt-2">
                <input
                  className="block py-1.5 w-full text-gray-900 rounded-md border-0 ring-1 ring-inset ring-gray-300 shadow-sm sm:text-sm sm:leading-6 focus:ring-2 focus:ring-inset placeholder:text-gray-400 focus:ring-primary-600"
                  placeholder="Betreff"
                  {...register("subject", { required: true, min: 1 })}
                />
              </div>
              {errors.subject?.type === "required" && (
                <div role="alert" className="mt-2 text-sm text-red-600">
                  Not a valid subject.
                </div>
              )}
            </div>

            <div>
              <div className="mt-2">
                <textarea
                  className="block py-1.5 w-full text-gray-900 rounded-md border-0 ring-1 ring-inset ring-gray-300 shadow-sm sm:text-sm sm:leading-6 focus:ring-2 focus:ring-inset placeholder:text-gray-400 focus:ring-primary-600"
                  {...register("message", { required: true })}
                  rows={12}
                />
              </div>
              {errors.message?.type === "required" && (
                <div role="alert" className="mt-2 text-sm text-red-600">
                  Not a valid message.
                </div>
              )}
            </div>

            <button
              // disabled={pending}
              type="submit"
              className={renderButtonStyle("secondary")}
            >
              {text}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
