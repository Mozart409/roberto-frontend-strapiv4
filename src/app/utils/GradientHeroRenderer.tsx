import Markdown from "marked-react";


interface MarkDownProps {
  text: string;
}

export default function GradientHeroRenderer({ text }: MarkDownProps) {
  return (
    <>
      <div className="mx-auto prose prose-lg prose-headings:underline prose-a:text-primary-600 md:prose-lg lg:prose-2xl">
        <Markdown>{text}</Markdown>
      </div>
    </>
  );
}
