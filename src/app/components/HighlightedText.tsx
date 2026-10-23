import { type ElementType, Fragment } from "react";

interface HighlightedTextProps {
  text: string;
  tag: string;
  className?: string;
  color?: string;
}

// Renders CMS text, wrapping `[word]` in a highlight span. Built from React
// elements (not innerHTML) so CMS content is always escaped.
export default function HighlightedText({
  text,
  tag,
  className,
  color,
}: HighlightedTextProps) {
  const Tag = tag as ElementType;

  return (
    <div>
      <Tag className={className ?? ""}>
        {text.split(" ").map((word, index) =>
          word.includes("[") ? (
            // biome-ignore lint/suspicious/noArrayIndexKey: words can repeat and never reorder
            <Fragment key={index}>
              <span className={color ?? ""}>
                {word.replace("[", "").replace("]", "")}
              </span>{" "}
            </Fragment>
          ) : (
            `${word} `
          ),
        )}
      </Tag>
    </div>
  );
}
