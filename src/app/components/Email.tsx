import { SendEmailForm } from "./SendEmailForm";

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

export default function Email({ data }: { data: EmailProps }) {
  return (
    <section className="py-6 mx-auto w-full max-w-4xl dark:text-gray-50 dark:bg-black">
      <div className="container flex flex-col justify-center p-4 mx-auto space-y-8 md:p-10 lg:flex-row lg:justify-between lg:space-y-0 lg:space-x-12">
        <div className="flex flex-col space-y-4 text-center lg:text-left">
          <h1 className="text-5xl font-bold leading-none">{data.title}</h1>
          <p className="text-lg">{data.description}</p>
        </div>
      </div>
      <SendEmailForm
        placeholder={data.emailPlaceholder}
        text={data.submitButton.text}
      />
    </section>
  );
}
