import { marked } from "marked";

interface MarkDownProps {
  text: string;
}

export default function MarkdownRenderer({ text }: MarkDownProps) {
  return (
    <>
      <div className="prose prose-lg prose-headings:underline prose-a:text-primary-600 md:prose-lg lg:prose-2xl">
        {marked.parse(text)}
      </div>
    </>
  );
}
